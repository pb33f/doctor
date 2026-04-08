// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreatePrintingPress_PrintHTMLAndLLM(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:     "Burger Shop",
		BaseURL:   "/docs/",
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	htmlStats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, htmlStats)
	assert.NotEmpty(t, htmlStats.JobID)
	assert.Equal(t, jobTypeHTML, htmlStats.JobType)
	assert.Greater(t, htmlStats.Pages, 0)
	assert.Greater(t, htmlStats.FilesWritten, 0)
	assert.Greater(t, htmlStats.BytesWritten, int64(0))
	assert.FileExists(t, filepath.Join(outputDir, "index.html"))

	llmStats, err := pp.PrintLLM()
	require.NoError(t, err)
	require.NotNil(t, llmStats)
	assert.Equal(t, jobTypeLLM, llmStats.JobType)
	assert.Greater(t, llmStats.Pages, 0)
	assert.FileExists(t, filepath.Join(outputDir, "llms.txt"))
}

func TestCreatePrintingPress_DefaultOutputDir(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	tempWD := t.TempDir()
	originalWD, err := os.Getwd()
	require.NoError(t, err)
	require.NoError(t, os.Chdir(tempWD))
	defer func() {
		_ = os.Chdir(originalWD)
	}()

	pp, err := CreatePrintingPressFromBytes(specBytes, nil)
	require.NoError(t, err)

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, stats)
	assert.FileExists(t, filepath.Join(tempWD, "api-docs", "index.html"))
}

func TestCreatePrintingPressFromV3Model_Validation(t *testing.T) {
	_, err := CreatePrintingPressFromV3Model(nil, &PrintingPressConfig{})
	require.Error(t, err)
	assert.ErrorAs(t, err, new(*ValidationError))
	assert.ErrorIs(t, err, ErrNoSourceInput)
}

func TestCreatePrintingPress_ActivityStreamLatestSnapshot(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/stripe.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	errCh := make(chan error, 1)
	go func() {
		_, err := pp.PrintHTML()
		errCh <- err
	}()

	stream := pp.ActivityStream()
	require.NotNil(t, stream)

	var update ActivityUpdate
	require.Eventually(t, func() bool {
		select {
		case next, ok := <-stream.Updates():
			if !ok {
				return false
			}
			update = next
			return true
		default:
			return false
		}
	}, time.Second, 10*time.Millisecond)

	assert.NotEmpty(t, update.JobID)
	assert.Equal(t, jobTypeHTML, update.JobType)
	assert.NotEmpty(t, update.CurrentTask)
	require.NoError(t, <-errCh)
}

func TestCreatePrintingPress_PressModelFromDrModel(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)
	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	drDoc := model.NewDrDocument(v3Model)

	pp, err := CreatePrintingPressFromDrModel(drDoc, nil)
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.True(t, pp.modelBuilt)
	require.NotNil(t, site)
	require.NotNil(t, site.Root)
	require.Same(t, site, pp.site)
}

func TestCreatePrintingPress_SpecBytesUseConfiguredBasePath(t *testing.T) {
	specPath := filepath.Join("..", "test_specs", "test-relative", "spec.yaml")
	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:  filepath.Dir(specPath),
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	require.NotEmpty(t, site.Operations)
	require.NotEmpty(t, site.Models["schemas"])

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotNil(t, stats)
	assert.FileExists(t, filepath.Join(outputDir, "index.html"))
}

func TestCreatePrintingPress_BundlingFallbackWarningExposed(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	originalBundle := bundleBytesWithOrigins
	bundleBytesWithOrigins = func(specBytes []byte, configuration *datamodel.DocumentConfiguration, compositionConfig *bundler.BundleCompositionConfig) (*bundler.BundleResult, error) {
		return nil, errors.New("forced bundle failure")
	}
	defer func() {
		bundleBytesWithOrigins = originalBundle
	}()

	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotEmpty(t, site.Warnings)
	assert.Contains(t, site.Warnings[0].Message, "source bundling failed")
	require.Error(t, site.Warnings[0].Err)

	stats, err := pp.PrintHTML()
	require.NoError(t, err)
	require.NotEmpty(t, stats.Warnings)
	assert.Contains(t, stats.Warnings[0].Message, "source bundling failed")
	require.Error(t, stats.Warnings[0].Err)
}

func TestCreatePrintingPress_PressModelMutationsAffectLaterPrints(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site.Root)

	site.Root.Title = "Mutated Burger Shop"

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	indexHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.True(t, strings.Contains(string(indexHTML), "Mutated Burger Shop"))
}

func TestCreatePrintingPressFromV3Model(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)
	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	pp, err := CreatePrintingPressFromV3Model(v3Model, &PrintingPressConfig{
		OutputDir: t.TempDir(),
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.True(t, pp.modelBuilt)
	require.NotNil(t, site)
	require.NotNil(t, site.Root)
	require.Same(t, site, pp.site)
}

func TestCreatePrintingPress_ValidationAggregatesIssues(t *testing.T) {
	_, err := CreatePrintingPressFromBytes(nil, &PrintingPressConfig{
		BasePath: "/definitely/not/a/real/path",
	})
	require.Error(t, err)

	var validationErr *ValidationError
	require.ErrorAs(t, err, &validationErr)
	assert.Len(t, validationErr.Issues, 2)
	assert.ErrorIs(t, err, ErrNoSourceInput)
	assert.ErrorIs(t, err, ErrInvalidBasePath)
}

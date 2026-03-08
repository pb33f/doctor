// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"os"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPrintingPress_BurgerShop(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	pp := New(&PrintingPressConfig{
		DrDoc: drDoc,
		Title: "Burger Shop API",
	})

	site, err := pp.Press()
	require.NoError(t, err)
	require.NotNil(t, site)

	// Root page
	assert.NotNil(t, site.Root)
	assert.Equal(t, "Burger Shop API", site.Root.Title)
	assert.NotEmpty(t, site.Root.Version)

	// Operations collected
	assert.NotEmpty(t, site.Operations, "should have collected operations")

	// Check slug uniqueness among operations
	slugs := make(map[string]bool)
	for _, op := range site.Operations {
		assert.NotEmpty(t, op.Slug)
		assert.False(t, slugs[op.Slug], "duplicate operation slug: %s", op.Slug)
		slugs[op.Slug] = true
		assert.NotEmpty(t, op.Method)
		assert.NotEmpty(t, op.Path)
	}

	// Models collected
	if len(site.Models) > 0 {
		for typeSlug, pages := range site.Models {
			modelSlugs := make(map[string]bool)
			for _, page := range pages {
				assert.NotEmpty(t, page.Slug)
				assert.NotEmpty(t, page.Name)
				assert.Equal(t, typeSlug, page.TypeSlug)
				assert.False(t, modelSlugs[page.Slug], "duplicate model slug in %s: %s", typeSlug, page.Slug)
				modelSlugs[page.Slug] = true
			}
		}
	}
}

func TestPrintingPress_PetStoreV3(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/petstorev3.json")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	pp := New(&PrintingPressConfig{
		DrDoc: drDoc,
	})

	site, err := pp.Press()
	require.NoError(t, err)
	require.NotNil(t, site)

	assert.NotNil(t, site.Root)
	assert.NotEmpty(t, site.Operations)

	// Check schemas were collected
	schemas := site.Models["schemas"]
	assert.NotEmpty(t, schemas, "petstore should have schemas")

	// Each schema should have JSON representation
	for _, s := range schemas {
		assert.NotEmpty(t, s.SchemaJSON, "schema %s should have JSON", s.Name)
	}
}

func TestPrintingPress_WriteSite(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := New(&PrintingPressConfig{DrDoc: drDoc})
	site, err := pp.Press()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = WriteSite(site, outputDir)
	require.NoError(t, err)

	// Verify file structure
	assert.FileExists(t, outputDir+"/index.json")
	assert.FileExists(t, outputDir+"/nav.json")
	assert.FileExists(t, outputDir+"/manifest.json")

	// Verify operation files exist
	for _, op := range site.Operations {
		assert.FileExists(t, outputDir+"/operations/"+op.Slug+".json")
	}

	// Verify model files exist
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			assert.FileExists(t, outputDir+"/models/"+typeSlug+"/"+page.Slug+".json")
		}
	}
}

func TestPrintingPress_WriteHTMLSite(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)

	drDoc := model.NewDrDocument(v3Model)

	pp := New(&PrintingPressConfig{DrDoc: drDoc, Title: "Burger Shop"})
	site, err := pp.Press()
	require.NoError(t, err)

	outputDir := t.TempDir()
	err = WriteHTMLSite(site, outputDir, "")
	require.NoError(t, err)

	// Verify HTML files exist
	assert.FileExists(t, outputDir+"/index.html")
	assert.FileExists(t, outputDir+"/models/index.html")
	assert.FileExists(t, outputDir+"/static/printing-press.css")
	assert.FileExists(t, outputDir+"/static/printing-press.js")

	// Verify HTML content
	indexHTML, err := os.ReadFile(outputDir + "/index.html")
	require.NoError(t, err)
	assert.Contains(t, string(indexHTML), "<!doctype html>")
	assert.Contains(t, string(indexHTML), "Burger Shop")
	assert.Contains(t, string(indexHTML), "pp-layout")

	for _, op := range site.Operations {
		assert.FileExists(t, outputDir+"/operations/"+op.Slug+".html")
	}
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			assert.FileExists(t, outputDir+"/models/"+typeSlug+"/"+page.Slug+".html")
		}
	}
}

func TestPrintingPress_NoV3Document(t *testing.T) {
	drDoc := &model.DrDocument{}
	pp := New(&PrintingPressConfig{DrDoc: drDoc})
	_, err := pp.Press()
	assert.ErrorIs(t, err, ErrNoV3Document)
}

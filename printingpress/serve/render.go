// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package serve

import (
	"fmt"
	"os"
	"path/filepath"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// ArchiveVariantDirs contains the portable render directories served by the
// local archive export endpoint.
type ArchiveVariantDirs struct {
	Root           string
	Plain          string
	Diagnostics    string
	LLM            string
	DiagnosticsLLM string
}

// Cleanup removes all rendered archive variants.
func (d *ArchiveVariantDirs) Cleanup() {
	if d != nil && d.Root != "" {
		_ = os.RemoveAll(d.Root)
	}
}

// ArchiveRenderOptions controls portable archive variant rendering for the
// local preview server.
type ArchiveRenderOptions struct {
	Title                              string
	BasePath                           string
	SpecPath                           string
	SpecURL                            string
	SpecBytes                          []byte
	LintResults                        []*v3.RuleFunctionResult
	Footer                             *ppmodel.FooterConfig
	MaxPatternRepeatBudget             int
	MaxGeneratedStringBytes            int
	MaxGeneratedMockBytes              int
	MaxMockDepth                       int
	MaxMockNodes                       int
	MaxMockProperties                  int
	MaxMockRefExpansions               int
	MaxMockBytes                       int
	LLMAggregateSpecSizeThresholdBytes int64
	LLMMaxAggregateFileBytes           int64
	LLMGenerateMonoliths               string
	IncludeLLM                         bool
	NoHTML                             bool
}

// RenderArchiveVariants renders portable docs variants for local archive export.
func RenderArchiveVariants(opts ArchiveRenderOptions) (*ArchiveVariantDirs, error) {
	if opts.NoHTML {
		return nil, nil
	}

	root, err := os.MkdirTemp("", "printing-press-serve-archive-*")
	if err != nil {
		return nil, fmt.Errorf("create archive render directory: %w", err)
	}
	success := false
	defer func() {
		if !success {
			_ = os.RemoveAll(root)
		}
	}()

	plainDir := filepath.Join(root, "docs")
	if err := renderArchiveVariant(opts, plainDir, false, nil, false); err != nil {
		return nil, err
	}

	diagnosticsDir := ""
	if len(opts.LintResults) > 0 {
		diagnosticsDir = filepath.Join(root, "docs-diagnostics")
		if err := renderArchiveVariant(opts, diagnosticsDir, true, opts.LintResults, false); err != nil {
			return nil, err
		}
	}

	llmDir := ""
	diagnosticsLLMDir := ""
	if opts.IncludeLLM {
		llmDir = filepath.Join(root, "docs-llm")
		if err := renderArchiveVariant(opts, llmDir, false, nil, true); err != nil {
			return nil, err
		}
		if len(opts.LintResults) > 0 {
			diagnosticsLLMDir = filepath.Join(root, "docs-diagnostics-llm")
			if err := renderArchiveVariant(opts, diagnosticsLLMDir, true, opts.LintResults, true); err != nil {
				return nil, err
			}
		}
	}

	success = true
	return &ArchiveVariantDirs{
		Root:           root,
		Plain:          plainDir,
		Diagnostics:    diagnosticsDir,
		LLM:            llmDir,
		DiagnosticsLLM: diagnosticsLLMDir,
	}, nil
}

func renderArchiveVariant(opts ArchiveRenderOptions, outputDir string, developerMode bool, lintResults []*v3.RuleFunctionResult, includeLLM bool) error {
	pp, err := printingpress.CreatePrintingPressFromBytes(opts.SpecBytes, &printingpress.PrintingPressConfig{
		Title:                              opts.Title,
		BasePath:                           opts.BasePath,
		SpecPath:                           opts.SpecPath,
		SpecURL:                            opts.SpecURL,
		OutputDir:                          outputDir,
		AssetMode:                          printingpress.HTMLAssetModePortable,
		DeveloperMode:                      developerMode,
		LintResults:                        lintResults,
		Footer:                             opts.Footer,
		MaxPatternRepeatBudget:             opts.MaxPatternRepeatBudget,
		MaxGeneratedStringBytes:            opts.MaxGeneratedStringBytes,
		MaxGeneratedMockBytes:              opts.MaxGeneratedMockBytes,
		MaxMockDepth:                       opts.MaxMockDepth,
		MaxMockNodes:                       opts.MaxMockNodes,
		MaxMockProperties:                  opts.MaxMockProperties,
		MaxMockRefExpansions:               opts.MaxMockRefExpansions,
		MaxMockBytes:                       opts.MaxMockBytes,
		LLMAggregateSpecSizeThresholdBytes: opts.LLMAggregateSpecSizeThresholdBytes,
		LLMMaxAggregateFileBytes:           opts.LLMMaxAggregateFileBytes,
		LLMGenerateMonoliths:               opts.LLMGenerateMonoliths,
	})
	if err != nil {
		return fmt.Errorf("create archive printing press: %w", err)
	}
	if _, err := pp.PrintHTML(); err != nil {
		return fmt.Errorf("render archive html: %w", err)
	}
	if includeLLM {
		if _, err := pp.PrintLLM(); err != nil {
			return fmt.Errorf("render archive llm: %w", err)
		}
	}
	return nil
}

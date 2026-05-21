// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// PrintJSONArtifacts writes the rendered site model to disk as JSON artifacts.
//
// The preferred public entrypoint is bundle.json, which contains the bundled
// machine-readable site summary and references to the per-page detail files.
//
// When outputDir is empty, PrintJSONArtifacts uses site.OutputDir. A nil site
// returns ErrNilSite.
func PrintJSONArtifacts(site *ppmodel.Site, outputDir string) error {
	if site == nil {
		return ErrNilSite
	}

	resolvedOutputDir, err := resolveWriterOutputDir(site, outputDir)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(resolvedOutputDir, 0o755); err != nil {
		return fmt.Errorf("creating output directory: %w", err)
	}

	// Create shared subdirectories.
	for _, dir := range []string{pppaths.DirStatic} {
		if err := os.MkdirAll(filepath.Join(resolvedOutputDir, dir), 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	// Write top-level bundle entrypoint
	bundle := buildJSONBundle(site)
	if err := writeJSONFile(filepath.Join(resolvedOutputDir, pppaths.FileBundleJSON), bundle); err != nil {
		return fmt.Errorf("writing json bundle: %w", err)
	}

	// Write root page data
	if site.Root != nil {
		if err := writeJSONFile(filepath.Join(resolvedOutputDir, pppaths.FileIndexJSON), site.Root); err != nil {
			return fmt.Errorf("writing root page: %w", err)
		}
	}

	// Write operation pages
	for _, op := range site.Operations {
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OperationJSON(op.Slug)))
		if err := writeJSONFile(path, op); err != nil {
			return fmt.Errorf("writing operation %s: %w", op.Slug, err)
		}
	}

	// Write model pages
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.ModelJSON(typeSlug, page.Slug)))
			if err := writeJSONFile(path, page); err != nil {
				return fmt.Errorf("writing model %s/%s: %w", typeSlug, page.Slug, err)
			}
		}
	}

	// Write webhook pages
	for _, wh := range site.Webhooks {
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OperationJSON(wh.Slug)))
		if err := writeJSONFile(path, wh); err != nil {
			return fmt.Errorf("writing webhook %s: %w", wh.Slug, err)
		}
	}

	// Write nav data for the frontend
	if site.NavTags != nil {
		if err := writeJSONFile(filepath.Join(resolvedOutputDir, pppaths.FileNavJSON), site.NavTags); err != nil {
			return fmt.Errorf("writing nav data: %w", err)
		}
	}

	// Write JSON artifact manifest
	manifest := buildArtifactManifest(site)
	if err := writeJSONFile(filepath.Join(resolvedOutputDir, pppaths.FileManifestJSON), manifest); err != nil {
		return fmt.Errorf("writing manifest: %w", err)
	}

	return nil
}

func resolveWriterOutputDir(site *ppmodel.Site, outputDir string) (string, error) {
	if outputDir != "" {
		return outputDir, nil
	}
	if site != nil && site.OutputDir != "" {
		return site.OutputDir, nil
	}
	return "", ErrNoOutputDir
}

// writeJSONFile writes compact JSON artifacts because large catalogs emit many
// machine-read files, and whitespace materially increases write pressure.
func writeJSONFile(path string, data any) error {
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	return os.WriteFile(path, b, 0o644)
}

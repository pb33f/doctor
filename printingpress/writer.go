// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// WriteSite writes the rendered site model to disk as JSON artifacts.
//
// When outputDir is empty, WriteSite uses site.OutputDir. A nil site returns
// ErrNilSite.
func WriteSite(site *Site, outputDir string) error {
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

	// Create subdirectories
	dirs := append([]string{"operations"}, modelDirs()...)
	dirs = append(dirs, "static")
	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(resolvedOutputDir, dir), 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	// Write root page data
	if site.Root != nil {
		if err := writeJSONFile(filepath.Join(resolvedOutputDir, "index.json"), site.Root); err != nil {
			return fmt.Errorf("writing root page: %w", err)
		}
	}

	// Write operation pages
	for _, op := range site.Operations {
		path := filepath.Join(resolvedOutputDir, "operations", op.Slug+".json")
		if err := writeJSONFile(path, op); err != nil {
			return fmt.Errorf("writing operation %s: %w", op.Slug, err)
		}
	}

	// Write model pages
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			path := filepath.Join(resolvedOutputDir, "models", typeSlug, page.Slug+".json")
			if err := writeJSONFile(path, page); err != nil {
				return fmt.Errorf("writing model %s/%s: %w", typeSlug, page.Slug, err)
			}
		}
	}

	// Write webhook pages
	for _, wh := range site.Webhooks {
		path := filepath.Join(resolvedOutputDir, "operations", wh.Slug+".json")
		if err := writeJSONFile(path, wh); err != nil {
			return fmt.Errorf("writing webhook %s: %w", wh.Slug, err)
		}
	}

	// Write nav data for the frontend
	if site.NavTags != nil {
		if err := writeJSONFile(filepath.Join(resolvedOutputDir, "nav.json"), site.NavTags); err != nil {
			return fmt.Errorf("writing nav data: %w", err)
		}
	}

	// Write site manifest (listing all pages for link validation)
	manifest := buildManifest(site)
	if err := writeJSONFile(filepath.Join(resolvedOutputDir, "manifest.json"), manifest); err != nil {
		return fmt.Errorf("writing manifest: %w", err)
	}

	return nil
}

func resolveWriterOutputDir(site *Site, outputDir string) (string, error) {
	if outputDir != "" {
		return outputDir, nil
	}
	if site != nil && site.OutputDir != "" {
		return site.OutputDir, nil
	}
	return "", ErrNoOutputDir
}

// SiteManifest lists all generated pages for link validation.
type SiteManifest struct {
	Operations []ManifestEntry            `json:"operations"`
	Models     map[string][]ManifestEntry `json:"models"`
	Webhooks   []ManifestEntry            `json:"webhooks"`
}

// ManifestEntry is a single entry in the site manifest.
type ManifestEntry struct {
	Slug string `json:"slug"`
	Name string `json:"name"`
	Path string `json:"path"`
}

func buildManifest(site *Site) *SiteManifest {
	m := &SiteManifest{
		Models: make(map[string][]ManifestEntry),
	}
	for _, op := range site.Operations {
		m.Operations = append(m.Operations, ManifestEntry{
			Slug: op.Slug,
			Name: fmt.Sprintf("%s %s", op.Method, op.Path),
			Path: fmt.Sprintf("operations/%s.json", op.Slug),
		})
	}
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			m.Models[typeSlug] = append(m.Models[typeSlug], ManifestEntry{
				Slug: page.Slug,
				Name: page.Name,
				Path: fmt.Sprintf("models/%s/%s.json", typeSlug, page.Slug),
			})
		}
	}
	for _, wh := range site.Webhooks {
		m.Webhooks = append(m.Webhooks, ManifestEntry{
			Slug: wh.Slug,
			Name: fmt.Sprintf("%s %s", wh.Method, wh.Path),
			Path: fmt.Sprintf("operations/%s.json", wh.Slug),
		})
	}
	return m
}

func writeJSONFile(path string, data any) error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, b, 0o644)
}

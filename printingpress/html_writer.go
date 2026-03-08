// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"context"
	"embed"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/a-h/templ"
)

//go:embed static/*
//go:embed static/fonts/*
//go:embed static/shoelace/assets/icons/*
var staticFS embed.FS

// WriteHTMLSite writes the full static HTML site to disk.
func WriteHTMLSite(site *Site, outputDir, baseURL string) error {
	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		return fmt.Errorf("creating output directory: %w", err)
	}

	dirs := []string{
		"operations",
		"models/schemas",
		"models/responses",
		"models/parameters",
		"models/examples",
		"models/request-bodies",
		"models/headers",
		"models/security",
		"models/links",
		"models/callbacks",
		"models/path-items",
		"static",
		"static/fonts",
		"static/shoelace/assets/icons",
	}
	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(outputDir, dir), 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	if err := copyEmbeddedStatic(outputDir); err != nil {
		return fmt.Errorf("copying static assets: %w", err)
	}

	navJSON := MustJSON(site.NavTags)
	title := ""
	if site.Root != nil {
		title = site.Root.Title
	}

	// Write root page
	if site.Root != nil {
		rootContent := RootPageTempl(site.Root)
		if err := writeTemplPage(filepath.Join(outputDir, "index.html"), title, title, baseURL, navJSON, "", rootContent); err != nil {
			return fmt.Errorf("writing index.html: %w", err)
		}
	}

	// Write operation pages (1 level deep: operations/)
	for _, op := range site.Operations {
		opContent := OperationPageTempl(op)
		pageTitle := fmt.Sprintf("%s %s - %s", op.Method, op.Path, title)
		path := filepath.Join(outputDir, "operations", op.Slug+".html")
		if err := writeTemplPage(path, pageTitle, title, resolveBase(baseURL, 1), navJSON, op.Slug, opContent); err != nil {
			return fmt.Errorf("writing operation %s: %w", op.Slug, err)
		}
	}

	// Write model pages (2 levels deep: models/{type}/)
	for typeSlug, pages := range site.Models {
		for _, page := range pages {
			modelContent := ModelPageTempl(page)
			pageTitle := fmt.Sprintf("%s - %s", page.Name, title)
			path := filepath.Join(outputDir, "models", typeSlug, page.Slug+".html")
			if err := writeTemplPage(path, pageTitle, title, resolveBase(baseURL, 2), navJSON, "", modelContent); err != nil {
				return fmt.Errorf("writing model %s/%s: %w", typeSlug, page.Slug, err)
			}
		}
	}

	// Write models index page (1 level deep: models/)
	indexContent := ModelsIndexTempl(site.Models)
	if err := writeTemplPage(filepath.Join(outputDir, "models", "index.html"), "Models - "+title, title, resolveBase(baseURL, 1), navJSON, "", indexContent); err != nil {
		return fmt.Errorf("writing models index: %w", err)
	}

	// Write webhook pages (1 level deep: operations/)
	for _, wh := range site.Webhooks {
		whContent := OperationPageTempl(wh)
		pageTitle := fmt.Sprintf("Webhook: %s %s - %s", wh.Method, wh.Path, title)
		path := filepath.Join(outputDir, "operations", wh.Slug+".html")
		if err := writeTemplPage(path, pageTitle, title, resolveBase(baseURL, 1), navJSON, wh.Slug, whContent); err != nil {
			return fmt.Errorf("writing webhook %s: %w", wh.Slug, err)
		}
	}

	return nil
}

func writeTemplPage(path, pageTitle, siteTitle, baseURL, navJSON, activeSlug string, content templ.Component) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	layout := Layout(pageTitle, siteTitle, baseURL, navJSON, activeSlug, content)
	return layout.Render(context.Background(), f)
}

// resolveBase returns the base href for a page at the given directory depth.
// If a baseURL is explicitly set, it is used as-is. Otherwise, for file://
// compatibility, it computes the relative prefix (e.g. "../" for depth 1).
func resolveBase(baseURL string, depth int) string {
	if baseURL != "" {
		return baseURL
	}
	if depth <= 0 {
		return ""
	}
	return strings.Repeat("../", depth)
}

func copyEmbeddedStatic(outputDir string) error {
	return copyEmbeddedDir("static", filepath.Join(outputDir, "static"))
}

func copyEmbeddedDir(embedPath, destDir string) error {
	entries, err := staticFS.ReadDir(embedPath)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		srcPath := embedPath + "/" + entry.Name()
		dstPath := filepath.Join(destDir, entry.Name())
		if entry.IsDir() {
			if err := os.MkdirAll(dstPath, 0o755); err != nil {
				return err
			}
			if err := copyEmbeddedDir(srcPath, dstPath); err != nil {
				return err
			}
			continue
		}
		data, err := staticFS.ReadFile(srcPath)
		if err != nil {
			return err
		}
		if err := os.WriteFile(dstPath, data, 0o644); err != nil {
			return err
		}
	}
	return nil
}

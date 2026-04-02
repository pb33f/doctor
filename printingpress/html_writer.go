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

	dirs := append([]string{"operations", "tags"}, modelDirs()...)
	dirs = append(dirs, "static", "static/fonts", "static/shoelace/assets/icons")
	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(outputDir, dir), 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	if err := copyEmbeddedStatic(outputDir); err != nil {
		return fmt.Errorf("copying static assets: %w", err)
	}

	title := ""
	if site.Root != nil {
		title = site.Root.Title
	}

	params := &pageParams{
		SiteTitle:    title,
		NavJSON:      MustJSON(site.NavTags),
		ModelsJSON:   MustJSON(site.NavModelGroups),
		WebhooksJSON: MustJSON(site.NavWebhooks),
		RegistryJSON: MustJSON(site.SchemaRegistry),
		SpecFormat:   site.SpecFormat,
	}

	// Write root page
	if site.Root != nil {
		p := *params
		p.BaseURL = baseURL
		p.ExtraCSS = []string{"static/printing-press-index.css"}
		rootContent := RootPageTempl(site.Root)
		if err := writeTemplPage(filepath.Join(outputDir, "index.html"), title, "", &p, rootContent); err != nil {
			return fmt.Errorf("writing index.html: %w", err)
		}
	}

	// Write operation pages (1 level deep: operations/)
	for _, op := range site.Operations {
		p := *params
		p.BaseURL = resolveBase(baseURL, 1)
		p.ExtraCSS = []string{"static/printing-press-operation.css"}
		opContent := OperationPageTempl(op)
		pageTitle := fmt.Sprintf("%s %s - %s", op.Method, op.Path, title)
		path := filepath.Join(outputDir, "operations", op.Slug+".html")
		if err := writeTemplPage(path, pageTitle, op.Slug, &p, opContent); err != nil {
			return fmt.Errorf("writing operation %s: %w", op.Slug, err)
		}
	}

	// Write model pages (2 levels deep: models/{type}/)
	// Skip path-items — after bundling they duplicate operation pages with no added value.
	// They remain in site.Models for JSON/manifest/agent-writer output.
	for typeSlug, pages := range site.Models {
		if typeSlug == "path-items" {
			continue
		}
		for _, page := range pages {
			p := *params
			p.BaseURL = resolveBase(baseURL, 2)
			p.ExtraCSS = []string{"static/printing-press-model.css"}
			modelContent := ModelPageTempl(page)
			pageTitle := fmt.Sprintf("%s - %s", page.Name, title)
			path := filepath.Join(outputDir, "models", typeSlug, page.Slug+".html")
			activeModelSlug := page.TypeSlug + "/" + page.Slug
			if err := writeTemplPage(path, pageTitle, activeModelSlug, &p, modelContent); err != nil {
				return fmt.Errorf("writing model %s/%s: %w", typeSlug, page.Slug, err)
			}
		}
	}

	// Write models index page (1 level deep: models/)
	{
		p := *params
		p.BaseURL = resolveBase(baseURL, 1)
		p.ExtraCSS = []string{"static/printing-press-index.css"}
		indexContent := ModelsIndexTempl(site.NavModelGroups, modelsIndexBreadcrumb())
		if err := writeTemplPage(filepath.Join(outputDir, "models", "index.html"), "Models - "+title, "", &p, indexContent); err != nil {
			return fmt.Errorf("writing models index: %w", err)
		}
	}

	// Write model type index pages (2 levels deep: models/{typeSlug}/)
	for _, group := range site.NavModelGroups {
		p := *params
		p.BaseURL = resolveBase(baseURL, 2)
		p.ExtraCSS = []string{"static/printing-press-index.css"}
		bc := modelTypeIndexBreadcrumb(group.Name)
		content := ModelTypeIndexTempl(group, bc)
		pageTitle := fmt.Sprintf("%s - %s", group.Name, title)
		path := filepath.Join(outputDir, "models", group.TypeSlug, "index.html")
		if err := writeTemplPage(path, pageTitle, "", &p, content); err != nil {
			return fmt.Errorf("writing model type index %s: %w", group.TypeSlug, err)
		}
	}

	// Write tag index pages (1 level deep: tags/)
	tagParentMap := buildTagParentMap(site.NavTags)
	var writeTagPages func([]*NavTag) error
	writeTagPages = func(tags []*NavTag) error {
		for _, tag := range tags {
			if tag.IsNavOnly && len(tag.Operations) == 0 && len(tag.Children) == 0 && tag.DescHTML == "" {
				continue
			}
			p := *params
			p.BaseURL = resolveBase(baseURL, 1)
			p.ExtraCSS = []string{"static/printing-press-index.css"}
			bc := tagIndexBreadcrumb(tag, tagParentMap)
			content := TagIndexTempl(tag, bc)
			pageTitle := fmt.Sprintf("%s - %s", tag.DisplayName(), title)
			path := filepath.Join(outputDir, "tags", tag.Slug+".html")
			if err := writeTemplPage(path, pageTitle, "", &p, content); err != nil {
				return fmt.Errorf("writing tag index %s: %w", tag.Slug, err)
			}
			if err := writeTagPages(tag.Children); err != nil {
				return err
			}
		}
		return nil
	}
	if err := writeTagPages(site.NavTags); err != nil {
		return err
	}

	// Write webhook pages (1 level deep: operations/)
	for _, wh := range site.Webhooks {
		p := *params
		p.BaseURL = resolveBase(baseURL, 1)
		p.ExtraCSS = []string{"static/printing-press-operation.css"}
		whContent := OperationPageTempl(wh)
		pageTitle := fmt.Sprintf("Webhook: %s %s - %s", wh.Method, wh.Path, title)
		path := filepath.Join(outputDir, "operations", wh.Slug+".html")
		if err := writeTemplPage(path, pageTitle, wh.Slug, &p, whContent); err != nil {
			return fmt.Errorf("writing webhook %s: %w", wh.Slug, err)
		}
	}

	return nil
}

// pageParams holds the shared parameters for writing a templ page.
type pageParams struct {
	SiteTitle    string
	BaseURL      string
	NavJSON      string
	ModelsJSON   string
	WebhooksJSON string
	SpecFormat   string
	RegistryJSON string
	ExtraCSS     []string
}

func writeTemplPage(path, pageTitle, activeSlug string, p *pageParams, content templ.Component) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	layout := Layout(pageTitle, p.SiteTitle, p.BaseURL, p.NavJSON, p.ModelsJSON, p.WebhooksJSON, activeSlug, p.SpecFormat, p.RegistryJSON, p.ExtraCSS, content)
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

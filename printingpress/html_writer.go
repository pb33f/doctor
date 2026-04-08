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
	"golang.org/x/sync/errgroup"
)

//go:embed static/*
//go:embed static/fonts/*
//go:embed static/shoelace/assets/icons/*
var staticFS embed.FS

type htmlWriteJob struct {
	path       string
	pageTitle  string
	activeSlug string
	params     pageParams
	content    templ.Component
}

type writeProgressFunc func(task string, completed, total int)

// WriteHTMLSite writes the full static HTML site to disk.
//
// The site output directory and base URL are taken from the arguments when set,
// and otherwise fall back to values already stored on the Site.
//
// A nil site returns ErrNilSite.
func WriteHTMLSite(site *Site, outputDir, baseURL string) error {
	if site == nil {
		return ErrNilSite
	}
	_, err := writeHTMLSiteDetailed(site, outputDir, baseURL, nil)
	return err
}

func writeHTMLSiteDetailed(site *Site, outputDir, baseURL string, progress writeProgressFunc) ([]string, error) {
	if site == nil {
		return nil, ErrNilSite
	}
	resolvedOutputDir, err := resolveWriterOutputDir(site, outputDir)
	if err != nil {
		return nil, err
	}
	resolvedBaseURL := resolveWriterBaseURL(site, baseURL)

	if err := os.MkdirAll(resolvedOutputDir, 0o755); err != nil {
		return nil, fmt.Errorf("creating output directory: %w", err)
	}

	dirs := append([]string{"operations", "tags"}, modelDirs()...)
	dirs = append(dirs, "static", "static/fonts", "static/shoelace/assets/icons")
	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(resolvedOutputDir, dir), 0o755); err != nil {
			return nil, fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	staticPaths, err := copyEmbeddedStatic(resolvedOutputDir)
	if err != nil {
		return nil, fmt.Errorf("copying static assets: %w", err)
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
		Lite:         site.Lite,
	}

	var jobs []htmlWriteJob

	// Write root page
	if site.Root != nil {
		p := *params
		p.BaseURL = resolvedBaseURL
		p.ExtraCSS = []string{"static/printing-press-index.css"}
		rootContent := RootPageTempl(site.Root)
		jobs = append(jobs, htmlWriteJob{
			path:      filepath.Join(resolvedOutputDir, "index.html"),
			pageTitle: title,
			params:    p,
			content:   rootContent,
		})
	}

	// Write operation pages (1 level deep: operations/)
	for _, op := range site.Operations {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{"static/printing-press-operation.css"}
		opContent := OperationPageTempl(op)
		pageTitle := fmt.Sprintf("%s %s - %s", op.Method, op.Path, title)
		path := filepath.Join(resolvedOutputDir, "operations", op.Slug+".html")
		jobs = append(jobs, htmlWriteJob{
			path:       path,
			pageTitle:  pageTitle,
			activeSlug: op.Slug,
			params:     p,
			content:    opContent,
		})
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
			p.BaseURL = resolveBase(resolvedBaseURL, 2)
			p.ExtraCSS = []string{"static/printing-press-model.css"}
			modelContent := ModelPageTempl(page)
			pageTitle := fmt.Sprintf("%s - %s", page.Name, title)
			path := filepath.Join(resolvedOutputDir, "models", typeSlug, page.Slug+".html")
			activeModelSlug := page.TypeSlug + "/" + page.Slug
			jobs = append(jobs, htmlWriteJob{
				path:       path,
				pageTitle:  pageTitle,
				activeSlug: activeModelSlug,
				params:     p,
				content:    modelContent,
			})
		}
	}

	// Write models index page (1 level deep: models/)
	{
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{"static/printing-press-index.css"}
		indexContent := ModelsIndexTempl(site.NavModelGroups, modelsIndexBreadcrumb())
		jobs = append(jobs, htmlWriteJob{
			path:      filepath.Join(resolvedOutputDir, "models", "index.html"),
			pageTitle: "Models - " + title,
			params:    p,
			content:   indexContent,
		})
	}

	// Write model type index pages (2 levels deep: models/{typeSlug}/)
	for _, group := range site.NavModelGroups {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 2)
		p.ExtraCSS = []string{"static/printing-press-index.css"}
		bc := modelTypeIndexBreadcrumb(group.Name)
		content := ModelTypeIndexTempl(group, bc)
		pageTitle := fmt.Sprintf("%s - %s", group.Name, title)
		path := filepath.Join(resolvedOutputDir, "models", group.TypeSlug, "index.html")
		jobs = append(jobs, htmlWriteJob{
			path:      path,
			pageTitle: pageTitle,
			params:    p,
			content:   content,
		})
	}

	// Write tag index pages (1 level deep: tags/)
	tagParentMap := buildTagParentMap(site.NavTags)
	var collectTagJobs func([]*NavTag)
	collectTagJobs = func(tags []*NavTag) {
		for _, tag := range tags {
			if tag.IsNavOnly && len(tag.Operations) == 0 && len(tag.Children) == 0 && tag.DescHTML == "" {
				continue
			}
			p := *params
			p.BaseURL = resolveBase(resolvedBaseURL, 1)
			p.ExtraCSS = []string{"static/printing-press-index.css"}
			bc := tagIndexBreadcrumb(tag, tagParentMap)
			content := TagIndexTempl(tag, bc)
			pageTitle := fmt.Sprintf("%s - %s", tag.DisplayName(), title)
			path := filepath.Join(resolvedOutputDir, "tags", tag.Slug+".html")
			jobs = append(jobs, htmlWriteJob{
				path:      path,
				pageTitle: pageTitle,
				params:    p,
				content:   content,
			})
			collectTagJobs(tag.Children)
		}
	}
	collectTagJobs(site.NavTags)

	// Write webhook pages (1 level deep: operations/)
	for _, wh := range site.Webhooks {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{"static/printing-press-operation.css"}
		whContent := OperationPageTempl(wh)
		pageTitle := fmt.Sprintf("Webhook: %s %s - %s", wh.Method, wh.Path, title)
		path := filepath.Join(resolvedOutputDir, "operations", wh.Slug+".html")
		jobs = append(jobs, htmlWriteJob{
			path:       path,
			pageTitle:  pageTitle,
			activeSlug: wh.Slug,
			params:     p,
			content:    whContent,
		})
	}

	var g errgroup.Group
	g.SetLimit(printingPressParallelism())
	totalJobs := len(jobs)
	var completed int64
	for _, job := range jobs {
		job := job
		g.Go(func() error {
			if err := writeTemplPage(job.path, job.pageTitle, job.activeSlug, &job.params, job.content); err != nil {
				return fmt.Errorf("writing %s: %w", job.path, err)
			}
			if progress != nil {
				done := int(atomicAddInt64(&completed, 1))
				progress("writing html pages", done, totalJobs)
			}
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		return nil, err
	}

	written := make([]string, 0, len(staticPaths)+len(jobs))
	written = append(written, staticPaths...)
	for _, job := range jobs {
		written = append(written, job.path)
	}
	return written, nil
}

func resolveWriterBaseURL(site *Site, baseURL string) string {
	if baseURL != "" {
		return baseURL
	}
	if site != nil {
		return site.BaseURL
	}
	return ""
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
	Lite         bool
}

func writeTemplPage(path, pageTitle, activeSlug string, p *pageParams, content templ.Component) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	layout := Layout(pageTitle, p.SiteTitle, p.BaseURL, p.NavJSON, p.ModelsJSON, p.WebhooksJSON, activeSlug, p.SpecFormat, p.RegistryJSON, p.ExtraCSS, p.Lite, content)
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

func copyEmbeddedStatic(outputDir string) ([]string, error) {
	return copyEmbeddedDir("static", filepath.Join(outputDir, "static"))
}

func copyEmbeddedDir(embedPath, destDir string) ([]string, error) {
	entries, err := staticFS.ReadDir(embedPath)
	if err != nil {
		return nil, err
	}
	var written []string
	for _, entry := range entries {
		srcPath := embedPath + "/" + entry.Name()
		dstPath := filepath.Join(destDir, entry.Name())
		if entry.IsDir() {
			if err := os.MkdirAll(dstPath, 0o755); err != nil {
				return nil, err
			}
			childWritten, err := copyEmbeddedDir(srcPath, dstPath)
			if err != nil {
				return nil, err
			}
			written = append(written, childWritten...)
			continue
		}
		data, err := staticFS.ReadFile(srcPath)
		if err != nil {
			return nil, err
		}
		if err := os.WriteFile(dstPath, data, 0o644); err != nil {
			return nil, err
		}
		written = append(written, dstPath)
	}
	return written, nil
}

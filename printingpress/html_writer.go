// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/a-h/templ"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
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

type htmlHydrationJob struct {
	dataBase string
	context  string
	payload  *htmlHydrationPayload
}

type writeProgressFunc func(task string, completed, total int)

func appendHydratedHTMLJob(
	outputDir string,
	staticPaths []string,
	jobs []htmlWriteJob,
	assetMode string,
	params pageParams,
	hydration htmlHydrationJob,
	job htmlWriteJob,
) ([]string, []htmlWriteJob, error) {
	if hydration.dataBase != "" {
		params.PageDataBase = hydration.dataBase
		assetPaths, err := writeHydrationAsset(outputDir, params.PageDataBase, pageHydrationGlobal, assetMode, hydration.payload)
		if err != nil {
			return nil, nil, fmt.Errorf("writing %s hydration assets: %w", hydration.context, err)
		}
		staticPaths = append(staticPaths, assetPaths...)
	}
	job.params = params
	jobs = append(jobs, job)
	return staticPaths, jobs, nil
}

// WriteHTMLSite writes the full static HTML site to disk.
//
// The site output directory and base URL are taken from the arguments when set,
// and otherwise fall back to values already stored on the Site.
//
// A nil site returns ErrNilSite.
func WriteHTMLSite(site *ppmodel.Site, outputDir, baseURL string) error {
	if site == nil {
		return ErrNilSite
	}
	_, err := writeHTMLSiteDetailed(site, outputDir, baseURL, nil)
	return err
}

func writeHTMLSiteDetailed(site *ppmodel.Site, outputDir, baseURL string, progress writeProgressFunc) ([]string, error) {
	if site == nil {
		return nil, ErrNilSite
	}
	resolvedOutputDir, err := resolveWriterOutputDir(site, outputDir)
	if err != nil {
		return nil, err
	}
	resolvedBaseURL, err := resolveWriterBaseURL(site, baseURL)
	if err != nil {
		return nil, err
	}

	if err := os.MkdirAll(resolvedOutputDir, 0o755); err != nil {
		return nil, fmt.Errorf("creating output directory: %w", err)
	}
	if err := cleanGeneratedHydrationAssets(resolvedOutputDir); err != nil {
		return nil, fmt.Errorf("cleaning generated hydration assets: %w", err)
	}

	for _, dir := range pppaths.StaticDirs() {
		if err := os.MkdirAll(filepath.Join(resolvedOutputDir, dir), 0o755); err != nil {
			return nil, fmt.Errorf("creating directory %s: %w", dir, err)
		}
	}

	staticPaths, err := copyEmbeddedStatic(resolvedOutputDir)
	if err != nil {
		return nil, fmt.Errorf("copying static assets: %w", err)
	}
	assetMode := resolveHTMLAssetMode(site)
	sharedPayload := buildSharedHydrationPayload(site)
	sharedDataHash, err := hashHydrationPayload(sharedPayload)
	if err != nil {
		return nil, fmt.Errorf("hashing shared hydration assets: %w", err)
	}
	sharedAssetPaths, err := writeHydrationAsset(resolvedOutputDir, htmlSharedDataAssetBase, sharedHydrationGlobal, assetMode, sharedPayload)
	if err != nil {
		return nil, fmt.Errorf("writing shared hydration assets: %w", err)
	}
	staticPaths = append(staticPaths, sharedAssetPaths...)

	title := ""
	if site.Root != nil {
		title = site.Root.Title
	}

	params := &pageParams{
		SiteTitle:      title,
		AssetBaseURL:   resolvedBaseURL,
		SpecFormat:     site.SpecFormat,
		AssetMode:      assetMode,
		SharedDataBase: htmlSharedDataAssetBase,
		SharedDataHash: sharedDataHash,
		Lite:           site.Lite,
		HeaderContext:  site.HeaderContext,
		DeveloperMode:  site.DeveloperMode,
		Footer:         site.Footer,
	}

	var jobs []htmlWriteJob

	// Write root page
	if site.Root != nil {
		p := *params
		p.BaseURL = resolvedBaseURL
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		hydration := htmlHydrationJob{}
		if site.DeveloperMode {
			hydration = htmlHydrationJob{
				dataBase: pppaths.RootPageDataBase(),
				context:  "root",
				payload:  buildRootHydrationPayload(site.Root),
			}
		}
		rootContent := render.RootPageTempl(site.Root, p.BaseURL)
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, hydration, htmlWriteJob{
			path:      filepath.Join(resolvedOutputDir, pppaths.FileIndexHTML),
			pageTitle: title,
			content:   rootContent,
		})
		if err != nil {
			return nil, err
		}
	}

	// Write operation pages (1 level deep: operations/)
	for _, op := range site.Operations {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressOperationCSS)}
		opContent := render.OperationPageTempl(op, p.BaseURL)
		pageTitle := fmt.Sprintf("%s %s - %s", op.Method, op.Path, title)
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OperationHTML(op.Slug)))
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
			dataBase: pppaths.OperationPageDataBase(op.Slug),
			context:  fmt.Sprintf("operation %s", op.Slug),
			payload:  buildOperationHydrationPayload(op),
		}, htmlWriteJob{
			path:       path,
			pageTitle:  pageTitle,
			activeSlug: op.Slug,
			content:    opContent,
		})
		if err != nil {
			return nil, err
		}
	}

	// Write model pages (2 levels deep: models/{type}/)
	// Skip path-items — after bundling they duplicate operation pages with no added value.
	// They remain in site.Models for JSON/manifest/agent-writer output.
	for typeSlug, pages := range site.Models {
		if typeSlug == typeSlugPathItems {
			continue
		}
		for _, page := range pages {
			p := *params
			p.BaseURL = resolveBase(resolvedBaseURL, 2)
			p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressModelCSS)}
			modelDataBase := pppaths.ModelPageDataBase(typeSlug, page.Slug)
			if diagramPayload := buildModelDiagramVisualizationPayload(page); diagramPayload != nil {
				p.VizDiagramDataBase = pppaths.ModelDiagramVizBase(typeSlug, page.Slug)
				diagramAssetPaths, err := writeHydrationAsset(
					resolvedOutputDir, p.VizDiagramDataBase, diagramHydrationGlobal, assetMode, diagramPayload,
				)
				if err != nil {
					return nil, fmt.Errorf("writing model diagram assets for %s/%s: %w", typeSlug, page.Slug, err)
				}
				staticPaths = append(staticPaths, diagramAssetPaths...)
			}
			if graphPayload := buildModelGraphVisualizationPayload(page); graphPayload != nil {
				p.VizGraphDataBase = pppaths.ModelGraphVizBase(typeSlug, page.Slug)
				graphAssetPaths, err := writeHydrationAsset(
					resolvedOutputDir, p.VizGraphDataBase, graphHydrationGlobal, assetMode, graphPayload,
				)
				if err != nil {
					return nil, fmt.Errorf("writing model graph assets for %s/%s: %w", typeSlug, page.Slug, err)
				}
				staticPaths = append(staticPaths, graphAssetPaths...)
			}
			modelContent := render.ModelPageTempl(page, p.BaseURL)
			pageTitle := fmt.Sprintf("%s - %s", page.Name, title)
			path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.ModelHTML(typeSlug, page.Slug)))
			activeModelSlug := page.TypeSlug + "/" + page.Slug
			staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
				dataBase: modelDataBase,
				context:  fmt.Sprintf("model %s/%s", typeSlug, page.Slug),
				payload:  buildModelHydrationPayload(page),
			}, htmlWriteJob{
				path:       path,
				pageTitle:  pageTitle,
				activeSlug: activeModelSlug,
				content:    modelContent,
			})
			if err != nil {
				return nil, err
			}
		}
	}

	// Write models index page (1 level deep: models/)
	{
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		indexContent := render.ModelsIndexTempl(site.NavModelGroups, render.ModelsIndexBreadcrumb(), p.BaseURL)
		jobs = append(jobs, htmlWriteJob{
			path:      filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.ModelsIndexHTML())),
			pageTitle: "Models - " + title,
			params:    p,
			content:   indexContent,
		})
	}

	// Write model type index pages (2 levels deep: models/{typeSlug}/)
	for _, group := range site.NavModelGroups {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 2)
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		bc := render.ModelTypeIndexBreadcrumb(group.Name)
		content := render.ModelTypeIndexTempl(group, bc, p.BaseURL)
		pageTitle := fmt.Sprintf("%s - %s", group.Name, title)
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.ModelTypeIndexHTML(group.TypeSlug)))
		jobs = append(jobs, htmlWriteJob{
			path:      path,
			pageTitle: pageTitle,
			params:    p,
			content:   content,
		})
	}

	// Write developer diagnostics page.
	if site.DeveloperMode && site.Diagnostics != nil {
		p := *params
		p.BaseURL = resolvedBaseURL
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
			dataBase: pppaths.DiagnosticsPageDataBase(),
			context:  "diagnostics",
			payload:  buildDiagnosticsHydrationPayload(site.Diagnostics),
		}, htmlWriteJob{
			path:       filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.DiagnosticsHTMLPath())),
			pageTitle:  "Diagnostics - " + title,
			activeSlug: pppaths.DiagnosticsSlug,
			content:    render.DiagnosticsPageTempl(site.Diagnostics),
		})
		if err != nil {
			return nil, err
		}
		if len(site.OrphanResults) > 0 {
			orphansPath := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OrphansJSONPath))
			encoded, err := json.MarshalIndent(site.OrphanResults, "", "  ")
			if err != nil {
				return nil, fmt.Errorf("marshalling diagnostics orphans: %w", err)
			}
			if err := os.WriteFile(orphansPath, encoded, 0o644); err != nil {
				return nil, fmt.Errorf("writing diagnostics orphans: %w", err)
			}
			staticPaths = append(staticPaths, orphansPath)
		}
	}

	// Write tag index pages (1 level deep: tags/)
	tagParentMap := render.BuildTagParentMap(site.NavTags)
	var collectTagJobs func([]*ppmodel.NavTag)
	collectTagJobs = func(tags []*ppmodel.NavTag) {
		for _, tag := range tags {
			if tag.IsNavOnly && len(tag.Operations) == 0 && len(tag.Children) == 0 && tag.DescHTML == "" {
				continue
			}
			p := *params
			p.BaseURL = resolveBase(resolvedBaseURL, 1)
			p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
			bc := render.TagIndexBreadcrumb(tag, tagParentMap)
			content := render.TagIndexTempl(tag, bc, p.BaseURL)
			pageTitle := fmt.Sprintf("%s - %s", tag.DisplayName(), title)
			path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.TagHTML(tag.Slug)))
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
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressOperationCSS)}
		whContent := render.OperationPageTempl(wh, p.BaseURL)
		pageTitle := fmt.Sprintf("Webhook: %s %s - %s", wh.Method, wh.Path, title)
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OperationHTML(wh.Slug)))
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
			dataBase: pppaths.OperationPageDataBase(wh.Slug),
			context:  fmt.Sprintf("webhook %s", wh.Slug),
			payload:  buildOperationHydrationPayload(wh),
		}, htmlWriteJob{
			path:       path,
			pageTitle:  pageTitle,
			activeSlug: wh.Slug,
			content:    whContent,
		})
		if err != nil {
			return nil, err
		}
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

func cleanGeneratedHydrationAssets(outputDir string) error {
	cleanupPaths := []string{
		filepath.Join(outputDir, filepath.FromSlash(htmlPageDataAssetDir)),
		filepath.Join(outputDir, filepath.FromSlash(htmlVizDataAssetDir)),
		filepath.Join(outputDir, filepath.FromSlash(htmlSharedDataAssetBase+".json")),
		filepath.Join(outputDir, filepath.FromSlash(htmlSharedDataAssetBase+".js")),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.DiagnosticsHTMLPath())),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.OrphansJSONPath)),
	}
	for _, target := range cleanupPaths {
		if err := os.RemoveAll(target); err != nil {
			return err
		}
	}
	return nil
}

func resolveWriterBaseURL(site *ppmodel.Site, baseURL string) (string, error) {
	raw := ""
	if baseURL != "" {
		raw = baseURL
	} else if site != nil {
		raw = site.BaseURL
	}
	return resolveExplicitBaseURL(raw)
}

func normalizeBaseURL(baseURL string) string {
	if baseURL == "" || baseURL == "/" {
		return baseURL
	}

	parsed, err := url.Parse(baseURL)
	if err != nil {
		return normalizeBaseURLFallback(baseURL)
	}

	if parsed.Path == "" {
		if parsed.Scheme != "" || parsed.Host != "" {
			parsed.Path = "/"
		}
		return parsed.String()
	}

	if strings.HasSuffix(parsed.Path, "/") {
		return parsed.String()
	}

	parsed.Path += "/"
	return parsed.String()
}

func normalizeBaseURLFallback(baseURL string) string {
	suffixIdx := strings.IndexAny(baseURL, "?#")
	pathPart := baseURL
	suffix := ""
	if suffixIdx >= 0 {
		pathPart = baseURL[:suffixIdx]
		suffix = baseURL[suffixIdx:]
	}

	if pathPart == "" || pathPart == "/" || strings.HasSuffix(pathPart, "/") {
		return pathPart + suffix
	}
	return pathPart + "/" + suffix
}

const explicitBaseURLRequirements = "must be an absolute path starting with '/' or an absolute URL with scheme and host"

func resolveExplicitBaseURL(baseURL string) (string, error) {
	if baseURL == "" {
		return "", nil
	}
	normalized := normalizeBaseURL(baseURL)
	if err := validateExplicitBaseURL(normalized); err != nil {
		return "", err
	}
	return normalized, nil
}

func validateExplicitBaseURL(baseURL string) error {
	if baseURL == "" {
		return nil
	}

	parsed, err := url.Parse(baseURL)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidBaseURL, err)
	}

	if parsed.Scheme != "" || parsed.Host != "" {
		if parsed.Scheme != "" && parsed.Host != "" {
			return nil
		}
		return fmt.Errorf("%w: %s", ErrInvalidBaseURL, explicitBaseURLRequirements)
	}

	if strings.HasPrefix(parsed.Path, "/") {
		return nil
	}

	return fmt.Errorf("%w: %s", ErrInvalidBaseURL, explicitBaseURLRequirements)
}

// pageParams holds the shared parameters for writing a templ page.
type pageParams struct {
	SiteTitle          string
	BaseURL            string
	AssetBaseURL       string
	SpecFormat         string
	AssetMode          string
	SharedDataBase     string
	SharedDataHash     string
	PageDataBase       string
	VizGraphDataBase   string
	VizDiagramDataBase string
	ExtraCSS           []string
	Lite               bool
	HeaderContext      *ppmodel.SiteHeaderContext
	DeveloperMode      bool
	Footer             *ppmodel.FooterConfig
}

func writeTemplPage(path, pageTitle, activeSlug string, p *pageParams, content templ.Component) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	layout := render.LayoutPage(render.LayoutPageParams{
		PageTitle:          pageTitle,
		SiteTitle:          p.SiteTitle,
		BaseURL:            p.BaseURL,
		AssetBaseURL:       p.AssetBaseURL,
		ActiveSlug:         activeSlug,
		SpecFormat:         p.SpecFormat,
		AssetMode:          p.AssetMode,
		SharedDataBase:     p.SharedDataBase,
		SharedDataHash:     p.SharedDataHash,
		PageDataBase:       p.PageDataBase,
		VizGraphDataBase:   p.VizGraphDataBase,
		VizDiagramDataBase: p.VizDiagramDataBase,
		ExtraCSS:           p.ExtraCSS,
		Lite:               p.Lite,
		HeaderContext:      p.HeaderContext,
		DeveloperMode:      p.DeveloperMode,
		Footer:             p.Footer,
	}, content)
	return layout.Render(context.Background(), f)
}

func resolveHTMLAssetMode(site *ppmodel.Site) string {
	if site == nil || site.AssetMode == "" {
		return HTMLAssetModePortable
	}
	return site.AssetMode
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
	return copyEmbeddedDir(pppaths.DirStatic, filepath.Join(outputDir, pppaths.DirStatic))
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

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
	"sync"

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

type htmlProgressTracker struct {
	progress  writeProgressFunc
	total     int
	completed int64
	mu        sync.Mutex
}

func newHTMLProgressTracker(site *ppmodel.Site, progress writeProgressFunc) *htmlProgressTracker {
	total := estimateHTMLProgressWork(site)
	if total < 1 {
		total = 1
	}
	return &htmlProgressTracker{
		progress: progress,
		total:    total,
	}
}

func (t *htmlProgressTracker) report(task string) {
	if t == nil || t.progress == nil {
		return
	}
	t.mu.Lock()
	defer t.mu.Unlock()
	t.progress(task, int(t.completed), t.total)
}

func (t *htmlProgressTracker) advance(task string) {
	if t == nil || t.progress == nil {
		return
	}
	t.mu.Lock()
	defer t.mu.Unlock()
	t.completed++
	completed := int(t.completed)
	if completed > t.total {
		completed = t.total
	}
	t.progress(task, completed, t.total)
}

func estimateHTMLProgressWork(site *ppmodel.Site) int {
	if site == nil {
		return 1
	}
	total := 2 + estimateHTMLPageJobs(site) // cleanup + shared hydration
	if site.SharedAssetBaseURL == "" {
		total++
	}
	if site.DeveloperMode && site.Diagnostics != nil && len(site.OrphanResults) > 0 {
		total++
	}
	total += estimateHTMLPageJobs(site) // final page writes
	return total
}

func estimateHTMLPageJobs(site *ppmodel.Site) int {
	if site == nil {
		return 0
	}
	total := 0
	if site.Root != nil {
		total++
	}
	total += len(site.ContentPages)
	if len(site.ContentPages) > 0 {
		total++
	}
	total += len(site.Operations)
	for typeSlug, pages := range site.Models {
		if typeSlug == typeSlugPathItems {
			continue
		}
		total += len(pages)
	}
	total++ // models index
	total += len(site.NavModelGroups)
	if site.DeveloperMode && site.Diagnostics != nil {
		total++
	}
	total += countRenderableTagPages(site.NavTags)
	total += len(site.Webhooks)
	return total
}

func countRenderableTagPages(tags []*ppmodel.NavTag) int {
	total := 0
	for _, tag := range tags {
		if tag == nil {
			continue
		}
		if !(tag.IsNavOnly && len(tag.Operations) == 0 && len(tag.Children) == 0 && tag.DescHTML == "") {
			total++
		}
		total += countRenderableTagPages(tag.Children)
	}
	return total
}

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
	sourceCache := newYAMLSliceHydrationCache()
	defer sourceCache.Close()

	progressTracker := newHTMLProgressTracker(site, progress)
	progressTracker.report("preparing html output")

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
	if err := cleanGeneratedHydrationAssets(resolvedOutputDir, site.SharedAssetBaseURL != ""); err != nil {
		return nil, fmt.Errorf("cleaning generated hydration assets: %w", err)
	}
	progressTracker.advance("cleaning old html artifacts")

	// only materialize the embedded static asset tree when the host has not
	// taken responsibility for serving it. when SharedAssetBaseURL is set the
	// renderer emits absolute references at that prefix and never writes the
	// shared bundle into the artifact.
	var staticPaths []string
	if site.SharedAssetBaseURL == "" {
		for _, dir := range pppaths.StaticDirs() {
			if err := os.MkdirAll(filepath.Join(resolvedOutputDir, dir), 0o755); err != nil {
				return nil, fmt.Errorf("creating directory %s: %w", dir, err)
			}
		}
		copied, copyErr := copyEmbeddedStatic(resolvedOutputDir)
		if copyErr != nil {
			return nil, fmt.Errorf("copying static assets: %w", copyErr)
		}
		staticPaths = copied
		progressTracker.advance("copying static assets")
	}
	assetMode := resolveHTMLAssetMode(site)
	sharedPayload := buildSharedHydrationPayload(site)
	sharedDataHash, err := hashHydrationPayload(sharedPayload)
	if err != nil {
		return nil, fmt.Errorf("hashing shared hydration assets: %w", err)
	}
	sharedAssetPaths, err := writeHydrationAsset(resolvedOutputDir, htmlNavCacheBase, sharedHydrationGlobal, assetMode, sharedPayload)
	if err != nil {
		return nil, fmt.Errorf("writing shared hydration assets: %w", err)
	}
	staticPaths = append(staticPaths, sharedAssetPaths...)
	progressTracker.advance("preparing shared navigation data")

	title := ""
	if site.Root != nil {
		title = site.Root.Title
	}

	params := &pageParams{
		SiteTitle:          title,
		AssetBaseURL:       resolvedBaseURL,
		SpecFormat:         site.SpecFormat,
		AssetMode:          assetMode,
		SharedDataBase:     htmlNavCacheBase,
		SharedDataHash:     sharedDataHash,
		Lite:               site.Lite,
		NoMermaid:          site.NoMermaid,
		HeaderContext:      site.HeaderContext,
		Embedded:           site.Embedded,
		DeveloperMode:      site.DeveloperMode,
		DocumentID:         site.HostedDocumentID,
		DocsExpiresAt:      site.DocsExpiresAt,
		ArchiveExportURL:   site.ArchiveExportURL,
		Footer:             site.Footer,
		SharedAssetBaseURL: site.SharedAssetBaseURL,
		HasContentPages:    hasContentPagesForNav(site.ContentPages),
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
				payload:  buildRootHydrationPayload(site.Root, sourceCache),
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
		progressTracker.advance("preparing overview page")
	}

	// Write convention-discovered content pages.
	for _, page := range site.ContentPages {
		if page == nil {
			continue
		}
		assetPaths, err := writeContentPageAssets(resolvedOutputDir, page)
		if err != nil {
			return nil, err
		}
		staticPaths = append(staticPaths, assetPaths...)
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, contentPageDepth(page.Href))
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		content := render.ContentPageTempl(page, p.BaseURL)
		jobs = append(jobs, htmlWriteJob{
			path:       filepath.Join(resolvedOutputDir, filepath.FromSlash(page.Href)),
			pageTitle:  fmt.Sprintf("%s - %s", page.Title, title),
			activeSlug: "content/" + page.Slug,
			params:     p,
			content:    content,
		})
		progressTracker.advance("preparing content pages")
	}

	// Write generated guides index page.
	if len(site.ContentPages) > 0 {
		p := *params
		p.BaseURL = resolvedBaseURL
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		content := render.ContentIndexTempl(site.ContentPages, render.GuidesIndexBreadcrumb(), p.BaseURL)
		jobs = append(jobs, htmlWriteJob{
			path:       filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.GuidesIndexHTML())),
			pageTitle:  "Guides - " + title,
			activeSlug: "guides",
			params:     p,
			content:    content,
		})
		progressTracker.advance("preparing guides index")
	}

	// Write operation pages (1 level deep: operations/)
	for _, op := range site.Operations {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressOperationCSS)}
		highlightCodeSamplesForHTML(op)
		opContent := render.OperationPageTempl(op, p.BaseURL)
		pageTitle := fmt.Sprintf("%s %s - %s", op.Method, op.Path, title)
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OperationHTML(op.Slug)))
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
			dataBase: pppaths.OperationPageDataBase(op.Slug),
			context:  fmt.Sprintf("operation %s", op.Slug),
			payload:  buildOperationHydrationPayload(op, sourceCache),
		}, htmlWriteJob{
			path:       path,
			pageTitle:  pageTitle,
			activeSlug: op.Slug,
			content:    opContent,
		})
		if err != nil {
			return nil, err
		}
		progressTracker.advance("preparing operation pages")
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
				payload:  buildModelHydrationPayload(page, sourceCache),
			}, htmlWriteJob{
				path:       path,
				pageTitle:  pageTitle,
				activeSlug: activeModelSlug,
				content:    modelContent,
			})
			if err != nil {
				return nil, err
			}
			progressTracker.advance("preparing model pages")
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
		progressTracker.advance("preparing models index")
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
		progressTracker.advance("preparing model type indexes")
	}

	// Write developer diagnostics page.
	if site.DeveloperMode && site.Diagnostics != nil {
		p := *params
		p.BaseURL = resolvedBaseURL
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)}
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
			dataBase: pppaths.DiagnosticsPageDataBase(),
			context:  "diagnostics",
			payload:  buildDiagnosticsHydrationPayload(site.Diagnostics, sourceCache),
		}, htmlWriteJob{
			path:       filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.DiagnosticsHTMLPath())),
			pageTitle:  "Diagnostics - " + title,
			activeSlug: pppaths.DiagnosticsSlug,
			content:    render.DiagnosticsPageTempl(site.Diagnostics),
		})
		if err != nil {
			return nil, err
		}
		progressTracker.advance("preparing diagnostics page")
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
			progressTracker.advance("writing diagnostics orphan results")
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
			progressTracker.advance("preparing tag pages")
			collectTagJobs(tag.Children)
		}
	}
	collectTagJobs(site.NavTags)

	// Write webhook pages (1 level deep: operations/)
	for _, wh := range site.Webhooks {
		p := *params
		p.BaseURL = resolveBase(resolvedBaseURL, 1)
		p.ExtraCSS = []string{pppaths.StaticAsset(pppaths.FilePrintingPressOperationCSS)}
		highlightCodeSamplesForHTML(wh)
		whContent := render.OperationPageTempl(wh, p.BaseURL)
		pageTitle := fmt.Sprintf("Webhook: %s %s - %s", wh.Method, wh.Path, title)
		path := filepath.Join(resolvedOutputDir, filepath.FromSlash(pppaths.OperationHTML(wh.Slug)))
		staticPaths, jobs, err = appendHydratedHTMLJob(resolvedOutputDir, staticPaths, jobs, assetMode, p, htmlHydrationJob{
			dataBase: pppaths.OperationPageDataBase(wh.Slug),
			context:  fmt.Sprintf("webhook %s", wh.Slug),
			payload:  buildOperationHydrationPayload(wh, sourceCache),
		}, htmlWriteJob{
			path:       path,
			pageTitle:  pageTitle,
			activeSlug: wh.Slug,
			content:    whContent,
		})
		if err != nil {
			return nil, err
		}
		progressTracker.advance("preparing webhook pages")
	}

	var g errgroup.Group
	g.SetLimit(printingPressParallelism())
	totalJobs := len(jobs)
	for _, job := range jobs {
		job := job
		g.Go(func() error {
			if err := writeTemplPage(job.path, job.pageTitle, job.activeSlug, &job.params, job.content); err != nil {
				return fmt.Errorf("writing %s: %w", job.path, err)
			}
			progressTracker.advance("writing html pages")
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		return nil, err
	}
	if totalJobs == 0 {
		progressTracker.advance("writing html pages")
	}

	written := make([]string, 0, len(staticPaths)+len(jobs))
	written = append(written, staticPaths...)
	for _, job := range jobs {
		written = append(written, job.path)
	}
	return written, nil
}

func cleanGeneratedHydrationAssets(outputDir string, removeSharedStatic bool) error {
	cleanupDirs := []string{
		filepath.Join(outputDir, filepath.FromSlash(htmlPageDataAssetDir)),
		filepath.Join(outputDir, filepath.FromSlash(htmlVizDataAssetDir)),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.StaticAsset("page-data"))),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.StaticAsset("page-viz"))),
	}
	if removeSharedStatic {
		cleanupDirs = append(cleanupDirs, filepath.Join(outputDir, filepath.FromSlash(pppaths.DirStatic)))
	}
	for _, target := range cleanupDirs {
		if err := os.RemoveAll(target); err != nil {
			return err
		}
	}

	cleanupFiles := []string{
		filepath.Join(outputDir, filepath.FromSlash(htmlNavCacheBase+".json")),
		filepath.Join(outputDir, filepath.FromSlash(htmlNavCacheBase+".js")),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.StaticAsset("printing-press-shared.json"))),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.StaticAsset("printing-press-shared.js"))),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.DiagnosticsHTMLPath())),
		filepath.Join(outputDir, filepath.FromSlash(pppaths.OrphansJSONPath)),
	}
	for _, target := range cleanupFiles {
		if err := os.RemoveAll(target); err != nil {
			return err
		}
		if err := os.RemoveAll(target + ".gz"); err != nil {
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
	NoMermaid          bool
	HeaderContext      *ppmodel.SiteHeaderContext
	Embedded           bool
	DeveloperMode      bool
	DocumentID         string
	DocsExpiresAt      string
	ArchiveExportURL   string
	Footer             *ppmodel.FooterConfig
	SharedAssetBaseURL string
	HasContentPages    bool
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
		StaticAssetBaseURL: staticAssetBaseURLForPage(p.AssetMode, p.BaseURL, p.AssetBaseURL),
		ActiveSlug:         activeSlug,
		SpecFormat:         p.SpecFormat,
		AssetMode:          p.AssetMode,
		EmitBaseHref:       shouldEmitBaseHref(p.AssetMode, p.BaseURL),
		SharedDataBase:     p.SharedDataBase,
		SharedDataHash:     p.SharedDataHash,
		PageDataBase:       p.PageDataBase,
		VizGraphDataBase:   p.VizGraphDataBase,
		VizDiagramDataBase: p.VizDiagramDataBase,
		ExtraCSS:           p.ExtraCSS,
		Lite:               p.Lite,
		NoMermaid:          p.NoMermaid,
		HeaderContext:      p.HeaderContext,
		Embedded:           p.Embedded,
		DeveloperMode:      p.DeveloperMode,
		DocumentID:         p.DocumentID,
		DocsExpiresAt:      p.DocsExpiresAt,
		ArchiveExportURL:   p.ArchiveExportURL,
		Footer:             p.Footer,
		SharedAssetBaseURL: p.SharedAssetBaseURL,
		HasContentPages:    p.HasContentPages,
	}, content)
	return layout.Render(context.Background(), f)
}

func resolveHTMLAssetMode(site *ppmodel.Site) string {
	if site == nil || site.AssetMode == "" {
		return HTMLAssetModePortable
	}
	return site.AssetMode
}

func shouldEmitBaseHref(assetMode string, baseURL string) bool {
	if strings.TrimSpace(baseURL) == "" || assetMode != HTMLAssetModePortable {
		return false
	}
	parsed, err := url.Parse(baseURL)
	if err != nil {
		return false
	}
	return parsed.Scheme == "" && parsed.Host == "" && !strings.HasPrefix(parsed.Path, "/")
}

func staticAssetBaseURLForPage(assetMode string, baseURL string, assetBaseURL string) string {
	if strings.TrimSpace(assetBaseURL) != "" || shouldEmitBaseHref(assetMode, baseURL) {
		return assetBaseURL
	}
	return strings.TrimSpace(baseURL)
}

func highlightCodeSamplesForHTML(op *ppmodel.OperationPage) {
	if op == nil {
		return
	}
	for _, sample := range op.CodeSamples {
		if sample == nil || sample.Source == "" || sample.HighlightedHTML != "" {
			continue
		}
		sample.HighlightedHTML, _ = highlightCode(sample.Source, codeSampleHighlightLanguage(sample))
	}
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

func writeContentPageAssets(outputDir string, page *ppmodel.ContentPage) ([]string, error) {
	if page == nil {
		return nil, nil
	}
	var written []string
	for _, asset := range page.Assets {
		if asset == nil || asset.Href == "" {
			continue
		}
		assetPath := filepath.Join(outputDir, filepath.FromSlash(asset.Href))
		if err := os.MkdirAll(filepath.Dir(assetPath), 0o755); err != nil {
			return nil, fmt.Errorf("creating content asset directory: %w", err)
		}
		if err := os.WriteFile(assetPath, asset.Data, 0o644); err != nil {
			return nil, fmt.Errorf("writing content asset %s: %w", asset.Href, err)
		}
		written = append(written, assetPath)
	}
	return written, nil
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

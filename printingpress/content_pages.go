// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"errors"
	"fmt"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"unicode"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"gopkg.in/yaml.v3"
)

const (
	contentPageReadLimit        int64 = 2 * 1024 * 1024
	contentPartialReadLimit     int64 = 512 * 1024
	contentPartialExpandLimit   int   = 2 * 1024 * 1024
	contentPartialMaxDepth            = 8
	contentPartialMaxExpansions       = 128
	contentImageAssetReadLimit  int64 = 5 * 1024 * 1024
	contentPageDefaultOrder           = 1000
)

var partialPattern = regexp.MustCompile(`\{\{<\s*partial\s+"([^"]+)"\s*>\}\}`)

type conventionalContentPage struct {
	key          string
	filename     string
	title        string
	slug         string
	order        int
	specialGuide bool
}

var conventionalContentPages = []conventionalContentPage{
	{key: "about", filename: "about.md", title: "About", slug: "about", order: 10},
	{key: "quickstart", filename: "quickstart.md", title: "Quickstart", slug: "quickstart", order: 20},
	{key: "guide", filename: "guide.md", title: "Guide", slug: "guide", order: 30},
	{key: "auth", filename: "auth.md", title: "Auth", slug: "auth", order: 40},
	{key: "security", filename: "security.md", title: "Security", slug: "security", order: 50},
	{key: "errors", filename: "errors.md", title: "Errors", slug: "errors", order: 60},
	{key: "webhooks", filename: "webhooks.md", title: "Webhooks Guide", slug: "webhooks-guide", order: 70, specialGuide: true},
	{key: "sdks", filename: "sdks.md", title: "SDKs", slug: "sdks", order: 80},
	{key: "faq", filename: "faq.md", title: "FAQ", slug: "faq", order: 90},
	{key: "changelog", filename: "changelog.md", title: "Changelog", slug: "changelog", order: 100},
}

var reservedContentRoutes = map[string]struct{}{
	strings.TrimSuffix(pppaths.FileIndexHTML, pppaths.ExtHTML):    {},
	strings.TrimSuffix(pppaths.FileBundleJSON, pppaths.ExtJSON):   {},
	strings.TrimSuffix(pppaths.FileManifestJSON, pppaths.ExtJSON): {},
	strings.TrimSuffix(pppaths.FileNavJSON, pppaths.ExtJSON):      {},
	pppaths.DiagnosticsSlug: {},
	pppaths.DirOperations:   {},
	pppaths.DirModels:       {},
	pppaths.DirTags:         {},
	pppaths.DirContent:      {},
	pppaths.DirServices:     {},
	pppaths.DirVersions:     {},
	pppaths.DirSpecs:        {},
	pppaths.DirStatic:       {},
	pppaths.DirAssets:       {},
	pppaths.DirData:         {},
	"webhooks":              {},
}

var reservedContentExactRoutes = map[string]struct{}{
	strings.TrimSuffix(pppaths.FileGuidesHTML, pppaths.ExtHTML): {},
}

var supportedContentImageExtensions = map[string]struct{}{
	".png":  {},
	".jpg":  {},
	".jpeg": {},
	".gif":  {},
	".webp": {},
	".svg":  {},
}

type contentPageDraft struct {
	convention    conventionalContentPage
	hasConvention bool
	sourcePath    string
	sourceRelPath string
	sourceDir     string
	aliases       []string
	body          string
	meta          contentPageFrontMatter
	hasMeta       bool
	fromDocs      bool
}

type contentPageSource struct {
	filename string
	relPath  string
	path     string
	fromDocs bool
}

type contentPageFrontMatter struct {
	Title       string `yaml:"title"`
	Label       string `yaml:"label"`
	Slug        string `yaml:"slug"`
	Order       *int   `yaml:"order"`
	Description string `yaml:"description"`
	Hidden      bool   `yaml:"hidden"`
}

type contentPageContext struct {
	root       string
	docsRoot   string
	loader     *contentLoader
	linkByPath map[string]string
}

func (pp *PrintingPress) collectContentPages() {
	ctx := pp.newContentPageContext()
	if ctx == nil {
		return
	}
	drafts := pp.discoverContentPageDrafts(ctx)
	if len(drafts) == 0 {
		return
	}
	pages := pp.resolveContentPages(drafts)
	if len(pages) == 0 {
		return
	}
	ctx.linkByPath = make(map[string]string, len(pages))
	for _, page := range pages {
		if page == nil {
			continue
		}
		ctx.linkByPath[canonicalContentPath(ctx.loader, page.SourcePath)] = page.Href
		for _, alias := range page.SourceAlias {
			ctx.linkByPath[canonicalContentPath(ctx.loader, alias)] = page.Href
		}
	}
	for _, page := range pages {
		pp.renderContentPage(ctx, page)
	}
	pp.site.ContentPages = pages
}

func (pp *PrintingPress) newContentPageContext() *contentPageContext {
	if pp == nil || pp.engineConfig == nil || !pp.engineConfig.ContentDiscoveryEnabled {
		return nil
	}
	root := strings.TrimSpace(pp.engineConfig.ContentBasePath)
	if root == "" {
		return nil
	}
	if pp.engineConfig.ContentSpecPath != "" {
		if isURLString(pp.engineConfig.ContentSpecPath) {
			if isURLString(root) {
				root = strings.TrimRight(root, "/")
			}
		} else {
			root = filepath.Dir(pp.engineConfig.ContentSpecPath)
		}
	}
	docsRoot := ""
	if isURLString(root) {
		if resolved, err := resolveURLReference(ensureURLDirectory(root), "docs"); err == nil {
			docsRoot = resolved
		}
	} else {
		docsRoot = filepath.Join(root, "docs")
	}
	loader := newContentLoader(root, docsRoot)
	if resolved, err := loader.Resolve(root, "docs"); err == nil {
		docsRoot = resolved
	} else {
		docsRoot = ""
	}
	return &contentPageContext{
		root:     root,
		docsRoot: docsRoot,
		loader:   loader,
	}
}

func (pp *PrintingPress) discoverContentPageDrafts(ctx *contentPageContext) []*contentPageDraft {
	sourcesByName := make(map[string]contentPageSource)
	aliasesByName := make(map[string][]string)
	for _, source := range pp.discoverContentPageSources(ctx, ctx.root, false, false) {
		sourcesByName[contentPageSourceKey(source.relPath)] = source
	}
	if ctx.docsRoot != "" {
		for _, source := range pp.discoverContentPageSources(ctx, ctx.docsRoot, true, true) {
			key := contentPageSourceKey(source.relPath)
			if rootSource, exists := sourcesByName[key]; exists && !rootSource.fromDocs {
				pp.warnContentPage("custom page in docs ignored because root page takes precedence", source.path, nil)
				aliasesByName[key] = append(aliasesByName[key], source.path)
				continue
			}
			sourcesByName[key] = source
		}
	}
	keys := make([]string, 0, len(sourcesByName))
	for key := range sourcesByName {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	drafts := make([]*contentPageDraft, 0, len(keys))
	for _, key := range keys {
		source := sourcesByName[key]
		data, result, err := ctx.loader.Read(source.path, contentPageReadLimit)
		if err != nil {
			if !isContentNotFound(err, result) {
				pp.warnContentPage("custom page could not be read; skipping", source.path, err)
			}
			continue
		}
		convention, hasConvention := conventionalContentPageForSource(source)
		draft := pp.newContentPageDraft(ctx, convention, hasConvention, result.Path, source.relPath, data, source.fromDocs)
		if draft != nil {
			draft.aliases = aliasesByName[key]
			drafts = append(drafts, draft)
		}
	}
	return drafts
}

func (pp *PrintingPress) discoverContentPageSources(ctx *contentPageContext, root string, fromDocs bool, recursive bool) []contentPageSource {
	if ctx == nil || ctx.loader == nil || isURLString(root) {
		return nil
	}
	resolvedRoot, err := ctx.loader.resolveLocalPath(root)
	if err != nil {
		if !errors.Is(err, errContentNotFound) {
			pp.warnContentPage("custom page directory could not be read; skipping", root, err)
		}
		return nil
	}
	if recursive {
		var sources []contentPageSource
		err = filepath.WalkDir(resolvedRoot, func(walkPath string, entry os.DirEntry, walkErr error) error {
			if walkErr != nil {
				pp.warnContentPage("custom page path could not be read; skipping", walkPath, walkErr)
				if entry != nil && entry.IsDir() {
					return filepath.SkipDir
				}
				return nil
			}
			if entry == nil {
				return nil
			}
			if entry.IsDir() {
				if walkPath != resolvedRoot && isContentPageSkipDir(entry.Name()) {
					return filepath.SkipDir
				}
				return nil
			}
			if !isContentMarkdownFile(entry) {
				return nil
			}
			relPath, err := filepath.Rel(resolvedRoot, walkPath)
			if err != nil {
				pp.warnContentPage("custom page path could not be resolved; skipping", walkPath, err)
				return nil
			}
			relPath = filepath.ToSlash(relPath)
			resolved, err := ctx.loader.Resolve(resolvedRoot, filepath.FromSlash(relPath))
			if err != nil {
				pp.warnContentPage("custom page path could not be resolved; skipping", relPath, err)
				return nil
			}
			sources = append(sources, contentPageSource{
				filename: entry.Name(),
				relPath:  relPath,
				path:     resolved,
				fromDocs: fromDocs,
			})
			return nil
		})
		if err != nil {
			pp.warnContentPage("custom page directory could not be read; skipping", resolvedRoot, err)
			return nil
		}
		return sources
	}
	entries, err := os.ReadDir(resolvedRoot)
	if err != nil {
		if !os.IsNotExist(err) {
			pp.warnContentPage("custom page directory could not be read; skipping", resolvedRoot, err)
		}
		return nil
	}
	sources := make([]contentPageSource, 0, len(entries))
	for _, entry := range entries {
		if !isContentMarkdownFile(entry) {
			continue
		}
		filename := entry.Name()
		resolved, err := ctx.loader.Resolve(resolvedRoot, filename)
		if err != nil {
			pp.warnContentPage("custom page path could not be resolved; skipping", filename, err)
			continue
		}
		sources = append(sources, contentPageSource{
			filename: filename,
			relPath:  filename,
			path:     resolved,
			fromDocs: fromDocs,
		})
	}
	return sources
}

func (pp *PrintingPress) newContentPageDraft(ctx *contentPageContext, convention conventionalContentPage, hasConvention bool, sourcePath string, sourceRelPath string, data []byte, fromDocs bool) *contentPageDraft {
	body, meta, hasMeta, err := parseContentFrontMatter(string(data))
	if !hasMeta {
		pp.warnContentPage("custom page has no front matter; using filename defaults", sourcePath, nil)
	}
	if err != nil {
		pp.warnContentPage("custom page front matter could not be parsed; using filename defaults", sourcePath, err)
		meta = contentPageFrontMatter{}
	}
	sourceDir := contentDir(sourcePath)
	return &contentPageDraft{
		convention:    convention,
		hasConvention: hasConvention,
		sourcePath:    sourcePath,
		sourceRelPath: sourceRelPath,
		sourceDir:     sourceDir,
		body:          body,
		meta:          meta,
		hasMeta:       hasMeta,
		fromDocs:      fromDocs,
	}
}

func (pp *PrintingPress) resolveContentPages(drafts []*contentPageDraft) []*ppmodel.ContentPage {
	sort.SliceStable(drafts, func(i, j int) bool {
		left, right := drafts[i], drafts[j]
		leftOrder := contentDraftOrder(left)
		rightOrder := contentDraftOrder(right)
		if leftOrder != rightOrder {
			return leftOrder < rightOrder
		}
		leftPresetOrder := contentDraftPresetOrder(left)
		rightPresetOrder := contentDraftPresetOrder(right)
		if leftPresetOrder != rightPresetOrder {
			return leftPresetOrder < rightPresetOrder
		}
		return left.sourcePath < right.sourcePath
	})
	pages := make([]*ppmodel.ContentPage, 0, len(drafts))
	used := make(map[string]struct{}, len(drafts))
	for _, draft := range drafts {
		page := pp.resolveContentPage(draft)
		if page == nil {
			continue
		}
		if _, exists := used[page.Slug]; exists {
			pp.warnContentPage("custom page slug conflicts with an earlier page; dropping page", page.Slug, nil)
			continue
		}
		used[page.Slug] = struct{}{}
		pages = append(pages, page)
	}
	return pages
}

func (pp *PrintingPress) resolveContentPage(draft *contentPageDraft) *ppmodel.ContentPage {
	if draft == nil {
		return nil
	}
	defaultTitle := contentDraftDefaultTitle(draft)
	defaultSlug := contentDraftDefaultSlug(draft)
	title := strings.TrimSpace(draft.meta.Title)
	if title == "" {
		title = defaultTitle
	}
	label := strings.TrimSpace(draft.meta.Label)
	if label == "" {
		label = title
	}
	rawSlug := strings.TrimSpace(draft.meta.Slug)
	if rawSlug == "" {
		rawSlug = defaultSlug
	}
	slugPath, ok := sanitizeContentSlugPath(rawSlug)
	if !ok || isReservedContentSlug(slugPath) {
		pp.warnContentPage("custom page slug is reserved or invalid; using filename default", rawSlug, nil)
		slugPath, ok = sanitizeContentSlugPath(defaultSlug)
		if !ok || isReservedContentSlug(slugPath) {
			pp.warnContentPage("custom page default slug is reserved or invalid; dropping page", draft.sourcePath, nil)
			return nil
		}
	}
	return &ppmodel.ContentPage{
		Title:       title,
		Label:       label,
		Slug:        slugPath,
		Href:        pppaths.ContentPageHTML(slugPath),
		Description: strings.TrimSpace(draft.meta.Description),
		SourcePath:  draft.sourcePath,
		SourceDir:   draft.sourceDir,
		SourceAlias: append([]string(nil), draft.aliases...),
		Body:        draft.body,
		Order:       contentDraftOrder(draft),
		Hidden:      draft.meta.Hidden,
	}
}

func (pp *PrintingPress) renderContentPage(ctx *contentPageContext, page *ppmodel.ContentPage) {
	if ctx == nil || page == nil {
		return
	}
	body := pp.expandContentPartials(ctx, page, page.Body)
	extension := &contentRewriteExtension{
		rewriteLink: func(raw string) (string, bool) {
			return pp.rewriteContentPageLink(ctx, page, raw)
		},
		rewriteImage: func(raw string) (string, bool) {
			return pp.rewriteContentPageImage(ctx, page, raw)
		},
	}
	page.BodyHTML = renderMarkdownWithExtensions(body, pp.engineConfig.NoMermaid, extension)
}

type contentPartialExpansionState struct {
	expansions int
	truncated  bool
}

func (pp *PrintingPress) expandContentPartials(ctx *contentPageContext, page *ppmodel.ContentPage, body string) string {
	state := &contentPartialExpansionState{}
	expanded := pp.expandContentPartialsWithState(ctx, page, body, nil, 0, state)
	if state.truncated {
		pp.warnContentPage("custom page partial expansion exceeded max size", page.SourcePath, nil)
	}
	return expanded
}

func (pp *PrintingPress) expandContentPartialsWithState(ctx *contentPageContext, page *ppmodel.ContentPage, body string, stack map[string]struct{}, depth int, state *contentPartialExpansionState) string {
	if state == nil {
		state = &contentPartialExpansionState{}
	}
	if depth > contentPartialMaxDepth {
		pp.warnContentPage("custom page partial expansion exceeded max depth", page.SourcePath, nil)
		return body
	}
	if len(body) > contentPartialExpandLimit {
		pp.warnContentPage("custom page partial expansion exceeded max size", page.SourcePath, nil)
		return body[:contentPartialExpandLimit]
	}
	var builder strings.Builder
	inFence := false
	for len(body) > 0 && !state.truncated {
		line := body
		body = ""
		if idx := strings.IndexByte(line, '\n'); idx >= 0 {
			line, body = line[:idx+1], line[idx+1:]
		}
		if isContentFenceLine(line) {
			appendContentPartialLimited(&builder, line, state)
			inFence = !inFence
			continue
		}
		if inFence {
			appendContentPartialLimited(&builder, line, state)
			continue
		}
		pp.expandContentPartialSegment(ctx, page, line, stack, depth, state, &builder)
	}
	return builder.String()
}

func (pp *PrintingPress) expandContentPartialSegment(ctx *contentPageContext, page *ppmodel.ContentPage, segment string, stack map[string]struct{}, depth int, state *contentPartialExpansionState, builder *strings.Builder) {
	for len(segment) > 0 && !state.truncated {
		match := partialPattern.FindStringSubmatchIndex(segment)
		if match == nil {
			appendContentPartialLimited(builder, segment, state)
			return
		}
		appendContentPartialLimited(builder, segment[:match[0]], state)
		if state.truncated {
			return
		}
		name := strings.TrimSpace(segment[match[2]:match[3]])
		segment = segment[match[1]:]
		if name == "" || strings.Contains(name, "\x00") {
			pp.warnContentPage("custom page partial path is invalid", page.SourcePath, nil)
			appendContentPartialLimited(builder, visibleContentPlaceholder("partial could not be loaded"), state)
			continue
		}
		if state.expansions >= contentPartialMaxExpansions {
			pp.warnContentPage("custom page partial expansion exceeded max include count", page.SourcePath, nil)
			appendContentPartialLimited(builder, visibleContentPlaceholder("partial expansion limit reached"), state)
			continue
		}
		state.expansions++
		data, source, err := pp.readContentPartial(ctx, name)
		if err != nil {
			pp.warnContentPage("custom page partial could not be loaded", name, err)
			appendContentPartialLimited(builder, visibleContentPlaceholder("partial "+strconv.Quote(name)+" could not be loaded"), state)
			continue
		}
		key := canonicalContentPath(ctx.loader, source)
		if stack == nil {
			stack = make(map[string]struct{})
		}
		if _, seen := stack[key]; seen {
			pp.warnContentPage("custom page partial include cycle detected", name, nil)
			appendContentPartialLimited(builder, visibleContentPlaceholder("partial "+strconv.Quote(name)+" could not be loaded"), state)
			continue
		}
		nextStack := make(map[string]struct{}, len(stack)+1)
		for k, v := range stack {
			nextStack[k] = v
		}
		nextStack[key] = struct{}{}
		partialBody, _, _, _ := parseContentFrontMatter(string(data))
		expanded := pp.expandContentPartialsWithState(ctx, page, partialBody, nextStack, depth+1, state)
		appendContentPartialLimited(builder, expanded, state)
	}
}

func appendContentPartialLimited(builder *strings.Builder, value string, state *contentPartialExpansionState) {
	if value == "" || state.truncated {
		return
	}
	remaining := contentPartialExpandLimit - builder.Len()
	if remaining <= 0 {
		state.truncated = true
		return
	}
	if len(value) > remaining {
		builder.WriteString(value[:remaining])
		state.truncated = true
		return
	}
	builder.WriteString(value)
}

func isContentFenceLine(line string) bool {
	trimmed := strings.TrimLeft(line, " \t")
	return strings.HasPrefix(trimmed, "```") || strings.HasPrefix(trimmed, "~~~")
}

func (pp *PrintingPress) readContentPartial(ctx *contentPageContext, name string) ([]byte, string, error) {
	sourcePartialRoot, _ := ctx.loader.Resolve(ctx.root, "_partials")
	docsPartialRoot := ""
	if ctx.docsRoot != "" {
		docsPartialRoot, _ = ctx.loader.Resolve(ctx.docsRoot, "_partials")
	}
	rootPath, err := ctx.loader.Resolve(sourcePartialRoot, name)
	if err != nil {
		return nil, "", err
	}
	rootData, rootResult, rootErr := ctx.loader.Read(rootPath, contentPartialReadLimit)
	if rootErr == nil {
		if docsPartialRoot != "" {
			if docsPath, err := ctx.loader.Resolve(docsPartialRoot, name); err == nil {
				if exists, err := ctx.loader.Exists(docsPath); err == nil && exists {
					pp.warnContentPage("custom page partial in docs ignored because root partial takes precedence", docsPath, nil)
				}
			}
		}
		return rootData, rootResult.Path, nil
	}
	if !isContentNotFound(rootErr, rootResult) {
		return nil, rootPath, rootErr
	}
	if docsPartialRoot == "" {
		return nil, rootPath, errContentNotFound
	}
	docsPath, err := ctx.loader.Resolve(docsPartialRoot, name)
	if err != nil {
		return nil, "", err
	}
	docsData, docsResult, docsErr := ctx.loader.Read(docsPath, contentPartialReadLimit)
	if docsErr != nil {
		return nil, docsPath, docsErr
	}
	return docsData, docsResult.Path, nil
}

func (pp *PrintingPress) rewriteContentPageLink(ctx *contentPageContext, page *ppmodel.ContentPage, raw string) (string, bool) {
	if shouldSkipContentHref(raw) {
		return "", false
	}
	target, fragment := splitMarkdownHref(raw)
	if strings.TrimSpace(target) == "" {
		return "", false
	}
	if strings.ToLower(path.Ext(target)) != pppaths.ExtMarkdown {
		return "", false
	}
	resolved, err := ctx.loader.Resolve(page.SourceDir, target)
	if err != nil {
		pp.warnContentPage("custom page link could not be resolved", raw, err)
		return "", false
	}
	href, ok := ctx.linkByPath[canonicalContentPath(ctx.loader, resolved)]
	if !ok {
		pp.warnContentPage("custom page link target was not rendered; leaving original link", raw, nil)
		return "", false
	}
	return relativeContentHref(page.Href, href) + fragment, true
}

func (pp *PrintingPress) rewriteContentPageImage(ctx *contentPageContext, page *ppmodel.ContentPage, raw string) (string, bool) {
	if shouldSkipContentHref(raw) {
		return "", false
	}
	target, fragment := splitMarkdownHref(raw)
	ext := strings.ToLower(path.Ext(target))
	if _, ok := supportedContentImageExtensions[ext]; !ok {
		return "", false
	}
	resolved, err := ctx.loader.Resolve(page.SourceDir, target)
	if err != nil {
		pp.warnContentPage("custom page image could not be resolved", raw, err)
		return "", false
	}
	data, result, err := ctx.loader.Read(resolved, contentImageAssetReadLimit)
	if err != nil {
		if errors.Is(err, errContentSizeLimit) {
			pp.warnContentPage("custom page image exceeds 5 MB; leaving original link", raw, err)
		} else {
			pp.warnContentPage("custom page image could not be copied; leaving original link", raw, err)
		}
		_ = result
		return "", false
	}
	name := safeContentAssetName(target)
	sourceKey := canonicalContentPath(ctx.loader, result.Path)
	href := pppaths.ContentAsset(page.Slug, name)
	for attempt := 0; ; attempt++ {
		conflict := false
		for _, existing := range page.Assets {
			if existing == nil || existing.Href != href {
				continue
			}
			if existing.SourcePath == sourceKey || bytes.Equal(existing.Data, data) {
				return relativeContentHref(page.Href, href) + fragment, true
			}
			conflict = true
			break
		}
		if !conflict {
			break
		}
		href = pppaths.ContentAsset(page.Slug, disambiguateContentAssetName(name, attempt+2))
	}
	page.Assets = append(page.Assets, &ppmodel.ContentPageAsset{Href: href, SourcePath: sourceKey, Data: data})
	return relativeContentHref(page.Href, href) + fragment, true
}

func parseContentFrontMatter(raw string) (body string, meta contentPageFrontMatter, hasMeta bool, err error) {
	normalized := strings.ReplaceAll(raw, "\r\n", "\n")
	if !strings.HasPrefix(normalized, "---\n") {
		return raw, meta, false, nil
	}
	rest := normalized[len("---\n"):]
	end, delimiterLen := findContentFrontMatterClose(rest)
	if end < 0 {
		return raw, meta, false, fmt.Errorf("front matter close delimiter not found")
	}
	fm := rest[:end]
	bodyStart := end + delimiterLen
	body = rest[bodyStart:]
	if err := yaml.Unmarshal([]byte(fm), &meta); err != nil {
		return raw, contentPageFrontMatter{}, true, err
	}
	if strings.TrimSpace(fm) != "" && !contentFrontMatterHasRecognizedKey(meta) {
		return raw, contentPageFrontMatter{}, true, fmt.Errorf("front matter did not contain recognized keys")
	}
	return body, meta, true, nil
}

func contentFrontMatterHasRecognizedKey(meta contentPageFrontMatter) bool {
	return strings.TrimSpace(meta.Title) != "" ||
		strings.TrimSpace(meta.Label) != "" ||
		strings.TrimSpace(meta.Slug) != "" ||
		meta.Order != nil ||
		strings.TrimSpace(meta.Description) != "" ||
		meta.Hidden
}

func findContentFrontMatterClose(rest string) (int, int) {
	offset := 0
	for len(rest) > 0 {
		line := rest
		advance := len(rest)
		if idx := strings.IndexByte(rest, '\n'); idx >= 0 {
			line = rest[:idx]
			advance = idx + 1
		}
		trimmed := strings.TrimSpace(line)
		if trimmed == "---" {
			return offset, advance
		}
		offset += advance
		rest = rest[advance:]
	}
	return -1, 0
}

func contentDraftOrder(draft *contentPageDraft) int {
	if draft != nil && draft.meta.Order != nil {
		return *draft.meta.Order
	}
	if draft == nil {
		return 0
	}
	return contentDraftPresetOrder(draft)
}

func contentDraftPresetOrder(draft *contentPageDraft) int {
	if draft == nil {
		return 0
	}
	if !draft.hasConvention {
		return contentPageDefaultOrder
	}
	return draft.convention.order
}

func contentDraftDefaultTitle(draft *contentPageDraft) string {
	if draft == nil {
		return ""
	}
	if draft.hasConvention && strings.TrimSpace(draft.convention.title) != "" {
		return draft.convention.title
	}
	return contentTitleFromFilename(draft.sourcePath)
}

func contentDraftDefaultSlug(draft *contentPageDraft) string {
	if draft == nil {
		return ""
	}
	if draft.hasConvention && strings.TrimSpace(draft.convention.slug) != "" {
		return draft.convention.slug
	}
	if strings.TrimSpace(draft.sourceRelPath) != "" {
		return contentSlugFromContentPath(draft.sourceRelPath)
	}
	return contentSlugFromFilename(draft.sourcePath)
}

func conventionalContentPageForSource(source contentPageSource) (conventionalContentPage, bool) {
	relPath := strings.TrimSpace(filepath.ToSlash(source.relPath))
	if relPath != "" && relPath != strings.TrimSpace(source.filename) {
		return conventionalContentPage{}, false
	}
	key := contentPageSourceKey(source.filename)
	for _, convention := range conventionalContentPages {
		if contentPageSourceKey(convention.filename) == key {
			return convention, true
		}
	}
	return conventionalContentPage{}, false
}

func contentPageSourceKey(filename string) string {
	return strings.ToLower(strings.TrimSpace(filename))
}

func isContentMarkdownFile(entry os.DirEntry) bool {
	if entry == nil || entry.IsDir() {
		return false
	}
	name := strings.TrimSpace(entry.Name())
	if name == "" || strings.HasPrefix(name, ".") {
		return false
	}
	return strings.EqualFold(filepath.Ext(name), pppaths.ExtMarkdown)
}

func isContentPageSkipDir(name string) bool {
	name = strings.TrimSpace(name)
	return name == "" || strings.HasPrefix(name, ".") || name == "_partials"
}

func contentTitleFromFilename(rawPath string) string {
	stem := contentFilenameStem(rawPath)
	if stem == "" {
		return "Page"
	}
	normalized := strings.NewReplacer("-", " ", "_", " ", ".", " ").Replace(stem)
	words := strings.Fields(normalized)
	if len(words) == 0 {
		return "Page"
	}
	for i, word := range words {
		words[i] = contentTitleWord(word)
	}
	return strings.Join(words, " ")
}

func contentSlugFromContentPath(rawPath string) string {
	stemPath := strings.TrimSuffix(filepath.ToSlash(strings.TrimSpace(rawPath)), path.Ext(filepath.ToSlash(strings.TrimSpace(rawPath))))
	parts := strings.Split(stemPath, "/")
	slugs := make([]string, 0, len(parts))
	for _, part := range parts {
		slug := slugpkg.Sanitize(part)
		if slug == "" {
			continue
		}
		slugs = append(slugs, slug)
	}
	if len(slugs) == 0 {
		return "page"
	}
	return strings.Join(slugs, "/")
}

func contentSlugFromFilename(rawPath string) string {
	stem := contentFilenameStem(rawPath)
	slug := slugpkg.Sanitize(stem)
	if slug == "" {
		return "page"
	}
	return slug
}

func contentFilenameStem(rawPath string) string {
	base := rawPath
	if isURLString(rawPath) {
		parsed, err := url.Parse(rawPath)
		if err == nil {
			base = path.Base(parsed.Path)
		}
	} else {
		base = filepath.Base(rawPath)
	}
	ext := filepath.Ext(base)
	if isURLString(rawPath) {
		ext = path.Ext(base)
	}
	return strings.TrimSuffix(base, ext)
}

func contentTitleWord(word string) string {
	lower := strings.ToLower(strings.TrimSpace(word))
	switch lower {
	case "":
		return ""
	case "api":
		return "API"
	case "apis":
		return "APIs"
	case "faq":
		return "FAQ"
	case "sdk":
		return "SDK"
	case "sdks":
		return "SDKs"
	case "http":
		return "HTTP"
	case "https":
		return "HTTPS"
	case "id":
		return "ID"
	case "json":
		return "JSON"
	case "oas":
		return "OAS"
	case "yaml":
		return "YAML"
	}
	runes := []rune(lower)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
}

func sanitizeContentSlugPath(raw string) (string, bool) {
	raw = strings.TrimSpace(strings.ReplaceAll(raw, "\\", "/"))
	raw = strings.Trim(raw, "/")
	if raw == "" || raw == "." {
		return "", false
	}
	segments := strings.Split(raw, "/")
	sanitized := make([]string, 0, len(segments))
	for _, segment := range segments {
		if segment == "" || segment == "." || segment == ".." {
			return "", false
		}
		clean := slugpkg.Sanitize(segment)
		if clean == "" || clean == "." || clean == ".." {
			return "", false
		}
		sanitized = append(sanitized, clean)
	}
	return path.Join(sanitized...), true
}

func isReservedContentSlug(slugPath string) bool {
	if _, ok := reservedContentExactRoutes[slugPath]; ok {
		return true
	}
	first := slugPath
	if before, _, ok := strings.Cut(slugPath, "/"); ok {
		first = before
	}
	_, ok := reservedContentRoutes[first]
	return ok
}

func contentDir(rawPath string) string {
	if isURLString(rawPath) {
		parsed, err := url.Parse(rawPath)
		if err != nil {
			return rawPath
		}
		parsed.Path = path.Dir(parsed.Path)
		return strings.TrimRight(parsed.String(), "/")
	}
	return filepath.Dir(rawPath)
}

func canonicalContentPath(loader *contentLoader, rawPath string) string {
	if isURLString(rawPath) {
		parsed, err := url.Parse(rawPath)
		if err != nil {
			return rawPath
		}
		parsed.Fragment = ""
		parsed.RawQuery = ""
		parsed.Path = path.Clean(parsed.Path)
		return parsed.String()
	}
	if loader != nil {
		if resolved, err := loader.resolveLocalPath(rawPath); err == nil {
			return resolved
		}
	}
	abs, err := filepath.Abs(rawPath)
	if err != nil {
		return filepath.Clean(rawPath)
	}
	return filepath.Clean(abs)
}

func shouldSkipContentHref(raw string) bool {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" || strings.HasPrefix(trimmed, "#") || strings.HasPrefix(trimmed, "/") {
		return true
	}
	if strings.HasPrefix(strings.ToLower(trimmed), "mailto:") || strings.HasPrefix(strings.ToLower(trimmed), "data:") {
		return true
	}
	parsed, err := url.Parse(trimmed)
	return err == nil && parsed.Scheme != ""
}

func safeContentAssetName(raw string) string {
	base := path.Base(strings.TrimSpace(raw))
	if before, _, ok := strings.Cut(base, "?"); ok {
		base = before
	}
	if before, _, ok := strings.Cut(base, "#"); ok {
		base = before
	}
	ext := path.Ext(base)
	stem := strings.TrimSuffix(base, ext)
	stem = strings.Map(func(r rune) rune {
		switch {
		case unicode.IsLetter(r), unicode.IsDigit(r):
			return unicode.ToLower(r)
		case r == '-', r == '_':
			return r
		default:
			return '-'
		}
	}, stem)
	stem = strings.Trim(stem, "-_")
	if stem == "" {
		stem = "asset"
	}
	return slugpkg.Bound(stem) + strings.ToLower(ext)
}

func disambiguateContentAssetName(name string, index int) string {
	if index < 2 {
		return name
	}
	ext := path.Ext(name)
	stem := strings.TrimSuffix(name, ext)
	if stem == "" {
		stem = "asset"
	}
	return stem + "-" + strconv.Itoa(index) + ext
}

func visibleContentPlaceholder(message string) string {
	return "\n\n> " + message + "\n\n"
}

func relativeContentHref(fromPageHref, targetHref string) string {
	depth := contentPageDepth(fromPageHref)
	if depth <= 0 {
		return targetHref
	}
	return path.Clean(strings.Repeat("../", depth) + targetHref)
}

func isContentNotFound(err error, result pageLoadResult) bool {
	return result.NotFound || errors.Is(err, errContentNotFound)
}

func (pp *PrintingPress) warnContentPage(message, context string, err error) {
	if pp == nil || pp.engineConfig == nil || pp.engineConfig.Logger == nil {
		return
	}
	args := []any{"context", context}
	if err != nil {
		args = append(args, "error", err)
	}
	pp.engineConfig.Logger.Warn("printingpress: "+message, args...)
}

func contentPagesForNav(pages []*ppmodel.ContentPage) []*ppmodel.ContentPage {
	if len(pages) == 0 {
		return nil
	}
	result := make([]*ppmodel.ContentPage, 0, len(pages))
	for _, page := range pages {
		if page == nil || page.Hidden {
			continue
		}
		result = append(result, &ppmodel.ContentPage{
			Title:       page.Title,
			Label:       page.Label,
			Slug:        page.Slug,
			Href:        page.Href,
			Description: page.Description,
			Order:       page.Order,
		})
	}
	return result
}

func hasContentPagesForNav(pages []*ppmodel.ContentPage) bool {
	for _, page := range pages {
		if page != nil && !page.Hidden {
			return true
		}
	}
	return false
}

func contentPageDepth(href string) int {
	dir := path.Dir(href)
	if dir == "." || dir == "/" {
		return 0
	}
	return strings.Count(strings.Trim(dir, "/"), "/") + 1
}

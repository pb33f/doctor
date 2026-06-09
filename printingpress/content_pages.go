// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"errors"
	"fmt"
	"net/url"
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
	convention conventionalContentPage
	sourcePath string
	sourceDir  string
	aliases    []string
	body       string
	meta       contentPageFrontMatter
	hasMeta    bool
	fromDocs   bool
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
	drafts := make([]*contentPageDraft, 0, len(conventionalContentPages))
	for _, convention := range conventionalContentPages {
		rootPath, err := ctx.loader.Resolve(ctx.root, convention.filename)
		if err != nil {
			pp.warnContentPage("custom page path could not be resolved; skipping", convention.filename, err)
			continue
		}
		docsPath := ""
		if ctx.docsRoot != "" {
			docsPath, _ = ctx.loader.Resolve(ctx.docsRoot, convention.filename)
		}
		rootData, rootResult, rootErr := ctx.loader.Read(rootPath, contentPageReadLimit)
		if rootErr == nil {
			var aliases []string
			if docsPath != "" {
				if exists, err := ctx.loader.Exists(docsPath); err == nil && exists {
					pp.warnContentPage("custom page in docs ignored because root page takes precedence", docsPath, nil)
					aliases = append(aliases, docsPath)
				}
			}
			draft := pp.newContentPageDraft(ctx, convention, rootResult.Path, rootData, false)
			if draft != nil {
				draft.aliases = aliases
				drafts = append(drafts, draft)
			}
			continue
		}
		if !isContentNotFound(rootErr, rootResult) {
			pp.warnContentPage("custom page could not be read; skipping", rootPath, rootErr)
			continue
		}
		if docsPath == "" {
			continue
		}
		docsData, docsResult, docsErr := ctx.loader.Read(docsPath, contentPageReadLimit)
		if docsErr == nil {
			draft := pp.newContentPageDraft(ctx, convention, docsResult.Path, docsData, true)
			if draft != nil {
				drafts = append(drafts, draft)
			}
			continue
		}
		if !isContentNotFound(docsErr, docsResult) {
			pp.warnContentPage("custom page could not be read; skipping", docsPath, docsErr)
		}
	}
	return drafts
}

func (pp *PrintingPress) newContentPageDraft(ctx *contentPageContext, convention conventionalContentPage, sourcePath string, data []byte, fromDocs bool) *contentPageDraft {
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
		convention: convention,
		sourcePath: sourcePath,
		sourceDir:  sourceDir,
		body:       body,
		meta:       meta,
		hasMeta:    hasMeta,
		fromDocs:   fromDocs,
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
		if left.convention.order != right.convention.order {
			return left.convention.order < right.convention.order
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
	defaultTitle := draft.convention.title
	defaultSlug := draft.convention.slug
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
	return draft.convention.order
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

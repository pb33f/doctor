// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	htmlstd "html"
	"html/template"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
	"github.com/pb33f/doctor/printingpress/theme"
)

// themeStack loads the directory build's theme once.
func (ap *AggregatePrintingPress) themeStack() (*theme.Stack, error) {
	if ap.theme != nil {
		return ap.theme, nil
	}
	stack, err := render.LoadTheme(ap.config.Theme, ap.siteLayoutsDir())
	if err != nil {
		return nil, err
	}
	ap.theme = stack
	return stack, nil
}

// siteLayoutsDir is the site's own layouts folder: the configured one, or
// layouts/ under the scan root.
func (ap *AggregatePrintingPress) siteLayoutsDir() string {
	if dir := strings.TrimSpace(ap.config.SiteLayouts); dir != "" {
		return dir
	}
	if root := strings.TrimSpace(ap.config.ScanRoot); root != "" {
		return filepath.Join(root, "layouts")
	}
	return ""
}

// writeCatalogPage draws one directory-build page through the theme. A theme
// template that fails is logged with the page, and the page is skipped.
func (ap *AggregatePrintingPress) writeCatalogPage(filePath string, page catalogPageData) error {
	stack, err := ap.themeStack()
	if err != nil {
		return err
	}
	view, err := ap.catalogPageView(page, stack)
	var html string
	if err == nil {
		html, err = stack.RenderString(view)
	}
	if err != nil {
		if ap.config.Logger != nil {
			ap.config.Logger.Warn("printingpress: theme template failed; skipping page", "page", filePath, "theme", stack.Name(), "error", err)
		}
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(filePath), 0o755); err != nil {
		return err
	}
	return os.WriteFile(filePath, []byte(html), 0o644)
}

// catalogPageView builds the theme view of a directory-build page, drawing
// its body and header tools through the theme.
func (ap *AggregatePrintingPress) catalogPageView(page catalogPageData, stack *theme.Stack) (*theme.PageView, error) {
	var body template.HTML
	if page.Content.Template != "" {
		var err error
		if body, err = stack.RenderTemplate(page.Content.Template, page.Content.Data); err != nil {
			return nil, err
		}
	}
	fromDir := path.Dir(page.RelPath)
	resolve := func(href string) string { return catalogAssetHref(page.AssetBase, href) }
	extra := []string{
		resolve(pppaths.StaticAsset(pppaths.FilePrintingPressIndexCSS)),
		resolve(pppaths.StaticAsset(pppaths.FilePrintingPressCatalogCSS)),
	}
	markdownHref := ""
	if page.MarkdownHref != "" {
		markdownHref = path.Base(page.MarkdownHref)
	}
	subtitle := page.Subtitle
	if strings.TrimSpace(subtitle) == "" {
		subtitle = ""
	}
	view := &theme.PageView{
		Shape: theme.ShapeSite,
		Page: theme.PageInfo{
			Title:        page.Title,
			Description:  page.MetaDescription,
			MarkdownHref: markdownHref,
			RelPath:      page.RelPath,
			HomeHref:     relativeCatalogHref(fromDir, pppaths.FileIndexHTML),
			Root:         strings.TrimSuffix(relativeCatalogHref(fromDir, pppaths.FileIndexHTML), pppaths.FileIndexHTML),
			Headings:     pageHeadings(string(body)),
		},
		Site: theme.SiteInfo{Title: page.HeaderTitle},
		Head: theme.NewHeadView("", extra, resolve(pppaths.StaticAsset(pppaths.FilePrintingPressJS)),
			func(name string) string { return resolve(pppaths.StaticAsset(name)) },
			func(name string) string { return resolve(path.Join(stack.AssetDir(), name)) },
		),
		Hero:    theme.HeroView{ShowTitle: page.ShowHeroTitle, Title: page.Title, Subtitle: subtitle},
		Footer:  render.FooterView(page.Footer),
		Content: body,
	}
	if catalog := ap.catalog; catalog != nil {
		view.Site.Kind = catalog.Kind
		view.Site.Brand = catalog.Brand
		view.Site.Nav = siteNavView(catalog, page.RelPath)
	}
	view.Engine.AfterBody = template.HTML(catalogVersionSelectScriptHTML())
	if catalogPageHasNav(page) {
		view.Shape = theme.ShapeSiteNav
		var attrs strings.Builder
		if strings.TrimSpace(page.AssetBase) != "" {
			if err := writeCatalogOptionalAttr(&attrs, "data-pp-base-url", page.AssetBase); err != nil {
				return nil, err
			}
		}
		view.Engine.BodyAttrs = template.HTMLAttr(attrs.String())
		view.Engine.Nav = template.HTML(`<pp-nav id="pp-nav" slot="nav" data-active="` + htmlstd.EscapeString(page.ActiveNavSlug) + `" data-pp-preview-hold="true">` + catalogNavHTML(page) + `</pp-nav>`)
		return view, nil
	}
	if picker := catalogHeaderVersionPicker(fromDir, page.RelPath, page.Service); picker != nil {
		tools, err := stack.RenderTemplate(templateCatalogVersionPicker, picker)
		if err != nil {
			return nil, err
		}
		view.Engine.HeaderTools = tools
	}
	return view, nil
}

// siteNavView is the navigation tree with hrefs relative to the page, for
// themes that draw their own navigation. Agents-only items are left out.
func siteNavView(catalog *ppmodel.CatalogSite, relPath string) *theme.NavView {
	if catalog == nil || catalog.Nav == nil {
		return nil
	}
	fromDir := path.Dir(relPath)
	href := func(target string) string {
		if target == "" {
			return ""
		}
		return relativeCatalogHref(fromDir, target)
	}
	var items func([]*ppmodel.SiteNavItem) []*theme.NavItemView
	items = func(source []*ppmodel.SiteNavItem) []*theme.NavItemView {
		out := make([]*theme.NavItemView, 0, len(source))
		for _, item := range source {
			if !item.Audience.ForHumans() {
				continue
			}
			view := &theme.NavItemView{Kind: item.Kind, Title: item.Title, Active: item.Href != "" && item.Href == relPath}
			if item.Kind == ppmodel.SiteNavItemLink {
				view.Href, view.External = item.Href, true
			} else {
				view.Href = href(item.Href)
			}
			view.Children = items(item.Children)
			out = append(out, view)
		}
		return out
	}
	nav := &theme.NavView{}
	for _, tab := range catalog.Nav.Tabs {
		tabView := &theme.NavTabView{Title: tab.Title, Href: href(tab.Href), IsHome: isHomeTab(tab)}
		for _, section := range tab.Sections {
			sectionView := &theme.NavSectionView{Title: section.Title, Href: href(section.Href), Active: section.Href != "" && section.Href == relPath}
			sectionView.Items = items(section.Items)
			if sectionView.Active || navItemsActive(sectionView.Items) {
				tabView.Active = true
			}
			tabView.Sections = append(tabView.Sections, sectionView)
		}
		if tab.Href == relPath {
			tabView.Active = true
		}
		nav.Tabs = append(nav.Tabs, tabView)
	}
	return nav
}

func navItemsActive(items []*theme.NavItemView) bool {
	for _, item := range items {
		if item.Active || navItemsActive(item.Children) {
			return true
		}
	}
	return false
}

// headingPattern finds second and third level headings that carry an id, as
// the Markdown renderer writes them.
var headingPattern = regexp.MustCompile(`<h([23]) id="([^"]+)"[^>]*>(.*?)</h[23]>`)

var tagPattern = regexp.MustCompile(`<[^>]+>`)

// pageHeadings lists a body's headings for a table of contents.
func pageHeadings(body string) []theme.HeadingView {
	matches := headingPattern.FindAllStringSubmatch(body, -1)
	headings := make([]theme.HeadingView, 0, len(matches))
	for _, match := range matches {
		text := strings.TrimSpace(htmlstd.UnescapeString(tagPattern.ReplaceAllString(match[3], "")))
		if text == "" {
			continue
		}
		level := 2
		if match[1] == "3" {
			level = 3
		}
		headings = append(headings, theme.HeadingView{Level: level, ID: htmlstd.UnescapeString(match[2]), Text: text})
	}
	return headings
}

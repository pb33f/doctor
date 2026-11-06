// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	htmlstd "html"
	"path"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

// docsContentPageBreadcrumb is a docs page's path from the home page through
// its tab, section and groups, as the navigation tree has it.
func docsContentPageBreadcrumb(catalog *ppmodel.CatalogSite, page *ppmodel.ContentPage) []render.BreadcrumbItem {
	fromDir := path.Dir(page.Href)
	crumbs := []render.BreadcrumbItem{{Label: strings.ToUpper(siteHomeLabel(catalog)), Href: relativeCatalogHref(fromDir, pppaths.FileIndexHTML)}}
	for _, step := range siteNavTrail(catalog.Nav, page.Href) {
		if step.Href == page.Href {
			continue
		}
		crumb := render.BreadcrumbItem{Label: strings.ToUpper(step.Label)}
		if step.Href != "" {
			crumb.Href = relativeCatalogHref(fromDir, step.Href)
		}
		crumbs = append(crumbs, crumb)
	}
	return append(crumbs, render.BreadcrumbItem{Label: catalogContentPageBreadcrumbLabel(page)})
}

// docsNavHTML draws a docs site's navigation tree for the page at relPath:
// the home link, then each tab with its sections and items.
func docsNavHTML(catalog *ppmodel.CatalogSite, relPath string) string {
	if catalog == nil || catalog.Nav == nil {
		return ""
	}
	fromDir := path.Dir(relPath)
	var builder strings.Builder
	builder.WriteString(`<div class="pp-nav-preview">`)
	builder.WriteString(catalogNavHomeHTML(siteHomeLabel(catalog), relativeCatalogHref(fromDir, pppaths.FileIndexHTML), relPath == pppaths.FileIndexHTML))
	for _, tab := range catalog.Nav.Tabs {
		if !isHomeTab(tab) && tab.Href != "" {
			builder.WriteString(catalogNavHomeHTML(tab.Title, relativeCatalogHref(fromDir, tab.Href), relPath == tab.Href))
		}
		for _, section := range tab.Sections {
			builder.WriteString(`<div class="nav-section nav-pages-section"><h4>`)
			builder.WriteString(htmlstd.EscapeString(section.Title))
			builder.WriteString(`</h4>`)
			builder.WriteString(docsNavItemsHTML(fromDir, relPath, section.Items))
			builder.WriteString(`</div>`)
		}
	}
	builder.WriteString(`</div>`)
	return builder.String()
}

func docsNavItemsHTML(fromDir, relPath string, items []*ppmodel.SiteNavItem) string {
	if len(items) == 0 {
		return ""
	}
	var builder strings.Builder
	builder.WriteString(`<ul class="nav-pages-list">`)
	for _, item := range items {
		if !item.Audience.ForHumans() {
			continue
		}
		builder.WriteString(`<li>`)
		switch {
		case item.Kind == ppmodel.SiteNavItemLink:
			builder.WriteString(catalogNavPageLinkHTML(item.Title, item.Href, false))
		case item.Href != "":
			builder.WriteString(catalogNavPageLinkHTML(item.Title, relativeCatalogHref(fromDir, item.Href), item.Href == relPath))
		default:
			builder.WriteString(`<span class="nav-page-link">` + htmlstd.EscapeString(item.Title) + `</span>`)
		}
		builder.WriteString(docsNavItemsHTML(fromDir, relPath, item.Children))
		builder.WriteString(`</li>`)
	}
	builder.WriteString(`</ul>`)
	return builder.String()
}

func siteNavHasItems(nav *ppmodel.SiteNav) bool {
	if nav == nil {
		return false
	}
	for _, tab := range nav.Tabs {
		for _, section := range tab.Sections {
			if len(section.Items) > 0 || section.Href != "" {
				return true
			}
		}
	}
	return false
}

// docsHomeCardItems is what the docs home lists: the top-level pages, then
// one card for each tab. The API references follow as service cards, so the
// APIs tab is left out here.
func docsHomeCardItems(nav *ppmodel.SiteNav) []*ppmodel.SiteNavItem {
	if nav == nil {
		return nil
	}
	var items []*ppmodel.SiteNavItem
	for _, tab := range nav.Tabs {
		if isHomeTab(tab) {
			for _, section := range tab.Sections {
				items = append(items, section.Items...)
			}
			continue
		}
		if tab.Slug == docsAPIsTabSlug || tab.Href == "" {
			continue
		}
		items = append(items, &ppmodel.SiteNavItem{Kind: ppmodel.SiteNavItemPage, Title: tab.Title, Href: tab.Href, Description: docsTabDescription(tab)})
	}
	return items
}

// docsTabDescription names a tab's sections, for its card on the home page.
func docsTabDescription(tab *ppmodel.SiteNavTab) string {
	titles := make([]string, 0, len(tab.Sections))
	for _, section := range tab.Sections {
		if section.Title != "" {
			titles = append(titles, section.Title)
		}
	}
	return strings.Join(titles, " · ")
}

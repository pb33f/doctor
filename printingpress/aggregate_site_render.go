// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"io"
	"path"
	"strings"

	"github.com/a-h/templ"
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

// docsContentPageContent draws a docs page: the page itself, the pages of its
// section when it is a section landing page, then previous and next links.
func docsContentPageContent(catalog *ppmodel.CatalogSite, page *ppmodel.ContentPage) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if err := render.ContentPageTemplWithBreadcrumb(page, "", docsContentPageBreadcrumb(catalog, page)).Render(ctx, w); err != nil {
			return err
		}
		fromDir := path.Dir(page.Href)
		if page.SectionIndex {
			if _, err := io.WriteString(w, docsNavItemCardsHTML(fromDir, siteNavSectionItems(catalog.Nav, page.Href))); err != nil {
				return err
			}
		}
		_, err := io.WriteString(w, docsNeighboursHTML(fromDir, catalog.Nav, page.Href))
		return err
	})
}

// docsHomeContent draws the docs folder's top-level _index.md on the home page.
func docsHomeContent(home *ppmodel.ContentPage) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if home == nil {
			return nil
		}
		return render.ContentPageTemplWithBreadcrumb(home, "", nil).Render(ctx, w)
	})
}

// docsNavItemCardsHTML lists items as guide cards, the way the guides index
// does.
func docsNavItemCardsHTML(fromDir string, items []*ppmodel.SiteNavItem) string {
	if len(items) == 0 {
		return ""
	}
	var builder strings.Builder
	builder.WriteString(`<div class="pp-root pp-content-index"><div class="pp-guide-cards">`)
	for _, item := range items {
		if item.Href == "" || !item.Audience.ForHumans() {
			continue
		}
		href := item.Href
		if item.Kind != ppmodel.SiteNavItemLink {
			href = relativeCatalogHref(fromDir, item.Href)
		}
		builder.WriteString(`<a href="` + templ.EscapeString(href) + `" class="pp-guide-card">`)
		builder.WriteString(`<div class="pp-guide-card-title"><sl-icon name="chevron-right" aria-hidden="true"></sl-icon><strong>` + templ.EscapeString(item.Title) + `</strong></div>`)
		if item.Description != "" {
			builder.WriteString(`<p>` + templ.EscapeString(truncateDesc(item.Description, 140)) + `</p>`)
		}
		builder.WriteString(`</a>`)
	}
	builder.WriteString(`</div></div>`)
	return builder.String()
}

// docsNeighboursHTML links the pages before and after href in reading order.
func docsNeighboursHTML(fromDir string, nav *ppmodel.SiteNav, href string) string {
	previous, next := siteNavNeighbours(nav, href)
	if previous == nil && next == nil {
		return ""
	}
	var builder strings.Builder
	builder.WriteString(`<nav class="pp-root pp-content-index pp-content-neighbours" aria-label="Previous and next pages"><div class="pp-guide-cards">`)
	for _, link := range []struct {
		step  *siteNavTrailStep
		label string
	}{{previous, "Previous"}, {next, "Next"}} {
		if link.step == nil {
			continue
		}
		builder.WriteString(`<a href="` + templ.EscapeString(relativeCatalogHref(fromDir, link.step.Href)) + `" class="pp-guide-card" rel="` + strings.ToLower(link.label[:4]) + `">`)
		builder.WriteString(`<div class="pp-guide-card-title"><strong>` + templ.EscapeString(link.label) + `</strong></div>`)
		builder.WriteString(`<p>` + templ.EscapeString(link.step.Label) + `</p></a>`)
	}
	builder.WriteString(`</div></nav>`)
	return builder.String()
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
			builder.WriteString(templ.EscapeString(section.Title))
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
			builder.WriteString(`<span class="nav-page-link">` + templ.EscapeString(item.Title) + `</span>`)
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

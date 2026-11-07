// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const (
	catalogSiteTitleFallback = "API Catalog"
	docsSiteTitleFallback    = "Documentation"
)

// applySite settles what a directory build is, and gives the catalog model its
// kind, title, brand and navigation tree. It runs once content pages and
// services are known, because a directory with no specs is a docs site.
func (ap *AggregatePrintingPress) applySite(catalog *ppmodel.CatalogSite) {
	if catalog == nil {
		return
	}
	catalog.Kind = ap.resolveSiteKind(catalog)
	if strings.TrimSpace(ap.config.Title) == "" {
		catalog.Title = siteTitleFallback(catalog.Kind)
	}
	catalog.Brand = cloneSiteBrand(ap.config.Brand)
	catalog.Nav = ap.buildNav(catalog)
}

// buildNav builds the navigation tree. A catalog keeps one tab of guides and
// services. A docs site uses nav.yaml when there is one, and its folders
// otherwise. A nav.yaml that cannot be read is logged, and the folder
// navigation is used.
func (ap *AggregatePrintingPress) buildNav(catalog *ppmodel.CatalogSite) *ppmodel.SiteNav {
	if !catalog.Kind.IsDocs() {
		return buildCatalogNav(catalog)
	}
	warn := func(message, context string) {
		if ap.config.Logger != nil {
			ap.config.Logger.Warn(message, "context", context)
		}
	}
	if navPath := findSiteNavFile(ap.config.NavPath, ap.config.ScanRoot); navPath != "" {
		file, err := readSiteNavFile(navPath)
		if err == nil {
			return buildSiteNavFromFile(file, newSiteNavFileResolver(navPath, catalog, warn))
		}
		warn("nav.yaml could not be read; using the folder navigation", navPath+": "+err.Error())
	}
	return buildDocsFolderNav(catalog)
}

// resolveSiteKind uses the configured kind when there is one. Otherwise a
// directory with no visible services is a docs site, and anything else is a
// catalog, as it has always been.
func (ap *AggregatePrintingPress) resolveSiteKind(catalog *ppmodel.CatalogSite) ppmodel.SiteKind {
	switch ap.config.SiteKind {
	case ppmodel.SiteKindDocs, ppmodel.SiteKindCatalog:
		return ap.config.SiteKind
	}
	if len(visibleCatalogServices(catalog)) == 0 {
		return ppmodel.SiteKindDocs
	}
	return ppmodel.SiteKindCatalog
}

func siteTitleFallback(kind ppmodel.SiteKind) string {
	if kind.IsDocs() {
		return docsSiteTitleFallback
	}
	return catalogSiteTitleFallback
}

// siteServicesLabel names the API references: "APIs" in a docs site,
// "Services" in a catalog.
func siteServicesLabel(kind ppmodel.SiteKind) string {
	if kind.IsDocs() {
		return "APIs"
	}
	return "Services"
}

// writeSiteServicesHeading writes the heading of the agent files' API list
// and reports whether the list follows. A catalog always has the heading, as
// it always has. A docs site has it only when it holds API references.
func writeSiteServicesHeading(builder *strings.Builder, catalog *ppmodel.CatalogSite) bool {
	if catalog == nil || !catalog.Kind.IsDocs() {
		builder.WriteString("## Services\n\n")
		return true
	}
	if len(visibleCatalogServices(catalog)) == 0 {
		return false
	}
	builder.WriteString("## " + siteServicesLabel(catalog.Kind) + "\n\n")
	return true
}

// siteHomeLabel is the navigation label of the site's home page.
func siteHomeLabel(catalog *ppmodel.CatalogSite) string {
	if catalog != nil && catalog.Kind.IsDocs() && strings.TrimSpace(catalog.Title) != "" {
		return catalog.Title
	}
	return catalogSiteTitleFallback
}

// buildCatalogNav builds a catalog navigation tree: one tab holding the
// guides, then the services.
func buildCatalogNav(catalog *ppmodel.CatalogSite) *ppmodel.SiteNav {
	tab := &ppmodel.SiteNavTab{
		Title: catalog.Title,
		Slug:  "home",
		Href:  pppaths.FileIndexHTML,
	}
	if pages := contentPagesForNav(catalog.ContentPages); len(pages) > 0 {
		section := &ppmodel.SiteNavSection{Title: "Guides", Slug: "guides", Href: pppaths.GuidesIndexHTML()}
		for _, page := range pages {
			section.Items = append(section.Items, &ppmodel.SiteNavItem{
				Kind:        ppmodel.SiteNavItemPage,
				Title:       catalogContentPageNavLabel(page),
				Href:        page.Href,
				Description: page.Description,
			})
		}
		tab.Sections = append(tab.Sections, section)
	}
	if services := visibleCatalogServices(catalog); len(services) > 0 {
		label := siteServicesLabel(catalog.Kind)
		section := &ppmodel.SiteNavSection{Title: label, Slug: strings.ToLower(label)}
		for _, service := range services {
			section.Items = append(section.Items, &ppmodel.SiteNavItem{
				Kind:        ppmodel.SiteNavItemService,
				Title:       service.DisplayName,
				Href:        servicePrimaryHref(service),
				Description: service.Summary,
			})
		}
		tab.Sections = append(tab.Sections, section)
	}
	return &ppmodel.SiteNav{Tabs: []*ppmodel.SiteNavTab{tab}}
}

func cloneSiteBrand(brand *ppmodel.SiteBrand) *ppmodel.SiteBrand {
	if brand == nil {
		return nil
	}
	cloned := *brand
	cloned.HeaderLinks = make([]*ppmodel.SiteHeaderLink, 0, len(brand.HeaderLinks))
	for _, link := range brand.HeaderLinks {
		if link == nil {
			continue
		}
		copied := *link
		cloned.HeaderLinks = append(cloned.HeaderLinks, &copied)
	}
	if len(cloned.HeaderLinks) == 0 {
		cloned.HeaderLinks = nil
	}
	return &cloned
}

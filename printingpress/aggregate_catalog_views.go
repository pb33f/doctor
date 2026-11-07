// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"path"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
	"github.com/pb33f/doctor/printingpress/theme"
)

// The directory-build page templates.
const (
	templateCatalogRoot          = "catalog/root.html"
	templateCatalogVersion       = "catalog/version.html"
	templateCatalogVersionPicker = "catalog/partials/version-picker.html"
	templateDocsPage             = "docs/page.html"
)

// The catalog views hold everything a catalog template places, with links
// already relative to the page, so a theme lays them out and computes
// nothing.

// catalogRootView is the home page of a catalog or a docs site.
type catalogRootView struct {
	Warnings *catalogWarningsView
	// Home is a docs site's top-level _index.md.
	Home      *render.PageData[*ppmodel.ContentPage]
	HomeCards []render.GuideCard
	// ShowServices is false on a docs site with no API references.
	ShowServices bool
	Services     []catalogCardView
}

// catalogVersionView is one version of a service and its entries.
type catalogVersionView struct {
	Card    catalogCardView
	Entries []catalogCardView
}

// docsPageView is one page of a docs site.
type docsPageView struct {
	Page         render.PageData[*ppmodel.ContentPage]
	SectionCards []render.GuideCard
	Neighbours   []render.GuideCard
}

// catalogCardView is one card: a service, a version or a specification entry.
type catalogCardView struct {
	Class string
	// Heading is the title's heading level, 2 or 3.
	Heading     int
	Title       string
	Href        string
	SpecKind    *catalogSpecKindView
	Summary     string
	Contact     *catalogContactView
	Picker      *catalogVersionPickerView
	Diagnostics *catalogDiagnosticsView
}

type catalogSpecKindView struct {
	Machine string
	Label   string
}

type catalogContactView struct {
	Name  string
	Email string
}

// The catalog's version pickers use the theme's view, as the API header does.
type catalogVersionPickerView = theme.VersionPickerView

type catalogVersionOptionView = theme.VersionOptionView

type catalogDiagnosticsView struct {
	Href   string
	Label  string
	Counts []catalogDiagnosticCountView
}

type catalogDiagnosticCountView struct {
	Class string
	Icon  string
	Count int
	Noun  string
}

type catalogWarningsView struct {
	Heading string
	Items   []string
}

const (
	catalogCardClass  = "pp-catalog-card pp-model-card"
	catalogEntryClass = "pp-catalog-entry pp-model-card"
)

// catalogRootContent is the home page body of a catalog or docs site.
func catalogRootContent(catalog *ppmodel.CatalogSite, disableSkippedRendering bool) render.Body {
	var view catalogRootView
	if catalog == nil {
		return render.Body{Template: templateCatalogRoot, Data: view}
	}
	view.ShowServices = true
	if !disableSkippedRendering {
		view.Warnings = catalogWarnings(catalog.Warnings)
	}
	if catalog.Kind.IsDocs() {
		if catalog.HomePage != nil {
			view.Home = &render.PageData[*ppmodel.ContentPage]{Page: catalog.HomePage}
		}
		view.HomeCards = docsNavItemCards(".", docsHomeCardItems(catalog.Nav))
		view.ShowServices = len(visibleCatalogServices(catalog)) > 0
	}
	if view.ShowServices {
		for _, service := range catalog.Services {
			if !hasVisibleCatalogVersions(service) {
				continue
			}
			view.Services = append(view.Services, catalogCardView{
				Class:       catalogCardClass,
				Heading:     2,
				Title:       service.DisplayName,
				Href:        servicePrimaryHref(service),
				Summary:     strings.TrimSpace(catalogServiceSummary(service)),
				Contact:     catalogContact(catalogServiceContact(service)),
				Picker:      catalogCardVersionPicker(".", service),
				Diagnostics: catalogDiagnostics(service.Counts, catalogServiceDiagnosticsHref(".", service)),
			})
		}
	}
	return render.Body{Template: templateCatalogRoot, Data: view}
}

// catalogVersionContent is the page of one service version.
func catalogVersionContent(version *ppmodel.CatalogVersion) render.Body {
	var view catalogVersionView
	if version != nil {
		fromDir := path.Dir(version.OverviewHref)
		view.Card = catalogCardView{
			Class:       catalogCardClass,
			Heading:     2,
			Title:       version.Label,
			Href:        relativeCatalogHref(fromDir, catalogVersionPrimaryHref(version)),
			Summary:     strings.TrimSpace(version.Summary),
			Diagnostics: catalogDiagnostics(version.Counts, catalogVersionDiagnosticsHref(fromDir, version)),
		}
		for _, entry := range visibleCatalogEntries(version) {
			view.Entries = append(view.Entries, catalogCardView{
				Class:       catalogEntryClass,
				Heading:     3,
				Title:       entry.Title,
				Href:        relativeCatalogHref(fromDir, entry.OverviewHref),
				SpecKind:    catalogSpecKind(entry),
				Summary:     strings.TrimSpace(entry.Summary),
				Contact:     catalogContact(entry.Contact),
				Diagnostics: catalogDiagnostics(entry.Counts, catalogEntryDiagnosticsHref(fromDir, entry)),
			})
		}
	}
	return render.Body{Template: templateCatalogVersion, Data: view}
}

// docsContentPageContent is a docs page: the page itself, the pages of its
// section when it is a section landing page, then previous and next links.
func docsContentPageContent(catalog *ppmodel.CatalogSite, page *ppmodel.ContentPage) render.Body {
	fromDir := path.Dir(page.Href)
	view := docsPageView{
		Page:       render.PageData[*ppmodel.ContentPage]{Page: page, Breadcrumb: docsContentPageBreadcrumb(catalog, page)},
		Neighbours: docsNeighbours(fromDir, catalog.Nav, page.Href),
	}
	if page.SectionIndex {
		view.SectionCards = docsNavItemCards(fromDir, siteNavSectionItems(catalog.Nav, page.Href))
	}
	return render.Body{Template: templateDocsPage, Data: view}
}

// docsNavItemCards lists nav items as guide cards. Items without a page, and
// agents-only items, are left out.
func docsNavItemCards(fromDir string, items []*ppmodel.SiteNavItem) []render.GuideCard {
	cards := make([]render.GuideCard, 0, len(items))
	for _, item := range items {
		if item.Href == "" || !item.Audience.ForHumans() {
			continue
		}
		href := item.Href
		if item.Kind != ppmodel.SiteNavItemLink {
			href = relativeCatalogHref(fromDir, item.Href)
		}
		cards = append(cards, render.NewGuideCard(href, item.Title, item.Description))
	}
	return cards
}

// docsNeighbours links the pages before and after href in reading order.
func docsNeighbours(fromDir string, nav *ppmodel.SiteNav, href string) []render.GuideCard {
	previous, next := siteNavNeighbours(nav, href)
	var cards []render.GuideCard
	for _, link := range []struct {
		step  *siteNavTrailStep
		label string
		rel   string
	}{{previous, "Previous", "prev"}, {next, "Next", "next"}} {
		if link.step != nil {
			cards = append(cards, render.GuideCard{Href: relativeCatalogHref(fromDir, link.step.Href), Title: link.label, Description: link.step.Label, Rel: link.rel})
		}
	}
	return cards
}

// catalogCardVersionPicker is the version picker on a service card, or nil
// when the service has one version.
func catalogCardVersionPicker(fromDir string, service *ppmodel.CatalogService) *catalogVersionPickerView {
	versions := catalogCardVersions(service)
	if len(versions) <= 1 {
		return nil
	}
	optionLabel := func(version catalogCardVersion) string {
		if version.latest {
			return version.Label + " (latest)"
		}
		return version.Label
	}
	picker := &catalogVersionPickerView{
		WrapperClass: "version-picker version-picker--card",
		SelectClass:  "pp-catalog-select",
		Trigger:      optionLabel(versions[0]),
	}
	for _, version := range versions {
		if version.latest {
			picker.Trigger = optionLabel(version)
			break
		}
	}
	for _, version := range versions {
		picker.Options = append(picker.Options, catalogVersionOptionView{
			Label:   optionLabel(version),
			Href:    relativeCatalogHref(fromDir, version.Href),
			Checked: version.latest,
		})
	}
	return picker
}

// catalogHeaderVersionPicker is the version picker in a catalog page's
// header, or nil when the service has one version.
func catalogHeaderVersionPicker(fromDir, relPath string, service *ppmodel.CatalogService) *catalogVersionPickerView {
	if !hasCatalogVersionSwitcher(service) {
		return nil
	}
	picker := &catalogVersionPickerView{
		WrapperClass: "version-picker version-picker--catalog",
		SelectClass:  "pp-catalog-select",
		ShowLabel:    true,
		Trigger:      catalogVersionTriggerLabel(relPath, service),
	}
	for _, version := range visibleCatalogVersions(service) {
		picker.Options = append(picker.Options, catalogVersionOptionView{
			Label:   catalogVersionOptionLabel(version),
			Href:    relativeCatalogHref(fromDir, catalogVersionTarget(service, version)),
			Checked: catalogVersionSelected(relPath, service, version),
		})
	}
	return picker
}

func catalogSpecKind(entry *ppmodel.CatalogSpecEntry) *catalogSpecKindView {
	label := catalogEntrySpecKindLabel(entry)
	if label == "" {
		return nil
	}
	return &catalogSpecKindView{Machine: entry.SpecKind.MachineValue(), Label: label}
}

func catalogContact(contact *ppmodel.ContactInfo) *catalogContactView {
	name, email := catalogContactName(contact), catalogContactEmail(contact)
	if name == "" && email == "" {
		return nil
	}
	return &catalogContactView{Name: name, Email: email}
}

// catalogDiagnostics counts lint results for a card, or is nil when there are
// none.
func catalogDiagnostics(counts *ppmodel.ViolationCounts, href string) *catalogDiagnosticsView {
	if counts == nil || counts.Total() == 0 {
		return nil
	}
	view := &catalogDiagnosticsView{Href: strings.TrimSpace(href), Label: catalogDiagnosticsLabel(counts)}
	for _, count := range []struct {
		class, icon      string
		count            int
		singular, plural string
	}{
		{"err", "exclamation-square", counts.Errors, "error", "errors"},
		{"warn", "exclamation-triangle", counts.Warns, "warning", "warnings"},
		{"info", "info-square", counts.Infos, "info", "infos"},
	} {
		if count.count <= 0 {
			continue
		}
		noun := count.plural
		if count.count == 1 {
			noun = count.singular
		}
		view.Counts = append(view.Counts, catalogDiagnosticCountView{Class: count.class, Icon: count.icon, Count: count.count, Noun: noun})
	}
	return view
}

func catalogWarnings(warnings []*ppmodel.BuildWarning) *catalogWarningsView {
	if len(warnings) == 0 {
		return nil
	}
	view := &catalogWarningsView{Heading: "Skipped Render Build"}
	if len(warnings) > 1 {
		view.Heading = "Skipped Render Builds"
	}
	for _, warning := range warnings {
		view.Items = append(view.Items, catalogWarningText(warning))
	}
	return view
}

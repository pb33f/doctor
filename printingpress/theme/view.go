// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package theme

import (
	"html/template"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// Shape is the kind of page a layout draws.
type Shape string

const (
	// ShapeAPI is a page of one API reference: the hydrated pp-layout shell.
	ShapeAPI Shape = "api"
	// ShapeSiteNav is a directory-build page with a navigation column.
	ShapeSiteNav Shape = "site-nav"
	// ShapeSite is a directory-build page with a header and no navigation
	// column, such as a version overview.
	ShapeSite Shape = "site"
)

// PageView is everything layout.html can draw for one page. Engine holds the
// pieces the engine owns (hydration wiring, the pp-nav element, scripts);
// everything else is plain data a theme arranges as it likes.
type PageView struct {
	Shape    Shape
	Embedded bool
	Page     PageInfo
	Site     SiteInfo
	Head     HeadView
	Hero     HeroView
	Footer   FooterView
	Engine   EngineView
	// Content is the page body, already rendered.
	Content template.HTML
}

// IsAPI reports whether the page is an API reference page.
func (v *PageView) IsAPI() bool { return v.Shape == ShapeAPI }

// HasNav reports whether the page has a navigation column.
func (v *PageView) HasNav() bool { return v.Shape == ShapeAPI || v.Shape == ShapeSiteNav }

// PageInfo describes the page itself.
type PageInfo struct {
	// Title is the browser title.
	Title       string
	Description string
	// MarkdownHref is the page.md beside the page, relative to it.
	MarkdownHref string
	// RelPath is the page path from the site root.
	RelPath string
	// HomeHref is the site home, relative to the page.
	HomeHref string
	// Root is the path from the page back to the site root ("" or "../").
	Root string
	// Headings are the page's second and third level headings, for a
	// table of contents.
	Headings []HeadingView
}

// HeadingView is one heading of the page body.
type HeadingView struct {
	Level int
	ID    string
	Text  string
}

// SiteInfo describes the site the page belongs to.
type SiteInfo struct {
	Title string
	// Kind is "docs" or "catalog" for a directory build, empty for a single
	// API reference.
	Kind  ppmodel.SiteKind
	Brand *ppmodel.SiteBrand
	// Nav is the navigation tree, for themes that draw it themselves.
	Nav *NavView
}

// NavView is the navigation tree with hrefs already relative to the page.
type NavView struct {
	Tabs []*NavTabView
}

// NavTabView is one tab.
type NavTabView struct {
	Title    string
	Href     string
	Active   bool
	IsHome   bool
	Sections []*NavSectionView
}

// NavSectionView is one section of a tab.
type NavSectionView struct {
	Title  string
	Href   string
	Active bool
	Items  []*NavItemView
}

// NavItemView is one item; Children hold nested items.
type NavItemView struct {
	Kind     ppmodel.SiteNavItemKind
	Title    string
	Href     string
	External bool
	Active   bool
	Children []*NavItemView
}

// HeadView holds what the page head needs.
type HeadView struct {
	// BaseHref, when set, is written as <base href>.
	BaseHref string
	// Extra lists page-specific stylesheet hrefs, already resolved.
	Extra []string
	// Script is the engine's JS bundle href, already resolved.
	Script string
	// staticHref resolves an engine static asset name to an href.
	staticHref func(name string) string
	// themeHref resolves a theme asset name to an href.
	themeHref func(name string) string
}

// Static returns the href of an engine static asset, such as
// "printing-press.css".
func (h HeadView) Static(name string) string {
	if h.staticHref == nil {
		return "static/" + name
	}
	return h.staticHref(name)
}

// Asset returns the href of one of the theme's own assets.
func (h HeadView) Asset(name string) string {
	if h.themeHref == nil {
		return name
	}
	return h.themeHref(name)
}

// HeroView is the title block some directory-build pages show.
type HeroView struct {
	ShowTitle bool
	Title     string
	Subtitle  string
}

// Show reports whether the hero block has anything to draw.
func (h HeroView) Show() bool { return h.ShowTitle || h.Subtitle != "" }

// FooterView is the footer configuration. Themes supply their own defaults.
type FooterView struct {
	Enabled   bool
	URL       string
	LinkTitle string
	Build     string
}

// EngineView holds engine-rendered fragments. Themes place them; they never
// need to know what is inside.
type EngineView struct {
	// HTMLAttrs are attributes for the <html> element.
	HTMLAttrs template.HTMLAttr
	// BodyAttrs are attributes for the <body> element.
	BodyAttrs template.HTMLAttr
	// Nav is the complete pp-nav element.
	Nav template.HTML
	// HeaderTools are controls for the site header, such as a version picker.
	HeaderTools template.HTML
	// BeforeContent goes at the top of the main area.
	BeforeContent template.HTML
	// AfterBody goes at the end of <body>: hydration and helper scripts.
	AfterBody template.HTML
}

// NewHeadView builds a HeadView with the engine's asset resolvers.
func NewHeadView(baseHref string, extra []string, script string, staticHref, themeHref func(string) string) HeadView {
	return HeadView{BaseHref: baseHref, Extra: extra, Script: script, staticHref: staticHref, themeHref: themeHref}
}

// Current is the tab the page belongs to, or the first tab.
func (n *NavView) Current() *NavTabView {
	if n == nil || len(n.Tabs) == 0 {
		return nil
	}
	for _, tab := range n.Tabs {
		if tab.Active {
			return tab
		}
	}
	return n.Tabs[0]
}

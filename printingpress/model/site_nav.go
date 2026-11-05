// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package model

// SiteKind says what a directory build is: an API catalog, or a docs site
// where API references are one kind of content among others.
type SiteKind string

const (
	// SiteKindCatalog is a directory of API specifications, with optional
	// guides beside them. It is what a directory build has always been.
	SiteKindCatalog SiteKind = "catalog"
	// SiteKindDocs is a documentation site. It may hold zero, one or many API
	// references. Its pages and labels never call it a catalog.
	SiteKindDocs SiteKind = "docs"
)

// IsDocs reports whether the site is a docs site.
func (k SiteKind) IsDocs() bool {
	return k == SiteKindDocs
}

// SiteNavItemKind names what a navigation item points at.
type SiteNavItemKind string

const (
	// SiteNavItemPage is a Markdown content page.
	SiteNavItemPage SiteNavItemKind = "page"
	// SiteNavItemService is an API reference: one catalog service.
	SiteNavItemService SiteNavItemKind = "service"
	// SiteNavItemLink is a link that leaves the site.
	SiteNavItemLink SiteNavItemKind = "link"
	// SiteNavItemGroup is a titled group of items: a nested folder, or a group
	// in nav.yaml. Its Href, when set, is its landing page.
	SiteNavItemGroup SiteNavItemKind = "group"
)

// SiteNav is the typed navigation tree of a directory build: tabs, sections
// in each tab, and items in each section. Templates, agent artifacts and
// hosts read the same tree.
type SiteNav struct {
	Tabs []*SiteNavTab `json:"tabs"`
}

// SiteNavTab is one top-level tab.
type SiteNavTab struct {
	Title    string            `json:"title"`
	Slug     string            `json:"slug"`
	Href     string            `json:"href"`
	Sections []*SiteNavSection `json:"sections,omitempty"`
}

// SiteNavSection is one titled group of items inside a tab.
type SiteNavSection struct {
	Title string         `json:"title"`
	Slug  string         `json:"slug"`
	Href  string         `json:"href,omitempty"`
	Items []*SiteNavItem `json:"items,omitempty"`
}

// SiteNavItem is one entry in a section. Children hold nested items.
type SiteNavItem struct {
	Kind        SiteNavItemKind `json:"kind"`
	Title       string          `json:"title"`
	Href        string          `json:"href"`
	Description string          `json:"description,omitempty"`
	Children    []*SiteNavItem  `json:"children,omitempty"`
}

// SiteBrand is the brand content a directory build shows. Templates render
// it; it never comes from a theme.
type SiteBrand struct {
	Logo        string            `json:"logo,omitempty"`
	Favicon     string            `json:"favicon,omitempty"`
	HeaderLinks []*SiteHeaderLink `json:"headerLinks,omitempty"`
}

// SiteHeaderLink is one link in the site header.
type SiteHeaderLink struct {
	Label string `json:"label"`
	Href  string `json:"href"`
}

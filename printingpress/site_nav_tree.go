// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"path"
	"sort"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const docsAPIsTabSlug = "apis"

// buildDocsFolderNav builds a docs site's navigation from its folders:
//   - top-level pages form the home tab's Guides section;
//   - each top-level folder is a tab, and folders whose _index.md name the
//     same `tab:` share one;
//   - a folder's own pages form a section, each subfolder is a section, and
//     deeper folders nest inside it;
//   - API references form an APIs tab.
//
// A folder's _index.md gives it its title, order and landing page.
func buildDocsFolderNav(catalog *ppmodel.CatalogSite) *ppmodel.SiteNav {
	pages := visibleContentPages(catalog.ContentPages)
	indexes := make(map[string]*ppmodel.ContentPage)
	for _, page := range pages {
		if page.SectionIndex {
			indexes[page.Section] = page
		}
	}

	home := &ppmodel.SiteNavTab{Title: catalog.Title, Slug: "home", Href: pppaths.FileIndexHTML}
	var homeItems []*ppmodel.SiteNavItem
	folders := newDocsFolder("")
	for _, page := range pages {
		if page.SectionIndex {
			folders.ensure(page.Section)
			continue
		}
		if page.Section == "" {
			homeItems = append(homeItems, pageNavItem(page))
			continue
		}
		folders.ensure(page.Section).pages = append(folders.ensure(page.Section).pages, page)
	}
	if len(homeItems) > 0 {
		home.Sections = append(home.Sections, &ppmodel.SiteNavSection{
			Title: "Guides", Slug: "guides", Href: pppaths.GuidesIndexHTML(), Items: homeItems,
		})
	}

	tabs := []*ppmodel.SiteNavTab{home}
	tabByTitle := make(map[string]*ppmodel.SiteNavTab)
	for _, top := range folders.sortedChildren(indexes) {
		index := indexes[top.path]
		title := docsFolderTitle(top.path, index)
		tabTitle := title
		if index != nil && index.Tab != "" {
			tabTitle = index.Tab
		}
		tab := tabByTitle[tabTitle]
		if tab == nil {
			tab = &ppmodel.SiteNavTab{Title: tabTitle, Slug: top.path}
			tabByTitle[tabTitle] = tab
			tabs = append(tabs, tab)
		}
		tab.Sections = append(tab.Sections, top.sections(indexes)...)
		if tab.Href == "" {
			tab.Href = firstSectionsHref(tab.Sections)
		}
	}

	if services := visibleCatalogServices(catalog); len(services) > 0 {
		section := &ppmodel.SiteNavSection{Title: siteServicesLabel(ppmodel.SiteKindDocs), Slug: docsAPIsTabSlug}
		for _, service := range services {
			section.Items = append(section.Items, serviceNavItem(service))
		}
		tabs = append(tabs, &ppmodel.SiteNavTab{
			Title:    siteServicesLabel(ppmodel.SiteKindDocs),
			Slug:     docsAPIsTabSlug,
			Href:     firstSectionsHref([]*ppmodel.SiteNavSection{section}),
			Sections: []*ppmodel.SiteNavSection{section},
		})
	}
	return &ppmodel.SiteNav{Tabs: tabs}
}

// docsFolder is one folder of the docs tree while the nav is built.
type docsFolder struct {
	path     string
	pages    []*ppmodel.ContentPage
	children map[string]*docsFolder
}

func newDocsFolder(folderPath string) *docsFolder {
	return &docsFolder{path: folderPath, children: make(map[string]*docsFolder)}
}

// ensure returns the folder at a docs-relative path, creating each level.
func (f *docsFolder) ensure(folderPath string) *docsFolder {
	if folderPath == "" {
		return f
	}
	current := f
	for _, segment := range strings.Split(folderPath, "/") {
		child := current.children[segment]
		if child == nil {
			child = newDocsFolder(path.Join(current.path, segment))
			current.children[segment] = child
		}
		current = child
	}
	return current
}

// sortedChildren orders sub-folders by their _index.md order, then title.
func (f *docsFolder) sortedChildren(indexes map[string]*ppmodel.ContentPage) []*docsFolder {
	children := make([]*docsFolder, 0, len(f.children))
	for _, child := range f.children {
		children = append(children, child)
	}
	sort.SliceStable(children, func(i, j int) bool {
		left, right := docsFolderOrder(indexes[children[i].path]), docsFolderOrder(indexes[children[j].path])
		if left != right {
			return left < right
		}
		return docsFolderTitle(children[i].path, indexes[children[i].path]) < docsFolderTitle(children[j].path, indexes[children[j].path])
	})
	return children
}

// sections turns a top-level folder into sections: its own pages first, then
// one section per sub-folder.
func (f *docsFolder) sections(indexes map[string]*ppmodel.ContentPage) []*ppmodel.SiteNavSection {
	var sections []*ppmodel.SiteNavSection
	if len(f.pages) > 0 || indexes[f.path] != nil {
		section := &ppmodel.SiteNavSection{Title: docsFolderTitle(f.path, indexes[f.path]), Slug: f.path}
		if index := indexes[f.path]; index != nil {
			section.Href = index.Href
		}
		for _, page := range f.pages {
			section.Items = append(section.Items, pageNavItem(page))
		}
		sections = append(sections, section)
	}
	for _, child := range f.sortedChildren(indexes) {
		section := &ppmodel.SiteNavSection{Title: docsFolderTitle(child.path, indexes[child.path]), Slug: child.path}
		if index := indexes[child.path]; index != nil {
			section.Href = index.Href
		}
		section.Items = child.items(indexes)
		sections = append(sections, section)
	}
	return sections
}

// items lists a folder's pages, then its sub-folders as nested groups.
func (f *docsFolder) items(indexes map[string]*ppmodel.ContentPage) []*ppmodel.SiteNavItem {
	items := make([]*ppmodel.SiteNavItem, 0, len(f.pages)+len(f.children))
	for _, page := range f.pages {
		items = append(items, pageNavItem(page))
	}
	for _, child := range f.sortedChildren(indexes) {
		group := &ppmodel.SiteNavItem{Kind: ppmodel.SiteNavItemGroup, Title: docsFolderTitle(child.path, indexes[child.path])}
		if index := indexes[child.path]; index != nil {
			group.Href = index.Href
			group.Description = index.Description
		}
		group.Children = child.items(indexes)
		items = append(items, group)
	}
	return items
}

func docsFolderTitle(folderPath string, index *ppmodel.ContentPage) string {
	if index != nil {
		if label := strings.TrimSpace(index.Label); label != "" {
			return label
		}
		if title := strings.TrimSpace(index.Title); title != "" {
			return title
		}
	}
	return contentTitleFromFilename(path.Base(folderPath))
}

func docsFolderOrder(index *ppmodel.ContentPage) int {
	if index == nil {
		return contentPageDefaultOrder
	}
	return index.Order
}

func pageNavItem(page *ppmodel.ContentPage) *ppmodel.SiteNavItem {
	return &ppmodel.SiteNavItem{
		Kind:        ppmodel.SiteNavItemPage,
		Title:       catalogContentPageNavLabel(page),
		Href:        page.Href,
		Description: page.Description,
	}
}

func serviceNavItem(service *ppmodel.CatalogService) *ppmodel.SiteNavItem {
	return &ppmodel.SiteNavItem{
		Kind:        ppmodel.SiteNavItemService,
		Title:       service.DisplayName,
		Href:        servicePrimaryHref(service),
		Description: service.Summary,
	}
}

func firstSectionsHref(sections []*ppmodel.SiteNavSection) string {
	for _, section := range sections {
		if section.Href != "" {
			return section.Href
		}
		if href := firstItemsHref(section.Items); href != "" {
			return href
		}
	}
	return ""
}

func firstItemsHref(items []*ppmodel.SiteNavItem) string {
	for _, item := range items {
		if item.Kind != ppmodel.SiteNavItemLink && item.Href != "" {
			return item.Href
		}
		if href := firstItemsHref(item.Children); href != "" {
			return href
		}
	}
	return ""
}

// siteNavTrailStep is one step of the path from the home page to a page.
type siteNavTrailStep struct {
	Label string
	Href  string
}

// isHomeTab reports whether a tab is the home tab, whose href is the site
// index. The home page already heads every trail.
func isHomeTab(tab *ppmodel.SiteNavTab) bool {
	return tab.Href == pppaths.FileIndexHTML
}

// siteNavTrail finds a page in the nav and returns the steps above it: its
// tab (unless it is the home tab), its section and any groups. It returns
// nil when the page is not in the nav.
func siteNavTrail(nav *ppmodel.SiteNav, href string) []siteNavTrailStep {
	if nav == nil || href == "" {
		return nil
	}
	for _, tab := range nav.Tabs {
		for _, section := range tab.Sections {
			var steps []siteNavTrailStep
			if !isHomeTab(tab) {
				steps = append(steps, siteNavTrailStep{Label: tab.Title, Href: tab.Href})
			}
			if section.Href == href {
				return steps
			}
			if section.Title != "" && section.Title != tab.Title {
				steps = append(steps, siteNavTrailStep{Label: section.Title, Href: section.Href})
			}
			if found, ok := itemsTrail(section.Items, href, steps); ok {
				return found
			}
		}
	}
	return nil
}

func itemsTrail(items []*ppmodel.SiteNavItem, href string, steps []siteNavTrailStep) ([]siteNavTrailStep, bool) {
	for _, item := range items {
		if item.Kind != ppmodel.SiteNavItemGroup && item.Href == href {
			return steps, true
		}
		if item.Kind == ppmodel.SiteNavItemGroup {
			if item.Href == href {
				return steps, true
			}
			next := append(append([]siteNavTrailStep(nil), steps...), siteNavTrailStep{Label: item.Title, Href: item.Href})
			if found, ok := itemsTrail(item.Children, href, next); ok {
				return found, true
			}
		}
	}
	return nil, false
}

// siteNavReadingOrder lists the site's pages in nav order: every page item
// and every section or group landing page, each once. Previous and next
// links follow it.
func siteNavReadingOrder(nav *ppmodel.SiteNav) []siteNavTrailStep {
	if nav == nil {
		return nil
	}
	var order []siteNavTrailStep
	seen := make(map[string]struct{})
	add := func(label, href string) {
		if href == "" || href == pppaths.FileIndexHTML {
			return
		}
		if _, ok := seen[href]; ok {
			return
		}
		seen[href] = struct{}{}
		order = append(order, siteNavTrailStep{Label: label, Href: href})
	}
	var walk func(items []*ppmodel.SiteNavItem)
	walk = func(items []*ppmodel.SiteNavItem) {
		for _, item := range items {
			switch item.Kind {
			case ppmodel.SiteNavItemPage:
				add(item.Title, item.Href)
			case ppmodel.SiteNavItemGroup:
				add(item.Title, item.Href)
				walk(item.Children)
			}
		}
	}
	for _, tab := range nav.Tabs {
		for _, section := range tab.Sections {
			if section.Href != pppaths.GuidesIndexHTML() {
				add(section.Title, section.Href)
			}
			walk(section.Items)
		}
	}
	return order
}

// siteNavNeighbours returns the pages before and after href in reading order.
func siteNavNeighbours(nav *ppmodel.SiteNav, href string) (previous, next *siteNavTrailStep) {
	order := siteNavReadingOrder(nav)
	for i := range order {
		if order[i].Href != href {
			continue
		}
		if i > 0 {
			previous = &order[i-1]
		}
		if i+1 < len(order) {
			next = &order[i+1]
		}
		return previous, next
	}
	return nil, nil
}

// siteNavSectionItems returns the items of the section or group whose landing
// page is href, for listing on that landing page.
func siteNavSectionItems(nav *ppmodel.SiteNav, href string) []*ppmodel.SiteNavItem {
	if nav == nil || href == "" {
		return nil
	}
	var inItems func(items []*ppmodel.SiteNavItem) []*ppmodel.SiteNavItem
	inItems = func(items []*ppmodel.SiteNavItem) []*ppmodel.SiteNavItem {
		for _, item := range items {
			if item.Kind == ppmodel.SiteNavItemGroup {
				if item.Href == href {
					return item.Children
				}
				if found := inItems(item.Children); found != nil {
					return found
				}
			}
		}
		return nil
	}
	for _, tab := range nav.Tabs {
		for _, section := range tab.Sections {
			if section.Href == href {
				return section.Items
			}
			if found := inItems(section.Items); found != nil {
				return found
			}
		}
	}
	return nil
}

// visibleContentPages returns the pages that belong in the navigation, with
// all their fields (contentPagesForNav keeps only the hydration fields).
func visibleContentPages(pages []*ppmodel.ContentPage) []*ppmodel.ContentPage {
	visible := make([]*ppmodel.ContentPage, 0, len(pages))
	for _, page := range pages {
		if page != nil && !page.Hidden {
			visible = append(visible, page)
		}
	}
	return visible
}

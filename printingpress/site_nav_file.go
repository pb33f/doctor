// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/go-yaml"
)

const siteNavFileName = "nav.yaml"

// siteNavFile is nav.yaml: the complete navigation of a docs site. When it
// exists it replaces the navigation built from folders.
//
//	tabs:
//	  - title: Guides
//	    sections:
//	      - title: Getting started
//	        page: getting-started/_index.md
//	        items:
//	          - page: getting-started/install.md
//	          - title: Advanced
//	            items:
//	              - page: getting-started/advanced/tuning.md
//	          - service: trains
//	          - link: https://status.example.com
//	            title: Status
//
// Page paths are relative to the folder that holds nav.yaml.
type siteNavFile struct {
	Tabs []siteNavFileTab `yaml:"tabs"`
}

type siteNavFileTab struct {
	Title    string               `yaml:"title"`
	Slug     string               `yaml:"slug"`
	Page     string               `yaml:"page"`
	Sections []siteNavFileSection `yaml:"sections"`
}

type siteNavFileSection struct {
	Title string            `yaml:"title"`
	Page  string            `yaml:"page"`
	Items []siteNavFileItem `yaml:"items"`
}

// siteNavFileItem is one of: a page, a service, a link, or a titled group
// of items.
type siteNavFileItem struct {
	Page    string            `yaml:"page"`
	Service string            `yaml:"service"`
	Link    string            `yaml:"link"`
	Title   string            `yaml:"title"`
	Items   []siteNavFileItem `yaml:"items"`
}

// findSiteNavFile returns the nav file to use: the configured path, or
// nav.yaml in the docs folder, or nav.yaml at the scan root.
func findSiteNavFile(configured, scanRoot string) string {
	if configured = strings.TrimSpace(configured); configured != "" {
		return configured
	}
	for _, candidate := range []string{
		filepath.Join(scanRoot, "docs", siteNavFileName),
		filepath.Join(scanRoot, siteNavFileName),
	} {
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate
		}
	}
	return ""
}

func readSiteNavFile(filePath string) (*siteNavFile, error) {
	raw, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}
	var file siteNavFile
	decoder := yaml.NewDecoder(bytes.NewReader(raw))
	decoder.KnownFields(true)
	if err := decoder.Decode(&file); err != nil {
		return nil, err
	}
	if len(file.Tabs) == 0 {
		return nil, errors.New("nav.yaml needs at least one tab")
	}
	return &file, nil
}

// siteNavFileResolver turns nav.yaml references into hrefs, and reports each
// reference it cannot resolve.
type siteNavFileResolver struct {
	baseDir  string
	pages    map[string]*ppmodel.ContentPage
	services map[string]*ppmodel.CatalogService
	warn     func(message, context string)
}

func newSiteNavFileResolver(filePath string, catalog *ppmodel.CatalogSite, warn func(message, context string)) *siteNavFileResolver {
	resolver := &siteNavFileResolver{
		baseDir:  filepath.Dir(filePath),
		pages:    make(map[string]*ppmodel.ContentPage),
		services: make(map[string]*ppmodel.CatalogService),
		warn:     warn,
	}
	for _, page := range catalog.ContentPages {
		if page != nil && page.SourcePath != "" {
			resolver.pages[canonicalSiteNavPath(page.SourcePath)] = page
		}
	}
	if home := catalog.HomePage; home != nil && home.SourcePath != "" {
		resolver.pages[canonicalSiteNavPath(home.SourcePath)] = home
	}
	for _, service := range visibleCatalogServices(catalog) {
		resolver.services[service.Slug] = service
	}
	return resolver
}

func canonicalSiteNavPath(filePath string) string {
	if resolved, err := filepath.EvalSymlinks(filePath); err == nil {
		return filepath.Clean(resolved)
	}
	return filepath.Clean(filePath)
}

func (r *siteNavFileResolver) page(ref string) *ppmodel.ContentPage {
	ref = strings.TrimSpace(ref)
	if ref == "" {
		return nil
	}
	target := filepath.FromSlash(ref)
	if !filepath.IsAbs(target) {
		target = filepath.Join(r.baseDir, target)
	}
	page := r.pages[canonicalSiteNavPath(target)]
	if page == nil {
		r.warn("nav.yaml names a page that is not in the build; skipping it", ref)
	}
	return page
}

// buildSiteNavFromFile builds the navigation tree from nav.yaml.
func buildSiteNavFromFile(file *siteNavFile, resolver *siteNavFileResolver) *ppmodel.SiteNav {
	nav := &ppmodel.SiteNav{}
	for tabIndex, fileTab := range file.Tabs {
		tab := &ppmodel.SiteNavTab{
			Title: strings.TrimSpace(fileTab.Title),
			Slug:  strings.TrimSpace(fileTab.Slug),
		}
		if tab.Slug == "" {
			tab.Slug = fmt.Sprintf("tab-%d", tabIndex+1)
		}
		if page := resolver.page(fileTab.Page); page != nil {
			tab.Href = page.Href
		}
		for _, fileSection := range fileTab.Sections {
			section := &ppmodel.SiteNavSection{Title: strings.TrimSpace(fileSection.Title)}
			section.Slug = strings.ToLower(strings.ReplaceAll(section.Title, " ", "-"))
			if page := resolver.page(fileSection.Page); page != nil {
				section.Href = page.Href
			}
			section.Items = resolver.items(fileSection.Items)
			tab.Sections = append(tab.Sections, section)
		}
		if tab.Href == "" {
			tab.Href = firstSectionsHref(tab.Sections)
		}
		if tabIndex == 0 && tab.Href == "" {
			tab.Href = pppaths.FileIndexHTML
		}
		nav.Tabs = append(nav.Tabs, tab)
	}
	return nav
}

func (r *siteNavFileResolver) items(fileItems []siteNavFileItem) []*ppmodel.SiteNavItem {
	items := make([]*ppmodel.SiteNavItem, 0, len(fileItems))
	for _, fileItem := range fileItems {
		title := strings.TrimSpace(fileItem.Title)
		switch {
		case strings.TrimSpace(fileItem.Page) != "" && len(fileItem.Items) == 0:
			page := r.page(fileItem.Page)
			if page == nil {
				continue
			}
			item := pageNavItem(page)
			if title != "" {
				item.Title = title
			}
			items = append(items, item)
		case strings.TrimSpace(fileItem.Service) != "":
			service := r.services[strings.TrimSpace(fileItem.Service)]
			if service == nil {
				r.warn("nav.yaml names a service that is not in the build; skipping it", fileItem.Service)
				continue
			}
			item := serviceNavItem(service)
			if title != "" {
				item.Title = title
			}
			items = append(items, item)
		case strings.TrimSpace(fileItem.Link) != "":
			if title == "" {
				title = strings.TrimSpace(fileItem.Link)
			}
			items = append(items, &ppmodel.SiteNavItem{Kind: ppmodel.SiteNavItemLink, Title: title, Href: strings.TrimSpace(fileItem.Link)})
		case len(fileItem.Items) > 0:
			group := &ppmodel.SiteNavItem{Kind: ppmodel.SiteNavItemGroup, Title: title}
			if page := r.page(fileItem.Page); page != nil {
				group.Href = page.Href
				if group.Title == "" {
					group.Title = catalogContentPageNavLabel(page)
				}
			}
			group.Children = r.items(fileItem.Items)
			items = append(items, group)
		default:
			r.warn("nav.yaml item needs a page, a service, a link or items; skipping it", title)
		}
	}
	return items
}

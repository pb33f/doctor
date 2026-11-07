// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// siteAgentPages indexes the pages agents read (those with a page.md) by
// their HTML href, so navigation entries can be turned into page.md links.
type siteAgentPages struct {
	byHref map[string]*ppmodel.ContentPage
	order  []*ppmodel.ContentPage
}

func newSiteAgentPages(catalog *ppmodel.CatalogSite) *siteAgentPages {
	pages := &siteAgentPages{byHref: make(map[string]*ppmodel.ContentPage)}
	add := func(page *ppmodel.ContentPage) {
		if page == nil || page.MarkdownHref == "" || page.Markdown == "" {
			return
		}
		pages.byHref[page.Href] = page
		pages.order = append(pages.order, page)
	}
	add(catalog.HomePage)
	for _, page := range catalog.ContentPages {
		add(page)
	}
	return pages
}

func (p *siteAgentPages) empty() bool {
	return len(p.order) == 0
}

func (p *siteAgentPages) page(href string) *ppmodel.ContentPage {
	return p.byHref[href]
}

// readingOrder lists every agent page once: the home page, then the
// navigation in order, then any page the navigation leaves out.
func (p *siteAgentPages) readingOrder(catalog *ppmodel.CatalogSite) []*ppmodel.ContentPage {
	var order []*ppmodel.ContentPage
	seen := make(map[string]struct{})
	add := func(href string) {
		page := p.page(href)
		if page == nil {
			return
		}
		if _, ok := seen[page.Href]; ok {
			return
		}
		seen[page.Href] = struct{}{}
		order = append(order, page)
	}
	if catalog.HomePage != nil {
		add(catalog.HomePage.Href)
	}
	var walk func(items []*ppmodel.SiteNavItem)
	walk = func(items []*ppmodel.SiteNavItem) {
		for _, item := range items {
			add(item.Href)
			walk(item.Children)
		}
	}
	if catalog.Nav != nil {
		for _, tab := range catalog.Nav.Tabs {
			add(tab.Href)
			for _, section := range tab.Sections {
				add(section.Href)
				walk(section.Items)
			}
		}
	}
	for _, page := range p.order {
		add(page.Href)
	}
	return order
}

// writeSiteAgentPagesMarkdown lists a site's pages for agents, as page.md
// links. A docs site follows its navigation tree (tabs, sections, groups);
// a catalog lists its guides. Pages the navigation leaves out follow.
func writeSiteAgentPagesMarkdown(builder *strings.Builder, catalog *ppmodel.CatalogSite, pages *siteAgentPages) {
	if pages.empty() {
		return
	}
	listed := make(map[string]struct{})
	if catalog.Kind.IsDocs() && catalog.Nav != nil {
		for _, tab := range catalog.Nav.Tabs {
			if tab.Slug == docsAPIsTabSlug {
				continue
			}
			var tabBody strings.Builder
			for _, section := range tab.Sections {
				var sectionBody strings.Builder
				writeAgentNavItems(&sectionBody, section.Items, pages, listed, "")
				landing := pages.page(section.Href)
				if sectionBody.Len() == 0 && landing == nil {
					continue
				}
				tabBody.WriteString("### ")
				tabBody.WriteString(agentHeadingLink(section.Title, landing, listed))
				tabBody.WriteString("\n\n")
				tabBody.WriteString(sectionBody.String())
				tabBody.WriteString("\n")
			}
			if tabBody.Len() == 0 {
				continue
			}
			builder.WriteString("## ")
			builder.WriteString(tab.Title)
			builder.WriteString("\n\n")
			builder.WriteString(tabBody.String())
		}
	} else {
		var guides strings.Builder
		for _, page := range catalog.ContentPages {
			if agentPage := pages.page(page.Href); agentPage != nil {
				writeAgentPageLine(&guides, "", agentPage.Title, agentPage.MarkdownHref, agentPage.Description)
				listed[agentPage.Href] = struct{}{}
			}
		}
		if guides.Len() > 0 {
			builder.WriteString("## Guides\n\n")
			builder.WriteString(guides.String())
			builder.WriteString("\n")
		}
	}
	var more strings.Builder
	for _, page := range pages.order {
		if page == catalog.HomePage {
			continue
		}
		if _, ok := listed[page.Href]; ok {
			continue
		}
		writeAgentPageLine(&more, "", page.Title, page.MarkdownHref, page.Description)
	}
	if more.Len() > 0 {
		builder.WriteString("## More pages\n\n")
		builder.WriteString(more.String())
		builder.WriteString("\n")
	}
}

func writeAgentNavItems(builder *strings.Builder, items []*ppmodel.SiteNavItem, pages *siteAgentPages, listed map[string]struct{}, indent string) {
	for _, item := range items {
		switch item.Kind {
		case ppmodel.SiteNavItemPage:
			page := pages.page(item.Href)
			if page == nil {
				continue
			}
			listed[page.Href] = struct{}{}
			writeAgentPageLine(builder, indent, item.Title, page.MarkdownHref, page.Description)
		case ppmodel.SiteNavItemLink:
			writeAgentPageLine(builder, indent, item.Title, item.Href, "")
		case ppmodel.SiteNavItemGroup:
			var children strings.Builder
			writeAgentNavItems(&children, item.Children, pages, listed, indent+"  ")
			landing := pages.page(item.Href)
			if children.Len() == 0 && landing == nil {
				continue
			}
			builder.WriteString(indent)
			builder.WriteString("- ")
			builder.WriteString(agentHeadingLink(item.Title, landing, listed))
			builder.WriteString("\n")
			builder.WriteString(children.String())
		}
	}
}

func agentHeadingLink(title string, landing *ppmodel.ContentPage, listed map[string]struct{}) string {
	if landing == nil {
		return title
	}
	listed[landing.Href] = struct{}{}
	return "[" + title + "](" + landing.MarkdownHref + ")"
}

func writeAgentPageLine(builder *strings.Builder, indent, title, href, description string) {
	builder.WriteString(indent)
	builder.WriteString("- [")
	builder.WriteString(title)
	builder.WriteString("](")
	builder.WriteString(href)
	builder.WriteString(")")
	if description != "" {
		builder.WriteString(" — ")
		builder.WriteString(description)
	}
	builder.WriteString("\n")
}

// writeSiteAgentStartHere lists agents-only pages first in AGENTS.md: they
// are what a site writes for agents, such as which CLI to use.
func writeSiteAgentStartHere(builder *strings.Builder, catalog *ppmodel.CatalogSite, pages *siteAgentPages) {
	var start strings.Builder
	for _, page := range pages.readingOrder(catalog) {
		if page.Audience == ppmodel.ContentAudienceAgents {
			writeAgentPageLine(&start, "", page.Title, page.MarkdownHref, page.Description)
		}
	}
	if start.Len() == 0 {
		return
	}
	builder.WriteString("## Start here\n\n")
	builder.WriteString(start.String())
	builder.WriteString("\n")
}

// writeSiteLLMFullFileLine lists llms-full.txt in the Files section when the
// site has pages.
func writeSiteLLMFullFileLine(builder *strings.Builder, pages *siteAgentPages) {
	if pages.empty() {
		return
	}
	builder.WriteString("- [llms-full.txt](llms-full.txt) — Every page in one file\n")
}

// buildSiteLLMFull is every agent page in reading order, in one file.
func buildSiteLLMFull(catalog *ppmodel.CatalogSite, pages *siteAgentPages) string {
	var builder strings.Builder
	builder.WriteString("# ")
	builder.WriteString(catalogLLMTitle(catalog))
	builder.WriteString("\n\n")
	for i, page := range pages.readingOrder(catalog) {
		if i > 0 {
			builder.WriteString("\n---\n\n")
		}
		builder.WriteString("<!-- ")
		builder.WriteString(page.MarkdownHref)
		builder.WriteString(" -->\n")
		builder.WriteString(page.Markdown)
	}
	return builder.String()
}

// writeSiteAgentPages writes each page.md and llms-full.txt, removes the ones
// an earlier build wrote that this build no longer has, and returns what it
// wrote.
func (ap *AggregatePrintingPress) writeSiteAgentPages(catalog *ppmodel.CatalogSite, pages *siteAgentPages) ([]string, error) {
	var written, statePaths []string
	for _, page := range pages.order {
		target := filepath.Join(ap.config.OutputDir, filepath.FromSlash(page.MarkdownHref))
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return nil, err
		}
		if err := os.WriteFile(target, []byte(page.Markdown), 0o644); err != nil {
			return nil, err
		}
		written = append(written, target)
		statePaths = append(statePaths, page.MarkdownHref)
	}
	if !pages.empty() {
		fullPath := filepath.Join(ap.config.OutputDir, pppaths.FileLLMFull)
		if err := os.WriteFile(fullPath, []byte(buildSiteLLMFull(catalog, pages)), 0o644); err != nil {
			return nil, err
		}
		written = append(written, fullPath)
		statePaths = append(statePaths, pppaths.FileLLMFull)
	}
	if err := ap.removePreviousContentArtifacts(pppaths.FileCatalogAgentContentStateJSON, statePaths); err != nil {
		return nil, err
	}
	if err := ap.writeContentState(pppaths.FileCatalogAgentContentStateJSON, statePaths); err != nil {
		return nil, err
	}
	return written, nil
}

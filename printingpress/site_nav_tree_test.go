// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"path/filepath"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

// writeDocsTreeFixture lays out a docs site with a home _index.md, two
// top-level folders that share a tab, a nested folder and a draft page.
func writeDocsTreeFixture(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	writeGoldenFile(t, root, "docs/_index.md", "---\ntitle: Example Docs Home\ndescription: Everything about Example.\n---\nWelcome to the HOME-MARKER docs.\n")
	writeGoldenFile(t, root, "docs/welcome.md", "---\ntitle: Welcome\norder: 1\n---\n# Welcome\n")
	writeGoldenFile(t, root, "docs/getting-started/_index.md", "---\ntitle: Getting Started\norder: 10\ntab: Guides\ndescription: First steps.\n---\nSECTION-MARKER\n")
	writeGoldenFile(t, root, "docs/getting-started/install.md", "---\ntitle: Install\norder: 1\n---\n# Install\n")
	writeGoldenFile(t, root, "docs/getting-started/configure.md", "---\ntitle: Configure\norder: 2\n---\n# Configure\n")
	writeGoldenFile(t, root, "docs/getting-started/advanced/tuning.md", "---\ntitle: Tuning\n---\n# Tuning\n")
	writeGoldenFile(t, root, "docs/tutorials/_index.md", "---\ntitle: Tutorials\norder: 20\ntab: Guides\n---\n")
	writeGoldenFile(t, root, "docs/tutorials/first-app.md", "---\ntitle: First App\n---\n# First App\n")
	writeGoldenFile(t, root, "docs/reference/glossary.md", "---\ntitle: Glossary\n---\n# Glossary\n")
	writeGoldenFile(t, root, "docs/reference/unfinished.md", "---\ntitle: Unfinished\ndraft: true\n---\n# DRAFT-MARKER\n")
	return root
}

func TestDocsFolderNavTabsSectionsAndGroups(t *testing.T) {
	catalog, outputDir := buildDocsSiteFixture(t, writeDocsTreeFixture(t), nil)
	nav := catalog.Nav
	require.NotNil(t, nav)

	titles := make([]string, 0, len(nav.Tabs))
	for _, tab := range nav.Tabs {
		titles = append(titles, tab.Title)
	}
	assert.Equal(t, []string{"Documentation", "Guides", "Reference"}, titles, "folders naming the same tab share it; untitled folders take their name")

	guides := nav.Tabs[1]
	require.Len(t, guides.Sections, 3, "getting-started pages, its advanced sub-folder, then tutorials")
	assert.Equal(t, "Getting Started", guides.Sections[0].Title)
	assert.Equal(t, "getting-started/index.html", guides.Sections[0].Href, "_index.md is the section landing page")
	assert.Equal(t, "getting-started/index.html", guides.Href)
	require.Len(t, guides.Sections[0].Items, 2)
	assert.Equal(t, "Install", guides.Sections[0].Items[0].Title, "pages keep their front matter order")
	assert.Equal(t, "Configure", guides.Sections[0].Items[1].Title)
	assert.Equal(t, "Advanced", guides.Sections[1].Title)
	require.Len(t, guides.Sections[1].Items, 1)
	assert.Equal(t, "getting-started/advanced/tuning.html", guides.Sections[1].Items[0].Href)
	assert.Equal(t, "Tutorials", guides.Sections[2].Title)

	assert.Equal(t, "Example Docs Home", catalog.HomePage.Title)
	index := readOutput(t, outputDir, "index.html")
	assert.Contains(t, index, "HOME-MARKER", "the top-level _index.md is the home page content")
	assert.NoFileExists(t, filepath.Join(outputDir, "unfinished.html"))
	assert.NoFileExists(t, filepath.Join(outputDir, "reference", "unfinished.html"), "drafts are not built")
	for _, page := range catalog.ContentPages {
		assert.NotEqual(t, "Unfinished", page.Title)
	}
}

func TestDocsSectionLandingPageListsItsPages(t *testing.T) {
	_, outputDir := buildDocsSiteFixture(t, writeDocsTreeFixture(t), nil)
	section := readOutput(t, outputDir, "getting-started/index.html")
	assert.Contains(t, section, "SECTION-MARKER")
	assert.Contains(t, section, `href="install.html"`, "the landing page lists its pages, relative to itself")
	assert.Contains(t, section, `href="configure.html"`)
}

func TestDocsBreadcrumbsAndNeighboursFollowTheTree(t *testing.T) {
	_, outputDir := buildDocsSiteFixture(t, writeDocsTreeFixture(t), nil)
	configure := readOutput(t, outputDir, "getting-started/configure.html")
	assert.Contains(t, configure, ">DOCUMENTATION<")
	assert.Contains(t, configure, ">GUIDES<", "the tab is in the trail")
	assert.Contains(t, configure, ">GETTING STARTED<", "the section is in the trail")
	assert.Contains(t, configure, `rel="prev"`)
	assert.Contains(t, configure, `href="install.html" class="pp-guide-card" rel="prev"`, "previous is the page before it in reading order")
	assert.Contains(t, configure, `href="advanced/tuning.html" class="pp-guide-card" rel="next"`)

	tuning := readOutput(t, outputDir, "getting-started/advanced/tuning.html")
	assert.Contains(t, tuning, ">ADVANCED<")
	assert.Contains(t, tuning, `href="../../tutorials/index.html" class="pp-guide-card" rel="next"`, "reading order runs on into the next section")

	nav := readOutput(t, outputDir, "getting-started/install.html")
	assert.Contains(t, nav, "<h4>Advanced</h4>", "the nav draws the tree")
	assert.Contains(t, nav, `aria-current="page"`)
}

func TestDocsNavFileReplacesTheFolderNav(t *testing.T) {
	root := writeDocsTreeFixture(t)
	writeGoldenFile(t, root, "services/trains/openapi.yaml", readGoldenSource(t, "../test_specs/train-travel.yaml"))
	writeGoldenFile(t, root, "docs/nav.yaml", `tabs:
  - title: Learn
    sections:
      - title: Start
        page: getting-started/_index.md
        items:
          - page: welcome.md
            title: Hello
          - page: missing.md
          - title: Deeper
            items:
              - page: getting-started/advanced/tuning.md
  - title: Reference
    sections:
      - title: APIs
        items:
          - service: trains
          - service: nope
          - link: https://status.example.com
            title: Status
`)

	catalog, outputDir := buildDocsSiteFixture(t, root, &AggregatePrintingPressConfig{SiteKind: ppmodel.SiteKindDocs})
	nav := catalog.Nav
	require.Len(t, nav.Tabs, 2)
	learn := nav.Tabs[0]
	assert.Equal(t, "Learn", learn.Title)
	require.Len(t, learn.Sections, 1)
	start := learn.Sections[0]
	assert.Equal(t, "getting-started/index.html", start.Href)
	require.Len(t, start.Items, 2, "the missing page is skipped")
	assert.Equal(t, "Hello", start.Items[0].Title, "a nav.yaml title overrides the page label")
	assert.Equal(t, ppmodel.SiteNavItemGroup, start.Items[1].Kind)
	require.Len(t, start.Items[1].Children, 1)

	apis := nav.Tabs[1].Sections[0].Items
	require.Len(t, apis, 2, "the unknown service is skipped")
	assert.Equal(t, ppmodel.SiteNavItemService, apis[0].Kind)
	assert.Equal(t, ppmodel.SiteNavItemLink, apis[1].Kind)
	assert.Equal(t, "https://status.example.com", apis[1].Href)

	welcome := readOutput(t, outputDir, "welcome.html")
	assert.Contains(t, welcome, ">LEARN<", "breadcrumbs follow nav.yaml")
	assert.Contains(t, welcome, ">START<")
	assert.Contains(t, welcome, `href="https://status.example.com"`, "links leave the site as written")
}

func TestDocsNavFileThatDoesNotParseFallsBackToFolders(t *testing.T) {
	root := writeDocsTreeFixture(t)
	writeGoldenFile(t, root, "docs/nav.yaml", "tabs:\n  - title: Broken\n    unknownKey: true\n")

	catalog, _ := buildDocsSiteFixture(t, root, nil)
	require.NotEmpty(t, catalog.Nav.Tabs)
	assert.Equal(t, "Guides", catalog.Nav.Tabs[1].Title, "the folder navigation is used")
}

func TestDocsNavFileFromConfiguredPath(t *testing.T) {
	root := writeDocsTreeFixture(t)
	navPath := filepath.Join(t.TempDir(), "site-nav.yaml")
	writeGoldenFile(t, filepath.Dir(navPath), filepath.Base(navPath), "tabs:\n  - title: Only\n    sections:\n      - title: One\n        items:\n          - page: "+filepath.ToSlash(filepath.Join(root, "docs", "welcome.md"))+"\n")

	catalog, _ := buildDocsSiteFixture(t, root, &AggregatePrintingPressConfig{NavPath: navPath})
	require.Len(t, catalog.Nav.Tabs, 1)
	assert.Equal(t, "Only", catalog.Nav.Tabs[0].Title)
	require.Len(t, catalog.Nav.Tabs[0].Sections[0].Items, 1)
	assert.Equal(t, "welcome.html", catalog.Nav.Tabs[0].Sections[0].Items[0].Href)
}

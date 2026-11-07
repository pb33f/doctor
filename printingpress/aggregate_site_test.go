// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"path/filepath"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func buildDocsSiteFixture(t *testing.T, scanRoot string, config *AggregatePrintingPressConfig) (*ppmodel.CatalogSite, string) {
	t.Helper()
	outputDir := t.TempDir()
	if config == nil {
		config = &AggregatePrintingPressConfig{}
	}
	config.OutputDir = outputDir
	config.StateSQLitePath = filepath.Join(t.TempDir(), "state.db")
	ap, err := CreateAggregatePrintingPressFromPath(scanRoot, config)
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	require.NoError(t, err)
	_, err = ap.PrintLLM()
	require.NoError(t, err)
	catalog, err := ap.PressModel()
	require.NoError(t, err)
	return catalog, outputDir
}

func readOutput(t *testing.T, outputDir, rel string) string {
	t.Helper()
	data, err := os.ReadFile(filepath.Join(outputDir, filepath.FromSlash(rel)))
	require.NoError(t, err)
	return string(data)
}

func TestDocsSiteWithoutSpecsIsNotACatalog(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "docs/welcome.md", "---\ntitle: Welcome\norder: 1\ndescription: Start here.\n---\n# Welcome\n\nHello.\n")
	writeGoldenFile(t, root, "docs/getting-started/install.md", "---\ntitle: Install\norder: 2\n---\n# Install\n\nSteps.\n")

	catalog, outputDir := buildDocsSiteFixture(t, root, nil)

	assert.Equal(t, ppmodel.SiteKindDocs, catalog.Kind)
	assert.Equal(t, docsSiteTitleFallback, catalog.Title)

	for _, rel := range []string{"index.html", "llms.txt", "AGENTS.md"} {
		text := readOutput(t, outputDir, rel)
		assert.NotContains(t, text, "API Catalog", rel)
		assert.NotContains(t, text, "## Services", rel)
		assert.NotContains(t, text, "aggregate catalog", rel)
	}
	index := readOutput(t, outputDir, "index.html")
	assert.Contains(t, index, "welcome.html", "the docs home lists the guides")
	assert.Contains(t, index, "getting-started/install.html")
	assert.FileExists(t, filepath.Join(outputDir, "getting-started", "install.html"))

	require.NotNil(t, catalog.Nav)
	require.Len(t, catalog.Nav.Tabs, 2, "home, and one tab for the getting-started folder; no APIs tab without specs")
	home := catalog.Nav.Tabs[0].Sections
	require.Len(t, home, 1)
	assert.Equal(t, "Guides", home[0].Title)
	require.Len(t, home[0].Items, 1)
	assert.Equal(t, ppmodel.SiteNavItemPage, home[0].Items[0].Kind)
	assert.Equal(t, "Welcome", home[0].Items[0].Title)
	assert.Equal(t, "welcome.html", home[0].Items[0].Href)
	folder := catalog.Nav.Tabs[1]
	assert.Equal(t, "Getting Started", folder.Title)
	assert.Equal(t, "getting-started/install.html", folder.Href)
}

func TestDocsSiteUsesConfiguredTitleAndBrand(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "docs/welcome.md", "---\ntitle: Welcome\n---\n# Welcome\n")

	catalog, outputDir := buildDocsSiteFixture(t, root, &AggregatePrintingPressConfig{
		Title: "Example Docs",
		Brand: &ppmodel.SiteBrand{
			Logo:        "logo.svg",
			HeaderLinks: []*ppmodel.SiteHeaderLink{{Label: "Status", Href: "https://status.example.com"}},
		},
	})

	assert.Equal(t, "Example Docs", catalog.Title)
	require.NotNil(t, catalog.Brand)
	assert.Equal(t, "logo.svg", catalog.Brand.Logo)
	require.Len(t, catalog.Brand.HeaderLinks, 1)
	assert.Contains(t, readOutput(t, outputDir, "llms.txt"), "# Example Docs")
	assert.Contains(t, readOutput(t, outputDir, "index.html"), ">Example Docs<", "the nav home label is the site title")
}

func TestDirectoryWithSpecsStaysACatalog(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "services/trains/openapi.yaml", readGoldenSource(t, "../test_specs/train-travel.yaml"))
	writeGoldenFile(t, root, "docs/guide.md", "---\ntitle: Guide\n---\n# Guide\n")

	catalog, outputDir := buildDocsSiteFixture(t, root, nil)

	assert.Equal(t, ppmodel.SiteKindCatalog, catalog.Kind)
	assert.Equal(t, catalogSiteTitleFallback, catalog.Title)
	assert.Contains(t, readOutput(t, outputDir, "llms.txt"), "## Services")

	require.NotNil(t, catalog.Nav)
	sections := catalog.Nav.Tabs[0].Sections
	require.Len(t, sections, 2)
	assert.Equal(t, "Guides", sections[0].Title)
	assert.Equal(t, "Services", sections[1].Title)
	require.Len(t, sections[1].Items, 1)
	assert.Equal(t, ppmodel.SiteNavItemService, sections[1].Items[0].Kind)
	assert.NotEmpty(t, sections[1].Items[0].Href)
}

func TestDocsSiteKindOverrideNamesSpecsAPIs(t *testing.T) {
	root := t.TempDir()
	writeGoldenFile(t, root, "services/trains/openapi.yaml", readGoldenSource(t, "../test_specs/train-travel.yaml"))
	writeGoldenFile(t, root, "docs/guide.md", "---\ntitle: Guide\n---\n# Guide\n")

	catalog, outputDir := buildDocsSiteFixture(t, root, &AggregatePrintingPressConfig{SiteKind: ppmodel.SiteKindDocs})

	assert.Equal(t, ppmodel.SiteKindDocs, catalog.Kind)
	llms := readOutput(t, outputDir, "llms.txt")
	assert.Contains(t, llms, "## APIs")
	assert.NotContains(t, llms, "## Services")
	assert.NotContains(t, readOutput(t, outputDir, "index.html"), "API Catalog")
	require.Len(t, catalog.Nav.Tabs, 2, "home, then the APIs tab")
	apis := catalog.Nav.Tabs[1]
	assert.Equal(t, "APIs", apis.Title)
	require.Len(t, apis.Sections, 1)
	require.Len(t, apis.Sections[0].Items, 1)
	assert.Equal(t, ppmodel.SiteNavItemService, apis.Sections[0].Items[0].Kind)
	assert.Equal(t, apis.Sections[0].Items[0].Href, apis.Href)
}

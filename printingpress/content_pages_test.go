// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"io"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestContentPages_DiscoverRenderWriteAndStayOutOfLLM(t *testing.T) {
	restoreLogger := silenceDefaultLogger()
	defer restoreLogger()

	root := t.TempDir()
	outputDir := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeFile(t, specPath, minimalContentPageSpec())
	writeFile(t, filepath.Join(root, "_partials", "intro.md"), "---\ntitle: Partial Title\n---\nReusable *partial*.\n")
	writeFile(t, filepath.Join(root, "images", "diagram.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>`)
	writeFile(t, filepath.Join(root, "about.md"), `---
title: About The API
label: About
order: 5
description: Team onboarding notes.
---

Root content unique to custom docs.

{{<partial "intro.md ">}}

[Read the guide](docs/guide.md#install)

![Diagram](images/diagram.svg)
`)
	writeFile(t, filepath.Join(root, "docs", "guide.md"), `---
title: Service Guide
label: Guide
slug: guides/setup
order: 10
---

## Install

Use the generated API pages in parallel with service code.

[Auth](../auth.md)

![Nested diagram](../images/diagram.svg)
`)
	writeFile(t, filepath.Join(root, "docs", "writing-your-first-api.md"), `---
title: Writing Your First Linus API
label: First API
slug: guides/writing-your-first-api
order: 25
description: How to create a Linus API contract, validate it, and generate code.
---

First API walkthrough.

[Service development](service-development.md)
`)
	writeFile(t, filepath.Join(root, "docs", "service-development.md"), `Generated handler notes.
`)
	writeFile(t, filepath.Join(root, "docs", "reference", "deep-dive.md"), `Nested docs page.
`)
	writeFile(t, filepath.Join(root, "docs", "_partials", "ignored.md"), `This partial must not become a page.
`)
	writeFile(t, filepath.Join(root, "auth.md"), `---
title: Auth
slug: index
order: 15
---

Auth details.
`)
	writeFile(t, filepath.Join(root, "security.md"), `---
title: Security
order: 15
---

Security details.
`)
	writeFile(t, filepath.Join(root, "faq.md"), `---
title: FAQ
hidden: true
---

Hidden FAQ content.
`)
	writeFile(t, filepath.Join(root, "webhooks.md"), `Webhooks guide content.`)

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:           root,
		SpecPath:           specPath,
		OutputDir:          outputDir,
		EnableContentPages: true,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site)
	assert.Empty(t, site.Warnings, "custom page warnings stay log-only")

	about := requireContentPage(t, site.ContentPages, "about")
	assert.Equal(t, "about.html", about.Href)
	assert.Contains(t, about.BodyHTML, "Root content unique to custom docs.")
	assert.Contains(t, about.BodyHTML, "Reusable <em>partial</em>.")
	assert.NotContains(t, about.BodyHTML, "Partial Title")
	assert.Contains(t, about.BodyHTML, `href="guides/setup.html#install"`)
	assert.Contains(t, about.BodyHTML, `src="assets/docs/about/diagram.svg"`)

	guide := requireContentPage(t, site.ContentPages, "guides/setup")
	assert.Equal(t, "guides/setup.html", guide.Href)
	assert.Contains(t, guide.BodyHTML, `href="../auth.html"`)
	assert.Contains(t, guide.BodyHTML, `src="../assets/docs/guides/setup/diagram.svg"`)
	firstAPI := requireContentPage(t, site.ContentPages, "guides/writing-your-first-api")
	assert.Equal(t, "First API", firstAPI.Label)
	assert.Equal(t, "How to create a Linus API contract, validate it, and generate code.", firstAPI.Description)
	assert.Contains(t, firstAPI.BodyHTML, `href="../service-development.html"`)
	serviceDevelopment := requireContentPage(t, site.ContentPages, "service-development")
	assert.Equal(t, "Service Development", serviceDevelopment.Title)
	assert.Equal(t, contentPageDefaultOrder, serviceDevelopment.Order)
	deepDive := requireContentPage(t, site.ContentPages, "reference/deep-dive")
	assert.Equal(t, "Deep Dive", deepDive.Title)
	assert.Equal(t, "reference/deep-dive.html", deepDive.Href)
	auth := requireContentPage(t, site.ContentPages, "auth")
	security := requireContentPage(t, site.ContentPages, "security")
	assert.Less(t, contentPageIndex(site.ContentPages, auth.Slug), contentPageIndex(site.ContentPages, security.Slug))
	faq := requireContentPage(t, site.ContentPages, "faq")
	assert.True(t, faq.Hidden)
	webhooksGuide := requireContentPage(t, site.ContentPages, "webhooks-guide")
	assert.Equal(t, "Webhooks Guide", webhooksGuide.Title)

	navPayload := buildSharedHydrationPayload(site)
	assert.NotContains(t, navPayload.Attributes["pp-nav"]["data-pages"], "bodyHtml")
	assert.NotContains(t, navPayload.Attributes["pp-nav"]["data-pages"], "Root content unique")
	var navPages []map[string]any
	require.NoError(t, json.Unmarshal([]byte(navPayload.Attributes["pp-nav"]["data-pages"]), &navPages))
	navSlugs := make([]string, 0, len(navPages))
	for _, page := range navPages {
		navSlugs = append(navSlugs, page["slug"].(string))
	}
	assert.Contains(t, navSlugs, "about")
	assert.Contains(t, navSlugs, "guides/setup")
	assert.Contains(t, navSlugs, "guides/writing-your-first-api")
	assert.Contains(t, navSlugs, "service-development")
	assert.Contains(t, navSlugs, "reference/deep-dive")
	assert.Contains(t, navSlugs, "webhooks-guide")
	assert.NotContains(t, navSlugs, "faq")
	assert.Equal(t, -1, contentPageIndex(site.ContentPages, "intro"))
	assert.Equal(t, -1, contentPageIndex(site.ContentPages, "ignored"))

	jsonOutputDir := t.TempDir()
	require.NoError(t, PrintJSONArtifacts(site, jsonOutputDir))
	bundleData := readFile(t, filepath.Join(jsonOutputDir, "bundle.json"))
	assert.Contains(t, bundleData, `"contentPages"`)
	assert.Contains(t, bundleData, `"bodyHtml"`)
	manifestData := readFile(t, filepath.Join(jsonOutputDir, "manifest.json"))
	var manifest ArtifactManifest
	require.NoError(t, json.Unmarshal([]byte(manifestData), &manifest))
	for _, artifact := range manifest.Artifacts {
		assert.NotEqual(t, "content", artifact.Kind)
		assert.NotEqual(t, "about.html", artifact.Path)
	}
	assert.NoFileExists(t, filepath.Join(jsonOutputDir, "about.html"))

	_, err = pp.PrintHTML()
	require.NoError(t, err)
	assert.FileExists(t, filepath.Join(outputDir, "about.html"))
	assert.FileExists(t, filepath.Join(outputDir, "guides.html"))
	assert.FileExists(t, filepath.Join(outputDir, "guides", "setup.html"))
	assert.FileExists(t, filepath.Join(outputDir, "guides", "writing-your-first-api.html"))
	assert.FileExists(t, filepath.Join(outputDir, "service-development.html"))
	assert.FileExists(t, filepath.Join(outputDir, "reference", "deep-dive.html"))
	assert.FileExists(t, filepath.Join(outputDir, "faq.html"))
	assert.FileExists(t, filepath.Join(outputDir, "webhooks-guide.html"))
	assert.FileExists(t, filepath.Join(outputDir, "assets", "docs", "about", "diagram.svg"))
	assert.FileExists(t, filepath.Join(outputDir, "assets", "docs", "guides", "setup", "diagram.svg"))

	aboutHTML := readFile(t, filepath.Join(outputDir, "about.html"))
	assert.Contains(t, aboutHTML, `data-active="content/about"`)
	assert.Contains(t, aboutHTML, `<sl-breadcrumb class="pp-breadcrumb">`)
	assert.Contains(t, aboutHTML, `<sl-breadcrumb-item href="guides.html">GUIDES</sl-breadcrumb-item>`)
	assert.Contains(t, aboutHTML, `<div class="pp-content-page-markdown pp-content-page-body">`)
	assert.NotContains(t, aboutHTML, `pp-description pp-content-page-body`)
	assert.Contains(t, aboutHTML, `href="guides/setup.html#install"`)
	assert.Contains(t, aboutHTML, `src="assets/docs/about/diagram.svg"`)
	assert.Contains(t, aboutHTML, "Team onboarding notes.")
	guideHTML := readFile(t, filepath.Join(outputDir, "guides", "setup.html"))
	assert.Contains(t, guideHTML, `href="../auth.html"`)
	assert.Contains(t, guideHTML, `src="../assets/docs/guides/setup/diagram.svg"`)
	firstAPIHTML := readFile(t, filepath.Join(outputDir, "guides", "writing-your-first-api.html"))
	assert.Contains(t, firstAPIHTML, "How to create a Linus API contract, validate it, and generate code.")
	assert.Contains(t, firstAPIHTML, `href="../service-development.html"`)
	guidesHTML := readFile(t, filepath.Join(outputDir, "guides.html"))
	assert.Contains(t, guidesHTML, `<h1>Guides</h1>`)
	assert.Contains(t, guidesHTML, `<sl-breadcrumb-item>GUIDES</sl-breadcrumb-item>`)
	assert.Contains(t, guidesHTML, `href="about.html"`)
	assert.Contains(t, guidesHTML, `href="guides/setup.html"`)
	assert.Contains(t, guidesHTML, `href="guides/writing-your-first-api.html"`)
	assert.Contains(t, guidesHTML, `href="service-development.html"`)
	assert.Contains(t, guidesHTML, `href="reference/deep-dive.html"`)
	assert.Contains(t, guidesHTML, `href="webhooks-guide.html"`)
	assert.NotContains(t, guidesHTML, `href="faq.html"`)

	_, err = pp.PrintLLM()
	require.NoError(t, err)
	llmFull := readFile(t, filepath.Join(outputDir, "llms-full.txt"))
	assert.NotContains(t, llmFull, "Root content unique to custom docs.")
	assert.NotContains(t, llmFull, "Webhooks guide content.")
}

func TestContentPages_RequireExplicitEnable(t *testing.T) {
	root := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeFile(t, specPath, minimalContentPageSpec())
	writeFile(t, filepath.Join(root, "about.md"), "Internal notes should not publish by default.\n")

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath: root,
		SpecPath: specPath,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	assert.Empty(t, site.ContentPages)
}

func TestContentPages_ImageBasenameCollisionsReuseOrDisambiguate(t *testing.T) {
	restoreLogger := silenceDefaultLogger()
	defer restoreLogger()

	root := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeFile(t, specPath, minimalContentPageSpec())
	writeFile(t, filepath.Join(root, "images", "logo.png"), "light")
	writeFile(t, filepath.Join(root, "images", "dark", "logo.png"), "dark")
	writeFile(t, filepath.Join(root, "about.md"), `---
title: About
---

![Logo](images/logo.png)
![Logo again](images/logo.png)
![Dark logo](images/dark/logo.png)
`)

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:           root,
		SpecPath:           specPath,
		EnableContentPages: true,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	about := requireContentPage(t, site.ContentPages, "about")
	require.Len(t, about.Assets, 2)
	assert.Equal(t, "assets/docs/about/logo.png", about.Assets[0].Href)
	assert.Equal(t, "assets/docs/about/logo-2.png", about.Assets[1].Href)
	assert.Equal(t, 2, strings.Count(about.BodyHTML, `src="assets/docs/about/logo.png"`))
	assert.Contains(t, about.BodyHTML, `src="assets/docs/about/logo-2.png"`)
}

func TestContentPages_InvalidFrontMatterKeepsOriginalBodyAndPartialsSkipCodeFences(t *testing.T) {
	restoreLogger := silenceDefaultLogger()
	defer restoreLogger()

	root := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeFile(t, specPath, minimalContentPageSpec())
	writeFile(t, filepath.Join(root, "_partials", "intro.md"), "Reusable partial.\n")
	writeFile(t, filepath.Join(root, "about.md"), "---\n"+
		"## This is a markdown thematic break, not front matter.\n"+
		"---\n\n"+
		"Top section stays visible.\n\n"+
		"```md\n"+
		"{{<partial \"intro.md\">}}\n"+
		"```\n\n"+
		"{{<partial \"intro.md\">}}\n")

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:           root,
		SpecPath:           specPath,
		EnableContentPages: true,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	about := requireContentPage(t, site.ContentPages, "about")
	assert.Contains(t, about.BodyHTML, "Top section stays visible.")
	assert.Contains(t, about.BodyHTML, "This is a markdown thematic break")
	assert.Equal(t, 1, strings.Count(about.BodyHTML, "Reusable partial."))
	assert.Contains(t, about.BodyHTML, "{{&lt;partial")
}

func TestContentPages_ShadowedDocsLinkRewritesToRootWinner(t *testing.T) {
	restoreLogger := silenceDefaultLogger()
	defer restoreLogger()

	root := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeFile(t, specPath, minimalContentPageSpec())
	writeFile(t, filepath.Join(root, "about.md"), "See [Guide](docs/guide.md).\n")
	writeFile(t, filepath.Join(root, "guide.md"), "Root guide wins.\n")
	writeFile(t, filepath.Join(root, "docs", "guide.md"), "Ignored guide.\n")

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:           root,
		SpecPath:           specPath,
		EnableContentPages: true,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	about := requireContentPage(t, site.ContentPages, "about")
	assert.Contains(t, about.BodyHTML, `href="guide.html"`)
	assert.NotContains(t, about.BodyHTML, `href="docs/guide.md"`)
}

func TestContentPages_ImageSymlinkEscapeIsNotCopied(t *testing.T) {
	restoreLogger := silenceDefaultLogger()
	defer restoreLogger()

	root := t.TempDir()
	outputDir := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeFile(t, specPath, minimalContentPageSpec())
	writeFile(t, filepath.Join(root, "about.md"), `---
title: About
---

![Escaping image](images/escape.svg)
`)
	outside := t.TempDir()
	writeFile(t, filepath.Join(outside, "escape.svg"), `<svg xmlns="http://www.w3.org/2000/svg"></svg>`)
	require.NoError(t, os.MkdirAll(filepath.Join(root, "images"), 0o755))
	if err := os.Symlink(filepath.Join(outside, "escape.svg"), filepath.Join(root, "images", "escape.svg")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		BasePath:           root,
		SpecPath:           specPath,
		OutputDir:          outputDir,
		EnableContentPages: true,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	about := requireContentPage(t, site.ContentPages, "about")
	assert.Contains(t, about.BodyHTML, `src="images/escape.svg"`)
	assert.Empty(t, about.Assets)

	_, err = pp.PrintHTML()
	require.NoError(t, err)
	assert.NoFileExists(t, filepath.Join(outputDir, "assets", "docs", "about", "escape.svg"))
}

func TestContentPageContext_RemoteSpecKeepsConfiguredLocalBasePath(t *testing.T) {
	root := t.TempDir()
	pp := &PrintingPress{engineConfig: &pressEngineConfig{
		ContentDiscoveryEnabled: true,
		ContentBasePath:         root,
		ContentSpecPath:         "https://example.com/apis/openapi.yaml",
	}}

	ctx := pp.newContentPageContext()
	require.NotNil(t, ctx)
	assert.Equal(t, root, ctx.root)
	assert.Equal(t, filepath.Join(root, "docs"), ctx.docsRoot)
}

func TestContentPages_GuidesIndexRouteOnlyReservesExactSlug(t *testing.T) {
	assert.True(t, isReservedContentSlug("guides"))
	assert.True(t, isReservedContentSlug("services/users/index"))
	assert.True(t, isReservedContentSlug("assets/docs/about/logo.png"))
	assert.False(t, isReservedContentSlug("guides/setup"))
}

func minimalContentPageSpec() string {
	return `openapi: 3.1.0
info:
  title: Content Page Test API
  version: 1.0.0
paths:
  /ping:
    get:
      operationId: getPing
      summary: Ping
      responses:
        "200":
          description: ok
`
}

func requireContentPage(t *testing.T, pages []*ppmodel.ContentPage, slug string) *ppmodel.ContentPage {
	t.Helper()
	for _, page := range pages {
		if page != nil && page.Slug == slug {
			return page
		}
	}
	require.Failf(t, "missing content page", "slug %q not found", slug)
	return nil
}

func contentPageIndex(pages []*ppmodel.ContentPage, slug string) int {
	for i, page := range pages {
		if page != nil && page.Slug == slug {
			return i
		}
	}
	return -1
}

func writeFile(t *testing.T, path string, body string) {
	t.Helper()
	require.NoError(t, os.MkdirAll(filepath.Dir(path), 0o755))
	require.NoError(t, os.WriteFile(path, []byte(body), 0o644))
}

func readFile(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	require.NoError(t, err)
	return string(data)
}

func silenceDefaultLogger() func() {
	previous := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(io.Discard, nil)))
	return func() {
		slog.SetDefault(previous)
	}
}

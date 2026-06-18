// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"database/sql"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/a-h/templ"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestAggregatePrintingPress_PressModel_GroupsServicesAndVersions(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeAggregateSpec(t, root, "services/users/src/specs/usersv2.yaml", "Users API", "v2")
	writeAggregateSpec(t, root, "services/auditing/src/things/specs/auditing.yaml", "Audit Events API", "1.0.0")
	writeAggregateSpec(t, root, "services/logistics/shipping/files/specs/spec.yaml", "Shipping API", "2024-06-01")
	writeAggregateSpec(t, root, "services/ignored/specs/ignore.yaml", "Ignored API", "v1")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:   filepath.Join(root, "site"),
		BuildMode:   AggregateBuildModeFull,
		IgnoreRules: []string{"services/ignored/**"},
		StateStore:  NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Services, 3)

	users := findCatalogService(t, catalog, "users")
	require.NotNil(t, users.LatestVersion)
	assert.Equal(t, "Users API", users.DisplayName)
	assert.Equal(t, "v2", users.LatestVersion.Label)
	require.Len(t, users.Versions, 2)
	assert.Equal(t, "v2", users.Versions[0].Label)
	assert.Equal(t, "v1", users.Versions[1].Label)
	assert.Equal(t, "services/users/index.html", users.OverviewHref)

	things := findCatalogService(t, catalog, "things")
	assert.Equal(t, "Audit Events API", things.DisplayName)

	shipping := findCatalogService(t, catalog, "shipping")
	assert.Equal(t, "2024-06-01", shipping.LatestVersion.Label)
	assert.Equal(t, "services/shipping/versions/2024-06-01/index.html", shipping.LatestVersion.OverviewHref)
}

func TestAggregatePrintingPress_PressModel_GroupsAPIsGuruStyleVersionFolders(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "APIs/adyen.com/AccountService/5/openapi.yaml", "Account API", "5")
	writeAggregateSpec(t, root, "APIs/adyen.com/AccountService/6/openapi.yaml", "Account API", "6")
	writeAggregateSpec(t, root, "APIs/amazonaws.com/appmesh/2018-10-01/openapi.yaml", "AWS App Mesh", "2018-10-01")
	writeAggregateSpec(t, root, "APIs/amazonaws.com/appmesh/2019-01-25/openapi.yaml", "AWS App Mesh", "2019-01-25")
	writeAggregateSpec(t, root, "APIs/ably.net/control/v1/openapi.yaml", "Ably Control API", "v1")
	writeAggregateSpec(t, root, "APIs/ably.net/control/1.0.14/openapi.yaml", "Ably Control API", "1.0.14")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  filepath.Join(root, "site"),
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Services, 3)

	account := findCatalogService(t, catalog, "account-service")
	require.NotNil(t, account)
	require.NotNil(t, account.LatestVersion)
	assert.Equal(t, "6", account.LatestVersion.Label)
	require.Len(t, account.Versions, 2)

	appmesh := findCatalogService(t, catalog, "appmesh")
	require.NotNil(t, appmesh)
	assert.Equal(t, "2019-01-25", appmesh.LatestVersion.Label)

	control := findCatalogService(t, catalog, "control")
	require.NotNil(t, control)
	assert.Equal(t, "1.0.14", control.LatestVersion.Label)
}

func TestAggregatePrintingPress_PrintHTML_RendersCatalogAndEntrySites(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeAggregateSpecWithContact(t, root, "services/users/src/specs/usersv2.yaml", "Users API", "Current account lifecycle endpoints.", "", "v2", "API Support", "support@example.com")

	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:   outputDir,
		BuildMode:   AggregateBuildModeFull,
		StateStore:  NewMemorySpecStateStore(),
		Title:       "Platform Catalog",
		Description: "Everything discovered in the repo.",
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	stats, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, stats.Services)
	assert.Equal(t, 2, stats.Specs)

	users := findCatalogService(t, catalog, "users")
	assert.Equal(t, "Current account lifecycle endpoints.", users.Summary)
	require.FileExists(t, filepath.Join(outputDir, "index.html"))

	require.Len(t, users.LatestVersion.Entries, 1)
	entry := users.LatestVersion.Entries[0]
	require.NotNil(t, entry.Contact)
	assert.Equal(t, "API Support", entry.Contact.Name)
	assert.Equal(t, "support@example.com", entry.Contact.Email)
	entryIndex := filepath.Join(outputDir, filepath.FromSlash(entry.OverviewHref))
	require.FileExists(t, entryIndex)
	_, err = os.Stat(filepath.Join(outputDir, filepath.FromSlash(users.OverviewHref)))
	assert.True(t, os.IsNotExist(err))
	_, err = os.Stat(filepath.Join(outputDir, filepath.FromSlash(users.VersionsHref)))
	assert.True(t, os.IsNotExist(err))
	_, err = os.Stat(filepath.Join(outputDir, filepath.FromSlash(users.LatestVersion.OverviewHref)))
	assert.True(t, os.IsNotExist(err))

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(rootHTML), "Platform Catalog")
	assert.Contains(t, string(rootHTML), `<pb33f-header name="Platform Catalog"`)
	assert.Contains(t, string(rootHTML), `<div class="pp-layout-fallback-header" aria-hidden="true">`)
	assert.Contains(t, string(rootHTML), `<span class="pp-layout-fallback-name">Platform Catalog</span>`)
	assert.Contains(t, string(rootHTML), "pb33f-theme-switcher")
	assert.Contains(t, string(rootHTML), `href="services/users/versions/v2/specs/users-api/index.html"`)
	assert.Contains(t, string(rootHTML), "static/printing-press.css")
	assert.Contains(t, string(rootHTML), "pp-catalog-card-summary")
	assert.Contains(t, string(rootHTML), "pp-catalog-contact-grid")
	assert.Contains(t, string(rootHTML), `<dt>Contact:</dt><dd>API Support</dd>`)
	assert.Contains(t, string(rootHTML), `<dt>Email</dt><dd><a href="mailto:support@example.com">support@example.com</a></dd>`)
	assert.Contains(t, string(rootHTML), "pp-model-card")
	assert.Contains(t, string(rootHTML), "Current account lifecycle endpoints.")
	assert.Contains(t, string(rootHTML), `v2 (latest)`)
	assert.Contains(t, string(rootHTML), `value="services/users/versions/v2/specs/users-api/index.html"`)
	assert.FileExists(t, filepath.Join(outputDir, "static", "printing-press.js"))
	assert.NotContains(t, string(rootHTML), "pp-catalog-eyebrow")
	assert.NotContains(t, string(rootHTML), "Browse Versions")
	assert.NotContains(t, string(rootHTML), "Open Service")
	assert.NotContains(t, string(rootHTML), `>Specs<`)
	assert.NotContains(t, string(rootHTML), `>Latest<`)

	entryHTML, err := os.ReadFile(entryIndex)
	require.NoError(t, err)
	assert.Contains(t, string(entryHTML), `data-pp-service-name="Users API"`)
	assert.Contains(t, string(entryHTML), `data-pp-current-version="v2"`)
	assert.Contains(t, string(entryHTML), `data-pp-versions=`)
	assert.Contains(t, string(entryHTML), `data-pp-catalog-href="../../../../../../index.html"`)
	assert.Contains(t, string(entryHTML), `data-pp-overview-href="index.html"`)
	assert.Contains(t, string(entryHTML), `href="../../../../../../static/printing-press.css"`)
	assert.Contains(t, string(entryHTML), `src="../../../../../../static/printing-press.js"`)
	assert.NoFileExists(t, filepath.Join(filepath.Dir(entryIndex), "static", "printing-press.js"))
	assert.NotContains(t, string(entryHTML), `data-pp-versions-href=`)

	entryOperationHTML, err := os.ReadFile(filepath.Join(filepath.Dir(entryIndex), "operations", "list-health.html"))
	require.NoError(t, err)
	assert.Contains(t, string(entryOperationHTML), `<base href="../">`)
	assert.Contains(t, string(entryOperationHTML), `data-pp-base-url="../"`)
	assert.Contains(t, string(entryOperationHTML), `href="../../../../../../static/printing-press.css"`)
	assert.Contains(t, string(entryOperationHTML), `src="../../../../../../static/printing-press.js"`)
}

func TestAggregatePrintingPress_ServedEntryNestedPagesUsePageAwareSharedAssets(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/users.yaml", "Users API", "v1")

	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		AssetMode:  HTMLAssetModeServed,
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	require.NoError(t, err)

	users := findCatalogService(t, catalog, "users")
	require.Len(t, users.LatestVersion.Entries, 1)
	entry := users.LatestVersion.Entries[0]
	entryDir := filepath.Join(outputDir, filepath.Dir(filepath.FromSlash(entry.OverviewHref)))
	operationHTML, err := os.ReadFile(filepath.Join(entryDir, "operations", "list-health.html"))
	require.NoError(t, err)
	rendered := string(operationHTML)
	assert.NotContains(t, rendered, `<base href=`)
	assert.Contains(t, rendered, `data-pp-base-url="../"`)
	assert.Contains(t, rendered, `href="../../../../../../../static/printing-press.css"`)
	assert.Contains(t, rendered, `src="../../../../../../../static/printing-press.js"`)
	assert.Contains(t, rendered, `data-pp-shared="data/nav"`)
	require.FileExists(t, filepath.Join(entryDir, "data", "nav.json"))
}

func TestAggregatePrintingPress_PrintHTML_RendersCatalogContentAndNav(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecWithDetails(t, root, "services/users/specs/users-public.yaml", "Users Public API", "Public user lifecycle endpoints.", "", "v1")
	writeAggregateSpecWithDetails(t, root, "services/users/specs/users-admin.yaml", "Users Admin API", "Admin user lifecycle endpoints.", "", "v1")
	writeFile(t, filepath.Join(root, "services", "users", "specs", "about.md"), `---
title: Service About
label: Service
description: Service-local context.
---
Service-local content renders only inside entry docs.
`)
	writeFile(t, filepath.Join(root, "services", "users", "specs", "docs", "runbook.md"), `---
title: Service Runbook
slug: guides/runbook
description: Per-service operating notes.
---
Runbook content for this service.
`)
	writeFile(t, filepath.Join(root, "_partials", "catalog-note.md"), "Shared catalog note.\n")
	writeFile(t, filepath.Join(root, "images", "map.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M1 1h8v8H1z"/></svg>`)
	writeFile(t, filepath.Join(root, "about.md"), `---
title: Catalog About
label: About
description: Higher-level catalog context.
---
{{<partial "catalog-note.md">}}

![Map](images/map.svg)

See the [setup guide](docs/guide.md).
`)
	writeFile(t, filepath.Join(root, "docs", "guide.md"), `---
title: Catalog Setup
label: Setup
slug: guides/setup
description: How teams use the API catalog.
---
Back to [about](../about.md).
`)
	writeFile(t, filepath.Join(root, "faq.md"), `---
title: Private FAQ
hidden: true
---
Hidden direct page.
`)

	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
		Title:      "Platform Catalog",
		AssetMode:  HTMLAssetModeServed,
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.ContentPages, 3)

	_, err = ap.PrintHTML()
	require.NoError(t, err)

	rootHTML := readAggregateFile(t, filepath.Join(outputDir, "index.html"))
	assert.Contains(t, rootHTML, `<pp-layout data-title="Platform Catalog">`)
	assert.Contains(t, rootHTML, `<pp-nav id="pp-nav" slot="nav" data-active="catalog" data-pp-preview-hold="true">`)
	assert.Contains(t, rootHTML, `class="pp-nav-preview"`)
	rootNav := catalogNavSegment(rootHTML)
	assert.Contains(t, rootNav, `class="nav-home active"`)
	assert.Contains(t, rootNav, `>API Catalog</a>`)
	assert.Contains(t, rootNav, `<h4>Guides</h4>`)
	assert.Contains(t, rootNav, `href="about.html"`)
	assert.Contains(t, rootNav, `href="guides/setup.html"`)
	assert.NotContains(t, rootNav, `Service About`)
	assert.NotContains(t, rootNav, `Service Runbook`)
	assert.Contains(t, rootNav, `class="nav-page-link"`)
	assert.Contains(t, rootNav, `class="nav-page-chevron"`)
	assert.NotContains(t, rootNav, `faq.html`)
	assert.NotContains(t, rootNav, `Users Public API`)

	guidesHTML := readAggregateFile(t, filepath.Join(outputDir, "guides.html"))
	assert.Contains(t, guidesHTML, `<pp-nav id="pp-nav" slot="nav" data-active="guides" data-pp-preview-hold="true">`)
	assert.Contains(t, guidesHTML, `href="about.html" class="pp-guide-card"`)
	assert.Contains(t, guidesHTML, `href="guides/setup.html" class="pp-guide-card"`)
	assert.NotContains(t, guidesHTML, `faq.html`)

	aboutHTML := readAggregateFile(t, filepath.Join(outputDir, "about.html"))
	assert.Contains(t, aboutHTML, `<sl-breadcrumb-item href="guides.html">GUIDES</sl-breadcrumb-item>`)
	breadcrumbIndex := strings.Index(aboutHTML, `<sl-breadcrumb class="pp-breadcrumb">`)
	descriptionIndex := strings.Index(aboutHTML, "Higher-level catalog context.")
	require.NotEqual(t, -1, breadcrumbIndex)
	require.NotEqual(t, -1, descriptionIndex)
	assert.Less(t, breadcrumbIndex, descriptionIndex)
	assert.Equal(t, 1, strings.Count(aboutHTML, "Higher-level catalog context."))
	assert.Contains(t, aboutHTML, "Shared catalog note.")
	assert.Contains(t, aboutHTML, `src="assets/docs/about/map.svg"`)
	assert.Contains(t, aboutHTML, `href="guides/setup.html"`)
	assert.FileExists(t, filepath.Join(outputDir, "assets", "docs", "about", "map.svg"))

	setupHTML := readAggregateFile(t, filepath.Join(outputDir, "guides", "setup.html"))
	assert.Contains(t, setupHTML, `<sl-breadcrumb-item href="../index.html">HOME</sl-breadcrumb-item>`)
	assert.Contains(t, setupHTML, `<sl-breadcrumb-item href="../guides.html">GUIDES</sl-breadcrumb-item>`)
	assert.Contains(t, setupHTML, `href="../about.html"`)
	assert.Contains(t, catalogNavSegment(setupHTML), `href="../index.html"`)
	assert.Contains(t, catalogNavSegment(setupHTML), `class="nav-page-link active" href="setup.html"`)

	faqHTML := readAggregateFile(t, filepath.Join(outputDir, "faq.html"))
	assert.Contains(t, faqHTML, "Hidden direct page.")
	assert.NotContains(t, catalogNavSegment(faqHTML), `faq.html`)

	versionHTML := readAggregateFile(t, filepath.Join(outputDir, "services", "users", "versions", "v1", "index.html"))
	assert.NotContains(t, versionHTML, `data-pp-preview-hold="true"`)

	users := findCatalogService(t, catalog, "users")
	require.NotEmpty(t, users.LatestVersion.Entries)
	entryDir := filepath.Dir(filepath.FromSlash(users.LatestVersion.Entries[0].OverviewHref))
	assert.FileExists(t, filepath.Join(outputDir, entryDir, "about.html"))
	assert.FileExists(t, filepath.Join(outputDir, entryDir, "guides", "runbook.html"))
	entryNav := readAggregateFile(t, filepath.Join(outputDir, entryDir, "data", "nav.json"))
	assert.Contains(t, entryNav, `"data-pages"`)
	assert.Contains(t, entryNav, "Service About")
	assert.Contains(t, entryNav, "guides/runbook.html")
	entryHTML := readAggregateFile(t, filepath.Join(outputDir, filepath.FromSlash(users.LatestVersion.Entries[0].OverviewHref)))
	assert.Contains(t, entryHTML, `data-has-content-pages="true"`)
	serviceAboutHTML := readAggregateFile(t, filepath.Join(outputDir, entryDir, "about.html"))
	assert.Contains(t, serviceAboutHTML, "Service-local content renders only inside entry docs.")
	serviceRunbookHTML := readAggregateFile(t, filepath.Join(outputDir, entryDir, "guides", "runbook.html"))
	assert.Contains(t, serviceRunbookHTML, "Runbook content for this service.")

	require.NoError(t, os.Remove(filepath.Join(root, "about.md")))
	apNext, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
		Title:      "Platform Catalog",
		AssetMode:  HTMLAssetModeServed,
	})
	require.NoError(t, err)
	_, err = apNext.PrintHTML()
	require.NoError(t, err)
	assert.NoFileExists(t, filepath.Join(outputDir, "about.html"))
	assert.NoFileExists(t, filepath.Join(outputDir, "assets", "docs", "about", "map.svg"))
	assert.FileExists(t, filepath.Join(outputDir, "guides", "setup.html"))
}

func TestAggregatePrintingPress_PrintHTML_RendersCatalogDiagnosticsCounts(t *testing.T) {
	root := t.TempDir()
	usersRel := "services/users/src/specs/users.yaml"
	writeAggregateSpec(t, root, usersRel, "Users API", "v1")
	writeAggregateSpec(t, root, "services/clean/src/specs/clean.yaml", "Clean API", "v1")

	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{
		HTML:          true,
		DeveloperMode: true,
		SpecLintResults: map[string][]*drV3.RuleFunctionResult{
			usersRel: {
				aggregateTestLintResultWithSeverity("error diagnostic", "error"),
				aggregateTestLintResultWithSeverity("warning diagnostic", "warn"),
				aggregateTestLintResultWithSeverity("info diagnostic", "info"),
			},
		},
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	users := findCatalogService(t, catalog, "users")
	require.NotNil(t, users.Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Errors: 1, Warns: 1, Infos: 1}, users.Counts)
	require.NotNil(t, users.LatestVersion.Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Errors: 1, Warns: 1, Infos: 1}, users.LatestVersion.Counts)
	require.NotNil(t, users.LatestVersion.Entries[0].Counts)
	assert.Equal(t, &ppmodel.ViolationCounts{Errors: 1, Warns: 1, Infos: 1}, users.LatestVersion.Entries[0].Counts)
	clean := findCatalogService(t, catalog, "clean")
	assert.Nil(t, clean.Counts)

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	rootRendered := string(rootHTML)
	assert.Equal(t, 1, strings.Count(rootRendered, `class="pp-catalog-diagnostics"`))
	assert.Contains(t, rootRendered, `href="services/users/versions/v1/specs/users-api/diagnostics.html"`)
	assert.Contains(t, rootRendered, `aria-label="Diagnostics: 1 error, 1 warning, 1 info"`)
	assert.Contains(t, rootRendered, `<sl-icon name="exclamation-square" aria-hidden="true"></sl-icon><span class="pp-catalog-diagnostic-number">1</span>`)
	assert.Contains(t, rootRendered, `<sl-icon name="exclamation-triangle" aria-hidden="true"></sl-icon><span class="pp-catalog-diagnostic-number">1</span>`)
	assert.Contains(t, rootRendered, `<sl-icon name="info-square" aria-hidden="true"></sl-icon><span class="pp-catalog-diagnostic-number">1</span>`)
}

func TestAggregateEntrySharedAssetBaseURL(t *testing.T) {
	assert.Empty(t, (*AggregatePrintingPress)(nil).entrySharedAssetBaseURL(&aggregateDiscoveredSpec{}))
	assert.Empty(t, (&AggregatePrintingPress{}).entrySharedAssetBaseURL(&aggregateDiscoveredSpec{}))
	assert.Empty(t, (&AggregatePrintingPress{config: &AggregatePrintingPressConfig{}}).entrySharedAssetBaseURL(nil))

	ap := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{}}
	assert.Equal(t, "static", ap.entrySharedAssetBaseURL(&aggregateDiscoveredSpec{}))
	assert.Equal(t, "../../static", ap.entrySharedAssetBaseURL(&aggregateDiscoveredSpec{OutputSubdir: "services/users"}))
	assert.Equal(t, "../../../static", ap.entrySharedAssetBaseURL(&aggregateDiscoveredSpec{OutputSubdir: "/services/users/v1/"}))

	hosted := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{BaseURL: "/docs/"}}
	assert.Equal(t, "/docs/static", hosted.entrySharedAssetBaseURL(&aggregateDiscoveredSpec{OutputSubdir: "services/users"}))

	invalidHosted := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{BaseURL: "docs"}}
	assert.Equal(t, "../static", invalidHosted.entrySharedAssetBaseURL(&aggregateDiscoveredSpec{OutputSubdir: "users"}))
}

func TestAggregatePrintingPress_PrintHTML_HidesSingleVersionSwitchersAndFallsBackToDescription(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecWithDetails(t, root, "services/billing/specs/billing.yaml", "Billing API", "", "Invoice and payment lifecycle coverage for operators.", "v1")

	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	billing := findCatalogService(t, catalog, "billing")
	assert.Equal(t, "Invoice and payment lifecycle coverage for operators.", billing.Summary)

	_, err = ap.PrintHTML()
	require.NoError(t, err)

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.NotContains(t, string(rootHTML), "pp-catalog-card-picker")

	_, err = os.Stat(filepath.Join(outputDir, filepath.FromSlash(billing.OverviewHref)))
	assert.True(t, os.IsNotExist(err))

	entryHTML, err := os.ReadFile(filepath.Join(outputDir, filepath.FromSlash(billing.LatestVersion.Entries[0].OverviewHref)))
	require.NoError(t, err)
	assert.NotContains(t, string(entryHTML), `data-pp-versions=`)
}

func TestCatalogRootContent_RendersAllWarningsInSingleAttentionBox(t *testing.T) {
	catalog := &ppmodel.CatalogSite{
		Warnings: []*ppmodel.BuildWarning{
			{Message: "skipped render build for discovered spec", Context: "APIs/1forge.com/0.0.1/swagger.yaml"},
			{Message: "skipped render build for discovered spec", Context: "APIs/example.com/2024-01-01/openapi.yaml"},
		},
	}

	var html strings.Builder
	err := catalogRootContent(catalog, false).Render(context.Background(), &html)
	require.NoError(t, err)

	rendered := html.String()
	assert.Contains(t, rendered, `headerText="Skipped Render Builds"`)
	assert.Contains(t, rendered, `<ul class="pp-catalog-warning-list">`)
	assert.Contains(t, rendered, `<li>skipped render build for discovered spec (APIs/1forge.com/0.0.1/swagger.yaml)</li>`)
	assert.Contains(t, rendered, `<li>skipped render build for discovered spec (APIs/example.com/2024-01-01/openapi.yaml)</li>`)
	assert.NotContains(t, rendered, `</p></pb33f-attention-box>`)
}

func TestCatalogRootContent_DisableSkippedRenderingSuppressesWarningBox(t *testing.T) {
	catalog := &ppmodel.CatalogSite{
		Warnings: []*ppmodel.BuildWarning{
			{Message: "skipped render build for discovered spec", Context: "APIs/1forge.com/0.0.1/swagger.yaml"},
		},
		Services: []*ppmodel.CatalogService{
			{
				DisplayName: "Users API",
				Versions: []*ppmodel.CatalogVersion{
					{
						Label: "v1",
						Entries: []*ppmodel.CatalogSpecEntry{
							{OverviewHref: "services/users/versions/v1/specs/users-api/index.html"},
						},
					},
				},
			},
		},
	}

	var html strings.Builder
	err := catalogRootContent(catalog, true).Render(context.Background(), &html)
	require.NoError(t, err)

	rendered := html.String()
	assert.NotContains(t, rendered, `pb33f-attention-box`)
	assert.Contains(t, rendered, `Users API`)
}

func TestCatalogShell_WithContentNavIncludesVersionSelectScript(t *testing.T) {
	page := catalogPageData{
		RelPath:        pppaths.FileIndexHTML,
		HeaderTitle:    "Platform Catalog",
		Title:          "Platform Catalog",
		Content:        templ.ComponentFunc(func(ctx context.Context, w io.Writer) error { _, err := w.Write([]byte("content")); return err }),
		ShowCatalogNav: true,
		CatalogPages: []*ppmodel.ContentPage{
			{Title: "About", Label: "About", Slug: "about", Href: "about.html"},
		},
		ActiveNavSlug: "catalog",
	}
	var html strings.Builder
	require.NoError(t, catalogShell(page).Render(context.Background(), &html))
	assert.Contains(t, html.String(), `sl-menu[data-catalog-version-menu]`)
}

func TestCatalogVersionPrimaryHref_UsesVersionOverviewForCollisions(t *testing.T) {
	version := &ppmodel.CatalogVersion{
		OverviewHref: "services/account-service/versions/5/index.html",
		Entries: []*ppmodel.CatalogSpecEntry{
			{OverviewHref: "services/account-service/versions/5/specs/account-api/index.html"},
			{OverviewHref: "services/account-service/versions/5/specs/account-api-alt/index.html"},
		},
	}

	assert.Equal(t, "services/account-service/versions/5/index.html", catalogVersionPrimaryHref(version))
}

func TestAggregatePrintingPress_FastMode_RebuildsOnlyChangedSpecsAndRemovesStaleOutputs(t *testing.T) {
	root := t.TempDir()
	specPath := writeAggregateSpec(t, root, "services/users/src/specs/users.yaml", "Users API", "v1")
	outputDir := filepath.Join(root, "site")

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir: outputDir,
		BuildMode: AggregateBuildModeFull,
	})
	require.NoError(t, err)
	catalog, err := full.PressModel()
	require.NoError(t, err)
	users := findCatalogService(t, catalog, "users")
	oldEntry := users.LatestVersion.Entries[0]
	oldIndex := filepath.Join(outputDir, filepath.FromSlash(oldEntry.OverviewHref))

	firstStats, err := full.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, firstStats.ChangedSpecs)
	infoBefore, err := os.Stat(oldIndex)
	require.NoError(t, err)

	time.Sleep(20 * time.Millisecond)

	fastNoChange, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir: outputDir,
		BuildMode: AggregateBuildModeFast,
	})
	require.NoError(t, err)
	secondStats, err := fastNoChange.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 0, secondStats.ChangedSpecs)
	infoAfter, err := os.Stat(oldIndex)
	require.NoError(t, err)
	assert.Equal(t, infoBefore.ModTime(), infoAfter.ModTime())

	writeAggregateSpec(t, root, "services/users/src/specs/users.yaml", "Users API", "v2")

	fastChanged, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir: outputDir,
		BuildMode: AggregateBuildModeFast,
	})
	require.NoError(t, err)
	changedCatalog, err := fastChanged.PressModel()
	require.NoError(t, err)
	changedUsers := findCatalogService(t, changedCatalog, "users")
	newEntry := changedUsers.LatestVersion.Entries[0]
	newIndex := filepath.Join(outputDir, filepath.FromSlash(newEntry.OverviewHref))
	thirdStats, err := fastChanged.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, thirdStats.ChangedSpecs)
	require.NoFileExists(t, oldIndex)
	require.FileExists(t, newIndex)

	require.NoError(t, os.Remove(specPath))

	fastRemoved, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir: outputDir,
		BuildMode: AggregateBuildModeFast,
	})
	require.NoError(t, err)
	fourthStats, err := fastRemoved.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 0, fourthStats.Specs)
	require.NoFileExists(t, newIndex)
}

func TestAggregatePrintingPress_FastMode_RebuildsEntryWhenServiceContentChanges(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/specs/users.yaml", "Users API", "v1")
	contentPath := filepath.Join(root, "services", "users", "specs", "about.md")
	docsPath := filepath.Join(root, "services", "users", "specs", "docs", "reference", "runbook.md")
	missingImagePagePath := filepath.Join(root, "services", "users", "specs", "docs", "reference", "late-image.md")
	partialPath := filepath.Join(root, "services", "users", "specs", "_partials", "notice.md")
	shadowedPartialPath := filepath.Join(root, "services", "users", "specs", "docs", "_partials", "notice.md")
	unusedPartialPath := filepath.Join(root, "services", "users", "specs", "_partials", "unused.md")
	imagePath := filepath.Join(root, "services", "users", "specs", "docs", "reference", "images", "badge.svg")
	missingImagePath := filepath.Join(root, "services", "users", "specs", "docs", "reference", "images", "late.svg")
	shadowedImagePath := filepath.Join(root, "services", "users", "specs", "docs", "reference", "images", "shadowed.svg")
	unusedImagePath := filepath.Join(root, "services", "users", "specs", "docs", "reference", "images", "unused.svg")
	writeFile(t, contentPath, `---
title: Service Notes
---
Initial service notes.
`)
	writeFile(t, partialPath, `Initial shared notice.

![Badge](images/badge.svg)
`)
	writeFile(t, shadowedPartialPath, `Shadowed notice.

![Shadowed](images/shadowed.svg)
`)
	writeFile(t, unusedPartialPath, `Unused notice.

![Unused](images/unused.svg)
`)
	writeFile(t, imagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Initial badge</title><path d="M1 1h8v8H1z"/></svg>`)
	writeFile(t, shadowedImagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Initial shadowed badge</title><path d="M1 1h8v8H1z"/></svg>`)
	writeFile(t, unusedImagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Initial unused badge</title><path d="M1 1h8v8H1z"/></svg>`)
	writeFile(t, docsPath, `---
title: Service Runbook
slug: guides/runbook
---
{{<partial "notice.md">}}

Runbook from docs.
`)
	writeFile(t, missingImagePagePath, `---
title: Late Image
slug: guides/late-image
---
This page references an image that is created after the first build.

![Late](images/late.svg)
`)
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
	})
	require.NoError(t, err)
	catalog, err := full.PressModel()
	require.NoError(t, err)
	users := findCatalogService(t, catalog, "users")
	entryDir := filepath.Join(outputDir, filepath.Dir(filepath.FromSlash(users.LatestVersion.Entries[0].OverviewHref)))
	firstStats, err := full.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, firstStats.ChangedSpecs)
	aboutPath := filepath.Join(entryDir, "about.html")
	runbookPath := filepath.Join(entryDir, "guides", "runbook.html")
	badgePath := filepath.Join(entryDir, "assets", "docs", "guides", "runbook", "badge.svg")
	lateImageAssetPath := filepath.Join(entryDir, "assets", "docs", "guides", "late-image", "late.svg")
	require.FileExists(t, aboutPath)
	require.FileExists(t, runbookPath)
	require.FileExists(t, badgePath)
	require.NoFileExists(t, lateImageAssetPath)
	assert.Contains(t, readAggregateFile(t, aboutPath), "Initial service notes.")
	assert.Contains(t, readAggregateFile(t, runbookPath), "Initial shared notice.")
	assert.Contains(t, readAggregateFile(t, badgePath), "Initial badge")

	fastNoChange, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	secondStats, err := fastNoChange.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 0, secondStats.ChangedSpecs)

	writeFile(t, shadowedPartialPath, `Updated shadowed notice.

![Shadowed](images/shadowed.svg)
`)
	writeFile(t, shadowedImagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Updated shadowed badge</title><path d="M2 2h6v6H2z"/></svg>`)
	writeFile(t, unusedPartialPath, `Updated unused notice.

![Unused](images/unused.svg)
`)
	writeFile(t, unusedImagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Updated unused badge</title><path d="M2 2h6v6H2z"/></svg>`)
	fastIgnoredContent, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	ignoredStats, err := fastIgnoredContent.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 0, ignoredStats.ChangedSpecs)

	writeFile(t, missingImagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Late badge</title><path d="M4 4h2v2H4z"/></svg>`)
	fastMissingImageAdded, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	missingImageStats, err := fastMissingImageAdded.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, missingImageStats.ChangedSpecs)
	require.FileExists(t, lateImageAssetPath)
	assert.Contains(t, readAggregateFile(t, lateImageAssetPath), "Late badge")

	writeFile(t, contentPath, `---
title: Service Notes
---
Updated service notes.
`)
	fastChanged, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	thirdStats, err := fastChanged.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, thirdStats.ChangedSpecs)
	updatedAbout := readAggregateFile(t, aboutPath)
	assert.Contains(t, updatedAbout, "Updated service notes.")
	assert.NotContains(t, updatedAbout, "Initial service notes.")

	writeFile(t, docsPath, `---
title: Service Runbook
slug: guides/runbook
---
{{<partial "notice.md">}}

Updated runbook from docs.

![Badge](../images/badge.svg)
`)
	fastDocsChanged, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	fourthStats, err := fastDocsChanged.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, fourthStats.ChangedSpecs)
	updatedRunbook := readAggregateFile(t, runbookPath)
	assert.Contains(t, updatedRunbook, "Updated runbook from docs.")
	assert.NotContains(t, updatedRunbook, "Runbook from docs.")

	writeFile(t, partialPath, `Updated shared notice.

![Badge](images/badge.svg)
`)
	fastPartialChanged, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	fifthStats, err := fastPartialChanged.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, fifthStats.ChangedSpecs)
	repartialedRunbook := readAggregateFile(t, runbookPath)
	assert.Contains(t, repartialedRunbook, "Updated shared notice.")
	assert.NotContains(t, repartialedRunbook, "Initial shared notice.")

	writeFile(t, imagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Updated badge</title><path d="M2 2h6v6H2z"/></svg>`)
	fastImageChanged, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	sixthStats, err := fastImageChanged.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, sixthStats.ChangedSpecs)
	updatedBadge := readAggregateFile(t, badgePath)
	assert.Contains(t, updatedBadge, "Updated badge")
	assert.NotContains(t, updatedBadge, "Initial badge")

	require.NoError(t, os.Remove(imagePath))
	fastImageDeleted, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	seventhStats, err := fastImageDeleted.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, seventhStats.ChangedSpecs)
	require.NoFileExists(t, badgePath)

	writeFile(t, imagePath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Restored badge</title><path d="M3 3h4v4H3z"/></svg>`)
	fastImageRestored, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	eighthStats, err := fastImageRestored.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, eighthStats.ChangedSpecs)
	require.FileExists(t, badgePath)
	assert.Contains(t, readAggregateFile(t, badgePath), "Restored badge")

	require.NoError(t, os.Remove(docsPath))
	fastDocsDeleted, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	ninthStats, err := fastDocsDeleted.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, ninthStats.ChangedSpecs)
	require.NoFileExists(t, runbookPath)
	require.NoFileExists(t, badgePath)

	writeFile(t, docsPath, `---
title: Service Runbook
slug: guides/runbook
---
Restored runbook.
`)
	fastDocsRestored, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	tenthStats, err := fastDocsRestored.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, tenthStats.ChangedSpecs)
	require.FileExists(t, runbookPath)

	require.NoError(t, os.Remove(contentPath))
	fastDeleted, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	eleventhStats, err := fastDeleted.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, eleventhStats.ChangedSpecs)
	require.NoFileExists(t, aboutPath)
}

func TestAggregatePrintingPress_FastMode_IgnoresImagesOutsideServiceContentRoot(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/specs/users.yaml", "Users API", "v1")
	writeFile(t, filepath.Join(root, "services", "users", "specs", "docs", "reference", "outside-image.md"), `---
title: Outside Image
slug: guides/outside-image
---
This page references an image outside the service content root.

![Outside](../../../outside/late.svg)
`)
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
	})
	require.NoError(t, err)
	firstStats, err := full.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, firstStats.ChangedSpecs)

	writeFile(t, filepath.Join(root, "services", "users", "outside", "late.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><title>Outside</title></svg>`)
	fast, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	secondStats, err := fast.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 0, secondStats.ChangedSpecs)
}

func TestAggregatePrintingPress_FastMode_RebuildsWhenDiagnosticsRenderOptionsChange(t *testing.T) {
	root := t.TempDir()
	relPath := "services/users/src/specs/users.yaml"
	writeAggregateSpec(t, root, relPath, "Users API", "v1")
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
	})
	require.NoError(t, err)
	catalog, err := full.PressModel()
	require.NoError(t, err)
	users := findCatalogService(t, catalog, "users")
	entryDir := filepath.Join(outputDir, filepath.Dir(filepath.FromSlash(users.LatestVersion.Entries[0].OverviewHref)))

	firstStats, err := full.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)
	assert.Equal(t, 1, firstStats.ChangedSpecs)
	require.NoFileExists(t, filepath.Join(entryDir, "diagnostics.html"))

	fastDiagnostics, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	diagnosticResults := map[string][]*drV3.RuleFunctionResult{
		relPath: {aggregateTestLintResult("first diagnostic message")},
	}
	secondStats, err := fastDiagnostics.PrintSelectedOutputs(AggregateRenderOptions{
		HTML:            true,
		DeveloperMode:   true,
		SpecLintResults: diagnosticResults,
	})
	require.NoError(t, err)
	assert.Equal(t, 1, secondStats.ChangedSpecs)
	require.FileExists(t, filepath.Join(entryDir, "diagnostics.html"))
	firstPayload := readAggregateDiagnosticsPayload(t, entryDir)
	assert.Contains(t, firstPayload, "first diagnostic message")

	fastSameDiagnostics, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	thirdStats, err := fastSameDiagnostics.PrintSelectedOutputs(AggregateRenderOptions{
		HTML:            true,
		DeveloperMode:   true,
		SpecLintResults: diagnosticResults,
	})
	require.NoError(t, err)
	assert.Equal(t, 0, thirdStats.ChangedSpecs)

	fastChangedDiagnostics, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)
	changedResults := map[string][]*drV3.RuleFunctionResult{
		relPath: {aggregateTestLintResult("second diagnostic message")},
	}
	fourthStats, err := fastChangedDiagnostics.PrintSelectedOutputs(AggregateRenderOptions{
		HTML:            true,
		DeveloperMode:   true,
		SpecLintResults: changedResults,
	})
	require.NoError(t, err)
	assert.Equal(t, 1, fourthStats.ChangedSpecs)
	changedPayload := readAggregateDiagnosticsPayload(t, entryDir)
	assert.Contains(t, changedPayload, "second diagnostic message")
	assert.NotContains(t, changedPayload, "first diagnostic message")
}

func TestAggregatePrintingPress_FastMode_RemovesStaleAggregateServiceAndVersionArtifacts(t *testing.T) {
	root := t.TempDir()
	specA := writeAggregateSpec(t, root, "services/users/src/specs/users-a.yaml", "Users API", "v1")
	specB := writeAggregateSpec(t, root, "services/users/src/specs/users-b.yaml", "Users API", "v1")
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
	})
	require.NoError(t, err)

	stats, err := full.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.Services)
	assert.Equal(t, 1, stats.Versions)
	assert.Equal(t, 2, stats.Specs)

	versionOverview := filepath.Join(outputDir, "services", "users", "versions", "v1", "index.html")
	serviceJSON := filepath.Join(outputDir, "services", "users", "index.json")
	serviceLLM := filepath.Join(outputDir, "services", "users", "llms.txt")
	versionJSON := filepath.Join(outputDir, "services", "users", "versions", "v1", "index.json")
	versionLLM := filepath.Join(outputDir, "services", "users", "versions", "v1", "llms.txt")
	entryBDir := filepath.Join(outputDir, "services", "users", "versions", "v1", "specs", "users-api-2")

	require.FileExists(t, versionOverview)
	require.FileExists(t, serviceJSON)
	require.FileExists(t, serviceLLM)
	require.FileExists(t, versionJSON)
	require.FileExists(t, versionLLM)
	require.FileExists(t, filepath.Join(entryBDir, "index.html"))

	require.NoError(t, os.Remove(specB))

	fastOneLeft, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)

	stats, err = fastOneLeft.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.Services)
	assert.Equal(t, 1, stats.Versions)
	assert.Equal(t, 1, stats.Specs)
	require.NoFileExists(t, versionOverview)
	require.NoFileExists(t, entryBDir)
	require.FileExists(t, serviceJSON)
	require.FileExists(t, serviceLLM)
	require.FileExists(t, versionJSON)
	require.FileExists(t, versionLLM)

	require.NoError(t, os.Remove(specA))

	fastRemoved, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)

	stats, err = fastRemoved.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	require.NoError(t, err)
	assert.Equal(t, 0, stats.Services)
	assert.Equal(t, 0, stats.Versions)
	assert.Equal(t, 0, stats.Specs)
	require.NoFileExists(t, serviceJSON)
	require.NoFileExists(t, serviceLLM)
	require.NoFileExists(t, versionJSON)
	require.NoFileExists(t, versionLLM)

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.NotContains(t, string(rootHTML), "Users API")
}

func TestAggregatePrintingPress_FastMode_RebuildsWhenAggregateConfigChanges(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/users.yaml", "Users API", "v1")
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:        outputDir,
		BuildMode:        AggregateBuildModeFull,
		StateStore:       store,
		ServiceOverrides: []AggregatePathOverride{{Pattern: "services/users/**", Value: "foo"}},
	})
	require.NoError(t, err)

	_, err = full.PrintHTML()
	require.NoError(t, err)
	oldIndex := filepath.Join(outputDir, "services", "foo", "versions", "v1", "specs", "users-api", "index.html")
	require.FileExists(t, oldIndex)

	fast, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:        outputDir,
		BuildMode:        AggregateBuildModeFast,
		StateStore:       store,
		ServiceOverrides: []AggregatePathOverride{{Pattern: "services/users/**", Value: "bar"}},
	})
	require.NoError(t, err)

	stats, err := fast.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, stats.ChangedSpecs)

	newIndex := filepath.Join(outputDir, "services", "bar", "versions", "v1", "specs", "users-api", "index.html")
	require.NoFileExists(t, oldIndex)
	require.FileExists(t, newIndex)

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(rootHTML), `href="services/bar/versions/v1/specs/users-api/index.html"`)
	assert.NotContains(t, string(rootHTML), `services/foo/versions/v1/specs/users-api/index.html`)
}

func TestAggregatePrintingPress_WatchMode_RebuildsWhenReusingSameInstance(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/users.yaml", "Users API", "v1")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeWatch,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	firstCatalog, err := ap.PressModel()
	require.NoError(t, err)
	firstUsers := findCatalogService(t, firstCatalog, "users")
	firstIndex := filepath.Join(outputDir, filepath.FromSlash(firstUsers.LatestVersion.Entries[0].OverviewHref))

	firstStats, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, firstStats.ChangedSpecs)
	require.FileExists(t, firstIndex)

	writeAggregateSpec(t, root, "services/users/src/specs/users.yaml", "Users API", "v2")

	secondStats, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 1, secondStats.ChangedSpecs)

	secondCatalog, err := ap.PressModel()
	require.NoError(t, err)
	secondUsers := findCatalogService(t, secondCatalog, "users")
	secondIndex := filepath.Join(outputDir, filepath.FromSlash(secondUsers.LatestVersion.Entries[0].OverviewHref))

	require.NoFileExists(t, firstIndex)
	require.FileExists(t, secondIndex)
	assert.Equal(t, "v2", secondUsers.LatestVersion.Label)
}

func TestAggregatePrintingPress_PrintJSONArtifactsAndLLM(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	jsonStats, err := ap.PrintJSONArtifacts()
	require.NoError(t, err)
	assert.Equal(t, 1, jsonStats.Specs)
	require.FileExists(t, filepath.Join(outputDir, "bundle.json"))
	require.FileExists(t, filepath.Join(outputDir, "manifest.json"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "index.json"))

	llmStats, err := ap.PrintLLM()
	require.NoError(t, err)
	assert.Equal(t, 1, llmStats.Specs)
	require.FileExists(t, filepath.Join(outputDir, "AGENTS.md"))
	require.FileExists(t, filepath.Join(outputDir, "llms.txt"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "llms.txt"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v1", "llms.txt"))
}

func TestAggregatePrintingPress_PrintLLM_WritesLinkedCatalogIndexes(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeAggregateSpec(t, root, "services/users/src/specs/usersv2.yaml", "Users API", "v2")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		Title:      "Platform Catalog",
	})
	require.NoError(t, err)

	_, err = ap.PrintLLM()
	require.NoError(t, err)

	rootAgents, err := os.ReadFile(filepath.Join(outputDir, "AGENTS.md"))
	require.NoError(t, err)
	assert.Contains(t, string(rootAgents), "[llms.txt](llms.txt)")
	assert.Contains(t, string(rootAgents), "[Users API](services/users/llms.txt)")
	assert.Contains(t, string(rootAgents), "[v2](services/users/versions/v2/llms.txt)")
	assert.Contains(t, string(rootAgents), "(services/users/versions/v2/specs/users-api/llms.txt)")
	assert.Contains(t, string(rootAgents), "(services/users/versions/v2/specs/users-api/AGENTS.md)")

	rootIndex, err := os.ReadFile(filepath.Join(outputDir, "llms.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(rootIndex), "[AGENTS.md](AGENTS.md)")
	assert.Contains(t, string(rootIndex), "[Users API](services/users/llms.txt)")
	assert.Contains(t, string(rootIndex), "[v2](services/users/versions/v2/llms.txt)")
	assert.Contains(t, string(rootIndex), "(services/users/versions/v2/specs/users-api/llms.txt)")

	serviceIndex, err := os.ReadFile(filepath.Join(outputDir, "services", "users", "llms.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(serviceIndex), "[Catalog AGENTS.md](../../AGENTS.md)")
	assert.Contains(t, string(serviceIndex), "[Catalog llms.txt](../../llms.txt)")
	assert.Contains(t, string(serviceIndex), "[v2](versions/v2/llms.txt)")
	assert.Contains(t, string(serviceIndex), "(versions/v2/specs/users-api/llms.txt)")

	versionIndex, err := os.ReadFile(filepath.Join(outputDir, "services", "users", "versions", "v2", "llms.txt"))
	require.NoError(t, err)
	assert.Contains(t, string(versionIndex), "[Catalog AGENTS.md](../../../../AGENTS.md)")
	assert.Contains(t, string(versionIndex), "[Catalog llms.txt](../../../../llms.txt)")
	assert.Contains(t, string(versionIndex), "[Users API llms.txt](../../llms.txt)")
	assert.Contains(t, string(versionIndex), "(specs/users-api/llms.txt)")
	assert.Contains(t, string(versionIndex), "(specs/users-api/AGENTS.md)")
}

func TestAggregatePrintingPress_DefaultOutputsPreserveHTMLEntrySites(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeAggregateSpec(t, root, "services/users/src/specs/usersv2.yaml", "Users API", "v2")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	_, err = ap.PrintHTML()
	require.NoError(t, err)
	_, err = ap.PrintLLM()
	require.NoError(t, err)
	_, err = ap.PrintJSONArtifacts()
	require.NoError(t, err)

	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v2", "specs", "users-api", "index.html"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v2", "specs", "users-api", "llms.txt"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v2", "specs", "users-api", "bundle.json"))
}

func TestAggregatePrintingPress_FastMode_ClearsStaleEntryArtifactsForJSONAndLLMOnly(t *testing.T) {
	root := t.TempDir()
	specPath := "services/widgets/specs/widgets.yaml"
	writeAggregateSpecDocument(t, root, specPath, aggregateSpecDocument(
		"Widgets API",
		"v1",
		[]string{
			`  /widgets:
    get:
      operationId: get-widget
      responses:
        "200":
          description: ok
  /widgets/{id}:
    delete:
      operationId: delete-widget
      responses:
        "204":
          description: deleted`,
		},
		[]string{
			`    widget:
      type: object
      properties:
        id:
          type: string`,
			`    obsolete-widget:
      type: object
      properties:
        id:
          type: string`,
		},
	))
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	full, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: store,
	})
	require.NoError(t, err)

	initialCatalog, err := full.PressModel()
	require.NoError(t, err)
	initialEntryDir := filepath.Join(outputDir, filepath.Dir(filepath.FromSlash(findCatalogService(t, initialCatalog, "widgets").LatestVersion.Entries[0].OverviewHref)))

	_, err = full.PrintSelectedOutputs(AggregateRenderOptions{JSON: true, LLM: true})
	require.NoError(t, err)

	staleOperationJSON := filepath.Join(initialEntryDir, "operations", "delete-widget.json")
	staleOperationLLM := filepath.Join(initialEntryDir, "operations", "delete-widget.md")
	staleModelJSON := filepath.Join(initialEntryDir, "models", "schemas", "obsolete-widget.json")
	staleModelLLM := filepath.Join(initialEntryDir, "models", "schemas", "obsolete-widget.md")
	require.FileExists(t, staleOperationJSON)
	require.FileExists(t, staleOperationLLM)
	require.FileExists(t, staleModelJSON)
	require.FileExists(t, staleModelLLM)

	writeAggregateSpecDocument(t, root, specPath, aggregateSpecDocument(
		"Widgets API",
		"v1",
		[]string{
			`  /widgets:
    get:
      operationId: get-widget
      responses:
        "200":
          description: ok`,
		},
		[]string{
			`    widget:
      type: object
      properties:
        id:
          type: string`,
		},
	))

	fast, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFast,
		StateStore: store,
	})
	require.NoError(t, err)

	stats, err := fast.PrintSelectedOutputs(AggregateRenderOptions{JSON: true, LLM: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.ChangedSpecs)

	require.NoFileExists(t, staleOperationJSON)
	require.NoFileExists(t, staleOperationLLM)
	require.NoFileExists(t, staleModelJSON)
	require.NoFileExists(t, staleModelLLM)
	require.FileExists(t, filepath.Join(initialEntryDir, "operations", "get-widget.json"))
	require.FileExists(t, filepath.Join(initialEntryDir, "operations", "get-widget.md"))
	require.FileExists(t, filepath.Join(initialEntryDir, "models", "schemas", "widget.json"))
	require.FileExists(t, filepath.Join(initialEntryDir, "models", "schemas", "widget.md"))
}

func TestAggregatePrintingPress_PrintHTML_SkipsUnsupportedSpecsAndContinues(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeSwaggerTwoSpec(t, root, "legacy/payments/specs/swagger.yaml", "Legacy Payments API", "1.0")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	stats, err := ap.PrintHTML()
	require.NoError(t, err)
	require.NotEmpty(t, stats.Warnings)
	require.FileExists(t, filepath.Join(outputDir, "index.html"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v1", "specs", "users-api", "index.html"))
	require.NoFileExists(t, filepath.Join(outputDir, "services", "payments", "versions", "1-0", "specs", "legacy-payments-api", "index.html"))
	require.NoFileExists(t, filepath.Join(outputDir, "services", "payments", "versions", "1-0", "index.html"))
	assert.Contains(t, stats.Warnings[0].Context, "legacy/payments/specs/swagger.yaml")

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.NotContains(t, string(rootHTML), "Legacy Payments API")
	assert.Equal(t, 1, stats.Services)
	assert.Equal(t, 1, stats.Versions)
	assert.Equal(t, 1, stats.Specs)
}

func TestAggregatePrintingPress_PrintHTML_HidesSkippedVersionsFromHeaderSwitchers(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/specs/usersv1.yaml", "Users API", "v1")
	writeSwaggerTwoSpec(t, root, "services/users/specs/usersv2.yaml", "Users API", "v2")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	require.NoError(t, err)

	users := findCatalogService(t, catalog, "users")
	entry := findCatalogEntry(t, users, "v1")
	entryHTML, err := os.ReadFile(filepath.Join(outputDir, filepath.FromSlash(entry.OverviewHref)))
	require.NoError(t, err)
	assert.NotContains(t, string(entryHTML), `data-pp-versions=`)
	assert.NotContains(t, string(entryHTML), `v2`)
}

func TestAggregatePrintingPress_PrintHTML_CanHideSkippedWarningsInCatalog(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeSwaggerTwoSpec(t, root, "legacy/payments/specs/swagger.yaml", "Legacy Payments API", "1.0")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:               outputDir,
		BuildMode:               AggregateBuildModeFull,
		StateStore:              NewMemorySpecStateStore(),
		DisableSkippedRendering: true,
	})
	require.NoError(t, err)

	_, err = ap.PrintHTML()
	require.NoError(t, err)

	rootHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	assert.NotContains(t, string(rootHTML), "Skipped Render Build")
	assert.NotContains(t, string(rootHTML), "legacy/payments/specs/swagger.yaml")
	assert.Contains(t, string(rootHTML), "Users API")
}

func TestAggregatePrintingPress_PrintSelectedOutputs_RendersEndToEnd(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeAggregateSpec(t, root, "services/users/src/specs/usersv2.yaml", "Users API", "v2")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:      outputDir,
		BuildMode:      AggregateBuildModeFull,
		StateStore:     NewMemorySpecStateStore(),
		MaxPools:       2,
		WorkersPerPool: 1,
	})
	require.NoError(t, err)

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{
		HTML: true,
		LLM:  true,
		JSON: true,
	})
	require.NoError(t, err)
	assert.Equal(t, 2, stats.Specs)
	assert.Equal(t, 2, stats.ChangedSpecs)
	assert.Equal(t, 2, stats.PoolsUsed)
	assert.GreaterOrEqual(t, stats.TotalDuration, stats.DiscoveryDuration)
	assert.GreaterOrEqual(t, stats.TotalDuration, stats.GenerationDuration)
	require.FileExists(t, filepath.Join(outputDir, "index.html"))
	require.FileExists(t, filepath.Join(outputDir, "llms.txt"))
	require.FileExists(t, filepath.Join(outputDir, "bundle.json"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v2", "specs", "users-api", "index.html"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v2", "specs", "users-api", "llms.txt"))
	require.FileExists(t, filepath.Join(outputDir, "services", "users", "versions", "v2", "specs", "users-api", "bundle.json"))
}

func TestAggregatePrintingPress_SkippedSpecsAreDeletedFromStateWithoutRemovedSpecs(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeSwaggerTwoSpec(t, root, "legacy/payments/specs/swagger.yaml", "Legacy Payments API", "1.0")
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:      outputDir,
		BuildMode:      AggregateBuildModeFull,
		StateStore:     store,
		StateNamespace: "test",
	})
	require.NoError(t, err)

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)

	loaded, err := store.Load("test")
	require.NoError(t, err)
	assert.Contains(t, loaded, "services/users/src/specs/usersv1.yaml")
	assert.NotContains(t, loaded, "legacy/payments/specs/swagger.yaml")
}

func TestBuildAggregateRenderPools_BalancesBySize(t *testing.T) {
	specs := []*aggregateDiscoveredSpec{
		{RelativePath: "a.yaml", SizeBytes: 100},
		{RelativePath: "b.yaml", SizeBytes: 90},
		{RelativePath: "c.yaml", SizeBytes: 80},
		{RelativePath: "d.yaml", SizeBytes: 70},
	}

	pools := buildAggregateRenderPools(specs, 2)
	require.Len(t, pools, 2)
	assert.Equal(t, int64(170), pools[0].totalBytes)
	assert.Equal(t, int64(170), pools[1].totalBytes)
	assert.Len(t, pools[0].specs, 2)
	assert.Len(t, pools[1].specs, 2)
}

func TestAggregateEntryConfigHashIncludesEntryOutputOptions(t *testing.T) {
	baseHash := normalizedAggregateEntryConfigHash(t, &AggregatePrintingPressConfig{})

	cases := []struct {
		name   string
		config *AggregatePrintingPressConfig
	}{
		{name: "mock pattern repeat budget", config: &AggregatePrintingPressConfig{MaxPatternRepeatBudget: 123}},
		{name: "generated string bytes", config: &AggregatePrintingPressConfig{MaxGeneratedStringBytes: 456}},
		{name: "generated mock bytes", config: &AggregatePrintingPressConfig{MaxGeneratedMockBytes: 789}},
		{name: "mock depth", config: &AggregatePrintingPressConfig{MaxMockDepth: 12}},
		{name: "mock nodes", config: &AggregatePrintingPressConfig{MaxMockNodes: 345}},
		{name: "mock properties", config: &AggregatePrintingPressConfig{MaxMockProperties: 67}},
		{name: "mock ref expansions", config: &AggregatePrintingPressConfig{MaxMockRefExpansions: 89}},
		{name: "mock bytes", config: &AggregatePrintingPressConfig{MaxMockBytes: 987}},
		{name: "llm aggregate threshold", config: &AggregatePrintingPressConfig{LLMAggregateSpecSizeThresholdBytes: 4096}},
		{name: "llm shard size", config: &AggregatePrintingPressConfig{LLMMaxAggregateFileBytes: 8192}},
		{name: "llm monolith mode", config: &AggregatePrintingPressConfig{LLMGenerateMonoliths: LLMGenerateMonolithsNever}},
		{name: "entry config fingerprint", config: &AggregatePrintingPressConfig{EntryConfigFingerprint: "diagnostics-v1"}},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			assert.NotEqual(t, baseHash, normalizedAggregateEntryConfigHash(t, tc.config))
		})
	}
}

func TestAggregatePrintingPress_BuildEntrySiteUsesSpecLintResults(t *testing.T) {
	root := t.TempDir()
	relPath := "services/users/openapi.yaml"
	writeAggregateSpec(t, root, relPath, "Users API", "v1")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.NotNil(t, catalog)
	require.NotNil(t, ap.plan)
	require.Len(t, ap.plan.discovered, 1)
	entry := catalog.Services[0].Versions[0].Entries[0]

	ap.developerMode = true
	ap.specLintResults = map[string][]*drV3.RuleFunctionResult{
		relPath: {
			{
				Message:      "operation id is not useful",
				Path:         "$.paths['/health'].get.operationId",
				RuleId:       "test-operation-id",
				RuleSeverity: "warn",
				Rule:         &drV3.Rule{Id: "test-operation-id", Severity: "warn"},
			},
		},
	}

	site, err := ap.buildEntrySite(ap.plan.discovered[0], entry)
	require.NoError(t, err)
	require.NotNil(t, site.Diagnostics)
	assert.True(t, site.DeveloperMode)
	assert.NotEmpty(t, site.Diagnostics.Problems)
}

func TestSQLiteSpecStateStore_RoundTripsRecords(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "state.db")
	store, err := NewSQLiteSpecStateStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	record := &SpecStateRecord{
		RelativePath:    "services/users/spec.yaml",
		Hash:            "abc123",
		ConfigHash:      "cfg-123",
		MetadataVersion: aggregateMetadataVersion,
		Title:           "Users API",
		Summary:         "Core account resources.",
		ContactName:     "API Support",
		ContactEmail:    "support@example.com",
		ServiceKey:      "users",
		DisplayName:     "Users API",
		Version:         "v1",
		Format:          "yaml",
		OutputSubdir:    "services/users/versions/v1/specs/users-api",
		UpdatedAt:       time.Now().UTC().Round(time.Second),
	}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))

	loaded, err := store.Load("test")
	require.NoError(t, err)
	require.Contains(t, loaded, record.RelativePath)
	assert.Equal(t, record.Hash, loaded[record.RelativePath].Hash)
	assert.Equal(t, record.ConfigHash, loaded[record.RelativePath].ConfigHash)
	assert.Equal(t, record.MetadataVersion, loaded[record.RelativePath].MetadataVersion)
	assert.Equal(t, record.Summary, loaded[record.RelativePath].Summary)
	assert.Equal(t, record.ContactName, loaded[record.RelativePath].ContactName)
	assert.Equal(t, record.ContactEmail, loaded[record.RelativePath].ContactEmail)
	assert.Equal(t, record.OutputSubdir, loaded[record.RelativePath].OutputSubdir)

	require.NoError(t, store.Delete("test", []string{record.RelativePath}))
	loaded, err = store.Load("test")
	require.NoError(t, err)
	assert.Empty(t, loaded)
}

func TestSQLiteSpecStateStore_LoadsLegacyRowsWithNullSummary(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "legacy-state.db")
	db, err := sql.Open("sqlite", dbPath)
	require.NoError(t, err)

	_, err = db.Exec(`
		CREATE TABLE spec_state (
			namespace TEXT NOT NULL,
			relative_path TEXT NOT NULL,
			hash TEXT NOT NULL,
			title TEXT,
			service_key TEXT,
			display_name TEXT,
			version TEXT,
			format TEXT,
			output_subdir TEXT,
			updated_at TEXT NOT NULL,
			PRIMARY KEY (namespace, relative_path)
		);
	`)
	require.NoError(t, err)
	_, err = db.Exec(`
		INSERT INTO spec_state (
			namespace, relative_path, hash, title, service_key, display_name, version, format, output_subdir, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, "legacy", "services/users/spec.yaml", "abc123", "Users API", "users", "Users API", "v1", "yaml", "services/users/versions/v1/specs/users-api", time.Now().UTC().Format(time.RFC3339Nano))
	require.NoError(t, err)
	require.NoError(t, db.Close())

	store, err := NewSQLiteSpecStateStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	loaded, err := store.Load("legacy")
	require.NoError(t, err)
	require.Contains(t, loaded, "services/users/spec.yaml")
	assert.Equal(t, "", loaded["services/users/spec.yaml"].ConfigHash)
	assert.Equal(t, 0, loaded["services/users/spec.yaml"].MetadataVersion)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].Summary)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].ContactName)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].ContactEmail)
}

func TestCatalogStylesheet_UsesSharedBackgroundSurface(t *testing.T) {
	stylesheet, err := os.ReadFile(filepath.Join("static", "printing-press-catalog.css"))
	require.NoError(t, err)

	css := string(stylesheet)
	assert.Contains(t, css, `background: var(--background-color);`)
	assert.Contains(t, css, `.pp-catalog-shell pb33f-footer`)
	assert.Contains(t, css, `margin-top: calc(var(--global-padding-double) * 2);`)
	assert.Contains(t, css, `.pp-catalog-diagnostics`)
	assert.Contains(t, css, `border-top: 1px dotted color-mix(in srgb, var(--tertiary-color) 38%, transparent);`)
	assert.Contains(t, css, `background: color-mix(in srgb, var(--tertiary-color) 8%, transparent);`)
	assert.NotContains(t, css, `radial-gradient(`)
	assert.NotContains(t, css, `var(--terminal-background)`)
}

func normalizedAggregateEntryConfigHash(t *testing.T, config *AggregatePrintingPressConfig) string {
	t.Helper()
	normalized, store, err := validateAndNormalizeAggregateConfig(t.TempDir(), config)
	require.NoError(t, err)
	t.Cleanup(func() {
		require.NoError(t, store.Close())
	})
	return aggregateEntryConfigHash(normalized)
}

func aggregateTestLintResult(message string) *drV3.RuleFunctionResult {
	return aggregateTestLintResultWithSeverity(message, "warn")
}

func aggregateTestLintResultWithSeverity(message, severity string) *drV3.RuleFunctionResult {
	return &drV3.RuleFunctionResult{
		Message:      message,
		Path:         "$.paths['/health'].get.operationId",
		RuleId:       "test-operation-id",
		RuleSeverity: severity,
		Rule:         &drV3.Rule{Id: "test-operation-id", Severity: severity},
	}
}

func readAggregateDiagnosticsPayload(t *testing.T, entryDir string) string {
	t.Helper()
	payload, err := os.ReadFile(filepath.Join(entryDir, "data", "pages", "diagnostics.js"))
	require.NoError(t, err)
	return string(payload)
}

func readAggregateFile(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	require.NoError(t, err)
	return string(data)
}

func catalogNavSegment(html string) string {
	start := strings.Index(html, `<pp-nav id="pp-nav"`)
	if start < 0 {
		return ""
	}
	end := strings.Index(html[start:], `</pp-nav>`)
	if end < 0 {
		return html[start:]
	}
	return html[start : start+end+len(`</pp-nav>`)]
}

func writeAggregateSpec(t *testing.T, root, relPath, title, version string) string {
	return writeAggregateSpecWithDetails(t, root, relPath, title, "", "", version)
}

func writeAggregateSpecDocument(t *testing.T, root, relPath, document string) string {
	t.Helper()
	absPath := filepath.Join(root, filepath.FromSlash(relPath))
	require.NoError(t, os.MkdirAll(filepath.Dir(absPath), 0o755))
	require.NoError(t, os.WriteFile(absPath, []byte(strings.TrimSpace(document)+"\n"), 0o644))
	return absPath
}

func writeAggregateSpecWithDetails(t *testing.T, root, relPath, title, summary, description, version string) string {
	return writeAggregateSpecWithContact(t, root, relPath, title, summary, description, version, "", "")
}

func writeAggregateSpecWithContact(t *testing.T, root, relPath, title, summary, description, version, contactName, contactEmail string) string {
	t.Helper()
	absPath := filepath.Join(root, filepath.FromSlash(relPath))
	require.NoError(t, os.MkdirAll(filepath.Dir(absPath), 0o755))
	var info strings.Builder
	info.WriteString("info:\n")
	info.WriteString("  title: " + strconv.Quote(title) + "\n")
	if summary != "" {
		info.WriteString("  summary: " + strconv.Quote(summary) + "\n")
	}
	if description != "" {
		info.WriteString("  description: |\n")
		for _, line := range strings.Split(description, "\n") {
			info.WriteString("    " + line + "\n")
		}
	}
	if contactName != "" || contactEmail != "" {
		info.WriteString("  contact:\n")
		if contactName != "" {
			info.WriteString("    name: " + strconv.Quote(contactName) + "\n")
		}
		if contactEmail != "" {
			info.WriteString("    email: " + strconv.Quote(contactEmail) + "\n")
		}
	}
	info.WriteString("  version: " + strconv.Quote(version) + "\n")
	spec := strings.TrimSpace(`
openapi: 3.1.0
`+strings.TrimRight(info.String(), "\n")+`
paths:
  /health:
    get:
      operationId: listHealth
      responses:
        "200":
          description: ok
components:
  schemas:
    Status:
      type: object
      properties:
        ok:
          type: boolean
`) + "\n"
	require.NoError(t, os.WriteFile(absPath, []byte(spec), 0o644))
	return absPath
}

func writeSwaggerTwoSpec(t *testing.T, root, relPath, title, version string) string {
	t.Helper()
	absPath := filepath.Join(root, filepath.FromSlash(relPath))
	require.NoError(t, os.MkdirAll(filepath.Dir(absPath), 0o755))
	spec := strings.TrimSpace(`
swagger: "2.0"
info:
  title: `+title+`
  version: `+version+`
paths:
  /health:
    get:
      operationId: legacyHealth
      responses:
        "200":
          description: ok
`) + "\n"
	require.NoError(t, os.WriteFile(absPath, []byte(spec), 0o644))
	return absPath
}

func aggregateSpecDocument(title, version string, paths []string, schemas []string) string {
	var b strings.Builder
	b.WriteString("openapi: 3.1.0\n")
	b.WriteString("info:\n")
	b.WriteString("  title: " + strconv.Quote(title) + "\n")
	b.WriteString("  version: " + strconv.Quote(version) + "\n")
	b.WriteString("paths:\n")
	for _, pathBlock := range paths {
		b.WriteString(pathBlock)
		if !strings.HasSuffix(pathBlock, "\n") {
			b.WriteString("\n")
		}
	}
	b.WriteString("components:\n")
	b.WriteString("  schemas:\n")
	for _, schemaBlock := range schemas {
		b.WriteString(schemaBlock)
		if !strings.HasSuffix(schemaBlock, "\n") {
			b.WriteString("\n")
		}
	}
	return b.String()
}

func findCatalogService(t *testing.T, catalog *ppmodel.CatalogSite, key string) *ppmodel.CatalogService {
	t.Helper()
	for _, service := range catalog.Services {
		if service.Key == key {
			return service
		}
	}
	t.Fatalf("service %s not found", key)
	return nil
}

func findCatalogEntry(t *testing.T, service *ppmodel.CatalogService, versionLabel string) *ppmodel.CatalogSpecEntry {
	t.Helper()
	for _, version := range service.Versions {
		if version == nil || version.Label != versionLabel {
			continue
		}
		visible := visibleCatalogEntries(version)
		if len(visible) == 0 {
			break
		}
		return visible[0]
	}
	t.Fatalf("entry for version %s not found", versionLabel)
	return nil
}

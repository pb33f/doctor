// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"database/sql"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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
	writeAggregateSpecWithDetails(t, root, "services/users/src/specs/usersv2.yaml", "Users API", "Current account lifecycle endpoints.", "", "v2")

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
	assert.Contains(t, string(rootHTML), "pb33f-theme-switcher")
	assert.Contains(t, string(rootHTML), `href="services/users/versions/v2/specs/users-api/index.html"`)
	assert.Contains(t, string(rootHTML), "static/printing-press.css")
	assert.Contains(t, string(rootHTML), "pp-catalog-card-summary")
	assert.Contains(t, string(rootHTML), "pp-model-card")
	assert.Contains(t, string(rootHTML), "Current account lifecycle endpoints.")
	assert.Contains(t, string(rootHTML), `v2 (latest)`)
	assert.Contains(t, string(rootHTML), `value="services/users/versions/v2/specs/users-api/index.html"`)
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
	assert.NotContains(t, string(entryHTML), `data-pp-versions-href=`)
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

func TestSQLiteSpecStateStore_RoundTripsRecords(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "state.db")
	store, err := NewSQLiteSpecStateStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	record := &SpecStateRecord{
		RelativePath: "services/users/spec.yaml",
		Hash:         "abc123",
		ConfigHash:   "cfg-123",
		Title:        "Users API",
		Summary:      "Core account resources.",
		ServiceKey:   "users",
		DisplayName:  "Users API",
		Version:      "v1",
		Format:       "yaml",
		OutputSubdir: "services/users/versions/v1/specs/users-api",
		UpdatedAt:    time.Now().UTC().Round(time.Second),
	}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))

	loaded, err := store.Load("test")
	require.NoError(t, err)
	require.Contains(t, loaded, record.RelativePath)
	assert.Equal(t, record.Hash, loaded[record.RelativePath].Hash)
	assert.Equal(t, record.ConfigHash, loaded[record.RelativePath].ConfigHash)
	assert.Equal(t, record.Summary, loaded[record.RelativePath].Summary)
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
	assert.Equal(t, "", loaded["services/users/spec.yaml"].Summary)
}

func TestCatalogStylesheet_UsesSharedBackgroundSurface(t *testing.T) {
	stylesheet, err := os.ReadFile(filepath.Join("static", "printing-press-catalog.css"))
	require.NoError(t, err)

	css := string(stylesheet)
	assert.Contains(t, css, `background: var(--background-color);`)
	assert.NotContains(t, css, `radial-gradient(`)
	assert.NotContains(t, css, `var(--terminal-background)`)
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

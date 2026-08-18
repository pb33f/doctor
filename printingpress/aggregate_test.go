// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	stdhtml "html"
	"io"
	"net/url"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"sync"
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

func TestAggregatePrintingPress_PressModel_DiscoversMixedOpenAPIAndAsyncAPIEntries(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/events/specs/openapi.yaml", "Events API", "v1")
	writeAggregateAsyncAPISpec(t, root, "services/events/specs/asyncapi.yaml", "Events Stream", "v1")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	events := findCatalogService(t, catalog, "events")
	require.NotNil(t, events.LatestVersion)
	require.Len(t, events.LatestVersion.Entries, 2)

	kinds := map[string]string{}
	for _, entry := range events.LatestVersion.Entries {
		kinds[entry.SpecKind.MachineValue()] = entry.SpecKindLabel
	}
	assert.Equal(t, "OpenAPI", kinds["openapi"])
	assert.Equal(t, "AsyncAPI", kinds["asyncapi"])

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, LLM: true, JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 2, stats.Specs)

	versionHTML, err := os.ReadFile(filepath.Join(outputDir, "services", "events", "versions", "v1", "index.html"))
	require.NoError(t, err)
	assert.Contains(t, string(versionHTML), `data-spec-kind="openapi"`)
	assert.Contains(t, string(versionHTML), `data-spec-kind="asyncapi"`)
	assert.Contains(t, string(versionHTML), `>AsyncAPI<`)

	catalogJSON, err := os.ReadFile(filepath.Join(outputDir, pppaths.FileBundleJSON))
	require.NoError(t, err)
	assert.Contains(t, string(catalogJSON), `"specKind":"openapi"`)
	assert.Contains(t, string(catalogJSON), `"specKind":"asyncapi"`)

	llms, err := os.ReadFile(filepath.Join(outputDir, pppaths.FileLLMIndex))
	require.NoError(t, err)
	assert.Contains(t, string(llms), "Events Stream")
	assert.Contains(t, string(llms), "AsyncAPI")
}

func TestAggregateConfigRejectsMalformedMetadataPointersAndUnknownRoles(t *testing.T) {
	tests := []struct {
		name     string
		config   *AggregatePrintingPressConfig
		offender string
	}{
		{
			name: "pointer without leading slash",
			config: &AggregatePrintingPressConfig{
				ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"info/x-owner"}},
			},
			offender: "info/x-owner",
		},
		{
			name: "invalid pointer escape",
			config: &AggregatePrintingPressConfig{
				ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"/info/x~2owner"}},
			},
			offender: "/info/x~2owner",
		},
		{
			name: "unknown role",
			config: &AggregatePrintingPressConfig{
				ContractRoles: []AggregateContractRoleRule{{Pattern: "**/*.yaml", Role: "internal-rpc"}},
			},
			offender: "internal-rpc",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			_, _, err := validateAndNormalizeAggregateConfig(t.TempDir(), tc.config)
			require.Error(t, err)
			assert.Contains(t, err.Error(), tc.offender)
		})
	}
}

func TestAggregateContractRoleMachineValuesAndLabels(t *testing.T) {
	assert.Equal(t, "HTTP API", ppmodel.ContractRoleHTTPAPI.DisplayLabel())
	assert.Equal(t, "Published Events", ppmodel.ContractRolePublishedEvents.DisplayLabel())
	assert.Equal(t, "Consumed Events", ppmodel.ContractRoleConsumedEvents.DisplayLabel())
	assert.Equal(t, "External Sources", ppmodel.ContractRoleExternalSource.DisplayLabel())
	assert.Equal(t, "Events", ppmodel.ContractRoleEvents.DisplayLabel())
	assert.Equal(t, "http-api", ppmodel.ContractRoleHTTPAPI.MachineValue())
	assert.Equal(t, "published-events", ppmodel.ContractRolePublishedEvents.MachineValue())
	assert.Equal(t, "consumed-events", ppmodel.ContractRoleConsumedEvents.MachineValue())
	assert.Equal(t, "external-source", ppmodel.ContractRoleExternalSource.MachineValue())
	assert.Equal(t, "events", ppmodel.ContractRoleEvents.MachineValue())
}

func TestAggregateServiceIdentityAndIndependentContracts(t *testing.T) {
	tests := []struct {
		name       string
		configure  func(*AggregatePrintingPressConfig)
		writeSpecs func(*testing.T, string)
		assert     func(*testing.T, *ppmodel.CatalogSite)
	}{
		{
			name: "mixed roots share normalized identity and keep independent versions",
			configure: func(config *AggregatePrintingPressConfig) {
				config.ServiceIdentity = AggregateServiceIdentityConfig{
					MetadataPointers: []string{"/info/x-owner"},
					StripPrefixes:    []string{"platform-"},
					StripSuffixes:    []string{"-api"},
				}
			},
			writeSpecs: func(t *testing.T, root string) {
				writeAggregateCatalogSpec(t, root, "apis/orders/v2/openapi.yaml", SpecKindOpenAPI, "Orders API", "HTTP summary", "v2", "  PLATFORM-platform-orders-api-API  ")
				writeAggregateCatalogSpec(t, root, "streams/orders/v0.1/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "Event summary", "v0.1", "platform-platform-orders-api-api")
			},
			assert: func(t *testing.T, catalog *ppmodel.CatalogSite) {
				require.Len(t, catalog.Services, 1)
				service := catalog.Services[0]
				assert.Equal(t, "orders", service.IdentityKey)
				require.Len(t, service.Contracts, 2)
				versionsByKind := make(map[ppmodel.SpecKindValue][]string)
				for _, contract := range service.Contracts {
					for _, version := range contract.Versions {
						versionsByKind[contract.SpecKind] = append(versionsByKind[contract.SpecKind], version.Label)
						require.NotNil(t, version.Entry)
						assert.Empty(t, version.Relationships)
					}
				}
				assert.Equal(t, []string{"v2"}, versionsByKind[ppmodel.SpecKindValueOpenAPI])
				assert.Equal(t, []string{"v0.1"}, versionsByKind[ppmodel.SpecKindValueAsyncAPI])
			},
		},
		{
			name: "preferred openapi path slug becomes canonical",
			configure: func(config *AggregatePrintingPressConfig) {
				config.ServiceIdentity = AggregateServiceIdentityConfig{
					MetadataPointers:  []string{"/info/x-owner"},
					PreferOpenAPISlug: true,
				}
			},
			writeSpecs: func(t *testing.T, root string) {
				writeAggregateCatalogSpec(t, root, "services/orders-http/specs/openapi.yaml", SpecKindOpenAPI, "Orders API", "", "v1", "order-domain")
				writeAggregateCatalogSpec(t, root, "events/orders-stream/specs/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v9", "order-domain")
			},
			assert: func(t *testing.T, catalog *ppmodel.CatalogSite) {
				require.Len(t, catalog.Services, 1)
				assert.Equal(t, "order-domain", catalog.Services[0].IdentityKey)
				assert.Equal(t, "orders-http", catalog.Services[0].Slug)
			},
		},
		{
			name: "path derived identity receives repeated normalization",
			configure: func(config *AggregatePrintingPressConfig) {
				config.ServiceIdentity = AggregateServiceIdentityConfig{
					StripPrefixes: []string{"platform-"},
					StripSuffixes: []string{"-api"},
				}
			},
			writeSpecs: func(t *testing.T, root string) {
				writeAggregateCatalogSpec(t, root, "services/PLATFORM-platform-orders-api-API/specs/openapi.yaml", SpecKindOpenAPI, "Orders API", "", "v1", "")
			},
			assert: func(t *testing.T, catalog *ppmodel.CatalogSite) {
				require.Len(t, catalog.Services, 1)
				assert.Equal(t, "orders", catalog.Services[0].IdentityKey)
				assert.Equal(t, "orders", catalog.Services[0].Slug)
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			root := t.TempDir()
			tc.writeSpecs(t, root)
			config := &AggregatePrintingPressConfig{
				OutputDir:  filepath.Join(root, "site"),
				BuildMode:  AggregateBuildModeFull,
				StateStore: NewMemorySpecStateStore(),
			}
			tc.configure(config)
			ap, err := CreateAggregatePrintingPressFromPath(root, config)
			require.NoError(t, err)
			catalog, err := ap.PressModel()
			require.NoError(t, err)
			tc.assert(t, catalog)
		})
	}
}

func TestAggregateServiceIdentityCanonicalFallbackIsDiscoveryOrderIndependent(t *testing.T) {
	build := func(t *testing.T, paths []string) string {
		t.Helper()
		root := t.TempDir()
		for _, relPath := range paths {
			writeAggregateCatalogSpec(t, root, relPath, SpecKindAsyncAPI, "Shared Events", "", "v1", "")
		}
		ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
			OutputDir:  filepath.Join(root, "site"),
			BuildMode:  AggregateBuildModeFull,
			StateStore: NewMemorySpecStateStore(),
			ServiceIdentity: AggregateServiceIdentityConfig{
				StripPrefixes: []string{"admin-", "public-"},
			},
		})
		require.NoError(t, err)
		catalog, err := ap.PressModel()
		require.NoError(t, err)
		require.Len(t, catalog.Services, 1)
		return catalog.Services[0].Slug
	}

	forward := []string{"services/admin-shared/specs/asyncapi.yaml", "services/public-shared/specs/asyncapi.yaml"}
	reverse := []string{forward[1], forward[0]}
	assert.Equal(t, "shared", build(t, forward))
	assert.Equal(t, build(t, forward), build(t, reverse))
}

func TestAggregateServiceIdentityOpenAPISlugAmbiguity(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/admin-shared/specs/openapi.yaml", SpecKindOpenAPI, "Admin API", "", "v1", "")
	writeAggregateCatalogSpec(t, root, "services/public-shared/specs/openapi.yaml", SpecKindOpenAPI, "Public API", "", "v1", "")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  filepath.Join(root, "site"),
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceIdentity: AggregateServiceIdentityConfig{
			StripPrefixes:     []string{"admin-", "public-"},
			PreferOpenAPISlug: true,
		},
	})
	require.NoError(t, err)

	_, err = ap.PressModel()
	require.Error(t, err)
	assert.Contains(t, err.Error(), "shared")
	assert.Contains(t, err.Error(), "admin-shared")
	assert.Contains(t, err.Error(), "public-shared")
}

func TestAggregateServiceIdentityGlobalCanonicalSlugCollision(t *testing.T) {
	firstPath := "services/shared/specs/alpha.openapi.yaml"
	secondPath := "services/shared/specs/beta.openapi.yaml"
	build := func(t *testing.T, paths []string) string {
		t.Helper()
		root := t.TempDir()
		for _, relPath := range paths {
			if relPath == firstPath {
				writeAggregateCatalogSpec(t, root, relPath, SpecKindOpenAPI, "Alpha API", "", "v1", "alpha-domain")
			} else {
				writeAggregateCatalogSpec(t, root, relPath, SpecKindOpenAPI, "Beta API", "", "v1", "beta-domain")
			}
		}
		outputDir := filepath.Join(root, "site")
		ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
			OutputDir:  outputDir,
			BuildMode:  AggregateBuildModeFull,
			StateStore: NewMemorySpecStateStore(),
			ServiceIdentity: AggregateServiceIdentityConfig{
				MetadataPointers:  []string{"/info/x-owner"},
				PreferOpenAPISlug: true,
			},
		})
		require.NoError(t, err)
		_, err = ap.PressModel()
		require.Error(t, err)
		assert.NoDirExists(t, outputDir)
		return err.Error()
	}

	forwardError := build(t, []string{firstPath, secondPath})
	reverseError := build(t, []string{secondPath, firstPath})
	assert.Equal(t, forwardError, reverseError)
	for _, part := range []string{"shared", "alpha-domain", "beta-domain", firstPath, secondPath} {
		assert.Contains(t, forwardError, part)
	}
}

func TestAggregateServiceIdentityEmptyMetadataFallsBackWithoutMerging(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/OrdersService/specs/openapi.yaml", SpecKindOpenAPI, "Orders API", "", "v1", "platform-")
	writeAggregateCatalogSpec(t, root, "services/BillingService/specs/openapi.yaml", SpecKindOpenAPI, "Billing API", "", "v1", "platform-")
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  filepath.Join(root, "site"),
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner"},
			StripPrefixes:    []string{"platform-"},
		},
	})
	require.NoError(t, err)
	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Services, 2)
	assert.Equal(t, []string{"billing-service", "orders-service"}, []string{catalog.Services[0].IdentityKey, catalog.Services[1].IdentityKey})
	for _, service := range catalog.Services {
		assert.NotEqual(t, "unnamed", service.IdentityKey)
	}
	require.Len(t, catalog.Warnings, 2)
	warnings := catalog.Warnings[0].Message + "\n" + catalog.Warnings[1].Message
	for _, part := range []string{"platform-", "billing-service", "orders-service", "services/BillingService/specs/openapi.yaml", "services/OrdersService/specs/openapi.yaml"} {
		assert.Contains(t, warnings, part)
	}
}

func TestAggregateContractRolesIdentityAndCollisionRules(t *testing.T) {
	t.Run("first role rule wins and fallbacks use spec kind", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/widgets/specs/http.yaml", SpecKindOpenAPI, "Widgets HTTP", "", "v1", "widgets")
		writeAggregateCatalogSpec(t, root, "services/widgets/published/events.yaml", SpecKindAsyncAPI, "Published Widgets", "", "v1", "widgets")
		writeAggregateCatalogSpec(t, root, "services/widgets/other/asyncapi.yaml", SpecKindAsyncAPI, "Widget Events", "", "v1", "widgets")
		catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
			{Pattern: "**/published/**", Role: "published-events", ContractID: "published"},
			{Pattern: "**/published/**", Role: "consumed-events", ContractID: "ignored"},
		})
		service := findCatalogService(t, catalog, "widgets")
		roles := make(map[string]ppmodel.ContractRoleValue)
		for _, contract := range service.Contracts {
			roles[contract.ID] = contract.Role
		}
		assert.Equal(t, ppmodel.ContractRolePublishedEvents, roles["published"])
		assert.Contains(t, roles, "http-api-services-widgets-http")
		assert.Equal(t, ppmodel.ContractRoleHTTPAPI, roles["http-api-services-widgets-http"])
		assert.Contains(t, roles, "events-services-widgets-other")
		assert.Equal(t, ppmodel.ContractRoleEvents, roles["events-services-widgets-other"])
	})

	t.Run("noise and version directories do not split a contract", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/specs/v1/public.openapi.yaml", SpecKindOpenAPI, "Public Orders", "", "v1", "")
		writeAggregateCatalogSpec(t, root, "services/orders/docs/v2/public.openapi.yaml", SpecKindOpenAPI, "Public Orders", "", "v2", "")
		catalog := buildAggregateCatalogForTest(t, root, nil)
		service := findCatalogService(t, catalog, "orders")
		require.Len(t, service.Contracts, 1)
		assert.Equal(t, "http-api-services-orders-public", service.Contracts[0].ID)
		assert.Equal(t, []string{"v2", "v1"}, []string{service.Contracts[0].Versions[0].Label, service.Contracts[0].Versions[1].Label})
	})

	t.Run("distinct contracts may share a legacy service version", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/public/v1/openapi.yaml", SpecKindOpenAPI, "Public Orders", "", "v1", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/admin/v1/openapi.yaml", SpecKindOpenAPI, "Admin Orders", "", "v1", "orders")
		catalog := buildAggregateCatalogForTest(t, root, nil)
		service := findCatalogService(t, catalog, "orders")
		require.Len(t, service.Contracts, 2)
		require.Len(t, service.Versions, 1)
		require.Len(t, service.Versions[0].Entries, 2)
	})

	for _, tc := range []struct {
		name          string
		roles         []AggregateContractRoleRule
		secondVer     string
		errorParts    []string
		shouldSucceed bool
	}{
		{
			name: "duplicate contract and version is rejected",
			roles: []AggregateContractRoleRule{
				{Pattern: "**/one/**", Role: "events", ContractID: "shared"},
				{Pattern: "**/two/**", Role: "events", ContractID: "shared"},
			},
			secondVer:  "v1",
			errorParts: []string{"shared", "v1", "services/orders/one/asyncapi.yaml", "services/orders/two/asyncapi.yaml"},
		},
		{
			name: "one explicit default contract across versions is valid",
			roles: []AggregateContractRoleRule{
				{Pattern: "**/one/**", Role: "events", ContractID: "shared", Default: true},
				{Pattern: "**/two/**", Role: "events", ContractID: "shared", Default: true},
			},
			secondVer:     "v2",
			shouldSucceed: true,
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			root := t.TempDir()
			writeAggregateCatalogSpec(t, root, "services/orders/one/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v1", "orders")
			writeAggregateCatalogSpec(t, root, "services/orders/two/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", tc.secondVer, "orders")
			ap := newAggregateForCatalogTest(t, root, tc.roles)
			catalog, err := ap.PressModel()
			if tc.shouldSucceed {
				require.NoError(t, err)
				service := findCatalogService(t, catalog, "orders")
				assert.Equal(t, "shared", service.DefaultContractID)
				return
			}
			require.Error(t, err)
			for _, part := range tc.errorParts {
				assert.Contains(t, err.Error(), part)
			}
		})
	}
}

func TestAggregateContractIdentityRejectsMixedKindsAndRoles(t *testing.T) {
	tests := []struct {
		name       string
		firstKind  SpecKind
		secondKind SpecKind
		firstRole  string
		secondRole string
	}{
		{
			name:       "openapi and asyncapi cannot share an id",
			firstKind:  SpecKindOpenAPI,
			secondKind: SpecKindAsyncAPI,
			firstRole:  "http-api",
			secondRole: "events",
		},
		{
			name:       "asyncapi roles cannot share an id",
			firstKind:  SpecKindAsyncAPI,
			secondKind: SpecKindAsyncAPI,
			firstRole:  "published-events",
			secondRole: "consumed-events",
		},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			root := t.TempDir()
			firstPath := "services/orders/first/spec.yaml"
			secondPath := "services/orders/second/spec.yaml"
			writeAggregateCatalogSpec(t, root, firstPath, tc.firstKind, "First Contract", "", "v1", "orders")
			writeAggregateCatalogSpec(t, root, secondPath, tc.secondKind, "Second Contract", "", "v2", "orders")
			ap := newAggregateForCatalogTest(t, root, []AggregateContractRoleRule{
				{Pattern: "**/first/**", Role: tc.firstRole, ContractID: "shared-contract"},
				{Pattern: "**/second/**", Role: tc.secondRole, ContractID: "shared-contract"},
			})
			_, err := ap.PressModel()
			require.Error(t, err)
			for _, part := range []string{"shared-contract", tc.firstKind.MachineValue(), tc.secondKind.MachineValue(), tc.firstRole, tc.secondRole, firstPath, secondPath} {
				assert.Contains(t, err.Error(), part)
			}
		})
	}
}

func TestAggregateContractRoleGlobDoublestarMatchesZeroOrMoreDirectories(t *testing.T) {
	tests := []struct {
		name      string
		pattern   string
		candidate string
		want      bool
	}{
		{name: "root zero directories", pattern: "**/*.yaml", candidate: "root.yaml", want: true},
		{name: "nested directories", pattern: "**/*.yaml", candidate: "nested/deeper/root.yaml", want: true},
		{name: "extension near miss", pattern: "**/*.yaml", candidate: "root.yml", want: false},
		{name: "middle zero directories", pattern: "specs/**/openapi.?aml", candidate: "specs/openapi.yaml", want: true},
		{name: "middle nested directories", pattern: "specs/**/openapi.?aml", candidate: "specs/public/v1/openapi.yaml", want: true},
		{name: "middle near miss", pattern: "specs/**/openapi.?aml", candidate: "specs/openapi.json", want: false},
		{name: "single star remains one segment", pattern: "specs/*.yaml", candidate: "specs/nested/root.yaml", want: false},
		{name: "slash normalization", pattern: "**/*.yaml", candidate: `nested\root.yaml`, want: true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.want, ruleMatches(tc.candidate, tc.pattern))
		})
	}
}

func TestAggregateContractIndependentNaturalVersionsAndSingleDefault(t *testing.T) {
	root := t.TempDir()
	for _, fixture := range []struct {
		path    string
		title   string
		version string
	}{
		{path: "services/orders/public/v1.9/openapi.yaml", title: "Public Orders", version: "v1.9"},
		{path: "services/orders/public/v1.10/openapi.yaml", title: "Public Orders", version: "v1.10"},
		{path: "services/orders/admin/v2/openapi.yaml", title: "Admin Orders", version: "v2"},
		{path: "services/orders/admin/v10/openapi.yaml", title: "Admin Orders", version: "v10"},
	} {
		writeAggregateCatalogSpec(t, root, fixture.path, SpecKindOpenAPI, fixture.title, "", fixture.version, "orders")
	}
	catalog := buildAggregateCatalogForTest(t, root, nil)
	require.Len(t, catalog.Services, 1)
	service := catalog.Services[0]
	require.Len(t, service.Contracts, 2)

	expectedLatest := map[string]string{"Admin Orders": "v10", "Public Orders": "v1.10"}
	defaults := 0
	for _, contract := range service.Contracts {
		require.Len(t, contract.Versions, 2)
		require.Same(t, contract.Versions[0], contract.LatestVersion)
		assert.Equal(t, expectedLatest[contract.DisplayName], contract.LatestVersion.Label)
		if contract.Default {
			defaults++
		}
	}
	assert.Equal(t, 1, defaults)
}

func TestAggregateStableVersionOutranksPrerelease(t *testing.T) {
	root := t.TempDir()
	stablePath := "services/orders/http/stable/openapi.yaml"
	writeAggregateCatalogSpec(t, root, stablePath, SpecKindOpenAPI, "Orders API", "Stable summary", "v2.0.0", "orders")
	writeAggregateCatalogSpec(t, root, "services/orders/http/prerelease/openapi.yaml", SpecKindOpenAPI, "Orders API RC", "Prerelease summary", "v2.0.0-rc1", "orders")
	catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
		{Pattern: "**/stable/**", Role: "http-api", ContractID: "orders-http", Default: true},
		{Pattern: "**/prerelease/**", Role: "http-api", ContractID: "orders-http", Default: true},
	})

	service := findCatalogService(t, catalog, "orders")
	contract := findCatalogContract(t, service, "orders-http")
	require.Len(t, contract.Versions, 2)
	require.NotNil(t, contract.LatestVersion)
	assert.Equal(t, "v2.0.0", contract.LatestVersion.Label)
	require.Len(t, service.Versions, 2)
	assert.True(t, service.Versions[0].IsLatest)
	assert.False(t, service.Versions[1].IsLatest)
	assert.Equal(t, stablePath, service.PrimaryPath)
	assert.Equal(t, "Orders API", service.DisplayName)
	assert.Equal(t, "Stable summary", service.Summary)
}

func TestAggregateDefaultContractSelectionAndPresentation(t *testing.T) {
	t.Run("openapi wins and supplies service presentation regardless of path order", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/aaa-events/asyncapi.yaml", SpecKindAsyncAPI, "Orders Stream", "Event summary", "v9", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/zzz-http/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "HTTP summary", "v2", "orders")
		catalog := buildAggregateCatalogForTest(t, root, nil)
		service := findCatalogService(t, catalog, "orders")
		assert.Equal(t, "Orders HTTP", service.DisplayName)
		assert.Equal(t, "HTTP summary", service.Summary)
		require.NotEmpty(t, service.DefaultContractID)
		contract := findCatalogContract(t, service, service.DefaultContractID)
		assert.Equal(t, ppmodel.SpecKindValueOpenAPI, contract.SpecKind)
		assert.True(t, contract.Default)
	})

	t.Run("event only role order selects published and supplies presentation", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/consumed/asyncapi.yaml", SpecKindAsyncAPI, "Consumed Orders", "Consumed summary", "v9", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/published/asyncapi.yaml", SpecKindAsyncAPI, "Published Orders", "Published summary", "v1", "orders")
		catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
			{Pattern: "**/consumed/**", Role: "consumed-events"},
			{Pattern: "**/published/**", Role: "published-events"},
		})
		service := findCatalogService(t, catalog, "orders")
		contract := findCatalogContract(t, service, service.DefaultContractID)
		assert.Equal(t, ppmodel.ContractRolePublishedEvents, contract.Role)
		assert.Equal(t, "Published Orders", service.DisplayName)
		assert.Equal(t, "Published summary", service.Summary)
	})

	t.Run("explicit default beats openapi and distinct explicit defaults fail", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/http/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "HTTP summary", "v2", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/events/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "Event summary", "v1", "orders")
		catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
			{Pattern: "**/events/**", Role: "events", ContractID: "chosen-events", Default: true},
		})
		service := findCatalogService(t, catalog, "orders")
		assert.Equal(t, "chosen-events", service.DefaultContractID)
		assert.Equal(t, "Orders Events", service.DisplayName)

		ap := newAggregateForCatalogTest(t, root, []AggregateContractRoleRule{
			{Pattern: "**/http/**", Role: "http-api", ContractID: "chosen-http", Default: true},
			{Pattern: "**/events/**", Role: "events", ContractID: "chosen-events", Default: true},
		})
		_, err := ap.PressModel()
		require.Error(t, err)
		assert.Contains(t, err.Error(), "chosen-http")
		assert.Contains(t, err.Error(), "chosen-events")
	})

	t.Run("openapi tie break is deterministic by title path and id", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/zeta/openapi.yaml", SpecKindOpenAPI, "Zeta API", "", "v2", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/alpha/openapi.yaml", SpecKindOpenAPI, "Alpha API", "", "v2", "orders")
		catalog := buildAggregateCatalogForTest(t, root, nil)
		service := findCatalogService(t, catalog, "orders")
		assert.Equal(t, "Alpha API", service.DisplayName)
		assert.Contains(t, service.DefaultContractID, "alpha")
	})

	t.Run("latest openapi contract precedes title tie breakers", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/alpha/openapi.yaml", SpecKindOpenAPI, "Alpha API", "", "v1", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/zeta/openapi.yaml", SpecKindOpenAPI, "Zeta API", "", "v2", "orders")
		catalog := buildAggregateCatalogForTest(t, root, nil)
		service := findCatalogService(t, catalog, "orders")
		assert.Equal(t, "Zeta API", service.DisplayName)
		assert.Contains(t, service.DefaultContractID, "zeta")
	})
}

func TestAggregateDefaultContractEventRoleOrder(t *testing.T) {
	t.Run("same published role uses title before version", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/alpha/asyncapi.yaml", SpecKindAsyncAPI, "Alpha Published", "", "v1", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/zeta/asyncapi.yaml", SpecKindAsyncAPI, "Zeta Published", "", "v2", "orders")
		catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
			{Pattern: "**/alpha/**", Role: "published-events", ContractID: "alpha"},
			{Pattern: "**/zeta/**", Role: "published-events", ContractID: "zeta"},
		})
		service := findCatalogService(t, catalog, "orders")
		assert.Equal(t, "alpha", service.DefaultContractID)
	})

	tests := []struct {
		name       string
		firstRole  string
		secondRole string
	}{
		{name: "published before consumed", firstRole: "published-events", secondRole: "consumed-events"},
		{name: "consumed before external", firstRole: "consumed-events", secondRole: "external-source"},
		{name: "external before events", firstRole: "external-source", secondRole: "events"},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			root := t.TempDir()
			writeAggregateCatalogSpec(t, root, "services/orders/first/asyncapi.yaml", SpecKindAsyncAPI, "Later Title", "", "v1", "orders")
			writeAggregateCatalogSpec(t, root, "services/orders/second/asyncapi.yaml", SpecKindAsyncAPI, "Earlier Title", "", "v9", "orders")
			catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
				{Pattern: "**/first/**", Role: tc.firstRole, ContractID: "first"},
				{Pattern: "**/second/**", Role: tc.secondRole, ContractID: "second"},
			})
			service := findCatalogService(t, catalog, "orders")
			assert.Equal(t, "first", service.DefaultContractID)
			assert.Equal(t, ppmodel.ContractRoleValue(tc.firstRole), findCatalogContract(t, service, service.DefaultContractID).Role)
		})
	}
}

func TestAggregateDefaultContractEventSameRoleTieBreakers(t *testing.T) {
	tests := []struct {
		name     string
		left     *aggregateContractGroup
		right    *aggregateContractGroup
		expected string
	}{
		{
			name:     "title precedes differing versions paths and ids",
			left:     aggregateContractForDefaultTest("z-id", "Alpha Events", "services/orders/zeta/asyncapi.yaml", "v1"),
			right:    aggregateContractForDefaultTest("a-id", "Zulu Events", "services/orders/alpha/asyncapi.yaml", "v9"),
			expected: "z-id",
		},
		{
			name:     "path precedes differing versions and ids when titles tie",
			left:     aggregateContractForDefaultTest("z-id", "Shared Events", "services/orders/alpha/asyncapi.yaml", "v1"),
			right:    aggregateContractForDefaultTest("a-id", "Shared Events", "services/orders/zeta/asyncapi.yaml", "v9"),
			expected: "z-id",
		},
		{
			name:     "id decides when title and path tie",
			left:     aggregateContractForDefaultTest("z-id", "Shared Events", "services/orders/shared/asyncapi.yaml", "v9"),
			right:    aggregateContractForDefaultTest("a-id", "Shared Events", "services/orders/shared/asyncapi.yaml", "v1"),
			expected: "a-id",
		},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actual := resolveAggregateDefaultContract([]*aggregateContractGroup{tc.left, tc.right})
			require.NotNil(t, actual)
			assert.Equal(t, tc.expected, actual.id)
		})
	}
}

func TestAggregateCatalogContractJSONCompatibility(t *testing.T) {
	entry := &ppmodel.CatalogSpecEntry{
		ID:           "services/orders/openapi.yaml",
		Slug:         "orders-api",
		SpecKind:     ppmodel.SpecKindValueOpenAPI,
		ContractID:   "orders-http",
		ContractRole: ppmodel.ContractRoleHTTPAPI,
	}
	contractVersion := &ppmodel.CatalogContractVersion{
		Label:        "v1",
		Slug:         "v1",
		OverviewHref: "services/orders/versions/v1/specs/orders-api/index.html",
		Entry:        entry,
		Relationships: []*ppmodel.CatalogContractRelationship{
			{Relation: "publishes", Label: "Events", Href: "events.html", SpecKind: ppmodel.SpecKindValueAsyncAPI},
		},
	}
	service := &ppmodel.CatalogService{
		Key:               "orders",
		Slug:              "orders",
		DisplayName:       "Orders",
		SpecCount:         1,
		IdentityKey:       "orders",
		DefaultContractID: "orders-http",
		Versions: []*ppmodel.CatalogVersion{
			{Label: "v1", Slug: "v1", SpecCount: 1},
		},
		Contracts: []*ppmodel.CatalogContract{
			{
				ID:            "orders-http",
				DisplayName:   "Orders API",
				SpecKind:      ppmodel.SpecKindValueOpenAPI,
				Role:          ppmodel.ContractRoleHTTPAPI,
				Default:       true,
				LatestVersion: contractVersion,
				Versions:      []*ppmodel.CatalogContractVersion{contractVersion},
			},
		},
	}

	data, err := json.Marshal(service)
	require.NoError(t, err)
	assert.JSONEq(t, `{
		"key":"orders","slug":"orders","displayName":"Orders","specCount":1,
		"versions":[{"label":"v1","slug":"v1","specCount":1}],
		"identityKey":"orders","defaultContractId":"orders-http",
		"contracts":[{
			"id":"orders-http","displayName":"Orders API","specKind":"openapi","role":"http-api","default":true,
			"latestVersion":{"label":"v1","slug":"v1","overviewHref":"services/orders/versions/v1/specs/orders-api/index.html","entry":{"id":"services/orders/openapi.yaml","slug":"orders-api","specKind":"openapi","contractId":"orders-http","contractRole":"http-api"},"relationships":[{"relation":"publishes","label":"Events","href":"events.html","specKind":"asyncapi"}]},
			"versions":[{"label":"v1","slug":"v1","overviewHref":"services/orders/versions/v1/specs/orders-api/index.html","entry":{"id":"services/orders/openapi.yaml","slug":"orders-api","specKind":"openapi","contractId":"orders-http","contractRole":"http-api"},"relationships":[{"relation":"publishes","label":"Events","href":"events.html","specKind":"asyncapi"}]}]
		}]
	}`, string(data))
}

func TestAggregateDiscoveredRootRelationships(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/orders/events/published/v2/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Published
  version: v2
  x-owner: orders
channels: {}
operations: {}
components: {}
`)
	writeAggregateSpecDocument(t, root, "services/orders/events/consumed/v1/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Subscription
  version: v1
  x-owner: orders
channels:
  orders:
    address: orders
    messages:
      Order:
        $ref: ../../published/v2/asyncapi.yaml#/components/messages/Order
operations: {}
components:
  schemas:
    Ignored:
      $ref: ../schemas/shared.yaml#/Ignored
`)
	writeAggregateSpecDocument(t, root, "services/orders/events/schemas/shared.yaml", `
type: object
properties:
  id:
    type: string
`)
	writeAggregateCatalogSpec(t, root, "services/orders/http/v3/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v3", "orders")

	catalog := buildAggregateCatalogForTest(t, root, []AggregateContractRoleRule{
		{Pattern: "**/published/**", Role: "published-events", ContractID: "published"},
		{Pattern: "**/consumed/**", Role: "consumed-events", ContractID: "subscription"},
	})
	service := findCatalogService(t, catalog, "orders")
	published := findCatalogContract(t, service, "published")
	consumed := findCatalogContract(t, service, "subscription")
	var unrelated *ppmodel.CatalogContract
	for _, contract := range service.Contracts {
		if contract.SpecKind.IsOpenAPI() {
			unrelated = contract
			break
		}
	}
	require.NotNil(t, unrelated)
	assert.Empty(t, unrelated.Versions[0].Relationships)
	require.Len(t, consumed.Versions[0].Relationships, 1)
	assert.Equal(t, &ppmodel.CatalogContractRelationship{
		Relation: "consumes-from",
		Label:    "Consumes from Orders Published",
		Href:     published.Versions[0].OverviewHref,
		SpecKind: ppmodel.SpecKindValueAsyncAPI,
	}, consumed.Versions[0].Relationships[0])
	require.Len(t, published.Versions[0].Relationships, 1)
	assert.Equal(t, &ppmodel.CatalogContractRelationship{
		Relation: "consumed-by",
		Label:    "Consumed by Orders Subscription",
		Href:     consumed.Versions[0].OverviewHref,
		SpecKind: ppmodel.SpecKindValueAsyncAPI,
	}, published.Versions[0].Relationships[0])
	require.NotNil(t, consumed.Versions[0].Entry.HeaderContext)
	require.Len(t, consumed.Versions[0].Entry.HeaderContext.Relationships, 1)
	assert.Equal(t, "../../../v2/specs/orders-published/index.html", consumed.Versions[0].Entry.HeaderContext.Relationships[0].Href)
}

func TestAggregateExternalChannelMessageLinksToPublishedMessagePage(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/orders/events/published/v2/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Published
  version: v2
  x-owner: orders
channels: {}
operations: {}
components:
  messages:
    'Order Created':
      name: FirstOrderCreated
      payload:
        type: object
    'Order/Created':
      name: ExternalOrderCreated
      payload:
        type: object
`)
	writeAggregateSpecDocument(t, root, "services/orders/events/consumed/v1/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Consumed
  version: v1
  x-owner: orders
channels:
  orderEvents:
    address: orders.created
    messages:
      ExternalOrderCreated:
        $ref: ../../published/v2/asyncapi.yaml#/components/messages/Order~1Created
operations:
  consumeOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderEvents'
    messages:
      - $ref: '#/channels/orderEvents/messages/ExternalOrderCreated'
components: {}
`)
	for _, mode := range []struct {
		name      string
		assetMode string
		baseURL   string
		wantHref  string
	}{
		{name: "portable", assetMode: HTMLAssetModePortable, wantHref: "../../../v2/specs/orders-published/models/messages/order-created-2.html"},
		{name: "hosted", assetMode: HTMLAssetModeServed, baseURL: "/catalog/", wantHref: "/catalog/services/orders/versions/v2/specs/orders-published/models/messages/order-created-2.html"},
	} {
		t.Run(mode.name, func(t *testing.T) {
			outputDir := filepath.Join(root, "site-"+mode.name)
			ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
				OutputDir:  outputDir,
				BuildMode:  AggregateBuildModeFull,
				StateStore: NewMemorySpecStateStore(),
				AssetMode:  mode.assetMode,
				BaseURL:    mode.baseURL,
				ServiceIdentity: AggregateServiceIdentityConfig{
					MetadataPointers: []string{"/info/x-owner"},
				},
				ContractRoles: []AggregateContractRoleRule{
					{Pattern: "**/published/**", Role: "published-events", ContractID: "published"},
					{Pattern: "**/consumed/**", Role: "consumed-events", ContractID: "consumed"},
				},
			})
			require.NoError(t, err)
			_, err = ap.PrintHTML()
			require.NoError(t, err)

			service := findCatalogService(t, ap.catalog, "orders")
			published := findCatalogContract(t, service, "published")
			consumed := findCatalogContract(t, service, "consumed")
			publishedMessageDir := filepath.Join(outputDir, filepath.FromSlash(filepath.Join(
				filepath.Dir(published.Versions[0].OverviewHref), "models/messages",
			)))
			assert.FileExists(t, filepath.Join(publishedMessageDir, "order-created.html"))
			assert.FileExists(t, filepath.Join(publishedMessageDir, "order-created-2.html"))
			publishedMessages, err := filepath.Glob(filepath.Join(publishedMessageDir, "*.html"))
			require.NoError(t, err)
			publishedMessageDetails := publishedMessages[:0]
			for _, messagePage := range publishedMessages {
				if filepath.Base(messagePage) != pppaths.FileIndexHTML {
					publishedMessageDetails = append(publishedMessageDetails, messagePage)
				}
			}
			assert.Len(t, publishedMessageDetails, 2)
			consumerMessageDir := filepath.Join(outputDir, filepath.FromSlash(filepath.Join(
				consumed.Versions[0].Entry.OutputSubdir, "models/messages",
			)))
			consumerMessages, err := filepath.Glob(filepath.Join(consumerMessageDir, "*.html"))
			require.NoError(t, err)
			assert.Empty(t, consumerMessages, "external messages must not be duplicated into the consumer")
			operationHTML := readAggregateFile(t, filepath.Join(
				outputDir,
				filepath.FromSlash(consumed.Versions[0].Entry.OutputSubdir),
				"operations",
				"consume-order-created.html",
			))
			assert.Contains(t, operationHTML, `href="`+mode.wantHref+`"`)
			assert.NotContains(t, operationHTML, `href="../../../v2/specs/orders-published/models/messages/order-created.html"`)
			assert.NotContains(t, operationHTML, `models/messages/.html`)
		})
	}
}

func TestAggregateExternalChannelMessageDecodesPercentEncodedFragment(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/orders/events/published/v2/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Published
  version: v2
  x-owner: orders
channels: {}
operations: {}
components:
  messages:
    Order.Created:
      name: OrderCreated
      payload:
        type: object
`)
	writeAggregateSpecDocument(t, root, "services/orders/events/consumed/v1/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Consumed
  version: v1
  x-owner: orders
channels:
  orderEvents:
    address: orders.created
    messages:
      ExternalOrderCreated:
        $ref: ../../published/v2/asyncapi.yaml#/components/messages/Order%2ECreated
operations:
  consumeOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderEvents'
    messages:
      - $ref: '#/channels/orderEvents/messages/ExternalOrderCreated'
components: {}
`)
	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, externalMessageAggregateConfig(outputDir, AggregateBuildModeFull, NewMemorySpecStateStore()))
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	require.NoError(t, err)

	service := findCatalogService(t, ap.catalog, "orders")
	consumed := findCatalogContract(t, service, "consumed")
	operationHTML := readAggregateFile(t, filepath.Join(
		outputDir,
		filepath.FromSlash(consumed.Versions[0].Entry.OutputSubdir),
		"operations/consume-order-created.html",
	))
	assert.Contains(t, operationHTML, `href="../../../v2/specs/orders-published/models/messages/order-created.html"`)
	assert.NotContains(t, operationHTML, `models/messages/.html`)
}

func TestAggregateExternalChannelMessageDoesNotUseSameKeyLocalComponent(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/orders/events/published/v2/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Published
  version: v2
  x-owner: orders
channels: {}
operations: {}
components:
  messages:
    OrderCreated:
      name: ExternalOrderCreated
      payload:
        type: object
`)
	writeAggregateSpecDocument(t, root, "services/orders/events/consumed/v1/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Orders Consumed
  version: v1
  x-owner: orders
channels:
  orderEvents:
    address: orders.created
    messages:
      OrderCreated:
        $ref: ../../published/v2/asyncapi.yaml#/components/messages/OrderCreated
operations:
  consumeOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderEvents'
    messages:
      - $ref: '#/channels/orderEvents/messages/OrderCreated'
components:
  messages:
    OrderCreated:
      name: LocalOrderCreated
      payload:
        type: object
`)
	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, externalMessageAggregateConfig(outputDir, AggregateBuildModeFull, NewMemorySpecStateStore()))
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	require.NoError(t, err)

	service := findCatalogService(t, ap.catalog, "orders")
	consumed := findCatalogContract(t, service, "consumed")
	consumerEntryDir := filepath.Join(outputDir, filepath.FromSlash(consumed.Versions[0].Entry.OutputSubdir))
	assert.FileExists(t, filepath.Join(consumerEntryDir, "models/messages/order-created.html"), "the independent local component remains browseable")
	operationHTML := readAggregateFile(t, filepath.Join(consumerEntryDir, "operations/consume-order-created.html"))
	assert.Contains(t, operationHTML, `href="../../../v2/specs/orders-published/models/messages/order-created.html"`)
	assert.NotContains(t, operationHTML, `href="models/messages/order-created.html"`)
}

func TestAggregateFastExternalMessageCollisionRetargetsUnchangedConsumer(t *testing.T) {
	root := t.TempDir()
	publisherPath := "services/orders/events/published/v2/asyncapi.yaml"
	consumerPath := "services/orders/events/consumed/v1/asyncapi.yaml"
	writeAggregateExternalMessagePublisher(t, root, publisherPath, false)
	writeAggregateSpecDocument(t, root, consumerPath, `
asyncapi: 3.0.0
info:
  title: Orders Consumed
  version: v1
  x-owner: orders
channels:
  orderEvents:
    address: orders.created
    messages:
      ExternalOrderCreated:
        $ref: ../../published/v2/asyncapi.yaml#/components/messages/Order~1Created
operations:
  consumeOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderEvents'
    messages:
      - $ref: '#/channels/orderEvents/messages/ExternalOrderCreated'
components: {}
`)
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()
	ap, err := CreateAggregatePrintingPressFromPath(root, externalMessageAggregateConfig(outputDir, AggregateBuildModeFast, store))
	require.NoError(t, err)
	first, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 2, first.ChangedSpecs)
	before, err := store.Load("default")
	require.NoError(t, err)
	beforeConsumer := before[consumerPath]
	require.NotNil(t, beforeConsumer)
	require.NotNil(t, before[publisherPath])
	assert.Equal(t, "models/messages/order-created.html", before[publisherPath].MessageHrefs["#/components/messages/Order~1Created"])

	writeAggregateExternalMessagePublisher(t, root, publisherPath, true)
	second, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 2, second.ChangedSpecs, "publisher identity changes must invalidate its unchanged consumer")
	service := findCatalogService(t, ap.catalog, "orders")
	consumed := findCatalogContract(t, service, "consumed")
	operationHTML := readAggregateFile(t, filepath.Join(
		outputDir,
		filepath.FromSlash(consumed.Versions[0].Entry.OutputSubdir),
		"operations/consume-order-created.html",
	))
	assert.Contains(t, operationHTML, `href="../../../v2/specs/orders-published/models/messages/order-created-2.html"`)
	after, err := store.Load("default")
	require.NoError(t, err)
	afterConsumer := after[consumerPath]
	require.NotNil(t, afterConsumer)
	require.NotNil(t, after[publisherPath])
	assert.Equal(t, "models/messages/order-created-2.html", after[publisherPath].MessageHrefs["#/components/messages/Order~1Created"])
	assert.NotEqual(t, beforeConsumer.ConfigHash, afterConsumer.ConfigHash)
	assert.NotEqual(t, beforeConsumer.HTMLCompletionHash, afterConsumer.HTMLCompletionHash)

	writeAggregateExternalMessagePublisher(t, root, publisherPath, false)
	third, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 2, third.ChangedSpecs, "removing the collision must retarget the consumer again")
	operationHTML = readAggregateFile(t, filepath.Join(
		outputDir,
		filepath.FromSlash(findCatalogContract(t, findCatalogService(t, ap.catalog, "orders"), "consumed").Versions[0].Entry.OutputSubdir),
		"operations/consume-order-created.html",
	))
	assert.Contains(t, operationHTML, `href="../../../v2/specs/orders-published/models/messages/order-created.html"`)
	final, err := store.Load("default")
	require.NoError(t, err)
	require.NotNil(t, final[publisherPath])
	assert.Equal(t, "models/messages/order-created.html", final[publisherPath].MessageHrefs["#/components/messages/Order~1Created"])
	stable, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 0, stable.ChangedSpecs)

	writeAggregateExternalMessagePublisher(t, root, publisherPath, true)
	consumerDocument, err := os.ReadFile(filepath.Join(root, filepath.FromSlash(consumerPath)))
	require.NoError(t, err)
	require.NoError(t, os.WriteFile(
		filepath.Join(root, filepath.FromSlash(consumerPath)),
		append(consumerDocument, []byte("\nx-test-revision: changed\n")...),
		0o644,
	))
	fourth, err := ap.PrintHTML()
	require.NoError(t, err)
	assert.Equal(t, 2, fourth.ChangedSpecs)
	operationHTML = readAggregateFile(t, filepath.Join(
		outputDir,
		filepath.FromSlash(findCatalogContract(t, findCatalogService(t, ap.catalog, "orders"), "consumed").Versions[0].Entry.OutputSubdir),
		"operations/consume-order-created.html",
	))
	assert.Contains(t, operationHTML, `href="../../../v2/specs/orders-published/models/messages/order-created-2.html"`, "preflight must replace its persisted external target when both roots change")
}

func TestAggregateFastExternalMessageInvalidationPreflightsLateDirtyConsumer(t *testing.T) {
	root := t.TempDir()
	publisherPath := "services/orders/events/published/v2/asyncapi.yaml"
	consumerPath := "services/orders/events/consumed/v1/asyncapi.yaml"
	writeAggregateExternalMessagePublisher(t, root, publisherPath, false)
	writeAggregateSpecDocument(t, root, consumerPath, `
asyncapi: 3.0.0
info:
  title: Orders Consumed
  version: v1
  x-owner: orders
channels:
  orderEvents:
    address: orders.created
    messages:
      ExternalOrderCreated:
        $ref: ../../published/v2/asyncapi.yaml#/components/messages/Order~1Created
operations:
  consumeOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderEvents'
    messages:
      - $ref: '#/channels/orderEvents/messages/ExternalOrderCreated'
components: {}
`)
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()
	config := externalMessageAggregateConfig(outputDir, AggregateBuildModeFast, store)
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)

	writeAggregateExternalMessagePublisher(t, root, publisherPath, true)
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	var preflighted []string
	ap.preflightBuildEntrySite = func(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
		preflighted = append(preflighted, spec.RelativePath)
		if spec.RelativePath == consumerPath {
			return nil, fmt.Errorf("forced late-dirty consumer failure")
		}
		return ap.buildEntrySite(spec, entry)
	}

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Contains(t, preflighted, publisherPath)
	assert.Contains(t, preflighted, consumerPath)
	consumer := catalogEntryIndex(ap.catalog)[consumerPath]
	require.NotNil(t, consumer)
	assert.True(t, consumer.RenderSkipped)
	assert.Equal(t, 1, stats.ChangedSpecs)
	assert.True(t, slices.ContainsFunc(stats.Warnings, func(warning *ppmodel.BuildWarning) bool {
		return warning != nil && warning.Context == consumerPath
	}))
}

func externalMessageAggregateConfig(outputDir, buildMode string, store SpecStateStore) *AggregatePrintingPressConfig {
	return &AggregatePrintingPressConfig{
		OutputDir:      outputDir,
		BuildMode:      buildMode,
		StateStore:     store,
		StateNamespace: "default",
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner"},
		},
		ContractRoles: []AggregateContractRoleRule{
			{Pattern: "**/published/**", Role: "published-events", ContractID: "published"},
			{Pattern: "**/consumed/**", Role: "consumed-events", ContractID: "consumed"},
		},
	}
}

func writeAggregateExternalMessagePublisher(t *testing.T, root, relPath string, collision bool) {
	t.Helper()
	first := ""
	if collision {
		first = "    'Order Created':\n      name: FirstOrderCreated\n      payload:\n        type: object\n"
	}
	writeAggregateSpecDocument(t, root, relPath, "asyncapi: 3.0.0\ninfo:\n  title: Orders Published\n  version: v2\n  x-owner: orders\nchannels: {}\noperations: {}\ncomponents:\n  messages:\n"+first+"    'Order/Created':\n      name: ExternalOrderCreated\n      payload:\n        type: object\n")
}

func TestPopulateHeaderContextsBuildsPermanentContractNavigation(t *testing.T) {
	entry := func(id, contractID, output, overview, version string, kind ppmodel.SpecKindValue) *ppmodel.CatalogSpecEntry {
		return &ppmodel.CatalogSpecEntry{
			ID: id, ContractID: contractID, OutputSubdir: output, OverviewHref: overview,
			RelativePath: id, Version: version, SpecKind: kind,
		}
	}
	activeHTTP := entry("http-v1.yaml", "http-z", "services/orders/versions/v1/specs/http-z", "services/orders/versions/v1/specs/http-z/index.html", "v1", ppmodel.SpecKindValueOpenAPI)
	httpV2 := entry("http-v2.yaml", "http-z", "services/orders/versions/v2/specs/http-z", "services/orders/versions/v2/specs/http-z/index.html", "v2", ppmodel.SpecKindValueOpenAPI)
	published := entry("published.yaml", "published", "services/orders/versions/v4/specs/published", "services/orders/versions/v4/specs/published/index.html", "v4", ppmodel.SpecKindValueAsyncAPI)
	consumed := entry("consumed.yaml", "consumed", "services/orders/versions/v3/specs/consumed", "services/orders/versions/v3/specs/consumed/index.html", "v3", ppmodel.SpecKindValueAsyncAPI)
	external := entry("external.yaml", "external", "services/orders/versions/v2/specs/external", "services/orders/versions/v2/specs/external/index.html", "v2", ppmodel.SpecKindValueAsyncAPI)
	events := entry("events.yaml", "events", "services/orders/versions/v1/specs/events", "services/orders/versions/v1/specs/events/index.html", "v1", ppmodel.SpecKindValueAsyncAPI)
	skipped := entry("skipped.yaml", "skipped", "services/orders/versions/v9/specs/skipped", "services/orders/versions/v9/specs/skipped/index.html", "v9", ppmodel.SpecKindValueAsyncAPI)
	skipped.RenderSkipped = true

	contract := func(id, label string, role ppmodel.ContractRoleValue, kind ppmodel.SpecKindValue, entries ...*ppmodel.CatalogSpecEntry) *ppmodel.CatalogContract {
		versions := make([]*ppmodel.CatalogContractVersion, 0, len(entries))
		for _, item := range entries {
			versions = append(versions, &ppmodel.CatalogContractVersion{Label: item.Version, OverviewHref: item.OverviewHref, Entry: item})
		}
		return &ppmodel.CatalogContract{ID: id, DisplayName: label, Role: role, SpecKind: kind, Versions: versions, LatestVersion: versions[0]}
	}
	service := &ppmodel.CatalogService{
		Key: "orders", DisplayName: "Orders", Contracts: []*ppmodel.CatalogContract{
			contract("events", "General Events", ppmodel.ContractRoleEvents, ppmodel.SpecKindValueAsyncAPI, events),
			contract("external", "External Source", ppmodel.ContractRoleExternalSource, ppmodel.SpecKindValueAsyncAPI, external),
			contract("consumed", "Consumed Events", ppmodel.ContractRoleConsumedEvents, ppmodel.SpecKindValueAsyncAPI, consumed),
			contract("published", "Published Events", ppmodel.ContractRolePublishedEvents, ppmodel.SpecKindValueAsyncAPI, published),
			contract("http-z", "Zeta HTTP", ppmodel.ContractRoleHTTPAPI, ppmodel.SpecKindValueOpenAPI, httpV2, activeHTTP),
			contract("http-a", "Alpha HTTP", ppmodel.ContractRoleHTTPAPI, ppmodel.SpecKindValueOpenAPI,
				entry("http-a.yaml", "http-a", "services/orders/versions/v5/specs/http-a", "services/orders/versions/v5/specs/http-a/index.html", "v5", ppmodel.SpecKindValueOpenAPI)),
			contract("skipped", "Skipped", ppmodel.ContractRolePublishedEvents, ppmodel.SpecKindValueAsyncAPI, skipped),
		},
		Versions: []*ppmodel.CatalogVersion{
			{Label: "v5", Entries: []*ppmodel.CatalogSpecEntry{serviceEntryForTest("http-a.yaml", "http-a", "v5")}},
			{Label: "v4", Entries: []*ppmodel.CatalogSpecEntry{published}},
			{Label: "v3", Entries: []*ppmodel.CatalogSpecEntry{consumed}},
			{Label: "v2", Entries: []*ppmodel.CatalogSpecEntry{httpV2, external}},
			{Label: "v1", Entries: []*ppmodel.CatalogSpecEntry{activeHTTP, events}},
			{Label: "v9", Entries: []*ppmodel.CatalogSpecEntry{skipped}},
		},
	}
	// Reuse the same entry pointer for the second HTTP contract in the legacy version index.
	service.Versions[0].Entries[0] = service.Contracts[5].Versions[0].Entry

	(&AggregatePrintingPress{}).populateHeaderContexts(&ppmodel.CatalogSite{Services: []*ppmodel.CatalogService{service}})
	header := activeHTTP.HeaderContext
	require.NotNil(t, header)
	assert.Equal(t, "API OVERVIEW", header.OverviewLabel)
	require.Len(t, header.ContractGroups, 5)
	assert.Equal(t, []ppmodel.ContractRoleValue{
		ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRolePublishedEvents, ppmodel.ContractRoleConsumedEvents,
		ppmodel.ContractRoleExternalSource, ppmodel.ContractRoleEvents,
	}, []ppmodel.ContractRoleValue{header.ContractGroups[0].Role, header.ContractGroups[1].Role, header.ContractGroups[2].Role, header.ContractGroups[3].Role, header.ContractGroups[4].Role})
	assert.Equal(t, []string{"Alpha HTTP", "Zeta HTTP"}, []string{header.ContractGroups[0].Contracts[0].Label, header.ContractGroups[0].Contracts[1].Label})
	assert.NotContains(t, fmt.Sprint(header.ContractGroups), "Skipped")

	active := header.ContractGroups[0].Contracts[1]
	assert.True(t, active.Active)
	assert.Equal(t, "v1", active.CurrentVersion)
	assert.Equal(t, "index.html", active.Href)
	assert.Equal(t, []string{"v2", "v1"}, []string{active.Versions[0].Label, active.Versions[1].Label})
	assert.Equal(t, []bool{false, true}, []bool{active.Versions[0].Active, active.Versions[1].Active})
	assert.Equal(t, active.Versions, header.Versions)

	sibling := header.ContractGroups[0].Contracts[0]
	assert.False(t, sibling.Active)
	assert.Empty(t, sibling.CurrentVersion)
	assert.Empty(t, sibling.Versions)
	assert.Equal(t, "../../../v5/specs/http-a/index.html", sibling.Href)
	assert.Equal(t, "EVENT OVERVIEW", published.HeaderContext.OverviewLabel)
}

func TestAggregateHTMLPromotionSurvivorHasFinalContractTopologyWithoutRewrite(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	httpPath := "services/orders/http/v1/openapi.yaml"
	eventsPath := "services/orders/events/v1/asyncapi.yaml"
	writeAggregateSpecWithDetails(t, root, httpPath, "Orders HTTP", "", "", "v1")
	writeAggregateAsyncAPISpec(t, root, eventsPath, "Orders Events", "v1")
	config := aggregateNavigationTestConfig(root, store, []AggregateContractRoleRule{
		{Pattern: "**/http/**", Role: "http-api", ContractID: "http", Default: true},
		{Pattern: "**/events/**", Role: "published-events", ContractID: "events"},
	})

	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)
	baselineEntries := catalogEntryIndex(baseline.catalog)
	httpEntry := baselineEntries[httpPath]
	eventsEntry := baselineEntries[eventsPath]
	require.NotNil(t, httpEntry)
	require.NotNil(t, eventsEntry)
	httpOutput := filepath.Join(config.OutputDir, filepath.FromSlash(httpEntry.OutputSubdir))
	eventsOutput := filepath.Join(config.OutputDir, filepath.FromSlash(eventsEntry.OutputSubdir))

	for _, relativePath := range []string{httpPath, eventsPath} {
		absolutePath := filepath.Join(root, filepath.FromSlash(relativePath))
		document, readErr := os.ReadFile(absolutePath)
		require.NoError(t, readErr)
		require.NoError(t, os.WriteFile(absolutePath, append(document, []byte("\nx-render-revision: changed\n")...), 0o644))
	}

	promotionErr := errors.New("injected event promotion failure")
	promotionFailed := false
	cleanupCalled := false
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	ap.beginEntryPromotion = func(stagedOutput, entryOutput string) (*aggregateEntryPromotion, error, error) {
		if entryOutput == eventsOutput && !promotionFailed {
			promotionFailed = true
			return nil, promotionErr, nil
		}
		return beginAggregateEntryPromotion(stagedOutput, entryOutput)
	}
	ap.cleanupPromotionBackup = func(backupPath string) error {
		cleanupCalled = true
		require.NoError(t, os.WriteFile(filepath.Join(httpOutput, ".post-promotion-refresh-probe.html"), []byte("<body"), 0o644))
		return os.RemoveAll(backupPath)
	}

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)
	require.True(t, promotionFailed)
	require.True(t, cleanupCalled)
	assert.Equal(t, 1, stats.ChangedSpecs)
	assert.True(t, catalogEntryIndex(ap.catalog)[eventsPath].RenderSkipped)
	assert.False(t, catalogEntryIndex(ap.catalog)[httpPath].RenderSkipped)

	for _, relativePage := range []string{pppaths.FileIndexHTML, "operations/list-health.html", "models/schemas/status.html"} {
		rendered := readAggregateFile(t, filepath.Join(httpOutput, filepath.FromSlash(relativePage)))
		assert.Empty(t, aggregateBodyAttribute(t, rendered, "data-pp-contracts"), relativePage)
		assert.Equal(t, "API OVERVIEW", aggregateBodyAttribute(t, rendered, "data-pp-overview-label"), relativePage)
		assert.Contains(t, rendered, `<div class="pp-nav-fallback-home">API OVERVIEW</div>`, relativePage)
		assert.NotContains(t, rendered, `class="pp-nav-fallback-contracts"`, relativePage)
	}
}

func TestPopulateHeaderContextsCoalescesOnlyAutomaticLegacyVersions(t *testing.T) {
	build := func() (*ppmodel.CatalogSite, *ppmodel.CatalogSpecEntry) {
		v2 := &ppmodel.CatalogSpecEntry{
			ID: "services/users/usersv2.yaml", RelativePath: "services/users/usersv2.yaml", ContractID: "auto-v2",
			OutputSubdir: "services/users/versions/v2/specs/users-api", OverviewHref: "services/users/versions/v2/specs/users-api/index.html",
			Version: "v2", SpecKind: ppmodel.SpecKindValueOpenAPI,
		}
		v1 := &ppmodel.CatalogSpecEntry{
			ID: "services/users/usersv1.yaml", RelativePath: "services/users/usersv1.yaml", ContractID: "auto-v1",
			OutputSubdir: "services/users/versions/v1/specs/users-api", OverviewHref: "services/users/versions/v1/specs/users-api/index.html",
			Version: "v1", SpecKind: ppmodel.SpecKindValueOpenAPI,
		}
		contract := func(id string, entry *ppmodel.CatalogSpecEntry) *ppmodel.CatalogContract {
			version := &ppmodel.CatalogContractVersion{Label: entry.Version, OverviewHref: entry.OverviewHref, Entry: entry}
			return &ppmodel.CatalogContract{ID: id, DisplayName: "Users API", Role: ppmodel.ContractRoleHTTPAPI, SpecKind: ppmodel.SpecKindValueOpenAPI, LatestVersion: version, Versions: []*ppmodel.CatalogContractVersion{version}}
		}
		service := &ppmodel.CatalogService{
			Key: "users", DisplayName: "Users API", Contracts: []*ppmodel.CatalogContract{contract("auto-v2", v2), contract("auto-v1", v1)},
			Versions: []*ppmodel.CatalogVersion{{Label: "v2", Entries: []*ppmodel.CatalogSpecEntry{v2}}, {Label: "v1", Entries: []*ppmodel.CatalogSpecEntry{v1}}},
		}
		return &ppmodel.CatalogSite{Services: []*ppmodel.CatalogService{service}}, v2
	}

	legacy, active := build()
	(&AggregatePrintingPress{}).populateHeaderContexts(legacy)
	assert.Empty(t, active.HeaderContext.ContractGroups)
	assert.Equal(t, []string{"v2", "v1"}, []string{active.HeaderContext.Versions[0].Label, active.HeaderContext.Versions[1].Label})

	explicit, active := build()
	active.ContractID = "users-v2"
	explicit.Services[0].Contracts[0].ID = "users-v2"
	explicit.Services[0].Contracts[1].Versions[0].Entry.ContractID = "users-v1"
	explicit.Services[0].Contracts[1].ID = "users-v1"
	ap := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{
		{Pattern: "**/usersv2.yaml", Role: "http-api", ContractID: "users-v2"},
		{Pattern: "**/usersv1.yaml", Role: "http-api", ContractID: "users-v1"},
	}}}
	ap.populateHeaderContexts(explicit)
	require.Len(t, active.HeaderContext.ContractGroups, 1)
	assert.Len(t, active.HeaderContext.ContractGroups[0].Contracts, 2)
}

func TestPopulateHeaderContextsExplicitContractIDRuleOrderingAcrossVersions(t *testing.T) {
	entry := func(relativePath, contractID, version string) *ppmodel.CatalogSpecEntry {
		return &ppmodel.CatalogSpecEntry{
			ID: relativePath, RelativePath: relativePath, ContractID: contractID,
			OutputSubdir: "services/users/versions/" + version + "/specs/users-api",
			OverviewHref: "services/users/versions/" + version + "/specs/users-api/index.html",
			Version:      version, SpecKind: ppmodel.SpecKindValueOpenAPI,
		}
	}
	contract := func(id string, entries ...*ppmodel.CatalogSpecEntry) *ppmodel.CatalogContract {
		versions := make([]*ppmodel.CatalogContractVersion, 0, len(entries))
		for _, item := range entries {
			versions = append(versions, &ppmodel.CatalogContractVersion{Label: item.Version, OverviewHref: item.OverviewHref, Entry: item})
		}
		return &ppmodel.CatalogContract{ID: id, DisplayName: "Users API", Role: ppmodel.ContractRoleHTTPAPI, SpecKind: ppmodel.SpecKindValueOpenAPI, LatestVersion: versions[0], Versions: versions}
	}
	service := func(contracts ...*ppmodel.CatalogContract) *ppmodel.CatalogService {
		result := &ppmodel.CatalogService{Key: "users", DisplayName: "Users API", Contracts: contracts}
		versions := make(map[string]*ppmodel.CatalogVersion)
		for _, item := range contracts {
			for _, version := range item.Versions {
				catalogVersion := versions[version.Label]
				if catalogVersion == nil {
					catalogVersion = &ppmodel.CatalogVersion{Label: version.Label}
					versions[version.Label] = catalogVersion
					result.Versions = append(result.Versions, catalogVersion)
				}
				catalogVersion.Entries = append(catalogVersion.Entries, version.Entry)
			}
		}
		return result
	}

	t.Run("later version explicit id is not masked by an earlier role-only match", func(t *testing.T) {
		v2 := entry("services/users/role-only/v2.yaml", "legacy-v2", "v2")
		v1 := entry("services/users/explicit/v1.yaml", "users-explicit", "v1")
		v3 := entry("services/users/automatic/v3.json", "legacy-v3", "v3")
		catalogService := service(contract("legacy-multi", v2, v1), contract("legacy-v3", v3))
		ap := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{
			{Pattern: "**/role-only/**", Role: "http-api"},
			{Pattern: "**/explicit/**", Role: "http-api", ContractID: "users-explicit"},
		}}}

		ap.populateHeaderContexts(&ppmodel.CatalogSite{Services: []*ppmodel.CatalogService{catalogService}})

		require.Len(t, v2.HeaderContext.ContractGroups, 1)
		assert.Len(t, v2.HeaderContext.ContractGroups[0].Contracts, 2)
		assert.Equal(t, []string{"v2", "v1"}, []string{v2.HeaderContext.Versions[0].Label, v2.HeaderContext.Versions[1].Label})
	})

	t.Run("first matching rule still wins within one entry", func(t *testing.T) {
		v2 := entry("services/users/shadowed/v2.yaml", "legacy-v2", "v2")
		v1 := entry("services/users/automatic/v1.json", "legacy-v1", "v1")
		catalogService := service(contract("legacy-v2", v2), contract("legacy-v1", v1))
		ap := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{
			{Pattern: "**/shadowed/**", Role: "http-api"},
			{Pattern: "**/*.yaml", Role: "http-api", ContractID: "shadowed-catch-all"},
		}}}

		ap.populateHeaderContexts(&ppmodel.CatalogSite{Services: []*ppmodel.CatalogService{catalogService}})

		assert.Empty(t, v2.HeaderContext.ContractGroups)
		assert.Equal(t, []string{"v2", "v1"}, []string{v2.HeaderContext.Versions[0].Label, v2.HeaderContext.Versions[1].Label})
	})
}

func TestAggregateNavigationViewMergesSortedVersionsWithoutMutatingCatalog(t *testing.T) {
	entry := func(id, version string) *ppmodel.CatalogSpecEntry {
		return &ppmodel.CatalogSpecEntry{ID: id, RelativePath: id, Version: version, SpecKind: ppmodel.SpecKindValueOpenAPI}
	}
	contract := func(id string, item *ppmodel.CatalogSpecEntry) *ppmodel.CatalogContract {
		version := &ppmodel.CatalogContractVersion{Label: item.Version, Entry: item}
		return &ppmodel.CatalogContract{
			ID: id, DisplayName: "Users API", Role: ppmodel.ContractRoleHTTPAPI,
			SpecKind: ppmodel.SpecKindValueOpenAPI, LatestVersion: version,
			Versions: []*ppmodel.CatalogContractVersion{version},
		}
	}
	v1 := contract("legacy-v1", entry("services/users/v1.json", "v1"))
	v3 := contract("legacy-v3", entry("services/users/v3.json", "v3"))
	v2 := contract("legacy-v2", entry("services/users/v2.json", "v2"))
	service := &ppmodel.CatalogService{Key: "users", Contracts: []*ppmodel.CatalogContract{v1, v3, v2}}

	view := (&AggregatePrintingPress{}).buildCatalogNavigationView(service)

	require.Len(t, view.contracts, 1)
	assert.Equal(t, []string{"v3", "v2", "v1"}, []string{
		view.contracts[0].versions[0].Label,
		view.contracts[0].versions[1].Label,
		view.contracts[0].versions[2].Label,
	})
	assert.Len(t, v1.Versions, 1)
	assert.Len(t, v3.Versions, 1)
	assert.Len(t, v2.Versions, 1)
}

func serviceEntryForTest(id, contractID, version string) *ppmodel.CatalogSpecEntry {
	return &ppmodel.CatalogSpecEntry{ID: id, ContractID: contractID, Version: version}
}

func TestAggregateDiscoveredRootRelationshipFilteringDeduplicationAndOrdering(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/alpha/nested/v1/openapi.yaml", SpecKindOpenAPI, "Alpha API", "", "v1", "alpha")
	writeAggregateSpecDocument(t, root, "services/beta/specs/v3/asyncapi.yaml", `
asyncapi: 3.0.0
info:
  title: Beta Events
  version: v3
  x-owner: beta
channels: {}
operations: {}
components: {}
`)
	writeAggregateSpecDocument(t, root, "services/source/specs/v2/openapi.yaml", `
openapi: 3.1.0
info:
  title: Source <API>
  version: v2
  x-owner: source
paths:
  /test:
    get:
      responses:
        "200":
          $ref: ../../../alpha/nested/v1/../v1/openapi.yaml#/components/responses/OK
        "201":
          $ref: ../../../alpha/nested/v1/openapi.yaml#/components/responses/Created
        "202":
          $ref: ../../../beta/specs/v3/asyncapi.yaml#/components/messages/Event
        "203":
          $ref: '#/components/responses/Local'
        "204":
          $ref: missing.yaml#/Nope
        "205":
          $ref: https://example.com/spec.yaml#/Nope
        "206":
          $ref: custom:spec.yaml#/Nope
        "207":
          $ref: //example.com/spec.yaml#/Nope
        "208":
          $ref: /absolute/spec.yaml#/Nope
        "209":
          $ref: openapi.yaml#/components/responses/Self
components: {}
`)
	catalog := buildAggregateCatalogForTest(t, root, nil)
	source := findCatalogService(t, catalog, "source")
	rels := source.Contracts[0].Versions[0].Relationships
	require.Len(t, rels, 2)
	assert.Equal(t, []string{"References Alpha API", "References Beta Events"}, []string{rels[0].Label, rels[1].Label})
	assert.Equal(t, ppmodel.SpecKindValueOpenAPI, rels[0].SpecKind)
	assert.Equal(t, ppmodel.SpecKindValueAsyncAPI, rels[1].SpecKind)
	assert.NotEqual(t, rels[0].Href, rels[1].Href)
	assert.NotContains(t, rels[0].Href+rels[1].Href, "missing")

	alpha := findCatalogService(t, catalog, "alpha")
	require.Len(t, alpha.Contracts[0].Versions[0].Relationships, 1)
	assert.Equal(t, "Referenced by Source <API>", alpha.Contracts[0].Versions[0].Relationships[0].Label)
	beta := findCatalogService(t, catalog, "beta")
	require.Len(t, beta.Contracts[0].Versions[0].Relationships, 1)
	assert.Equal(t, "referenced-by", beta.Contracts[0].Versions[0].Relationships[0].Relation)
}

func TestAggregateRelationshipIgnoresOtherwiseValidExcludedRoots(t *testing.T) {
	for _, tc := range []struct {
		name   string
		config func(*AggregatePrintingPressConfig)
	}{
		{name: "include", config: func(config *AggregatePrintingPressConfig) { config.Include = []string{"services/source/**"} }},
		{name: "ignore", config: func(config *AggregatePrintingPressConfig) { config.IgnoreRules = []string{"services/target/**"} }},
	} {
		t.Run(tc.name, func(t *testing.T) {
			root := t.TempDir()
			writeAggregateSpecDocument(t, root, "services/source/v1/openapi.yaml", `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../target/v1/openapi.yaml#/info
paths: {}
`)
			writeAggregateCatalogSpec(t, root, "services/target/v1/openapi.yaml", SpecKindOpenAPI, "Excluded Target", "", "v1", "target")
			config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil)
			tc.config(config)
			ap, err := CreateAggregatePrintingPressFromPath(root, config)
			require.NoError(t, err)
			catalog, err := ap.PressModel()
			require.NoError(t, err)
			source := findCatalogService(t, catalog, "source")
			assert.Empty(t, source.Contracts[0].Versions[0].Relationships)
			assert.Len(t, catalog.Services, 1)
		})
	}
}

func TestAggregateNavigationFingerprintInvalidatesServiceTree(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	roles := []AggregateContractRoleRule{
		{Pattern: "**/http/**", Role: "http-api", ContractID: "http", Default: true},
		{Pattern: "**/events/**", Role: "published-events", ContractID: "events"},
	}
	writeAggregateCatalogSpec(t, root, "services/orders/http/v1/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v1", "orders")
	run := func() (*AggregatePressStatistics, map[string]*SpecStateRecord, *ppmodel.CatalogSite) {
		ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
			OutputDir: filepath.Join(root, "site"), BuildMode: AggregateBuildModeFast,
			StateNamespace: "navigation", StateStore: store,
			ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"/info/x-owner"}},
			ContractRoles:   roles,
		})
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
		require.NoError(t, err)
		records, err := store.Load("navigation")
		require.NoError(t, err)
		return stats, records, ap.catalog
	}
	first, firstRecords, _ := run()
	assert.Equal(t, 1, first.ChangedSpecs)
	unchanged, _, _ := run()
	assert.Equal(t, 0, unchanged.ChangedSpecs)

	writeAggregateCatalogSpec(t, root, "services/orders/events/v2/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v2", "orders")
	added, addedRecords, addedCatalog := run()
	assert.Equal(t, 2, added.ChangedSpecs)
	assert.NotEqual(t, firstRecords["services/orders/http/v1/openapi.yaml"].ConfigHash, addedRecords["services/orders/http/v1/openapi.yaml"].ConfigHash)
	eventsEntry := findCatalogContract(t, findCatalogService(t, addedCatalog, "orders"), "events").Versions[0].Entry
	httpEntry := findCatalogContract(t, findCatalogService(t, addedCatalog, "orders"), "http").Versions[0].Entry
	addedHTML := readAggregateFile(t, filepath.Join(root, "site", pppaths.FileIndexHTML))
	assert.NotContains(t, addedHTML, eventsEntry.OverviewHref)
	addedEntryHTML := readAggregateFile(t, filepath.Join(root, "site", httpEntry.OverviewHref))
	assert.Contains(t, addedEntryHTML, `data-pp-contracts=`)
	assert.Contains(t, addedEntryHTML, `Orders Events`)
	assert.Contains(t, addedEntryHTML, `data-pp-overview-label="API OVERVIEW"`)

	require.NoError(t, os.Remove(filepath.Join(root, "services/orders/events/v2/asyncapi.yaml")))
	removed, removedRecords, _ := run()
	assert.Equal(t, 1, removed.ChangedSpecs)
	assert.NotEqual(t, addedRecords["services/orders/http/v1/openapi.yaml"].ConfigHash, removedRecords["services/orders/http/v1/openapi.yaml"].ConfigHash)
	removedHTML := readAggregateFile(t, filepath.Join(root, "site", pppaths.FileIndexHTML))
	assert.NotContains(t, removedHTML, eventsEntry.OverviewHref)
	removedEntryHTML := readAggregateFile(t, filepath.Join(root, "site", httpEntry.OverviewHref))
	assert.NotContains(t, removedEntryHTML, `data-pp-contracts=`)
	assert.Contains(t, removedEntryHTML, `data-pp-overview-label="API OVERVIEW"`)
	assert.NoDirExists(t, filepath.Join(root, "site", filepath.FromSlash(eventsEntry.OutputSubdir)))
	final, _, _ := run()
	assert.Equal(t, 0, final.ChangedSpecs)
}

func TestAggregateFastContractNavigationUpdatesEveryGeneratedPage(t *testing.T) {
	root := t.TempDir()
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()
	httpPath := "services/orders/http/v1/openapi.yaml"
	eventsPath := "services/orders/events/asyncapi.yaml"
	writeAggregateSpecWithDetails(t, root, httpPath, "Orders HTTP", "", "", "v1")
	roles := []AggregateContractRoleRule{
		{Pattern: "**/http/**", Role: "http-api", ContractID: "http", Default: true},
		{Pattern: "**/events/**", Role: "published-events", ContractID: "events"},
	}
	run := func() (*AggregatePressStatistics, *ppmodel.CatalogSite) {
		ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
			OutputDir:        outputDir,
			BuildMode:        AggregateBuildModeFast,
			StateStore:       store,
			StateNamespace:   "contract-fast-lifecycle",
			ServiceOverrides: []AggregatePathOverride{{Pattern: "services/orders/**", Value: "orders"}},
			ContractRoles:    roles,
		})
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
		require.NoError(t, err)
		catalog, err := ap.PressModel()
		require.NoError(t, err)
		return stats, catalog
	}

	initial, _ := run()
	assert.Equal(t, 1, initial.ChangedSpecs)
	writeAggregateAsyncAPISpec(t, root, eventsPath, "Orders Events", "v1")
	added, catalog := run()
	assert.Equal(t, 2, added.ChangedSpecs)
	service := findCatalogService(t, catalog, "orders")
	httpEntry := findCatalogContract(t, service, "http").Versions[0].Entry
	eventsEntry := findCatalogContract(t, service, "events").Versions[0].Entry
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRolePublishedEvents}, "Orders HTTP")
	assertEntryTreeManagedContractHeaders(t, outputDir, service, eventsEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRolePublishedEvents}, "Orders HTTP")

	roles = []AggregateContractRoleRule{
		{Pattern: "**/http/**", Role: "http-api", ContractID: "http"},
		{Pattern: "**/events/**", Role: "consumed-events", ContractID: "events", Default: true},
	}
	roleChanged, catalog := run()
	assert.Equal(t, 2, roleChanged.ChangedSpecs)
	service = findCatalogService(t, catalog, "orders")
	assert.Equal(t, "events", service.DefaultContractID)
	httpEntry = findCatalogContract(t, service, "http").Versions[0].Entry
	eventsEntry = findCatalogContract(t, service, "events").Versions[0].Entry
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleConsumedEvents}, "Orders Events")
	assertEntryTreeManagedContractHeaders(t, outputDir, service, eventsEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleConsumedEvents}, "Orders Events")

	oldEventsDir := filepath.Join(outputDir, filepath.FromSlash(eventsEntry.OutputSubdir))
	writeAggregateAsyncAPISpec(t, root, eventsPath, "Orders Events", "v3")
	versionChanged, catalog := run()
	assert.Equal(t, 2, versionChanged.ChangedSpecs)
	service = findCatalogService(t, catalog, "orders")
	httpEntry = findCatalogContract(t, service, "http").Versions[0].Entry
	eventsEntry = findCatalogContract(t, service, "events").Versions[0].Entry
	assert.Equal(t, "v3", eventsEntry.Version)
	assert.NoDirExists(t, oldEventsDir)
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleConsumedEvents}, "Orders Events")
	assertEntryTreeManagedContractHeaders(t, outputDir, service, eventsEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleConsumedEvents}, "Orders Events")

	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(eventsPath))))
	removed, catalog := run()
	assert.Equal(t, 1, removed.ChangedSpecs)
	service = findCatalogService(t, catalog, "orders")
	httpEntry = findCatalogContract(t, service, "http").Versions[0].Entry
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, false, nil, "Orders HTTP")
	assert.NoDirExists(t, filepath.Join(outputDir, filepath.FromSlash(eventsEntry.OutputSubdir)))
	stable, _ := run()
	assert.Equal(t, 0, stable.ChangedSpecs)
}

func TestAggregateWatchContractNavigationUpdatesEveryGeneratedPageSameInstance(t *testing.T) {
	root := t.TempDir()
	outputDir := filepath.Join(root, "site")
	httpPath := "services/orders/http/v1/openapi.yaml"
	eventsPath := "services/orders/events/asyncapi.yaml"
	writeAggregateSpecWithDetails(t, root, httpPath, "Orders HTTP", "", "", "v1")
	config := &AggregatePrintingPressConfig{
		OutputDir:        outputDir,
		BuildMode:        AggregateBuildModeWatch,
		StateStore:       NewMemorySpecStateStore(),
		StateNamespace:   "contract-watch-lifecycle",
		ServiceOverrides: []AggregatePathOverride{{Pattern: "services/orders/**", Value: "orders"}},
		ContractRoles: []AggregateContractRoleRule{
			{Pattern: "**/http/**", Role: "http-api", ContractID: "http", Default: true},
			{Pattern: "**/events/**", Role: "published-events", ContractID: "events"},
		},
	}
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	run := func() (*AggregatePressStatistics, *ppmodel.CatalogSite) {
		stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
		require.NoError(t, err)
		catalog, err := ap.PressModel()
		require.NoError(t, err)
		return stats, catalog
	}

	initial, _ := run()
	assert.Equal(t, 1, initial.ChangedSpecs)
	writeAggregateAsyncAPISpec(t, root, eventsPath, "Orders Events", "v1")
	added, catalog := run()
	assert.Equal(t, 2, added.ChangedSpecs)
	service := findCatalogService(t, catalog, "orders")
	httpEntry := findCatalogContract(t, service, "http").Versions[0].Entry
	eventsEntry := findCatalogContract(t, service, "events").Versions[0].Entry
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRolePublishedEvents}, "Orders HTTP")
	assertEntryTreeManagedContractHeaders(t, outputDir, service, eventsEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRolePublishedEvents}, "Orders HTTP")

	ap.config.ContractRoles = []AggregateContractRoleRule{
		{Pattern: "**/http/**", Role: "http-api", ContractID: "http"},
		{Pattern: "**/events/**", Role: "external-source", ContractID: "events", Default: true},
	}
	roleChanged, catalog := run()
	assert.Equal(t, 2, roleChanged.ChangedSpecs)
	service = findCatalogService(t, catalog, "orders")
	assert.Equal(t, "events", service.DefaultContractID)
	httpEntry = findCatalogContract(t, service, "http").Versions[0].Entry
	eventsEntry = findCatalogContract(t, service, "events").Versions[0].Entry
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleExternalSource}, "Orders Events")
	assertEntryTreeManagedContractHeaders(t, outputDir, service, eventsEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleExternalSource}, "Orders Events")

	oldEventsDir := filepath.Join(outputDir, filepath.FromSlash(eventsEntry.OutputSubdir))
	writeAggregateAsyncAPISpec(t, root, eventsPath, "Orders Events", "v3")
	versionChanged, catalog := run()
	assert.Equal(t, 2, versionChanged.ChangedSpecs)
	service = findCatalogService(t, catalog, "orders")
	httpEntry = findCatalogContract(t, service, "http").Versions[0].Entry
	eventsEntry = findCatalogContract(t, service, "events").Versions[0].Entry
	assert.Equal(t, "v3", eventsEntry.Version)
	assert.NoDirExists(t, oldEventsDir)
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleExternalSource}, "Orders Events")
	assertEntryTreeManagedContractHeaders(t, outputDir, service, eventsEntry, true,
		[]ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRoleExternalSource}, "Orders Events")

	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(eventsPath))))
	removed, catalog := run()
	assert.Equal(t, 1, removed.ChangedSpecs)
	service = findCatalogService(t, catalog, "orders")
	httpEntry = findCatalogContract(t, service, "http").Versions[0].Entry
	assertEntryTreeManagedContractHeaders(t, outputDir, service, httpEntry, false, nil, "Orders HTTP")
	assert.NoDirExists(t, filepath.Join(outputDir, filepath.FromSlash(eventsEntry.OutputSubdir)))
	before := entryTreeHTMLSnapshot(t, outputDir, httpEntry)
	stable, _ := run()
	assert.Equal(t, 0, stable.ChangedSpecs)
	assert.Equal(t, before, entryTreeHTMLSnapshot(t, outputDir, httpEntry))
}

func TestAggregateNavigationFingerprintInvalidatesVersionRoleAndDefaultChanges(t *testing.T) {
	t.Run("version", func(t *testing.T) {
		root := t.TempDir()
		store := NewMemorySpecStateStore()
		writeAggregateCatalogSpec(t, root, "services/orders/http/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v1", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/events/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v1", "orders")
		config := aggregateNavigationTestConfig(root, store, nil)
		initial, initialCatalog := runAggregateHTMLNavigationTest(t, root, config)
		assert.Equal(t, 2, initial.ChangedSpecs)
		oldEventsDir := ""
		for _, contract := range findCatalogService(t, initialCatalog, "orders").Contracts {
			if contract.SpecKind.IsAsyncAPI() {
				oldEventsDir = contract.Versions[0].Entry.OutputSubdir
			}
		}
		writeAggregateCatalogSpec(t, root, "services/orders/events/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v2", "orders")
		changed, catalog := runAggregateHTMLNavigationTest(t, root, config)
		assert.Equal(t, 2, changed.ChangedSpecs)
		service := findCatalogService(t, catalog, "orders")
		var events *ppmodel.CatalogContract
		for _, contract := range service.Contracts {
			if contract.SpecKind.IsAsyncAPI() {
				events = contract
				break
			}
		}
		require.NotNil(t, events)
		assert.Equal(t, "v2", events.Versions[0].Label)
		assert.NoDirExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(oldEventsDir)))
		unchanged, _ := runAggregateHTMLNavigationTest(t, root, config)
		assert.Equal(t, 0, unchanged.ChangedSpecs)
	})

	t.Run("role and explicit default", func(t *testing.T) {
		root := t.TempDir()
		store := NewMemorySpecStateStore()
		writeAggregateCatalogSpec(t, root, "services/orders/http/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v1", "orders")
		writeAggregateCatalogSpec(t, root, "services/orders/events/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v1", "orders")
		initialRoles := []AggregateContractRoleRule{
			{Pattern: "**/http/**", Role: "http-api", ContractID: "http", Default: true},
			{Pattern: "**/events/**", Role: "events", ContractID: "events"},
		}
		initial := aggregateNavigationTestConfig(root, store, initialRoles)
		initialStats, _ := runAggregateHTMLNavigationTest(t, root, initial)
		assert.Equal(t, 2, initialStats.ChangedSpecs)
		changedRoles := []AggregateContractRoleRule{
			{Pattern: "**/http/**", Role: "http-api", ContractID: "http"},
			{Pattern: "**/events/**", Role: "published-events", ContractID: "events", Default: true},
		}
		changed := aggregateNavigationTestConfig(root, store, changedRoles)
		changedStats, catalog := runAggregateHTMLNavigationTest(t, root, changed)
		assert.Equal(t, 2, changedStats.ChangedSpecs)
		service := findCatalogService(t, catalog, "orders")
		assert.Equal(t, "events", service.DefaultContractID)
		assert.Equal(t, ppmodel.ContractRolePublishedEvents, findCatalogContract(t, service, "events").Role)
		for _, version := range visibleCatalogVersions(service) {
			for _, entry := range visibleCatalogEntries(version) {
				html := readAggregateFile(t, filepath.Join(changed.OutputDir, filepath.FromSlash(entry.OverviewHref)))
				assert.Contains(t, html, `data-pp-service-name="Orders Events"`)
			}
		}
		unchanged, _ := runAggregateHTMLNavigationTest(t, root, changed)
		assert.Equal(t, 0, unchanged.ChangedSpecs)
	})
}

func TestAggregateWatchRelationshipChangesInvalidateBothEndpointServices(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	targetAPath := "services/publisher-a/events/v1/asyncapi.yaml"
	targetBPath := "services/publisher-b/events/v2/asyncapi.yaml"
	sourcePath := "services/consumer/events/v1/asyncapi.yaml"
	writeAggregateRelationshipAsyncRoot(t, root, targetAPath, "Publisher A", "v1", "publisher-a", "")
	writeAggregateRelationshipAsyncRoot(t, root, targetBPath, "Publisher B", "v2", "publisher-b", "")
	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Consumer", "v1", "consumer", "")
	roles := []AggregateContractRoleRule{
		{Pattern: "services/consumer/**", Role: "consumed-events", ContractID: "subscription"},
		{Pattern: "services/publisher-a/**", Role: "published-events", ContractID: "published-a"},
		{Pattern: "services/publisher-b/**", Role: "external-source", ContractID: "published-b"},
	}
	config := aggregateNavigationTestConfig(root, store, roles)
	config.OutputDir = filepath.Join(root, "site")
	config.BuildMode = AggregateBuildModeWatch
	runHTML := func() (*AggregatePressStatistics, *ppmodel.CatalogSite) {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
		require.NoError(t, err)
		catalog, err := ap.PressModel()
		require.NoError(t, err)
		return stats, catalog
	}
	initial, _ := runHTML()
	assert.Equal(t, 3, initial.ChangedSpecs)
	unchanged, _ := runHTML()
	assert.Equal(t, 0, unchanged.ChangedSpecs)

	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Consumer", "v1", "consumer", "../../../publisher-a/events/v1/asyncapi.yaml#/components/messages/Event")
	added, addedCatalog := runHTML()
	assert.Equal(t, 2, added.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, addedCatalog, "consumer", "Consumes from Publisher A", true)
	assertAggregateRelationshipHTML(t, config.OutputDir, addedCatalog, "publisher-a", "Consumed by Consumer", true)
	assertAggregateRelationshipsOnlyOnEntryOverview(t, config.OutputDir, addedCatalog, "consumer")

	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Consumer", "v1", "consumer", "../../../publisher-b/events/v2/asyncapi.yaml#/components/messages/Event")
	retargeted, retargetedCatalog := runHTML()
	assert.Equal(t, 3, retargeted.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, retargetedCatalog, "publisher-a", "Consumed by Consumer", false)
	assertAggregateRelationshipHTML(t, config.OutputDir, retargetedCatalog, "publisher-b", "Consumed by Consumer", true)

	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Consumer", "v1", "consumer", "")
	removed, removedCatalog := runHTML()
	assert.Equal(t, 2, removed.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, removedCatalog, "consumer", "RELATED CONTRACTS", false)
	assertAggregateRelationshipHTML(t, config.OutputDir, removedCatalog, "publisher-b", "Consumed by Consumer", false)

	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Consumer", "v1", "consumer", "../../../publisher-a/events/v1/asyncapi.yaml#/components/messages/Event")
	_, _ = runHTML()
	renamedTargetPath := "services/publisher-a/events/v1/renamed.yaml"
	writeAggregateRelationshipAsyncRoot(t, root, renamedTargetPath, "Publisher A Renamed", "v1", "publisher-a", "")
	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Consumer", "v1", "consumer", "../../../publisher-a/events/v1/renamed.yaml#/components/messages/Event")
	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(targetAPath))))
	renamed, renamedCatalog := runHTML()
	assert.Equal(t, 2, renamed.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, renamedCatalog, "consumer", "Consumes from Publisher A Renamed", true)

	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(renamedTargetPath))))
	targetRemoved, targetRemovedCatalog := runHTML()
	assert.Equal(t, 1, targetRemoved.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, targetRemovedCatalog, "consumer", "RELATED CONTRACTS", false)

	stable, stableCatalog := runHTML()
	assert.Equal(t, 0, stable.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, stableCatalog, "consumer", "RELATED CONTRACTS", false)
}

func TestAggregateFastCompletesSelectedOutputFamiliesIndependently(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/source/http/v1/openapi.yaml"
	writeSource := func(target string) {
		writeAggregateSpecDocument(t, root, sourcePath, `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../../`+target+`/http/v1/openapi.yaml#/info
paths: {}
`)
	}
	writeSource("target-a")
	writeAggregateCatalogSpec(t, root, "services/target-a/http/v1/openapi.yaml", SpecKindOpenAPI, "Target A", "", "v1", "target-a")
	writeAggregateCatalogSpec(t, root, "services/target-b/http/v1/openapi.yaml", SpecKindOpenAPI, "Target B", "", "v1", "target-b")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) (*AggregatePressStatistics, *ppmodel.CatalogSite) {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return stats, ap.catalog
	}

	htmlInitial, htmlCatalog := run(AggregateRenderOptions{HTML: true})
	assert.Equal(t, 3, htmlInitial.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, htmlCatalog, "source", "References Target A", true)
	initialRecords, err := store.Load("navigation")
	require.NoError(t, err)
	initialHTMLHash := initialRecords[sourcePath].HTMLCompletionHash
	assert.NotEmpty(t, initialHTMLHash)
	assert.Empty(t, initialRecords[sourcePath].JSONCompletionHash)
	assert.Empty(t, initialRecords[sourcePath].LLMCompletionHash)

	writeSource("target-b")
	jsonChanged, jsonCatalog := run(AggregateRenderOptions{JSON: true})
	assert.Equal(t, 3, jsonChanged.ChangedSpecs)
	jsonStable, _ := run(AggregateRenderOptions{JSON: true})
	assert.Equal(t, 0, jsonStable.ChangedSpecs)
	jsonRecords, err := store.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, initialHTMLHash, jsonRecords[sourcePath].HTMLCompletionHash)
	assert.NotEmpty(t, jsonRecords[sourcePath].JSONCompletionHash)
	assert.Empty(t, jsonRecords[sourcePath].LLMCompletionHash)
	assertAggregateRelationshipHTML(t, config.OutputDir, jsonCatalog, "source", "References Target A", true)
	sourceEntry := catalogEntryIndex(jsonCatalog)[sourcePath]
	require.NotNil(t, sourceEntry)
	entryOutput := filepath.Join(config.OutputDir, filepath.FromSlash(sourceEntry.OutputSubdir))
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileBundleJSON))

	llmChanged, _ := run(AggregateRenderOptions{LLM: true})
	assert.Equal(t, 3, llmChanged.ChangedSpecs)
	llmStable, _ := run(AggregateRenderOptions{LLM: true})
	assert.Equal(t, 0, llmStable.ChangedSpecs)
	llmRecords, err := store.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, initialHTMLHash, llmRecords[sourcePath].HTMLCompletionHash)
	assert.NotEmpty(t, llmRecords[sourcePath].JSONCompletionHash)
	assert.NotEmpty(t, llmRecords[sourcePath].LLMCompletionHash)
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileLLMIndex))

	htmlChanged, htmlRetargetedCatalog := run(AggregateRenderOptions{HTML: true})
	assert.Equal(t, 3, htmlChanged.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, htmlRetargetedCatalog, "source", "References Target A", false)
	assertAggregateRelationshipHTML(t, config.OutputDir, htmlRetargetedCatalog, "source", "References Target B", true)
	htmlStable, _ := run(AggregateRenderOptions{HTML: true})
	assert.Equal(t, 0, htmlStable.ChangedSpecs)
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileLLMIndex))
}

func TestAggregateFastPreservesPerOutputLocationsAcrossSubsetMoves(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	companionPath := "services/contracts/events/v1/asyncapi.yaml"
	write := func(owner string) {
		writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", owner)
		writeAggregateCatalogSpec(t, root, companionPath, SpecKindAsyncAPI, "Contracts Events", "", "v1", owner)
	}
	write("old-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) (*AggregatePressStatistics, *ppmodel.CatalogSite) {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return stats, ap.catalog
	}

	initial, _ := run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	require.Equal(t, 2, initial.ChangedSpecs)
	initialRecords, err := store.Load("navigation")
	require.NoError(t, err)
	initialRecord := initialRecords[sourcePath]
	require.NotNil(t, initialRecord)
	oldLocation := initialRecord.HTMLOutputSubdir
	require.NotEmpty(t, oldLocation)
	oldServiceSlug, oldVersionSlug, ok := aggregateTopologyKeys(oldLocation)
	require.True(t, ok)
	require.Equal(t, oldLocation, initialRecord.JSONOutputSubdir)
	require.Equal(t, oldLocation, initialRecord.LLMOutputSubdir)
	oldOutput := filepath.Join(config.OutputDir, filepath.FromSlash(oldLocation))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	assert.Contains(t, readAggregateFile(t, filepath.Join(config.OutputDir, pppaths.FileIndexHTML)), oldLocation)
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexHTML(oldServiceSlug, oldVersionSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceIndexJSON(oldServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceVersionsIndexJSON(oldServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexJSON(oldServiceSlug, oldVersionSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(oldServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(oldServiceSlug, oldVersionSlug))))

	write("new-owner")
	jsonChanged, jsonCatalog := run(AggregateRenderOptions{JSON: true})
	require.Equal(t, 2, jsonChanged.ChangedSpecs)
	newLocation := catalogEntryIndex(jsonCatalog)[sourcePath].OutputSubdir
	require.NotEqual(t, oldLocation, newLocation)
	newOutput := filepath.Join(config.OutputDir, filepath.FromSlash(newLocation))
	require.FileExists(t, filepath.Join(newOutput, pppaths.FileBundleJSON))
	require.NoFileExists(t, filepath.Join(newOutput, pppaths.FileIndexHTML))
	require.NoFileExists(t, filepath.Join(newOutput, pppaths.FileLLMIndex))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	require.DirExists(t, oldOutput)
	assert.Contains(t, readAggregateFile(t, filepath.Join(config.OutputDir, pppaths.FileIndexHTML)), oldLocation)
	require.NoFileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceIndexJSON(oldServiceSlug))))
	require.NoFileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceVersionsIndexJSON(oldServiceSlug))))
	require.NoFileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexJSON(oldServiceSlug, oldVersionSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexHTML(oldServiceSlug, oldVersionSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(oldServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(oldServiceSlug, oldVersionSlug))))
	jsonRecords, err := store.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, initialRecord.HTMLCompletionHash, jsonRecords[sourcePath].HTMLCompletionHash)
	assert.Equal(t, initialRecord.LLMCompletionHash, jsonRecords[sourcePath].LLMCompletionHash)
	assert.Equal(t, oldLocation, jsonRecords[sourcePath].HTMLOutputSubdir)
	assert.Equal(t, newLocation, jsonRecords[sourcePath].JSONOutputSubdir)
	assert.Equal(t, oldLocation, jsonRecords[sourcePath].LLMOutputSubdir)

	htmlChanged, _ := run(AggregateRenderOptions{HTML: true})
	require.Equal(t, 2, htmlChanged.ChangedSpecs)
	require.FileExists(t, filepath.Join(newOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(newOutput, pppaths.FileBundleJSON))
	require.NoFileExists(t, filepath.Join(newOutput, pppaths.FileLLMIndex))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	require.DirExists(t, oldOutput)
	newServiceSlug, newVersionSlug, ok := aggregateTopologyKeys(newLocation)
	require.True(t, ok)
	htmlIndex := readAggregateFile(t, filepath.Join(config.OutputDir, pppaths.FileIndexHTML))
	assert.Contains(t, htmlIndex, newLocation)
	assert.NotContains(t, htmlIndex, oldLocation)
	require.NoFileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexHTML(oldServiceSlug, oldVersionSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexHTML(newServiceSlug, newVersionSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(oldServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(oldServiceSlug, oldVersionSlug))))
	htmlRecords, err := store.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, newLocation, htmlRecords[sourcePath].HTMLOutputSubdir)
	assert.Equal(t, newLocation, htmlRecords[sourcePath].JSONOutputSubdir)
	assert.Equal(t, oldLocation, htmlRecords[sourcePath].LLMOutputSubdir)

	llmChanged, _ := run(AggregateRenderOptions{LLM: true})
	require.Equal(t, 2, llmChanged.ChangedSpecs)
	require.FileExists(t, filepath.Join(newOutput, pppaths.FileLLMIndex))
	require.NoDirExists(t, oldOutput)
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(newServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(newServiceSlug, newVersionSlug))))
	require.NoFileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(oldServiceSlug))))
	require.NoFileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(oldServiceSlug, oldVersionSlug))))
	require.NoDirExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceDir(oldServiceSlug))))
	finalRecords, err := store.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, newLocation, finalRecords[sourcePath].HTMLOutputSubdir)
	assert.Equal(t, newLocation, finalRecords[sourcePath].JSONOutputSubdir)
	assert.Equal(t, newLocation, finalRecords[sourcePath].LLMOutputSubdir)

	htmlStable, _ := run(AggregateRenderOptions{HTML: true})
	jsonStable, _ := run(AggregateRenderOptions{JSON: true})
	llmStable, _ := run(AggregateRenderOptions{LLM: true})
	assert.Equal(t, 0, htmlStable.ChangedSpecs)
	assert.Equal(t, 0, jsonStable.ChangedSpecs)
	assert.Equal(t, 0, llmStable.ChangedSpecs)
}

func TestAggregateFastRemovesOnlyUnreferencedIntermediateOutputLocations(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	write := func(owner string) {
		writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", owner)
	}
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) *ppmodel.CatalogSite {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return ap.catalog
	}

	write("alpha")
	initialCatalog := run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	oldestLocation := catalogEntryIndex(initialCatalog)[sourcePath].OutputSubdir
	oldestOutput := filepath.Join(config.OutputDir, filepath.FromSlash(oldestLocation))

	write("beta")
	intermediateCatalog := run(AggregateRenderOptions{JSON: true})
	intermediateLocation := catalogEntryIndex(intermediateCatalog)[sourcePath].OutputSubdir
	intermediateOutput := filepath.Join(config.OutputDir, filepath.FromSlash(intermediateLocation))
	require.DirExists(t, oldestOutput)
	require.DirExists(t, intermediateOutput)

	write("gamma")
	currentCatalog := run(AggregateRenderOptions{JSON: true})
	currentLocation := catalogEntryIndex(currentCatalog)[sourcePath].OutputSubdir
	currentOutput := filepath.Join(config.OutputDir, filepath.FromSlash(currentLocation))
	require.FileExists(t, filepath.Join(currentOutput, pppaths.FileBundleJSON))
	require.NoDirExists(t, intermediateOutput)
	require.DirExists(t, oldestOutput)

	run(AggregateRenderOptions{HTML: true})
	require.FileExists(t, filepath.Join(currentOutput, pppaths.FileIndexHTML))
	require.DirExists(t, oldestOutput)
	run(AggregateRenderOptions{LLM: true})
	require.FileExists(t, filepath.Join(currentOutput, pppaths.FileLLMIndex))
	require.NoDirExists(t, oldestOutput)
}

func TestAggregateFastRetainsSelectedFamilyTopologyUntilLastEntryMoves(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	firstPath := "services/contracts/http/v1/first.yaml"
	secondPath := "services/contracts/http/v1/second.yaml"
	write := func(relPath, title, owner string) {
		writeAggregateCatalogSpec(t, root, relPath, SpecKindOpenAPI, title, "", "v1", owner)
	}
	write(firstPath, "First API", "old-owner")
	write(secondPath, "Second API", "old-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	runJSON := func() *ppmodel.CatalogSite {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
		require.NoError(t, err)
		return ap.catalog
	}

	initialCatalog := runJSON()
	oldLocation := catalogEntryIndex(initialCatalog)[firstPath].OutputSubdir
	oldServiceSlug, oldVersionSlug, ok := aggregateTopologyKeys(oldLocation)
	require.True(t, ok)
	oldServiceJSON := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceIndexJSON(oldServiceSlug)))
	oldVersionJSON := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexJSON(oldServiceSlug, oldVersionSlug)))
	require.FileExists(t, oldServiceJSON)
	require.FileExists(t, oldVersionJSON)

	write(firstPath, "First API", "new-owner")
	partiallyMoved := runJSON()
	newLocation := catalogEntryIndex(partiallyMoved)[firstPath].OutputSubdir
	newServiceSlug, newVersionSlug, ok := aggregateTopologyKeys(newLocation)
	require.True(t, ok)
	require.FileExists(t, oldServiceJSON)
	require.FileExists(t, oldVersionJSON)
	oldVersionBody := readAggregateFile(t, oldVersionJSON)
	assert.Contains(t, oldVersionBody, "Second API")
	assert.NotContains(t, oldVersionBody, "First API")
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceIndexJSON(newServiceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexJSON(newServiceSlug, newVersionSlug))))

	write(secondPath, "Second API", "new-owner")
	runJSON()
	require.NoFileExists(t, oldServiceJSON)
	require.NoFileExists(t, oldVersionJSON)
	require.NoDirExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceDir(oldServiceSlug))))
}

func TestAggregateOutputCleanupDeduplicatesLeavesAndPreservesSharedRoots(t *testing.T) {
	root := t.TempDir()
	outputDir := filepath.Join(root, "site")
	leaf := "services/orders/versions/v1/specs/orders-api"
	leafDir := filepath.Join(outputDir, filepath.FromSlash(leaf))
	require.NoError(t, os.MkdirAll(leafDir, 0o755))
	sharedSentinel := filepath.Join(outputDir, pppaths.DirServices, "shared.txt")
	require.NoError(t, os.WriteFile(sharedSentinel, []byte("keep"), 0o644))
	outsideSentinel := filepath.Join(root, "outside.txt")
	require.NoError(t, os.WriteFile(outsideSentinel, []byte("keep"), 0o644))
	ap := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{OutputDir: outputDir}}
	plan := &aggregateBuildPlan{removed: []*SpecStateRecord{{
		HTMLOutputSubdir: "services",
		JSONOutputSubdir: leaf,
		LLMOutputSubdir:  leaf,
	}}}

	require.NoError(t, ap.pruneObsoleteOutputs(plan, aggregateOutputSelection{json: true, llm: true}))
	require.NoDirExists(t, leafDir)
	require.FileExists(t, sharedSentinel)
	require.NoError(t, ap.removeAggregateEntryOutputSubdir("services"))
	require.FileExists(t, sharedSentinel)
	assert.Empty(t, aggregateTopologyFromState(map[string]*SpecStateRecord{
		"unsafe.yaml": {HTMLOutputSubdir: "services/../versions/v1/specs/unsafe"},
	}, "html"))
	require.NoError(t, ap.removeAggregateFile("../outside.txt"))
	require.FileExists(t, outsideSentinel)
}

func TestAggregateCleanupTombstoneOwnershipIsFamilyAware(t *testing.T) {
	root := t.TempDir()
	outputDir := filepath.Join(root, "site")
	location := "services/contracts/versions/v1/specs/contracts-api"
	entryOutput := filepath.Join(outputDir, filepath.FromSlash(location))
	require.NoError(t, os.MkdirAll(entryOutput, 0o755))
	htmlPath := filepath.Join(entryOutput, pppaths.FileIndexHTML)
	jsonPath := filepath.Join(entryOutput, pppaths.FileBundleJSON)
	require.NoError(t, os.WriteFile(htmlPath, []byte("active html"), 0o644))
	require.NoError(t, os.WriteFile(jsonPath, []byte("old json"), 0o644))
	active := &aggregateDiscoveredSpec{
		RelativePath: "services/contracts/current.yaml",
		ServiceKey:   "contracts",
		ContractID:   "contracts-api",
		OutputSubdir: location,
	}
	plan := &aggregateBuildPlan{
		discovered: []*aggregateDiscoveredSpec{active},
		removed: []*SpecStateRecord{{
			RelativePath:     "services/contracts/removed.yaml",
			JSONOutputSubdir: location,
		}},
	}
	ownership := aggregateActiveOutputOwnership{byFamily: make(map[string]map[string][]aggregateActiveOutputOwner)}
	ownership.add(aggregateOutputFamilyHTML, active)
	htmlOwners := ownership.owners(aggregateOutputFamilyHTML, location)
	require.Len(t, htmlOwners, 1)
	assert.Equal(t, active.RelativePath, htmlOwners[0].RelativePath)
	assert.Equal(t, active.ServiceKey, htmlOwners[0].ServiceKey)
	assert.Equal(t, active.ContractID, htmlOwners[0].ContractID)
	assert.Equal(t, location, htmlOwners[0].OutputSubdir)
	assert.Empty(t, ownership.owners(aggregateOutputFamilyJSON, location))
	ap := &AggregatePrintingPress{config: &AggregatePrintingPressConfig{OutputDir: outputDir}}

	require.NoError(t, ap.reconcileCleanupTombstoneEntryArtifactsWithOwnership(
		plan,
		aggregateOutputSelection{json: true},
		ownership,
	))
	require.FileExists(t, htmlPath)
	require.NoFileExists(t, jsonPath)
}

func TestAggregateFastCleanupTombstoneAdvancesOneOutputFamilyAtATime(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", "old-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) *AggregatePressStatistics {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return stats
	}

	run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	records, err := store.Load("navigation")
	require.NoError(t, err)
	initial := records[sourcePath]
	require.NotNil(t, initial)
	oldLocation := initial.HTMLOutputSubdir
	oldOutput := filepath.Join(config.OutputDir, filepath.FromSlash(oldLocation))
	serviceSlug, versionSlug, ok := aggregateTopologyKeys(oldLocation)
	require.True(t, ok)
	oldJSONService := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceIndexJSON(serviceSlug)))
	oldJSONVersion := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexJSON(serviceSlug, versionSlug)))
	oldLLMService := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(serviceSlug)))
	oldLLMVersion := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(serviceSlug, versionSlug)))
	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(sourcePath))))

	jsonCleanup := run(AggregateRenderOptions{JSON: true})
	assert.Equal(t, 0, jsonCleanup.ChangedSpecs)
	require.NoFileExists(t, filepath.Join(oldOutput, pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	require.NoFileExists(t, oldJSONService)
	require.NoFileExists(t, oldJSONVersion)
	require.FileExists(t, oldLLMService)
	require.FileExists(t, oldLLMVersion)
	assert.Contains(t, readAggregateFile(t, filepath.Join(config.OutputDir, pppaths.FileIndexHTML)), oldLocation)
	records, err = store.Load("navigation")
	require.NoError(t, err)
	jsonTombstone := records[sourcePath]
	require.NotNil(t, jsonTombstone)
	assert.Empty(t, jsonTombstone.JSONCompletionHash)
	assert.Empty(t, jsonTombstone.JSONOutputSubdir)
	assert.NotEmpty(t, jsonTombstone.HTMLCompletionHash)
	assert.Equal(t, oldLocation, jsonTombstone.HTMLOutputSubdir)
	assert.NotEmpty(t, jsonTombstone.LLMCompletionHash)
	assert.Equal(t, oldLocation, jsonTombstone.LLMOutputSubdir)

	htmlCleanup := run(AggregateRenderOptions{HTML: true})
	assert.Equal(t, 0, htmlCleanup.ChangedSpecs)
	require.NoFileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	require.FileExists(t, oldLLMService)
	require.FileExists(t, oldLLMVersion)
	assert.NotContains(t, readAggregateFile(t, filepath.Join(config.OutputDir, pppaths.FileIndexHTML)), oldLocation)
	records, err = store.Load("navigation")
	require.NoError(t, err)
	htmlTombstone := records[sourcePath]
	require.NotNil(t, htmlTombstone)
	assert.Empty(t, htmlTombstone.HTMLCompletionHash)
	assert.Empty(t, htmlTombstone.HTMLOutputSubdir)
	assert.Equal(t, oldLocation, htmlTombstone.LLMOutputSubdir)

	llmCleanup := run(AggregateRenderOptions{LLM: true})
	assert.Equal(t, 0, llmCleanup.ChangedSpecs)
	require.NoDirExists(t, oldOutput)
	require.NoFileExists(t, oldLLMService)
	require.NoFileExists(t, oldLLMVersion)
	require.NoDirExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceDir(serviceSlug))))
	records, err = store.Load("navigation")
	require.NoError(t, err)
	assert.NotContains(t, records, sourcePath)

	assert.Equal(t, 0, run(AggregateRenderOptions{JSON: true}).ChangedSpecs)
	assert.Equal(t, 0, run(AggregateRenderOptions{HTML: true}).ChangedSpecs)
	assert.Equal(t, 0, run(AggregateRenderOptions{LLM: true}).ChangedSpecs)
}

func TestAggregateFastRenderSkippedRootUsesCleanupTombstone(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", "old-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
	}
	run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	records, err := store.Load("navigation")
	require.NoError(t, err)
	oldLocation := records[sourcePath].HTMLOutputSubdir
	oldOutput := filepath.Join(config.OutputDir, filepath.FromSlash(oldLocation))
	serviceSlug, versionSlug, ok := aggregateTopologyKeys(oldLocation)
	require.True(t, ok)
	oldLLMService := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(serviceSlug)))
	oldLLMVersion := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(serviceSlug, versionSlug)))
	writeSwaggerTwoSpec(t, root, sourcePath, "Unsupported Contracts", "v2")

	run(AggregateRenderOptions{JSON: true})
	require.NoFileExists(t, filepath.Join(oldOutput, pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	records, err = store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, records, sourcePath)
	assert.Empty(t, records[sourcePath].JSONOutputSubdir)
	assert.Equal(t, oldLocation, records[sourcePath].HTMLOutputSubdir)
	assert.Equal(t, oldLocation, records[sourcePath].LLMOutputSubdir)

	run(AggregateRenderOptions{HTML: true})
	require.NoFileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	records, err = store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, records, sourcePath)
	assert.Empty(t, records[sourcePath].HTMLOutputSubdir)
	assert.Equal(t, oldLocation, records[sourcePath].LLMOutputSubdir)

	run(AggregateRenderOptions{LLM: true})
	require.NoDirExists(t, oldOutput)
	require.NoFileExists(t, oldLLMService)
	require.NoFileExists(t, oldLLMVersion)
	records, err = store.Load("navigation")
	require.NoError(t, err)
	assert.NotContains(t, records, sourcePath)
}

func TestAggregateFastCleanupTombstoneRetainsSharedFamilyTopology(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	removedPath := "services/contracts/http/v1/removed.yaml"
	survivingPath := "services/contracts/http/v1/surviving.yaml"
	writeAggregateCatalogSpec(t, root, removedPath, SpecKindOpenAPI, "Removed API", "", "v1", "shared-owner")
	writeAggregateCatalogSpec(t, root, survivingPath, SpecKindOpenAPI, "Surviving API", "", "v1", "shared-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) *ppmodel.CatalogSite {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return ap.catalog
	}
	initialCatalog := run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	removedLocation := catalogEntryIndex(initialCatalog)[removedPath].OutputSubdir
	removedOutput := filepath.Join(config.OutputDir, filepath.FromSlash(removedLocation))
	serviceSlug, versionSlug, ok := aggregateTopologyKeys(removedLocation)
	require.True(t, ok)
	serviceJSON := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceIndexJSON(serviceSlug)))
	versionJSON := filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionIndexJSON(serviceSlug, versionSlug)))
	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(removedPath))))

	run(AggregateRenderOptions{JSON: true})
	require.NoFileExists(t, filepath.Join(removedOutput, pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(removedOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(removedOutput, pppaths.FileLLMIndex))
	require.FileExists(t, serviceJSON)
	require.FileExists(t, versionJSON)
	versionBody := readAggregateFile(t, versionJSON)
	assert.Contains(t, versionBody, "Surviving API")
	assert.NotContains(t, versionBody, "Removed API")
	records, err := store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, records, removedPath)
	assert.Empty(t, records[removedPath].JSONOutputSubdir)
	assert.NotEmpty(t, records[removedPath].HTMLOutputSubdir)
	assert.NotEmpty(t, records[removedPath].LLMOutputSubdir)
	require.Contains(t, records, survivingPath)
}

func TestAggregateFastReappearingCleanupTombstoneReusesUnselectedState(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	write := func(owner string) {
		writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", owner)
	}
	write("old-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) *ppmodel.CatalogSite {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return ap.catalog
	}
	initialCatalog := run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	oldLocation := catalogEntryIndex(initialCatalog)[sourcePath].OutputSubdir
	oldOutput := filepath.Join(config.OutputDir, filepath.FromSlash(oldLocation))
	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(sourcePath))))
	run(AggregateRenderOptions{JSON: true})

	write("new-owner")
	reappearedCatalog := run(AggregateRenderOptions{JSON: true})
	newLocation := catalogEntryIndex(reappearedCatalog)[sourcePath].OutputSubdir
	require.NotEqual(t, oldLocation, newLocation)
	newOutput := filepath.Join(config.OutputDir, filepath.FromSlash(newLocation))
	require.FileExists(t, filepath.Join(newOutput, pppaths.FileBundleJSON))
	require.NoFileExists(t, filepath.Join(newOutput, pppaths.FileIndexHTML))
	require.NoFileExists(t, filepath.Join(newOutput, pppaths.FileLLMIndex))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	records, err := store.Load("navigation")
	require.NoError(t, err)
	reappeared := records[sourcePath]
	require.NotNil(t, reappeared)
	assert.Equal(t, oldLocation, reappeared.HTMLOutputSubdir)
	assert.Equal(t, newLocation, reappeared.JSONOutputSubdir)
	assert.Equal(t, oldLocation, reappeared.LLMOutputSubdir)
	assert.NotEmpty(t, reappeared.HTMLCompletionHash)
	assert.NotEmpty(t, reappeared.JSONCompletionHash)
	assert.NotEmpty(t, reappeared.LLMCompletionHash)
}

func TestAggregateFastRenamedSourceProtectsActiveSameLeafOwnership(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	oldPath := "services/contracts/http/v1/old.yaml"
	newPath := "services/contracts/http/v1/new.yaml"
	writeAggregateCatalogSpec(t, root, oldPath, SpecKindOpenAPI, "Contracts API", "", "v1", "shared-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) (*AggregatePressStatistics, *ppmodel.CatalogSite) {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		stats, err := ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
		return stats, ap.catalog
	}
	_, initialCatalog := run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	location := catalogEntryIndex(initialCatalog)[oldPath].OutputSubdir
	entryOutput := filepath.Join(config.OutputDir, filepath.FromSlash(location))
	serviceSlug, versionSlug, ok := aggregateTopologyKeys(location)
	require.True(t, ok)
	require.NoError(t, os.Rename(
		filepath.Join(root, filepath.FromSlash(oldPath)),
		filepath.Join(root, filepath.FromSlash(newPath)),
	))

	htmlChanged, htmlCatalog := run(AggregateRenderOptions{HTML: true})
	assert.Equal(t, 1, htmlChanged.ChangedSpecs)
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileIndexHTML))
	assert.Contains(t, readAggregateFile(t, filepath.Join(config.OutputDir, pppaths.FileIndexHTML)), location)
	records, err := store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, records, oldPath)
	require.Contains(t, records, newPath)
	assert.Empty(t, records[oldPath].HTMLCompletionHash)
	assert.Empty(t, records[oldPath].HTMLOutputSubdir)
	assert.NotEmpty(t, records[oldPath].JSONCompletionHash)
	assert.Equal(t, location, records[oldPath].JSONOutputSubdir)
	assert.NotEmpty(t, records[oldPath].LLMCompletionHash)
	assert.Equal(t, location, records[oldPath].LLMOutputSubdir)
	assert.NotEmpty(t, records[newPath].HTMLCompletionHash)
	assert.Equal(t, location, records[newPath].HTMLOutputSubdir)
	assert.Equal(t, location, catalogEntryIndex(htmlCatalog)[newPath].OutputSubdir)
	htmlStable, _ := run(AggregateRenderOptions{HTML: true})
	assert.Equal(t, 0, htmlStable.ChangedSpecs)

	jsonChanged, _ := run(AggregateRenderOptions{JSON: true})
	assert.Equal(t, 1, jsonChanged.ChangedSpecs)
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileBundleJSON))
	records, err = store.Load("navigation")
	require.NoError(t, err)
	assert.Empty(t, records[oldPath].JSONCompletionHash)
	assert.Empty(t, records[oldPath].JSONOutputSubdir)
	assert.NotEmpty(t, records[newPath].JSONCompletionHash)
	assert.Equal(t, location, records[newPath].JSONOutputSubdir)
	jsonStable, _ := run(AggregateRenderOptions{JSON: true})
	assert.Equal(t, 0, jsonStable.ChangedSpecs)

	llmChanged, _ := run(AggregateRenderOptions{LLM: true})
	assert.Equal(t, 1, llmChanged.ChangedSpecs)
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileLLMIndex))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateServiceLLM(serviceSlug))))
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(pppaths.AggregateVersionLLM(serviceSlug, versionSlug))))
	records, err = store.Load("navigation")
	require.NoError(t, err)
	assert.NotContains(t, records, oldPath)
	require.Contains(t, records, newPath)
	assert.Equal(t, location, records[newPath].HTMLOutputSubdir)
	assert.Equal(t, location, records[newPath].JSONOutputSubdir)
	assert.Equal(t, location, records[newPath].LLMOutputSubdir)
	llmStable, _ := run(AggregateRenderOptions{LLM: true})
	assert.Equal(t, 0, llmStable.ChangedSpecs)
}

func TestAggregateFastRenamedSourceRenderFailureDoesNotAdvanceTombstone(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	oldPath := "services/contracts/http/v1/old.yaml"
	newPath := "services/contracts/http/v1/new.yaml"
	writeAggregateCatalogSpec(t, root, oldPath, SpecKindOpenAPI, "Contracts API", "", "v1", "shared-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) error {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		return err
	}
	require.NoError(t, run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true}))
	initialRecords, err := store.Load("navigation")
	require.NoError(t, err)
	initial := initialRecords[oldPath]
	require.NotNil(t, initial)
	entryOutput := filepath.Join(config.OutputDir, filepath.FromSlash(initial.OutputSubdir))
	require.NoError(t, os.Rename(
		filepath.Join(root, filepath.FromSlash(oldPath)),
		filepath.Join(root, filepath.FromSlash(newPath)),
	))
	blockedBundle := filepath.Join(entryOutput, pppaths.FileBundleJSON)
	require.NoError(t, os.Remove(blockedBundle))
	require.NoError(t, os.Mkdir(blockedBundle, 0o755))
	blockedSentinel := filepath.Join(blockedBundle, "blocked")
	require.NoError(t, os.WriteFile(blockedSentinel, []byte("blocked"), 0o644))

	err = run(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(entryOutput, pppaths.FileLLMIndex))
	failedRecords, err := store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, failedRecords, oldPath)
	require.Contains(t, failedRecords, newPath)
	assert.Equal(t, initial.JSONCompletionHash, failedRecords[oldPath].JSONCompletionHash)
	assert.Equal(t, initial.JSONOutputSubdir, failedRecords[oldPath].JSONOutputSubdir)
	assert.Empty(t, failedRecords[newPath].JSONCompletionHash)
	assert.Empty(t, failedRecords[newPath].JSONOutputSubdir)

	require.NoError(t, os.Remove(blockedSentinel))
	require.NoError(t, os.Remove(blockedBundle))
	require.NoError(t, run(AggregateRenderOptions{JSON: true}))
	require.FileExists(t, blockedBundle)
	retriedRecords, err := store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, retriedRecords, oldPath)
	require.Contains(t, retriedRecords, newPath)
	assert.Empty(t, retriedRecords[oldPath].JSONCompletionHash)
	assert.Empty(t, retriedRecords[oldPath].JSONOutputSubdir)
	assert.NotEmpty(t, retriedRecords[newPath].JSONCompletionHash)
	assert.Equal(t, initial.JSONOutputSubdir, retriedRecords[newPath].JSONOutputSubdir)
}

func TestAggregateFastCleanupTombstoneHandlesFamiliesAtDifferentLocations(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	write := func(owner string) {
		writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", owner)
	}
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		require.NoError(t, err)
	}
	write("alpha")
	run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	write("beta")
	run(AggregateRenderOptions{JSON: true})
	write("gamma")
	run(AggregateRenderOptions{HTML: true})
	records, err := store.Load("navigation")
	require.NoError(t, err)
	beforeRemoval := records[sourcePath]
	require.NotNil(t, beforeRemoval)
	require.NotEqual(t, beforeRemoval.HTMLOutputSubdir, beforeRemoval.JSONOutputSubdir)
	require.NotEqual(t, beforeRemoval.JSONOutputSubdir, beforeRemoval.LLMOutputSubdir)
	htmlOutput := filepath.Join(config.OutputDir, filepath.FromSlash(beforeRemoval.HTMLOutputSubdir))
	jsonOutput := filepath.Join(config.OutputDir, filepath.FromSlash(beforeRemoval.JSONOutputSubdir))
	llmOutput := filepath.Join(config.OutputDir, filepath.FromSlash(beforeRemoval.LLMOutputSubdir))
	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(sourcePath))))

	run(AggregateRenderOptions{JSON: true})
	require.NoDirExists(t, jsonOutput)
	require.FileExists(t, filepath.Join(htmlOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(llmOutput, pppaths.FileLLMIndex))
	records, err = store.Load("navigation")
	require.NoError(t, err)
	assert.Empty(t, records[sourcePath].JSONOutputSubdir)
	assert.Equal(t, beforeRemoval.HTMLOutputSubdir, records[sourcePath].HTMLOutputSubdir)
	assert.Equal(t, beforeRemoval.LLMOutputSubdir, records[sourcePath].LLMOutputSubdir)

	run(AggregateRenderOptions{HTML: true})
	require.NoDirExists(t, htmlOutput)
	require.FileExists(t, filepath.Join(llmOutput, pppaths.FileLLMIndex))
	run(AggregateRenderOptions{LLM: true})
	require.NoDirExists(t, llmOutput)
	records, err = store.Load("navigation")
	require.NoError(t, err)
	assert.NotContains(t, records, sourcePath)
}

type failNextUpsertSpecStateStore struct {
	SpecStateStore
	failNext bool
}

func (s *failNextUpsertSpecStateStore) Upsert(namespace string, records []*SpecStateRecord) error {
	if s.failNext {
		s.failNext = false
		return fmt.Errorf("forced state upsert failure")
	}
	return s.SpecStateStore.Upsert(namespace, records)
}

func TestAggregateFastCleanupTombstoneRetriesAfterStatePersistenceFailure(t *testing.T) {
	root := t.TempDir()
	baseStore := NewMemorySpecStateStore()
	store := &failNextUpsertSpecStateStore{SpecStateStore: baseStore}
	sourcePath := "services/contracts/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Contracts API", "", "v1", "old-owner")
	config := aggregateNavigationTestConfig(root, store, nil)
	run := func(options AggregateRenderOptions) error {
		ap, err := CreateAggregatePrintingPressFromPath(root, config)
		require.NoError(t, err)
		_, err = ap.PrintSelectedOutputs(options)
		return err
	}
	require.NoError(t, run(AggregateRenderOptions{HTML: true, JSON: true, LLM: true}))
	initialRecords, err := baseStore.Load("navigation")
	require.NoError(t, err)
	initial := initialRecords[sourcePath]
	require.NotNil(t, initial)
	oldOutput := filepath.Join(config.OutputDir, filepath.FromSlash(initial.JSONOutputSubdir))
	require.NoError(t, os.Remove(filepath.Join(root, filepath.FromSlash(sourcePath))))
	store.failNext = true

	err = run(AggregateRenderOptions{JSON: true})
	require.ErrorContains(t, err, "forced state upsert failure")
	require.NoFileExists(t, filepath.Join(oldOutput, pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(oldOutput, pppaths.FileLLMIndex))
	failedRecords, err := baseStore.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, initial.JSONCompletionHash, failedRecords[sourcePath].JSONCompletionHash)
	assert.Equal(t, initial.JSONOutputSubdir, failedRecords[sourcePath].JSONOutputSubdir)

	require.NoError(t, run(AggregateRenderOptions{JSON: true}))
	retriedRecords, err := baseStore.Load("navigation")
	require.NoError(t, err)
	retried := retriedRecords[sourcePath]
	require.NotNil(t, retried)
	assert.Empty(t, retried.JSONCompletionHash)
	assert.Empty(t, retried.JSONOutputSubdir)
	assert.Equal(t, initial.HTMLOutputSubdir, retried.HTMLOutputSubdir)
	assert.Equal(t, initial.LLMOutputSubdir, retried.LLMOutputSubdir)
}

func TestAggregateFastRelationshipRenderSkipReconcilesVisibleRoots(t *testing.T) {
	t.Run("target skipped", func(t *testing.T) {
		root := t.TempDir()
		store := NewMemorySpecStateStore()
		sourcePath := "services/a-source/http/v1/openapi.yaml"
		targetPath := "services/z-target/http/v1/swagger.yaml"
		writeAggregateSpecDocument(t, root, sourcePath, `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../../z-target/http/v1/swagger.yaml#/info
paths: {}
`)
		writeAggregateSpecDocument(t, root, targetPath, `
swagger: "1.2"
info:
  title: Skipped Target
  version: v1
  x-owner: target
paths: {}
`)
		config := aggregateNavigationTestConfig(root, store, nil)
		first, catalog := runAggregateHTMLNavigationTest(t, root, config)
		assert.Equal(t, 1, first.ChangedSpecs)
		assertAggregateRelationshipHTML(t, config.OutputDir, catalog, "source", "RELATED CONTRACTS", false)
		target := findCatalogService(t, catalog, "target")
		assert.False(t, hasVisibleCatalogVersions(target))
		records, err := store.Load("navigation")
		require.NoError(t, err)
		assert.Contains(t, records, sourcePath)
		assert.NotContains(t, records, targetPath)
		assert.NoDirExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(catalogEntryForService(t, target).OutputSubdir)))

		second, secondCatalog := runAggregateHTMLNavigationTest(t, root, config)
		assert.Equal(t, 0, second.ChangedSpecs, "the skipped target is retried during preflight without becoming a rendered change")
		assertAggregateRelationshipHTML(t, config.OutputDir, secondCatalog, "source", "RELATED CONTRACTS", false)
	})

	t.Run("source skipped removes inverse", func(t *testing.T) {
		root := t.TempDir()
		store := NewMemorySpecStateStore()
		writeAggregateSpecDocument(t, root, "services/a-source/http/v1/swagger.yaml", `
swagger: "1.2"
info:
  title: Skipped Source
  version: v1
  x-owner: source
x-related:
  $ref: ../../../z-target/http/v1/openapi.yaml#/info
paths: {}
`)
		writeAggregateCatalogSpec(t, root, "services/z-target/http/v1/openapi.yaml", SpecKindOpenAPI, "Target API", "", "v1", "target")
		config := aggregateNavigationTestConfig(root, store, nil)
		_, catalog := runAggregateHTMLNavigationTest(t, root, config)
		assertAggregateRelationshipHTML(t, config.OutputDir, catalog, "target", "Referenced by Skipped Source", false)
	})
}

func TestAggregateFastJSONOutputFailurePreservesHTMLAndCompletionState(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/source/http/v1/openapi.yaml"
	targetBPath := "services/target-b/http/v1/openapi.yaml"
	writeSource := func(target string) {
		writeAggregateSpecDocument(t, root, sourcePath, `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../../`+target+`/http/v1/openapi.yaml#/info
paths: {}
`)
	}
	writeSource("target-a")
	writeAggregateCatalogSpec(t, root, "services/target-a/http/v1/openapi.yaml", SpecKindOpenAPI, "Target A", "", "v1", "target-a")
	writeAggregateCatalogSpec(t, root, targetBPath, SpecKindOpenAPI, "Target B", "", "v1", "target-b")
	config := aggregateNavigationTestConfig(root, store, nil)
	_, baselineCatalog := runAggregateHTMLNavigationTest(t, root, config)
	sourceEntry := catalogEntryIndex(baselineCatalog)[sourcePath]
	require.NotNil(t, sourceEntry)
	entryOutput := filepath.Join(config.OutputDir, filepath.FromSlash(sourceEntry.OutputSubdir))
	htmlPath := filepath.Join(entryOutput, pppaths.FileIndexHTML)
	baselineHTML := readAggregateFile(t, htmlPath)
	baselineRecords, err := store.Load("navigation")
	require.NoError(t, err)
	require.NotEmpty(t, baselineRecords[sourcePath].HTMLCompletionHash)
	assert.Empty(t, baselineRecords[sourcePath].JSONCompletionHash)

	writeSource("target-b")
	blockedBundle := filepath.Join(entryOutput, pppaths.FileBundleJSON)
	require.NoError(t, os.MkdirAll(blockedBundle, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedBundle, "blocked"), []byte("blocked"), 0o644))
	failed, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	failedStats, err := failed.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.True(t, slices.ContainsFunc(failedStats.Warnings, func(warning *ppmodel.BuildWarning) bool {
		return warning != nil && warning.Context == sourcePath
	}))
	assert.Equal(t, baselineHTML, readAggregateFile(t, htmlPath))
	assert.DirExists(t, blockedBundle)
	failedRecords, err := store.Load("navigation")
	require.NoError(t, err)
	assert.Equal(t, baselineRecords[sourcePath].HTMLCompletionHash, failedRecords[sourcePath].HTMLCompletionHash)
	assert.Empty(t, failedRecords[sourcePath].JSONCompletionHash)
	assert.True(t, catalogEntryIndex(failed.catalog)[sourcePath].RenderSkipped)
	targetBEntry := catalogEntryIndex(failed.catalog)[targetBPath]
	require.NotNil(t, targetBEntry)
	targetBBundle := readAggregateFile(t, filepath.Join(config.OutputDir, filepath.FromSlash(targetBEntry.OutputSubdir), pppaths.FileBundleJSON))
	assert.NotContains(t, targetBBundle, "Referenced by Source API", "a first-pass success must be rerendered after its source is skipped")

	require.NoError(t, os.RemoveAll(blockedBundle))
	retry, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	retryStats, err := retry.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 2, retryStats.ChangedSpecs)
	htmlRetry, htmlRetryCatalog := runAggregateHTMLNavigationTest(t, root, config)
	assert.Equal(t, 3, htmlRetry.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, htmlRetryCatalog, "source", "References Target B", true)
}

func TestAggregateFastSecondAttemptFailureDoesNotPromoteIntermediateOutput(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/a-source/http/v1/openapi.yaml"
	targetBPath := "services/z-target-b/http/v1/openapi.yaml"
	writeSource := func(target string) {
		writeAggregateSpecDocument(t, root, sourcePath, `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../../`+target+`/http/v1/openapi.yaml#/info
paths: {}
`)
	}
	writeSource("target-a")
	writeAggregateCatalogSpec(t, root, "services/target-a/http/v1/openapi.yaml", SpecKindOpenAPI, "Target A", "", "v1", "target-a")
	writeAggregateCatalogSpec(t, root, targetBPath, SpecKindOpenAPI, "Target B", "", "v1", "target-b")
	config := aggregateNavigationTestConfig(root, store, nil)
	config.MaxPools = 1
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	baselineEntries := catalogEntryIndex(baseline.catalog)
	sourceEntry := baselineEntries[sourcePath]
	targetBEntry := baselineEntries[targetBPath]
	require.NotNil(t, sourceEntry)
	require.NotNil(t, targetBEntry)
	targetBOutput := filepath.Join(config.OutputDir, filepath.FromSlash(targetBEntry.OutputSubdir))
	beforeTargetB := aggregateOutputTreeSnapshot(t, targetBOutput)

	writeSource("z-target-b")
	targetBAbsolutePath := filepath.Join(root, filepath.FromSlash(targetBPath))
	targetBDocument, err := os.ReadFile(targetBAbsolutePath)
	require.NoError(t, err)
	require.NoError(t, os.WriteFile(targetBAbsolutePath, append(targetBDocument, []byte("\nx-render-revision: changed\n")...), 0o644))
	sourceParent := filepath.Dir(filepath.Join(config.OutputDir, filepath.FromSlash(sourceEntry.OutputSubdir)))
	targetBParent := filepath.Dir(targetBOutput)
	require.NoError(t, os.Chmod(sourceParent, 0o555))
	t.Cleanup(func() {
		_ = os.Chmod(sourceParent, 0o755)
		_ = os.Chmod(targetBParent, 0o755)
	})

	var progressMu sync.Mutex
	var queuedPoolIDs []int
	targetBBlocked := false
	var blockErr error
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{
		JSON: true,
		ProgressReporter: AggregateProgressReporterFunc(func(update AggregateProgressUpdate) {
			progressMu.Lock()
			defer progressMu.Unlock()
			if update.Status == AggregateProgressStatusQueued {
				queuedPoolIDs = append(queuedPoolIDs, update.PoolID)
			}
			if !targetBBlocked && update.Status == AggregateProgressStatusCompleted && update.LastSpec == targetBPath {
				targetBBlocked = true
				blockErr = os.Chmod(targetBParent, 0o555)
			}
		}),
	})
	require.NoError(t, err)
	require.NoError(t, os.Chmod(sourceParent, 0o755))
	require.NoError(t, os.Chmod(targetBParent, 0o755))
	progressMu.Lock()
	require.True(t, targetBBlocked, "the target must complete once before becoming dirty for the stabilization pass")
	require.NoError(t, blockErr)
	require.GreaterOrEqual(t, len(queuedPoolIDs), 2, "the scenario must exercise multiple render passes")
	assert.Len(t, queuedPoolIDs, len(uniqueInts(queuedPoolIDs)), "pool IDs must remain unique across stabilization passes")
	progressMu.Unlock()
	assert.Equal(t, len(uniqueInts(queuedPoolIDs)), stats.PoolsUsed, "PoolsUsed must count every distinct pool emitted across stabilization passes")

	assert.True(t, catalogEntryIndex(ap.catalog)[targetBPath].RenderSkipped)
	assert.Equal(t, beforeTargetB, aggregateOutputTreeSnapshot(t, targetBOutput), "a failed final attempt must leave the pre-run live output byte-identical")
	targetPrefix := filepath.ToSlash(targetBEntry.OutputSubdir) + "/"
	for filePath := range stats.FileSizes {
		assert.False(t, strings.HasPrefix(filepath.ToSlash(filePath), targetPrefix), "intermediate staged output must not be counted: %s", filePath)
	}
}

func uniqueInts(values []int) []int {
	seen := make(map[int]struct{}, len(values))
	result := make([]int, 0, len(values))
	for _, value := range values {
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func TestAggregateFastFailedPoolPersistsNoOutputCompletions(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	firstPath := "services/a-first/http/v1/openapi.yaml"
	secondPath := "services/z-second/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, firstPath, SpecKindOpenAPI, "First API", "", "v1", "first")
	writeAggregateCatalogSpec(t, root, secondPath, SpecKindOpenAPI, "Second API", "", "v1", "second")
	config := aggregateNavigationTestConfig(root, store, nil)
	config.MaxPools = 1
	_, catalog := runAggregateHTMLNavigationTest(t, root, config)
	firstEntry := catalogEntryIndex(catalog)[firstPath]
	secondEntry := catalogEntryIndex(catalog)[secondPath]
	require.NotNil(t, firstEntry)
	require.NotNil(t, secondEntry)
	blockedBundle := filepath.Join(config.OutputDir, filepath.FromSlash(secondEntry.OutputSubdir), pppaths.FileBundleJSON)
	require.NoError(t, os.MkdirAll(blockedBundle, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedBundle, "blocked"), []byte("blocked"), 0o644))

	failed, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = failed.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	require.FileExists(t, filepath.Join(config.OutputDir, filepath.FromSlash(firstEntry.OutputSubdir), pppaths.FileBundleJSON))
	records, err := store.Load("navigation")
	require.NoError(t, err)
	assert.NotEmpty(t, records[firstPath].JSONCompletionHash)
	assert.Empty(t, records[secondPath].JSONCompletionHash)
	assert.True(t, catalogEntryIndex(failed.catalog)[secondPath].RenderSkipped)

	require.NoError(t, os.RemoveAll(blockedBundle))
	retry, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	stats, err := retry.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.ChangedSpecs)
}

func TestAggregatePerEntryOutputFailureSkipsAndPersistsSuccessfulEntries(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	successPath := "services/a-success/http/v1/openapi.yaml"
	failedPath := "services/z-failed/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, successPath, SpecKindOpenAPI, "Successful API", "", "v1", "success")
	writeAggregateCatalogSpec(t, root, failedPath, SpecKindOpenAPI, "Failed API", "", "v1", "failed")
	config := aggregateNavigationTestConfig(root, store, nil)
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	before, err := store.Load("navigation")
	require.NoError(t, err)
	beforeSuccess := *before[successPath]
	beforeFailed := *before[failedPath]
	failedOutput := filepath.Join(config.OutputDir, filepath.FromSlash(beforeFailed.JSONOutputSubdir))
	failedBundle := readAggregateFile(t, filepath.Join(failedOutput, pppaths.FileBundleJSON))

	for _, sourcePath := range []string{successPath, failedPath} {
		source := filepath.Join(root, filepath.FromSlash(sourcePath))
		body, readErr := os.ReadFile(source)
		require.NoError(t, readErr)
		require.NoError(t, os.WriteFile(source, append(body, []byte("\nx-render-revision: changed\n")...), 0o644))
	}
	failedParent := filepath.Dir(failedOutput)
	require.NoError(t, os.Chmod(failedParent, 0o555))
	t.Cleanup(func() { _ = os.Chmod(failedParent, 0o755) })

	var progressMu sync.Mutex
	var progress []AggregateProgressUpdate
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{
		JSON: true,
		ProgressReporter: AggregateProgressReporterFunc(func(update AggregateProgressUpdate) {
			progressMu.Lock()
			defer progressMu.Unlock()
			progress = append(progress, update)
		}),
	})
	require.NoError(t, err)
	require.NoError(t, os.Chmod(failedParent, 0o755))
	assert.Equal(t, 1, stats.ChangedSpecs)
	assert.True(t, slices.ContainsFunc(stats.Warnings, func(warning *ppmodel.BuildWarning) bool {
		return warning != nil && warning.Context == failedPath
	}))
	assert.Equal(t, 1, stats.Services)
	assert.False(t, hasVisibleCatalogVersions(findCatalogService(t, ap.catalog, "failed")))
	assert.Equal(t, failedBundle, readAggregateFile(t, filepath.Join(failedOutput, pppaths.FileBundleJSON)))

	after, err := store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, after, successPath)
	require.Contains(t, after, failedPath)
	assert.NotEqual(t, beforeSuccess.JSONCompletionHash, after[successPath].JSONCompletionHash)
	assert.Equal(t, beforeFailed.JSONCompletionHash, after[failedPath].JSONCompletionHash)
	assert.Equal(t, beforeFailed.JSONOutputSubdir, after[failedPath].JSONOutputSubdir)
	assert.NotEqual(t, beforeFailed.Hash, after[failedPath].Hash, "new source metadata is retained while the selected output completion remains retryable")

	progressMu.Lock()
	hasSkippedProgress := slices.ContainsFunc(progress, func(update AggregateProgressUpdate) bool {
		return update.LastSpec == failedPath && update.Status == AggregateProgressStatusSkipped && update.Error != ""
	})
	progressMu.Unlock()
	assert.True(t, hasSkippedProgress)

	retry, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	retryStats, err := retry.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, retryStats.ChangedSpecs)
	retried, err := store.Load("navigation")
	require.NoError(t, err)
	assert.NotEqual(t, beforeFailed.JSONCompletionHash, retried[failedPath].JSONCompletionHash)
}

func TestAggregateFailedMovedReplacementDefersCleanupUntilSuccessfulRetry(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	oldPath := "services/old/http/v1/openapi.yaml"
	newPath := "services/new/http/v1/openapi.yaml"
	unrelatedPath := "services/unrelated/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, oldPath, SpecKindOpenAPI, "Moved API", "", "v1", "old-owner")
	writeAggregateCatalogSpec(t, root, unrelatedPath, SpecKindOpenAPI, "Unrelated API", "", "v1", "unrelated")
	config := aggregateNavigationTestConfig(root, store, nil)
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	before, err := store.Load("navigation")
	require.NoError(t, err)
	oldRecord := *before[oldPath]
	unrelatedRecord := *before[unrelatedPath]
	oldBundle := filepath.Join(config.OutputDir, filepath.FromSlash(oldRecord.JSONOutputSubdir), pppaths.FileBundleJSON)
	oldBundleContents := readAggregateFile(t, oldBundle)

	newAbsolutePath := filepath.Join(root, filepath.FromSlash(newPath))
	require.NoError(t, os.MkdirAll(filepath.Dir(newAbsolutePath), 0o755))
	require.NoError(t, os.Rename(filepath.Join(root, filepath.FromSlash(oldPath)), newAbsolutePath))
	newDocument, err := os.ReadFile(newAbsolutePath)
	require.NoError(t, err)
	newDocument = []byte(strings.ReplaceAll(string(newDocument), `x-owner: "old-owner"`, `x-owner: "new-owner"`))
	newDocument = append(newDocument, []byte("\nx-render-revision: moved\n")...)
	require.NoError(t, os.WriteFile(newAbsolutePath, newDocument, 0o644))
	unrelatedAbsolutePath := filepath.Join(root, filepath.FromSlash(unrelatedPath))
	unrelatedDocument, err := os.ReadFile(unrelatedAbsolutePath)
	require.NoError(t, err)
	require.NoError(t, os.WriteFile(unrelatedAbsolutePath, append(unrelatedDocument, []byte("\nx-render-revision: changed\n")...), 0o644))

	probe, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	probeCatalog, err := probe.PressModel()
	require.NoError(t, err)
	newEntry := catalogEntryIndex(probeCatalog)[newPath]
	require.NotNil(t, newEntry)
	newOutputParent := filepath.Dir(filepath.Join(config.OutputDir, filepath.FromSlash(newEntry.OutputSubdir)))
	require.NoError(t, os.MkdirAll(newOutputParent, 0o755))
	require.NoError(t, os.Chmod(newOutputParent, 0o555))
	t.Cleanup(func() { _ = os.Chmod(newOutputParent, 0o755) })

	failed, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	stats, err := failed.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	require.NoError(t, os.Chmod(newOutputParent, 0o755))
	assert.Equal(t, 1, stats.ChangedSpecs, "the unrelated successful render still completes")
	assert.Equal(t, oldBundleContents, readAggregateFile(t, oldBundle), "cleanup must retain the last-known-good output while its replacement is retryable")
	afterFailure, err := store.Load("navigation")
	require.NoError(t, err)
	require.Contains(t, afterFailure, oldPath)
	assert.Equal(t, oldRecord.JSONCompletionHash, afterFailure[oldPath].JSONCompletionHash)
	assert.Equal(t, oldRecord.JSONOutputSubdir, afterFailure[oldPath].JSONOutputSubdir)
	require.Contains(t, afterFailure, unrelatedPath)
	assert.NotEqual(t, unrelatedRecord.JSONCompletionHash, afterFailure[unrelatedPath].JSONCompletionHash)

	retry, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	retryStats, err := retry.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, retryStats.ChangedSpecs)
	assert.NoFileExists(t, oldBundle)
	afterRetry, err := store.Load("navigation")
	require.NoError(t, err)
	assert.NotContains(t, afterRetry, oldPath)
	require.Contains(t, afterRetry, newPath)
}

func TestAggregateBackupCleanupFailureWarnsAfterSuccessfulCompletion(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/users/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Users API", "", "v1", "users")
	config := aggregateNavigationTestConfig(root, store, nil)
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	before, err := store.Load("navigation")
	require.NoError(t, err)
	beforeCompletion := before[sourcePath].JSONCompletionHash

	sourceAbsolutePath := filepath.Join(root, filepath.FromSlash(sourcePath))
	sourceDocument, err := os.ReadFile(sourceAbsolutePath)
	require.NoError(t, err)
	require.NoError(t, os.WriteFile(sourceAbsolutePath, append(sourceDocument, []byte("\nx-render-revision: changed\n")...), 0o644))
	cleanupErr := errors.New("injected backup cleanup failure")
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	ap.cleanupPromotionBackup = func(string) error {
		return cleanupErr
	}

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.ChangedSpecs)
	assert.False(t, catalogEntryIndex(ap.catalog)[sourcePath].RenderSkipped)
	assert.True(t, slices.ContainsFunc(stats.Warnings, func(warning *ppmodel.BuildWarning) bool {
		return warning != nil && warning.Context == sourcePath && errors.Is(warning.Err, cleanupErr)
	}))
	after, err := store.Load("navigation")
	require.NoError(t, err)
	assert.NotEqual(t, beforeCompletion, after[sourcePath].JSONCompletionHash, "the installed output must advance state despite deferred backup cleanup")
	entryPrefix := filepath.ToSlash(after[sourcePath].JSONOutputSubdir) + "/"
	entryFileCounted := false
	for filePath := range stats.FileSizes {
		entryFileCounted = entryFileCounted || strings.HasPrefix(filepath.ToSlash(filePath), entryPrefix)
	}
	assert.True(t, entryFileCounted, "installed entry files must be included in statistics")
}

func TestAggregateSecondPromotionFailureRollsBackBatchAndShipsSiblings(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	firstPath := "services/a-first/http/v1/openapi.yaml"
	failedPath := "services/z-failed/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, firstPath, SpecKindOpenAPI, "First API", "", "v1", "first")
	writeAggregateCatalogSpec(t, root, failedPath, SpecKindOpenAPI, "Failed API", "", "v1", "failed")
	config := aggregateNavigationTestConfig(root, store, nil)
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	before, err := store.Load("navigation")
	require.NoError(t, err)
	beforeFirst := *before[firstPath]
	beforeFailed := *before[failedPath]
	firstOutput := filepath.Join(config.OutputDir, filepath.FromSlash(beforeFirst.JSONOutputSubdir))
	failedOutput := filepath.Join(config.OutputDir, filepath.FromSlash(beforeFailed.JSONOutputSubdir))
	beforeFirstTree := aggregateOutputTreeSnapshot(t, firstOutput)
	beforeFailedTree := aggregateOutputTreeSnapshot(t, failedOutput)

	for relativePath, title := range map[string]string{firstPath: "First API", failedPath: "Failed API"} {
		absolutePath := filepath.Join(root, filepath.FromSlash(relativePath))
		document, readErr := os.ReadFile(absolutePath)
		require.NoError(t, readErr)
		titleLine := `title: "` + title + `"`
		changed := strings.Replace(string(document), titleLine, titleLine+"\n  description: changed", 1)
		require.NotEqual(t, string(document), changed)
		require.NoError(t, os.WriteFile(absolutePath, []byte(changed), 0o644))
	}
	promotionErr := errors.New("injected second promotion failure")
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	promotionAttempts := 0
	ap.beginEntryPromotion = func(stagedOutput, entryOutput string) (*aggregateEntryPromotion, error, error) {
		promotionAttempts++
		if promotionAttempts == 2 {
			return nil, promotionErr, nil
		}
		return beginAggregateEntryPromotion(stagedOutput, entryOutput)
	}

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.GreaterOrEqual(t, promotionAttempts, 3, "the rolled-back sibling must be promoted again after the failed entry is removed")
	assert.Equal(t, 1, stats.ChangedSpecs)
	assert.NotEqual(t, beforeFirstTree, aggregateOutputTreeSnapshot(t, firstOutput))
	assert.Equal(t, beforeFailedTree, aggregateOutputTreeSnapshot(t, failedOutput), "the failed entry must retain its complete pre-run live tree")
	failedEntry := catalogEntryIndex(ap.catalog)[failedPath]
	require.NotNil(t, failedEntry)
	assert.True(t, failedEntry.RenderSkipped)
	assert.True(t, slices.ContainsFunc(stats.Warnings, func(warning *ppmodel.BuildWarning) bool {
		return warning != nil && warning.Context == failedPath && errors.Is(warning.Err, promotionErr)
	}))
	after, err := store.Load("navigation")
	require.NoError(t, err)
	assert.NotEqual(t, beforeFirst.JSONCompletionHash, after[firstPath].JSONCompletionHash)
	assert.Equal(t, beforeFailed.JSONCompletionHash, after[failedPath].JSONCompletionHash)
	assert.Equal(t, beforeFailed.JSONOutputSubdir, after[failedPath].JSONOutputSubdir)
	failedPrefix := filepath.ToSlash(beforeFailed.JSONOutputSubdir) + "/"
	for filePath := range stats.FileSizes {
		assert.False(t, strings.HasPrefix(filepath.ToSlash(filePath), failedPrefix), "failed batch output must not be counted: %s", filePath)
	}

	retry, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	retryStats, err := retry.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, retryStats.ChangedSpecs)
}

func TestAggregateStagingCleanupFailureIsRetriedAndWarned(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/a-source/http/v1/openapi.yaml"
	targetBPath := "services/z-target-b/http/v1/openapi.yaml"
	writeSource := func(target string) {
		writeAggregateSpecDocument(t, root, sourcePath, `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../../`+target+`/http/v1/openapi.yaml#/info
paths: {}
`)
	}
	writeSource("target-a")
	writeAggregateCatalogSpec(t, root, "services/target-a/http/v1/openapi.yaml", SpecKindOpenAPI, "Target A", "", "v1", "target-a")
	writeAggregateCatalogSpec(t, root, targetBPath, SpecKindOpenAPI, "Target B", "", "v1", "target-b")
	config := aggregateNavigationTestConfig(root, store, nil)
	config.MaxPools = 1
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	sourceEntry := catalogEntryIndex(baseline.catalog)[sourcePath]
	require.NotNil(t, sourceEntry)

	writeSource("z-target-b")
	sourceParent := filepath.Dir(filepath.Join(config.OutputDir, filepath.FromSlash(sourceEntry.OutputSubdir)))
	require.NoError(t, os.Chmod(sourceParent, 0o555))
	t.Cleanup(func() { _ = os.Chmod(sourceParent, 0o755) })
	cleanupErr := errors.New("injected persistent staging cleanup failure")
	cleanupCalls := 0
	var retainedStage string
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	ap.removeStagedOutput = func(stagePath string) error {
		if strings.Contains(filepath.ToSlash(stagePath), "/services/target-b/") {
			cleanupCalls++
			retainedStage = stagePath
			return cleanupErr
		}
		return os.RemoveAll(stagePath)
	}

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	require.NoError(t, os.Chmod(sourceParent, 0o755))
	assert.GreaterOrEqual(t, cleanupCalls, 2, "failed staging cleanup must be retried during finalization")
	assert.DirExists(t, retainedStage)
	assert.True(t, slices.ContainsFunc(stats.Warnings, func(warning *ppmodel.BuildWarning) bool {
		return warning != nil && warning.Context == targetBPath && errors.Is(warning.Err, cleanupErr)
	}))
}

func TestStageAggregateEntryOutputCopyFailureSurfacesCleanupFailure(t *testing.T) {
	parent := t.TempDir()
	entryOutput := filepath.Join(parent, "entry")
	require.NoError(t, os.WriteFile(entryOutput, []byte("not a directory"), 0o644))
	cleanupErr := errors.New("injected staging cleanup failure")
	var cleanedPath string

	_, err := stageAggregateEntryOutputWithCleanup(entryOutput, aggregateOutputSelection{}, func(stagePath string) error {
		cleanedPath = stagePath
		return cleanupErr
	})
	require.Error(t, err)
	assert.ErrorIs(t, err, cleanupErr)
	assert.Contains(t, err.Error(), "entry output is not a directory")
	assert.NotEmpty(t, cleanedPath)
	assert.Contains(t, err.Error(), cleanedPath)
}

func TestAggregateTombstonePreparationFailureSurfacesStagingCleanupFailure(t *testing.T) {
	root := t.TempDir()
	config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil)
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	outputSubdir := "services/retired/versions/v1/specs/retired-api"
	entryOutput := filepath.Join(config.OutputDir, filepath.FromSlash(outputSubdir))
	blockedBundle := filepath.Join(entryOutput, pppaths.FileBundleJSON)
	require.NoError(t, os.MkdirAll(blockedBundle, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedBundle, "blocked"), []byte("blocked"), 0o644))
	plan := &aggregateBuildPlan{
		catalog: &ppmodel.CatalogSite{},
		removed: []*SpecStateRecord{{
			RelativePath:       "services/retired/http/v1/openapi.yaml",
			JSONCompletionHash: "complete",
			JSONOutputSubdir:   outputSubdir,
		}},
	}
	cleanupErr := errors.New("injected tombstone staging cleanup failure")
	cleanupCalls := 0
	var cleanedPath string
	ap.removeStagedOutput = func(stagePath string) error {
		cleanupCalls++
		cleanedPath = stagePath
		return cleanupErr
	}

	err = ap.reconcileCleanupTombstoneEntryArtifactsWithOwnership(plan, aggregateOutputSelection{json: true}, aggregateActiveOutputOwnership{})
	require.Error(t, err)
	assert.Equal(t, 1, cleanupCalls)
	assert.ErrorIs(t, err, cleanupErr)
	assert.NotEmpty(t, cleanedPath)
	assert.Contains(t, err.Error(), cleanedPath)
}

func TestAggregateFullRenderIsDeterministic(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/http/v1/openapi.yaml", SpecKindOpenAPI, "Orders API", "Orders summary", "v1", "orders")
	writeAggregateCatalogSpec(t, root, "services/orders/events/v1/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "Events summary", "v1", "orders")
	config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), []AggregateContractRoleRule{
		{Pattern: "**/http/**", Role: "http-api", ContractID: "orders-http", Default: true},
		{Pattern: "**/events/**", Role: "published-events", ContractID: "orders-events"},
	})
	config.BuildMode = AggregateBuildModeFull
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)

	first, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	require.NoError(t, err)
	assert.Equal(t, 2, first.ChangedSpecs)
	before := aggregateOutputTreeSnapshot(t, config.OutputDir)

	second, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, JSON: true, LLM: true})
	require.NoError(t, err)
	assert.Equal(t, 2, second.ChangedSpecs)
	assert.Equal(t, before, aggregateOutputTreeSnapshot(t, config.OutputDir))
}

func TestAggregatePressModelDoesNotPreflightEntrySites(t *testing.T) {
	root := t.TempDir()
	for i := 0; i < 3; i++ {
		writeAggregateCatalogSpec(t, root, fmt.Sprintf("services/service-%d/http/v1/openapi.yaml", i), SpecKindOpenAPI, fmt.Sprintf("Service %d", i), "", "v1", fmt.Sprintf("service-%d", i))
	}
	ap, err := CreateAggregatePrintingPressFromPath(root, aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil))
	require.NoError(t, err)
	preflightCalls := 0
	ap.preflightBuildEntrySite = func(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
		preflightCalls++
		return ap.buildEntrySite(spec, entry)
	}

	_, err = ap.PressModel()
	require.NoError(t, err)
	assert.Zero(t, preflightCalls)
	require.NotNil(t, ap.plan)
}

func TestAggregateRenderPreflightIsBoundedConcurrent(t *testing.T) {
	root := t.TempDir()
	for i := 0; i < 6; i++ {
		writeAggregateCatalogSpec(t, root, fmt.Sprintf("services/service-%d/http/v1/openapi.yaml", i), SpecKindOpenAPI, fmt.Sprintf("Service %d", i), "", "v1", fmt.Sprintf("service-%d", i))
	}
	config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil)
	config.MaxPools = 3
	config.WorkersPerPool = 1
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	active, peak := 0, 0
	var counterMu sync.Mutex
	ap.preflightBuildEntrySite = func(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
		counterMu.Lock()
		active++
		peak = max(peak, active)
		counterMu.Unlock()
		time.Sleep(20 * time.Millisecond)
		site, err := ap.buildEntrySite(spec, entry)
		counterMu.Lock()
		active--
		counterMu.Unlock()
		return site, err
	}

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Greater(t, peak, 1)
	assert.LessOrEqual(t, peak, ap.resolvePoolCount(6))
}

func TestAggregateRenderPreflightMissingCatalogEntryIsFatalInvariant(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/users/http/v1/openapi.yaml", SpecKindOpenAPI, "Users API", "", "v1", "users")
	ap, err := CreateAggregatePrintingPressFromPath(root, aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil))
	require.NoError(t, err)
	plan, err := ap.buildPlan(aggregatePlanIntent{selection: aggregateOutputSelection{json: true}})
	require.NoError(t, err)
	require.NotEmpty(t, plan.changed)
	plan.catalog.Services = nil

	err = ap.preflightChangedEntries(plan, aggregateOutputSelection{json: true})
	require.ErrorContains(t, err, "missing catalog entry")
	assert.False(t, plan.changed[0].RenderSkipped, "an internal catalog invariant is fatal, not an entry-level render skip")
}

func TestAggregateRenderConsumesPreflightSiteWithoutReopeningSpec(t *testing.T) {
	root := t.TempDir()
	sourcePath := "services/users/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Users API", "", "v1", "users")
	config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil)
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	builds := 0
	ap.preflightBuildEntrySite = func(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
		builds++
		site, buildErr := ap.buildEntrySite(spec, entry)
		if buildErr == nil {
			require.NoError(t, os.Remove(spec.AbsolutePath))
		}
		return site, buildErr
	}

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, builds)
	assertAggregatePrebuiltSitesReleased(t, ap)
}

func TestAggregateLateDirtyReusesInitiallyCleanPreflightSite(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/users/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, sourcePath, SpecKindOpenAPI, "Users API", "", "v1", "users")
	config := aggregateNavigationTestConfig(root, store, nil)
	baseline, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = baseline.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)

	absolutePath := filepath.Join(root, filepath.FromSlash(sourcePath))
	document, err := os.ReadFile(absolutePath)
	require.NoError(t, err)
	require.NoError(t, os.WriteFile(absolutePath, append(document, []byte("\nx-preflight-revision: changed\n")...), 0o644))

	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	builds := 0
	ap.preflightBuildEntrySite = func(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
		builds++
		site, buildErr := ap.buildEntrySite(spec, entry)
		if buildErr == nil {
			require.NotNil(t, spec.previousState)
			spec.Hash = spec.previousState.Hash
		}
		return site, buildErr
	}

	selection := aggregateOutputSelection{html: true}
	plan, err := ap.buildPlan(aggregatePlanIntent{selection: selection, preflight: true})
	require.NoError(t, err)
	require.Equal(t, 1, builds)
	require.Empty(t, plan.changed, "the successful preflight is initially clean after stabilization")
	specIndex := slices.IndexFunc(plan.discovered, func(spec *aggregateDiscoveredSpec) bool {
		return spec != nil && spec.RelativePath == sourcePath
	})
	require.GreaterOrEqual(t, specIndex, 0)
	discovered := plan.discovered[specIndex]
	require.Contains(t, plan.preflighted, sourcePath)
	require.NotNil(t, discovered.prebuiltSite, "a preflighted entry may become dirty again in a later stabilization wave")

	discovered.HTMLCompletionHash = "late-dirty"
	plan.changed = []*aggregateDiscoveredSpec{discovered}
	require.NoError(t, os.Remove(absolutePath))
	written, _, err := ap.renderSelectedOutputsUntilStable(plan, selection, nil)
	require.NoError(t, err)
	assert.False(t, discovered.RenderSkipped)
	assert.NotEmpty(t, written)
	assert.Equal(t, 1, builds, "the late render must reuse the retained preflight model")
	releaseAggregatePrebuiltSites(plan)
}

func TestAggregateRenderRetainsPreflightSiteAcrossLateStabilizationWave(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/a-source/http/v1/openapi.yaml"
	targetBPath := "services/z-target-b/http/v1/openapi.yaml"
	writeSource := func(target string) {
		writeAggregateSpecDocument(t, root, sourcePath, `
openapi: 3.1.0
info:
  title: Source API
  version: v1
  x-owner: source
x-related:
  $ref: ../../../`+target+`/http/v1/openapi.yaml#/info
paths: {}
`)
	}
	writeSource("target-a")
	writeAggregateCatalogSpec(t, root, "services/target-a/http/v1/openapi.yaml", SpecKindOpenAPI, "Target A", "", "v1", "target-a")
	writeAggregateCatalogSpec(t, root, targetBPath, SpecKindOpenAPI, "Target B", "", "v1", "target-b")
	config := aggregateNavigationTestConfig(root, store, nil)
	config.MaxPools = 1
	_, baselineCatalog := runAggregateHTMLNavigationTest(t, root, config)

	writeSource("z-target-b")
	sourceEntry := catalogEntryIndex(baselineCatalog)[sourcePath]
	require.NotNil(t, sourceEntry)
	blockedBundle := filepath.Join(config.OutputDir, filepath.FromSlash(sourceEntry.OutputSubdir), pppaths.FileBundleJSON)
	require.NoError(t, os.MkdirAll(blockedBundle, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedBundle, "blocked"), []byte("blocked"), 0o644))

	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	targetBuilds := 0
	ap.preflightBuildEntrySite = func(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry) (*ppmodel.Site, error) {
		site, buildErr := ap.buildEntrySite(spec, entry)
		if spec.RelativePath == targetBPath {
			targetBuilds++
			if buildErr == nil {
				require.NoError(t, os.Remove(spec.AbsolutePath))
			}
		}
		return site, buildErr
	}

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, targetBuilds)
	targetBEntry := catalogEntryIndex(ap.catalog)[targetBPath]
	require.NotNil(t, targetBEntry)
	assert.False(t, targetBEntry.RenderSkipped, "the late wave must reuse the retained preflight model")
	targetBBundle := readAggregateFile(t, filepath.Join(config.OutputDir, filepath.FromSlash(targetBEntry.OutputSubdir), pppaths.FileBundleJSON))
	assert.NotContains(t, targetBBundle, "Referenced by Source API")
	assertAggregatePrebuiltSitesReleased(t, ap)
}

func TestAggregateRenderReleasesPreflightSitesOnGlobalFailure(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/users/http/v1/openapi.yaml", SpecKindOpenAPI, "Users API", "", "v1", "users")
	blockedOutput := filepath.Join(root, "blocked-output")
	require.NoError(t, os.WriteFile(blockedOutput, []byte("blocked"), 0o644))
	config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil)
	config.OutputDir = blockedOutput
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.ErrorContains(t, err, "creating aggregate output dir")
	assertAggregatePrebuiltSitesReleased(t, ap)
}

func assertAggregatePrebuiltSitesReleased(t *testing.T, ap *AggregatePrintingPress) {
	t.Helper()
	require.NotNil(t, ap)
	require.NotNil(t, ap.plan)
	for _, spec := range ap.plan.discovered {
		assert.Nil(t, spec.prebuiltSite, "preflight Site for %s was not released", spec.RelativePath)
	}
}

func TestAggregateFailedRenderRemovesStagingDirectory(t *testing.T) {
	root := t.TempDir()
	path := "services/users/http/v1/openapi.yaml"
	writeAggregateCatalogSpec(t, root, path, SpecKindOpenAPI, "Users API", "", "v1", "users")
	config := aggregateNavigationTestConfig(root, NewMemorySpecStateStore(), nil)
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	catalog, err := ap.PressModel()
	require.NoError(t, err)
	entry := catalogEntryIndex(catalog)[path]
	require.NotNil(t, entry)
	blockedBundle := filepath.Join(config.OutputDir, filepath.FromSlash(entry.OutputSubdir), pppaths.FileBundleJSON)
	require.NoError(t, os.MkdirAll(blockedBundle, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(blockedBundle, "blocked"), []byte("blocked"), 0o644))

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.True(t, catalogEntryIndex(ap.catalog)[path].RenderSkipped)
	entries, err := os.ReadDir(filepath.Dir(filepath.Join(config.OutputDir, filepath.FromSlash(entry.OutputSubdir))))
	require.NoError(t, err)
	for _, staged := range entries {
		assert.NotContains(t, staged.Name(), ".ppress-stage-")
	}
}

func TestPromoteAggregateEntryOutputSwapsAndRollsBack(t *testing.T) {
	t.Run("successful swap cleans staging and backup", func(t *testing.T) {
		parent := t.TempDir()
		entryOutput := filepath.Join(parent, "entry")
		require.NoError(t, os.MkdirAll(entryOutput, 0o755))
		require.NoError(t, os.WriteFile(filepath.Join(entryOutput, "old.txt"), []byte("old"), 0o644))
		staged, err := stageAggregateEntryOutput(entryOutput, aggregateOutputSelection{})
		require.NoError(t, err)
		require.NoError(t, os.Remove(filepath.Join(staged, "old.txt")))
		require.NoError(t, os.WriteFile(filepath.Join(staged, "new.txt"), []byte("new"), 0o644))

		promotion, err := promoteAggregateEntryOutput(staged, entryOutput)
		require.NoError(t, err)
		assert.NoError(t, promotion.cleanupWarning)
		require.FileExists(t, filepath.Join(entryOutput, "new.txt"))
		assert.NoFileExists(t, filepath.Join(entryOutput, "old.txt"))
		assert.NoDirExists(t, staged)
		entries, err := os.ReadDir(parent)
		require.NoError(t, err)
		for _, entry := range entries {
			assert.NotContains(t, entry.Name(), ".ppress-backup-")
		}
	})

	t.Run("backup cleanup failure preserves successful installation", func(t *testing.T) {
		parent := t.TempDir()
		entryOutput := filepath.Join(parent, "entry")
		require.NoError(t, os.MkdirAll(entryOutput, 0o755))
		require.NoError(t, os.WriteFile(filepath.Join(entryOutput, "old.txt"), []byte("old"), 0o644))
		staged, err := stageAggregateEntryOutput(entryOutput, aggregateOutputSelection{})
		require.NoError(t, err)
		require.NoError(t, os.Remove(filepath.Join(staged, "old.txt")))
		require.NoError(t, os.WriteFile(filepath.Join(staged, "new.txt"), []byte("new"), 0o644))
		cleanupErr := errors.New("injected backup cleanup failure")

		promotion, err := promoteAggregateEntryOutputWithCleanup(staged, entryOutput, func(string) error {
			return cleanupErr
		})
		require.NoError(t, err)
		assert.ErrorIs(t, promotion.cleanupWarning, cleanupErr)
		assert.Equal(t, "new", readAggregateFile(t, filepath.Join(entryOutput, "new.txt")))
		assert.NoFileExists(t, filepath.Join(entryOutput, "old.txt"))
	})

	t.Run("failed promotion restores previous output", func(t *testing.T) {
		parent := t.TempDir()
		entryOutput := filepath.Join(parent, "entry")
		require.NoError(t, os.MkdirAll(entryOutput, 0o755))
		require.NoError(t, os.WriteFile(filepath.Join(entryOutput, "old.txt"), []byte("old"), 0o644))

		_, err := promoteAggregateEntryOutput(filepath.Join(parent, "missing-stage"), entryOutput)
		require.Error(t, err)
		assert.Equal(t, "old", readAggregateFile(t, filepath.Join(entryOutput, "old.txt")))
		entries, readErr := os.ReadDir(parent)
		require.NoError(t, readErr)
		for _, entry := range entries {
			assert.NotContains(t, entry.Name(), ".ppress-backup-")
		}
	})
}

func TestStageAggregateEntryOutputUsesCollisionFreeSiblingPaths(t *testing.T) {
	parent := t.TempDir()
	firstOutput := filepath.Join(parent, "first")
	secondOutput := filepath.Join(parent, "second")
	require.NoError(t, os.MkdirAll(firstOutput, 0o755))
	require.NoError(t, os.MkdirAll(secondOutput, 0o755))

	var wg sync.WaitGroup
	staged := make(chan string, 2)
	errs := make(chan error, 2)
	for _, output := range []string{firstOutput, secondOutput} {
		output := output
		wg.Add(1)
		go func() {
			defer wg.Done()
			path, err := stageAggregateEntryOutput(output, aggregateOutputSelection{})
			staged <- path
			errs <- err
		}()
	}
	wg.Wait()
	close(staged)
	close(errs)
	for err := range errs {
		require.NoError(t, err)
	}
	var paths []string
	for path := range staged {
		paths = append(paths, path)
		defer os.RemoveAll(path)
	}
	require.Len(t, paths, 2)
	assert.NotEqual(t, paths[0], paths[1])
	assert.Equal(t, parent, filepath.Dir(paths[0]))
	assert.Equal(t, parent, filepath.Dir(paths[1]))
}

func TestStageAggregateEntryOutputHardLinksPreservedArtifacts(t *testing.T) {
	entryOutput := filepath.Join(t.TempDir(), "entry")
	require.NoError(t, os.MkdirAll(entryOutput, 0o755))
	htmlPath := filepath.Join(entryOutput, pppaths.FileIndexHTML)
	require.NoError(t, os.WriteFile(htmlPath, []byte("<html>preserved</html>"), 0o644))

	staged, err := stageAggregateEntryOutput(entryOutput, aggregateOutputSelection{json: true})
	require.NoError(t, err)
	defer os.RemoveAll(staged)
	sourceInfo, err := os.Stat(htmlPath)
	require.NoError(t, err)
	stagedInfo, err := os.Stat(filepath.Join(staged, pppaths.FileIndexHTML))
	require.NoError(t, err)
	assert.True(t, os.SameFile(sourceInfo, stagedInfo), "preserved artifacts should not be byte-copied into sibling staging")
}

func TestAggregateFastRelationshipDisplayRenameInvalidatesBothServiceTrees(t *testing.T) {
	root := t.TempDir()
	store := NewMemorySpecStateStore()
	sourcePath := "services/source/events/v1/asyncapi.yaml"
	targetPath := "services/target/events/v1/asyncapi.yaml"
	writeAggregateCatalogSpec(t, root, "services/source/http/v1/openapi.yaml", SpecKindOpenAPI, "Source HTTP", "", "v1", "source")
	writeAggregateCatalogSpec(t, root, "services/target/http/v1/openapi.yaml", SpecKindOpenAPI, "Target HTTP", "", "v1", "target")
	writeAggregateRelationshipAsyncRoot(t, root, sourcePath, "Source Subscription", "v1", "source", "../../../target/events/v1/asyncapi.yaml#/components/messages/Event")
	writeAggregateRelationshipAsyncRoot(t, root, targetPath, "Target Events", "v1", "target", "")
	roles := []AggregateContractRoleRule{
		{Pattern: "**/source/http/**", Role: "http-api", ContractID: "source-http", Default: true},
		{Pattern: "**/source/events/**", Role: "consumed-events", ContractID: "subscription"},
		{Pattern: "**/target/http/**", Role: "http-api", ContractID: "target-http", Default: true},
		{Pattern: "**/target/events/**", Role: "published-events", ContractID: "published"},
	}
	config := aggregateNavigationTestConfig(root, store, roles)
	first, _ := runAggregateHTMLNavigationTest(t, root, config)
	assert.Equal(t, 4, first.ChangedSpecs)

	writeAggregateRelationshipAsyncRoot(t, root, targetPath, "TARGET EVENTS!", "v1", "target", "")
	renamed, catalog := runAggregateHTMLNavigationTest(t, root, config)
	assert.Equal(t, 4, renamed.ChangedSpecs)
	assertAggregateRelationshipHTML(t, config.OutputDir, catalog, "source", "Consumes from TARGET EVENTS!", true)
	assertAggregateRelationshipHTML(t, config.OutputDir, catalog, "target", "Consumed by Source Subscription", true)
	unchanged, _ := runAggregateHTMLNavigationTest(t, root, config)
	assert.Equal(t, 0, unchanged.ChangedSpecs)
}

func aggregateNavigationTestConfig(root string, store SpecStateStore, roles []AggregateContractRoleRule) *AggregatePrintingPressConfig {
	return &AggregatePrintingPressConfig{
		OutputDir:      filepath.Join(root, "site"),
		BuildMode:      AggregateBuildModeFast,
		StateNamespace: "navigation",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner"},
		},
		ContractRoles: roles,
	}
}

func runAggregateNavigationTest(t *testing.T, root string, config *AggregatePrintingPressConfig) *AggregatePressStatistics {
	t.Helper()
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	return stats
}

func runAggregateHTMLNavigationTest(t *testing.T, root string, config *AggregatePrintingPressConfig) (*AggregatePressStatistics, *ppmodel.CatalogSite) {
	t.Helper()
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)
	return stats, ap.catalog
}

func assertEntryTreeManagedContractHeaders(
	t *testing.T,
	outputDir string,
	service *ppmodel.CatalogService,
	entry *ppmodel.CatalogSpecEntry,
	expectContracts bool,
	expectedRoles []ppmodel.ContractRoleValue,
	expectedServiceName string,
) {
	t.Helper()
	require.NotNil(t, service)
	require.NotNil(t, entry)
	entryRoot := filepath.Join(outputDir, filepath.FromSlash(entry.OutputSubdir))
	requiredPages := []string{pppaths.FileIndexHTML, "operations/list-health.html", "models/schemas/status.html"}
	if entry.SpecKind.IsAsyncAPI() {
		requiredPages = []string{pppaths.FileIndexHTML, "operations/publish-event.html", "models/channels/events.html", "models/messages/event-message.html"}
	}
	for _, page := range requiredPages {
		require.FileExists(t, filepath.Join(entryRoot, filepath.FromSlash(page)))
	}

	pageCount := 0
	require.NoError(t, filepath.Walk(entryRoot, func(filePath string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || filepath.Ext(filePath) != ".html" {
			return err
		}
		pageCount++
		rendered := readAggregateFile(t, filePath)
		assert.Equal(t, siteOverviewLabel(entry.SpecKind), aggregateBodyAttribute(t, rendered, "data-pp-overview-label"), filePath)
		assert.Equal(t, entry.Version, aggregateBodyAttribute(t, rendered, "data-pp-current-version"), filePath)
		assert.Equal(t, expectedServiceName, aggregateBodyAttribute(t, rendered, "data-pp-service-name"), filePath)

		versionPayload := aggregateBodyAttribute(t, rendered, "data-pp-versions")
		activeContract := findCatalogContract(t, service, entry.ContractID)
		if len(activeContract.Versions) > 1 {
			var versions []*ppmodel.SiteVersionLink
			require.NoError(t, json.Unmarshal([]byte(versionPayload), &versions), filePath)
			require.Len(t, versions, len(activeContract.Versions), filePath)
			activeVersions := 0
			for _, version := range versions {
				if version != nil && version.Active {
					activeVersions++
					assert.Equal(t, entry.Version, version.Label, filePath)
				}
			}
			assert.Equal(t, 1, activeVersions, filePath)
		} else {
			assert.Empty(t, versionPayload, filePath)
		}

		contractPayload := aggregateBodyAttribute(t, rendered, "data-pp-contracts")
		if !expectContracts {
			assert.Empty(t, contractPayload, filePath)
			return nil
		}
		require.NotEmpty(t, contractPayload, filePath)
		var groups []*ppmodel.SiteContractGroup
		require.NoError(t, json.Unmarshal([]byte(contractPayload), &groups), filePath)
		roles := make([]ppmodel.ContractRoleValue, 0, len(groups))
		activeContracts := 0
		for _, group := range groups {
			require.NotNil(t, group, filePath)
			roles = append(roles, group.Role)
			for _, link := range group.Contracts {
				if link == nil || !link.Active {
					continue
				}
				activeContracts++
				assert.Equal(t, entry.ContractID, link.ID, filePath)
				assert.Equal(t, entry.Version, link.CurrentVersion, filePath)
				if len(activeContract.Versions) > 1 {
					linkActiveVersions := 0
					for _, version := range link.Versions {
						if version != nil && version.Active {
							linkActiveVersions++
							assert.Equal(t, entry.Version, version.Label, filePath)
						}
					}
					assert.Equal(t, 1, linkActiveVersions, filePath)
				} else {
					assert.Empty(t, link.Versions, filePath)
				}
			}
		}
		assert.Equal(t, expectedRoles, roles, filePath)
		assert.Equal(t, 1, activeContracts, filePath)
		return nil
	}))
	assert.GreaterOrEqual(t, pageCount, len(requiredPages))
}

func entryTreeHTMLSnapshot(t *testing.T, outputDir string, entry *ppmodel.CatalogSpecEntry) map[string]string {
	t.Helper()
	result := make(map[string]string)
	root := filepath.Join(outputDir, filepath.FromSlash(entry.OutputSubdir))
	require.NoError(t, filepath.Walk(root, func(filePath string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || filepath.Ext(filePath) != ".html" {
			return err
		}
		data, err := os.ReadFile(filePath)
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(root, filePath)
		if err != nil {
			return err
		}
		result[filepath.ToSlash(rel)] = string(data)
		return nil
	}))
	return result
}

func aggregateOutputTreeSnapshot(t *testing.T, root string) map[string]string {
	t.Helper()
	result := make(map[string]string)
	require.NoError(t, filepath.Walk(root, func(filePath string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		data, err := os.ReadFile(filePath)
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(root, filePath)
		if err != nil {
			return err
		}
		result[filepath.ToSlash(rel)] = string(data)
		return nil
	}))
	return result
}

func buildAggregateNavigationTestCatalog(t *testing.T, root string, config *AggregatePrintingPressConfig) *ppmodel.CatalogSite {
	t.Helper()
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	catalog, err := ap.PressModel()
	require.NoError(t, err)
	return catalog
}

func writeAggregateRelationshipAsyncRoot(t *testing.T, root, relPath, title, version, owner, ref string) {
	t.Helper()
	refBlock := ""
	if ref != "" {
		refBlock = "    messages:\n      Event:\n        $ref: " + strconv.Quote(ref) + "\n"
	}
	writeAggregateSpecDocument(t, root, relPath, "asyncapi: 3.0.0\ninfo:\n  title: "+strconv.Quote(title)+"\n  version: "+strconv.Quote(version)+"\n  x-owner: "+strconv.Quote(owner)+"\nchannels:\n  events:\n    address: events\n"+refBlock+"operations: {}\ncomponents:\n  messages:\n    Event:\n      payload:\n        type: object\n")
}

func assertAggregateRelationshipHTML(t *testing.T, outputDir string, catalog *ppmodel.CatalogSite, serviceKey, expected string, present bool) {
	t.Helper()
	service := findCatalogService(t, catalog, serviceKey)
	found := false
	for _, version := range visibleCatalogVersions(service) {
		for _, entry := range visibleCatalogEntries(version) {
			html := readAggregateFile(t, filepath.Join(outputDir, filepath.FromSlash(entry.OverviewHref)))
			if strings.Contains(html, expected) {
				found = true
			}
		}
	}
	assert.Equal(t, present, found, "relationship text %q in service %s", expected, serviceKey)
}

func catalogEntryForService(t *testing.T, service *ppmodel.CatalogService) *ppmodel.CatalogSpecEntry {
	t.Helper()
	for _, version := range service.Versions {
		for _, entry := range version.Entries {
			if entry != nil {
				return entry
			}
		}
	}
	require.FailNow(t, "catalog service has no entry", "service=%s", service.Key)
	return nil
}

func assertAggregateRelationshipsOnlyOnEntryOverview(t *testing.T, outputDir string, catalog *ppmodel.CatalogSite, serviceKey string) {
	t.Helper()
	entry := catalogEntryForService(t, findCatalogService(t, catalog, serviceKey))
	entryDir := filepath.Join(outputDir, filepath.FromSlash(entry.OutputSubdir))
	files, err := collectFiles(entryDir)
	require.NoError(t, err)
	nestedPages := 0
	for _, filePath := range files {
		if strings.ToLower(filepath.Ext(filePath)) != ".html" {
			continue
		}
		rel, err := filepath.Rel(entryDir, filePath)
		require.NoError(t, err)
		html := readAggregateFile(t, filePath)
		if filepath.ToSlash(rel) == pppaths.FileIndexHTML {
			assert.Contains(t, html, "pp-contract-relationships")
			continue
		}
		nestedPages++
		assert.NotContains(t, html, "pp-contract-relationships", "nested page %s", rel)
	}
	assert.Greater(t, nestedPages, 2)
}

func TestAggregateServicePrimaryHrefAndLegacyCompatibility(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/events/v9/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "Event summary", "v9", "orders")
	writeAggregateCatalogSpec(t, root, "services/orders/http/v1/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v1", "orders")
	catalog := buildAggregateCatalogForTest(t, root, nil)
	service := findCatalogService(t, catalog, "orders")
	defaultContract := findCatalogContract(t, service, service.DefaultContractID)
	require.NotNil(t, defaultContract.LatestVersion)

	assert.Equal(t, defaultContract.LatestVersion.OverviewHref, servicePrimaryHref(service))
	assert.Empty(t, catalogServiceSummary(service))
	var html strings.Builder
	require.NoError(t, catalogRootContent(catalog, false).Render(context.Background(), &html))
	assert.Contains(t, html.String(), `href="`+defaultContract.LatestVersion.OverviewHref+`"`)
	assert.Equal(t, "services/orders/index.html", service.OverviewHref)
	assert.Equal(t, "services/orders/versions/index.html", service.VersionsHref)
	require.Len(t, service.Versions, 2)
	for _, version := range service.Versions {
		assert.Equal(t, "services/orders/versions/"+version.Slug+"/index.html", version.OverviewHref)
		for _, entry := range version.Entries {
			assert.Equal(t, "services/orders/versions/"+version.Slug+"/specs/"+entry.Slug, entry.OutputSubdir)
			assert.Equal(t, entry.OutputSubdir+"/index.html", entry.OverviewHref)
		}
	}
}

func TestAggregateCatalogCardVersionPickerUsesDefaultContract(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/events/v9/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v9", "orders")
	writeAggregateCatalogSpec(t, root, "services/orders/http/v1/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v1", "orders")
	writeAggregateCatalogSpec(t, root, "services/orders/http/v2/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v2", "orders")
	catalog := buildAggregateCatalogForTest(t, root, nil)
	service := findCatalogService(t, catalog, "orders")
	defaultContract := findCatalogContract(t, service, service.DefaultContractID)
	require.Equal(t, "Orders HTTP", defaultContract.DisplayName)
	require.Len(t, defaultContract.Versions, 2)
	require.NotNil(t, defaultContract.LatestVersion)

	var html strings.Builder
	require.NoError(t, catalogRootContent(catalog, false).Render(context.Background(), &html))
	rendered := html.String()
	assert.Contains(t, rendered, `>v2 (latest)</sl-button>`)
	for _, version := range defaultContract.Versions {
		assert.Contains(t, rendered, `value="`+version.OverviewHref+`"`)
	}
	var eventsContract *ppmodel.CatalogContract
	for _, contract := range service.Contracts {
		if contract != nil && contract.ID != service.DefaultContractID {
			eventsContract = contract
			break
		}
	}
	require.NotNil(t, eventsContract)
	require.NotNil(t, eventsContract.LatestVersion)
	assert.NotContains(t, rendered, `value="`+eventsContract.LatestVersion.OverviewHref+`"`)
	assert.NotContains(t, rendered, `>v9 (latest)</sl-button>`)
}

func TestAggregateRenderedSiblingContractCompatibility(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/public/openapi.yaml", SpecKindOpenAPI, "Orders HTTP", "", "v1", "orders")
	writeAggregateCatalogSpec(t, root, "services/orders/events/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v1", "orders")
	outputDir := filepath.Join(root, "site")
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner"},
		},
	})
	require.NoError(t, err)
	catalog, err := ap.PressModel()
	require.NoError(t, err)
	service := findCatalogService(t, catalog, "orders")
	require.Len(t, service.Versions, 1)
	require.Len(t, service.Versions[0].Entries, 2)

	_, err = ap.PrintHTML()
	require.NoError(t, err)
	assert.FileExists(t, filepath.Join(outputDir, pppaths.FileIndexHTML))
	assert.DirExists(t, filepath.Join(outputDir, pppaths.AggregateServiceDir(service.Slug)))
	assert.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(service.Versions[0].OverviewHref)))
	versionHTML := readAggregateFile(t, filepath.Join(outputDir, filepath.FromSlash(service.Versions[0].OverviewHref)))
	assert.NotContains(t, versionHTML, "Multiple Specification Entries")
	for _, entry := range service.Versions[0].Entries {
		assert.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(entry.OverviewHref)))
		assert.Contains(t, versionHTML, `href="`+relativeCatalogHref(filepath.ToSlash(filepath.Dir(service.Versions[0].OverviewHref)), entry.OverviewHref)+`"`)
	}
	rootHTML := readAggregateFile(t, filepath.Join(outputDir, pppaths.FileIndexHTML))
	assert.Contains(t, rootHTML, `href="`+servicePrimaryHref(service)+`"`)
}

func TestAggregateContractFinalizationReconcilesSkippedEntries(t *testing.T) {
	t.Run("skipped latest contract version falls back to older visible version", func(t *testing.T) {
		root := t.TempDir()
		writeAggregateCatalogSpec(t, root, "services/orders/specs/v1/public.openapi.yaml", SpecKindOpenAPI, "Public Orders", "", "v1", "")
		writeSwaggerTwoSpec(t, root, "services/orders/specs/v2/public.openapi.yaml", "Public Orders", "v2")
		outputDir := filepath.Join(root, "site")
		ap := newAggregateForSkippedContractTest(t, root, outputDir)
		_, err := ap.PrintHTML()
		require.NoError(t, err)
		service := findCatalogService(t, ap.catalog, "orders")
		require.Len(t, service.Contracts, 1)
		contract := service.Contracts[0]
		require.Len(t, contract.Versions, 1)
		require.NotNil(t, contract.LatestVersion)
		assert.Equal(t, "v1", contract.LatestVersion.Label)
		require.Same(t, contract.Versions[0], contract.LatestVersion)
		require.NotNil(t, service.LatestVersion)
		assert.Equal(t, "v1", service.LatestVersion.Label)
		assert.Equal(t, contract.LatestVersion.OverviewHref, servicePrimaryHref(service))
		assert.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(servicePrimaryHref(service))))
	})

	t.Run("wholly skipped default contract promotes another visible contract", func(t *testing.T) {
		root := t.TempDir()
		writeSwaggerTwoSpec(t, root, "services/orders/public/v2/openapi.yaml", "Public Orders", "v2")
		writeAggregateCatalogSpec(t, root, "services/orders/admin/v1/openapi.yaml", SpecKindOpenAPI, "Admin Orders", "Admin summary", "v1", "")
		outputDir := filepath.Join(root, "site")
		ap := newAggregateForSkippedContractTest(t, root, outputDir)
		_, err := ap.PrintHTML()
		require.NoError(t, err)
		service := findCatalogService(t, ap.catalog, "orders")
		assert.Contains(t, service.DefaultContractID, "admin")
		assert.Equal(t, "Admin Orders", service.DisplayName)
		assert.Equal(t, "Admin summary", service.Summary)
		defaults := 0
		for _, contract := range service.Contracts {
			if contract.Default {
				defaults++
				assert.NotEmpty(t, contract.Versions)
			}
		}
		assert.Equal(t, 1, defaults)
		assert.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(servicePrimaryHref(service))))
	})

	t.Run("all skipped contracts clear visible defaults and hrefs", func(t *testing.T) {
		root := t.TempDir()
		writeSwaggerTwoSpec(t, root, "services/orders/public/v2/openapi.yaml", "Public Orders", "v2")
		writeSwaggerTwoSpec(t, root, "services/orders/admin/v1/openapi.yaml", "Admin Orders", "v1")
		outputDir := filepath.Join(root, "site")
		ap := newAggregateForSkippedContractTest(t, root, outputDir)
		_, err := ap.PrintHTML()
		require.NoError(t, err)
		service := findCatalogService(t, ap.catalog, "orders")
		assert.Empty(t, visibleCatalogVersions(service))
		assert.Nil(t, service.LatestVersion)
		assert.Empty(t, service.DefaultContractID)
		assert.Empty(t, servicePrimaryHref(service))
		assert.Empty(t, service.DisplayName)
		assert.Empty(t, service.Summary)
		for _, contract := range service.Contracts {
			assert.Empty(t, contract.Versions)
			assert.Nil(t, contract.LatestVersion)
			assert.False(t, contract.Default)
		}
		assert.FileExists(t, filepath.Join(outputDir, pppaths.FileIndexHTML))
	})
}

func TestAggregateMetadataJSONPointersUseOrderScalarValuesAndRFC6901Escaping(t *testing.T) {
	metadata, err := parseAggregateSpecMetadata([]byte(`
openapi: 3.1.0
info:
  title: Generic Metadata API
  version: v1
  empty: "  "
  container:
    service: ignored
  x/team:
    "~service": escaped-service
  x-custom-identity: later-service
`), []string{"/info/container", "/info/empty", "/info/x~1team/~0service", "/info/x-custom-identity"})

	require.NoError(t, err)
	assert.Equal(t, "escaped-service", metadata.ServiceIdentityCandidate)
	assert.Empty(t, metadata.Warnings)
}

func TestAggregateMetadataJSONPointersAreGenericAndDoNotHardCodeExtensionNames(t *testing.T) {
	metadata, err := parseAggregateSpecMetadata([]byte(`
openapi: 3.1.0
info:
  title: Generic Metadata API
  version: v1
arbitrary:
  7: forces-generic-map
  ownership:
    service_key: widgets-platform
  primary:
    $ref: z-shared.yaml#/Thing
  nested:
    - $ref: a-shared.yaml#/Thing
    - $ref: z-shared.yaml#/Thing
`), []string{"/arbitrary/ownership/service_key"})

	require.NoError(t, err)
	assert.Equal(t, "widgets-platform", metadata.ServiceIdentityCandidate)
	assert.Equal(t, []string{"a-shared.yaml#/Thing", "z-shared.yaml#/Thing"}, metadata.ExternalRefs)
}

func TestAggregateMetadataCollectsRecursiveExternalRefsSortedAndDeduplicated(t *testing.T) {
	metadata, err := parseAggregateSpecMetadata([]byte(`
openapi: 3.1.0
info:
  title: Refs API
  version: v1
paths:
  /one:
    get:
      responses:
        "200":
          $ref: common.yaml#/responses/OK
components:
  schemas:
    One:
      $ref: "#/components/schemas/Local"
    Two:
      allOf:
        - $ref: common.yaml#/responses/OK
        - nested:
            $ref: https://example.com/contracts/shared.yaml#/Thing
    NonString:
      $ref:
        nested: ignored
`), nil)

	require.NoError(t, err)
	assert.Equal(t, []string{
		"#/components/schemas/Local",
		"common.yaml#/responses/OK",
		"https://example.com/contracts/shared.yaml#/Thing",
	}, metadata.ExternalRefs)
}

func TestAggregateMetadataWarningFallsBackToPathBasedServiceDiscovery(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/orders/specs/openapi.yaml", `
openapi: 3.1.0
info:
  title: Orders API
  version: v1
  x-owner:
    service:
      nested: not-a-scalar
paths: {}
`)

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir: filepath.Join(root, "site"),
		BuildMode: AggregateBuildModeFull,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner/service", "/missing"},
		},
		StateStore: NewMemorySpecStateStore(),
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Services, 1)
	assert.Equal(t, "orders", catalog.Services[0].Key)
	require.NotEmpty(t, catalog.Warnings)
	assert.Contains(t, catalog.Warnings[0].Message, "service identity metadata")
	assert.Contains(t, catalog.Warnings[0].Context, "services/orders/specs/openapi.yaml")
}

func TestAggregateMetadataOptionalForOpenAPISuppressesOnlyOpenAPIMissingMetadataWarning(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/specs/openapi.yaml", SpecKindOpenAPI, "Orders API", "", "v1", "")
	writeAggregateCatalogSpec(t, root, "events/payments/specs/asyncapi.yaml", SpecKindAsyncAPI, "Payments Events", "", "v1", "")
	writeAggregateCatalogSpec(t, root, "services/billing/specs/openapi.yaml", SpecKindOpenAPI, "Billing API", "", "v1", "platform-")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  filepath.Join(root, "site"),
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers:           []string{"/info/x-owner"},
			StripPrefixes:              []string{"platform-"},
			MetadataOptionalForOpenAPI: true,
		},
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Warnings, 2)
	warningsByContext := make(map[string]string, len(catalog.Warnings))
	for _, warning := range catalog.Warnings {
		warningsByContext[warning.Context] = warning.Message
	}
	assert.NotContains(t, warningsByContext, "services/orders/specs/openapi.yaml")
	assert.Contains(t, warningsByContext["events/payments/specs/asyncapi.yaml"], "service identity metadata")
	assert.Contains(t, warningsByContext["services/billing/specs/openapi.yaml"], "normalized to an empty value")
}

func TestAggregatePreferOpenAPISlugAloneKeepsMissingMetadataSplitWarning(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/specs/openapi.yaml", SpecKindOpenAPI, "Orders API", "", "v1", "")
	writeAggregateCatalogSpec(t, root, "events/orders/specs/asyncapi.yaml", SpecKindAsyncAPI, "Orders Events", "", "v1", "billing")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  filepath.Join(root, "site"),
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers:  []string{"/info/x-owner"},
			PreferOpenAPISlug: true,
		},
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Services, 2, "mismatched identities must remain separate services")
	require.Len(t, catalog.Warnings, 1)
	assert.Contains(t, catalog.Warnings[0].Message, "service identity metadata")
	assert.Equal(t, "services/orders/specs/openapi.yaml", catalog.Warnings[0].Context)
}

func TestAggregateMetadataOptionalForOpenAPISuppressesCachedMissingMetadataWarning(t *testing.T) {
	root := t.TempDir()
	writeAggregateCatalogSpec(t, root, "services/orders/specs/openapi.yaml", SpecKindOpenAPI, "Orders API", "", "v1", "")
	store := NewMemorySpecStateStore()
	config := &AggregatePrintingPressConfig{
		OutputDir:      filepath.Join(root, "site"),
		BuildMode:      AggregateBuildModeFast,
		StateNamespace: "test",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers:           []string{"/info/x-owner"},
			MetadataOptionalForOpenAPI: true,
		},
	}

	first, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	firstStats, err := first.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Empty(t, firstStats.Warnings)

	cached, err := store.Load("test")
	require.NoError(t, err)
	record := cached["services/orders/specs/openapi.yaml"]
	require.NotNil(t, record)
	record.ExternalRefs = []string{"cached-only.yaml#/Thing"}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))

	second, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	secondCatalog, err := second.PressModel()
	require.NoError(t, err)
	assert.Empty(t, secondCatalog.Warnings)
	require.Len(t, second.plan.discovered, 1)
	assert.Equal(t, []string{"cached-only.yaml#/Thing"}, second.plan.discovered[0].ExternalRefs, "cached refs prove the second run did not reparse metadata")

	requiredConfig := cloneAggregateConfig(config)
	requiredConfig.OutputDir = filepath.Join(root, "required-site")
	requiredConfig.ServiceIdentity.MetadataOptionalForOpenAPI = false
	third, err := CreateAggregatePrintingPressFromPath(root, requiredConfig)
	require.NoError(t, err)
	thirdCatalog, err := third.PressModel()
	require.NoError(t, err)
	require.Len(t, thirdCatalog.Warnings, 1)
	assert.Contains(t, thirdCatalog.Warnings[0].Message, "service identity metadata")
	require.Len(t, third.plan.discovered, 1)
	assert.Empty(t, third.plan.discovered[0].ExternalRefs, "changing the optional-metadata policy must invalidate cached metadata")
}

func TestAggregateMetadataConfigHashControlsCachedMetadataReparse(t *testing.T) {
	root := t.TempDir()
	content := []byte(`
openapi: 3.1.0
info:
  title: Cache API
  summary: Metadata cache test.
  version: v1
  x-team: newly-parsed-team
  x-other: changed-pointer-team
paths:
  /health:
    get:
      responses:
        "200":
          $ref: common.yaml#/responses/OK
`)
	specPath := writeAggregateSpecDocument(t, root, "services/cache/spec.yaml", string(content))
	content, err := os.ReadFile(specPath)
	require.NoError(t, err)
	store := NewMemorySpecStateStore()
	baseConfig := &AggregatePrintingPressConfig{
		ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"/info/x-team"}},
	}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{{
		RelativePath:             "services/cache/spec.yaml",
		Hash:                     hashSpecBytes(content),
		MetadataConfigHash:       aggregateMetadataConfigHash(baseConfig),
		MetadataVersion:          aggregateMetadataVersion,
		SpecKind:                 SpecKindOpenAPI,
		Title:                    "Cached API",
		Summary:                  "Cached summary.",
		ServiceIdentityCandidate: "cached-team",
		ExternalRefs:             []string{"cached.yaml#/Thing"},
		Version:                  "v1",
	}}))

	unchanged, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:       filepath.Join(root, "unchanged"),
		BuildMode:       AggregateBuildModeFast,
		StateNamespace:  "test",
		StateStore:      store,
		ServiceIdentity: baseConfig.ServiceIdentity,
	})
	require.NoError(t, err)
	unchangedCatalog, err := unchanged.PressModel()
	require.NoError(t, err)
	require.Len(t, unchangedCatalog.Services, 1)
	assert.Equal(t, "cached-team", unchangedCatalog.Services[0].Key)
	require.Len(t, unchanged.plan.discovered, 1)
	assert.Equal(t, []string{"cached.yaml#/Thing"}, unchanged.plan.discovered[0].ExternalRefs)

	changed, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:      filepath.Join(root, "changed"),
		BuildMode:      AggregateBuildModeFast,
		StateNamespace: "test",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-other"},
		},
	})
	require.NoError(t, err)
	changedCatalog, err := changed.PressModel()
	require.NoError(t, err)
	require.Len(t, changedCatalog.Services, 1)
	assert.Equal(t, "changed-pointer-team", changedCatalog.Services[0].Key)
	require.Len(t, changed.plan.discovered, 1)
	assert.Equal(t, []string{"common.yaml#/responses/OK"}, changed.plan.discovered[0].ExternalRefs)
}

func TestAggregateMetadataCachePreservesUnresolvedPointerWarning(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/cache/spec.yaml", `
openapi: 3.1.0
info:
  title: Warning Cache API
  summary: Exercises cached warning replay.
  version: v1
x-contract:
  $ref: "#/components/schemas/Shared"
components:
  schemas:
    Shared:
      type: object
`)
	store := NewMemorySpecStateStore()
	config := &AggregatePrintingPressConfig{
		OutputDir:      filepath.Join(root, "site"),
		BuildMode:      AggregateBuildModeFast,
		StateNamespace: "test",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner/service"},
		},
	}

	first, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	firstStats, err := first.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	require.Len(t, firstStats.Warnings, 1)
	assert.Contains(t, firstStats.Warnings[0].Message, "service identity metadata")

	cached, err := store.Load("test")
	require.NoError(t, err)
	record := cached["services/cache/spec.yaml"]
	require.NotNil(t, record)
	record.ExternalRefs = []string{"cached-only.yaml#/Thing"}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))

	second, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	secondCatalog, err := second.PressModel()
	require.NoError(t, err)
	require.Len(t, secondCatalog.Warnings, 1)
	assert.Equal(t, firstStats.Warnings[0].Message, secondCatalog.Warnings[0].Message)
	assert.Equal(t, firstStats.Warnings[0].Context, secondCatalog.Warnings[0].Context)
	require.Len(t, second.plan.discovered, 1)
	assert.Equal(t, []string{"cached-only.yaml#/Thing"}, second.plan.discovered[0].ExternalRefs, "cached refs prove the second run did not reparse metadata")
}

func TestAggregateMetadataCacheAllowsIntentionallyEmptySummary(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/cache/spec.yaml", `
openapi: 3.1.0
info:
  title: Summary-Free API
  version: v1
  x-service: platform-orders
x-contract:
  $ref: "#/components/schemas/Shared"
components:
  schemas:
    Shared:
      type: object
`)
	store := NewMemorySpecStateStore()
	config := &AggregatePrintingPressConfig{
		OutputDir:      filepath.Join(root, "site"),
		BuildMode:      AggregateBuildModeFast,
		StateNamespace: "test",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-service"},
		},
	}

	first, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	firstStats, err := first.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Empty(t, firstStats.Warnings)

	cached, err := store.Load("test")
	require.NoError(t, err)
	record := cached["services/cache/spec.yaml"]
	require.NotNil(t, record)
	assert.Empty(t, record.Summary)
	record.ServiceIdentityCandidate = "cached-identity"
	record.ExternalRefs = []string{"cached-only.yaml#/Thing"}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))

	second, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	secondCatalog, err := second.PressModel()
	require.NoError(t, err)
	assert.Empty(t, secondCatalog.Warnings)
	require.Len(t, secondCatalog.Services, 1)
	assert.Equal(t, "cached-identity", secondCatalog.Services[0].Key)
	require.Len(t, second.plan.discovered, 1)
	assert.Empty(t, second.plan.discovered[0].Summary)
	assert.Equal(t, "cached-identity", second.plan.discovered[0].ServiceIdentityCandidate)
	assert.Equal(t, []string{"cached-only.yaml#/Thing"}, second.plan.discovered[0].ExternalRefs)
}

func TestAggregateMetadataJSONPointerArrayIndices(t *testing.T) {
	content := []byte(`
openapi: 3.1.0
info:
  title: Array Pointer API
  version: v1
identities:
  - zero-service
  - one-service
`)

	for _, tc := range []struct {
		name      string
		token     string
		candidate string
	}{
		{name: "zero", token: "0", candidate: "zero-service"},
		{name: "one", token: "1", candidate: "one-service"},
	} {
		t.Run("valid "+tc.name, func(t *testing.T) {
			metadata, err := parseAggregateSpecMetadata(content, []string{"/identities/" + tc.token})
			require.NoError(t, err)
			assert.Equal(t, tc.candidate, metadata.ServiceIdentityCandidate)
			assert.Empty(t, metadata.Warnings)
		})
	}

	for _, token := range []string{"+0", "-0", "00", "01", "", "-1", "+1", "one", "2"} {
		t.Run("invalid "+token, func(t *testing.T) {
			metadata, err := parseAggregateSpecMetadata(content, []string{"/identities/" + token})
			require.NoError(t, err)
			assert.Empty(t, metadata.ServiceIdentityCandidate)
			require.Len(t, metadata.Warnings, 1)
			assert.Contains(t, metadata.Warnings[0], "path-based discovery")
		})
	}
}

func TestAggregateMetadataPersistsCandidateConfigHashAndExternalRefs(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpecDocument(t, root, "services/orders/spec.yaml", `
openapi: 3.1.0
info:
  title: Orders API
  version: v1
  x-owner:
    service: platform-orders-api
paths:
  /orders:
    get:
      responses:
        "200":
          $ref: "#/components/responses/OK"
components:
  responses:
    OK:
      description: OK
`)
	store := NewMemorySpecStateStore()
	config := &AggregatePrintingPressConfig{
		OutputDir:      filepath.Join(root, "site"),
		BuildMode:      AggregateBuildModeFull,
		StateNamespace: "test",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner/service"},
			StripPrefixes:    []string{"platform-"},
			StripSuffixes:    []string{"-api"},
		},
	}
	ap, err := CreateAggregatePrintingPressFromPath(root, config)
	require.NoError(t, err)
	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)

	loaded, err := store.Load("test")
	require.NoError(t, err)
	record := loaded["services/orders/spec.yaml"]
	require.NotNil(t, record)
	assert.Equal(t, aggregateMetadataConfigHash(ap.config), record.MetadataConfigHash)
	assert.Equal(t, "platform-orders-api", record.ServiceIdentityCandidate)
	assert.Equal(t, []string{"#/components/responses/OK"}, record.ExternalRefs)
}

func TestAggregateConfigCloneDeepCopiesServiceIdentityAndContractRoles(t *testing.T) {
	config := &AggregatePrintingPressConfig{
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner/service"},
			StripPrefixes:    []string{"platform-"},
			StripSuffixes:    []string{"-api"},
		},
		ContractRoles: []AggregateContractRoleRule{{Pattern: "**/*.yaml", Role: "events", ContractID: "events", Default: true}},
	}
	cloned := cloneAggregateConfig(config)
	cloned.ServiceIdentity.MetadataPointers[0] = "/changed"
	cloned.ServiceIdentity.StripPrefixes[0] = "changed-"
	cloned.ServiceIdentity.StripSuffixes[0] = "-changed"
	cloned.ContractRoles[0].Pattern = "changed"

	assert.Equal(t, "/info/x-owner/service", config.ServiceIdentity.MetadataPointers[0])
	assert.Equal(t, "platform-", config.ServiceIdentity.StripPrefixes[0])
	assert.Equal(t, "-api", config.ServiceIdentity.StripSuffixes[0])
	assert.Equal(t, "**/*.yaml", config.ContractRoles[0].Pattern)
}

func TestAggregatePrintingPress_IncludesSourceSpecPerEntry(t *testing.T) {
	root := t.TempDir()
	relativePath := "services/users/specs/openapi.yaml"
	writeAggregateSpec(t, root, relativePath, "Users API", "v1")
	outputDir := filepath.Join(root, "site")

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:   outputDir,
		BuildMode:   AggregateBuildModeFull,
		IncludeSpec: true,
		StateStore:  NewMemorySpecStateStore(),
	})
	require.NoError(t, err)
	catalog, err := ap.PressModel()
	require.NoError(t, err)
	users := findCatalogService(t, catalog, "users")
	require.NotNil(t, users.LatestVersion)
	require.Len(t, users.LatestVersion.Entries, 1)
	entry := users.LatestVersion.Entries[0]

	_, err = ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true, JSON: true})
	require.NoError(t, err)
	assert.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(entry.OutputSubdir), "spec", "openapi.yaml"))

	bundleBytes, err := os.ReadFile(filepath.Join(outputDir, filepath.FromSlash(entry.OutputSubdir), pppaths.FileBundleJSON))
	require.NoError(t, err)
	assert.Contains(t, string(bundleBytes), `"href":"spec/openapi.yaml"`)
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

func TestAggregateContractNavigationMixedDepthAndModeMatrix(t *testing.T) {
	for _, tc := range []struct {
		name      string
		assetMode string
		hosted    bool
	}{
		{name: "portable", assetMode: HTMLAssetModePortable},
		{name: "hosted", assetMode: HTMLAssetModeServed, hosted: true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			root := t.TempDir()
			writeAggregateSpecWithDetails(t, root, "services/orders/http/v1/openapi.yaml", "Orders HTTP", "", "", "v1")
			writeAggregateSpecWithDetails(t, root, "services/orders/http/v2/openapi.yaml", "Orders HTTP", "", "", "v2")
			writeAggregateAsyncAPISpec(t, root, "services/orders/events/v1/asyncapi.yaml", "Orders Events", "v1")
			writeAggregateAsyncAPISpec(t, root, "services/orders/events/v3/asyncapi.yaml", "Orders Events", "v3")
			outputDir := filepath.Join(root, "site")
			ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
				OutputDir:        outputDir,
				BuildMode:        AggregateBuildModeFull,
				StateStore:       NewMemorySpecStateStore(),
				AssetMode:        tc.assetMode,
				BaseURL:          "/docs/",
				ServiceOverrides: []AggregatePathOverride{{Pattern: "services/orders/**", Value: "orders"}},
				ContractRoles: []AggregateContractRoleRule{
					{Pattern: "**/http/**", Role: "http-api", ContractID: "http", Default: true},
					{Pattern: "**/events/**", Role: "published-events", ContractID: "events"},
				},
			})
			require.NoError(t, err)
			catalog, err := ap.PressModel()
			require.NoError(t, err)
			_, err = ap.PrintHTML()
			require.NoError(t, err)

			service := findCatalogService(t, catalog, "orders")
			assert.Equal(t, "http", service.DefaultContractID)
			httpContract := findCatalogContract(t, service, "http")
			eventsContract := findCatalogContract(t, service, "events")
			require.Len(t, httpContract.Versions, 2)
			require.Len(t, eventsContract.Versions, 2)
			require.NotNil(t, httpContract.LatestVersion)
			require.NotNil(t, eventsContract.LatestVersion)
			assert.Equal(t, "v2", httpContract.LatestVersion.Label)
			assert.Equal(t, "v3", eventsContract.LatestVersion.Label)

			matrix := []struct {
				contract *ppmodel.CatalogContract
				label    string
				deep     []string
			}{
				{httpContract, "API OVERVIEW", []string{"operations/list-health.html", "models/schemas/status.html"}},
				{eventsContract, "EVENT OVERVIEW", []string{"operations/publish-event.html", "models/channels/events.html", "models/messages/event-message.html"}},
			}
			for _, item := range matrix {
				for _, version := range item.contract.Versions {
					entry := version.Entry
					require.NotNil(t, entry)
					pages := append([]string{"index.html"}, item.deep...)
					for _, page := range pages {
						relPage := filepath.ToSlash(filepath.Join(entry.OutputSubdir, page))
						rendered := readAggregateFile(t, filepath.Join(outputDir, filepath.FromSlash(relPage)))
						assert.Equal(t, item.label, aggregateBodyAttribute(t, rendered, "data-pp-overview-label"), relPage)
						assert.Equal(t, entry.Version, aggregateBodyAttribute(t, rendered, "data-pp-current-version"), relPage)
						assert.Equal(t, "/docs/"+strings.TrimSuffix(entry.OutputSubdir, "/")+"/", aggregateBodyAttribute(t, rendered, "data-pp-base-url"), relPage)

						var groups []*ppmodel.SiteContractGroup
						require.NoError(t, json.Unmarshal([]byte(aggregateBodyAttribute(t, rendered, "data-pp-contracts")), &groups), relPage)
						require.Len(t, groups, 2, relPage)
						assert.Equal(t, []ppmodel.ContractRoleValue{ppmodel.ContractRoleHTTPAPI, ppmodel.ContractRolePublishedEvents},
							[]ppmodel.ContractRoleValue{groups[0].Role, groups[1].Role}, relPage)
						var activeContractCount int
						for _, group := range groups {
							for _, link := range group.Contracts {
								target := contractOverviewForLink(t, service, link)
								assertContractHrefResolves(t, outputDir, relPage, aggregateBodyAttribute(t, rendered, "data-pp-base-url"), link.Href, target, tc.hosted)
								if !link.Active {
									continue
								}
								activeContractCount++
								assert.Equal(t, entry.ContractID, link.ID, relPage)
								assert.Equal(t, entry.Version, link.CurrentVersion, relPage)
								assert.Equal(t, entry.OverviewHref, target, relPage)
								activeVersionCount := 0
								for _, versionLink := range link.Versions {
									versionTarget := contractVersionOverviewForLabel(t, item.contract, versionLink.Label)
									assertContractHrefResolves(t, outputDir, relPage, aggregateBodyAttribute(t, rendered, "data-pp-base-url"), versionLink.Href, versionTarget, tc.hosted)
									if versionLink.Active {
										activeVersionCount++
										assert.Equal(t, entry.Version, versionLink.Label, relPage)
									}
								}
								assert.Equal(t, 1, activeVersionCount, relPage)
							}
						}
						assert.Equal(t, 1, activeContractCount, relPage)
					}
				}
			}
		})
	}
}

func aggregateBodyAttribute(t *testing.T, rendered, name string) string {
	t.Helper()
	prefix := name + `="`
	start := strings.Index(rendered, prefix)
	if start < 0 {
		return ""
	}
	start += len(prefix)
	end := strings.Index(rendered[start:], `"`)
	require.GreaterOrEqual(t, end, 0, name)
	return stdhtml.UnescapeString(rendered[start : start+end])
}

func contractOverviewForLink(t *testing.T, service *ppmodel.CatalogService, link *ppmodel.SiteContractLink) string {
	t.Helper()
	contract := findCatalogContract(t, service, link.ID)
	if link.Active {
		return contractVersionOverviewForLabel(t, contract, link.CurrentVersion)
	}
	require.NotNil(t, contract.LatestVersion)
	return contract.LatestVersion.OverviewHref
}

func contractVersionOverviewForLabel(t *testing.T, contract *ppmodel.CatalogContract, label string) string {
	t.Helper()
	for _, version := range contract.Versions {
		if version != nil && version.Label == label {
			return version.OverviewHref
		}
	}
	t.Fatalf("missing version %q in contract %q", label, contract.ID)
	return ""
}

func assertContractHrefResolves(t *testing.T, outputDir, relPage, pageBase, href, target string, hosted bool) {
	t.Helper()
	pageURL := &url.URL{Scheme: "https", Host: "docs.example", Path: "/docs/" + relPage}
	docBase := pageURL
	if pageBase != "" {
		docBase = pageURL.ResolveReference(&url.URL{Path: pageBase})
	}
	resolved := docBase.ResolveReference(&url.URL{Path: href})
	localRel := strings.TrimPrefix(resolved.Path, "/docs/")
	assert.Equal(t, target, localRel)
	localTarget := filepath.Join(outputDir, filepath.FromSlash(localRel))
	require.FileExists(t, localTarget)
	if hosted {
		assert.Equal(t, "/docs/"+target, resolved.Path)
	}
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

func TestAggregatePrintingPress_PressModel_OmitsUnsupportedAsyncAPI2FromCatalogAndState(t *testing.T) {
	root := t.TempDir()
	writeAggregateSpec(t, root, "services/users/src/specs/usersv1.yaml", "Users API", "v1")
	writeAggregateAsyncAPI2Spec(t, root, "services/events/specs/asyncapi.yaml", "Legacy Events", "v1")
	outputDir := filepath.Join(root, "site")
	store := NewMemorySpecStateStore()

	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:               outputDir,
		BuildMode:               AggregateBuildModeFull,
		StateStore:              store,
		StateNamespace:          "test",
		NoiseSegments:           []string{"src", "specs"},
		DisableSkippedRendering: false,
	})
	require.NoError(t, err)

	catalog, err := ap.PressModel()
	require.NoError(t, err)
	require.Len(t, catalog.Warnings, 1)
	assert.Contains(t, catalog.Warnings[0].Message, "unsupported AsyncAPI 2.x")
	assert.Contains(t, catalog.Warnings[0].Context, "services/events/specs/asyncapi.yaml")
	assert.NotContains(t, catalogServiceKeys(catalog), "events")

	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{HTML: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.Specs)

	loaded, err := store.Load("test")
	require.NoError(t, err)
	assert.Contains(t, loaded, "services/users/src/specs/usersv1.yaml")
	assert.NotContains(t, loaded, "services/events/specs/asyncapi.yaml")
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
		{name: "include spec", config: &AggregatePrintingPressConfig{IncludeSpec: true}},
		{name: "entry config fingerprint", config: &AggregatePrintingPressConfig{EntryConfigFingerprint: "diagnostics-v1"}},
		{name: "service metadata pointers", config: &AggregatePrintingPressConfig{ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"/info/x-owner/service"}}}},
		{name: "service strip prefixes", config: &AggregatePrintingPressConfig{ServiceIdentity: AggregateServiceIdentityConfig{StripPrefixes: []string{"platform-"}}}},
		{name: "service strip suffixes", config: &AggregatePrintingPressConfig{ServiceIdentity: AggregateServiceIdentityConfig{StripSuffixes: []string{"-api"}}}},
		{name: "prefer openapi slug", config: &AggregatePrintingPressConfig{ServiceIdentity: AggregateServiceIdentityConfig{PreferOpenAPISlug: true}}},
		{name: "metadata optional for openapi", config: &AggregatePrintingPressConfig{ServiceIdentity: AggregateServiceIdentityConfig{MetadataOptionalForOpenAPI: true}}},
		{name: "contract role pattern", config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{{Pattern: "**/*.yaml", Role: "events"}}}},
		{name: "contract role value", config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{{Role: "http-api"}}}},
		{name: "contract role contract id", config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{{Role: "events", ContractID: "event-stream"}}}},
		{name: "contract role default", config: &AggregatePrintingPressConfig{ContractRoles: []AggregateContractRoleRule{{Role: "events", Default: true}}}},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			assert.NotEqual(t, baseHash, normalizedAggregateEntryConfigHash(t, tc.config))
		})
	}
}

func TestAggregateMetadataConfigHashIncludesMetadataWarningPolicy(t *testing.T) {
	base := &AggregatePrintingPressConfig{
		ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"/info/x-owner/service"}},
	}
	baseHash := aggregateMetadataConfigHash(base)
	assert.NotEqual(t, "", baseHash)
	assert.NotEqual(t, baseHash, aggregateMetadataConfigHash(&AggregatePrintingPressConfig{
		ServiceIdentity: AggregateServiceIdentityConfig{MetadataPointers: []string{"/info/x-team/service"}},
	}))
	assert.NotEqual(t, baseHash, aggregateMetadataConfigHash(&AggregatePrintingPressConfig{
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers:           []string{"/info/x-owner/service"},
			MetadataOptionalForOpenAPI: true,
		},
	}))
	assert.Equal(t, baseHash, aggregateMetadataConfigHash(&AggregatePrintingPressConfig{
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers:  []string{"/info/x-owner/service"},
			StripPrefixes:     []string{"platform-"},
			StripSuffixes:     []string{"-api"},
			PreferOpenAPISlug: true,
		},
		ContractRoles: []AggregateContractRoleRule{{Pattern: "**/*.yaml", Role: "events", ContractID: "events", Default: true}},
	}))
}

func TestMemorySpecStateStoreDeepCopiesExternalRefs(t *testing.T) {
	store := NewMemorySpecStateStore()
	record := &SpecStateRecord{
		RelativePath: "spec.yaml",
		ExternalRefs: []string{"common.yaml#/Thing"},
		MessageHrefs: map[string]string{"#/components/messages/Order~1Created": "models/messages/order-created-2.html"},
		OutputSubdir: "services/users/versions/v1/specs/users-api",
	}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))
	record.ExternalRefs[0] = "mutated-original"
	record.MessageHrefs["#/components/messages/Order~1Created"] = "mutated-original"

	loaded, err := store.Load("test")
	require.NoError(t, err)
	assert.Equal(t, []string{"common.yaml#/Thing"}, loaded["spec.yaml"].ExternalRefs)
	assert.Equal(t, map[string]string{"#/components/messages/Order~1Created": "models/messages/order-created-2.html"}, loaded["spec.yaml"].MessageHrefs)
	loaded["spec.yaml"].ExternalRefs[0] = "mutated-load"
	loaded["spec.yaml"].MessageHrefs["#/components/messages/Order~1Created"] = "mutated-load"

	reloaded, err := store.Load("test")
	require.NoError(t, err)
	assert.Equal(t, []string{"common.yaml#/Thing"}, reloaded["spec.yaml"].ExternalRefs)
	assert.Equal(t, map[string]string{"#/components/messages/Order~1Created": "models/messages/order-created-2.html"}, reloaded["spec.yaml"].MessageHrefs)
	assert.Equal(t, record.OutputSubdir, reloaded["spec.yaml"].HTMLOutputSubdir)
	assert.Equal(t, record.OutputSubdir, reloaded["spec.yaml"].JSONOutputSubdir)
	assert.Equal(t, record.OutputSubdir, reloaded["spec.yaml"].LLMOutputSubdir)
}

func TestAggregateEntryRenderConfigHashIncludesSpecKind(t *testing.T) {
	baseHash := normalizedAggregateEntryConfigHash(t, &AggregatePrintingPressConfig{})

	openapiHash := aggregateEntryRenderConfigHash(baseHash, false, nil, "", SpecKindOpenAPI)
	asyncapiHash := aggregateEntryRenderConfigHash(baseHash, false, nil, "", SpecKindAsyncAPI)

	assert.NotEqual(t, baseHash, openapiHash, "spec kind should invalidate legacy aggregate render/config hashes once")
	assert.NotEqual(t, openapiHash, asyncapiHash)
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

func TestSQLiteSpecStateStore_RoundTripsMetadataRecords(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "state.db")
	store, err := NewSQLiteSpecStateStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	record := &SpecStateRecord{
		RelativePath:             "services/users/spec.yaml",
		Hash:                     "abc123",
		ConfigHash:               "cfg-123",
		HTMLCompletionHash:       "html-123",
		JSONCompletionHash:       "json-123",
		LLMCompletionHash:        "llm-123",
		HTMLOutputSubdir:         "html/location",
		JSONOutputSubdir:         "json/location",
		LLMOutputSubdir:          "llm/location",
		MetadataConfigHash:       "metadata-cfg-123",
		MetadataVersion:          aggregateMetadataVersion,
		SpecKind:                 SpecKindAsyncAPI,
		Title:                    "Users API",
		Summary:                  "Core account resources.",
		ContactName:              "API Support",
		ContactEmail:             "support@example.com",
		ServiceIdentityCandidate: "users-platform",
		ExternalRefs:             []string{"common.yaml#/Error", "#/components/schemas/User", "common.yaml#/Error"},
		MessageHrefs:             map[string]string{"#/components/messages/Order~1Created": "models/messages/order-created-2.html"},
		ServiceKey:               "users",
		DisplayName:              "Users API",
		Version:                  "v1",
		Format:                   "yaml",
		OutputSubdir:             "services/users/versions/v1/specs/users-api",
		UpdatedAt:                time.Now().UTC().Round(time.Second),
	}
	require.NoError(t, store.Upsert("test", []*SpecStateRecord{record}))

	loaded, err := store.Load("test")
	require.NoError(t, err)
	require.Contains(t, loaded, record.RelativePath)
	assert.Equal(t, record.Hash, loaded[record.RelativePath].Hash)
	assert.Equal(t, record.ConfigHash, loaded[record.RelativePath].ConfigHash)
	assert.Equal(t, record.HTMLCompletionHash, loaded[record.RelativePath].HTMLCompletionHash)
	assert.Equal(t, record.JSONCompletionHash, loaded[record.RelativePath].JSONCompletionHash)
	assert.Equal(t, record.LLMCompletionHash, loaded[record.RelativePath].LLMCompletionHash)
	assert.Equal(t, record.HTMLOutputSubdir, loaded[record.RelativePath].HTMLOutputSubdir)
	assert.Equal(t, record.JSONOutputSubdir, loaded[record.RelativePath].JSONOutputSubdir)
	assert.Equal(t, record.LLMOutputSubdir, loaded[record.RelativePath].LLMOutputSubdir)
	assert.Equal(t, record.MetadataConfigHash, loaded[record.RelativePath].MetadataConfigHash)
	assert.Equal(t, record.MetadataVersion, loaded[record.RelativePath].MetadataVersion)
	assert.Equal(t, record.SpecKind, loaded[record.RelativePath].SpecKind)
	assert.Equal(t, record.Summary, loaded[record.RelativePath].Summary)
	assert.Equal(t, record.ContactName, loaded[record.RelativePath].ContactName)
	assert.Equal(t, record.ContactEmail, loaded[record.RelativePath].ContactEmail)
	assert.Equal(t, record.ServiceIdentityCandidate, loaded[record.RelativePath].ServiceIdentityCandidate)
	assert.Equal(t, []string{"#/components/schemas/User", "common.yaml#/Error"}, loaded[record.RelativePath].ExternalRefs)
	assert.Equal(t, record.MessageHrefs, loaded[record.RelativePath].MessageHrefs)
	assert.Equal(t, record.OutputSubdir, loaded[record.RelativePath].OutputSubdir)
	var storedRefs, storedMessageHrefs string
	require.NoError(t, store.(*sqliteSpecStateStore).db.QueryRow(
		`SELECT external_refs, message_hrefs FROM spec_state WHERE namespace = ? AND relative_path = ?`,
		"test", record.RelativePath,
	).Scan(&storedRefs, &storedMessageHrefs))
	assert.Equal(t, `["#/components/schemas/User","common.yaml#/Error"]`, storedRefs)
	assert.Equal(t, `{"#/components/messages/Order~1Created":"models/messages/order-created-2.html"}`, storedMessageHrefs)

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
	assert.Equal(t, "", loaded["services/users/spec.yaml"].HTMLCompletionHash)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].JSONCompletionHash)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].LLMCompletionHash)
	assert.Equal(t, "services/users/versions/v1/specs/users-api", loaded["services/users/spec.yaml"].HTMLOutputSubdir)
	assert.Equal(t, "services/users/versions/v1/specs/users-api", loaded["services/users/spec.yaml"].JSONOutputSubdir)
	assert.Equal(t, "services/users/versions/v1/specs/users-api", loaded["services/users/spec.yaml"].LLMOutputSubdir)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].MetadataConfigHash)
	assert.Equal(t, 0, loaded["services/users/spec.yaml"].MetadataVersion)
	assert.Equal(t, SpecKindOpenAPI, loaded["services/users/spec.yaml"].SpecKind)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].Summary)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].ContactName)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].ContactEmail)
	assert.Equal(t, "", loaded["services/users/spec.yaml"].ServiceIdentityCandidate)
	assert.Empty(t, loaded["services/users/spec.yaml"].ExternalRefs)
	assert.Empty(t, loaded["services/users/spec.yaml"].MessageHrefs)

	legacyLocation := "services/users/versions/v1/specs/users-api"
	var htmlLocation, jsonLocation, llmLocation string
	require.NoError(t, store.(*sqliteSpecStateStore).db.QueryRow(
		`SELECT html_output_subdir, json_output_subdir, llm_output_subdir FROM spec_state WHERE namespace = ? AND relative_path = ?`,
		"legacy", "services/users/spec.yaml",
	).Scan(&htmlLocation, &jsonLocation, &llmLocation))
	assert.Equal(t, legacyLocation, htmlLocation)
	assert.Equal(t, legacyLocation, jsonLocation)
	assert.Equal(t, legacyLocation, llmLocation)

	writeAggregateCatalogSpec(t, filepath.Dir(dbPath), "services/users/spec.yaml", SpecKindOpenAPI, "Users API", "", "v1", "new-users")
	outputDir := filepath.Join(filepath.Dir(dbPath), "site")
	legacyOutput := filepath.Join(outputDir, filepath.FromSlash(legacyLocation))
	require.NoError(t, os.MkdirAll(legacyOutput, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(legacyOutput, pppaths.FileIndexHTML), []byte("legacy html"), 0o644))
	require.NoError(t, os.WriteFile(filepath.Join(legacyOutput, pppaths.FileLLMIndex), []byte("legacy llm"), 0o644))
	writeLegacyAggregate := func(relPath string) {
		absPath := filepath.Join(outputDir, filepath.FromSlash(relPath))
		require.NoError(t, os.MkdirAll(filepath.Dir(absPath), 0o755))
		require.NoError(t, os.WriteFile(absPath, []byte("legacy aggregate"), 0o644))
	}
	oldHTMLVersion := pppaths.AggregateVersionIndexHTML("users", "v1")
	oldJSONService := pppaths.AggregateServiceIndexJSON("users")
	oldJSONVersions := pppaths.AggregateServiceVersionsIndexJSON("users")
	oldJSONVersion := pppaths.AggregateVersionIndexJSON("users", "v1")
	oldLLMService := pppaths.AggregateServiceLLM("users")
	oldLLMVersion := pppaths.AggregateVersionLLM("users", "v1")
	for _, relPath := range []string{oldHTMLVersion, oldJSONService, oldJSONVersions, oldJSONVersion, oldLLMService, oldLLMVersion} {
		writeLegacyAggregate(relPath)
	}
	ap, err := CreateAggregatePrintingPressFromPath(filepath.Dir(dbPath), &AggregatePrintingPressConfig{
		OutputDir:      outputDir,
		BuildMode:      AggregateBuildModeFast,
		StateNamespace: "legacy",
		StateStore:     store,
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner"},
		},
	})
	require.NoError(t, err)
	stats, err := ap.PrintSelectedOutputs(AggregateRenderOptions{JSON: true})
	require.NoError(t, err)
	assert.Equal(t, 1, stats.ChangedSpecs)
	currentLocation := catalogEntryIndex(ap.catalog)["services/users/spec.yaml"].OutputSubdir
	require.NotEqual(t, legacyLocation, currentLocation)
	require.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(currentLocation), pppaths.FileBundleJSON))
	require.FileExists(t, filepath.Join(legacyOutput, pppaths.FileIndexHTML))
	require.FileExists(t, filepath.Join(legacyOutput, pppaths.FileLLMIndex))
	require.NoFileExists(t, filepath.Join(outputDir, filepath.FromSlash(oldJSONService)))
	require.NoFileExists(t, filepath.Join(outputDir, filepath.FromSlash(oldJSONVersions)))
	require.NoFileExists(t, filepath.Join(outputDir, filepath.FromSlash(oldJSONVersion)))
	require.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(oldHTMLVersion)))
	require.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(oldLLMService)))
	require.FileExists(t, filepath.Join(outputDir, filepath.FromSlash(oldLLMVersion)))

	loaded, err = store.Load("legacy")
	require.NoError(t, err)
	assert.Empty(t, loaded["services/users/spec.yaml"].HTMLCompletionHash)
	assert.NotEmpty(t, loaded["services/users/spec.yaml"].JSONCompletionHash)
	assert.Empty(t, loaded["services/users/spec.yaml"].LLMCompletionHash)
	assert.Equal(t, legacyLocation, loaded["services/users/spec.yaml"].HTMLOutputSubdir)
	assert.Equal(t, currentLocation, loaded["services/users/spec.yaml"].JSONOutputSubdir)
	assert.Equal(t, legacyLocation, loaded["services/users/spec.yaml"].LLMOutputSubdir)
	require.NoError(t, store.(*sqliteSpecStateStore).db.QueryRow(
		`SELECT html_output_subdir, json_output_subdir, llm_output_subdir FROM spec_state WHERE namespace = ? AND relative_path = ?`,
		"legacy", "services/users/spec.yaml",
	).Scan(&htmlLocation, &jsonLocation, &llmLocation))
	assert.Equal(t, legacyLocation, htmlLocation)
	assert.Equal(t, currentLocation, jsonLocation)
	assert.Equal(t, legacyLocation, llmLocation)
}

func TestSQLiteSpecStateStore_MigratesPreMetadataSchema(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "pre-metadata-state.db")
	db, err := sql.Open("sqlite", dbPath)
	require.NoError(t, err)

	_, err = db.Exec(`
		CREATE TABLE spec_state (
			namespace TEXT NOT NULL,
			relative_path TEXT NOT NULL,
			hash TEXT NOT NULL,
			config_hash TEXT,
			metadata_version INTEGER,
			spec_kind TEXT,
			title TEXT,
			summary TEXT,
			contact_name TEXT,
			contact_email TEXT,
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
			namespace, relative_path, hash, config_hash, metadata_version, spec_kind, title, summary,
			contact_name, contact_email, service_key, display_name, version, format, output_subdir, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, "pre-metadata", "services/users/spec.yaml", "abc123", "cfg-123", 2, "asyncapi", "Users Events", "User lifecycle events.",
		"API Support", "support@example.com", "users", "Users Events", "v1", "yaml", "services/users/versions/v1/specs/users-events", time.Now().UTC().Format(time.RFC3339Nano))
	require.NoError(t, err)
	require.NoError(t, db.Close())

	store, err := NewSQLiteSpecStateStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	loaded, err := store.Load("pre-metadata")
	require.NoError(t, err)
	record := loaded["services/users/spec.yaml"]
	require.NotNil(t, record)
	assert.Equal(t, "abc123", record.Hash)
	assert.Equal(t, "cfg-123", record.ConfigHash)
	assert.Equal(t, 2, record.MetadataVersion)
	assert.Equal(t, SpecKindAsyncAPI, record.SpecKind)
	assert.Equal(t, "Users Events", record.Title)
	assert.Equal(t, "User lifecycle events.", record.Summary)
	assert.Equal(t, "", record.MetadataConfigHash)
	assert.Equal(t, "", record.HTMLCompletionHash)
	assert.Equal(t, "", record.JSONCompletionHash)
	assert.Equal(t, "", record.LLMCompletionHash)
	assert.Equal(t, "services/users/versions/v1/specs/users-events", record.HTMLOutputSubdir)
	assert.Equal(t, "services/users/versions/v1/specs/users-events", record.JSONOutputSubdir)
	assert.Equal(t, "services/users/versions/v1/specs/users-events", record.LLMOutputSubdir)
	assert.Equal(t, "", record.ServiceIdentityCandidate)
	assert.Empty(t, record.ExternalRefs)
	assert.Empty(t, record.MessageHrefs)
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

func writeAggregateAsyncAPISpec(t *testing.T, root, relPath, title, version string) string {
	t.Helper()
	spec := strings.TrimSpace(`
asyncapi: 3.0.0
info:
  title: `+strconv.Quote(title)+`
  version: `+strconv.Quote(version)+`
channels:
  events:
    address: events.{id}
operations:
  publishEvent:
    action: send
    channel:
      $ref: '#/channels/events'
    messages:
      - $ref: '#/components/messages/EventMessage'
components:
  messages:
    EventMessage:
      name: EventMessage
      payload:
        $ref: '#/components/schemas/Event'
  schemas:
    Event:
      type: object
      properties:
        id:
          type: string
`) + "\n"
	return writeAggregateSpecDocument(t, root, relPath, spec)
}

func writeAggregateCatalogSpec(t *testing.T, root, relPath string, kind SpecKind, title, summary, version, owner string) string {
	t.Helper()
	var document strings.Builder
	if kind.IsAsyncAPI() {
		document.WriteString("asyncapi: 3.0.0\n")
	} else {
		document.WriteString("openapi: 3.1.0\n")
	}
	document.WriteString("info:\n")
	document.WriteString("  title: " + strconv.Quote(title) + "\n")
	if summary != "" {
		document.WriteString("  summary: " + strconv.Quote(summary) + "\n")
	}
	document.WriteString("  version: " + strconv.Quote(version) + "\n")
	if owner != "" {
		document.WriteString("  x-owner: " + strconv.Quote(owner) + "\n")
	}
	if kind.IsAsyncAPI() {
		document.WriteString("channels: {}\noperations: {}\ncomponents: {}\n")
	} else {
		document.WriteString("paths: {}\n")
	}
	return writeAggregateSpecDocument(t, root, relPath, document.String())
}

func newAggregateForCatalogTest(t *testing.T, root string, roles []AggregateContractRoleRule) *AggregatePrintingPress {
	t.Helper()
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  filepath.Join(root, "site"),
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceIdentity: AggregateServiceIdentityConfig{
			MetadataPointers: []string{"/info/x-owner"},
		},
		ContractRoles: roles,
	})
	require.NoError(t, err)
	return ap
}

func buildAggregateCatalogForTest(t *testing.T, root string, roles []AggregateContractRoleRule) *ppmodel.CatalogSite {
	t.Helper()
	catalog, err := newAggregateForCatalogTest(t, root, roles).PressModel()
	require.NoError(t, err)
	return catalog
}

func newAggregateForSkippedContractTest(t *testing.T, root, outputDir string) *AggregatePrintingPress {
	t.Helper()
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:  outputDir,
		BuildMode:  AggregateBuildModeFull,
		StateStore: NewMemorySpecStateStore(),
		ServiceOverrides: []AggregatePathOverride{
			{Pattern: "services/orders/**", Value: "orders"},
		},
	})
	require.NoError(t, err)
	return ap
}

func findCatalogContract(t *testing.T, service *ppmodel.CatalogService, id string) *ppmodel.CatalogContract {
	t.Helper()
	for _, contract := range service.Contracts {
		if contract.ID == id {
			return contract
		}
	}
	require.FailNow(t, "catalog contract not found", "id=%s", id)
	return nil
}

func aggregateContractForDefaultTest(id, title, relPath, version string) *aggregateContractGroup {
	spec := &aggregateDiscoveredSpec{Title: title, RelativePath: relPath}
	contractVersion := &aggregateContractVersionGroup{label: version, spec: spec}
	return &aggregateContractGroup{
		id:          id,
		displayName: title,
		specKind:    SpecKindAsyncAPI,
		role:        ppmodel.ContractRoleEvents,
		versions:    []*aggregateContractVersionGroup{contractVersion},
		latest:      contractVersion,
	}
}

func writeAggregateAsyncAPI2Spec(t *testing.T, root, relPath, title, version string) string {
	t.Helper()
	spec := strings.TrimSpace(`
asyncapi: 2.6.0
info:
  title: `+strconv.Quote(title)+`
  version: `+strconv.Quote(version)+`
channels: {}
`) + "\n"
	return writeAggregateSpecDocument(t, root, relPath, spec)
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

func catalogServiceKeys(catalog *ppmodel.CatalogSite) []string {
	if catalog == nil {
		return nil
	}
	keys := make([]string, 0, len(catalog.Services))
	for _, service := range catalog.Services {
		if service == nil {
			continue
		}
		keys = append(keys, service.Key)
	}
	return keys
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

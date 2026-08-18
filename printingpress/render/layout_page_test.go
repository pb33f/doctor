package render

import (
	"bytes"
	"context"
	"encoding/json"
	stdhtml "html"
	"io"
	"strings"
	"testing"

	"github.com/a-h/templ"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func TestLayoutPageRelationshipOverviewRendering(t *testing.T) {
	header := &ppmodel.SiteHeaderContext{Relationships: []*ppmodel.SiteContractRelationship{
		{Relation: "consumes-from", Label: `Consumes from <Published & Events>`, Href: "../../target/index.html", SpecKind: ppmodel.SpecKindValueAsyncAPI},
		{Relation: "references", Label: "References Shared API", Href: "../../shared/index.html", SpecKind: ppmodel.SpecKindValueOpenAPI},
	}}

	overview := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:       "Consumer",
		SiteTitle:       "Consumer",
		HeaderContext:   header,
		IsEntryOverview: true,
	})
	assertInOrder(t, overview, "Consumes from &lt;Published &amp; Events&gt;", "References Shared API")
	for _, expected := range []string{
		`<div class="pp-operations-overview pp-contract-relationships">`,
		`<h2>RELATED CONTRACTS</h2>`,
		`<ul class="pp-operation-list">`,
		`href="../../target/index.html"`,
		`href="../../shared/index.html"`,
	} {
		if !strings.Contains(overview, expected) {
			t.Fatalf("expected overview relationship markup to contain %q", expected)
		}
	}
	if strings.Contains(overview, `<Published & Events>`) {
		t.Fatalf("relationship label was not escaped")
	}

	nested := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:     "Operation",
		SiteTitle:     "Consumer",
		ActiveSlug:    "consume-event",
		BaseURL:       "../",
		HeaderContext: header,
	})
	if strings.Contains(nested, "pp-contract-relationships") {
		t.Fatalf("did not expect relationships on nested pages")
	}

	emptySlugIndex := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:     "Models",
		SiteTitle:     "Consumer",
		HeaderContext: header,
	})
	if strings.Contains(emptySlugIndex, "pp-contract-relationships") {
		t.Fatalf("did not expect relationships on an empty-slug non-overview page")
	}
}

func TestLayoutPageRelationshipAttributeEscaping(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle: "Consumer", SiteTitle: "Consumer", IsEntryOverview: true,
		HeaderContext: &ppmodel.SiteHeaderContext{Relationships: []*ppmodel.SiteContractRelationship{
			{Label: `<img src=x onerror="alert(1)">`, Href: `target.html" onmouseover="alert(1)`},
		}},
	})
	if strings.Contains(html, `onmouseover="alert(1)`) || strings.Contains(html, `<img src=x`) {
		t.Fatalf("relationship markup was not escaped: %s", html)
	}
	for _, escaped := range []string{`target.html&#34; onmouseover=&#34;alert(1)`, `&lt;img src=x onerror=&#34;alert(1)&#34;&gt;`} {
		if !strings.Contains(html, escaped) {
			t.Fatalf("expected escaped relationship value %q", escaped)
		}
	}
}

func TestLayoutPageContractNavigationAttributesAndFallback(t *testing.T) {
	header := &ppmodel.SiteHeaderContext{
		OverviewLabel: "EVENT OVERVIEW",
		ContractGroups: []*ppmodel.SiteContractGroup{{
			Role:  ppmodel.ContractRolePublishedEvents,
			Label: "Published Events",
			Contracts: []*ppmodel.SiteContractLink{{
				ID: "orders-published", Label: `Orders <Published>`, SpecKind: ppmodel.SpecKindValueAsyncAPI,
				Href: "index.html", Active: true, CurrentVersion: `v2 & "current"`,
				Versions: []*ppmodel.SiteVersionLink{{Label: "v2", Href: "index.html", Active: true}},
			}, {
				ID: "orders-http", Label: "Orders HTTP", SpecKind: ppmodel.SpecKindValueOpenAPI,
				Href: "../../../v3/specs/orders-http/index.html",
			}},
		}},
	}

	rendered := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle: "Orders Published", SiteTitle: "Orders", HeaderContext: header,
	})
	for _, expected := range []string{
		`data-pp-overview-label="EVENT OVERVIEW"`,
		`data-pp-contracts="[{&#34;role&#34;:&#34;published-events&#34;`,
		`Orders &lt;Published&gt;`,
		`class="pp-nav-fallback-contracts"`,
		`EVENT OVERVIEW`,
	} {
		if !strings.Contains(rendered, expected) {
			t.Fatalf("expected contract navigation output to contain %q", expected)
		}
	}
	if strings.Contains(rendered, `Orders <Published>`) || strings.Contains(rendered, `v2 & "current"`) {
		t.Fatalf("contract navigation values were not escaped")
	}
	const contractAttr = `data-pp-contracts="`
	start := strings.Index(rendered, contractAttr)
	if start < 0 {
		t.Fatalf("contract JSON attribute was not rendered")
	}
	start += len(contractAttr)
	end := strings.Index(rendered[start:], `"`)
	if end < 0 {
		t.Fatalf("contract JSON attribute was not terminated")
	}
	var roundTrip []*ppmodel.SiteContractGroup
	if err := json.Unmarshal([]byte(stdhtml.UnescapeString(rendered[start:start+end])), &roundTrip); err != nil {
		t.Fatalf("contract JSON attribute did not round-trip: %v", err)
	}
	if got := roundTrip[0].Contracts[0].CurrentVersion; got != `v2 & "current"` {
		t.Fatalf("contract JSON attribute changed current version: %q", got)
	}

	legacy := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle: "Orders", SiteTitle: "Orders",
		HeaderContext: &ppmodel.SiteHeaderContext{OverviewLabel: "API OVERVIEW"},
	})
	if !strings.Contains(legacy, `data-pp-overview-label="API OVERVIEW"`) {
		t.Fatalf("expected overview label for single-contract navigation")
	}
	if strings.Contains(legacy, `data-pp-contracts=`) || strings.Contains(legacy, `class="pp-nav-fallback-contracts"`) {
		t.Fatalf("single-contract navigation must retain the compact fallback")
	}
}

func TestLayoutPageContractFallbackRequiresExactlyOneActiveContract(t *testing.T) {
	tests := []struct {
		name         string
		firstActive  bool
		secondActive bool
	}{
		{name: "no active contract"},
		{name: "multiple active contracts", firstActive: true, secondActive: true},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			rendered := renderLayoutPageForTest(t, LayoutPageParams{
				PageTitle: "Orders",
				SiteTitle: "Orders",
				HeaderContext: &ppmodel.SiteHeaderContext{
					OverviewLabel: "EVENT OVERVIEW",
					ContractGroups: []*ppmodel.SiteContractGroup{{
						Role:  ppmodel.ContractRolePublishedEvents,
						Label: "Published Events",
						Contracts: []*ppmodel.SiteContractLink{
							{ID: "orders", Label: "Orders", SpecKind: ppmodel.SpecKindValueOpenAPI, Href: "index.html", Active: test.firstActive},
							{ID: "events", Label: "Events", SpecKind: ppmodel.SpecKindValueAsyncAPI, Href: "events.html", Active: test.secondActive},
						},
					}},
				},
			})

			if strings.Contains(rendered, `class="pp-nav-fallback-contracts"`) {
				t.Fatalf("ambiguous contract ownership must not wrap the local fallback")
			}
			for _, expected := range []string{
				`<div class="pp-nav-fallback-home">EVENT OVERVIEW</div>`,
				`<div class="pp-nav-fallback-section"><h4>Operations</h4>`,
				`<div class="pp-nav-fallback-section"><h4>Models</h4>`,
			} {
				if !strings.Contains(rendered, expected) {
					t.Fatalf("ordinary local fallback missing %q", expected)
				}
			}
		})
	}
}

func assertInOrder(t *testing.T, value string, expected ...string) {
	t.Helper()
	previous := -1
	for _, item := range expected {
		index := strings.Index(value, item)
		if index < 0 || index <= previous {
			t.Fatalf("expected %q after prior item in %q", item, value)
		}
		previous = index
	}
}

func TestLayoutPageDeveloperModeFallbackIncludesDiagnostics(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:     "Train Travel",
		SiteTitle:     "Train Travel",
		DeveloperMode: true,
	})

	if !strings.Contains(html, `data-pp-developer-mode="true"`) {
		t.Fatalf("expected developer mode body attribute in rendered layout")
	}
	if !strings.Contains(html, `<div class="pp-nav-fallback-home diagnostics">DIAGNOSTICS</div>`) {
		t.Fatalf("expected diagnostics row in pre-hydration nav fallback")
	}
}

func TestLayoutPageDefaultFallbackOmitsDiagnostics(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle: "Train Travel",
		SiteTitle: "Train Travel",
	})

	if strings.Contains(html, `data-pp-developer-mode="true"`) {
		t.Fatalf("did not expect developer mode body attribute in rendered layout")
	}
	if strings.Contains(html, `<div class="pp-nav-fallback-home diagnostics">DIAGNOSTICS</div>`) {
		t.Fatalf("did not expect diagnostics row in default nav fallback")
	}
	if strings.Contains(html, `<div class="host-archive-controls pp-nav-fallback-archive">`) {
		t.Fatalf("did not expect archive controls in default nav fallback")
	}
	if strings.Contains(html, `<div class="pp-nav-fallback-section pp-nav-fallback-guides"><h4>Guides</h4>`) {
		t.Fatalf("did not expect guides placeholder without content pages")
	}
}

func TestLayoutPageContentFallbackIncludesGuides(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:       "Train Travel",
		SiteTitle:       "Train Travel",
		HasContentPages: true,
	})

	if !strings.Contains(html, `data-has-content-pages="true"`) {
		t.Fatalf("expected content page hint on nav element")
	}
	if !strings.Contains(html, `<div class="pp-nav-fallback-section pp-nav-fallback-guides"><h4>Guides</h4>`) {
		t.Fatalf("expected guides placeholder in content page fallback")
	}
}

func TestLayoutPageSharedAssetBaseURLAttribute(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:          "Train Travel",
		SiteTitle:          "Train Travel",
		SharedAssetBaseURL: "/ppress/static/v1/",
	})

	if !strings.Contains(html, `data-pp-shared-asset-base-url="/ppress/static/v1/"`) {
		t.Fatalf("expected shared asset base URL on html element")
	}
}

func TestLayoutPageHeadParamsAdjustsRelativeSharedAssetBaseWithoutBaseHref(t *testing.T) {
	params := LayoutPageParams{
		BaseURL:            "../",
		StaticAssetBaseURL: "../",
		SharedAssetBaseURL: "../../../../../../static",
	}

	head := params.headParams()
	if head.SharedAssetBaseURL != "../../../../../../../static" {
		t.Fatalf("expected page-aware shared asset base, got %q", head.SharedAssetBaseURL)
	}
}

func TestLayoutPageHeadParamsKeepsRelativeSharedAssetBaseWithBaseHref(t *testing.T) {
	params := LayoutPageParams{
		BaseURL:            "../",
		EmitBaseHref:       true,
		SharedAssetBaseURL: "../../../../../../static",
	}

	head := params.headParams()
	if head.SharedAssetBaseURL != "../../../../../../static" {
		t.Fatalf("expected root-relative shared asset base when base href is active, got %q", head.SharedAssetBaseURL)
	}
}

func TestLayoutPageArchiveExportURLAttribute(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:        "Train Travel",
		SiteTitle:        "Train Travel",
		ArchiveExportURL: "/_printing-press/export",
	})

	if !strings.Contains(html, `data-archive-export-url="/_printing-press/export"`) {
		t.Fatalf("expected archive export URL on nav element")
	}
	for _, expected := range []string{
		`<div class="host-archive-controls pp-nav-fallback-archive">`,
		`EXPORT DOCUMENTATION`,
		`DIAGNOSTICS?`,
		`AI DOCS?`,
		`<div class="pp-nav-fallback-archive-select">ZIP</div>`,
		`<div class="pp-nav-fallback-archive-button">EXPORT</div>`,
	} {
		if !strings.Contains(html, expected) {
			t.Fatalf("expected archive controls fallback to contain %q", expected)
		}
	}
}

func TestSharedNavPreviewHonorsDeveloperMode(t *testing.T) {
	if !strings.Contains(bootstrapSharedNavCacheSource, `function developerMode()`) {
		t.Fatalf("expected shared nav preview bootstrap to detect developer mode")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `DIAGNOSTICS`) {
		t.Fatalf("expected shared nav preview bootstrap to render diagnostics row")
	}
}

func TestSharedNavPreviewUsesConsistentChevrons(t *testing.T) {
	if !strings.Contains(bootstrapSharedNavCacheSource, `function renderPreviewChevron`) {
		t.Fatalf("expected shared nav preview bootstrap to centralize chevron rendering")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `pp-nav-preview-chevron-`) ||
		!strings.Contains(bootstrapSharedNavCacheSource, `(open ? 'down' : 'right')`) {
		t.Fatalf("expected shared nav preview bootstrap to render chevrons by state class")
	}
	if strings.Contains(bootstrapSharedNavCacheSource, `<span class='nav-home-chevron'>`) {
		t.Fatalf("did not expect shared nav preview bootstrap to use literal home chevron text")
	}
	for _, oldChevron := range []string{`'▾'`, `'▸'`} {
		if strings.Contains(bootstrapSharedNavCacheSource, oldChevron) {
			t.Fatalf("did not expect shared nav preview bootstrap to use literal chevron %s", oldChevron)
		}
	}
}

func TestSharedNavPreviewSupportsAsyncAPIComponents(t *testing.T) {
	for _, expected := range []string{
		`function renderProtocol(protocol)`,
		`<pp-asyncapi-protocol protocol='`,
		`op.specKind === 'asyncapi'`,
		`<pp-asyncapi-action action='`,
		`tag.protocols.map(renderProtocol)`,
		`model.protocols.map(renderProtocol)`,
	} {
		if !strings.Contains(bootstrapSharedNavCacheSource, expected) {
			t.Fatalf("expected shared nav preview bootstrap to contain %q", expected)
		}
	}
}

func TestSharedNavPreviewIncludesArchiveFallback(t *testing.T) {
	if !strings.Contains(bootstrapSharedNavCacheSource, `function archiveExportURLForPreview`) {
		t.Fatalf("expected shared nav preview bootstrap to resolve archive export URL")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `navEl.getAttribute('data-archive-export-url')`) {
		t.Fatalf("expected shared nav preview bootstrap to preserve live archive export URL")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `function renderArchiveControlsPreview`) {
		t.Fatalf("expected shared nav preview bootstrap to render archive controls fallback")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `data-archive-export-url`) {
		t.Fatalf("expected shared nav preview bootstrap to detect archive export URL")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `pp-nav-fallback-archive`) {
		t.Fatalf("expected shared nav preview bootstrap to include archive fallback markup")
	}
}

func TestSharedNavPreviewDefersContractRenderingToServerAndComponent(t *testing.T) {
	if !strings.Contains(bootstrapSharedNavCacheSource, `data.ppContracts`) {
		t.Fatalf("expected shared nav preview bootstrap to detect contract-aware pages")
	}
	for _, obsolete := range []string{
		`function normalizePreviewVersions`,
		`function normalizePreviewContractGroups`,
		`function contractGroupsForPreview`,
		`function overviewLabelForPreview`,
		`function renderContractNavigationPreview`,
	} {
		if strings.Contains(bootstrapSharedNavCacheSource, obsolete) {
			t.Fatalf("contract-aware preview rendering must be deferred; found %q", obsolete)
		}
	}
}

func renderLayoutPageForTest(t *testing.T, params LayoutPageParams) string {
	t.Helper()

	var buf bytes.Buffer
	err := LayoutPage(params, templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		_, err := io.WriteString(w, `<section>body</section>`)
		return err
	})).Render(context.Background(), &buf)
	if err != nil {
		t.Fatalf("render layout page: %v", err)
	}
	return buf.String()
}

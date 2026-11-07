package render

import (
	"encoding/json"
	stdhtml "html"
	"strings"
	"testing"

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

func TestLayoutPageContractNavigationAttributesAndMarkup(t *testing.T) {
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
		`<nav class="contract-navigation" aria-label="Service contracts">`,
		`<li class="contract-item active"><div class="contract-row"><a class="contract-link active"`,
		`<div class="contract-local-navigation"><a class="nav-home active"`,
		`EVENT OVERVIEW</a>`,
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
	if strings.Contains(legacy, `data-pp-contracts=`) || strings.Contains(legacy, `contract-navigation`) {
		t.Fatalf("single-contract navigation must not draw contract navigation")
	}
}

func TestLayoutPageContractNavigationRequiresExactlyOneActiveContract(t *testing.T) {
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

			if strings.Contains(rendered, `contract-navigation`) {
				t.Fatalf("ambiguous contract ownership must not wrap the local navigation")
			}
			if !strings.Contains(rendered, `<pp-nav id="pp-nav" data-active="" data-pp-owner="page" data-pp-ssr><a class="nav-home active"`) ||
				!strings.Contains(rendered, `EVENT OVERVIEW</a>`) {
				t.Fatalf("expected the ordinary local navigation")
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

func TestLayoutPageDeveloperModeNavIncludesDiagnostics(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:     "Train Travel",
		SiteTitle:     "Train Travel",
		DeveloperMode: true,
	})

	if !strings.Contains(html, `data-pp-developer-mode="true"`) {
		t.Fatalf("expected developer mode body attribute in rendered layout")
	}
	if !strings.Contains(html, `<a class="nav-home diagnostics" href="diagnostics.html"><wa-icon name="chevron-right" class="nav-home-chevron"></wa-icon>DIAGNOSTICS</a>`) {
		t.Fatalf("expected the diagnostics link in the server-written nav")
	}
}

func TestLayoutPageDefaultNavOmitsDiagnostics(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle: "Train Travel",
		SiteTitle: "Train Travel",
	})

	if strings.Contains(html, `data-pp-developer-mode="true"`) {
		t.Fatalf("did not expect developer mode body attribute in rendered layout")
	}
	for _, unexpected := range []string{`nav-home diagnostics`, `host-archive-controls`, `nav-pages-section`} {
		if strings.Contains(html, unexpected) {
			t.Fatalf("did not expect %q in the default nav", unexpected)
		}
	}
}

func TestLayoutPageContentPagesInNav(t *testing.T) {
	html := renderLayoutPageForTest(t, LayoutPageParams{
		PageTitle:       "Train Travel",
		SiteTitle:       "Train Travel",
		HasContentPages: true,
		ActiveSlug:      "content/welcome",
		Nav: NavMarkupParams{Pages: []*ppmodel.ContentPage{
			{Title: "Welcome", Slug: "welcome", Href: "content/welcome.html"},
		}},
	})

	if !strings.Contains(html, `data-has-content-pages="true"`) {
		t.Fatalf("expected content page hint on nav element")
	}
	if !strings.Contains(html, `<div class="nav-section nav-pages-section"><h4>Guides</h4><ul class="nav-pages-list"><li><a class="nav-page-link active" href="content/welcome.html">`) {
		t.Fatalf("expected the active guide in the server-written nav")
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

func TestLayoutPageSharedAssetBaseAdjustsRelativeSharedAssetBaseWithoutBaseHref(t *testing.T) {
	params := LayoutPageParams{
		BaseURL:            "../",
		StaticAssetBaseURL: "../",
		SharedAssetBaseURL: "../../../../../../static",
	}

	if got := params.headSharedAssetBaseURL(); got != "../../../../../../../static" {
		t.Fatalf("expected page-aware shared asset base, got %q", got)
	}
}

func TestLayoutPageSharedAssetBaseKeepsRelativeSharedAssetBaseWithBaseHref(t *testing.T) {
	params := LayoutPageParams{
		BaseURL:            "../",
		EmitBaseHref:       true,
		SharedAssetBaseURL: "../../../../../../static",
	}

	if got := params.headSharedAssetBaseURL(); got != "../../../../../../static" {
		t.Fatalf("expected root-relative shared asset base when base href is active, got %q", got)
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
		`<div class="host-archive-controls" aria-label="Documentation archive export">`,
		`export documentation`,
		`<sl-checkbox>diagnostics?</sl-checkbox>`,
		`<sl-checkbox>AI docs?</sl-checkbox>`,
		`class="archive-download-button"`,
	} {
		if !strings.Contains(html, expected) {
			t.Fatalf("expected archive controls to contain %q", expected)
		}
	}
}

func renderLayoutPageForTest(t *testing.T, params LayoutPageParams) string {
	t.Helper()

	stack := MustLoadDefaultTheme()
	view, err := APIPageView(params, `<section>body</section>`, stack.AssetDir())
	if err != nil {
		t.Fatalf("build page view: %v", err)
	}
	html, err := stack.RenderString(view)
	if err != nil {
		t.Fatalf("render layout page: %v", err)
	}
	return html
}

// The server writes the nav, so the cache script only hands pp-nav its data:
// it draws no preview of its own.
func TestSharedNavCacheScriptOnlyPassesNavData(t *testing.T) {
	if !strings.Contains(bootstrapSharedNavCacheSource, `navEl.setAttribute('data-pp-nav-cached', 'true')`) {
		t.Fatalf("expected the cache script to pass the nav data to pp-nav")
	}
	for _, removed := range []string{`pp-nav-preview`, `renderNavPreview`, `pp-nav-fallback`} {
		if strings.Contains(bootstrapSharedNavCacheSource, removed) {
			t.Fatalf("the cache script must not draw a nav preview; found %q", removed)
		}
	}
}

package render

import (
	"bytes"
	"context"
	"io"
	"strings"
	"testing"

	"github.com/a-h/templ"
)

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

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

func TestSharedNavPreviewHonorsDeveloperMode(t *testing.T) {
	if !strings.Contains(bootstrapSharedNavCacheSource, `function developerMode()`) {
		t.Fatalf("expected shared nav preview bootstrap to detect developer mode")
	}
	if !strings.Contains(bootstrapSharedNavCacheSource, `DIAGNOSTICS`) {
		t.Fatalf("expected shared nav preview bootstrap to render diagnostics row")
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

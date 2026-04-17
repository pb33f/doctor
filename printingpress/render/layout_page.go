// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"context"
	"encoding/json"
	"io"
	"strings"

	"github.com/a-h/templ"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// LayoutPageParams holds the full page chrome for a rendered HTML page.
type LayoutPageParams struct {
	PageTitle          string
	SiteTitle          string
	BaseURL            string
	AssetBaseURL       string
	ActiveSlug         string
	SpecFormat         string
	AssetMode          string
	SharedDataBase     string
	SharedDataHash     string
	PageDataBase       string
	VizGraphDataBase   string
	VizDiagramDataBase string
	ExtraCSS           []string
	Lite               bool
	HeaderContext      *ppmodel.SiteHeaderContext
}

// LayoutPage renders the shared printing press shell with optional aggregate header context.
func LayoutPage(params LayoutPageParams, content templ.Component) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if _, err := io.WriteString(w, `<!doctype html><html lang="en" class="sl-theme-dark">`); err != nil {
			return err
		}
		if err := Head(params.PageTitle, params.BaseURL, params.AssetBaseURL, params.ExtraCSS, params.Lite).Render(ctx, w); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<body`); err != nil {
			return err
		}
		if err := writeAttr(w, "data-spec-format", params.SpecFormat); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-base-url", params.BaseURL); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-asset-mode", params.AssetMode); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-shared", AssetHref(params.AssetBaseURL, params.SharedDataBase)); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-shared-hash", params.SharedDataHash); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-page", AssetHref(params.AssetBaseURL, params.PageDataBase)); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-viz-graph", AssetHref(params.AssetBaseURL, params.VizGraphDataBase)); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-pp-viz-diagram", AssetHref(params.AssetBaseURL, params.VizDiagramDataBase)); err != nil {
			return err
		}
		if params.HeaderContext != nil {
			if err := writeOptionalAttr(w, "data-pp-catalog-href", params.HeaderContext.CatalogHref); err != nil {
				return err
			}
			if err := writeOptionalAttr(w, "data-pp-overview-href", params.HeaderContext.OverviewHref); err != nil {
				return err
			}
			if err := writeOptionalAttr(w, "data-pp-service-name", params.HeaderContext.ServiceName); err != nil {
				return err
			}
			if err := writeOptionalAttr(w, "data-pp-current-version", params.HeaderContext.CurrentVersion); err != nil {
				return err
			}
			if err := writeOptionalAttr(w, "data-pp-versions-href", params.HeaderContext.VersionsHref); err != nil {
				return err
			}
			if len(params.HeaderContext.Versions) > 0 {
				encoded, err := json.Marshal(params.HeaderContext.Versions)
				if err != nil {
					return err
				}
				if err := writeOptionalAttr(w, "data-pp-versions", string(encoded)); err != nil {
					return err
				}
			}
		}
		if _, err := io.WriteString(w, `><script>(function(){var root=window;var perf=root.__PP_PERF__||(root.__PP_PERF__={start:performance.now(),seq:0});root.__PP_LOG=root.__PP_LOG||function(stage,detail){try{perf.seq=(perf.seq||0)+1;var delta=(performance.now()-perf.start).toFixed(1);if(typeof detail==='undefined'){console.log('[pp-perf #'+perf.seq+' +'+delta+'ms] '+stage);}else{console.log('[pp-perf #'+perf.seq+' +'+delta+'ms] '+stage,detail);}}catch(_){}};root.__PP_LOG('body:start',{path:location.pathname});})();</script><pp-layout data-title="`+templ.EscapeString(params.SiteTitle)+`">`); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<div class="pp-layout-fallback-header" aria-hidden="true"><span class="pp-layout-fallback-caret">$</span><span class="pp-layout-fallback-name">`+templ.EscapeString(params.SiteTitle)+`</span></div>`); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<pp-nav id="pp-nav" slot="nav" data-active="`+templ.EscapeString(params.ActiveSlug)+`">`); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<div class="pp-nav-fallback" aria-hidden="true"><div class="pp-nav-fallback-home">API OVERVIEW</div><div class="pp-nav-fallback-section"><h4>Operations</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:100%;"></div><div class="pp-nav-fallback-row" style="width:92%;"></div><div class="pp-nav-fallback-row" style="width:84%;"></div><div class="pp-nav-fallback-row" style="width:78%;"></div><div class="pp-nav-fallback-row" style="width:88%;"></div><div class="pp-nav-fallback-row" style="width:74%;"></div></div></div><div class="pp-nav-fallback-section"><h4>Models</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:96%;"></div><div class="pp-nav-fallback-row" style="width:86%;"></div><div class="pp-nav-fallback-row" style="width:82%;"></div><div class="pp-nav-fallback-row" style="width:90%;"></div><div class="pp-nav-fallback-row" style="width:76%;"></div><div class="pp-nav-fallback-row" style="width:88%;"></div><div class="pp-nav-fallback-row" style="width:80%;"></div><div class="pp-nav-fallback-row" style="width:72%;"></div></div></div></div></pp-nav>`); err != nil {
			return err
		}
		if err := BootstrapSharedNavCacheScript(params.AssetBaseURL, params.SharedDataBase, params.SharedDataHash).Render(ctx, w); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<main slot="content">`); err != nil {
			return err
		}
		if err := content.Render(ctx, w); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `</main></pp-layout>`); err != nil {
			return err
		}
		if err := BootstrapHydrationScript(params.AssetMode, params.AssetBaseURL, params.SharedDataBase, params.PageDataBase).Render(ctx, w); err != nil {
			return err
		}
		_, err := io.WriteString(w, `<pp-example-drawer></pp-example-drawer></body></html>`)
		return err
	})
}

func writeAttr(w io.Writer, key, value string) error {
	_, err := io.WriteString(w, ` `+key+`="`+templ.EscapeString(value)+`"`)
	return err
}

func writeOptionalAttr(w io.Writer, key, value string) error {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	return writeAttr(w, key, value)
}

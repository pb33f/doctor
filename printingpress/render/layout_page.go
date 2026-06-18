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

// HeadParams holds document-head metadata and static asset roots.
type HeadParams struct {
	Title              string
	BaseURL            string
	EmitBaseHref       bool
	StaticAssetBaseURL string
	SharedAssetBaseURL string
	ExtraCSS           []string
	Lite               bool
}

// LayoutPageParams holds the full page chrome for a rendered HTML page.
type LayoutPageParams struct {
	PageTitle          string
	SiteTitle          string
	BaseURL            string
	AssetBaseURL       string
	StaticAssetBaseURL string
	ActiveSlug         string
	SpecFormat         string
	AssetMode          string
	EmitBaseHref       bool
	SharedDataBase     string
	SharedDataHash     string
	PageDataBase       string
	VizGraphDataBase   string
	VizDiagramDataBase string
	ExtraCSS           []string
	Lite               bool
	NoMermaid          bool
	HeaderContext      *ppmodel.SiteHeaderContext
	Embedded           bool
	DeveloperMode      bool
	DocumentID         string
	DocsExpiresAt      string
	ArchiveExportURL   string
	Footer             *ppmodel.FooterConfig
	SharedAssetBaseURL string
	HasContentPages    bool
}

func (params LayoutPageParams) headParams() HeadParams {
	return HeadParams{
		Title:              params.PageTitle,
		BaseURL:            params.BaseURL,
		EmitBaseHref:       params.EmitBaseHref,
		StaticAssetBaseURL: params.StaticAssetBaseURL,
		SharedAssetBaseURL: params.headSharedAssetBaseURL(),
		ExtraCSS:           params.ExtraCSS,
		Lite:               params.Lite,
	}
}

func (params LayoutPageParams) headSharedAssetBaseURL() string {
	sharedBase := strings.TrimSpace(params.SharedAssetBaseURL)
	if sharedBase == "" || params.EmitBaseHref || params.BaseURL == "" || isLiteralHref(sharedBase) || isLiteralHref(params.BaseURL) {
		return params.SharedAssetBaseURL
	}
	return strings.TrimRight(params.BaseURL, "/") + "/" + strings.TrimLeft(sharedBase, "/")
}

// LayoutPage renders the shared printing press shell with optional aggregate header context.
func LayoutPage(params LayoutPageParams, content templ.Component) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		if _, err := io.WriteString(w, `<!doctype html><html lang="en" class="sl-theme-dark"`); err != nil {
			return err
		}
		if params.Embedded {
			if _, err := io.WriteString(w, ` data-pp-embedded-docs`); err != nil {
				return err
			}
		}
		if err := writeOptionalAttr(w, "data-pp-shared-asset-base-url", params.SharedAssetBaseURL); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `>`); err != nil {
			return err
		}
		if err := Head(params.headParams()).Render(ctx, w); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `<body`); err != nil {
			return err
		}
		if err := writeAttr(w, "data-spec-format", params.SpecFormat); err != nil {
			return err
		}
		if params.Embedded {
			if err := writeOptionalAttr(w, "data-pp-embedded-docs", "true"); err != nil {
				return err
			}
			if err := writeOptionalAttr(w, "data-pp-document-id", params.DocumentID); err != nil {
				return err
			}
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
		if params.DeveloperMode {
			if err := writeOptionalAttr(w, "data-pp-developer-mode", "true"); err != nil {
				return err
			}
		}
		if params.NoMermaid {
			if err := writeOptionalAttr(w, "data-pp-no-mermaid", "true"); err != nil {
				return err
			}
		}
		if err := writeOptionalAttr(w, "data-pp-docs-expires-at", params.DocsExpiresAt); err != nil {
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
		if _, err := io.WriteString(w, `><pp-layout data-title="`+templ.EscapeString(params.SiteTitle)+`"`); err != nil {
			return err
		}
		if params.Embedded {
			if _, err := io.WriteString(w, ` embedded`); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `>`); err != nil {
			return err
		}
		if !params.Embedded {
			if _, err := io.WriteString(w, `<div class="pp-layout-fallback-header" aria-hidden="true"><span class="pp-layout-fallback-caret">$</span><span class="pp-layout-fallback-name">`+templ.EscapeString(params.SiteTitle)+`</span></div>`); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `<pp-nav id="pp-nav" slot="nav" data-active="`+templ.EscapeString(params.ActiveSlug)+`"`); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-docs-expires-at", params.DocsExpiresAt); err != nil {
			return err
		}
		if err := writeOptionalAttr(w, "data-archive-export-url", params.ArchiveExportURL); err != nil {
			return err
		}
		if params.HasContentPages {
			if err := writeOptionalAttr(w, "data-has-content-pages", "true"); err != nil {
				return err
			}
		}
		if _, err := io.WriteString(w, `>`); err != nil {
			return err
		}
		if _, err := io.WriteString(w, navFallbackHTML(params.DocsExpiresAt, params.DeveloperMode, params.ArchiveExportURL, params.HasContentPages)); err != nil {
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
		if err := WriteFooter(w, params.Footer); err != nil {
			return err
		}
		if _, err := io.WriteString(w, `</main></pp-layout>`); err != nil {
			return err
		}
		if err := BootstrapHydrationScript(params.AssetMode, params.AssetBaseURL, params.SharedDataBase, params.PageDataBase).Render(ctx, w); err != nil {
			return err
		}
		if params.Embedded {
			if _, err := io.WriteString(w, embeddedReadyScript); err != nil {
				return err
			}
		}
		_, err := io.WriteString(w, `<pp-example-drawer></pp-example-drawer><pp-problems-drawer></pp-problems-drawer></body></html>`)
		return err
	})
}

const (
	defaultFooterURL       = "https://github.com/pb33f/printing-press"
	defaultFooterLinkTitle = "documentation generated by the printing press"
)

const embeddedReadyScript = `<script>(()=>{if(!window.parent||window.parent===window)return;var targetOrigin;try{targetOrigin=document.referrer?new URL(document.referrer).origin:location.origin}catch(e){targetOrigin=location.origin}var posted=false;var post=function(){if(posted)return;posted=true;try{window.parent.postMessage({type:"ppress:ready"},targetOrigin)}catch(e){}};var nextFrame=function(){return new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve)})})};var waitForHydration=function(){if(document.body&&document.body.dataset.ppHydrated==="true")return Promise.resolve();return new Promise(function(resolve){var finish=function(){document.removeEventListener("pp:hydrated",finish);resolve()};document.addEventListener("pp:hydrated",finish,{once:true})})};var waitForLayout=function(){var el=document.querySelector("pp-layout");if(!el||!window.customElements||!customElements.whenDefined)return Promise.resolve();return customElements.whenDefined("pp-layout").then(function(){el=document.querySelector("pp-layout");var p=el&&el.updateComplete;if(p&&typeof p.then==="function")return p.catch(function(){})}).catch(function(){})};var ready=function(){Promise.all([waitForHydration(),waitForLayout()]).then(nextFrame).then(post,post)};if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",ready,{once:true})}else{ready()}})();</script>`

func navFallbackHTML(docsExpiresAt string, developerMode bool, archiveExportURL string, hasContentPages bool) string {
	expiry := ""
	if strings.TrimSpace(docsExpiresAt) != "" {
		expiry = `<div class="docs-expiry" aria-live="polite">docs expire</div>`
	}
	diagnostics := ""
	if developerMode {
		diagnostics = `<div class="pp-nav-fallback-home diagnostics">DIAGNOSTICS</div>`
	}
	archiveControls := ""
	if strings.TrimSpace(archiveExportURL) != "" {
		archiveControls = navFallbackArchiveControlsHTML()
	}
	guides := ""
	if hasContentPages {
		guides = `<div class="pp-nav-fallback-section pp-nav-fallback-guides"><h4>Guides</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:74%;"></div><div class="pp-nav-fallback-row" style="width:66%;"></div><div class="pp-nav-fallback-row" style="width:58%;"></div><div class="pp-nav-fallback-row" style="width:70%;"></div></div></div>`
	}
	return `<div class="pp-nav-fallback" aria-hidden="true">` + archiveControls + expiry + `<div class="pp-nav-fallback-home">API OVERVIEW</div>` + diagnostics + guides + `<div class="pp-nav-fallback-section"><h4>Operations</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:100%;"></div><div class="pp-nav-fallback-row" style="width:92%;"></div><div class="pp-nav-fallback-row" style="width:84%;"></div><div class="pp-nav-fallback-row" style="width:78%;"></div><div class="pp-nav-fallback-row" style="width:88%;"></div><div class="pp-nav-fallback-row" style="width:74%;"></div></div></div><div class="pp-nav-fallback-section"><h4>Models</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:96%;"></div><div class="pp-nav-fallback-row" style="width:86%;"></div><div class="pp-nav-fallback-row" style="width:82%;"></div><div class="pp-nav-fallback-row" style="width:90%;"></div><div class="pp-nav-fallback-row" style="width:76%;"></div><div class="pp-nav-fallback-row" style="width:88%;"></div><div class="pp-nav-fallback-row" style="width:80%;"></div><div class="pp-nav-fallback-row" style="width:72%;"></div></div></div></div></pp-nav>`
}

func navFallbackArchiveControlsHTML() string {
	return `<div class="host-archive-controls pp-nav-fallback-archive">` +
		`<div class="host-archive-controls-title">EXPORT DOCUMENTATION</div>` +
		`<div class="host-archive-control-row">` +
		`<div class="pp-nav-fallback-archive-option"><span class="pp-nav-fallback-checkbox"></span><span>DIAGNOSTICS?</span></div>` +
		`<div class="pp-nav-fallback-archive-option"><span class="pp-nav-fallback-checkbox"></span><span>AI DOCS?</span></div>` +
		`<div class="pp-nav-fallback-archive-select">ZIP</div>` +
		`<div class="pp-nav-fallback-archive-button">EXPORT</div>` +
		`</div>` +
		`</div>`
}

// WriteFooter renders the configured pb33f footer. A nil config means the
// default footer is enabled; a config with Disabled set suppresses it.
func WriteFooter(w io.Writer, footer *ppmodel.FooterConfig) error {
	if footer != nil && footer.Disabled {
		return nil
	}
	if _, err := io.WriteString(w, `<pb33f-footer fluid`); err != nil {
		return err
	}
	url := defaultFooterURL
	linkTitle := defaultFooterLinkTitle
	build := ""
	if footer != nil {
		if strings.TrimSpace(footer.URL) != "" {
			url = footer.URL
		}
		if strings.TrimSpace(footer.LinkTitle) != "" {
			linkTitle = footer.LinkTitle
		}
		build = footer.Build
	}
	if err := writeOptionalAttr(w, "url", url); err != nil {
		return err
	}
	if err := writeOptionalAttr(w, "link-title", linkTitle); err != nil {
		return err
	}
	if err := writeOptionalAttr(w, "build", build); err != nil {
		return err
	}
	_, err := io.WriteString(w, `></pb33f-footer>`)
	return err
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

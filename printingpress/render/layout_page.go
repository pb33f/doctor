// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"encoding/json"
	"html"
	"html/template"
	"io"
	"path"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/theme"
)

// LayoutPageParams holds the full page chrome for a rendered HTML page.
type LayoutPageParams struct {
	PageTitle          string
	SiteTitle          string
	BaseURL            string
	AssetBaseURL       string
	StaticAssetBaseURL string
	ActiveSlug         string
	IsEntryOverview    bool
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
	Description        string
	MarkdownHref       string
}

func (params LayoutPageParams) headSharedAssetBaseURL() string {
	sharedBase := strings.TrimSpace(params.SharedAssetBaseURL)
	if sharedBase == "" || params.EmitBaseHref || params.BaseURL == "" || isLiteralHref(sharedBase) || isLiteralHref(params.BaseURL) {
		return params.SharedAssetBaseURL
	}
	return strings.TrimRight(params.BaseURL, "/") + "/" + strings.TrimLeft(sharedBase, "/")
}

// APIPageView builds the theme view for one API reference page. The engine's
// wiring (hydration attributes, the pp-nav element, bootstrap scripts) is
// built here; the theme's layout.html places it.
func APIPageView(params LayoutPageParams, content template.HTML, themeAssetDir string) (*theme.PageView, error) {
	var htmlAttrs strings.Builder
	if params.Embedded {
		htmlAttrs.WriteString(` data-pp-embedded-docs`)
	}
	if err := writeOptionalAttr(&htmlAttrs, "data-pp-shared-asset-base-url", params.SharedAssetBaseURL); err != nil {
		return nil, err
	}
	bodyAttrs, err := apiBodyAttrs(params)
	if err != nil {
		return nil, err
	}
	nav, err := apiNav(params)
	if err != nil {
		return nil, err
	}
	var before strings.Builder
	if params.IsEntryOverview && params.HeaderContext != nil && len(params.HeaderContext.Relationships) > 0 {
		if err := writeContractRelationships(&before, params.BaseURL, params.HeaderContext.Relationships); err != nil {
			return nil, err
		}
	}
	var after strings.Builder
	after.WriteString(BootstrapHydrationScript(params.AssetMode, params.AssetBaseURL, params.SharedDataBase, params.PageDataBase))
	if params.Embedded {
		after.WriteString(embeddedReadyScript)
	}
	after.WriteString(`<pp-example-drawer></pp-example-drawer><pp-problems-drawer></pp-problems-drawer>`)

	shared := params.headSharedAssetBaseURL()
	resolve := func(href string) string {
		return SharedAssetHref(shared, params.StaticAssetBaseURL, href)
	}
	extra := make([]string, 0, len(params.ExtraCSS))
	for _, css := range params.ExtraCSS {
		extra = append(extra, resolve(css))
	}
	script := resolve(pppaths.StaticAsset(pppaths.FilePrintingPressJS))
	if params.Lite {
		script = resolve(pppaths.StaticAsset(pppaths.FilePrintingPressLiteJS))
	}
	baseHref := ""
	if params.EmitBaseHref {
		baseHref = params.BaseURL
	}
	return &theme.PageView{
		Shape:    theme.ShapeAPI,
		Embedded: params.Embedded,
		Page: theme.PageInfo{
			Title:        params.PageTitle,
			Description:  params.Description,
			MarkdownHref: params.MarkdownHref,
			HomeHref:     DocHref(params.BaseURL, pppaths.FileIndexHTML),
		},
		Site: theme.SiteInfo{Title: params.SiteTitle},
		Head: theme.NewHeadView(baseHref, extra, script,
			func(name string) string { return resolve(pppaths.StaticAsset(name)) },
			func(name string) string { return resolve(path.Join(themeAssetDir, name)) },
		),
		Footer: footerView(params.Footer),
		Engine: theme.EngineView{
			HTMLAttrs:     template.HTMLAttr(htmlAttrs.String()),
			BodyAttrs:     bodyAttrs,
			Nav:           nav,
			BeforeContent: template.HTML(before.String()),
			AfterBody:     template.HTML(after.String()),
		},
		Content: content,
	}, nil
}

// footerView turns the footer config into the theme's footer view. A nil
// config means the footer is on; themes supply its default link.
func footerView(footer *ppmodel.FooterConfig) theme.FooterView {
	if footer == nil {
		return theme.FooterView{Enabled: true}
	}
	return theme.FooterView{
		Enabled:   !footer.Disabled,
		URL:       strings.TrimSpace(footer.URL),
		LinkTitle: strings.TrimSpace(footer.LinkTitle),
		Build:     footer.Build,
	}
}

// FooterView is footerView for callers outside the render package.
func FooterView(footer *ppmodel.FooterConfig) theme.FooterView {
	return footerView(footer)
}

func apiBodyAttrs(params LayoutPageParams) (template.HTMLAttr, error) {
	var w strings.Builder
	if err := writeAttr(&w, "data-spec-format", params.SpecFormat); err != nil {
		return "", err
	}
	if params.Embedded {
		if err := writeOptionalAttr(&w, "data-pp-embedded-docs", "true"); err != nil {
			return "", err
		}
		if err := writeOptionalAttr(&w, "data-pp-document-id", params.DocumentID); err != nil {
			return "", err
		}
	}
	optional := []struct{ key, value string }{
		{"data-pp-base-url", params.BaseURL},
		{"data-pp-asset-mode", params.AssetMode},
		{"data-pp-shared", AssetHref(params.AssetBaseURL, params.SharedDataBase)},
		{"data-pp-shared-hash", params.SharedDataHash},
		{"data-pp-page", AssetHref(params.AssetBaseURL, params.PageDataBase)},
		{"data-pp-viz-graph", AssetHref(params.AssetBaseURL, params.VizGraphDataBase)},
		{"data-pp-viz-diagram", AssetHref(params.AssetBaseURL, params.VizDiagramDataBase)},
	}
	for _, attr := range optional {
		if err := writeOptionalAttr(&w, attr.key, attr.value); err != nil {
			return "", err
		}
	}
	if params.DeveloperMode {
		if err := writeOptionalAttr(&w, "data-pp-developer-mode", "true"); err != nil {
			return "", err
		}
	}
	if params.NoMermaid {
		if err := writeOptionalAttr(&w, "data-pp-no-mermaid", "true"); err != nil {
			return "", err
		}
	}
	if err := writeOptionalAttr(&w, "data-pp-docs-expires-at", params.DocsExpiresAt); err != nil {
		return "", err
	}
	if header := params.HeaderContext; header != nil {
		headerAttrs := []struct{ key, value string }{
			{"data-pp-catalog-href", header.CatalogHref},
			{"data-pp-overview-href", header.OverviewHref},
			{"data-pp-overview-label", header.OverviewLabel},
			{"data-pp-service-name", header.ServiceName},
			{"data-pp-current-version", header.CurrentVersion},
			{"data-pp-versions-href", header.VersionsHref},
		}
		for _, attr := range headerAttrs {
			if err := writeOptionalAttr(&w, attr.key, attr.value); err != nil {
				return "", err
			}
		}
		if len(header.Versions) > 0 {
			encoded, err := json.Marshal(header.Versions)
			if err != nil {
				return "", err
			}
			if err := writeOptionalAttr(&w, "data-pp-versions", string(encoded)); err != nil {
				return "", err
			}
		}
		if len(header.ContractGroups) > 0 {
			encoded, err := json.Marshal(header.ContractGroups)
			if err != nil {
				return "", err
			}
			if err := writeOptionalAttr(&w, "data-pp-contracts", string(encoded)); err != nil {
				return "", err
			}
		}
	}
	return template.HTMLAttr(w.String()), nil
}

// apiNav is the complete pp-nav element of an API page, with its fallback
// skeleton and the shared nav cache script.
func apiNav(params LayoutPageParams) (template.HTML, error) {
	var w strings.Builder
	w.WriteString(`<pp-nav id="pp-nav" slot="nav" data-active="` + html.EscapeString(params.ActiveSlug) + `"`)
	if err := writeOptionalAttr(&w, "data-docs-expires-at", params.DocsExpiresAt); err != nil {
		return "", err
	}
	if err := writeOptionalAttr(&w, "data-archive-export-url", params.ArchiveExportURL); err != nil {
		return "", err
	}
	if params.HasContentPages {
		if err := writeOptionalAttr(&w, "data-has-content-pages", "true"); err != nil {
			return "", err
		}
	}
	w.WriteString(`>`)
	w.WriteString(navFallbackHTML(params.DocsExpiresAt, params.DeveloperMode, params.ArchiveExportURL, params.HasContentPages, params.HeaderContext))
	w.WriteString(BootstrapSharedNavCacheScript(params.AssetBaseURL, params.SharedDataBase, params.SharedDataHash))
	return template.HTML(w.String()), nil
}

func writeContractRelationships(w io.Writer, baseURL string, relationships []*ppmodel.SiteContractRelationship) error {
	if _, err := io.WriteString(w, `<div class="pp-operations-overview pp-contract-relationships"><h2>RELATED CONTRACTS</h2><ul class="pp-operation-list">`); err != nil {
		return err
	}
	for _, relationship := range relationships {
		if relationship == nil {
			continue
		}
		href := DocHref(baseURL, relationship.Href)
		if _, err := io.WriteString(w, `<li><a class="pp-op-item" href="`+html.EscapeString(href)+`">`+html.EscapeString(relationship.Label)+`</a></li>`); err != nil {
			return err
		}
	}
	_, err := io.WriteString(w, `</ul></div>`)
	return err
}

const embeddedReadyScript = `<script>(()=>{if(!window.parent||window.parent===window)return;var targetOrigin;try{targetOrigin=document.referrer?new URL(document.referrer).origin:location.origin}catch(e){targetOrigin=location.origin}var posted=false;var post=function(){if(posted)return;posted=true;try{window.parent.postMessage({type:"ppress:ready"},targetOrigin)}catch(e){}};var nextFrame=function(){return new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve)})})};var waitForHydration=function(){if(document.body&&document.body.dataset.ppHydrated==="true")return Promise.resolve();return new Promise(function(resolve){var finish=function(){document.removeEventListener("pp:hydrated",finish);resolve()};document.addEventListener("pp:hydrated",finish,{once:true})})};var waitForLayout=function(){var el=document.querySelector("pp-layout");if(!el||!window.customElements||!customElements.whenDefined)return Promise.resolve();return customElements.whenDefined("pp-layout").then(function(){el=document.querySelector("pp-layout");var p=el&&el.updateComplete;if(p&&typeof p.then==="function")return p.catch(function(){})}).catch(function(){})};var ready=function(){Promise.all([waitForHydration(),waitForLayout()]).then(nextFrame).then(post,post)};if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",ready,{once:true})}else{ready()}})();</script>`

func navFallbackHTML(docsExpiresAt string, developerMode bool, archiveExportURL string, hasContentPages bool, header *ppmodel.SiteHeaderContext) string {
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
	overviewLabel := "API OVERVIEW"
	if header != nil && strings.TrimSpace(header.OverviewLabel) != "" {
		overviewLabel = header.OverviewLabel
	}
	local := `<div class="pp-nav-fallback-home">` + html.EscapeString(overviewLabel) + `</div>` + diagnostics + guides + `<div class="pp-nav-fallback-section"><h4>Operations</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:100%;"></div><div class="pp-nav-fallback-row" style="width:92%;"></div><div class="pp-nav-fallback-row" style="width:84%;"></div><div class="pp-nav-fallback-row" style="width:78%;"></div><div class="pp-nav-fallback-row" style="width:88%;"></div><div class="pp-nav-fallback-row" style="width:74%;"></div></div></div><div class="pp-nav-fallback-section"><h4>Models</h4><div class="pp-nav-fallback-list"><div class="pp-nav-fallback-row" style="width:96%;"></div><div class="pp-nav-fallback-row" style="width:86%;"></div><div class="pp-nav-fallback-row" style="width:82%;"></div><div class="pp-nav-fallback-row" style="width:90%;"></div><div class="pp-nav-fallback-row" style="width:76%;"></div><div class="pp-nav-fallback-row" style="width:88%;"></div><div class="pp-nav-fallback-row" style="width:80%;"></div><div class="pp-nav-fallback-row" style="width:72%;"></div></div></div>`
	if hasMultiContractFallback(header) {
		local = navFallbackContractGroupsHTML(header, local)
	}
	return `<div class="pp-nav-fallback" aria-hidden="true">` + archiveControls + expiry + local + `</div></pp-nav>`
}

func hasMultiContractFallback(header *ppmodel.SiteHeaderContext) bool {
	if header == nil {
		return false
	}
	contractCount := 0
	activeCount := 0
	for _, group := range header.ContractGroups {
		if group == nil {
			continue
		}
		for _, contract := range group.Contracts {
			if contract == nil {
				continue
			}
			contractCount++
			if contract.Active {
				activeCount++
			}
		}
	}
	return contractCount > 1 && activeCount == 1
}

func navFallbackContractGroupsHTML(header *ppmodel.SiteHeaderContext, local string) string {
	var builder strings.Builder
	builder.WriteString(`<div class="pp-nav-fallback-contracts">`)
	if strings.TrimSpace(header.ServiceName) != "" {
		builder.WriteString(`<div class="pp-nav-fallback-service">`)
		builder.WriteString(html.EscapeString(header.ServiceName))
		builder.WriteString(`</div>`)
	}
	for _, group := range header.ContractGroups {
		if group == nil || len(group.Contracts) == 0 {
			continue
		}
		builder.WriteString(`<div class="pp-nav-fallback-contract-group"><h4>`)
		builder.WriteString(html.EscapeString(group.Label))
		builder.WriteString(`</h4>`)
		for _, contract := range group.Contracts {
			if contract == nil {
				continue
			}
			builder.WriteString(`<div class="pp-nav-fallback-home pp-nav-fallback-contract`)
			if contract.Active {
				builder.WriteString(` active`)
			}
			builder.WriteString(`">`)
			builder.WriteString(html.EscapeString(contract.Label))
			builder.WriteString(`</div>`)
			if contract.Active {
				builder.WriteString(`<div class="contract-local-navigation">`)
				builder.WriteString(local)
				builder.WriteString(`</div>`)
			}
		}
		builder.WriteString(`</div>`)
	}
	builder.WriteString(`</div>`)
	return builder.String()
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

func writeAttr(w io.Writer, key, value string) error {
	_, err := io.WriteString(w, ` `+key+`="`+html.EscapeString(value)+`"`)
	return err
}

func writeOptionalAttr(w io.Writer, key, value string) error {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	return writeAttr(w, key, value)
}

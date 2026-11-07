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
	"time"

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
	// Nav is the site's navigation. The page writes the part it shows, so it
	// looks right before any script runs.
	Nav NavMarkupParams
}

// linkBase is the base that links written into the page resolve against.
// With a <base href>, the browser resolves links from the site root, so they
// carry no base of their own.
func (params LayoutPageParams) linkBase() string {
	if params.EmitBaseHref {
		return ""
	}
	return params.BaseURL
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
		Header: apiHeaderView(params),
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

// navActiveScrollScript centres the active model in the navigation column
// before the first paint, as pp-nav-model-group does once it renders.
const navActiveScrollScript = `<script>(function(){var a=document.currentScript.parentElement.querySelector('pp-nav-model-group a.active');if(a)a.scrollIntoView({block:'center'});})();</script>`

// apiNav is the complete pp-nav element of an API page: the navigation it
// shows, written as the component renders it, then the shared nav cache
// script that gives the component its data.
func apiNav(params LayoutPageParams) (template.HTML, error) {
	var w strings.Builder
	w.WriteString(`<pp-nav id="pp-nav" data-active="` + html.EscapeString(params.ActiveSlug) + `"` + ssrAttrs("page"))
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
	nav := params.Nav
	nav.BaseURL = params.linkBase()
	nav.ActiveSlug = params.ActiveSlug
	nav.DeveloperMode = params.DeveloperMode
	nav.Header = params.HeaderContext
	nav.DocsExpiresAt = params.DocsExpiresAt
	nav.ArchiveExportURL = params.ArchiveExportURL
	if nav.Now.IsZero() {
		nav.Now = time.Now()
	}
	writeNavMarkup(&w, nav)
	w.WriteString(`</pp-nav>`)
	w.WriteString(navActiveScrollScript)
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

// apiHeaderView is what the layout header shows beside the site title: where
// the title links, and the version menu.
func apiHeaderView(params LayoutPageParams) theme.HeaderView {
	header := params.HeaderContext
	base := params.linkBase()
	view := theme.HeaderView{TitleHref: DocHref(base, pppaths.FileIndexHTML)}
	if header == nil {
		return view
	}
	if header.CatalogHref != "" {
		view.TitleHref = DocHref(base, header.CatalogHref)
	} else if header.OverviewHref != "" {
		view.TitleHref = DocHref(base, header.OverviewHref)
	}
	if len(header.Versions) == 0 || hasMultiContractFallback(header) {
		return view
	}
	current := ""
	for _, version := range header.Versions {
		if version != nil && (version.Active || version.Label == header.CurrentVersion) {
			current = version.Label
			break
		}
	}
	picker := &theme.VersionPickerView{WrapperClass: "version-picker"}
	for _, version := range header.Versions {
		if version == nil {
			continue
		}
		if current == "" && header.CurrentVersion == "" {
			current = version.Label
		}
		picker.Options = append(picker.Options, theme.VersionOptionView{
			Label: version.Label,
			Href:  DocHref(base, version.Href),
		})
	}
	if current == "" {
		current = header.CurrentVersion
	}
	if current == "" {
		current = "Version"
	}
	picker.Trigger = "Version: " + current
	view.Versions = picker
	return view
}

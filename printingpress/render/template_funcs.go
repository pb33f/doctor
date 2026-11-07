// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"html/template"
	"strings"

	"github.com/pb33f/doctor/printingpress/curl"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/theme"
)

// Funcs are the template functions the engine's page bodies call. Every
// theme gets them, so a theme that replaces a body can build the same links
// and labels.
func Funcs() template.FuncMap {
	return template.FuncMap{
		// raw marks engine-rendered HTML (descriptions, highlighted code) as
		// safe to place.
		"raw":   func(html string) template.HTML { return template.HTML(html) },
		"lower": strings.ToLower,
		// css marks engine-built style values, such as a card grid width, as
		// safe to place in a style attribute.
		"css": func(style string) template.CSS { return template.CSS(style) },
		"add": func(a, b int) int { return a + b },

		// Components written with the markup they render (component_markup.go).
		"iconTitle":        IconTitleMarkup,
		"httpMethod":       HTTPMethodMarkup,
		"operationPath":    OperationPathMarkup,
		"rawViewerButton":  RawViewerButtonMarkup,
		"violationStats":   ViolationStatsMarkup,
		"modelIcon":        func(icon, size string) template.HTML { return ModelIconMarkup(icon, size, "primary", "page") },
		"asyncAPIProtocol": AsyncAPIProtocolMarkup,

		"docHref":            DocHref,
		"operationDocHref":   OperationDocHref,
		"modelHTML":          pppaths.ModelHTML,
		"operationHTML":      pppaths.OperationHTML,
		"modelTypeIndexHTML": pppaths.ModelTypeIndexHTML,
		"componentLinkHref":  componentLinkHref,
		"serverURL":          curl.ResolveServerURL,
		"specURL":            specURL,
		"truncate":           truncateDesc,

		"sourceDisplayPath": sourceDisplayPath,
		"sourceDisplayLine": sourceDisplayLine,

		"opItemClass":             opItemClass,
		"operationNavActionLabel": operationNavActionLabel,
		"operationNavPathLabel":   operationNavPathLabel,
		"operationRootIDLabel":    operationRootIDLabel,
		"asyncAPIAction":          newAsyncAPIActionView,

		"operationPageTitle":              operationPageTitle,
		"operationNavSections":            operationNavSections,
		"operationRawTitle":               operationRawTitle,
		"operationPathClass":              operationPathClass,
		"operationContentSectionTitle":    operationContentSectionTitle,
		"asyncAPIOperationSectionVisible": asyncAPIOperationSectionVisible,
		"codeSampleTabLabel":              codeSampleTabLabel,
		"codeSampleHTML": func(sample *ppmodel.CodeSample) template.HTML {
			return template.HTML(codeSampleHighlightedHTML(sample))
		},

		"asyncAPIModelProtocol":              asyncAPIModelProtocol,
		"shouldRenderAsyncAPITraitProtocols": shouldRenderAsyncAPITraitProtocols,
		"shouldRenderAsyncAPIModelSection":   shouldRenderAsyncAPIModelSection,
		"isAsyncAPIMessagePage":              isAsyncAPIMessagePage,
		"isAsyncAPIReplyPage":                isAsyncAPIReplyPage,
		"isAsyncAPIChannelPage":              isAsyncAPIChannelPage,
		"modelExtensionsSummary":             modelExtensionsSummary,
		"diagnosticsSpecLabel":               diagnosticsSpecLabel,

		"crumbs":        newBreadcrumbArgs,
		"source":        newSourceArgs,
		"tagSection":    newTagSectionArgs,
		"opItem":        newOperationItemArgs,
		"componentRef":  newComponentRefArgs,
		"modelGroup":    newModelGroupArgs,
		"asyncAPIModel": newAsyncAPIModelArgs,
	}
}

// LoadTheme loads a theme with the engine's template functions.
func LoadTheme(selection, siteLayouts string) (*theme.Stack, error) {
	return theme.Load(selection, siteLayouts, Funcs())
}

// MustLoadDefaultTheme loads the default theme. The default theme is embedded
// and tested, so a failure here is a build defect.
func MustLoadDefaultTheme() *theme.Stack {
	stack, err := LoadTheme("", "")
	if err != nil {
		panic(err)
	}
	return stack
}

// BreadcrumbArgs is what api/partials/breadcrumb.html draws.
type BreadcrumbArgs struct {
	Base  string
	Items []BreadcrumbItem
}

func newBreadcrumbArgs(base string, items []BreadcrumbItem) BreadcrumbArgs {
	return BreadcrumbArgs{Base: base, Items: items}
}

// SourceArgs is what api/partials/source.html draws: where a page's content
// is defined, with a fallback path and line when there is no source link.
type SourceArgs struct {
	Source       *ppmodel.SourceRef
	FallbackPath string
	FallbackLine int
	Base         string
}

func newSourceArgs(source *ppmodel.SourceRef, fallbackPath string, fallbackLine int, base string) SourceArgs {
	return SourceArgs{Source: source, FallbackPath: fallbackPath, FallbackLine: fallbackLine, Base: base}
}

// TagSectionArgs is what api/partials/tag-section.html draws: one tag and
// its children, at a depth.
type TagSectionArgs struct {
	Tag   *ppmodel.NavTag
	Depth int
	Base  string
}

func newTagSectionArgs(tag *ppmodel.NavTag, depth int, base string) TagSectionArgs {
	return TagSectionArgs{Tag: tag, Depth: depth, Base: base}
}

// OperationItemArgs is what api/partials/operation-item.html draws.
type OperationItemArgs struct {
	Op   *ppmodel.NavOperation
	Base string
}

func newOperationItemArgs(op *ppmodel.NavOperation, base string) OperationItemArgs {
	return OperationItemArgs{Op: op, Base: base}
}

// ComponentRefArgs is what api/partials/component-ref.html draws. Without
// an Href, the reference is text.
type ComponentRefArgs struct {
	ComponentType string
	Href          string
	Name          string
}

func newComponentRefArgs(componentType, href, name string) ComponentRefArgs {
	return ComponentRefArgs{ComponentType: componentType, Href: href, Name: name}
}

// ModelGroupArgs is what api/partials/model-cards.html draws.
type ModelGroupArgs struct {
	Group *ppmodel.NavModelGroup
	Base  string
}

func newModelGroupArgs(group *ppmodel.NavModelGroup, base string) ModelGroupArgs {
	return ModelGroupArgs{Group: group, Base: base}
}

// AsyncAPIModelArgs is what api/partials/asyncapi-model.html draws.
type AsyncAPIModelArgs struct {
	Info *ppmodel.AsyncAPIModelInfo
	Base string
}

func newAsyncAPIModelArgs(info *ppmodel.AsyncAPIModelInfo, base string) AsyncAPIModelArgs {
	return AsyncAPIModelArgs{Info: info, Base: base}
}

// AsyncAPIActionView is the send or receive badge of an AsyncAPI operation.
type AsyncAPIActionView struct {
	Name  string
	Size  string
	Code  string
	Icon  string
	Label string
	Class string
}

func newAsyncAPIActionView(action, size string) AsyncAPIActionView {
	return AsyncAPIActionView{
		Name:  asyncAPIActionName(action),
		Size:  asyncAPIActionSize(size),
		Code:  asyncAPIActionCode(action),
		Icon:  asyncAPIActionIcon(action),
		Label: asyncAPIActionLabel(action),
		Class: asyncAPIActionFallbackClass(action, size),
	}
}

func opItemClass(deprecated bool) string {
	if deprecated {
		return "pp-op-item deprecated"
	}
	return "pp-op-item"
}

func diagnosticsSpecLabel(page *ppmodel.DiagnosticsPage) string {
	if page == nil || page.SpecLabel == "" {
		return "API"
	}
	return page.SpecLabel
}

// scriptSchemes are the URL schemes that can run code in a page.
var scriptSchemes = []string{"javascript:", "vbscript:", "data:"}

// specURL marks a URL from a specification (a server, a contact, a license,
// external docs) as safe to place. html/template allows only http, https and
// mailto, and a server URL is often kafka://, mqtt:// or wss://; every scheme
// is allowed except those that run code, which become "#".
func specURL(raw string) template.URL {
	scheme := strings.ToLower(strings.Join(strings.Fields(raw), ""))
	for _, blocked := range scriptSchemes {
		if strings.HasPrefix(scheme, blocked) {
			return "#"
		}
	}
	return template.URL(raw)
}

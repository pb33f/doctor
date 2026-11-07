// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"fmt"
	"html"
	"html/template"
	"regexp"
	"strconv"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// The writers in this file write a component together with the markup it
// renders, marked data-pp-ssr, so the page is drawn complete before any script
// runs and nothing moves when the component takes over. Each one mirrors a
// component's template; keep them in step.

// nodeIcons maps a node type to the Bootstrap icon pp-model-icon draws for it.
var nodeIcons = map[string]string{
	"document": "stars", "schema": "box", "schemas": "box", "types": "diagram-3",
	"mediaType": "code-slash", "xml": "code-slash", "header": "envelope", "headers": "envelope",
	"example": "chat-left-quote", "examples": "chat-left-quote", "encoding": "box-seam",
	"requestBody": "box-arrow-in-right", "requestBodies": "box-arrow-in-right",
	"parameter": "braces-asterisk", "parameters": "braces-asterisk", "serverVariable": "braces-asterisk",
	"query": "question-lg", "cookie": "cookie", "link": "link", "links": "link",
	"response": "box-arrow-left", "responses": "box-arrow-left",
	"operation": "gear-wide-connected", "operations": "gear-wide-connected",
	"securityScheme": "shield-lock", "securitySchemes": "shield-lock", "security": "shield-lock",
	"callback": "telephone-outbound", "callbacks": "telephone-outbound", "pathItem": "geo", "pathItems": "geo",
	"server": "hdd-network", "servers": "hdd-network", "paths": "compass", "components": "boxes",
	"contact": "person-circle", "license": "patch-check", "upload": "upload", "info": "info-square",
	"tag": "tag", "tags": "tags", "version": "award", "extensions": "plug", "extension": "plug",
	"webhook": "arrow-clockwise", "webhooks": "arrow-clockwise", "noExample": "exclamation-circle",
	"polymorphic": "diagram-3", "error": "x-square", "warning": "exclamation-triangle",
	"rolodex-dir": "folder", "rolodex-file": "journal-code", "js": "filetype-js", "php": "filetype-php",
	"py": "filetype-py", "html": "filetype-html", "md": "markdown", "java": "filetype-java",
	"externalDocs": "journals", "rb": "filetype-rb", "expand-node": "node-plus", "pov-mode": "binoculars",
}

func iconForNodeType(nodeType string) string {
	if icon, ok := nodeIcons[nodeType]; ok {
		return icon
	}
	return "box"
}

// modelIconMarkup is pp-model-icon as it renders.
func modelIconMarkup(icon, size, color, owner string) string {
	return fmt.Sprintf(`<pp-model-icon icon="%s" size="%s" color="%s"%s><wa-icon name="%s" data-fresh="%s" class="pp-model-icon__icon %s %s"></wa-icon></pp-model-icon>`,
		html.EscapeString(icon), size, color, ssrAttrs(owner), iconForNodeType(icon), html.EscapeString(icon), size, color)
}

// IconTitleMarkup is a page title with its icon: pp-icon-title as it renders.
func IconTitleMarkup(icon, heading string) template.HTML {
	if heading == "" {
		return template.HTML(fmt.Sprintf(`<pp-icon-title icon="%s"></pp-icon-title>`, html.EscapeString(icon)))
	}
	return template.HTML(fmt.Sprintf(`<pp-icon-title icon="%s" heading="%s"%s>%s<h1>%s</h1></pp-icon-title>`,
		html.EscapeString(icon), html.EscapeString(heading), ssrAttrs("page"),
		modelIconMarkup(icon, "huge", "primary", "pp-icon-title"), html.EscapeString(heading)))
}

// HTTPMethodMarkup is the method tag of an operation header: pp-http-method
// as it renders, at its default size.
func HTTPMethodMarkup(method string) template.HTML {
	lower := strings.ToLower(method)
	return template.HTML(fmt.Sprintf(`<pp-http-method method="%s"%s><span class="pp-http-method__tag medium %s"><span class="pp-http-method__label">%s</span></span></pp-http-method>`,
		html.EscapeString(method), ssrAttrs("page"), html.EscapeString(lower), html.EscapeString(strings.ToUpper(method))))
}

var operationPathParameter = regexp.MustCompile(`\{([^}]+)\}`)

// OperationPathMarkup is a path with its slashes and parameters marked:
// pp-render-operation-path as it renders.
func OperationPathMarkup(path string, nowrap bool) template.HTML {
	var w strings.Builder
	slashes := func(text string) {
		for i, piece := range strings.Split(text, "/") {
			if i > 0 {
				w.WriteString(`<span class="slash">/</span>`)
			}
			w.WriteString(html.EscapeString(piece))
		}
	}
	last := 0
	for _, match := range operationPathParameter.FindAllStringSubmatchIndex(path, -1) {
		slashes(path[last:match[0]])
		w.WriteString(`<span class="bracket">{</span><span class="param">` + html.EscapeString(path[match[2]:match[3]]) + `</span><span class="bracket">}</span>`)
		last = match[1]
	}
	slashes(path[last:])
	parts := w.String()
	attrs := ` path="` + html.EscapeString(path) + `"`
	if nowrap {
		attrs += ` nowrap`
		parts = `<div class="pp-render-operation-path__nowrap">` + parts + `</div>`
	}
	return template.HTML(`<pp-render-operation-path` + attrs + ssrAttrs("page") + `>` + parts + `</pp-render-operation-path>`)
}

// RawViewerButtonMarkup is what pp-raw-viewer-btn renders: a button that
// opens the raw object, and its tooltip. id is the component's id.
func RawViewerButtonMarkup(id string) template.HTML {
	return template.HTML(fmt.Sprintf(`<span class="raw-viewer-box"><button type="button" id="%s-button" class="raw-viewer-button" aria-label="VIEW RAW OBJECT"><wa-icon name="braces" aria-hidden="true"></wa-icon></button></span><wa-tooltip for="%s-button">VIEW RAW OBJECT</wa-tooltip>`,
		html.EscapeString(id), html.EscapeString(id)))
}

// ViolationStatsMarkup is a page's lint summary: pp-violation-stats with
// its counts, as it renders in developer mode. With no problems, the element
// draws nothing, as the component does.
func ViolationStatsMarkup(scopeLabel string, counts ppmodel.ViolationCounts) template.HTML {
	attrs := ""
	if scopeLabel != "" {
		attrs = ` data-scope-label="` + html.EscapeString(scopeLabel) + `"`
	}
	if counts.Total() <= 0 {
		return template.HTML(`<pp-violation-stats` + attrs + `></pp-violation-stats>`)
	}
	var w strings.Builder
	w.WriteString(`<pp-violation-stats` + attrs + ssrAttrs("page") + `><div class="stats" role="group" aria-label="Diagnostics">`)
	stat := func(count int, severity, icon, singular, plural string) {
		if count <= 0 {
			return
		}
		label := singular
		if count != 1 {
			label = plural
		}
		fmt.Fprintf(&w, `<div class="stat %s"><wa-icon name="%s" aria-hidden="true"></wa-icon><span class="label">%s</span><span class="violation">%s</span></div>`,
			severity, icon, strconv.Itoa(count), label)
	}
	stat(counts.Errors, "err", "exclamation-square", "error", "errors")
	stat(counts.Warns, "warn", "exclamation-triangle", "warning", "warnings")
	stat(counts.Infos, "info", "info-square", "info", "infos")
	w.WriteString(`<button type="button" class="details-button">OPEN PROBLEMS</button></div></pp-violation-stats>`)
	return template.HTML(w.String())
}

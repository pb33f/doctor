// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"html"
	"slices"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

// refListPageSize is the page size of pp-paginated-list.
const refListPageSize = 20

// refListToolbarMin is the item count above which pp-ref-list shows its
// filter and search toolbar.
const refListToolbarMin = 20

// refTypeLabels are the filter labels pp-ref-list gives component types.
var refTypeLabels = map[string]string{
	"schemas":         "Schemas",
	"responses":       "Responses",
	"parameters":      "Parameters",
	"requestBodies":   "Request Bodies",
	"headers":         "Headers",
	"securitySchemes": "Security Schemes",
	"examples":        "Examples",
	"links":           "Links",
	"callbacks":       "Callbacks",
}

var refMethodOrder = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD", "QUERY", "RECEIVE", "SEND"}

// crossRefs writes pp-cross-refs with the lists pp-ref-list draws for a
// model. The component draws the same markup again when it loads, from
// refs-json, so the lists keep their place.
func (c *contentRenderer) crossRefs(refs *ppmodel.ModelCrossRefs, refsJSON string, minHeight int) string {
	if refs == nil || (len(refs.UsedByOperations) == 0 && len(refs.UsedByModels) == 0 && len(refs.UsesModels) == 0) {
		return ""
	}
	const owner = "pp-cross-refs"
	var w strings.Builder
	fmt.Fprintf(&w, `<pp-cross-refs refs-json="%s" style="display:block;min-height:%dpx;" data-pp-owner="page" data-pp-ssr>`, html.EscapeString(refsJSON), minHeight)
	if len(refs.UsedByOperations) > 0 {
		rows := make([]string, len(refs.UsedByOperations))
		methods := make([]string, 0, len(refs.UsedByOperations))
		for i, op := range refs.UsedByOperations {
			rows[i] = c.operationRefRow(op)
			if method := strings.ToUpper(strings.TrimSpace(op.Method)); method != "" && !slices.Contains(methods, method) {
				methods = append(methods, method)
			}
		}
		slices.SortFunc(methods, compareRefMethods)
		w.WriteString(refList("operations", "Consumed By", rows, methods, owner))
	}
	for _, list := range []struct {
		heading string
		items   []*ppmodel.ComponentRef
	}{{"Referenced By", refs.UsedByModels}, {"References", refs.UsesModels}} {
		if len(list.items) == 0 {
			continue
		}
		rows := make([]string, len(list.items))
		types := make([]string, 0, len(list.items))
		for i, comp := range list.items {
			rows[i] = c.componentRefRow(comp)
			if !slices.Contains(types, comp.ComponentType) {
				types = append(types, comp.ComponentType)
			}
		}
		slices.Sort(types)
		w.WriteString(refList("components", list.heading, rows, types, owner))
	}
	w.WriteString(`</pp-cross-refs>`)
	return w.String()
}

// compareRefMethods orders methods as pp-ref-list orders its filter.
func compareRefMethods(a, b string) int {
	ai, bi := slices.Index(refMethodOrder, a), slices.Index(refMethodOrder, b)
	if ai != -1 || bi != -1 {
		if ai == -1 {
			ai = len(refMethodOrder)
		}
		if bi == -1 {
			bi = len(refMethodOrder)
		}
		return ai - bi
	}
	return strings.Compare(a, b)
}

// refList writes pp-ref-list: its heading, its toolbar when it has more
// than a page of items, and the first page of rows.
func refList(listType, heading string, rows, options []string, owner string) string {
	var w strings.Builder
	fmt.Fprintf(&w, `<pp-ref-list type="%s" heading="%s" data-pp-owner="%s" data-pp-ssr><h2>%s</h2>`, listType, html.EscapeString(heading), owner, html.EscapeString(heading))
	if len(rows) > refListToolbarMin {
		operations := listType == "operations"
		filterLabel, all, placeholder, searchLabel := "Filter by type", "ALL TYPES", "SEARCH NAMES...", "Search components"
		if operations {
			filterLabel, all, placeholder, searchLabel = "Filter by method", "ALL METHODS", "SEARCH OPERATIONS...", "Filter by operation"
		}
		w.WriteString(`<div class="toolbar"><select class="pp-ref-filter" aria-label="` + filterLabel + `"><option value="">` + all + `</option>`)
		for _, option := range options {
			label := option
			if !operations && refTypeLabels[option] != "" {
				label = refTypeLabels[option]
			}
			w.WriteString(`<option value="` + html.EscapeString(option) + `">` + html.EscapeString(label) + `</option>`)
		}
		w.WriteString(`</select><input class="pp-ref-search" type="search" placeholder="` + placeholder + `" aria-label="` + searchLabel + `"></div>`)
	}
	w.WriteString(paginatedList(rows, heading, "pp-ref-list"))
	w.WriteString(`</pp-ref-list>`)
	return w.String()
}

// paginatedList writes pp-paginated-list on its first page, with the
// pp-paginator above it.
func paginatedList(rows []string, label, owner string) string {
	total := len(rows)
	pages := (total + refListPageSize - 1) / refListPageSize
	end := min(refListPageSize, total)
	last := pages <= 1
	hide := ""
	if total <= refListPageSize {
		hide = " hide"
	}
	button := func(class, title, icon, iconLabel string, disabled bool) string {
		attr := ""
		if disabled {
			attr = " disabled"
		}
		return `<wa-button appearance="plain" size="small" class="` + class + `" title="` + title + `"` + attr + `><wa-icon name="` + icon + `" label="` + iconLabel + `"></wa-icon></wa-button>`
	}
	var w strings.Builder
	w.WriteString(`<pp-paginated-list label="` + html.EscapeString(label) + `" data-pp-owner="` + owner + `" data-pp-ssr>`)
	fmt.Fprintf(&w, `<pp-paginator label="%s" data-pp-owner="pp-paginated-list" data-pp-ssr><div class="pp-paginator__bar%s"><div>%s%s</div>`+
		`<div class="location" aria-current="page">Page <strong class="current-page">1</strong> of <strong class="total-pages">%d</strong></div>`+
		`<div class="result-range">%s 1 - %d of <strong class="total"><wa-format-number value="%d"></wa-format-number></strong></div><div>%s%s</div></div></pp-paginator>`,
		html.EscapeString(label), hide,
		button("home", "first page", "chevron-double-left", "First page", true),
		button("previous", "previous page", "chevron-left", "Previous page", true),
		pages, html.EscapeString(label), end, total,
		button("next", "next page", "chevron-right", "Next page", last),
		button("end", "last page", "chevron-double-right", "Last page", last))
	w.WriteString(`<div class="pp-paginated-list__values">` + strings.Join(rows[:end], "") + `</div></pp-paginated-list>`)
	return w.String()
}

func (c *contentRenderer) operationRefRow(op *ppmodel.OperationRef) string {
	const owner = "pp-ref-list"
	method := string(render.HTTPMethodTinyMarkup(op.Method, owner))
	if action := strings.ToLower(strings.TrimSpace(op.Method)); action == "receive" || action == "send" {
		method = string(render.AsyncAPIActionMarkup(action, "small", owner))
	}
	label := string(render.OperationPathMarkupOwned(op.Path, false, owner))
	if id := strings.TrimSpace(op.OperationID); id != "" {
		label = `<span class="operation-ref-title" style="display:block;color:var(--terminal-text);line-height:1;overflow-wrap:anywhere;word-break:break-word;">` + html.EscapeString(id) + `</span>`
	}
	return `<div class="operation-ref-row" style="display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:baseline;column-gap:var(--global-padding);padding:var(--global-padding-half) 0;min-width:0;">` +
		`<span class="operation-ref-method" style="display:inline-flex;align-items:baseline;justify-content:flex-start;min-width:0;line-height:1;">` + method + `</span>` +
		`<a class="operation-ref-link" style="display:block;min-width:0;max-width:100%;color:var(--terminal-text);line-height:1;text-decoration:none;font-family:var(--font-stack),monospace;--op-path-text-decoration:none;" href="` +
		html.EscapeString(render.DocHref(c.base, "operations/"+op.Slug+".html")) + `">` + label + `</a></div>`
}

func (c *contentRenderer) componentRefRow(comp *ppmodel.ComponentRef) string {
	return `<div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">` + string(render.ModelIconMarkup(comp.ComponentType, "medium", "primary", "pp-ref-list")) +
		`<a style="color:var(--terminal-text);text-decoration:none;font-family:var(--font-stack),monospace" href="` +
		html.EscapeString(render.DocHref(c.base, "models/"+comp.TypeSlug+"/"+comp.Slug+".html")) + `"><span aria-hidden="true">➜</span> ` + html.EscapeString(comp.Name) + `</a></div>`
}

// crossRefsMinHeight is the height the page keeps for pp-cross-refs: the
// estimate, or 240px.
func crossRefsMinHeight(page *ppmodel.ModelPage) int {
	if page.EstimatedCrossRefsHeight > 0 {
		return page.EstimatedCrossRefsHeight
	}
	return 240
}

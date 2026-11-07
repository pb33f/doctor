// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"fmt"
	"html"
	"sort"
	"strconv"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

// rawViewerButton writes a pp-raw-viewer-btn with the raw object it opens.
func rawViewerButton(id, title, rawJSON, rawYAML string, line int, location, owner string) string {
	if line <= 0 {
		line = 1
	}
	return `<pp-raw-viewer-btn id="` + html.EscapeString(id) + `" title="` + html.EscapeString(title) + `" raw-json="` + html.EscapeString(rawJSON) +
		`" raw-yaml="` + html.EscapeString(rawYAML) + `" start-line="` + strconv.Itoa(line) + `" location="` + html.EscapeString(location) +
		`" data-pp-owner="` + owner + `" data-pp-ssr>` + string(render.RawViewerButtonMarkup(id)) + `</pp-raw-viewer-btn>`
}

// sortedExamples is a map of named examples in the order JSON.parse gives
// the client: the keys as Go marshals them, sorted.
func sortedExamples(examples map[string]string) []exampleEntry {
	keys := make([]string, 0, len(examples))
	for key := range examples {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	entries := make([]exampleEntry, 0, len(keys))
	for _, key := range keys {
		if examples[key] != "" {
			entries = append(entries, exampleEntry{Key: key, JSON: examples[key]})
		}
	}
	return entries
}

// drawerExamples writes a pp-example-selector in drawer mode: a button, or
// a select with several examples, that opens an example in the drawer. Each
// example is kept in a template for the drawer to read.
func drawerExamples(entries []exampleEntry, owner string) string {
	if len(entries) == 0 {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<pp-example-selector data-pp-owner="` + owner + `" data-pp-ssr><div class="selector">`)
	if len(entries) == 1 {
		label := entries[0].Key
		if label == "" {
			label = "Example"
		}
		w.WriteString(`<button type="button" data-pp-example-show="0">` + html.EscapeString(label) + `</button>`)
	} else {
		w.WriteString(`<select class="pp-example-select" data-pp-example-show aria-label="View example"><option value="" selected disabled>View Example...</option>`)
		for i, entry := range entries {
			label := entry.Key
			if label == "" {
				label = "Example"
			}
			fmt.Fprintf(&w, `<option value="%d">%s</option>`, i, html.EscapeString(label))
		}
		w.WriteString(`</select>`)
	}
	w.WriteString(`</div>`)
	for i, entry := range entries {
		fmt.Fprintf(&w, `<template class="pp-example-data" data-index="%d" data-key="%s">%s</template>`, i, html.EscapeString(entry.Key), html.EscapeString(entry.JSON))
	}
	w.WriteString(`</pp-example-selector>`)
	return w.String()
}

func parameterInIcon(location string) string {
	switch location {
	case "cookie":
		return "cookie"
	case "header":
		return "envelope"
	case "path":
		return "signpost"
	}
	return "question-diamond"
}

// operationParameters writes pp-operation-parameters with a row for each
// parameter.
func (c *contentRenderer) operationParameters(params []*ppmodel.ParameterInfo) string {
	const owner = "pp-operation-parameters"
	var w strings.Builder
	w.WriteString(`<pp-operation-parameters id="pp-operation-parameters" data-pp-owner="page" data-pp-ssr>`)
	for _, p := range params {
		if p == nil {
			continue
		}
		schema := parseContentSchema([]byte(p.SchemaJSON))
		w.WriteString(`<div class="parameter"><div class="param-name-col">`)
		if p.Required {
			w.WriteString(`<span class="required-badge">req</span>`)
		}
		if p.Ref != nil {
			w.WriteString(c.refPopoverLink(p.Ref, p.Name, "ref-link param-name", owner))
		} else {
			w.WriteString(`<span class="param-name">` + html.EscapeString(p.Name) + `</span>`)
		}
		if p.Deprecated {
			w.WriteString(`<span class="deprecated-badge">deprecated</span>`)
		}
		w.WriteString(`</div><div class="param-type-col">`)
		if t := deriveSchemaType(schema); t != "" {
			w.WriteString(`<span class="param-type">` + html.EscapeString(t) + `</span>`)
		}
		w.WriteString(constraintsMarkup(schema, false, ":"))
		w.WriteString(`</div><div class="param-in-col"><wa-icon class="param-in-icon" name="` + parameterInIcon(p.In) + `"></wa-icon><span class="param-in">` +
			html.EscapeString(p.In) + `</span></div>`)
		hasRaw := p.Ref == nil && (p.RawJSON != "" || p.RawYAML != "")
		if hasRaw {
			w.WriteString(`<div class="param-desc-col has-actions"><div class="param-desc-actions">` +
				rawViewerButton(c.nextID("pp-param-raw"), p.Name+" ("+p.In+")", p.RawJSON, p.RawYAML, p.SourceLine, p.Location, owner) + `</div>`)
		} else {
			w.WriteString(`<div class="param-desc-col">`)
		}
		w.WriteString(`<div class="param-desc-body">` + c.markdown(p.Description, "") + `</div></div>`)
		examples := sortedExamples(p.Examples)
		if p.MockJSON != "" {
			examples = append(examples, exampleEntry{JSON: p.MockJSON})
		}
		if hasRaw || len(examples) > 0 {
			w.WriteString(`<div class="param-extras">` + drawerExamples(examples, owner) + `</div>`)
		}
		w.WriteString(`</div>`)
		if len(p.Extensions) > 0 {
			w.WriteString(`<div class="parameter extensions"><div class="param-name-col">&nbsp;</div><div class="param-type-col">&nbsp;</div><div class="param-in-col">&nbsp;</div><div class="param-desc-col"><h4>` +
				html.EscapeString(p.Name) + ` Extensions</h4>` + c.extensions(p.Extensions, owner) + `</div></div>`)
		}
	}
	w.WriteString(`</pp-operation-parameters>`)
	return w.String()
}

// curlCommand writes pp-curl-command with every cURL variant; a select
// chooses one and the first shows.
func curlCommand(curlJSON string) string {
	var variants []*ppmodel.CurlVariant
	if err := json.Unmarshal([]byte(curlJSON), &variants); err != nil || len(variants) == 0 {
		return ""
	}
	label := func(v *ppmodel.CurlVariant, i int) string {
		if v.Label != "" {
			return v.Label
		}
		return "Variant " + strconv.Itoa(i+1)
	}
	var w strings.Builder
	w.WriteString(`<pp-curl-command id="pp-operation-curl" data-pp-owner="page" data-pp-ssr>`)
	if len(variants) > 1 {
		w.WriteString(`<div class="selector-row"><div class="selector"><select class="pp-curl-select" aria-label="cURL variant">`)
		for i, v := range variants {
			fmt.Fprintf(&w, `<option value="%d">%s</option>`, i, html.EscapeString(label(v, i)))
		}
		w.WriteString(`</select></div></div>`)
	}
	for i, v := range variants {
		hidden := ""
		if i > 0 {
			hidden = " hidden"
		}
		fmt.Fprintf(&w, `<pp-terminal-example class="pp-curl-variant" data-index="%d"%s data-pp-owner="pp-curl-command" data-pp-ssr><button type="button" class="pp-terminal-example__copy">copy</button><pre>%s</pre></pp-terminal-example>`,
			i, hidden, html.EscapeString(v.Command))
	}
	w.WriteString(`</pp-curl-command>`)
	return w.String()
}

func (c *contentRenderer) descriptionBlock(descHTML, description, class string) string {
	if descHTML != "" {
		return `<div class="` + class + `">` + descHTML + `</div>`
	}
	return c.markdown(description, class+" pp-markdown")
}

// operationCallbacks writes pp-operation-callbacks with each callback and
// its operations.
func (c *contentRenderer) operationCallbacks(callbacks []*ppmodel.CallbackInfo) string {
	const owner = "pp-operation-callbacks"
	var w strings.Builder
	w.WriteString(`<pp-operation-callbacks id="pp-operation-callbacks" data-pp-owner="page" data-pp-ssr>`)
	for _, cb := range callbacks {
		if cb == nil {
			continue
		}
		w.WriteString(`<div class="callback-entry"><div class="callback-name">`)
		if cb.Ref != nil {
			w.WriteString(c.refPopoverLink(cb.Ref, "", "", owner))
		}
		w.WriteString(html.EscapeString(cb.Name) + `</div>`)
		for _, op := range cb.Operations {
			if op == nil {
				continue
			}
			w.WriteString(`<div class="callback-operation"><div class="callback-method-expression">` + string(render.HTTPMethodMarkupOwned(op.Method, owner)) +
				`<span class="callback-expression">` + html.EscapeString(op.Expression) + `</span></div>`)
			w.WriteString(c.descriptionBlock(op.DescHTML, op.Description, "callback-desc"))
			if rb := op.RequestBody; rb != nil {
				switch {
				case rb.Ref != nil:
					w.WriteString(`<div class="callback-section-label">Request Body</div>` + c.refPopoverLink(rb.Ref, "", "", owner))
				case len(rb.Content) > 0:
					required := ""
					if rb.Required {
						required = " (required)"
					}
					w.WriteString(`<div class="callback-section-label">Request Body` + required + `</div>` + c.descriptionBlock(rb.DescHTML, rb.Description, "callback-desc") +
						c.mediaTypeSelector(rb.Content, mediaTypeOptions{Owner: owner}))
				}
			}
			if len(op.Responses) > 0 {
				w.WriteString(`<div class="callback-section-label">Responses</div>`)
				for _, r := range op.Responses {
					if r == nil {
						continue
					}
					w.WriteString(`<div class="callback-response"><span class="callback-response-code ` + statusColorClass(r.StatusCode) + `">` + html.EscapeString(r.StatusCode) +
						`</span><span class="callback-response-code">` + html.EscapeString(statusText(r.StatusCode)) + `</span>`)
					switch {
					case r.DescHTML != "":
						w.WriteString(`<span class="callback-response-desc">` + r.DescHTML + `</span>`)
					case r.Description != "":
						w.WriteString(`<span class="callback-response-desc pp-markdown-inline">` + c.inlineMarkdown(r.Description) + `</span>`)
					}
					w.WriteString(`</div>`)
					switch {
					case r.Ref != nil:
						w.WriteString(c.refPopoverLink(r.Ref, "", "", owner))
					case len(r.Content) > 0:
						w.WriteString(c.mediaTypeSelector(r.Content, mediaTypeOptions{Owner: owner}))
					}
				}
			}
			w.WriteString(`</div>`)
		}
		w.WriteString(`</div>`)
	}
	w.WriteString(`</pp-operation-callbacks>`)
	return w.String()
}

// operationContent writes the content sections of an operation page.
func (c *contentRenderer) operationContent(op *ppmodel.OperationPage) *ppmodel.OperationContent {
	content := &ppmodel.OperationContent{}
	if rb := op.RequestBody; rb != nil {
		if len(rb.Content) > 0 {
			content.RequestBody = c.mediaTypeSelector(rb.Content, mediaTypeOptions{Owner: "page", ID: "pp-request-body-content"})
		}
		content.RequestBodyExtensions = c.extensions(rb.Extensions, "page")
	}
	if len(op.Responses) > 0 || len(op.CommonHeaders) > 0 {
		content.Responses = c.operationResponses(op.Responses, op.CommonHeaders)
	}
	if len(op.Parameters) > 0 {
		content.Parameters = c.operationParameters(op.Parameters)
	}
	if op.CurlJSON != "" {
		content.Curl = curlCommand(op.CurlJSON)
	}
	if len(op.Callbacks) > 0 {
		content.Callbacks = c.operationCallbacks(op.Callbacks)
	}
	content.Extensions = c.extensions(op.Extensions, "page")
	content.PathExtensions = c.extensions(op.PathExtensions, "page")
	return content
}

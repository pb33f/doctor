// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"fmt"
	"html"
	"sort"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

// componentRefLink is a plain link to a component's page.
func (c *contentRenderer) componentRefLink(link *ppmodel.ComponentLink) string {
	if link == nil {
		return ""
	}
	href := render.DocHref(c.base, "models/"+link.TypeSlug+"/"+link.Slug+".html")
	return `<a class="ref-link" href="` + html.EscapeString(href) + `">➜ ` + html.EscapeString(link.Name) + `</a>`
}

// extensions writes pp-extensions: each extension key and its value, with
// object values as JSON.
func (c *contentRenderer) extensions(entries []*ppmodel.ExtensionEntry, owner string) string {
	if len(entries) == 0 {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<pp-extensions data-pp-owner="` + owner + `" data-pp-ssr><div class="ext-grid">`)
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		w.WriteString(`<div class="ext-key">` + html.EscapeString(entry.Key) + `</div><div class="ext-value">` + c.extensionValue(entry.Value) + `</div>`)
	}
	w.WriteString(`</div></pp-extensions>`)
	return w.String()
}

func (c *contentRenderer) extensionValue(value any) string {
	switch v := value.(type) {
	case nil:
		return ""
	case map[string]any, []any:
		raw, err := json.Marshal(v)
		if err != nil {
			return ""
		}
		return c.codeViewer(jsPretty(raw), "json", "pp-extensions")
	case string:
		return `<span class="ext-scalar">` + html.EscapeString(v) + `</span>`
	default:
		return `<span class="ext-scalar">` + html.EscapeString(fmt.Sprint(v)) + `</span>`
	}
}

// codeViewer writes pp-code-viewer with its code. JSON is highlighted here;
// other languages are written as text and highlighted in place in the
// browser, which leaves a monospace block the same size.
func (c *contentRenderer) codeViewer(code, language, owner string) string {
	body := html.EscapeString(code)
	attrs := ` language="` + html.EscapeString(language) + `"`
	if language == "json" {
		body = prismJSON(code)
		attrs += ` pretty`
	} else {
		attrs += ` data-pp-highlight`
	}
	return `<pp-code-viewer` + attrs + ` data-pp-owner="` + owner + `" data-pp-ssr><pre class="language-` + html.EscapeString(language) +
		`"><code>` + body + `</code></pre></pp-code-viewer>`
}

// mediaTypeMock is the mock and the language a media type's example shows.
func mediaTypeMock(mt *ppmodel.MediaTypeInfo) (string, string) {
	lower := strings.ToLower(mt.MediaType)
	if strings.Contains(lower, "yaml") && mt.MockYAML != "" {
		return mt.MockYAML, "yaml"
	}
	if strings.Contains(lower, "xml") && mt.MockXML != "" {
		return mt.MockXML, "xml"
	}
	return mt.MockJSON, "json"
}

// mediaTypeExamples are a media type's named examples, in key order, then
// its generated mock.
func mediaTypeExamples(mt *ppmodel.MediaTypeInfo, mock string) []exampleEntry {
	keys := make([]string, 0, len(mt.Examples))
	for key := range mt.Examples {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	entries := make([]exampleEntry, 0, len(keys)+1)
	for _, key := range keys {
		if mt.Examples[key] != "" {
			entries = append(entries, exampleEntry{Key: key, JSON: mt.Examples[key]})
		}
	}
	if mock != "" {
		entries = append(entries, exampleEntry{JSON: mock})
	}
	return entries
}

func mediaTypeSchemaJSON(mt *ppmodel.MediaTypeInfo) string {
	if mt.IsArray && mt.ItemsSchemaJSON != "" {
		return mt.ItemsSchemaJSON
	}
	return mt.SchemaJSON
}

// complexWithExample reports whether a media type draws side by side: a
// schema with properties or variants, and an example.
func complexWithExample(mt *ppmodel.MediaTypeInfo) bool {
	raw := mediaTypeSchemaJSON(mt)
	if raw == "" {
		return false
	}
	schema := parseContentSchema([]byte(raw))
	complex := len(schema.Properties) > 0 || schema.AllOf != nil || schema.OneOf != nil || schema.AnyOf != nil
	return complex && (mt.MockJSON != "" || mt.MockYAML != "" || mt.MockXML != "" || len(mt.Examples) > 0)
}

func mediaTypeFingerprint(mt *ppmodel.MediaTypeInfo) string {
	switch {
	case mt.IsArray && mt.ItemsRef != nil:
		schema := mt.ItemsSchemaJSON
		if schema == "" {
			schema = mt.SchemaJSON
		}
		return "array:" + mt.ItemsRef.Slug + ":" + schema
	case mt.SchemaRef != nil:
		return "ref:" + mt.SchemaRef.ComponentType + "/" + mt.SchemaRef.Slug
	}
	return "inline:" + mt.SchemaJSON
}

// mediaTypeOptions are the attributes of a pp-media-type-selector.
type mediaTypeOptions struct {
	HideRefLinks bool
	Owner        string
	ID           string
}

// mediaTypeSelector writes pp-media-type-selector with every media type's
// block. With several media types, a select chooses the block; the
// application/json one shows first.
func (c *contentRenderer) mediaTypeSelector(types []*ppmodel.MediaTypeInfo, opts mediaTypeOptions) string {
	var kept []*ppmodel.MediaTypeInfo
	for _, mt := range types {
		if mt != nil {
			kept = append(kept, mt)
		}
	}
	if len(kept) == 0 {
		return ""
	}
	owner := opts.Owner
	if owner == "" {
		owner = "page"
	}
	attrs := ""
	if opts.ID != "" {
		attrs += ` id="` + html.EscapeString(opts.ID) + `"`
	}
	if opts.HideRefLinks {
		attrs += ` hide-ref-links`
	}
	var w strings.Builder
	w.WriteString(`<pp-media-type-selector` + attrs + ` data-pp-owner="` + owner + `" data-pp-ssr>`)
	if len(kept) == 1 {
		w.WriteString(c.mediaTypeBlock(kept[0], kept[0], nil, opts))
	} else {
		selected := 0
		for i, mt := range kept {
			if strings.EqualFold(mt.MediaType, "application/json") {
				selected = i
				break
			}
		}
		fingerprints := map[string]bool{}
		for _, mt := range kept {
			fingerprints[mediaTypeFingerprint(mt)] = true
		}
		identical := len(fingerprints) == 1
		for i, mt := range kept {
			propsFrom := mt
			if identical {
				propsFrom = kept[0]
			}
			hidden := ""
			if i != selected {
				hidden = " hidden"
			}
			fmt.Fprintf(&w, `<div class="pp-media-type-block" data-index="%d"%s>%s</div>`, i, hidden, c.mediaTypeBlock(mt, propsFrom, &mediaTypeChoice{types: kept, index: i}, opts))
		}
	}
	w.WriteString(`</pp-media-type-selector>`)
	return w.String()
}

// mediaTypeChoice is the select a block shows when there are several media
// types.
type mediaTypeChoice struct {
	types []*ppmodel.MediaTypeInfo
	index int
}

func (c *contentRenderer) mediaTypeRefInfo(mt *ppmodel.MediaTypeInfo, opts mediaTypeOptions) string {
	if opts.HideRefLinks {
		return ""
	}
	if mt.IsArray && mt.ItemsRef != nil {
		return `<span class="array-type">Array&lt;` + c.componentRefLink(mt.ItemsRef) + `&gt;</span>`
	}
	return c.componentRefLink(mt.SchemaRef)
}

// mediaTypeHeader is the label (or select) and schema link above a block.
func (c *contentRenderer) mediaTypeHeader(mt *ppmodel.MediaTypeInfo, choice *mediaTypeChoice, opts mediaTypeOptions) string {
	if choice != nil {
		var w strings.Builder
		w.WriteString(`<div class="media-type-ref"><select class="pp-media-type-select" aria-label="Media type">`)
		for i, option := range choice.types {
			selected := ""
			if i == choice.index {
				selected = " selected"
			}
			fmt.Fprintf(&w, `<option value="%d"%s>%s</option>`, i, selected, html.EscapeString(option.MediaType))
		}
		w.WriteString(`</select>` + c.mediaTypeRefInfo(mt, opts) + `</div>`)
		return w.String()
	}
	label := `<span class="media-type-label">` + html.EscapeString(mt.MediaType) + `</span>`
	switch {
	case mt.IsArray && mt.ItemsRef != nil:
		array := `<span class="array-type">Array</span>`
		if !opts.HideRefLinks {
			array = `<span class="array-type">Array&lt;` + c.componentRefLink(mt.ItemsRef) + `&gt;</span>`
		}
		return `<div class="media-type-ref">` + label + array + `</div>`
	case mt.SchemaRef != nil:
		link := ""
		if !opts.HideRefLinks {
			link = c.componentRefLink(mt.SchemaRef)
		}
		return `<div class="media-type-ref">` + label + link + `</div>`
	case mt.SchemaJSON == "" && mt.RawSchemaJSON == "" && mt.RawSchemaYAML == "":
		return ""
	}
	return `<div class="media-type-label">` + html.EscapeString(mt.MediaType) + `</div>`
}

// mediaTypeBlock is one media type: header, schema and example (side by
// side or stacked), raw schema, diagram and extensions. propsFrom is the
// media type whose schema the stacked table shows.
func (c *contentRenderer) mediaTypeBlock(mt, propsFrom *ppmodel.MediaTypeInfo, choice *mediaTypeChoice, opts mediaTypeOptions) string {
	const owner = "pp-media-type-selector"
	mock, language := mediaTypeMock(mt)
	var w strings.Builder
	w.WriteString(c.mediaTypeHeader(mt, choice, opts))
	if complexWithExample(mt) {
		w.WriteString(c.mediaTypeSplit(mt, mock, language))
	} else {
		w.WriteString(c.exampleSelector(mediaTypeExamples(mt, mock), exampleOptions{Language: language, Owner: owner}))
		if schema := propsFrom.SchemaJSON; propsFrom.IsArray && propsFrom.ItemsRef != nil && propsFrom.ItemsSchemaJSON != "" {
			w.WriteString(c.schemaProperties(propsFrom.ItemsSchemaJSON, schemaPropertiesOptions{Owner: owner}))
		} else if schema != "" {
			w.WriteString(c.schemaProperties(schema, schemaPropertiesOptions{Owner: owner}))
		}
	}
	if code := mt.RawSchemaJSON + mt.RawSchemaYAML; code != "" {
		rawLanguage, rawCode := "yaml", mt.RawSchemaYAML
		if mt.RawSchemaJSON != "" {
			rawLanguage, rawCode = "json", jsPretty([]byte(mt.RawSchemaJSON))
		}
		w.WriteString(`<div class="multi-format-schema">`)
		if mt.SchemaFormat != "" {
			w.WriteString(`<div class="schema-format-label">` + html.EscapeString(mt.SchemaFormat) + `</div>`)
		}
		w.WriteString(c.codeViewer(rawCode, rawLanguage, owner) + `</div>`)
	}
	if mt.MermaidDiagram != "" {
		w.WriteString(`<pp-class-diagram name="` + html.EscapeString(mt.MediaType) + `" data-pp-owner="` + owner + `"><script type="text/plain" class="pp-mermaid-data">` +
			strings.ReplaceAll(mt.MermaidDiagram, "</", `<\/`) + `</script></pp-class-diagram>`)
	}
	if len(mt.Extensions) > 0 {
		w.WriteString(`<div class="media-type-extensions"><h4>` + html.EscapeString(mt.MediaType) + ` Extensions</h4>` + c.extensions(mt.Extensions, owner) + `</div>`)
	}
	return w.String()
}

func (c *contentRenderer) mediaTypeSplit(mt *ppmodel.MediaTypeInfo, mock, language string) string {
	const owner = "pp-media-type-selector"
	title := mt.MediaType
	if title == "" {
		title = "Example"
	}
	minHeight := 220
	if schema := parseContentSchema([]byte(mediaTypeSchemaJSON(mt))); len(schema.Properties) >= 6 {
		minHeight = 300
	}
	return fmt.Sprintf(`<div class="schema-split" data-pp-model-split style="--schema-split-min-height: %dpx;">`, minHeight) +
		`<div class="split-pane schema-props-pane">` +
		c.schemaProperties(mediaTypeSchemaJSON(mt), schemaPropertiesOptions{Compact: true, Constrained: true, Owner: owner}) + `</div>` +
		`<div class="schema-split-divider" role="separator" aria-orientation="vertical" aria-label="Resize the example" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" tabindex="0"><wa-icon name="grip-vertical" aria-hidden="true"></wa-icon></div>` +
		`<div class="split-pane schema-example-pane">` +
		c.exampleSelector(mediaTypeExamples(mt, mock), exampleOptions{
			HideLabel: true, ShowExpand: true, ShowVisibilityToggle: true, Title: title, Language: language, Owner: owner,
		}) +
		`<button type="button" class="example-restore" data-pp-example-restore aria-label="Show example" hidden><wa-icon name="eye" aria-hidden="true"></wa-icon></button></div></div>`
}

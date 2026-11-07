// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"html"
	"math"
	"strconv"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

// The content writers draw page content as markup, so a page is complete
// before any script runs and nothing moves when the scripts load. They are
// the only renderers of that content: the components it sits in keep only
// their behaviour (variant choice, example actions, popovers).

// contentRenderer writes the content of one page.
type contentRenderer struct {
	noMermaid bool
	// base is the link base of the page ("" when the page has a <base href>).
	base string
	refs map[string]*ppmodel.ModelPage
	// ids numbers the controls that need an id on the page (tooltips).
	ids int
}

// contentRefIndex maps a component $ref to its model page.
func contentRefIndex(site *ppmodel.Site) map[string]*ppmodel.ModelPage {
	index := map[string]*ppmodel.ModelPage{}
	if site == nil {
		return index
	}
	for _, pages := range site.Models {
		for _, page := range pages {
			if page != nil && page.ComponentType != "" && page.Name != "" {
				index["#/components/"+page.ComponentType+"/"+page.Name] = page
			}
		}
	}
	return index
}

func (c *contentRenderer) nextID(prefix string) string {
	c.ids++
	return prefix + "-" + strconv.Itoa(c.ids)
}

// markdown is a description drawn as a pp-markdown block.
func (c *contentRenderer) markdown(text, className string) string {
	if strings.TrimSpace(text) == "" {
		return ""
	}
	if className == "" {
		className = "pp-markdown"
	}
	return `<div class="` + className + `">` + strings.TrimSpace(renderMarkdown(text, c.noMermaid)) + `</div>`
}

// inlineMarkdown is markdown for a line of text: one paragraph is written
// without its p, as marked.parseInline writes it.
func (c *contentRenderer) inlineMarkdown(text string) string {
	out := strings.TrimSpace(renderMarkdown(text, c.noMermaid))
	if strings.HasPrefix(out, "<p>") && strings.HasSuffix(out, "</p>") && strings.Count(out, "<p>") == 1 {
		out = strings.TrimSuffix(strings.TrimPrefix(out, "<p>"), "</p>")
	}
	return out
}

// refLink is where a component $ref links, and its name.
func (c *contentRenderer) refLink(ref string) (name, href string, ok bool) {
	if page := c.refs[ref]; page != nil {
		return page.Name, render.DocHref(c.base, "models/"+page.TypeSlug+"/"+page.Slug+".html"), true
	}
	return "", "", false
}

// refSchema is the schema a component $ref names, when the site has it.
func (c *contentRenderer) refSchema(ref string, visited map[string]bool) *contentSchema {
	if visited[ref] {
		return nil
	}
	page := c.refs[ref]
	if page == nil || page.SchemaJSON == "" {
		return nil
	}
	visited[ref] = true
	return parseContentSchema([]byte(page.SchemaJSON))
}

func (c *contentRenderer) refDescription(ref string) string {
	if page := c.refs[ref]; page != nil {
		return page.Description
	}
	return ""
}

// refAnchor is a link to a component, in the popover that previews it.
func (c *contentRenderer) refAnchor(ref, owner string) string {
	name, href, ok := c.refLink(ref)
	if !ok {
		return ""
	}
	return fmt.Sprintf(`<pp-ref-popover schema-ref="%s" data-pp-owner="%s"><a class="ref-type-link" href="%s">➜ %s</a></pp-ref-popover>`,
		html.EscapeString(ref), owner, html.EscapeString(href), html.EscapeString(name))
}

// refLinks are the links of schemas that are all $refs, joined by sep.
func (c *contentRenderer) refLinks(schemas []*contentSchema, sep, owner string, stopAtFirst bool) (string, bool) {
	var parts []string
	allRefs := true
	for _, s := range schemas {
		if s == nil || s.Ref == "" {
			allRefs = false
			if stopAtFirst {
				break
			}
			continue
		}
		if anchor := c.refAnchor(s.Ref, owner); anchor != "" {
			parts = append(parts, anchor)
		}
	}
	if !allRefs || len(parts) == 0 {
		return "", false
	}
	return strings.Join(parts, ` <span class="composition-separator">`+sep+`</span> `), true
}

// schemaType is the type cell of a property: a label, or links to the
// components it names.
func (c *contentRenderer) schemaType(s *contentSchema, owner string) string {
	if s == nil {
		return ""
	}
	if s.AllOf != nil {
		if links, ok := c.refLinks(s.AllOf, "+", owner, false); ok {
			return `<span class="prop-type prop-type-link">` + links + `</span>`
		}
	}
	if items := s.Items(); s.Type.Is("array") && items != nil {
		if items.AllOf != nil {
			if links, ok := c.refLinks(items.AllOf, "+", owner, false); ok {
				return `<span class="prop-type prop-type-link">Array&lt; ` + links + `&gt;</span>`
			}
		}
		if items.Ref != "" {
			if anchor := c.refAnchor(items.Ref, owner); anchor != "" {
				return `<span class="prop-type prop-type-link">Array&lt; ` + anchor + `&gt;</span>`
			}
		}
	}
	if variants := s.Variants(); variants != nil {
		if links, ok := c.refLinks(variants, "|", owner, true); ok {
			return `<span class="prop-type prop-type-link">` + links + `</span>`
		}
		titles := make([]string, 0, len(variants))
		for _, v := range variants {
			if v != nil && v.Title != "" {
				titles = append(titles, v.Title)
			}
		}
		if len(titles) == len(variants) && len(titles) > 0 {
			return `<span class="prop-type">` + html.EscapeString(strings.Join(titles, " | ")) + `</span>`
		}
	}
	if s.Ref != "" {
		if anchor := c.refAnchor(s.Ref, owner); anchor != "" {
			return `<span class="prop-type prop-type-link">` + anchor + `</span>`
		}
	}
	if label := deriveSchemaType(s); label != "" {
		return `<span class="prop-type">` + html.EscapeString(label) + `</span>`
	}
	return ""
}

// constraintsMarkup is the constraint list and enum of a schema; suffix
// follows each label.
func constraintsMarkup(s *contentSchema, includeExample bool, suffix string) string {
	if s == nil {
		return ""
	}
	parts := collectConstraints(s, includeExample)
	if len(parts) == 0 && len(s.Enum) == 0 {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<div class="constraints">`)
	for _, part := range parts {
		value := html.EscapeString(part.Value)
		if part.IsCode {
			value = `<code>` + value + `</code>`
		}
		w.WriteString(`<span class="constraint-label">` + html.EscapeString(part.Label) + suffix + `</span><span class="constraint-value">` + value + `</span>`)
	}
	if len(s.Enum) > 0 {
		w.WriteString(`<div class="enum-section"><span class="constraint-label">enum` + suffix + `</span><div class="enum-grid">`)
		for _, value := range s.Enum {
			w.WriteString(`<span class="enum-value">` + html.EscapeString(jsStringify(value)) + `</span>`)
		}
		w.WriteString(`</div></div>`)
	}
	w.WriteString(`</div>`)
	return w.String()
}

// schemaPropertiesOptions are the attributes of a pp-schema-properties.
type schemaPropertiesOptions struct {
	Compact     bool
	Condensed   bool
	Constrained bool
	Owner       string
}

const (
	minCompactNameWidthPx       = 180
	requiredBadgeSlotWidthPx    = 52
	requiredBadgeGapPx          = 10
	nameColumnTrailingPaddingPx = 20
	propertyNameCharWidthPx     = 10.5
)

// SchemaProperties writes pp-schema-properties with the table it draws for a
// schema. Empty when the schema draws nothing.
func (c *contentRenderer) schemaProperties(schemaJSON string, opts schemaPropertiesOptions) string {
	if strings.TrimSpace(schemaJSON) == "" {
		return ""
	}
	schema := parseContentSchema([]byte(schemaJSON))
	body := c.schemaPropertiesBody(schema)
	attrs := ""
	if opts.Compact {
		attrs += ` compact`
	}
	if opts.Condensed {
		attrs += ` condensed`
	}
	if opts.Constrained {
		attrs += ` constrained`
	}
	owner := opts.Owner
	if owner == "" {
		owner = "page"
	}
	width := c.nameColumnWidth(schema)
	return fmt.Sprintf(`<pp-schema-properties%s style="--compact-name-width: %dpx;" data-pp-owner="%s" data-pp-ssr>%s</pp-schema-properties>`,
		attrs, width, owner, body)
}

// nameColumnWidth is the width of the property name column: enough for the
// longest name written in the schema itself. Names behind a $ref are not
// counted, as the client never counted them (its schema registry was not
// loaded when it measured).
func (c *contentRenderer) nameColumnWidth(schema *contentSchema) int {
	maxLen := longestName(schema)
	width := float64(requiredBadgeSlotWidthPx+requiredBadgeGapPx) + float64(maxLen)*propertyNameCharWidthPx + nameColumnTrailingPaddingPx
	return int(math.Round(math.Max(minCompactNameWidthPx, width)))
}

func longestName(s *contentSchema) int {
	if s == nil {
		return 0
	}
	longest := 0
	for _, prop := range s.Properties {
		longest = max(longest, len([]rune(prop.Name)), longestName(prop.Schema))
	}
	for _, entries := range [][]*contentSchema{s.AllOf, s.OneOf, s.AnyOf} {
		for _, entry := range entries {
			if entry != nil && entry.Ref == "" {
				longest = max(longest, longestName(entry))
			}
		}
	}
	if items := s.Items(); items != nil && items.Ref == "" {
		longest = max(longest, longestName(items))
	}
	return longest
}

// schemaPropertiesBody is what pp-schema-properties draws for a schema.
func (c *contentRenderer) schemaPropertiesBody(schema *contentSchema) string {
	const owner = "pp-schema-properties"
	target := schema
	if items := schema.Items(); schema.Type.Is("array") && items != nil &&
		(len(items.Properties) > 0 || items.AllOf != nil || items.OneOf != nil || items.AnyOf != nil) {
		target = items
	}
	if target.Ref != "" {
		if resolved := c.refSchema(target.Ref, map[string]bool{}); resolved != nil {
			target = resolved
		}
	}
	switch {
	case target.AllOf != nil:
		return c.composition(target, owner)
	case target.OneOf != nil:
		return c.variants(target.OneOf, "ONE OF", "", false, "polymorphic", owner)
	case target.AnyOf != nil:
		return c.variants(target.AnyOf, "ANY OF", "", false, "polymorphic", owner)
	}
	if len(target.Properties) == 0 {
		label := deriveSchemaType(target)
		if label == "" && target.Description == "" {
			return ""
		}
		typeCell := ""
		if label != "" {
			typeCell = `<span class="prop-type">` + html.EscapeString(label) + `</span>`
		}
		return `<div class="property scalar"><div class="prop-type-col">` + typeCell + constraintsMarkup(target, false, ":") +
			`</div><div class="prop-desc-col">` + c.markdown(target.Description, "") + `</div></div>`
	}
	return c.propertyTable(target.Properties, target.RequiredNames(), owner)
}

func (c *contentRenderer) propertyRow(name string, prop *contentSchema, required bool, owner string) string {
	badgeClass, hidden, nameClass := "required-badge required-badge-placeholder", "true", "prop-name"
	if required {
		badgeClass, hidden, nameClass = "required-badge", "false", "prop-name required"
	}
	return `<div class="property"><div class="prop-name-col"><span class="` + badgeClass + `" aria-hidden="` + hidden + `">req</span><span class="` +
		nameClass + `">` + html.EscapeString(name) + `</span></div><div class="prop-type-col">` + c.schemaType(prop, owner) +
		constraintsMarkup(prop, false, ":") + `</div><div class="prop-desc-col">` + c.markdown(prop.Description, "") + `</div></div>`
}

func (c *contentRenderer) propertyTable(props contentProperties, required map[string]bool, owner string) string {
	var w strings.Builder
	for _, prop := range props {
		schema := prop.Schema
		if variants := schema.Variants(); variants != nil {
			w.WriteString(`<div class="property-oneof">` + c.variants(variants, prop.Name, schema.Description, required[prop.Name], "polymorphic", owner) + `</div>`)
			continue
		}
		w.WriteString(c.propertyRow(prop.Name, schema, required[prop.Name], owner))
	}
	return w.String()
}

// compositionData merges the properties and required names of an allOf,
// following the components it references.
func (c *contentRenderer) compositionData(target *contentSchema, visited map[string]bool) (refs []string, props contentProperties, required map[string]bool) {
	required = target.RequiredNames()
	merge := func(incoming contentProperties) {
		for _, prop := range incoming {
			replaced := false
			for i := range props {
				if props[i].Name == prop.Name {
					props[i] = prop
					replaced = true
					break
				}
			}
			if !replaced {
				props = append(props, prop)
			}
		}
	}
	merge(target.Properties)
	for _, entry := range target.AllOf {
		if entry == nil {
			continue
		}
		if entry.Ref != "" {
			refs = append(refs, entry.Ref)
			referenced := c.refSchema(entry.Ref, visited)
			if referenced == nil {
				continue
			}
			nestedRefs, nestedProps, nestedRequired := c.compositionData(referenced, visited)
			refs = append(refs, nestedRefs...)
			merge(nestedProps)
			for name := range nestedRequired {
				required[name] = true
			}
			continue
		}
		if entry.AllOf != nil {
			nestedRefs, nestedProps, nestedRequired := c.compositionData(entry, visited)
			refs = append(refs, nestedRefs...)
			merge(nestedProps)
			for name := range nestedRequired {
				required[name] = true
			}
			continue
		}
		merge(entry.Properties)
		for name := range entry.RequiredNames() {
			required[name] = true
		}
	}
	return refs, props, required
}

func (c *contentRenderer) composition(target *contentSchema, owner string) string {
	refs, props, required := c.compositionData(target, map[string]bool{})
	var w strings.Builder
	seen := map[string]bool{}
	var unique []string
	for _, ref := range refs {
		if ref != "" && !seen[ref] {
			seen[ref] = true
			unique = append(unique, ref)
		}
	}
	if len(unique) > 0 {
		w.WriteString(`<div class="composition-refs"><span class="composition-label">Composed from</span>`)
		for _, ref := range unique {
			anchor := c.refAnchor(ref, owner)
			if anchor == "" {
				continue
			}
			w.WriteString(`<div class="composition-ref-entry"><span class="composition-ref-link">` + anchor + `</span>` +
				c.markdown(c.refDescription(ref), "composition-ref-desc pp-markdown") + `</div>`)
		}
		w.WriteString(`</div>`)
	}
	if len(props) > 0 {
		w.WriteString(c.propertyTable(props, required, owner))
	}
	return w.String()
}

func variantLabel(entry *contentSchema, index int) string {
	if entry != nil && entry.Title != "" {
		return entry.Title
	}
	if entry != nil && entry.Ref != "" {
		return lastRefSegment(entry.Ref)
	}
	return "Option " + strconv.Itoa(index+1)
}

// variants draws a oneOf or anyOf: the property name, then every variant.
// A tab rail and a select both choose the variant; a container query shows
// the one that fits. Every panel is written; the first one shows.
func (c *contentRenderer) variants(entries []*contentSchema, propName, propDesc string, required bool, label, owner string) string {
	if len(entries) == 0 {
		return ""
	}
	classes := "oneof-property"
	if len(entries) == 1 {
		classes += " oneof-property-single"
	}
	var w strings.Builder
	w.WriteString(`<div class="` + classes + `"><div class="oneof-left">`)
	if propName != "" {
		badgeClass, hidden := "required-badge required-badge-placeholder", "true"
		if required {
			badgeClass, hidden = "required-badge", "false"
		}
		w.WriteString(`<div class="oneof-prop-name"><span class="` + badgeClass + `" aria-hidden="` + hidden + `">req</span><span class="prop-name">` +
			html.EscapeString(propName) + `</span>`)
		if label != "" {
			w.WriteString(`<div class="composition-label polymorphic">(` + html.EscapeString(label) + `)</div>`)
		}
		w.WriteString(`</div>`)
	}
	w.WriteString(c.markdown(propDesc, "oneof-prop-desc pp-markdown"))
	w.WriteString(`</div>`)
	if len(entries) == 1 {
		entry := entries[0]
		w.WriteString(`<div class="oneof-single-value">` + c.schemaType(entry, owner) + constraintsMarkup(entry, false, ":") + `</div>`)
		w.WriteString(c.variantSingleBody(entry, owner))
		w.WriteString(`</div>`)
		return w.String()
	}
	id := c.nextID("pp-variants")
	w.WriteString(`<div class="oneof-desc-container"><div class="pp-variants" data-pp-variants>`)
	w.WriteString(`<div class="pp-variant-tabs" role="tablist">`)
	for i, entry := range entries {
		selected := "false"
		if i == 0 {
			selected = "true"
		}
		fmt.Fprintf(&w, `<button type="button" role="tab" class="pp-variant-tab" id="%s-tab-%d" aria-controls="%s-panel-%d" aria-selected="%s" data-index="%d">› %s</button>`,
			id, i, id, i, selected, i, html.EscapeString(variantLabel(entry, i)))
	}
	w.WriteString(`</div><select class="pp-variant-select" aria-label="Variant">`)
	for i, entry := range entries {
		fmt.Fprintf(&w, `<option value="%d">%s</option>`, i, html.EscapeString(variantLabel(entry, i)))
	}
	w.WriteString(`</select>`)
	for i, entry := range entries {
		hiddenAttr := ""
		if i > 0 {
			hiddenAttr = " hidden"
		}
		fmt.Fprintf(&w, `<div class="pp-variant-panel" role="tabpanel" id="%s-panel-%d" aria-labelledby="%s-tab-%d" data-index="%d"%s>%s</div>`,
			id, i, id, i, i, hiddenAttr, c.variantOption(entry, owner))
	}
	w.WriteString(`</div></div></div>`)
	return w.String()
}

func (c *contentRenderer) variantSingleBody(entry *contentSchema, owner string) string {
	if entry == nil || entry.Ref != "" || (entry.Description == "" && len(entry.Properties) == 0) {
		return ""
	}
	body := c.markdown(entry.Description, "oneof-option-desc pp-markdown")
	if len(entry.Properties) > 0 {
		body += c.propertyTable(entry.Properties, entry.RequiredNames(), owner)
	}
	return `<div class="oneof-single-panel">` + body + `</div>`
}

func (c *contentRenderer) variantOption(entry *contentSchema, owner string) string {
	if entry == nil {
		return ""
	}
	if entry.Ref != "" {
		anchor := c.refAnchor(entry.Ref, owner)
		if anchor == "" {
			return ""
		}
		return `<div class="oneof-option-header">` + anchor + c.markdown(c.refDescription(entry.Ref), "oneof-option-desc pp-markdown") + `</div>`
	}
	body := c.markdown(entry.Description, "oneof-option-desc pp-markdown")
	switch {
	case len(entry.Properties) > 0:
		body += c.propertyTable(entry.Properties, entry.RequiredNames(), owner)
	case deriveSchemaType(entry) != "":
		body += `<div class="oneof-option-scalar"><span class="prop-type">` + html.EscapeString(deriveSchemaType(entry)) + `</span>` + constraintsMarkup(entry, false, ":") + `</div>`
	}
	return body
}

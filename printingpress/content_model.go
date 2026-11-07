// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html"
	"strconv"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// gridEntry is one label and value of a property grid. HTML values are
// written as they are; the others are escaped.
type gridEntry struct {
	Label  string
	Value  string
	IsCode bool
	IsHTML bool
}

func propertyGrid(entries []gridEntry) string {
	if len(entries) == 0 {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<div class="property-grid">`)
	for _, entry := range entries {
		value := entry.Value
		if !entry.IsHTML {
			value = html.EscapeString(value)
		}
		if entry.IsCode {
			value = `<code>` + value + `</code>`
		}
		w.WriteString(`<div class="property-grid-entry"><span class="property-grid-label">` + html.EscapeString(entry.Label) +
			`</span><span class="property-grid-value">` + value + `</span></div>`)
	}
	w.WriteString(`</div>`)
	return w.String()
}

func enumGrid(values []json.RawMessage) string {
	var w strings.Builder
	w.WriteString(`<div class="enum-grid">`)
	for _, value := range values {
		w.WriteString(`<span class="enum-value">` + html.EscapeString(jsStringify(value)) + `</span>`)
	}
	w.WriteString(`</div>`)
	return w.String()
}

// schemaEntries are the grid entries of a simple schema: type, default,
// constraints and enum.
func schemaEntries(s *contentSchema) []gridEntry {
	var entries []gridEntry
	if len(s.Type) > 0 {
		label := strings.Join(s.Type, ",")
		if s.Format != "" {
			label += " (" + s.Format + ")"
		}
		entries = append(entries, gridEntry{Label: "type", Value: label, IsCode: true})
	}
	if len(s.Default) > 0 {
		entries = append(entries, gridEntry{Label: "default", Value: jsStringify(s.Default), IsCode: true})
	}
	for _, part := range collectConstraints(s, false) {
		entries = append(entries, gridEntry{Label: part.Label, Value: part.Value, IsCode: part.IsCode})
	}
	if len(s.Enum) > 0 {
		entries = append(entries, gridEntry{Label: "enum", Value: enumGrid(s.Enum), IsHTML: true})
	}
	return entries
}

// namedExamples are a component's examples map, in the order the JSON has
// them: each example's value and its description or summary.
func namedExamples(raw json.RawMessage) []exampleEntry {
	raw = bytes.TrimSpace(raw)
	if len(raw) == 0 || raw[0] != '{' {
		return nil
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	if _, err := decoder.Token(); err != nil {
		return nil
	}
	var entries []exampleEntry
	for decoder.More() {
		key, err := decoder.Token()
		if err != nil {
			return entries
		}
		var example struct {
			Value       json.RawMessage `json:"value"`
			Description string          `json:"description"`
			Summary     string          `json:"summary"`
		}
		if err := decoder.Decode(&example); err != nil {
			return entries
		}
		if len(example.Value) == 0 {
			continue
		}
		name, _ := key.(string)
		description := example.Description
		if description == "" {
			description = example.Summary
		}
		entries = append(entries, exampleEntry{Key: name, JSON: jsPretty(example.Value), Description: description})
	}
	return entries
}

// componentExamples are the examples of a parameter or header: its examples
// map, else its example, else its schema's example.
func componentExamples(data, schema *contentSchema) []exampleEntry {
	if len(data.Examples) > 0 {
		return namedExamples(data.Examples)
	}
	if len(data.Example) > 0 {
		return []exampleEntry{{JSON: jsPretty(data.Example)}}
	}
	if schema != nil && len(schema.Example) > 0 {
		return []exampleEntry{{JSON: jsPretty(schema.Example)}}
	}
	return nil
}

// modelPageContent writes what pp-model-page draws for a model page. ok is
// false for the shapes the server does not write yet; the component draws
// those.
func (c *contentRenderer) modelPageContent(page *ppmodel.ModelPage) (string, bool) {
	if page == nil || strings.TrimSpace(page.SchemaJSON) == "" {
		return "", false
	}
	data := parseContentSchema([]byte(page.SchemaJSON))
	const owner = "pp-model-page"
	switch {
	case data.In != "":
		return c.modelParameter(data, owner), true
	case page.ComponentType == "parameters":
		return c.modelAsyncAPIParameter(data, owner), true
	case data.Schema != nil && len(data.Properties) == 0:
		return c.modelHeader(data, owner), true
	case len(data.Value) > 0 || data.ExternalValue != "":
		return c.modelExample(data, owner), true
	case len(data.Content) > 0:
		return c.mediaTypeSelector(c.rawContentMediaTypes(data.Content), mediaTypeOptions{HideRefLinks: true, Owner: owner}), true
	}
	return c.modelSchema(page, data, owner), true
}

func (c *contentRenderer) modelParameter(data *contentSchema, owner string) string {
	schema := data.Schema
	if schema == nil {
		schema = &contentSchema{}
	}
	entries := []gridEntry{{Label: "name", Value: data.Name}, {Label: "in", Value: data.In}}
	if required, set := data.RequiredFlag(); set {
		entries = append(entries, gridEntry{Label: "required", Value: strconv.FormatBool(required)})
	}
	if data.Deprecated {
		entries = append(entries, gridEntry{Label: "deprecated", Value: "true"})
	}
	entries = append(entries, schemaEntries(schema)...)
	examples := ""
	if !schema.Type.Is("boolean") {
		examples = c.exampleSelector(componentExamples(data, schema), exampleOptions{Owner: owner})
	}
	return examples + propertyGrid(entries)
}

func (c *contentRenderer) modelAsyncAPIParameter(data *contentSchema, owner string) string {
	var entries []gridEntry
	if data.Location != "" {
		entries = append(entries, gridEntry{Label: "location", Value: data.Location, IsCode: true})
	}
	if len(data.Default) > 0 {
		entries = append(entries, gridEntry{Label: "default", Value: jsStringify(data.Default), IsCode: true})
	}
	if len(data.Enum) > 0 {
		entries = append(entries, gridEntry{Label: "enum", Value: enumGrid(data.Enum), IsHTML: true})
	}
	var examples []exampleEntry
	var list []json.RawMessage
	if json.Unmarshal(data.Examples, &list) == nil {
		for i, value := range list {
			examples = append(examples, exampleEntry{Key: "Example " + strconv.Itoa(i+1), JSON: jsPretty(value)})
		}
	}
	return c.exampleSelector(examples, exampleOptions{Owner: owner}) + propertyGrid(entries)
}

func (c *contentRenderer) modelHeader(data *contentSchema, owner string) string {
	schema := data.Schema
	var entries []gridEntry
	if required, _ := data.RequiredFlag(); required {
		entries = append(entries, gridEntry{Label: "required", Value: "true"})
	}
	if data.Deprecated {
		entries = append(entries, gridEntry{Label: "deprecated", Value: "true"})
	}
	entries = append(entries, schemaEntries(schema)...)
	return c.exampleSelector(componentExamples(data, schema), exampleOptions{Owner: owner}) + propertyGrid(entries)
}

func (c *contentRenderer) modelExample(data *contentSchema, owner string) string {
	var entries []gridEntry
	if data.Summary != "" {
		entries = append(entries, gridEntry{Label: "summary", Value: data.Summary})
	}
	if data.ExternalValue != "" {
		link := html.EscapeString(data.ExternalValue)
		entries = append(entries, gridEntry{Label: "externalValue", IsHTML: true,
			Value: `<span class="example-external"><a href="` + link + `" target="_blank" rel="noreferrer">` + link + `</a></span>`})
	}
	inline := ""
	if len(data.Value) > 0 {
		inline = c.exampleSelector([]exampleEntry{{JSON: jsPretty(data.Value)}}, exampleOptions{Owner: owner})
	}
	return inline + propertyGrid(entries)
}

// modelExampleJSON is the example a schema page shows: the schema's own
// example, else the generated mock.
func modelExampleJSON(page *ppmodel.ModelPage, schema *contentSchema) string {
	if len(schema.Example) > 0 {
		return jsPretty(schema.Example)
	}
	return page.MockJSON
}

func (c *contentRenderer) modelSchema(page *ppmodel.ModelPage, schema *contentSchema, owner string) string {
	example := modelExampleJSON(page, schema)
	complex := len(schema.Properties) > 0 || schema.AllOf != nil || schema.OneOf != nil || schema.AnyOf != nil
	if !complex {
		inline := ""
		if !schema.Type.Is("boolean") && example != "" {
			inline = c.exampleSelector([]exampleEntry{{JSON: example}}, exampleOptions{Owner: owner})
		}
		return inline + propertyGrid(schemaEntries(schema))
	}
	heading := "Variants"
	switch {
	case len(schema.Properties) > 0:
		heading = "Properties"
	case schema.AllOf != nil:
		heading = "Composition"
	}
	if example == "" {
		return `<div class="schema-stacked"><h2>` + heading + `</h2>` +
			c.schemaProperties(page.SchemaJSON, schemaPropertiesOptions{Owner: owner}) + `</div>`
	}
	// Side by side: properties, divider, example. Below 900px a container
	// query stacks them, example first, as the component did.
	minHeight := page.EstimatedSplitHeight
	if minHeight <= 0 {
		minHeight = 220
		if len(schema.Properties) >= 6 {
			minHeight = 300
		}
	}
	return `<div class="schema-split" data-pp-model-split style="--schema-split-min-height: ` + strconv.Itoa(minHeight) + `px;">` +
		`<div class="split-pane schema-props-pane"><h2>` + heading + `</h2>` +
		c.schemaProperties(page.SchemaJSON, schemaPropertiesOptions{Compact: true, Owner: owner}) + `</div>` +
		`<div class="schema-split-divider" role="separator" aria-orientation="vertical" aria-label="Resize the example" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" tabindex="0"><wa-icon name="grip-vertical" aria-hidden="true"></wa-icon></div>` +
		`<div class="split-pane schema-example-pane">` +
		c.exampleSelector([]exampleEntry{{JSON: example}}, exampleOptions{
			HideLabel: true, ShowExpand: true, ShowVisibilityToggle: true, Title: page.Name + " Example", Owner: owner,
		}) +
		`<button type="button" class="example-restore" data-pp-example-restore aria-label="Show example" hidden><wa-icon name="eye" aria-hidden="true"></wa-icon></button></div></div>`
}

// refComponentLink is the component link of a $ref, from the site's pages.
func (c *contentRenderer) refComponentLink(ref string) *ppmodel.ComponentLink {
	page := c.refs[ref]
	if page == nil {
		return nil
	}
	return &ppmodel.ComponentLink{Name: page.Name, ComponentType: page.ComponentType, TypeSlug: page.TypeSlug, Slug: page.Slug}
}

// rawContentMediaTypes reads a component's raw content map (a response or
// request body) into media types, in the order the JSON has them, as
// pp-model-page did.
func (c *contentRenderer) rawContentMediaTypes(raw json.RawMessage) []*ppmodel.MediaTypeInfo {
	raw = bytes.TrimSpace(raw)
	if len(raw) == 0 || raw[0] != '{' {
		return nil
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	if _, err := decoder.Token(); err != nil {
		return nil
	}
	var types []*ppmodel.MediaTypeInfo
	for decoder.More() {
		key, err := decoder.Token()
		if err != nil {
			return types
		}
		var definition struct {
			Schema   json.RawMessage `json:"schema"`
			Examples json.RawMessage `json:"examples"`
			Example  json.RawMessage `json:"example"`
		}
		if err := decoder.Decode(&definition); err != nil {
			return types
		}
		mt := &ppmodel.MediaTypeInfo{MediaType: fmt.Sprint(key)}
		if len(bytes.TrimSpace(definition.Schema)) > 0 {
			mt.SchemaJSON = string(bytes.TrimSpace(definition.Schema))
			schema := parseContentSchema(definition.Schema)
			if schema.Ref != "" {
				mt.SchemaRef = c.refComponentLink(schema.Ref)
			}
			if items := schema.Items(); schema.Type.Is("array") && items != nil {
				mt.IsArray = true
				if itemsRaw, err := json.Marshal(json.RawMessage(schema.RawItems)); err == nil {
					mt.ItemsSchemaJSON = string(itemsRaw)
				}
				if items.Ref != "" {
					mt.ItemsRef = c.refComponentLink(items.Ref)
				}
			}
		}
		examples := map[string]string{}
		for _, entry := range namedExamples(definition.Examples) {
			examples[entry.Key] = entry.JSON
		}
		if len(examples) == 0 && len(definition.Example) > 0 {
			examples["Example"] = jsPretty(definition.Example)
		}
		if len(examples) > 0 {
			mt.Examples = examples
		}
		if mt.SchemaJSON != "" || mt.SchemaRef != nil || mt.ItemsRef != nil || len(mt.Examples) > 0 {
			types = append(types, mt)
		}
	}
	return types
}

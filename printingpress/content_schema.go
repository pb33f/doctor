// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"encoding/json"
	"strings"
)

// contentSchema is the part of a schema, or of a component that holds one,
// that the page content draws. It is decoded from the JSON the collector
// captures. Properties keep their order, as the spec writes them.
type contentSchema struct {
	Type        contentSchemaType `json:"type"`
	Format      string            `json:"format"`
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Ref         string            `json:"$ref"`
	Properties  contentProperties `json:"properties"`
	Required    json.RawMessage   `json:"required"`
	RawItems    json.RawMessage   `json:"items"`
	AllOf       []*contentSchema  `json:"allOf"`
	OneOf       []*contentSchema  `json:"oneOf"`
	AnyOf       []*contentSchema  `json:"anyOf"`
	Enum        []json.RawMessage `json:"enum"`
	Default     json.RawMessage   `json:"default"`
	Example     json.RawMessage   `json:"example"`
	Minimum     json.RawMessage   `json:"minimum"`
	Maximum     json.RawMessage   `json:"maximum"`
	ExclMinimum json.RawMessage   `json:"exclusiveMinimum"`
	ExclMaximum json.RawMessage   `json:"exclusiveMaximum"`
	MinLength   json.RawMessage   `json:"minLength"`
	MaxLength   json.RawMessage   `json:"maxLength"`
	MinItems    json.RawMessage   `json:"minItems"`
	MaxItems    json.RawMessage   `json:"maxItems"`
	MultipleOf  json.RawMessage   `json:"multipleOf"`
	UniqueItems bool              `json:"uniqueItems"`
	Pattern     string            `json:"pattern"`
	// The fields below belong to the components that hold a schema:
	// parameters, headers, examples, responses and request bodies.
	In            string          `json:"in"`
	Name          string          `json:"name"`
	Summary       string          `json:"summary"`
	Location      string          `json:"location"`
	ExternalValue string          `json:"externalValue"`
	Deprecated    bool            `json:"deprecated"`
	Schema        *contentSchema  `json:"schema"`
	Value         json.RawMessage `json:"value"`
	Content       json.RawMessage `json:"content"`
	Examples      json.RawMessage `json:"examples"`

	items *contentSchema
}

// parseContentSchema decodes schema JSON. A schema that is not an object,
// such as the boolean schemas of OpenAPI 3.1, decodes as an empty schema.
func parseContentSchema(raw []byte) *contentSchema {
	schema := &contentSchema{}
	raw = bytes.TrimSpace(raw)
	if len(raw) == 0 || raw[0] != '{' {
		return schema
	}
	if err := json.Unmarshal(raw, schema); err != nil {
		return &contentSchema{}
	}
	return schema
}

// UnmarshalJSON tolerates boolean schemas wherever a schema can appear.
func (s *contentSchema) UnmarshalJSON(raw []byte) error {
	type plain contentSchema
	trimmed := bytes.TrimSpace(raw)
	if len(trimmed) == 0 || trimmed[0] != '{' {
		*s = contentSchema{}
		return nil
	}
	var decoded plain
	if err := json.Unmarshal(trimmed, &decoded); err != nil {
		return err
	}
	*s = contentSchema(decoded)
	return nil
}

// Items is the items schema, or nil.
func (s *contentSchema) Items() *contentSchema {
	if s == nil || len(s.RawItems) == 0 {
		return nil
	}
	if s.items == nil {
		trimmed := bytes.TrimSpace(s.RawItems)
		if len(trimmed) == 0 || trimmed[0] != '{' {
			return nil
		}
		s.items = parseContentSchema(trimmed)
	}
	return s.items
}

// RequiredNames is the schema's required list.
func (s *contentSchema) RequiredNames() map[string]bool {
	names := map[string]bool{}
	var list []string
	if s != nil && json.Unmarshal(s.Required, &list) == nil {
		for _, name := range list {
			names[name] = true
		}
	}
	return names
}

// RequiredFlag is a parameter's or header's required value, and whether it
// was set.
func (s *contentSchema) RequiredFlag() (bool, bool) {
	var flag bool
	if s == nil || json.Unmarshal(s.Required, &flag) != nil {
		return false, false
	}
	return flag, true
}

// HasVariants reports whether the schema is a oneOf or anyOf.
func (s *contentSchema) Variants() []*contentSchema {
	if s == nil {
		return nil
	}
	if s.OneOf != nil {
		return s.OneOf
	}
	return s.AnyOf
}

// contentSchemaType is a schema type, which OpenAPI 3.1 lets be a list.
type contentSchemaType []string

func (t *contentSchemaType) UnmarshalJSON(raw []byte) error {
	var one string
	if json.Unmarshal(raw, &one) == nil {
		*t = contentSchemaType{one}
		return nil
	}
	var many []string
	if json.Unmarshal(raw, &many) == nil {
		*t = many
		return nil
	}
	*t = nil
	return nil
}

func (t contentSchemaType) Is(name string) bool {
	return len(t) == 1 && t[0] == name
}

// contentProperty is one named property.
type contentProperty struct {
	Name   string
	Schema *contentSchema
}

// contentProperties are a schema's properties, in the order the JSON has them.
type contentProperties []contentProperty

func (p *contentProperties) UnmarshalJSON(raw []byte) error {
	decoder := json.NewDecoder(bytes.NewReader(raw))
	token, err := decoder.Token()
	if err != nil {
		return err
	}
	if delim, ok := token.(json.Delim); !ok || delim != '{' {
		*p = nil
		return nil
	}
	var props contentProperties
	for decoder.More() {
		key, err := decoder.Token()
		if err != nil {
			return err
		}
		name, _ := key.(string)
		var value json.RawMessage
		if err := decoder.Decode(&value); err != nil {
			return err
		}
		props = append(props, contentProperty{Name: name, Schema: parseContentSchema(value)})
	}
	*p = props
	return nil
}

// jsStringify writes a JSON value compactly, as JSON.stringify does, without
// escaping HTML characters.
func jsStringify(raw json.RawMessage) string {
	var value any
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.UseNumber()
	if err := decoder.Decode(&value); err != nil {
		return strings.TrimSpace(string(raw))
	}
	var out bytes.Buffer
	encoder := json.NewEncoder(&out)
	encoder.SetEscapeHTML(false)
	if err := encoder.Encode(value); err != nil {
		return strings.TrimSpace(string(raw))
	}
	return strings.TrimSpace(out.String())
}

// jsPretty writes a JSON value indented by two spaces, as
// JSON.stringify(value, null, 2) does.
func jsPretty(raw []byte) string {
	var out bytes.Buffer
	if err := json.Indent(&out, bytes.TrimSpace(raw), "", "  "); err != nil {
		return strings.TrimSpace(string(raw))
	}
	return out.String()
}

// jsNumber writes a constraint value the way a template literal prints it.
func jsNumber(raw json.RawMessage) string {
	return strings.Trim(strings.TrimSpace(string(raw)), `"`)
}

func lastRefSegment(ref string) string {
	if i := strings.LastIndex(ref, "/"); i >= 0 {
		return ref[i+1:]
	}
	return ref
}

// deriveSchemaType is the short type label of a schema.
func deriveSchemaType(s *contentSchema) string {
	if s == nil {
		return ""
	}
	if s.Type.Is("array") && s.Items() != nil {
		items := s.Items()
		itemType := strings.Join(items.Type, ",")
		if itemType == "" && items.Ref != "" {
			itemType = lastRefSegment(items.Ref)
		}
		if itemType == "" {
			itemType = "any"
		}
		return "Array<" + itemType + ">"
	}
	if len(s.Type) > 0 {
		label := strings.Join(s.Type, " | ")
		if s.Format != "" {
			label += " (" + s.Format + ")"
		}
		return label
	}
	switch {
	case s.OneOf != nil:
		return "oneOf"
	case s.AnyOf != nil:
		return "anyOf"
	case s.AllOf != nil:
		return "allOf"
	case s.Ref != "":
		return lastRefSegment(s.Ref)
	}
	return ""
}

// contentConstraint is one constraint label and its value.
type contentConstraint struct {
	Label  string
	Value  string
	IsCode bool
}

// collectConstraints lists a schema's constraints in the order the page
// shows them.
func collectConstraints(s *contentSchema, includeExample bool) []contentConstraint {
	if s == nil {
		return nil
	}
	var parts []contentConstraint
	add := func(label string, raw json.RawMessage) {
		if len(raw) > 0 {
			parts = append(parts, contentConstraint{Label: label, Value: jsNumber(raw)})
		}
	}
	if includeExample {
		if len(s.Example) > 0 {
			parts = append(parts, contentConstraint{Label: "example", Value: jsStringify(s.Example)})
		}
		if len(s.Default) > 0 {
			parts = append(parts, contentConstraint{Label: "default", Value: jsStringify(s.Default)})
		}
	}
	add("min", s.Minimum)
	add("max", s.Maximum)
	add("exclusiveMin", s.ExclMinimum)
	add("exclusiveMax", s.ExclMaximum)
	add("minLength", s.MinLength)
	add("maxLength", s.MaxLength)
	add("minItems", s.MinItems)
	add("maxItems", s.MaxItems)
	if s.UniqueItems {
		parts = append(parts, contentConstraint{Label: "uniqueItems", Value: "true"})
	}
	if s.Pattern != "" {
		parts = append(parts, contentConstraint{Label: "pattern", Value: s.Pattern, IsCode: true})
	}
	add("multipleOf", s.MultipleOf)
	return parts
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"bytes"
	"encoding/json"
	"strings"
	"unicode"

	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	"go.yaml.in/yaml/v4"
)

// BreadcrumbItem represents a single breadcrumb navigation entry.
type BreadcrumbItem struct {
	Label string
	Href  string
}

func modelBreadcrumb(page *ModelPage) []BreadcrumbItem {
	return []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "MODELS", Href: "models/index.html"},
		{Label: strings.ToUpper(slugToTitle(page.TypeSlug)), Href: "models/" + page.TypeSlug + "/index.html"},
	}
}

func operationBreadcrumb(page *OperationPage) []BreadcrumbItem {
	items := []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "OPERATIONS", Href: "index.html"},
	}
	for i, tag := range page.TagPath {
		item := BreadcrumbItem{Label: tag}
		if i < len(page.TagSlugs) {
			item.Href = "tags/" + page.TagSlugs[i] + ".html"
		}
		items = append(items, item)
	}
	return items
}

func modelsIndexBreadcrumb() []BreadcrumbItem {
	return []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "MODELS"},
	}
}

func modelTypeIndexBreadcrumb(typeName string) []BreadcrumbItem {
	return []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "MODELS", Href: "models/index.html"},
		{Label: strings.ToUpper(typeName)},
	}
}

// tagIndexBreadcrumb builds the breadcrumb for a tag index page using a
// pre-computed parent map to avoid rebuilding it per tag (O(N) vs O(N²)).
func tagIndexBreadcrumb(tag *NavTag, tagParentMap map[string]*NavTag) []BreadcrumbItem {
	items := []BreadcrumbItem{
		{Label: "HOME", Href: "index.html"},
		{Label: "OPERATIONS", Href: "index.html"},
	}
	// walk ancestors to root
	var path []*NavTag
	for cur := tagParentMap[tag.Name]; cur != nil; cur = tagParentMap[cur.Name] {
		path = append(path, cur)
	}
	// reverse to root-first
	for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
		path[i], path[j] = path[j], path[i]
	}
	for _, ancestor := range path {
		items = append(items, BreadcrumbItem{Label: ancestor.DisplayName(), Href: "tags/" + ancestor.Slug + ".html"})
	}
	// current tag (no link — it's the current page)
	items = append(items, BreadcrumbItem{Label: tag.DisplayName()})
	return items
}

// buildTagParentMap walks the NavTag tree once and returns a map from tag name to parent NavTag.
func buildTagParentMap(tags []*NavTag) map[string]*NavTag {
	m := make(map[string]*NavTag)
	var walk func([]*NavTag)
	walk = func(tags []*NavTag) {
		for _, t := range tags {
			for _, child := range t.Children {
				m[child.Name] = t
			}
			walk(t.Children)
		}
	}
	walk(tags)
	return m
}

// slugToTitle converts a hyphenated slug to title case: "request-bodies" → "Request Bodies".
func slugToTitle(slug string) string {
	words := strings.Split(slug, "-")
	for i, w := range words {
		if len(w) > 0 {
			runes := []rune(w)
			runes[0] = unicode.ToUpper(runes[0])
			words[i] = string(runes)
		}
	}
	return strings.Join(words, " ")
}

// DetectSpecFormat returns "json" or "yaml" based on the first non-whitespace byte.
func DetectSpecFormat(data []byte) string {
	trimmed := bytes.TrimLeft(data, " \t\r\n")
	if len(trimmed) > 0 && (trimmed[0] == '{' || trimmed[0] == '[') {
		return "json"
	}
	return "yaml"
}

// yamlToJSON converts raw YAML bytes to a JSON string.
func yamlToJSON(yamlBytes []byte) (string, error) {
	var intermediate any
	if err := yaml.Unmarshal(yamlBytes, &intermediate); err != nil {
		return "", err
	}
	jsonBytes, err := json.Marshal(intermediate)
	if err != nil {
		return "", err
	}
	return string(jsonBytes), nil
}

// isComplexSchemaJSON returns true if the schema JSON represents a complex type
// (object, array, or composition) worth generating a mock for.
// Returns false for scalar types like string, integer, number, boolean.
func isComplexSchemaJSON(schemaJSON string) bool {
	if schemaJSON == "" {
		return false
	}
	var m map[string]any
	if json.Unmarshal([]byte(schemaJSON), &m) != nil {
		return false
	}
	if t, ok := m["type"]; ok {
		switch v := t.(type) {
		case string:
			return v == "object" || v == "array"
		case []any:
			for _, item := range v {
				if s, ok := item.(string); ok && (s == "object" || s == "array") {
					return true
				}
			}
			return false
		}
	}
	for _, key := range []string{"properties", "allOf", "anyOf", "oneOf", "items"} {
		if _, ok := m[key]; ok {
			return true
		}
	}
	return false
}

// isComplexSchema returns true if the schema represents a complex type worth
// generating a mock for, operating directly on the schema object without JSON round-trip.
func isComplexSchema(sch *highbase.Schema) bool {
	if sch == nil {
		return false
	}
	for _, t := range sch.Type {
		if t == "object" || t == "array" {
			return true
		}
	}
	return sch.Properties != nil || sch.AllOf != nil || sch.AnyOf != nil || sch.OneOf != nil || sch.Items != nil
}

// mockLanguageForMediaType returns the mock language ("json", "yaml", or "xml")
// based on the media type string.
func mockLanguageForMediaType(mediaType string) string {
	mt := strings.ToLower(mediaType)
	switch {
	case strings.Contains(mt, "yaml") || strings.Contains(mt, "x-yaml"):
		return "yaml"
	case strings.Contains(mt, "xml"):
		return "xml"
	default:
		return "json"
	}
}

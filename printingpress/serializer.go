// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"bytes"
	"encoding/json"
	"strings"

	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	"go.yaml.in/yaml/v4"
)

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

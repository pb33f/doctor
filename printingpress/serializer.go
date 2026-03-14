// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"encoding/json"

	"go.yaml.in/yaml/v4"
)

// renderableToJSON converts any object that has a Render() method (returning YAML bytes)
// into a JSON string suitable for cowboy-components.
func renderableToJSON(renderable interface{ Render() ([]byte, error) }) (string, error) {
	yamlBytes, err := renderable.Render()
	if err != nil {
		return "", err
	}
	return yamlToJSON(yamlBytes)
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

// marshalJSON is a convenience wrapper for json.Marshal that returns a string.
func marshalJSON(v any) (string, error) {
	b, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

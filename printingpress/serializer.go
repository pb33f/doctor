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

// marshalJSON is a convenience wrapper for json.Marshal that returns a string.
func marshalJSON(v any) (string, error) {
	b, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

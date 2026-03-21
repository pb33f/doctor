// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"testing"

	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestYamlToJSON(t *testing.T) {
	yamlInput := []byte("name: test\nversion: 1")
	result, err := yamlToJSON(yamlInput)
	require.NoError(t, err)
	assert.Contains(t, result, `"name":"test"`)
	assert.Contains(t, result, `"version":1`)
}

func TestYamlToJSON_Invalid(t *testing.T) {
	_, err := yamlToJSON([]byte("\t\t- :\n\t:"))
	assert.Error(t, err)
}

func TestIsComplexSchemaJSON(t *testing.T) {
	// Scalar types — should NOT generate mock
	assert.False(t, isComplexSchemaJSON(`{"type":"string"}`))
	assert.False(t, isComplexSchemaJSON(`{"type":"integer"}`))
	assert.False(t, isComplexSchemaJSON(`{"type":"number","format":"double"}`))
	assert.False(t, isComplexSchemaJSON(`{"type":"boolean"}`))
	assert.False(t, isComplexSchemaJSON(`{"type":["string","null"]}`))
	assert.False(t, isComplexSchemaJSON(""))

	// Complex types — should generate mock
	assert.True(t, isComplexSchemaJSON(`{"type":"object","properties":{"name":{"type":"string"}}}`))
	assert.True(t, isComplexSchemaJSON(`{"type":"array","items":{"type":"string"}}`))
	assert.True(t, isComplexSchemaJSON(`{"properties":{"id":{"type":"integer"}}}`))
	assert.True(t, isComplexSchemaJSON(`{"allOf":[{"type":"object"}]}`))
	assert.True(t, isComplexSchemaJSON(`{"anyOf":[{"type":"string"},{"type":"object"}]}`))
	assert.True(t, isComplexSchemaJSON(`{"oneOf":[{"type":"string"}]}`))
	assert.True(t, isComplexSchemaJSON(`{"items":{"type":"string"}}`))
	assert.True(t, isComplexSchemaJSON(`{"type":["object","null"]}`))
}

func TestIsComplexSchema(t *testing.T) {
	assert.False(t, isComplexSchema(nil))
	assert.False(t, isComplexSchema(&highbase.Schema{Type: []string{"string"}}))
	assert.False(t, isComplexSchema(&highbase.Schema{Type: []string{"integer"}}))
	assert.False(t, isComplexSchema(&highbase.Schema{Type: []string{"boolean"}}))
	assert.False(t, isComplexSchema(&highbase.Schema{}))

	assert.True(t, isComplexSchema(&highbase.Schema{Type: []string{"object"}}))
	assert.True(t, isComplexSchema(&highbase.Schema{Type: []string{"array"}}))
	assert.True(t, isComplexSchema(&highbase.Schema{
		Properties: orderedmap.New[string, *highbase.SchemaProxy](),
	}))
	assert.True(t, isComplexSchema(&highbase.Schema{
		AllOf: []*highbase.SchemaProxy{{}},
	}))
	assert.True(t, isComplexSchema(&highbase.Schema{
		AnyOf: []*highbase.SchemaProxy{{}},
	}))
	assert.True(t, isComplexSchema(&highbase.Schema{
		OneOf: []*highbase.SchemaProxy{{}},
	}))
}

func TestMockLanguageForMediaType(t *testing.T) {
	tests := []struct {
		mediaType string
		expected  string
	}{
		{"application/json", "json"},
		{"application/xml", "xml"},
		{"text/xml", "xml"},
		{"application/yaml", "yaml"},
		{"application/x-yaml", "yaml"},
		{"text/plain", "json"},
		{"application/octet-stream", "json"},
		{"APPLICATION/XML", "xml"},
		{"application/vnd.api+xml", "xml"},
	}
	for _, tt := range tests {
		t.Run(tt.mediaType, func(t *testing.T) {
			assert.Equal(t, tt.expected, mockLanguageForMediaType(tt.mediaType))
		})
	}
}


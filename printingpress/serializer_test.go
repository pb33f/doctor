// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"testing"

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

func TestMarshalJSON(t *testing.T) {
	result, err := marshalJSON(map[string]string{"key": "value"})
	require.NoError(t, err)
	assert.Equal(t, `{"key":"value"}`, result)
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
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

func TestCaptureSchemaArtifacts_CachesJSONAndHighlight(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /users:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
`
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	v3Doc, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	drDoc := model.NewDrDocument(v3Doc)
	pp := newPressEngine(&pressEngineConfig{DrDoc: drDoc})

	pathItem := drDoc.V3Document.Paths.PathItems.GetOrZero("/users")
	require.NotNil(t, pathItem)
	postOp := pathItem.Post
	require.NotNil(t, postOp)
	requestBody := postOp.RequestBody
	require.NotNil(t, requestBody)
	content := requestBody.Content.GetOrZero("application/json")
	require.NotNil(t, content)
	require.NotNil(t, content.SchemaProxy)
	require.NotNil(t, content.SchemaProxy.Value)
	schema := content.SchemaProxy.Value.Schema()
	require.NotNil(t, schema)

	jsonOne := pp.captureSchemaJSON(schema)
	require.NotEmpty(t, jsonOne)
	require.Len(t, pp.schemaArtifacts.byIdentity, 1)
	require.Len(t, pp.schemaArtifacts.byContent, 1)

	jsonTwo := pp.captureSchemaJSON(schema)
	assert.Equal(t, jsonOne, jsonTwo)
	require.Len(t, pp.schemaArtifacts.byIdentity, 1)
	require.Len(t, pp.schemaArtifacts.byContent, 1)

	highlight := pp.captureSchemaHighlight(schema)
	assert.Contains(t, highlight, "<span")

	artifact, ok := pp.schemaArtifacts.getByIdentity(schema)
	require.True(t, ok)
	assert.True(t, pp.schemaArtifacts.snapshot(artifact).highlighted)
}

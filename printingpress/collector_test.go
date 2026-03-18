// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"encoding/json"
	"os"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// helper to build a Site from an inline OpenAPI spec string.
func pressFromSpec(t *testing.T, spec string) *Site {
	t.Helper()
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	v3, buildErr := doc.BuildV3Model()
	require.NoError(t, buildErr)
	drDoc := model.NewDrDocument(v3)
	pp := New(&PrintingPressConfig{DrDoc: drDoc})
	site, err := pp.Press()
	require.NoError(t, err)
	return site
}

func TestSchemaRawData_Parameter_SimpleSchema(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  parameters:
    MyParam:
      name: myParam
      in: query
      required: true
      schema:
        type: string
        format: uuid
        maxLength: 36
`
	site := pressFromSpec(t, spec)

	params := site.Models["parameters"]
	require.Len(t, params, 1)
	p := params[0]

	// SchemaRawYAML must be set and contain only schema fields
	assert.NotEmpty(t, p.SchemaRawYAML, "SchemaRawYAML should be populated for parameters")
	assert.Contains(t, p.SchemaRawYAML, "type: string")
	assert.Contains(t, p.SchemaRawYAML, "format: uuid")
	assert.Contains(t, p.SchemaRawYAML, "maxLength: 36")
	// Must NOT contain parent-level parameter fields
	assert.NotContains(t, p.SchemaRawYAML, "name:")
	assert.NotContains(t, p.SchemaRawYAML, "in:")
	assert.NotContains(t, p.SchemaRawYAML, "required:")

	// No trailing newline
	assert.False(t, strings.HasSuffix(p.SchemaRawYAML, "\n"),
		"SchemaRawYAML should not end with a trailing newline")

	// SchemaRawJSON must be valid JSON containing schema fields
	assert.NotEmpty(t, p.SchemaRawJSON, "SchemaRawJSON should be populated for parameters")
	var schemaObj map[string]any
	require.NoError(t, json.Unmarshal([]byte(p.SchemaRawJSON), &schemaObj),
		"SchemaRawJSON must be valid JSON")
	assert.Equal(t, "string", schemaObj["type"])
	assert.Equal(t, "uuid", schemaObj["format"])
	assert.EqualValues(t, 36, schemaObj["maxLength"])
	// Must NOT contain parent-level parameter fields in the JSON
	assert.NotContains(t, p.SchemaRawJSON, `"name"`)
	assert.NotContains(t, p.SchemaRawJSON, `"in"`)

	// RawYAML (full parameter) must still contain all fields
	assert.Contains(t, p.RawYAML, "name:")
	assert.Contains(t, p.RawYAML, "in:")
	assert.False(t, strings.HasSuffix(p.RawYAML, "\n"),
		"RawYAML should not end with a trailing newline")

	// SchemaStartLine must point to the schema content line within the rendered YAML
	// "schema:" appears on some line in RawYAML, and content starts on the next line
	assert.Greater(t, p.SchemaStartLine, 1,
		"SchemaStartLine should be > 1 (schema is not the first line of the parent)")
	// Verify schema: is found in RawYAML by checking the line is reasonable
	schemaKeyLine := 0
	for i, line := range strings.Split(p.RawYAML, "\n") {
		if strings.TrimSpace(line) == "schema:" || strings.HasPrefix(strings.TrimSpace(line), "schema:") {
			schemaKeyLine = i + 1
			break
		}
	}
	assert.Greater(t, schemaKeyLine, 0, "RawYAML should contain schema:")
	// Without origin, SchemaStartLine = 1 + schemaKeyLine (origin defaults to 1)
	assert.Equal(t, schemaKeyLine+1, p.SchemaStartLine,
		"SchemaStartLine should be schema: line + 1 (content starts after the key)")
}

func TestSchemaRawData_Parameter_ObjectSchema(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  parameters:
    FilterParam:
      name: filter
      in: query
      schema:
        type: object
        properties:
          status:
            type: string
          limit:
            type: integer
`
	site := pressFromSpec(t, spec)

	params := site.Models["parameters"]
	require.Len(t, params, 1)
	p := params[0]

	assert.NotEmpty(t, p.SchemaRawYAML)
	assert.Contains(t, p.SchemaRawYAML, "type: object")
	assert.Contains(t, p.SchemaRawYAML, "properties:")
	assert.NotContains(t, p.SchemaRawYAML, "name:")
	assert.NotContains(t, p.SchemaRawYAML, "in:")

	assert.NotEmpty(t, p.SchemaRawJSON)
	var schemaObj map[string]any
	require.NoError(t, json.Unmarshal([]byte(p.SchemaRawJSON), &schemaObj))
	assert.Equal(t, "object", schemaObj["type"])
	assert.NotNil(t, schemaObj["properties"])
}

func TestSchemaRawData_Header(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  headers:
    RateLimit:
      description: Rate limit remaining
      schema:
        type: integer
        format: int32
        minimum: 0
`
	site := pressFromSpec(t, spec)

	headers := site.Models["headers"]
	require.Len(t, headers, 1)
	h := headers[0]

	// SchemaRawYAML must contain only schema fields
	assert.NotEmpty(t, h.SchemaRawYAML, "SchemaRawYAML should be populated for headers")
	assert.Contains(t, h.SchemaRawYAML, "type: integer")
	assert.Contains(t, h.SchemaRawYAML, "minimum: 0")
	assert.NotContains(t, h.SchemaRawYAML, "description:")

	assert.False(t, strings.HasSuffix(h.SchemaRawYAML, "\n"),
		"SchemaRawYAML should not end with a trailing newline")

	// SchemaRawJSON must be valid JSON containing schema fields
	assert.NotEmpty(t, h.SchemaRawJSON, "SchemaRawJSON should be populated for headers")
	var schemaObj map[string]any
	require.NoError(t, json.Unmarshal([]byte(h.SchemaRawJSON), &schemaObj))
	assert.Equal(t, "integer", schemaObj["type"])
	assert.Equal(t, "int32", schemaObj["format"])
	assert.EqualValues(t, 0, schemaObj["minimum"])
	assert.NotContains(t, h.SchemaRawJSON, `"description"`)

	// Full RawYAML must contain the description
	assert.Contains(t, h.RawYAML, "description:")

	// SchemaStartLine must be > 1 for headers with fields before schema
	assert.Greater(t, h.SchemaStartLine, 1,
		"SchemaStartLine should be > 1 for header with description before schema")
}

func TestSchemaRawData_Schema_NoSchemaRawFields(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
`
	site := pressFromSpec(t, spec)

	schemas := site.Models["schemas"]
	require.Len(t, schemas, 1)
	s := schemas[0]

	// Schema components must NOT have SchemaRawYAML/JSON (they ARE the schema)
	assert.Empty(t, s.SchemaRawYAML, "schemas should not have SchemaRawYAML")
	assert.Empty(t, s.SchemaRawJSON, "schemas should not have SchemaRawJSON")

	// But must have RawYAML and SchemaJSON
	assert.NotEmpty(t, s.RawYAML)
	assert.NotEmpty(t, s.SchemaJSON)
	assert.False(t, strings.HasSuffix(s.RawYAML, "\n"),
		"RawYAML should not end with a trailing newline")
}

func TestSchemaRawData_ParameterWithoutSchema(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  parameters:
    NoSchemaParam:
      name: noSchema
      in: header
      content:
        application/json:
          schema:
            type: string
`
	site := pressFromSpec(t, spec)

	params := site.Models["parameters"]
	require.Len(t, params, 1)
	p := params[0]

	// Parameter without a direct schema field should have empty schema-specific fields
	assert.Empty(t, p.SchemaRawYAML, "parameter without schema should have no SchemaRawYAML")
	assert.Empty(t, p.SchemaRawJSON, "parameter without schema should have no SchemaRawJSON")
}

func TestSchemaRawData_OtherComponentTypes_NoSchemaRawFields(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths: {}
components:
  responses:
    NotFound:
      description: Not found
  examples:
    SampleExample:
      summary: A sample
      value: hello
  links:
    GetUser:
      operationId: getUser
      description: Get user by ID
`
	site := pressFromSpec(t, spec)

	for _, typeSlug := range []string{"responses", "examples", "links"} {
		pages := site.Models[typeSlug]
		for _, p := range pages {
			assert.Empty(t, p.SchemaRawYAML, "%s/%s should not have SchemaRawYAML", typeSlug, p.Name)
			assert.Empty(t, p.SchemaRawJSON, "%s/%s should not have SchemaRawJSON", typeSlug, p.Name)
		}
	}
}

func TestSchemaRawData_BurgerShop_Integration(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)
	site := pressFromSpec(t, string(spec))

	// Parameters
	params := site.Models["parameters"]
	require.NotEmpty(t, params, "burgershop should have component parameters")
	for _, p := range params {
		assert.NotEmpty(t, p.SchemaRawYAML, "param %s should have SchemaRawYAML", p.Name)
		assert.NotEmpty(t, p.SchemaRawJSON, "param %s should have SchemaRawJSON", p.Name)
		assert.NotContains(t, p.SchemaRawYAML, "name:", "param %s SchemaRawYAML should not contain name:", p.Name)
		assert.NotContains(t, p.SchemaRawYAML, "in:", "param %s SchemaRawYAML should not contain in:", p.Name)
		assert.False(t, strings.HasSuffix(p.SchemaRawYAML, "\n"),
			"param %s SchemaRawYAML should not end with trailing newline", p.Name)

		var obj map[string]any
		require.NoError(t, json.Unmarshal([]byte(p.SchemaRawJSON), &obj),
			"param %s SchemaRawJSON must be valid JSON", p.Name)
	}

	// Headers
	headers := site.Models["headers"]
	require.NotEmpty(t, headers, "burgershop should have component headers")
	for _, h := range headers {
		assert.NotEmpty(t, h.SchemaRawYAML, "header %s should have SchemaRawYAML", h.Name)
		assert.NotEmpty(t, h.SchemaRawJSON, "header %s should have SchemaRawJSON", h.Name)
		assert.False(t, strings.HasSuffix(h.SchemaRawYAML, "\n"),
			"header %s SchemaRawYAML should not end with trailing newline", h.Name)
	}

	// SchemaStartLine must be set and > 1 for params/headers with fields before schema
	for _, p := range params {
		assert.Greater(t, p.SchemaStartLine, 1,
			"param %s SchemaStartLine should be > 1", p.Name)
	}
	for _, h := range headers {
		assert.Greater(t, h.SchemaStartLine, 1,
			"header %s SchemaStartLine should be > 1", h.Name)
	}

	// Schemas must NOT have schema-specific fields
	schemas := site.Models["schemas"]
	require.NotEmpty(t, schemas)
	for _, s := range schemas {
		assert.Empty(t, s.SchemaRawYAML, "schema %s should not have SchemaRawYAML", s.Name)
		assert.Empty(t, s.SchemaRawJSON, "schema %s should not have SchemaRawJSON", s.Name)
		assert.Equal(t, 0, s.SchemaStartLine, "schema %s should have SchemaStartLine=0", s.Name)
	}
}

func TestComputeSchemaStartLine(t *testing.T) {
	tests := []struct {
		name     string
		rawYAML  string
		origin   *bundler.ComponentOrigin
		expected int
	}{
		{
			name:     "schema on line 4, origin line 1",
			rawYAML:  "name: foo\nin: query\nrequired: true\nschema:\n    type: string",
			origin:   &bundler.ComponentOrigin{Line: 1},
			expected: 5, // origin(1) + schemaKeyLine(3, 0-based) + 1
		},
		{
			name:     "schema on line 2, origin line 10",
			rawYAML:  "description: a header\nschema:\n    type: integer",
			origin:   &bundler.ComponentOrigin{Line: 10},
			expected: 12, // origin(10) + schemaKeyLine(1, 0-based) + 1
		},
		{
			name:     "schema on first line, nil origin",
			rawYAML:  "schema:\n    type: string",
			origin:   nil,
			expected: 2, // default origin(1) + schemaKeyLine(0, 0-based) + 1
		},
		{
			name:     "no schema key",
			rawYAML:  "name: foo\nin: query",
			origin:   &bundler.ComponentOrigin{Line: 1},
			expected: 1, // fallback
		},
		{
			name:     "schema with value on same line",
			rawYAML:  "description: test\nschema: {type: string}",
			origin:   &bundler.ComponentOrigin{Line: 5},
			expected: 7, // origin(5) + schemaKeyLine(1, 0-based) + 1
		},
		{
			name:     "schemaVersion key should not match",
			rawYAML:  "schemaVersion: 2\nschema:\n    type: string",
			origin:   &bundler.ComponentOrigin{Line: 1},
			expected: 3, // origin(1) + schemaKeyLine(1, 0-based for "schema:") + 1
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := computeSchemaStartLine(tt.rawYAML, tt.origin)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestComputeCommonHeaders_SharedHeaders(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "Max requests"},
				{Name: "RateLimit-Remaining", SchemaType: "integer (int32)", Description: "Remaining"},
				{Name: "RateLimit-Reset", SchemaType: "integer (int32)", Description: "Reset time"},
			},
		},
		{
			StatusCode: "404",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "Max requests"},
				{Name: "RateLimit-Remaining", SchemaType: "integer (int32)", Description: "Remaining"},
				{Name: "RateLimit-Reset", SchemaType: "integer (int32)", Description: "Reset time"},
			},
		},
		{
			StatusCode: "429",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "Max requests"},
				{Name: "RateLimit-Remaining", SchemaType: "integer (int32)", Description: "Remaining"},
				{Name: "RateLimit-Reset", SchemaType: "integer (int32)", Description: "Reset time"},
				{Name: "Retry-After", SchemaType: "integer", Description: "Seconds to wait"},
			},
		},
	}

	common := computeCommonHeaders(responses)

	// All 4 headers appear in 2+ responses (RateLimit-* in 3, Retry-After only in 1)
	assert.Len(t, common, 3)
	assert.Equal(t, "RateLimit-Limit", common[0].Name)
	assert.Equal(t, "RateLimit-Remaining", common[1].Name)
	assert.Equal(t, "RateLimit-Reset", common[2].Name)
}

func TestComputeCommonHeaders_NoCommon(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "X-Request-Id", SchemaType: "string"},
			},
		},
		{
			StatusCode: "404",
			Headers: []*HeaderInfo{
				{Name: "X-Error-Code", SchemaType: "string"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Empty(t, common)
}

func TestComputeCommonHeaders_SingleResponse(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Empty(t, common)
}

func TestComputeCommonHeaders_NoHeaders(t *testing.T) {
	responses := []*ResponseInfo{
		{StatusCode: "200"},
		{StatusCode: "404"},
	}

	common := computeCommonHeaders(responses)
	assert.Empty(t, common)
}

func TestComputeCommonHeaders_MixedCommonAndUnique(t *testing.T) {
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "X-Common", SchemaType: "string"},
				{Name: "X-Only-200", SchemaType: "string"},
			},
		},
		{
			StatusCode: "500",
			Headers: []*HeaderInfo{
				{Name: "X-Common", SchemaType: "string"},
				{Name: "X-Only-500", SchemaType: "string"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Len(t, common, 1)
	assert.Equal(t, "X-Common", common[0].Name)
}

func TestComputeCommonHeaders_PreservesFirstOccurrenceData(t *testing.T) {
	ref := &ComponentLink{Name: "RateLimit", TypeSlug: "headers", Slug: "rate-limit"}
	responses := []*ResponseInfo{
		{
			StatusCode: "200",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer (int32)", Description: "First desc", Ref: ref},
			},
		},
		{
			StatusCode: "404",
			Headers: []*HeaderInfo{
				{Name: "RateLimit-Limit", SchemaType: "integer", Description: "Second desc"},
			},
		},
	}

	common := computeCommonHeaders(responses)
	assert.Len(t, common, 1)
	assert.Equal(t, "integer (int32)", common[0].SchemaType)
	assert.Equal(t, "First desc", common[0].Description)
	assert.Equal(t, ref, common[0].Ref)
}

func TestCollectExtensions_PreservesOrder(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /test:
    get:
      operationId: testOp
      summary: Test
      x-beta: true
      x-sunset-date: "2026-06-01"
      x-rate-limit:
        requests: 120
        window: 60s
      responses:
        '200':
          description: OK
`
	site := pressFromSpec(t, spec)
	require.Len(t, site.Operations, 1)
	op := site.Operations[0]

	require.Len(t, op.Extensions, 3)
	assert.Equal(t, "beta", op.Extensions[0].Key)
	assert.Equal(t, true, op.Extensions[0].Value)
	assert.Equal(t, "sunset-date", op.Extensions[1].Key)
	assert.Equal(t, "2026-06-01", op.Extensions[1].Value)
	assert.Equal(t, "rate-limit", op.Extensions[2].Key)
	// Object value decoded as map
	rateLimit, ok := op.Extensions[2].Value.(map[string]any)
	require.True(t, ok)
	assert.EqualValues(t, 120, rateLimit["requests"])

	// ExtensionsJSON should be non-empty
	assert.NotEmpty(t, op.ExtensionsJSON)
	assert.Contains(t, op.ExtensionsJSON, "beta")
}

func TestCollectExtensions_NoExtensions(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Test
  version: "1.0"
paths:
  /test:
    get:
      operationId: testOp
      summary: Test
      responses:
        '200':
          description: OK
`
	site := pressFromSpec(t, spec)
	require.Len(t, site.Operations, 1)
	assert.Nil(t, site.Operations[0].Extensions)
	assert.Empty(t, site.Operations[0].ExtensionsJSON)
}

func TestCollectExtensions_NilMap(t *testing.T) {
	result := collectExtensions(nil)
	assert.Nil(t, result)
}

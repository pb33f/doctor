// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"strings"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

// TestWalker_DeterministicPaths_PathItemAndCallbackComponents pins the
// canonical (definition-site) paths for schemas living under
// components.pathItems and components.callbacks. These component types are
// seeded into the canonical path cache like the other component maps; if the
// seeded strings drift from the walker's GenerateJSONPath grammar, the
// assertions here fail.
func TestWalker_DeterministicPaths_PathItemAndCallbackComponents(t *testing.T) {

	yml := `openapi: 3.1.0
info:
  title: pathItem components
  version: 1.0.0
paths:
  /usage:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Shared'
      responses:
        "200":
          description: OK
webhooks:
  reusedHook:
    $ref: '#/components/pathItems/SharedPathItem'
components:
  schemas:
    Shared:
      type: object
      properties:
        marker:
          type: string
  pathItems:
    SharedPathItem:
      post:
        parameters:
          - name: filter
            in: query
            schema:
              type: string
              title: PIParamSchema
        requestBody:
          content:
            application/json:
              schema:
                type: object
                title: PIBodySchema
                properties:
                  inner:
                    type: integer
        responses:
          "200":
            description: OK
            headers:
              X-Rate:
                schema:
                  type: number
                  title: PIHeaderSchema
            content:
              application/json:
                schema:
                  type: array
                  title: PIRespSchema
                  items:
                    type: string
  callbacks:
    SharedCallback:
      '{$request.body#/url}':
        post:
          requestBody:
            content:
              application/json:
                schema:
                  type: object
                  title: CBBodySchema
          responses:
            "200":
              description: OK
`

	doc, err := libopenapi.NewDocument([]byte(yml))
	require.NoError(t, err)
	model, buildErrs := doc.BuildV3Model()
	require.Nil(t, buildErrs)

	walker := NewDrDocumentWithConfig(model, &DrConfig{
		UseSchemaCache:     true,
		DeterministicPaths: true,
	})
	require.NotNil(t, walker)

	expected := map[string]string{
		"PIParamSchema":  "$.components.pathItems['SharedPathItem'].post.parameters[0].schema",
		"PIBodySchema":   "$.components.pathItems['SharedPathItem'].post.requestBody.content['application/json'].schema",
		"PIHeaderSchema": "$.components.pathItems['SharedPathItem'].post.responses['200'].headers['X-Rate'].schema",
		"PIRespSchema":   "$.components.pathItems['SharedPathItem'].post.responses['200'].content['application/json'].schema",
		"CBBodySchema":   "$.components.callbacks['SharedCallback']['{$request.body#/url}'].post.requestBody.content['application/json'].schema",
	}

	found := map[string]string{}
	for _, schema := range walker.Schemas {
		if schema == nil || schema.Value == nil || schema.Value.Title == "" {
			continue
		}
		if _, want := expected[schema.Value.Title]; want {
			found[schema.Value.Title] = schema.GenerateJSONPath()
		}
	}

	for title, wantPath := range expected {
		gotPath, ok := found[title]
		require.True(t, ok, "schema %s not collected", title)
		assert.Equal(t, wantPath, gotPath, "schema %s canonical path", title)
		assert.True(t, strings.HasPrefix(gotPath, "$.components."),
			"schema %s must report a definition-site path, got %s", title, gotPath)
	}
}

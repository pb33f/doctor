// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/require"
)

// TestMalformedRefDoesNotPanic tests that malformed $ref values with special characters
// do not cause a panic during graph building.
func TestMalformedRefDoesNotPanic(t *testing.T) {
	// This spec has a malformed $ref with a special character (å instead of /)
	spec := []byte(`openapi: 3.1.0
info:
  title: The OpenAPI Doctor
  description: A perfect, empty, and useless specification
  contact:
    name: quobix
    email: sales@pb33f.io
    url: https://api.pb33f.io
  license:
    name: MIT
    url: https://opensource.org/license/mit
  version: 1.0.0
tags: []
paths:
    /mctest:
        get:
            description: this is a mctest.
            operationId: mcTest
            responses:
                '200':
                    description: thank you for mctesting.
                    content:
                        application/json:
                            schema:
                                properties:
                                    hat:
                                        allOf:
                                            - properties:
                                                 material:
                                                   type: string
                                            - $ref: '#/components/schemas/Hat'
                                    shoe:
                                      $ref: '#å/components/schemas/Shoe'
components:
    schemas:
        Hat:
            type: object
            properties:
                size:
                    type: number
        Gloves:
            type: object
            properties:
                fingers:
                    type: number
        Shoe:
            description: this is a shoe. you wear it on your feet and hands.
            type: object
            properties:
                laces:
                    type: number
                    example: 2
                soles:
                    type: string
                    example: rubber
`)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	// We may or may not get build errors for the malformed ref, but we should get a document model.
	t.Logf("Build errors: %v", errs)
	require.NotNil(t, v3Doc, "v3Doc should be returned even when references are malformed")

	// Building a DrDocument with a malformed ref should not panic.
	require.NotPanics(t, func() {
		drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
			BuildGraph:     true,
			UseSchemaCache: true,
		})
		require.NotNil(t, drDoc, "drDoc should be created even when the spec has reference errors")
	})

	// NewDrDocumentWithConfig should handle nil input gracefully (return nil, not panic)
	require.NotPanics(t, func() {
		drDoc := NewDrDocumentWithConfig(nil, &DrConfig{
			BuildGraph:     true,
			UseSchemaCache: true,
		})
		require.Nil(t, drDoc, "drDoc should be nil when input document is nil")
	})

	// Also test NewDrDocument and NewDrDocumentAndGraph for nil input
	require.NotPanics(t, func() {
		drDoc := NewDrDocument(nil)
		require.Nil(t, drDoc, "drDoc should be nil when input document is nil")
	})

	require.NotPanics(t, func() {
		drDoc := NewDrDocumentAndGraph(nil)
		require.Nil(t, drDoc, "drDoc should be nil when input document is nil")
	})
}

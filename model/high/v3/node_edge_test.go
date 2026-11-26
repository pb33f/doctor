// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"encoding/json"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestEdgeIsReference(t *testing.T) {
	assert.False(t, GenerateEdge([]string{"a"}, []string{"b"}).IsReference())
	assert.True(t, (&Edge{Ref: "#/components/schemas/Pet"}).IsReference())
	// An authored reference to the current resource is the empty string.
	assert.True(t, (&Edge{Kind: EdgeKindReference, Keyword: "$ref"}).IsReference())
}

func TestEdgeJSONOmitsReferenceFieldsForContainment(t *testing.T) {
	containment, err := json.Marshal(GenerateEdge([]string{"a"}, []string{"b"}))
	require.NoError(t, err)
	assert.JSONEq(t, `{"id":"a_b","sources":["a"],"targets":["b"],"ref":""}`, string(containment))

	reference, err := json.Marshal(&Edge{Id: "ref:a", Sources: []string{"a"}, Targets: []string{"b"}, Kind: EdgeKindReference, Keyword: "$dynamicRef"})
	require.NoError(t, err)
	assert.JSONEq(t, `{"id":"ref:a","sources":["a"],"targets":["b"],"ref":"","kind":"reference","keyword":"$dynamicRef"}`, string(reference))
}

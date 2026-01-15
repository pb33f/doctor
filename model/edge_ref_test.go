// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	"os"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEdgeRefFieldPopulated(t *testing.T) {
	// Load the train-travel spec which has many $ref references
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	// Create DrDocument with graph building enabled
	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:     true,
		UseSchemaCache: true,
	})

	require.NotNil(t, drDoc)
	require.NotNil(t, drDoc.Nodes)
	require.NotNil(t, drDoc.Edges)

	t.Logf("Total nodes: %d", len(drDoc.Nodes))
	t.Logf("Total edges: %d", len(drDoc.Edges))

	// Count edges with ref field populated
	edgesWithRef := 0
	edgesWithoutRef := 0
	for _, edge := range drDoc.Edges {
		if edge.Ref != "" {
			edgesWithRef++
			t.Logf("Edge with ref: %s -> %s, ref=%s", edge.Sources, edge.Targets, edge.Ref)
		} else {
			edgesWithoutRef++
		}
	}

	t.Logf("Edges with ref: %d", edgesWithRef)
	t.Logf("Edges without ref: %d", edgesWithoutRef)

	// Count nodes that have $ref in their instance
	nodesWithRef := 0
	for _, node := range drDoc.Nodes {
		if node.Instance != nil {
			// Check if this node's instance has a reference
			if ref, ok := node.Instance.(interface{ GetReference() string }); ok {
				refStr := ref.GetReference()
				if refStr != "" {
					nodesWithRef++
					t.Logf("Node with instance.$ref: %s, type=%s, ref=%s", node.Id, node.Type, refStr)
				}
			}
		}
	}
	t.Logf("Nodes with instance.$ref: %d", nodesWithRef)

	// The train-travel spec has multiple $ref references, so we expect some edges with ref
	// If this fails, the fix is not working
	assert.Greater(t, edgesWithRef, 0, "Expected at least some edges with ref field populated")
}

func TestEdgeRefFieldDebug(t *testing.T) {
	// This test is for debugging - let's trace through what happens with references
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	// Create DrDocument with graph building enabled
	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:     true,
		UseSchemaCache: true,
	})

	// Print all edges for debugging
	t.Log("=== ALL EDGES ===")
	for i, edge := range drDoc.Edges {
		t.Logf("Edge[%d]: sources=%v targets=%v ref='%s' poly='%s'",
			i, edge.Sources, edge.Targets, edge.Ref, edge.Poly)
	}

	// Print all nodes for debugging
	t.Log("=== ALL NODES ===")
	for _, node := range drDoc.Nodes {
		t.Logf("Node: id=%s type=%s label=%s", node.Id, node.Type, node.Label)
	}
}

func TestSelfReferencingEdges(t *testing.T) {
	// This test checks for self-referencing edges (source == target)
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:     true,
		UseSchemaCache: true,
	})

	// Find self-referencing edges
	selfRefCount := 0
	for _, edge := range drDoc.Edges {
		if edge.Ref != "" && len(edge.Sources) > 0 && len(edge.Targets) > 0 {
			if edge.Sources[0] == edge.Targets[0] {
				selfRefCount++
				t.Logf("SELF-REF: %s -> %s, ref=%s", edge.Sources[0], edge.Targets[0], edge.Ref)
			}
		}
	}

	t.Logf("Total self-referencing edges: %d", selfRefCount)

	// Self-referencing edges should not exist
	assert.Equal(t, 0, selfRefCount, "Should have no self-referencing edges")
}

// TestPolymorphicAllOfEdges verifies that all allOf items create proper edges in the graph.
// This test addresses the bug where only 1 of 3 allOf children was appearing in the graph.
//
// The train-travel.yaml /bookings GET 200 response has:
//   - allOf[0]: $ref to Wrapper-Collection (creates reference edge)
//   - allOf[1]: inline schema with 'data' property (creates child node + edge)
//   - allOf[2]: inline schema with 'links' property (creates child node + edge)
//
// All 3 should create edges from the parent schema.
func TestPolymorphicAllOfEdges(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:     true,
		UseSchemaCache: true,
	})

	require.NotNil(t, drDoc)

	// Navigate to the /bookings GET 200 response schema
	bookingsPath := drDoc.V3Document.Paths.PathItems.GetOrZero("/bookings")
	require.NotNil(t, bookingsPath, "Should find /bookings path")

	getOp := bookingsPath.Get
	require.NotNil(t, getOp, "Should find GET operation")

	resp200 := getOp.Responses.Codes.GetOrZero("200")
	require.NotNil(t, resp200, "Should find 200 response")

	jsonContent := resp200.Content.GetOrZero("application/json")
	require.NotNil(t, jsonContent, "Should find application/json content")

	schemaProxy := jsonContent.SchemaProxy
	require.NotNil(t, schemaProxy, "Should find schema proxy")

	schema := schemaProxy.Schema
	require.NotNil(t, schema, "Should find schema")

	// Verify the schema has 3 allOf items
	require.Equal(t, 3, len(schema.AllOf), "Schema should have 3 allOf items")

	// Verify the parent schema has a node
	require.NotNil(t, schema.Node, "Parent schema should have a node")
	parentNodeId := schema.Node.Id

	// Count edges from the parent schema
	edgesFromParent := 0
	var edgeDetails []string
	for _, edge := range drDoc.Edges {
		for _, src := range edge.Sources {
			if src == parentNodeId {
				edgesFromParent++
				detail := "inline"
				if edge.Ref != "" {
					detail = "ref: " + edge.Ref
				}
				edgeDetails = append(edgeDetails, detail)
			}
		}
	}

	// Log edge details for debugging
	for i, detail := range edgeDetails {
		t.Logf("Edge %d from parent: %s", i+1, detail)
	}

	// CRITICAL ASSERTION: There should be exactly 3 edges from the parent schema
	// - 1 reference edge (to Wrapper-Collection)
	// - 2 inline schema edges (for allOf[1] and allOf[2])
	assert.Equal(t, 3, edgesFromParent,
		"Parent schema should have exactly 3 child edges for all 3 allOf items")

	// Verify allOf[0] is a reference (no child node, but has reference edge)
	assert.True(t, schema.AllOf[0].Value.IsReference(), "allOf[0] should be a reference")
	assert.Nil(t, schema.AllOf[0].Schema.Node, "allOf[0] reference should not create a child node")

	// Verify allOf[1] and allOf[2] have child nodes
	assert.NotNil(t, schema.AllOf[1].Schema.Node, "allOf[1] inline schema should have a node")
	assert.NotNil(t, schema.AllOf[2].Schema.Node, "allOf[2] inline schema should have a node")
}

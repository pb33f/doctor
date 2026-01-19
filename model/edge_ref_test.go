// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	"os"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
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
	// - 3 edges to the allOf[0], allOf[1], and allOf[2] nodes
	// Note: With polymorphic node creation, allOf[0] (which is a $ref) also gets a node,
	// and the reference edge goes FROM allOf[0] to the component definition, not from parent.
	assert.Equal(t, 3, edgesFromParent,
		"Parent schema should have exactly 3 child edges for all 3 allOf items")

	// Verify allOf[0] is a reference and HAS a node (polymorphic refs now get nodes)
	assert.True(t, schema.AllOf[0].Value.IsReference(), "allOf[0] should be a reference")
	assert.NotNil(t, schema.AllOf[0].Schema.Node, "allOf[0] polymorphic reference should have a node")

	// Verify allOf[1] and allOf[2] have child nodes
	assert.NotNil(t, schema.AllOf[1].Schema.Node, "allOf[1] inline schema should have a node")
	assert.NotNil(t, schema.AllOf[2].Schema.Node, "allOf[2] inline schema should have a node")

	// Verify there's a reference edge FROM allOf[0] to the component definition
	allOf0NodeId := schema.AllOf[0].Schema.Node.Id
	refEdgesFromAllOf0 := 0
	for _, edge := range drDoc.Edges {
		for _, src := range edge.Sources {
			if src == allOf0NodeId && edge.Ref != "" {
				refEdgesFromAllOf0++
				t.Logf("Reference edge from allOf[0]: %s -> %v, ref=%s", src, edge.Targets, edge.Ref)
			}
		}
	}
	assert.Greater(t, refEdgesFromAllOf0, 0, "allOf[0] should have a reference edge to component definition")
}

// TestHeaderReferenceEdges verifies that header $ref edges have the ref field populated.
// This addresses the bug where edges from responses to header components show as blue (non-ref)
// instead of green (ref) because the ref field is empty.
func TestHeaderReferenceEdges(t *testing.T) {
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

	// Find edges that target header components
	headerEdges := make(map[string]bool)
	headerEdgesWithRef := 0
	headerEdgesWithoutRef := 0

	for _, edge := range drDoc.Edges {
		for _, target := range edge.Targets {
			if contains(target, "headers") && contains(target, "$.components") {
				edgeKey := edge.Sources[0] + " -> " + target
				if !headerEdges[edgeKey] {
					headerEdges[edgeKey] = true
					if edge.Ref != "" {
						headerEdgesWithRef++
						t.Logf("Header edge WITH ref: %s -> %s, ref=%s", edge.Sources[0], target, edge.Ref)
					} else {
						headerEdgesWithoutRef++
						t.Logf("Header edge WITHOUT ref: %s -> %s", edge.Sources[0], target)
					}
				}
			}
		}
	}

	t.Logf("Header edges with ref: %d", headerEdgesWithRef)
	t.Logf("Header edges without ref: %d", headerEdgesWithoutRef)

	// All edges from responses to header components should have ref populated
	// because they are $ref references
	assert.Greater(t, headerEdgesWithRef, 0, "Expected header reference edges to have ref field populated")
}

// TestHeaderIsReferenceCheck verifies that lowHeaderPairs.Value().IsReference() returns true
// for header $refs in the low-level model.
func TestHeaderIsReferenceCheck(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	// Check the /stations GET 200 response which has header refs
	stationsPath := v3Doc.Model.Paths.PathItems.GetOrZero("/stations")
	require.NotNil(t, stationsPath, "Should find /stations path")

	getOp := stationsPath.Get
	require.NotNil(t, getOp, "Should find GET operation")

	resp200 := getOp.Responses.Codes.GetOrZero("200")
	require.NotNil(t, resp200, "Should find 200 response")
	require.NotNil(t, resp200.Headers, "Should have headers")

	// Check low-level model for references
	lowResp := resp200.GoLow()
	require.NotNil(t, lowResp, "Should have low-level response")
	require.NotNil(t, lowResp.Headers, "Should have low-level headers")

	headersChecked := 0
	headersWithRef := 0

	for headerPairs := lowResp.Headers.Value.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
		headersChecked++
		headerKey := headerPairs.Key().Value
		isRef := headerPairs.Value().IsReference()
		refValue := ""
		if isRef {
			refValue = headerPairs.Value().GetReference()
			headersWithRef++
		}
		t.Logf("Header '%s': IsReference()=%v, GetReference()='%s'", headerKey, isRef, refValue)
	}

	t.Logf("Headers checked: %d, with reference: %d", headersChecked, headersWithRef)

	// The /stations GET 200 response should have header $refs
	assert.Greater(t, headersChecked, 0, "Should have headers to check")
	assert.Greater(t, headersWithRef, 0, "IsReference() should return true for header $refs")
}

// TestHeaderReferenceEdgesWithDeterministicPaths tests with DeterministicPaths=true
// to match the API configuration.
func TestHeaderReferenceEdgesWithDeterministicPaths(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:         true,
		UseSchemaCache:     true,
		DeterministicPaths: true, // Match API config
	})

	require.NotNil(t, drDoc)

	// Find all edges involving headers
	t.Log("=== All edges involving 'headers' ===")
	headerEdgesWithRef := 0
	headerEdgesWithoutRef := 0

	for _, edge := range drDoc.Edges {
		isHeaderEdge := false
		for _, src := range edge.Sources {
			if contains(src, "headers") {
				isHeaderEdge = true
				break
			}
		}
		for _, tgt := range edge.Targets {
			if contains(tgt, "headers") {
				isHeaderEdge = true
				break
			}
		}

		if isHeaderEdge {
			if edge.Ref != "" {
				headerEdgesWithRef++
				t.Logf("WITH ref: %v -> %v, ref=%s", edge.Sources, edge.Targets, edge.Ref)
			} else {
				headerEdgesWithoutRef++
				t.Logf("WITHOUT ref: %v -> %v", edge.Sources, edge.Targets)
			}
		}
	}

	t.Logf("Header edges with ref: %d", headerEdgesWithRef)
	t.Logf("Header edges without ref: %d", headerEdgesWithoutRef)

	// Check for edges from responses directly to header components (this is the bug pattern)
	responsesToHeaderComponents := 0
	for _, edge := range drDoc.Edges {
		for _, src := range edge.Sources {
			// Source is a response (contains "responses" but NOT "headers")
			if contains(src, "responses") && !contains(src, "headers") {
				for _, tgt := range edge.Targets {
					// Target is a header component
					if contains(tgt, "$.components.headers") {
						responsesToHeaderComponents++
						t.Logf("RESPONSE->HEADER_COMPONENT: %s -> %s, ref='%s'", src, tgt, edge.Ref)
					}
				}
			}
		}
	}

	t.Logf("Edges from responses directly to header components: %d", responsesToHeaderComponents)

	// This is the assertion that should fail if the bug exists
	// Edges from header INSTANCES to header COMPONENTS should have ref
	assert.Greater(t, headerEdgesWithRef, 0, "Expected header reference edges to have ref field populated")
}

// TestDebugHeaderRefInResponse traces through the exact code path in response.go
// to understand why ref is not being set on header edges.
func TestDebugHeaderRefInResponse(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	// Get the /stations GET 200 response
	stationsPath := v3Doc.Model.Paths.PathItems.GetOrZero("/stations")
	require.NotNil(t, stationsPath)

	getOp := stationsPath.Get
	require.NotNil(t, getOp)

	resp200 := getOp.Responses.Codes.GetOrZero("200")
	require.NotNil(t, resp200)

	// This is what response.go does:
	// for headerPairs := response.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
	//   ... find matching low header ...
	//   if lowHeaderPairs.Value().IsReference() { refString = ... }
	// }

	t.Log("=== Checking high-level headers ===")
	for headerPairs := resp200.Headers.First(); headerPairs != nil; headerPairs = headerPairs.Next() {
		headerKey := headerPairs.Key()
		t.Logf("High-level header: %s", headerKey)
	}

	t.Log("=== Checking low-level headers ===")
	lowResp := resp200.GoLow()
	require.NotNil(t, lowResp.Headers)

	for lowHeaderPairs := lowResp.Headers.Value.First(); lowHeaderPairs != nil; lowHeaderPairs = lowHeaderPairs.Next() {
		headerKey := lowHeaderPairs.Key().Value
		isRef := lowHeaderPairs.Value().IsReference()
		refValue := ""
		if isRef {
			refValue = lowHeaderPairs.Value().GetReference()
		}
		t.Logf("Low-level header '%s': IsReference()=%v, GetReference()='%s'", headerKey, isRef, refValue)

		// Also check what type this is
		t.Logf("  Type: %T", lowHeaderPairs.Value())
	}
}

// TestCheckDuplicateEdges checks if we're creating duplicate edges with same ID
// but different ref values.
func TestCheckDuplicateEdges(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:         true,
		UseSchemaCache:     true,
		DeterministicPaths: true,
	})

	require.NotNil(t, drDoc)

	// Check for duplicate edge IDs
	edgeById := make(map[string][]*drV3.Edge)
	for _, edge := range drDoc.Edges {
		edgeById[edge.Id] = append(edgeById[edge.Id], edge)
	}

	duplicates := 0
	for id, edges := range edgeById {
		if len(edges) > 1 {
			duplicates++
			t.Logf("DUPLICATE edge ID: %s (%d occurrences)", id, len(edges))
			for i, e := range edges {
				t.Logf("  [%d] sources=%v targets=%v ref='%s'", i, e.Sources, e.Targets, e.Ref)
			}
		}
	}

	t.Logf("Total edges: %d, Unique IDs: %d, Duplicates: %d", len(drDoc.Edges), len(edgeById), duplicates)

	// If there are NO duplicates but we expected ref edges, the ref edge might have overwritten
	// OR the parent-child edge might be created with a different target
	// Let's check header-related edges specifically
	t.Log("=== Header edges analysis ===")
	for _, edge := range drDoc.Edges {
		for _, tgt := range edge.Targets {
			if contains(tgt, "headers") && contains(tgt, "$.components") {
				t.Logf("Edge ID: %s", edge.Id)
				t.Logf("  Sources: %v", edge.Sources)
				t.Logf("  Targets: %v", edge.Targets)
				t.Logf("  Ref: '%s'", edge.Ref)
			}
		}
	}
}

// TestCheckHeaderNodeWithDeterministicPaths checks if header nodes exist when DeterministicPaths=true.
// In response.go, BuildReferenceEdge is only called if header.GetNode() != nil.
func TestCheckHeaderNodeWithDeterministicPaths(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:         true,
		UseSchemaCache:     true,
		DeterministicPaths: true,
	})

	require.NotNil(t, drDoc)

	// Find header nodes in the node list
	t.Log("=== Looking for header-related nodes ===")
	headerNodes := 0
	for _, node := range drDoc.Nodes {
		if contains(node.Id, "headers") {
			headerNodes++
			t.Logf("Header node: id=%s, type=%s, label=%s", node.Id, node.Type, node.Label)
		}
	}
	t.Logf("Total header nodes: %d", headerNodes)

	// Also check if there are nodes for header instances (not just components)
	headerInstanceNodes := 0
	headerComponentNodes := 0
	for _, node := range drDoc.Nodes {
		if contains(node.Id, "headers") {
			if contains(node.Id, "$.components.headers") {
				headerComponentNodes++
			} else if contains(node.Id, "responses") && contains(node.Id, "headers") {
				headerInstanceNodes++
				t.Logf("Header INSTANCE node: %s", node.Id)
			}
		}
	}
	t.Logf("Header component nodes: %d", headerComponentNodes)
	t.Logf("Header instance nodes: %d", headerInstanceNodes)

	// The bug: with DeterministicPaths, header instance nodes might not be created
	// because they're "canonicalized" to the component path
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

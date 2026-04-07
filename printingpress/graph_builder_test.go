// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"encoding/json"
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.yaml.in/yaml/v4"
)

func TestSchemaNodeID(t *testing.T) {
	tests := []struct {
		name          string
		componentType string
		schemaName    string
		expected      string
	}{
		{"simple", "schemas", "Pet", "$.components.schemas['Pet']"},
		{"multi-word", "schemas", "ApiResponse", "$.components.schemas['ApiResponse']"},
		{"parameters", "parameters", "offsetParam", "$.components.parameters['offsetParam']"},
		{"headers", "headers", "RateLimit", "$.components.headers['RateLimit']"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := SchemaNodeID(tt.componentType, tt.schemaName)
			assert.Equal(t, tt.expected, got)
		})
	}
}

func TestSchemaNodeID_SpecialChars(t *testing.T) {
	tests := []struct {
		name       string
		schemaName string
		expected   string
	}{
		{"with-slash", "Links/Self", "$.components.schemas['Links']['Self']"},
		{"with-tilde", "Config~Main", "$.components.schemas['Config~Main']"},
		{"with-space", "Custom Certificate", "$.components.schemas['Custom Certificate']"},
		{"with-dot", "v1.Error", "$.components.schemas['v1.Error']"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := SchemaNodeID("schemas", tt.schemaName)
			assert.Equal(t, tt.expected, got)
		})
	}
}

// makeNode creates a top-level component schema node for testing.
func makeNode(id string) *v3.Node {
	return &v3.Node{
		Id:       id,
		ParentId: "$.components.schemas",
		Label:    id,
		Type:     "schema",
		Width:    200,
		Height:   25,
	}
}

// makeSubNode creates a sub-path node belonging to a top-level schema.
func makeSubNode(id, parentId string) *v3.Node {
	return &v3.Node{
		Id:       id,
		ParentId: parentId,
		Label:    id,
		Type:     "schema",
		Width:    200,
		Height:   25,
	}
}

func makeSchemaNodeWithSchema(id string, schema *base.Schema, height int) *v3.Node {
	return &v3.Node{
		Id:         id,
		ParentId:   "$.components.schemas",
		Label:      id,
		Type:       "schema",
		Width:      200,
		Height:     height,
		DrInstance: &v3.Schema{Value: schema},
	}
}

// makeRefEdge creates a reference edge.
func makeRefEdge(id, source, target, ref string) *v3.Edge {
	return &v3.Edge{
		Id:      id,
		Sources: []string{source},
		Targets: []string{target},
		Ref:     ref,
	}
}

// parseGraphNodes extracts a map of node ID → parsed JSON from the graph result.
func parseGraphNodes(t *testing.T, result string) map[string]map[string]interface{} {
	t.Helper()
	var graph focusedGraphResult
	require.NoError(t, json.Unmarshal([]byte(result), &graph))

	nodeMap := make(map[string]map[string]interface{})
	for _, nj := range graph.Nodes {
		var n map[string]interface{}
		require.NoError(t, json.Unmarshal(nj, &n))
		nodeMap[n["id"].(string)] = n
	}
	return nodeMap
}

func parseGraphResult(t *testing.T, result string) focusedGraphResult {
	t.Helper()
	var graph focusedGraphResult
	require.NoError(t, json.Unmarshal([]byte(result), &graph))
	return graph
}

func TestBuildFocusedGraph_Simple(t *testing.T) {
	// A → B → C (A $refs B, B $refs C)
	// Focus on B: A is an incoming referrer (dimmed), C is an outgoing referent (normal)
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeNode("$.components.schemas['C']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['A']", "$.components.schemas['B']", "#/components/schemas/B"),
		makeRefEdge("e2", "$.components.schemas['B']", "$.components.schemas['C']", "#/components/schemas/C"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['B']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	var graph focusedGraphResult
	require.NoError(t, json.Unmarshal([]byte(result), &graph))
	assert.Len(t, graph.Nodes, 3)
	assert.Len(t, graph.Edges, 2)
	require.Len(t, graph.Edges, 2)

	nodeMap := parseGraphNodes(t, result)

	// B is the target — no dependency flag
	_, hasDep := nodeMap["$.components.schemas['B']"]["dependency"]
	assert.False(t, hasDep, "target node should not have dependency flag")

	// C is outgoing referent (what B depends on) — NOT dimmed
	_, hasDep = nodeMap["$.components.schemas['C']"]["dependency"]
	assert.False(t, hasDep, "outgoing referent should not be dimmed")

	// A is incoming referrer (depends on B) — DIMMED
	assert.Equal(t, true, nodeMap["$.components.schemas['A']"]["dependency"],
		"incoming referrer should be dimmed")
	for _, edge := range graph.Edges {
		switch {
		case len(edge.Sources) == 1 && len(edge.Targets) == 1 &&
			edge.Sources[0] == "$.components.schemas['A']" &&
			edge.Targets[0] == "$.components.schemas['B']":
			assert.True(t, edge.Dependency, "incoming ancestor edge should be dimmed")
		case len(edge.Sources) == 1 && len(edge.Targets) == 1 &&
			edge.Sources[0] == "$.components.schemas['B']" &&
			edge.Targets[0] == "$.components.schemas['C']":
			assert.False(t, edge.Dependency, "outgoing dependency edge should stay lit")
		}
	}
}

func TestBuildFocusedGraph_NoDirectionCrossing(t *testing.T) {
	// A → B ← C → D
	// Focus on B: A is outgoing referent (normal), C is incoming referrer (dimmed).
	// D is an outgoing referent of C, but should NOT appear because the BFS
	// should not follow outgoing edges from an incoming-discovered node.
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeNode("$.components.schemas['C']"),
		makeNode("$.components.schemas['D']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['B']", "$.components.schemas['A']", "#/components/schemas/A"),
		makeRefEdge("e2", "$.components.schemas['C']", "$.components.schemas['B']", "#/components/schemas/B"),
		makeRefEdge("e3", "$.components.schemas['C']", "$.components.schemas['D']", "#/components/schemas/D"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['B']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)

	assert.Contains(t, nodeMap, "$.components.schemas['B']", "target should be present")
	assert.Contains(t, nodeMap, "$.components.schemas['A']", "outgoing referent should be present")
	assert.Contains(t, nodeMap, "$.components.schemas['C']", "incoming referrer should be present")
	assert.NotContains(t, nodeMap, "$.components.schemas['D']",
		"D should NOT be included — it's an outgoing ref of C, not related to B")
}

func TestBuildFocusedGraph_NodeReachableInBothPhases(t *testing.T) {
	// B is both an outgoing referent and an incoming referrer for A:
	// A → B, B → A, C → B
	//
	// Focus on A:
	// - B must still be traversed in the incoming phase even though it was already
	//   included by the outgoing phase.
	// - C must be discovered via B in the incoming phase.
	// - B must be dimmed because it is also an incoming referrer of A.
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeNode("$.components.schemas['C']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['A']", "$.components.schemas['B']", "#/components/schemas/B"),
		makeRefEdge("e2", "$.components.schemas['B']", "$.components.schemas['A']", "#/components/schemas/A"),
		makeRefEdge("e3", "$.components.schemas['C']", "$.components.schemas['B']", "#/components/schemas/B"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['A']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	assert.Contains(t, nodeMap, "$.components.schemas['B']", "B should be included")
	assert.Contains(t, nodeMap, "$.components.schemas['C']",
		"C should be discovered through incoming traversal from B")
	assert.Equal(t, true, nodeMap["$.components.schemas['B']"]["dependency"],
		"B should be dimmed because it is an incoming referrer of A")
	assert.Equal(t, true, nodeMap["$.components.schemas['C']"]["dependency"],
		"C should be dimmed because it is an incoming referrer chain of A")
}

func TestBuildFocusedGraph_SubPathOutgoing(t *testing.T) {
	// B has a property that $refs A. The edge source is B's sub-path, not B itself.
	// Focus on B: A should be found as an outgoing referent (not dimmed).
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeSubNode("$.components.schemas['B'].properties['foo']", "$.components.schemas['B']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1",
			"$.components.schemas['B'].properties['foo']",
			"$.components.schemas['A']",
			"#/components/schemas/A"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['B']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	graph := parseGraphResult(t, result)
	assert.Contains(t, nodeMap, "$.components.schemas['A']", "sub-path outgoing ref should be found")
	_, hasDep := nodeMap["$.components.schemas['A']"]["dependency"]
	assert.False(t, hasDep, "outgoing referent should not be dimmed")
	require.Len(t, graph.Edges, 1)
	assert.Equal(t, []string{"$.components.schemas['B']"}, graph.Edges[0].Sources,
		"edge source should be normalized to top-level schema")
	assert.Equal(t, []string{"$.components.schemas['A']"}, graph.Edges[0].Targets,
		"edge target should point at the visible top-level schema")
}

func TestBuildFocusedGraph_SubPathIncoming(t *testing.T) {
	// A has a property that $refs B. The edge target is B's sub-path.
	// Focus on B: A should be found as an incoming referrer (dimmed).
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeSubNode("$.components.schemas['B'].properties['bar']", "$.components.schemas['B']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1",
			"$.components.schemas['A']",
			"$.components.schemas['B'].properties['bar']",
			"#/components/schemas/B"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['B']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	graph := parseGraphResult(t, result)
	assert.Contains(t, nodeMap, "$.components.schemas['A']", "incoming ref to sub-path should be found")
	assert.Equal(t, true, nodeMap["$.components.schemas['A']"]["dependency"],
		"incoming referrer should be dimmed")
	require.Len(t, graph.Edges, 1)
	assert.Equal(t, []string{"$.components.schemas['A']"}, graph.Edges[0].Sources,
		"incoming edge source should stay on the top-level schema")
	assert.Equal(t, []string{"$.components.schemas['B']"}, graph.Edges[0].Targets,
		"incoming edge target should be normalized to the visible top-level schema")
}

func TestBuildFocusedGraph_SlashNamedSchema(t *testing.T) {
	// Verify sub-path ownership uses longest match.
	// Schemas: Links and Links/Self (which becomes Links']['Self'] in JSONPath).
	// A sub-path of Links/Self should NOT be assigned to Links.
	linksID := "$.components.schemas['Links']"
	linksSelfID := "$.components.schemas['Links']['Self']"
	linksSelfPropID := "$.components.schemas['Links']['Self'].properties['url']"

	nodes := []*v3.Node{
		makeNode(linksID),
		makeNode(linksSelfID),
		makeSubNode(linksSelfPropID, linksSelfID),
		makeNode("$.components.schemas['Target']"),
	}
	edges := []*v3.Edge{
		// Target $refs Links/Self via a property sub-path
		makeRefEdge("e1",
			linksSelfPropID,
			"$.components.schemas['Target']",
			"#/components/schemas/Target"),
	}

	// Focus on Target: Links/Self should appear (incoming referrer via sub-path), Links should NOT
	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['Target']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	assert.Contains(t, nodeMap, linksSelfID, "Links/Self should be found via sub-path edge")
	assert.NotContains(t, nodeMap, linksID, "Links should NOT be included — sub-path belongs to Links/Self")
}

func TestBuildFocusedGraph_SlashNamedSchema_NestedParentChain(t *testing.T) {
	linksID := "$.components.schemas['Links']"
	linksSelfID := "$.components.schemas['Links']['Self']"
	linksSelfPropsID := linksSelfID + ".properties"
	linksSelfNestedID := linksSelfID + ".properties['meta'].properties['url']"
	targetID := "$.components.schemas['Target']"

	nodes := []*v3.Node{
		makeNode(linksID),
		makeNode(linksSelfID),
		makeSubNode(linksSelfPropsID, linksSelfID),
		makeSubNode(linksSelfNestedID, linksSelfPropsID),
		makeNode(targetID),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", linksSelfNestedID, targetID, "#/components/schemas/Target"),
	}

	result, err := BuildFocusedGraph(nodes, edges, targetID, 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	assert.Contains(t, nodeMap, linksSelfID,
		"nested sub-path ownership should resolve through the parent chain to Links/Self")
	assert.NotContains(t, nodeMap, linksID,
		"nested sub-path should not be misattributed to the shorter Links schema")
}

func TestBuildFocusedGraph_Circular(t *testing.T) {
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['A']", "$.components.schemas['B']", "#/components/schemas/B"),
		makeRefEdge("e2", "$.components.schemas['B']", "$.components.schemas['A']", "#/components/schemas/A"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['A']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	var graph focusedGraphResult
	require.NoError(t, json.Unmarshal([]byte(result), &graph))
	assert.Len(t, graph.Nodes, 2)
}

func TestBuildFocusedGraph_DepthLimit(t *testing.T) {
	// Chain: A → B → C → D → E (all outgoing from A's perspective)
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeNode("$.components.schemas['C']"),
		makeNode("$.components.schemas['D']"),
		makeNode("$.components.schemas['E']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['A']", "$.components.schemas['B']", "#/components/schemas/B"),
		makeRefEdge("e2", "$.components.schemas['B']", "$.components.schemas['C']", "#/components/schemas/C"),
		makeRefEdge("e3", "$.components.schemas['C']", "$.components.schemas['D']", "#/components/schemas/D"),
		makeRefEdge("e4", "$.components.schemas['D']", "$.components.schemas['E']", "#/components/schemas/E"),
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['A']", 2)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	var graph focusedGraphResult
	require.NoError(t, json.Unmarshal([]byte(result), &graph))
	assert.Len(t, graph.Nodes, 3) // A, B, C
	assert.Len(t, graph.Edges, 2) // A→B, B→C
}

func TestBuildFocusedGraph_MissingNode(t *testing.T) {
	nodes := []*v3.Node{makeNode("$.components.schemas['A']")}
	result, err := BuildFocusedGraph(nodes, nil, "$.components.schemas['NonExistent']", 5)
	require.NoError(t, err)
	assert.Empty(t, result)
}

func TestBuildFocusedGraph_NoDependencies(t *testing.T) {
	nodes := []*v3.Node{makeNode("$.components.schemas['Standalone']")}
	result, err := BuildFocusedGraph(nodes, nil, "$.components.schemas['Standalone']", 5)
	require.NoError(t, err)
	assert.Empty(t, result)
}

func TestFocusedGraphIndex_SkipsIsolatedSchemas(t *testing.T) {
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeNode("$.components.schemas['Standalone']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['A']", "$.components.schemas['B']", "#/components/schemas/B"),
	}

	idx := newFocusedGraphIndex(nodes, edges, nil)
	assert.True(t, idx.hasSchemaConnections("$.components.schemas['A']"))
	assert.True(t, idx.hasSchemaConnections("$.components.schemas['B']"))
	assert.False(t, idx.hasSchemaConnections("$.components.schemas['Standalone']"))

	result, err := idx.buildFocusedModelGraph("$.components.schemas['Standalone']", 5, nil)
	require.NoError(t, err)
	assert.Empty(t, result, "isolated schemas should be skipped before graph generation")
}

func TestBuildFocusedGraph_IgnoresNonRefEdges(t *testing.T) {
	nodes := []*v3.Node{
		makeNode("$.components.schemas['A']"),
		makeNode("$.components.schemas['B']"),
		makeSubNode("$.components.schemas['A'].properties", "$.components.schemas['A']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['A']", "$.components.schemas['B']", "#/components/schemas/B"),
		{Id: "e2", Sources: []string{"$.components.schemas['A']"}, Targets: []string{"$.components.schemas['A'].properties"}, Ref: ""},
	}

	result, err := BuildFocusedGraph(nodes, edges, "$.components.schemas['A']", 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	var graph focusedGraphResult
	require.NoError(t, json.Unmarshal([]byte(result), &graph))
	assert.Len(t, graph.Nodes, 2)
	assert.Len(t, graph.Edges, 1)
}

func TestBuildFocusedGraph_EmptyInputs(t *testing.T) {
	result, err := BuildFocusedGraph(nil, nil, "anything", 5)
	require.NoError(t, err)
	assert.Empty(t, result)

	result, err = BuildFocusedGraph([]*v3.Node{}, nil, "", 5)
	require.NoError(t, err)
	assert.Empty(t, result)
}

func TestBuildFocusedGraph_TrimsNoExamplesRowForFocusedSchemas(t *testing.T) {
	targetID := "$.components.schemas['BookingPayment']"
	noExamplesProps := orderedmap.New[string, *base.SchemaProxy]()
	noExamplesProps.Set("amount", base.CreateSchemaProxy(&base.Schema{Type: []string{"number"}}))
	noExamplesSchema := &base.Schema{
		Type:       []string{"object"},
		Properties: noExamplesProps,
	}
	exampleProps := orderedmap.New[string, *base.SchemaProxy]()
	exampleProps.Set("amount", base.CreateSchemaProxy(&base.Schema{Type: []string{"number"}}))
	exampleSchema := &base.Schema{
		Type:       []string{"object"},
		Example:    &yaml.Node{Kind: yaml.MappingNode},
		Properties: exampleProps,
	}

	nodes := []*v3.Node{
		makeSchemaNodeWithSchema(targetID, noExamplesSchema, 75),
		makeSchemaNodeWithSchema("$.components.schemas['ExampleRich']", exampleSchema, 50),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", targetID, "$.components.schemas['ExampleRich']", "#/components/schemas/ExampleRich"),
	}

	result, err := BuildFocusedGraph(nodes, edges, targetID, 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	assert.Equal(t, float64(50), nodeMap[targetID]["height"],
		"focused schema nodes should not reserve space for the hidden no-examples row")
	assert.Equal(t, float64(50), nodeMap["$.components.schemas['ExampleRich']"]["height"],
		"schemas with examples should keep their existing height")
}

func TestBuildFocusedModelGraph_OperationsOnly(t *testing.T) {
	targetID := "$.components.schemas['ReleaseSummary']"
	props := orderedmap.New[string, *base.SchemaProxy]()
	props.Set("name", base.CreateSchemaProxy(&base.Schema{Type: []string{"string"}}))
	nodes := []*v3.Node{
		makeSchemaNodeWithSchema(targetID, &base.Schema{
			Type:       []string{"object"},
			Properties: props,
		}, 75),
	}
	usedByOperations := []*OperationRef{
		{Method: "GET", Path: "/release-notes/{project}", Slug: "get-release-notes-project"},
		{Method: "GET", Path: "/release-notes/{project}/{version}", Slug: "get-release-notes-project-version"},
	}

	result, err := BuildFocusedModelGraph(nodes, nil, targetID, 5, usedByOperations)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	graph := parseGraphResult(t, result)

	assert.Contains(t, nodeMap, targetID, "target schema should be present")
	assert.Equal(t, float64(50), nodeMap[targetID]["height"],
		"operations-only focused graphs should still trim the hidden no-examples row")

	opOneID := syntheticOperationConsumerNodeID(usedByOperations[0])
	opTwoID := syntheticOperationConsumerNodeID(usedByOperations[1])
	require.Contains(t, nodeMap, opOneID, "first operation consumer should be present")
	require.Contains(t, nodeMap, opTwoID, "second operation consumer should be present")
	assert.Equal(t, "/release-notes/{project}", nodeMap[opOneID]["label"])
	assert.Equal(t, "pathItem", nodeMap[opOneID]["type"])
	assert.Equal(t, true, nodeMap[opOneID]["dependency"], "incoming operation consumers should be dimmed")
	assert.Equal(t, true, nodeMap[opTwoID]["dependency"], "incoming operation consumers should be dimmed")
	_, hasArrayFlag := nodeMap[opOneID]["isArray"]
	assert.False(t, hasArrayFlag, "synthetic operation consumer nodes should not be marked as arrays")
	assert.GreaterOrEqual(t, int(nodeMap[opOneID]["width"].(float64)), 320,
		"synthetic operation consumer nodes should be wide enough for path labels")

	require.Len(t, graph.Edges, 2)
	assert.ElementsMatch(t, []string{opOneID, opTwoID}, []string{graph.Edges[0].Sources[0], graph.Edges[1].Sources[0]})
	assert.Equal(t, []string{targetID}, graph.Edges[0].Targets)
	assert.Equal(t, []string{targetID}, graph.Edges[1].Targets)
	assert.True(t, graph.Edges[0].Dependency, "incoming operation consumer edge should be dimmed")
	assert.True(t, graph.Edges[1].Dependency, "incoming operation consumer edge should be dimmed")
}

func TestBuildFocusedModelGraph_MixedModelAndOperationConsumers(t *testing.T) {
	targetID := "$.components.schemas['Drink']"
	nodes := []*v3.Node{
		makeNode("$.components.schemas['Burger']"),
		makeNode(targetID),
		makeNode("$.components.schemas['Fries']"),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", "$.components.schemas['Burger']", targetID, "#/components/schemas/Drink"),
		makeRefEdge("e2", targetID, "$.components.schemas['Fries']", "#/components/schemas/Fries"),
	}
	usedByOperations := []*OperationRef{
		{Method: "POST", Path: "/orders", Slug: "post-orders"},
	}

	result, err := BuildFocusedModelGraph(nodes, edges, targetID, 5, usedByOperations)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	graph := parseGraphResult(t, result)

	assert.Contains(t, nodeMap, "$.components.schemas['Burger']",
		"incoming model referrer should still be present")
	assert.Contains(t, nodeMap, "$.components.schemas['Fries']",
		"outgoing schema dependency should still be present")
	assert.Equal(t, true, nodeMap["$.components.schemas['Burger']"]["dependency"],
		"incoming model referrer should remain dimmed")

	opID := syntheticOperationConsumerNodeID(usedByOperations[0])
	require.Contains(t, nodeMap, opID, "operation consumer should be added to the mixed graph")
	assert.Equal(t, true, nodeMap[opID]["dependency"], "operation consumer should be dimmed")

	var foundSyntheticEdge bool
	for _, edge := range graph.Edges {
		if len(edge.Sources) == 1 && len(edge.Targets) == 1 && edge.Sources[0] == opID && edge.Targets[0] == targetID {
			foundSyntheticEdge = true
			assert.True(t, edge.Dependency, "synthetic incoming operation edge should be dimmed")
			break
		}
	}
	assert.True(t, foundSyntheticEdge, "mixed graph should contain the synthetic operation consumer edge")
}

func TestFocusedGraphIndex_EmitsNodeHrefs(t *testing.T) {
	targetID := "$.components.schemas['ReleaseSummary']"
	dependencyID := "$.components.schemas['ReleaseAuthor']"
	nodes := []*v3.Node{
		makeNode(targetID),
		makeNode(dependencyID),
	}
	edges := []*v3.Edge{
		makeRefEdge("e1", targetID, dependencyID, "#/components/schemas/ReleaseAuthor"),
	}
	hrefs := map[string]string{
		targetID:     "models/schemas/release-summary.html",
		dependencyID: "models/schemas/release-author.html",
	}

	idx := newFocusedGraphIndex(nodes, edges, hrefs)
	result, err := idx.buildFocusedGraph(targetID, 5)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	assert.Equal(t, "models/schemas/release-summary.html", nodeMap[targetID]["href"])
	assert.Equal(t, "models/schemas/release-author.html", nodeMap[dependencyID]["href"])
}

func TestFocusedGraphIndex_EmitsSyntheticOperationHref(t *testing.T) {
	targetID := "$.components.schemas['ReleaseSummary']"
	nodes := []*v3.Node{
		makeNode(targetID),
	}
	usedByOperations := []*OperationRef{
		{Method: "GET", Path: "/release-notes/{project}", Slug: "get-release-notes-project"},
	}
	hrefs := map[string]string{
		targetID: "models/schemas/release-summary.html",
	}

	idx := newFocusedGraphIndex(nodes, nil, hrefs)
	result, err := idx.buildFocusedModelGraph(targetID, 5, usedByOperations)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	nodeMap := parseGraphNodes(t, result)
	opID := syntheticOperationConsumerNodeID(usedByOperations[0])
	assert.Equal(t, "models/schemas/release-summary.html", nodeMap[targetID]["href"])
	assert.Equal(t, "operations/get-release-notes-project.html", nodeMap[opID]["href"])
}

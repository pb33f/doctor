// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"os"
	"sync"
	"testing"

	drModel "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	what_changed "github.com/pb33f/libopenapi/what-changed"
	"github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// makeChanges wraps a slice of model.Change into a what_changed.Changed
// suitable for assigning to Node.Changes.
func makeChanges(changes []*model.Change) []what_changed.Changed {
	tc := &model.TagChanges{
		PropertyChanges: model.NewPropertyChanges(changes),
	}
	return []what_changed.Changed{tc}
}

func cloneNodeTreeForTest(node *v3.Node) *v3.Node {
	if node == nil {
		return nil
	}
	clone := *node
	clone.Mutex = sync.RWMutex{}
	clone.SubtreeChanges = nil
	clone.ChildChangeSummaries = nil
	if node.Changes != nil {
		clone.Changes = append([]what_changed.Changed(nil), node.Changes...)
	}
	if node.RenderedChanges != nil {
		clone.RenderedChanges = append([]*model.Change(nil), node.RenderedChanges...)
	}
	if node.CleanedChanged != nil {
		clone.CleanedChanged = append([]*model.Change(nil), node.CleanedChanged...)
	}
	if len(node.Children) > 0 {
		clone.Children = make([]*v3.Node, len(node.Children))
		for i, child := range node.Children {
			clone.Children[i] = cloneNodeTreeForTest(child)
		}
	} else {
		clone.Children = nil
	}
	return &clone
}

func collectNodeMap(node *v3.Node, out map[string]*v3.Node) {
	if node == nil {
		return
	}
	out[node.Id] = node
	for _, child := range node.Children {
		collectNodeMap(child, out)
	}
}

func TestComputeSubtreeChanges_LeafNode(t *testing.T) {
	node := &v3.Node{
		Id: "leaf",
		RenderedChanges: []*model.Change{
			{ChangeType: model.PropertyAdded},
			{ChangeType: model.Modified},
			{ChangeType: model.PropertyRemoved, Breaking: true},
		},
	}

	s := computeSubtreeChanges(node)
	assert.Equal(t, 1, s.Additions)
	assert.Equal(t, 1, s.Modifications)
	assert.Equal(t, 1, s.Removals)
	assert.Equal(t, 1, s.Breaking)
	assert.Equal(t, 3, s.Total)
}

func TestComputeSubtreeChanges_ParentAggregation(t *testing.T) {
	child := &v3.Node{
		Id: "child",
		RenderedChanges: []*model.Change{
			{ChangeType: model.PropertyAdded},
			{ChangeType: model.Modified},
		},
	}
	parent := &v3.Node{
		Id:       "parent",
		Children: []*v3.Node{child},
		RenderedChanges: []*model.Change{
			{ChangeType: model.PropertyRemoved},
		},
	}

	s := computeSubtreeChanges(parent)
	assert.Equal(t, 1, s.Additions)
	assert.Equal(t, 1, s.Modifications)
	assert.Equal(t, 1, s.Removals)
	assert.Equal(t, 3, s.Total)
}

func TestComputeSubtreeChanges_DeepTree(t *testing.T) {
	grandchild := &v3.Node{
		Id: "gc",
		RenderedChanges: []*model.Change{
			{ChangeType: model.ObjectAdded},
			{ChangeType: model.ObjectAdded},
		},
	}
	child := &v3.Node{
		Id:       "child",
		Children: []*v3.Node{grandchild},
		RenderedChanges: []*model.Change{
			{ChangeType: model.Modified},
		},
	}
	root := &v3.Node{
		Id:       "root",
		Children: []*v3.Node{child},
	}

	s := computeSubtreeChanges(root)
	assert.Equal(t, 2, s.Additions, "grandchild additions propagate up")
	assert.Equal(t, 1, s.Modifications, "child modification propagates up")
	assert.Equal(t, 3, s.Total)

	// Child subtree should include grandchild.
	assert.Equal(t, 3, child.SubtreeChanges.Total)
	// Grandchild subtree is its own.
	assert.Equal(t, 2, grandchild.SubtreeChanges.Total)
}

func TestComputeSubtreeChanges_NoChanges(t *testing.T) {
	node := &v3.Node{Id: "empty"}
	s := computeSubtreeChanges(node)
	assert.Equal(t, 0, s.Total)
	assert.Equal(t, 0, s.Additions)
	assert.Equal(t, 0, s.Modifications)
	assert.Equal(t, 0, s.Removals)
	assert.Equal(t, 0, s.Breaking)
}

func TestBuildChildChangeSummaries(t *testing.T) {
	changed1 := &v3.Node{
		Id: "c1", Label: "Schemas", Type: "schemas", IdHash: "h1",
		SubtreeChanges: &v3.ChangeSummary{Total: 5, Modifications: 5},
	}
	changed2 := &v3.Node{
		Id: "c2", Label: "Tags", Type: "tags", IdHash: "h2",
		SubtreeChanges: &v3.ChangeSummary{Total: 1, Additions: 1},
	}
	unchanged := &v3.Node{
		Id: "c3", Label: "Servers", Type: "server", IdHash: "h3",
		SubtreeChanges: &v3.ChangeSummary{Total: 0},
	}
	parent := &v3.Node{
		Id:       "parent",
		Children: []*v3.Node{changed1, changed2, unchanged},
	}

	buildChildChangeSummaries(parent)

	require.Len(t, parent.ChildChangeSummaries, 2)
	assert.Equal(t, "Schemas", parent.ChildChangeSummaries[0].Label)
	assert.Equal(t, "Tags", parent.ChildChangeSummaries[1].Label)
}

func TestBuildChildChangeSummaries_Labels(t *testing.T) {
	child := &v3.Node{
		Id: "child-id", Label: "Parameters", Type: "parameter",
		IdHash:         "abc123",
		SubtreeChanges: &v3.ChangeSummary{Total: 3, Modifications: 2, Additions: 1},
	}
	parent := &v3.Node{
		Id:       "parent",
		Children: []*v3.Node{child},
	}

	buildChildChangeSummaries(parent)

	require.Len(t, parent.ChildChangeSummaries, 1)
	cs := parent.ChildChangeSummaries[0]
	assert.Equal(t, "Parameters", cs.Label)
	assert.Equal(t, "parameter", cs.Type)
	assert.Equal(t, "abc123", cs.IdHash)
	assert.Equal(t, "child-id", cs.NodeId)
	assert.Equal(t, 3, cs.Changes.Total)
	assert.Equal(t, 2, cs.Changes.Modifications)
	assert.Equal(t, 1, cs.Changes.Additions)
}

func TestRecalculateChangeViewDimensions(t *testing.T) {
	// Node with 2 child summaries and own changes → 75 (25+25+25).
	node := &v3.Node{
		Id: "op",
		ChildChangeSummaries: []*v3.ChildChangeSummary{
			{Label: "Parameters"},
			{Label: "Tags"},
		},
		RenderedChanges: []*model.Change{
			{ChangeType: model.Modified},
		},
	}

	recalculateChangeViewDimensions(node)

	// header(25) + 2 child rows(50) + own changes(25) = 100
	assert.Equal(t, v3.HEIGHT*4, node.Height)
	assert.GreaterOrEqual(t, node.Width, v3.WIDTH)
}

func TestRecalculateChangeViewDimensions_NoOwnChanges(t *testing.T) {
	// Ancestor node with 1 child summary but no own changes → 50 (25+25).
	node := &v3.Node{
		Id: "ancestor",
		ChildChangeSummaries: []*v3.ChildChangeSummary{
			{Label: "Schemas"},
		},
	}

	recalculateChangeViewDimensions(node)

	assert.Equal(t, v3.HEIGHT*2, node.Height)
}

func TestRecalculateChangeViewDimensions_MaxWidthClamped(t *testing.T) {
	// A very long label should be clamped to MAX_WIDTH.
	node := &v3.Node{
		Id:    "wide",
		Label: "Short",
		ChildChangeSummaries: []*v3.ChildChangeSummary{
			{Label: "this-is-an-extremely-long-label-that-exceeds-the-maximum-allowed-width-for-a-node-in-the-explorer-graph-visualization",
				Changes: &v3.ChangeSummary{Total: 1, Modifications: 1}},
		},
	}

	recalculateChangeViewDimensions(node)

	assert.Equal(t, v3.MAX_WIDTH, node.Width, "width should be clamped to MAX_WIDTH")
}

func TestPruneEmptyNodes_RemovesNodeEmptiedByDedup(t *testing.T) {
	// Simulates the scenario where dedup strips a change from a parent
	// (reassigning to deeper child), leaving the parent with no changes.
	// pruneEmptyNodes should remove that empty parent.

	// deepChild still has changes after dedup.
	deepChild := &v3.Node{
		Id: "deep", Label: "schema",
		RenderedChanges: []*model.Change{{ChangeType: model.Modified}},
	}
	// shallowParent had its change stripped by dedup (Changes is now nil).
	shallowParent := &v3.Node{
		Id: "shallow", Label: "PARAMETERS",
		Children: []*v3.Node{deepChild},
		// No Changes, no RenderedChanges — emptied by dedup.
	}
	// unchanged has no changes and no children.
	unchanged := &v3.Node{
		Id: "empty", Label: "SECURITY_REQUIREMENTS",
	}
	root := &v3.Node{
		Id:       "root",
		Children: []*v3.Node{shallowParent, unchanged},
	}

	pruneEmptyNodes(root)

	// shallowParent should survive because deepChild (its child) has changes.
	// unchanged should be removed.
	require.Len(t, root.Children, 1, "unchanged node should be pruned")
	assert.Equal(t, "shallow", root.Children[0].Id)
	// deepChild should still be under shallowParent.
	require.Len(t, root.Children[0].Children, 1)
	assert.Equal(t, "deep", root.Children[0].Children[0].Id)
}

func TestPruneEmptyNodes_RemovesEntireEmptyBranch(t *testing.T) {
	// A branch where dedup emptied every node.
	leaf := &v3.Node{Id: "leaf", Label: "leaf"}
	mid := &v3.Node{Id: "mid", Label: "mid", Children: []*v3.Node{leaf}}
	root := &v3.Node{Id: "root", Children: []*v3.Node{mid}}

	pruneEmptyNodes(root)

	assert.Empty(t, root.Children, "entire empty branch should be pruned")
}

func TestPrepareChangeViewGraph_Integration(t *testing.T) {
	grandchild := &v3.Node{
		Id: "gc", Label: "Pet", Type: "schema", IdHash: "gc-hash",
		RenderedChanges: []*model.Change{
			{ChangeType: model.Modified},
			{ChangeType: model.PropertyAdded},
		},
	}
	child := &v3.Node{
		Id: "schemas", Label: "Schemas", Type: "schemas", IdHash: "s-hash",
		Children: []*v3.Node{grandchild},
	}
	root := &v3.Node{
		Id: "root", Label: "Document", Type: "document",
		Children:    []*v3.Node{child},
		RenderProps: true,
	}

	cr := &Changerator{}
	cr.PrepareChangeViewGraph(root)

	// Root subtree should have 2 changes total.
	require.NotNil(t, root.SubtreeChanges)
	assert.Equal(t, 2, root.SubtreeChanges.Total)

	// Root should have 1 child summary (schemas).
	require.Len(t, root.ChildChangeSummaries, 1)
	assert.Equal(t, "Schemas", root.ChildChangeSummaries[0].Label)
	assert.Equal(t, 2, root.ChildChangeSummaries[0].Changes.Total)

	// Schemas should have 1 child summary (Pet).
	require.Len(t, child.ChildChangeSummaries, 1)
	assert.Equal(t, "Pet", child.ChildChangeSummaries[0].Label)

	// Heights should be recalculated.
	assert.Equal(t, v3.HEIGHT*2, root.Height, "root: header + 1 child row")
	assert.Equal(t, v3.HEIGHT*2, child.Height, "schemas: header + 1 child row")
	assert.Equal(t, v3.HEIGHT*2, grandchild.Height, "Pet: header + own changes")
}

func TestPrepareChangeViewGraph_RenderedChangesPreferred(t *testing.T) {
	// Node has both RenderedChanges and Changes. RenderedChanges should win.
	node := &v3.Node{
		Id: "n",
		RenderedChanges: []*model.Change{
			{ChangeType: model.PropertyAdded},
		},
		Changes: makeChanges([]*model.Change{
			{ChangeType: model.Modified},
			{ChangeType: model.Modified},
			{ChangeType: model.Modified},
		}),
	}

	cr := &Changerator{}
	cr.PrepareChangeViewGraph(node)

	// Should count from RenderedChanges (1 addition), not Changes (3 mods).
	require.NotNil(t, node.SubtreeChanges)
	assert.Equal(t, 1, node.SubtreeChanges.Total)
	assert.Equal(t, 1, node.SubtreeChanges.Additions)
	assert.Equal(t, 0, node.SubtreeChanges.Modifications)
}

func TestSubtreeTotals_MatchDeduplicatedHeadline(t *testing.T) {
	// Build a tree where the same change appears at parent and child
	// (duplicate-prone). After PrepareChangeViewGraph (which deduplicates),
	// the root subtree total should match what DeduplicateChanges returns.

	sharedChange := &model.Change{
		ChangeType: model.Modified,
		Property:   "description",
		Original:   "old",
		New:        "new",
		Context: &model.ChangeContext{
			NewLine:   intPtr(10),
			NewColumn: intPtr(5),
		},
	}

	child := &v3.Node{
		Id:       "child",
		ParentId: "parent",
		Label:    "Child",
		Type:     "info",
		IdHash:   "ch",
		Changes:  makeChanges([]*model.Change{sharedChange}),
	}
	parent := &v3.Node{
		Id:       "parent",
		Label:    "Parent",
		Type:     "document",
		Children: []*v3.Node{child},
		Changes:  makeChanges([]*model.Change{sharedChange}),
	}

	cr := &Changerator{}
	cr.PrepareChangeViewGraph(parent)

	// The deduplicator should have removed the duplicate, keeping it at
	// the deepest node (child). Parent subtree total should be 1, not 2.
	assert.Equal(t, 1, parent.SubtreeChanges.Total,
		"subtree total should match deduplicated count, not raw count")
}

func TestPrepareChangeViewGraph_PetstoreRegression_PreservesOwnedLeafNodes(t *testing.T) {
	leftBytes, err := os.ReadFile("../test_specs/petstorev3-original.json")
	require.NoError(t, err)
	rightBytes, err := os.ReadFile("../test_specs/petstorev3-openapi-changes.json")
	require.NoError(t, err)

	leftDoc, err := libopenapi.NewDocument(leftBytes)
	require.NoError(t, err)
	leftModel, err := leftDoc.BuildV3Model()
	require.NoError(t, err)
	leftDrDoc := drModel.NewDrDocumentAndGraph(leftModel)
	t.Cleanup(leftDrDoc.Release)

	rightDoc, err := libopenapi.NewDocument(rightBytes)
	require.NoError(t, err)
	rightModel, err := rightDoc.BuildV3Model()
	require.NoError(t, err)
	rightDrDoc := drModel.NewDrDocumentAndGraph(rightModel)
	t.Cleanup(rightDrDoc.Release)

	cr := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDrDoc.V3Document,
		RightDrDoc: rightDrDoc.V3Document,
		Doctor:     rightDrDoc,
	})
	cr.Changerate()

	root := rightDrDoc.V3Document.Node
	cr.BuildNodeChangeTree(root)
	require.NotNil(t, root)

	standardNodes := make(map[string]*v3.Node)
	collectNodeMap(root, standardNodes)

	changeRoot := cloneNodeTreeForTest(root)
	cr.PrepareChangeViewGraph(changeRoot)

	changeNodes := make(map[string]*v3.Node)
	collectNodeMap(changeRoot, changeNodes)

	targets := []string{
		"$.components.schemas['Pet']",
		"$.components.schemas['Pet'].properties['status']",
		"$.components.schemas['User'].properties['email']",
		"$.paths['/user/login'].get.parameters[1]",
		"$.paths['/user/login'].get.parameters[0].schema",
	}

	for _, target := range targets {
		standardNode := standardNodes[target]
		require.NotNil(t, standardNode, "standard changed tree should contain %s", target)
		require.Greater(t, len(nodeOwnChanges(standardNode)), 0, "standard node should keep own changes for %s", target)

		changeNode := changeNodes[target]
		require.NotNil(t, changeNode, "change-view graph should contain %s", target)
		require.Greater(t, len(nodeOwnChanges(changeNode)), 0, "change-view node should keep own changes for %s", target)
	}

	components := changeNodes["$.components"]
	require.NotNil(t, components)
	for _, change := range nodeOwnChanges(components) {
		assert.NotEqual(t, "$.components.schemas['User'].properties['email']", change.Path)
		assert.NotEqual(t, "$.components.schemas['Pet']", change.Path)
		assert.NotEqual(t, "$.components.schemas['Pet'].properties['status']", change.Path)
	}

	operation := changeNodes["$.paths['/user/login'].get"]
	require.NotNil(t, operation)
	for _, change := range nodeOwnChanges(operation) {
		assert.NotEqual(t, "$.paths['/user/login'].get.parameters[1]", change.Path)
		assert.NotEqual(t, "$.paths['/user/login'].get.parameters[0].schema", change.Path)
	}

	require.NotNil(t, standardNodes["$.components.schemas['User'].properties['email']"])
	require.Greater(t, len(nodeOwnChanges(standardNodes["$.components.schemas['User'].properties['email']"])), 0)
}

func intPtr(v int) *int {
	return &v
}

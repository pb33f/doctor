// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
)

func TestNewChangeDeduplicator(t *testing.T) {
	dedup := NewChangeDeduplicator()
	assert.NotNil(t, dedup)
	assert.NotNil(t, dedup.seen)
	assert.NotNil(t, dedup.changesByNode)
	assert.NotNil(t, dedup.hierarchyMap)
}

func TestChangeDeduplicator_GenerateChangeHash(t *testing.T) {
	dedup := NewChangeDeduplicator()

	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old value",
		New:        "new value",
	}

	change2 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old value",
		New:        "new value",
	}

	change3 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old value",
		New:        "different value",
	}

	hash1 := dedup.GenerateChangeHash(change1)
	hash2 := dedup.GenerateChangeHash(change2)
	hash3 := dedup.GenerateChangeHash(change3)

	assert.Equal(t, hash1, hash2, "Identical changes should have same hash")
	assert.NotEqual(t, hash1, hash3, "Different changes should have different hash")
}

func TestChangeDeduplicator_GenerateChangeHash_WithContext(t *testing.T) {
	dedup := NewChangeDeduplicator()

	line := 42
	col := 10

	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
		Context: &model.ChangeContext{
			NewLine:   &line,
			NewColumn: &col,
		},
	}

	change2 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
		Context: &model.ChangeContext{
			NewLine:   &line,
			NewColumn: &col,
		},
	}

	hash1 := dedup.GenerateChangeHash(change1)
	hash2 := dedup.GenerateChangeHash(change2)

	assert.Equal(t, hash1, hash2, "Changes with identical context should have same hash")
}

func TestChangeDeduplicator_RegisterNode(t *testing.T) {
	dedup := NewChangeDeduplicator()

	dedup.RegisterNode("child", "parent")
	dedup.RegisterNode("grandchild", "child")

	assert.Equal(t, "parent", dedup.hierarchyMap["child"])
	assert.Equal(t, "child", dedup.hierarchyMap["grandchild"])
}

func TestChangeDeduplicator_CalculateDepth(t *testing.T) {
	dedup := NewChangeDeduplicator()

	// Build hierarchy: root -> child -> grandchild
	dedup.RegisterNode("child", "root")
	dedup.RegisterNode("grandchild", "child")

	assert.Equal(t, 0, dedup.CalculateDepth("root"))
	assert.Equal(t, 1, dedup.CalculateDepth("child"))
	assert.Equal(t, 2, dedup.CalculateDepth("grandchild"))
}

func TestChangeDeduplicator_BuildNodePath(t *testing.T) {
	dedup := NewChangeDeduplicator()

	dedup.RegisterNode("child", "root")
	dedup.RegisterNode("grandchild", "child")

	path := dedup.BuildNodePath("grandchild")
	assert.Equal(t, []string{"root", "child", "grandchild"}, path)
}

func TestChangeDeduplicator_ProcessChange_Unique(t *testing.T) {
	dedup := NewChangeDeduplicator()

	change := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	result := dedup.ProcessChange(change, "node1")
	assert.True(t, result, "First occurrence should be unique")

	changes := dedup.GetUniqueChangesForNode("node1")
	assert.Len(t, changes, 1)
	assert.Equal(t, change, changes[0])
}

func TestChangeDeduplicator_ProcessChange_Duplicate(t *testing.T) {
	dedup := NewChangeDeduplicator()

	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	change2 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	result1 := dedup.ProcessChange(change1, "node1")
	result2 := dedup.ProcessChange(change2, "node1")

	assert.True(t, result1, "First occurrence should be unique")
	assert.False(t, result2, "Second occurrence should be duplicate")

	changes := dedup.GetUniqueChangesForNode("node1")
	assert.Len(t, changes, 1, "Should only have one unique change")
}

func TestChangeDeduplicator_ProcessChange_HierarchyPreference(t *testing.T) {
	dedup := NewChangeDeduplicator()

	// Build hierarchy: parent -> child
	dedup.RegisterNode("child", "parent")

	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	change2 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	// Process at parent level first
	result1 := dedup.ProcessChange(change1, "parent")
	assert.True(t, result1)

	// Process same change at child level
	result2 := dedup.ProcessChange(change2, "child")
	assert.False(t, result2, "Should detect duplicate")

	// The change should be tracked at the child level (more specific)
	allChanges := dedup.GetAllUniqueChanges()
	assert.Len(t, allChanges, 1)

	childChanges := dedup.GetUniqueChangesForNode("child")
	assert.Len(t, childChanges, 1, "Change should be attributed to more specific child node")
}

func TestChangeDeduplicator_GetAllUniqueChanges(t *testing.T) {
	dedup := NewChangeDeduplicator()

	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old1",
		New:        "new1",
	}

	change2 := &model.Change{
		Property:   "title",
		ChangeType: model.Modified,
		Original:   "old2",
		New:        "new2",
	}

	change3 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old1",
		New:        "new1",
	}

	dedup.ProcessChange(change1, "node1")
	dedup.ProcessChange(change2, "node2")
	dedup.ProcessChange(change3, "node3") // Duplicate of change1

	allChanges := dedup.GetAllUniqueChanges()
	assert.Len(t, allChanges, 2, "Should have 2 unique changes")
}

func TestChangeDeduplicator_DeduplicateNodeChanges(t *testing.T) {
	dedup := NewChangeDeduplicator()

	// Test with empty node - should handle gracefully
	node := &v3.Node{
		Id:       "testNode",
		ParentId: "parentNode",
	}

	dedup.DeduplicateNodeChanges(node)

	// Should handle nil/empty changes gracefully
	assert.Len(t, dedup.GetUniqueChangesForNode("testNode"), 0)
}

func TestChangeDeduplicator_DeduplicateNodeChanges_NilNode(t *testing.T) {
	dedup := NewChangeDeduplicator()

	// Should not panic
	assert.NotPanics(t, func() {
		dedup.DeduplicateNodeChanges(nil)
	})
}

func TestChangeDeduplicator_DeduplicateNodeChanges_NoChanges(t *testing.T) {
	dedup := NewChangeDeduplicator()

	node := &v3.Node{
		Id:      "testNode",
		Changes: nil,
	}

	dedup.DeduplicateNodeChanges(node)
	assert.Nil(t, node.Changes)
}

func TestChangeDeduplicator_GetStatistics(t *testing.T) {
	dedup := NewChangeDeduplicator()

	changes := []*model.Change{
		{Property: "p1", ChangeType: model.PropertyAdded},
		{Property: "p2", ChangeType: model.Modified},
		{Property: "p3", ChangeType: model.PropertyRemoved},
		{Property: "p4", ChangeType: model.ObjectAdded},
		{Property: "p5", ChangeType: model.ObjectRemoved},
	}

	for i, change := range changes {
		dedup.ProcessChange(change, "node"+string(rune(i)))
	}

	stats := dedup.GetStatistics()
	assert.Equal(t, 2, stats.Additions, "Should count PropertyAdded and ObjectAdded")
	assert.Equal(t, 1, stats.Modifications, "Should count Modified")
	assert.Equal(t, 2, stats.Deletions, "Should count PropertyRemoved and ObjectRemoved")
}

func TestChangeDeduplicator_Reset(t *testing.T) {
	dedup := NewChangeDeduplicator()

	change := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	dedup.ProcessChange(change, "node1")
	dedup.RegisterNode("child", "parent")

	assert.Len(t, dedup.GetAllUniqueChanges(), 1)
	assert.Len(t, dedup.hierarchyMap, 1)

	dedup.Reset()

	assert.Len(t, dedup.GetAllUniqueChanges(), 0)
	assert.Len(t, dedup.hierarchyMap, 0)
}

func TestChangeDeduplicator_GetDuplicateCount(t *testing.T) {
	dedup := NewChangeDeduplicator()

	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	change2 := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	change3 := &model.Change{
		Property:   "title",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	dedup.ProcessChange(change1, "node1")
	dedup.ProcessChange(change2, "node2") // Duplicate
	dedup.ProcessChange(change3, "node3") // Unique

	duplicates := dedup.GetDuplicateCount()
	assert.Equal(t, 0, duplicates, "With proper deduplication, no duplicates should be stored")
}

func TestGetChangeHash_PublicAPI(t *testing.T) {
	change := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	hash := GetChangeHash(change)
	assert.NotEmpty(t, hash)

	// Should be deterministic
	hash2 := GetChangeHash(change)
	assert.Equal(t, hash, hash2)
}

func TestChangeDeduplicator_ComplexHierarchy(t *testing.T) {
	dedup := NewChangeDeduplicator()

	// Build hierarchy: paths -> path -> operation -> response
	dedup.RegisterNode("$.paths", "")
	dedup.RegisterNode("$.paths['/test']", "$.paths")
	dedup.RegisterNode("$.paths['/test'].get", "$.paths['/test']")
	dedup.RegisterNode("$.paths['/test'].get.responses", "$.paths['/test'].get")

	change := &model.Change{
		Property:   "description",
		ChangeType: model.Modified,
		Original:   "old",
		New:        "new",
	}

	// Process same change at different levels
	dedup.ProcessChange(change, "$.paths")
	dedup.ProcessChange(change, "$.paths['/test']")
	dedup.ProcessChange(change, "$.paths['/test'].get")
	dedup.ProcessChange(change, "$.paths['/test'].get.responses")

	// Should only have one unique change
	allChanges := dedup.GetAllUniqueChanges()
	assert.Len(t, allChanges, 1)

	// Change should be attributed to the most specific node
	mostSpecificChanges := dedup.GetUniqueChangesForNode("$.paths['/test'].get.responses")
	assert.Len(t, mostSpecificChanges, 1, "Change should be at most specific level")

	// Less specific nodes should not have the change
	pathsChanges := dedup.GetUniqueChangesForNode("$.paths")
	assert.Len(t, pathsChanges, 0, "Less specific nodes should not have the change")
}

func TestChangeDeduplicator_DifferentChangeTypes(t *testing.T) {
	dedup := NewChangeDeduplicator()

	// Same property but different change types should not be duplicates
	change1 := &model.Change{
		Property:   "description",
		ChangeType: model.PropertyAdded,
		New:        "new",
	}

	change2 := &model.Change{
		Property:   "description",
		ChangeType: model.PropertyRemoved,
		Original:   "old",
	}

	result1 := dedup.ProcessChange(change1, "node1")
	result2 := dedup.ProcessChange(change2, "node2")

	assert.True(t, result1)
	assert.True(t, result2, "Different change types should not be duplicates")

	allChanges := dedup.GetAllUniqueChanges()
	assert.Len(t, allChanges, 2)
}
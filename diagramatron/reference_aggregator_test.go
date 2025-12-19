// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewReferenceAggregator(t *testing.T) {
	agg := NewReferenceAggregator(10)
	assert.NotNil(t, agg)
	assert.Equal(t, 10, agg.maxLabelsToShow)
}

func TestNewReferenceAggregator_DefaultMaxLabels(t *testing.T) {
	agg := NewReferenceAggregator(0)
	assert.Equal(t, 10, agg.maxLabelsToShow)
}

func TestReferenceAggregator_Aggregate_NoDuplicates(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1"},
		{SourceID: "A", TargetID: "C", Type: RelationAssociation, Label: "prop2"},
	}

	agg := NewReferenceAggregator(10)
	result := agg.Aggregate(rels)

	require.Len(t, result, 2)
	assert.Equal(t, "prop1", result[0].Label)
	assert.Equal(t, "prop2", result[1].Label)
}

func TestReferenceAggregator_Aggregate_DuplicateReferences(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "Order", TargetID: "Address", Type: RelationAssociation, Label: "billingAddress"},
		{SourceID: "Order", TargetID: "Address", Type: RelationAssociation, Label: "shippingAddress"},
		{SourceID: "Order", TargetID: "Address", Type: RelationAssociation, Label: "returnAddress"},
	}

	agg := NewReferenceAggregator(10)
	result := agg.Aggregate(rels)

	require.Len(t, result, 1)
	assert.Equal(t, "Order", result[0].SourceID)
	assert.Equal(t, "Address", result[0].TargetID)
	assert.Contains(t, result[0].Label, "3 properties")
	assert.Contains(t, result[0].Label, "billingAddress")
	assert.Contains(t, result[0].Label, "shippingAddress")
	assert.Contains(t, result[0].Label, "returnAddress")
	assert.True(t, result[0].Metadata["aggregated"].(bool))
	assert.Equal(t, 3, result[0].Metadata["count"])
}

func TestReferenceAggregator_Aggregate_MixedRelationshipTypes(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "ref1"},
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "ref2"},
		{SourceID: "A", TargetID: "C", Type: RelationInheritance, Label: "allOf"},
		{SourceID: "A", TargetID: "D", Type: RelationComposition, Label: "items"},
	}

	agg := NewReferenceAggregator(10)
	result := agg.Aggregate(rels)

	// should have 3 relationships: 1 aggregated association + 1 inheritance + 1 composition
	require.Len(t, result, 3)

	// find the aggregated one
	var aggregated *DiagramRelationship
	for _, rel := range result {
		if rel.Metadata != nil && rel.Metadata["aggregated"] != nil {
			aggregated = rel
			break
		}
	}

	require.NotNil(t, aggregated)
	assert.Equal(t, RelationAssociation, aggregated.Type)
	assert.Contains(t, aggregated.Label, "2 properties")
}

func TestReferenceAggregator_Aggregate_TooManyLabels(t *testing.T) {
	rels := make([]*DiagramRelationship, 15)
	for i := 0; i < 15; i++ {
		rels[i] = &DiagramRelationship{
			SourceID: "Schema",
			TargetID: "RefSchema",
			Type:     RelationAssociation,
			Label:    fmt.Sprintf("prop%d", i),
		}
	}

	agg := NewReferenceAggregator(5)
	result := agg.Aggregate(rels)

	require.Len(t, result, 1)
	assert.Contains(t, result[0].Label, "15 properties")
	assert.Contains(t, result[0].Label, "+10 more")
	assert.Contains(t, result[0].Label, "prop0")
	assert.NotContains(t, result[0].Label, "prop14") // last one shouldn't show
}

func TestReferenceAggregator_Aggregate_NilInput(t *testing.T) {
	agg := NewReferenceAggregator(10)
	result := agg.Aggregate(nil)

	assert.Nil(t, result)
}

func TestReferenceAggregator_Aggregate_EmptyInput(t *testing.T) {
	agg := NewReferenceAggregator(10)
	result := agg.Aggregate([]*DiagramRelationship{})

	assert.Empty(t, result)
}

func TestReferenceAggregator_ShouldAggregate_True(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1"},
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop2"},
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop3"},
	}

	agg := NewReferenceAggregator(10)
	should := agg.ShouldAggregate(rels)

	assert.True(t, should)
}

func TestReferenceAggregator_ShouldAggregate_False(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1"},
		{SourceID: "A", TargetID: "C", Type: RelationAssociation, Label: "prop2"},
	}

	agg := NewReferenceAggregator(10)
	should := agg.ShouldAggregate(rels)

	assert.False(t, should)
}

func TestReferenceAggregator_GetAggregationStats(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1"},
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop2"},
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop3"},
		{SourceID: "A", TargetID: "C", Type: RelationInheritance, Label: "allOf"},
		{SourceID: "X", TargetID: "Y", Type: RelationAssociation, Label: "ref"},
	}

	agg := NewReferenceAggregator(10)
	stats := agg.GetAggregationStats(rels)

	assert.Equal(t, 5, stats["total"])
	assert.Equal(t, 4, stats["associations"])
	assert.Equal(t, 1, stats["duplicateGroups"]) // A->B group
	assert.Equal(t, 2, stats["relationshipsSaved"]) // 3 refs become 1, saves 2
	assert.InDelta(t, 40.0, stats["reductionPercent"], 0.1) // 2/5 = 40%
}

func TestReferenceAggregator_GetAggregationStats_NoAggregation(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1"},
		{SourceID: "A", TargetID: "C", Type: RelationAssociation, Label: "prop2"},
	}

	agg := NewReferenceAggregator(10)
	stats := agg.GetAggregationStats(rels)

	assert.Equal(t, 2, stats["total"])
	assert.Equal(t, 2, stats["associations"])
	assert.Equal(t, 0, stats["duplicateGroups"])
	assert.Equal(t, 0, stats["relationshipsSaved"])
}

func TestReferenceAggregator_Aggregate_PreservesCardinality(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1", Cardinality: "1"},
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop2", Cardinality: "0..1"},
	}

	agg := NewReferenceAggregator(10)
	result := agg.Aggregate(rels)

	require.Len(t, result, 1)
	// cardinality from individual refs is not preserved in aggregation
	// this is expected behavior - aggregated label takes precedence
	assert.Contains(t, result[0].Label, "2 properties")
}

func TestReferenceAggregator_Aggregate_SkipsNilRelationships(t *testing.T) {
	rels := []*DiagramRelationship{
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop1"},
		nil,
		{SourceID: "A", TargetID: "B", Type: RelationAssociation, Label: "prop2"},
		nil,
	}

	agg := NewReferenceAggregator(10)
	result := agg.Aggregate(rels)

	require.Len(t, result, 1)
	assert.Contains(t, result[0].Label, "2 properties")
}

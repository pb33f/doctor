// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewComponentUsageAnalyzer(t *testing.T) {
	analyzer := NewComponentUsageAnalyzer(5)
	assert.NotNil(t, analyzer)
	assert.Equal(t, 5, analyzer.minRefsForAnnotation)
}

func TestNewComponentUsageAnalyzer_DefaultMin(t *testing.T) {
	analyzer := NewComponentUsageAnalyzer(0)
	assert.Equal(t, 5, analyzer.minRefsForAnnotation)
}

func TestComponentUsageAnalyzer_AnalyzeReuse_SimpleCase(t *testing.T) {
	diagram := NewDiagram()
	diagram.AddClass(NewDiagramClass("A", "ClassA"))
	diagram.AddClass(NewDiagramClass("B", "ClassB"))
	diagram.AddClass(NewDiagramClass("C", "ClassC"))

	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "A",
		TargetID: "B",
		Type:     RelationAssociation,
	})
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "C",
		TargetID: "B",
		Type:     RelationAssociation,
	})

	analyzer := NewComponentUsageAnalyzer(5)
	usage := analyzer.AnalyzeReuse(diagram)

	require.Len(t, usage, 3)
	assert.Equal(t, 0, usage["A"].RefCount)
	assert.Equal(t, 2, usage["B"].RefCount)
	assert.Equal(t, 0, usage["C"].RefCount)
	assert.Len(t, usage["B"].IncomingRefs, 2)
}

func TestComponentUsageAnalyzer_AnalyzeReuse_DetermineTiers(t *testing.T) {
	diagram := NewDiagram()
	diagram.AddClass(NewDiagramClass("Popular", "Popular"))

	// add 50 references to make it very highly reused
	for i := 0; i < 50; i++ {
		diagram.AddRelationship(&DiagramRelationship{
			SourceID: fmt.Sprintf("Source%d", i),
			TargetID: "Popular",
			Type:     RelationAssociation,
		})
	}

	analyzer := NewComponentUsageAnalyzer(5)
	usage := analyzer.AnalyzeReuse(diagram)

	require.NotNil(t, usage["Popular"])
	assert.Equal(t, 50, usage["Popular"].RefCount)
	assert.Equal(t, UsageVeryHigh, usage["Popular"].Tier)
}

func TestComponentUsageAnalyzer_DetermineTier(t *testing.T) {
	analyzer := NewComponentUsageAnalyzer(5)

	tests := []struct {
		refCount int
		expected UsageTier
	}{
		{1, UsageLow},
		{4, UsageLow},
		{5, UsageMedium},
		{9, UsageMedium},
		{10, UsageHigh},
		{49, UsageHigh},
		{50, UsageVeryHigh},
		{100, UsageVeryHigh},
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("refCount_%d", tt.refCount), func(t *testing.T) {
			tier := analyzer.determineTier(tt.refCount)
			assert.Equal(t, tt.expected, tier)
		})
	}
}

func TestComponentUsageAnalyzer_AnnotateWithUsage(t *testing.T) {
	diagram := NewDiagram()
	classA := NewDiagramClass("A", "ClassA")
	classB := NewDiagramClass("B", "ClassB")
	diagram.AddClass(classA)
	diagram.AddClass(classB)

	// add 10 references to B (highly reused)
	for i := 0; i < 10; i++ {
		diagram.AddRelationship(&DiagramRelationship{
			SourceID: fmt.Sprintf("Source%d", i),
			TargetID: "B",
			Type:     RelationAssociation,
		})
	}

	analyzer := NewComponentUsageAnalyzer(5)
	analyzer.AnnotateWithUsage(diagram)

	// A should have no annotations (no refs)
	assert.Empty(t, classA.Annotations)

	// B should have reuse annotation
	require.Len(t, classB.Annotations, 1)
	assert.Contains(t, classB.Annotations[0], "highly reused")
	assert.Contains(t, classB.Annotations[0], "10")
}

func TestComponentUsageAnalyzer_AnnotateWithUsage_BelowMinimum(t *testing.T) {
	diagram := NewDiagram()
	classA := NewDiagramClass("A", "ClassA")
	diagram.AddClass(classA)

	// add only 3 references (below default minimum of 5)
	for i := 0; i < 3; i++ {
		diagram.AddRelationship(&DiagramRelationship{
			SourceID: fmt.Sprintf("Source%d", i),
			TargetID: "A",
			Type:     RelationAssociation,
		})
	}

	analyzer := NewComponentUsageAnalyzer(5)
	analyzer.AnnotateWithUsage(diagram)

	// should have no annotations (below minimum)
	assert.Empty(t, classA.Annotations)
}

func TestComponentUsageAnalyzer_GetMostReusedComponents(t *testing.T) {
	diagram := NewDiagram()

	// create components with different usage levels
	for i := 0; i < 5; i++ {
		diagram.AddClass(NewDiagramClass(fmt.Sprintf("Class%d", i), fmt.Sprintf("Class%d", i)))
	}

	// Class0: 50 refs, Class1: 20 refs, Class2: 10 refs, Class3: 5 refs, Class4: 0 refs
	refCounts := []int{50, 20, 10, 5, 0}
	for i, count := range refCounts {
		for j := 0; j < count; j++ {
			diagram.AddRelationship(&DiagramRelationship{
				SourceID: fmt.Sprintf("Source%d_%d", i, j),
				TargetID: fmt.Sprintf("Class%d", i),
				Type:     RelationAssociation,
			})
		}
	}

	analyzer := NewComponentUsageAnalyzer(5)
	top3 := analyzer.GetMostReusedComponents(diagram, 3)

	require.Len(t, top3, 3)
	assert.Equal(t, "Class0", top3[0].ClassID)
	assert.Equal(t, 50, top3[0].RefCount)
	assert.Equal(t, "Class1", top3[1].ClassID)
	assert.Equal(t, 20, top3[1].RefCount)
	assert.Equal(t, "Class2", top3[2].ClassID)
	assert.Equal(t, 10, top3[2].RefCount)
}

func TestComponentUsageAnalyzer_GetMostReusedComponents_RequestMoreThanExists(t *testing.T) {
	diagram := NewDiagram()
	diagram.AddClass(NewDiagramClass("A", "ClassA"))

	analyzer := NewComponentUsageAnalyzer(5)
	top10 := analyzer.GetMostReusedComponents(diagram, 10)

	// should only return 1 even though we asked for 10
	require.Len(t, top10, 1)
}

func TestComponentUsageAnalyzer_GetUnusedComponents(t *testing.T) {
	diagram := NewDiagram()
	diagram.AddClass(NewDiagramClass("A", "ClassA"))
	diagram.AddClass(NewDiagramClass("B", "ClassB"))
	diagram.AddClass(NewDiagramClass("C", "ClassC"))

	// only B has references
	diagram.AddRelationship(&DiagramRelationship{
		SourceID: "X",
		TargetID: "B",
		Type:     RelationAssociation,
	})

	analyzer := NewComponentUsageAnalyzer(5)
	unused := analyzer.GetUnusedComponents(diagram)

	require.Len(t, unused, 2)
	ids := []string{unused[0].ClassID, unused[1].ClassID}
	assert.Contains(t, ids, "A")
	assert.Contains(t, ids, "C")
}

func TestComponentUsageAnalyzer_AnalyzeReuse_NilDiagram(t *testing.T) {
	analyzer := NewComponentUsageAnalyzer(5)
	usage := analyzer.AnalyzeReuse(nil)

	assert.Nil(t, usage)
}

func TestComponentUsageAnalyzer_FormatAnnotation_AllTiers(t *testing.T) {
	analyzer := NewComponentUsageAnalyzer(5)

	tests := []struct {
		tier     UsageTier
		refCount int
		contains string
	}{
		{UsageMedium, 7, "reused 7 times"},
		{UsageHigh, 25, "highly reused (25 refs)"},
		{UsageVeryHigh, 100, "very highly reused (100 refs)"},
	}

	for _, tt := range tests {
		t.Run(string(tt.tier), func(t *testing.T) {
			usage := &ComponentUsage{
				Tier:     tt.tier,
				RefCount: tt.refCount,
			}
			annotation := analyzer.formatAnnotation(usage)
			assert.Contains(t, annotation, tt.contains)
		})
	}
}

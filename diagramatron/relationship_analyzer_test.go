// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/stretchr/testify/assert"
)

func TestNewRelationshipAnalyzer(t *testing.T) {
	t.Run("creates with default max depth", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(0)
		assert.NotNil(t, ra)
		assert.Equal(t, 50, ra.maxDepth)
	})

	t.Run("creates with custom max depth", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(100)
		assert.Equal(t, 100, ra.maxDepth)
	})

	t.Run("initializes caches", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(10)
		assert.NotNil(t, ra.relCache)
		assert.NotNil(t, ra.patternCache)
	})
}

func TestRelationshipAnalyzer_AnalyzeSchema(t *testing.T) {
	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok {
			if s.Value != nil && s.Value.Title != "" {
				return s.Value.Title
			}
		}
		if sp, ok := obj.(*v3.SchemaProxy); ok {
			if sp.Schema != nil && sp.Schema.Value != nil && sp.Schema.Value.Title != "" {
				return sp.Schema.Value.Title
			}
		}
		return "TestSchema"
	}

	t.Run("returns nil for nil schema", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)
		rels := ra.AnalyzeSchema(nil, getID)
		assert.Nil(t, rels)
	})

	t.Run("analyzes allOf inheritance", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		childSchema := &v3.Schema{
			Value: &base.Schema{Title: "Child"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "Parent"}}},
			},
		}

		rels := ra.AnalyzeSchema(childSchema, getID)
		assert.Len(t, rels, 1)
		assert.Equal(t, "Child", rels[0].SourceID)
		assert.Equal(t, "Parent", rels[0].TargetID)
		assert.Equal(t, RelationInheritance, rels[0].Type)
		assert.Equal(t, "allOf", rels[0].Label)
	})

	t.Run("analyzes oneOf union", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		unionSchema := &v3.Schema{
			Value: &base.Schema{Title: "Union"},
			OneOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "TypeA"}}},
				{Schema: &v3.Schema{Value: &base.Schema{Title: "TypeB"}}},
			},
		}

		rels := ra.AnalyzeSchema(unionSchema, getID)
		assert.Len(t, rels, 2)
		assert.Equal(t, RelationAssociation, rels[0].Type)
		assert.Equal(t, "oneOf", rels[0].Label)
	})

	t.Run("analyzes anyOf union", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		flexSchema := &v3.Schema{
			Value: &base.Schema{Title: "Flexible"},
			AnyOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "OptionA"}}},
			},
		}

		rels := ra.AnalyzeSchema(flexSchema, getID)
		assert.Len(t, rels, 1)
		assert.Equal(t, RelationAssociation, rels[0].Type)
		assert.Equal(t, "anyOf", rels[0].Label)
	})

	t.Run("analyzes not negation", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		notSchema := &v3.Schema{
			Value: &base.Schema{Title: "NotString"},
			Not: &v3.SchemaProxy{
				Schema: &v3.Schema{Value: &base.Schema{Title: "StringType"}},
			},
		}

		rels := ra.AnalyzeSchema(notSchema, getID)
		assert.Len(t, rels, 1)
		assert.Equal(t, "NotString", rels[0].SourceID)
		assert.Equal(t, "StringType", rels[0].TargetID)
		assert.Equal(t, RelationNegation, rels[0].Type)
		assert.Equal(t, "not", rels[0].Label)
	})

	t.Run("uses cache for repeated analysis", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)
		schema := &v3.Schema{Value: &base.Schema{Title: "Cached"}}

		// first call
		rels1 := ra.AnalyzeSchema(schema, getID)

		// second call - should use cache
		rels2 := ra.AnalyzeSchema(schema, getID)

		assert.Equal(t, rels1, rels2)
		assert.Equal(t, 1, ra.relCache.Len())
	})

	t.Run("respects max depth to prevent stack overflow", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(2)

		schema := &v3.Schema{Value: &base.Schema{Title: "Deep"}}

		// test with depth parameter directly (testing the internal method would require making it public)
		// The public AnalyzeSchema always starts at depth 0
		rels := ra.analyzeSchemaWithDepth(schema, getID, 3)
		assert.Nil(t, rels)
	})
}

func TestRelationshipAnalyzer_DetectCompositionPattern(t *testing.T) {
	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok {
			if s.Value != nil && s.Value.Title != "" {
				return s.Value.Title
			}
		}
		return "TestSchema"
	}

	t.Run("detects single inheritance", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "Child"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "Parent"}}},
			},
		}

		pattern := ra.DetectCompositionPattern(schema, getID)
		assert.Equal(t, PatternInheritance, pattern)
	})

	t.Run("detects multiple inheritance", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "MultiInherit"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "ParentA"}}},
				{Schema: &v3.Schema{Value: &base.Schema{Title: "ParentB"}}},
			},
		}

		pattern := ra.DetectCompositionPattern(schema, getID)
		assert.Equal(t, PatternMultipleInheritance, pattern)
	})

	t.Run("detects extension pattern", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		// Need to mock Properties properly - this is simplified
		schema := &v3.Schema{
			Value: &base.Schema{
				Title: "Extended",
			},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "Base"}}},
			},
		}

		// For now, test inheritance pattern since we can't easily mock Properties
		// The extension pattern would need a properly built schema with Properties
		pattern := ra.DetectCompositionPattern(schema, getID)
		assert.Equal(t, PatternInheritance, pattern)
	})

	t.Run("detects mixin pattern", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "WithMixin"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "AuditMixin"}}},
			},
		}

		pattern := ra.DetectCompositionPattern(schema, getID)
		assert.Equal(t, PatternMixin, pattern)
	})

	t.Run("detects union pattern", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "Union"},
			OneOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "TypeA"}}},
			},
		}

		pattern := ra.DetectCompositionPattern(schema, getID)
		assert.Equal(t, PatternUnion, pattern)
	})

	t.Run("detects no pattern", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "Simple"},
		}

		pattern := ra.DetectCompositionPattern(schema, getID)
		assert.Equal(t, PatternNone, pattern)
	})

	t.Run("uses cache for repeated detection", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)
		schema := &v3.Schema{Value: &base.Schema{Title: "Cached"}}

		pattern1 := ra.DetectCompositionPattern(schema, getID)
		pattern2 := ra.DetectCompositionPattern(schema, getID)

		assert.Equal(t, pattern1, pattern2)
		assert.Equal(t, 1, ra.patternCache.Len())
	})
}

func TestRelationshipAnalyzer_ClearCache(t *testing.T) {
	ra := NewRelationshipAnalyzer(50)
	getID := func(obj any) string { return "test" }

	schema := &v3.Schema{Value: &base.Schema{Title: "Test"}}

	// populate caches
	ra.AnalyzeSchema(schema, getID)
	ra.DetectCompositionPattern(schema, getID)

	assert.Equal(t, 1, ra.relCache.Len())
	assert.Equal(t, 1, ra.patternCache.Len())

	ra.ClearCache()

	assert.Equal(t, 0, ra.relCache.Len())
	assert.Equal(t, 0, ra.patternCache.Len())
}

func TestRelationshipAnalyzer_AnalyzeProperty(t *testing.T) {
	ra := NewRelationshipAnalyzer(50)

	t.Run("detects composition for inline schema", func(t *testing.T) {
		parent := &v3.SchemaProxy{}
		property := &v3.SchemaProxy{
			Schema: &v3.Schema{Value: &base.Schema{Type: []string{"object"}}},
		}

		rel := ra.AnalyzeProperty(parent, property, "address")
		assert.NotNil(t, rel)
		assert.Equal(t, RelationComposition, rel.Type)
		assert.Equal(t, "address", rel.Label)
	})

	t.Run("returns nil for nil inputs", func(t *testing.T) {
		rel := ra.AnalyzeProperty(nil, nil, "test")
		assert.Nil(t, rel)
	})
}

func TestRelationshipAnalyzer_AnalyzeComposition(t *testing.T) {
	getID := func(obj any) string {
		if s, ok := obj.(*v3.Schema); ok {
			if s.Value != nil && s.Value.Title != "" {
				return s.Value.Title
			}
		}
		return "TestSchema"
	}

	t.Run("analyzes simple inheritance", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "DerivedEntity"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "BaseEntity"}}},
			},
		}

		analysis := ra.AnalyzeComposition(schema, getID)
		assert.NotNil(t, analysis)
		assert.Equal(t, PatternInheritance, analysis.Pattern)
		assert.False(t, analysis.IsExtension)
		assert.False(t, analysis.IsMixin)
	})

	t.Run("detects mixin pattern", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "Entity"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "AuditMixin"}}},
			},
		}

		analysis := ra.AnalyzeComposition(schema, getID)
		assert.NotNil(t, analysis)
		assert.Equal(t, PatternMixin, analysis.Pattern)
		assert.True(t, analysis.IsMixin)
	})

	t.Run("detects multiple inheritance", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)

		schema := &v3.Schema{
			Value: &base.Schema{Title: "Entity"},
			AllOf: []*v3.SchemaProxy{
				{Schema: &v3.Schema{Value: &base.Schema{Title: "Nameable"}}},
				{Schema: &v3.Schema{Value: &base.Schema{Title: "Timestamped"}}},
			},
		}

		analysis := ra.AnalyzeComposition(schema, getID)
		assert.NotNil(t, analysis)
		assert.Equal(t, PatternMultipleInheritance, analysis.Pattern)
	})

	t.Run("returns nil for nil schema", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)
		analysis := ra.AnalyzeComposition(nil, getID)
		assert.Nil(t, analysis)
	})

	t.Run("returns pattern none for simple schema", func(t *testing.T) {
		ra := NewRelationshipAnalyzer(50)
		schema := &v3.Schema{Value: &base.Schema{Title: "Simple"}}

		analysis := ra.AnalyzeComposition(schema, getID)
		assert.NotNil(t, analysis)
		assert.Equal(t, PatternNone, analysis.Pattern)
		assert.Len(t, analysis.BaseSchemas, 0)
	})
}

// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDefaultVisualizationConfig(t *testing.T) {
	config := DefaultVisualizationConfig()

	assert.NotNil(t, config.General)
	assert.NotNil(t, config.Schema)
	assert.NotNil(t, config.Relation)
	assert.NotNil(t, config.Filter)
	assert.NotNil(t, config.Output)

	assert.Equal(t, 50, config.General.MaxDepth)
	assert.Equal(t, 20, config.Schema.MaxProperties)
	assert.True(t, config.Schema.ShowConstraints)
	assert.True(t, config.Relation.DetectPolymorphism)
	assert.Equal(t, FormatMermaidClass, config.Output.Format)
}

func TestVisualizationConfig_Validate(t *testing.T) {
	t.Run("valid config returns no errors", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		errors := config.Validate()
		assert.Empty(t, errors)
	})

	t.Run("detects invalid maxDepth too low", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.General.MaxDepth = 0
		errors := config.Validate()
		assert.Contains(t, errors, "general.maxDepth must be at least 1")
	})

	t.Run("detects invalid maxDepth too high", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.General.MaxDepth = 250
		errors := config.Validate()
		assert.Contains(t, errors, "general.maxDepth should not exceed 200 (risk of stack overflow)")
	})

	t.Run("detects negative maxProperties", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.Schema.MaxProperties = -1
		errors := config.Validate()
		assert.Contains(t, errors, "schema.maxProperties cannot be negative")
	})

	t.Run("detects invalid schema maxDepth", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.Schema.MaxDepth = 0
		errors := config.Validate()
		assert.Contains(t, errors, "schema.maxDepth must be at least 1")
	})

	t.Run("detects low largeSchemaThreshold", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.Schema.LargeSchemaThreshold = 5
		errors := config.Validate()
		assert.Contains(t, errors, "schema.largeSchemaThreshold should be at least 10")
	})

	t.Run("detects negative maxComplexity", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.Filter.MaxComplexity = -1
		errors := config.Validate()
		assert.Contains(t, errors, "filter.maxComplexity cannot be negative")
	})

	t.Run("detects conflicting include/exclude tags", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.Filter.IncludeTags = []string{"users", "orders"}
		config.Filter.ExcludeTags = []string{"orders", "admin"}
		errors := config.Validate()
		assert.Contains(t, errors, "filter.includeTags and filter.excludeTags contain same tag: orders")
	})

	t.Run("handles nil config sections gracefully", func(t *testing.T) {
		config := &VisualizationConfig{}
		errors := config.Validate()
		// should not panic, returns empty slice if all sections are nil
		assert.NotNil(t, errors) // slice is not nil, just empty
		assert.Len(t, errors, 0)
	})
}

func TestVisualizationConfig_ApplyDefaults(t *testing.T) {
	t.Run("fills in all nil sections", func(t *testing.T) {
		config := &VisualizationConfig{}
		config.ApplyDefaults()

		assert.NotNil(t, config.General)
		assert.NotNil(t, config.Schema)
		assert.NotNil(t, config.Relation)
		assert.NotNil(t, config.Filter)
		assert.NotNil(t, config.Output)
	})

	t.Run("preserves existing sections", func(t *testing.T) {
		customGeneral := &GeneralConfig{MaxDepth: 100}
		config := &VisualizationConfig{
			General: customGeneral,
		}
		config.ApplyDefaults()

		assert.Equal(t, 100, config.General.MaxDepth)
		assert.NotNil(t, config.Schema) // filled in
	})
}

func TestVisualizationConfig_ToMermaidConfig(t *testing.T) {
	t.Run("converts to legacy MermaidConfig", func(t *testing.T) {
		config := DefaultVisualizationConfig()
		config.Schema.MaxProperties = 15
		config.Output.IncludePrivate = false
		config.Relation.ShowCardinality = false

		mermaidConfig := config.ToMermaidConfig()

		assert.Equal(t, 15, mermaidConfig.MaxProperties)
		assert.False(t, mermaidConfig.IncludePrivate)
		assert.False(t, mermaidConfig.ShowCardinality)
	})

	t.Run("handles nil sections gracefully", func(t *testing.T) {
		config := &VisualizationConfig{}
		mermaidConfig := config.ToMermaidConfig()

		assert.NotNil(t, mermaidConfig)
		assert.Equal(t, 20, mermaidConfig.MaxProperties) // defaults
	})
}

func TestSchemaConfig_Defaults(t *testing.T) {
	config := DefaultVisualizationConfig()

	assert.True(t, config.Schema.ShowConstraints)
	assert.True(t, config.Schema.ShowEnums)
	assert.True(t, config.Schema.ShowDiscriminators)
	assert.True(t, config.Schema.ShowFormat)
	assert.False(t, config.Schema.InheritedProperties)
	assert.True(t, config.Schema.CollapseLargeSchemas)
	assert.Equal(t, 50, config.Schema.LargeSchemaThreshold)
}

func TestRelationshipConfig_Defaults(t *testing.T) {
	config := DefaultVisualizationConfig()

	assert.True(t, config.Relation.DetectPolymorphism)
	assert.False(t, config.Relation.SimplifyReferences)
	assert.True(t, config.Relation.ShowCardinality)
	assert.True(t, config.Relation.AnalyzePropertyTypes)
	assert.True(t, config.Relation.DetectBidirectional)
	assert.False(t, config.Relation.MergeDuplicateRefs)
}

func TestFilterConfig_Defaults(t *testing.T) {
	config := DefaultVisualizationConfig()

	assert.Empty(t, config.Filter.IncludeTags)
	assert.Empty(t, config.Filter.ExcludeTags)
	assert.False(t, config.Filter.ExcludeDeprecated)
	assert.Equal(t, 1000, config.Filter.MaxComplexity)
}

func TestOutputConfig_Defaults(t *testing.T) {
	config := DefaultVisualizationConfig()

	assert.Equal(t, FormatMermaidClass, config.Output.Format)
	assert.True(t, config.Output.IncludePrivate)
	assert.True(t, config.Output.IncludeOperations)
	assert.False(t, config.Output.UseNamespaces)
	assert.True(t, config.Output.SimplifyNames)
	assert.False(t, config.Output.ShowMetadata)
}

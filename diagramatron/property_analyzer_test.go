// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"testing"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.yaml.in/yaml/v4"
)

func TestNewPropertyAnalyzer(t *testing.T) {
	analyzer := NewPropertyAnalyzer()
	assert.NotNil(t, analyzer)
}

func TestPropertyAnalyzer_ExtractConstraints_StringConstraints(t *testing.T) {
	minLen := int64(3)
	maxLen := int64(50)
	schema := &base.Schema{
		Type:      []string{"string"},
		Format:    "email",
		Pattern:   "^[a-z]+@",
		MinLength: &minLen,
		MaxLength: &maxLen,
	}

	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(schema)

	require.NotNil(t, constraints)
	assert.Equal(t, "email", constraints.Format)
	assert.Equal(t, "^[a-z]+@", constraints.Pattern)
	assert.Equal(t, 3, *constraints.MinLength)
	assert.Equal(t, 50, *constraints.MaxLength)
}

func TestPropertyAnalyzer_ExtractConstraints_NumericConstraints(t *testing.T) {
	min := 0.0
	max := 150.0
	schema := &base.Schema{
		Type:    []string{"number"},
		Minimum: &min,
		Maximum: &max,
	}

	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(schema)

	require.NotNil(t, constraints)
	assert.Equal(t, 0.0, *constraints.Minimum)
	assert.Equal(t, 150.0, *constraints.Maximum)
}

func TestPropertyAnalyzer_ExtractConstraints_ArrayConstraints(t *testing.T) {
	minItems := int64(1)
	maxItems := int64(100)
	uniqueItems := true
	schema := &base.Schema{
		Type:        []string{"array"},
		MinItems:    &minItems,
		MaxItems:    &maxItems,
		UniqueItems: &uniqueItems,
	}

	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(schema)

	require.NotNil(t, constraints)
	assert.Equal(t, 1, *constraints.MinItems)
	assert.Equal(t, 100, *constraints.MaxItems)
	assert.True(t, constraints.UniqueItems)
}

func TestPropertyAnalyzer_ExtractConstraints_EnumConstraint(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
		Enum: []*yaml.Node{
			{Value: "ACTIVE"},
			{Value: "INACTIVE"},
			{Value: "PENDING"},
		},
	}

	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(schema)

	require.NotNil(t, constraints)
	require.Len(t, constraints.Enum, 3)
	assert.Equal(t, "ACTIVE", constraints.Enum[0])
	assert.Equal(t, "INACTIVE", constraints.Enum[1])
	assert.Equal(t, "PENDING", constraints.Enum[2])
}

func TestPropertyAnalyzer_ExtractConstraints_NoConstraints(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
	}

	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(schema)

	assert.Nil(t, constraints)
}

func TestPropertyAnalyzer_ExtractConstraints_NilSchema(t *testing.T) {
	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(nil)

	assert.Nil(t, constraints)
}

func TestPropertyAnalyzer_DetermineVisibility_RequiredProperty(t *testing.T) {
	schema := &base.Schema{Type: []string{"string"}}
	requiredMap := CreateRequiredMap([]string{"name", "email"})

	analyzer := NewPropertyAnalyzer()
	visibility := analyzer.DetermineVisibility("name", schema, requiredMap)

	assert.Equal(t, VisibilityProtected, visibility)
}

func TestPropertyAnalyzer_DetermineVisibility_WriteOnlyProperty(t *testing.T) {
	writeOnly := true
	schema := &base.Schema{
		Type:      []string{"string"},
		WriteOnly: &writeOnly,
	}

	analyzer := NewPropertyAnalyzer()
	visibility := analyzer.DetermineVisibility("password", schema, map[string]bool{})

	assert.Equal(t, VisibilityPackage, visibility)
}

func TestPropertyAnalyzer_DetermineVisibility_OptionalProperty(t *testing.T) {
	schema := &base.Schema{Type: []string{"string"}}
	requiredMap := CreateRequiredMap([]string{"other"})

	analyzer := NewPropertyAnalyzer()
	visibility := analyzer.DetermineVisibility("optional", schema, requiredMap)

	assert.Equal(t, VisibilityPublic, visibility)
}

func TestPropertyAnalyzer_GenerateTypeString_SimpleType(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
	}

	analyzer := NewPropertyAnalyzer()
	requiredMap := CreateRequiredMap([]string{"name"})
	typeStr := analyzer.GenerateTypeString(schema, "name", requiredMap)

	assert.Equal(t, "string", typeStr)
}

func TestPropertyAnalyzer_GenerateTypeString_OptionalProperty(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
	}

	analyzer := NewPropertyAnalyzer()
	typeStr := analyzer.GenerateTypeString(schema, "nickname", map[string]bool{})

	assert.Equal(t, "string?", typeStr)
}

func TestPropertyAnalyzer_GenerateTypeString_ArrayWithCardinality(t *testing.T) {
	minItems := int64(1)
	maxItems := int64(100)
	schema := &base.Schema{
		Type:     []string{"array"},
		MinItems: &minItems,
		MaxItems: &maxItems,
	}

	analyzer := NewPropertyAnalyzer()
	typeStr := analyzer.GenerateTypeString(schema, "items", map[string]bool{})

	assert.Equal(t, "any[1..100][]", typeStr)
}

func TestPropertyAnalyzer_GenerateTypeString_ArrayWithoutCardinality(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"array"},
	}

	analyzer := NewPropertyAnalyzer()
	typeStr := analyzer.GenerateTypeString(schema, "tags", map[string]bool{})

	assert.Equal(t, "any[]", typeStr)
}

func TestPropertyAnalyzer_GenerateTypeString_NilSchema(t *testing.T) {
	analyzer := NewPropertyAnalyzer()
	typeStr := analyzer.GenerateTypeString(nil, "test", map[string]bool{})

	assert.Equal(t, "any", typeStr)
}

func TestCreateRequiredMap(t *testing.T) {
	required := []string{"name", "email", "age"}
	requiredMap := CreateRequiredMap(required)

	assert.Len(t, requiredMap, 3)
	assert.True(t, requiredMap["name"])
	assert.True(t, requiredMap["email"])
	assert.True(t, requiredMap["age"])
	assert.False(t, requiredMap["optional"])
}

func TestPropertyAnalyzer_ValidateConstraints_ValidConstraints(t *testing.T) {
	minLen := 3
	maxLen := 50
	min := 0.0
	max := 100.0
	minItems := 1
	maxItems := 10

	constraints := &PropertyConstraints{
		MinLength: &minLen,
		MaxLength: &maxLen,
		Minimum:   &min,
		Maximum:   &max,
		MinItems:  &minItems,
		MaxItems:  &maxItems,
	}

	analyzer := NewPropertyAnalyzer()
	errors := analyzer.ValidateConstraints(constraints)

	assert.Empty(t, errors)
}

func TestPropertyAnalyzer_ValidateConstraints_MinLengthGreaterThanMaxLength(t *testing.T) {
	minLen := 50
	maxLen := 3
	constraints := &PropertyConstraints{
		MinLength: &minLen,
		MaxLength: &maxLen,
	}

	analyzer := NewPropertyAnalyzer()
	errors := analyzer.ValidateConstraints(constraints)

	require.Len(t, errors, 1)
	assert.Contains(t, errors[0], "minLength")
}

func TestPropertyAnalyzer_ValidateConstraints_MinimumGreaterThanMaximum(t *testing.T) {
	min := 100.0
	max := 50.0
	constraints := &PropertyConstraints{
		Minimum: &min,
		Maximum: &max,
	}

	analyzer := NewPropertyAnalyzer()
	errors := analyzer.ValidateConstraints(constraints)

	require.Len(t, errors, 1)
	assert.Contains(t, errors[0], "minimum")
}

func TestPropertyAnalyzer_ValidateConstraints_MinItemsGreaterThanMaxItems(t *testing.T) {
	minItems := 10
	maxItems := 1
	constraints := &PropertyConstraints{
		MinItems: &minItems,
		MaxItems: &maxItems,
	}

	analyzer := NewPropertyAnalyzer()
	errors := analyzer.ValidateConstraints(constraints)

	require.Len(t, errors, 1)
	assert.Contains(t, errors[0], "minItems")
}

func TestPropertyAnalyzer_ValidateConstraints_NilConstraints(t *testing.T) {
	analyzer := NewPropertyAnalyzer()
	errors := analyzer.ValidateConstraints(nil)

	assert.Empty(t, errors)
}

func TestPropertyAnalyzer_ExtractConstraints_AllConstraintTypes(t *testing.T) {
	minLen := int64(1)
	maxLen := int64(100)
	min := 0.0
	max := 999.9
	minItems := int64(1)
	maxItems := int64(50)
	uniqueItems := true

	schema := &base.Schema{
		Type:        []string{"array"},
		Format:      "uri",
		Pattern:     "^https?://",
		MinLength:   &minLen,
		MaxLength:   &maxLen,
		Minimum:     &min,
		Maximum:     &max,
		MinItems:    &minItems,
		MaxItems:    &maxItems,
		UniqueItems: &uniqueItems,
		Enum: []*yaml.Node{
			{Value: "A"},
			{Value: "B"},
		},
	}

	analyzer := NewPropertyAnalyzer()
	constraints := analyzer.ExtractConstraints(schema)

	require.NotNil(t, constraints)
	assert.Equal(t, "uri", constraints.Format)
	assert.Equal(t, "^https?://", constraints.Pattern)
	assert.Equal(t, 1, *constraints.MinLength)
	assert.Equal(t, 100, *constraints.MaxLength)
	assert.Equal(t, 0.0, *constraints.Minimum)
	assert.Equal(t, 999.9, *constraints.Maximum)
	assert.Equal(t, 1, *constraints.MinItems)
	assert.Equal(t, 50, *constraints.MaxItems)
	assert.True(t, constraints.UniqueItems)
	assert.Len(t, constraints.Enum, 2)
}

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

func TestNewEnumAnalyzer(t *testing.T) {
	analyzer := NewEnumAnalyzer(EnumInline, 5)
	assert.NotNil(t, analyzer)
	assert.Equal(t, EnumInline, analyzer.visualization)
	assert.Equal(t, 5, analyzer.maxInlineValues)
}

func TestNewEnumAnalyzer_DefaultMaxInlineValues(t *testing.T) {
	analyzer := NewEnumAnalyzer(EnumInline, 0)
	assert.Equal(t, 5, analyzer.maxInlineValues) // should default to 5
}

func TestEnumAnalyzer_AnalyzeEnum_StringEnum(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
		Enum: []*yaml.Node{
			{Value: "ACTIVE"},
			{Value: "INACTIVE"},
			{Value: "PENDING"},
		},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	info := analyzer.AnalyzeEnum(schema, "status")

	require.NotNil(t, info)
	assert.Equal(t, "status", info.Name)
	assert.Equal(t, "string", info.Type)
	assert.Len(t, info.Values, 3)
	assert.Equal(t, "ACTIVE", info.Values[0])
	assert.Equal(t, "INACTIVE", info.Values[1])
	assert.Equal(t, "PENDING", info.Values[2])
	assert.False(t, info.Nullable)
	assert.Equal(t, "", info.Default)
}

func TestEnumAnalyzer_AnalyzeEnum_IntegerEnum(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"integer"},
		Enum: []*yaml.Node{
			{Value: "1"},
			{Value: "2"},
			{Value: "3"},
		},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	info := analyzer.AnalyzeEnum(schema, "priority")

	require.NotNil(t, info)
	assert.Equal(t, "priority", info.Name)
	assert.Equal(t, "integer", info.Type)
	assert.Len(t, info.Values, 3)
}

func TestEnumAnalyzer_AnalyzeEnum_WithNullable(t *testing.T) {
	nullable := true
	schema := &base.Schema{
		Type:     []string{"string"},
		Nullable: &nullable,
		Enum: []*yaml.Node{
			{Value: "A"},
			{Value: "B"},
		},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	info := analyzer.AnalyzeEnum(schema, "grade")

	require.NotNil(t, info)
	assert.True(t, info.Nullable)
}

func TestEnumAnalyzer_AnalyzeEnum_WithDefault(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
		Enum: []*yaml.Node{
			{Value: "ACTIVE"},
			{Value: "INACTIVE"},
		},
		Default: &yaml.Node{Value: "ACTIVE"},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	info := analyzer.AnalyzeEnum(schema, "status")

	require.NotNil(t, info)
	assert.Equal(t, "ACTIVE", info.Default)
}

func TestEnumAnalyzer_AnalyzeEnum_NoEnum(t *testing.T) {
	schema := &base.Schema{
		Type: []string{"string"},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	info := analyzer.AnalyzeEnum(schema, "name")

	assert.Nil(t, info)
}

func TestEnumAnalyzer_AnalyzeEnum_NilSchema(t *testing.T) {
	analyzer := NewEnumAnalyzer(EnumInline, 5)
	info := analyzer.AnalyzeEnum(nil, "test")

	assert.Nil(t, info)
}

func TestEnumAnalyzer_ShouldRenderAsClass_InlineMode(t *testing.T) {
	info := &EnumInfo{
		Name:   "status",
		Values: []string{"A", "B", "C", "D", "E", "F", "G"},
		Type:   "string",
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	shouldBeClass := analyzer.ShouldRenderAsClass(info)

	assert.False(t, shouldBeClass) // inline mode never uses class
}

func TestEnumAnalyzer_ShouldRenderAsClass_ClassMode(t *testing.T) {
	info := &EnumInfo{
		Name:   "status",
		Values: []string{"A", "B"},
		Type:   "string",
	}

	analyzer := NewEnumAnalyzer(EnumClass, 5)
	shouldBeClass := analyzer.ShouldRenderAsClass(info)

	assert.True(t, shouldBeClass) // class mode always uses class
}

func TestEnumAnalyzer_FormatEnumForInline_SmallEnum(t *testing.T) {
	info := &EnumInfo{
		Values: []string{"ACTIVE", "INACTIVE", "PENDING"},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	formatted := analyzer.FormatEnumForInline(info)

	assert.Equal(t, "ACTIVE,INACTIVE,PENDING", formatted)
}

func TestEnumAnalyzer_FormatEnumForInline_LargeEnum(t *testing.T) {
	info := &EnumInfo{
		Values: []string{"A", "B", "C", "D", "E", "F", "G", "H"},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	formatted := analyzer.FormatEnumForInline(info)

	assert.Equal(t, "8 values", formatted)
}

func TestEnumAnalyzer_FormatEnumForInline_VeryLongValues(t *testing.T) {
	info := &EnumInfo{
		Values: []string{
			"VERY_LONG_ENUM_VALUE_1",
			"VERY_LONG_ENUM_VALUE_2",
			"VERY_LONG_ENUM_VALUE_3",
			"VERY_LONG_ENUM_VALUE_4",
			"VERY_LONG_ENUM_VALUE_5",
		},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	formatted := analyzer.FormatEnumForInline(info)

	// should switch to count when string gets too long
	assert.Equal(t, "5 values", formatted)
}

func TestEnumAnalyzer_FormatEnumForInline_NilInfo(t *testing.T) {
	analyzer := NewEnumAnalyzer(EnumInline, 5)
	formatted := analyzer.FormatEnumForInline(nil)

	assert.Equal(t, "", formatted)
}

func TestEnumAnalyzer_CreateEnumClass(t *testing.T) {
	info := &EnumInfo{
		Name:   "Status",
		Values: []string{"ACTIVE", "INACTIVE", "PENDING"},
		Type:   "string",
	}

	analyzer := NewEnumAnalyzer(EnumClass, 5)
	class := analyzer.CreateEnumClass(info, "StatusEnum")

	require.NotNil(t, class)
	assert.Equal(t, "StatusEnum", class.Name)
	assert.Equal(t, ClassTypeEnum, class.Type)
	assert.Contains(t, class.Annotations, "enumeration")
	assert.Len(t, class.Properties, 3)
	assert.Equal(t, "ACTIVE", class.Properties[0].Name)
	assert.Equal(t, "", class.Properties[0].Type) // enum values have no type
	assert.Equal(t, VisibilityPublic, class.Properties[0].Visibility)
	assert.Equal(t, "string", class.Metadata["enumType"])
}

func TestEnumAnalyzer_CreateEnumClass_WithNullable(t *testing.T) {
	info := &EnumInfo{
		Name:     "Grade",
		Values:   []string{"A", "B", "C"},
		Type:     "string",
		Nullable: true,
	}

	analyzer := NewEnumAnalyzer(EnumClass, 5)
	class := analyzer.CreateEnumClass(info, "Grade")

	require.NotNil(t, class)
	assert.Equal(t, true, class.Metadata["nullable"])
}

func TestEnumAnalyzer_CreateEnumClass_WithDefault(t *testing.T) {
	info := &EnumInfo{
		Name:    "Priority",
		Values:  []string{"LOW", "MEDIUM", "HIGH"},
		Type:    "string",
		Default: "MEDIUM",
	}

	analyzer := NewEnumAnalyzer(EnumClass, 5)
	class := analyzer.CreateEnumClass(info, "Priority")

	require.NotNil(t, class)
	assert.Equal(t, "MEDIUM", class.Metadata["default"])
}

func TestEnumAnalyzer_CreateEnumClass_NilInfo(t *testing.T) {
	analyzer := NewEnumAnalyzer(EnumClass, 5)
	class := analyzer.CreateEnumClass(nil, "Test")

	assert.Nil(t, class)
}

func TestEnumAnalyzer_ExtractEnumValues(t *testing.T) {
	schema := &base.Schema{
		Enum: []*yaml.Node{
			{Value: "RED"},
			{Value: "GREEN"},
			{Value: "BLUE"},
		},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)
	values := analyzer.ExtractEnumValues(schema)

	require.Len(t, values, 3)
	assert.Equal(t, "RED", values[0])
	assert.Equal(t, "GREEN", values[1])
	assert.Equal(t, "BLUE", values[2])
}

func TestEnumAnalyzer_ExtractEnumValues_NilSchema(t *testing.T) {
	analyzer := NewEnumAnalyzer(EnumInline, 5)
	values := analyzer.ExtractEnumValues(nil)

	assert.Nil(t, values)
}

func TestEnumAnalyzer_IsEnumSchema(t *testing.T) {
	tests := []struct {
		name     string
		schema   *base.Schema
		expected bool
	}{
		{
			name: "schema with enum",
			schema: &base.Schema{
				Enum: []*yaml.Node{{Value: "A"}, {Value: "B"}},
			},
			expected: true,
		},
		{
			name: "schema without enum",
			schema: &base.Schema{
				Type: []string{"string"},
			},
			expected: false,
		},
		{
			name:     "nil schema",
			schema:   nil,
			expected: false,
		},
		{
			name: "schema with empty enum",
			schema: &base.Schema{
				Enum: []*yaml.Node{},
			},
			expected: false,
		},
	}

	analyzer := NewEnumAnalyzer(EnumInline, 5)

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := analyzer.IsEnumSchema(tt.schema)
			assert.Equal(t, tt.expected, result)
		})
	}
}

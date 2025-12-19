// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"strings"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type EnumVisualization string

const (
	EnumInline  EnumVisualization = "inline"
	EnumClass   EnumVisualization = "class"
	EnumComment EnumVisualization = "comment"
)

type EnumInfo struct {
	Name     string
	Values   []string
	Type     string
	Nullable bool
	Default  string
}

type EnumAnalyzer struct {
	visualization   EnumVisualization
	maxInlineValues int
}

func NewEnumAnalyzer(visualization EnumVisualization, maxInlineValues int) *EnumAnalyzer {
	if maxInlineValues <= 0 {
		maxInlineValues = 5
	}
	return &EnumAnalyzer{
		visualization:   visualization,
		maxInlineValues: maxInlineValues,
	}
}

func (ea *EnumAnalyzer) AnalyzeEnum(schema *base.Schema, propertyName string) *EnumInfo {
	if schema == nil {
		return nil
	}

	if schema.Enum == nil || len(schema.Enum) == 0 {
		return nil
	}

	info := &EnumInfo{
		Name:   propertyName,
		Values: make([]string, 0, len(schema.Enum)),
	}

	if len(schema.Type) > 0 {
		info.Type = schema.Type[0]
	} else {
		// default to string when type not specified
		info.Type = "string"
	}

	for _, enumNode := range schema.Enum {
		if enumNode != nil {
			info.Values = append(info.Values, enumNode.Value)
		}
	}

	if schema.Nullable != nil {
		info.Nullable = *schema.Nullable
	}

	if schema.Default != nil {
		info.Default = schema.Default.Value
	}

	return info
}

func (ea *EnumAnalyzer) ShouldRenderAsClass(info *EnumInfo) bool {
	if info == nil {
		return false
	}

	if ea.visualization == EnumClass {
		return true
	}

	if ea.visualization == EnumInline || ea.visualization == EnumComment {
		return false
	}

	// use class mode when enum has many values
	return len(info.Values) > ea.maxInlineValues
}

func (ea *EnumAnalyzer) FormatEnumForInline(info *EnumInfo) string {
	if info == nil || len(info.Values) == 0 {
		return ""
	}

	if len(info.Values) > ea.maxInlineValues {
		return fmt.Sprintf("%d values", len(info.Values))
	}

	var sb strings.Builder
	sb.Grow(len(info.Values) * 10)

	for i, value := range info.Values {
		if i > 0 {
			sb.WriteRune(',')
		}
		sb.WriteString(value)
		// limit total string length to avoid massive output
		if sb.Len() > 100 {
			return fmt.Sprintf("%d values", len(info.Values))
		}
	}

	return sb.String()
}

func (ea *EnumAnalyzer) CreateEnumClass(info *EnumInfo, schemaName string) *DiagramClass {
	if info == nil {
		return nil
	}

	className := schemaName
	if className == "" {
		className = info.Name
	}

	class := NewDiagramClass(className, className)
	class.Type = ClassTypeEnum
	class.Annotations = []string{"enumeration"}

	for _, value := range info.Values {
		class.AddProperty(&DiagramProperty{
			Name:       value,
			Type:       "",
			Visibility: VisibilityPublic,
		})
	}

	class.Metadata["enumType"] = info.Type
	if info.Nullable {
		class.Metadata["nullable"] = true
	}
	if info.Default != "" {
		class.Metadata["default"] = info.Default
	}

	return class
}

func (ea *EnumAnalyzer) ExtractEnumValues(schema *base.Schema) []string {
	if schema == nil || schema.Enum == nil {
		return nil
	}

	values := make([]string, 0, len(schema.Enum))
	for _, enumNode := range schema.Enum {
		if enumNode != nil {
			values = append(values, enumNode.Value)
		}
	}

	return values
}

func (ea *EnumAnalyzer) IsEnumSchema(schema *base.Schema) bool {
	return schema != nil && schema.Enum != nil && len(schema.Enum) > 0
}

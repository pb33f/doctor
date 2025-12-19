// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type PropertyAnalyzer struct{}

func NewPropertyAnalyzer() *PropertyAnalyzer {
	return &PropertyAnalyzer{}
}

func (pa *PropertyAnalyzer) ExtractConstraints(schema *base.Schema) *PropertyConstraints {
	if schema == nil {
		return nil
	}

	constraints := &PropertyConstraints{}
	hasConstraints := false

	if schema.Format != "" {
		constraints.Format = schema.Format
		hasConstraints = true
	}

	if schema.Pattern != "" {
		constraints.Pattern = schema.Pattern
		hasConstraints = true
	}

	if schema.MinLength != nil {
		ml := int(*schema.MinLength)
		constraints.MinLength = &ml
		hasConstraints = true
	}

	if schema.MaxLength != nil {
		ml := int(*schema.MaxLength)
		constraints.MaxLength = &ml
		hasConstraints = true
	}

	if schema.Minimum != nil {
		constraints.Minimum = schema.Minimum
		hasConstraints = true
	}

	if schema.Maximum != nil {
		constraints.Maximum = schema.Maximum
		hasConstraints = true
	}

	if schema.MinItems != nil {
		mi := int(*schema.MinItems)
		constraints.MinItems = &mi
		hasConstraints = true
	}

	if schema.MaxItems != nil {
		mi := int(*schema.MaxItems)
		constraints.MaxItems = &mi
		hasConstraints = true
	}

	if schema.UniqueItems != nil && *schema.UniqueItems {
		constraints.UniqueItems = true
		hasConstraints = true
	}

	if schema.Enum != nil && len(schema.Enum) > 0 {
		constraints.Enum = make([]string, 0, len(schema.Enum))
		for _, e := range schema.Enum {
			if e != nil {
				constraints.Enum = append(constraints.Enum, e.Value)
			}
		}
		hasConstraints = true
	}

	if !hasConstraints {
		return nil
	}

	return constraints
}

// DetermineVisibility maps OpenAPI properties to UML visibility symbols based on required/writeOnly status
func (pa *PropertyAnalyzer) DetermineVisibility(propertyName string, schema *base.Schema, requiredMap map[string]bool) Visibility {
	if requiredMap[propertyName] {
		return VisibilityProtected
	}

	if schema != nil && schema.WriteOnly != nil && *schema.WriteOnly {
		return VisibilityPackage
	}

	return VisibilityPublic
}

// GenerateTypeString creates a type string with cardinality and optionality markers
func (pa *PropertyAnalyzer) GenerateTypeString(schema *base.Schema, propertyName string, requiredMap map[string]bool) string {
	if schema == nil {
		return "any"
	}

	baseType := "any"
	if len(schema.Type) > 0 {
		baseType = schema.Type[0]
	}

	if baseType == "array" {
		itemType := pa.extractItemType(schema)
		cardinality := pa.extractArrayCardinality(schema)
		return fmt.Sprintf("%s%s[]", itemType, cardinality)
	}

	if !requiredMap[propertyName] {
		if schema.Nullable == nil || !*schema.Nullable {
			baseType += "?"
		}
	}

	return baseType
}

func (pa *PropertyAnalyzer) extractItemType(schema *base.Schema) string {
	if schema.Items == nil {
		return "any"
	}

	if schema.Items.IsA() {
		itemSchema := schema.Items.A
		if itemSchema != nil && itemSchema.Schema() != nil {
			itemSchemaObj := itemSchema.Schema()
			if len(itemSchemaObj.Type) > 0 {
				return itemSchemaObj.Type[0]
			}
			if itemSchema.IsReference() {
				ref := itemSchema.GetReference()
				return ExtractSchemaNameFromReference(ref)
			}
		}
	}

	return "any"
}

func (pa *PropertyAnalyzer) extractArrayCardinality(schema *base.Schema) string {
	if schema.MinItems == nil && schema.MaxItems == nil {
		return ""
	}

	min := "0"
	max := "*"

	if schema.MinItems != nil {
		min = fmt.Sprintf("%d", *schema.MinItems)
	}

	if schema.MaxItems != nil {
		max = fmt.Sprintf("%d", *schema.MaxItems)
	}

	return fmt.Sprintf("[%s..%s]", min, max)
}

// ValidateConstraints checks for invalid constraint combinations and returns errors
func (pa *PropertyAnalyzer) ValidateConstraints(constraints *PropertyConstraints) []string {
	var errors []string

	if constraints == nil {
		return errors
	}

	if err := validateMinMaxGeneric(constraints.MinLength, constraints.MaxLength, "Length"); err != "" {
		errors = append(errors, err)
	}

	if err := validateMinMaxGeneric(constraints.Minimum, constraints.Maximum, ""); err != "" {
		errors = append(errors, err)
	}

	if err := validateMinMaxGeneric(constraints.MinItems, constraints.MaxItems, "Items"); err != "" {
		errors = append(errors, err)
	}

	return errors
}

type Numeric interface {
	~int | ~float64
}

func validateMinMaxGeneric[T Numeric](min, max *T, fieldSuffix string) string {
	if min != nil && max != nil && *min > *max {
		if fieldSuffix == "" {
			return "minimum cannot be greater than maximum"
		}
		return fmt.Sprintf("min%s cannot be greater than max%s", fieldSuffix, fieldSuffix)
	}
	return ""
}

// CreateRequiredMap converts a required fields array to a map for O(1) lookups
func CreateRequiredMap(required []string) map[string]bool {
	m := make(map[string]bool, len(required))
	for _, r := range required {
		m[r] = true
	}
	return m
}

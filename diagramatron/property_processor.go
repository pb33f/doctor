// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"fmt"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// PropertyTypeResult holds the result of property type determination.
// This struct captures all information needed to create properties and relationships.
type PropertyTypeResult struct {
	Type        string // the resolved type string (e.g., "string?", "Card", "oneOf")
	IsRef       bool   // true if this property is a direct $ref
	IsArray     bool   // true if this property is an array type
	RefPath     string // reference path if IsRef is true
	ItemRefPath string // array item reference path if IsArray and items are $ref
}

// buildPropertyDisplayName adds annotations to a property name including enum, readOnly/writeOnly/deprecated, and format.
// This is the single source of truth for property display name enhancement.
func (mt *MermaidTardis) buildPropertyDisplayName(baseName string, propSchema *base.Schema) string {
	displayName := baseName

	// add enum annotation if applicable
	if enumInfo := mt.enumAnalyzer.AnalyzeEnum(propSchema, baseName); enumInfo != nil {
		enumDisplay := mt.enumAnalyzer.FormatEnumForInline(enumInfo)
		if enumDisplay != "" {
			displayName += fmt.Sprintf(" (enum:%s)", enumDisplay)
		}
	}

	// add readOnly/writeOnly/deprecated markers
	if propSchema != nil {
		if propSchema.ReadOnly != nil && *propSchema.ReadOnly {
			displayName += " (readOnly)"
		}
		if propSchema.WriteOnly != nil && *propSchema.WriteOnly {
			displayName += " (writeOnly)"
		}
		if propSchema.Deprecated != nil && *propSchema.Deprecated {
			displayName += " (deprecated)"
		}
	}

	// add format constraint
	if constraints := mt.propertyAnalyzer.ExtractConstraints(propSchema); constraints != nil {
		if constraints.Format != "" {
			displayName += fmt.Sprintf(" (format:%s)", constraints.Format)
		}
	}

	return displayName
}

// determinePropertyType analyzes a property schema and returns comprehensive type information.
// This is the single source of truth for property type determination, handling $refs, arrays, and polymorphism.
func (mt *MermaidTardis) determinePropertyType(
	propSchemaProxy *base.SchemaProxy,
	propSchema *base.Schema,
	propName string,
	requiredMap map[string]bool,
) *PropertyTypeResult {
	result := &PropertyTypeResult{}

	// check for direct $ref first
	if propSchemaProxy.IsReference() {
		result.IsRef = true
		result.RefPath = propSchemaProxy.GetReference()
		result.Type = ExtractSchemaNameFromReference(result.RefPath)
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// check for array type
	if propSchema != nil && len(propSchema.Type) > 0 && propSchema.Type[0] == "array" {
		result.IsArray = true
		if propSchema.Items != nil && propSchema.Items.IsA() {
			if itemProxy := propSchema.Items.A; itemProxy != nil && itemProxy.IsReference() {
				// array of referenced type
				result.ItemRefPath = itemProxy.GetReference()
				itemType := ExtractSchemaNameFromReference(result.ItemRefPath)
				result.Type = fmt.Sprintf("%s[]", itemType)
			} else {
				// array of inline type
				result.Type = mt.propertyAnalyzer.GenerateTypeString(propSchema, propName, requiredMap)
			}
		} else {
			// array without items definition
			result.Type = mt.propertyAnalyzer.GenerateTypeString(propSchema, propName, requiredMap)
		}
		// add optionality for arrays
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// check for oneOf polymorphism
	if propSchema != nil && propSchema.OneOf != nil && len(propSchema.OneOf) > 1 {
		result.Type = "oneOf"
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// check for anyOf polymorphism
	if propSchema != nil && propSchema.AnyOf != nil && len(propSchema.AnyOf) > 1 {
		result.Type = "anyOf"
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// check for allOf composition
	if propSchema != nil && propSchema.AllOf != nil {
		result.Type = "any"
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// fallback to property analyzer for simple types
	result.Type = mt.propertyAnalyzer.GenerateTypeString(propSchema, propName, requiredMap)
	return result
}

// createPropertyRelationships creates diagram relationships for a property based on its type.
// This handles polymorphism (oneOf/anyOf), direct $refs, and array item $refs.
func (mt *MermaidTardis) createPropertyRelationships(
	ctx context.Context,
	parentID string,
	propName string,
	propSchemaProxy *base.SchemaProxy,
	propSchema *base.Schema,
	typeResult *PropertyTypeResult,
) {
	// check if property has oneOf/anyOf (property-level polymorphism)
	if propSchema != nil && ((propSchema.OneOf != nil && len(propSchema.OneOf) > 1) || (propSchema.AnyOf != nil && len(propSchema.AnyOf) > 1)) {
		// property-level polymorphism: show direct relationships to ALL variants (no placeholder)
		mt.handlePropertyPolymorphism(ctx, parentID, propName, propSchema)
		return
	}

	// check for direct $ref
	if typeResult.IsRef && typeResult.RefPath != "" {
		// visit the component schema (not the property proxy) to avoid duplicate classes
		mt.visitComponentSchemaByRef(ctx, typeResult.RefPath)

		mt.diagram.AddRelationship(&MermaidRelationship{
			Source: parentID,
			Target: ExtractSchemaNameFromReference(typeResult.RefPath),
			Type:   RelationComposition,
			Label:  propName,
		})
		return
	}

	// check for array with $ref items
	if typeResult.IsArray && typeResult.ItemRefPath != "" {
		// visit the component schema
		mt.visitComponentSchemaByRef(ctx, typeResult.ItemRefPath)

		// use cardinality if config enabled
		cardinality := ""
		if mt.diagram.Config.ShowCardinality {
			cardinality = "0..*"
		}

		mt.diagram.AddRelationship(&MermaidRelationship{
			Source:      parentID,
			Target:      ExtractSchemaNameFromReference(typeResult.ItemRefPath),
			Type:        RelationComposition,
			Label:       propName,
			Cardinality: cardinality,
		})
	}
}

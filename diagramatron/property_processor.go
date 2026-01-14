// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"fmt"
	"strings"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// PropertyTypeResult holds the result of property type determination.
// This struct captures all information needed to create properties and relationships.
type PropertyTypeResult struct {
	Type          string   // the resolved type string (e.g., "string?", "Card", "oneOf")
	IsRef         bool     // true if this property is a direct $ref
	IsArray       bool     // true if this property is an array type
	IsAllOf       bool     // true if this property has allOf composition
	RefPath       string   // reference path if IsRef is true
	ItemRefPath   string   // array item reference path if IsArray and items are $ref
	AllOfRefPaths []string // reference paths for allOf members
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
		// sanitize the type name to match the class ID (e.g., Links-Self -> Links_Self)
		result.Type = sanitizeID(ExtractSchemaNameFromReference(result.RefPath))
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
				// sanitize the type name to match the class ID
				itemType := sanitizeID(ExtractSchemaNameFromReference(result.ItemRefPath))
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

	// check for oneOf polymorphism (multiple options)
	if propSchema != nil && propSchema.OneOf != nil && len(propSchema.OneOf) > 1 {
		result.Type = mt.buildUnionTypeString(propSchema.OneOf)
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// check for anyOf polymorphism (multiple options)
	if propSchema != nil && propSchema.AnyOf != nil && len(propSchema.AnyOf) > 1 {
		result.Type = mt.buildUnionTypeString(propSchema.AnyOf)
		if !requiredMap[propName] {
			result.Type += "?"
		}
		return result
	}

	// check for single-option oneOf (nullable reference pattern in OAS 3.0)
	// e.g., anyOf: [{$ref: '#/components/schemas/Foo'}] with nullable: true
	if propSchema != nil && propSchema.OneOf != nil && len(propSchema.OneOf) == 1 {
		singleOption := propSchema.OneOf[0]
		if singleOption != nil && singleOption.IsReference() {
			result.IsRef = true
			result.RefPath = singleOption.GetReference()
			result.Type = sanitizeID(ExtractSchemaNameFromReference(result.RefPath))
			// single-option oneOf is typically nullable, so always add ?
			result.Type += "?"
			return result
		}
	}

	// check for single-option anyOf (nullable reference pattern in OAS 3.0)
	if propSchema != nil && propSchema.AnyOf != nil && len(propSchema.AnyOf) == 1 {
		singleOption := propSchema.AnyOf[0]
		if singleOption != nil && singleOption.IsReference() {
			result.IsRef = true
			result.RefPath = singleOption.GetReference()
			result.Type = sanitizeID(ExtractSchemaNameFromReference(result.RefPath))
			// single-option anyOf is typically nullable, so always add ?
			result.Type += "?"
			return result
		}
	}

	// check for allOf composition
	if propSchema != nil && len(propSchema.AllOf) > 0 {
		result.IsAllOf = true
		result.Type = "allOf"

		// collect reference paths for allOf members
		for _, allOfProxy := range propSchema.AllOf {
			if allOfProxy != nil && allOfProxy.IsReference() {
				result.AllOfRefPaths = append(result.AllOfRefPaths, allOfProxy.GetReference())
			}
		}

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
	if propSchema != nil && ((len(propSchema.OneOf) > 1) || (len(propSchema.AnyOf) > 1)) {
		// property-level polymorphism: show direct relationships to ALL variants (no placeholder)
		mt.handlePropertyPolymorphism(ctx, parentID, propName, propSchema)
		return
	}

	// check if property has allOf composition
	if propSchema != nil && len(propSchema.AllOf) > 0 {
		// property-level composition: show relationships to ALL allOf members
		mt.handlePropertyAllOf(ctx, parentID, propName, propSchema)
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

// buildUnionTypeString builds a UML-style union type string from oneOf/anyOf variants.
// For example: "string | file" or "Card | BankAccount"
// Primitives are shown as type names, $refs as schema names.
func (mt *MermaidTardis) buildUnionTypeString(variants []*base.SchemaProxy) string {
	if len(variants) == 0 {
		return "any"
	}

	var typeNames []string
	for _, variant := range variants {
		if variant == nil {
			continue
		}

		typeName := mt.getVariantTypeName(variant)
		if typeName != "" {
			typeNames = append(typeNames, typeName)
		}
	}

	if len(typeNames) == 0 {
		return "any"
	}

	return strings.Join(typeNames, " | ")
}

// getVariantTypeName returns the type name for a polymorphic variant.
// For $refs: returns the schema name (sanitized)
// For inline schemas: returns the type (e.g., "string", "integer") or title if available
func (mt *MermaidTardis) getVariantTypeName(variant *base.SchemaProxy) string {
	if variant == nil {
		return ""
	}

	// check for $ref
	if variant.IsReference() {
		return sanitizeID(ExtractSchemaNameFromReference(variant.GetReference()))
	}

	// inline schema - get the type
	schema := variant.Schema()
	if schema == nil {
		return ""
	}

	// prefer title if available (for titled inline schemas)
	if schema.Title != "" {
		return sanitizeID(schema.Title)
	}

	// use the type
	if len(schema.Type) > 0 {
		return schema.Type[0]
	}

	return "object"
}

// isSimpleScalarVariant checks if a variant is a simple scalar type (string, number, integer, boolean)
// that should NOT have a class created for it in UML.
func (mt *MermaidTardis) isSimpleScalarVariant(variant *base.SchemaProxy) bool {
	if variant == nil {
		return true
	}

	// $refs are never simple scalars - they reference defined schemas
	if variant.IsReference() {
		return false
	}

	// check inline schema
	schema := variant.Schema()
	if schema == nil {
		return true
	}

	// if it has a title, treat as a named type (not a simple scalar)
	if schema.Title != "" {
		return false
	}

	// if it has properties, it's an object
	if schema.Properties != nil && schema.Properties.Len() > 0 {
		return false
	}

	// check for scalar types
	if len(schema.Type) > 0 {
		t := schema.Type[0]
		switch t {
		case "string", "number", "integer", "boolean", "null":
			return true
		}
	}

	return false
}

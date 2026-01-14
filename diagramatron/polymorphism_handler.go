// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"fmt"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// createPolymorphicPlaceholder creates an abstract placeholder class for oneOf/anyOf schemas
// and sets up inheritance relationships to variant schemas
func (mt *MermaidTardis) createPolymorphicPlaceholder(ctx context.Context, schema *v3.Schema, id, name string, baseSchema *base.Schema) *MermaidClass {
	if schema == nil {
		return nil
	}

	// determine which polymorphic construct we're dealing with
	var variants []*v3.SchemaProxy
	var stereotype string
	var suffix string

	if schema.OneOf != nil && len(schema.OneOf) > 1 {
		variants = schema.OneOf
		stereotype = "oneOf"
		suffix = "_Choice"
	} else if schema.AnyOf != nil && len(schema.AnyOf) > 1 {
		variants = schema.AnyOf
		stereotype = "anyOf"
		suffix = "_Union"
	} else {
		return nil
	}

	// create placeholder class with stereotype
	placeholderName := name + suffix
	placeholderID := id + suffix
	placeholder := NewMermaidClass(placeholderID, placeholderName)

	// Use "interface" stereotype which Mermaid DOES render, and add a property showing the type
	placeholder.Annotations = []string{"interface"}
	placeholder.AddProperty(&MermaidMember{
		Name:       fmt.Sprintf("(%s)", stereotype),
		Type:       "",
		Visibility: "+",
	})

	// visit each variant and create inheritance relationships
	for i, variantProxy := range variants {
		if variantProxy == nil {
			continue
		}

		// mark this oneOf/anyOf member as visited so it doesn't create its own class later
		// (similar to allOf flattening)
		if variantProxy.Schema != nil {
			jsonPath := variantProxy.Schema.GenerateJSONPath()
			mt.visited[jsonPath] = true
		}

		// visit the variant schema so it creates its own class
		if variantProxy.Value != nil && variantProxy.Value.IsReference() {
			// visit component schema (not the member copy)
			mt.visitComponentSchemaByRef(ctx, variantProxy.Value.GetReference())
			variantID := ExtractSchemaNameFromReference(variantProxy.Value.GetReference())

			// inheritance: placeholder <|-- variant
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: placeholderID,
				Target: variantID,
				Type:   RelationInheritance,
			})
		} else {
			// inline variant schema - handle based on title and config
			variantSchema := variantProxy.Schema
			if variantSchema == nil || variantSchema.Value == nil {
				continue
			}

			var variantID string
			if mt.diagram.Config.RenderTitledInlineSchema && variantSchema.Value.Title != "" {
				// inline variant with title - create a separate class using the title
				variantID = sanitizeID(variantSchema.Value.Title)
				mt.createInlineVariantClass(ctx, variantID, variantSchema.Value)
			} else {
				// no title or config disabled - use indexed ID to avoid collisions
				variantID = fmt.Sprintf("%s_%s_%d", id, stereotype, i)
				mt.createInlineVariantClass(ctx, variantID, variantSchema.Value)
			}

			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: placeholderID,
				Target: variantID,
				Type:   RelationInheritance,
			})
		}
	}

	return placeholder
}

// handlePropertyPolymorphism handles property-level oneOf/anyOf.
// Shows direct relationships to object types only - scalars are shown in the type annotation.
// This follows UML best practices: primitives are type annotations, not classes.
func (mt *MermaidTardis) handlePropertyPolymorphism(ctx context.Context, parentID, propName string, propSchema *base.Schema) {
	if propSchema == nil {
		return
	}

	var variants []*base.SchemaProxy
	if propSchema.OneOf != nil && len(propSchema.OneOf) > 1 {
		variants = propSchema.OneOf
	} else if propSchema.AnyOf != nil && len(propSchema.AnyOf) > 1 {
		variants = propSchema.AnyOf
	} else {
		return
	}

	// create relationships only for non-scalar variants (object types)
	// scalars are already represented in the union type annotation (e.g., "string | file")
	for i, variantProxy := range variants {
		if variantProxy == nil {
			continue
		}

		// skip simple scalar types - they don't need classes or relationships in UML
		if mt.isSimpleScalarVariant(variantProxy) {
			continue
		}

		// visit the variant schema and create relationship
		if variantProxy.IsReference() {
			mt.visitComponentSchemaByRef(ctx, variantProxy.GetReference())
			variantID := ExtractSchemaNameFromReference(variantProxy.GetReference())

			// direct association relationship
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: parentID,
				Target: variantID,
				Type:   RelationAssociation,
				Label:  propName,
			})
		} else {
			// handle inline object variants (with title or properties)
			variantSchema := variantProxy.Schema()
			if variantSchema == nil {
				continue
			}

			// determine variant ID based on config and whether it has a title
			var variantID string
			if mt.diagram.Config.RenderTitledInlineSchema && variantSchema.Title != "" {
				// titled inline - use the title
				variantID = sanitizeID(variantSchema.Title)
			} else if variantSchema.Properties != nil && variantSchema.Properties.Len() > 0 {
				// anonymous inline object with properties - use indexed ID
				variantID = fmt.Sprintf("%s_%s_%d", parentID, propName, i)
			} else {
				// anonymous inline without properties - skip (represented in type only)
				continue
			}

			mt.createInlineVariantClass(ctx, variantID, variantSchema)

			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: parentID,
				Target: variantID,
				Type:   RelationAssociation,
				Label:  propName,
			})
		}
	}
}

// handlePropertyAllOf handles property-level allOf composition.
// Creates composition relationships to all allOf members.
func (mt *MermaidTardis) handlePropertyAllOf(ctx context.Context, parentID, propName string, propSchema *base.Schema) {
	if propSchema == nil || len(propSchema.AllOf) == 0 {
		return
	}

	// create composition relationships to each allOf member
	for i, allOfProxy := range propSchema.AllOf {
		if allOfProxy == nil {
			continue
		}

		// visit the allOf member schema
		if allOfProxy.IsReference() {
			mt.visitComponentSchemaByRef(ctx, allOfProxy.GetReference())
			targetID := ExtractSchemaNameFromReference(allOfProxy.GetReference())

			// composition relationship (stronger than association)
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: parentID,
				Target: targetID,
				Type:   RelationComposition,
				Label:  propName,
			})
		} else {
			// handle inline allOf members
			allOfSchema := allOfProxy.Schema()
			if allOfSchema == nil {
				continue
			}

			// check if config allows rendering titled inline schemas as separate classes
			var targetID string
			if mt.diagram.Config.RenderTitledInlineSchema && allOfSchema.Title != "" {
				// inline member with title - create a separate class
				targetID = sanitizeID(allOfSchema.Title)
			} else {
				// no title or config disabled - use indexed ID
				targetID = fmt.Sprintf("%s_%s_allOf_%d", parentID, propName, i)
			}

			// create the class for this inline member
			mt.createInlineVariantClass(ctx, targetID, allOfSchema)

			// add composition relationship
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: parentID,
				Target: targetID,
				Type:   RelationComposition,
				Label:  propName,
			})
		}
	}
}

// createInlineVariantClass creates a MermaidClass for an inline schema variant (oneOf/anyOf/allOf member).
// This is used when the inline schema has a title and should be rendered as a separate class.
func (mt *MermaidTardis) createInlineVariantClass(ctx context.Context, variantID string, schema *base.Schema) {
	if schema == nil {
		return
	}

	// use title as name if available, otherwise use the ID
	name := variantID
	if schema.Title != "" {
		name = schema.Title
	}

	class := NewMermaidClass(variantID, name)

	// set type annotation
	if len(schema.Type) > 0 {
		class.Annotations = append(class.Annotations, schema.Type[0])
	}

	// add properties
	if schema.Properties != nil {
		requiredMap := CreateRequiredMap(schema.Required)
		count := 0
		maxProps := mt.diagram.Config.MaxProperties

		for pair := schema.Properties.First(); pair != nil; pair = pair.Next() {
			if maxProps > 0 && count >= maxProps {
				break
			}

			propName := pair.Key()
			propSchemaProxy := pair.Value()
			propSchema := propSchemaProxy.Schema()

			// determine property type using shared helper
			typeResult := mt.determinePropertyType(propSchemaProxy, propSchema, propName, requiredMap)

			visibility := string(mt.propertyAnalyzer.DetermineVisibility(propName, propSchema, requiredMap))

			// add common property annotations (enum, readOnly/writeOnly/deprecated, format)
			displayName := mt.buildPropertyDisplayName(propName, propSchema)

			class.AddProperty(&MermaidMember{
				Name:       displayName,
				Type:       typeResult.Type,
				Visibility: visibility,
			})
			count++
		}

		// show truncation message if needed
		if maxProps > 0 && schema.Properties.Len() > maxProps {
			class.AddProperty(&MermaidMember{
				Name:       fmt.Sprintf("... +%d more", schema.Properties.Len()-maxProps),
				Type:       "",
				Visibility: "+",
			})
		}
	}

	mt.diagram.AddClass(class)
}

// flattenAllOfComposition flattens allOf members into a single unified class.
// Returns the flattened class and a list of base schema reference IDs.
// If RenderTitledInlineSchema is enabled and an inline member has a Title, it will be rendered
// as a separate class with an inheritance relationship instead of being flattened.
func (mt *MermaidTardis) flattenAllOfComposition(ctx context.Context, schema *v3.Schema, id, name string, baseSchema *base.Schema) (*MermaidClass, []string) {
	class := NewMermaidClass(id, name)
	baseSchemaRefs := make([]string, 0)

	// set type annotations from the base schema if available
	if len(baseSchema.Type) > 0 {
		class.Annotations = append(class.Annotations, baseSchema.Type[0])
	}

	// collect all properties from allOf members
	allProperties := make(map[string]*MermaidMember)
	requiredMap := CreateRequiredMap(baseSchema.Required)

	for _, allOfProxy := range schema.AllOf {
		if allOfProxy == nil {
			continue
		}

		// check if this is a reference to a base schema
		isRef := allOfProxy.Value != nil && allOfProxy.Value.IsReference()
		if isRef {
			// track this as a base schema reference
			refPath := allOfProxy.Value.GetReference()
			baseRef := ExtractSchemaNameFromReference(refPath)
			baseSchemaRefs = append(baseSchemaRefs, baseRef)

			// Visit the actual component schema (not the allOf member copy) so it creates its own class
			mt.visitComponentSchemaByRef(ctx, refPath)

			// IMPORTANT: Do NOT copy properties from $ref'd schemas into the flattened class
			// The flattened class should only show properties it ADDS, not inherited properties
			continue // SKIP property extraction for this $ref member
		}

		// check if this inline allOf member has a title and config allows rendering as separate class
		if allOfProxy.Schema != nil && allOfProxy.Schema.Value != nil {
			memberSchema := allOfProxy.Schema.Value
			if mt.diagram.Config.RenderTitledInlineSchema && memberSchema.Title != "" {
				// this inline allOf member has a title - render as separate class with inheritance
				memberID := sanitizeID(memberSchema.Title)
				mt.createInlineVariantClass(ctx, memberID, memberSchema)
				baseSchemaRefs = append(baseSchemaRefs, memberID)

				// mark as visited so it doesn't get created again
				jsonPath := allOfProxy.Schema.GenerateJSONPath()
				mt.visited[jsonPath] = true

				// skip property extraction - this member is rendered as a separate class
				continue
			}
		}

		// for inline allOf members without title (or config disabled), mark them as visited
		// so they don't create separate classes (we're flattening them into this class instead)
		if allOfProxy.Schema != nil {
			jsonPath := allOfProxy.Schema.GenerateJSONPath()
			mt.visited[jsonPath] = true
		}

		// extract properties from inline allOf members only (not $ref'd ones and not titled ones)
		// this code should only run for inline members without titles
		if allOfProxy.Schema != nil && allOfProxy.Schema.Value != nil {
			memberSchema := allOfProxy.Schema.Value
			if memberSchema.Properties != nil {
				for pair := memberSchema.Properties.First(); pair != nil; pair = pair.Next() {
					propName := pair.Key()
					propSchemaProxy := pair.Value()
					propSchema := propSchemaProxy.Schema()

					// determine property type using shared helper
					typeResult := mt.determinePropertyType(propSchemaProxy, propSchema, propName, requiredMap)

					visibility := string(mt.propertyAnalyzer.DetermineVisibility(propName, propSchema, requiredMap))

					// add common property annotations (enum, readOnly/writeOnly/deprecated, format)
					displayName := mt.buildPropertyDisplayName(propName, propSchema)

					allProperties[propName] = &MermaidMember{
						Name:       displayName,
						Type:       typeResult.Type,
						Visibility: visibility,
					}

					// create property relationships using shared helper
					mt.createPropertyRelationships(ctx, id, propName, propSchemaProxy, propSchema, typeResult)
				}
			}
		}
	}

	// add all collected properties to the class
	for _, member := range allProperties {
		class.AddProperty(member)
	}

	return class, baseSchemaRefs
}

// isCompositionMemberOfParent checks if this schema is a composition member (allOf/oneOf/anyOf)
// of a parent schema that will handle it specially (flattening or placeholder),
// and thus this member should not create its own class.
func (mt *MermaidTardis) isCompositionMemberOfParent(schema *v3.Schema) bool {
	if schema == nil || schema.Parent == nil {
		return false
	}

	// check if parent is a SchemaProxy
	parentProxy, ok := schema.Parent.(*v3.SchemaProxy)
	if !ok {
		return false
	}

	// check if the SchemaProxy's parent is a Schema (the actual parent schema containing composition)
	if parentProxy.Parent == nil {
		return false
	}

	parentSchema, ok := parentProxy.Parent.(*v3.Schema)
	if !ok {
		return false
	}

	// check if this schema is in the parent's allOf list (will be flattened)
	if parentSchema.AllOf != nil {
		for _, allOfMember := range parentSchema.AllOf {
			if allOfMember != nil && allOfMember.Schema == schema {
				// found it - check if parent will be flattened
				pattern := mt.relationshipAnalyzer.DetectCompositionPattern(parentSchema, mt.getClassID)
				return pattern == PatternExtension || pattern == PatternMixin
			}
		}
	}

	// check if this schema is in the parent's oneOf list (will be handled by placeholder)
	if parentSchema.OneOf != nil && len(parentSchema.OneOf) > 1 {
		for _, oneOfMember := range parentSchema.OneOf {
			if oneOfMember != nil && oneOfMember.Schema == schema {
				return true // oneOf members are handled by the placeholder
			}
		}
	}

	// check if this schema is in the parent's anyOf list (will be handled by placeholder)
	if parentSchema.AnyOf != nil && len(parentSchema.AnyOf) > 1 {
		for _, anyOfMember := range parentSchema.AnyOf {
			if anyOfMember != nil && anyOfMember.Schema == schema {
				return true // anyOf members are handled by the placeholder
			}
		}
	}

	return false
}

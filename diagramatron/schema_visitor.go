// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"fmt"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// visitSchema visits a schema and converts it to a mermaid class
func (mt *MermaidTardis) visitSchema(ctx context.Context, schema *v3.Schema) {
	if schema == nil {
		return
	}

	mt.visitSchemaInternal(ctx, schema, schema.Value)
}

// visitSchemaProxy visits a schema proxy
func (mt *MermaidTardis) visitSchemaProxy(ctx context.Context, proxy *v3.SchemaProxy) {
	if proxy == nil {
		return
	}

	// DON'T mark proxy as visited here - it shares JSON path with its underlying schema
	// Let the actual schema's Travel() handle visited tracking to avoid false circulars.

	// check if this is a reference
	if proxy.Value != nil && proxy.Value.IsReference() {
		refPath := proxy.Value.GetReference()
		if refPath != "" {
			// check if external reference
			if mt.externalRefHandler.IsExternal(refPath) {
				// create placeholder for external schema
				placeholder := mt.externalRefHandler.CreateExternalPlaceholder(refPath)
				if placeholder != nil {
					mermaidClass := mt.convertToMermaidClass(placeholder)
					mt.diagram.AddClass(mermaidClass)
				}
				return
			} else {
				// internal reference - call visitSchema directly to avoid double-visit issue
				if proxy.Schema != nil {
					mt.visitSchema(ctx, proxy.Schema)
				}
				return
			}
		}
	}

	// inline schema - call visitSchema directly to avoid double-visit issue
	if proxy.Schema != nil {
		mt.visitSchema(ctx, proxy.Schema)
	}
}

// visitSchemaInternal is the core schema processing logic
func (mt *MermaidTardis) visitSchemaInternal(ctx context.Context, drSchema any, schema *base.Schema) {
	if schema == nil {
		return
	}

	// check if this is a simple primitive that shouldn't become a class
	if mt.isSimplePrimitive(schema) {
		return
	}

	id := mt.getClassID(drSchema)
	name := mt.extractSchemaName(drSchema, schema)

	// check for polymorphic schemas (oneOf/anyOf) - create placeholders
	var class *MermaidClass
	var baseSchemaRefs []string

	if s, ok := drSchema.(*v3.Schema); ok {
		// check for oneOf/anyOf (exclusive/inclusive unions)
		if (s.OneOf != nil && len(s.OneOf) > 1) || (s.AnyOf != nil && len(s.AnyOf) > 1) {
			// create polymorphic placeholder
			class = mt.createPolymorphicPlaceholder(ctx, s, id, name, schema)
		} else if s.AllOf != nil && len(s.AllOf) > 0 {
			// check if this uses allOf composition that should be flattened
			pattern := mt.relationshipAnalyzer.DetectCompositionPattern(s, mt.getClassID)
			if pattern == PatternExtension || pattern == PatternMixin {
				// flatten allOf into a single class
				class, baseSchemaRefs = mt.flattenAllOfComposition(ctx, s, id, name, schema)
			}
		} else if (s.OneOf != nil && len(s.OneOf) == 1) || (s.AnyOf != nil && len(s.AnyOf) == 1) {
			// degenerate case: single-member oneOf/anyOf - treat as direct reference
			var singleMember *v3.SchemaProxy
			if s.OneOf != nil && len(s.OneOf) == 1 {
				singleMember = s.OneOf[0]
			} else if s.AnyOf != nil && len(s.AnyOf) == 1 {
				singleMember = s.AnyOf[0]
			}

			if singleMember != nil {
				// just visit the single member, don't create placeholder
				mt.visitSchemaProxy(ctx, singleMember)
				return // don't create a class for this schema
			}
		}
	}

	// determine if we created a placeholder or flattened allOf
	wasProcessed := class != nil

	if class == nil {
		// standard class creation (no special processing)
		class = NewMermaidClass(id, name)
	}

	// set type annotations
	if len(schema.Type) > 0 {
		class.Annotations = append(class.Annotations, schema.Type[0])
	}

	// add properties with enhanced analysis
	// ONLY do standard property iteration if we DIDN'T do special processing (flatten allOf or create polymorphic placeholder)
	if !wasProcessed && schema.Properties != nil {
		requiredMap := CreateRequiredMap(schema.Required)
		count := 0
		maxProps := mt.diagram.Config.MaxProperties

		// MaxProperties <= 0 means no limit
		shouldContinue := func() bool {
			if maxProps <= 0 {
				return true
			}
			return count < maxProps
		}

		for pair := schema.Properties.First(); pair != nil && shouldContinue(); pair = pair.Next() {
			propName := pair.Key()
			propSchemaProxy := pair.Value()
			propSchema := propSchemaProxy.Schema()

			// determine property type using shared helper
			typeResult := mt.determinePropertyType(propSchemaProxy, propSchema, propName, requiredMap)

			visibility := string(mt.propertyAnalyzer.DetermineVisibility(propName, propSchema, requiredMap))

			// build property name with potential annotations
			displayName := propName

			// check if this is a discriminator property (unique to visitSchemaInternal)
			if s, ok := drSchema.(*v3.Schema); ok {
				if discInfo := mt.discriminatorAnalyzer.GetDiscriminatorForProperty(s, propName, mt.getClassID); discInfo != nil {
					displayName += " (discriminator)"
				}
			}

			// add common property annotations (enum, readOnly/writeOnly/deprecated, format)
			displayName = mt.buildPropertyDisplayName(displayName, propSchema)

			class.AddProperty(&MermaidMember{
				Name:       displayName,
				Type:       typeResult.Type,
				Visibility: visibility,
			})
			count++

			// create property relationships using shared helper
			mt.createPropertyRelationships(ctx, id, propName, propSchemaProxy, propSchema, typeResult)
		}

		// show truncation message only if maxProps is positive and properties were truncated
		if maxProps > 0 && schema.Properties.Len() > maxProps {
			class.AddProperty(&MermaidMember{
				Name:       fmt.Sprintf("... +%d more", schema.Properties.Len()-maxProps),
				Type:       "",
				Visibility: "+",
			})
		}
	}

	mt.diagram.AddClass(class)

	// Handle relationships based on what processing we did
	if len(baseSchemaRefs) > 0 {
		// we flattened allOf - show inheritance relationships to base schemas
		for _, baseRef := range baseSchemaRefs {
			mt.diagram.AddRelationship(&MermaidRelationship{
				Source: baseRef,        // base schema is the source
				Target: id,             // derived schema is the target
				Type:   RelationInheritance, // <|-- inheritance arrow
				Label:  "extends",
			})
		}
	} else if !wasProcessed {
		// we didn't flatten allOf OR create oneOf/anyOf placeholder
		// use RelationshipAnalyzer to detect standard schema relationships
		if s, ok := drSchema.(*v3.Schema); ok {
			relationships := mt.relationshipAnalyzer.AnalyzeSchema(s, mt.getClassID)

			for _, rel := range relationships {
				// visit target schema first
				targetProxy := mt.getSchemaProxyForRelationship(s, rel)
				if targetProxy != nil {
					mt.visitSchemaProxy(ctx, targetProxy)
				}

				// add relationship to diagram
				mt.diagram.AddRelationship(&MermaidRelationship{
					Source:      rel.SourceID,
					Target:      rel.TargetID,
					Type:        rel.Type,
					Label:       rel.Label,
					Cardinality: rel.Cardinality,
				})
			}
		}
	}
	// if wasProcessed and no baseSchemaRefs, it means we created a oneOf/anyOf placeholder
	// which already handled all relationships, so we skip standard analysis
}

// visitComponentSchemaByRef looks up and visits a component schema by its reference path
// This ensures the component schema creates its own class in the diagram
func (mt *MermaidTardis) visitComponentSchemaByRef(ctx context.Context, refPath string) {
	if refPath == "" || !strings.HasPrefix(refPath, "#/components/schemas/") {
		return
	}

	schemaName := ExtractSchemaNameFromReference(refPath)

	// check if we've already created a class for this schema
	if mt.diagram.HasClass(schemaName) {
		return // already created, skip to avoid duplicates
	}

	// check if this reference is part of a circular reference chain (pre-computed by index)
	isCircular := mt.circularRefs[refPath]

	// try to get from document if available
	if mt.document != nil && mt.document.Components != nil && mt.document.Components.Schemas != nil {
		componentSchemaProxy := mt.document.Components.Schemas.GetOrZero(schemaName)
		if componentSchemaProxy != nil && componentSchemaProxy.Schema != nil {
			if isCircular {
				// for circular refs, create a basic class but don't recurse into properties
				// this ensures the schema is rendered without causing infinite loops
				mt.createCircularRefClass(schemaName, componentSchemaProxy.Schema)
			} else {
				// visit the actual component schema normally
				mt.visitSchema(ctx, componentSchemaProxy.Schema)
			}
		}
	}
}

// createCircularRefClass creates a basic class for a circular reference schema
// This renders the schema's properties but doesn't recurse into nested references
// to avoid infinite loops
func (mt *MermaidTardis) createCircularRefClass(schemaName string, schema *v3.Schema) {
	if schema == nil || schema.Value == nil {
		return
	}

	class := NewMermaidClass(schemaName, schemaName)

	// set type annotation
	if len(schema.Value.Type) > 0 {
		class.Annotations = append(class.Annotations, schema.Value.Type[0])
	}

	// add circular annotation to make it very clear this is a circular reference
	class.Annotations = append(class.Annotations, "circular")

	// add a property marker at the top to indicate circular reference
	class.AddProperty(&MermaidMember{
		Name:       "(circular ref)",
		Type:       "",
		Visibility: "+",
	})

	// add properties (but don't recurse into property relationships)
	if schema.Value.Properties != nil {
		requiredMap := CreateRequiredMap(schema.Value.Required)
		count := 0
		maxProps := mt.diagram.Config.MaxProperties

		for propPair := schema.Value.Properties.First(); propPair != nil; propPair = propPair.Next() {
			if maxProps > 0 && count >= maxProps {
				break
			}

			propName := propPair.Key()
			propSchemaProxy := propPair.Value()
			if propSchemaProxy == nil {
				continue
			}

			propSchema := propSchemaProxy.Schema()
			typeResult := mt.determinePropertyType(propSchemaProxy, propSchema, propName, requiredMap)
			displayName := mt.buildPropertyDisplayName(propName, propSchema)
			visibility := mt.propertyAnalyzer.DetermineVisibility(propName, propSchema, requiredMap)

			class.AddProperty(&MermaidMember{
				Name:       displayName,
				Type:       typeResult.Type,
				Visibility: string(visibility),
			})

			count++
		}

		// show truncation message if needed
		if maxProps > 0 && schema.Value.Properties.Len() > maxProps {
			class.AddProperty(&MermaidMember{
				Name:       fmt.Sprintf("... +%d more", schema.Value.Properties.Len()-maxProps),
				Type:       "",
				Visibility: "+",
			})
		}
	}

	mt.diagram.AddClass(class)
}

// isSimplePrimitive determines if a schema is too simple to warrant its own class
// Simple primitives (string, number, boolean without properties) should be inline properties, not classes
// This should ONLY filter truly inline primitive types, not component schemas or complex structures
func (mt *MermaidTardis) isSimplePrimitive(schema *base.Schema) bool {
	if schema == nil {
		return true
	}

	// if it has a title, it's a named schema and should be rendered
	if schema.Title != "" {
		return false
	}

	// if it has properties or is an object type with structure, it's not simple
	if schema.Properties != nil && schema.Properties.Len() > 0 {
		return false
	}

	// if it has complex composition (allOf, oneOf, anyOf), it's not simple
	if schema.AllOf != nil && len(schema.AllOf) > 0 {
		return false
	}
	if schema.OneOf != nil && len(schema.OneOf) > 0 {
		return false
	}
	if schema.AnyOf != nil && len(schema.AnyOf) > 0 {
		return false
	}

	// if it has additionalProperties, it needs to be a class
	if schema.AdditionalProperties != nil && schema.AdditionalProperties.IsA() {
		return false
	}

	// if it has items (array type), it needs to be a class
	if schema.Items != nil && schema.Items.IsA() {
		return false
	}

	// if it has enum values, it should be rendered (for enum visualization)
	if schema.Enum != nil && len(schema.Enum) > 0 {
		return false
	}

	// For safety, let's be very conservative and only filter if explicitly a simple primitive
	// with no additional features whatsoever
	if len(schema.Type) > 0 {
		t := schema.Type[0]
		switch t {
		case "string", "number", "integer", "boolean", "null":
			// only filter if it has absolutely no other features
			hasNoFeatures := schema.Format == "" &&
				schema.Pattern == "" &&
				schema.MinLength == nil &&
				schema.MaxLength == nil &&
				schema.Minimum == nil &&
				schema.Maximum == nil &&
				schema.Description == ""
			return hasNoFeatures
		}
	}

	return false
}

// convertToMermaidClass converts a DiagramClass to a MermaidClass
func (mt *MermaidTardis) convertToMermaidClass(diagramClass *DiagramClass) *MermaidClass {
	if diagramClass == nil {
		return nil
	}

	mermaidClass := NewMermaidClass(diagramClass.ID, diagramClass.Name)
	mermaidClass.Type = string(diagramClass.Type)
	mermaidClass.Annotations = append([]string{}, diagramClass.Annotations...)
	mermaidClass.Namespace = diagramClass.Namespace

	// convert properties
	for _, prop := range diagramClass.Properties {
		mermaidClass.AddProperty(&MermaidMember{
			Name:       prop.Name,
			Type:       prop.Type,
			Visibility: string(prop.Visibility),
		})
	}

	// convert methods
	for _, method := range diagramClass.Methods {
		mermaidClass.AddMethod(&MermaidMember{
			Name:       method.Name,
			Type:       method.ReturnType,
			Visibility: string(method.Visibility),
			Parameters: method.Parameters,
		})
	}

	// preserve external file metadata as annotations
	if diagramClass.Metadata != nil {
		if file, ok := diagramClass.Metadata["file"].(string); ok {
			mermaidClass.Annotations = append(mermaidClass.Annotations, fmt.Sprintf("file:%s", file))
		}
	}

	return mermaidClass
}

// getSchemaProxyForRelationship retrieves the SchemaProxy for a detected relationship
func (mt *MermaidTardis) getSchemaProxyForRelationship(schema *v3.Schema, rel Relationship) *v3.SchemaProxy {
	if schema == nil {
		return nil
	}

	// map relationship label to corresponding schema field
	switch rel.Label {
	case "allOf":
		if schema.AllOf != nil {
			for _, proxy := range schema.AllOf {
				if mt.getClassID(proxy) == rel.TargetID {
					return proxy
				}
			}
		}
	case "oneOf":
		if schema.OneOf != nil {
			for _, proxy := range schema.OneOf {
				if mt.getClassID(proxy) == rel.TargetID {
					return proxy
				}
			}
		}
	case "anyOf":
		if schema.AnyOf != nil {
			for _, proxy := range schema.AnyOf {
				if mt.getClassID(proxy) == rel.TargetID {
					return proxy
				}
			}
		}
	case "not":
		if schema.Not != nil && mt.getClassID(schema.Not) == rel.TargetID {
			return schema.Not
		}
	case "items":
		if schema.Items != nil && schema.Items.Value != nil && schema.Items.Value.IsA() {
			return schema.Items.A
		}
	case "additionalProperties":
		if schema.AdditionalProperties != nil && schema.AdditionalProperties.Value != nil && schema.AdditionalProperties.Value.IsA() {
			return schema.AdditionalProperties.A
		}
	}

	return nil
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Schema struct {
	Value                 *base.Schema
	Hash                  string
	AllOf                 []*SchemaProxy
	OneOf                 []*SchemaProxy
	AnyOf                 []*SchemaProxy
	PrefixItems           []*SchemaProxy
	Discriminator         *Discriminator
	Contains              *SchemaProxy
	If                    *SchemaProxy
	Else                  *SchemaProxy
	Then                  *SchemaProxy
	DependentSchemas      *orderedmap.Map[string, *SchemaProxy]
	PatternProperties     *orderedmap.Map[string, *SchemaProxy]
	PropertyNames         *SchemaProxy
	UnevaluatedItems      *SchemaProxy
	UnevaluatedProperties *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]
	Items                 *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]
	Not                   *SchemaProxy
	Properties            *orderedmap.Map[string, *SchemaProxy]
	AdditionalProperties  *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]
	XML                   *XML
	ExternalDocs          *ExternalDoc
	Foundation
}

func (s *Schema) Walk(ctx context.Context, schema *base.Schema) {

	s.Value = schema
	//s.Hash = fmt.Sprintf("%x", schema.GoLow().Hash())

	if schema.AllOf != nil {
		var allOf []*SchemaProxy
		for i, allOfItem := range schema.AllOf {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "allOf"
			sch.Value = allOfItem
			allOf = append(allOf, sch)
			sch.Walk(ctx, allOfItem)
		}
		s.AllOf = allOf
	}

	if schema.OneOf != nil {
		var oneOf []*SchemaProxy
		for i, oneOfItem := range schema.OneOf {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "oneOf"
			sch.Value = oneOfItem
			oneOf = append(oneOf, sch)
			sch.Walk(ctx, oneOfItem)
		}
		s.OneOf = oneOf
	}

	if schema.AnyOf != nil {
		var anyOf []*SchemaProxy
		for i, anyOfItem := range schema.AnyOf {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "anyOf"
			sch.Value = anyOfItem
			anyOf = append(anyOf, sch)
			sch.Walk(ctx, anyOfItem)
		}
		s.AnyOf = anyOf
	}

	if schema.PrefixItems != nil {
		var prefixItems []*SchemaProxy
		for i, prefixItem := range schema.PrefixItems {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "prefixItems"
			sch.Value = prefixItem
			prefixItems = append(prefixItems, sch)
			sch.Walk(ctx, prefixItem)
		}
		s.PrefixItems = prefixItems
	}

	if schema.Discriminator != nil {
		d := &Discriminator{}
		d.Parent = s
		d.PathSegment = "discriminator"
		d.Value = schema.Discriminator
		s.Discriminator = d
	}

	if schema.Contains != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "contains"
		sch.Walk(ctx, schema.Contains)
		s.Contains = sch
	}

	if schema.If != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "if"
		sch.Walk(ctx, schema.Contains)
		s.If = sch
	}

	if schema.Else != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "else"
		sch.Walk(ctx, schema.Contains)
		s.Else = sch
	}

	if schema.Then != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "then"
		sch.Walk(ctx, schema.Contains)
		s.Then = sch
	}

	if schema.DependentSchemas != nil {
		dependentSchemas := orderedmap.New[string, *SchemaProxy]()
		for dependentSchemasPairs := schema.DependentSchemas.First(); dependentSchemasPairs != nil; dependentSchemasPairs = dependentSchemasPairs.Next() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.PathSegment = "dependentSchemas"
			sch.Key = dependentSchemasPairs.Key()
			dependentSchemas.Set(dependentSchemasPairs.Key(), sch)
			sch.Walk(ctx, dependentSchemasPairs.Value())
		}
		s.DependentSchemas = dependentSchemas
	}

	if schema.PatternProperties != nil {
		patternProperties := orderedmap.New[string, *SchemaProxy]()
		for patternPropertiesPairs := schema.PatternProperties.First(); patternPropertiesPairs != nil; patternPropertiesPairs = patternPropertiesPairs.Next() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.PathSegment = "patternProperties"
			sch.Key = patternPropertiesPairs.Key()
			patternProperties.Set(patternPropertiesPairs.Key(), sch)
			sch.Walk(ctx, patternPropertiesPairs.Value())
		}
		s.PatternProperties = patternProperties
	}

	if schema.PropertyNames != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "propertyNames"
		sch.Value = schema.PropertyNames
		s.PropertyNames = sch
	}

	if schema.UnevaluatedItems != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "unevaluatedItems"
		sch.Value = schema.UnevaluatedItems
		s.UnevaluatedItems = sch
	}

	if schema.UnevaluatedProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.PathSegment = "unevaluatedProperties"
		dynamicValue.Parent = s
		dynamicValue.Value = schema.UnevaluatedProperties
		if schema.UnevaluatedProperties.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.Value = schema.UnevaluatedProperties.A
			sch.Walk(ctx, schema.UnevaluatedProperties.A)
		} else {
			dynamicValue.B = schema.UnevaluatedProperties.B
		}
		s.UnevaluatedProperties = dynamicValue
	}

	if schema.Items != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.PathSegment = "items"
		dynamicValue.Parent = s
		dynamicValue.Value = schema.Items
		if schema.Items.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = dynamicValue
			sch.Value = schema.Items.A
			dynamicValue.A = sch
			sch.Walk(ctx, schema.Items.A)
		} else {
			dynamicValue.B = schema.Items.B
		}
		s.Items = dynamicValue
	}

	if schema.Not != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "not"
		sch.Value = schema.Not
		s.Not = sch
		sch.Walk(ctx, schema.Not)
	}

	if schema.Properties != nil {
		properties := orderedmap.New[string, *SchemaProxy]()
		for propertiesPairs := schema.Properties.First(); propertiesPairs != nil; propertiesPairs = propertiesPairs.Next() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.PathSegment = "properties"
			sch.Key = propertiesPairs.Key()
			properties.Set(propertiesPairs.Key(), sch)
			sch.Walk(ctx, propertiesPairs.Value())
		}
		s.Properties = properties
	}

	if schema.AdditionalProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.PathSegment = "additionalProperties"
		dynamicValue.Parent = s
		dynamicValue.Value = schema.AdditionalProperties
		if schema.AdditionalProperties.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = dynamicValue
			sch.Value = schema.AdditionalProperties.A
			dynamicValue.A = sch
			dynamicValue.Walk(ctx)
		} else {
			dynamicValue.B = schema.AdditionalProperties.B
		}
		s.AdditionalProperties = dynamicValue
	}

	if schema.XML != nil {
		xml := &XML{}
		xml.Parent = s
		xml.PathSegment = "xml"
		xml.Value = schema.XML
		s.XML = xml
	}

	if schema.ExternalDocs != nil {
		externalDocs := &ExternalDoc{}
		externalDocs.Parent = s
		externalDocs.PathSegment = "externalDocs"
		externalDocs.Value = schema.ExternalDocs
		s.ExternalDocs = externalDocs
	}

}

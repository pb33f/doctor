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

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	s.Value = schema

	if schema.AllOf != nil {
		var allOf []*SchemaProxy
		for i, allOfItem := range schema.AllOf {
			allOfItem := allOfItem
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "allOf"
			sch.Value = allOfItem
			allOf = append(allOf, sch)
			wg.Go(func() { sch.Walk(ctx, allOfItem) })
		}
		s.AllOf = allOf
	}

	if schema.OneOf != nil {
		var oneOf []*SchemaProxy
		for i, oneOfItem := range schema.OneOf {
			oneOfItem := oneOfItem
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "oneOf"
			sch.Value = oneOfItem
			oneOf = append(oneOf, sch)
			wg.Go(func() { sch.Walk(ctx, oneOfItem) })
		}
		s.OneOf = oneOf
	}

	if schema.AnyOf != nil {
		var anyOf []*SchemaProxy
		for i, anyOfItem := range schema.AnyOf {
			anyOfItem := anyOfItem
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "anyOf"
			sch.Value = anyOfItem
			anyOf = append(anyOf, sch)
			wg.Go(func() { sch.Walk(ctx, anyOfItem) })
		}
		s.AnyOf = anyOf
	}

	if schema.PrefixItems != nil {
		var prefixItems []*SchemaProxy
		for i, prefixItem := range schema.PrefixItems {
			prefixItem := prefixItem
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "prefixItems"
			sch.Value = prefixItem
			prefixItems = append(prefixItems, sch)
			wg.Go(func() { sch.Walk(ctx, prefixItem) })
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
		wg.Go(func() { sch.Walk(ctx, schema.Contains) })
		s.Contains = sch
	}

	if schema.If != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "if"
		wg.Go(func() { sch.Walk(ctx, schema.Contains) })
		s.If = sch
	}

	if schema.Else != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "else"
		wg.Go(func() { sch.Walk(ctx, schema.Contains) })
		s.Else = sch
	}

	if schema.Then != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.PathSegment = "then"
		wg.Go(func() { sch.Walk(ctx, schema.Contains) })
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
			v := dependentSchemasPairs.Value()
			wg.Go(func() { sch.Walk(ctx, v) })
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
			v := patternPropertiesPairs.Value()
			wg.Go(func() { sch.Walk(ctx, v) })
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
			v := schema.UnevaluatedProperties.A
			wg.Go(func() { sch.Walk(ctx, v) })
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
			v := schema.Items.A
			wg.Go(func() { sch.Walk(ctx, v) })
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
		v := schema.Not
		wg.Go(func() { sch.Walk(ctx, v) })
	}

	if schema.Properties != nil {
		properties := orderedmap.New[string, *SchemaProxy]()
		for propertiesPairs := schema.Properties.First(); propertiesPairs != nil; propertiesPairs = propertiesPairs.Next() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.PathSegment = "properties"
			sch.Key = propertiesPairs.Key()
			properties.Set(propertiesPairs.Key(), sch)
			v := propertiesPairs.Value()
			wg.Go(func() { sch.Walk(ctx, v) })
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
			wg.Go(func() { dynamicValue.Walk(ctx) })
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

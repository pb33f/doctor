// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"slices"
)

type Schema struct {
	Name                  string
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
	//s.KeyNode = schema.ParentProxy.GetSchemaKeyNode()
	//s.ValueNode = schema.GoLow().GetRootNode()
	s.BuildNodesAndEdges(ctx, s.Name, "schema", schema, s)

	if schema.AllOf != nil {
		var allOf []*SchemaProxy
		for i, allOfItem := range schema.AllOf {
			aOfItem := allOfItem
			sch := &SchemaProxy{}
			sch.ValueNode = allOfItem.GetSchemaKeyNode()
			sch.KeyNode = schema.GoLow().AllOf.KeyNode
			sch.ValueNode = schema.GoLow().AllOf.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "allOf"
			sch.NodeParent = s
			sch.Value = aOfItem
			allOf = append(allOf, sch)
			wg.Go(func() {
				sch.Walk(ctx, aOfItem)
			})
		}
		s.AllOf = allOf
	}

	if schema.OneOf != nil {
		var oneOf []*SchemaProxy
		for i, oneOfItem := range schema.OneOf {
			oOfItem := oneOfItem
			sch := &SchemaProxy{}
			sch.KeyNode = schema.GoLow().OneOf.KeyNode
			sch.ValueNode = schema.GoLow().OneOf.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "oneOf"
			sch.NodeParent = s
			sch.Value = oOfItem
			oneOf = append(oneOf, sch)
			wg.Go(func() { sch.Walk(ctx, oOfItem) })
		}
		s.OneOf = oneOf
	}

	if schema.AnyOf != nil {
		var anyOf []*SchemaProxy
		for i, anyOfItem := range schema.AnyOf {
			aOfItem := anyOfItem
			sch := &SchemaProxy{}
			sch.KeyNode = schema.GoLow().AnyOf.KeyNode
			sch.ValueNode = schema.GoLow().AnyOf.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.PathSegment = "anyOf"
			sch.NodeParent = s
			sch.Value = aOfItem
			anyOf = append(anyOf, sch)
			wg.Go(func() { sch.Walk(ctx, aOfItem) })
		}
		s.AnyOf = anyOf
	}

	if schema.PrefixItems != nil {
		var prefixItems []*SchemaProxy
		for i, prefixItem := range schema.PrefixItems {
			pItem := prefixItem
			sch := &SchemaProxy{}
			sch.KeyNode = schema.GoLow().PrefixItems.KeyNode
			sch.ValueNode = schema.GoLow().PrefixItems.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = i
			sch.NodeParent = s
			sch.PathSegment = "prefixItems"
			sch.Value = pItem
			prefixItems = append(prefixItems, sch)
			wg.Go(func() { sch.Walk(ctx, pItem) })
		}
		s.PrefixItems = prefixItems
	}

	if schema.Discriminator != nil {
		d := &Discriminator{}
		d.KeyNode = schema.GoLow().Discriminator.KeyNode
		d.ValueNode = schema.GoLow().Discriminator.ValueNode
		d.Parent = s
		d.PathSegment = "discriminator"
		d.Value = schema.Discriminator
		d.NodeParent = s
		d.BuildNodesAndEdges(ctx, cases.Title(language.English).String(d.PathSegment), d.PathSegment, schema.Discriminator, d)
		s.Discriminator = d
	}

	if schema.Contains != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = schema.GoLow().Contains.KeyNode
		sch.ValueNode = schema.GoLow().Contains.ValueNode
		sch.Parent = s
		sch.PathSegment = "contains"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.Contains) })
		s.Contains = sch
	}

	if schema.If != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = schema.GoLow().If.KeyNode
		sch.ValueNode = schema.GoLow().If.ValueNode
		sch.Parent = s
		sch.PathSegment = "if"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.If) })
		s.If = sch
	}

	if schema.Else != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = schema.GoLow().Else.KeyNode
		sch.ValueNode = schema.GoLow().Else.ValueNode
		sch.Parent = s
		sch.PathSegment = "else"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.Else) })
		s.Else = sch
	}

	if schema.Then != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.KeyNode = schema.GoLow().Then.KeyNode
		sch.ValueNode = schema.GoLow().Then.ValueNode
		sch.PathSegment = "then"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.Then) })
		s.Then = sch
	}

	if schema.DependentSchemas != nil {
		dependentSchemas := orderedmap.New[string, *SchemaProxy]()
		for dependentSchemasPairs := schema.DependentSchemas.First(); dependentSchemasPairs != nil; dependentSchemasPairs = dependentSchemasPairs.Next() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.PathSegment = "dependentSchemas"
			sch.Key = dependentSchemasPairs.Key()
			for lowDPairs := schema.GoLow().DependentSchemas.Value.First(); lowDPairs != nil; lowDPairs = lowDPairs.Next() {
				if lowDPairs.Key().Value == sch.Key {
					sch.KeyNode = lowDPairs.Key().KeyNode
					sch.ValueNode = lowDPairs.Value().ValueNode
					break
				}
			}

			sch.NodeParent = s
			dependentSchemas.Set(dependentSchemasPairs.Key(), sch)
			v := dependentSchemasPairs.Value()
			if v.IsReference() {
				sch.NodeParent = s
			} else {
				if slices.Contains(v.Schema().Type, "object") {
					sch.NodeParent = s
				}
			}
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
			for lowPPPairs := schema.GoLow().PatternProperties.Value.First(); lowPPPairs != nil; lowPPPairs = lowPPPairs.Next() {
				if lowPPPairs.Key().Value == sch.Key {
					sch.KeyNode = lowPPPairs.Key().KeyNode
					sch.ValueNode = lowPPPairs.Value().ValueNode
					break
				}
			}
			sch.NodeParent = s
			patternProperties.Set(patternPropertiesPairs.Key(), sch)
			v := patternPropertiesPairs.Value()
			if v.IsReference() {
				sch.NodeParent = s
			} else {
				if slices.Contains(v.Schema().Type, "object") {
					sch.NodeParent = s
				}
			}
			wg.Go(func() { sch.Walk(ctx, v) })
		}
		s.PatternProperties = patternProperties
	}

	if schema.PropertyNames != nil {
		sch := &SchemaProxy{}
		sch.ValueNode = schema.GoLow().PropertyNames.ValueNode
		sch.KeyNode = schema.GoLow().PropertyNames.KeyNode
		sch.Parent = s
		sch.PathSegment = "propertyNames"
		sch.Value = schema.PropertyNames
		sch.NodeParent = s
		s.PropertyNames = sch
		wg.Go(func() { sch.Walk(ctx, s.PropertyNames.Value) })
	}

	if schema.UnevaluatedItems != nil {
		sch := &SchemaProxy{}
		sch.ValueNode = schema.GoLow().UnevaluatedItems.ValueNode
		sch.KeyNode = schema.GoLow().UnevaluatedItems.KeyNode
		sch.Parent = s
		sch.PathSegment = "unevaluatedItems"
		sch.Value = schema.UnevaluatedItems
		sch.NodeParent = s
		s.UnevaluatedItems = sch
		wg.Go(func() { sch.Walk(ctx, s.UnevaluatedItems.Value) })
	}

	if schema.UnevaluatedProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.PathSegment = "unevaluatedProperties"
		dynamicValue.Parent = s
		dynamicValue.Value = schema.UnevaluatedProperties
		dynamicValue.ValueNode = schema.GoLow().UnevaluatedProperties.ValueNode
		dynamicValue.KeyNode = schema.GoLow().UnevaluatedProperties.KeyNode
		//dynamicValue.BuildNodesAndEdges(ctx, dynamicValue.PathSegment)
		if schema.UnevaluatedProperties.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.Value = schema.UnevaluatedProperties.A
			sch.NodeParent = s
			sch.ValueNode = schema.GoLow().UnevaluatedProperties.ValueNode
			sch.KeyNode = schema.GoLow().UnevaluatedProperties.KeyNode
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
		dynamicValue.ValueNode = schema.GoLow().Items.ValueNode
		dynamicValue.KeyNode = schema.GoLow().Items.KeyNode
		//dynamicValue.BuildNodesAndEdges(ctx, dynamicValue.PathSegment)
		if schema.Items.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = dynamicValue
			sch.Value = schema.Items.A
			sch.NodeParent = s
			sch.ValueNode = schema.GoLow().Items.ValueNode
			sch.KeyNode = schema.GoLow().Items.KeyNode
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
		sch.ValueNode = schema.GoLow().Not.ValueNode
		sch.KeyNode = schema.GoLow().Not.KeyNode
		sch.Parent = s
		sch.PathSegment = "not"
		sch.Value = schema.Not
		sch.NodeParent = s
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
			v := propertiesPairs.Value()
			sch.Key = propertiesPairs.Key()
			sch.Value = v
			properties.Set(propertiesPairs.Key(), sch)
			for lowSchPairs := schema.GoLow().Properties.Value.First(); lowSchPairs != nil; lowSchPairs = lowSchPairs.Next() {
				if lowSchPairs.Key().Value == sch.Key {
					sch.ValueNode = lowSchPairs.Value().ValueNode
					sch.KeyNode = lowSchPairs.Key().KeyNode
					break
				}
			}

			if v.IsReference() {
				sch.NodeParent = s
			} else {
				if slices.Contains(v.Schema().Type, "object") {
					sch.NodeParent = s
				}
			}
			wg.Go(func() {
				sch.Walk(ctx, v)
			})
		}
		s.Properties = properties
	}

	if schema.AdditionalProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.PathSegment = "additionalProperties"
		dynamicValue.Parent = s
		dynamicValue.Value = schema.AdditionalProperties
		dynamicValue.KeyNode = schema.GoLow().AdditionalProperties.KeyNode
		dynamicValue.ValueNode = schema.GoLow().AdditionalProperties.ValueNode
		if schema.AdditionalProperties.IsA() {
			sch := &SchemaProxy{}
			sch.ValueNode = schema.AdditionalProperties.A.GetSchemaKeyNode()
			sch.Parent = dynamicValue
			sch.NodeParent = s
			sch.Value = schema.AdditionalProperties.A
			sch.KeyNode = schema.AdditionalProperties.A.GoLow().GetKeyNode()
			sch.ValueNode = schema.AdditionalProperties.A.GoLow().GetValueNode()
			dynamicValue.A = sch
			wg.Go(func() { dynamicValue.Walk(ctx) })
		} else {
			dynamicValue.B = schema.AdditionalProperties.B
		}
		s.AdditionalProperties = dynamicValue
	}

	if schema.XML != nil {
		xml := &XML{}
		xml.ValueNode = schema.GoLow().XML.ValueNode
		xml.KeyNode = schema.GoLow().XML.KeyNode
		xml.Parent = s
		xml.PathSegment = "xml"
		xml.Value = schema.XML
		xml.NodeParent = s
		xml.BuildNodesAndEdges(ctx, "xml", "xml", schema.XML, schema.XML)
		s.XML = xml
	}

	if schema.ExternalDocs != nil {
		externalDocs := &ExternalDoc{}
		externalDocs.ValueNode = schema.GoLow().ExternalDocs.ValueNode
		externalDocs.KeyNode = schema.GoLow().ExternalDocs.KeyNode
		externalDocs.Parent = s
		externalDocs.PathSegment = "externalDocs"
		externalDocs.Value = schema.ExternalDocs
		externalDocs.NodeParent = s
		//externalDocs.BuildNodesAndEdges(ctx, externalDocs.PathSegment)
		s.ExternalDocs = externalDocs
	}
}

func (s *Schema) GetValue() any {
	return s.Value
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"fmt"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"slices"
	"strings"
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

func (s *Schema) Walk(ctx context.Context, schema *base.Schema, depth int) {

	drCtx := GetDrContext(ctx)
	buf := strings.Builder{}
	l := schema.GoLow()
	buf.WriteString(l.Index.GetSpecAbsolutePath())
	buf.WriteString(":")
	buf.WriteString(fmt.Sprint(l.RootNode.Line))
	buf.WriteString(":")
	buf.WriteString(fmt.Sprint(l.RootNode.Column))
	depth++
	if depth > 500 {
		// this schema is insane and we're going to bail
		if drCtx.Logger != nil {
			drCtx.Logger.Warn("schema is too deep, over 500 levels! - exiting build, model will be incomplete", "schema", schema)
		}
		return
	}
	wg := drCtx.WaitGroup

	sm := drCtx.SchemaCache
	if drCtx.UseSchemaCache {
		if h, ok := sm.Load(buf.String()); ok {

			// cached! we don't need to re-walk this.
			s.Value = schema

			rnHash := index.HashNode(schema.GoLow().RootNode)
			hash := h.(string)
			if rnHash == hash {
				s.BuildNodesAndEdges(ctx, s.Name, "schema", schema, s)
				drCtx.ObjectChan <- s
				return

			}
		}

		sm.Store(buf.String(), index.HashNode(schema.GoLow().RootNode))
	}

	s.Value = schema

	process := true
	if schema.Type != nil {
		if slices.Contains(schema.Type, "boolean") ||
			slices.Contains(schema.Type, "number") ||
			slices.Contains(schema.Type, "string") {
			process = false
		}
	}

	if s.Index != nil {
		n := ""
		if len(s.Value.Type) > 0 {
			n = s.Value.Type[0]
		}
		if s.Value.Title != "" {
			n = s.Value.Title
		}
		if n == "" {
			n = "schema"
		}
		if process {
			s.ProcessNodesAndEdges(ctx, n, "schema", schema, s, false, 0, s.Index, true)
		}
	} else {
		negone := -1
		if s.Name == "" {
			s.Name = "schema"
		}
		if process {
			s.ProcessNodesAndEdges(ctx, s.Name, "schema", schema, s, false, 0, &negone, true)
		}
	}

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
			sch.Index = &i
			sch.PathSegment = "allOf"
			sch.PolyType = sch.PathSegment
			sch.NodeParent = s
			sch.Value = aOfItem
			allOf = append(allOf, sch)
			wg.Go(func() { sch.Walk(ctx, aOfItem, depth) })

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
			sch.Index = &i
			sch.PathSegment = "oneOf"
			sch.PolyType = sch.PathSegment
			sch.NodeParent = s
			sch.Value = oOfItem
			oneOf = append(oneOf, sch)
			wg.Go(func() { sch.Walk(ctx, oOfItem, depth) })
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
			sch.Index = &i
			sch.PathSegment = "anyOf"
			sch.PolyType = sch.PathSegment
			sch.NodeParent = s
			sch.Value = aOfItem
			anyOf = append(anyOf, sch)
			wg.Go(func() { sch.Walk(ctx, aOfItem, depth) })
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
			sch.Index = &i
			sch.NodeParent = s
			sch.PathSegment = "prefixItems"
			sch.Value = pItem
			prefixItems = append(prefixItems, sch)
			wg.Go(func() { sch.Walk(ctx, pItem, depth) })
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
		drCtx.ObjectChan <- d
	}

	if schema.Contains != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = schema.GoLow().Contains.KeyNode
		sch.ValueNode = schema.GoLow().Contains.ValueNode
		sch.Parent = s
		sch.PathSegment = "contains"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.Contains, depth) })
		s.Contains = sch
	}

	if schema.If != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = schema.GoLow().If.KeyNode
		sch.ValueNode = schema.GoLow().If.ValueNode
		sch.Parent = s
		sch.PathSegment = "if"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.If, depth) })
		s.If = sch
	}

	if schema.Else != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = schema.GoLow().Else.KeyNode
		sch.ValueNode = schema.GoLow().Else.ValueNode
		sch.Parent = s
		sch.PathSegment = "else"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.Else, depth) })
		s.Else = sch
	}

	if schema.Then != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.KeyNode = schema.GoLow().Then.KeyNode
		sch.ValueNode = schema.GoLow().Then.ValueNode
		sch.PathSegment = "then"
		sch.NodeParent = s
		wg.Go(func() { sch.Walk(ctx, schema.Then, depth) })
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
			wg.Go(func() { sch.Walk(ctx, v, depth) })
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
			walked := false
			for lowPPPairs := schema.GoLow().PatternProperties.Value.First(); lowPPPairs != nil; lowPPPairs = lowPPPairs.Next() {
				if lowPPPairs.Key().Value == sch.Key {
					sch.KeyNode = lowPPPairs.Key().KeyNode
					sch.ValueNode = lowPPPairs.Value().ValueNode

					g := patternPropertiesPairs.Value().Schema()
					if g != nil {
						if !slices.Contains(g.Type, "string") &&
							!slices.Contains(g.Type, "boolean") &&
							!slices.Contains(g.Type, "integer") &&
							!slices.Contains(g.Type, "number") {
							sch.NodeParent = s
						}
					}
					walked = true
					wg.Go(func() {
						sch.Walk(ctx, patternPropertiesPairs.Value(), depth)
					})
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
			if !walked {
				g := patternPropertiesPairs.Value().Schema()
				if !slices.Contains(g.Type, "string") &&
					!slices.Contains(g.Type, "boolean") &&
					!slices.Contains(g.Type, "integer") &&
					!slices.Contains(g.Type, "number") {
					sch.NodeParent = s
				}
				wg.Go(func() { sch.Walk(ctx, v, depth) })
			}
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
		wg.Go(func() { sch.Walk(ctx, s.PropertyNames.Value, depth) })
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
		wg.Go(func() { sch.Walk(ctx, s.UnevaluatedItems.Value, depth) })
	}

	if schema.UnevaluatedProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.PathSegment = "unevaluatedProperties"
		dynamicValue.Parent = s
		dynamicValue.Value = schema.UnevaluatedProperties
		dynamicValue.ValueNode = schema.GoLow().UnevaluatedProperties.ValueNode
		dynamicValue.KeyNode = schema.GoLow().UnevaluatedProperties.KeyNode
		if schema.UnevaluatedProperties.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.Value = schema.UnevaluatedProperties.A
			sch.NodeParent = s
			sch.ValueNode = schema.GoLow().UnevaluatedProperties.ValueNode
			sch.KeyNode = schema.GoLow().UnevaluatedProperties.KeyNode
			v := schema.UnevaluatedProperties.A
			wg.Go(func() { sch.Walk(ctx, v, depth) })
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
		dynamicValue.Node = s.Node
		if schema.Items.IsA() {

			sch := &SchemaProxy{}
			sch.Parent = dynamicValue
			sch.Value = schema.Items.A
			sch.NodeParent = s
			sch.ValueNode = schema.GoLow().Items.ValueNode
			sch.KeyNode = schema.GoLow().Items.KeyNode
			sch.Node = s.Node
			dynamicValue.A = sch
			dynamicValue.Node = s.Node
			v := schema.Items.A
			wg.Go(func() {
				sch.Walk(ctx, v, depth)
			})
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
		wg.Go(func() { sch.Walk(ctx, v, depth) })
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
			walked := false
			for lowSchPairs := schema.GoLow().Properties.Value.First(); lowSchPairs != nil; lowSchPairs = lowSchPairs.Next() {
				if lowSchPairs.Key().Value == sch.Key {
					sch.ValueNode = lowSchPairs.Value().ValueNode
					sch.KeyNode = lowSchPairs.Key().KeyNode
					g := v.Schema()
					if g != nil {
						if !slices.Contains(g.Type, "string") &&
							!slices.Contains(g.Type, "boolean") &&
							!slices.Contains(g.Type, "integer") &&
							!slices.Contains(g.Type, "number") {
							sch.NodeParent = s
						}
					}
					walked = true
					//wg.Go(func() {
					sch.Walk(ctx, v, depth)
					//})
					break
				}
			}

			if v.IsReference() {
				sch.NodeParent = s
			} else {
				g := v.Schema()
				if g != nil {
					if !slices.Contains(g.Type, "string") &&
						!slices.Contains(g.Type, "boolean") &&
						!slices.Contains(g.Type, "integer") &&
						!slices.Contains(g.Type, "number") {
						sch.NodeParent = s
					}
				}
			}
			if !walked {
				wg.Go(func() {
					sch.Walk(ctx, v, depth)
				})
			}
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
		drCtx.ObjectChan <- xml
	}

	if schema.ExternalDocs != nil {
		externalDocs := &ExternalDoc{}
		externalDocs.ValueNode = schema.GoLow().ExternalDocs.ValueNode
		externalDocs.KeyNode = schema.GoLow().ExternalDocs.KeyNode
		externalDocs.Parent = s
		externalDocs.PathSegment = "externalDocs"
		externalDocs.Value = schema.ExternalDocs
		externalDocs.NodeParent = s
		s.ExternalDocs = externalDocs
		drCtx.ObjectChan <- externalDocs
	}

	drCtx.ObjectChan <- s

}

func (s *Schema) GetValue() any {
	return s.Value
}

func (s *Schema) GetSize() (height, width int) {
	h, w := ParseSchemaSize(s.Value)
	if s.Key != "" {
		if len(s.Key) > (HEIGHT - 15) {
			w += (len(s.Key) - (HEIGHT - 15)) * 25
		}
	}
	if s.Name != "" {
		if len(s.Name) > (HEIGHT - 15) {
			w += (len(s.Name) - (HEIGHT - 15)) * 25
		}
	}
	if len(s.AnyOf) <= 0 && len(s.OneOf) <= 0 && len(s.AllOf) <= 0 {
		if s.PolyType != "" {
			h += HEIGHT // parent is poly, add new row for schema to render this.
		}
	}
	return h, w
}

func hasSubSchemas(s *base.Schema) bool {
	return len(s.AllOf) > 0 || len(s.OneOf) > 0 || len(s.AnyOf) > 0 ||
		s.Not != nil || (s.Items != nil && s.Items.IsA()) || len(s.PrefixItems) > 0 ||
		s.Contains != nil || s.If != nil || s.Else != nil || s.Then != nil ||
		(s.DependentSchemas != nil && s.DependentSchemas.Len() > 0) ||
		(s.PatternProperties != nil && s.PatternProperties.Len() > 0) ||
		s.PropertyNames != nil ||
		s.UnevaluatedItems != nil || (s.UnevaluatedProperties != nil && s.UnevaluatedProperties.IsA())
}

func ParseSchemaSize(schema *base.Schema) (height, width int) {
	width = WIDTH
	height = HEIGHT
	if schema.Type != nil {
		strArr := []string{"object", "array"}
		for _, t := range strArr {
			if slices.Contains(schema.Type, t) {
				height += HEIGHT
				break
			}
		}
	} else {
		if hasSubSchemas(schema) {
			height += HEIGHT
		}
	}

	if schema.Title != "" {
		height += HEIGHT
		if len(schema.Title) > (HEIGHT - 10) {
			width += ((len(schema.Title) * 10) - HEIGHT)
		}
	}

	if len(schema.Type) > 1 {
		width += len(schema.Type) * 60
	}

	if schema.Properties != nil && schema.Properties.Len() > 0 {
		height += HEIGHT
	}

	if len(schema.AnyOf) > 0 || len(schema.OneOf) > 0 || len(schema.AllOf) > 0 {
		height += HEIGHT
		if len(schema.AnyOf) > 0 && width < WIDTH+50 {
			width += 50
		}
		if len(schema.OneOf) > 0 && width < WIDTH+100 {
			width += 50
		}
		if len(schema.AllOf) > 0 && width < WIDTH+150 {
			width += 50
		}
	}
	if schema.Extensions != nil && schema.Extensions.Len() > 0 {
		height += HEIGHT
	}

	return height, width
}

func (s *Schema) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, s)
}

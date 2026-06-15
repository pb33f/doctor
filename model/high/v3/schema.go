// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	"slices"
	"sync"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	lowbase "github.com/pb33f/libopenapi/datamodel/low/base"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
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
	// Definition points at the canonical schema for render-cache aliases.
	// It remains exported for compatibility; external callers should treat it
	// as read-only and use the alias-safe *ForRead helpers instead of assigning
	// it directly.
	// Alias child fields are populated lazily via the *ForRead helpers. The
	// canonical schema is treated as immutable after cache publication; alias
	// Hash and Walked values are snapshots from that build phase.
	Definition *Schema
	// Walked remains true for render-cache aliases because their canonical
	// definition has already been walked.
	Walked              bool
	aliasCanonicalPaths bool      // render-cache aliases use definition-site paths when deterministic paths are enabled
	aliasChildrenOnce   sync.Once // ensures concurrent readers build alias children only once
	mu                  sync.RWMutex
	Foundation
}

// isSchemaAlreadyCached checks if a schema is already in the cache
// This helps avoid spawning unnecessary goroutines for already-processed schemas
func isSchemaAlreadyCached(ctx context.Context, schema *base.Schema) bool {
	drCtx := GetDrContext(ctx)
	if !drCtx.UseSchemaCache || schema == nil {
		return false
	}

	// Check if this schema is already cached
	if _, exists := drCtx.SchemaCache.Load(schema.GoLow().RootNode); exists {
		return true
	}
	return false
}

func (s *Schema) Walk(ctx context.Context, schema *base.Schema, depth int) {

	drCtx := GetDrContext(ctx)
	var lowSchema *lowbase.Schema
	if schema != nil {
		lowSchema = schema.GoLow()
	}
	depth++

	// Latch the canonical path early - if DeterministicPaths is enabled and this
	// schema has a canonical path (defined in components.schemas), use it to
	// ensure determinism. This must happen before ANY early return so unwalked
	// schemas (depth bail) still carry definition-site paths.
	if lowSchema != nil && lowSchema.RootNode != nil {
		s.setCanonicalJSONPathFromContext(drCtx, lowSchema.RootNode)
	}

	if depth > 500 {
		// this schema is insane and we're going to bail
		if drCtx.Logger != nil {
			drCtx.Logger.Warn("schema is too deep, over 500 levels! - exiting build, model will be incomplete", "schema", schema)
		}
		return
	}

	sm := drCtx.SchemaCache

	// Use node pointer as cache key for zero-cost deduplication
	var cacheKey *yaml.Node

	if drCtx.UseSchemaCache {
		cacheKey = lowSchema.RootNode

		if cached, ok := sm.Load(cacheKey); ok {
			// Cached walks are routed synchronously before this point, so cache
			// hits only ever see completed schemas.
			if cachedSchema := schemaFromCacheValue(cached); cachedSchema != nil && cachedSchema.isWalked() {
				s.Value = schema
				s.hydrateFromCache(cachedSchema, drCtx)
				s.setWalked()

				// Preserve NodeParent before BuildNodesAndEdges to prevent corruption
				// when s.Name is empty (which triggers NodeParent reassignment in foundation.go)
				originalNodeParent := s.NodeParent
				s.BuildNodesAndEdges(ctx, s.Name, "schema", schema, s)
				// Restore original NodeParent after potential corruption
				s.NodeParent = originalNodeParent
				drCtx.ObjectChan <- s
				s.publishHydratedChildren(drCtx)
				return
			}
		}
	}

	s.mu.Lock()
	s.Value = schema
	s.mu.Unlock()

	process := true

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
			s.mu.Lock()
			s.Name = "schema"
			s.mu.Unlock()
		}
		if process {
			s.ProcessNodesAndEdges(ctx, s.Name, "schema", schema, s, false, 0, &negone, true)
		}
	}

	if schema.AllOf != nil {
		block := make([]SchemaProxy, len(schema.AllOf))
		allOf := make([]*SchemaProxy, 0, len(schema.AllOf))
		for i, allOfItem := range schema.AllOf {
			aOfItem := allOfItem
			sch := &block[i]
			sch.KeyNode = lowSchema.AllOf.KeyNode
			sch.ValueNode = lowSchema.AllOf.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = &i
			sch.SetPathSegment("allOf")
			sch.PolyType = sch.PathSegment
			sch.NodeParent = s
			sch.Value = aOfItem
			allOf = append(allOf, sch)
			sch.Walk(ctx, aOfItem, depth)

		}
		s.mu.Lock()
		s.AllOf = allOf
		s.mu.Unlock()
	}

	if schema.OneOf != nil {
		block := make([]SchemaProxy, len(schema.OneOf))
		oneOf := make([]*SchemaProxy, 0, len(schema.OneOf))
		for i, oneOfItem := range schema.OneOf {
			oOfItem := oneOfItem
			sch := &block[i]
			sch.KeyNode = lowSchema.OneOf.KeyNode
			sch.ValueNode = lowSchema.OneOf.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = &i
			sch.SetPathSegment("oneOf")
			sch.PolyType = sch.PathSegment
			sch.NodeParent = s
			sch.Value = oOfItem
			oneOf = append(oneOf, sch)
			sch.Walk(ctx, oOfItem, depth)
		}
		s.mu.Lock()
		s.OneOf = oneOf
		s.mu.Unlock()
	}

	if schema.AnyOf != nil {
		block := make([]SchemaProxy, len(schema.AnyOf))
		anyOf := make([]*SchemaProxy, 0, len(schema.AnyOf))
		for i, anyOfItem := range schema.AnyOf {
			aOfItem := anyOfItem
			sch := &block[i]
			sch.KeyNode = lowSchema.AnyOf.KeyNode
			sch.ValueNode = lowSchema.AnyOf.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = &i
			sch.SetPathSegment("anyOf")
			sch.PolyType = sch.PathSegment
			sch.NodeParent = s
			sch.Value = aOfItem
			anyOf = append(anyOf, sch)
			sch.Walk(ctx, aOfItem, depth)
		}
		s.mu.Lock()
		s.AnyOf = anyOf
		s.mu.Unlock()
	}

	if schema.PrefixItems != nil {
		block := make([]SchemaProxy, len(schema.PrefixItems))
		prefixItems := make([]*SchemaProxy, 0, len(schema.PrefixItems))
		for i, prefixItem := range schema.PrefixItems {
			pItem := prefixItem
			sch := &block[i]
			sch.KeyNode = lowSchema.PrefixItems.KeyNode
			sch.ValueNode = lowSchema.PrefixItems.ValueNode
			sch.Parent = s
			sch.IsIndexed = true
			sch.Index = &i
			sch.NodeParent = s
			sch.SetPathSegment("prefixItems")
			sch.Value = pItem
			prefixItems = append(prefixItems, sch)
			sch.Walk(ctx, pItem, depth)
		}
		s.PrefixItems = prefixItems
	}

	if schema.Discriminator != nil {
		d := &Discriminator{}
		d.KeyNode = lowSchema.Discriminator.KeyNode
		d.ValueNode = lowSchema.Discriminator.ValueNode
		d.Parent = s
		d.SetPathSegment("discriminator")
		d.Value = schema.Discriminator
		d.NodeParent = s
		d.BuildNodesAndEdges(ctx, titleString(d.PathSegment), d.PathSegment, schema.Discriminator, d)
		s.Discriminator = d
		drCtx.ObjectChan <- d
	}

	if schema.Contains != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = lowSchema.Contains.KeyNode
		sch.ValueNode = lowSchema.Contains.ValueNode
		sch.Parent = s
		sch.SetPathSegment("contains")
		sch.NodeParent = s
		sch.Walk(ctx, schema.Contains, depth)
		s.Contains = sch
	}

	if schema.If != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = lowSchema.If.KeyNode
		sch.ValueNode = lowSchema.If.ValueNode
		sch.Parent = s
		sch.SetPathSegment("if")
		sch.NodeParent = s
		sch.Walk(ctx, schema.If, depth)
		s.If = sch
	}

	if schema.Else != nil {
		sch := &SchemaProxy{}
		sch.KeyNode = lowSchema.Else.KeyNode
		sch.ValueNode = lowSchema.Else.ValueNode
		sch.Parent = s
		sch.SetPathSegment("else")
		sch.NodeParent = s
		sch.Walk(ctx, schema.Else, depth)
		s.Else = sch
	}

	if schema.Then != nil {
		sch := &SchemaProxy{}
		sch.Parent = s
		sch.KeyNode = lowSchema.Then.KeyNode
		sch.ValueNode = lowSchema.Then.ValueNode
		sch.SetPathSegment("then")
		sch.NodeParent = s
		sch.Walk(ctx, schema.Then, depth)
		s.Then = sch
	}

	if schema.DependentSchemas != nil {
		dependentSchemas := orderedmap.New[string, *SchemaProxy]()
		lowDependent := newLowNodeFinder(lowSchema.DependentSchemas.Value)
		block := make([]SchemaProxy, schema.DependentSchemas.Len())
		di := 0
		for dependentSchemasPairs := schema.DependentSchemas.First(); dependentSchemasPairs != nil; dependentSchemasPairs = dependentSchemasPairs.Next() {
			sch := &block[di]
			di++
			sch.Parent = s
			sch.SetPathSegment("dependentSchemas")
			sch.Key = dependentSchemasPairs.Key()
			if keyNode, valueNode, ok := lowDependent.find(sch.Key); ok {
				sch.KeyNode = keyNode
				sch.ValueNode = valueNode
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
			sch.Walk(ctx, v, depth)
		}
		s.DependentSchemas = dependentSchemas
	}

	if schema.PatternProperties != nil {
		patternProperties := orderedmap.New[string, *SchemaProxy]()
		lowPattern := newLowNodeFinder(lowSchema.PatternProperties.Value)
		block := make([]SchemaProxy, schema.PatternProperties.Len())
		ppi := 0
		for patternPropertiesPairs := schema.PatternProperties.First(); patternPropertiesPairs != nil; patternPropertiesPairs = patternPropertiesPairs.Next() {
			sch := &block[ppi]
			ppi++
			sch.Parent = s
			sch.SetPathSegment("patternProperties")
			sch.Key = patternPropertiesPairs.Key()
			sch.NodeParent = s
			if keyNode, valueNode, ok := lowPattern.find(sch.Key); ok {
				sch.KeyNode = keyNode
				sch.ValueNode = valueNode
			}
			patternProperties.Set(patternPropertiesPairs.Key(), sch)
			sch.Walk(ctx, patternPropertiesPairs.Value(), depth)
		}
		s.PatternProperties = patternProperties
	}

	if schema.PropertyNames != nil {
		sch := &SchemaProxy{}
		sch.ValueNode = lowSchema.PropertyNames.ValueNode
		sch.KeyNode = lowSchema.PropertyNames.KeyNode
		sch.Parent = s
		sch.SetPathSegment("propertyNames")
		sch.Value = schema.PropertyNames
		sch.NodeParent = s
		s.PropertyNames = sch
		sch.Walk(ctx, s.PropertyNames.Value, depth)
	}

	if schema.UnevaluatedItems != nil {
		sch := &SchemaProxy{}
		sch.ValueNode = lowSchema.UnevaluatedItems.ValueNode
		sch.KeyNode = lowSchema.UnevaluatedItems.KeyNode
		sch.Parent = s
		sch.SetPathSegment("unevaluatedItems")
		sch.Value = schema.UnevaluatedItems
		sch.NodeParent = s
		s.UnevaluatedItems = sch
		sch.Walk(ctx, s.UnevaluatedItems.Value, depth)
	}

	if schema.UnevaluatedProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.SetPathSegment("unevaluatedProperties")
		dynamicValue.Parent = s
		dynamicValue.Value = schema.UnevaluatedProperties
		dynamicValue.ValueNode = lowSchema.UnevaluatedProperties.ValueNode
		dynamicValue.KeyNode = lowSchema.UnevaluatedProperties.KeyNode
		if schema.UnevaluatedProperties.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = s
			sch.Value = schema.UnevaluatedProperties.A
			sch.NodeParent = s
			sch.ValueNode = lowSchema.UnevaluatedProperties.ValueNode
			sch.KeyNode = lowSchema.UnevaluatedProperties.KeyNode
			v := schema.UnevaluatedProperties.A
			sch.Walk(ctx, v, depth)
		} else {
			dynamicValue.B = schema.UnevaluatedProperties.B
		}
		s.UnevaluatedProperties = dynamicValue
	}

	if schema.Items != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.SetPathSegment("items")
		dynamicValue.Parent = s
		dynamicValue.Value = schema.Items
		dynamicValue.ValueNode = lowSchema.Items.ValueNode
		dynamicValue.KeyNode = lowSchema.Items.KeyNode
		dynamicValue.Node = s.Node
		if schema.Items.IsA() {

			sch := &SchemaProxy{}
			sch.Parent = dynamicValue
			sch.Value = schema.Items.A
			sch.NodeParent = s
			sch.ValueNode = lowSchema.Items.ValueNode
			sch.KeyNode = lowSchema.Items.KeyNode
			sch.Node = s.Node
			dynamicValue.A = sch
			dynamicValue.Node = s.Node
			v := schema.Items.A
			sch.Walk(ctx, v, depth)
		} else {
			dynamicValue.B = schema.Items.B
		}
		s.Items = dynamicValue
	}

	if schema.Not != nil {
		sch := &SchemaProxy{}
		sch.ValueNode = lowSchema.Not.ValueNode
		sch.KeyNode = lowSchema.Not.KeyNode
		sch.Parent = s
		sch.SetPathSegment("not")
		sch.Value = schema.Not
		sch.NodeParent = s
		s.Not = sch
		v := schema.Not
		sch.Walk(ctx, v, depth)
	}

	if schema.Properties != nil {
		properties := orderedmap.New[string, *SchemaProxy]()
		lowProps := newLowNodeFinder(lowSchema.Properties.Value)
		block := make([]SchemaProxy, schema.Properties.Len())
		pi := 0
		for propertiesPairs := schema.Properties.First(); propertiesPairs != nil; propertiesPairs = propertiesPairs.Next() {
			sch := &block[pi]
			pi++
			sch.Parent = s
			sch.SetPathSegment("properties")
			v := propertiesPairs.Value()
			sch.Key = propertiesPairs.Key()
			sch.Value = v
			properties.Set(propertiesPairs.Key(), sch)
			if keyNode, valueNode, ok := lowProps.find(sch.Key); ok {
				sch.ValueNode = valueNode
				sch.KeyNode = keyNode
			}
			if v.IsReference() || v.Schema() != nil {
				sch.NodeParent = s
			}
			sch.Walk(ctx, v, depth)
		}
		s.Properties = properties
	}

	if schema.AdditionalProperties != nil {
		dynamicValue := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{}
		dynamicValue.SetPathSegment("additionalProperties")
		dynamicValue.Parent = s
		dynamicValue.Value = schema.AdditionalProperties
		dynamicValue.KeyNode = lowSchema.AdditionalProperties.KeyNode
		dynamicValue.ValueNode = lowSchema.AdditionalProperties.ValueNode
		if schema.AdditionalProperties.IsA() {
			sch := &SchemaProxy{}
			sch.Parent = dynamicValue
			sch.NodeParent = s
			sch.Value = schema.AdditionalProperties.A
			sch.KeyNode = schema.AdditionalProperties.A.GoLow().GetKeyNode()
			sch.ValueNode = schema.AdditionalProperties.A.GoLow().GetValueNode()
			dynamicValue.A = sch
			dynamicValue.Walk(ctx)
		} else {
			dynamicValue.B = schema.AdditionalProperties.B
		}
		s.AdditionalProperties = dynamicValue
	}

	if schema.XML != nil {
		xml := &XML{}
		xml.ValueNode = lowSchema.XML.ValueNode
		xml.KeyNode = lowSchema.XML.KeyNode
		xml.Parent = s
		xml.SetPathSegment("xml")
		xml.Value = schema.XML
		xml.NodeParent = s
		xml.BuildNodesAndEdges(ctx, "xml", "xml", schema.XML, xml) // Pass xml (*v3.XML), not schema.XML (*base.XML)
		s.XML = xml
		drCtx.ObjectChan <- xml
	}

	if schema.ExternalDocs != nil {
		externalDocs := &ExternalDoc{}
		externalDocs.ValueNode = lowSchema.ExternalDocs.ValueNode
		externalDocs.KeyNode = lowSchema.ExternalDocs.KeyNode
		externalDocs.Parent = s
		externalDocs.SetPathSegment("externalDocs")
		externalDocs.Value = schema.ExternalDocs
		externalDocs.NodeParent = s
		s.ExternalDocs = externalDocs
		drCtx.ObjectChan <- externalDocs
	}

	// Store schema in cache AFTER all properties are populated
	// This prevents race condition where cache hit returns incomplete schema
	s.setWalked()
	if drCtx.UseSchemaCache && cacheKey != nil {
		sm.LoadOrStore(cacheKey, s)
	}
	drCtx.ObjectChan <- s
}

func (s *Schema) GetValue() any {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Value
}

func (s *Schema) GetSize() (height, width int) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	h, w := ParseSchemaSize(s.Value)

	// Calculate required width based on longest name (use max, don't add both)
	maxNameLen := len(s.Key)
	if len(s.Name) > maxNameLen {
		maxNameLen = len(s.Name)
	}

	// Header needs: icon(30) + name + badge(60) + button(35) + padding(35) = 160 + name
	if maxNameLen > 0 {
		requiredWidth := 160 + (maxNameLen * CHAR_WIDTH)
		if requiredWidth > w {
			w = requiredWidth
		}
	}

	// Cap maximum width to prevent excessively wide boxes
	if w > MAX_WIDTH {
		w = MAX_WIDTH
	}

	if len(s.AnyOf) <= 0 && len(s.OneOf) <= 0 && len(s.AllOf) <= 0 {
		if s.PolyType != "" {
			h += HEIGHT // parent is poly, add new row for schema to render this.
		}
	}
	for _, change := range s.Changes {
		if len(change.GetPropertyChanges()) > 0 || len(change.GetAllChanges()) > 0 {
			height += HEIGHT
			break
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
	if schema.Type == nil {
		if hasSubSchemas(schema) {
			height += HEIGHT
		}
	}

	if schema.Title != "" {
		height += HEIGHT
		// Title row: chevron(20) + title text + padding(30) = 50 + title
		// But ensure minimum base matches header pattern for consistency
		titleWidth := 80 + (len(schema.Title) * CHAR_WIDTH)
		if titleWidth > width {
			width = titleWidth
		}
	}

	if len(schema.Type) > 1 {
		// Multiple types need extra space for badges
		width += len(schema.Type) * 40
	}

	if schema.Properties != nil && schema.Properties.Len() > 0 {
		height += HEIGHT
	}

	if len(schema.AnyOf) > 0 || len(schema.OneOf) > 0 || len(schema.AllOf) > 0 {
		height += HEIGHT
		// Add modest width for polymorphic indicators
		polyWidth := 0
		if len(schema.AnyOf) > 0 {
			polyWidth += 40
		}
		if len(schema.OneOf) > 0 {
			polyWidth += 40
		}
		if len(schema.AllOf) > 0 {
			polyWidth += 40
		}
		if width < WIDTH+polyWidth {
			width = WIDTH + polyWidth
		}
	}
	// Check if schema itself has examples
	schemaHasExamples := len(schema.Examples) > 0 || schema.Example != nil

	// Check if all properties have examples (or don't need them)
	allPropertiesHaveExamples := false
	if schema.Properties != nil && schema.Properties.Len() > 0 {
		allPropertiesHaveExamples = true
		for prop := schema.Properties.First(); prop != nil; prop = prop.Next() {
			propSchema := prop.Value().Schema()
			if propSchema == nil {
				allPropertiesHaveExamples = false
				break
			}
			// Properties with enums, booleans, or defaults don't need examples
			hasEnum := len(propSchema.Enum) > 0
			isBoolean := len(propSchema.Type) == 1 && propSchema.Type[0] == "boolean"
			hasDefault := propSchema.Default != nil
			if hasEnum || isBoolean || hasDefault {
				continue
			}
			if propSchema.Example == nil && len(propSchema.Examples) == 0 {
				allPropertiesHaveExamples = false
				break
			}
		}
	}

	// Check if all polymorphic children have examples (or don't need them).
	// Iterate the three slices in place: appending them together can write
	// into the backing array of the shared libopenapi schema slices.
	allPolyChildrenHaveExamples := false
	polyChildCount := len(schema.AllOf) + len(schema.AnyOf) + len(schema.OneOf)
	if polyChildCount > 0 {
		allPolyChildrenHaveExamples = true
	polyScan:
		for _, polyChildren := range [][]*base.SchemaProxy{schema.AllOf, schema.AnyOf, schema.OneOf} {
			for _, child := range polyChildren {
				childSchema := child.Schema()
				if childSchema == nil {
					allPolyChildrenHaveExamples = false
					break polyScan
				}
				// Children with enums, booleans, or defaults don't need examples
				hasEnum := len(childSchema.Enum) > 0
				isBoolean := len(childSchema.Type) == 1 && childSchema.Type[0] == "boolean"
				hasDefault := childSchema.Default != nil
				if hasEnum || isBoolean || hasDefault {
					continue
				}
				if childSchema.Example == nil && len(childSchema.Examples) == 0 {
					allPolyChildrenHaveExamples = false
					break polyScan
				}
			}
		}
	}

	// reserve one examples status row when direct examples render, or when missing coverage renders "No Examples".
	if schemaHasExamples || (!allPropertiesHaveExamples && !allPolyChildrenHaveExamples) {
		height += HEIGHT
	}

	if schema.Extensions != nil && schema.Extensions.Len() > 0 {
		height += HEIGHT
	}
	return height, width
}

func (s *Schema) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, s)
}

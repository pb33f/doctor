// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	wk8orderedmap "github.com/pb33f/ordered-map/v2"
)

// hydrateFromCache copies the completed child tree for a cache-hit occurrence.
// The cached tree is treated as immutable; every occurrence gets fresh
// Foundation values so JSONPath generation follows the current parent chain.
func (s *Schema) hydrateFromCache(cached *Schema, drCtx *DrContext) {
	if cached == nil {
		return
	}

	s.Hash = cached.Hash
	s.AllOf = cloneSchemaProxySlice(cached.AllOf, s, s, drCtx)
	s.OneOf = cloneSchemaProxySlice(cached.OneOf, s, s, drCtx)
	s.AnyOf = cloneSchemaProxySlice(cached.AnyOf, s, s, drCtx)
	s.PrefixItems = cloneSchemaProxySlice(cached.PrefixItems, s, s, drCtx)
	s.Discriminator = cloneDiscriminator(cached.Discriminator, s)
	s.Contains = cloneSchemaProxy(cached.Contains, s, s, drCtx)
	s.If = cloneSchemaProxy(cached.If, s, s, drCtx)
	s.Else = cloneSchemaProxy(cached.Else, s, s, drCtx)
	s.Then = cloneSchemaProxy(cached.Then, s, s, drCtx)
	s.DependentSchemas = cloneSchemaProxyMap(cached.DependentSchemas, s, s, drCtx)
	s.PatternProperties = cloneSchemaProxyMap(cached.PatternProperties, s, s, drCtx)
	s.PropertyNames = cloneSchemaProxy(cached.PropertyNames, s, s, drCtx)
	s.UnevaluatedItems = cloneSchemaProxy(cached.UnevaluatedItems, s, s, drCtx)
	s.UnevaluatedProperties = cloneDynamicSchemaProxy(cached.UnevaluatedProperties, s, drCtx)
	s.Items = cloneDynamicSchemaProxy(cached.Items, s, drCtx)
	s.Not = cloneSchemaProxy(cached.Not, s, s, drCtx)
	s.Properties = cloneSchemaProxyMap(cached.Properties, s, s, drCtx)
	s.AdditionalProperties = cloneDynamicSchemaProxy(cached.AdditionalProperties, s, drCtx)
	s.XML = cloneXML(cached.XML, s)
	s.ExternalDocs = cloneExternalDoc(cached.ExternalDocs, s)
}

func cloneSchema(cached *Schema, parent any, nodeParent any, drCtx *DrContext) *Schema {
	if cached == nil {
		return nil
	}

	clone := &Schema{
		Name:   cached.Name,
		Value:  cached.Value,
		Walked: cached.isWalked(),
	}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, nodeParent)
	clone.applyCanonicalCachePath(cached, drCtx)
	clone.hydrateFromCache(cached, drCtx)
	return clone
}

func (s *Schema) applyCanonicalCachePath(cached *Schema, drCtx *DrContext) {
	if s == nil || cached == nil || cached.Value == nil ||
		drCtx == nil || !drCtx.DeterministicPaths || drCtx.CanonicalPathCache == nil {
		return
	}
	lowSchema := cached.Value.GoLow()
	if lowSchema == nil || lowSchema.RootNode == nil {
		return
	}
	if canonicalPath, ok := drCtx.CanonicalPathCache.Load(lowSchema.RootNode); ok {
		s.JSONPath = canonicalPath.(string)
		s.JSONPathOnce.Do(func() {})
	}
}

func cloneSchemaProxy(cached *SchemaProxy, parent any, nodeParent any, drCtx *DrContext) *SchemaProxy {
	if cached == nil {
		return nil
	}

	clone := &SchemaProxy{
		Value: cached.Value,
	}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, nodeParent)
	clone.Schema = cloneSchema(cached.Schema, clone, clone.NodeParent, drCtx)
	return clone
}

func cloneSchemaProxySlice(cached []*SchemaProxy, parent any, nodeParent any, drCtx *DrContext) []*SchemaProxy {
	if len(cached) == 0 {
		return nil
	}

	cloned := make([]*SchemaProxy, len(cached))
	for i, item := range cached {
		cloned[i] = cloneSchemaProxy(item, parent, nodeParent, drCtx)
	}
	return cloned
}

func cloneSchemaProxyMap(cached *orderedmap.Map[string, *SchemaProxy], parent any, nodeParent any, drCtx *DrContext) *orderedmap.Map[string, *SchemaProxy] {
	if cached == nil {
		return nil
	}

	cloned := newSchemaProxyMap(cached.Len())
	for pair := cached.First(); pair != nil; pair = pair.Next() {
		cloned.Set(pair.Key(), cloneSchemaProxy(pair.Value(), parent, nodeParent, drCtx))
	}
	return cloned
}

func newSchemaProxyMap(capacity int) *orderedmap.Map[string, *SchemaProxy] {
	return &orderedmap.Map[string, *SchemaProxy]{
		OrderedMap: wk8orderedmap.New[string, *SchemaProxy](capacity),
	}
}

func cloneDynamicSchemaProxy(
	cached *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool],
	parent any,
	drCtx *DrContext,
) *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool] {
	if cached == nil {
		return nil
	}

	clone := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{
		Value: cached.Value,
		B:     cached.B,
	}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	clone.A = cloneSchemaProxy(cached.A, clone, parent, drCtx)
	return clone
}

func cloneDiscriminator(cached *Discriminator, parent any) *Discriminator {
	if cached == nil {
		return nil
	}

	clone := &Discriminator{Value: cached.Value}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	return clone
}

func cloneXML(cached *XML, parent any) *XML {
	if cached == nil {
		return nil
	}

	clone := &XML{Value: cached.Value}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	return clone
}

func cloneExternalDoc(cached *ExternalDoc, parent any) *ExternalDoc {
	if cached == nil {
		return nil
	}

	clone := &ExternalDoc{Value: cached.Value}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	return clone
}

func cloneFoundation(cached *Foundation, parent any, nodeParent any) Foundation {
	var index *int
	if cached != nil && cached.Index != nil {
		i := *cached.Index
		index = &i
	}

	if cached == nil {
		return Foundation{Parent: parent, NodeParent: nodeParent}
	}

	return Foundation{
		PathSegment:  cached.PathSegment,
		InstanceType: cached.InstanceType,
		IsIndexed:    cached.IsIndexed,
		Index:        index,
		Key:          cached.Key,
		PolyType:     cached.PolyType,
		Parent:       parent,
		NodeParent:   nodeParent,
		RuleResults:  cached.RuleResults,
		KeyNode:      cached.KeyNode,
		ValueNode:    cached.ValueNode,
		Changes:      cached.Changes,
		CacheSplit:   cached.CacheSplit,
	}
}

func (s *Schema) readyForCacheClone() bool {
	if s == nil {
		return false
	}
	if s.isCacheCloneReady() {
		return true
	}
	return schemaReadyForCacheClone(s, make(map[*Schema]struct{}))
}

func (s *Schema) isWalked() bool {
	if s == nil {
		return false
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Walked
}

func (s *Schema) setWalked() {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Walked = true
}

func (s *Schema) isCacheCloneReady() bool {
	if s == nil {
		return false
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.CacheCloneReady
}

func (s *Schema) setCacheCloneReady() {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.CacheCloneReady = true
}

func (s *Schema) isComponentSchemaOccurrence() bool {
	if s == nil {
		return false
	}
	parent, ok := s.Parent.(*SchemaProxy)
	return ok && parent.GetPathSegment() == "schemas"
}

func schemaReadyForCacheClone(schema *Schema, visited map[*Schema]struct{}) bool {
	if schema == nil {
		return true
	}
	if schema.isCacheCloneReady() {
		return true
	}
	if !schema.isWalked() {
		return false
	}
	if _, ok := visited[schema]; ok {
		return true
	}
	visited[schema] = struct{}{}

	if !schemaProxySliceReady(schema.AllOf, visited) ||
		!schemaProxySliceReady(schema.OneOf, visited) ||
		!schemaProxySliceReady(schema.AnyOf, visited) ||
		!schemaProxySliceReady(schema.PrefixItems, visited) ||
		!schemaProxyReady(schema.Contains, visited) ||
		!schemaProxyReady(schema.If, visited) ||
		!schemaProxyReady(schema.Else, visited) ||
		!schemaProxyReady(schema.Then, visited) ||
		!schemaProxyMapReady(schema.DependentSchemas, visited) ||
		!schemaProxyMapReady(schema.PatternProperties, visited) ||
		!schemaProxyReady(schema.PropertyNames, visited) ||
		!schemaProxyReady(schema.UnevaluatedItems, visited) ||
		!dynamicSchemaProxyReady(schema.UnevaluatedProperties, visited) ||
		!dynamicSchemaProxyReady(schema.Items, visited) ||
		!schemaProxyReady(schema.Not, visited) ||
		!schemaProxyMapReady(schema.Properties, visited) ||
		!dynamicSchemaProxyReady(schema.AdditionalProperties, visited) {
		return false
	}
	schema.setCacheCloneReady()
	return true
}

func schemaProxySliceReady(items []*SchemaProxy, visited map[*Schema]struct{}) bool {
	for _, item := range items {
		if !schemaProxyReady(item, visited) {
			return false
		}
	}
	return true
}

func schemaProxyMapReady(items *orderedmap.Map[string, *SchemaProxy], visited map[*Schema]struct{}) bool {
	if items == nil {
		return true
	}
	for pair := items.First(); pair != nil; pair = pair.Next() {
		if !schemaProxyReady(pair.Value(), visited) {
			return false
		}
	}
	return true
}

func dynamicSchemaProxyReady(
	item *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool],
	visited map[*Schema]struct{},
) bool {
	if item == nil {
		return true
	}
	return schemaProxyReady(item.A, visited)
}

func schemaProxyReady(item *SchemaProxy, visited map[*Schema]struct{}) bool {
	if item == nil {
		return true
	}
	if item.Schema != nil {
		return schemaReadyForCacheClone(item.Schema, visited)
	}
	if item.Value == nil {
		return true
	}
	return item.Value.Schema() == nil
}

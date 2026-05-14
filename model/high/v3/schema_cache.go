// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"sync"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/orderedmap"
	wk8orderedmap "github.com/pb33f/ordered-map/v2"
)

func canonicalPathCacheFromContext(drCtx *DrContext) *sync.Map {
	if drCtx == nil || !drCtx.DeterministicPaths || drCtx.CanonicalPathCache == nil {
		return nil
	}
	return drCtx.CanonicalPathCache
}

type schemaCacheMode int

const (
	schemaCacheModeMaterialized schemaCacheMode = iota
	schemaCacheModeAlias
)

type schemaCacheCopyOptions struct {
	mode               schemaCacheMode
	drCtx              *DrContext
	canonicalPathCache *sync.Map
	aliasCanonicalPath bool
}

func materializedSchemaCacheCopyOptions(drCtx *DrContext) schemaCacheCopyOptions {
	return schemaCacheCopyOptions{
		mode:               schemaCacheModeMaterialized,
		drCtx:              drCtx,
		canonicalPathCache: canonicalPathCacheFromContext(drCtx),
	}
}

func aliasSchemaCacheCopyOptions(canonicalPaths bool) schemaCacheCopyOptions {
	return schemaCacheCopyOptions{
		mode:               schemaCacheModeAlias,
		aliasCanonicalPath: canonicalPaths,
	}
}

// hydrateFromCache prepares a schema cache-hit occurrence.
//
// Render/graph builds do not need a full duplicate schema tree for every
// repeated reference; they need occurrence-local identity on the cache-hit
// schema itself. Keeping a pointer to the canonical definition avoids
// recursively cloning large schema subtrees for every occurrence.
//
// Non-render model walks retain the historical fully materialized occurrence
// tree so direct field traversal keeps usage-site paths.
func (s *Schema) hydrateFromCache(cached *Schema, drCtx *DrContext) {
	if cached == nil {
		return
	}
	if drCtx != nil && drCtx.RenderChanges {
		s.hydrateAliasFromCache(cached, drCtx)
		return
	}

	s.hydrateMaterializedFromCache(cached, drCtx)
}

func (s *Schema) hydrateAliasFromCache(cached *Schema, drCtx *DrContext) {
	source := canonicalSchemaSource(cached)
	if source == nil {
		return
	}
	canonicalPathCache := canonicalPathCacheFromContext(drCtx)
	applyCanonicalCachePaths(source, canonicalPathCache, nil)
	canonicalAliasPaths := canonicalPathCache != nil
	s.mu.Lock()
	s.Hash = source.Hash
	s.aliasCanonicalPaths = canonicalAliasPaths
	s.setDefinitionSourceLocked(source)
	s.mu.Unlock()
	s.applyAliasCachePath(source, drCtx, canonicalAliasPaths)
}

func (s *Schema) IsAlias() bool {
	if s == nil {
		return false
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Definition != nil
}

func (s *Schema) DefinitionSource() (*Schema, bool) {
	if s == nil {
		return nil, false
	}
	first := schemaDefinition(s)
	if first == nil {
		return s, true
	}
	slow := s
	fast := s
	for {
		fast = schemaDefinition(fast)
		if fast == nil {
			break
		}
		fast = schemaDefinition(fast)
		if fast == nil {
			break
		}
		slow = schemaDefinition(slow)
		if slow == nil {
			break
		}
		if slow == fast {
			return nil, false
		}
	}

	source := s
	for {
		next := schemaDefinition(source)
		if next == nil {
			if source != first {
				s.mu.Lock()
				if s.Definition != nil {
					s.Definition = source
				}
				s.mu.Unlock()
			}
			return source, true
		}
		source = next
	}
}

func schemaDefinition(schema *Schema) *Schema {
	if schema == nil {
		return nil
	}
	schema.mu.RLock()
	defer schema.mu.RUnlock()
	return schema.Definition
}

func canonicalSchemaSource(schema *Schema) *Schema {
	if schema == nil {
		return nil
	}
	source, ok := schema.DefinitionSource()
	if !ok || source == nil {
		return schema
	}
	return source
}

func EnsureSchemaChildrenForRead(schema *Schema) {
	if schema != nil {
		schema.EnsureChildrenForRead()
	}
}

func SchemaFromProxyForRead(proxy *SchemaProxy) *Schema {
	if proxy == nil {
		return nil
	}
	return proxy.SchemaForRead()
}

func (sp *SchemaProxy) SchemaForRead() *Schema {
	if sp == nil || sp.Schema == nil {
		return nil
	}
	sp.Schema.EnsureChildrenForRead()
	return sp.Schema
}

func (s *Schema) setDefinitionSourceLocked(schema *Schema) bool {
	source := canonicalSchemaSource(schema)
	if source == nil {
		return false
	}
	s.Definition = source
	return true
}

func (s *Schema) EnsureChildrenForRead() {
	if s == nil {
		return
	}
	s.ensureAliasChildren()
}

func (s *Schema) PropertiesForRead() *orderedmap.Map[string, *SchemaProxy] {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.Properties
}

func (s *Schema) AllOfForRead() []*SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.AllOf
}

func (s *Schema) PrefixItemsForRead() []*SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.PrefixItems
}

func (s *Schema) OneOfForRead() []*SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.OneOf
}

func (s *Schema) AnyOfForRead() []*SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.AnyOf
}

func (s *Schema) ItemsForRead() *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool] {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.Items
}

func (s *Schema) AdditionalPropertiesForRead() *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool] {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.AdditionalProperties
}

func (s *Schema) UnevaluatedPropertiesForRead() *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool] {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.UnevaluatedProperties
}

func (s *Schema) NotForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.Not
}

func (s *Schema) ContainsForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.Contains
}

func (s *Schema) IfForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.If
}

func (s *Schema) ElseForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.Else
}

func (s *Schema) ThenForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.Then
}

func (s *Schema) PropertyNamesForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.PropertyNames
}

func (s *Schema) UnevaluatedItemsForRead() *SchemaProxy {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.UnevaluatedItems
}

func (s *Schema) DependentSchemasForRead() *orderedmap.Map[string, *SchemaProxy] {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.DependentSchemas
}

func (s *Schema) PatternPropertiesForRead() *orderedmap.Map[string, *SchemaProxy] {
	s.ensureAliasChildren()
	if s == nil {
		return nil
	}
	return s.PatternProperties
}

func (s *Schema) ensureAliasChildren() {
	if s == nil {
		return
	}
	s.aliasChildrenOnce.Do(s.buildAliasChildren)
}

func (s *Schema) buildAliasChildren() {
	definition := s.Definition
	canonicalAliasPaths := s.aliasCanonicalPaths
	if definition == nil {
		return
	}

	cached := definition
	var flattenedDefinition *Schema
	if schemaDefinition(definition) != nil {
		source := canonicalSchemaSource(definition)
		if source == nil {
			return
		}
		cached = source
		flattenedDefinition = source
	}

	options := aliasSchemaCacheCopyOptions(canonicalAliasPaths)
	allOf := schemaProxySliceFromCache(cached.AllOf, s, s, options)
	oneOf := schemaProxySliceFromCache(cached.OneOf, s, s, options)
	anyOf := schemaProxySliceFromCache(cached.AnyOf, s, s, options)
	prefixItems := schemaProxySliceFromCache(cached.PrefixItems, s, s, options)
	discriminator := copyDiscriminator(cached.Discriminator, s)
	contains := schemaProxyFromCache(cached.Contains, s, s, options)
	ifSchema := schemaProxyFromCache(cached.If, s, s, options)
	elseSchema := schemaProxyFromCache(cached.Else, s, s, options)
	thenSchema := schemaProxyFromCache(cached.Then, s, s, options)
	dependentSchemas := schemaProxyMapFromCache(cached.DependentSchemas, s, s, options)
	patternProperties := schemaProxyMapFromCache(cached.PatternProperties, s, s, options)
	propertyNames := schemaProxyFromCache(cached.PropertyNames, s, s, options)
	unevaluatedItems := schemaProxyFromCache(cached.UnevaluatedItems, s, s, options)
	unevaluatedProperties := dynamicSchemaProxyFromCache(cached.UnevaluatedProperties, s, options)
	items := dynamicSchemaProxyFromCache(cached.Items, s, options)
	notSchema := schemaProxyFromCache(cached.Not, s, s, options)
	properties := schemaProxyMapFromCache(cached.Properties, s, s, options)
	additionalProperties := dynamicSchemaProxyFromCache(cached.AdditionalProperties, s, options)
	xml := copyXML(cached.XML, s)
	externalDocs := copyExternalDoc(cached.ExternalDocs, s)

	s.mu.Lock()
	defer s.mu.Unlock()
	if flattenedDefinition != nil {
		s.Definition = flattenedDefinition
	}
	s.AllOf = allOf
	s.OneOf = oneOf
	s.AnyOf = anyOf
	s.PrefixItems = prefixItems
	s.Discriminator = discriminator
	s.Contains = contains
	s.If = ifSchema
	s.Else = elseSchema
	s.Then = thenSchema
	s.DependentSchemas = dependentSchemas
	s.PatternProperties = patternProperties
	s.PropertyNames = propertyNames
	s.UnevaluatedItems = unevaluatedItems
	s.UnevaluatedProperties = unevaluatedProperties
	s.Items = items
	s.Not = notSchema
	s.Properties = properties
	s.AdditionalProperties = additionalProperties
	s.XML = xml
	s.ExternalDocs = externalDocs
}

func (s *Schema) hydrateMaterializedFromCache(cached *Schema, drCtx *DrContext) {
	options := materializedSchemaCacheCopyOptions(drCtx)
	s.Hash = cached.Hash
	s.AllOf = schemaProxySliceFromCache(cached.AllOf, s, s, options)
	s.OneOf = schemaProxySliceFromCache(cached.OneOf, s, s, options)
	s.AnyOf = schemaProxySliceFromCache(cached.AnyOf, s, s, options)
	s.PrefixItems = schemaProxySliceFromCache(cached.PrefixItems, s, s, options)
	s.Discriminator = copyDiscriminator(cached.Discriminator, s)
	s.Contains = schemaProxyFromCache(cached.Contains, s, s, options)
	s.If = schemaProxyFromCache(cached.If, s, s, options)
	s.Else = schemaProxyFromCache(cached.Else, s, s, options)
	s.Then = schemaProxyFromCache(cached.Then, s, s, options)
	s.DependentSchemas = schemaProxyMapFromCache(cached.DependentSchemas, s, s, options)
	s.PatternProperties = schemaProxyMapFromCache(cached.PatternProperties, s, s, options)
	s.PropertyNames = schemaProxyFromCache(cached.PropertyNames, s, s, options)
	s.UnevaluatedItems = schemaProxyFromCache(cached.UnevaluatedItems, s, s, options)
	s.UnevaluatedProperties = dynamicSchemaProxyFromCache(cached.UnevaluatedProperties, s, options)
	s.Items = dynamicSchemaProxyFromCache(cached.Items, s, options)
	s.Not = schemaProxyFromCache(cached.Not, s, s, options)
	s.Properties = schemaProxyMapFromCache(cached.Properties, s, s, options)
	s.AdditionalProperties = dynamicSchemaProxyFromCache(cached.AdditionalProperties, s, options)
	s.XML = copyXML(cached.XML, s)
	s.ExternalDocs = copyExternalDoc(cached.ExternalDocs, s)
}

func schemaFromCache(cached *Schema, parent any, nodeParent any, options schemaCacheCopyOptions) *Schema {
	if cached == nil {
		return nil
	}

	if options.mode == schemaCacheModeAlias {
		source := canonicalSchemaSource(cached)
		if source == nil {
			return nil
		}
		alias := &Schema{
			Name:                source.Name,
			Value:               source.Value,
			Hash:                source.Hash,
			Walked:              source.isWalked(),
			aliasCanonicalPaths: options.aliasCanonicalPath,
		}
		alias.setDefinitionSourceLocked(source)
		alias.Foundation = cloneFoundation(&source.Foundation, parent, nodeParent)
		alias.applyAliasCachePath(source, nil, options.aliasCanonicalPath)
		return alias
	}

	clone := &Schema{
		Name:   cached.Name,
		Value:  cached.Value,
		Walked: cached.isWalked(),
	}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, nodeParent)
	clone.applyCanonicalCachePath(cached, options.canonicalPathCache)
	clone.hydrateFromCache(cached, options.drCtx)
	return clone
}

func (s *Schema) applyCanonicalCachePath(cached *Schema, canonicalPathCache *sync.Map) {
	if s == nil || cached == nil || cached.Value == nil ||
		canonicalPathCache == nil {
		return
	}
	lowSchema := cached.Value.GoLow()
	if lowSchema == nil || lowSchema.RootNode == nil {
		return
	}
	s.setCanonicalJSONPathFromCache(canonicalPathCache, lowSchema.RootNode)
}

func applyCanonicalCachePaths(schema *Schema, canonicalPathCache *sync.Map, visited map[*Schema]struct{}) {
	if schema == nil || canonicalPathCache == nil {
		return
	}
	if visited == nil {
		visited = make(map[*Schema]struct{})
	}
	if _, ok := visited[schema]; ok {
		return
	}
	visited[schema] = struct{}{}

	schema.applyCanonicalCachePath(schema, canonicalPathCache)
	applyCanonicalCachePathsToProxySlice(schema.AllOf, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxySlice(schema.OneOf, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxySlice(schema.AnyOf, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxySlice(schema.PrefixItems, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.Contains, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.If, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.Else, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.Then, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxyMap(schema.DependentSchemas, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxyMap(schema.PatternProperties, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.PropertyNames, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.UnevaluatedItems, canonicalPathCache, visited)
	applyCanonicalCachePathsToDynamicProxy(schema.UnevaluatedProperties, canonicalPathCache, visited)
	applyCanonicalCachePathsToDynamicProxy(schema.Items, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxy(schema.Not, canonicalPathCache, visited)
	applyCanonicalCachePathsToProxyMap(schema.Properties, canonicalPathCache, visited)
	applyCanonicalCachePathsToDynamicProxy(schema.AdditionalProperties, canonicalPathCache, visited)
}

func applyCanonicalCachePathsToProxy(proxy *SchemaProxy, canonicalPathCache *sync.Map, visited map[*Schema]struct{}) {
	if proxy == nil {
		return
	}
	applyCanonicalCachePaths(proxy.Schema, canonicalPathCache, visited)
}

func applyCanonicalCachePathsToProxySlice(proxies []*SchemaProxy, canonicalPathCache *sync.Map, visited map[*Schema]struct{}) {
	for _, proxy := range proxies {
		applyCanonicalCachePathsToProxy(proxy, canonicalPathCache, visited)
	}
}

func applyCanonicalCachePathsToProxyMap(proxies *orderedmap.Map[string, *SchemaProxy], canonicalPathCache *sync.Map, visited map[*Schema]struct{}) {
	if proxies == nil {
		return
	}
	for pair := proxies.First(); pair != nil; pair = pair.Next() {
		applyCanonicalCachePathsToProxy(pair.Value(), canonicalPathCache, visited)
	}
}

func applyCanonicalCachePathsToDynamicProxy(
	proxy *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool],
	canonicalPathCache *sync.Map,
	visited map[*Schema]struct{},
) {
	if proxy == nil {
		return
	}
	applyCanonicalCachePathsToProxy(proxy.A, canonicalPathCache, visited)
}

func (s *Schema) applyAliasCachePath(source *Schema, drCtx *DrContext, canonicalPaths bool) {
	if s == nil || source == nil || !canonicalPaths {
		return
	}
	if source.Value != nil {
		lowSchema := source.Value.GoLow()
		if lowSchema != nil && lowSchema.RootNode != nil {
			s.setCanonicalJSONPathFromContext(drCtx, lowSchema.RootNode)
		}
	}
	s.setCanonicalJSONPath(source.GenerateJSONPath())
}

func schemaProxyFromCache(cached *SchemaProxy, parent any, nodeParent any, options schemaCacheCopyOptions) *SchemaProxy {
	if cached == nil {
		return nil
	}

	copied := &SchemaProxy{
		Value: cached.Value,
	}
	copied.Foundation = cloneFoundation(&cached.Foundation, parent, nodeParent)
	copied.Schema = schemaFromCache(cached.Schema, copied, copied.NodeParent, options)
	return copied
}

func schemaProxySliceFromCache(cached []*SchemaProxy, parent any, nodeParent any, options schemaCacheCopyOptions) []*SchemaProxy {
	if len(cached) == 0 {
		return nil
	}

	copied := make([]*SchemaProxy, len(cached))
	for i, item := range cached {
		copied[i] = schemaProxyFromCache(item, parent, nodeParent, options)
	}
	return copied
}

func schemaProxyMapFromCache(cached *orderedmap.Map[string, *SchemaProxy], parent any, nodeParent any, options schemaCacheCopyOptions) *orderedmap.Map[string, *SchemaProxy] {
	if cached == nil {
		return nil
	}

	copied := newSchemaProxyMap(cached.Len())
	for pair := cached.First(); pair != nil; pair = pair.Next() {
		copied.Set(pair.Key(), schemaProxyFromCache(pair.Value(), parent, nodeParent, options))
	}
	return copied
}

func newSchemaProxyMap(capacity int) *orderedmap.Map[string, *SchemaProxy] {
	return &orderedmap.Map[string, *SchemaProxy]{
		OrderedMap: wk8orderedmap.New[string, *SchemaProxy](capacity),
	}
}

func dynamicSchemaProxyFromCache(
	cached *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool],
	parent any,
	options schemaCacheCopyOptions,
) *DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool] {
	if cached == nil {
		return nil
	}

	copied := &DynamicValue[*base.SchemaProxy, bool, *SchemaProxy, bool]{
		Value: cached.Value,
		B:     cached.B,
	}
	copied.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	copied.A = schemaProxyFromCache(cached.A, copied, parent, options)
	return copied
}

func copyDiscriminator(cached *Discriminator, parent any) *Discriminator {
	if cached == nil {
		return nil
	}

	clone := &Discriminator{Value: cached.Value}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	return clone
}

func copyXML(cached *XML, parent any) *XML {
	if cached == nil {
		return nil
	}

	clone := &XML{Value: cached.Value}
	clone.Foundation = cloneFoundation(&cached.Foundation, parent, parent)
	return clone
}

func copyExternalDoc(cached *ExternalDoc, parent any) *ExternalDoc {
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

func (s *Schema) isComponentSchemaOccurrence() bool {
	if s == nil {
		return false
	}
	parent, ok := s.Parent.(*SchemaProxy)
	return ok && parent.GetPathSegment() == "schemas"
}

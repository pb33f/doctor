// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	"log/slog"
	"net/url"
	"reflect"
	"strconv"
	"strings"
	"sync"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"go.yaml.in/yaml/v4"
)

const HEIGHT = 25
const WIDTH = 200
const CHAR_WIDTH = 8
const MAX_WIDTH = 700
const MIN_WIDTH = 150

type BuildError struct {
	Error         error
	SchemaProxy   *base.SchemaProxy
	DrSchemaProxy *SchemaProxy
}

type WalkedSchema struct {
	Schema     *Schema
	SchemaNode *yaml.Node
}

type WalkedParam struct {
	Param     any
	ParamNode *yaml.Node
}

type WalkedHeader struct {
	Header     any
	HeaderNode *yaml.Node
}

type WalkedMediaType struct {
	MediaType     any
	MediaTypeNode *yaml.Node
}

type DrContext struct {
	SchemaChan        chan *WalkedSchema
	ObjectChan        chan any
	SkippedSchemaChan chan *WalkedSchema
	ParameterChan     chan *WalkedParam
	HeaderChan        chan *WalkedHeader
	MediaTypeChan     chan *WalkedMediaType
	ErrorChan         chan *BuildError
	NodeChan          chan *Node
	EdgeChan          chan *Edge
	Index             *index.SpecIndex
	Rolodex           *index.Rolodex
	V3Document        *v3.Document
	BuildGraph        bool
	RenderChanges     bool
	UseSchemaCache    bool
	SyncWalk          bool      // When true, walk everything synchronously (no goroutines)
	WalkPool          *WalkPool // General bounded worker pool for all walk operations
	// Deprecated: schema subtrees are walked inline before cache publication.
	// This field is retained only for source compatibility with callers that
	// constructed DrContext directly.
	SchemaPool *SchemaWalkPool
	// Deprecated: pooled walking is the default whenever SyncWalk is false.
	// This field is retained only for source compatibility.
	PooledWalk         bool
	DeterministicPaths bool // When true, component objects return definition-site paths
	SchemaCache        *sync.Map
	CanonicalPathCache *sync.Map // Maps *yaml.Node pointer -> canonical JSONPath (definition site)
	HashCache          *HashCache
	// Deprecated: string interning was removed from the walker. This field is
	// retained only for source compatibility.
	StringCache      *sync.Map
	StorageRoot      string
	WorkingDirectory string
	Logger           *slog.Logger

	// CanonicalPathsApplied tracks canonical schemas whose subtrees have had
	// canonical cache paths applied during this walk, so repeated cache hits
	// skip the idempotent full-subtree traversal. A pointer so DrContext
	// copies (WalkContextForRef) share the set; nil simply disables the guard.
	CanonicalPathsApplied *sync.Map

	// CircularRefs caches circular-reference lookups as sets so reference
	// walks avoid re-assembling slices per $ref. A pointer so DrContext
	// copies share it; nil falls back to scanning the index slices directly.
	CircularRefs *CircularRefSets
}

type hashCacheKey struct {
	rootNode *yaml.Node
	model    low.Hashable
}

type HashCache struct {
	mu     sync.RWMutex
	values map[hashCacheKey]string
}

var hashCacheComparableTypes sync.Map

func NewHashCache() *HashCache {
	return &HashCache{}
}

func (c *HashCache) load(key hashCacheKey) (string, bool) {
	if c == nil {
		return "", false
	}
	c.mu.RLock()
	defer c.mu.RUnlock()
	if c.values == nil {
		return "", false
	}
	value, ok := c.values[key]
	return value, ok
}

func (c *HashCache) loadOrStore(key hashCacheKey, value string) string {
	if c == nil {
		return value
	}
	c.mu.RLock()
	if c.values != nil {
		if cached, ok := c.values[key]; ok {
			c.mu.RUnlock()
			return cached
		}
	}
	c.mu.RUnlock()

	c.mu.Lock()
	if c.values == nil {
		c.values = make(map[hashCacheKey]string)
	}
	if cached, ok := c.values[key]; ok {
		c.mu.Unlock()
		return cached
	}
	c.values[key] = value
	c.mu.Unlock()
	return value
}

func hashCacheModelComparable(t reflect.Type) bool {
	if cached, ok := hashCacheComparableTypes.Load(t); ok {
		comparable, ok := cached.(bool)
		return ok && comparable
	}
	comparable := t.Comparable()
	actual, _ := hashCacheComparableTypes.LoadOrStore(t, comparable)
	cachedComparable, ok := actual.(bool)
	if !ok {
		return comparable
	}
	return cachedComparable
}

func hashCacheKeyFor(model low.Hashable) (hashCacheKey, bool) {
	key := hashCacheKey{model: model}
	if hasRootNode, ok := model.(low.HasRootNode); ok {
		if rootNode := hasRootNode.GetRootNode(); rootNode != nil {
			// Low models that share a root YAML node are treated as the same
			// hash identity; they describe the same parsed document object.
			key.rootNode = rootNode
			key.model = nil
		}
	}
	if key.rootNode == nil && !hashCacheModelComparable(reflect.TypeOf(model)) {
		return hashCacheKey{}, false
	}
	return key, true
}

func (d *DrContext) hashString(model low.Hashable) string {
	if model == nil {
		return ""
	}
	key, cacheable := hashCacheKeyFor(model)
	if d == nil || d.HashCache == nil || !cacheable {
		return strconv.FormatUint(model.Hash(), 16)
	}

	if cached, ok := d.HashCache.load(key); ok {
		return cached
	}

	hash := strconv.FormatUint(model.Hash(), 16)
	return d.HashCache.loadOrStore(key, hash)
}

func canonicalPathFromCache(cache *sync.Map, rootNode *yaml.Node) (string, bool) {
	if cache == nil || rootNode == nil {
		return "", false
	}
	canonicalPath, found := cache.Load(rootNode)
	if !found {
		return "", false
	}
	path, ok := canonicalPath.(string)
	return path, ok
}

func (d *DrContext) canonicalPathFor(rootNode *yaml.Node) (string, bool) {
	if d == nil || !d.DeterministicPaths {
		return "", false
	}
	return canonicalPathFromCache(d.CanonicalPathCache, rootNode)
}

func GetDrContext(ctx context.Context) *DrContext {
	return ctx.Value("drCtx").(*DrContext)
}

// RunWalk submits work to the bounded a WalkPool or runs synchronously if SyncWalk is true.
// The pool automatically falls back to synchronous execution if the queue is full.
func (d *DrContext) RunWalk(f func()) {
	if f == nil {
		return
	}
	if d.SyncWalk {
		f()
		return
	}
	// use bounded worker pool - falls back to sync if queue full
	if d.WalkPool != nil {
		d.WalkPool.SubmitOrRun(f)
	} else {
		// no pool available, run synchronously
		f()
	}
}

// WaitForCompletion blocks until all submitted walk operations have completed.
// In sync mode, this is a no-op because work has already completed inline.
func (d *DrContext) WaitForCompletion() {
	if d.SyncWalk && d.SchemaPool == nil {
		return
	}
	if d.WalkPool == nil && d.SchemaPool == nil {
		return
	}
	for {
		if d.WalkPool != nil {
			d.WalkPool.WaitForCompletion()
		}
		if d.SchemaPool != nil {
			d.SchemaPool.WaitForCompletion()
		}
		walkIdle := d.WalkPool == nil || d.WalkPool.IsIdle()
		schemaIdle := d.SchemaPool == nil || d.SchemaPool.IsIdle()
		if walkIdle && schemaIdle {
			return
		}
	}
}

// SubmitSchemaWalk submits a schema walk through the deprecated schema pool
// when one is configured, otherwise it walks synchronously.
//
// Deprecated: schema descendants are now walked inline before schema cache
// publication. New code should call SchemaProxy.Walk directly or use RunWalk
// for non-schema document branches.
func (d *DrContext) SubmitSchemaWalk(ctx context.Context, sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) {
	if d != nil && d.SchemaPool != nil {
		d.SchemaPool.SubmitOrWalk(sch, baseSchema, depth)
		return
	}
	if sch != nil {
		sch.Walk(ctx, baseSchema, depth)
	}
}

// WalkContextForRef returns a context suitable for walking a $ref object.
// When DeterministicPaths is enabled and not rendering changes, BuildGraph is disabled
// to prevent creating duplicate nodes. The component definition creates the canonical node;
// reference usages only need edges.
func (d *DrContext) WalkContextForRef(ctx context.Context, isRef bool) context.Context {
	if isRef && d.DeterministicPaths && !d.RenderChanges {
		clonedCtx := *d
		clonedCtx.BuildGraph = false
		return context.WithValue(ctx, "drCtx", &clonedCtx)
	}
	return ctx
}

// BuildRefEdgeByLine creates a reference edge from source node to a component definition
// using the component's canonical JSONPath as target identifier.
// Returns true if edge was created successfully.
func (d *DrContext) BuildRefEdgeByLine(ctx context.Context, source *Foundation, ref string) bool {
	if ref == "" || d.Index == nil || source.GetNode() == nil {
		return false
	}
	refComp := d.Index.FindComponent(ctx, ref)
	if refComp == nil || refComp.Node == nil {
		return false
	}
	// Convert ref to JSONPath format for target node ID
	// ref is like "#/components/headers/RateLimit" -> "$.components.headers['RateLimit']"
	target := RefToJSONPath(ref)
	source.BuildReferenceEdge(ctx, source.GetNode().Id, target, ref, "")
	return true
}

// RefToJSONPath converts a JSON Reference string to a JSONPath node ID.
// e.g., "#/components/headers/RateLimit" -> "$.components.headers['RateLimit']"
// Handles JSON Pointer escapes (~0 -> ~, ~1 -> /) and external refs (file.yaml#/...).
func RefToJSONPath(ref string) string {
	// Handle external refs: extract only the fragment part after #
	if idx := strings.Index(ref, "#"); idx >= 0 {
		ref = ref[idx:]
	}

	ref = strings.TrimPrefix(strings.TrimPrefix(ref, "#"), "/")
	if ref == "" {
		return "$"
	}

	parts := strings.Split(ref, "/")
	var b strings.Builder
	b.Grow(len(ref) + len(parts)*4)
	b.WriteByte('$')

	for i, part := range parts {
		// URL decode (handles %7B, %7D, etc.)
		if decoded, err := url.PathUnescape(part); err == nil {
			part = decoded
		}
		// JSON Pointer decode: ~1 -> /, ~0 -> ~ (order matters!)
		part = strings.ReplaceAll(part, "~1", "/")
		part = strings.ReplaceAll(part, "~0", "~")

		if i < 2 {
			b.WriteByte('.')
			b.WriteString(part)
		} else {
			b.WriteString("['")
			b.WriteString(part)
			b.WriteString("']")
		}
	}

	return b.String()
}

// CircularRefSets caches the document's circular reference lookups as sets.
// The underlying index data is immutable during a walk, but the slices are
// re-assembled (three appends + linear scan) by every reference walk without
// this cache. Built lazily on first use; safe for concurrent walkers.
type CircularRefSets struct {
	defsOnce  sync.Once
	defs      map[string]struct{}
	nodesOnce sync.Once
	nodes     map[*yaml.Node]struct{}
}

// isCircularDefinition reports whether ref is the loop point definition of a
// circular, ignored-polymorphic or ignored-array circular reference.
func (c *CircularRefSets) isCircularDefinition(idx *index.SpecIndex, ref string) bool {
	c.defsOnce.Do(func() {
		c.defs = make(map[string]struct{})
		if idx == nil {
			return
		}
		for _, r := range idx.GetCircularReferences() {
			c.defs[r.LoopPoint.Definition] = struct{}{}
		}
		for _, r := range idx.GetIgnoredPolymorphicCircularReferences() {
			c.defs[r.LoopPoint.Definition] = struct{}{}
		}
		for _, r := range idx.GetIgnoredArrayCircularReferences() {
			c.defs[r.LoopPoint.Definition] = struct{}{}
		}
	})
	_, ok := c.defs[ref]
	return ok
}

// isCircularLoopNode reports whether node is the loop point node of any
// circular reference known to the rolodex (root index, safe or ignored).
func (c *CircularRefSets) isCircularLoopNode(rolodex *index.Rolodex, node *yaml.Node) bool {
	c.nodesOnce.Do(func() {
		c.nodes = make(map[*yaml.Node]struct{})
		if rolodex == nil {
			return
		}
		if root := rolodex.GetRootIndex(); root != nil {
			for _, r := range root.GetCircularReferences() {
				c.nodes[r.LoopPoint.Node] = struct{}{}
			}
		}
		for _, r := range rolodex.GetSafeCircularReferences() {
			c.nodes[r.LoopPoint.Node] = struct{}{}
		}
		for _, r := range rolodex.GetIgnoredCircularReferences() {
			c.nodes[r.LoopPoint.Node] = struct{}{}
		}
	})
	_, ok := c.nodes[node]
	return ok
}

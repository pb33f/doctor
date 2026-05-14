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
	SchemaChan         chan *WalkedSchema
	ObjectChan         chan any
	SkippedSchemaChan  chan *WalkedSchema
	ParameterChan      chan *WalkedParam
	HeaderChan         chan *WalkedHeader
	MediaTypeChan      chan *WalkedMediaType
	ErrorChan          chan *BuildError
	NodeChan           chan *Node
	EdgeChan           chan *Edge
	Index              *index.SpecIndex
	Rolodex            *index.Rolodex
	V3Document         *v3.Document
	BuildGraph         bool
	RenderChanges      bool
	UseSchemaCache     bool
	SyncWalk           bool            // When true, walk everything synchronously (no goroutines)
	PooledWalk         bool            // When true, use bounded worker pools (default)
	SchemaPool         *SchemaWalkPool // Optional bounded worker pool for schema walks
	WalkPool           *WalkPool       // General bounded worker pool for all walk operations
	DeterministicPaths bool            // When true, component objects return definition-site paths
	SchemaCache        *sync.Map
	CanonicalPathCache *sync.Map // Maps *yaml.Node pointer -> canonical JSONPath (definition site)
	HashCache          *HashCache
	StringCache        *sync.Map // String interning for common strings
	StorageRoot        string
	WorkingDirectory   string
	Logger             *slog.Logger
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

// internString returns a cached version of the string to reduce memory
func (d *DrContext) internString(s string) string {
	if d == nil || d.StringCache == nil {
		return s
	}
	actual, _ := d.StringCache.LoadOrStore(s, s)
	if value, ok := actual.(string); ok {
		return value
	}
	return s
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
// In pooled mode, this waits for both WalkPool and SchemaPool to drain.
// In sync mode, this is a no-op (work already completed inline).
func (d *DrContext) WaitForCompletion() {
	if d.SyncWalk {
		return
	}
	if d.WalkPool == nil {
		return
	}
	// wait for BOTH pools using proper blocking (no polling)
	// schema pool workers can submit work back to walk pool and vice versa,
	// so we loop until both are stable
	for {
		d.WalkPool.WaitForCompletion()

		if d.SchemaPool != nil {
			d.SchemaPool.WaitForCompletion()
		}

		// double-check both are idle (handles race where new work submitted)
		if d.WalkPool.IsIdle() && (d.SchemaPool == nil || d.SchemaPool.IsIdle()) {
			return
		}
	}
}

// SubmitSchemaWalk submits a schema walk to the SchemaPool, or runs synchronously.
// The main document walker intentionally walks schema descendants synchronously
// before publishing schema cache entries; use this only for callers that can
// guarantee they are not exposing partially built schema trees to shared state.
func (d *DrContext) SubmitSchemaWalk(ctx context.Context, sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) {
	if d.SchemaPool != nil {
		d.SchemaPool.SubmitOrWalk(sch, baseSchema, depth)
	} else {
		// no pool available, run synchronously
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

// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"log/slog"
	"sync"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"go.yaml.in/yaml/v4"
)

const HEIGHT = 25
const WIDTH = 200

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
	WaitGroup          *conc.WaitGroup
	BuildGraph         bool
	RenderChanges      bool
	UseSchemaCache     bool
	SyncWalk           bool            // When true, walk everything synchronously (no goroutines)
	PooledWalk         bool            // When true, use bounded worker pools
	SchemaPool         *SchemaWalkPool // Bounded worker pool for schema walks
	WalkPool           *WalkPool       // General bounded worker pool for all walk operations
	DeterministicPaths bool            // When true, component objects return definition-site paths
	SchemaCache        *sync.Map
	CanonicalPathCache *sync.Map // Maps object hash -> canonical JSONPath (definition site)
	StringCache        *sync.Map // String interning for common strings
	StorageRoot        string
	WorkingDirectory   string
	Logger             *slog.Logger
}

// internString returns a cached version of the string to reduce memory
func (d *DrContext) internString(s string) string {
	if d.StringCache == nil {
		return s
	}
	if cached, ok := d.StringCache.Load(s); ok {
		return cached.(string)
	}
	d.StringCache.Store(s, s)
	return s
}

func GetDrContext(ctx context.Context) *DrContext {
	return ctx.Value("drCtx").(*DrContext)
}

// RunWalk either runs the function synchronously (if SyncWalk is true)
// or submits it to the bounded WalkPool (if PooledWalk is true)
// or spawns it as a goroutine via the WaitGroup (unbounded, legacy behavior).
func (d *DrContext) RunWalk(f func()) {
	if f == nil {
		return
	}
	if d.SyncWalk {
		f()
	} else if d.PooledWalk && d.WalkPool != nil {
		// use bounded worker pool to prevent goroutine explosion
		d.WalkPool.SubmitOrRun(f)
	} else {
		// legacy unbounded behavior - use with caution on large specs
		d.WaitGroup.Go(f)
	}
}

// WaitForCompletion blocks until all submitted walk operations have completed.
// In pooled mode, this waits for the WalkPool to drain.
// In async mode, this waits for the WaitGroup.
// In sync mode, this is a no-op (work already completed inline).
func (d *DrContext) WaitForCompletion() {
	if d.SyncWalk {
		// sync mode - all work completed inline
		return
	}
	if d.PooledWalk && d.WalkPool != nil {
		// pooled mode - wait for BOTH pools using proper blocking (no polling)
		// schema pool workers can submit work back to walk pool and vice versa,
		// so we loop until both are stable
		for {
			// block on walk pool completion (uses sync.Cond internally)
			d.WalkPool.WaitForCompletion()

			// block on schema pool completion if present
			if d.SchemaPool != nil {
				d.SchemaPool.WaitForCompletion()
			}

			// double-check both are idle (handles race where new work submitted)
			if d.WalkPool.IsIdle() && (d.SchemaPool == nil || d.SchemaPool.IsIdle()) {
				return
			}
		}
	} else if d.WaitGroup != nil {
		// async mode - wait for WaitGroup
		d.WaitGroup.Wait()
	}
}

// SubmitSchemaWalk submits a schema walk to the pool (if available) or runs via WaitGroup.
// This is the preferred method for schema walking in pooled mode.
func (d *DrContext) SubmitSchemaWalk(ctx context.Context, sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) {
	if d.PooledWalk && d.SchemaPool != nil {
		d.SchemaPool.SubmitOrWalk(sch, baseSchema, depth)
	} else if d.SyncWalk {
		sch.Walk(ctx, baseSchema, depth)
	} else {
		d.WaitGroup.Go(func() { sch.Walk(ctx, baseSchema, depth) })
	}
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	"runtime"
	"sync"
	"sync/atomic"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// SchemaWorkItem represents a unit of work for schema walking.
//
// Deprecated: schema descendants are now walked inline before schema cache
// publication. This type is retained only for source compatibility.
type SchemaWorkItem struct {
	Schema     *SchemaProxy
	BaseSchema *base.SchemaProxy
	Depth      int
}

// SchemaWalkPool manages bounded concurrent schema walking.
//
// Deprecated: the production walker no longer uses a separate schema pool
// because schema subtrees must be fully built before cache publication. This
// compatibility type preserves the old API for external callers that still
// construct one directly.
type SchemaWalkPool struct {
	ctx      context.Context
	workChan chan *SchemaWorkItem
	wg       sync.WaitGroup
	inFlight atomic.Int64
	drCtx    *DrContext
	shutdown atomic.Bool
	workers  int

	mu   sync.Mutex
	cond *sync.Cond
}

// DefaultSchemaWorkQueueSize is the buffer size for pending schema walks.
//
// Deprecated: retained only for source compatibility with SchemaWalkPool.
const DefaultSchemaWorkQueueSize = 5000

// DefaultSchemaWorkers returns the number of concurrent schema walkers.
//
// Deprecated: retained only for source compatibility with SchemaWalkPool.
func DefaultSchemaWorkers() int {
	return runtime.NumCPU()
}

// NewSchemaWalkPool creates a deprecated compatibility schema pool.
//
// Deprecated: new walker code should not use a separate schema pool. Schema
// descendants are walked inline before cache publication.
func NewSchemaWalkPool(ctx context.Context, drCtx *DrContext, workers int) *SchemaWalkPool {
	if workers <= 0 {
		workers = DefaultSchemaWorkers()
	}

	pool := &SchemaWalkPool{
		ctx:      ctx,
		workChan: make(chan *SchemaWorkItem, DefaultSchemaWorkQueueSize),
		drCtx:    drCtx,
		workers:  workers,
	}
	pool.cond = sync.NewCond(&pool.mu)

	for i := 0; i < workers; i++ {
		pool.wg.Add(1)
		go pool.worker()
	}

	return pool
}

func (p *SchemaWalkPool) worker() {
	defer p.wg.Done()

	for item := range p.workChan {
		p.processItem(item)
	}
}

func (p *SchemaWalkPool) processItem(item *SchemaWorkItem) {
	if item != nil && item.Schema != nil {
		item.Schema.Walk(p.ctx, item.BaseSchema, item.Depth)
	}
	p.completeWork()
}

func (p *SchemaWalkPool) completeWork() {
	if p.inFlight.Add(-1) == 0 {
		p.mu.Lock()
		if p.cond != nil {
			p.cond.Broadcast()
		}
		p.mu.Unlock()
	}
}

// Submit attempts to queue a schema for async walking.
//
// Deprecated: new walker code should walk schema descendants inline.
func (p *SchemaWalkPool) Submit(sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) bool {
	if p == nil || sch == nil || baseSchema == nil {
		return false
	}

	schema := baseSchema.Schema()
	if schema == nil || schema.GoLow() == nil || schema.GoLow().RootNode == nil {
		return false
	}

	item := &SchemaWorkItem{
		Schema:     sch,
		BaseSchema: baseSchema,
		Depth:      depth,
	}

	p.mu.Lock()
	defer p.mu.Unlock()
	if p.shutdown.Load() {
		return false
	}

	p.inFlight.Add(1)
	select {
	case p.workChan <- item:
		return true
	default:
		if p.inFlight.Add(-1) == 0 {
			if p.cond != nil {
				p.cond.Broadcast()
			}
		}
		return false
	}
}

// SubmitOrWalk submits to the deprecated pool if possible, otherwise walks
// synchronously.
//
// Deprecated: new walker code should walk schema descendants inline.
func (p *SchemaWalkPool) SubmitOrWalk(sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) {
	if p != nil && p.Submit(sch, baseSchema, depth) {
		return
	}
	if sch == nil {
		return
	}
	ctx := context.Background()
	if p != nil && p.ctx != nil {
		ctx = p.ctx
	}
	sch.Walk(ctx, baseSchema, depth)
}

// IsIdle returns true if the pool has no work in progress.
//
// Deprecated: retained only for source compatibility with SchemaWalkPool.
func (p *SchemaWalkPool) IsIdle() bool {
	return p == nil || p.inFlight.Load() == 0
}

// WaitForCompletion blocks until all submitted work has completed.
//
// Deprecated: retained only for source compatibility with SchemaWalkPool.
func (p *SchemaWalkPool) WaitForCompletion() {
	if p == nil {
		return
	}
	p.mu.Lock()
	defer p.mu.Unlock()

	for p.inFlight.Load() > 0 {
		if p.cond == nil {
			return
		}
		p.cond.Wait()
	}
}

// Shutdown closes the work channel and waits for all workers to finish.
//
// Deprecated: retained only for source compatibility with SchemaWalkPool.
func (p *SchemaWalkPool) Shutdown() {
	if p == nil {
		return
	}
	p.mu.Lock()
	if p.shutdown.Load() {
		p.mu.Unlock()
		return
	}
	p.shutdown.Store(true)
	if p.workChan != nil {
		close(p.workChan)
	}
	p.mu.Unlock()
	p.wg.Wait()
}

// DrainAndShutdown waits for all work to complete, then shuts down.
//
// Deprecated: retained only for source compatibility with SchemaWalkPool.
func (p *SchemaWalkPool) DrainAndShutdown() {
	if p == nil {
		return
	}
	p.WaitForCompletion()
	p.Shutdown()
}

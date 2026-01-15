// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"sync"
	"sync/atomic"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

// SchemaWorkItem represents a unit of work for schema walking.
type SchemaWorkItem struct {
	Schema     *SchemaProxy
	BaseSchema *base.SchemaProxy
	Depth      int
}

// SchemaWalkPool manages bounded concurrent schema walking to prevent
// goroutine explosion on large OpenAPI specs.
type SchemaWalkPool struct {
	ctx      context.Context
	workChan chan *SchemaWorkItem
	wg       sync.WaitGroup
	inFlight atomic.Int64 // tracks active work items for WaitForCompletion
	drCtx    *DrContext
	shutdown atomic.Bool
	workers  int

	// condition variable for blocking wait (no polling)
	mu   sync.Mutex
	cond *sync.Cond
}

const (
	// DefaultSchemaWorkers is the number of concurrent schema walkers.
	// Keep small since each document walk creates its own pool.
	DefaultSchemaWorkers = 10

	// SchemaWorkQueueSize is the buffer size for pending schema walks.
	SchemaWorkQueueSize = 500
)

// NewSchemaWalkPool creates a pool with bounded workers.
func NewSchemaWalkPool(ctx context.Context, drCtx *DrContext, workers int) *SchemaWalkPool {
	if workers <= 0 {
		workers = DefaultSchemaWorkers
	}

	pool := &SchemaWalkPool{
		ctx:      ctx,
		workChan: make(chan *SchemaWorkItem, SchemaWorkQueueSize),
		drCtx:    drCtx,
		workers:  workers,
	}
	pool.cond = sync.NewCond(&pool.mu)

	// spawn workers
	for i := 0; i < workers; i++ {
		pool.wg.Add(1)
		go pool.worker()
	}

	return pool
}

// worker processes schema walk requests from the queue.
func (p *SchemaWalkPool) worker() {
	defer p.wg.Done()

	for item := range p.workChan {
		p.processItem(item)
	}
}

// processItem walks a single schema.
func (p *SchemaWalkPool) processItem(item *SchemaWorkItem) {
	// perform the actual walk
	item.Schema.Walk(p.ctx, item.BaseSchema, item.Depth)

	// decrement and signal if we hit zero
	if p.inFlight.Add(-1) == 0 {
		p.cond.Broadcast()
	}
}

// Submit attempts to queue a schema for async walking.
// Returns true if queued or already cached/in-progress.
// Returns false if caller should walk synchronously (queue full or shutdown).
func (p *SchemaWalkPool) Submit(sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) bool {
	if p.shutdown.Load() {
		return false // pool is shutting down
	}

	// early exit for nil schema
	if baseSchema == nil {
		return false
	}

	schema := baseSchema.Schema()
	if schema == nil || schema.GoLow() == nil || schema.GoLow().RootNode == nil {
		return false
	}

	// try to queue - each SchemaProxy needs its own walk to create proper parent linkage
	// Note: We do NOT deduplicate based on schema content hash because different
	// SchemaProxy objects referencing the same schema definition need their own
	// Schema objects created in the doctor model tree.
	item := &SchemaWorkItem{
		Schema:     sch,
		BaseSchema: baseSchema,
		Depth:      depth,
	}

	// increment inFlight before attempting to queue
	p.inFlight.Add(1)

	select {
	case p.workChan <- item:
		return true // queued successfully
	default:
		// queue full - signal sync walk needed
		p.inFlight.Add(-1) // undo the increment
		return false
	}
}

// SubmitOrWalk submits to pool if possible, otherwise walks synchronously.
func (p *SchemaWalkPool) SubmitOrWalk(sch *SchemaProxy, baseSchema *base.SchemaProxy, depth int) {
	if !p.Submit(sch, baseSchema, depth) {
		// fall back to sync walk
		sch.Walk(p.ctx, baseSchema, depth)
	}
}

// IsIdle returns true if the pool has no work in progress.
func (p *SchemaWalkPool) IsIdle() bool {
	return p.inFlight.Load() == 0
}

// WaitForCompletion blocks until all submitted work has completed.
// Uses sync.Cond for efficient blocking (no polling).
func (p *SchemaWalkPool) WaitForCompletion() {
	p.mu.Lock()
	defer p.mu.Unlock()

	for p.inFlight.Load() > 0 {
		p.cond.Wait()
	}
}

// Shutdown closes the work channel and waits for all workers to finish.
func (p *SchemaWalkPool) Shutdown() {
	p.shutdown.Store(true)
	close(p.workChan)
	p.wg.Wait()
}

// DrainAndShutdown waits for all work to complete, then shuts down.
func (p *SchemaWalkPool) DrainAndShutdown() {
	p.WaitForCompletion()
	p.Shutdown()
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"runtime"
	"sync"
	"sync/atomic"
)

// WalkPool is a bounded worker pool for executing walk operations.
// This prevents goroutine explosion when processing large OpenAPI specs
// by limiting the number of concurrent walkers to a fixed pool size.
type WalkPool struct {
	workChan chan func()
	wg       sync.WaitGroup
	shutdown atomic.Bool
	workers  int
	inFlight atomic.Int64 // tracks work in progress for WaitForCompletion

	// condition variable for blocking wait (no polling)
	mu   sync.Mutex
	cond *sync.Cond
}

// DefaultWalkWorkQueueSize is the buffer size for pending walk operations.
// Set to 5000 to handle enterprise-scale OpenAPI specs out of the box.
const DefaultWalkWorkQueueSize = 5000

// DefaultWalkWorkers returns the number of concurrent walk workers.
// Scales with available CPU cores for optimal performance.
func DefaultWalkWorkers() int {
	return runtime.NumCPU()
}

// NewWalkPool creates a bounded pool with the specified number of workers.
// If workers <= 0, defaults to runtime.NumCPU() (one worker per core).
func NewWalkPool(workers int) *WalkPool {
	if workers <= 0 {
		workers = DefaultWalkWorkers()
	}

	pool := &WalkPool{
		workChan: make(chan func(), DefaultWalkWorkQueueSize),
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

// worker processes work items from the queue.
func (p *WalkPool) worker() {
	defer p.wg.Done()

	for fn := range p.workChan {
		if fn != nil {
			fn()
			// decrement and signal if we hit zero
			if p.inFlight.Add(-1) == 0 {
				p.cond.Broadcast()
			}
		}
	}
}

// Submit attempts to queue a function for async execution.
// Returns true if queued successfully.
// Returns false if the queue is full or pool is shutting down (caller should run sync).
func (p *WalkPool) Submit(fn func()) bool {
	if p.shutdown.Load() || fn == nil {
		return false
	}

	// increment before queuing to ensure WaitForCompletion sees it
	p.inFlight.Add(1)

	select {
	case p.workChan <- fn:
		return true
	default:
		// queue full - caller should run synchronously
		p.inFlight.Add(-1) // undo increment since we're not queuing
		return false
	}
}

// SubmitOrRun submits to the pool if possible, otherwise runs synchronously.
func (p *WalkPool) SubmitOrRun(fn func()) {
	if fn == nil {
		return
	}
	if !p.Submit(fn) {
		// fall back to sync execution when queue is full
		fn()
	}
}

// Shutdown closes the work channel and waits for all workers to finish.
func (p *WalkPool) Shutdown() {
	p.shutdown.Store(true)
	close(p.workChan)
	p.wg.Wait()
}

// DrainAndShutdown waits for all work to complete, then shuts down.
func (p *WalkPool) DrainAndShutdown() {
	p.WaitForCompletion()
	p.Shutdown()
}

// QueueLen returns the current number of pending work items.
func (p *WalkPool) QueueLen() int {
	return len(p.workChan)
}

// Workers returns the number of workers in the pool.
func (p *WalkPool) Workers() int {
	return p.workers
}

// InFlight returns the current number of work items being processed or queued.
func (p *WalkPool) InFlight() int64 {
	return p.inFlight.Load()
}

// IsIdle returns true if the pool has no work in progress.
func (p *WalkPool) IsIdle() bool {
	return p.inFlight.Load() == 0
}

// WaitForCompletion blocks until all submitted work has completed.
// Uses sync.Cond for efficient blocking (no polling).
func (p *WalkPool) WaitForCompletion() {
	p.mu.Lock()
	defer p.mu.Unlock()

	for p.inFlight.Load() > 0 {
		p.cond.Wait()
	}
}

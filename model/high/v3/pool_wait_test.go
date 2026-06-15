package v3

import (
	"context"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/pb33f/libopenapi"
)

func TestWalkPoolCompletionSignalCoversPreWaitWindow(t *testing.T) {
	pool := &WalkPool{}
	pool.cond = sync.NewCond(&pool.mu)
	pool.inFlight.Store(1)

	assertCompletionSignalReleasesWaiter(t, &pool.mu, pool.cond, &pool.inFlight, pool.completeWork)
}

func TestSchemaWalkPoolCompletionSignalCoversPreWaitWindow(t *testing.T) {
	pool := &SchemaWalkPool{}
	pool.cond = sync.NewCond(&pool.mu)
	pool.inFlight.Store(1)

	assertCompletionSignalReleasesWaiter(t, &pool.mu, pool.cond, &pool.inFlight, pool.completeWork)
}

func TestDrContextWaitForCompletionDrainsDeprecatedSchemaPoolWithSyncWalk(t *testing.T) {
	pool := &SchemaWalkPool{}
	pool.cond = sync.NewCond(&pool.mu)
	pool.inFlight.Store(1)
	drCtx := &DrContext{
		SyncWalk:   true,
		SchemaPool: pool,
	}

	done := make(chan struct{})
	go func() {
		drCtx.WaitForCompletion()
		close(done)
	}()

	select {
	case <-done:
		t.Fatal("WaitForCompletion returned before deprecated SchemaPool drained")
	case <-time.After(10 * time.Millisecond):
	}

	pool.completeWork()
	waitForSignal(t, done, "WaitForCompletion to return after deprecated SchemaPool drains")
}

func TestSchemaWalkPoolSubmitDoesNotPanicDuringShutdown(t *testing.T) {
	document, err := libopenapi.NewDocument([]byte(`openapi: 3.1.0
info:
  title: schema pool shim
  version: 1.0.0
paths: {}
components:
  schemas:
    Thing:
      type: object
`))
	if err != nil {
		t.Fatalf("create document: %v", err)
	}
	docModel, buildErrs := document.BuildV3Model()
	if buildErrs != nil {
		t.Fatalf("build model: %v", buildErrs)
	}
	baseProxy := docModel.Model.Components.Schemas.GetOrZero("Thing")
	if baseProxy == nil {
		t.Fatal("expected test schema proxy")
	}

	for i := 0; i < 100; i++ {
		pool := &SchemaWalkPool{
			ctx:      context.Background(),
			workChan: make(chan *SchemaWorkItem, 1),
		}
		pool.cond = sync.NewCond(&pool.mu)

		var panicked atomic.Bool
		done := make(chan struct{})
		go func() {
			defer close(done)
			defer func() {
				if recover() != nil {
					panicked.Store(true)
				}
			}()
			_ = pool.Submit(&SchemaProxy{}, baseProxy, 0)
		}()

		pool.Shutdown()
		waitForSignal(t, done, "concurrent deprecated SchemaWalkPool submit")
		if panicked.Load() {
			t.Fatal("SchemaWalkPool.Submit panicked while Shutdown closed the queue")
		}
	}
}

func assertCompletionSignalReleasesWaiter(t *testing.T, mu *sync.Mutex, cond *sync.Cond, inFlight *atomic.Int64, complete func()) {
	t.Helper()

	waiterReady := make(chan struct{})
	allowWait := make(chan struct{})
	waiterDone := make(chan struct{})
	workerDone := make(chan struct{})

	go func() {
		mu.Lock()
		if inFlight.Load() > 0 {
			close(waiterReady)
			<-allowWait
			cond.Wait()
		}
		mu.Unlock()
		close(waiterDone)
	}()

	waitForSignal(t, waiterReady, "waiter to reach pre-wait window")

	go func() {
		complete()
		close(workerDone)
	}()

	waitUntilZero(t, inFlight)
	close(allowWait)

	waitForSignal(t, waiterDone, "waiter to be released after completion")
	waitForSignal(t, workerDone, "completion goroutine to finish")
}

func waitUntilZero(t *testing.T, inFlight *atomic.Int64) {
	t.Helper()

	deadline := time.Now().Add(2 * time.Second)
	for inFlight.Load() != 0 {
		if time.Now().After(deadline) {
			t.Fatal("timed out waiting for inFlight to reach zero")
		}
		time.Sleep(time.Millisecond)
	}
}

func waitForSignal(t *testing.T, ch <-chan struct{}, description string) {
	t.Helper()

	select {
	case <-ch:
	case <-time.After(2 * time.Second):
		t.Fatalf("timed out waiting for %s", description)
	}
}

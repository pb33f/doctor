package v3

import (
	"sync"
	"sync/atomic"
	"testing"
	"time"
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

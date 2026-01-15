// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"fmt"
	"os"
	"runtime"
	"sync"
	"testing"
	"time"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

// loadStripeSpec loads the Stripe OpenAPI spec for benchmarking
func loadStripeSpec(t testing.TB) *libopenapi.DocumentModel[v3.Document] {
	t.Helper()

	specPath := "../../../test_specs/stripe.yaml"
	specBytes, err := os.ReadFile(specPath)
	if err != nil {
		t.Fatalf("failed to read stripe spec: %v", err)
	}

	config := datamodel.NewDocumentConfiguration()
	config.AllowFileReferences = true
	config.AllowRemoteReferences = false
	config.SkipCircularReferenceCheck = true

	doc, err := libopenapi.NewDocumentWithConfiguration(specBytes, config)
	if err != nil {
		t.Fatalf("failed to parse stripe spec: %v", err)
	}

	model, err := doc.BuildV3Model()
	if err != nil {
		t.Fatalf("failed to build v3 model: %v", err)
	}

	return model
}

// memStats captures memory statistics
type memStats struct {
	AllocMB      float64
	TotalAllocMB float64
	HeapAllocMB  float64
	NumGC        uint32
}

func getMemStats() memStats {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return memStats{
		AllocMB:      float64(m.Alloc) / 1024 / 1024,
		TotalAllocMB: float64(m.TotalAlloc) / 1024 / 1024,
		HeapAllocMB:  float64(m.HeapAlloc) / 1024 / 1024,
		NumGC:        m.NumGC,
	}
}

type WalkMode int

const (
	WalkModeAsync  WalkMode = iota // unbounded goroutines (default)
	WalkModeSync                   // fully synchronous
	WalkModePooled                 // bounded worker pool
)

// walkV3 walks the document with configurable walk mode
func walkV3(doc *v3.Document, useCache bool, mode WalkMode) (*Document, int) {
	// use unbuffered channels like production code for natural backpressure
	objectChan := make(chan any)
	nodeChan := make(chan *Node)
	edgeChan := make(chan *Edge)
	schemaChan := make(chan *WalkedSchema)
	skippedSchemaChan := make(chan *WalkedSchema)
	parameterChan := make(chan *WalkedParam)
	headerChan := make(chan *WalkedHeader)
	mediaTypeChan := make(chan *WalkedMediaType)
	buildErrorChan := make(chan *BuildError)
	var schemaCache sync.Map
	var stringCache sync.Map
	var canonicalPathCache sync.Map

	dctx := &DrContext{
		SchemaChan:         schemaChan,
		SkippedSchemaChan:  skippedSchemaChan,
		ParameterChan:      parameterChan,
		HeaderChan:         headerChan,
		MediaTypeChan:      mediaTypeChan,
		ErrorChan:          buildErrorChan,
		NodeChan:           nodeChan,
		EdgeChan:           edgeChan,
		ObjectChan:         objectChan,
		V3Document:         doc,
		BuildGraph:         true,
		UseSchemaCache:     useCache,
		SyncWalk:           mode == WalkModeSync,
		PooledWalk:         mode == WalkModePooled,
		SchemaCache:        &schemaCache,
		CanonicalPathCache: &canonicalPathCache,
		StringCache:        &stringCache,
		Index:              doc.Index,
		Rolodex:            doc.Rolodex,
	}

	drCtx := context.WithValue(context.Background(), "drCtx", dctx)

	// initialize pools if pooled mode
	if mode == WalkModePooled {
		// create general walk pool for all walk operations
		dctx.WalkPool = NewWalkPool(DefaultWalkWorkers())
		defer dctx.WalkPool.Shutdown()

		// create schema pool for schema-specific walks
		dctx.SchemaPool = NewSchemaWalkPool(drCtx, dctx, DefaultSchemaWorkers())
		defer dctx.SchemaPool.Shutdown()
	}

	objectCount := 0
	done := make(chan bool)
	go func() {
		for {
			select {
			case <-done:
				return
			case <-objectChan:
				objectCount++
			case <-nodeChan:
			case <-edgeChan:
			case <-schemaChan:
			case <-skippedSchemaChan:
			case <-parameterChan:
			case <-headerChan:
			case <-mediaTypeChan:
			case <-buildErrorChan:
			}
		}
	}()

	drDoc := &Document{}
	drDoc.Walk(drCtx, doc)

	done <- true
	// Document.Walk closes objectChan, so just drain remaining
	for range objectChan {
		objectCount++
	}

	return drDoc, objectCount
}

// TestStripeWalkProfile_Sync runs a synchronous walk with profiling
// SKIP: This test uses custom channel handling that doesn't match production code
func TestStripeWalkProfile_Sync(t *testing.T) {
	t.Skip("Benchmark test has custom channel handling that differs from production code")
	model := loadStripeSpec(t)

	// track goroutine count during walk
	var maxGoroutines int
	var goroutineSamples []int
	stopMonitor := make(chan bool)

	go func() {
		ticker := time.NewTicker(10 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-stopMonitor:
				return
			case <-ticker.C:
				n := runtime.NumGoroutine()
				goroutineSamples = append(goroutineSamples, n)
				if n > maxGoroutines {
					maxGoroutines = n
				}
			}
		}
	}()

	startMem := getMemStats()
	startGoroutines := runtime.NumGoroutine()
	startTime := time.Now()

	// SYNC WALK - no goroutines for schemas
	_, objCount := walkV3(&model.Model, true, WalkModeSync)

	elapsed := time.Since(startTime)
	endGoroutines := runtime.NumGoroutine()
	endMem := getMemStats()

	stopMonitor <- true

	fmt.Printf("\n=== Stripe Spec Walk Profile (SYNC) ===\n")
	fmt.Printf("Duration:          %v\n", elapsed)
	fmt.Printf("Objects processed: %d\n", objCount)
	fmt.Printf("Start goroutines:  %d\n", startGoroutines)
	fmt.Printf("End goroutines:    %d\n", endGoroutines)
	fmt.Printf("Peak goroutines:   %d\n", maxGoroutines)
	fmt.Printf("Heap delta:        %.2f MB\n", endMem.HeapAllocMB-startMem.HeapAllocMB)
	fmt.Printf("Total alloc:       %.2f MB\n", endMem.TotalAllocMB-startMem.TotalAllocMB)
	fmt.Printf("GC runs:           %d\n", endMem.NumGC-startMem.NumGC)

	if len(goroutineSamples) > 0 {
		sum := 0
		for _, s := range goroutineSamples {
			sum += s
		}
		fmt.Printf("Avg goroutines:    %d\n", sum/len(goroutineSamples))
	}
	fmt.Printf("========================================\n")
}

// TestStripeWalkProfile_Async runs an async walk with profiling
// SKIP: This test uses custom channel handling that doesn't match production code
func TestStripeWalkProfile_Async(t *testing.T) {
	t.Skip("Benchmark test has custom channel handling that differs from production code")
	model := loadStripeSpec(t)

	// track goroutine count during walk
	var maxGoroutines int
	var goroutineSamples []int
	stopMonitor := make(chan bool)

	go func() {
		ticker := time.NewTicker(10 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-stopMonitor:
				return
			case <-ticker.C:
				n := runtime.NumGoroutine()
				goroutineSamples = append(goroutineSamples, n)
				if n > maxGoroutines {
					maxGoroutines = n
				}
			}
		}
	}()

	startMem := getMemStats()
	startGoroutines := runtime.NumGoroutine()
	startTime := time.Now()

	// ASYNC WALK - unbounded goroutines (may timeout!)
	_, objCount := walkV3(&model.Model, true, WalkModeAsync)

	elapsed := time.Since(startTime)
	endGoroutines := runtime.NumGoroutine()
	endMem := getMemStats()

	stopMonitor <- true

	fmt.Printf("\n=== Stripe Spec Walk Profile (ASYNC) ===\n")
	fmt.Printf("Duration:          %v\n", elapsed)
	fmt.Printf("Objects processed: %d\n", objCount)
	fmt.Printf("Start goroutines:  %d\n", startGoroutines)
	fmt.Printf("End goroutines:    %d\n", endGoroutines)
	fmt.Printf("Peak goroutines:   %d\n", maxGoroutines)
	fmt.Printf("Heap delta:        %.2f MB\n", endMem.HeapAllocMB-startMem.HeapAllocMB)
	fmt.Printf("Total alloc:       %.2f MB\n", endMem.TotalAllocMB-startMem.TotalAllocMB)
	fmt.Printf("GC runs:           %d\n", endMem.NumGC-startMem.NumGC)

	if len(goroutineSamples) > 0 {
		sum := 0
		for _, s := range goroutineSamples {
			sum += s
		}
		fmt.Printf("Avg goroutines:    %d\n", sum/len(goroutineSamples))
	}
	fmt.Printf("=========================================\n")
}

// TestStripeWalkProfile_Pooled runs a pooled walk with profiling
// SKIP: This test uses custom channel handling that doesn't match production code
func TestStripeWalkProfile_Pooled(t *testing.T) {
	t.Skip("Benchmark test has custom channel handling that differs from production code")
	model := loadStripeSpec(t)

	// track goroutine count during walk
	var maxGoroutines int
	var goroutineSamples []int
	stopMonitor := make(chan bool)

	go func() {
		ticker := time.NewTicker(10 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-stopMonitor:
				return
			case <-ticker.C:
				n := runtime.NumGoroutine()
				goroutineSamples = append(goroutineSamples, n)
				if n > maxGoroutines {
					maxGoroutines = n
				}
			}
		}
	}()

	startMem := getMemStats()
	startGoroutines := runtime.NumGoroutine()
	startTime := time.Now()

	// POOLED WALK - bounded workers (50 by default)
	_, objCount := walkV3(&model.Model, true, WalkModePooled)

	elapsed := time.Since(startTime)
	endGoroutines := runtime.NumGoroutine()
	endMem := getMemStats()

	stopMonitor <- true

	fmt.Printf("\n=== Stripe Spec Walk Profile (POOLED - %d workers) ===\n", DefaultSchemaWorkers())
	fmt.Printf("Duration:          %v\n", elapsed)
	fmt.Printf("Objects processed: %d\n", objCount)
	fmt.Printf("Start goroutines:  %d\n", startGoroutines)
	fmt.Printf("End goroutines:    %d\n", endGoroutines)
	fmt.Printf("Peak goroutines:   %d\n", maxGoroutines)
	fmt.Printf("Heap delta:        %.2f MB\n", endMem.HeapAllocMB-startMem.HeapAllocMB)
	fmt.Printf("Total alloc:       %.2f MB\n", endMem.TotalAllocMB-startMem.TotalAllocMB)
	fmt.Printf("GC runs:           %d\n", endMem.NumGC-startMem.NumGC)

	if len(goroutineSamples) > 0 {
		sum := 0
		for _, s := range goroutineSamples {
			sum += s
		}
		fmt.Printf("Avg goroutines:    %d\n", sum/len(goroutineSamples))
	}
	fmt.Printf("=====================================================\n")
}

// BenchmarkSchemaWalk_Pooled benchmarks the pooled implementation
func BenchmarkSchemaWalk_Pooled(b *testing.B) {
	model := loadStripeSpec(b)

	// warm up
	walkV3(&model.Model, true, WalkModePooled)
	runtime.GC()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		startTime := time.Now()
		_, _ = walkV3(&model.Model, true, WalkModePooled)
		elapsed := time.Since(startTime)
		b.ReportMetric(float64(elapsed.Milliseconds()), "ms/op")
		runtime.GC()
	}
}

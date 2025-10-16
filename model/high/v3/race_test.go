package v3

import (
	"sync"
	"testing"
	"time"
)

func TestPathSegmentRaceCondition(t *testing.T) {
	// Create a Foundation directly to test the race
	foundation := &Foundation{}
	
	var wg sync.WaitGroup
	
	// Goroutine 1: Write to PathSegment
	wg.Add(1)
	go func() {
		defer wg.Done()
		for range 100 {
			foundation.SetPathSegment("document")
			time.Sleep(time.Nanosecond)
		}
	}()
	
	// Goroutine 2: Read from PathSegment
	wg.Add(1)
	go func() {
		defer wg.Done()
		for range 100 {
			_ = foundation.GetPathSegment()
			time.Sleep(time.Nanosecond)
		}
	}()
	
	wg.Wait()
}

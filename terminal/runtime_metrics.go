// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley / Quobix
// https://pb33f.io

package terminal

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

var DefaultRuntimeMetricsInterval = time.Second

type RuntimeMetricsSnapshot struct {
	Elapsed    time.Duration
	HeapAlloc  uint64
	TotalAlloc uint64
	Sys        uint64
	NumGC      uint32
	Goroutines int
}

type RuntimeMetricsMonitor struct {
	stop     chan struct{}
	done     chan struct{}
	stopOnce sync.Once
}

func StartRuntimeMetricsMonitor(start time.Time, interval time.Duration, report func(RuntimeMetricsSnapshot)) *RuntimeMetricsMonitor {
	if interval <= 0 {
		interval = DefaultRuntimeMetricsInterval
	}
	monitor := &RuntimeMetricsMonitor{
		stop: make(chan struct{}),
		done: make(chan struct{}),
	}
	go func() {
		defer close(monitor.done)
		reportRuntimeMetrics(start, report)

		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for {
			select {
			case <-monitor.stop:
				return
			case <-ticker.C:
				reportRuntimeMetrics(start, report)
			}
		}
	}()
	return monitor
}

func (m *RuntimeMetricsMonitor) Close() {
	if m == nil {
		return
	}
	m.stopOnce.Do(func() {
		close(m.stop)
		<-m.done
	})
}

func reportRuntimeMetrics(start time.Time, report func(RuntimeMetricsSnapshot)) {
	if report == nil {
		return
	}
	report(CaptureRuntimeMetrics(start))
}

func CaptureRuntimeMetrics(start time.Time) RuntimeMetricsSnapshot {
	var mem runtime.MemStats
	runtime.ReadMemStats(&mem)
	return RuntimeMetricsSnapshot{
		Elapsed:    time.Since(start),
		HeapAlloc:  mem.HeapAlloc,
		TotalAlloc: mem.TotalAlloc,
		Sys:        mem.Sys,
		NumGC:      mem.NumGC,
		Goroutines: runtime.NumGoroutine(),
	}
}

func FormatRuntimeMetrics(snapshot RuntimeMetricsSnapshot) string {
	return fmt.Sprintf("elapsed %s · heap %s · reserved %s · allocated %s · collections %d · threads %d",
		RoundDuration(snapshot.Elapsed),
		HumanRuntimeBytes(snapshot.HeapAlloc),
		HumanRuntimeBytes(snapshot.Sys),
		HumanRuntimeBytes(snapshot.TotalAlloc),
		snapshot.NumGC,
		snapshot.Goroutines,
	)
}

func HumanRuntimeBytes(size uint64) string {
	const maxInt64 = uint64(1<<63 - 1)
	if size > maxInt64 {
		size = maxInt64
	}
	return HumanBytes(int64(size))
}

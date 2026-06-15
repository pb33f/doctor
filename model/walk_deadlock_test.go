// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"runtime"
	"sort"
	"strings"
	"testing"
	"time"
)

func TestWalkerGraphCompletesForReferenceHeavySpecs(t *testing.T) {
	cases := []struct {
		name     string
		specPath string
		fileRefs bool
		timeout  time.Duration
	}{
		{
			name:     "file_refs",
			specPath: "../test_specs/root.yaml",
			fileRefs: true,
			timeout:  10 * time.Second,
		},
		{
			name:     "circular_refs",
			specPath: "../test_specs/stripe.yaml",
			timeout:  90 * time.Second,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			syncWalker := newParityGraphWalkDocument(loadWalkTestDocument(t, tc.specPath, tc.fileRefs))
			if syncWalker == nil {
				t.Fatal("expected sync graph walker")
			}
			defer syncWalker.Release()

			docModel := loadWalkTestDocument(t, tc.specPath, tc.fileRefs)
			done := make(chan *DrDocument, 1)

			go func() {
				done <- NewDrDocumentAndGraph(docModel)
			}()

			select {
			case walker := <-done:
				if walker == nil {
					t.Fatal("expected graph walker")
				}
				if len(walker.Nodes) == 0 {
					t.Fatal("expected graph nodes")
				}
				if len(walker.Edges) == 0 {
					t.Fatal("expected graph edges")
				}
				assertWalkParityCategoriesEqual(t, syncWalker, walker,
					"schemas", "skipped", "parameters", "headers", "mediaTypes", "nodes", "edges", "lineObjects")
				walker.Release()
			case <-time.After(tc.timeout):
				t.Fatalf("timed out building graph for %s after %s\n%s",
					tc.specPath, tc.timeout, goroutineDump())
			}
		})
	}
}

func TestWalkerCachedModelCompletesDeterministicallyForReferenceHeavySpecs(t *testing.T) {
	cases := []struct {
		name     string
		specPath string
		fileRefs bool
	}{
		{
			name:     "file_refs",
			specPath: "../test_specs/root.yaml",
			fileRefs: true,
		},
		{
			name:     "circular_refs",
			specPath: "../test_specs/stripe.yaml",
		},
	}
	categories := []string{"schemas", "skipped", "parameters", "headers", "mediaTypes", "lineObjects"}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			syncWalker := newParityDefaultWalkDocument(loadWalkTestDocument(t, tc.specPath, tc.fileRefs))
			defer syncWalker.Release()

			var firstRows map[string][]string
			for i := 0; i < 3; i++ {
				walker := NewDrDocument(loadWalkTestDocument(t, tc.specPath, tc.fileRefs))
				if walker == nil {
					t.Fatal("expected cached model walker")
				}
				assertWalkParityCategoriesEqual(t, syncWalker, walker, categories...)

				rows := collectSortedWalkParityRows(walker, categories...)
				if firstRows == nil {
					firstRows = rows
				} else {
					assertWalkParityRowSetsEqual(t, "cached model repeated run", firstRows, rows, categories...)
				}
				walker.Release()
			}
		})
	}
}

func TestShouldRunCachedWalkSynchronously(t *testing.T) {
	tests := []struct {
		name    string
		config  *DrConfig
		options walkOptions
		want    bool
	}{
		{
			name: "production graph render",
			config: &DrConfig{
				BuildGraph:     true,
				RenderChanges:  true,
				UseSchemaCache: true,
			},
			want: true,
		},
		{
			name: "production cached model",
			config: &DrConfig{
				UseSchemaCache: true,
			},
			want: true,
		},
		{
			name: "deterministic cached model",
			config: &DrConfig{
				UseSchemaCache:     true,
				DeterministicPaths: true,
			},
			want: true,
		},
		{
			name: "already sync",
			config: &DrConfig{
				BuildGraph:     true,
				RenderChanges:  true,
				UseSchemaCache: true,
			},
			options: walkOptions{SyncWalk: true},
		},
		{
			name: "uncached graph render",
			config: &DrConfig{
				BuildGraph:    true,
				RenderChanges: true,
			},
		},
		{
			name:   "uncached model",
			config: &DrConfig{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := shouldRunCachedWalkSynchronously(tt.config, tt.options); got != tt.want {
				t.Fatalf("shouldRunCachedWalkSynchronously() = %v, want %v", got, tt.want)
			}
		})
	}
}

func assertWalkParityCategoriesEqual(t *testing.T, expected, actual *DrDocument, categories ...string) {
	t.Helper()

	expectedRows := collectWalkParityRows(expected)
	actualRows := collectWalkParityRows(actual)
	for _, category := range categories {
		left := append([]string(nil), expectedRows[category]...)
		right := append([]string(nil), actualRows[category]...)
		sort.Strings(left)
		sort.Strings(right)
		if strings.Join(left, "\n") != strings.Join(right, "\n") {
			t.Fatalf("production graph diverged from sync walk for %s: sync=%d actual=%d\n%s",
				category, len(left), len(right), firstWalkParityMismatch(left, right))
		}
	}
}

func collectSortedWalkParityRows(walker *DrDocument, categories ...string) map[string][]string {
	rows := collectWalkParityRows(walker)
	out := make(map[string][]string, len(categories))
	for _, category := range categories {
		sortedRows := append([]string(nil), rows[category]...)
		sort.Strings(sortedRows)
		out[category] = sortedRows
	}
	return out
}

func assertWalkParityRowSetsEqual(
	t *testing.T,
	name string,
	expected, actual map[string][]string,
	categories ...string,
) {
	t.Helper()

	for _, category := range categories {
		left := expected[category]
		right := actual[category]
		if strings.Join(left, "\n") != strings.Join(right, "\n") {
			t.Fatalf("%s diverged for %s: first=%d actual=%d\n%s",
				name, category, len(left), len(right), firstWalkParityMismatch(left, right))
		}
	}
}

func goroutineDump() string {
	buf := make([]byte, 1<<20)
	n := runtime.Stack(buf, true)
	return string(buf[:n])
}

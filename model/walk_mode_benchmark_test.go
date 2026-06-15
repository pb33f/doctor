// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

func BenchmarkWalkerProductionModes(b *testing.B) {
	specPath := os.Getenv("DOCTOR_BENCH_SPEC")
	if specPath == "" {
		specPath = "../test_specs/stripe.yaml"
	}
	docModel := loadWalkBenchmarkDocument(b, specPath, os.Getenv("DOCTOR_BENCH_FILE_REFS") == "true")

	benchmarks := []struct {
		name    string
		config  *DrConfig
		options walkOptions
	}{
		{
			name: "model_cached",
			config: &DrConfig{
				UseSchemaCache: true,
			},
		},
		{
			name: "graph_render",
			config: &DrConfig{
				BuildGraph:     true,
				RenderChanges:  true,
				UseSchemaCache: true,
			},
		},
	}
	if os.Getenv("DOCTOR_BENCH_INCLUDE_SYNC") == "true" {
		benchmarks = append(benchmarks,
			struct {
				name    string
				config  *DrConfig
				options walkOptions
			}{
				name: "model_explicit_sync",
				config: &DrConfig{
					UseSchemaCache: true,
				},
				options: walkOptions{SyncWalk: true},
			},
			struct {
				name    string
				config  *DrConfig
				options walkOptions
			}{
				name: "graph_explicit_sync",
				config: &DrConfig{
					BuildGraph:     true,
					RenderChanges:  true,
					UseSchemaCache: true,
				},
				options: walkOptions{SyncWalk: true},
			},
		)
	}

	for _, bm := range benchmarks {
		b.Run(bm.name, func(b *testing.B) {
			b.ReportAllocs()
			var nodes, edges, lineObjectLines, lineObjectRows int64
			for i := 0; i < b.N; i++ {
				walker := newDrDocumentWithWalkOptions(b, docModel, bm.config, bm.options)
				if len(walker.Schemas) == 0 {
					b.Fatal("expected schemas")
				}
				if bm.config.BuildGraph && len(walker.Nodes) == 0 {
					b.Fatal("expected graph nodes")
				}
				nodes += int64(len(walker.Nodes))
				edges += int64(len(walker.Edges))
				lineObjectLines += int64(len(walker.lineObjects))
				for _, objects := range walker.lineObjects {
					lineObjectRows += int64(len(objects))
				}
				walker.Release()
			}
			if b.N > 0 {
				b.ReportMetric(float64(nodes)/float64(b.N), "nodes/op")
				b.ReportMetric(float64(edges)/float64(b.N), "edges/op")
				b.ReportMetric(float64(lineObjectLines)/float64(b.N), "lineObjectLines/op")
				b.ReportMetric(float64(lineObjectRows)/float64(b.N), "lineObjectRows/op")
			}
		})
	}
}

func loadWalkBenchmarkDocument(tb testing.TB, specPath string, fileRefs bool) *libopenapi.DocumentModel[highV3.Document] {
	tb.Helper()

	specBytes, err := os.ReadFile(specPath)
	if err != nil {
		tb.Fatalf("read %s: %v", specPath, err)
	}

	config := datamodel.NewDocumentConfiguration()
	config.SkipCircularReferenceCheck = true
	if os.Getenv("DOCTOR_BENCH_STRICT_CIRCULAR") == "true" {
		config.SkipCircularReferenceCheck = false
	}
	if fileRefs {
		config.BasePath = filepath.Dir(specPath)
		config.AllowFileReferences = true
	}

	doc, err := libopenapi.NewDocumentWithConfiguration(specBytes, config)
	if err != nil {
		tb.Fatalf("parse %s: %v", specPath, err)
	}

	model, buildErrs := doc.BuildV3Model()
	if buildErrs != nil && model == nil {
		tb.Fatalf("build v3 model for %s: %v", specPath, buildErrs)
	}
	return model
}

func newDrDocumentWithWalkOptions(
	tb testing.TB,
	document *libopenapi.DocumentModel[highV3.Document],
	config *DrConfig,
	options walkOptions,
) *DrDocument {
	tb.Helper()
	if document == nil {
		tb.Fatal("document is nil")
	}
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3WithConfigAndOptions(&document.Model, config, options)
	return doc
}

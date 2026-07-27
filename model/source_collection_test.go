// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"os"
	"path/filepath"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/datamodel/high"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/testify/require"
	"go.yaml.in/yaml/v4"
)

const matchingCoordinatesFixture = "../test_specs/matching-coordinates/openapi.yaml"

func TestMatchingCoordinatesFixturesAreIdentical(t *testing.T) {
	t.Parallel()

	first, err := os.ReadFile("../test_specs/matching-coordinates/first.yaml")
	require.NoError(t, err)
	second, err := os.ReadFile("../test_specs/matching-coordinates/second.yaml")
	require.NoError(t, err)
	require.Equal(t, first, second,
		"whitespace and ordering in the external fixtures are part of the regression setup")
}

func TestCollectorIdentityTruthTable(t *testing.T) {
	t.Parallel()

	walker := NewDrDocumentWithConfig(
		loadMatchingCoordinatesDocument(t),
		&DrConfig{UseSchemaCache: true},
	)
	defer walker.Release()
	require.Len(t, walker.MediaTypes, 2)

	first, second := walker.MediaTypes[0], walker.MediaTypes[1]
	firstNode := &yaml.Node{Line: 10, Column: 4}
	secondNode := &yaml.Node{Line: 10, Column: 4}
	firstSource := sourceIndexOf(t, first)
	secondSource := sourceIndexOf(t, second)
	require.NotSame(t, firstSource, secondSource)
	state := newFoundationalCollectionState(firstSource, 1)

	var items []*drV3.MediaType
	items = collectFoundational(items, &state, first, firstSource, firstNode)
	items = collectFoundational(items, &state, first, firstSource, secondNode)
	require.Len(t, items, 1, "the same source position must remain deduplicated")

	items = collectFoundational(items, &state, second, secondSource, secondNode)
	require.Len(t, items, 2, "different sources at equal coordinates must remain distinct")

	// a known source at the same coordinates is untouched by an unknown one, so the two never
	// collapse into each other.
	items = collectFoundational(items, &state, second, nil, secondNode)
	require.Len(t, items, 3, "an unknown source must not collide with a known file")

	// an unknown source still deduplicates against itself.
	var unknownItems []*drV3.MediaType
	unknownState := newFoundationalCollectionState(firstSource, 0)
	unknownItems = collectFoundational(unknownItems, &unknownState, first, nil, firstNode)
	unknownItems = collectFoundational(unknownItems, &unknownState, first, nil, firstNode)
	require.Len(t, unknownItems, 1, "the same unknown-source position must remain deduplicated")
	unknownItems = collectFoundational(unknownItems, &unknownState, second, nil, secondNode)
	require.Len(t, unknownItems, 1, "equal coordinates in one unknown source are one object")

	items = collectFoundational(items, &state, first, firstSource, nil)
	items = collectFoundational(items, &state, second, secondSource, nil)
	require.Len(t, items, 5, "missing node identity must fail open")
}

func TestNodePointerIdentityIsNotStable(t *testing.T) {
	t.Parallel()

	walker := NewDrDocument(loadWalkTestDocument(t, "../test_specs/asana.yaml", false))
	require.NotNil(t, walker)
	defer walker.Release()

	type sourcePosition struct {
		source   *index.SpecIndex
		position uint64
	}
	seen := make(map[sourcePosition]*yaml.Node)
	for _, objects := range walker.lineObjects {
		for _, object := range objects {
			schema, ok := object.(*drV3.Schema)
			if !ok || schema.GetKeyNode() == nil {
				continue
			}
			node := schema.GetKeyNode()
			key := sourcePosition{
				source:   sourceIndexOf(t, schema),
				position: uint64(node.Line)<<32 | uint64(node.Column),
			}
			if prior, exists := seen[key]; exists && prior != schema.GetKeyNode() {
				return
			}
			seen[key] = schema.GetKeyNode()
		}
	}
	t.Fatal("expected a production walk to re-emit distinct nodes for one source position")
}

// TestExternalModelsAtMatchingCoordinates covers the collector half: that source aware
// deduplication keeps matching-coordinate objects from both files, across every walk mode.
// Parameters, headers and media types already resolved to the right source index before the
// libopenapi attribution fix, so this does not exercise that half. Schemas did not, and
// TestExternalSchemasAtMatchingCoordinates covers them.
func TestExternalModelsAtMatchingCoordinates(t *testing.T) {
	t.Parallel()

	modes := []struct {
		name       string
		config     *DrConfig
		iterations int
	}{
		{
			name:       "cached_default",
			config:     &DrConfig{UseSchemaCache: true},
			iterations: 1,
		},
		{
			name:       "uncached_synchronous",
			config:     &DrConfig{SyncWalk: true},
			iterations: 1,
		},
		{
			name:       "uncached_worker_pool",
			config:     &DrConfig{WalkWorkers: 4},
			iterations: 20,
		},
	}

	for _, mode := range modes {
		t.Run(mode.name, func(t *testing.T) {
			for i := 0; i < mode.iterations; i++ {
				walker := NewDrDocumentWithConfig(
					loadMatchingCoordinatesDocument(t),
					mode.config,
				)
				assertSourceBalance(t, "schemas", foundationalSlice(walker.Schemas))
				assertSourceBalance(t, "skipped schemas", foundationalSlice(walker.SkippedSchemas))
				assertSourceBalance(t, "parameters", foundationalSlice(walker.Parameters))
				assertSourceBalance(t, "headers", foundationalSlice(walker.Headers))
				assertSourceBalance(t, "media types", foundationalSlice(walker.MediaTypes))

				require.Len(t, walker.Schemas, 4)
				require.Len(t, walker.SkippedSchemas, 2)
				require.Len(t, walker.Parameters, 2)
				require.Len(t, walker.Headers, 2)
				require.Len(t, walker.MediaTypes, 2)

				assertCanonicalPaths(t, walker, i)
				walker.Release()
			}
		})
	}
}

func loadMatchingCoordinatesDocument(t *testing.T) *libopenapi.DocumentModel[highV3.Document] {
	t.Helper()

	data, err := os.ReadFile(matchingCoordinatesFixture)
	require.NoError(t, err)
	config := datamodel.NewDocumentConfiguration()
	config.BasePath = filepath.Dir(matchingCoordinatesFixture)
	config.SpecFilePath = matchingCoordinatesFixture
	config.AllowFileReferences = true

	document, err := libopenapi.NewDocumentWithConfiguration(data, config)
	require.NoError(t, err)
	model, err := document.BuildV3Model()
	require.NoError(t, err)
	return model
}

func assertSourceBalance(t *testing.T, collection string, items []drV3.Foundational) {
	t.Helper()

	counts := make(map[string]int)
	for _, item := range items {
		source := sourceFileName(t, item)
		counts[source]++
	}

	require.Positive(t, counts["first.yaml"], "%s must retain first.yaml; sources: %v", collection, counts)
	require.Equal(t, counts["first.yaml"], counts["second.yaml"],
		"%s must retain matching-coordinate objects from both sources", collection)
}

func assertCanonicalPaths(t *testing.T, walker *DrDocument, iteration int) {
	t.Helper()

	expected := map[string]string{
		"first.yaml":  "$.paths['/first'].get.responses['200'].content['application/json']",
		"second.yaml": "$.paths['/second'].get.responses['200'].content['application/json']",
	}
	for _, mediaType := range walker.MediaTypes {
		source := sourceFileName(t, mediaType)
		require.Equalf(t, expected[source], mediaType.GenerateJSONPath(),
			"iteration %d produced an unstable canonical path for %s", iteration, source)
	}
}

func foundationalSlice[T drV3.Foundational](items []T) []drV3.Foundational {
	foundational := make([]drV3.Foundational, len(items))
	for i, item := range items {
		foundational[i] = item
	}
	return foundational
}

func sourceFileName(t *testing.T, item drV3.Foundational) string {
	t.Helper()

	return filepath.Base(sourceIndexOf(t, item).GetSpecAbsolutePath())
}

func sourceIndexOf(t *testing.T, item drV3.Foundational) *index.SpecIndex {
	t.Helper()

	hasValue, ok := item.(drV3.HasValue)
	require.True(t, ok, "%T must expose its source value", item)
	goesLow, ok := hasValue.GetValue().(high.GoesLowUntyped)
	require.True(t, ok, "%T value must expose its low-level model", item)
	hasIndex, ok := goesLow.GoLowUntyped().(drV3.HasIndex)
	require.True(t, ok, "%T low-level value must expose its source index", item)
	require.NotNil(t, hasIndex.GetIndex(), "%T must have a source index", item)

	return hasIndex.GetIndex()
}

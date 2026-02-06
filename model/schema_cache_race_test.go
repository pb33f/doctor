// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	"os"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/require"
)

// TestSchemaCacheHitNodeWidthRace verifies no race between processObject
// (writing Node.Width/Height from the main channel loop) and BuildNode
// (writing Node.Width/Height from a WalkPool worker) when the schema cache
// hit path sends to ObjectChan before the walk completes.
//
// Regression test for: premature ObjectChan send on cache-hit + !s.Walked.
func TestSchemaCacheHitNodeWidthRace(t *testing.T) {
	// train-travel.yaml has heavy $ref reuse across schemas, parameters,
	// headers, and responses — maximises schema cache hits.
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	// Run 10 iterations: the race was ~40% reproducible per run,
	// so 10 iterations give >99% chance of catching a regression.
	for i := 0; i < 10; i++ {
		drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
			BuildGraph:     true,
			UseSchemaCache: true,
		})
		require.NotNil(t, drDoc)
		require.NotEmpty(t, drDoc.Nodes, "iteration %d: expected nodes from graph build", i)
	}
	// If the race detector fires, `go test -race` exits non-zero automatically.
}

// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/testify/require"
)

const wholeFilePathRefsFixture = "../test_specs/whole-file-path-refs/openapi.yaml"

// TestWholeFileRefEdgesDoNotResolveByLineAlone guards the graph against reference
// edges that point backwards. A path item that is a whole-file $ref resolves to line 1
// of another file; resolving that by line number alone attached it to the root document
// node, which also sits on line 1.
func TestWholeFileRefEdgesDoNotResolveByLineAlone(t *testing.T) {
	t.Parallel()

	data, err := os.ReadFile(wholeFilePathRefsFixture)
	require.NoError(t, err)
	config := datamodel.NewDocumentConfiguration()
	config.BasePath = filepath.Dir(wholeFilePathRefsFixture)
	config.SpecFilePath = wholeFilePathRefsFixture
	config.AllowFileReferences = true

	document, err := libopenapi.NewDocumentWithConfiguration(data, config)
	require.NoError(t, err)
	v3Model, err := document.BuildV3Model()
	require.NoError(t, err)

	walker := NewDrDocumentAndGraph(v3Model)
	defer walker.Release()

	pathItems := 0
	localRefResolved := false
	for _, edge := range walker.Edges {
		require.NotEqual(t, "root", edge.Targets[0],
			"edge %v -> %v (%s) points back at the document", edge.Sources, edge.Targets, edge.Ref)
		if edge.Sources[0] == "$.paths" && edge.Ref != "" {
			pathItems++
		}
		if edge.Ref == "#/components/parameters/RequestID" &&
			edge.Targets[0] == "$.components.parameters['RequestID']" {
			localRefResolved = true
		}
	}
	require.Equal(t, 2, pathItems, "referenced path items must stay attached to paths")
	require.True(t, localRefResolved, "same-file references must still resolve to their component")
}

// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"os"
	"path/filepath"
	"sort"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/testify/require"
)

const matchingCoordinatesSchemaFixture = "../test_specs/matching-coordinates-schemas/openapi.yaml"

// TestExternalSchemasAtMatchingCoordinates covers the case the parameter and media type
// fixtures cannot reach. Schemas referenced straight out of components resolve through a different
// path, and until libopenapi attributed them to the file that owns their nodes, the inline
// properties of two byte-identical external files shared one (index, line, column) identity and
// half of them were dropped during collection.
func TestExternalSchemasAtMatchingCoordinates(t *testing.T) {
	t.Parallel()

	first, err := os.ReadFile("../test_specs/matching-coordinates-schemas/a.yaml")
	require.NoError(t, err)
	second, err := os.ReadFile("../test_specs/matching-coordinates-schemas/b.yaml")
	require.NoError(t, err)
	require.Equal(t, first, second,
		"the external fixtures must stay byte-identical for their coordinates to collide")

	data, err := os.ReadFile(matchingCoordinatesSchemaFixture)
	require.NoError(t, err)

	config := datamodel.NewDocumentConfiguration()
	config.BasePath = filepath.Dir(matchingCoordinatesSchemaFixture)
	config.SpecFilePath = matchingCoordinatesSchemaFixture
	config.AllowFileReferences = true

	document, err := libopenapi.NewDocumentWithConfiguration(data, config)
	require.NoError(t, err)

	model, err := document.BuildV3Model()
	require.NoError(t, err)

	walker := NewDrDocument(model)
	defer walker.Release()

	paths := make([]string, 0, len(walker.Schemas))
	for _, schema := range walker.Schemas {
		paths = append(paths, schema.GenerateJSONPath())
	}
	sort.Strings(paths)

	require.Equal(t, []string{
		"$.components.schemas['FromA'].properties['alpha']",
		"$.components.schemas['FromA'].properties['beta']",
		"$.components.schemas['FromB'].properties['alpha']",
		"$.components.schemas['FromB'].properties['beta']",
	}, paths, "every external schema property must survive collection")
}

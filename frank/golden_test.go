// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"flag"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

var updateGolden = flag.Bool("update", false, "re-record golden files under frank/testdata/golden")

const (
	fixturePath  = "testdata/openapi.yaml"
	goldenDir    = "testdata/golden"
	goldenBundle = "bundled.yml"
	goldenPaths  = "exploded-paths.txt"
)

// explodedSamples are the exploded files whose content does not appear in the
// bundled render. Request content does, because both renderers marshal the same
// RequestHTTP, so recording every request file twice would only duplicate it.
var explodedSamples = []string{
	"opencollection.yml",
	"inventory/folder.yml",
	"environments/production.yml",
	"environments/sandbox.yml",
}

func TestGolden_Bundled(t *testing.T) {
	data, err := RenderBundled(buildFixtureResult(t))
	require.NoError(t, err)

	assertGolden(t, goldenBundle, string(data))
}

func TestGolden_ExplodedPaths(t *testing.T) {
	files, err := RenderExploded(buildFixtureResult(t))
	require.NoError(t, err)

	paths := make([]string, 0, len(files))
	for _, f := range files {
		paths = append(paths, f.Path)
	}
	sort.Strings(paths)

	assertGolden(t, goldenPaths, strings.Join(paths, "\n")+"\n")
}

func TestGolden_ExplodedSamples(t *testing.T) {
	files, err := RenderExploded(buildFixtureResult(t))
	require.NoError(t, err)

	rendered := make(map[string]string, len(files))
	for _, f := range files {
		rendered[f.Path] = string(f.Content)
	}

	for _, name := range explodedSamples {
		content, ok := rendered[name]
		require.True(t, ok, "%s was not rendered", name)
		assertGolden(t, filepath.Join("exploded", name), content)
	}
}

func TestGenerate_IsDeterministic(t *testing.T) {
	first, err := RenderBundled(buildFixtureResult(t))
	require.NoError(t, err)

	second, err := RenderBundled(buildFixtureResult(t))
	require.NoError(t, err)

	assert.Equal(t, string(first), string(second))
}

func assertGolden(t *testing.T, name, got string) {
	t.Helper()

	path := filepath.Join(goldenDir, name)

	if *updateGolden {
		require.NoError(t, os.MkdirAll(filepath.Dir(path), 0o755))
		require.NoError(t, os.WriteFile(path, []byte(got), 0o644))
		return
	}

	want, err := os.ReadFile(path)
	require.NoError(t, err, "%s not recorded. run: go test ./frank/... -run TestGolden -update", path)
	assert.Equal(t, string(want), got, "%s differs; re-record with -update", path)
}

func buildFixtureResult(t *testing.T) *FrankResult {
	t.Helper()

	spec, err := os.ReadFile(fixturePath)
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                    model.NewDrDocument(v3Model),
		IncludeDescriptionAsDocs: true,
		GenerateEnvironments:     true,
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	return result
}

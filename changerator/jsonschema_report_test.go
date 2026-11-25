// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"encoding/json"
	"strings"
	"testing"
	"testing/fstest"

	"github.com/pb33f/doctor/changerator/renderer"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/jsonschema"
	"github.com/pb33f/testify/require"
)

func TestJSONSchemaDocumentReport(t *testing.T) {
	const before = "title: Customer\nproperties:\n  id: {type: string}\n"
	r := compareSchema(t, parseSchema(t, before, nil), parseSchema(t, before+"required: [id, currency]\n", nil))
	ctr := r.Changerator
	require.Equal(t, "root", r.Right.Root.Id)
	require.Equal(t, "Customer", r.Right.Root.Label)
	changes := ctr.DeduplicateChanges()
	require.Len(t, changes, 2)
	for _, ch := range changes {
		require.Equal(t, "$.required", ch.Path)
		require.Equal(t, "customer.yaml", ch.SchemaResource)
		require.Equal(t, "customer.yaml", ch.Context.ModifiedDocument)
		require.Equal(t, 4, *ch.Context.NewLine)
	}
	report, err := ctr.GenerateReport(renderer.NewMarkdownRenderer(), renderer.OutputFormatMarkdown)
	require.NoError(t, err)
	require.Contains(t, report, "### ` Customer `")
	require.Contains(t, report, "$.required")
	require.Contains(t, report, "'currency'")
	require.Contains(t, report, "'id'")
	require.NotContains(t, report, "OpenAPI")
	require.NotContains(t, report, "AsyncAPI")
	html, err := ctr.GenerateHTML()
	require.NoError(t, err)
	require.Contains(t, html, "Customer")
	require.Contains(t, html, "currency")
	ctr.BuildNodeChangeTree(r.Right.Root)
	tree := renderer.NewSemanticTreeRenderer(r.Right.Root, changes, nil)
	require.Len(t, tree.Highlights(8), 2)
	for _, text := range []string{"Customer", "required", "id", "currency"} {
		require.Contains(t, tree.Render(), text)
	}
	graph, err := json.Marshal(r.Right.Root)
	require.NoError(t, err)
	require.Contains(t, string(graph), `"documentKind":"jsonschema"`)
}

func TestJSONSchemaSameEditInTwoSourceFiles(t *testing.T) {
	const root = "title: Spaces\nproperties:\n  get: {$ref: 'primary.yaml'}\n  post: {$ref: 'secondary.yaml'}\n"
	load := func(min string) *jsonschema.Document {
		config := datamodel.NewDocumentConfiguration()
		config.BasePath = "/snapshot"
		config.LocalFS = fstest.MapFS{
			"primary.yaml":   {Data: []byte("title: /spaces\nminLength: " + min + "\n")},
			"secondary.yaml": {Data: []byte("title: GET\nminLength: " + min + "\n")},
		}
		return parseSchema(t, root, config)
	}
	r := compareSchema(t, load("2"), load("3"))
	require.Len(t, r.Changerator.DeduplicateChanges(), 2)
	tree := renderer.NewSemanticTreeRenderer(r.Right.Root, r.Changerator.Changes, nil)
	require.Len(t, tree.Highlights(8), 2)
	require.Equal(t, 2, strings.Count(tree.Render(), "minLength"))
	html, err := r.Changerator.GenerateHTML()
	require.NoError(t, err)
	require.Contains(t, html, "primary.yaml")
	require.Contains(t, html, "secondary.yaml")
	require.NotContains(t, html, "<pb33f-render-operation-path")
	require.NotContains(t, html, "<pb33f-http-method")
	r.Changerator.PrepareChangeViewGraph(r.Right.Root)
	require.Equal(t, 2, r.Right.Root.SubtreeChanges.Total)
}

func TestJSONSchemaSemanticTreeShowsRootChange(t *testing.T) {
	r := compareSchema(t, parseSchema(t, "true", nil), parseSchema(t, "false", nil))
	tree := renderer.NewSemanticTreeRenderer(r.Right.Root, r.Changerator.Changes, nil)
	require.Contains(t, tree.Render(), "true -> false")
	require.Len(t, tree.Highlights(8), 1)
}

// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"encoding/json"
	"strings"
	"testing"
	"testing/fstest"

	dr "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/jsonschema"
	"github.com/pb33f/testify/require"
)

func parseSchema(t *testing.T, spec string, cfg *datamodel.DocumentConfiguration) *jsonschema.Document {
	t.Helper()
	doc, err := jsonschema.Load([]byte(spec), "customer.yaml", cfg, true)
	require.NoError(t, err)
	t.Cleanup(doc.Release)
	return doc
}

func compareSchema(t *testing.T, left, right *jsonschema.Document) *SchemaResult {
	t.Helper()
	result, err := CompareJSONSchema(left, right, nil)
	require.NoError(t, err)
	require.NotNil(t, result)
	t.Cleanup(result.Release)
	return result
}

func TestJSONSchemaReferencesAndDeletedBranch(t *testing.T) {
	const before = `title: Customer
$defs:
  "retired.kind": {type: string}
  recursive: {$ref: '#'}
prefixItems: [true]
$ref: '#/prefixItems/0'
`
	after := strings.Replace(before, `  "retired.kind": {type: string}
`, "", 1)
	r := compareSchema(t, parseSchema(t, before, nil), parseSchema(t, after, nil))
	ctr := r.Changerator
	network := assertAsyncGraphConnected(t, ctr.ChangedNodes, ctr.ChangedEdges)
	for _, ref := range []struct{ source, target, value string }{
		{"root", "$.prefixItems[0]", "#/prefixItems/0"},
		{`$["$defs"].recursive`, "root", "#"},
	} {
		edge := network[ref.source+" -> "+ref.target]
		require.NotNil(t, edge)
		require.Equal(t, ref.value, edge.Ref)
	}
	require.Len(t, ctr.Changes, 1)
	ch := ctr.Changes[0]
	require.Equal(t, `$["$defs"]["retired.kind"]`, ch.Path)
	require.Equal(t, 3, *ch.Context.OriginalLine)
	var removed *v3.Node
	for _, node := range ctr.ChangedNodes {
		if node.Label == "retired.kind" {
			removed = node
		}
	}
	require.NotNil(t, removed)
	require.Equal(t, "customer.yaml", removed.OriginLocation)
	require.Equal(t, 3, removed.ValueLine)
	require.Len(t, removed.RenderedChanges, 1)
	require.Same(t, ch, removed.RenderedChanges[0])
}

func TestJSONSchemaReferenceTargetAtOwnSource(t *testing.T) {
	root := "title: Customer\n$ref: amount.yaml\n"
	load := func(min string) *jsonschema.Document {
		config := datamodel.NewDocumentConfiguration()
		config.BasePath = "/snapshot"
		config.LocalFS = fstest.MapFS{"amount.yaml": {Data: []byte("title: Amount\nminLength: " + min + "\n")}}
		return parseSchema(t, root, config)
	}
	r := compareSchema(t, load("2"), load("3"))
	require.Len(t, r.Changerator.Changes, 1)
	ch := r.Changerator.Changes[0]
	require.Equal(t, "amount.yaml", ch.SchemaResource)
	require.Equal(t, "amount.yaml", ch.Context.ModifiedDocument)
	require.Equal(t, "amount.yaml", ch.Context.OriginalDocument)
	var target *v3.Node
	for _, n := range r.Changerator.ChangedNodes {
		if n.Label == "Amount" {
			target = n
		}
	}
	require.NotNil(t, target)
	require.Len(t, target.RenderedChanges, 1)
	require.Empty(t, r.Right.Root.RenderedChanges)
	require.Same(t, target, r.Right.SchemaChangeNode(ch, true))
	incoming := map[string]bool{}
	for _, edge := range r.Changerator.ChangedEdges {
		if edge.Sources[0] == "root" && edge.Targets[0] == target.Id {
			require.NotContains(t, incoming, edge.Id)
			incoming[edge.Id] = true
		}
	}
	require.Len(t, incoming, 2)
}

func TestJSONSchemaBooleanRoot(t *testing.T) {
	a := parseSchema(t, "true", nil)
	b := parseSchema(t, "false", nil)
	unchanged, err := CompareJSONSchema(a, a, nil)
	require.NoError(t, err)
	require.Nil(t, unchanged)
	r := compareSchema(t, a, b)
	require.Len(t, r.Changerator.Changes, 1)
	ch := r.Changerator.Changes[0]
	require.Equal(t, "$", ch.Path)
	require.True(t, ch.Breaking)
	require.Same(t, r.Left.Root, r.Left.SchemaChangeNode(ch, false))
	require.Same(t, r.Right.Root, r.Right.SchemaChangeNode(ch, true))
	graph, err := dr.NewSchemaGraph(b)
	require.NoError(t, err)
	graph.Root.RenderProps = true
	raw, err := json.Marshal(graph.Root)
	require.NoError(t, err)
	require.Contains(t, string(raw), `"instance":false`)
	graph.Release()
	require.Nil(t, graph.Root)
}

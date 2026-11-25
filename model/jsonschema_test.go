// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/jsonschema"
	"github.com/pb33f/testify/require"
)

func TestSchemaCollectionGraph(t *testing.T) {
	graph := func(files map[string][]byte) *SourceGraph {
		t.Helper()
		doc, err := jsonschema.LoadCollection(files, t.TempDir(), nil)
		require.NoError(t, err)
		t.Cleanup(doc.Release)
		d, err := NewSchemaGraph(doc)
		require.NoError(t, err)
		t.Cleanup(d.Release)
		return d
	}
	empty := graph(nil)
	require.Equal(t, "Schemas", empty.Root.Label)
	require.Equal(t, "jsonschema", empty.Root.DocumentKind)
	require.Equal(t, "root", empty.Root.Id)
	require.Nil(t, empty.Root.Origin)
	require.Len(t, empty.Nodes, 1)
	require.Empty(t, empty.Edges)

	const base = "https://schemas.example.test/"
	d := graph(map[string][]byte{
		"a.yaml": []byte("$id: " + base + "z\ntitle: Z\n$ref: " + base + "parts/#myAnchor"),
		"z.yaml": []byte("$id: " + base + "a\ntitle: A\n$defs:\n  'a/b~c':\n    $id: parts/\n    $anchor: myAnchor\n    properties:\n      x: true"),
	})
	require.Len(t, d.Root.Children, 2)
	require.Equal(t, "A", d.Root.Children[0].Label)
	require.Equal(t, "Z", d.Root.Children[1].Label)
	const resource = `schema["https://schemas.example.test/parts/"]`
	byID := make(map[string]*v3.Node)
	for _, node := range d.Nodes {
		require.NotContains(t, byID, node.Id)
		byID[node.Id] = node
	}
	embedded := byID[resource]
	require.NotNil(t, embedded)
	require.Equal(t, "#/$defs/a~1b~0c", embedded.SourcePointer)
	require.Equal(t, "$", embedded.DrInstance.(v3.Foundational).GenerateJSONPath())
	leaf := byID[resource+".properties.x"]
	require.NotNil(t, leaf)
	require.Equal(t, "$.properties.x", leaf.DrInstance.(v3.Foundational).GenerateJSONPath())
	require.Equal(t, "z.yaml", leaf.OriginLocation)
	require.Equal(t, "#/$defs/a~1b~0c/properties/x", leaf.SourcePointer)
	var uses int
	for _, edge := range d.Edges {
		if edge.Ref == base+"parts/#myAnchor" {
			uses++
			require.Equal(t, []string{d.Root.Children[1].Id}, edge.Sources)
			require.Equal(t, []string{embedded.Id}, edge.Targets)
		}
	}
	require.Equal(t, 1, uses)
}

func TestSchemaGraphTwoReferencesAtOneSite(t *testing.T) {
	doc, err := jsonschema.Load([]byte("$defs: {value: {$anchor: value}}\n$ref: '#value'\n$dynamicRef: '#value'"), "schema.yaml", nil, true)
	require.NoError(t, err)
	defer doc.Release()
	graph, err := NewSchemaGraph(doc)
	require.NoError(t, err)
	defer graph.Release()
	var ids []string
	for _, edge := range graph.Edges {
		if edge.Ref == "#value" {
			require.Equal(t, []string{"root"}, edge.Sources)
			require.Equal(t, []string{`$["$defs"].value`}, edge.Targets)
			ids = append(ids, edge.Id)
		}
	}
	require.ElementsMatch(t, []string{"ref:root", "ref:$dynamicRef:root"}, ids)
}

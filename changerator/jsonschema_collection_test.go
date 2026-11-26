// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/jsonschema"
	wc "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/require"
)

func schemaCollection(t *testing.T, files map[string][]byte) *jsonschema.Document {
	t.Helper()
	d, err := jsonschema.LoadCollection(files, t.TempDir(), nil)
	require.NoError(t, err)
	t.Cleanup(d.Release)
	return d
}

func TestJSONSchemaCollectionSharedDefinition(t *testing.T) {
	const moneyID = "https://schemas.example.test/money"
	snapshot := func(path, bound string) *jsonschema.Document {
		return schemaCollection(t, map[string][]byte{
			path:             []byte("$id: " + moneyID + "\ntitle: Money\nproperties:\n  currency:\n    minLength: " + bound + "\n  next: {$ref: ''}"),
			"order.yaml":     []byte("$id: https://schemas.example.test/order\ntitle: Order\nproperties:\n  price: {$ref: " + moneyID + "}"),
			"invoice.yaml":   []byte("$id: https://schemas.example.test/invoice\ntitle: Invoice\nproperties:\n  total: {$ref: " + moneyID + "}"),
			"unrelated.yaml": []byte("title: Unrelated"),
		})
	}
	r := compareSchema(t, snapshot("original/money.yaml", "2"), snapshot("changes/money.yaml", "3"))
	c := r.Changerator
	require.Len(t, c.Changes, 1)
	ch := c.Changes[0]
	require.True(t, ch.Breaking)
	require.Equal(t, moneyID, ch.SchemaResource)
	require.Equal(t, "$.properties.currency.minLength", ch.Path)
	require.Equal(t, "original/money.yaml", ch.Context.OriginalDocument)
	require.Equal(t, "changes/money.yaml", ch.Context.ModifiedDocument)
	require.Equal(t, "Money", c.SchemaLabels[moneyID])
	nodes := c.ChangedNodes
	require.Len(t, r.Right.Root.Children, 4)
	edges := assertAsyncGraphConnected(t, nodes, c.ChangedEdges)
	c.PrepareChangeViewGraph(r.Right.Root)
	require.Len(t, r.Right.Root.Children, 3)
	require.Equal(t, 1, r.Right.Root.SubtreeChanges.Total)
	require.Equal(t, 1, r.Right.Root.SubtreeChanges.Breaking)
	visible := make(map[string]*v3.Node)
	for _, node := range c.ChangedNodes {
		require.NotContains(t, visible, node.Id)
		visible[node.Id] = node
	}
	const target = `schema["https://schemas.example.test/money"]`
	for _, site := range []string{
		`schema["https://schemas.example.test/order"].properties.price`,
		`schema["https://schemas.example.test/invoice"].properties.total`,
		target + ".properties.next",
	} {
		require.Contains(t, visible, site)
		require.Empty(t, visible[site].RenderedChanges)
		require.Equal(t, 0, visible[site].SubtreeChanges.Total)
		use := edges[site+" -> "+target]
		require.NotNil(t, use)
		require.Equal(t, "ref:"+site, use.Id)
	}
	require.NotContains(t, visible, `schema["unrelated.yaml"]`)
	definition := visible[target+".properties.currency"]
	require.Same(t, ch, definition.RenderedChanges[0])
	require.Equal(t, "#/properties/currency", definition.SourcePointer)
	require.Equal(t, ch.Context.ModifiedDocument, definition.OriginLocation)
}

func TestJSONSchemaCollectionRemovedMember(t *testing.T) {
	empty := schemaCollection(t, nil)
	original := schemaCollection(t, map[string][]byte{"obsolete.yaml": []byte("properties:\n  old: false")})
	r := compareSchema(t, original, empty)
	require.Len(t, r.Changerator.Changes, 1)
	ch := r.Changerator.Changes[0]
	require.Equal(t, "obsolete.yaml", ch.SchemaResource)
	require.Equal(t, "obsolete.yaml", ch.Context.OriginalDocument)
	require.Equal(t, "", ch.Context.ModifiedDocument)
	require.Equal(t, "$", ch.Path)
	require.Len(t, r.Right.Root.Children, 1)
	removed := r.Right.Root.Children[0]
	require.Equal(t, "obsolete.yaml", removed.Label)
	require.Equal(t, 1, removed.ValueLine)
	require.Equal(t, "obsolete.yaml", removed.OriginLocation)
	require.Same(t, ch, removed.RenderedChanges[0])
	assertAsyncGraphConnected(t, r.Changerator.ChangedNodes, r.Changerator.ChangedEdges)

	r = compareSchema(t, empty, original)
	require.Len(t, r.Changerator.Changes, 1)
	ch = r.Changerator.Changes[0]
	require.Equal(t, "obsolete.yaml", ch.Context.ModifiedDocument)
	require.Equal(t, "", ch.Context.OriginalDocument)
	require.Same(t, ch, r.Right.Root.Children[0].RenderedChanges[0])
}

func TestJSONSchemaCollectionRetargetedSite(t *testing.T) {
	snapshot := func(id string) *jsonschema.Document {
		return schemaCollection(t, map[string][]byte{
			"site.yaml": []byte("title: Site\n$ref: " + id),
			"old.yaml":  []byte("true"),
			"new.yaml":  []byte("false"),
		})
	}
	r := compareSchema(t, snapshot("old.yaml"), snapshot("new.yaml"))
	require.Len(t, r.Changerator.Changes, 1)
	var refs int
	for _, edge := range r.Changerator.ChangedEdges {
		if edge.IsReference() {
			refs++
			require.Equal(t, "new.yaml", edge.Ref)
			require.Equal(t, []string{`schema["new.yaml"]`}, edge.Targets)
		}
	}
	require.Equal(t, 1, refs)
}

func TestJSONSchemaCollectionMovedEmbeddedDefinition(t *testing.T) {
	left := schemaCollection(t, map[string][]byte{
		"old.yaml": []byte("title: Old\n$defs:\n  part: {$id: urn:part, minLength: 2}"),
	})
	right := schemaCollection(t, map[string][]byte{
		"part.yaml": []byte("$id: urn:part\nminLength: 3"),
	})
	r := compareSchema(t, left, right)
	c := r.Changerator
	require.Len(t, c.Changes, 2)
	var nodes []*v3.Node
	collectNodes(r.Right.Root, &nodes)
	edges := assertAsyncGraphConnected(t, nodes, c.ChangedEdges)
	require.NotContains(t, edges, `schema["old.yaml"]["$defs"] -> schema["urn:part"]`)
	c.PrepareChangeViewGraph(r.Right.Root)
	require.Equal(t, 2, r.Right.Root.SubtreeChanges.Total)
}

func TestJSONSchemaCollectionRenamedID(t *testing.T) {
	left := schemaCollection(t, map[string][]byte{"member.yaml": []byte("$id: urn:old\nproperties: {gone: true}")})
	right := schemaCollection(t, map[string][]byte{"member.yaml": []byte("$id: urn:new")})
	r := compareSchema(t, left, right)
	require.Len(t, r.Changerator.Changes, 2)
	require.Len(t, r.Right.Root.Children, 1)
	require.Equal(t, `schema["urn:new"]`, r.Right.Root.Children[0].Id)
	var nodes []*v3.Node
	collectNodes(r.Right.Root, &nodes)
	assertAsyncGraphConnected(t, nodes, r.Changerator.ChangedEdges)
	for _, node := range nodes {
		require.NotContains(t, node.Id, "urn:old")
	}
	r.Changerator.PrepareChangeViewGraph(r.Right.Root)
	require.Equal(t, 2, r.Right.Root.SubtreeChanges.Total)
}

func TestJSONSchemaEmbeddedResourceAddsOrDropsID(t *testing.T) {
	inline := schemaCollection(t, map[string][]byte{"member.yaml": []byte("properties: {field: {type: string}}")})
	named := schemaCollection(t, map[string][]byte{"member.yaml": []byte("properties: {field: {$id: urn:field, type: string}}")})
	for _, tc := range []struct {
		name        string
		left, right *jsonschema.Document
		id          string
	}{
		{"added", inline, named, `schema["urn:field"]`},
		{"dropped", named, inline, `schema["member.yaml"].properties.field`},
	} {
		t.Run(tc.name, func(t *testing.T) {
			r := compareSchema(t, tc.left, tc.right)
			require.Len(t, r.Changerator.Changes, 1)
			properties := r.Right.Root.Children[0].Children[0]
			require.Len(t, properties.Children, 1)
			field := properties.Children[0]
			require.Equal(t, tc.id, field.Id)
			require.Equal(t, "#/properties/field", field.SourcePointer)
			require.Same(t, r.Changerator.Changes[0], field.RenderedChanges[0])
		})
	}
}

func TestJSONSchemaUnlocatedChangeStaysInReport(t *testing.T) {
	snapshot := func(bound string) *jsonschema.Document {
		return schemaCollection(t, map[string][]byte{"money.yaml": []byte("minLength: " + bound)})
	}
	r := compareSchema(t, snapshot("2"), snapshot("3"))
	byID := make(map[string]*v3.Node, len(r.Right.Nodes))
	for _, n := range r.Right.Nodes {
		byID[n.Id] = n
	}
	line := 99
	nowhere := &wc.ChangeContext{OriginalDocument: "money.yaml", ModifiedDocument: "money.yaml", OriginalLine: &line, OriginalColumn: &line, NewLine: &line, NewColumn: &line}
	member := schemaChangeNode(r.Left, r.Right, byID, &wc.Change{SchemaResource: "money.yaml", Context: nowhere})
	require.Same(t, byID[`schema["money.yaml"]`], member)
	require.Same(t, r.Right.Root, schemaChangeNode(r.Left, r.Right, byID, &wc.Change{SchemaResource: "gone.yaml", Context: nowhere}))
}

// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"encoding/json"
	"strings"
	"testing"

	dr "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/testify/require"
)

const asyncSharedSchemaFixture = `asyncapi: 3.0.0
info: {title: Synthetic events, version: 1.0.0}
channels:
  orders:
    address: orders.v1
    messages:
      created:
        payload: {$ref: '#/components/schemas/Order'}
      updated:
        payload: {$ref: '#/components/schemas/Order'}
components:
  schemas:
    Order:
      type: object
      properties:
        id: {type: string}
`

func assertAsyncGraphConnected(t *testing.T, nodes []*v3.Node, edges []*v3.Edge) map[string]*v3.Edge {
	t.Helper()
	byID := make(map[string]*v3.Node, len(nodes))
	for _, n := range nodes {
		require.NotContains(t, byID, n.Id)
		byID[n.Id] = n
	}
	byPair := make(map[string]*v3.Edge, len(edges))
	ids := make(map[string]bool, len(edges))
	for _, e := range edges {
		require.NotEmpty(t, e.Id)
		require.False(t, ids[e.Id], "duplicate edge %s", e.Id)
		ids[e.Id] = true
		require.Len(t, e.Sources, 1)
		require.Len(t, e.Targets, 1)
		require.Contains(t, byID, e.Sources[0])
		require.Contains(t, byID, e.Targets[0])
		byPair[e.Sources[0]+" -> "+e.Targets[0]] = e
	}
	for _, n := range nodes {
		if n.ParentId != "" {
			require.Contains(t, byPair, n.ParentId+" -> "+n.Id, "missing containment for %s", n.Id)
		}
	}
	return byPair
}

func TestAsyncAPIExplorerEdgesAndSharedChangeOwnership(t *testing.T) {
	next := strings.NewReplacer("type: string", "type: integer", "orders.v1", "orders.v2").Replace(asyncSharedSchemaFixture)
	result := compareAsyncReportFixture(t, asyncSharedSchemaFixture, next)
	edges := assertAsyncGraphConnected(t, result.Changerator.ChangedNodes, result.Changerator.ChangedEdges)
	for _, name := range []string{"created", "updated"} {
		message := "$.channels.orders.messages." + name
		require.Equal(t, "#/components/schemas/Order", edges[message+" -> "+message+".payload"].Ref)
		require.Equal(t, "#/components/schemas/Order", edges[message+".payload -> $.components.schemas.Order"].Ref)
	}
	// Machine reports retain every native comparison, but UI timelines do not
	// repeat the same definition change for each reference that reaches it.
	require.Len(t, result.Changes.GetAllChanges(), 4)
	require.Len(t, result.Changerator.DeduplicateChanges(), 2)
	var leaf *v3.Node
	for _, n := range result.Changerator.ChangedNodes {
		if n.Id == "$.components.schemas.Order.properties.id" {
			leaf = n
		}
	}
	require.NotNil(t, leaf)
	require.Len(t, leaf.RenderedChanges, 1)
	require.Len(t, leaf.CleanedChanged, 1)
	result.Changerator.PrepareChangeViewGraph(result.Right.Root)
	require.Equal(t, 2, result.Right.Root.SubtreeChanges.Total)
	require.Equal(t, 2, result.Right.Root.SubtreeChanges.Breaking)
}

func TestAsyncAPIExplorerRetainsRemovedEdgesWithoutOldReferenceTargets(t *testing.T) {
	old := `asyncapi: 3.0.0
info: {title: Events, version: 1.0.0}
channels:
  old:
    address: old
    messages:
      event: {payload: {$ref: '#/components/schemas/Shared'}}
  current: {address: current}
operations:
  consume:
    action: receive
    channel: {$ref: '#/channels/old'}
components:
  schemas:
    Shared: {type: string}
`
	next := strings.Replace(old, "  old:\n    address: old\n    messages:\n      event: {payload: {$ref: '#/components/schemas/Shared'}}\n", "", 1)
	next = strings.Replace(next, "#/channels/old", "#/channels/current", 1)
	result := compareAsyncReportFixture(t, old, next)
	edges := assertAsyncGraphConnected(t, result.Changerator.ChangedNodes, result.Changerator.ChangedEdges)
	require.Contains(t, edges, "$.channels -> $.channels.old")
	require.Contains(t, edges, "$.channels.old.messages.event -> $.channels.old.messages.event.payload")
	require.Contains(t, edges, "$.channels.old.messages.event.payload -> $.components.schemas.Shared")
	require.Contains(t, edges, "$.operations.consume.channel -> $.channels.current")
	require.NotContains(t, edges, "$.operations.consume.channel -> $.channels.old")
}

func TestAsyncAPIExplorerKeepsDistinctEditsOnOneProperty(t *testing.T) {
	old := strings.Replace(asyncSharedSchemaFixture, "id: {type: string}", "id: {type: string, enum: [old]}", 1)
	result := compareAsyncReportFixture(t, old, strings.Replace(old, "enum: [old]", "enum: [new]", 1))
	for _, n := range result.Changerator.ChangedNodes {
		if n.Id == "$.components.schemas.Order.properties.id.enum" {
			require.Len(t, n.RenderedChanges, 2, "enum removal and addition are distinct changes")
			return
		}
	}
	t.Fatal("schema property missing")
}

func TestAsyncAPIGraphSerializesUnrepresentableValues(t *testing.T) {
	for name, value := range map[string]string{
		"positive infinity": "maximum: .inf",
		"not a number":      "maximum: .nan",
		"complex key":       "x-m: {[a, b]: 1}",
		"bad tag":           "x-m: !!int abc",
	} {
		t.Run(name, func(t *testing.T) {
			source := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\ncomponents:\n  schemas:\n    S:\n      type: number\n      " + value + "\n"
			doc, err := libasyncapi.NewDocument([]byte(source))
			require.NoError(t, err)
			require.False(t, doc.IsPartial(), "%v", doc.Errors())
			graph, err := dr.NewAsyncDocument(doc)
			require.NoError(t, err)
			defer graph.Release()
			for _, node := range graph.Nodes {
				node.RenderProps = true
			}
			_, err = json.Marshal(graph.Nodes)
			require.NoError(t, err)
		})
	}
}

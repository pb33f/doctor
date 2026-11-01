// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"encoding/json"
	"strings"
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestChangeViewCardRowsMatchSerializedContent(t *testing.T) {
	doc, err := libopenapi.NewDocument([]byte("openapi: 3.1.0\ninfo:\n  title: Events\n  version: '1'\n  x-owner: synthetic\npaths: {}\n"))
	require.NoError(t, err)
	built, err := doc.BuildV3Model()
	require.NoError(t, err)
	for _, tc := range []struct {
		name string
		node *v3.Node
		rows int
	}{
		{"changed leaf", &v3.Node{RenderedChanges: []*model.Change{{ChangeType: model.Modified}}}, 1},
		{"changed children", &v3.Node{ChildChangeSummaries: []*v3.ChildChangeSummary{{Label: "orders"}}}, 2},
		{"explicit extensions", &v3.Node{Extensions: 2}, 2},
		{"typed OpenAPI extensions", &v3.Node{Instance: built.Model.Info}, 2},
		{"document extension metadata", &v3.Node{Instance: map[string]interface{}{"extensions": 2}}, 2},
		{"children and extensions", &v3.Node{Extensions: 1, ChildChangeSummaries: []*v3.ChildChangeSummary{{Label: "orders"}}}, 3},
		{"component name is not metadata", &v3.Node{Instance: map[string]interface{}{"x-order": map[string]interface{}{}}}, 1},
	} {
		t.Run(tc.name, func(t *testing.T) {
			recalculateChangeViewDimensions(tc.node)
			encoded, err := json.Marshal(tc.node)
			require.NoError(t, err)
			var wire struct {
				Height     int               `json:"height"`
				Extensions int               `json:"extensions"`
				Children   []json.RawMessage `json:"childChanges"`
			}
			require.NoError(t, json.Unmarshal(encoded, &wire))
			rows := 1 + len(wire.Children)
			if wire.Extensions > 0 {
				rows++
			}
			assert.Equal(t, tc.rows, rows)
			assert.Equal(t, rows*v3.HEIGHT, wire.Height)
		})
	}
}

func TestChangeViewWidthsFollowVisibleLabels(t *testing.T) {
	label := strings.Repeat("orders", 5)
	for _, action := range []string{"send", "receive"} {
		var source yaml.Node
		require.NoError(t, yaml.Unmarshal([]byte("action: "+action), &source))
		for _, instance := range []any{source.Content[0], map[string]interface{}{"action": action}} {
			child := &v3.Node{Label: label, Type: "operation", Instance: instance, SubtreeChanges: &v3.ChangeSummary{Total: 1}}
			parent := &v3.Node{Children: []*v3.Node{child}, ChildChangeSummaries: []*v3.ChildChangeSummary{{Label: label}}}
			recalculateChangeViewDimensions(parent)
			assert.GreaterOrEqual(t, child.Width, len(label)*v3.CHAR_WIDTH+90+len(action)*v3.CHAR_WIDTH+24)
			assert.GreaterOrEqual(t, parent.Width, len(label)*v3.CHAR_WIDTH+65+len(action)*v3.CHAR_WIDTH+24)
		}
	}
	plain := &v3.Node{ChildChangeSummaries: []*v3.ChildChangeSummary{{Label: label}}}
	annotated := &v3.Node{ChildChangeSummaries: []*v3.ChildChangeSummary{{Label: label, Changes: &v3.ChangeSummary{Breaking: 1, Modifications: 1}}}}
	recalculateChangeViewDimensions(plain)
	recalculateChangeViewDimensions(annotated)
	assert.Equal(t, plain.Width, annotated.Width, "annotations outside the card must not widen its rows")
	for _, label := range []string{"AsyncAPI", "Document"} {
		node := &v3.Node{Type: "document", Label: label}
		recalculateChangeViewDimensions(node)
		assert.GreaterOrEqual(t, node.Width, len("OpenAPI Document")*v3.CHAR_WIDTH+90)
	}
}

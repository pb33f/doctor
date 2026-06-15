// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package terminal

import (
	"bytes"
	"testing"

	"github.com/pb33f/testify/assert"
)

func TestRenderBoxDeterministic(t *testing.T) {
	rendered := RenderBox("hello", BoxOptions{Title: "Greeting"})

	assert.Equal(t, "┌ Greeting ┐\n│ hello    │\n└──────────┘", rendered)
}

func TestRenderBoxPadding(t *testing.T) {
	rendered := RenderBox("hello", BoxOptions{
		Title:         "Greeting",
		PaddingLeft:   2,
		PaddingRight:  3,
		PaddingTop:    1,
		PaddingBottom: 1,
	})

	assert.Equal(t, "┌ Greeting ┐\n│          │\n│  hello   │\n│          │\n└──────────┘", rendered)
}

func TestRenderPanelGridAlignsCells(t *testing.T) {
	left := RenderBox("api", BoxOptions{Title: "Gateway"})
	right := RenderBox("monitor\nui", BoxOptions{Title: "Monitor"})

	rendered := RenderPanelGrid([][]string{{left, right}}, PanelOptions{Gap: 2})

	assert.Equal(t, "┌ Gateway ┐  ┌ Monitor ┐\n│ api     │  │ monitor │\n└─────────┘  │ ui      │\n             └─────────┘", rendered)
}

func TestRenderBulletListDeterministic(t *testing.T) {
	rendered := RenderBulletList([]BulletListItem{
		{Level: 0, Text: "contract violation"},
		{Level: 1, Text: "Reason: invalid response"},
		{Level: 2, Text: "expected string"},
	})

	assert.Equal(t, "• contract violation\n  • Reason: invalid response\n    • expected string", rendered)
}

func TestFprintBulletListWritesNothingForEmptyList(t *testing.T) {
	var buf bytes.Buffer

	FprintBulletList(&buf, nil)

	assert.Empty(t, buf.String())
}

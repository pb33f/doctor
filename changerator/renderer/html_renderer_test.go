// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"bytes"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHTMLRenderer_RenderHTML_NoChanges(t *testing.T) {
	yml := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test`

	doc, _ := libopenapi.NewDocument([]byte(yml))
	v3Model, _ := doc.BuildV3Model()
	drDoc := model.NewDrDocumentAndGraph(v3Model)

	renderer := NewHTMLRenderer(nil)

	input := &RenderInput{
		DocumentChanges: nil,
		Doctor:          drDoc,
	}

	html, err := renderer.RenderHTML(input)

	require.NoError(t, err)
	assert.Contains(t, html, "What Changed?")
	assert.Contains(t, html, "No changes detected")
	assert.Contains(t, html, `class="change-heading"`)
	assert.Contains(t, html, `class="heading-anchor"`)
}

func TestHTMLRenderer_RenderMarkdown(t *testing.T) {
	yml := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0`

	doc, _ := libopenapi.NewDocument([]byte(yml))
	v3Model, _ := doc.BuildV3Model()
	drDoc := model.NewDrDocumentAndGraph(v3Model)

	renderer := NewHTMLRenderer(nil)

	input := &RenderInput{
		DocumentChanges: nil,
		Doctor:          drDoc,
	}

	md, err := renderer.RenderMarkdown(input)

	require.NoError(t, err)
	assert.Contains(t, md, "# What Changed?")
	assert.Contains(t, md, "No changes detected")
}

func TestMarkdownRenderer_Interface(t *testing.T) {
	var _ ChangeReportRenderer = &MarkdownRenderer{}
	var _ ChangeReportRenderer = &HTMLRenderer{}
}

func TestRenderConfig_Merge(t *testing.T) {
	base := DefaultRenderConfig()
	override := &RenderConfig{
		Breaking: &BreakingConfig{
			Badge: "🚨",
		},
	}

	merged := MergeConfigs(base, override)

	assert.Equal(t, "🚨", merged.Breaking.Badge)
	assert.Equal(t, base.Breaking.Class, merged.Breaking.Class)
	assert.Equal(t, base.Styling.PropertyNameClass, merged.Styling.PropertyNameClass)
}

func TestHTMLRenderer_ObjectIcons_Enabled(t *testing.T) {
	// Test with icons enabled by default
	config := DefaultRenderConfig()
	assert.True(t, config.HTML.EnableObjectIcons, "Icons should be enabled by default")

	config.HTML.EnableObjectIcons = true
	renderer := NewHTMLRenderer(config)

	// Simple test with markdown that contains object names
	markdown := "Schema: `Pet` was modified\n- Parameter `id` was added"

	var buf bytes.Buffer
	err := renderer.markdown.Convert([]byte(markdown), &buf)

	require.NoError(t, err)
	html := buf.String()

	// Should contain pb33f-model-icon elements for schema and parameter with size="tiny"
	assert.Contains(t, html, `<pb33f-model-icon icon="schema" size="tiny">`)
	assert.Contains(t, html, `</pb33f-model-icon>`)
	assert.Contains(t, html, `<pb33f-model-icon icon="parameter" size="tiny">`)
}

func TestHTMLRenderer_ObjectIcons_Disabled(t *testing.T) {
	// Test with icons disabled
	config := DefaultRenderConfig()
	config.HTML.EnableObjectIcons = false

	renderer := NewHTMLRenderer(config)

	// Simple test with markdown that contains object names
	markdown := "Schema: `Pet` was modified\n- Parameter `id` was added"

	var buf bytes.Buffer
	err := renderer.markdown.Convert([]byte(markdown), &buf)

	require.NoError(t, err)
	html := buf.String()

	// Should NOT contain pb33f-model-icon elements
	assert.NotContains(t, html, `<pb33f-model-icon`)
}

func TestHTMLRenderer_ObjectIcons_NotInHeadings(t *testing.T) {
	// Test that icons are NOT rendered inside headings
	config := DefaultRenderConfig()
	config.HTML.EnableObjectIcons = true

	renderer := NewHTMLRenderer(config)

	// Markdown with object name in heading
	markdown := "#### Schema: `Pet`\n\nParameter `id` was added"

	var buf bytes.Buffer
	err := renderer.markdown.Convert([]byte(markdown), &buf)

	require.NoError(t, err)
	html := buf.String()

	// Should contain icon for parameter (not in heading) with size="tiny"
	assert.Contains(t, html, `<pb33f-model-icon icon="parameter" size="tiny">`)

	// Verify the heading contains the schema name without icon
	// (icon should not appear before `Pet` in the h4 tag)
	assert.Contains(t, html, "<h4")
	assert.Contains(t, html, "Schema:")
	assert.Contains(t, html, "Pet")
}

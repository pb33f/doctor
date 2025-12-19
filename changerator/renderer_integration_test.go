// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package changerator

import (
	"testing"

	"github.com/pb33f/doctor/changerator/renderer"
	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestChangerator_NewRendererAPI(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API Modified
  version: 2.0.0
paths:
  /test:
    get:
      summary: Updated endpoint`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	t.Run("default_markdown_renderer", func(t *testing.T) {
		mdRenderer := renderer.NewMarkdownRenderer()
		report, err := cd.GenerateReport(mdRenderer, renderer.OutputFormatMarkdown)

		require.NoError(t, err)
		assert.Contains(t, report, "# What Changed Report")
		assert.Contains(t, report, "Test API Modified")
	})

	t.Run("default_html_renderer", func(t *testing.T) {
		htmlRenderer := renderer.NewHTMLRenderer(nil)
		report, err := cd.GenerateReport(htmlRenderer, renderer.OutputFormatHTML)

		require.NoError(t, err)
		assert.Contains(t, report, "<h1")
		assert.Contains(t, report, "What Changed Report")
		assert.Contains(t, report, "Test API Modified")
		assert.Contains(t, report, `class="change-heading"`)
	})

	t.Run("custom_config", func(t *testing.T) {
		config := &renderer.RenderConfig{
			Breaking: &renderer.BreakingConfig{
				Badge: "🚨",
				Class: "custom-breaking",
			},
			HTML: &renderer.HTMLConfig{
				HeadingClass: "my-heading",
			},
		}

		htmlRenderer := renderer.NewHTMLRenderer(config)
		report, err := cd.GenerateReportWithConfig(htmlRenderer, renderer.OutputFormatHTML, config)

		require.NoError(t, err)
		assert.Contains(t, report, `class="my-heading"`)
	})

	t.Run("convenience_method_html", func(t *testing.T) {
		report, err := cd.GenerateHTML()

		require.NoError(t, err)
		assert.Contains(t, report, "<h1")
		assert.Contains(t, report, "What Changed Report")
	})

	t.Run("backward_compat_markdown", func(t *testing.T) {
		report := cd.GenerateMarkdownReport()

		assert.Contains(t, report, "# What Changed Report")
		assert.Contains(t, report, "Test API Modified")
	})
}

func TestChangerator_ExampleRendering_EncodedValues(t *testing.T) {
	// Test that examples with complex values (objects/arrays) are rendered as YAML code blocks
	// and scalar examples are rendered inline
	ymlLeft := `openapi: "3.1.0"
info:
  title: Example Test API
  version: 1.0.0
paths:
  /pets:
    get:
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
              examples:
                simple:
                  value: "just a string"
                complex:
                  value:
                    id: 1
                    name: "Fluffy"
                    tags: ["cat", "pet"]`

	ymlRight := `openapi: "3.1.0"
info:
  title: Example Test API
  version: 1.0.0
paths:
  /pets:
    get:
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
              examples:
                simple:
                  value: "updated string"
                complex:
                  value:
                    id: 2
                    name: "Spot"
                    tags: ["dog", "pet"]
                    owner:
                      name: "John"
                      email: "john@example.com"`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	t.Run("markdown_complex_example_as_yaml_block", func(t *testing.T) {
		mdRenderer := renderer.NewMarkdownRenderer()
		report, err := cd.GenerateReport(mdRenderer, renderer.OutputFormatMarkdown)

		require.NoError(t, err)

		// Complex example should be rendered as YAML code block
		assert.Contains(t, report, "```yaml", "Complex example should use YAML code block")
		assert.Contains(t, report, "id: 2", "Complex example should contain object properties")
		assert.Contains(t, report, "name: Spot", "Complex example should contain nested values")
		assert.Contains(t, report, "owner:", "Complex example should contain nested objects")
	})

	t.Run("markdown_scalar_example_inline", func(t *testing.T) {
		mdRenderer := renderer.NewMarkdownRenderer()
		report, err := cd.GenerateReport(mdRenderer, renderer.OutputFormatMarkdown)

		require.NoError(t, err)

		// Scalar example should be rendered inline (not as code block)
		assert.Contains(t, report, "updated string", "Scalar example should appear in report")
		// Verify it's NOT in a code block by checking it's in inline format
		assert.Contains(t, report, "*'updated string'*", "Scalar example should use inline format")
	})

	t.Run("html_complex_example_preserves_yaml", func(t *testing.T) {
		htmlRenderer := renderer.NewHTMLRenderer(nil)
		report, err := cd.GenerateReport(htmlRenderer, renderer.OutputFormatHTML)

		require.NoError(t, err)

		// Complex example should be in a code element with language-yaml class
		assert.Contains(t, report, `class="language-yaml"`, "Complex example should have YAML language class")
		assert.Contains(t, report, "id: 2", "Complex example should contain object properties")
		assert.Contains(t, report, "name: Spot", "Complex example should contain nested values")
	})
}

func TestChangerator_BreakingChangeWithCodeBlock(t *testing.T) {
	// Test that breaking changes with code blocks place the breaking indicator on a separate line
	// This prevents markdown syntax errors where ``` **(💔 breaking)** breaks the fence
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
x-speakeasy-retries:
  strategy: backoff
  backoff:
    initialInterval: 500
    maxInterval: 60000
  statusCodes:
    - 5XX`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	t.Run("markdown_breaking_indicator_on_separate_line", func(t *testing.T) {
		mdRenderer := renderer.NewMarkdownRenderer()
		report, err := cd.GenerateReport(mdRenderer, renderer.OutputFormatMarkdown)

		require.NoError(t, err)

		// Breaking indicator should be on a separate line after code block
		assert.Contains(t, report, "```yaml", "Should have YAML code block")
		assert.Contains(t, report, "```\n\n**(💔 breaking)**", "Breaking indicator should be on separate line after code block")
		assert.NotContains(t, report, "``` **(💔 breaking)**", "Breaking indicator should NOT be on same line as closing fence")
	})

	t.Run("html_renders_correctly", func(t *testing.T) {
		htmlRenderer := renderer.NewHTMLRenderer(nil)
		report, err := cd.GenerateReport(htmlRenderer, renderer.OutputFormatHTML)

		require.NoError(t, err)

		// HTML should properly close the code block and show breaking indicator
		assert.Contains(t, report, `class="language-yaml"`, "Should have YAML code block")
		assert.Contains(t, report, "</code></pre></div>", "Code block should be properly closed")
		assert.Contains(t, report, "💔 breaking", "Should contain breaking indicator")
		// Verify the entire structure doesn't get swallowed into the code block
		assert.NotContains(t, report, "</code></pre></div> **(💔 breaking)**", "Shouldn't have raw markdown in HTML")
	})
}

func TestChangerator_ExtensionPhantomChangeBugFix(t *testing.T) {
	// Test that unchanged extensions don't appear as phantom changes
	// Bug: CheckPropertiesWithEncoding was calling addition/removal checks for existing extensions
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test
x-unchanged:
  key: value1
  nested:
    data: original
x-modified:
  count: 1`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test
x-unchanged:
  key: value1
  nested:
    data: original
x-modified:
  count: 2`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	docChanges := cd.Changerate()

	if docChanges == nil {
		t.Fatal("docChanges is nil - no changes detected at all")
	}

	if docChanges.ExtensionChanges == nil {
		t.Log("ExtensionChanges is nil - checking if any other changes detected:")
		t.Logf("  Total changes: %d", docChanges.TotalChanges())
		t.Fatal("Should have extension changes")
	}

	// Should have exactly 1 change (x-modified), not 2 (phantom x-unchanged)
	assert.Equal(t, 1, docChanges.ExtensionChanges.TotalChanges(),
		"Should only detect 1 changed extension (x-modified), not phantom x-unchanged")

	// Verify it's the correct extension
	changes := docChanges.ExtensionChanges.GetAllChanges()
	assert.Len(t, changes, 1, "Should have exactly 1 change")
	assert.Equal(t, "x-modified", changes[0].Property, "Changed extension should be x-modified")
}

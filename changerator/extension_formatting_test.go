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

func TestExtensionFormatting_JSONExtension_Integration(t *testing.T) {
	// Original spec with a simple extension
	originalSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  x-custom-config: "simple string"
paths:
  /test:
    get:
      summary: Test endpoint`

	// Updated spec with a complex JSON extension
	updatedSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  x-custom-config: {"auth":{"type":"oauth2","flows":{"implicit":{"url":"https://example.com/oauth","scopes":{"read":"Read access","write":"Write access"}}}},"rateLimit":{"requests":1000,"period":"hour"},"features":["caching","compression","monitoring"]}
paths:
  /test:
    get:
      summary: Test endpoint`

	// Build documents
	l, _ := libopenapi.NewDocument([]byte(originalSpec))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(updatedSpec))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	// Create changerator
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:       leftDoc.V3Document,
		RightDrDoc:      rightDoc.V3Document,
		Doctor:          rightDoc,
		RightDocContent: []byte(updatedSpec),
	})

	docChanges := cd.Changerate()

	require.NotNil(t, docChanges)
	assert.Greater(t, docChanges.TotalChanges(), 0)

	// Generate markdown report
	reporter := renderer.NewMarkdownReporter(docChanges, rightDoc, []byte(updatedSpec), nil)
	markdown := reporter.Generate()

	// Verify the markdown contains formatted code block
	assert.Contains(t, markdown, "Extension `x-custom-config`")
	// Since source document is YAML, JSON extension should be converted to YAML
	assert.Contains(t, markdown, "```yaml")
	assert.Contains(t, markdown, "auth:")
	assert.Contains(t, markdown, "oauth2")
	assert.Contains(t, markdown, "rateLimit:")
	assert.Contains(t, markdown, "requests:")

	// Verify YAML formatting (indentation with spaces, not JSON quotes)
	assert.Contains(t, markdown, "    type: oauth2")
	assert.Contains(t, markdown, "    period: hour")

	// Verify it's not inline (should not have the value in single quotes)
	assert.NotContains(t, markdown, "*'{\"auth\"")
}

func TestExtensionFormatting_PlainTextExtension_Integration(t *testing.T) {
	// Original spec
	originalSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  x-api-id: "old-id-123"
paths:
  /test:
    get:
      summary: Test endpoint`

	// Updated spec with plain text extension
	updatedSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  x-api-id: "new-id-456"
paths:
  /test:
    get:
      summary: Test endpoint`

	// Build documents
	l, _ := libopenapi.NewDocument([]byte(originalSpec))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(updatedSpec))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	// Create changerator
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:       leftDoc.V3Document,
		RightDrDoc:      rightDoc.V3Document,
		Doctor:          rightDoc,
		RightDocContent: []byte(updatedSpec),
	})

	docChanges := cd.Changerate()

	require.NotNil(t, docChanges)
	assert.Greater(t, docChanges.TotalChanges(), 0)

	// Generate markdown report
	reporter := renderer.NewMarkdownReporter(docChanges, rightDoc, []byte(updatedSpec), nil)
	markdown := reporter.Generate()

	// Verify plain text extension is formatted inline (not as code block)
	assert.Contains(t, markdown, "Extension `x-api-id`")
	assert.Contains(t, markdown, "new-id-456")

	// Should NOT contain code block for plain text
	assert.NotContains(t, markdown, "```json")
	assert.NotContains(t, markdown, "```yaml")

	// Should be inline with quotes
	assert.Contains(t, markdown, "*'new-id-456'*")
}

func TestExtensionFormatting_XMLExtension_Integration(t *testing.T) {
	// Original spec without extension
	originalSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint`

	// Updated spec with XML extension
	updatedSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  x-config-xml: "<configuration><database><host>localhost</host><port>5432</port></database></configuration>"
paths:
  /test:
    get:
      summary: Test endpoint`

	// Build documents
	l, _ := libopenapi.NewDocument([]byte(originalSpec))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(updatedSpec))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	// Create changerator
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:       leftDoc.V3Document,
		RightDrDoc:      rightDoc.V3Document,
		Doctor:          rightDoc,
		RightDocContent: []byte(updatedSpec),
	})

	docChanges := cd.Changerate()

	require.NotNil(t, docChanges)
	assert.Greater(t, docChanges.TotalChanges(), 0)

	// Generate markdown report
	reporter := renderer.NewMarkdownReporter(docChanges, rightDoc, []byte(updatedSpec), nil)
	markdown := reporter.Generate()

	// Verify XML extension is formatted as code block
	assert.Contains(t, markdown, "Extension `x-config-xml`")
	assert.Contains(t, markdown, "```xml")
	assert.Contains(t, markdown, "<configuration>")
	assert.Contains(t, markdown, "<database>")
	assert.Contains(t, markdown, "<host>")
}

func TestExampleNesting_MultipleExamples_Integration(t *testing.T) {
	// Original spec with examples that will be modified
	originalSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
            examples:
              Example1:
                summary: First example
                value:
                  name: Test1
                  id: 1
              Example2:
                summary: Second example
                value:
                  name: Test2
                  id: 2
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
              examples:
                Success1:
                  summary: First success
                  value:
                    status: ok1
                Success2:
                  summary: Second success
                  value:
                    status: ok2`

	// Updated spec with modified example values
	updatedSpec := `openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
            examples:
              Example1:
                summary: First example MODIFIED
                value:
                  name: Test1-Modified
                  id: 100
              Example2:
                summary: Second example MODIFIED
                value:
                  name: Test2-Modified
                  id: 200
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
              examples:
                Success1:
                  summary: First success MODIFIED
                  value:
                    status: ok1-modified
                Success2:
                  summary: Second success MODIFIED
                  value:
                    status: ok2-modified`

	// Build documents
	l, _ := libopenapi.NewDocument([]byte(originalSpec))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(updatedSpec))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	// Create changerator
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:       leftDoc.V3Document,
		RightDrDoc:      rightDoc.V3Document,
		Doctor:          rightDoc,
		RightDocContent: []byte(updatedSpec),
	})

	docChanges := cd.Changerate()

	require.NotNil(t, docChanges)
	assert.Greater(t, docChanges.TotalChanges(), 0)

	// Test 1: Verify markdown has proper indentation
	htmlConfig := &renderer.RenderConfig{
		HTML: &renderer.HTMLConfig{
			EnableNestedListFix:   true,
			AllowRawHTML:          true,
			NestedListFixStrategy: renderer.NestedListFixInline,
			EnableObjectIcons:     true,
		},
	}

	reporter := renderer.NewMarkdownReporter(docChanges, rightDoc, []byte(updatedSpec), htmlConfig)
	markdown := reporter.Generate()

	// Verify markers are indented
	// Request body examples: 2 spaces (level 1)
	assert.Contains(t, markdown, "  <!-- pb33f-example-start:Example1 -->")
	assert.Contains(t, markdown, "  <!-- pb33f-example-end:Example1 -->")
	// Response examples: 4 spaces (level 2)
	assert.Contains(t, markdown, "    <!-- pb33f-example-start:Success1 -->")
	assert.Contains(t, markdown, "    <!-- pb33f-example-end:Success1 -->")

	// Test 2: Verify HTML has proper nesting structure
	htmlRenderer := renderer.NewHTMLRenderer(htmlConfig)
	html, err := htmlRenderer.RenderHTML(&renderer.RenderInput{
		DocumentChanges: docChanges,
		Doctor:          rightDoc,
		RightDocContent: []byte(updatedSpec),
		Config:          htmlConfig,
	})

	require.NoError(t, err)

	// Verify markers are removed from final HTML
	assert.NotContains(t, html, "<!-- pb33f-example-start")
	assert.NotContains(t, html, "<!-- pb33f-example-end")

	// Verify examples are properly converted to list items (not <pre><code> blocks)
	assert.Contains(t, html, "Example1")
	assert.Contains(t, html, "Example2")
	assert.NotContains(t, html, "<pre><code>- Example")

	// Verify proper HTML structure - examples should appear after media type
	// This indicates they're nested within the media type list item
	mediaTypePos := -1
	example1Pos := -1

	// Find position of media type
	if idx := findSubstring(html, "application/json"); idx != -1 {
		mediaTypePos = idx
	}

	// Find position of first example
	if idx := findSubstring(html, "Example1"); idx != -1 {
		example1Pos = idx
	}

	assert.Greater(t, example1Pos, mediaTypePos,
		"Example should appear after media type in HTML, indicating proper nesting")
}

// helper to find substring and return index
func findSubstring(s, substr string) int {
	if idx := len(s); idx > 0 {
		for i := 0; i < len(s)-len(substr); i++ {
			if s[i:i+len(substr)] == substr {
				return i
			}
		}
	}
	return -1
}

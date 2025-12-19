// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNestedListFixIntegration(t *testing.T) {
	// markdown with properly indented code blocks (our fix ensures this from generation)
	markdown := `# What Changed Report

## Operations

### POST /bookings/{bookingId}/payment

**Responses:**

- Response 200:
  - Content application/json:
    <!-- pb33f-example-start:Card -->
    - Example Card:
      - value changed to:

        ` + "```yaml" + `
        amount: 49.99
        currency: gbp
        ` + "```" + `
    <!-- pb33f-example-end:Card -->
    <!-- pb33f-example-start:Bank -->
    - Example Bank:
      - value changed to:

        ` + "```yaml" + `
        amount: 100.50
        currency: gbp
        ` + "```" + `
    <!-- pb33f-example-end:Bank -->
`

	// test with fix disabled (default)
	t.Run("fix_disabled", func(t *testing.T) {
		config := &RenderConfig{
			HTML: &HTMLConfig{
				EnableNestedListFix: false,
				AllowRawHTML:        true, // allow html comments to pass through
			},
		}

		renderer := NewHTMLRenderer(config)

		// convert markdown to html directly
		var buf strings.Builder
		err := renderer.markdown.Convert([]byte(markdown), &buf)
		require.NoError(t, err)

		html := buf.String()

		// markers should be present in some form when disabled
		assert.Contains(t, html, "pb33f-example-start:Card")
		// the closing marker might be escaped due to goldmark's parsing
	})

	// test with fix enabled - proper indentation prevents broken HTML
	t.Run("fix_enabled", func(t *testing.T) {
		config := &RenderConfig{
			HTML: &HTMLConfig{
				EnableNestedListFix:   true,
				NestedListFixStrategy: NestedListFixInline,
				AllowRawHTML:          true,
			},
		}

		renderer := NewHTMLRenderer(config)

		// convert properly indented markdown to html
		var buf strings.Builder
		err := renderer.markdown.Convert([]byte(markdown), &buf)
		require.NoError(t, err)

		html := buf.String()

		// apply post-processing
		processor := &postProcessor{config: config.HTML}
		processed := processor.process(html)

		// with proper indentation, no broken patterns should appear
		assert.NotContains(t, processed, "<pre><code>- Example")
		assert.Contains(t, processed, "Example Card")
		assert.Contains(t, processed, "Example Bank")

		// markers should be removed by post-processor
		assert.NotContains(t, processed, "<!-- pb33f-")
	})
}
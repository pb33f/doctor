// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPostProcessor_DisabledReturnsOriginal(t *testing.T) {
	processor := &postProcessor{
		config: &HTMLConfig{
			EnableNestedListFix: false,
		},
	}

	input := `<div>test</div>`
	assert.Equal(t, input, processor.process(input))
}

func TestPostProcessor_NilConfigReturnsOriginal(t *testing.T) {
	processor := &postProcessor{
		config: nil,
	}

	input := `<div>test</div>`
	assert.Equal(t, input, processor.process(input))
}

func TestPostProcessor_RemovesMarkers(t *testing.T) {
	processor := &postProcessor{config: &HTMLConfig{}}

	input := `<!-- pb33f-example-start:test -->content<!-- pb33f-example-end:test -->`
	result := processor.removeMarkers(input)

	assert.Equal(t, "content", result)
}

func TestPostProcessor_UnsupportedStrategy(t *testing.T) {
	processor := &postProcessor{
		config: &HTMLConfig{
			EnableNestedListFix:   true,
			NestedListFixStrategy: NestedListFixExtract, // not implemented yet
		},
	}

	input := `<div>test</div>`
	// should return original when strategy not implemented
	assert.Equal(t, input, processor.process(input))
}

func TestPostProcessor_RemovesMarkersOnly(t *testing.T) {
	processor := &postProcessor{
		config: &HTMLConfig{
			EnableNestedListFix:   true,
			NestedListFixStrategy: NestedListFixInline,
		},
	}

	// with proper markdown indentation, HTML is correctly structured
	// post-processor only needs to remove markers
	input := `<h4>POST /bookings</h4>
<ul>
<li>Response 200:
  <ul>
  <li>Content application/json:
    <ul>
    <!-- pb33f-example-start:Card -->
    <li>Example Card:
      <ul>
      <li>value changed to:</li>
      </ul>
      <pre><code>amount: 49.99</code></pre>
    </li>
    <!-- pb33f-example-end:Card -->
    </ul>
  </li>
  </ul>
</li>
</ul>`

	result := processor.process(input)

	// should remove markers
	assert.NotContains(t, result, "<!-- pb33f-")
	// should preserve all valid html
	assert.Contains(t, result, "<h4>POST /bookings</h4>")
	assert.Contains(t, result, "Response 200:")
	assert.Contains(t, result, "Example Card")
}
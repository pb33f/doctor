// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package theme

import (
	"testing"

	"github.com/pb33f/testify/assert"
)

func TestCompactSourceRemovesBreaksNextToMarkup(t *testing.T) {
	source := "{{/* note */}}\n<div class=\"a\">\n\t<span>\n\t\tOperation ID:\n\t</span>\n\t<code>x</code>\n\t{{if .X}}\n\t\t<b>{{.X}}</b>\n\t{{end}}\n</div>\n"
	assert.Equal(t, `{{/* note */}}<div class="a"><span>Operation ID:</span> <code>x</code>{{if .X}}<b>{{.X}}</b>{{end}}</div>`, compactSource(source))
}

func TestCompactSourceDropsBreaksAfterBlockElements(t *testing.T) {
	assert.Equal(t, `<div>a</div><div>b</div><my-el></my-el> <p>c</p>`, compactSource("<div>a</div>\n<div>b</div>\n<my-el></my-el>\n<p>c</p>"))
	assert.Equal(t, `<b>end</b>`, compactSource("<b>end</b>\n"), "no space at the end of a file")
}

func TestCompactSourceKeepsSpacesAndBreaksBetweenWords(t *testing.T) {
	assert.Equal(t, `<a>x</a> <b>y</b>`, compactSource(`<a>x</a> <b>y</b>`), "a space with no line break stays")
	assert.Equal(t, "<p>one\n  two</p>", compactSource("<p>one\n  two</p>"), "a break between words stays")
}

func TestCompactSourceLeavesVerbatimElements(t *testing.T) {
	source := "<div>\n<pre>\n  a\n  b\n</pre>\n<script>\nvar x = {{.X}}\nrun()\n</script>\n<prefix-el>\n</prefix-el>\n</div>"
	assert.Equal(t, "<div><pre>\n  a\n  b\n</pre><script>\nvar x = {{.X}}\nrun()\n</script><prefix-el></prefix-el></div>", compactSource(source))
}

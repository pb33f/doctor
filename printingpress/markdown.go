// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"

	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
)

var mdRenderer goldmark.Markdown

func init() {
	mdRenderer = goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			highlighting.NewHighlighting(
				highlighting.WithStyle("dracula"),
				highlighting.WithFormatOptions(
					chromahtml.WithClasses(true),
				),
			),
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
			parser.WithAttribute(),
		),
		goldmark.WithRendererOptions(
			html.WithUnsafe(),
		),
	)
}

// renderMarkdown converts a markdown string to HTML.
func renderMarkdown(md string) string {
	if md == "" {
		return ""
	}
	var buf bytes.Buffer
	if err := mdRenderer.Convert([]byte(md), &buf); err != nil {
		return md // fallback to raw text
	}
	return buf.String()
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"

	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

var (
	mdRenderer      goldmark.Markdown
	mdRendererPlain goldmark.Markdown
)

func init() {
	mdRenderer = newMarkdownRenderer(true)
	mdRendererPlain = newMarkdownRenderer(false)
}

func newMarkdownRenderer(includeMermaid bool, extraExtensions ...goldmark.Extender) goldmark.Markdown {
	extensions := []goldmark.Extender{extension.GFM}
	if includeMermaid {
		extensions = append(extensions, &mermaidExtension{})
	}
	extensions = append(extensions, extraExtensions...)
	extensions = append(extensions, highlighting.NewHighlighting(
		highlighting.WithStyle("dracula"),
		highlighting.WithFormatOptions(
			chromahtml.WithClasses(true),
		),
	))

	return goldmark.New(
		goldmark.WithExtensions(
			extensions...,
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
func renderMarkdown(md string, noMermaid bool) string {
	if md == "" {
		return ""
	}
	renderer := mdRenderer
	if noMermaid {
		renderer = mdRendererPlain
	}
	var buf bytes.Buffer
	if err := renderer.Convert([]byte(md), &buf); err != nil {
		return md // fallback to raw text
	}
	return buf.String()
}

func renderMarkdownWithExtensions(md string, noMermaid bool, extraExtensions ...goldmark.Extender) string {
	if md == "" {
		return ""
	}
	renderer := newMarkdownRenderer(!noMermaid, extraExtensions...)
	var buf bytes.Buffer
	if err := renderer.Convert([]byte(md), &buf); err != nil {
		return md
	}
	return buf.String()
}

func (pp *PrintingPress) renderMarkdown(md string) string {
	return renderMarkdown(md, pp.engineConfig.NoMermaid)
}

// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"bytes"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark/util"
)

// HTMLRenderer generates HTML reports from change data using Goldmark.
// supports extensive customization through config and custom node renderers.
type HTMLRenderer struct {
	markdown goldmark.Markdown
}

// NewHTMLRenderer creates a new HTML renderer with the given configuration.
func NewHTMLRenderer(config *RenderConfig) *HTMLRenderer {
	if config == nil {
		config = DefaultRenderConfig()
	}

	customRenderer := newChangeHTMLRenderer(config)

	rendererOpts := []renderer.Option{
		renderer.WithNodeRenderers(
			util.Prioritized(customRenderer, 100),
		),
	}

	if config.HTML != nil {
		if config.HTML.AllowRawHTML {
			rendererOpts = append(rendererOpts, html.WithUnsafe())
		}
		if config.HTML.XHTMLOutput {
			rendererOpts = append(rendererOpts, html.WithXHTML())
		}
		if config.HTML.HardWraps {
			rendererOpts = append(rendererOpts, html.WithHardWraps())
		}
	}

	md := goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
			parser.WithAttribute(),
		),
		goldmark.WithRendererOptions(rendererOpts...),
	)

	return &HTMLRenderer{
		markdown: md,
	}
}

// RenderMarkdown generates markdown first, then converts to HTML.
func (r *HTMLRenderer) RenderMarkdown(input *RenderInput) (string, error) {
	if input == nil {
		return "", ErrInvalidInput
	}

	if input.DocumentChanges == nil {
		return "# What Changed?\n\nNo changes detected between the API versions.\n\n", nil
	}

	reporter := NewMarkdownReporter(
		input.DocumentChanges,
		input.Doctor,
		input.RightDocContent,
		input.Config,
	)

	return reporter.Generate(), nil
}

// RenderHTML generates HTML output from the change data.
func (r *HTMLRenderer) RenderHTML(input *RenderInput) (string, error) {
	markdown, err := r.RenderMarkdown(input)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := r.markdown.Convert([]byte(markdown), &buf); err != nil {
		return "", err
	}

	html := buf.String()

	// apply post-processing if configured
	// process() already calls removeMarkers() internally
	if input.Config != nil && input.Config.HTML != nil {
		processor := &postProcessor{config: input.Config.HTML}
		html = processor.process(html)
	}

	return html, nil
}

// newChangeHTMLRenderer creates a goldmark node renderer with custom logic.
func newChangeHTMLRenderer(config *RenderConfig) renderer.NodeRenderer {
	return &changeHTMLRenderer{
		Config: html.NewConfig(),
		config: config,
	}
}

// changeHTMLRenderer implements custom rendering for change report elements.
type changeHTMLRenderer struct {
	html.Config
	config *RenderConfig
}

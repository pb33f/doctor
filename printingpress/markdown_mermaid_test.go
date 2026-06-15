// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestRenderMarkdown_MermaidFence(t *testing.T) {
	md := "Before\n\n```mermaid\ngraph TD\nA --> B\n```\n\nAfter"
	result := renderMarkdown(md, false)

	assert.Contains(t, result, `<pp-mermaid>`)
	assert.Contains(t, result, `<script type="application/json" class="pp-mermaid-data">"graph TD`)
	assert.Contains(t, result, `<pre class="pp-mermaid-fallback"><code class="language-mermaid">graph TD`)
	assert.Contains(t, result, `A --&gt; B`)
	assert.Contains(t, result, `<p>Before</p>`)
	assert.Contains(t, result, `<p>After</p>`)
}

func TestRenderMarkdown_MermaidFenceCaseAndExtraInfo(t *testing.T) {
	md := "```MERMAID title=\"flow\"\ngraph TD\nA --> B\n```"
	result := renderMarkdown(md, false)

	assert.Contains(t, result, `<pp-mermaid>`)
	assert.Contains(t, result, `graph TD`)
}

func TestRenderMarkdown_MermaidFenceEmpty(t *testing.T) {
	result := renderMarkdown("```mermaid\n   \n```", false)

	assert.Equal(t, "", strings.TrimSpace(result))
}

func TestRenderMarkdown_MermaidFenceEscapesScriptAndFallback(t *testing.T) {
	md := "```mermaid\ngraph TD\nA[\"<tag>&</script>\"]\n```"
	result := renderMarkdown(md, false)

	assert.Contains(t, result, `\u003c/script\u003e`)
	assert.Contains(t, result, `&lt;tag&gt;&amp;&lt;/script&gt;`)
	assert.NotContains(t, result, `<tag>&</script>`)

	var source string
	require.NoError(t, json.Unmarshal([]byte(extractMermaidScriptPayload(t, result)), &source))
	assert.Equal(t, "graph TD\nA[\"<tag>&</script>\"]\n", source)
}

func TestRenderMarkdown_MermaidFenceNoMermaid(t *testing.T) {
	md := "```mermaid\ngraph TD\nA --> B\n```"
	result := renderMarkdown(md, true)

	assert.NotContains(t, result, `<pp-mermaid>`)
	assert.Contains(t, result, `<pre`)
	assert.Contains(t, result, `language-mermaid`)
}

func TestRenderMarkdown_NonMermaidFenceStillHighlighted(t *testing.T) {
	md := "```json\n{\"key\":\"value\"}\n```"
	result := renderMarkdown(md, false)

	assert.NotContains(t, result, `<pp-mermaid>`)
	assert.Contains(t, result, `class="chroma"`)
}

func TestCreatePrintingPress_MermaidMarkdownFixture(t *testing.T) {
	specBytes, err := os.ReadFile(filepath.Join("..", "test_specs", "mermaid-fixture.yaml"))
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: outputDir,
	})
	require.NoError(t, err)

	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NotNil(t, site.Root)
	assert.Contains(t, site.Root.DescHTML, `<pp-mermaid>`)
	assert.NotContains(t, site.Root.DescHTML, "```mermaid")

	_, err = pp.PrintHTML()
	require.NoError(t, err)

	indexHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	output := string(indexHTML)
	assert.Contains(t, output, `<pp-mermaid>`)
	assert.Contains(t, output, `<script type="application/json" class="pp-mermaid-data">"graph TD`)
	assert.Contains(t, output, `<pre class="pp-mermaid-fallback">`)
	assert.NotContains(t, output, `data-pp-no-mermaid="true"`)
}

func TestCreatePrintingPress_MermaidMarkdownFixtureNoMermaid(t *testing.T) {
	specBytes, err := os.ReadFile(filepath.Join("..", "test_specs", "mermaid-fixture.yaml"))
	require.NoError(t, err)

	site := pressFromSpecWithConfig(t, string(specBytes), func(cfg *pressEngineConfig) {
		cfg.NoMermaid = true
	})

	require.NotNil(t, site.Root)
	assert.True(t, site.NoMermaid)
	assert.NotContains(t, site.Root.DescHTML, `<pp-mermaid>`)
	assert.Contains(t, site.Root.DescHTML, `language-mermaid`)

	outputDir := t.TempDir()
	require.NoError(t, WriteHTMLSite(site, outputDir, ""))

	indexHTML, err := os.ReadFile(filepath.Join(outputDir, "index.html"))
	require.NoError(t, err)
	output := string(indexHTML)
	assert.Contains(t, output, `data-pp-no-mermaid="true"`)
	assert.NotContains(t, output, `<pp-mermaid>`)
	assert.Contains(t, output, `language-mermaid`)
}

func extractMermaidScriptPayload(t *testing.T, html string) string {
	t.Helper()

	const start = `<script type="application/json" class="pp-mermaid-data">`
	startIdx := strings.Index(html, start)
	require.NotEqual(t, -1, startIdx)
	startIdx += len(start)
	endIdx := strings.Index(html[startIdx:], `</script>`)
	require.NotEqual(t, -1, endIdx)
	return html[startIdx : startIdx+endIdx]
}

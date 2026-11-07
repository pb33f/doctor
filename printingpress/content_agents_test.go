// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"path/filepath"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestApplyAudienceBlocks(t *testing.T) {
	body := "Intro.\n\n{{< humans >}}\nClick the button.\n{{< /humans >}}\n\n{{< agents >}}\nRun `example go`.\n{{< /agents >}}\n\n```md\n{{< agents >}}literal{{< /agents >}}\n```\n"

	humans := applyAudienceBlocks(body, false)
	assert.Contains(t, humans, "Click the button.")
	assert.NotContains(t, humans, "example go")
	assert.NotContains(t, humans, "{{< humans >}}")
	assert.Contains(t, humans, "{{< agents >}}literal{{< /agents >}}", "blocks inside code fences stay literal")

	agents := applyAudienceBlocks(body, true)
	assert.Contains(t, agents, "Run `example go`.")
	assert.NotContains(t, agents, "Click the button.")
	assert.Contains(t, agents, "{{< agents >}}literal{{< /agents >}}")
}

func TestParseContentAudience(t *testing.T) {
	for raw, want := range map[string]ppmodel.ContentAudience{"": ppmodel.ContentAudienceAll, "all": ppmodel.ContentAudienceAll, "Agents": ppmodel.ContentAudienceAgents, " humans ": ppmodel.ContentAudienceHumans} {
		got, ok := parseContentAudience(raw)
		assert.True(t, ok, raw)
		assert.Equal(t, want, got, raw)
	}
	_, ok := parseContentAudience("robots")
	assert.False(t, ok)
}

func writeAudienceFixture(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	writeGoldenFile(t, root, "docs/_index.md", "---\ntitle: Example Docs\ndescription: All about Example.\n---\nHOME-TEXT\n")
	writeGoldenFile(t, root, "docs/welcome.md", "---\ntitle: Welcome\norder: 1\ndescription: Start here.\n---\n# Welcome\n\nSee [Install](guides/install.md#steps).\n")
	writeGoldenFile(t, root, "docs/guides/install.md", "---\ntitle: Install\ndescription: Install it.\n---\n# Install\n\n{{< humans >}}\nHUMAN-ONLY-TEXT\n{{< /humans >}}\n\n{{< agents >}}\nAGENT-ONLY-TEXT\n{{< /agents >}}\n")
	writeGoldenFile(t, root, "docs/agents-cli.md", "---\ntitle: Using the CLI\naudience: agents\ndescription: How agents act.\n---\nAGENTS-PAGE-TEXT\n")
	writeGoldenFile(t, root, "docs/tour.md", "---\ntitle: Tour\naudience: humans\n---\nHUMANS-PAGE-TEXT\n")
	return root
}

func TestDocsSiteAgentFiles(t *testing.T) {
	_, outputDir := buildDocsSiteFixture(t, writeAudienceFixture(t), nil)

	welcome := readOutput(t, outputDir, "welcome.md")
	assert.Contains(t, welcome, "# Welcome\n\n> Start here.\n", "page.md opens with the title once, then the description")
	assert.Contains(t, welcome, "[Install](guides/install.md#steps)", "links point at page.md files")
	assert.Contains(t, readOutput(t, outputDir, "index.md"), "HOME-TEXT", "the home content has a page.md")

	install := readOutput(t, outputDir, "guides/install.md")
	assert.Contains(t, install, "AGENT-ONLY-TEXT")
	assert.NotContains(t, install, "HUMAN-ONLY-TEXT")
	installHTML := readOutput(t, outputDir, "guides/install.html")
	assert.Contains(t, installHTML, "HUMAN-ONLY-TEXT")
	assert.NotContains(t, installHTML, "AGENT-ONLY-TEXT")
	assert.Contains(t, installHTML, `<link rel="alternate" type="text/markdown" href="install.md">`)
	assert.Contains(t, installHTML, `<meta name="description" content="Install it.">`)

	assert.FileExists(t, filepath.Join(outputDir, "agents-cli.md"))
	assert.NoFileExists(t, filepath.Join(outputDir, "agents-cli.html"), "agents-only pages have no HTML")
	assert.FileExists(t, filepath.Join(outputDir, "tour.html"))
	assert.NoFileExists(t, filepath.Join(outputDir, "tour.md"), "humans-only pages have no page.md")
	assert.NotContains(t, readOutput(t, outputDir, "tour.html"), `rel="alternate"`)

	llms := readOutput(t, outputDir, "llms.txt")
	assert.Contains(t, llms, "[llms-full.txt](llms-full.txt)")
	assert.Contains(t, llms, "[Welcome](welcome.md)")
	assert.Contains(t, llms, "[Install](guides/install.md)")
	assert.Contains(t, llms, "[Using the CLI](agents-cli.md)")
	assert.NotContains(t, llms, "tour", "humans-only pages stay out of agent files")

	agents := readOutput(t, outputDir, "AGENTS.md")
	start := "## Start here\n\n- [Using the CLI](agents-cli.md) — How agents act.\n"
	assert.Contains(t, agents, start, "agents-only pages come first")

	full := readOutput(t, outputDir, "llms-full.txt")
	assert.Contains(t, full, "HOME-TEXT")
	assert.Contains(t, full, "AGENTS-PAGE-TEXT")
	assert.Contains(t, full, "AGENT-ONLY-TEXT")
	assert.NotContains(t, full, "HUMANS-PAGE-TEXT")

	for _, human := range []string{"index.html", "welcome.html", "guides.html"} {
		text := readOutput(t, outputDir, human)
		assert.NotContains(t, text, "agents-cli.html", human+" does not link the agents-only page")
		assert.NotContains(t, text, "Using the CLI", human+" does not list the agents-only page")
	}
}

func TestDocsSiteRemovesStalePageMarkdown(t *testing.T) {
	root := writeAudienceFixture(t)
	outputDir := t.TempDir()
	statePath := filepath.Join(t.TempDir(), "state.db")
	build := func() {
		ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{OutputDir: outputDir, StateSQLitePath: statePath})
		require.NoError(t, err)
		_, err = ap.PrintLLM()
		require.NoError(t, err)
	}
	build()
	require.FileExists(t, filepath.Join(outputDir, "agents-cli.md"))

	require.NoError(t, os.Remove(filepath.Join(root, "docs", "agents-cli.md")))
	build()
	assert.NoFileExists(t, filepath.Join(outputDir, "agents-cli.md"), "a page that is gone loses its page.md")
	assert.FileExists(t, filepath.Join(outputDir, "welcome.md"))
}

func TestSingleSpecGuidesInAgentFiles(t *testing.T) {
	root := t.TempDir()
	specPath := filepath.Join(root, "openapi.yaml")
	writeGoldenFile(t, root, "openapi.yaml", readGoldenSource(t, "../test_specs/train-travel.yaml"))
	writeGoldenFile(t, root, "about.md", "---\ntitle: About\ndescription: What this API is.\n---\n# About\n\nABOUT-TEXT\n")

	specBytes, err := os.ReadFile(specPath)
	require.NoError(t, err)
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir:          outputDir,
		SpecPath:           specPath,
		BasePath:           root,
		EnableContentPages: true,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)
	_, err = pp.PrintLLM()
	require.NoError(t, err)

	assert.Contains(t, readOutput(t, outputDir, "about.md"), "ABOUT-TEXT")
	assert.Contains(t, readOutput(t, outputDir, "llms.txt"), "## Guides\n\n- [About](about.md) — What this API is.\n")
	assert.Contains(t, readOutput(t, outputDir, "AGENTS.md"), "[About](about.md)")
	assert.Contains(t, readOutput(t, outputDir, "llms-full.txt"), "ABOUT-TEXT")
	about := readOutput(t, outputDir, "about.html")
	assert.Contains(t, about, `<link rel="alternate" type="text/markdown" href="about.md">`)
	assert.Contains(t, about, `<meta name="description" content="What this API is.">`)
}

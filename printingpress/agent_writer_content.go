// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"os"
	"path/filepath"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// agentContentPages returns the guide pages agents read, with agents-only
// pages first: they are what the site writes for agents.
func agentContentPages(pages []*ppmodel.ContentPage) []*ppmodel.ContentPage {
	var first, rest []*ppmodel.ContentPage
	for _, page := range pages {
		if page == nil || page.MarkdownHref == "" || page.Markdown == "" {
			continue
		}
		if page.Audience == ppmodel.ContentAudienceAgents {
			first = append(first, page)
			continue
		}
		rest = append(rest, page)
	}
	return append(first, rest...)
}

// renderLLMGuidesIndex lists a single-spec site's guides as page.md links,
// for llms.txt and AGENTS.md. It is empty when the site has no guides.
func renderLLMGuidesIndex(site *ppmodel.Site) string {
	pages := agentContentPages(site.ContentPages)
	if len(pages) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("## Guides\n\n")
	for _, page := range pages {
		writeAgentPageLine(&b, "", page.Title, page.MarkdownHref, page.Description)
	}
	b.WriteString("\n")
	return b.String()
}

// renderLLMGuidesFull is every guide's page.md, for llms-full.txt.
func renderLLMGuidesFull(site *ppmodel.Site) string {
	pages := agentContentPages(site.ContentPages)
	if len(pages) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("## Guides\n\n")
	for _, page := range pages {
		b.WriteString("<!-- ")
		b.WriteString(page.MarkdownHref)
		b.WriteString(" -->\n")
		b.WriteString(page.Markdown)
		b.WriteString("\n---\n\n")
	}
	return b.String()
}

// writeLLMContentPages writes each guide's page.md and returns the paths.
func writeLLMContentPages(site *ppmodel.Site, outputDir string) ([]string, error) {
	pages := agentContentPages(site.ContentPages)
	written := make([]string, 0, len(pages))
	for _, page := range pages {
		target := filepath.Join(outputDir, filepath.FromSlash(page.MarkdownHref))
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return nil, err
		}
		if err := os.WriteFile(target, []byte(page.Markdown), 0o644); err != nil {
			return nil, err
		}
		written = append(written, target)
	}
	return written, nil
}

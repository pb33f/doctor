// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"path"
	"regexp"
	"strings"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

var (
	agentsBlockPattern = regexp.MustCompile(`(?s)\{\{<\s*agents\s*>\}\}(.*?)\{\{<\s*/\s*agents\s*>\}\}`)
	humansBlockPattern = regexp.MustCompile(`(?s)\{\{<\s*humans\s*>\}\}(.*?)\{\{<\s*/\s*humans\s*>\}\}`)
	// markdownTargetPattern finds inline Markdown links and images:
	// [text](target) and ![alt](target "title").
	markdownTargetPattern = regexp.MustCompile(`(!?)(\[[^\]\n]*\]\()([^\s)]+)((?:\s+"[^"\n]*")?\))`)
)

// parseContentAudience reads the audience front matter value.
func parseContentAudience(raw string) (ppmodel.ContentAudience, bool) {
	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "", "all":
		return ppmodel.ContentAudienceAll, true
	case string(ppmodel.ContentAudienceAgents):
		return ppmodel.ContentAudienceAgents, true
	case string(ppmodel.ContentAudienceHumans):
		return ppmodel.ContentAudienceHumans, true
	default:
		return ppmodel.ContentAudienceAll, false
	}
}

// contentMarkdownHref is the page.md file beside a page's HTML file.
func contentMarkdownHref(htmlHref string) string {
	return strings.TrimSuffix(htmlHref, pppaths.ExtHTML) + pppaths.ExtMarkdown
}

// applyAudienceBlocks keeps the {{< agents >}} or {{< humans >}} blocks meant
// for one reader and drops the others. Code fences are left as they are, so a
// block written inside one stays literal.
func applyAudienceBlocks(body string, forAgents bool) string {
	if !strings.Contains(body, "{{<") {
		return body
	}
	keep, drop := humansBlockPattern, agentsBlockPattern
	if forAgents {
		keep, drop = agentsBlockPattern, humansBlockPattern
	}
	return mapOutsideFences(body, func(text string) string {
		text = drop.ReplaceAllString(text, "")
		return keep.ReplaceAllString(text, "$1")
	})
}

// mapOutsideFences applies fn to each run of text outside fenced code blocks.
func mapOutsideFences(body string, fn func(string) string) string {
	lines := strings.SplitAfter(body, "\n")
	var out, run strings.Builder
	inFence := false
	flush := func() {
		if run.Len() > 0 {
			out.WriteString(fn(run.String()))
			run.Reset()
		}
	}
	for _, line := range lines {
		if isContentFenceLine(line) {
			if !inFence {
				flush()
			}
			inFence = !inFence
			out.WriteString(line)
			continue
		}
		if inFence {
			out.WriteString(line)
			continue
		}
		run.WriteString(line)
	}
	flush()
	return out.String()
}

// renderContentPageMarkdown builds page.md: the title, the description, then
// the body with its links pointing at other page.md files and its images at
// the copied assets.
func (pp *PrintingPress) renderContentPageMarkdown(ctx *contentPageContext, page *ppmodel.ContentPage, body string) string {
	quiet := page.Audience.ForHumans()
	body = mapOutsideFences(body, func(text string) string {
		return markdownTargetPattern.ReplaceAllStringFunc(text, func(match string) string {
			parts := markdownTargetPattern.FindStringSubmatch(match)
			image, opener, target, closer := parts[1], parts[2], parts[3], parts[4]
			var rewritten string
			var ok bool
			if image == "!" {
				rewritten, ok = pp.rewriteContentPageImage(ctx, page, target)
			} else {
				rewritten, ok = pp.rewriteContentPageMarkdownLink(ctx, page, target, quiet)
			}
			if !ok {
				return match
			}
			return image + opener + rewritten + closer
		})
	})
	body = mapOutsideFences(body, func(text string) string {
		return extraBlankLinesPattern.ReplaceAllString(text, "\n\n")
	})
	body = strings.TrimSpace(body)
	var out strings.Builder
	title := "# " + page.Title
	if body == title || strings.HasPrefix(body, title+"\n") {
		// The page opens with its own title heading: keep it first.
		body = strings.TrimSpace(strings.TrimPrefix(body, title))
	}
	out.WriteString(title)
	out.WriteString("\n\n")
	if page.Description != "" {
		out.WriteString("> ")
		out.WriteString(page.Description)
		out.WriteString("\n\n")
	}
	out.WriteString(body)
	out.WriteString("\n")
	return out.String()
}

// extraBlankLinesPattern finds runs of blank lines, such as those a removed
// audience block leaves.
var extraBlankLinesPattern = regexp.MustCompile(`\n[ \t]*\n(?:[ \t]*\n)+`)

// rewriteContentPageMarkdownLink points a link to another content page at
// that page's page.md, or at its HTML when it has no page.md. The HTML pass
// already warned about broken links, so this one stays quiet unless the page
// has no HTML.
func (pp *PrintingPress) rewriteContentPageMarkdownLink(ctx *contentPageContext, page *ppmodel.ContentPage, raw string, quiet bool) (string, bool) {
	if shouldSkipContentHref(raw) {
		return "", false
	}
	target, fragment := splitMarkdownHref(raw)
	if strings.TrimSpace(target) == "" || strings.ToLower(path.Ext(target)) != pppaths.ExtMarkdown {
		return "", false
	}
	resolved, err := ctx.loader.Resolve(page.SourceDir, target)
	if err != nil {
		if !quiet {
			pp.warnContentPage("custom page link could not be resolved", raw, err)
		}
		return "", false
	}
	key := canonicalContentPath(ctx.loader, resolved)
	if href, ok := ctx.markdownByPath[key]; ok {
		return relativeContentHref(page.Href, href) + fragment, true
	}
	if href, ok := ctx.linkByPath[key]; ok {
		return relativeContentHref(page.Href, href) + fragment, true
	}
	if !quiet {
		pp.warnContentPage("custom page link target was not rendered; leaving original link", raw, nil)
	}
	return "", false
}

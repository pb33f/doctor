// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package theme

import (
	"regexp"
	"strings"
)

// lineBreakPattern is a run of whitespace that holds a line break.
var lineBreakPattern = regexp.MustCompile(`[ \t\r]*\n\s*`)

// verbatimTags are the elements whose text keeps its whitespace.
var verbatimTags = []string{"pre", "script", "style", "textarea"}

// compactSource compacts the line breaks, with the indentation around them,
// that sit next to a tag or an action. A break between the closing tag of an
// inline element and the next element or words becomes one space, which is
// how HTML would draw it; every other such break is removed. Templates can then be laid out for people and
// still draw compact markup, as templ did. A break between two words stays,
// and the text of pre, script, style and textarea is not changed.
func compactSource(source string) string {
	if !strings.Contains(source, "\n") {
		return source
	}
	var out strings.Builder
	out.Grow(len(source))
	for len(source) > 0 {
		start, end := nextVerbatim(source)
		out.WriteString(compactSpan(source[:start]))
		out.WriteString(source[start:end])
		source = source[end:]
	}
	return out.String()
}

// compactSpan compacts text that holds no verbatim element.
func compactSpan(span string) string {
	runs := lineBreakPattern.FindAllStringIndex(span, -1)
	if len(runs) == 0 {
		return span
	}
	var out strings.Builder
	out.Grow(len(span))
	last := 0
	for _, run := range runs {
		before, after := span[:run[0]], span[run[1]:]
		out.WriteString(span[last:run[0]])
		switch {
		case !nextToMarkup(before, after):
			out.WriteString(span[run[0]:run[1]])
		case closesInlineElement(before) && opensContent(after):
			out.WriteByte(' ')
		}
		last = run[1]
	}
	out.WriteString(span[last:])
	return out.String()
}

// closingTagPattern is a closing tag at the end of text.
var closingTagPattern = regexp.MustCompile(`</([a-zA-Z][a-zA-Z0-9-]*)\s*>$`)

// blockElements are the elements a browser lays out as blocks; whitespace
// after one draws nothing, so it is removed. Every other element, custom
// elements among them, is inline.
var blockElements = map[string]bool{
	"address": true, "article": true, "aside": true, "blockquote": true, "body": true, "dd": true,
	"details": true, "dialog": true, "div": true, "dl": true, "dt": true, "fieldset": true,
	"figcaption": true, "figure": true, "footer": true, "form": true, "h1": true, "h2": true,
	"h3": true, "h4": true, "h5": true, "h6": true, "head": true, "header": true, "hgroup": true,
	"html": true, "li": true, "main": true, "nav": true, "ol": true, "p": true, "pre": true,
	"section": true, "summary": true, "table": true, "tbody": true, "td": true, "tfoot": true,
	"th": true, "thead": true, "tr": true, "ul": true,
}

// closesInlineElement reports whether text ends with the closing tag of an
// inline element.
func closesInlineElement(text string) bool {
	match := closingTagPattern.FindStringSubmatch(text)
	return match != nil && !blockElements[strings.ToLower(match[1])]
}

// opensContent reports whether text starts with an opening tag or with
// words: something a space before it would separate from an inline element.
func opensContent(text string) bool {
	if text == "" || strings.HasPrefix(text, "{{") || strings.HasPrefix(text, "</") {
		return false
	}
	return !strings.HasPrefix(text, "<!")
}

// nextToMarkup reports whether a run of whitespace follows a tag or an
// action, or comes before one. The start and end of a file count as markup.
func nextToMarkup(before, after string) bool {
	return before == "" || after == "" ||
		strings.HasSuffix(before, ">") || strings.HasSuffix(before, "}}") ||
		strings.HasPrefix(after, "<") || strings.HasPrefix(after, "{{")
}

// nextVerbatim finds the next verbatim element: start is where it begins and
// end is after its closing tag. With none, both are the end of source.
func nextVerbatim(source string) (start, end int) {
	lower := strings.ToLower(source)
	start, end = len(source), len(source)
	for _, tag := range verbatimTags {
		open := indexTag(lower, "<"+tag)
		if open < 0 || open >= start {
			continue
		}
		closing := strings.Index(lower[open:], "</"+tag)
		if closing < 0 {
			start, end = open, len(source)
			continue
		}
		start, end = open, open+closing+len("</"+tag)
	}
	return start, end
}

// indexTag finds an opening tag by name, not a longer name that starts the
// same way.
func indexTag(lower, open string) int {
	offset := 0
	for {
		i := strings.Index(lower[offset:], open)
		if i < 0 {
			return -1
		}
		i += offset
		next := i + len(open)
		if next >= len(lower) || strings.IndexByte(" \t\r\n>/", lower[next]) >= 0 {
			return i
		}
		offset = next
	}
}

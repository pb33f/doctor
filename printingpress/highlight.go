// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"bytes"
	"html"

	"github.com/alecthomas/chroma/v2"
	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/alecthomas/chroma/v2/lexers"
	"github.com/alecthomas/chroma/v2/styles"
)

// highlightCode renders source code as syntax-highlighted HTML with chroma CSS classes.
// The lexerName selects the chroma lexer (e.g. "json", "java"). Falls back to
// HTML-escaped plain text when the lexer is unavailable or tokenisation fails.
func highlightCode(code, lexerName string) (string, bool) {
	lexer := lexers.Get(lexerName)
	if lexer == nil {
		return html.EscapeString(code), false
	}
	lexer = chroma.Coalesce(lexer)

	formatter := chromahtml.New(
		chromahtml.WithClasses(true),
		chromahtml.PreventSurroundingPre(true),
	)

	style := styles.Get("dracula")

	iterator, err := lexer.Tokenise(nil, code)
	if err != nil {
		return html.EscapeString(code), false
	}

	var buf bytes.Buffer
	if err := formatter.Format(&buf, style, iterator); err != nil {
		return html.EscapeString(code), false
	}

	return buf.String(), true
}

// highlightJSON renders JSON as syntax-highlighted HTML with chroma CSS classes.
// Falls back to HTML-escaped plain text on error (never returns empty).
func highlightJSON(code string) (string, bool) {
	lexer := lexers.Get("json")
	if lexer == nil {
		return html.EscapeString(code), false
	}
	lexer = chroma.Coalesce(lexer)

	formatter := chromahtml.New(
		chromahtml.WithClasses(true),
		chromahtml.PreventSurroundingPre(true),
	)

	style := styles.Get("dracula")

	iterator, err := lexer.Tokenise(nil, code)
	if err != nil {
		return html.EscapeString(code), false
	}

	var buf bytes.Buffer
	if err := formatter.Format(&buf, style, iterator); err != nil {
		return html.EscapeString(code), false
	}

	return buf.String(), true
}


// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/text"
	"github.com/yuin/goldmark/util"
)

type contentRewriteExtension struct {
	rewriteLink  func(string) (string, bool)
	rewriteImage func(string) (string, bool)
}

func (e *contentRewriteExtension) Extend(m goldmark.Markdown) {
	m.Parser().AddOptions(parser.WithASTTransformers(
		util.Prioritized(&contentRewriteTransformer{
			rewriteLink:  e.rewriteLink,
			rewriteImage: e.rewriteImage,
		}, 90),
	))
}

type contentRewriteTransformer struct {
	rewriteLink  func(string) (string, bool)
	rewriteImage func(string) (string, bool)
}

func (t *contentRewriteTransformer) Transform(doc *ast.Document, reader text.Reader, pc parser.Context) {
	_ = ast.Walk(doc, func(n ast.Node, entering bool) (ast.WalkStatus, error) {
		if !entering {
			return ast.WalkContinue, nil
		}
		switch node := n.(type) {
		case *ast.Image:
			if t.rewriteImage != nil {
				if replacement, ok := t.rewriteImage(string(node.Destination)); ok {
					node.Destination = []byte(replacement)
				}
			}
			return ast.WalkContinue, nil
		case *ast.Link:
			if t.rewriteLink != nil {
				if replacement, ok := t.rewriteLink(string(node.Destination)); ok {
					node.Destination = []byte(replacement)
				}
			}
			return ast.WalkContinue, nil
		default:
			return ast.WalkContinue, nil
		}
	})
}

func splitMarkdownHref(raw string) (target string, fragment string) {
	target = strings.TrimSpace(raw)
	if before, after, ok := strings.Cut(target, "#"); ok {
		return before, "#" + after
	}
	return target, ""
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	stdhtml "html"
	"strings"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/text"
	"github.com/yuin/goldmark/util"
)

var kindMermaidBlock = ast.NewNodeKind("MermaidBlock")

type mermaidBlock struct {
	ast.BaseBlock
	source []byte
}

func (n *mermaidBlock) Kind() ast.NodeKind {
	return kindMermaidBlock
}

func (n *mermaidBlock) Dump(source []byte, level int) {
	ast.DumpHelper(n, source, level, nil, nil)
}

type mermaidExtension struct{}

func (e *mermaidExtension) Extend(m goldmark.Markdown) {
	m.Parser().AddOptions(parser.WithASTTransformers(
		util.Prioritized(&mermaidASTTransformer{}, 100),
	))
	m.Renderer().AddOptions(renderer.WithNodeRenderers(
		util.Prioritized(&mermaidNodeRenderer{}, 100),
	))
}

type mermaidASTTransformer struct{}

func (t *mermaidASTTransformer) Transform(doc *ast.Document, reader text.Reader, pc parser.Context) {
	source := reader.Source()
	_ = ast.Walk(doc, func(n ast.Node, entering bool) (ast.WalkStatus, error) {
		if !entering {
			return ast.WalkContinue, nil
		}
		block, ok := n.(*ast.FencedCodeBlock)
		if !ok || !isMermaidFence(block, source) {
			return ast.WalkContinue, nil
		}
		parent := block.Parent()
		if parent == nil {
			return ast.WalkSkipChildren, nil
		}
		body := block.Text(source)
		if strings.TrimSpace(string(body)) == "" {
			parent.RemoveChild(parent, block)
			return ast.WalkSkipChildren, nil
		}
		parent.ReplaceChild(parent, block, &mermaidBlock{source: append([]byte(nil), body...)})
		return ast.WalkSkipChildren, nil
	})
}

func isMermaidFence(block *ast.FencedCodeBlock, source []byte) bool {
	if block.Info == nil {
		return false
	}
	fields := strings.Fields(string(block.Info.Text(source)))
	return len(fields) > 0 && strings.EqualFold(fields[0], "mermaid")
}

type mermaidNodeRenderer struct{}

func (r *mermaidNodeRenderer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	reg.Register(kindMermaidBlock, r.renderMermaid)
}

func (r *mermaidNodeRenderer) renderMermaid(w util.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		return ast.WalkContinue, nil
	}
	block := node.(*mermaidBlock)
	raw := string(block.source)
	script, err := mermaidScriptJSON(raw)
	if err != nil {
		return ast.WalkStop, err
	}
	fallback := stdhtml.EscapeString(raw)

	if _, err := w.WriteString(`<pp-mermaid><script type="application/json" class="pp-mermaid-data">`); err != nil {
		return ast.WalkStop, err
	}
	if _, err := w.WriteString(script); err != nil {
		return ast.WalkStop, err
	}
	if _, err := w.WriteString(`</script><pre class="pp-mermaid-fallback"><code class="language-mermaid">`); err != nil {
		return ast.WalkStop, err
	}
	if _, err := w.WriteString(fallback); err != nil {
		return ast.WalkStop, err
	}
	if _, err := w.WriteString(`</code></pre></pp-mermaid>`); err != nil {
		return ast.WalkStop, err
	}
	return ast.WalkSkipChildren, nil
}

func mermaidScriptJSON(source string) (string, error) {
	body, err := json.Marshal(source)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

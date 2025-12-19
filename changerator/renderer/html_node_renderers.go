// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	"bytes"
	"fmt"
	"html"
	"strings"

	"github.com/yuin/goldmark/ast"
	extAST "github.com/yuin/goldmark/extension/ast"
	"github.com/yuin/goldmark/renderer"
	gmhtml "github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark/util"
)

// RegisterFuncs registers custom rendering functions for change report elements.
func (r *changeHTMLRenderer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	reg.Register(ast.KindCodeSpan, r.renderCodeSpan)
	reg.Register(ast.KindFencedCodeBlock, r.renderFencedCodeBlock)
	reg.Register(ast.KindListItem, r.renderListItem)
	reg.Register(ast.KindHeading, r.renderHeading)
	reg.Register(ast.KindEmphasis, r.renderEmphasis)
	reg.Register(ast.KindLink, r.renderLink)
	reg.Register(ast.KindBlockquote, r.renderBlockquote)
	reg.Register(ast.KindThematicBreak, r.renderThematicBreak)
	reg.Register(ast.KindText, r.renderText)

	reg.Register(extAST.KindTable, r.renderTable)
	reg.Register(extAST.KindTableHeader, r.renderTableHeader)
	reg.Register(extAST.KindTableRow, r.renderTableRow)
	reg.Register(extAST.KindTableCell, r.renderTableCell)
}

// renderText renders text nodes with special handling for object type prefixes.
// When icons are enabled, it detects object type patterns followed by code spans
// and injects icons before the object type text.
// In top-level list items, it removes redundant object type text (HTML only).
func (r *changeHTMLRenderer) renderText(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if !entering {
		return ast.WalkContinue, nil
	}

	n := node.(*ast.Text)
	segment := n.Segment
	textContent := string(segment.Value(source))

	skipObjectTypeText := false
	locationPrefix := ""

	// Check if we should inject an icon before this text
	if r.shouldRenderObjectIcon() && !r.isInsideHeading(node) {
		// Check if this text contains an object type pattern and is followed by a code span
		if objectType, hasMatch := r.matchesObjectTypePattern(textContent); hasMatch {
			// Look ahead to see if the next sibling is a code span
			if nextSibling := node.NextSibling(); nextSibling != nil {
				if _, ok := nextSibling.(*ast.CodeSpan); ok {
					// Check if this is a top-level list item (not nested)
					isTopLevel := r.isTopLevelListItem(node)

					// Extract location prefix for compound parameter patterns (only for top-level)
					if isTopLevel {
						locationPrefix = r.extractLocationPrefix(textContent)
					}

					// Render location prefix if present
					if locationPrefix != "" {
						w.Write(util.EscapeHTML([]byte(locationPrefix)))
						w.WriteByte(' ')
					}

					// Inject icon before the text
					w.WriteString(`<pb33f-model-icon icon="`)
					w.WriteString(objectType)
					w.WriteString(`" size="tiny"></pb33f-model-icon> `)

					// If top-level, skip rendering the redundant object type text
					if isTopLevel {
						skipObjectTypeText = true
					}
				}
			}
		}
	}

	// Skip rendering the object type text if we're in a top-level list with an icon
	if skipObjectTypeText {
		return ast.WalkContinue, nil
	}

	// Replace "See referenced component" with icon in HTML
	trimmed := strings.TrimSpace(textContent)
	if trimmed == "See referenced component" || strings.Contains(trimmed, "See referenced component") {
		// Replace the entire text with just the icon
		w.WriteString(`<sl-icon name="arrow-right" class="reflink"></sl-icon>`)
		return ast.WalkContinue, nil
	}

	// Render the text normally
	if n.IsRaw() {
		w.Write(segment.Value(source))
	} else {
		value := segment.Value(source)
		if n.SoftLineBreak() {
			if r.config != nil && r.config.HTML != nil && r.config.HTML.HardWraps {
				w.WriteString("<br>\n")
			} else {
				w.WriteByte('\n')
			}
		}
		w.Write(util.EscapeHTML(value))
	}

	return ast.WalkContinue, nil
}

// renderCodeSpan renders inline code with custom class for property names.
// For paths, it uses the custom pb33f-render-operation-path component.
// For component references (containing #/), it adds a component-reference class.
func (r *changeHTMLRenderer) renderCodeSpan(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if !entering {
		return ast.WalkContinue, nil
	}

	var textContent string
	for c := node.FirstChild(); c != nil; c = c.NextSibling() {
		if text, ok := c.(*ast.Text); ok {
			textContent = string(text.Segment.Value(source))
			break
		}
	}

	// Handle operation paths with custom component
	if r.isOperationPath(textContent) {
		w.WriteString(`<pb33f-render-operation-path path="`)
		// escape attribute value to prevent injection
		w.WriteString(html.EscapeString(textContent))
		w.WriteString(`"></pb33f-render-operation-path>`)
		return ast.WalkSkipChildren, nil
	}

	// Determine CSS classes
	class := r.getPropertyNameClass()

	// Check if this is a component reference (contains #/)
	if r.isComponentReference(textContent) {
		class = class + " component-reference"
	}

	// Check if this is an HTTP response code and add colorization class
	if statusClass := r.getHTTPStatusClass(textContent); statusClass != "" {
		class = class + " " + statusClass
	}

	// Render the code element
	w.WriteString(`<code class="`)
	w.WriteString(class)
	w.WriteString(`">`)

	for c := node.FirstChild(); c != nil; c = c.NextSibling() {
		if text, ok := c.(*ast.Text); ok {
			w.Write(text.Segment.Value(source))
		}
	}

	w.WriteString("</code>")
	return ast.WalkSkipChildren, nil
}

// renderListItem renders list items with custom classes based on change type.
func (r *changeHTMLRenderer) renderListItem(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if entering {
		changeType := r.detectChangeType(node, source)
		classes := r.getListItemClasses(changeType)

		w.WriteString(`<li class="`)
		w.WriteString(classes)
		w.WriteString(`"`)

		if changeType == ChangeTypeBreaking && r.config != nil && r.config.Breaking != nil {
			if r.config.Breaking.DataAttr != "" {
				w.WriteString(` `)
				w.WriteString(r.config.Breaking.DataAttr)
				w.WriteString(`="true"`)
			}
		}

		w.WriteString(">")
	} else {
		w.WriteString("</li>\n")
	}

	return ast.WalkContinue, nil
}

// renderHeading renders headings with custom classes and optional anchors.
func (r *changeHTMLRenderer) renderHeading(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	n := node.(*ast.Heading)

	if entering {
		id := r.getHeadingID(n, source)

		if id != "" {
			n.SetAttribute([]byte("_cached_id"), []byte(id))
		}

		class := r.getHeadingClass()

		if id != "" {
			w.WriteString("<h")
			w.WriteString(fmt.Sprint(n.Level))
			w.WriteString(` id="`)
			w.WriteString(id)
			w.WriteString(`"`)

			if class != "" {
				w.WriteString(` class="`)
				w.WriteString(class)
				w.WriteString(`"`)
			}

			w.WriteString(">")

			if r.shouldAddHeadingAnchor() {
				w.WriteString(`<a href="#`)
				w.WriteString(id)
				w.WriteString(`" class="heading-anchor">`)
			}
		} else {
			w.WriteString("<h")
			w.WriteString(fmt.Sprint(n.Level))

			if class != "" {
				w.WriteString(` class="`)
				w.WriteString(class)
				w.WriteString(`"`)
			}

			w.WriteString(">")
		}
	} else {
		n := node.(*ast.Heading)

		if r.shouldAddHeadingAnchor() {
			if _, ok := n.AttributeString("_cached_id"); ok {
				w.WriteString("</a>")
			}
		}

		w.WriteString("</h")
		w.WriteString(fmt.Sprint(n.Level))
		w.WriteString(">\n")
	}

	return ast.WalkContinue, nil
}

// renderEmphasis renders emphasis with special handling for breaking indicators.
// For HTTP methods, it uses the custom pb33f-http-method component.
func (r *changeHTMLRenderer) renderEmphasis(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	n := node.(*ast.Emphasis)

	if n.Level == 2 {
		var textContent string
		for c := node.FirstChild(); c != nil; c = c.NextSibling() {
			if text, ok := c.(*ast.Text); ok {
				textContent = string(text.Segment.Value(source))
				break
			}
		}

		if r.isHTTPMethod(textContent) {
			if entering {
				w.WriteString(`<pb33f-http-method method="`)
				w.WriteString(textContent)
				w.WriteString(`" tiny></pb33f-http-method>`)
			}
			return ast.WalkSkipChildren, nil
		}
	}

	isBreaking := r.containsBreakingText(node, source)
	breakingClass := r.getBreakingClass()

	if entering {
		if n.Level == 1 {
			if isBreaking && breakingClass != "" {
				w.WriteString(`<em class="`)
				w.WriteString(breakingClass)
				w.WriteString(`">`)
			} else {
				w.WriteString("<em>")
			}
		} else {
			if isBreaking && breakingClass != "" {
				w.WriteString(`<strong class="`)
				w.WriteString(breakingClass)
				w.WriteString(`">`)
			} else {
				w.WriteString("<strong>")
			}
		}
	} else {
		if n.Level == 1 {
			w.WriteString("</em>")
		} else {
			w.WriteString("</strong>")
		}
	}

	return ast.WalkContinue, nil
}

// renderLink renders links with custom classes and external link handling.
func (r *changeHTMLRenderer) renderLink(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	n := node.(*ast.Link)

	if entering {
		dest := string(n.Destination)

		w.WriteString(`<a href="`)
		w.Write(util.EscapeHTML(n.Destination))
		w.WriteString(`"`)

		linkClass := r.getLinkClass()
		if linkClass != "" {
			w.WriteString(` class="`)
			w.WriteString(linkClass)
			w.WriteString(`"`)
		}

		if r.shouldOpenExternalLinksInNewTab() && isExternalLink(dest) {
			w.WriteString(` target="_blank" rel="noopener noreferrer"`)
		}

		if n.Attributes() != nil {
			gmhtml.RenderAttributes(w, n, gmhtml.LinkAttributeFilter)
		}

		w.WriteString(">")
	} else {
		w.WriteString("</a>")
	}

	return ast.WalkContinue, nil
}

// detectChangeType analyzes list item content to determine change type.
// note: this text-based detection is fragile and should be replaced with
// metadata attributes attached during markdown generation for better performance.
func (r *changeHTMLRenderer) detectChangeType(node ast.Node, source []byte) ChangeType {
	var textBuf bytes.Buffer
	textBuf.Grow(256)

	r.collectText(node, source, &textBuf)

	if textBuf.Len() == 0 {
		return ChangeTypeUnknown
	}

	content := bytes.ToLower(textBuf.Bytes())

	if bytes.Contains(content, []byte("breaking")) {
		return ChangeTypeBreaking
	}
	if bytes.Contains(content, []byte("added")) {
		return ChangeTypeAddition
	}
	if bytes.Contains(content, []byte("removed")) {
		return ChangeTypeRemoval
	}
	if bytes.Contains(content, []byte("changed")) || bytes.Contains(content, []byte("modified")) {
		return ChangeTypeModification
	}

	return ChangeTypeUnknown
}

// collectText recursively collects all text content from a node and its children.
func (r *changeHTMLRenderer) collectText(node ast.Node, source []byte, buf *bytes.Buffer) {
	if text, ok := node.(*ast.Text); ok {
		buf.Write(text.Segment.Value(source))
	}

	for child := node.FirstChild(); child != nil; child = child.NextSibling() {
		r.collectText(child, source, buf)
	}
}

// getListItemClasses returns CSS classes for a list item based on change type.
func (r *changeHTMLRenderer) getListItemClasses(changeType ChangeType) string {
	if r.config == nil || r.config.Styling == nil {
		return ""
	}

	switch changeType {
	case ChangeTypeBreaking:
		return r.config.Breaking.Class
	case ChangeTypeAddition:
		return r.config.Styling.AdditionClass
	case ChangeTypeModification:
		return r.config.Styling.ModificationClass
	case ChangeTypeRemoval:
		return r.config.Styling.RemovalClass
	default:
		return ""
	}
}

// containsBreakingText checks if a node contains the word "breaking".
func (r *changeHTMLRenderer) containsBreakingText(node ast.Node, source []byte) bool {
	var textBuf bytes.Buffer
	textBuf.Grow(128)

	r.collectText(node, source, &textBuf)

	if textBuf.Len() == 0 {
		return false
	}

	content := bytes.ToLower(textBuf.Bytes())
	return bytes.Contains(content, []byte("breaking"))
}

// getHeadingID extracts or generates an ID for a heading.
func (r *changeHTMLRenderer) getHeadingID(heading *ast.Heading, source []byte) string {
	if id, ok := heading.AttributeString("id"); ok {
		return string(id.([]byte))
	}

	var textBuf bytes.Buffer
	textBuf.Grow(64)

	r.collectText(heading, source, &textBuf)

	if textBuf.Len() == 0 {
		return ""
	}

	id := slugify(textBuf.String())

	prefix := r.getHeadingIDPrefix()
	if prefix != "" {
		id = prefix + id
	}

	return id
}

// slugify converts text to a URL-safe slug for use as HTML anchor ID.
func slugify(s string) string {
	var result strings.Builder
	result.Grow(len(s))

	prevHyphen := false
	for _, r := range strings.ToLower(s) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			result.WriteRune(r)
			prevHyphen = false
		} else if !prevHyphen && result.Len() > 0 {
			result.WriteRune('-')
			prevHyphen = true
		}
	}

	return strings.TrimSuffix(result.String(), "-")
}

// isExternalLink checks if a URL is an external http/https link.
func isExternalLink(dest string) bool {
	return strings.HasPrefix(dest, "http://") || strings.HasPrefix(dest, "https://")
}

// config accessor helpers - eliminate nil checks in hot paths.

func (r *changeHTMLRenderer) getPropertyNameClass() string {
	if r.config != nil && r.config.Styling != nil && r.config.Styling.PropertyNameClass != "" {
		return r.config.Styling.PropertyNameClass
	}
	return "code"
}

func (r *changeHTMLRenderer) getHeadingClass() string {
	if r.config != nil && r.config.HTML != nil {
		return r.config.HTML.HeadingClass
	}
	return ""
}

func (r *changeHTMLRenderer) getBreakingClass() string {
	if r.config != nil && r.config.Breaking != nil {
		return r.config.Breaking.Class
	}
	return ""
}

func (r *changeHTMLRenderer) getLinkClass() string {
	if r.config != nil && r.config.HTML != nil {
		return r.config.HTML.LinkClass
	}
	return ""
}

func (r *changeHTMLRenderer) getHeadingIDPrefix() string {
	if r.config != nil && r.config.HTML != nil {
		return r.config.HTML.HeadingIDPrefix
	}
	return ""
}

func (r *changeHTMLRenderer) shouldAddHeadingAnchor() bool {
	return r.config != nil && r.config.HTML != nil && r.config.HTML.AddHeadingAnchors
}

func (r *changeHTMLRenderer) shouldOpenExternalLinksInNewTab() bool {
	return r.config != nil && r.config.HTML != nil && r.config.HTML.ExternalLinksNewTab
}

func (r *changeHTMLRenderer) hasCodeBlockHeaderGenerator() bool {
	return r.config != nil && r.config.CodeBlock != nil && r.config.CodeBlock.HeaderGenerator != nil
}

func (r *changeHTMLRenderer) getCodeBlockHeaderHTML(language string) string {
	if !r.hasCodeBlockHeaderGenerator() {
		return ""
	}
	return r.config.CodeBlock.HeaderGenerator.Generate(language)
}

func (r *changeHTMLRenderer) getCodeBlockClass() string {
	if r.config != nil && r.config.CodeBlock != nil && r.config.CodeBlock.Class != "" {
		return r.config.CodeBlock.Class
	}
	return "code-block"
}

func (r *changeHTMLRenderer) getTableClass() string {
	if r.config != nil && r.config.HTML != nil && r.config.HTML.TableClass != "" {
		return r.config.HTML.TableClass
	}
	return ""
}

func (r *changeHTMLRenderer) getTableHeaderClass() string {
	if r.config != nil && r.config.HTML != nil && r.config.HTML.TableHeaderClass != "" {
		return r.config.HTML.TableHeaderClass
	}
	return ""
}

func (r *changeHTMLRenderer) getTableRowClass() string {
	if r.config != nil && r.config.HTML != nil && r.config.HTML.TableRowClass != "" {
		return r.config.HTML.TableRowClass
	}
	return ""
}

// renderFencedCodeBlock renders fenced code blocks with language class and optional header.
// skips div wrapper when nested list fix is enabled to avoid breaking list continuation.
func (r *changeHTMLRenderer) renderFencedCodeBlock(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	n := node.(*ast.FencedCodeBlock)

	// skip div wrapper entirely when nested list fix is enabled
	// AST parent detection is unreliable, so we use config flag instead
	skipDiv := r.config != nil && r.config.HTML != nil && r.config.HTML.EnableNestedListFix

	if entering {
		language := string(n.Language(source))
		codeClass := r.getCodeBlockClass()

		// skip div wrapper when nested list fix enabled to maintain list continuation
		if !skipDiv {
			w.WriteString(`<div class="`)
			w.WriteString(codeClass)
			w.WriteString(`"`)

			if language != "" {
				w.WriteString(` data-language="`)
				w.WriteString(language)
				w.WriteString(`"`)
			}

			w.WriteString(">")

			if language != "" {
				if headerHTML := r.getCodeBlockHeaderHTML(language); headerHTML != "" {
					w.WriteString(headerHTML)
				}
			}
		}

		w.WriteString(`<pre><code`)

		if language != "" {
			w.WriteString(` class="language-`)
			w.WriteString(language)
			w.WriteString(`"`)
		}

		w.WriteString(">")

		lines := n.Lines()
		for i := 0; i < lines.Len(); i++ {
			line := lines.At(i)
			w.Write(line.Value(source))
		}
	} else {
		// use skipDiv from entering branch (computed at line 619)
		if !skipDiv {
			w.WriteString("</code></pre></div>")
		} else {
			w.WriteString("</code></pre>")
		}
	}

	return ast.WalkSkipChildren, nil
}

// renderBlockquote renders blockquotes with optional custom styling.
func (r *changeHTMLRenderer) renderBlockquote(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if entering {
		w.WriteString("<blockquote")

		if n, ok := node.(*ast.Blockquote); ok && n.Attributes() != nil {
			gmhtml.RenderAttributes(w, n, gmhtml.BlockquoteAttributeFilter)
		}

		w.WriteString(">\n")
	} else {
		w.WriteString("</blockquote>\n")
	}

	return ast.WalkContinue, nil
}

// renderThematicBreak renders horizontal rules.
func (r *changeHTMLRenderer) renderThematicBreak(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if !entering {
		return ast.WalkContinue, nil
	}

	if r.config != nil && r.config.HTML != nil && r.config.HTML.XHTMLOutput {
		w.WriteString("<hr />\n")
	} else {
		w.WriteString("<hr>\n")
	}

	return ast.WalkContinue, nil
}

// renderTable renders tables with custom classes.
func (r *changeHTMLRenderer) renderTable(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if entering {
		tableClass := r.getTableClass()

		w.WriteString("<table")

		if tableClass != "" {
			w.WriteString(` class="`)
			w.WriteString(tableClass)
			w.WriteString(`"`)
		}

		if n, ok := node.(*extAST.Table); ok && n.Attributes() != nil {
			gmhtml.RenderAttributes(w, n, gmhtml.GlobalAttributeFilter)
		}

		w.WriteString(">\n")
	} else {
		w.WriteString("</table>\n")
	}

	return ast.WalkContinue, nil
}

// renderTableHeader renders table headers.
func (r *changeHTMLRenderer) renderTableHeader(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if entering {
		headerClass := r.getTableHeaderClass()

		w.WriteString("<thead")

		if headerClass != "" {
			w.WriteString(` class="`)
			w.WriteString(headerClass)
			w.WriteString(`"`)
		}

		w.WriteString(">\n")
	} else {
		w.WriteString("</thead>\n")
	}

	return ast.WalkContinue, nil
}

// renderTableRow renders table rows.
func (r *changeHTMLRenderer) renderTableRow(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	if entering {
		rowClass := r.getTableRowClass()

		w.WriteString("<tr")

		if rowClass != "" {
			w.WriteString(` class="`)
			w.WriteString(rowClass)
			w.WriteString(`"`)
		}

		w.WriteString(">")
	} else {
		w.WriteString("</tr>\n")
	}

	return ast.WalkContinue, nil
}

// renderTableCell renders table cells (th or td).
func (r *changeHTMLRenderer) renderTableCell(
	w util.BufWriter,
	source []byte,
	node ast.Node,
	entering bool,
) (ast.WalkStatus, error) {
	n := node.(*extAST.TableCell)
	tag := getTableCellTag(n)

	if entering {
		w.WriteString("<")
		w.WriteString(tag)

		if n.Alignment != extAST.AlignNone {
			w.WriteString(` align="`)
			w.WriteString(alignmentToString(n.Alignment))
			w.WriteString(`"`)
		}

		w.WriteString(">")
	} else {
		w.WriteString("</")
		w.WriteString(tag)
		w.WriteString(">")
	}

	return ast.WalkContinue, nil
}

// helper functions for table rendering.

func getTableCellTag(cell *extAST.TableCell) string {
	// check if this cell is in a table header by walking up the parent chain
	parent := cell.Parent()
	for parent != nil {
		if _, ok := parent.(*extAST.TableHeader); ok {
			return "th"
		}
		parent = parent.Parent()
	}
	return "td"
}

func alignmentToString(alignment extAST.Alignment) string {
	switch alignment {
	case extAST.AlignLeft:
		return "left"
	case extAST.AlignCenter:
		return "center"
	case extAST.AlignRight:
		return "right"
	default:
		return ""
	}
}

// shouldRenderObjectIcon determines if we should render an icon for this code span.
func (r *changeHTMLRenderer) shouldRenderObjectIcon() bool {
	return r.config != nil && r.config.HTML != nil && r.config.HTML.EnableObjectIcons
}

// isInsideHeading checks if a node is inside a heading element.
func (r *changeHTMLRenderer) isInsideHeading(node ast.Node) bool {
	for parent := node.Parent(); parent != nil; parent = parent.Parent() {
		if _, ok := parent.(*ast.Heading); ok {
			return true
		}
	}
	return false
}

// isTopLevelListItem checks if a node is inside a top-level list item (not nested).
// Returns true for first-level lists, false for nested lists.
func (r *changeHTMLRenderer) isTopLevelListItem(node ast.Node) bool {
	listDepth := 0

	// Walk up the tree counting list nodes
	for parent := node.Parent(); parent != nil; parent = parent.Parent() {
		if _, ok := parent.(*ast.List); ok {
			listDepth++
		}
	}

	// Top-level lists have depth = 1
	return listDepth == 1
}

// extractLocationPrefix extracts the location prefix from compound parameter patterns.
// For "Header Parameter " returns "Header", for "Query Parameter " returns "Query", etc.
// Returns empty string if no location prefix is found.
func (r *changeHTMLRenderer) extractLocationPrefix(text string) string {
	trimmed := strings.TrimSpace(text)

	locationPrefixes := []string{"Query", "Path", "Header", "Cookie"}
	for _, prefix := range locationPrefixes {
		if strings.HasPrefix(trimmed, prefix+" Parameter") {
			return prefix
		}
	}

	return ""
}

// matchesObjectTypePattern checks if text matches an object type pattern.
// Returns the icon type and whether a match was found.
func (r *changeHTMLRenderer) matchesObjectTypePattern(text string) (string, bool) {
	// Trim and check if text ends with common object type patterns
	text = strings.TrimSpace(text)

	// Check for object type patterns
	// Patterns check the end of the text to match "Response ", "Parameter ", etc.
	objectTypes := []struct {
		pattern string
		icon    string
	}{
		{"Request Body", "requestBody"},
		{"Request Bodies", "requestBody"},
		{"Response Body", "requestBody"},
		{"Security Scheme:", "securityScheme"},
		{"Media Type", "mediaType"},
		{"External Doc", "externalDoc"},
		{"Schema:", "schema"},
		{"Query Parameter", "parameter"},   // compound patterns for parameter locations
		{"Path Parameter", "parameter"},
		{"Header Parameter", "parameter"},
		{"Cookie Parameter", "parameter"},
		{"Parameter", "parameter"},          // generic fallback
		{"Response", "response"},
		{"Responses", "response"},
		{"Header", "header"},
		{"Security", "security"},
		{"Link", "link"},
		{"Callback", "callback"},
		{"Callbacks", "callback"},
		{"Example", "example"},
		{"Webhook", "webhook"},
		{"Server:", "server"},
		{"Tag", "tag"},
		{"Path", "path"},
		{"Operation", "operation"},
		{"Deprecated", "operation"},  // deprecated items use operation icon for consistency
		{"Extension", "extension"},
		{"Component", "components"},
	}

	for _, ot := range objectTypes {
		// Check if text ends with the pattern (with optional colon and space)
		if strings.HasSuffix(text, ot.pattern+" ") ||
		   strings.HasSuffix(text, ot.pattern+": ") ||
		   text == ot.pattern ||
		   text == ot.pattern+":" {
			return ot.icon, true
		}
	}

	return "", false
}

// isOperationPath checks if a string looks like an API operation path
func (r *changeHTMLRenderer) isOperationPath(text string) bool {
	if text == "" {
		return false
	}

	if strings.HasPrefix(text, "/") {
		if strings.Contains(text, "#/") || strings.HasPrefix(text, "#/") {
			return false
		}
		if strings.Contains(text, "/components/") || strings.Contains(text, "/definitions/") {
			return false
		}
		return true
	}

	return false
}

// isComponentReference checks if a string contains a JSON Schema reference (#/).
// This covers local references (#/components/...), file references (file.yaml#/...),
// and remote references (https://example.com/api.yaml#/...).
func (r *changeHTMLRenderer) isComponentReference(text string) bool {
	return strings.Contains(text, "#/")
}

// getHTTPStatusClass returns a CSS class based on HTTP status code ranges.
// Returns "http-200" for 1xx-3xx, "http-400" for 4xx, "http-500" for 5xx+.
// Returns empty string if text is not a valid HTTP status code.
func (r *changeHTMLRenderer) getHTTPStatusClass(text string) string {
	// Try to parse the text as an integer
	text = strings.TrimSpace(text)

	// Simple validation: should be 3 digits
	if len(text) != 3 {
		return ""
	}

	// Check if all characters are digits
	for _, ch := range text {
		if ch < '0' || ch > '9' {
			return ""
		}
	}

	// Parse as integer
	code := 0
	for _, ch := range text {
		code = code*10 + int(ch-'0')
	}

	// Classify based on ranges (matching ExtractStatusStyleFromCodeByCode)
	if code >= 100 && code < 400 {
		return "http-200"
	}
	if code >= 400 && code < 500 {
		return "http-400"
	}
	if code >= 500 {
		return "http-500"
	}

	return ""
}

// isHTTPMethod checks if a string is an HTTP method
func (r *changeHTMLRenderer) isHTTPMethod(text string) bool {
	switch text {
	case "GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS", "TRACE", "CONNECT", "QUERY":
		return true
	default:
		return false
	}
}

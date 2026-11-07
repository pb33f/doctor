// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"html"
	"strings"
)

// prismJSON highlights JSON with the token classes Prism's JSON grammar
// uses, so the page CSS colours it as it coloured Prism's output.
func prismJSON(code string) string {
	var w strings.Builder
	token := func(class, text string) {
		w.WriteString(`<span class="token ` + class + `">` + html.EscapeString(text) + `</span>`)
	}
	for i := 0; i < len(code); {
		ch := code[i]
		switch {
		case ch == '"':
			end := i + 1
			for end < len(code) && code[end] != '"' && code[end] != '\n' {
				if code[end] == '\\' {
					end++
				}
				end++
			}
			if end < len(code) && code[end] == '"' {
				end++
			}
			text := code[i:min(end, len(code))]
			rest := strings.TrimLeft(code[min(end, len(code)):], " \t\r\n")
			if strings.HasPrefix(rest, ":") {
				token("property", text)
			} else {
				token("string", text)
			}
			i = end
		case strings.ContainsRune("{}[],", rune(ch)):
			token("punctuation", string(ch))
			i++
		case ch == ':':
			token("operator", ":")
			i++
		case ch == '-' || (ch >= '0' && ch <= '9'):
			end := i + 1
			for end < len(code) && strings.ContainsRune("0123456789.eE+-", rune(code[end])) {
				end++
			}
			token("number", code[i:end])
			i = end
		case strings.HasPrefix(code[i:], "true") || strings.HasPrefix(code[i:], "false"):
			word := "true"
			if ch == 'f' {
				word = "false"
			}
			token("boolean", word)
			i += len(word)
		case strings.HasPrefix(code[i:], "null"):
			token("null keyword", "null")
			i += 4
		default:
			w.WriteString(html.EscapeString(string(ch)))
			i++
		}
	}
	return w.String()
}

// exampleEntry is one example a selector shows: a name (empty for the
// generated mock) and its JSON.
type exampleEntry struct {
	Key         string
	JSON        string
	Description string
}

// exampleOptions are the attributes of an inline pp-example-selector.
type exampleOptions struct {
	HideLabel            bool
	ShowExpand           bool
	ShowVisibilityToggle bool
	Title                string
	// Language is json (the default), yaml or xml.
	Language string
	Owner    string
}

func inlineExampleLabel(key string) string {
	if strings.Contains(strings.ToLower(key), "example") {
		return key
	}
	return key + " Example"
}

// exampleSelector writes an inline pp-example-selector with the examples it
// shows. With several, every code block is written and a select chooses one;
// the first shows.
func (c *contentRenderer) exampleSelector(entries []exampleEntry, opts exampleOptions) string {
	if len(entries) == 0 {
		return ""
	}
	owner := opts.Owner
	if owner == "" {
		owner = "page"
	}
	title := opts.Title
	if title == "" {
		title = "Example"
	}
	language := opts.Language
	if language == "" {
		language = "json"
	}
	attrs := ` mode="inline" code-language="` + language + `" example-title="` + html.EscapeString(title) + `"`
	if opts.HideLabel {
		attrs += ` hide-label`
	}
	if opts.ShowExpand {
		attrs += ` show-expand`
	}
	if opts.ShowVisibilityToggle {
		attrs += ` show-visibility-toggle`
	}
	var w strings.Builder
	w.WriteString(`<pp-example-selector` + attrs + ` data-pp-owner="` + owner + `" data-pp-ssr>`)
	if !opts.HideLabel {
		label := "Example"
		if len(entries) == 1 {
			label = inlineExampleLabel(entries[0].Key)
		}
		w.WriteString(`<div class="inline-example-label">` + html.EscapeString(label) + `</div>`)
	}
	for i, entry := range entries {
		hidden := ""
		if i > 0 {
			hidden = " hidden"
		}
		fmt.Fprintf(&w, `<div class="pp-example-entry" data-index="%d"%s>%s</div>`, i, hidden, c.exampleCodeBlock(entry.JSON, language, opts))
	}
	if len(entries) > 1 {
		w.WriteString(`<div class="inline-selector-row"><select class="pp-example-select" aria-label="Example">`)
		for i, entry := range entries {
			fmt.Fprintf(&w, `<option value="%d">%s</option>`, i, html.EscapeString(inlineExampleLabel(entry.Key)))
		}
		w.WriteString(`</select>`)
		for i, entry := range entries {
			if entry.Description == "" {
				continue
			}
			hidden := ""
			if i > 0 {
				hidden = " hidden"
			}
			fmt.Fprintf(&w, `<div class="pp-example-desc" data-index="%d"%s>%s</div>`, i, hidden, c.markdown(entry.Description, "inline-example-desc pp-markdown"))
		}
		w.WriteString(`</div>`)
	}
	w.WriteString(`</pp-example-selector>`)
	return w.String()
}

// exampleAction is a floating example button and its tooltip.
func (c *contentRenderer) exampleAction(action, icon, label, tooltip string) string {
	id := c.nextID("pp-example-" + action)
	return fmt.Sprintf(`<button type="button" id="%s" class="floating-action floating-%s" data-pp-example-action="%s" aria-label="%s"><wa-icon name="%s" aria-hidden="true"></wa-icon></button><wa-tooltip for="%s">%s</wa-tooltip>`,
		id, action, action, html.EscapeString(label), icon, id, html.EscapeString(tooltip))
}

func (c *contentRenderer) exampleCodeBlock(code, language string, opts exampleOptions) string {
	if language == "json" {
		code = jsPretty([]byte(code))
	}
	var w strings.Builder
	w.WriteString(`<div class="code-container"><div class="floating-actions">`)
	if opts.ShowVisibilityToggle {
		w.WriteString(c.exampleAction("hide", "eye-slash", "Hide example", "hide example"))
	}
	if opts.ShowExpand {
		w.WriteString(c.exampleAction("expand", "arrows-fullscreen", "Expand", "view expanded example"))
	}
	w.WriteString(c.exampleAction("copy", "copy", "Copy example to clipboard", "copy example to clipboard"))
	w.WriteString(`</div>` + c.codeViewer(code, language, "pp-example-selector") + `</div>`)
	return w.String()
}

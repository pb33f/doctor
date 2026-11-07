// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"encoding/json"
	"html"
	"net/http"
	"sort"
	"strconv"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
)

func statusColorClass(code string) string {
	n, _ := strconv.Atoi(code)
	switch {
	case n >= 500:
		return "status-error"
	case n >= 400:
		return "status-warn"
	}
	return "status-ok"
}

func statusText(code string) string {
	n, err := strconv.Atoi(code)
	if err != nil {
		return ""
	}
	return http.StatusText(n)
}

// refPopoverLink is a link to a component, in the popover that previews it.
func (c *contentRenderer) refPopoverLink(link *ppmodel.ComponentLink, label, class, owner string) string {
	if link == nil {
		return ""
	}
	if label == "" {
		label = link.Name
	}
	if class == "" {
		class = "ref-link"
	}
	href := render.DocHref(c.base, "models/"+link.TypeSlug+"/"+link.Slug+".html")
	return `<pp-ref-popover registry-key="` + html.EscapeString(link.ComponentType+"/"+link.Name) + `" data-pp-owner="` + owner + `"><a class="` + class +
		`" href="` + html.EscapeString(href) + `">➜ ` + html.EscapeString(label) + `</a></pp-ref-popover>`
}

// headerSchema turns a response header into the schema its constraints come
// from.
func headerSchema(h *ppmodel.HeaderInfo) *contentSchema {
	s := &contentSchema{Pattern: h.Pattern}
	if h.Example != "" {
		s.Example, _ = json.Marshal(h.Example)
	}
	if h.Default != "" {
		s.Default, _ = json.Marshal(h.Default)
	}
	if h.Minimum != nil {
		s.Minimum = json.RawMessage(strconv.FormatFloat(*h.Minimum, 'f', -1, 64))
	}
	if h.Maximum != nil {
		s.Maximum = json.RawMessage(strconv.FormatFloat(*h.Maximum, 'f', -1, 64))
	}
	for _, value := range h.Enum {
		raw, _ := json.Marshal(value)
		s.Enum = append(s.Enum, raw)
	}
	return s
}

func (c *contentRenderer) headerEntry(h *ppmodel.HeaderInfo, owner string) string {
	var w strings.Builder
	name := `<span class="header-name">` + html.EscapeString(h.Name) + `</span>`
	if h.Ref != nil {
		name = c.refPopoverLink(h.Ref, h.Name, "ref-link header-name", owner)
	}
	typeCell := ""
	if h.SchemaType != "" {
		typeCell = `<span class="header-type">` + html.EscapeString(h.SchemaType) + `</span>`
	}
	w.WriteString(`<div class="header-entry"><div class="header-name-col">` + name + `</div><div class="header-type-col">` + typeCell +
		constraintsMarkup(headerSchema(h), true, "") + `</div><div class="header-desc-col">` + c.markdown(h.Description, "") + `</div></div>`)
	if len(h.Extensions) > 0 {
		w.WriteString(`<div class="header-entry header-entry-extensions"><div class="header-name-col">&nbsp;</div><div class="header-type-col">&nbsp;</div><div class="header-desc-col"><div class="header-extensions"><h4>` +
			html.EscapeString(h.Name) + ` Header Extensions</h4>` + c.extensions(h.Extensions, owner) + `</div></div></div>`)
	}
	return w.String()
}

func (c *contentRenderer) responseHeaders(headers []*ppmodel.HeaderInfo, common map[string]bool, owner string) string {
	var unique, shared []*ppmodel.HeaderInfo
	for _, h := range headers {
		if h == nil {
			continue
		}
		if common[h.Name] {
			shared = append(shared, h)
		} else {
			unique = append(unique, h)
		}
	}
	if len(unique) == 0 && len(shared) == 0 {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<div class="headers-section"><h4 class="headers-label">Response Headers</h4>`)
	if len(unique) > 0 {
		w.WriteString(`<div class="headers-values">`)
		for _, h := range unique {
			w.WriteString(c.headerEntry(h, owner))
		}
		w.WriteString(`</div>`)
	}
	if len(shared) > 0 {
		w.WriteString(`<div class="common-link-label">↑ common headers</div><ul class="common-header-list">`)
		for _, h := range shared {
			w.WriteString(`<li><a class="header-anchor" href="#header-` + html.EscapeString(h.Name) + `" data-pp-reveal>` + html.EscapeString(h.Name) + `</a></li>`)
		}
		w.WriteString(`</ul>`)
	}
	w.WriteString(`</div>`)
	return w.String()
}

func (c *contentRenderer) responseLinks(links []*ppmodel.LinkInfo, owner string) string {
	if len(links) == 0 {
		return ""
	}
	var w strings.Builder
	w.WriteString(`<div class="links-section"><h4 class="links-label">Response Links</h4>`)
	for _, l := range links {
		if l == nil {
			continue
		}
		name := html.EscapeString(l.Name)
		if l.Ref != nil {
			name = c.refPopoverLink(&ppmodel.ComponentLink{Name: l.Ref.Name, ComponentType: "links", TypeSlug: l.Ref.TypeSlug, Slug: l.Ref.Slug}, l.Name, "", owner)
		}
		w.WriteString(`<div class="link-entry"><span class="link-name">` + name + `</span>`)
		if l.OperationId != "" {
			target := html.EscapeString(l.OperationId)
			if l.OperationSlug != "" {
				target = `<a class="ref-link" href="` + html.EscapeString(render.DocHref(c.base, "operations/"+l.OperationSlug+".html")) + `">` + target + `</a>`
			}
			w.WriteString(` <span class="link-target">→ ` + target + `</span>`)
		}
		if l.OperationRef != "" {
			w.WriteString(` <span class="link-target">→ ` + html.EscapeString(l.OperationRef) + `</span>`)
		}
		w.WriteString(c.markdown(l.Description, "link-desc pp-markdown") + `</div>`)
	}
	w.WriteString(`</div>`)
	return w.String()
}

// errorRefKey is the key error responses share when they return the same
// response or schema.
func errorRefKey(resp *ppmodel.ResponseInfo) string {
	if resp.Ref != nil {
		return "ref:" + resp.Ref.Slug
	}
	if len(resp.Content) > 0 && resp.Content[0] != nil {
		mt := resp.Content[0]
		if mt.SchemaRef != nil {
			return "schema:" + mt.SchemaRef.Slug
		}
		if mt.IsArray && mt.ItemsRef != nil {
			return "items:" + mt.ItemsRef.Slug
		}
	}
	return ""
}

// commonError is an error schema two or more status codes share.
type commonError struct {
	key   string
	resp  *ppmodel.ResponseInfo
	codes []*ppmodel.ResponseInfo
}

func commonErrors(errors []*ppmodel.ResponseInfo) []*commonError {
	var order []*commonError
	byKey := map[string]*commonError{}
	for _, r := range errors {
		key := errorRefKey(r)
		if key == "" {
			continue
		}
		if existing := byKey[key]; existing != nil {
			existing.codes = append(existing.codes, r)
			continue
		}
		entry := &commonError{key: key, resp: r, codes: []*ppmodel.ResponseInfo{r}}
		byKey[key] = entry
		order = append(order, entry)
	}
	var common []*commonError
	for _, entry := range order {
		if len(entry.codes) >= 2 {
			common = append(common, entry)
		}
	}
	return common
}

func (c *contentRenderer) mediaTypeRefHeader(mt *ppmodel.MediaTypeInfo) string {
	switch {
	case mt.IsArray && mt.ItemsRef != nil:
		return `<span class="media-type-label">` + html.EscapeString(mt.MediaType) + `</span> <span class="array-type">Array&lt;` + c.componentRefLink(mt.ItemsRef) + `&gt;</span>`
	case mt.SchemaRef != nil:
		return `<span class="media-type-label">` + html.EscapeString(mt.MediaType) + `</span> ` + c.componentRefLink(mt.SchemaRef)
	}
	return ""
}

func (c *contentRenderer) response(resp *ppmodel.ResponseInfo, common map[string]bool, commonKeys map[string]bool, owner string) string {
	var w strings.Builder
	w.WriteString(`<div class="response" id="response-` + html.EscapeString(resp.StatusCode) + `" data-nav-label="` + html.EscapeString(strings.TrimSpace(resp.StatusCode+" "+statusText(resp.StatusCode))) + `"><h3><span class="status-code ` + statusColorClass(resp.StatusCode) + `">` +
		html.EscapeString(resp.StatusCode) + `</span> ` + html.EscapeString(statusText(resp.StatusCode)) + ` `)
	if resp.RawJSON != "" || resp.RawYAML != "" {
		w.WriteString(rawViewerButton("pp-response-raw-"+resp.StatusCode, "Response "+resp.StatusCode, resp.RawJSON, resp.RawYAML, resp.SourceLine, resp.Location, owner))
	}
	w.WriteString(`</h3>`)
	if resp.DescHTML != "" {
		w.WriteString(`<div class="response-desc">` + resp.DescHTML + `</div>`)
	} else {
		w.WriteString(c.markdown(resp.Description, "response-desc pp-markdown"))
	}
	key := ""
	if commonKeys != nil {
		key = errorRefKey(resp)
	}
	switch {
	case key != "" && commonKeys[key]:
		w.WriteString(`<div class="common-error-link">`)
		if resp.Ref != nil {
			w.WriteString(c.refPopoverLink(resp.Ref, "", "", owner))
		} else if len(resp.Content) > 0 && resp.Content[0] != nil {
			w.WriteString(c.mediaTypeRefHeader(resp.Content[0]))
		}
		w.WriteString(` <a class="error-anchor" href="#common-error-` + html.EscapeString(key) + `" data-pp-reveal>↑ see common example</a></div>`)
	case resp.Ref != nil:
		w.WriteString(c.refPopoverLink(resp.Ref, "", "", owner))
	case len(resp.Content) > 0:
		w.WriteString(c.mediaTypeSelector(resp.Content, mediaTypeOptions{Owner: owner}))
	}
	w.WriteString(c.responseHeaders(resp.Headers, common, owner))
	w.WriteString(c.responseLinks(resp.Links, owner))
	if len(resp.Extensions) > 0 {
		w.WriteString(`<div class="response-extensions"><h4>Response ` + html.EscapeString(resp.StatusCode) + ` Extensions</h4>` + c.extensions(resp.Extensions, owner) + `</div>`)
	}
	w.WriteString(`</div>`)
	return w.String()
}

func detailsSection(summaryTag, title, body string) string {
	return `<wa-details class="pp-details"><` + summaryTag + ` slot="summary" class="pp-details-summary"><h3>` + title + `</h3></` + summaryTag + `>` + body + `</wa-details>`
}

// operationResponses writes pp-operation-responses with every response, as
// the component grouped them: success, redirects, common headers, errors.
func (c *contentRenderer) operationResponses(responses []*ppmodel.ResponseInfo, commonHeaders []*ppmodel.HeaderInfo) string {
	const owner = "pp-operation-responses"
	var kept []*ppmodel.ResponseInfo
	for _, r := range responses {
		if r != nil {
			kept = append(kept, r)
		}
	}
	sort.SliceStable(kept, func(i, j int) bool {
		a, _ := strconv.Atoi(kept[i].StatusCode)
		b, _ := strconv.Atoi(kept[j].StatusCode)
		return a < b
	})
	var success, redirect, errors []*ppmodel.ResponseInfo
	for _, r := range kept {
		code, _ := strconv.Atoi(r.StatusCode)
		switch {
		case code >= 400:
			errors = append(errors, r)
		case code >= 300:
			redirect = append(redirect, r)
		default:
			success = append(success, r)
		}
	}
	common := map[string]bool{}
	for _, h := range commonHeaders {
		if h != nil {
			common[h.Name] = true
		}
	}
	shared := commonErrors(errors)
	commonKeys := map[string]bool{}
	for _, entry := range shared {
		commonKeys[entry.key] = true
	}

	var w strings.Builder
	w.WriteString(`<pp-operation-responses id="section-responses" data-nav-label="Responses" data-pp-owner="page" data-pp-ssr>`)
	if len(kept) > 0 {
		w.WriteString(`<h2>Responses</h2>`)
		for _, r := range success {
			w.WriteString(c.response(r, common, nil, owner))
		}
		if len(redirect) > 0 {
			var body strings.Builder
			for _, r := range redirect {
				body.WriteString(c.response(r, common, nil, owner))
			}
			w.WriteString(detailsSection("span", "Redirect Responses", body.String()))
		}
		if len(commonHeaders) > 0 {
			var body strings.Builder
			body.WriteString(`<div class="property-box">`)
			for _, h := range commonHeaders {
				if h != nil {
					body.WriteString(`<div id="header-` + html.EscapeString(h.Name) + `">` + c.headerEntry(h, owner) + `</div>`)
				}
			}
			body.WriteString(`</div>`)
			w.WriteString(detailsSection("span", "Common Response Headers", body.String()))
		}
		if len(errors) > 0 || len(shared) > 0 {
			var body strings.Builder
			if len(shared) > 0 {
				body.WriteString(`<div class="response-group-heading"><h4>Common Error Responses</h4></div>`)
				for _, entry := range shared {
					body.WriteString(`<div class="response common-error-response" id="common-error-` + html.EscapeString(entry.key) + `"><div class="common-error-grid">`)
					for _, r := range entry.codes {
						body.WriteString(`<div class="common-error-code"><span class="` + statusColorClass(r.StatusCode) + `">` + html.EscapeString(r.StatusCode) + `</span> ` +
							html.EscapeString(statusText(r.StatusCode)) + `</div>` + c.markdown(r.Description, "common-error-desc pp-markdown"))
					}
					body.WriteString(`</div>`)
					switch {
					case entry.resp.Ref != nil:
						body.WriteString(c.refPopoverLink(entry.resp.Ref, "", "", owner))
					case len(entry.resp.Content) > 0:
						body.WriteString(c.mediaTypeSelector(entry.resp.Content, mediaTypeOptions{Owner: owner}))
					}
					body.WriteString(c.responseHeaders(entry.resp.Headers, common, owner) + `</div>`)
				}
			}
			for _, r := range errors {
				body.WriteString(c.response(r, common, commonKeys, owner))
			}
			w.WriteString(detailsSection("div", "Error Responses", body.String()))
		}
	}
	w.WriteString(`</pp-operation-responses>`)
	return w.String()
}

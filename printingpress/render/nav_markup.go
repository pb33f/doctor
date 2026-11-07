// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"fmt"
	"html"
	"html/template"
	"strconv"
	"strings"
	"time"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

// NavMarkupParams is what the navigation column of one API page shows.
type NavMarkupParams struct {
	BaseURL       string
	ActiveSlug    string
	DeveloperMode bool
	Tags          []*ppmodel.NavTag
	ModelGroups   []*ppmodel.NavModelGroup
	Webhooks      []*ppmodel.NavOperation
	Pages         []*ppmodel.ContentPage
	Header        *ppmodel.SiteHeaderContext
	// DocsExpiresAt and ArchiveExportURL are the hosted-docs controls.
	DocsExpiresAt    string
	ArchiveExportURL string
	// Now is the build time, for the docs expiry label.
	Now time.Time
}

// ssrAttrs marks a component whose rendered markup the server wrote, and
// names the component that rendered it, as the component's own render would.
func ssrAttrs(owner string) string {
	return ` data-pp-owner="` + owner + `" data-pp-ssr`
}

// writeNavMarkup writes the children pp-nav, pp-nav-tag and pp-nav-model-group
// render for this page: the same elements, classes and open groups. The page
// then looks the same before and after the components take over, so nothing
// moves. Every row of an open group is written; closed groups are headers
// only, as the components draw them, and fill in from the shared nav data
// when opened. Keep this in step with the components' templates.
func writeNavMarkup(w *strings.Builder, p NavMarkupParams) {
	local := func(w *strings.Builder) { writeLocalNav(w, p) }
	writeHostedArchiveControls(w, p.ArchiveExportURL)
	writeDocsExpiry(w, p.DocsExpiresAt, p.Now)
	if groups := multiContractGroups(p.Header); len(groups) > 0 {
		writeContractNavigation(w, p, groups, local)
		return
	}
	local(w)
}

func navClass(base string, flags ...string) string {
	parts := []string{base}
	for _, flag := range flags {
		if flag != "" {
			parts = append(parts, flag)
		}
	}
	return strings.Join(parts, " ")
}

// classList joins the flags that are set, for a class attribute with no base.
func classList(flags ...string) string {
	return strings.TrimSpace(navClass("", flags...))
}

func flag(on bool, name string) string {
	if on {
		return name
	}
	return ""
}

func writeLocalNav(w *strings.Builder, p NavMarkupParams) {
	overviewLabel := "API OVERVIEW"
	overviewHref := DocHref(p.BaseURL, "index.html")
	if p.Header != nil {
		if label := strings.TrimSpace(p.Header.OverviewLabel); label != "" {
			overviewLabel = label
		}
		if p.Header.OverviewHref != "" {
			overviewHref = DocHref(p.BaseURL, p.Header.OverviewHref)
		}
	}
	fmt.Fprintf(w, `<a class="%s" href="%s"><wa-icon name="chevron-right" class="nav-home-chevron"></wa-icon>%s</a>`,
		navClass("nav-home", flag(p.ActiveSlug == "", "active")), html.EscapeString(overviewHref), html.EscapeString(overviewLabel))
	if p.DeveloperMode {
		fmt.Fprintf(w, `<a class="%s" href="%s"><wa-icon name="chevron-right" class="nav-home-chevron"></wa-icon>DIAGNOSTICS</a>`,
			navClass("nav-home diagnostics", flag(p.ActiveSlug == "diagnostics", "active")), html.EscapeString(DocHref(p.BaseURL, "diagnostics.html")))
	}
	if len(p.Pages) > 0 {
		w.WriteString(`<div class="nav-section nav-pages-section"><h4>Guides</h4><ul class="nav-pages-list">`)
		for _, page := range p.Pages {
			label := page.Label
			if label == "" {
				label = page.Title
			}
			if label == "" {
				label = page.Slug
			}
			fmt.Fprintf(w, `<li><a class="%s" href="%s"><wa-icon name="chevron-right" class="nav-page-chevron"></wa-icon><span>%s</span></a></li>`,
				navClass("nav-page-link", flag(p.ActiveSlug == "content/"+page.Slug, "active")), html.EscapeString(DocHref(p.BaseURL, page.Href)), html.EscapeString(label))
		}
		w.WriteString(`</ul></div>`)
	}
	if len(p.Tags) > 0 {
		w.WriteString(`<div class="nav-section nav-operations-section"><h4>Operations</h4>`)
		for _, tag := range p.Tags {
			writeNavTag(w, p, tag, "pp-nav")
		}
		w.WriteString(`</div>`)
	}
	if len(p.ModelGroups) > 0 {
		w.WriteString(`<div class="nav-section nav-models-section"><h4>Models</h4>`)
		for _, group := range p.ModelGroups {
			writeNavModelGroup(w, p, group)
		}
		w.WriteString(`</div>`)
	}
	if len(p.Webhooks) > 0 {
		w.WriteString(`<div class="nav-section nav-webhooks-section"><h4>Webhooks</h4>`)
		writeNavTag(w, p, &ppmodel.NavTag{Name: "Webhooks", Summary: "Webhooks", Operations: p.Webhooks}, "pp-nav")
		w.WriteString(`</div>`)
	}
}

func navTagContainsSlug(tag *ppmodel.NavTag, slug string) bool {
	if tag == nil || slug == "" {
		return false
	}
	for _, op := range tag.Operations {
		if op != nil && op.Slug == slug {
			return true
		}
	}
	for _, child := range tag.Children {
		if navTagContainsSlug(child, slug) {
			return true
		}
	}
	return false
}

func writeNavTag(w *strings.Builder, p NavMarkupParams, tag *ppmodel.NavTag, owner string) {
	if tag == nil {
		return
	}
	open := navTagContainsSlug(tag, p.ActiveSlug)
	dev := flag(p.DeveloperMode, "developer")
	w.WriteString(`<pp-nav-tag` + ssrAttrs(owner) + `>`)
	fmt.Fprintf(w, `<div class="%s">`, navClass("tag-header", flag(open, "active"), dev))
	writeChevron(w, open)
	w.WriteString(`<span class="tag-name">`)
	if tag.Protocol != "" {
		writeAsyncAPIProtocol(w, tag.Protocol, "pp-nav-tag")
	} else {
		w.WriteString(`<span>` + html.EscapeString(tag.DisplayName()) + `</span>`)
		if len(tag.Protocols) > 0 {
			w.WriteString(`<span class="tag-protocols">`)
			for _, protocol := range tag.Protocols {
				writeAsyncAPIProtocol(w, protocol, "pp-nav-tag")
			}
			w.WriteString(`</span>`)
		}
	}
	w.WriteString(`</span>`)
	if p.DeveloperMode {
		writeViolationBadges(w, tag.Counts)
	}
	w.WriteString(`</div>`)
	if open {
		w.WriteString(`<div class="tag-body">`)
		if len(tag.Operations) > 0 {
			w.WriteString(`<ul>`)
			for _, op := range tag.Operations {
				if op == nil {
					continue
				}
				title := op.Summary
				if title == "" {
					title = op.Path
				}
				fmt.Fprintf(w, `<li><a href="%s" class="%s"><span class="op-title">%s</span>`,
					html.EscapeString(DocHref(p.BaseURL, "operations/"+op.Slug+".html")),
					classList(flag(op.Deprecated, "deprecated"), flag(op.Slug == p.ActiveSlug, "active"), dev),
					html.EscapeString(title))
				if op.SpecKind == ppmodel.SpecKindValueAsyncAPI {
					writeAsyncAPIAction(w, op.Method, "small", "pp-nav-tag")
				} else {
					writeNavMethod(w, op.Method, "pp-nav-tag")
				}
				if p.DeveloperMode {
					writeViolationBadges(w, op.Counts)
				}
				w.WriteString(`</a></li>`)
			}
			w.WriteString(`</ul>`)
		}
		if len(tag.Children) > 0 {
			w.WriteString(`<div class="children">`)
			for _, child := range tag.Children {
				writeNavTag(w, p, child, "pp-nav-tag")
			}
			w.WriteString(`</div>`)
		}
		w.WriteString(`</div>`)
	}
	w.WriteString(`</pp-nav-tag>`)
}

func navGroupContainsSlug(group *ppmodel.NavModelGroup, slug string) bool {
	if group == nil || slug == "" {
		return false
	}
	for _, model := range group.Models {
		if model != nil && model.TypeSlug+"/"+model.Slug == slug {
			return true
		}
	}
	return false
}

func writeNavModelGroup(w *strings.Builder, p NavMarkupParams, group *ppmodel.NavModelGroup) {
	if group == nil {
		return
	}
	open := navGroupContainsSlug(group, p.ActiveSlug)
	dev := flag(p.DeveloperMode, "developer")
	w.WriteString(`<pp-nav-model-group` + ssrAttrs("pp-nav") + `>`)
	fmt.Fprintf(w, `<div class="%s">`, navClass("group-header", flag(open, "active"), dev))
	writeChevron(w, open)
	w.WriteString(`<span>` + html.EscapeString(group.Name) + `</span>`)
	if p.DeveloperMode {
		writeViolationBadges(w, group.Counts)
	}
	w.WriteString(`</div>`)
	if open && len(group.Models) > 0 {
		w.WriteString(`<div class="group-body"><ul>`)
		for _, model := range group.Models {
			if model == nil {
				continue
			}
			slug := model.TypeSlug + "/" + model.Slug
			fmt.Fprintf(w, `<li><a href="%s" class="%s"><span class="model-name">`,
				html.EscapeString(DocHref(p.BaseURL, "models/"+model.TypeSlug+"/"+model.Slug+".html")),
				classList(flag(slug == p.ActiveSlug, "active"), dev))
			if model.Protocol != "" {
				writeAsyncAPIProtocol(w, model.Protocol, "pp-nav-model-group")
			} else {
				w.WriteString(`<span>` + html.EscapeString(model.Name) + `</span>`)
				if len(model.Protocols) > 0 {
					w.WriteString(`<span class="model-protocols">`)
					for _, protocol := range model.Protocols {
						writeAsyncAPIProtocol(w, protocol, "pp-nav-model-group")
					}
					w.WriteString(`</span>`)
				}
			}
			w.WriteString(`</span>`)
			if p.DeveloperMode {
				writeViolationBadges(w, model.Counts)
			}
			w.WriteString(`</a></li>`)
		}
		w.WriteString(`</ul></div>`)
	}
	w.WriteString(`</pp-nav-model-group>`)
}

func writeChevron(w *strings.Builder, open bool) {
	name := "chevron-right"
	if open {
		name = "chevron-down"
	}
	w.WriteString(`<wa-icon name="` + name + `" class="chevron"></wa-icon>`)
}

// navMethodLabels are the short method labels pp-http-method draws in the nav.
var navMethodLabels = map[string]string{
	"GET": "GET", "POST": "POST", "PUT": "PUT", "DELETE": "DEL", "PATCH": "PAT",
	"OPTIONS": "OPT", "HEAD": "HEAD", "TRACE": "TRC", "QUERY": "QRY",
}

func writeNavMethod(w *strings.Builder, method, owner string) {
	upper := strings.ToUpper(method)
	label, ok := navMethodLabels[upper]
	if !ok {
		label = upper
	}
	fmt.Fprintf(w, `<pp-http-method mode="nav-naked" method="%s"%s><span class="pp-http-method__naked %s">%s</span></pp-http-method>`,
		html.EscapeString(method), ssrAttrs(owner), html.EscapeString(strings.ToLower(method)), html.EscapeString(label))
}

func writeAsyncAPIAction(w *strings.Builder, action, size, owner string) {
	normalized := strings.ToLower(strings.TrimSpace(action))
	code, icon, label := strings.ToUpper(strings.TrimSpace(action)), "arrow-right", strings.TrimSpace(action)
	switch normalized {
	case "receive":
		code, icon, label = "RCV", "arrow-left", "Receive"
	case "send":
		code, icon, label = "SND", "arrow-right", "Send"
	}
	fmt.Fprintf(w, `<pp-asyncapi-action action="%s" size="%s"%s><span class="action %s %s" aria-label="%s"><wa-icon name="%s"></wa-icon><span>%s</span></span></pp-asyncapi-action>`,
		html.EscapeString(action), size, ssrAttrs(owner), size, html.EscapeString(normalized), html.EscapeString(label), icon, html.EscapeString(code))
}

// asyncAPIProtocolPresentation is the label and mark pp-asyncapi-protocol
// draws for a protocol.
type asyncAPIProtocolPresentation struct {
	label, mark string
}

// asyncAPIProtocolPresentations are the presentations pp-asyncapi-protocol
// draws, by the normalized protocol name (asyncapi-protocol.ts).
var asyncAPIProtocolPresentations = map[string]asyncAPIProtocolPresentation{
	"amqp":         {"AMQP", "amqp"},
	"amqp1":        {"AMQP 1.0", "amqp"},
	"amqps":        {"AMQPS", "amqp"},
	"anypointmq":   {"ANYPOINT MQ", "anypointmq"},
	"gcppubsub":    {"GOOGLE PUB/SUB", "googlepubsub"},
	"googlepubsub": {"GOOGLE PUB/SUB", "googlepubsub"},
	"http":         {"HTTP", "globe"},
	"https":        {"HTTPS", "globe"},
	"ibmmq":        {"IBM MQ", "ibmmq"},
	"jms":          {"JMS", "queue"},
	"kafka":        {"KAFKA", "kafka"},
	"kafkasecure":  {"KAFKA", "kafka"},
	"mercure":      {"MERCURE", "broadcast"},
	"mqtt":         {"MQTT", "mqtt"},
	"mqtt5":        {"MQTT 5", "mqtt"},
	"mqtts":        {"MQTTS", "mqtt"},
	"mqttsecure":   {"MQTT", "mqtt"},
	"securemqtt":   {"MQTT", "mqtt"},
	"nats":         {"NATS", "nats"},
	"pulsar":       {"PULSAR", "pulsar"},
	"redis":        {"REDIS", "redis"},
	"sns":          {"SNS", "sns"},
	"solace":       {"SOLACE", "solace"},
	"sqs":          {"SQS", "sqs"},
	"stomp":        {"STOMP", "stomp"},
	"stomps":       {"STOMPS", "stomp"},
	"websocket":    {"WEBSOCKET", "websocket"},
	"websockets":   {"WEBSOCKET", "websocket"},
	"ws":           {"WEBSOCKET", "websocket"},
	"wss":          {"WEBSOCKET", "websocket"},
}

func writeAsyncAPIProtocol(w *strings.Builder, protocol, owner string) {
	writeAsyncAPIProtocolSized(w, protocol, "nav", false, owner)
}

// writeAsyncAPIProtocolSized writes pp-asyncapi-protocol as it renders, with
// its mark box empty: the client draws the SVG of the mark into the box,
// which keeps its size.
func writeAsyncAPIProtocolSized(w *strings.Builder, protocol, size string, heading bool, owner string) {
	key := strings.NewReplacer("-", "", "_", "", ".", "", " ", "", "\t", "").Replace(strings.ToLower(strings.TrimSpace(protocol)))
	presentation, ok := asyncAPIProtocolPresentations[key]
	if !ok {
		presentation = asyncAPIProtocolPresentation{label: strings.ToUpper(strings.TrimSpace(protocol)), mark: "topology"}
	}
	content := `<span class="mark ` + presentation.mark + `" aria-hidden="true"></span><span class="label">` + html.EscapeString(presentation.label) + `</span>`
	attrs := ""
	if heading {
		attrs = " heading"
		content = `<h1 class="` + size + `">` + content + `</h1>`
	} else {
		content = `<span class="protocol ` + size + `">` + content + `</span>`
	}
	fmt.Fprintf(w, `<pp-asyncapi-protocol protocol="%s" size="%s"%s%s>%s</pp-asyncapi-protocol>`,
		html.EscapeString(protocol), size, attrs, ssrAttrs(owner), content)
}

// AsyncAPIProtocolMarkup is pp-asyncapi-protocol in page content.
func AsyncAPIProtocolMarkup(protocol, size string, heading bool) template.HTML {
	var w strings.Builder
	writeAsyncAPIProtocolSized(&w, protocol, size, heading, "page")
	return template.HTML(w.String())
}

func writeViolationBadges(w *strings.Builder, counts *ppmodel.ViolationCounts) {
	if counts == nil || counts.Total() <= 0 {
		return
	}
	w.WriteString(`<span class="violation-badges">`)
	for _, badge := range []struct {
		severity, noun string
		count          int
	}{
		{"error", "error", counts.Errors},
		{"warn", "warning", counts.Warns},
		{"info", "info", counts.Infos},
	} {
		if badge.count <= 0 {
			continue
		}
		display := strconv.Itoa(badge.count)
		if badge.count > 99 {
			display = "99+"
		}
		plural := "s"
		if badge.count == 1 {
			plural = ""
		}
		fmt.Fprintf(w, `<wa-badge class="violation-badge %s">%s<span class="sr-only"> %d %s%s</span></wa-badge>`,
			badge.severity, display, badge.count, badge.noun, plural)
	}
	w.WriteString(`</span>`)
}

// multiContractGroups is the contract navigation the page shows: the groups,
// when there is more than one contract and one of them is this page's.
func multiContractGroups(header *ppmodel.SiteHeaderContext) []*ppmodel.SiteContractGroup {
	if !hasMultiContractFallback(header) {
		return nil
	}
	return header.ContractGroups
}

func writeContractNavigation(w *strings.Builder, p NavMarkupParams, groups []*ppmodel.SiteContractGroup, local func(*strings.Builder)) {
	w.WriteString(`<nav class="contract-navigation" aria-label="Service contracts">`)
	if name := strings.TrimSpace(p.Header.ServiceName); name != "" {
		w.WriteString(`<div class="contract-service-name">` + html.EscapeString(p.Header.ServiceName) + `</div>`)
	}
	for i, group := range groups {
		if group == nil {
			continue
		}
		id := "pp-contract-navigation-1-" + strconv.Itoa(i)
		fmt.Fprintf(w, `<section class="contract-group" aria-labelledby="%s"><h4 id="%s" class="contract-role-heading">%s</h4><ul class="contract-list" aria-labelledby="%s">`,
			id, id, html.EscapeString(group.Label), id)
		for _, contract := range group.Contracts {
			if contract == nil {
				continue
			}
			current := ""
			if contract.Active {
				current = ` aria-current="page"`
			}
			fmt.Fprintf(w, `<li class="%s"><div class="contract-row"><a class="%s" href="%s"%s>%s</a>`,
				navClass("contract-item", flag(contract.Active, "active")), navClass("contract-link", flag(contract.Active, "active")),
				html.EscapeString(DocHref(p.BaseURL, contract.Href)), current, html.EscapeString(contract.Label))
			writeContractVersionPicker(w, p.BaseURL, contract)
			w.WriteString(`</div>`)
			if contract.Active {
				w.WriteString(`<div class="contract-local-navigation">`)
				local(w)
				w.WriteString(`</div>`)
			}
			w.WriteString(`</li>`)
		}
		w.WriteString(`</ul></section>`)
	}
	w.WriteString(`</nav>`)
}

func writeContractVersionPicker(w *strings.Builder, baseURL string, contract *ppmodel.SiteContractLink) {
	if !contract.Active || len(contract.Versions) <= 1 {
		return
	}
	current := contract.CurrentVersion
	if current == "" {
		for _, version := range contract.Versions {
			if version != nil && version.Active {
				current = version.Label
				break
			}
		}
	}
	fmt.Fprintf(w, `<sl-dropdown class="contract-version-dropdown" skidding="0" distance="4" hoist><sl-button slot="trigger" class="contract-version-trigger" size="small" caret aria-label="%s">%s</sl-button><sl-menu class="contract-version-menu" aria-label="%s">`,
		html.EscapeString("Select version for "+contract.Label+", current version "+current), html.EscapeString(current), html.EscapeString("Versions for "+contract.Label))
	for _, version := range contract.Versions {
		if version == nil {
			continue
		}
		current := ""
		if version.Active {
			current = ` aria-current="page"`
		}
		fmt.Fprintf(w, `<sl-menu-item value="%s" type="checkbox"%s>%s</sl-menu-item>`,
			html.EscapeString(DocHref(baseURL, version.Href)), current, html.EscapeString(version.Label))
	}
	w.WriteString(`</sl-menu></sl-dropdown>`)
}

// writeDocsExpiry writes the expiry notice of hosted docs, as of the build.
func writeDocsExpiry(w *strings.Builder, expiresAt string, now time.Time) {
	if expiresAt == "" {
		return
	}
	at, err := time.Parse(time.RFC3339, expiresAt)
	if err != nil {
		return
	}
	seconds := int(at.Sub(now).Seconds())
	classes, label := "docs-expiry", ""
	switch minutes := seconds / 60; {
	case seconds <= 0:
		classes, label = "docs-expiry expired", "docs expired!"
	case minutes >= 2:
		label = fmt.Sprintf("docs expire in <strong>%d</strong> minutes", minutes)
	case minutes == 1:
		label = "docs expire in <strong>under two minutes</strong>"
	default:
		plural := "s"
		if seconds == 1 {
			plural = ""
		}
		classes, label = "docs-expiry critical", fmt.Sprintf("docs expiring in <strong>%d second%s</strong>", seconds, plural)
	}
	fmt.Fprintf(w, `<div class="%s" aria-live="polite">%s</div>`, classes, label)
}

// writeHostedArchiveControls writes the archive export controls a direct
// export URL turns on. A host can also turn them on after load, by message.
func writeHostedArchiveControls(w *strings.Builder, exportURL string) {
	if strings.TrimSpace(exportURL) == "" {
		return
	}
	w.WriteString(`<div class="host-archive-controls" aria-label="Documentation archive export"><div class="host-archive-controls-title">export documentation</div><div class="host-archive-control-row">` +
		`<sl-tooltip class="archive-option-tooltip" content="INCLUDE QUALITY DIAGNOSTICS IN GENERATED DOCS" placement="top"><sl-checkbox>diagnostics?</sl-checkbox></sl-tooltip>` +
		`<sl-tooltip class="archive-option-tooltip" content="INCLUDE llms.txt &amp; AGENTIC READY VERSION OF DOCUMENTATION" placement="top"><sl-checkbox>AI docs?</sl-checkbox></sl-tooltip>` +
		`<sl-dropdown class="archive-format-dropdown" skidding="0" distance="4" hoist><sl-button slot="trigger" class="archive-format-trigger" size="small" caret><wa-icon slot="prefix" name="download"></wa-icon>zip</sl-button>` +
		`<sl-menu><sl-menu-item value="zip" type="checkbox" checked>zip</sl-menu-item><sl-menu-item value="tar.gz" type="checkbox">tar.gz</sl-menu-item></sl-menu></sl-dropdown>` +
		`<sl-button class="archive-download-button" aria-busy="false" aria-label="Download documentation archive">export</sl-button></div></div>`)
}

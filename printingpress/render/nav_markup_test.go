// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package render

import (
	"strings"
	"testing"
	"time"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func navMarkupForTest(p NavMarkupParams) string {
	var w strings.Builder
	writeNavMarkup(&w, p)
	return w.String()
}

func TestNavMarkupOpensTheGroupHoldingTheActivePage(t *testing.T) {
	html := navMarkupForTest(NavMarkupParams{
		ActiveSlug:    "create-burger",
		DeveloperMode: true,
		Tags: []*ppmodel.NavTag{
			{Name: "burgers", Summary: "Burgers", Counts: &ppmodel.ViolationCounts{Warns: 1}, Operations: []*ppmodel.NavOperation{
				{Method: "POST", Path: "/burgers", Summary: "Create a new burger", Slug: "create-burger", Counts: &ppmodel.ViolationCounts{Warns: 1}},
				{Method: "DELETE", Path: "/burgers/{id}", Slug: "delete-burger", Deprecated: true},
			}},
			{Name: "dressing", Operations: []*ppmodel.NavOperation{{Method: "GET", Path: "/dressings", Slug: "get-dressings"}}},
		},
		ModelGroups: []*ppmodel.NavModelGroup{{Name: "Schemas", TypeSlug: "schemas", Models: []*ppmodel.NavModel{{Name: "Burger", Slug: "burger", TypeSlug: "schemas"}}}},
	})
	for _, expected := range []string{
		`<pp-nav-tag data-pp-owner="pp-nav" data-pp-ssr><div class="tag-header active developer"><wa-icon name="chevron-down" class="chevron"></wa-icon><span class="tag-name"><span>Burgers</span></span>`,
		`<wa-badge class="violation-badge warn">1<span class="sr-only"> 1 warning</span></wa-badge>`,
		`<a href="operations/create-burger.html" class="active developer"><span class="op-title">Create a new burger</span>`,
		`<pp-http-method mode="nav-naked" method="POST" data-pp-owner="pp-nav-tag" data-pp-ssr><span class="pp-http-method__naked post">POST</span></pp-http-method>`,
		`<a href="operations/delete-burger.html" class="deprecated developer"><span class="op-title">/burgers/{id}</span>`,
		`<span class="pp-http-method__naked delete">DEL</span>`,
		// A closed group is its header only, as the component draws it.
		`<div class="tag-header developer"><wa-icon name="chevron-right" class="chevron"></wa-icon><span class="tag-name"><span>dressing</span></span></div></pp-nav-tag>`,
		`<pp-nav-model-group data-pp-owner="pp-nav" data-pp-ssr><div class="group-header developer"><wa-icon name="chevron-right" class="chevron"></wa-icon><span>Schemas</span></div></pp-nav-model-group>`,
	} {
		if !strings.Contains(html, expected) {
			t.Fatalf("expected nav markup to contain %q\n%s", expected, html)
		}
	}
	if strings.Contains(html, `get-dressings`) {
		t.Fatalf("a closed group must not write its rows")
	}
}

func TestNavMarkupWritesEveryRowOfAnOpenModelGroup(t *testing.T) {
	models := make([]*ppmodel.NavModel, 0, 300)
	for i := 0; i < 300; i++ {
		slug := "model-" + string(rune('a'+i%26)) + strings.Repeat("x", i/26)
		models = append(models, &ppmodel.NavModel{Name: slug, Slug: slug, TypeSlug: "schemas"})
	}
	active := models[250]
	html := navMarkupForTest(NavMarkupParams{
		ActiveSlug:  "schemas/" + active.Slug,
		ModelGroups: []*ppmodel.NavModelGroup{{Name: "Schemas", TypeSlug: "schemas", Models: models}},
	})
	if got := strings.Count(html, `<li><a href="models/schemas/`); got != len(models) {
		t.Fatalf("expected every row of the open group, got %d of %d", got, len(models))
	}
	if !strings.Contains(html, `<a href="models/schemas/`+active.Slug+`.html" class="active">`) {
		t.Fatalf("expected the active model marked")
	}
}

func TestNavMarkupAsyncAPIRows(t *testing.T) {
	html := navMarkupForTest(NavMarkupParams{
		ActiveSlug: "on-order",
		Tags: []*ppmodel.NavTag{{Name: "orders", Protocol: "kafka", Operations: []*ppmodel.NavOperation{
			{SpecKind: ppmodel.SpecKindValueAsyncAPI, Method: "receive", Summary: "On order", Slug: "on-order"},
		}}},
	})
	for _, expected := range []string{
		`<pp-asyncapi-protocol protocol="kafka" size="nav" data-pp-owner="pp-nav-tag" data-pp-ssr><span class="protocol nav"><span class="mark" aria-hidden="true"></span><span class="label">KAFKA</span></span></pp-asyncapi-protocol>`,
		`<pp-asyncapi-action action="receive" size="small" data-pp-owner="pp-nav-tag" data-pp-ssr><span class="action small receive" aria-label="Receive"><wa-icon name="arrow-left"></wa-icon><span>RCV</span></span></pp-asyncapi-action>`,
	} {
		if !strings.Contains(html, expected) {
			t.Fatalf("expected nav markup to contain %q\n%s", expected, html)
		}
	}
}

func TestNavMarkupEscapesNames(t *testing.T) {
	html := navMarkupForTest(NavMarkupParams{
		Tags: []*ppmodel.NavTag{{Name: `<script>alert(1)</script>`}},
	})
	if strings.Contains(html, `<script>alert(1)`) {
		t.Fatalf("tag name was not escaped: %s", html)
	}
}

func TestNavMarkupDocsExpiry(t *testing.T) {
	now := time.Date(2026, 11, 7, 12, 0, 0, 0, time.UTC)
	for _, test := range []struct {
		expires, expected string
	}{
		{"2026-11-07T12:10:00Z", `<div class="docs-expiry" aria-live="polite">docs expire in <strong>10</strong> minutes</div>`},
		{"2026-11-07T12:01:30Z", `<div class="docs-expiry" aria-live="polite">docs expire in <strong>under two minutes</strong></div>`},
		{"2026-11-07T12:00:30Z", `<div class="docs-expiry critical" aria-live="polite">docs expiring in <strong>30 seconds</strong></div>`},
		{"2026-11-07T11:00:00Z", `<div class="docs-expiry expired" aria-live="polite">docs expired!</div>`},
	} {
		html := navMarkupForTest(NavMarkupParams{DocsExpiresAt: test.expires, Now: now})
		if !strings.Contains(html, test.expected) {
			t.Fatalf("expires %s: expected %q in %s", test.expires, test.expected, html)
		}
	}
}

func TestComponentMarkupWritesWhatTheComponentsRender(t *testing.T) {
	for _, test := range []struct {
		got, expected string
	}{
		{string(IconTitleMarkup("operation", "Create <burger>")),
			`<pp-icon-title icon="operation" heading="Create &lt;burger&gt;" data-pp-owner="page" data-pp-ssr><pp-model-icon icon="operation" size="huge" color="primary" data-pp-owner="pp-icon-title" data-pp-ssr><wa-icon name="gear-wide-connected" data-fresh="operation" class="pp-model-icon__icon huge primary"></wa-icon></pp-model-icon><h1>Create &lt;burger&gt;</h1></pp-icon-title>`},
		{string(HTTPMethodMarkup("post")),
			`<pp-http-method method="post" data-pp-owner="page" data-pp-ssr><span class="pp-http-method__tag medium post"><span class="pp-http-method__label">POST</span></span></pp-http-method>`},
		{string(OperationPathMarkup("/burgers/{burgerId}", true)),
			`<pp-render-operation-path path="/burgers/{burgerId}" nowrap data-pp-owner="page" data-pp-ssr><div class="pp-render-operation-path__nowrap"><span class="slash">/</span>burgers<span class="slash">/</span><span class="bracket">{</span><span class="param">burgerId</span><span class="bracket">}</span></div></pp-render-operation-path>`},
		{string(ViolationStatsMarkup("Burger", ppmodel.ViolationCounts{Errors: 2, Infos: 1})),
			`<pp-violation-stats data-scope-label="Burger" data-pp-owner="page" data-pp-ssr><div class="stats" role="group" aria-label="Diagnostics"><div class="stat err"><wa-icon name="exclamation-square" aria-hidden="true"></wa-icon><span class="label">2</span><span class="violation">errors</span></div><div class="stat info"><wa-icon name="info-square" aria-hidden="true"></wa-icon><span class="label">1</span><span class="violation">info</span></div><button type="button" class="details-button">OPEN PROBLEMS</button></div></pp-violation-stats>`},
		{string(ViolationStatsMarkup("Burger", ppmodel.ViolationCounts{})),
			`<pp-violation-stats data-scope-label="Burger"></pp-violation-stats>`},
	} {
		if test.got != test.expected {
			t.Fatalf("got\n%s\nwant\n%s", test.got, test.expected)
		}
	}
}

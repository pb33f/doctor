// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	"github.com/stretchr/testify/assert"
)

func TestPrismJSON_WritesPrismTokenClasses(t *testing.T) {
	out := prismJSON(`{"name": "<b>", "count": -1.5, "ok": true, "none": null}`)
	assert.Contains(t, out, `<span class="token property">&#34;name&#34;</span>`)
	assert.Contains(t, out, `<span class="token string">&#34;&lt;b&gt;&#34;</span>`)
	assert.Contains(t, out, `<span class="token number">-1.5</span>`)
	assert.Contains(t, out, `<span class="token boolean">true</span>`)
	assert.Contains(t, out, `<span class="token null keyword">null</span>`)
	assert.Contains(t, out, `<span class="token operator">:</span>`)
	assert.NotContains(t, out, "<b>")
}

func TestCodeViewer_HighlightsJSONAndLeavesOtherLanguagesForTheClient(t *testing.T) {
	c := &contentRenderer{}
	jsonOut := c.codeViewer(`{"a": 1}`, "json", "page")
	assert.Contains(t, jsonOut, `<pp-code-viewer language="json" pretty data-pp-owner="page" data-pp-ssr>`)
	assert.Contains(t, jsonOut, `class="token property"`)

	yamlOut := c.codeViewer("a: <1>", "yaml", "page")
	assert.Contains(t, yamlOut, `language="yaml" data-pp-highlight`)
	assert.Contains(t, yamlOut, `<code>a: &lt;1&gt;</code>`)
}

func TestNameColumnWidth_CountsInlineNamesOnly(t *testing.T) {
	c := &contentRenderer{}
	short := parseContentSchema([]byte(`{"properties":{"id":{"type":"string"},"items":{"type":"array","items":{"$ref":"#/components/schemas/LongNames"}}}}`))
	assert.Equal(t, minCompactNameWidthPx, c.nameColumnWidth(short))

	long := parseContentSchema([]byte(`{"properties":{"id":{"type":"object","properties":{"averyveryverylongname":{"type":"string"}}}}}`))
	assert.Greater(t, c.nameColumnWidth(long), minCompactNameWidthPx)
}

func TestInlineMarkdown_DropsTheParagraph(t *testing.T) {
	c := &contentRenderer{}
	assert.Equal(t, "a <strong>bold</strong> line", c.inlineMarkdown("a **bold** line"))
	assert.Contains(t, c.inlineMarkdown("one\n\ntwo"), "<p>")
}

func TestMediaTypeSelector_WritesEveryBlockAndShowsJSON(t *testing.T) {
	c := &contentRenderer{}
	out := c.mediaTypeSelector([]*ppmodel.MediaTypeInfo{
		{MediaType: "application/xml", SchemaJSON: `{"type":"string"}`, MockXML: "<a/>"},
		{MediaType: "application/json", SchemaJSON: `{"type":"string"}`, MockJSON: `"a"`},
	}, mediaTypeOptions{ID: "pp-request-body-content"})

	assert.Contains(t, out, `<pp-media-type-selector id="pp-request-body-content" data-pp-owner="page" data-pp-ssr>`)
	assert.Contains(t, out, `<div class="pp-media-type-block" data-index="0" hidden>`)
	assert.Contains(t, out, `<div class="pp-media-type-block" data-index="1">`)
	assert.Equal(t, 2, strings.Count(out, `<select class="pp-media-type-select"`))
	assert.Contains(t, out, `<option value="0" selected>application/xml</option>`)
	assert.Contains(t, out, `<option value="1" selected>application/json</option>`)
}

func TestOperationResponses_GroupsResponsesAndSharesErrors(t *testing.T) {
	c := &contentRenderer{}
	errorRef := &ppmodel.ComponentLink{Name: "Error", ComponentType: "responses", TypeSlug: "responses", Slug: "error"}
	out := c.operationResponses([]*ppmodel.ResponseInfo{
		{StatusCode: "500", Description: "Broken", Ref: errorRef},
		{StatusCode: "200", Description: "Fine", RawJSON: `{"description":"Fine"}`},
		{StatusCode: "404", Description: "Missing", Ref: errorRef},
		{StatusCode: "301", Description: "Moved"},
	}, []*ppmodel.HeaderInfo{{Name: "X-Rate", SchemaType: "integer"}})

	assert.True(t, strings.HasPrefix(out, `<pp-operation-responses id="section-responses" data-nav-label="Responses" data-pp-owner="page" data-pp-ssr>`))
	ok := strings.Index(out, `id="response-200"`)
	moved := strings.Index(out, `id="response-301"`)
	missing := strings.Index(out, `id="response-404"`)
	broken := strings.Index(out, `id="response-500"`)
	assert.True(t, ok < moved && moved < missing && missing < broken, "responses are written in status order")
	assert.Contains(t, out, `data-nav-label="404 Not Found"`)
	assert.Contains(t, out, `<h3>Redirect Responses</h3>`)
	assert.Contains(t, out, `<div id="header-X-Rate">`)
	assert.Contains(t, out, `id="common-error-ref:error"`)
	assert.Contains(t, out, `href="#common-error-ref:error" data-pp-reveal`)
	assert.Contains(t, out, `<pp-raw-viewer-btn id="pp-response-raw-200"`)
}

func TestOperationParameters_WritesRowsAndDrawerExamples(t *testing.T) {
	c := &contentRenderer{}
	out := c.operationParameters([]*ppmodel.ParameterInfo{{
		Name:       "burgerId",
		In:         "path",
		Required:   true,
		SchemaJSON: `{"type":"string","maxLength":10}`,
		MockJSON:   `"big-mac"`,
		Examples:   map[string]string{"zeta": `"z"`, "alpha": `"</template>"`},
		RawJSON:    `{"name":"burgerId"}`,
	}})

	assert.Contains(t, out, `<pp-operation-parameters id="pp-operation-parameters" data-pp-owner="page" data-pp-ssr>`)
	assert.Contains(t, out, `<span class="required-badge">req</span>`)
	assert.Contains(t, out, `<span class="param-type">string</span>`)
	assert.Contains(t, out, `<span class="constraint-label">maxLength:</span>`)
	assert.Contains(t, out, `<wa-icon class="param-in-icon" name="signpost">`)
	assert.Contains(t, out, `title="burgerId (path)"`)
	assert.Contains(t, out, `<option value="0">alpha</option><option value="1">zeta</option><option value="2">Example</option>`)
	assert.Contains(t, out, `data-key="alpha">&#34;&lt;/template&gt;&#34;</template>`)
}

func TestCurlCommand_WritesEveryVariant(t *testing.T) {
	out := curlCommand(`[{"label":"Prod","command":"curl https://a"},{"label":"","command":"curl https://b"}]`)
	assert.Contains(t, out, `<select class="pp-curl-select" aria-label="cURL variant"><option value="0">Prod</option><option value="1">Variant 2</option></select>`)
	assert.Contains(t, out, `data-index="0" data-pp-owner="pp-curl-command" data-pp-ssr><button type="button" class="pp-terminal-example__copy">copy</button><pre>curl https://a</pre>`)
	assert.Contains(t, out, `data-index="1" hidden data-pp-owner="pp-curl-command"`)

	single := curlCommand(`[{"label":"Prod","command":"curl https://a"}]`)
	assert.NotContains(t, single, "pp-curl-select")
	assert.Empty(t, curlCommand("not json"))
}

func TestOperationCallbacks_WritesOperationsAndResponses(t *testing.T) {
	c := &contentRenderer{}
	out := c.operationCallbacks([]*ppmodel.CallbackInfo{{
		Name: "onDone",
		Operations: []*ppmodel.CallbackOperationInfo{{
			Expression: "{$request.body#/url}",
			Method:     "post",
			Responses:  []*ppmodel.ResponseInfo{{StatusCode: "204", Description: "Got **it**"}},
		}},
	}})

	assert.Contains(t, out, `<pp-operation-callbacks id="pp-operation-callbacks" data-pp-owner="page" data-pp-ssr>`)
	assert.Contains(t, out, `<pp-http-method method="post" data-pp-owner="pp-operation-callbacks" data-pp-ssr>`)
	assert.Contains(t, out, `<span class="callback-expression">{$request.body#/url}</span>`)
	assert.Contains(t, out, `<span class="callback-response-code">No Content</span>`)
	assert.Contains(t, out, `<span class="callback-response-desc pp-markdown-inline">Got <strong>it</strong></span>`)
}

func TestOperationContent_LeavesEmptySectionsEmpty(t *testing.T) {
	c := &contentRenderer{}
	content := c.operationContent(&ppmodel.OperationPage{})
	assert.Equal(t, ppmodel.OperationContent{}, *content)
}

func TestCrossRefs_WritesListsAsRefListDrawsThem(t *testing.T) {
	c := &contentRenderer{}
	ops := make([]*ppmodel.OperationRef, 0, 21)
	for i := 0; i < 21; i++ {
		ops = append(ops, &ppmodel.OperationRef{Method: []string{"post", "get"}[i%2], Path: "/a/{id}", Slug: "op"})
	}
	ops[0].OperationID = "makeThing"
	out := c.crossRefs(&ppmodel.ModelCrossRefs{
		UsedByOperations: ops,
		UsesModels:       []*ppmodel.ComponentRef{{Name: "Pet", ComponentType: "schemas", TypeSlug: "schemas", Slug: "pet"}},
	}, `{"a":1}`, 240)

	assert.Contains(t, out, `<pp-cross-refs refs-json="{&#34;a&#34;:1}" style="display:block;min-height:240px;" data-pp-owner="page" data-pp-ssr>`)
	assert.Contains(t, out, `<pp-ref-list type="operations" heading="Consumed By" data-pp-owner="pp-cross-refs" data-pp-ssr><h2>Consumed By</h2>`)
	assert.Contains(t, out, `<option value="">ALL METHODS</option><option value="GET">GET</option><option value="POST">POST</option>`)
	assert.Contains(t, out, `<div class="pp-paginator__bar"><div>`)
	assert.Contains(t, out, `Page <strong class="current-page">1</strong> of <strong class="total-pages">2</strong>`)
	assert.Contains(t, out, `Consumed By 1 - 20 of <strong class="total"><wa-format-number value="21">`)
	assert.Equal(t, 20, strings.Count(out, `class="operation-ref-row"`))
	assert.Contains(t, out, `<span class="operation-ref-title"`)
	assert.Contains(t, out, `<pp-http-method method="get" tiny data-pp-owner="pp-ref-list" data-pp-ssr>`)
	assert.Contains(t, out, `<h2>References</h2>`)
	assert.Contains(t, out, `<div class="pp-paginator__bar hide">`)
	assert.Contains(t, out, `href="models/schemas/pet.html"><span aria-hidden="true">➜</span> Pet</a>`)
	assert.Empty(t, c.crossRefs(&ppmodel.ModelCrossRefs{}, "", 240))
}

func TestSecurityScheme_WritesPropertiesAndFlowsInOrder(t *testing.T) {
	out := securityScheme(`{"type":"oauth2","flows":{"password":{"tokenUrl":"https://t.example.com","scopes":{"write":"Write","read":"Read"}},"implicit":{"authorizationUrl":"https://a.example.com","scopes":{}}}}`)
	assert.Contains(t, out, `<pp-security-scheme id="pp-model-security-scheme" data-pp-owner="page" data-pp-ssr>`)
	assert.Contains(t, out, `<wa-icon name="key" class="type-icon"></wa-icon><span class="prop-type">OAUTH2</span>`)
	password := strings.Index(out, `<div class="flow-heading">PASSWORD</div>`)
	implicit := strings.Index(out, `<div class="flow-heading">IMPLICIT</div>`)
	assert.True(t, password >= 0 && password < implicit, "flows keep the order the spec has")
	assert.Less(t, strings.Index(out, `>write<`), strings.Index(out, `>read<`))
	assert.Equal(t, 1, strings.Count(out, `class="scopes-section"`))

	apiKey := securityScheme(`{"type":"apiKey","name":"X-Key","in":"header"}`)
	assert.Contains(t, apiKey, `name="envelope"`)
	assert.Contains(t, apiKey, `<span class="prop-name">in</span></div><div class="prop-type-col"><span class="prop-type">header</span>`)
}

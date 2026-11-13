// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync/atomic"
	"testing"

	"github.com/pb33f/doctor/printingpress/curl"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

const agentReadinessSpec = `openapi: 3.1.0
info:
  title: Agent fixtures
  version: '1'
  description: |
    ## First request

    Keep this paragraph and the code fence intact.

    ~~~sh
    echo ready
    ~~~
servers:
  - url: https://api.example.test
security:
  - apiKey: []
paths:
  /documents:
    post:
      operationId: createDocument
      parameters:
        - name: cursor
          in: query
          schema: {type: string, example: signed-next-page}
        - name: limit
          in: query
          schema: {type: integer, default: 50}
          example: 25
      requestBody:
        required: true
        content:
          application/yaml:
            schema: {type: string}
      responses:
        '200':
          description: Created
          content:
            application/json:
              schema: {$ref: '#/components/schemas/Node'}
              example: {id: declared, links: {self: /documents/declared}}
        '400':
          description: Invalid input
          content:
            application/problem+json:
              schema: {$ref: '#/components/schemas/Problem'}
              examples:
                invalid:
                  summary: Invalid input example
                  value: {status: 400, detail: invalid}
        '409':
          description: Input conflict
          headers:
            Retry-After:
              schema: {type: integer}
          content:
            application/problem+json:
              schema: {$ref: '#/components/schemas/Problem'}
              example: {status: 409, detail: conflict}
components:
  securitySchemes:
    apiKey: {$ref: '#/components/securitySchemes/keyDetails'}
    keyDetails:
      type: apiKey
      in: header
      name: x-api-key
  schemas:
    Node:
      type: object
      required: [id, links]
      properties:
        id: {$ref: '#/components/schemas/Identifier'}
        children:
          type: array
          maxItems: 5
          items: {$ref: '#/components/schemas/Node'}
        links:
          type: object
          required: [self]
          properties:
            self: {type: string, format: uri-reference}
        result:
          oneOf:
            - {type: string, minLength: 1}
            - {type: integer, minimum: 0}
    Identifier: {type: string, minLength: 1, maxLength: 64}
    Problem:
      type: object
      properties:
        status: {type: integer, example: 404}
        detail: {type: string}
`

func TestAgentReadinessGeneratedArtifacts(t *testing.T) {
	rawBody := "openapi: 3.1.0\ninfo: {title: Fixture, version: '1'}\n"
	type receivedRequest struct{ body, key, mediaType, query string }
	received := make(chan receivedRequest, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		bytes, _ := io.ReadAll(r.Body)
		received <- receivedRequest{string(bytes), r.Header.Get("x-api-key"), r.Header.Get("Content-Type"), r.URL.RawQuery}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"declared"}`))
	}))
	defer server.Close()
	site := pressFromSpec(t, strings.ReplaceAll(agentReadinessSpec, "https://api.example.test", server.URL))
	require.Len(t, site.Operations, 1)
	var commands []*CurlVariant
	require.NoError(t, json.Unmarshal([]byte(site.Operations[0].CurlJSON), &commands))
	require.Len(t, commands, 1)
	command := commands[0].Command
	assert.Contains(t, command, "-H 'x-api-key: YOUR_API_KEY'")
	assert.Contains(t, command, "-H 'Content-Type: application/yaml'")
	assert.Contains(t, command, "--data-binary @request-body")
	assert.Contains(t, command, "limit=25")
	assert.NotContains(t, command, "cursor=")
	t.Run("curl round trip", func(t *testing.T) {
		for _, tool := range []string{"sh", "curl"} {
			if _, err := exec.LookPath(tool); err != nil {
				t.Skipf("%s is unavailable", tool)
			}
		}
		// parse generated shell without contacting the server.
		shell := exec.Command("sh", "-n")
		shell.Stdin = strings.NewReader(command)
		require.NoError(t, shell.Run())
		requestDir := t.TempDir()
		require.NoError(t, os.WriteFile(filepath.Join(requestDir, "request-body"), []byte(rawBody), 0600))
		send := exec.Command("sh", "-c", command)
		send.Dir = requestDir
		response, err := send.Output()
		require.NoError(t, err)
		require.Contains(t, string(response), "declared")
		gotRequest := <-received
		assert.Equal(t, rawBody, gotRequest.body)
		assert.Equal(t, "YOUR_API_KEY", gotRequest.key)
		assert.Equal(t, "application/yaml", gotRequest.mediaType)
		assert.Equal(t, "limit=25", gotRequest.query)

	})

	output := t.TempDir()
	require.NoError(t, WriteLLMSite(site, output))
	read := func(path string) string {
		data, err := os.ReadFile(filepath.Join(output, path))
		require.NoError(t, err)
		return string(data)
	}
	operation := read("operations/create-document.md")
	assert.Contains(t, operation, `"id": "declared"`)
	assert.Contains(t, operation, `"status": 400`)
	assert.Contains(t, operation, `"status": 409`)
	assert.NotContains(t, operation, `"status": 404`)
	assert.NotContains(t, operation, `"summary": "Invalid input example"`)
	assert.Contains(t, operation, "Retry-After")
	assert.Contains(t, operation, "Invalid input")
	assert.Contains(t, operation, "Input conflict")
	assert.NotContains(t, operation, "- `detail`")

	model := read("models/schemas/node.md")
	assert.Contains(t, model, "`id` — [Identifier](../../models/schemas/identifier.md)")
	assert.Contains(t, model, "items [Node](../../models/schemas/node.md)")
	assert.Contains(t, model, `"uri-reference"`)
	assert.Contains(t, model, `"oneOf"`)
	assert.Contains(t, model, `"maxItems": 5`)
	assert.Contains(t, model, `"required"`)
	require.Less(t, len(model), 10000) // a reference cycle stays finite.
	var schema map[string]any
	require.NoError(t, json.Unmarshal([]byte(read("models/schemas/node.schema.json")), &schema))
	assert.Equal(t, "object", schema["type"])
	assert.Contains(t, read("overview.md"), "## First request\n\nKeep this paragraph")
	assert.Contains(t, read("AGENTS.md"), "(overview.md)")
	assert.Contains(t, read("llms.txt"), "(overview.md)")
}

func TestAgentSourceLinksUsePageDirectory(t *testing.T) {
	source := &SourceRef{Path: "openapi.yaml", Href: "spec/openapi.yaml#L3", Line: 3}
	assert.Contains(t, renderContextSourceMetadataRef(operationFileRenderContext(nil), source), "(../spec/openapi.yaml#L3)")
	assert.Contains(t, renderContextSourceMetadataRef(modelFileRenderContext(nil), source), "(../../spec/openapi.yaml#L3)")
	assert.Equal(t, "spec/openapi.yaml#L3", source.Href)
}

func TestAgentAuthAliasCycleIsBounded(t *testing.T) {
	pp := &PrintingPress{modelIndex: map[string]*ModelPage{
		"security/one": {Name: "one", TypeSlug: "security", SchemaJSON: `{"$ref":"#/components/securitySchemes/two"}`},
		"security/two": {Name: "two", TypeSlug: "security", SchemaJSON: `{"$ref":"#/components/securitySchemes/one"}`},
	}}
	req := pp.resolveSecurityRequirement("one", nil)
	assert.Empty(t, req.SchemeType)
	require.NotNil(t, req.Ref)
}

func TestAgentDeclaredPatchExamplePrecedesDerivedMock(t *testing.T) {
	op := &OperationPage{Method: "PATCH", Path: "/documents", RequestBody: &RequestBodyInfo{Content: []*MediaTypeInfo{{
		MediaType: "application/json-patch+json",
		Examples:  map[string]string{"declared": `[{"op":"remove","path":"/obsolete"}]`},
		MockJSON:  `[{"op":"replace","path":"/wrong","value":"mock"}]`,
	}}}}
	variants := curl.BuildCurlCommands(op, nil, nil)
	require.Len(t, variants, 1)
	assert.Contains(t, variants[0].Command, `[{"op":"remove","path":"/obsolete"}]`)
	assert.NotContains(t, variants[0].Command, "/wrong")
	assert.Equal(t, `[{"op":"remove","path":"/obsolete"}]`, requestExamplePayload(op, op.RequestBody.Content[0]))
}

func TestAgentRawMediaBodiesAndRequiredCursor(t *testing.T) {
	for _, media := range []string{"text/plain", "application/yaml", "application/xml", "application/octet-stream"} {
		t.Run(media, func(t *testing.T) {
			op := &OperationPage{Method: "POST", Path: "/documents", Parameters: []*ParameterInfo{{Name: "cursor", In: "query", Required: true, SchemaJSON: `{"type":"string","example":"required"}`}}, RequestBody: &RequestBodyInfo{Content: []*MediaTypeInfo{{MediaType: media}}}}
			command := curl.BuildCurlCommands(op, nil, nil)[0].Command
			assert.Contains(t, command, "cursor=required")
			assert.Contains(t, command, "Content-Type: "+media)
			assert.Contains(t, command, "--data-binary @")
		})
	}
}

func TestAgentMultipartExamplesRemainLiteral(t *testing.T) {
	for _, tool := range []string{"sh", "curl"} {
		if _, err := exec.LookPath(tool); err != nil {
			t.Skipf("%s is unavailable", tool)
		}
	}
	file := filepath.Join(t.TempDir(), "synthetic-secret.txt")
	require.NoError(t, os.WriteFile(file, []byte("MUST NOT BE UPLOADED"), 0600))
	examples := map[string]string{
		"at":        "@" + file,
		"less":      "<" + file,
		"semicolon": "value;type=application/json;filename=surprise.txt",
		"quotes":    "a 'single' and \"double\" quote; $HOME",
	}
	payload, err := json.Marshal(examples)
	require.NoError(t, err)
	type formResult struct {
		values map[string][]string
		files  int
		err    error
	}
	received := make(chan formResult, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(1024 * 1024)
		result := formResult{err: err}
		if r.MultipartForm != nil {
			defer r.MultipartForm.RemoveAll()
			result.values, result.files = r.MultipartForm.Value, len(r.MultipartForm.File)
		}
		received <- result
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()
	op := &OperationPage{Method: "POST", Path: "/", RequestBody: &RequestBodyInfo{Content: []*MediaTypeInfo{{MediaType: "multipart/form-data", Examples: map[string]string{"literal": string(payload)}}}}}
	command := curl.BuildCurlCommands(op, []*ServerInfo{{URL: server.URL}}, nil)[0].Command
	assert.Contains(t, command, "--form-string")
	assert.NotContains(t, command, " -F ")
	output, err := exec.Command("sh", "-c", command).CombinedOutput()
	require.NoError(t, err, string(output))
	form := <-received
	require.NoError(t, form.err)
	assert.Zero(t, form.files)
	for name, value := range examples {
		assert.Equal(t, []string{value}, form.values[name])
	}
}

func TestAgentComponentFragmentsIdentifyReferenceContext(t *testing.T) {
	page := &ModelPage{Name: "Node/~special", ComponentType: "schemas", TypeSlug: "schemas", Slug: "node", SchemaJSON: `{"$ref":"#/components/schemas/Other"}`}
	site := &Site{Source: &SourceRef{Path: "api.yaml", Href: "spec/api.yaml#L1", LinkEnabled: true}}
	markdown := renderModelMD(modelFileRenderContext(site), page)
	assert.Contains(t, markdown, "[Component fragment (JSON)](../../models/schemas/node.schema.json)")
	assert.Contains(t, markdown, "not a standalone JSON Schema")
	assert.Contains(t, markdown, "`#/components/schemas/Node~1~0special`")
	assert.Contains(t, markdown, "[api.yaml](../../spec/api.yaml)")
	assert.NotContains(t, markdown, "api.yaml#L1")

	site.Source.LinkEnabled = false
	site.Source.Href = "/private/author/api.yaml"
	markdown = renderModelMD(modelFileRenderContext(site), page)
	assert.Contains(t, markdown, "source specification is not bundled")
	assert.NotContains(t, markdown, "/private/author/api.yaml")

	page.ComponentType, page.TypeSlug = "securitySchemes", "security"
	markdown = renderModelMD(modelFileRenderContext(site), page)
	assert.Contains(t, markdown, "Component fragment (JSON)")
	assert.NotContains(t, markdown, "Machine-readable schema")
}

func TestAgentExternalExamplesRemainMetadata(t *testing.T) {
	var requests atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requests.Add(1)
		_, _ = w.Write([]byte(`{"unexpected":"fetch"}`))
	}))
	defer server.Close()
	spec := `openapi: 3.1.0
info: {title: External examples, version: '1'}
paths:
  /items:
    post:
      operationId: createItem
      parameters:
        - name: sample
          in: query
          schema: {type: string}
          examples:
            remote:
              externalValue: EXTERNAL/parameter.txt
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id: {type: string}
            examples:
              remote:
                externalValue: EXTERNAL/request.json
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema: {type: object, properties: {id: {type: string}}}
              examples:
                remote:
                  externalValue: EXTERNAL/response.json
`
	spec = strings.ReplaceAll(spec, "EXTERNAL", server.URL)
	site := pressFromSpec(t, spec)
	op := site.Operations[0]
	assert.Empty(t, op.Parameters[0].Examples)
	assert.Equal(t, server.URL+"/parameter.txt", op.Parameters[0].ExternalExamples["remote"])
	assert.Equal(t, server.URL+"/request.json", op.RequestBody.Content[0].ExternalExamples["remote"])
	assert.Equal(t, server.URL+"/response.json", op.Responses[0].Content[0].ExternalExamples["remote"])
	assert.NotContains(t, op.CurlJSON, server.URL)
	assert.NotContains(t, op.CurlJSON, "externalValue")

	markdown := renderOperationMD(operationFileRenderContext(site), op)
	var html bytes.Buffer
	require.NoError(t, render.OperationPageTempl(op, "").Render(context.Background(), &html))
	for _, path := range []string{"parameter.txt", "request.json", "response.json"} {
		assert.Contains(t, markdown, "[External example](<"+server.URL+"/"+path+">) (not fetched)")
		assert.Contains(t, html.String(), `href="`+server.URL+"/"+path+`"`)
	}
	assert.Contains(t, html.String(), "External examples:")
	assert.Zero(t, requests.Load())

	// an inline value takes precedence even if an invalid producer also sets externalValue.
	var inlineSpec strings.Builder
	for _, line := range strings.Split(spec, "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), "externalValue:") {
			indentation := line[:len(line)-len(strings.TrimLeft(line, " "))]
			inlineSpec.WriteString(indentation + "value: inline-payload\n")
		}
		inlineSpec.WriteString(line + "\n")
	}
	inlineSite := pressFromSpec(t, inlineSpec.String())
	inline := inlineSite.Operations[0]
	assert.Equal(t, `"inline-payload"`, inline.Parameters[0].Examples["remote"])
	assert.Empty(t, inline.Parameters[0].ExternalExamples)
	assert.Equal(t, `"inline-payload"`, inline.RequestBody.Content[0].Examples["remote"])
	assert.Empty(t, inline.RequestBody.Content[0].ExternalExamples)
	assert.Equal(t, `"inline-payload"`, inline.Responses[0].Content[0].Examples["remote"])
	assert.Empty(t, inline.Responses[0].Content[0].ExternalExamples)
	assert.Contains(t, inline.CurlJSON, "inline-payload")
	assert.NotContains(t, inline.CurlJSON, server.URL)
	assert.Zero(t, requests.Load())
}

func TestAgentDefaultRequestsOmitOptionalConditionalHeaders(t *testing.T) {
	spec := `openapi: 3.1.0
info: {title: Content access, version: '1'}
paths:
  /content:
    parameters:
      - {name: If-Match, in: header, schema: {type: string}, example: '"saved-etag"'}
      - {name: If-None-Match, in: header, schema: {type: string}, example: '"saved-etag"'}
      - {name: If-Modified-Since, in: header, schema: {type: string}, example: 'Wed, 21 Oct 2015 07:28:00 GMT'}
      - {name: If-Unmodified-Since, in: header, schema: {type: string}, example: 'Wed, 21 Oct 2015 07:28:00 GMT'}
      - {name: iF-rAnGe, in: header, schema: {type: string}, example: '"saved-etag"'}
      - {name: Range, in: header, schema: {type: string}, example: 'bytes=0-3'}
      - {name: x-client, in: header, schema: {type: string}, example: documentation}
    get:
      operationId: readContent
      responses: {'200': {description: full bytes}}
    head:
      operationId: headContent
      responses: {'200': {description: metadata}}
    put:
      operationId: replaceContent
      parameters:
        - {name: If-Match, in: header, required: true, schema: {type: string}, example: '"required-etag"'}
      responses: {'200': {description: replaced}}
    patch:
      operationId: patchContent
      parameters:
        - {name: If-Match, in: header, required: true, schema: {type: string}, example: '"required-etag"'}
      responses: {'200': {description: patched}}
`
	site := pressFromSpec(t, spec)
	require.Len(t, site.Operations, 4)
	for _, op := range site.Operations {
		var variants []*CurlVariant
		require.NoError(t, json.Unmarshal([]byte(op.CurlJSON), &variants))
		require.NotEmpty(t, variants)
		command := variants[0].Command
		assert.Contains(t, command, "x-client: documentation")
		for _, header := range []string{"If-None-Match", "If-Modified-Since", "If-Unmodified-Since", "iF-rAnGe", "Range"} {
			assert.NotContains(t, command, header+":", op.Method)
		}
		if strings.EqualFold(op.Method, "PUT") || strings.EqualFold(op.Method, "PATCH") {
			assert.Contains(t, command, `If-Match: "required-etag"`)
		} else {
			assert.NotContains(t, command, "If-Match:")
		}
		assert.NotContains(t, command, "saved-etag")
	}
}

func TestAgentCommonErrorModelUsesResponseObject(t *testing.T) {
	spec := `openapi: 3.1.0
info: {title: Errors, version: '1'}
paths:
  /items:
    get:
      responses:
        '200': {description: ok}
        '400':
          description: Invalid request
          content:
            application/problem+json:
              schema: {$ref: '#/components/schemas/BunkHouseError'}
components:
  schemas:
    ProblemDetail:
      type: string
      description: A human readable explanation.
    BunkHouseError:
      type: object
      required: [title, detail]
      properties:
        title: {type: string}
        detail: {$ref: '#/components/schemas/ProblemDetail'}
`
	site := pressFromSpec(t, spec)
	require.NotNil(t, detectErrorModel(site))
	assert.Equal(t, "BunkHouseError", detectErrorModel(site).Name)
	var preamble strings.Builder
	require.NoError(t, writeLLMFullPreamble(rootLLMRenderContext(site), &preamble))
	assert.Contains(t, preamble.String(), `"type": "object"`)
	assert.NotContains(t, preamble.String(), "A human readable explanation.")
	scalarOnly := &Site{Models: map[string][]*ModelPage{"schemas": {{Name: "ProblemDetail", Slug: "problem-detail", SchemaJSON: `{"type":"string"}`}}}}
	assert.Nil(t, detectErrorModel(scalarOnly))
}

func TestAgentHeaderExamplesRespectDeclaredPrecedence(t *testing.T) {
	const key = "14253ce5-67bf-4f11-85c6-4a420b0f21d0"
	const spec = `openapi: 3.1.0
info: {title: Declared keys, version: '1'}
paths:
  /jobs:
    post:
      operationId: createJob
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          schema:
            type: string
            examples: [14253ce5-67bf-4f11-85c6-4a420b0f21d0]
            default: ignored-default
      responses: {'202': {description: accepted}}
`
	site := pressFromSpec(t, spec)
	assert.Contains(t, site.Operations[0].CurlJSON, "Idempotency-Key: "+key)
	assert.NotContains(t, site.Operations[0].CurlJSON, "ignored-default")
	override := strings.Replace(spec, "          schema:", "          example: parameter-value\n          schema:", 1)
	overridden := pressFromSpec(t, override)
	assert.Contains(t, overridden.Operations[0].CurlJSON, "Idempotency-Key: parameter-value")
	assert.NotContains(t, overridden.Operations[0].CurlJSON, key)
}

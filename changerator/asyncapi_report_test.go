// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"fmt"
	"strings"
	"sync"
	"testing"

	"github.com/pb33f/doctor/changerator/renderer"
	"github.com/pb33f/libasyncapi"
	wc "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/require"
)

const asyncReportFixture = `asyncapi: 3.0.0
info:
  title: Synthetic events
  version: 1.0.0
  contact: {url: 'https://old.example.test'}
  license: {name: Old license}
servers:
  production:
    host: old.example.test
    protocol: kafka
    variables:
      region: {default: old-region}
channels:
  orders:
    address: orders.v1
    messages:
      created:
        title: Old title
        payload:
          type: object
          properties:
            id: {type: string}
operations:
  GET:
    action: receive
    channel: {$ref: '#/channels/orders'}
components:
  schemas:
    Order: {type: string}
`

func compareAsyncReportFixture(t testing.TB, left, right string) *AsyncAPIResult {
	t.Helper()
	parse := func(source string) (libasyncapi.Document, error) {
		config := libasyncapi.NewDocumentConfiguration()
		// Match the CLI's file-backed index so shared references are compared.
		config.SpecFilePath = "events.yaml"
		config.BasePath = t.TempDir()
		return libasyncapi.NewDocumentWithConfiguration([]byte(source), config)
	}
	l, err := parse(left)
	require.NoError(t, err)
	r, err := parse(right)
	require.NoError(t, err)
	result, err := CompareAsyncAPI(l, r, nil)
	require.NoError(t, err)
	require.NotNil(t, result)
	t.Cleanup(result.Release)
	return result
}

func TestAsyncAPIReportUsesExistingSemanticSections(t *testing.T) {
	next := strings.NewReplacer("1.0.0", "2.0.0", "old.example.test", "new.example.test", "Old license", "New license",
		"old-region", "new-region", "orders.v1", "orders.v2", "Old title", "New title", "type: string", "type: integer", "action: receive", "action: send").Replace(asyncReportFixture)
	result := compareAsyncReportFixture(t, asyncReportFixture, next)
	input := &renderer.RenderInput{ChangeReport: result.Changes, DeduplicatedChanges: result.Changerator.DeduplicateChanges(), Config: renderer.DefaultRenderConfig()}
	r := renderer.NewHTMLRenderer(input.Config)
	markdown, err := r.RenderMarkdown(input)
	require.NoError(t, err)
	for _, heading := range []string{"### Document Info", "#### Info", "#### Contact", "#### License", "### Servers", "#### Server:", "**Variable:", "### Channels", "#### Channel:", "**Message:", "**Payload**", "### Operations", "#### Operation:", "### Components", "#### Schema:"} {
		require.Contains(t, markdown, heading)
	}
	require.NotContains(t, markdown, "$.channels")
	require.NotContains(t, markdown, "$.components")
	// Each semantic change appears once in the breakdown, including nested fields.
	breakdown := strings.SplitN(markdown, "## Change Breakdown", 2)[1]
	require.Equal(t, len(input.DeduplicatedChanges), strings.Count(breakdown, "\n- "))
	for i := 0; i < 5; i++ {
		again, err := r.RenderMarkdown(input)
		require.NoError(t, err)
		require.Equal(t, markdown, again)
	}
	html, err := r.RenderHTML(input)
	require.NoError(t, err)
	require.Contains(t, html, `icon="channel"`)
	require.Contains(t, html, `Operation: <code class="property-name">GET</code>`)
	require.NotContains(t, html, `<pb33f-http-method`)
	fromChangerator, err := result.Changerator.GenerateReportWithConfig(r, renderer.OutputFormatMarkdown, input.Config)
	require.NoError(t, err)
	require.Equal(t, markdown, fromChangerator)
}

func TestAsyncAPIReportIncludesWholeObjectChanges(t *testing.T) {
	base := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels: {}\noperations: {}\ncomponents: {schemas: {}}\n"
	for _, pair := range [][2]string{{base, asyncReportFixture}, {asyncReportFixture, base}} {
		result := compareAsyncReportFixture(t, pair[0], pair[1])
		input := &renderer.RenderInput{ChangeReport: result.Changes, DeduplicatedChanges: result.Changerator.DeduplicateChanges()}
		markdown, err := renderer.NewMarkdownRenderer().RenderMarkdown(input)
		require.NoError(t, err)
		breakdown := strings.SplitN(markdown, "## Change Breakdown", 2)[1]
		require.Equal(t, len(input.DeduplicatedChanges), strings.Count(breakdown, "\n- "))
		for _, heading := range []string{"### Servers", "### Channels", "### Operations", "### Components"} {
			require.Contains(t, markdown, heading)
		}
	}
}

func TestAsyncAPIReportKeepsNamesLiteral(t *testing.T) {
	old := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  'events`[<img src=x onerror=alert(1)>]':\n    address: orders.v1\n"
	result := compareAsyncReportFixture(t, old, strings.Replace(old, "orders.v1", "orders.v2", 1))
	output, err := result.Changerator.GenerateHTMLWithConfig(renderer.DefaultRenderConfig())
	require.NoError(t, err)
	require.Contains(t, output, "events`[&lt;img src=x onerror=alert(1)&gt;]")
	require.NotContains(t, output, "<img src=x")
}

func TestAsyncAPIReportPreservesArrayBackedNames(t *testing.T) {
	old := `asyncapi: 3.0.0
info:
  title: Events
  version: 1.0.0
  tags:
    - {name: billing, description: old tag}
channels:
  orders:
    address: orders
    messages:
      created:
        examples:
          - {name: typical, summary: old example, payload: {id: 1}}
`
	next := strings.NewReplacer("old tag", "new tag", "old example", "new example").Replace(old)
	result := compareAsyncReportFixture(t, old, next)
	markdown, err := result.Changerator.GenerateReport(renderer.NewMarkdownRenderer(), renderer.OutputFormatMarkdown)
	require.NoError(t, err)
	require.Contains(t, markdown, "Tag: ` billing `")
	require.Contains(t, markdown, "Example: ` typical `")
	require.Contains(t, markdown, "new tag")
	require.Contains(t, markdown, "new example")
	breakdown := strings.SplitN(markdown, "## Change Breakdown", 2)[1]
	require.Equal(t, len(result.Changerator.DeduplicateChanges()), strings.Count(breakdown, "\n- "))
}

func TestAsyncAPIReportDoesNotMutateExtensions(t *testing.T) {
	old := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nx-z: before\nx-a: before\n"
	result := compareAsyncReportFixture(t, old, strings.ReplaceAll(old, "before", "after"))
	extensions := result.Changes.ExtensionChanges
	// Force a non-sorted order so this also detects mutation without the race detector.
	if extensions.Changes[0].Property == "x-a" {
		extensions.Changes[0], extensions.Changes[1] = extensions.Changes[1], extensions.Changes[0]
	}
	original := append([]*wc.Change(nil), extensions.Changes...)
	input := &renderer.RenderInput{ChangeReport: result.Changes}
	var workers sync.WaitGroup
	for i := 0; i < 8; i++ {
		workers.Go(func() {
			text, err := renderer.NewMarkdownRenderer().RenderMarkdown(input)
			if err != nil || !strings.Contains(text, "after") {
				t.Errorf("render failed: %v", err)
			}
		})
	}
	workers.Wait()
	require.Equal(t, original, extensions.Changes)
}

func BenchmarkAsyncAPIMarkdownReport(b *testing.B) {
	for _, count := range []int{10, 100, 1000} {
		b.Run(fmt.Sprint(count), func(b *testing.B) {
			var source strings.Builder
			source.WriteString("asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n")
			for i := 0; i < count; i++ {
				fmt.Fprintf(&source, "  channel%d: {address: events%d.v1}\n", i, i)
			}
			old := source.String()
			result := compareAsyncReportFixture(b, old, strings.ReplaceAll(old, ".v1", ".v2"))
			input := &renderer.RenderInput{ChangeReport: result.Changes, DeduplicatedChanges: result.Changerator.DeduplicateChanges()}
			r := renderer.NewMarkdownRenderer()
			b.ReportAllocs()
			for b.Loop() {
				_, err := r.RenderMarkdown(input)
				if err != nil {
					b.Fatal(err)
				}
			}
		})
	}
}

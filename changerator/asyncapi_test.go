package changerator

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/pb33f/doctor/changerator/renderer"
	dr "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/testify/require"
)

func TestAsyncAPIChangePathsAndReports(t *testing.T) {
	old := `asyncapi: 3.0.0
info:
  title: Synthetic events
  version: 1.0.0
channels:
  orders:
    address: orders.v1
    messages:
      created:
        payload:
          type: object
          properties:
            id:
              type: string
  users:
    address: users.v1
`
	next := strings.ReplaceAll(old, ".v1", ".v2")
	next = strings.Replace(next, "type: string", "type: integer", 1)
	l, err := libasyncapi.NewDocument([]byte(old))
	require.NoError(t, err)
	r, err := libasyncapi.NewDocument([]byte(next))
	require.NoError(t, err)
	result, err := CompareAsyncAPI(l, r, nil)
	require.NoError(t, err)
	require.NotNil(t, result)
	defer result.Release()
	changes := result.Changerator.DeduplicateChanges()
	require.Len(t, changes, 3)
	require.Equal(t, "$.channels.orders", changes[0].Path)
	require.Equal(t, "$.channels.orders.messages.created.payload.properties.id", changes[1].Path)
	require.Equal(t, "$.channels.users", changes[2].Path)
	for _, node := range result.Right.Nodes {
		foundation := node.DrInstance.(v3.Foundational)
		want := node.Id
		if want == "root" {
			want = "$"
		}
		require.Equal(t, want, foundation.GenerateJSONPath())
		require.Same(t, result.Right.Root, foundation.GetRoot().GetNode())
	}
	output, err := renderer.NewHTMLRenderer(nil).RenderMarkdown(&renderer.RenderInput{ChangeReport: result.Changerator.ChangeReport, DeduplicatedChanges: changes})
	require.NoError(t, err)
	require.Contains(t, output, "**3** changes")
	require.Contains(t, output, "users")
}

func TestAsyncAPIRemovedTreeVisitsEachNodeOnce(t *testing.T) {
	old := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  events:\n    address: events\n    messages:\n      event:\n        payload:\n          type: object\n          properties:\n            id: {type: string}\n"
	l, err := libasyncapi.NewDocument([]byte(old))
	require.NoError(t, err)
	r, err := libasyncapi.NewDocument([]byte("asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels: {}\n"))
	require.NoError(t, err)
	result, err := CompareAsyncAPI(l, r, nil)
	require.NoError(t, err)
	require.NotNil(t, result)
	defer result.Release()
	seen := make(map[*v3.Node]bool)
	var walk func(*v3.Node)
	walk = func(n *v3.Node) {
		require.False(t, seen[n], "duplicate tree node %s", n.Id)
		seen[n] = true
		for _, child := range n.Children {
			walk(child)
		}
	}
	walk(result.Right.Root)
	require.Len(t, seen, len(result.Changerator.ChangedNodes))
}

func TestAsyncAPISourceOriginsAndOpaqueReferences(t *testing.T) {
	for _, format := range []string{"", "application/schema+json;version=draft-07", "application/vnd.apache.avro+json;version=1.9.0"} {
		t.Run(format, func(t *testing.T) {
			spec := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  events:\n    address: events\n    messages:\n      event:\n        payload:\n"
			if format != "" {
				spec += "          schemaFormat: " + format + "\n          schema:\n            $ref: payload.yaml\n"
			} else {
				spec += "          $ref: payload.yaml\n"
			}
			spec += "x-data: {$ref: this-is-data}\n"
			var docs [2]libasyncapi.Document
			for i, kind := range []string{"string", "integer"} {
				dir := t.TempDir()
				require.NoError(t, os.WriteFile(filepath.Join(dir, "payload.yaml"), []byte("type: "+kind+"\n"), 0600))
				config := libasyncapi.NewDocumentConfiguration()
				config.BasePath = dir
				config.SpecFilePath = "root.yaml"
				config.AllowFileReferences = true
				config.ExcludeExtensionRefs = true
				var err error
				docs[i], err = libasyncapi.NewDocumentWithConfiguration([]byte(spec), config)
				require.NoError(t, err)
				require.False(t, docs[i].IsPartial())
			}
			result, err := CompareAsyncAPI(docs[0], docs[1], nil)
			require.NoError(t, err)
			require.NotNil(t, result)
			defer result.Release()
			changes := result.Changerator.DeduplicateChanges()
			require.Len(t, changes, 1)
			require.Contains(t, changes[0].Path, "$.channels.events.messages.event.payload")
			require.True(t, strings.HasSuffix(changes[0].Context.DocumentLocation, "payload.yaml"))
			require.Equal(t, 1, *changes[0].Context.NewLine)
			var payload *v3.Node
			for _, n := range result.Right.Nodes {
				if strings.HasSuffix(n.OriginLocation, "payload.yaml") {
					payload = n
					break
				}
			}
			require.NotNil(t, payload)
			require.NotNil(t, payload.DrInstance)
			encoded, err := json.Marshal(payload)
			require.NoError(t, err)
			require.Contains(t, string(encoded), `"instance":{"type":"integer"}`)
			require.Contains(t, string(encoded), `"origin":`)
			require.NotEmpty(t, payload.IdHash)
		})
	}
}

func TestAsyncAPIReportTreatsIdentifiersAsText(t *testing.T) {
	old := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  '![x](https://example.com/pixel)`':\n    address: old\n"
	l, err := libasyncapi.NewDocument([]byte(old))
	require.NoError(t, err)
	r, err := libasyncapi.NewDocument([]byte(strings.Replace(old, "address: old", "address: new", 1)))
	require.NoError(t, err)
	result, err := CompareAsyncAPI(l, r, nil)
	require.NoError(t, err)
	defer result.Release()
	html, err := result.Changerator.GenerateHTML()
	require.NoError(t, err)
	require.NotContains(t, html, `src="https://example.com/pixel"`)
}

func TestAsyncAPIChannelAliasesKeepSemanticIdentity(t *testing.T) {
	spec := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  a: &channel\n    address: old\n  b: *channel\n"
	left, err := libasyncapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	right, err := libasyncapi.NewDocument([]byte(strings.Replace(spec, "address: old", "address: new", 1)))
	require.NoError(t, err)
	result, err := CompareAsyncAPI(left, right, nil)
	require.NoError(t, err)
	defer result.Release()
	changes := result.Changerator.DeduplicateChanges()
	require.Len(t, changes, 2)
	require.Equal(t, "$.channels.a", changes[0].Path)
	require.Equal(t, "$.channels.b", changes[1].Path)
}

func TestAsyncAPINestedAliasesAndBoundedGraph(t *testing.T) {
	spec := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  events:\n    address: events\n    messages:\n      a: &message\n        name: old\n      b: *message\n"
	left, err := libasyncapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	right, err := libasyncapi.NewDocument([]byte(strings.Replace(spec, "name: old", "name: new", 1)))
	require.NoError(t, err)
	result, err := CompareAsyncAPI(left, right, nil)
	require.NoError(t, err)
	defer result.Release()
	changes := result.Changerator.DeduplicateChanges()
	require.Len(t, changes, 2)
	require.Equal(t, "$.channels.events.messages.a", changes[0].Path)
	require.Equal(t, "$.channels.events.messages.b", changes[1].Path)
	var source strings.Builder
	source.WriteString("asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nx-data:\n  a0: &a0 {value: data}\n")
	for i := 1; i <= 10; i++ {
		fmt.Fprintf(&source, "  a%d: &a%d {left: *a%d, right: *a%d}\n", i, i, i-1, i-1)
	}
	doc, err := libasyncapi.NewDocument([]byte(source.String()))
	require.NoError(t, err)
	graph, err := dr.NewAsyncDocument(doc)
	require.NoError(t, err)
	defer graph.Release()
	require.Len(t, graph.Nodes, 34, "alias references must not expand their target subtrees")
}

func TestAsyncAPIExternalEnumAndRemovalOrigins(t *testing.T) {
	spec := "asyncapi: 3.0.0\ninfo: {title: Events, version: 1.0.0}\nchannels:\n  events:\n    address: events\n    description: old description\n    messages:\n      event:\n        payload: {$ref: payload.yaml}\n"
	var docs [2]libasyncapi.Document
	for i, value := range []string{"string", "integer"} {
		dir := t.TempDir()
		content := "type: string\nenum: [" + value + "]\nproperties:\n  a:\n    type: object\n    properties:\n      b:\n        properties:\n          c: {type: boolean}\n"
		require.NoError(t, os.WriteFile(filepath.Join(dir, "payload.yaml"), []byte(content), 0600))
		config := libasyncapi.NewDocumentConfiguration()
		config.BasePath = dir
		config.SpecFilePath = fmt.Sprintf("side-%d.yaml", i)
		config.AllowFileReferences = true
		input := spec
		if i == 1 {
			input = strings.Replace(input, "    description: old description\n", "", 1)
		}
		var err error
		docs[i], err = libasyncapi.NewDocumentWithConfiguration([]byte(input), config)
		require.NoError(t, err)
	}
	result, err := CompareAsyncAPI(docs[0], docs[1], nil)
	require.NoError(t, err)
	defer result.Release()
	require.Len(t, result.Changerator.Changes, 3)
	for _, change := range result.Changerator.Changes {
		if change.Property == "enum" {
			require.Equal(t, "$.channels.events.messages.event.payload.enum", change.Path)
			require.True(t, strings.HasSuffix(change.Context.DocumentLocation, "payload.yaml"))
		} else {
			require.Equal(t, "description", change.Property)
			require.True(t, strings.HasSuffix(change.Context.DocumentLocation, "side-0.yaml"))
		}
	}
}

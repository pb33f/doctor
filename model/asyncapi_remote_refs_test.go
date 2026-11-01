package model

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"path/filepath"
	"strings"
	"sync"
	"testing"

	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/testify/require"
)

// a repaired alias is registered by its raw local reference, so the indexed
// location of a base path qualified reference does not find it.
func TestNewAsyncDocumentResolvesRepairedAliasWithBasePath(t *testing.T) {
	dir := t.TempDir()
	doc, err := libasyncapi.NewDocumentWithConfiguration([]byte(`asyncapi: 3.0.0
info:
  title: Alias
  version: 1.0.0
channels:
  orders:
    address: orders
    messages:
      created:
        payload:
          $ref: '#/components/schemas/Alias/properties/x'
components:
  schemas:
    Alias:
      $ref: '#/components/schemas/Target'
    Target:
      type: object
      properties:
        x:
          type: string
`), &libasyncapi.DocumentConfiguration{
		BasePath:            dir,
		SpecFilePath:        filepath.Join(dir, "asyncapi.yaml"),
		AllowFileReferences: true,
	})
	require.NoError(t, err)
	require.False(t, doc.IsPartial(), "%v", doc.Errors())

	graph, err := NewAsyncDocument(doc)
	require.NoError(t, err)
	require.NotNil(t, graph.Root)
}

func TestNewAsyncDocumentResolvesReferencesAgainstBaseURL(t *testing.T) {
	var mu sync.Mutex
	var requested []string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		requested = append(requested, r.URL.Path)
		mu.Unlock()
		switch r.URL.Path {
		case "/specs/schemas/order.yaml":
			_, _ = w.Write([]byte("type: object\nproperties:\n  id:\n    type: string\n"))
		case "/specs/schemas/shared.yaml":
			_, _ = w.Write([]byte("definitions:\n  User:\n    type: object\n"))
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	}))
	defer server.Close()

	base, err := url.Parse(server.URL + "/specs")
	require.NoError(t, err)
	doc, err := libasyncapi.NewDocumentWithConfiguration([]byte(`asyncapi: 3.0.0
info:
  title: Remote
  version: 1.0.0
channels:
  orders:
    address: orders
    messages:
      created:
        payload:
          $ref: ./schemas/order.yaml
      user:
        payload:
          $ref: ./schemas/shared.yaml#/definitions/User
`), &libasyncapi.DocumentConfiguration{BaseURL: base, AllowRemoteReferences: true})
	require.NoError(t, err)
	require.False(t, doc.IsPartial(), "%v", doc.Errors())

	graph, err := NewAsyncDocument(doc)
	require.NoError(t, err)
	require.NotNil(t, graph.Root)

	mu.Lock()
	defer mu.Unlock()
	for _, path := range requested {
		require.True(t, strings.HasPrefix(path, "/specs/"), "request left the base URL: %s", path)
	}
}

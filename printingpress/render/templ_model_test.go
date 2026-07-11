package render

import (
	"bytes"
	"context"
	"strings"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func TestModelPageExtensionsSummaryCount(t *testing.T) {
	tests := []struct {
		name       string
		extensions []*ppmodel.ExtensionEntry
		expected   string
	}{
		{
			name: "one extension omits count",
			extensions: []*ppmodel.ExtensionEntry{
				{Key: "resourceId", Value: "account"},
			},
			expected: `<h2>Extensions</h2>`,
		},
		{
			name: "multiple extensions include count",
			extensions: []*ppmodel.ExtensionEntry{
				{Key: "stripeContext", Value: true},
				{Key: "resources", Value: []string{"account"}},
				{Key: "metadata", Value: map[string]any{"owner": "docs"}},
			},
			expected: `<h2>Extensions (3)</h2>`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			page := &ppmodel.ModelPage{
				Name:          "Account",
				ComponentType: "schemas",
				TypeSlug:      "schemas",
				Slug:          "account",
				Extensions:    tt.extensions,
			}
			page.ExtensionsJSON = MustJSON(page.Extensions)

			var buf bytes.Buffer
			if err := ModelPageTempl(page, "").Render(context.Background(), &buf); err != nil {
				t.Fatalf("render model page: %v", err)
			}

			html := buf.String()
			if !strings.Contains(html, tt.expected) {
				t.Fatalf("expected extensions summary %q, got:\n%s", tt.expected, html)
			}
		})
	}
}

func TestModelPageNamedTraitPreservesIdentityAndRendersProtocols(t *testing.T) {
	page := &ppmodel.ModelPage{
		Name:          "commandTransport",
		ComponentType: "operationTraits",
		TypeSlug:      "operation-traits",
		Slug:          "command-transport",
		AsyncAPI: &ppmodel.AsyncAPIModelInfo{
			Kind:     "operationTrait",
			Bindings: []string{"kafka", "amqp"},
		},
	}

	var buf bytes.Buffer
	if err := ModelPageTempl(page, "").Render(context.Background(), &buf); err != nil {
		t.Fatalf("render model page: %v", err)
	}

	html := buf.String()
	for _, expected := range []string{
		`<pp-icon-title icon="operationTraits" heading="commandTransport">`,
		`id="section-protocols" data-nav-label="Protocols"`,
		`<pp-asyncapi-protocol protocol="kafka" size="medium">`,
		`<pp-asyncapi-protocol protocol="amqp" size="medium">`,
	} {
		if !strings.Contains(html, expected) {
			t.Fatalf("expected rendered trait to contain %q, got:\n%s", expected, html)
		}
	}
	if strings.Contains(html, `<pp-asyncapi-protocol protocol="kafka" size="large" heading>`) {
		t.Fatalf("named trait must not replace its title with the protocol: %s", html)
	}
}

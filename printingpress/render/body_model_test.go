package render

import (
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

			html := renderBodyForTest(t, ModelBody(page, ""))
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

	html := renderBodyForTest(t, ModelBody(page, ""))
	for _, expected := range []string{
		`<pp-icon-title icon="operationTraits" heading="commandTransport" data-pp-owner="page" data-pp-ssr>`,
		`<h1>commandTransport</h1>`,
		`id="section-protocols" data-nav-label="Protocols"`,
		`<pp-asyncapi-protocol protocol="kafka" size="medium" data-pp-owner="page" data-pp-ssr>`,
		`<pp-asyncapi-protocol protocol="amqp" size="medium" data-pp-owner="page" data-pp-ssr>`,
	} {
		if !strings.Contains(html, expected) {
			t.Fatalf("expected rendered trait to contain %q, got:\n%s", expected, html)
		}
	}
	if strings.Contains(html, `<pp-asyncapi-protocol protocol="kafka" size="large" heading data-pp-owner="page" data-pp-ssr>`) {
		t.Fatalf("named trait must not replace its title with the protocol: %s", html)
	}
}

// renderBodyForTest draws a page body through the default theme.
func renderBodyForTest(t *testing.T, body Body) string {
	t.Helper()
	return renderTemplateForTest(t, body.Template, body.Data)
}

// renderTemplateForTest draws one default-theme template.
func renderTemplateForTest(t *testing.T, name string, data any) string {
	t.Helper()
	html, err := MustLoadDefaultTheme().RenderTemplate(name, data)
	if err != nil {
		t.Fatalf("render %s: %v", name, err)
	}
	return string(html)
}

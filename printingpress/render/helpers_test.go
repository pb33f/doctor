package render

import (
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func TestAssetHref(t *testing.T) {
	tests := []struct {
		name         string
		assetBaseURL string
		href         string
		want         string
	}{
		{
			name:         "empty base preserves href",
			assetBaseURL: "",
			href:         "static/app.css",
			want:         "static/app.css",
		},
		{
			name:         "absolute path base resolves from root",
			assetBaseURL: "/docs/",
			href:         "static/app.css",
			want:         "/docs/static/app.css",
		},
		{
			name:         "absolute url base resolves fully",
			assetBaseURL: "https://example.com/docs/",
			href:         "static/app.css",
			want:         "https://example.com/docs/static/app.css",
		},
		{
			name:         "relative base preserves href",
			assetBaseURL: "docs/",
			href:         "static/app.css",
			want:         "static/app.css",
		},
		{
			name:         "dot relative base preserves href",
			assetBaseURL: "./docs/",
			href:         "static/app.css",
			want:         "static/app.css",
		},
		{
			name:         "parent relative base preserves href",
			assetBaseURL: "../docs/",
			href:         "static/app.css",
			want:         "static/app.css",
		},
		{
			name:         "relative base preserves href query and fragment",
			assetBaseURL: "docs/?x=1#top",
			href:         "static/app.css?v=2#asset",
			want:         "static/app.css?v=2#asset",
		},
		{
			name:         "already absolute href is unchanged",
			assetBaseURL: "/docs/",
			href:         "/static/app.css",
			want:         "/static/app.css",
		},
		{
			name:         "mailto href is unchanged",
			assetBaseURL: "/docs/",
			href:         "mailto:docs@example.com",
			want:         "mailto:docs@example.com",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := AssetHref(tt.assetBaseURL, tt.href); got != tt.want {
				t.Fatalf("AssetHref(%q, %q) = %q, want %q", tt.assetBaseURL, tt.href, got, tt.want)
			}
		})
	}
}

func TestSharedAssetHref(t *testing.T) {
	tests := []struct {
		name               string
		sharedAssetBaseURL string
		assetBaseURL       string
		href               string
		want               string
	}{
		{
			name:               "root shared base resolves static asset from origin root",
			sharedAssetBaseURL: "/",
			href:               "static/printing-press.js",
			want:               "/printing-press.js",
		},
		{
			name:               "nested shared base strips static prefix",
			sharedAssetBaseURL: "/ppress/static/v1/",
			href:               "static/shoelace/assets/icons/x.svg",
			want:               "/ppress/static/v1/shoelace/assets/icons/x.svg",
		},
		{
			name:               "non-static asset falls back to document asset base",
			sharedAssetBaseURL: "/ppress/static/v1/",
			assetBaseURL:       "/docs/",
			href:               "data/pages/index.json",
			want:               "/docs/data/pages/index.json",
		},
		{
			name:         "relative static asset base resolves from nested served page",
			assetBaseURL: "../",
			href:         "static/printing-press.js",
			want:         "../static/printing-press.js",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := SharedAssetHref(tt.sharedAssetBaseURL, tt.assetBaseURL, tt.href); got != tt.want {
				t.Fatalf("SharedAssetHref(%q, %q, %q) = %q, want %q", tt.sharedAssetBaseURL, tt.assetBaseURL, tt.href, got, tt.want)
			}
		})
	}
}

func TestShouldRenderAsyncAPIModelSection(t *testing.T) {
	tests := []struct {
		name string
		page *ppmodel.ModelPage
		want bool
	}{
		{
			name: "nil page",
			page: nil,
			want: false,
		},
		{
			name: "non asyncapi model",
			page: &ppmodel.ModelPage{},
			want: false,
		},
		{
			name: "security scheme uses dedicated renderer",
			page: &ppmodel.ModelPage{
				ComponentType: "securitySchemes",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "securityScheme"},
			},
			want: false,
		},
		{
			name: "schema uses the shared schema renderer",
			page: &ppmodel.ModelPage{
				ComponentType: "schemas",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "schema"},
			},
			want: false,
		},
		{
			name: "parameter uses the shared parameter renderer",
			page: &ppmodel.ModelPage{
				ComponentType: "parameters",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "parameter"},
			},
			want: false,
		},
		{
			name: "channel uses the dedicated channel renderer",
			page: &ppmodel.ModelPage{
				ComponentType: "channels",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "channel"},
			},
			want: true,
		},
		{
			name: "message trait uses model page content only",
			page: &ppmodel.ModelPage{
				ComponentType: "messageTraits",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "messageTrait"},
			},
			want: false,
		},
		{
			name: "operation trait uses model page content only",
			page: &ppmodel.ModelPage{
				ComponentType: "operationTraits",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "operationTrait"},
			},
			want: false,
		},
		{
			name: "reply address uses dedicated asyncapi section",
			page: &ppmodel.ModelPage{
				ComponentType: "replyAddresses",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "replyAddress"},
			},
			want: true,
		},
		{
			name: "correlation id uses dedicated asyncapi section",
			page: &ppmodel.ModelPage{
				ComponentType: "correlationIds",
				AsyncAPI:      &ppmodel.AsyncAPIModelInfo{Kind: "correlationId"},
			},
			want: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := shouldRenderAsyncAPIModelSection(tt.page); got != tt.want {
				t.Fatalf("shouldRenderAsyncAPIModelSection() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestAsyncAPIModelProtocol(t *testing.T) {
	tests := []struct {
		name string
		page *ppmodel.ModelPage
		want string
	}{
		{name: "nil page", want: ""},
		{
			name: "operation trait protocol",
			page: &ppmodel.ModelPage{AsyncAPI: &ppmodel.AsyncAPIModelInfo{Kind: "operationTrait", Protocol: "kafka"}},
			want: "kafka",
		},
		{
			name: "message trait protocol",
			page: &ppmodel.ModelPage{AsyncAPI: &ppmodel.AsyncAPIModelInfo{Kind: "messageTrait", Protocol: "mqtt"}},
			want: "mqtt",
		},
		{
			name: "server keeps its own title",
			page: &ppmodel.ModelPage{AsyncAPI: &ppmodel.AsyncAPIModelInfo{Kind: "server", Protocol: "kafka"}},
			want: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := asyncAPIModelProtocol(tt.page); got != tt.want {
				t.Fatalf("asyncAPIModelProtocol() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestShouldRenderAsyncAPITraitProtocols(t *testing.T) {
	assertions := []struct {
		name string
		page *ppmodel.ModelPage
		want bool
	}{
		{name: "nil page", want: false},
		{
			name: "canonical protocol title does not duplicate protocol section",
			page: &ppmodel.ModelPage{AsyncAPI: &ppmodel.AsyncAPIModelInfo{
				Kind: "operationTrait", Protocol: "kafka", Bindings: []string{"kafka"},
			}},
			want: false,
		},
		{
			name: "named trait gets additive protocol section",
			page: &ppmodel.ModelPage{AsyncAPI: &ppmodel.AsyncAPIModelInfo{
				Kind: "operationTrait", Bindings: []string{"kafka"},
			}},
			want: true,
		},
		{
			name: "multi protocol trait gets additive protocol section",
			page: &ppmodel.ModelPage{AsyncAPI: &ppmodel.AsyncAPIModelInfo{
				Kind: "operationTrait", Bindings: []string{"kafka", "amqp"},
			}},
			want: true,
		},
	}

	for _, assertion := range assertions {
		t.Run(assertion.name, func(t *testing.T) {
			if got := shouldRenderAsyncAPITraitProtocols(assertion.page); got != assertion.want {
				t.Fatalf("shouldRenderAsyncAPITraitProtocols() = %v, want %v", got, assertion.want)
			}
		})
	}
}

func TestDocHref(t *testing.T) {
	tests := []struct {
		name    string
		baseURL string
		href    string
		want    string
	}{
		{
			name:    "empty base preserves href",
			baseURL: "",
			href:    "index.html",
			want:    "index.html",
		},
		{
			name:    "relative page base prefixes href",
			baseURL: "../",
			href:    "index.html",
			want:    "../index.html",
		},
		{
			name:    "nested relative page base prefixes model href",
			baseURL: "../../",
			href:    "models/schemas/finding.html",
			want:    "../../models/schemas/finding.html",
		},
		{
			name:    "absolute path base resolves from docs root",
			baseURL: "/docs/",
			href:    "operations/get-health.html",
			want:    "/docs/operations/get-health.html",
		},
		{
			name:    "absolute url base resolves fully",
			baseURL: "https://example.com/docs/",
			href:    "models/schemas/finding.html",
			want:    "https://example.com/docs/models/schemas/finding.html",
		},
		{
			name:    "already absolute href is unchanged",
			baseURL: "/docs/",
			href:    "/external/path",
			want:    "/external/path",
		},
		{
			name:    "mailto href is unchanged",
			baseURL: "/docs/",
			href:    "mailto:docs@example.com",
			want:    "mailto:docs@example.com",
		},
		{
			name:    "anchor href is unchanged",
			baseURL: "/docs/",
			href:    "#responses",
			want:    "#responses",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := DocHref(tt.baseURL, tt.href); got != tt.want {
				t.Fatalf("DocHref(%q, %q) = %q, want %q", tt.baseURL, tt.href, got, tt.want)
			}
		})
	}
}

func TestOperationDocHref(t *testing.T) {
	tests := []struct {
		name    string
		baseURL string
		href    string
		want    string
	}{
		{
			name: "empty base preserves document href",
			href: "models/messages/light-measured.html",
			want: "models/messages/light-measured.html",
		},
		{
			name:    "relative operation page base prefixes document href",
			baseURL: "../",
			href:    "models/messages/light-measured.html",
			want:    "../models/messages/light-measured.html",
		},
		{
			name:    "hosted base resolves from docs root",
			baseURL: "/docs/",
			href:    "models/messages/light-measured.html",
			want:    "/docs/models/messages/light-measured.html",
		},
		{
			name:    "nested relative operation page base prefixes document href",
			baseURL: "../../",
			href:    "models/messages/light-measured.html",
			want:    "../../models/messages/light-measured.html",
		},
		{
			name: "absolute path href is unchanged",
			href: "/models/messages/light-measured.html",
			want: "/models/messages/light-measured.html",
		},
		{
			name: "anchor href is unchanged",
			href: "#message",
			want: "#message",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := OperationDocHref(tt.baseURL, tt.href); got != tt.want {
				t.Fatalf("OperationDocHref(%q, %q) = %q, want %q", tt.baseURL, tt.href, got, tt.want)
			}
		})
	}
}

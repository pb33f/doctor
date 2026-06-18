package render

import "testing"

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
			name:    "portable base preserves href",
			baseURL: "../",
			href:    "index.html",
			want:    "index.html",
		},
		{
			name:    "portable nested base preserves model href",
			baseURL: "../../",
			href:    "models/schemas/finding.html",
			want:    "models/schemas/finding.html",
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

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
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := AssetHref(tt.assetBaseURL, tt.href); got != tt.want {
				t.Fatalf("AssetHref(%q, %q) = %q, want %q", tt.assetBaseURL, tt.href, got, tt.want)
			}
		})
	}
}

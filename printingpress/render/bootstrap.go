package render

import (
	"context"
	"embed"
	"encoding/json"
	"io"
	"strings"

	"github.com/a-h/templ"
)

//go:embed bootstrap_scripts/*.js
var bootstrapScriptFS embed.FS

var (
	bootstrapSharedNavCacheSource = mustReadBootstrapScript("bootstrap_scripts/shared_nav_cache.js")
	bootstrapHydrationSource      = mustReadBootstrapScript("bootstrap_scripts/hydration.js")
)

func BootstrapSharedNavCacheScript(assetBaseURL string, sharedDataBase string, sharedDataHash string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
		return writeEmbeddedBootstrapScript(
			w,
			bootstrapSharedNavCacheSource,
			"__PP_SHARED_BASE__", jsStringLiteral(sharedAssetBase),
			"__PP_SHARED_HASH__", jsStringLiteral(sharedDataHash),
		)
	})
}

func BootstrapHydrationScript(assetMode string, assetBaseURL string, sharedDataBase string, pageDataBase string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
		pageAssetBase := AssetHref(assetBaseURL, pageDataBase)
		return writeEmbeddedBootstrapScript(
			w,
			bootstrapHydrationSource,
			"__PP_ASSET_MODE__", jsStringLiteral(assetMode),
			"__PP_SHARED_BASE__", jsStringLiteral(sharedAssetBase),
			"__PP_PAGE_BASE__", jsStringLiteral(pageAssetBase),
		)
	})
}

func mustReadBootstrapScript(path string) string {
	body, err := bootstrapScriptFS.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return string(body)
}

func jsStringLiteral(value string) string {
	body, err := json.Marshal(value)
	if err != nil {
		return `""`
	}
	return string(body)
}

func writeEmbeddedBootstrapScript(w io.Writer, source string, replacements ...string) error {
	if len(replacements)%2 != 0 {
		panic("bootstrap replacements must be key/value pairs")
	}
	script := strings.NewReplacer(replacements...).Replace(source)
	_, err := io.WriteString(w, `<script>`+script+`</script>`)
	return err
}

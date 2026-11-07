package render

import (
	"embed"
	"encoding/json"
	"strings"
)

//go:embed bootstrap_scripts/*.js
var bootstrapScriptFS embed.FS

var (
	bootstrapSharedNavCacheSource = mustReadBootstrapScript("bootstrap_scripts/shared_nav_cache.js")
	bootstrapHydrationSource      = mustReadBootstrapScript("bootstrap_scripts/hydration.js")
)

func BootstrapSharedNavCacheScript(assetBaseURL string, sharedDataBase string, sharedDataHash string) string {
	sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
	return embeddedBootstrapScript(
		bootstrapSharedNavCacheSource,
		"__PP_SHARED_BASE__", jsStringLiteral(sharedAssetBase),
		"__PP_SHARED_HASH__", jsStringLiteral(sharedDataHash),
	)
}

func BootstrapHydrationScript(assetMode string, assetBaseURL string, sharedDataBase string, pageDataBase string) string {
	sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
	pageAssetBase := AssetHref(assetBaseURL, pageDataBase)
	return embeddedBootstrapScript(
		bootstrapHydrationSource,
		"__PP_ASSET_MODE__", jsStringLiteral(assetMode),
		"__PP_SHARED_BASE__", jsStringLiteral(sharedAssetBase),
		"__PP_PAGE_BASE__", jsStringLiteral(pageAssetBase),
	)
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

func embeddedBootstrapScript(source string, replacements ...string) string {
	if len(replacements)%2 != 0 {
		panic("bootstrap replacements must be key/value pairs")
	}
	script := strings.NewReplacer(replacements...).Replace(source)
	return `<script>` + script + `</script>`
}

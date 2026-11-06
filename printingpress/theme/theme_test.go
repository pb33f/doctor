// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package theme_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/pb33f/doctor/printingpress/render"
	"github.com/pb33f/doctor/printingpress/theme"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func writeFile(t *testing.T, root, rel, content string) {
	t.Helper()
	path := filepath.Join(root, filepath.FromSlash(rel))
	require.NoError(t, os.MkdirAll(filepath.Dir(path), 0o755))
	require.NoError(t, os.WriteFile(path, []byte(content), 0o644))
}

func siteView() *theme.PageView {
	return &theme.PageView{
		Shape:   theme.ShapeSite,
		Page:    theme.PageInfo{Title: "Page", HomeHref: "index.html"},
		Site:    theme.SiteInfo{Title: "Site"},
		Footer:  theme.FooterView{Enabled: true},
		Content: "<p>BODY</p>",
	}
}

func TestBuiltinThemesLoadAndRender(t *testing.T) {
	assert.Equal(t, []string{"pb33f", "simple"}, theme.BuiltinNames())
	for _, name := range theme.BuiltinNames() {
		stack, err := render.LoadTheme(name, "")
		require.NoError(t, err, name)
		assert.Equal(t, name, stack.Name())
		html, err := stack.RenderString(siteView())
		require.NoError(t, err, name)
		assert.Contains(t, html, "<p>BODY</p>", name)
	}
	stack, err := render.LoadTheme("", "")
	require.NoError(t, err)
	assert.Equal(t, theme.DefaultName, stack.Name(), "empty selects the default theme")
	assert.Equal(t, []string{"dark", "light", "tektronix"}, stack.Palettes())
}

func TestPb33fThemeHoldsThePb33fLook(t *testing.T) {
	pb33f, err := render.LoadTheme("pb33f", "")
	require.NoError(t, err)
	html, err := pb33f.RenderString(siteView())
	require.NoError(t, err)
	assert.Contains(t, html, "pb33f-theme")
	assert.Contains(t, html, "<pb33f-header")
	assert.Contains(t, html, `pp-layout-fallback-caret">$</span>`)
	assert.Contains(t, html, "<pb33f-footer")

	simple, err := render.LoadTheme("simple", "")
	require.NoError(t, err)
	html, err = simple.RenderString(siteView())
	require.NoError(t, err)
	for _, value := range []string{"pb33f", "tektronix", "Berkeley", "pp-layout-fallback-caret", "sl-theme-dark"} {
		assert.NotContains(t, html, value)
	}
}

func TestUnknownThemeNamesTheBuiltins(t *testing.T) {
	_, err := render.LoadTheme("nope", "")
	assert.ErrorContains(t, err, "pb33f, simple")
}

func TestFolderThemeAndAssets(t *testing.T) {
	root := t.TempDir()
	writeFile(t, root, "theme.yaml", "name: custom\npalettes: [light]\n")
	writeFile(t, root, "layouts/layout.html", "<main>{{.Content}}</main>")
	writeFile(t, root, "assets/custom.css", "body{}")

	stack, err := render.LoadTheme(root, "")
	require.NoError(t, err)
	assert.Equal(t, "custom", stack.Name())
	html, err := stack.RenderString(siteView())
	require.NoError(t, err)
	assert.Equal(t, "<main><p>BODY</p></main>", html)

	out := t.TempDir()
	written, err := stack.CopyAssets(out)
	require.NoError(t, err)
	require.Len(t, written, 1)
	assert.FileExists(t, filepath.Join(out, "static", "themes", "custom", "custom.css"))
}

func TestSiteLayoutsOverrideThemePartials(t *testing.T) {
	site := t.TempDir()
	writeFile(t, site, "partials/footer.html", `<footer class="site-own">MINE</footer>`)

	stack, err := render.LoadTheme("pb33f", site)
	require.NoError(t, err)
	html, err := stack.RenderString(siteView())
	require.NoError(t, err)
	assert.Contains(t, html, "MINE", "the site's partial wins")
	assert.NotContains(t, html, "<pb33f-footer")
	assert.Contains(t, html, "<pb33f-header", "everything else still comes from the theme")
}

func TestThemeErrorsNameTheProblem(t *testing.T) {
	noConfig := t.TempDir()
	writeFile(t, noConfig, "layouts/layout.html", "x")
	_, err := render.LoadTheme(noConfig, "")
	assert.ErrorContains(t, err, "theme.yaml")

	broken := t.TempDir()
	writeFile(t, broken, "theme.yaml", "name: broken\n")
	writeFile(t, broken, "layouts/layout.html", "{{if}}")
	_, err = render.LoadTheme(broken, "")
	assert.ErrorContains(t, err, "layout.html")

	execution := t.TempDir()
	writeFile(t, execution, "theme.yaml", "name: execution\n")
	writeFile(t, execution, "layouts/layout.html", "{{.Missing}}")
	stack, err := render.LoadTheme(execution, "")
	require.NoError(t, err)
	_, err = stack.RenderString(siteView())
	assert.ErrorContains(t, err, "layout.html:1", "an execution error names the file and line")
}

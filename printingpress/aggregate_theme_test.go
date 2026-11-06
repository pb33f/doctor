// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

// pb33fValues are strings only the pb33f theme may put in a page.
var pb33fValues = []string{"pb33f", "tektronix", "Berkeley", "pp-layout-fallback-caret", "sl-theme-dark", "cowboy-components"}

func TestSimpleThemeOnASpecLessSiteHasNoPb33fValue(t *testing.T) {
	_, outputDir := buildDocsSiteFixture(t, writeDocsTreeFixture(t), &AggregatePrintingPressConfig{Theme: "simple"})

	pages := 0
	err := filepath.WalkDir(outputDir, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil || entry.IsDir() || !strings.HasSuffix(path, ".html") {
			return walkErr
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		pages++
		text := string(data)
		for _, value := range pb33fValues {
			assert.NotContains(t, text, value, path)
		}
		assert.Contains(t, text, `class="simple"`, path)
		return nil
	})
	require.NoError(t, err)
	assert.Greater(t, pages, 5)
	assert.FileExists(t, filepath.Join(outputDir, "static", "themes", "simple", "simple.css"))

	configure := readOutput(t, outputDir, "getting-started/configure.html")
	assert.Contains(t, configure, `<a href="index.html" class="active" aria-current="true">Guides</a>`, "the current tab is marked")
	assert.Contains(t, configure, `<a href="configure.html" class="active" aria-current="page">Configure</a>`, "the current page is marked")
	assert.Contains(t, configure, `href="../static/themes/simple/simple.css"`)
	assert.Contains(t, configure, `rel="next"`)
}

func TestDefaultThemeIsPb33f(t *testing.T) {
	_, outputDir := buildDocsSiteFixture(t, writeDocsTreeFixture(t), nil)
	assert.Contains(t, readOutput(t, outputDir, "index.html"), "pb33f-theme")
}

func TestSiteLayoutsFolderOverridesTheTheme(t *testing.T) {
	root := writeDocsTreeFixture(t)
	writeGoldenFile(t, root, "layouts/partials/simple-footer.html", `<footer class="site-own">SITE-FOOTER</footer>`)

	_, outputDir := buildDocsSiteFixture(t, root, &AggregatePrintingPressConfig{Theme: "simple"})
	welcome := readOutput(t, outputDir, "welcome.html")
	assert.Contains(t, welcome, "SITE-FOOTER", "layouts/ under the scan root wins over the theme")
	assert.Contains(t, welcome, `class="simple-header"`, "the rest still comes from the theme")
}

func TestBrokenTemplateSkipsOnlyItsPage(t *testing.T) {
	root := writeDocsTreeFixture(t)
	writeGoldenFile(t, root, "layouts/layout.html", `{{if eq .Page.RelPath "welcome.html"}}{{.Missing}}{{end}}{{template "engine-layout.html" .}}`)

	_, outputDir := buildDocsSiteFixture(t, root, nil)
	assert.NoFileExists(t, filepath.Join(outputDir, "welcome.html"), "the page whose template fails is skipped")
	assert.FileExists(t, filepath.Join(outputDir, "getting-started", "install.html"), "the other pages build")
	assert.FileExists(t, filepath.Join(outputDir, "index.html"))
}

func TestUnknownThemeFailsTheBuildWithTheChoices(t *testing.T) {
	root := writeDocsTreeFixture(t)
	ap, err := CreateAggregatePrintingPressFromPath(root, &AggregatePrintingPressConfig{
		OutputDir:       t.TempDir(),
		StateSQLitePath: filepath.Join(t.TempDir(), "state.db"),
		Theme:           "nope",
	})
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	assert.ErrorContains(t, err, "pb33f, simple")
}

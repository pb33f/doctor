// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"crypto/sha256"
	"encoding/hex"
	"flag"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/testify/require"
)

// The golden tests pin the complete output of today's builds, byte for byte,
// so the docs-sites work can prove where it changes them and where it does
// not. Run `go test -run TestGolden -update` to rewrite the manifests after an
// intended output change, and review the diff.
var updateGoldens = flag.Bool("update", false, "rewrite golden output manifests")

// goldenDump, when set, copies each golden build's output under it, so two
// builds can be compared file by file.
var goldenDump = flag.String("golden-dump", "", "copy golden output trees into this folder")

const (
	goldenMockSeed = 20261105
	goldenRootMark = "<golden-root>"
)

// goldenNodeHashPattern matches a graph node's "hash" value, in plain or
// string-escaped JSON.
var goldenNodeHashPattern = regexp.MustCompile(`(\\?"hash\\?":\\?")[0-9a-f]+(\\?")`)

func TestGoldenSingleSpecOutput(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:     "Train Travel",
		OutputDir: outputDir,
		mockSeed:  goldenMockSeed,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)
	_, err = pp.PrintLLM()
	require.NoError(t, err)
	site, err := pp.PressModel()
	require.NoError(t, err)
	require.NoError(t, PrintJSONArtifacts(site, ""))

	assertGoldenTree(t, "single-spec-train-travel", outputDir, outputDir)
}

func TestGoldenCatalogWithGuidesOutput(t *testing.T) {
	scanRoot := t.TempDir()
	writeGoldenFile(t, scanRoot, "services/trains/openapi.yaml", readGoldenSource(t, "../test_specs/train-travel.yaml"))
	writeGoldenFile(t, scanRoot, "services/burgers/openapi.yaml", readGoldenSource(t, "../test_specs/burgershop.openapi.yaml"))
	writeGoldenFile(t, scanRoot, "docs/guide.md", "---\ntitle: Getting Started\norder: 10\ndescription: How the catalog fits together.\n---\n# Getting Started\n\nRead the [FAQ](faq.md) next.\n")
	writeGoldenFile(t, scanRoot, "docs/faq.md", "---\ntitle: FAQ\norder: 20\n---\n# FAQ\n\n## Is this a test?\n\nYes.\n")

	outputDir := t.TempDir()
	ap, err := CreateAggregatePrintingPressFromPath(scanRoot, &AggregatePrintingPressConfig{
		Title:           "Golden Catalog",
		OutputDir:       outputDir,
		StateSQLitePath: filepath.Join(t.TempDir(), "state.db"),
		mockSeed:        goldenMockSeed,
	})
	require.NoError(t, err)
	_, err = ap.PrintHTML()
	require.NoError(t, err)
	_, err = ap.PrintLLM()
	require.NoError(t, err)
	_, err = ap.PrintJSONArtifacts()
	require.NoError(t, err)

	assertGoldenTree(t, "catalog-with-guides", outputDir, scanRoot, outputDir)
}

func TestGoldenOutputIsStableAcrossBuilds(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)
	manifests := make([]string, 0, 2)
	for range 2 {
		outputDir := t.TempDir()
		pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
			Title:     "Train Travel",
			OutputDir: outputDir,
			mockSeed:  goldenMockSeed,
		})
		require.NoError(t, err)
		_, err = pp.PrintHTML()
		require.NoError(t, err)
		_, err = pp.PrintLLM()
		require.NoError(t, err)
		manifests = append(manifests, goldenManifest(t, outputDir, outputDir))
	}
	require.Equal(t, manifests[0], manifests[1], "two seeded builds must produce identical output")
}

// assertGoldenTree compares the output tree's manifest with the committed one.
// Every root in roots is replaced by a fixed mark before hashing, so temporary
// directories do not leak into the manifest.
func assertGoldenTree(t *testing.T, name, outputDir string, roots ...string) {
	t.Helper()
	assertGoldenTreeExcept(t, name, outputDir, nil, roots...)
}

// assertGoldenTreeExcept is assertGoldenTree without the files under the
// given output-relative prefixes.
func assertGoldenTreeExcept(t *testing.T, name, outputDir string, excluded []string, roots ...string) {
	t.Helper()
	if *goldenDump != "" {
		require.NoError(t, os.CopyFS(filepath.Join(*goldenDump, name), os.DirFS(outputDir)))
	}
	got := goldenManifest(t, outputDir, roots...)
	if len(excluded) > 0 {
		kept := make([]string, 0)
		for _, line := range strings.Split(strings.TrimSuffix(got, "\n"), "\n") {
			skip := false
			for _, prefix := range excluded {
				if strings.HasPrefix(line[strings.Index(line, "  ")+2:], prefix) {
					skip = true
				}
			}
			if !skip {
				kept = append(kept, line)
			}
		}
		got = strings.Join(kept, "\n") + "\n"
	}
	path := filepath.Join("fixtures", "testdata", "golden", name+".txt")
	if *updateGoldens {
		require.NoError(t, os.MkdirAll(filepath.Dir(path), 0o755))
		require.NoError(t, os.WriteFile(path, []byte(got), 0o644))
		return
	}
	want, err := os.ReadFile(path)
	require.NoError(t, err, "missing golden manifest; run go test -run TestGolden -update")
	require.Equal(t, string(want), got, "output changed; if intended, run go test -run TestGolden -update and review the diff")
}

func goldenManifest(t *testing.T, outputDir string, roots ...string) string {
	t.Helper()
	var lines []string
	err := filepath.WalkDir(outputDir, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil || entry.IsDir() {
			return walkErr
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		text := string(data)
		for _, root := range roots {
			text = strings.ReplaceAll(text, root, goldenRootMark)
		}
		// Explorer graph nodes carry libopenapi's low-level model hash, which
		// is not stable across processes. Blank it; everything else stays exact.
		text = goldenNodeHashPattern.ReplaceAllString(text, `${1}<hash>${2}`)
		if strings.HasSuffix(path, ".html") {
			text = normalizeGoldenHTML(text)
		}
		sum := sha256.Sum256([]byte(text))
		rel, err := filepath.Rel(outputDir, path)
		if err != nil {
			return err
		}
		lines = append(lines, hex.EncodeToString(sum[:])+"  "+filepath.ToSlash(rel))
		return nil
	})
	require.NoError(t, err)
	sort.Strings(lines)
	return strings.Join(lines, "\n") + "\n"
}

// normalizeGoldenHTML removes whitespace that does not change a page: runs
// of whitespace become one space, and whitespace between tags goes. From the
// docs-sites template port on, HTML is compared this way, so a template that
// lays out the same markup differently still matches.
func normalizeGoldenHTML(text string) string {
	// html/template writes + as &#43;; templ wrote it plain. Both read the same.
	text = strings.ReplaceAll(text, "&#43;", "+")
	text = goldenWhitespacePattern.ReplaceAllString(text, " ")
	return goldenBetweenTagsPattern.ReplaceAllString(text, "><")
}

var (
	goldenWhitespacePattern  = regexp.MustCompile(`\s+`)
	goldenBetweenTagsPattern = regexp.MustCompile(`>\s+<`)
)

func readGoldenSource(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	require.NoError(t, err)
	return string(data)
}

func writeGoldenFile(t *testing.T, root, rel, content string) {
	t.Helper()
	path := filepath.Join(root, filepath.FromSlash(rel))
	require.NoError(t, os.MkdirAll(filepath.Dir(path), 0o755))
	require.NoError(t, os.WriteFile(path, []byte(content), 0o644))
}

// goldenLint is a small, fixed set of lint results, so the golden fixtures
// cover the diagnostics page, violation stats and problem lists.
func goldenLint() []*drV3.RuleFunctionResult {
	return []*drV3.RuleFunctionResult{
		{Message: "operation should have a description", Path: "$.paths['/burgers'].post", RuleId: "operation-description", RuleSeverity: "warn", Rule: &drV3.Rule{Id: "operation-description", Severity: "warn"}},
		{Message: "schema is missing an example", Path: "$.components.schemas['Burger']", RuleId: "oas-schema-check", RuleSeverity: "error", Rule: &drV3.Rule{Id: "oas-schema-check", Severity: "error"}},
		{Message: "tag should have a description", Path: "$.tags[0]", RuleId: "tag-description", RuleSeverity: "info", Rule: &drV3.Rule{Id: "tag-description", Severity: "info"}},
	}
}

func TestGoldenDeveloperModeOpenAPIOutput(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	require.NoError(t, err)
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		Title:         "Burger Shop",
		OutputDir:     outputDir,
		DeveloperMode: true,
		LintResults:   goldenLint(),
		mockSeed:      goldenMockSeed,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)
	assertGoldenTree(t, "developer-burgershop", outputDir, outputDir)
}

func TestGoldenAsyncAPIOutput(t *testing.T) {
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(streetlightsAsyncAPISpec(), &PrintingPressConfig{
		OutputDir:     outputDir,
		DeveloperMode: true,
		LintResults: []*drV3.RuleFunctionResult{
			{Message: "message should define examples", Path: "$.operations.turnOn.messages[0]", RuleId: "asyncapi-message-examples", RuleSeverity: "warn", Rule: &drV3.Rule{Id: "asyncapi-message-examples", Severity: "warn"}},
		},
		mockSeed: goldenMockSeed,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)
	// AsyncAPI explorer graph data is not stable between runs yet; it is JSON
	// the templates do not produce, so this golden leaves it out.
	assertGoldenTreeExcept(t, "asyncapi-streetlights", outputDir, []string{"data/viz/"}, outputDir)
}

func TestGoldenPolymorphicOutput(t *testing.T) {
	specBytes, err := os.ReadFile("../test_specs/polymorphic-ecommerce.yaml")
	require.NoError(t, err)
	outputDir := t.TempDir()
	pp, err := CreatePrintingPressFromBytes(specBytes, &PrintingPressConfig{
		OutputDir: outputDir,
		mockSeed:  goldenMockSeed,
	})
	require.NoError(t, err)
	_, err = pp.PrintHTML()
	require.NoError(t, err)
	// Mermaid diagram data is not stable between runs yet; it is JSON the
	// templates do not produce, so this golden leaves it out.
	assertGoldenTreeExcept(t, "polymorphic-ecommerce", outputDir, []string{"data/viz/"}, outputDir)
}

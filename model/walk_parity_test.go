// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/testify/require"
	"go.yaml.in/yaml/v4"
)

const walkParityGoldenPath = "testdata/walk_parity.txt"

type walkParityCase struct {
	name          string
	specPath      string
	fileRefs      bool
	buildDocument func(*libopenapi.DocumentModel[highV3.Document]) *DrDocument
}

var walkParitySpecs = []struct {
	key      string
	path     string
	fileRefs bool
}{
	{key: "burgershop", path: "../test_specs/burgershop.openapi.yaml"},
	{key: "asana", path: "../test_specs/asana.yaml"},
	{key: "polymorphic_cms", path: "../test_specs/polymorphic-cms.yaml"},
	{key: "root", path: "../test_specs/root.yaml", fileRefs: true},
	{key: "stripe", path: "../test_specs/stripe.yaml"},
}

var walkParityBuilders = []struct {
	key    string
	sync   func(*libopenapi.DocumentModel[highV3.Document]) *DrDocument
	pooled func(*libopenapi.DocumentModel[highV3.Document]) *DrDocument
}{
	{key: "default", sync: newParityDefaultWalkDocument, pooled: newParityDefaultPooledWalkDocument},
	{key: "graph", sync: newParityGraphWalkDocument, pooled: newParityGraphPooledWalkDocument},
	{key: "deterministic", sync: newParityDeterministicWalkDocument, pooled: newParityDeterministicPooledWalkDocument},
}

// TestWalkerPooledDivergence reports whether production cached walks diverge
// from the explicit sync baseline. Cached walks are expected to converge
// because UseSchemaCache routes through the synchronous walker. Diagnostic
// only — run with DOCTOR_POOLED_DIVERGENCE=true.
func TestWalkerPooledDivergence(t *testing.T) {
	if os.Getenv("DOCTOR_POOLED_DIVERGENCE") != "true" {
		t.Skip("set DOCTOR_POOLED_DIVERGENCE=true to measure pooled walk divergence")
	}
	for _, spec := range walkParitySpecs {
		for _, builder := range walkParityBuilders {
			syncWalker := builder.sync(loadWalkTestDocument(t, spec.path, spec.fileRefs))
			pooledWalker := builder.pooled(loadWalkTestDocument(t, spec.path, spec.fileRefs))
			syncRows := collectWalkParityRows(syncWalker)
			pooledRows := collectWalkParityRows(pooledWalker)
			for category, rows := range syncRows {
				pooled := pooledRows[category]
				if len(pooled) != len(rows) {
					t.Logf("%s_%s/%s: sync=%d pooled=%d (%+d)",
						spec.key, builder.key, category, len(rows), len(pooled), len(pooled)-len(rows))
				}
			}
			syncWalker.Release()
			pooledWalker.Release()
		}
	}
}

func TestWalkerGraphSharedSchemaCacheMatchesSync(t *testing.T) {
	const paths = 32

	syncWalker := newParityWalkDocument(
		buildDirectSharedSchemaV3Document(t, paths),
		&DrConfig{
			BuildGraph:     true,
			RenderChanges:  true,
			UseSchemaCache: true,
			SyncWalk:       true,
		},
	)
	pooledWalker := NewDrDocumentWithConfig(
		buildDirectSharedSchemaV3Document(t, paths),
		&DrConfig{
			BuildGraph:     true,
			RenderChanges:  true,
			UseSchemaCache: true,
			WalkWorkers:    8,
		},
	)
	defer syncWalker.Release()
	defer pooledWalker.Release()

	syncRows := collectWalkParityRows(syncWalker)
	pooledRows := collectWalkParityRows(pooledWalker)
	for category, rows := range syncRows {
		sortedSync := append([]string(nil), rows...)
		sortedPooled := append([]string(nil), pooledRows[category]...)
		sort.Strings(sortedSync)
		sort.Strings(sortedPooled)
		if strings.Join(sortedSync, "\n") != strings.Join(sortedPooled, "\n") {
			t.Fatalf("production shared-schema cache output diverged for %s: sync=%d production=%d\n%s",
				category, len(sortedSync), len(sortedPooled), firstWalkParityMismatch(sortedSync, sortedPooled))
		}
	}
}

func buildDirectSharedSchemaV3Document(tb testing.TB, paths int) *libopenapi.DocumentModel[highV3.Document] {
	tb.Helper()

	var spec strings.Builder
	spec.Grow(256 * paths)
	spec.WriteString("openapi: 3.1.0\n")
	spec.WriteString("info:\n")
	spec.WriteString("  title: Direct Shared Schema Fixture\n")
	spec.WriteString("  version: 1.0.0\n")
	spec.WriteString("paths:\n")
	for i := 0; i < paths; i++ {
		fmt.Fprintf(&spec, "  /resource-%d:\n", i)
		spec.WriteString("    get:\n")
		spec.WriteString("      responses:\n")
		spec.WriteString("        '200':\n")
		spec.WriteString("          description: ok\n")
		spec.WriteString("          content:\n")
		spec.WriteString("            application/json:\n")
		spec.WriteString("              schema:\n")
		spec.WriteString("                $ref: '#/components/schemas/Shared'\n")
	}
	spec.WriteString("components:\n")
	spec.WriteString("  schemas:\n")
	spec.WriteString("    Shared:\n")
	spec.WriteString("      type: object\n")
	spec.WriteString("      properties:\n")
	spec.WriteString("        id:\n")
	spec.WriteString("          type: string\n")

	document, err := libopenapi.NewDocument([]byte(spec.String()))
	require.NoError(tb, err)

	model, errs := document.BuildV3Model()
	require.Empty(tb, errs)
	return model
}

// TestWalkerParityGolden pins the externally observable output of the walker:
// collected model sets and their JSON paths, graph nodes/edges, the
// line-objects registry, and lint absorption targets.
//
// PROVENANCE: testdata/walk_parity.txt pins behavior as of the 2026-06 walk
// tune-up, which switched the schema cache to always-alias hydration. The one
// accepted delta versus the pre-tune-up engine is the lineObjects category:
// cache-hit occurrences no longer register cloned child subtrees, so lines
// carry the canonical and first-walked usage entries instead of one entry per
// usage occurrence (no line that previously had objects ever resolves empty).
// Downstream effect, signed off as correct: vacuum rules that walk schema
// properties report a shared-schema problem once at its definition instead of
// once per usage site (plaid.yml: 411 repeat findings deduplicated; specs
// without reuse-heavy shared schemas are byte-identical). To compare against a
// historical engine: create a worktree at the target commit, copy this file
// in, walk the same specs, and diff GOLDEN_DUMP output per category.
//
// Only synchronous/cached production walks are pinned. Uncached pooled walks
// are outside this golden because they do not use the schema cache.
func TestWalkerParityGolden(t *testing.T) {
	var cases []walkParityCase
	for _, spec := range walkParitySpecs {
		for _, builder := range walkParityBuilders {
			cases = append(cases, walkParityCase{
				name:          spec.key + "_" + builder.key,
				specPath:      spec.path,
				fileRefs:      spec.fileRefs,
				buildDocument: builder.sync,
			})
		}
	}

	var summary []string
	fullRows := make(map[string][]string)
	for _, tc := range cases {
		docModel := loadWalkTestDocument(t, tc.specPath, tc.fileRefs)
		walker := tc.buildDocument(docModel)
		if walker == nil {
			t.Fatalf("%s: expected walker", tc.name)
		}
		caseRows := collectWalkParityRows(walker)
		for category, rows := range caseRows {
			sort.Strings(rows)
			key := tc.name + "/" + category
			fullRows[key] = rows
			summary = append(summary, walkParitySummaryLine(tc.name, category, rows))
		}
		walker.Release()
	}
	sort.Strings(summary)
	actual := strings.Join(summary, "\n") + "\n"

	if dumpDir := os.Getenv("GOLDEN_DUMP"); dumpDir != "" {
		dumpWalkParityRows(t, dumpDir, fullRows)
	}

	if os.Getenv("GOLDEN_REGENERATE") == "true" {
		if err := os.MkdirAll(filepath.Dir(walkParityGoldenPath), 0o755); err != nil {
			t.Fatalf("create parity testdata dir: %v", err)
		}
		if err := os.WriteFile(walkParityGoldenPath, []byte(actual), 0o644); err != nil {
			t.Fatalf("write parity golden: %v", err)
		}
		return
	}

	expected, err := os.ReadFile(walkParityGoldenPath)
	if err != nil {
		t.Fatalf("read parity golden: %v; set GOLDEN_REGENERATE=true to create it", err)
	}
	// Git checkout can normalize text files to CRLF on Windows. The generated
	// summary is intentionally LF-only, so compare content with canonical line endings.
	expectedText := strings.ReplaceAll(string(expected), "\r\n", "\n")
	expectedText = strings.ReplaceAll(expectedText, "\r", "\n")
	if expectedText != actual {
		t.Fatalf("walk parity changed; set GOLDEN_DUMP=<dir> to inspect rows and GOLDEN_REGENERATE=true to accept intentional changes")
	}
}

func newParityDefaultWalkDocument(document *libopenapi.DocumentModel[highV3.Document]) *DrDocument {
	return newParityWalkDocument(document, &DrConfig{UseSchemaCache: true})
}

func newParityGraphWalkDocument(document *libopenapi.DocumentModel[highV3.Document]) *DrDocument {
	return newParityWalkDocument(document, &DrConfig{
		BuildGraph:     true,
		RenderChanges:  true,
		UseSchemaCache: true,
	})
}

func newParityDeterministicWalkDocument(document *libopenapi.DocumentModel[highV3.Document]) *DrDocument {
	return newParityWalkDocument(document, &DrConfig{
		UseSchemaCache:     true,
		DeterministicPaths: true,
	})
}

func newParityDefaultPooledWalkDocument(document *libopenapi.DocumentModel[highV3.Document]) *DrDocument {
	return newParityPooledWalkDocument(document, &DrConfig{UseSchemaCache: true})
}

func newParityGraphPooledWalkDocument(document *libopenapi.DocumentModel[highV3.Document]) *DrDocument {
	return newParityPooledWalkDocument(document, &DrConfig{
		BuildGraph:     true,
		RenderChanges:  true,
		UseSchemaCache: true,
	})
}

func newParityDeterministicPooledWalkDocument(document *libopenapi.DocumentModel[highV3.Document]) *DrDocument {
	return newParityPooledWalkDocument(document, &DrConfig{
		UseSchemaCache:     true,
		DeterministicPaths: true,
	})
}

func newParityWalkDocument(document *libopenapi.DocumentModel[highV3.Document], config *DrConfig) *DrDocument {
	if document == nil {
		return nil
	}
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3WithConfigAndOptions(&document.Model, config, walkOptions{SyncWalk: true})
	return doc
}

// newParityPooledWalkDocument exercises the production config path — the same
// path NewDrDocumentWithConfig takes. Cached configs route synchronously.
func newParityPooledWalkDocument(document *libopenapi.DocumentModel[highV3.Document], config *DrConfig) *DrDocument {
	if document == nil {
		return nil
	}
	doc := &DrDocument{
		index: document.Index,
	}
	doc.walkV3WithConfig(&document.Model, config)
	return doc
}

func loadWalkTestDocument(tb testing.TB, specPath string, fileRefs bool) *libopenapi.DocumentModel[highV3.Document] {
	tb.Helper()

	specBytes, err := os.ReadFile(specPath)
	if err != nil {
		tb.Fatalf("read %s: %v", specPath, err)
	}

	config := datamodel.NewDocumentConfiguration()
	config.SkipCircularReferenceCheck = true
	if fileRefs {
		config.BasePath = filepath.Dir(specPath)
		config.AllowFileReferences = true
	}

	doc, err := libopenapi.NewDocumentWithConfiguration(specBytes, config)
	if err != nil {
		tb.Fatalf("parse %s: %v", specPath, err)
	}

	model, buildErrs := doc.BuildV3Model()
	if buildErrs != nil {
		tb.Fatalf("build v3 model for %s: %v", specPath, buildErrs)
	}
	return model
}

func collectWalkParityRows(walker *DrDocument) map[string][]string {
	rows := map[string][]string{
		"schemas":      walkParityFoundationalRows(walker.Schemas),
		"skipped":      walkParityFoundationalRows(walker.SkippedSchemas),
		"parameters":   walkParityFoundationalRows(walker.Parameters),
		"headers":      walkParityFoundationalRows(walker.Headers),
		"mediaTypes":   walkParityFoundationalRows(walker.MediaTypes),
		"nodes":        walkParityNodeRows(walker.Nodes),
		"edges":        walkParityEdgeRows(walker.Edges),
		"lineObjects":  walkParityLineObjectRows(walker),
		"lintAbsorbed": walkParityLintAbsorptionRows(walker),
	}
	return rows
}

func walkParityFoundationalRows[T drV3.Foundational](items []T) []string {
	rows := make([]string, 0, len(items))
	for _, item := range items {
		var foundational drV3.Foundational = item
		if foundational == nil {
			continue
		}
		rows = append(rows, walkParityFoundationalRow(foundational))
	}
	return rows
}

func walkParityFoundationalRow(item drV3.Foundational) string {
	return strings.Join([]string{
		item.GenerateJSONPath(),
		fmt.Sprintf("%T", item),
		nodePosition(item.GetKeyNode()),
		nodePosition(item.GetValueNode()),
		item.GetKeyValue(),
	}, "\x1f")
}

func firstWalkParityMismatch(left, right []string) string {
	limit := min(len(left), len(right))
	for i := 0; i < limit; i++ {
		if left[i] != right[i] {
			return fmt.Sprintf(
				"first mismatch at row %d:\nsync:   %s\npooled: %s\nsync only:   %s\npooled only: %s",
				i, left[i], right[i], firstOnlyWalkParityRow(left, right), firstOnlyWalkParityRow(right, left),
			)
		}
	}
	if len(left) != len(right) {
		return fmt.Sprintf(
			"row count mismatch after %d shared rows\nsync only:   %s\npooled only: %s",
			limit, firstOnlyWalkParityRow(left, right), firstOnlyWalkParityRow(right, left),
		)
	}
	return "rows differ"
}

func firstOnlyWalkParityRow(left, right []string) string {
	rightRows := make(map[string]struct{}, len(right))
	for _, row := range right {
		rightRows[row] = struct{}{}
	}
	for _, row := range left {
		if _, ok := rightRows[row]; !ok {
			return row
		}
	}
	return "<none>"
}

func walkParityNodeRows(nodes []*drV3.Node) []string {
	rows := make([]string, 0, len(nodes))
	for _, node := range nodes {
		if node == nil {
			continue
		}
		children := make([]string, 0, len(node.Children))
		for _, child := range node.Children {
			if child != nil {
				children = append(children, child.Id)
			}
		}
		sort.Strings(children)
		rows = append(rows, strings.Join([]string{
			node.Id,
			node.IdHash,
			node.ParentId,
			node.Type,
			node.Label,
			strconv.Itoa(node.KeyLine) + ":" + strconv.Itoa(node.ValueLine),
			strconv.Itoa(node.Width) + ":" + strconv.Itoa(node.Height),
			strings.Join(children, ","),
		}, "\x1f"))
	}
	return rows
}

func walkParityEdgeRows(edges []*drV3.Edge) []string {
	rows := make([]string, 0, len(edges))
	for _, edge := range edges {
		if edge == nil {
			continue
		}
		sources := append([]string(nil), edge.Sources...)
		targets := append([]string(nil), edge.Targets...)
		sort.Strings(sources)
		sort.Strings(targets)
		rows = append(rows, strings.Join([]string{
			edge.Id,
			strings.Join(sources, ","),
			strings.Join(targets, ","),
			edge.Ref,
			edge.Poly,
		}, "\x1f"))
	}
	return rows
}

func walkParityLineObjectRows(walker *DrDocument) []string {
	rows := make([]string, 0, len(walker.lineObjects))
	for line, objects := range walker.lineObjects {
		for _, object := range objects {
			foundational, ok := object.(drV3.Foundational)
			if !ok || foundational == nil {
				continue
			}
			rows = append(rows, strings.Join([]string{
				strconv.Itoa(line),
				foundational.GenerateJSONPath(),
				fmt.Sprintf("%T", foundational),
			}, "\x1f"))
		}
	}
	return rows
}

func walkParityLintAbsorptionRows(walker *DrDocument) []string {
	candidates := walkParityLintCandidates(walker, 3)
	results := make([]*drV3.RuleFunctionResult, 0, len(candidates))
	for i, candidate := range candidates {
		results = append(results, &drV3.RuleFunctionResult{
			RuleId:       fmt.Sprintf("walk-parity-%02d", i),
			RuleSeverity: "warn",
			Path:         candidate.path,
			Origin:       candidate.origin,
		})
	}
	orphans := walker.AbsorbLintResults(results, nil)

	rows := []string{"orphans\x1f" + strconv.Itoa(len(orphans))}
	if walker.V3Document == nil {
		return rows
	}
	for _, result := range walker.V3Document.GetRuleFunctionResults() {
		if result == nil || !strings.HasPrefix(result.RuleId, "walk-parity-") {
			continue
		}
		targetPath := ""
		if target, ok := result.ParentObject.(drV3.Foundational); ok && target != nil {
			targetPath = target.GenerateJSONPath()
		}
		rows = append(rows, strings.Join([]string{
			result.RuleId,
			result.Path,
			targetPath,
		}, "\x1f"))
	}
	return rows
}

type walkParityLintCandidate struct {
	path     string
	typeName string
	origin   *index.NodeOrigin
}

func walkParityLintCandidates(walker *DrDocument, limit int) []walkParityLintCandidate {
	if walker == nil || limit <= 0 {
		return nil
	}
	byPath := make(map[string]walkParityLintCandidate)
	for _, objects := range walker.lineObjects {
		for _, object := range objects {
			foundational, ok := object.(drV3.Foundational)
			if !ok || foundational == nil {
				continue
			}
			path := strings.TrimSpace(foundational.GenerateJSONPath())
			if path == "" {
				continue
			}
			candidate := walkParityLintCandidate{
				path:     path,
				typeName: fmt.Sprintf("%T", foundational),
				origin:   nodeOriginForFoundational(foundational),
			}
			existing, exists := byPath[path]
			if exists && !walkParityLintCandidateLess(candidate, existing) {
				continue
			}
			byPath[path] = candidate
		}
	}
	candidates := make([]walkParityLintCandidate, 0, len(byPath))
	for _, candidate := range byPath {
		candidates = append(candidates, candidate)
	}
	sort.Slice(candidates, func(i, j int) bool {
		return walkParityLintCandidateLess(candidates[i], candidates[j])
	})
	if len(candidates) > limit {
		candidates = candidates[:limit]
	}
	return candidates
}

func walkParityLintCandidateLess(left, right walkParityLintCandidate) bool {
	if left.path != right.path {
		return left.path < right.path
	}
	leftLine, leftColumn := originPosition(left.origin)
	rightLine, rightColumn := originPosition(right.origin)
	if leftLine != rightLine {
		return leftLine < rightLine
	}
	if leftColumn != rightColumn {
		return leftColumn < rightColumn
	}
	return left.typeName < right.typeName
}

func originPosition(origin *index.NodeOrigin) (int, int) {
	if origin == nil {
		return 0, 0
	}
	return origin.Line, origin.Column
}

func nodeOriginForFoundational(item drV3.Foundational) *index.NodeOrigin {
	node := item.GetKeyNode()
	if node == nil {
		node = item.GetValueNode()
	}
	if node == nil {
		return nil
	}
	return &index.NodeOrigin{
		Line:   node.Line,
		Column: node.Column,
	}
}

func nodePosition(node *yaml.Node) string {
	if node == nil {
		return "0:0"
	}
	return strconv.Itoa(node.Line) + ":" + strconv.Itoa(node.Column)
}

func walkParitySummaryLine(caseName, category string, rows []string) string {
	hash := sha256.Sum256([]byte(strings.Join(rows, "\n")))
	return strings.Join([]string{
		caseName,
		category,
		strconv.Itoa(len(rows)),
		hex.EncodeToString(hash[:]),
	}, "\t")
}

func dumpWalkParityRows(tb testing.TB, dumpDir string, rows map[string][]string) {
	tb.Helper()
	if err := os.MkdirAll(dumpDir, 0o755); err != nil {
		tb.Fatalf("create golden dump dir: %v", err)
	}
	for key, values := range rows {
		name := strings.NewReplacer("/", "__", " ", "_").Replace(key) + ".txt"
		data := strings.Join(values, "\n") + "\n"
		if err := os.WriteFile(filepath.Join(dumpDir, name), []byte(data), 0o644); err != nil {
			tb.Fatalf("write golden dump %s: %v", name, err)
		}
	}
}

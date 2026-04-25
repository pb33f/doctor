package model

import (
	"fmt"
	"strings"
	"testing"
	"time"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestProcessObject_DedupesLineObjectsByJSONPath(t *testing.T) {
	docModel := buildCompositionHeavyV3Document(t, 4, 3, 2)
	walker := NewDrDocument(docModel)
	require.NotNil(t, walker)

	base := walker.V3Document.Components.Schemas.GetOrZero("Base0")
	require.NotNil(t, base)
	require.NotNil(t, base.Schema)

	field := base.Schema.Properties.GetOrZero("field0")
	require.NotNil(t, field)

	deduped := &DrDocument{}
	deduped.processObject(field, nil)
	firstLines := countLineObjects(deduped)
	require.Greater(t, firstLines, 0)
	deduped.processObject(field, nil)

	assert.Equal(t, firstLines, countLineObjects(deduped))
	for line, objects := range deduped.lineObjects {
		if ptrs, ok := deduped.lineObjectPtrs[line]; ok {
			assert.LessOrEqual(t, len(ptrs), len(objects))
		}
	}
}

func TestWalker_CompositionHeavyRefsCompletes(t *testing.T) {
	docModel := buildCompositionHeavyV3Document(t, 96, 32, 96)

	walker := requireWalkCompletes(t, 10*time.Second, func() *DrDocument {
		return NewDrDocument(docModel)
	})

	require.NotNil(t, walker)
	require.NotEmpty(t, walker.Schemas)
	require.NotEmpty(t, walker.lineObjects)

	base := walker.V3Document.Components.Schemas.GetOrZero("Base0")
	require.NotNil(t, base)
	require.NotNil(t, base.Schema)

	field := base.Schema.Properties.GetOrZero("field0")
	require.NotNil(t, field)

	models, err := walker.LocateModelsByKeyAndValue(field.KeyNode, field.ValueNode)
	require.NoError(t, err)
	assert.Greater(t, len(models), 1, "expected reused schema field to remain discoverable through multiple reference paths")
}

func TestWalker_CompositionHeavyRefsCompletesWithGraph(t *testing.T) {
	docModel := buildCompositionHeavyV3Document(t, 96, 32, 96)

	walker := requireWalkCompletes(t, 10*time.Second, func() *DrDocument {
		return NewDrDocumentAndGraph(docModel)
	})

	require.NotNil(t, walker)
	require.NotEmpty(t, walker.Nodes)
	require.NotEmpty(t, walker.Edges)

	var refEdges int
	for _, edge := range walker.Edges {
		if edge != nil && edge.Ref != "" {
			refEdges++
		}
	}
	assert.Greater(t, refEdges, 0, "expected graph walk to preserve reference edges for reused schemas")
}

func TestWalker_SchemaCachePreservesReferenceUsagePaths(t *testing.T) {
	docModel := buildSchemaCacheUsagePathDocument(t)

	for _, tc := range []struct {
		name   string
		config *DrConfig
	}{
		{
			name:   "model",
			config: &DrConfig{UseSchemaCache: true},
		},
		{
			name: "render changes",
			config: &DrConfig{
				BuildGraph:     true,
				RenderChanges:  true,
				UseSchemaCache: true,
			},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			noCacheConfig := *tc.config
			noCacheConfig.UseSchemaCache = false
			noCache := NewDrDocumentWithConfig(docModel, &noCacheConfig)
			require.NotNil(t, noCache)

			withCache := NewDrDocumentWithConfig(docModel, tc.config)
			require.NotNil(t, withCache)

			for _, path := range []string{"/one", "/two"} {
				assert.Equal(t,
					nestedResponseFieldPath(t, noCache, path),
					nestedResponseFieldPath(t, withCache, path),
					"schema cache should preserve usage-site JSONPath for %s", path)
			}
		})
	}
}

func BenchmarkWalker_CompositionHeavyRefs(b *testing.B) {
	docModel := buildCompositionHeavyV3Document(b, 144, 32, 144)
	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		walker := NewDrDocument(docModel)
		if len(walker.Schemas) == 0 {
			b.Fatal("expected schemas")
		}
		walker.Release()
	}
}

func BenchmarkWalker_CompositionHeavyRefsWithGraph(b *testing.B) {
	docModel := buildCompositionHeavyV3Document(b, 144, 32, 144)
	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		walker := NewDrDocumentAndGraph(docModel)
		if len(walker.Nodes) == 0 || len(walker.Edges) == 0 {
			b.Fatal("expected graph nodes and edges")
		}
		walker.Release()
	}
}

func requireWalkCompletes(t *testing.T, timeout time.Duration, walk func() *DrDocument) *DrDocument {
	t.Helper()

	done := make(chan *DrDocument, 1)
	go func() {
		done <- walk()
	}()

	select {
	case walker := <-done:
		return walker
	case <-time.After(timeout):
		t.Fatalf("walker did not complete within %s", timeout)
		return nil
	}
}

func buildCompositionHeavyV3Document(tb testing.TB, composites, variants, paths int) *libopenapi.DocumentModel[v3.Document] {
	tb.Helper()

	var spec strings.Builder
	spec.Grow(256 * (composites + variants + paths))
	spec.WriteString("openapi: 3.1.0\n")
	spec.WriteString("info:\n")
	spec.WriteString("  title: Composition Heavy Fixture\n")
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
		fmt.Fprintf(&spec, "                $ref: '#/components/schemas/Composite%d'\n", i%composites)
	}

	spec.WriteString("components:\n")
	spec.WriteString("  schemas:\n")
	for i := 0; i < variants; i++ {
		fmt.Fprintf(&spec, "    Base%d:\n", i)
		spec.WriteString("      type: object\n")
		spec.WriteString("      properties:\n")
		fmt.Fprintf(&spec, "        field%d:\n", i)
		spec.WriteString("          type: string\n")
	}

	for i := 0; i < composites; i++ {
		fmt.Fprintf(&spec, "    Composite%d:\n", i)
		spec.WriteString("      oneOf:\n")
		for j := 0; j < variants; j++ {
			fmt.Fprintf(&spec, "        - $ref: '#/components/schemas/Base%d'\n", j)
		}
	}

	document, err := libopenapi.NewDocument([]byte(spec.String()))
	require.NoError(tb, err)

	model, errs := document.BuildV3Model()
	require.Empty(tb, errs)
	return model
}

func buildSchemaCacheUsagePathDocument(tb testing.TB) *libopenapi.DocumentModel[v3.Document] {
	tb.Helper()

	const spec = `openapi: 3.1.0
info:
  title: Schema Cache Usage Path Fixture
  version: 1.0.0
paths:
  /one:
    get:
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Wrapper'
  /two:
    get:
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Wrapper'
components:
  schemas:
    Leaf:
      type: object
      properties:
        field:
          type: string
    Wrapper:
      type: object
      properties:
        leaf:
          $ref: '#/components/schemas/Leaf'
`

	document, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(tb, err)

	model, errs := document.BuildV3Model()
	require.Empty(tb, errs)
	return model
}

func nestedResponseFieldPath(t *testing.T, walker *DrDocument, path string) string {
	t.Helper()

	pathItem := walker.V3Document.Paths.PathItems.GetOrZero(path)
	require.NotNil(t, pathItem)
	require.NotNil(t, pathItem.Get)

	response := pathItem.Get.Responses.Codes.GetOrZero("200")
	require.NotNil(t, response)

	mediaType := response.Content.GetOrZero("application/json")
	require.NotNil(t, mediaType)
	require.NotNil(t, mediaType.SchemaProxy)
	require.NotNil(t, mediaType.SchemaProxy.Schema)

	leaf := mediaType.SchemaProxy.Schema.Properties.GetOrZero("leaf")
	require.NotNil(t, leaf)
	require.NotNil(t, leaf.Schema)

	field := leaf.Schema.Properties.GetOrZero("field")
	require.NotNil(t, field)
	require.NotNil(t, field.Schema)

	return field.Schema.GenerateJSONPath()
}

func countLineObjects(walker *DrDocument) int {
	var total int
	for _, objects := range walker.lineObjects {
		total += len(objects)
	}
	return total
}

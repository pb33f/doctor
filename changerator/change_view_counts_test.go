// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"os"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func changeViewRootCounts(t *testing.T, left, right []byte) (total, breaking int) {
	t.Helper()
	build := func(source []byte) *model.DrDocument {
		doc, err := libopenapi.NewDocument(source)
		require.NoError(t, err)
		high, err := doc.BuildV3Model()
		require.NoError(t, err)
		return model.NewDrDocumentAndGraph(high)
	}
	leftDoc, rightDoc := build(left), build(right)
	c := NewChangerator(&ChangeratorConfig{LeftDrDoc: leftDoc.V3Document, RightDrDoc: rightDoc.V3Document, Doctor: rightDoc})
	require.NotNil(t, c.Changerate())

	root := rightDoc.V3Document.Node
	c.BuildNodeChangeTree(root)
	c.PrepareChangeViewGraph(root)
	require.NotNil(t, root.SubtreeChanges)
	return root.SubtreeChanges.Total, root.SubtreeChanges.Breaking
}

// A removal has no new position or values, so its identity must include where it
// was. Otherwise every removed operation with one method looks like the same change.
func TestChangeViewKeepsRemovedOperationsOnEachPath(t *testing.T) {
	left := []byte(`openapi: 3.1.0
info:
  title: removals
  version: 1.0.0
paths:
  /one:
    post:
      responses:
        "200":
          description: ok
    get:
      responses:
        "200":
          description: ok
  /two:
    post:
      responses:
        "200":
          description: ok
    get:
      responses:
        "200":
          description: ok
`)
	right := []byte(`openapi: 3.1.0
info:
  title: removals
  version: 1.0.0
paths:
  /one:
    get:
      responses:
        "200":
          description: ok
  /two:
    get:
      responses:
        "200":
          description: ok
`)
	total, breaking := changeViewRootCounts(t, left, right)
	assert.Equal(t, 2, total)
	assert.Equal(t, 2, breaking)
}

// A change to a shared component must still count once from every reference to it.
func TestChangeViewCollapsesRepeatsThroughSharedReference(t *testing.T) {
	spec := `openapi: 3.1.0
info:
  title: shared
  version: 1.0.0
paths:
  /one:
    get:
      responses:
        "200":
          description: ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shared'
  /two:
    get:
      responses:
        "200":
          description: ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shared'
components:
  schemas:
    Shared:
      type: object
      description: before
`
	right := []byte(strings.Replace(spec, "description: before", "description: after", 1))
	total, _ := changeViewRootCounts(t, []byte(spec), right)
	assert.Equal(t, 1, total)
}

// Primitive schemas have no graph node, so their changes must reach the nearest
// node that does. Otherwise the graph silently reports nothing for them.
func TestChangeViewCountsChangesWithoutTheirOwnNode(t *testing.T) {
	header := func(indent string) string {
		return indent + "schema:\n" + indent + "  type: string\n" + indent + "  enum: [a, b]\n"
	}
	head := "openapi: 3.1.0\ninfo:\n  title: t\n  version: 1.0.0\npaths:\n  /a:\n"
	ok := "      responses:\n        \"200\":\n          description: ok\n"
	for name, spec := range map[string]string{
		"inline header": head + "    get:\n      responses:\n        \"200\":\n          description: ok\n          headers:\n            X-H:\n" + header("              "),
		"referenced header": head + "    get:\n      responses:\n        \"200\":\n          description: ok\n          headers:\n            X-H:\n              $ref: '#/components/headers/H'\n" +
			"components:\n  headers:\n    H:\n" + header("      "),
		"header referenced twice": head + "    get:\n      responses:\n        \"200\":\n          description: ok\n          headers:\n            X-H:\n              $ref: '#/components/headers/H'\n            X-I:\n              $ref: '#/components/headers/H'\n" +
			"components:\n  headers:\n    H:\n" + header("      "),
		"referenced parameter": head + "    get:\n      parameters:\n        - $ref: '#/components/parameters/P'\n" + ok +
			"components:\n  parameters:\n    P:\n      name: k\n      in: query\n" + header("      "),
		"referenced response": head + "    get:\n      responses:\n        \"200\":\n          $ref: '#/components/responses/R'\n" +
			"components:\n  responses:\n    R:\n      description: ok\n      content:\n        application/json:\n" + header("          "),
		"referenced request body": head + "    post:\n      requestBody:\n        $ref: '#/components/requestBodies/B'\n" + ok +
			"components:\n  requestBodies:\n    B:\n      content:\n        application/json:\n" + header("          "),
	} {
		t.Run(name, func(t *testing.T) {
			total, _ := changeViewRootCounts(t, []byte(spec), []byte(strings.Replace(spec, "[a, b]", "[a, b, c]", 1)))
			assert.Equal(t, 1, total)
		})
	}
}

// An inline object replaced by a shared reference has one new position and one
// original position per usage, but it is a single edit. The second change is the
// addition of components.
func TestChangeViewCollapsesInlineObjectsMovedToOneReference(t *testing.T) {
	left := []byte(`openapi: 3.1.0
info:
  title: moved
  version: 1.0.0
paths:
  /one:
    get:
      responses:
        "200":
          description: before
  /two:
    get:
      responses:
        "200":
          description: before
`)
	right := []byte(`openapi: 3.1.0
info:
  title: moved
  version: 1.0.0
paths:
  /one:
    get:
      responses:
        "200":
          $ref: '#/components/responses/Shared'
  /two:
    get:
      responses:
        "200":
          $ref: '#/components/responses/Shared'
components:
  responses:
    Shared:
      description: after
`)
	total, _ := changeViewRootCounts(t, left, right)
	assert.Equal(t, 2, total)
}

func TestChangeHashKeepsSamePositionInDifferentFilesApart(t *testing.T) {
	line, column := 5, 7
	change := func(document string) *whatChangedModel.Change {
		return &whatChangedModel.Change{Property: "post", ChangeType: whatChangedModel.ObjectRemoved,
			Context: &whatChangedModel.ChangeContext{DocumentLocation: document, OriginalLine: &line, OriginalColumn: &column}}
	}
	assert.NotEqual(t, generateChangeHash(change("one.yaml")), generateChangeHash(change("two.yaml")))
	assert.Equal(t, generateChangeHash(change("one.yaml")), generateChangeHash(change("one.yaml")))
}

func changedNodeIds(root *v3.Node) []string {
	var ids []string
	seen := make(map[*v3.Node]bool)
	var walk func(node *v3.Node)
	walk = func(node *v3.Node) {
		if node == nil || seen[node] {
			return
		}
		seen[node] = true
		if len(node.GetChanges()) > 0 {
			ids = append(ids, node.Id)
		}
		for _, child := range node.Children {
			walk(child)
		}
	}
	walk(root)
	return ids
}

// A change inside a shared component belongs to that component, not to whichever
// usage reached it first.
func TestNodeLessChangesStayOnTheirComponent(t *testing.T) {
	spec := `openapi: 3.1.0
info:
  title: shared
  version: 1.0.0
paths:
  /one:
    get:
      responses:
        "200":
          description: ok
          headers:
            X-H:
              $ref: '#/components/headers/H'
  /two:
    get:
      responses:
        "200":
          description: ok
          headers:
            X-H:
              $ref: '#/components/headers/H'
components:
  headers:
    H:
      schema:
        type: string
        enum: [a, b]
`
	build := func(source string) *model.DrDocument {
		doc, err := libopenapi.NewDocument([]byte(source))
		require.NoError(t, err)
		high, err := doc.BuildV3Model()
		require.NoError(t, err)
		return model.NewDrDocumentAndGraph(high)
	}
	left, right := build(spec), build(strings.Replace(spec, "[a, b]", "[a, b, c]", 1))
	c := NewChangerator(&ChangeratorConfig{LeftDrDoc: left.V3Document, RightDrDoc: right.V3Document, Doctor: right})
	require.NotNil(t, c.Changerate())

	assert.Equal(t, []string{"$.components.headers['H']"}, changedNodeIds(right.V3Document.Node))
}

func TestChangesInsideReferencedPathItemStayOffPaths(t *testing.T) {
	spec := `openapi: 3.1.0
info:
  title: shared
  version: 1.0.0
paths:
  /a:
    $ref: '#/components/pathItems/A'
components:
  pathItems:
    A:
      get:
        description: before
        responses:
          "200":
            description: ok
`
	build := func(source string) *model.DrDocument {
		doc, err := libopenapi.NewDocument([]byte(source))
		require.NoError(t, err)
		high, err := doc.BuildV3Model()
		require.NoError(t, err)
		return model.NewDrDocumentAndGraph(high)
	}
	left, right := build(spec), build(strings.Replace(spec, "description: before", "description: after", 1))
	c := NewChangerator(&ChangeratorConfig{LeftDrDoc: left.V3Document, RightDrDoc: right.V3Document, Doctor: right})
	require.NotNil(t, c.Changerate())

	assert.NotContains(t, changedNodeIds(right.V3Document.Node), "$.paths")
}

// Some change types have no visitor, so nothing places them on a node. They must
// still reach the graph, or it reports fewer changes than the report beside it.
func TestChangeViewCountsChangesNoVisitorPlaces(t *testing.T) {
	spec := `openapi: 3.1.0
info:
  title: unplaced
  version: 1.0.0
tags:
  - name: pets
    externalDocs:
      url: https://example.com/before
paths:
  /a:
    get:
      security:
        - key: []
      responses:
        "200":
          description: ok
components:
  schemas:
    Pet:
      type: object
      xml:
        name: before
`
	for name, edit := range map[string][2]string{
		"schema xml":         {"name: before", "name: after"},
		"tag external docs":  {"https://example.com/before", "https://example.com/after"},
		"operation security": {"        - key: []\n", "        - other: []\n"},
	} {
		t.Run(name, func(t *testing.T) {
			total, _ := changeViewRootCounts(t, []byte(spec), []byte(strings.Replace(spec, edit[0], edit[1], 1)))
			assert.Positive(t, total)
		})
	}
}

func TestChangeViewPetstoreCountsMatchReports(t *testing.T) {
	left, err := os.ReadFile("../test_specs/petstorev3-original.json")
	require.NoError(t, err)
	right, err := os.ReadFile("../test_specs/petstorev3-openapi-changes.json")
	require.NoError(t, err)

	total, breaking := changeViewRootCounts(t, left, right)
	assert.Equal(t, 45, total)
	assert.Equal(t, 19, breaking)
}

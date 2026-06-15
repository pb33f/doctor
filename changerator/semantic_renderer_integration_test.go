// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"testing"

	"github.com/pb33f/doctor/changerator/renderer"
	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func renderSemanticTreeForTest(t *testing.T, leftSpec, rightSpec string) string {
	t.Helper()

	leftDoc, err := libopenapi.NewDocument([]byte(leftSpec))
	require.NoError(t, err)
	rightDoc, err := libopenapi.NewDocument([]byte(rightSpec))
	require.NoError(t, err)

	leftModel, err := leftDoc.BuildV3Model()
	require.NoError(t, err)
	rightModel, err := rightDoc.BuildV3Model()
	require.NoError(t, err)

	leftDr := model.NewDrDocumentAndGraph(leftModel)
	rightDr := model.NewDrDocumentAndGraph(rightModel)
	t.Cleanup(func() {
		leftDr.Release()
		rightDr.Release()
	})

	cr := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDr.V3Document,
		RightDrDoc: rightDr.V3Document,
		Doctor:     rightDr,
	})
	docChanges := cr.Changerate()
	require.NotNil(t, docChanges)

	root := rightDr.V3Document.Node
	cr.BuildNodeChangeTree(root)

	return renderer.NewSemanticTreeRenderer(root, docChanges.GetAllChanges(), &renderer.TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: false,
		ShowStatistics:  true,
	}).Render()
}

func TestSemanticTreeRenderer_PreservesCollectionFidelityAndParameterOwnership(t *testing.T) {
	left := `openapi: 3.0.3
info:
  title: Test API
  version: "1.0"
paths:
  /user/login:
    get:
      parameters:
        - name: username
          in: query
          required: false
          schema:
            type: string
        - name: password
          in: query
          required: false
          schema:
            type: string
      responses:
        "200":
          description: ok
components:
  schemas:
    Pet:
      type: object
      required:
        - photoUrls
      properties:
        name:
          type: string
        status:
          type: string
`
	right := `openapi: 3.0.3
info:
  title: Test API
  version: "1.0"
paths:
  /user/login:
    get:
      parameters:
        - name: username
          in: query
          required: false
          schema:
            type: integer
        - name: password
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: ok
components:
  schemas:
    Pet:
      type: object
      properties:
        jazz:
          type: string
        status:
          type: string
`

	output := renderSemanticTreeForTest(t, left, right)

	assert.Contains(t, output, "[M] properties: name -> jazz")
	assert.Contains(t, output, "password")
	assert.Contains(t, output, "[M] required: false -> true {X}")
	assert.Contains(t, output, "username")
	assert.Contains(t, output, "[M] type: string -> integer {X}")
}

func TestSemanticTreeRenderer_RendersRemovedRequiredMemberName(t *testing.T) {
	left := `openapi: 3.0.3
info:
  title: Test API
  version: "1.0"
paths: {}
components:
  schemas:
    ReminderRequest:
      type: object
      required:
        - result
      properties:
        result:
          type: string
`
	right := `openapi: 3.0.3
info:
  title: Test API
  version: "1.0"
paths: {}
components:
  schemas:
    ReminderRequest:
      type: object
      properties:
        result:
          type: string
`

	output := renderSemanticTreeForTest(t, left, right)

	assert.Contains(t, output, "required/result")
}

func TestSemanticTreeRenderer_RendersRemovedMediaTypeExample(t *testing.T) {
	left := `openapi: 3.0.3
info:
  title: Test API
  version: "1.0"
paths:
  /burgers:
    get:
      responses:
        "200":
          description: ok
          content:
            application/json:
              schema:
                type: object
              examples:
                foo:
                  value:
                    name: burger
`
	right := `openapi: 3.0.3
info:
  title: Test API
  version: "1.0"
paths:
  /burgers:
    get:
      responses:
        "200":
          description: ok
          content:
            application/json:
              schema:
                type: object
`

	output := renderSemanticTreeForTest(t, left, right)

	assert.Contains(t, output, "application/json")
	assert.Contains(t, output, "example")
}

// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"strings"
	"testing"

	"github.com/pb33f/doctor/changerator/renderer"
	"github.com/pb33f/doctor/model"
	"github.com/pb33f/doctor/terminal"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestTardis_SchemaTreeDoesNotDuplicateChildPropertyChanges(t *testing.T) {
	left := `openapi: 3.1.0
info:
  title: test
  version: 1.0.0
paths: {}
components:
  schemas:
    User:
      type: object
      properties:
        email:
          type: string
          example: old@example.com
        password:
          type: string
          example: secret
    Pet:
      type: object
      properties:
        status:
          type: string
`

	right := `openapi: 3.1.0
info:
  title: test
  version: 1.0.0
paths: {}
components:
  schemas:
    User:
      type: object
      properties:
        email:
          type: string
          example: new@example.com
        password:
          type: string
          example: newer-secret
    Pet:
      type: object
      properties:
        status:
          type: string
          enum:
            - available
`

	leftDoc, err := libopenapi.NewDocument([]byte(left))
	require.NoError(t, err)
	leftModel, errs := leftDoc.BuildV3Model()
	require.Empty(t, errs)
	leftDrDoc := model.NewDrDocumentAndGraph(leftModel)

	rightDoc, err := libopenapi.NewDocument([]byte(right))
	require.NoError(t, err)
	rightModel, errs := rightDoc.BuildV3Model()
	require.Empty(t, errs)
	rightDrDoc := model.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDrDoc.V3Document,
		RightDrDoc: rightDrDoc.V3Document,
		Doctor:     rightDrDoc,
	})

	docChanges := cd.Changerate()
	require.NotNil(t, docChanges)
	cd.BuildNodeChangeTree(rightDrDoc.V3Document.Node)

	tree := renderer.NewTreeRenderer(rightDrDoc.V3Document.Node, &renderer.TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: false,
		ShowStatistics:  false,
		ColorScheme:     terminal.NoColorScheme{},
	}).Render()

	assert.Equal(t, 2, strings.Count(tree, "[M] example"))
	assert.Equal(t, 1, strings.Count(tree, "[+] enum"))
	assert.NotContains(t, tree, "User\n  ├──[M] example")
	assert.NotContains(t, tree, "Pet\n  ├──[+] enum")
	assert.Contains(t, tree, "email")
	assert.Contains(t, tree, "password")
	assert.Contains(t, tree, "status")
}

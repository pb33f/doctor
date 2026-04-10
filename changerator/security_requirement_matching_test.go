package changerator

import (
	"testing"

	drModel "github.com/pb33f/doctor/model"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestChangerator_DocumentSecurityRequirementChange_UsesMatchingArraySlot(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
security:
  - oauth:
      - read
  - oauth:
      - write
paths: {}
components:
  securitySchemes:
    oauth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://example.com/oauth
          scopes:
            read: Read access
            write: Write access
            admin: Admin access`

	ymlRight := `openapi: "3.1.0"
security:
  - oauth:
      - read
  - oauth:
      - admin
paths: {}
components:
  securitySchemes:
    oauth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://example.com/oauth
          scopes:
            read: Read access
            write: Write access
            admin: Admin access`

	cd, docChanges := buildSecurityRequirementChangerator(t, ymlLeft, ymlRight)

	require.Len(t, docChanges.SecurityRequirementChanges, 1)
	assertSecurityRequirementPaths(t, docChanges.SecurityRequirementChanges[0], "$.security[1]")
	assert.True(t, hasChangedNode(cd.ChangedNodes, "$.security[1]"))
}

func TestChangerator_OperationSecurityRequirementChange_UsesMatchingArraySlot(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
paths:
  /burgers:
    get:
      security:
        - oauth:
            - read
        - oauth:
            - write
      responses:
        "200":
          description: ok
components:
  securitySchemes:
    oauth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://example.com/oauth
          scopes:
            read: Read access
            write: Write access
            admin: Admin access`

	ymlRight := `openapi: "3.1.0"
paths:
  /burgers:
    get:
      security:
        - oauth:
            - read
        - oauth:
            - admin
      responses:
        "200":
          description: ok
components:
  securitySchemes:
    oauth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://example.com/oauth
          scopes:
            read: Read access
            write: Write access
            admin: Admin access`

	cd, docChanges := buildSecurityRequirementChangerator(t, ymlLeft, ymlRight)

	require.NotNil(t, docChanges.PathsChanges)
	require.Contains(t, docChanges.PathsChanges.PathItemsChanges, "/burgers")
	getChanges := docChanges.PathsChanges.PathItemsChanges["/burgers"].GetChanges
	require.NotNil(t, getChanges)
	require.Len(t, getChanges.SecurityRequirementChanges, 1)

	assertSecurityRequirementPaths(t, getChanges.SecurityRequirementChanges[0], "$.paths['/burgers'].get.security[1]")
	assert.True(t, hasChangedNode(cd.ChangedNodes, "$.paths['/burgers'].get.security[1]"))
}

func buildSecurityRequirementChangerator(t *testing.T, ymlLeft, ymlRight string) (*Changerator, *whatChangedModel.DocumentChanges) {
	t.Helper()

	l, err := libopenapi.NewDocument([]byte(ymlLeft))
	require.NoError(t, err)
	leftModel, err := l.BuildV3Model()
	require.NoError(t, err)
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)
	t.Cleanup(leftDoc.Release)

	r, err := libopenapi.NewDocument([]byte(ymlRight))
	require.NoError(t, err)
	rightModel, err := r.BuildV3Model()
	require.NoError(t, err)
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)
	t.Cleanup(rightDoc.Release)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	docChanges := cd.Changerate()
	require.NotNil(t, docChanges)
	return cd, docChanges
}

func assertSecurityRequirementPaths(t *testing.T, change *whatChangedModel.SecurityRequirementChanges, expectedPath string) {
	t.Helper()

	allChanges := change.GetAllChanges()
	require.NotEmpty(t, allChanges)
	for _, item := range allChanges {
		require.NotNil(t, item)
		assert.Equal(t, expectedPath, item.Path)
	}
}

func hasChangedNode(nodes []*drV3.Node, id string) bool {
	for _, node := range nodes {
		if node != nil && node.Id == id {
			return true
		}
	}
	return false
}

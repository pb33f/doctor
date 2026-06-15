package changerator

import (
	"context"
	"testing"

	drModel "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	lowModel "github.com/pb33f/libopenapi/datamodel/low"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestVisitDocument_DoesNotPanicOnSchemaContext(t *testing.T) {
	spec := `openapi: 3.1.0
info:
  title: test
  version: 1.0.0
paths: {}
`

	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)

	docModel, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	rightDoc := drModel.NewDrDocumentAndGraph(docModel)
	require.NotNil(t, rightDoc)
	require.NotNil(t, rightDoc.V3Document)
	require.NotNil(t, rightDoc.V3Document.Node)

	cd := NewChangerator(&ChangeratorConfig{
		Doctor: rightDoc,
	})

	ctx := context.WithValue(context.Background(), v3.Context, &wcModel.SchemaChanges{})

	require.NotPanics(t, func() {
		cd.VisitDocument(ctx, rightDoc.V3Document)
	})
	assert.Empty(t, rightDoc.V3Document.Node.GetChanges())
}

func TestVisitSchema_DoesNotPanicWhenLocateModelReturnsDocument(t *testing.T) {
	spec := `openapi: 3.1.0
info:
  title: test
  version: 1.0.0
paths: {}
components:
  schemas:
    Base:
      type: object
      properties:
        id:
          type: string
    Composite:
      allOf:
        - $ref: '#/components/schemas/Base'
        - type: object
          properties:
            name:
              type: string
`

	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)

	docModel, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	rightDoc := drModel.NewDrDocumentAndGraph(docModel)
	require.NotNil(t, rightDoc)

	composite := rightDoc.V3Document.Components.Schemas.GetOrZero("Composite")
	require.NotNil(t, composite)
	require.NotNil(t, composite.Schema)
	require.Len(t, composite.Schema.AllOf, 2)

	docLow := rightDoc.V3Document.Document.GoLow()
	candidates := []lowModel.HasRootNode{
		docLow.Info.Value,
		docLow.Paths.Value,
		docLow.Components.Value,
	}

	var triggerObject lowModel.HasRootNode
	for _, candidate := range candidates {
		if candidate == nil || candidate.GetRootNode() == nil {
			continue
		}
		located, err := rightDoc.LocateModel(candidate.GetRootNode())
		if err != nil {
			continue
		}
		for _, item := range located {
			if _, ok := item.(*v3.Document); ok {
				triggerObject = candidate
				break
			}
		}
		if triggerObject != nil {
			break
		}
	}
	require.NotNil(t, triggerObject, "expected at least one low-level document child to locate back to the document companion")

	cd := NewChangerator(&ChangeratorConfig{
		Doctor: rightDoc,
	})

	ctx := context.WithValue(context.Background(), v3.Context, &wcModel.SchemaChanges{
		AllOfChanges: []*wcModel.SchemaChanges{
			{
				PropertyChanges: wcModel.NewPropertyChanges([]*wcModel.Change{
					{NewObject: triggerObject},
				}),
			},
		},
	})

	require.NotPanics(t, func() {
		composite.Schema.Travel(ctx, cd)
	})
	assert.Empty(t, rightDoc.V3Document.Node.GetChanges())
}

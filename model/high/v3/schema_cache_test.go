package v3

import (
	"context"
	"sync"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/stretchr/testify/require"
)

func TestSchemaWalkCacheHitHydratesCompletedSchema(t *testing.T) {
	document, err := libopenapi.NewDocument([]byte(`openapi: 3.1.0
info:
  title: Cache Hit Fixture
  version: 1.0.0
paths: {}
components:
  schemas:
    Cached:
      type: object
      properties:
        real:
          type: string
`))
	require.NoError(t, err)

	docModel, err := document.BuildV3Model()
	require.NoError(t, err)

	schemaProxy := docModel.Model.Components.Schemas.GetOrZero("Cached")
	require.NotNil(t, schemaProxy)

	schema := schemaProxy.Schema()
	require.NotNil(t, schema)

	cachedProperties := orderedmap.New[string, *SchemaProxy]()
	cachedSchema := &Schema{}
	cachedProperties.Set("sentinel", &SchemaProxy{
		Foundation: Foundation{
			Parent: cachedSchema,
		},
	})

	var schemaCache sync.Map
	cachedSchema.Properties = cachedProperties
	cachedSchema.Walked = true
	schemaCache.Store(schema.GoLow().RootNode, cachedSchema)

	objectChan := make(chan any, 1)
	ctx := context.WithValue(context.Background(), "drCtx", &DrContext{
		ObjectChan:     objectChan,
		SchemaCache:    &schemaCache,
		UseSchemaCache: true,
	})

	occurrence := &Schema{Name: "usage"}
	occurrence.Walk(ctx, schema, 0)

	require.True(t, occurrence.Walked)
	require.NotSame(t, cachedProperties, occurrence.Properties)
	sentinel := occurrence.Properties.GetOrZero("sentinel")
	require.NotNil(t, sentinel)
	require.Same(t, occurrence, sentinel.Parent)
	require.Nil(t, occurrence.Properties.GetOrZero("real"))
	require.Same(t, occurrence, <-objectChan)
}

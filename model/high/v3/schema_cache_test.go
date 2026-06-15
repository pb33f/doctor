package v3

import (
	"context"
	"sync"
	"sync/atomic"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/testify/require"
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

func TestSchemaRenderCacheHitPopulatesDirectAliasChildren(t *testing.T) {
	cachedSchema := &Schema{Name: "Cached", Walked: true}
	cachedChild := &Schema{Name: "Child", Walked: true}
	cachedProperty := &SchemaProxy{
		Foundation: Foundation{
			Parent:      cachedSchema,
			PathSegment: "properties",
			Key:         "sentinel",
		},
		Schema: cachedChild,
	}
	cachedChild.Foundation = Foundation{
		Parent:      cachedProperty,
		PathSegment: "properties",
		Key:         "sentinel",
	}
	cachedProperties := orderedmap.New[string, *SchemaProxy]()
	cachedProperties.Set("sentinel", cachedProperty)
	cachedSchema.Properties = cachedProperties

	occurrence := &Schema{Name: "usage"}
	occurrence.hydrateFromCache(cachedSchema, &DrContext{RenderChanges: true})

	require.Same(t, cachedSchema, occurrence.Definition)
	require.NotNil(t, occurrence.Properties)
	require.Same(t, occurrence.Properties, occurrence.PropertiesForRead())

	properties := occurrence.PropertiesForRead()
	require.NotNil(t, properties)

	sentinel := properties.GetOrZero("sentinel")
	require.NotNil(t, sentinel)
	require.NotSame(t, cachedProperty, sentinel)
	require.Same(t, occurrence, sentinel.Parent)
	require.NotNil(t, sentinel.Schema)
	require.NotSame(t, cachedChild, sentinel.Schema)
	require.Same(t, cachedChild, sentinel.Schema.Definition)
}

func TestSchemaRenderCacheHitFlattensAliasDefinitions(t *testing.T) {
	source := &Schema{Name: "source", Hash: "source-hash", Walked: true}
	alias := &Schema{Name: "alias", Hash: "alias-hash", Definition: source, Walked: true}

	occurrence := &Schema{Name: "usage"}
	occurrence.hydrateFromCache(alias, &DrContext{RenderChanges: true})

	require.Same(t, source, occurrence.Definition)
	require.Nil(t, schemaDefinition(occurrence.Definition))
	require.Equal(t, source.Hash, occurrence.Hash)

	childAlias := schemaFromCache(alias, nil, nil, aliasSchemaCacheCopyOptions(false))
	require.NotNil(t, childAlias)
	require.Same(t, source, childAlias.Definition)
	require.Nil(t, schemaDefinition(childAlias.Definition))
	require.Equal(t, source.Hash, childAlias.Hash)
}

func TestSchemaDefinitionSourceReturnsEndOfAliasChain(t *testing.T) {
	source := &Schema{Name: "source"}
	third := &Schema{Name: "third", Definition: source}
	second := &Schema{Name: "second", Definition: third}
	first := &Schema{Name: "first", Definition: second}

	resolved, ok := first.DefinitionSource()

	require.True(t, ok)
	require.Same(t, source, resolved)
	require.Same(t, source, first.Definition)
}

func TestSchemaDefinitionSourceReportsAliasCycle(t *testing.T) {
	first := &Schema{Name: "first"}
	second := &Schema{Name: "second"}
	first.Definition = second
	second.Definition = first

	source, ok := first.DefinitionSource()
	require.False(t, ok)
	require.Nil(t, source)
}

func TestSchemaRenderCacheHitAliasesChildrenPreserveDeterministicPaths(t *testing.T) {
	document, err := libopenapi.NewDocument([]byte(`openapi: 3.1.0
info:
  title: Cache Hit Deterministic Path Fixture
  version: 1.0.0
paths: {}
components:
  schemas:
    Cached:
      type: object
      properties:
        sentinel:
          type: object
          properties:
            nested:
              type: string
`))
	require.NoError(t, err)

	docModel, err := document.BuildV3Model()
	require.NoError(t, err)

	cachedBase := docModel.Model.Components.Schemas.GetOrZero("Cached").Schema()
	require.NotNil(t, cachedBase)
	sentinelBaseProxy := cachedBase.Properties.GetOrZero("sentinel")
	require.NotNil(t, sentinelBaseProxy)
	sentinelBase := sentinelBaseProxy.Schema()
	require.NotNil(t, sentinelBase)
	nestedBaseProxy := sentinelBase.Properties.GetOrZero("nested")
	require.NotNil(t, nestedBaseProxy)
	nestedBase := nestedBaseProxy.Schema()
	require.NotNil(t, nestedBase)

	cachedSchema := &Schema{Name: "Cached", Value: cachedBase, Walked: true}
	cachedSentinel := &Schema{Name: "sentinel", Value: sentinelBase, Walked: true}
	cachedNested := &Schema{Name: "nested", Value: nestedBase, Walked: true}

	cachedNestedProxy := &SchemaProxy{
		Value: nestedBaseProxy,
		Foundation: Foundation{
			Parent:      cachedSentinel,
			PathSegment: "properties",
			Key:         "nested",
		},
		Schema: cachedNested,
	}
	cachedNested.Foundation = Foundation{
		Parent:      cachedNestedProxy,
		PathSegment: "properties",
		Key:         "nested",
	}
	cachedSentinel.Properties = orderedmap.New[string, *SchemaProxy]()
	cachedSentinel.Properties.Set("nested", cachedNestedProxy)

	cachedSentinelProxy := &SchemaProxy{
		Value: sentinelBaseProxy,
		Foundation: Foundation{
			Parent:      cachedSchema,
			PathSegment: "properties",
			Key:         "sentinel",
		},
		Schema: cachedSentinel,
	}
	cachedSentinel.Foundation = Foundation{
		Parent:      cachedSentinelProxy,
		PathSegment: "properties",
		Key:         "sentinel",
	}
	cachedSchema.Properties = orderedmap.New[string, *SchemaProxy]()
	cachedSchema.Properties.Set("sentinel", cachedSentinelProxy)

	const canonicalCached = "$.components.schemas['Cached']"
	const canonicalSentinel = "$.components.schemas['Cached'].properties['sentinel']"
	const canonicalNested = "$.components.schemas['Cached'].properties['sentinel'].properties['nested']"
	var canonicalPathCache sync.Map
	canonicalPathCache.Store(cachedBase.GoLow().RootNode, canonicalCached)
	canonicalPathCache.Store(sentinelBase.GoLow().RootNode, canonicalSentinel)
	canonicalPathCache.Store(nestedBase.GoLow().RootNode, canonicalNested)

	occurrence := &Schema{
		Name: "usage",
		Foundation: Foundation{
			PathSegment: "schema",
			Key:         "usage",
		},
	}
	occurrence.hydrateFromCache(cachedSchema, &DrContext{
		RenderChanges:      true,
		DeterministicPaths: true,
		CanonicalPathCache: &canonicalPathCache,
	})

	require.Equal(t, canonicalCached, occurrence.GenerateJSONPath())

	properties := occurrence.PropertiesForRead()
	require.NotNil(t, properties)
	sentinel := properties.GetOrZero("sentinel")
	require.NotNil(t, sentinel)
	require.NotNil(t, sentinel.Schema)
	require.Equal(t, canonicalSentinel, sentinel.Schema.GenerateJSONPath())

	nestedProperties := sentinel.Schema.PropertiesForRead()
	require.NotNil(t, nestedProperties)
	nested := nestedProperties.GetOrZero("nested")
	require.NotNil(t, nested)
	require.NotNil(t, nested.Schema)
	require.Equal(t, canonicalNested, nested.Schema.GenerateJSONPath())
}

func TestSchemaRenderCacheHitAliasesChildrenForReadRace(t *testing.T) {
	cachedSchema := &Schema{Name: "Cached", Walked: true}
	cachedProperties := orderedmap.New[string, *SchemaProxy]()
	cachedProperties.Set("sentinel", &SchemaProxy{
		Schema: &Schema{Name: "Child", Walked: true},
	})
	cachedSchema.Properties = cachedProperties

	occurrence := &Schema{Name: "usage"}
	occurrence.hydrateFromCache(cachedSchema, &DrContext{RenderChanges: true})

	var wg sync.WaitGroup
	var misses atomic.Int32
	for i := 0; i < 32; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			properties := occurrence.PropertiesForRead()
			if properties == nil || properties.GetOrZero("sentinel") == nil {
				misses.Add(1)
			}
		}()
	}
	wg.Wait()

	require.Zero(t, misses.Load())
}

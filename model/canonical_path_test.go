package model

import (
	"runtime"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

const canonicalPathFixture = `openapi: 3.0.3
info:
  title: Canonical Path Fixture
  version: 1.0.0
paths:
  /resource:
    get:
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceV1'
  /resource-alt:
    get:
      responses:
        '200':
          $ref: '#/components/responses/InlineResponse'
components:
  responses:
    InlineResponse:
      description: inline response
      content:
        application/json:
          schema:
            type: object
            properties:
              inner:
                type: object
                properties:
                  inner_value:
                    type: string
  parameters:
    InlineParameter:
      name: x-inline
      in: query
      schema:
        type: object
        properties:
          p:
            type: object
            properties:
              pv:
                type: string
  requestBodies:
    InlineBody:
      required: false
      content:
        application/json:
          schema:
            type: object
            properties:
              body:
                type: object
                properties:
                  bv:
                    type: string
  headers:
    InlineHeader:
      required: false
      schema:
        type: object
        properties:
          h:
            type: object
            properties:
              hv:
                type: string
  schemas:
    ResourceV1:
      type: object
      properties:
        spec:
          $ref: '#/components/schemas/ResourceSpecV1'
    ResourceSpecV1:
      type: object
      oneOf:
        - $ref: '#/components/schemas/ServiceLevelObjectiveV1'
    ServiceLevelObjectiveV1:
      type: object
      properties:
        alert:
          $ref: '#/components/schemas/ServiceLevelObjectiveAlertV1'
    ServiceLevelObjectiveAlertV1:
      type: object
      properties:
        ticket:
          allOf:
            - $ref: '#/components/schemas/ServiceLevelObjectiveAlertSeverityV1'
        page:
          allOf:
            - $ref: '#/components/schemas/ServiceLevelObjectiveAlertSeverityV1'
    ServiceLevelObjectiveAlertSeverityV1:
      type: object
      required: [labels]
      properties:
        labels:
          type: object
          required: [hedwig_scope]
          properties:
            hedwig_scope:
              type: string
`

const hedwigDefinitionPath = "$.components.schemas['ServiceLevelObjectiveAlertSeverityV1'].properties['labels'].properties['hedwig_scope']"

func TestCanonicalPaths_Deterministic_WithCache(t *testing.T) {
	origProcs := runtime.GOMAXPROCS(1)
	defer runtime.GOMAXPROCS(origProcs)

	const iterations = 50
	for i := 0; i < iterations; i++ {
		walker := buildCanonicalPathTestDocument(t, true, true)
		path := extractUsageSiteHedwigPath(t, walker)
		assert.Equalf(t, hedwigDefinitionPath, path, "iteration %d should use definition-site path", i)
		if i == 0 {
			assertNestedComponentPaths(t, walker)
		}
	}
}

func TestCanonicalPaths_Deterministic_WithoutCache(t *testing.T) {
	origProcs := runtime.GOMAXPROCS(1)
	defer runtime.GOMAXPROCS(origProcs)

	const iterations = 50
	for i := 0; i < iterations; i++ {
		walker := buildCanonicalPathTestDocument(t, false, true)
		path := extractUsageSiteHedwigPath(t, walker)
		assert.Equalf(t, hedwigDefinitionPath, path, "iteration %d should use definition-site path", i)
		if i == 0 {
			assertNestedComponentPaths(t, walker)
		}
	}
}

func TestCanonicalPaths_NonDeterministic_NoChange(t *testing.T) {
	origProcs := runtime.GOMAXPROCS(1)
	defer runtime.GOMAXPROCS(origProcs)

	const iterations = 50
	var nonDefinitionPathCount int
	for i := 0; i < iterations; i++ {
		walker := buildCanonicalPathTestDocument(t, true, false)
		if extractUsageSiteHedwigPath(t, walker) != hedwigDefinitionPath {
			nonDefinitionPathCount++
		}
	}

	assert.Greater(t, nonDefinitionPathCount, 0,
		"expected at least one usage-site path when DeterministicPaths is disabled")
}

func buildCanonicalPathTestDocument(t *testing.T, useSchemaCache, deterministicPaths bool) *DrDocument {
	t.Helper()

	document, err := libopenapi.NewDocument([]byte(canonicalPathFixture))
	require.NoError(t, err)

	model, errs := document.BuildV3Model()
	require.Empty(t, errs)

	return NewDrDocumentWithConfig(model, &DrConfig{
		UseSchemaCache:     useSchemaCache,
		DeterministicPaths: deterministicPaths,
	})
}

func extractUsageSiteHedwigPath(t *testing.T, walker *DrDocument) string {
	t.Helper()

	resource := walker.V3Document.Components.Schemas.GetOrZero("ResourceV1")
	require.NotNil(t, resource)
	require.NotNil(t, resource.Schema)

	spec := resource.Schema.PropertiesForRead().GetOrZero("spec")
	require.NotNil(t, spec)
	require.NotNil(t, spec.Schema)
	specOneOf := spec.Schema.OneOfForRead()
	require.NotEmpty(t, specOneOf)
	require.NotNil(t, specOneOf[0])
	require.NotNil(t, specOneOf[0].Schema)

	alert := specOneOf[0].Schema.PropertiesForRead().GetOrZero("alert")
	require.NotNil(t, alert)
	require.NotNil(t, alert.Schema)

	ticket := alert.Schema.PropertiesForRead().GetOrZero("ticket")
	require.NotNil(t, ticket)
	require.NotNil(t, ticket.Schema)
	ticketAllOf := ticket.Schema.AllOfForRead()
	require.NotEmpty(t, ticketAllOf)
	require.NotNil(t, ticketAllOf[0])
	require.NotNil(t, ticketAllOf[0].Schema)

	labels := ticketAllOf[0].Schema.PropertiesForRead().GetOrZero("labels")
	require.NotNil(t, labels)
	require.NotNil(t, labels.Schema)

	hedwig := labels.Schema.PropertiesForRead().GetOrZero("hedwig_scope")
	require.NotNil(t, hedwig)
	require.NotNil(t, hedwig.Schema)

	return hedwig.Schema.GenerateJSONPath()
}

func assertNestedComponentPaths(t *testing.T, walker *DrDocument) {
	t.Helper()

	response := walker.V3Document.Components.Responses.GetOrZero("InlineResponse")
	require.NotNil(t, response)
	require.NotNil(t, response.Content)
	responseMediaType := response.Content.GetOrZero("application/json")
	require.NotNil(t, responseMediaType)
	require.NotNil(t, responseMediaType.SchemaProxy)
	require.NotNil(t, responseMediaType.SchemaProxy.Schema)
	responseInner := responseMediaType.SchemaProxy.Schema.PropertiesForRead().GetOrZero("inner")
	require.NotNil(t, responseInner)
	require.NotNil(t, responseInner.Schema)
	responseInnerValue := responseInner.Schema.PropertiesForRead().GetOrZero("inner_value")
	require.NotNil(t, responseInnerValue)
	require.NotNil(t, responseInnerValue.Schema)
	responsePath := responseInnerValue.Schema.GenerateJSONPath()
	assert.Equal(t, "$.components.responses['InlineResponse'].content['application/json'].schema.properties['inner'].properties['inner_value']", responsePath)

	parameter := walker.V3Document.Components.Parameters.GetOrZero("InlineParameter")
	require.NotNil(t, parameter)
	require.NotNil(t, parameter.SchemaProxy)
	require.NotNil(t, parameter.SchemaProxy.Schema)
	parameterP := parameter.SchemaProxy.Schema.PropertiesForRead().GetOrZero("p")
	require.NotNil(t, parameterP)
	require.NotNil(t, parameterP.Schema)
	parameterPV := parameterP.Schema.PropertiesForRead().GetOrZero("pv")
	require.NotNil(t, parameterPV)
	require.NotNil(t, parameterPV.Schema)
	parameterPath := parameterPV.Schema.GenerateJSONPath()
	assert.Equal(t, "$.components.parameters['InlineParameter'].schema.properties['p'].properties['pv']", parameterPath)

	requestBody := walker.V3Document.Components.RequestBodies.GetOrZero("InlineBody")
	require.NotNil(t, requestBody)
	require.NotNil(t, requestBody.Content)
	requestBodyMediaType := requestBody.Content.GetOrZero("application/json")
	require.NotNil(t, requestBodyMediaType)
	require.NotNil(t, requestBodyMediaType.SchemaProxy)
	require.NotNil(t, requestBodyMediaType.SchemaProxy.Schema)
	requestBodyField := requestBodyMediaType.SchemaProxy.Schema.PropertiesForRead().GetOrZero("body")
	require.NotNil(t, requestBodyField)
	require.NotNil(t, requestBodyField.Schema)
	requestBodyBV := requestBodyField.Schema.PropertiesForRead().GetOrZero("bv")
	require.NotNil(t, requestBodyBV)
	require.NotNil(t, requestBodyBV.Schema)
	requestBodyPath := requestBodyBV.Schema.GenerateJSONPath()
	assert.Equal(t, "$.components.requestBodies['InlineBody'].content['application/json'].schema.properties['body'].properties['bv']", requestBodyPath)

	header := walker.V3Document.Components.Headers.GetOrZero("InlineHeader")
	require.NotNil(t, header)
	require.NotNil(t, header.Schema)
	require.NotNil(t, header.Schema.Schema)
	headerH := header.Schema.Schema.PropertiesForRead().GetOrZero("h")
	require.NotNil(t, headerH)
	require.NotNil(t, headerH.Schema)
	headerHV := headerH.Schema.PropertiesForRead().GetOrZero("hv")
	require.NotNil(t, headerHV)
	require.NotNil(t, headerHV.Schema)
	headerPath := headerHV.Schema.GenerateJSONPath()
	assert.Equal(t, "$.components.headers['InlineHeader'].schema.properties['h'].properties['hv']", headerPath)
}

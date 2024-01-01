// Copyright 2023 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: MIT

package model

import (
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func TestWalker_TestStripe(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/stripe.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)

	assert.Equal(t, 15360, len(walker.Schemas))
	assert.Equal(t, 186, len(walker.SkippedSchemas))

}

func BenchmarkWalker_TestStripe(b *testing.B) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/stripe.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	for n := 0; n < b.N; n++ {
		walker := NewDrDocument(v3Doc)

		assert.Equal(b, 15538, len(walker.Schemas))
		assert.Equal(b, 26, len(walker.SkippedSchemas))
	}

}

func TestWalker_TestStripe_Old(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/stripe-old.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)

	assert.Equal(t, 11112, len(walker.Schemas))
	assert.Equal(t, 153, len(walker.SkippedSchemas))

}

func TestWalker_TestAsana(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/asana.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)

	assert.Equal(t, 874, len(walker.Schemas))
	assert.Equal(t, 0, len(walker.SkippedSchemas))

}

func TestWalker_TestSquare(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/square.json")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)

	assert.Equal(t, 3065, len(walker.Schemas))
	assert.Equal(t, 15, len(walker.SkippedSchemas))

}

func TestWalker_WalkV3_Info(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/petstorev3.json")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	contactPath := walked.Info.Contact.GenerateJSONPath()
	assert.Equal(t, "$.info.contact", contactPath)
	assert.Equal(t, "$.info.license", walked.Info.License.GenerateJSONPath())
	assert.Equal(t, "Apache 2.0", walked.Info.License.Value.Name)

	// test the foundational get methods
	assert.Equal(t, "contact", walked.Info.Contact.GetPathSegment())

	// test the foundation get parent method
	assert.Equal(t, "info", walked.Info.Contact.GetParent().GetPathSegment())

}

func TestWalker_WalkV3_Server(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	serverVariablePath := walked.Servers[0].Variables.GetOrZero("scheme").GenerateJSONPath()
	assert.Equal(t, "$.servers[0].variables['scheme']", serverVariablePath)
}

func TestWalker_WalkV3_PathItem(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Paths.PathItems.GetOrZero("/burgers").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers']", pathItem)

	pathItem = walked.Paths.PathItems.GetOrZero("/burgers/{burgerId}").Get.GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers/{burgerId}'].get", pathItem)

	pathItem = walked.Paths.PathItems.GetOrZero("/burgers/{burgerId}").Get.Parameters[0].GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers/{burgerId}'].get.parameters[0]", pathItem)

	pathItem = walked.Paths.PathItems.GetOrZero("/burgers/{burgerId}").Get.Parameters[0].SchemaProxy.Schema.GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers/{burgerId}'].get.parameters[0].schema", pathItem)

}

func TestWalker_WalkV3_PathItem_Parameters(t *testing.T) {

	yml := `openapi: 3.1.0
paths:
  /baggers:
    parameters:
      - name: baggerId
        in: query`

	newDoc, _ := libopenapi.NewDocument([]byte(yml))
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Paths.PathItems.GetOrZero("/baggers").Parameters[0].GenerateJSONPath()
	assert.Equal(t, "$.paths['/baggers'].parameters[0]", pathItem)
	assert.Equal(t, "query", walked.Paths.PathItems.GetOrZero("/baggers").Parameters[0].Value.In)

}

func TestWalker_WalkV3_PathItem_Params(t *testing.T) {

	yml := `openapi: 3.1.0
paths:
  /baggers:
    parameters:
      - name: baggerId
        in: query`

	newDoc, _ := libopenapi.NewDocument([]byte(yml))
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Paths.PathItems.GetOrZero("/baggers").Parameters[0].GenerateJSONPath()
	assert.Equal(t, "$.paths['/baggers'].parameters[0]", pathItem)
	assert.Equal(t, "query", walked.Paths.PathItems.GetOrZero("/baggers").Parameters[0].Value.In)

}

func TestWalker_WalkV3_Responses(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	responses := walked.Paths.PathItems.GetOrZero("/burgers").Post.Responses.GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.responses", responses)

	responses = walked.Paths.PathItems.GetOrZero("/burgers").Post.Responses.Codes.GetOrZero("200").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.responses['200']", responses)

	responses = walked.Paths.PathItems.GetOrZero("/burgers").Post.Responses.Codes.GetOrZero("200").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.responses['200']", responses)

	responses = walked.Paths.PathItems.GetOrZero("/burgers").Post.Responses.Codes.GetOrZero("200").
		Content.GetOrZero("application/json").SchemaProxy.GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.responses['200'].content['application/json'].schema", responses)

	responses = walked.Paths.PathItems.GetOrZero("/burgers").Post.Responses.Codes.GetOrZero("200").
		Content.GetOrZero("application/json").SchemaProxy.Schema.Properties.GetOrZero("numPatties").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.responses['200'].content['application/json'].schema.properties['numPatties']", responses)

	responses = walked.Paths.PathItems.GetOrZero("/burgers").Post.Responses.Codes.GetOrZero("200").
		Content.GetOrZero("application/json").Examples.GetOrZero("filetOFish").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.responses['200'].content['application/json'].examples['filetOFish']", responses)

}

func TestWalker_WalkV3_RequestBody(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	requestBody := walked.Paths.PathItems.GetOrZero("/burgers").Post.RequestBody.GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.requestBody", requestBody)

	requestBody = walked.Paths.PathItems.GetOrZero("/burgers").Post.RequestBody.Content.GetOrZero("application/json").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.requestBody.content['application/json']", requestBody)

	requestBody = walked.Paths.PathItems.GetOrZero("/burgers").Post.RequestBody.Content.
		GetOrZero("application/json").SchemaProxy.Schema.GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.requestBody.content['application/json'].schema", requestBody)

}

func TestWalker_WalkV3_Callback(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	callbacks := walked.Paths.PathItems.GetOrZero("/burgers/{burgerId}").Get.Callbacks.GetOrZero("burgerCallback").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers/{burgerId}'].get.callbacks['burgerCallback']", callbacks)

	callbacks = walked.Paths.PathItems.GetOrZero("/burgers/{burgerId}").Get.Callbacks.
		GetOrZero("burgerCallback").Expression.GetOrZero("{$request.query.queryUrl}").GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers/{burgerId}'].get.callbacks['burgerCallback']['{$request.query.queryUrl}']", callbacks)

}

func TestWalker_WalkV3_Security(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	security := walked.Paths.PathItems.GetOrZero("/burgers").
		Post.Security[0].GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.security[0]", security)

}

func TestWalker_WalkV3_Servers(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	servers := walked.Paths.PathItems.GetOrZero("/burgers").
		Post.Servers[0].GenerateJSONPath()
	assert.Equal(t, "$.paths['/burgers'].post.servers[0]", servers)
}

func TestWalker_WalkV3_Components(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	components := walked.Components.Schemas.GetOrZero("Burger").GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['Burger']", components)

	components = walked.Components.Schemas.GetOrZero("Burger").Schema.Properties.GetOrZero("fries").GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['Burger'].properties['fries']", components)

	components = walked.Components.Schemas.GetOrZero("Burger").Schema.Properties.GetOrZero("fries").Schema.Properties.
		GetOrZero("favoriteDrink").GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['Burger'].properties['fries'].properties['favoriteDrink']", components)

	components = walked.Components.Examples.GetOrZero("QuarterPounder").GenerateJSONPath()
	assert.Equal(t, "$.components.examples['QuarterPounder']", components)

}

func TestWalker_WalkV3_Tags(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	tags := walked.Tags[0].GenerateJSONPath()
	assert.Equal(t, "$.tags[0]", tags)
}

func TestWalker_WalkV3_ExternalDocs(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	tags := walked.ExternalDocs.GenerateJSONPath()
	assert.Equal(t, "$.externalDocs", tags)
}

func TestWalker_WalkV3_Webhooks(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	tags := walked.Webhooks.GetOrZero("someHook").Post.RequestBody.GenerateJSONPath()
	assert.Equal(t, "$.webhooks['someHook'].post.requestBody", tags)
}

func TestWalker_WalkV3_CheckSchemas(t *testing.T) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	walker.WalkV3(&v3Doc.Model)

	schemas := walker.Schemas
	assert.Equal(t, 29, len(schemas))

}

func TestWalker_WalkV3_SchemaTests(t *testing.T) {

	yml := `openapi: 3.1.0
components:
  schemas:
    MintyFresh:
      type: object
      prefixItems:
        - type: string
      contains:
        type: string
      if:
        type: string
      else:
        type: integer
      then:
        type: float
      dependentSchemas:
        one:
          type: string
      patternProperties:
        lemons:
          type: string
      propertyNames:
        type: string
      unevaluatedItems:
        type: string;
      unevaluatedProperties:
        type: string;
      items: true
      not:
        type: string
      additionalProperties: true
`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.UnevaluatedItems.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].unevaluatedItems", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.PatternProperties.GetOrZero("lemons").GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].patternProperties['lemons']", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.UnevaluatedProperties.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].unevaluatedProperties", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.PropertyNames.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].propertyNames", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.DependentSchemas.GetOrZero("one").GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].dependentSchemas['one']", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.Items.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].items", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.Not.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].not", pathItem)

	pathItem = walked.Components.Schemas.GetOrZero("MintyFresh").Schema.AdditionalProperties.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].additionalProperties", pathItem)

}

func TestWalker_WalkV3_SchemaTests_UnevaluatedProps(t *testing.T) {

	yml := `openapi: 3.1.0
components:
  schemas:
    MintyFresh:
      unevaluatedProperties: false
`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.UnevaluatedProperties.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].unevaluatedProperties", pathItem)

	dyn := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.UnevaluatedProperties

	assert.False(t, dyn.Value.IsA())
	assert.True(t, dyn.Value.IsB())

}

func TestWalker_WalkV3_SchemaTests_AdditionalProps(t *testing.T) {

	yml := `openapi: 3.1.0
components:
  schemas:
    MintyFresh:
      additionalProperties:
        properties:
          cake:
            type: string
`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.AdditionalProperties.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].additionalProperties", pathItem)

	dyn := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.AdditionalProperties

	assert.True(t, dyn.Value.IsA())
	assert.False(t, dyn.Value.IsB())
	assert.Equal(t, "$.components.schemas['MintyFresh'].additionalProperties.properties['cake']",
		dyn.A.Schema.Properties.GetOrZero("cake").GenerateJSONPath())

}

func TestWalker_WalkV3_SchemaTests_Items(t *testing.T) {

	yml := `openapi: 3.1.0
components:
  schemas:
    MintyFresh:
      items:
        properties:
          cake:
            type: string
`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.Items.GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['MintyFresh'].items", pathItem)

	dyn := walked.Components.Schemas.GetOrZero("MintyFresh").Schema.Items

	assert.True(t, dyn.Value.IsA())
	assert.False(t, dyn.Value.IsB())
	assert.Equal(t, "$.components.schemas['MintyFresh'].items.properties['cake']",
		dyn.A.Schema.Properties.GetOrZero("cake").GenerateJSONPath())

}

func TestWalker_WalkV3_Components_Headers(t *testing.T) {

	yml := `openapi: 3.1.0
components:
  headers:
    MintyFresh:
      schema:
        type: string
      examples:
        test: hello
      content:
       text/plain:
         schema:
           type: string
`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	pathItem := walked.Components.Headers.GetOrZero("MintyFresh").Schema.GenerateJSONPath()
	assert.Equal(t, "$.components.headers['MintyFresh'].schema", pathItem)

	pathItem = walked.Components.Headers.GetOrZero("MintyFresh").Examples.GetOrZero("test").GenerateJSONPath()
	assert.Equal(t, "$.components.headers['MintyFresh'].examples['test']", pathItem)

	pathItem = walked.Components.Headers.GetOrZero("MintyFresh").Content.GetOrZero("text/plain").GenerateJSONPath()
	assert.Equal(t, "$.components.headers['MintyFresh'].content['text/plain']", pathItem)

}

func TestWalker_WalkV3_OAuth(t *testing.T) {

	yml := `openapi: 3.1.0
components:
  securitySchemes:
    oauth:
      type: oauth2
      flows:
        password:
          tokenUrl: https://pb33f.io/api/oauth
        clientCredentials:
          tokenUrl: https://pb33f.io/api/oauth`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	creds := walked.Components.SecuritySchemes.GetOrZero("oauth").Flows.Password.GenerateJSONPath()
	assert.Equal(t, "$.components.securitySchemes['oauth'].flows.password", creds)

	creds = walked.Components.SecuritySchemes.GetOrZero("oauth").Flows.ClientCredentials.GenerateJSONPath()
	assert.Equal(t, "$.components.securitySchemes['oauth'].flows.clientCredentials", creds)

}

func TestWalker_WalkV3_Operation_ExternalDocs(t *testing.T) {

	yml := `openapi: 3.1.0
paths:
  /hello:
    get:
      externalDocs:
        url: https://pb33f.io
  `

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	creds := walked.Paths.PathItems.GetOrZero("/hello").Get.ExternalDocs.GenerateJSONPath()
	assert.Equal(t, "$.paths['/hello'].get.externalDocs", creds)

}

func TestWalker_WalkV3_TestBuildErrors(t *testing.T) {

	yml := `openapi: "3.1"
components:
  schemas:
    Foo:
      type: object
      additionalProperties: indeterminate
    Bar:
      type: object
      additionalProperties: indeterminate`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walker.WalkV3(&v3Doc.Model)

	assert.Len(t, walker.BuildErrors, 2)
	assert.Equal(t, "build schema failed: unexpected data type: 'string', line 6, col 29",
		walker.BuildErrors[0].Error.Error())

}

func TestWalker_WalkV3_Parameter_Examples(t *testing.T) {

	yml := `openapi: 3.1.0
components:
 parameters:
   hello:
     examples:
       test:
         value: hello
 `

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	creds := walked.Components.Parameters.GetOrZero("hello").Examples.GetOrZero("test").GenerateJSONPath()
	assert.Equal(t, "$.components.parameters['hello'].examples['test']", creds)

}

func TestWalker_WalkV3_Missing_Operations(t *testing.T) {

	yml := `openapi: 3.1.0
paths:
  /hello:
    options:
      description: hello
    head:
      description: hello
    trace:
      description: hello
    patch:
      description: hello
    servers:
      - url: https://pb33f.io
  `

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	op := walked.Paths.PathItems.GetOrZero("/hello").Options.GenerateJSONPath()
	assert.Equal(t, "$.paths['/hello'].options", op)

	op = walked.Paths.PathItems.GetOrZero("/hello").Head.GenerateJSONPath()
	assert.Equal(t, "$.paths['/hello'].head", op)

	op = walked.Paths.PathItems.GetOrZero("/hello").Trace.GenerateJSONPath()
	assert.Equal(t, "$.paths['/hello'].trace", op)

	op = walked.Paths.PathItems.GetOrZero("/hello").Patch.GenerateJSONPath()
	assert.Equal(t, "$.paths['/hello'].patch", op)

	op = walked.Paths.PathItems.GetOrZero("/hello").Servers[0].GenerateJSONPath()
	assert.Equal(t, "$.paths['/hello'].servers[0]", op)

}

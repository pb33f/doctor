// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	"fmt"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/index"
	"github.com/stretchr/testify/require"
	"os"
	"testing"
	"time"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/stretchr/testify/assert"
)

func TestWalker_TestSelfReferences(t *testing.T) {

	// create a libopenapi document
	var bytes []byte
	var newDoc libopenapi.Document
	measureExecutionTime("load", func() {
		bytes, _ = os.ReadFile("../test_specs/root.yaml")
	})

	var err error
	var errs []error
	measureExecutionTime("new doc", func() {

		docConfig := datamodel.DocumentConfiguration{
			BasePath:            "../test_specs",
			AllowFileReferences: true,
		}

		newDoc, err = libopenapi.NewDocumentWithConfiguration(bytes, &docConfig)
		require.NoError(t, err)
	})

	var v3Docs *libopenapi.DocumentModel[v3.Document]
	measureExecutionTime("build model", func() {
		v3Docs, errs = newDoc.BuildV3Model()
		require.Empty(t, errs)
	})

	var walker *DrDocument
	measureExecutionTime("new walker", func() {
		walker = NewDrDocument(v3Docs)
	})

	assert.Equal(t, 0, len(walker.Schemas))
	assert.Equal(t, "Success", walker.V3Document.Paths.PathItems.GetOrZero("/v3/test").Get.Responses.Codes.GetOrZero("200").Value.Description)

	// this is a self reference, it will be empty.
	assert.Empty(t, walker.V3Document.Paths.PathItems.GetOrZero("/v3/test").Get.Responses.Codes.GetOrZero("200").Content.GetOrZero("application/json").SchemaProxy.Schema.Value.Description)

}

func TestWalker_TestStripe(t *testing.T) {

	// create a libopenapi document
	var bytes []byte
	var newDoc libopenapi.Document
	measureExecutionTime("load", func() {
		bytes, _ = os.ReadFile("../test_specs/stripe.yaml")
	})

	measureExecutionTime("new doc", func() {
		newDoc, _ = libopenapi.NewDocument(bytes)
	})

	var v3Docs *libopenapi.DocumentModel[v3.Document]
	measureExecutionTime("build model", func() {
		v3Docs, _ = newDoc.BuildV3Model()
	})

	var walker *DrDocument
	measureExecutionTime("new walker", func() {
		walker = NewDrDocument(v3Docs)
	})

	assert.Equal(t, 16716, len(walker.Schemas))
	assert.Equal(t, 186, len(walker.SkippedSchemas))

}

func TestWalker_TestBurgers(t *testing.T) {

	// create a libopenapi document
	var bytes []byte
	var newDoc libopenapi.Document
	measureExecutionTime("load", func() {
		bytes, _ = os.ReadFile("../test_specs/burgershop.openapi.yaml")
	})

	measureExecutionTime("new doc", func() {
		newDoc, _ = libopenapi.NewDocument(bytes)
	})

	var v3Docs *libopenapi.DocumentModel[v3.Document]
	measureExecutionTime("build model", func() {
		v3Docs, _ = newDoc.BuildV3Model()
	})

	var walker *DrDocument
	measureExecutionTime("new walker", func() {
		walker = NewDrDocument(v3Docs)
	})

	assert.Equal(t, 32, len(walker.Schemas))
	assert.Equal(t, 0, len(walker.SkippedSchemas))

}

func BenchmarkWalker_TestBurgers(b *testing.B) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/burgershop.openapi.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	for n := 0; n < b.N; n++ {
		walker := NewDrDocument(v3Doc)

		assert.Equal(b, 31, len(walker.Schemas))
		assert.Equal(b, 0, len(walker.SkippedSchemas))
	}
}

func BenchmarkWalker_TestStripe(b *testing.B) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/stripe.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	for n := 0; n < b.N; n++ {
		walker := NewDrDocument(v3Doc)
		assert.Equal(b, 15360, len(walker.Schemas))
		assert.Equal(b, 186, len(walker.SkippedSchemas))
	}
}

func BenchmarkWalker_TestCountedSchemas(b *testing.B) {

	// create a libopenapi document
	bytes := []byte(`openapi: 3.1.0
paths:
  /ping:
    get:
      responses:
        '200':
           content:
             mapplication/pizza:
               schema:
                 type: object
                 description: "A ping response"
                 properties:
                   message:
                     type: string
                   chooper:
                     $ref: "#/components/schemas/Three"
             application/json:
               schema:
                 $ref: "#/components/schemas/Two"
components:
  schemas:
    One:
      type: string
    Two: 
      type: string
    Three:
      type: object
      properties:
        prop2: 
          type: string
        prop1:
           $ref: "#/components/schemas/One"
`)

	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	for n := 0; n < b.N; n++ {
		walker := NewDrDocument(v3Doc)
		assert.Equal(b, 6, len(walker.Schemas))
		assert.Equal(b, 0, len(walker.SkippedSchemas))
	}

}

func TestWalker_TestStripe_Old(t *testing.T) {

	// create a libopenapi document
	var bytes []byte
	var newDoc libopenapi.Document
	measureExecutionTime("load", func() {
		bytes, _ = os.ReadFile("../test_specs/stripe-old.yaml")
	})

	measureExecutionTime("new doc", func() {
		newDoc, _ = libopenapi.NewDocument(bytes)
	})

	var v3Docs *libopenapi.DocumentModel[v3.Document]
	measureExecutionTime("build model", func() {
		v3Docs, _ = newDoc.BuildV3Model()
	})

	var walker *DrDocument
	measureExecutionTime("new walker", func() {
		walker = NewDrDocument(v3Docs)
	})

	assert.Equal(t, 12089, len(walker.Schemas))
	assert.Equal(t, 153, len(walker.SkippedSchemas))

}

func BenchmarkWalker_TestStripeOld(b *testing.B) {

	// create a libopenapi document
	bytes, _ := os.ReadFile("../test_specs/stripe-old.yaml")
	newDoc, _ := libopenapi.NewDocument(bytes)
	v3Doc, _ := newDoc.BuildV3Model()

	for n := 0; n < b.N; n++ {
		walker := NewDrDocument(v3Doc)
		assert.NotNil(b, walker)
	}

}

func TestWalker_TestAsana(t *testing.T) {

	// create a libopenapi document
	var bytes []byte
	var newDoc libopenapi.Document
	measureExecutionTime("load", func() {
		bytes, _ = os.ReadFile("../test_specs/asana.yaml")
	})

	measureExecutionTime("new doc", func() {
		newDoc, _ = libopenapi.NewDocument(bytes)
	})

	var v3Docs *libopenapi.DocumentModel[v3.Document]
	measureExecutionTime("build model", func() {
		v3Docs, _ = newDoc.BuildV3Model()
	})

	var walker *DrDocument
	measureExecutionTime("new walker", func() {
		walker = NewDrDocument(v3Docs)
	})

	assert.Equal(t, 974, len(walker.Schemas))
	assert.Equal(t, 0, len(walker.SkippedSchemas))

}

//func TestWalker_TestGraph(t *testing.T) {
//
//	// create a libopenapi document
//	var bytes []byte
//	var newDoc libopenapi.Document
//	measureExecutionTime("load", func() {
//		bytes, _ = os.ReadFile("../test_specs/graph.yaml")
//	})
//
//	measureExecutionTime("new doc", func() {
//		newDoc, _ = libopenapi.NewDocument(bytes)
//	})
//
//	var v3Docs *libopenapi.DocumentModel[v3.Document]
//	measureExecutionTime("build model", func() {
//		v3Docs, _ = newDoc.BuildV3Model()
//	})
//
//	var walker *DrDocument
//	measureExecutionTime("new walker", func() {
//		walker = NewDrDocument(v3Docs)
//	})
//
//	assert.Equal(t, 70181, len(walker.Schemas))
//	assert.Equal(t, 2270, len(walker.SkippedSchemas))
//
//}

// Function to measure the execution time of another function
func measureExecutionTime(name string, fn func()) {
	start := time.Now()           // Record the start time
	fn()                          // Execute the function
	duration := time.Since(start) // Calculate the elapsed time
	fmt.Printf("\n'%s' took %v\n", name, duration)
}

func TestWalker_TestSquare(t *testing.T) {

	// create a libopenapi document
	var bytes []byte
	var newDoc libopenapi.Document
	measureExecutionTime("load", func() {
		bytes, _ = os.ReadFile("../test_specs/square.json")
	})

	measureExecutionTime("new doc", func() {
		newDoc, _ = libopenapi.NewDocument(bytes)
	})

	var v3Docs *libopenapi.DocumentModel[v3.Document]
	measureExecutionTime("build model", func() {
		v3Docs, _ = newDoc.BuildV3Model()
	})

	var walker *DrDocument
	measureExecutionTime("new walker", func() {
		walker = NewDrDocument(v3Docs)
	})
	assert.Equal(t, 3072, len(walker.Schemas))
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

	assert.GreaterOrEqual(t, len(walker.lineObjects), 510)
	//assert.LessOrEqual(t, len(walker.lineObjects), 552)

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

	walker := NewDrDocumentWithConfig(v3Doc, &DrConfig{BuildGraph: false, UseSchemaCache: false})
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

	walker := NewDrDocumentWithConfig(v3Doc, &DrConfig{BuildGraph: false, UseSchemaCache: false})
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

	walker := NewDrDocumentWithConfig(v3Doc, &DrConfig{BuildGraph: false, UseSchemaCache: false})
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

	schemas := walker.Schemas
	assert.Equal(t, 32, len(schemas))

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

func TestWalker_WalkV3_ArrayCircle(t *testing.T) {

	yml := `openapi: 3.1.0
info:
  title: FailureCases
  version: 0.1.0
servers:
  - url: http://localhost:35123
    description: The default server.
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
components:
  schemas:
    Obj:
      type: object
      properties:
        children:
          type: array
          items:
            $ref: '#/components/schemas/Obj'
      required:
        - children
 `

	docConfig := &datamodel.DocumentConfiguration{
		IgnoreArrayCircularReferences: true,
	}

	newDoc, dErr := libopenapi.NewDocumentWithConfiguration([]byte(yml), docConfig)
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, err := newDoc.BuildV3Model()
	if err != nil {
		t.Error(err)
	}

	walker := NewDrDocument(v3Doc)
	walked := walker.V3Document

	children := walked.Components.Schemas.GetOrZero("Obj").Schema.Properties.GetOrZero("children").GenerateJSONPath()
	assert.Equal(t, "$.components.schemas['Obj'].properties['children']", children)

}

func TestWalker_WalkV3_Disabled_Security(t *testing.T) {

	yml := `openapi: 3.1.0
paths:
    /hello:
        get:
            description: hello
            security: []`

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

	assert.Equal(t, []*drV3.SecurityRequirement{}, walked.Paths.PathItems.GetOrZero("/hello").Get.Security)
}

func TestWalker_WalkV3_Path_With_No_Security(t *testing.T) {

	yml := `openapi: 3.1.0
paths:
    /hello:
        get:
            description: hello`

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

	assert.Equal(t, []*drV3.SecurityRequirement(nil), walked.Paths.PathItems.GetOrZero("/hello").Get.Security)
}

func TestWalker_WalkV3_Path_With_Security(t *testing.T) {

	yml := `openapi: "3.0.1"

info:
  title: Test
  version: 1.0.0

paths: {}

components:
  schemas:
    A:
      type: object
      properties: {}

    B:
      type: object
      allOf:
        - $ref: '#/components/schemas/A'
      properties:
        children:
          type: array
          items:
            $ref: '#/components/schemas/B'`

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

	assert.Equal(t, "object", walked.Components.Schemas.GetOrZero("B").Schema.Value.Type[0])

}

func TestWalker_WalkV3_ExtractTagNodes(t *testing.T) {

	yml := `openapi: "3.1.0"
tags:
  - name: hello
    description: world
  - name: foo
    description: bar`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)

	f := walker.lineObjects[3][0].(*drV3.Tag)

	assert.Equal(t, "hello", f.Value.Name)
	assert.Equal(t, "$.tags[0]", f.GenerateJSONPath())

	// test the locate methods
	l, e := walker.LocateModelByLine(3)
	assert.NoError(t, e)
	assert.Equal(t, f, l[0])

	// test the locate methods
	ll, e := walker.LocateModel(l[0].(*drV3.Tag).ValueNode)
	assert.NoError(t, e)
	assert.Len(t, ll, 1)
	assert.Equal(t, f, ll[0])

}

func TestWalker_WalkV3_ExtractSecurity(t *testing.T) {

	yml := `openapi: "3.1.0"
security:
  - OAuthScheme:
      - read:burgers
      - write:burgers
  - ChewyBurgers:
      - read:cakes
      - write:candy
`

	newDoc, dErr := libopenapi.NewDocument([]byte(yml))
	if dErr != nil {
		t.Error(dErr)
	}
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)

	assert.Equal(t, "OAuthScheme", walker.lineObjects[3][0].(*drV3.SecurityRequirement).Value.Requirements.First().Key())
	assert.Equal(t, "$.security[0]", walker.lineObjects[3][0].(*drV3.SecurityRequirement).GenerateJSONPath())

}

func TestMultiRefLookup(t *testing.T) {

	bytes, _ := os.ReadFile("../test_specs/test-relative/spec.yaml")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs/test-relative",
		SpecFilePath:        "test_specs/test-relative/spec.yaml",
		AllowFileReferences: true,
	})
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocumentWithConfig(v3Doc, &DrConfig{BuildGraph: false, UseSchemaCache: false})
	assert.NotNil(t, walker)

	// extract a file from the rolodex
	colors, err := walker.GetIndex().GetRolodex().Open("colors/schemas.yaml")

	assert.NoError(t, err)
	assert.NotNil(t, colors)

	// extract another file from the rolodex that has an identical key models.
	lemons, err := walker.GetIndex().GetRolodex().Open("lemons/schemas.yaml")

	assert.NoError(t, err)
	assert.NotNil(t, lemons)

	colorsRoot, err := colors.GetContentAsYAMLNode()
	assert.NoError(t, err)

	colorsKeyNode := colorsRoot.Content[0].Content[0]
	colorsValueNode := colorsRoot.Content[0].Content[1]
	assert.Equal(t, "Yellow", colorsKeyNode.Value)

	lemonsRoot, err := lemons.GetContentAsYAMLNode()
	assert.NoError(t, err)

	lemonsKeyNode := lemonsRoot.Content[0].Content[0]
	lemonsValueNode := lemonsRoot.Content[0].Content[1]
	assert.Equal(t, "Yellow", lemonsKeyNode.Value)

	// if we hash the keys, they should be identical
	assert.Equal(t, index.HashNode(colorsKeyNode), index.HashNode(lemonsKeyNode))

	// if we hash the values, they should be completely different.
	assert.NotEqual(t, index.HashNode(lemonsValueNode), index.HashNode(colorsValueNode))

	// extract an object that is deeply referenced
	yellowObject := walker.V3Document.Paths.PathItems.GetOrZero("/v3/test").Get.Responses.Codes.GetOrZero("200").Content.GetOrZero("application/json").SchemaProxy.Schema
	yellowKeyNode := yellowObject.KeyNode
	yellowValueNode := yellowObject.ValueNode
	assert.NotNil(t, yellowObject)
	assert.NotNil(t, yellowKeyNode)
	assert.NotNil(t, yellowValueNode)

	models, err := walker.LocateModelsByKeyAndValue(yellowKeyNode, yellowValueNode)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Equal(t, "$.paths['/v3/test'].get.responses['200'].content['application/json'].schema", models[0].GenerateJSONPath())

	yellowObject2 := walker.V3Document.Paths.PathItems.GetOrZero("/v3/test").Get.Responses.Codes.GetOrZero("200").Content.GetOrZero("application/json").SchemaProxy.Schema.Properties.GetOrZero("color")
	yellowKeyNode2 := yellowObject2.KeyNode
	yellowValueNode2 := yellowObject2.ValueNode
	assert.NotNil(t, yellowObject2)
	assert.NotNil(t, yellowKeyNode2)
	assert.NotNil(t, yellowValueNode2)

	// there are two ways to get to this model.
	models, err = walker.LocateModelsByKeyAndValue(yellowKeyNode2, yellowValueNode2)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 2)

	assert.Equal(t, "$.paths['/v3/test'].get.responses['200'].content['application/json'].schema.properties['color']", models[1].GenerateJSONPath())
	assert.Equal(t, "$.components.schemas['Fruit'].properties['lemon'].properties['color']", models[0].GenerateJSONPath())

	// extract an object that is deeply referenced
	testObject := walker.V3Document.Components.Schemas.GetOrZero("Fruit").Schema.Properties.GetOrZero("orange").Schema
	testObject2 := walker.V3Document.Components.Schemas.GetOrZero("Fruit").Schema.Properties.GetOrZero("orange").Schema.Properties.GetOrZero("subtype").Schema
	testObject3 := walker.V3Document.Components.Schemas.GetOrZero("Fruit").Schema.Properties.GetOrZero("orange").Schema.Properties.GetOrZero("subtype").Schema.Properties.GetOrZero("color").Schema

	testKeyNode := testObject.KeyNode
	testValueNode := testObject.ValueNode
	testKeyNode2 := testObject2.Value.GoLow().Properties.GetKeyNode()
	testValueNode2 := testObject2.Value.GoLow().Properties.GetValueNode()
	testKeyNode3 := testObject3.KeyNode
	testValueNode3 := testObject3.ValueNode

	models, err = walker.LocateModelsByKeyAndValue(testKeyNode, testValueNode)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 1)
	assert.Equal(t, "$.components.schemas['Fruit'].properties['orange']", models[0].GenerateJSONPath())
	assert.Equal(t, 23, models[0].GetKeyNode().Line)
	assert.Equal(t, 9, models[0].GetKeyNode().Column)
	assert.Equal(t, 5, models[0].GetValueNode().Line)
	assert.Equal(t, 9, models[0].GetValueNode().Column)

	models, err = walker.LocateModelsByKeyAndValue(testKeyNode2, testValueNode2)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 1)
	assert.Equal(t, "$.components.schemas['Fruit'].properties['orange'].properties['subtype']", models[0].GenerateJSONPath())
	assert.Equal(t, 12, models[0].GetKeyNode().Line)
	assert.Equal(t, 13, models[0].GetKeyNode().Column)
	assert.Equal(t, 5, models[0].GetValueNode().Line)
	assert.Equal(t, 9, models[0].GetValueNode().Column)

	models, err = walker.LocateModelsByKeyAndValue(testKeyNode3, testValueNode3)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 1)
	assert.Equal(t, "$.components.schemas['Fruit'].properties['orange'].properties['subtype'].properties['color']", models[0].GenerateJSONPath())
	assert.Equal(t, 9, models[0].GetKeyNode().Line)
	assert.Equal(t, 13, models[0].GetKeyNode().Column)
	assert.Equal(t, 8, models[0].GetValueNode().Line)
	assert.Equal(t, 3, models[0].GetValueNode().Column)

}

func TestMultiRefLookup_PetStore_Pet(t *testing.T) {

	bytes, _ := os.ReadFile("../test_specs/petstorev3.json")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs",
		SpecFilePath:        "test_specs/petstorev3.json",
		AllowFileReferences: true,
	})
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	assert.NotNil(t, walker)

	// extract an object that is deeply referenced
	pet := walker.V3Document.Components.Schemas.GetOrZero("Pet")
	petKeyNode := pet.KeyNode
	petValueNode := pet.ValueNode
	assert.NotNil(t, pet)
	assert.NotNil(t, petKeyNode)
	assert.NotNil(t, petValueNode)

	models, err := walker.LocateModelsByKeyAndValue(petKeyNode, petValueNode)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 1)
	assert.Equal(t, "$.components.schemas['Pet']", models[0].GenerateJSONPath())

	petPropsKeyNode := pet.Value.GoLow().Schema().Properties.GetKeyNode()
	petPropsValueNode := pet.Value.GoLow().Schema().Properties.GetKeyNode()

	// there are 19 ways to get to this model schema.
	models, err = walker.LocateModelsByKeyAndValue(petPropsKeyNode, petPropsValueNode)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 19)

	// log the models
	//for _, m := range models {
	//	fmt.Println(fmt.Sprintf("%d -- %s", m.GetKeyNode().Line, m.GenerateJSONPath()))
	//}

	assert.Equal(t, "$.components.requestBodies['Pet'].content['application/xml'].schema", models[1].GenerateJSONPath())
	assert.Equal(t, "$.components.requestBodies['Pet'].content['application/json'].schema", models[0].GenerateJSONPath())
	assert.Equal(t, 1180, models[0].GetKeyNode().Line)

}

func TestMultiRefLookup_PetStore_ApiResponse(t *testing.T) {

	bytes, _ := os.ReadFile("../test_specs/petstorev3.json")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs",
		SpecFilePath:        "test_specs/petstorev3.json",
		AllowFileReferences: true,
	})
	v3Doc, _ := newDoc.BuildV3Model()

	walker := NewDrDocument(v3Doc)
	assert.NotNil(t, walker)

	// extract an object that is deeply referenced
	apiResponse := walker.V3Document.Components.Schemas.GetOrZero("ApiResponse")
	apiKeyNode := apiResponse.KeyNode
	apiValueNode := apiResponse.ValueNode
	assert.NotNil(t, apiResponse)
	assert.NotNil(t, apiKeyNode)
	assert.NotNil(t, apiValueNode)

	models, err := walker.LocateModelsByKeyAndValue(apiKeyNode, apiValueNode)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 1)
	assert.Equal(t, "$.components.schemas['ApiResponse']", models[0].GenerateJSONPath())

	apiPropsKeyNode := apiResponse.Value.GoLow().Schema().Properties.GetKeyNode()
	apiPropsValueNode := apiResponse.Value.GoLow().Schema().Properties.GetKeyNode()

	// there are 19 ways to get to this model schema.
	models, err = walker.LocateModelsByKeyAndValue(apiPropsKeyNode, apiPropsValueNode)
	assert.NoError(t, err)
	assert.NotNil(t, models)
	assert.Len(t, models, 2)

	// log the models
	//for _, m := range models {
	//	fmt.Println(fmt.Sprintf("%d -- %s", m.GetKeyNode().Line, m.GenerateJSONPath()))
	//}

	assert.Equal(t, "$.paths['/pet/{petId}/uploadImage'].post.responses['200'].content['application/json'].schema", models[1].GenerateJSONPath())
	assert.Equal(t, "$.components.schemas['ApiResponse']", models[0].GenerateJSONPath())
	assert.Equal(t, 1156, models[0].GetKeyNode().Line)

}

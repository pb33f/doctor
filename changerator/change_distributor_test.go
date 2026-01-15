// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"encoding/json"
	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func TestTardis_Changerate(t *testing.T) {

	ymlLeft := `openapi: "3.1
tags:
 - name: blip"
servers:
  - url: http://hello.com
  - url: http://jello.com
info:
  title: chip
  contact:
    name: hello
paths:
  /one:
    x-thing: bing
    get:
      parameters:
        - description: poep"
components:
  schemas:
    Cheese:
      description: nice slice
      anyOf:
        - description: lemons
      contains:
        description: peep`

	ymlRight := `openapi: "3.1"
info:
  title: chop"
  contact:
    name: there
servers:
  - url: http://hello.com
  - url: http://jello.com
  - url: http://bello.com
tags:
  - name: blop
paths:
  /one:
    x-thing: bap
    get:
      parameters:
        - description: peep
components:
  schemas:
    Cheese:
      description: nice rice
      anyOf:
        - description: limes
      contains:
        description: poop`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	cd.Changerify(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

}

func TestTardis_Changerate_Changeify(t *testing.T) {

	ymlLeft := `openapi: "3.1"
info:
  title: chip
  description: what is going on?
  contact:
    name: hello`

	ymlRight := `openapi: "3.1"
info:
  title: chop
  contact:
    name: there
    url: http://fresh.com`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	// render out root node.
	rootNode := rightDoc.V3Document.Node

	data, e := json.MarshalIndent(rootNode, "", "  ")
	assert.NoError(t, e)

	assert.Greater(t, len(data), 10)

}

func TestTardis_Changerate_Changeify_Schemas(t *testing.T) {

	ymlLeft := `openapi: 3.1.0
paths:
  /v3/{jollyRoger}:  
    get:
      responses: 
        "200":
          description: holly?
          content:
            application/json:
              schema:
                type: object
                properties:
                  misty:
                    type: boolean 
                  monkey:
                    type: boolean
                  clicky:
                    type: object
                    description: pizza`

	ymlRight := `openapi: 3.1.0
paths:
  /v3/{jollyRoger}:  
    get:
      responses: 
        "200":
          description: holly?
          content:
            application/json:
              schema:
                type: object
                properties:
                  misty:
                    type: string 
                  monkey:
                    type: string
                  clicky:
                    type: boolean
                    description: nice rice`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	// render out root node.
	rootNode := rightDoc.V3Document.Node

	data, e := json.MarshalIndent(rootNode, "", "  ")
	assert.NoError(t, e)

	assert.Greater(t, len(data), 10)

}

func TestTardis_TagAddEdit(t *testing.T) {

	ymlLeft := `openapi: "3.1"
tags:
 - name: blap
   description: shoes`

	ymlRight := `openapi: "3.1"
tags:
  - name: blap
    description: shoess
  - name: blop
    description: feet
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

}

func TestTardis_ResponseBodyTest(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
    /test/two/{cakes}:
       post:
          requestBody: 
            description: hello my little one
            content:
                application/json:
                    schema:
                        type: string`

	ymlRight := `openapi: "3.1"
paths:
    /test/two/{cakes}:
       post:
          requestBody:
            #description: hello my little
            content:
                application/json:
                    schema:
                        type: string
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

}

func TestTardis_CodesTest(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
    /test/two/{cakes}:
       post:
         responses:
            '200':
                description: hello
            '400':
                description: hello my old mate`

	ymlRight := `openapi: "3.1"
paths:
    /test/two/{cakes}:
       post:
         responses:
            '200':
                description: hello
            '400':
                description: hello my old mate
            '404':
                description: hello my old mate
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

}

func TestTardis_SchemaRefTest(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
  "/test/two/{cakes}":
    post:
      responses:
        "200":
          content:
            application/json:
              schema:
                properties:
                  cheese:
components:
  schemas:
    cheese:
      type: string`

	ymlRight := `openapi: "3.1"
paths:
  "/test/two/{cakes}":
    post:
      responses:
        "200":
          content:
            application/json:
              schema:
                properties:
                  cheese:
                    $ref: "#/components/schemas/cheese"
components:
  schemas:
    cheese:
      type: string
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
	// Note: Unmarshal is not tested - Node serialization is one-way (to clients)
	// The "nodes" field is serialized as []string (IDs) not []*Node
}

func TestTardis_SchemaParamSchemaRefTest(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
  /test/two/{cakes}:
    post:
      parameters:
        - in: header
          schema:
            type: object
            properties:
              nice:
components:
  schemas:
    cheese:
      type: string`

	ymlRight := `openapi: "3.1"
paths:
  /test/two/{cakes}:
    post:
      parameters:
        - in: header
          schema:
            type: object
            properties:
              nice:
                $ref: '#/components/schemas/cheese'
components:
  schemas:
    cheese:
      type: string
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
}

func TestTardis_ModifySecurityScheme(t *testing.T) {

	ymlLeft := `openapi: "3.1"
components:
  securitySchemes:
    winko:
      type: http
      scheme: basic`

	ymlRight := `openapi: "3.1"
components:
  securitySchemes:
    winko:
      type: http
      scheme: basic
      description: blabbo
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
}

func TestTardis_ModifyRef(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
  /hello:
    post:
      requestBody:
        $ref: '#/components/requestBodies/pop'
components:
  requestBodies:
    pop:
      content:
        application/json:
          schema:
            type: object
            const: wink`

	ymlRight := `openapi: "3.1"
paths:
  /hello:
    post:
      requestBody:
        $ref: '#/components/requestBodies/pop'
components:
  requestBodies:
    pop:
      content:
        application/json:
          schema:
            type: object
            const: wonk
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
}

func TestTardis_Callback(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
    /test/two/{cakes}:
        post:
          callbacks:
             '{$request.query.queryUrl}':
                  post:
                     description: hello there`

	ymlRight := `openapi: "3.1"
paths:
    /test/two/{cakes}:
        post:
          callbacks:
             '{$request.query.queryUrl}':
                  post:
                     description: hello
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
}

func TestTardis_CallbackPathItem(t *testing.T) {

	ymlLeft := `openapi: "3.1"
paths:
    /test/two/{cakes}:
        post:
          callbacks:
             '{$request.query.queryUrl}':
                  $ref : '#/components/callbacks/hello'
components:
  callbacks:
    hello:
      post:
        description: hello there
`

	ymlRight := `openapi: "3.1"
paths:
    /test/two/{cakes}:
        post:
          callbacks:
             '{$request.query.queryUrl}':
                  $ref : '#/components/callbacks/hello'
components:
  callbacks:
    hello:
      post:
        description: hello there matey
`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
}

func TestTardis_ExtensionTesting(t *testing.T) {

	ymlLeft := `openapi: "3.1"
`

	ymlRight := `openapi: "3.1"
x-burp: hello`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	assert.NotNil(t, cd)

	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
}

func TestTardis_MultiFile_MultiRef(t *testing.T) {

	ymlLeft, _ := os.ReadFile("ref_test/orig/a.yaml")
	ymlRight, _ := os.ReadFile("ref_test/mod/a.yaml")

	l, _ := libopenapi.NewDocumentWithConfiguration(ymlLeft, &datamodel.DocumentConfiguration{
		BasePath:            "ref_test/orig",
		AllowFileReferences: true,
		SpecFilePath:        "ref_test/orig/a.yaml",
		UseSchemaQuickHash:  true,
	})

	leftModel, _ := l.BuildV3Model()
	leftDoc := model.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocumentWithConfiguration(ymlRight, &datamodel.DocumentConfiguration{
		BasePath:            "ref_test/mod",
		AllowFileReferences: true,
		SpecFilePath:        "ref_test/mod/a.yaml",
		UseSchemaQuickHash:  true,
	})

	rightModel, _ := r.BuildV3Model()
	rightDoc := model.NewDrDocumentAndGraph(rightModel)

	assert.NotNil(t, leftDoc)
	assert.NotNil(t, rightDoc)

	// build a changeDistributor
	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	var fings []*v3.Node
	fings = append(fings, rightDoc.V3Document.Node)

	cd.Changerify(fings)

	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)
	cd.PrepareNodesForGraph(rightDoc.V3Document.Node)

	// raster the root node and all changes
	b, _ := json.MarshalIndent(rightDoc.V3Document.Node, "", "  ")
	assert.NotNil(t, b)
	assert.NotNil(t, cd)
	assert.Len(t, cd.ChangedNodes, 9)
	assert.Len(t, cd.ChangedEdges, 8)
	assert.Equal(t, "$.paths['/test'].get.responses['200'].content['application/json'].schema.properties['PropC']", cd.ChangedNodes[0].Id)
}

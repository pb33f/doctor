// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"encoding/json"
	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
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

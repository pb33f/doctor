// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSchemaVisitGuard(t *testing.T) {
	guard := newSchemaVisitGuard()

	assert.True(t, guard.begin(""))
	guard.finish("")

	assert.True(t, guard.begin("schema"))
	assert.False(t, guard.begin("schema"))
	guard.finish("schema")
	assert.False(t, guard.begin("schema"))

	var nilGuard *schemaVisitGuard
	assert.True(t, nilGuard.begin("schema"))
	nilGuard.finish("schema")
}

func TestSchemaVisitKey(t *testing.T) {
	assert.Empty(t, schemaVisitKey(nil))

	empty := &v3.Schema{}
	assert.True(t, strings.HasPrefix(schemaVisitKey(empty), "ptr:"))

	specYaml := `
openapi: 3.1.0
info:
  title: Visit Key Test
  version: 1.0.0
paths: {}
components:
  schemas:
    Thing:
      type: object
      properties:
        id:
          type: string
`
	drDoc := loadDiagramGuardSpec(t, specYaml)
	thing := drDoc.V3Document.Components.Schemas.GetOrZero("Thing")
	require.NotNil(t, thing)
	require.NotNil(t, thing.Schema)

	assert.True(t, strings.HasPrefix(schemaVisitKey(thing.Schema), "path:"))
}

func TestMermaidTardis_DirectSchemaTraversalGuardsPolymorphicReferenceCycle(t *testing.T) {
	specYaml := `
openapi: 3.1.0
info:
  title: Polymorphic Cycle Test
  version: 1.0.0
paths: {}
components:
  schemas:
    Account:
      type: object
      properties:
        owner:
          oneOf:
            - $ref: '#/components/schemas/User'
            - type: string
    User:
      type: object
      properties:
        account:
          $ref: '#/components/schemas/Account'
`
	drDoc := loadDiagramGuardSpec(t, specYaml)
	account := drDoc.V3Document.Components.Schemas.GetOrZero("Account")
	require.NotNil(t, account)
	require.NotNil(t, account.Schema)

	tardis := NewMermaidTardis(DefaultMermaidConfig())
	tardis.document = drDoc.V3Document
	tardis.visitSchema(context.Background(), account.Schema)

	result := tardis.GetDiagram().Render()
	assert.Contains(t, result, "class Account")
	assert.Contains(t, result, "class User")
	assert.Contains(t, result, "Account --> User : owner")
	assert.Contains(t, result, "User *-- Account : account")
}

func loadDiagramGuardSpec(t *testing.T, specYaml string) *model.DrDocument {
	t.Helper()

	doc, err := libopenapi.NewDocument([]byte(specYaml))
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)
	require.NotNil(t, v3Model)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)
	require.NotNil(t, drDoc.V3Document)
	return drDoc
}

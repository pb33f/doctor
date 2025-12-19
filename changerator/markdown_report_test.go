// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package changerator

import (
	"strings"
	"testing"

	"github.com/pb33f/doctor/changerator/renderer"
	drModel "github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
)

func TestChangerator_GenerateMarkdownReport_NoChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint`

	ymlRight := ymlLeft // Same spec, no changes

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	assert.Contains(t, report, "# What Changed?")
	assert.Contains(t, report, "No changes detected between the API versions")
}

func TestChangerator_GenerateMarkdownReport_WithChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
      parameters:
        - name: id
          in: query
          required: false
          schema:
            type: integer
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
        age:
          type: integer`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API Modified
  version: 2.0.0
  description: Added description
paths:
  /test:
    get:
      summary: Updated test endpoint
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string
    post:
      summary: New endpoint
  /new-path:
    query:
      summary: Query operation endpoint
components:
  schemas:
    User:
      type: object
      required: [name]
      properties:
        name:
          type: string
        email:
          type: string
          format: email`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	docChanges := cd.Changerate()
	assert.NotNil(t, docChanges)

	// Build the node change tree
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	report := cd.GenerateMarkdownReport()

	// Check report structure
	assert.Contains(t, report, "# What Changed Report")
	assert.Contains(t, report, "## Change Breakdown")

	// Check for statistics
	assert.Contains(t, report, "changes detected")
	assert.Contains(t, report, "- Additions:")
	assert.Contains(t, report, "- Modifications:")
	assert.Contains(t, report, "- Removals:")

	// Check for table headers
	assert.Contains(t, report, "| Object")

	// Check for domains
	assert.Contains(t, report, "### Document Info")

	// Check for specific changes
	assert.Contains(t, report, "title")
	assert.Contains(t, report, "version")
}

func TestChangerator_GenerateMarkdownReport_BreakingChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
paths:
  /test:
    get:
      parameters:
        - name: id
          in: query
          required: false
          schema:
            type: integer
            format: int32`

	ymlRight := `openapi: "3.1.0"
paths:
  /test:
    get:
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	report := cd.GenerateMarkdownReport()

	// Check for breaking changes indication
	assert.Contains(t, report, "**(💔 breaking)**")
	assert.Contains(t, report, "Breaking Changes")
}

func TestChangerator_GenerateMarkdownReport_QueryOperation(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
paths:
  /search:
    get:
      summary: Search endpoint`

	ymlRight := `openapi: "3.1.0"
paths:
  /search:
    get:
      summary: Search endpoint
    query:
      summary: Query operation for search
      parameters:
        - name: q
          in: query
          schema:
            type: string`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	report := cd.GenerateMarkdownReport()

	// Should handle query operation properly - the query operation is added as a property
	assert.Contains(t, report, "query", "Report should include query operation addition")
}

func TestChangerator_GenerateMarkdownReport_SecurityChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key`

	ymlRight := `openapi: "3.1.0"
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key-V2
      description: Updated API key
    oauth2:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://example.com/oauth`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	report := cd.GenerateMarkdownReport()

	// Check for security-related changes in components (where they actually appear)
	assert.Contains(t, report, "Components", "Report should show security changes under Components")
}

func TestChangerator_GenerateMarkdownReport_Extensions(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
  x-custom-extension: custom value
paths:
  /test:
    x-internal: true
    get:
      summary: Test`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()
	cd.BuildNodeChangeTree(rightDoc.V3Document.Node)

	report := cd.GenerateMarkdownReport()

	// Extensions should be marked but not breaking
	if strings.Contains(report, "Extension") {
		assert.NotContains(t, report, "Extension `x-custom-extension` **(💔 breaking)**")
		assert.NotContains(t, report, "Extension `x-internal` **(💔 breaking)**")
	}
}

func TestFormatValue(t *testing.T) {
	longStr := strings.Repeat("a", 60)
	formatted := renderer.FormatValue(longStr)
	assert.Equal(t, 60, len(formatted), "Long strings should not be truncated")

	assert.Equal(t, "test", renderer.FormatValue("test"))
	assert.Equal(t, "(empty)", renderer.FormatValue(""))
}

// Note: Breaking change detection is now handled by the what-changed library.
// The model.Change struct has a Breaking field that is set during comparison.
// We no longer need custom breaking change detection logic in the Doctor library.

func TestChangerator_GenerateMarkdownReport_LicenseChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	// Check for license changes
	assert.Contains(t, report, "License", "Report should include License section")
	assert.Contains(t, report, "Apache 2.0", "Report should show new license")
	assert.Contains(t, report, "changed to", "Report should show change format")
}

func TestChangerator_GenerateMarkdownReport_ContactChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
  contact:
    name: Support Team
    email: support@example.com`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
  contact:
    name: Developer Relations
    email: devrel@example.com
    url: https://example.com/contact`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	// Check for contact changes
	assert.Contains(t, report, "Contact", "Report should include Contact section")
	assert.Contains(t, report, "name", "Report should show name change")
	assert.Contains(t, report, "email", "Report should show email change")
}

func TestChangerator_GenerateMarkdownReport_ServerChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
servers:
  - url: https://api.example.com/v2
    description: Production server (v2)`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	// Check for server changes - shows line number since it's a server replacement
	assert.Contains(t, report, "Servers", "Report should include Servers section")
	assert.Contains(t, report, "Server", "Report should show Server identifier")
	assert.Contains(t, report, "/v1", "Report should show original URL")
	assert.Contains(t, report, "/v2", "Report should show new URL")
}

func TestChangerator_GenerateMarkdownReport_MultipleServerChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging.example.com
    description: Staging server
  - url: https://dev.example.com
    description: Development server`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging.example.com
    description: Updated staging server
  - url: https://dev.example.com
    description: Development server`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	// Should show staging server specifically
	assert.Contains(t, report, "Servers", "Report should include Servers section")
	assert.Contains(t, report, "staging.example.com", "Report should identify which server changed")
	assert.Contains(t, report, "Updated staging", "Report should show new description")
}

func TestChangerator_GenerateMarkdownReport_DocumentExtensions(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
x-api-id: api-12345
x-custom-metadata:
  team: platform
  owner: engineering`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	// Check for extension changes
	assert.Contains(t, report, "Extensions", "Report should include Extensions section")
	assert.Contains(t, report, "x-api-id", "Report should show x-api-id extension")
	assert.Contains(t, report, "x-custom-metadata", "Report should show x-custom-metadata extension")
}

func TestChangerator_GenerateMarkdownReport_TagChanges(t *testing.T) {
	ymlLeft := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
tags:
  - name: Stations
    description: Find and filter train stations across Europe
  - name: Bookings
    description: Create and manage bookings for train trips`

	ymlRight := `openapi: "3.1.0"
info:
  title: Test API
  version: 1.0.0
tags:
  - name: Stations
    description: Find and filter train stations across Europe, including real-time updates
  - name: Bookings
    description: Pay for bookings using a card or bank account`

	l, _ := libopenapi.NewDocument([]byte(ymlLeft))
	leftModel, _ := l.BuildV3Model()
	leftDoc := drModel.NewDrDocumentAndGraph(leftModel)

	r, _ := libopenapi.NewDocument([]byte(ymlRight))
	rightModel, _ := r.BuildV3Model()
	rightDoc := drModel.NewDrDocumentAndGraph(rightModel)

	cd := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDoc.V3Document,
		RightDrDoc: rightDoc.V3Document,
		Doctor:     rightDoc,
	})

	cd.Changerate()

	report := cd.GenerateMarkdownReport()

	// Check that tags are displayed with their names (using Doctor's LocateModelByLine)
	assert.Contains(t, report, "### Tags", "Report should show Tags section")
	assert.Contains(t, report, "Tag: `Stations`", "Report should show Stations tag name")
	assert.Contains(t, report, "Tag: `Bookings`", "Report should show Bookings tag name")
	assert.Contains(t, report, "description", "Report should show description changes")
}
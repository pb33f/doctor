// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"os"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSingleResponseSchema_IncludesReferencedComponents(t *testing.T) {
	// load the train-travel spec
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// GET JUST the response schema (not full document)
	paths := drDoc.V3Document.Paths
	bookingsPath := paths.PathItems.GetOrZero("/bookings")
	postOp := bookingsPath.Post
	response201 := postOp.Responses.Codes.GetOrZero("201")
	jsonContent := response201.Content.GetOrZero("application/json")
	schema := jsonContent.SchemaProxy

	// render ONLY this schema
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), schema, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// expectations when rendering a single response schema:
	// 1. Should have CreateBooking201Response
	assert.Contains(t, result, "CreateBooking201Response", "Should have response class")

	// 2. Should have Links-Self class (referenced by the links property)
	assert.Contains(t, result, "class Links_Self", "Should include referenced Links-Self component")

	// 3. Should have Booking class (referenced by allOf)
	assert.Contains(t, result, "class Booking", "Should include referenced Booking component")

	// 4. Booking should have its properties
	assert.Contains(t, result, "id", "Booking should have id property")
	assert.Contains(t, result, "trip_id", "Booking should have trip_id property")

	// 5. CreateBooking201Response should only have links, not Booking properties
	// Note: Links-Self is sanitized to Links_Self for mermaid compatibility
	assert.Contains(t, result, "Links_Self? links", "CreateBooking201Response should have links property")

	// 6. Should show proper relationships
	assert.Contains(t, result, "Booking <|-- CreateBooking201Response : extends", "Should inherit from Booking")
	assert.Contains(t, result, "CreateBooking201Response *-- Links_Self : links", "Should compose Links-Self")
}

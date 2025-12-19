// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"context"
	"os"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestTrainTravel_GetBookings200Response(t *testing.T) {
	// load the train-travel spec
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// navigate to GET /bookings -> 200 response -> application/json -> schema
	paths := drDoc.V3Document.Paths
	require.NotNil(t, paths)

	bookingsPath := paths.PathItems.GetOrZero("/bookings")
	require.NotNil(t, bookingsPath)

	getOp := bookingsPath.Get
	require.NotNil(t, getOp)
	assert.Equal(t, "get-bookings", getOp.Value.OperationId)

	response200 := getOp.Responses.Codes.GetOrZero("200")
	require.NotNil(t, response200)

	jsonContent := response200.Content.GetOrZero("application/json")
	require.NotNil(t, jsonContent)

	schema := jsonContent.SchemaProxy
	require.NotNil(t, schema)

	// render the schema as a diagram
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), schema, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Generated diagram:\n%s", result)

	// expectations:
	// 1. Should have a class named "GetBookings200Response" (from operationId + status code)
	assert.Contains(t, result, "GetBookings200Response", "Should use semantic naming based on operationId")

	// 2. Should NOT have ugly generated names like "paths__bookings_get..."
	assert.NotContains(t, result, "paths__bookings_get", "Should not have path-based naming")
	assert.NotContains(t, result, "allOf_0", "Should not have allOf member classes")

	// 3. Should have flattened properties from the allOf with correct types
	assert.Contains(t, result, "Booking[]", "Should have data property with Booking array type")
	assert.Contains(t, result, "links", "Should have links property from allOf")

	// 4. Should show inheritance relationship to base schema (hyphen becomes underscore in Mermaid IDs)
	assert.Contains(t, result, "Wrapper_Collection <|-- GetBookings200Response", "Should inherit from base schema")
	assert.Contains(t, result, "extends", "Should show 'extends' label")

	// 5. Should show relationship to Booking
	assert.Contains(t, result, "Booking", "Should reference Booking schema")

	// 6. Should NOT create classes for primitive properties
	assert.NotContains(t, result, "class id", "Should not create class for id property")
	assert.NotContains(t, result, "class trip_id", "Should not create class for trip_id property")

	// 7. Should NOT show Booking's properties inline in the response
	// (they should only be in the Booking class itself)
	assert.NotContains(t, result, "CreateBooking201Response {", "Should not confuse this test with 201 response")
}

func TestTrainTravel_CreateBooking201Response(t *testing.T) {
	// load the train-travel spec
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// render the FULL document so component schemas are included
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), drDoc.V3Document, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	t.Logf("Full diagram generated")

	// Extract just the CreateBooking201Response portion for testing
	lines := strings.Split(result, "\n")
	var responseLines []string
	inResponseClass := false
	for _, line := range lines {
		if strings.Contains(line, "class CreateBooking201Response") {
			inResponseClass = true
		}
		if inResponseClass {
			responseLines = append(responseLines, line)
			if strings.Contains(line, "}") {
				break
			}
		}
	}
	t.Logf("CreateBooking201Response class:\n%s", strings.Join(responseLines, "\n"))

	// expectations:
	// 1. Should have CreateBooking201Response class
	assert.Contains(t, result, "CreateBooking201Response", "Should use semantic naming")

	// 2. CreateBooking201Response should ONLY show the ADDED properties (links), not Booking properties
	assert.Contains(t, result, "class CreateBooking201Response", "Should have response class")

	// Check that CreateBooking201Response does NOT have Booking's properties inline
	for _, line := range responseLines {
		if strings.TrimSpace(line) == "}" || strings.Contains(line, "class ") || strings.Contains(line, "<<") {
			continue
		}
		// inside CreateBooking201Response class - should only have links
		assert.NotContains(t, line, "id", "CreateBooking201Response should not have id property inline")
		assert.NotContains(t, line, "trip_id", "CreateBooking201Response should not have trip_id property inline")
		assert.NotContains(t, line, "passenger_name", "CreateBooking201Response should not have passenger_name property inline")
	}

	// 3. Should have Booking as a separate class
	assert.Contains(t, result, "class Booking", "Booking should be its own class")

	// 4. Should show inheritance relationship to Booking
	assert.Contains(t, result, "Booking <|-- CreateBooking201Response : extends", "Should inherit from Booking")

	// 5. Should show composition relationship to Links-Self
	assert.Contains(t, result, "CreateBooking201Response *-- Links_Self : links", "Should compose Links-Self")
}

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

func TestTrainTravel_FullDocument(t *testing.T) {
	// load the train-travel spec
	specBytes, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(specBytes)
	require.NoError(t, err)

	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocument(v3Model)
	require.NotNil(t, drDoc)

	// render the FULL DOCUMENT so Components get visited
	config := DefaultMermaidConfig()
	diagram := Mermaidify(context.Background(), drDoc.V3Document, config)
	require.NotNil(t, diagram)

	result := diagram.Render()
	resultLines := strings.Split(result, "\n")
	maxLines := 100
	if len(resultLines) < maxLines {
		maxLines = len(resultLines)
	}
	t.Logf("Generated diagram (first %d lines):\n%s", maxLines, strings.Join(resultLines[:maxLines], "\n"))

	// expectations:
	// 1. Should have Booking class from Components
	assert.Contains(t, result, "class Booking", "Booking should be its own class from Components")

	// 2. Should have CreateBooking201Response
	assert.Contains(t, result, "CreateBooking201Response", "Should have response class")

	// 3. CreateBooking201Response should only have 'links' property, NOT Booking's properties
	lines := strings.Split(result, "\n")
	inResponseClass := false
	responseClassLines := []string{}
	for _, line := range lines {
		if strings.Contains(line, "class CreateBooking201Response") {
			inResponseClass = true
			responseClassLines = append(responseClassLines, line)
			continue
		}
		if inResponseClass {
			responseClassLines = append(responseClassLines, line)
			if strings.Contains(line, "}") {
				break
			}
		}
	}

	t.Logf("\nCreateBooking201Response class:\n%s", strings.Join(responseClassLines, "\n"))

	// Check properties in CreateBooking201Response
	for _, line := range responseClassLines {
		if strings.TrimSpace(line) == "}" || strings.Contains(line, "class ") || strings.Contains(line, "<<") {
			continue
		}
		// Should only have links property
		assert.NotContains(t, line, "id", "Should not have id from Booking")
		assert.NotContains(t, line, "trip_id", "Should not have trip_id from Booking")
		assert.NotContains(t, line, "passenger_name", "Should not have passenger_name from Booking")
	}

	// 4. Should show proper relationships
	assert.Contains(t, result, "Booking <|-- CreateBooking201Response : extends", "Should inherit from Booking")
	assert.Contains(t, result, "CreateBooking201Response *-- Links_Self : links", "Should compose Links-Self")
}

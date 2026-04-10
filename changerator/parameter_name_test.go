// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"os"
	"testing"

	drModel "github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestParameterNames_PopulatedAfterChangerate(t *testing.T) {
	leftBytes, err := os.ReadFile("../test_specs/petstorev3-original.json")
	require.NoError(t, err)
	rightBytes, err := os.ReadFile("../test_specs/petstorev3-openapi-changes.json")
	require.NoError(t, err)

	leftDoc, err := libopenapi.NewDocument(leftBytes)
	require.NoError(t, err)
	leftModel, err := leftDoc.BuildV3Model()
	require.NoError(t, err)
	leftDrDoc := drModel.NewDrDocumentAndGraph(leftModel)
	t.Cleanup(leftDrDoc.Release)

	rightDoc, err := libopenapi.NewDocument(rightBytes)
	require.NoError(t, err)
	rightModel, err := rightDoc.BuildV3Model()
	require.NoError(t, err)
	rightDrDoc := drModel.NewDrDocumentAndGraph(rightModel)
	t.Cleanup(rightDrDoc.Release)

	cr := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDrDoc.V3Document,
		RightDrDoc: rightDrDoc.V3Document,
		Doctor:     rightDrDoc,
	})
	cr.Changerate()

	require.NotNil(t, cr.ParameterNames, "ParameterNames should be populated after Changerate")
	assert.NotEmpty(t, cr.ParameterNames, "ParameterNames should contain entries for petstore parameters")
}

func TestResolveParameterName_ReturnsName(t *testing.T) {
	leftBytes, err := os.ReadFile("../test_specs/petstorev3-original.json")
	require.NoError(t, err)
	rightBytes, err := os.ReadFile("../test_specs/petstorev3-openapi-changes.json")
	require.NoError(t, err)

	leftDoc, err := libopenapi.NewDocument(leftBytes)
	require.NoError(t, err)
	leftModel, err := leftDoc.BuildV3Model()
	require.NoError(t, err)
	leftDrDoc := drModel.NewDrDocumentAndGraph(leftModel)
	t.Cleanup(leftDrDoc.Release)

	rightDoc, err := libopenapi.NewDocument(rightBytes)
	require.NoError(t, err)
	rightModel, err := rightDoc.BuildV3Model()
	require.NoError(t, err)
	rightDrDoc := drModel.NewDrDocumentAndGraph(rightModel)
	t.Cleanup(rightDrDoc.Release)

	cr := NewChangerator(&ChangeratorConfig{
		LeftDrDoc:  leftDrDoc.V3Document,
		RightDrDoc: rightDrDoc.V3Document,
		Doctor:     rightDrDoc,
	})
	cr.Changerate()

	// petstore has parameters — verify at least one resolves
	found := false
	for path, name := range cr.ParameterNames {
		assert.NotEmpty(t, name, "parameter name should not be empty for path %s", path)
		resolved := cr.ResolveParameterName(path)
		assert.Equal(t, name, resolved)
		found = true
	}
	assert.True(t, found, "should have found at least one parameter name")
}

func TestResolveParameterName_UnknownPath(t *testing.T) {
	cr := &Changerator{}
	assert.Equal(t, "", cr.ResolveParameterName("$.nonexistent.parameters[0]"))
}

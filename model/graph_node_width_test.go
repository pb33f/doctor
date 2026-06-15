// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"os"
	"testing"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestWalker_TrainTravelSecurityRequirementsNodeWidth(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:     true,
		UseSchemaCache: true,
	})
	require.NotNil(t, drDoc)

	found := 0
	for _, node := range drDoc.Nodes {
		if node.Label != "Security Requirements" || node.Type != "security" {
			continue
		}

		found++
		t.Logf("Security Requirements node width=%d height=%d arrayValues=%d id=%s",
			node.Width, node.Height, node.ArrayValues, node.Id)
		assert.GreaterOrEqual(t, node.Width, 330, "final walked graph node width should leave room for title, count, and expand control")
		assert.LessOrEqual(t, node.Width, 380, "final walked graph node width should not over-expand the title row")
	}

	require.Greater(t, found, 0, "expected train-travel graph to include security requirement nodes")
}

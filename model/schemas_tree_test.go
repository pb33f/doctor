package model_test

import (
	"os"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/require"
)

func TestSchemasTreeChildren(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := model.NewDrDocumentWithConfig(v3Doc, &model.DrConfig{
		BuildGraph:         true,
		DeterministicPaths: true,
		UseSchemaCache:     true,
	})
	require.NotNil(t, drDoc)

	// Find the schemas container node
	var schemasNodeId string
	for _, node := range drDoc.Nodes {
		if node.Type == "schemas" && strings.HasPrefix(node.Id, "$.components") {
			schemasNodeId = node.Id
			t.Logf("Found schemas container: id=%s type=%s label=%s", node.Id, node.Type, node.Label)
			break
		}
	}
	require.NotEmpty(t, schemasNodeId, "Should find schemas container node")

	// Find direct children of schemas node
	t.Log("\n=== Direct children of schemas node ===")
	childCount := 0
	for _, node := range drDoc.Nodes {
		if node.ParentId == schemasNodeId {
			childCount++
			t.Logf("  Child[%d]: id=%s type=%s label=%s", childCount, node.Id, node.Type, node.Label)
			
			// Check if this looks like a response code (should NOT be here)
			if node.Label == "409" || node.Label == "404" || node.Label == "400" || 
			   node.Label == "401" || node.Label == "403" || node.Label == "429" || 
			   node.Label == "500" || node.Label == "200" || node.Label == "201" {
				t.Errorf("UNEXPECTED: Response code %s found under schemas!", node.Label)
			}
			if node.Type == "response" {
				t.Errorf("UNEXPECTED: Response type node under schemas: %s", node.Id)
			}
		}
	}
	t.Logf("Total direct children: %d", childCount)

	// Also check for response-like nodes anywhere under schemas path
	t.Log("\n=== Nodes with schemas path that look like responses ===")
	for _, node := range drDoc.Nodes {
		if strings.Contains(node.Id, "$.components.schemas") {
			if node.Type == "response" || node.Label == "RateLimit" ||
			   node.Label == "409" || node.Label == "404" || node.Label == "400" {
				t.Logf("  SUSPECT: id=%s type=%s label=%s parentId=%s", 
					node.Id, node.Type, node.Label, node.ParentId)
			}
		}
	}
}

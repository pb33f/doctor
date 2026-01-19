package model

import (
	"os"
	"strings"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/require"
)

func TestSchemasChildrenParentIds(t *testing.T) {
	spec, err := os.ReadFile("../test_specs/train-travel.yaml")
	require.NoError(t, err)

	doc, err := libopenapi.NewDocument(spec)
	require.NoError(t, err)

	v3Doc, errs := doc.BuildV3Model()
	require.Empty(t, errs)

	drDoc := NewDrDocumentWithConfig(v3Doc, &DrConfig{
		BuildGraph:         true,
		DeterministicPaths: true,
		UseSchemaCache:     true,
	})
	require.NotNil(t, drDoc)

	// Find schemas node and check its Children slice
	var schemasNode *drV3.Node
	for _, node := range drDoc.Nodes {
		if node.Type == "schemas" && strings.HasPrefix(node.Id, "$.components") {
			schemasNode = node
			break
		}
	}
	require.NotNil(t, schemasNode, "schemas node not found")
	
	t.Logf("Schemas node: id=%s, ParentId=%s", schemasNode.Id, schemasNode.ParentId)
	t.Logf("Schemas node Children count: %d", len(schemasNode.Children))
	
	t.Log("\n=== Children of schemas node (via Children slice) ===")
	for i, child := range schemasNode.Children {
		t.Logf("  Child[%d]: id=%s type=%s label=%s parentId=%s", 
			i, child.Id, child.Type, child.Label, child.ParentId)
		
		// Check if any child is a response
		if child.Type == "response" || 
		   child.Label == "409" || child.Label == "404" || child.Label == "400" ||
		   child.Label == "401" || child.Label == "403" || child.Label == "429" ||
		   child.Label == "500" || child.Label == "200" || child.Label == "201" {
			t.Errorf("UNEXPECTED response-like child under schemas: id=%s type=%s label=%s", 
				child.Id, child.Type, child.Label)
		}
	}
	
	// Also check all nodes with response-like labels to see what their parentId is
	t.Log("\n=== All response-like nodes and their parentIds ===")
	for _, node := range drDoc.Nodes {
		if node.Type == "response" ||
		   node.Label == "409" || node.Label == "404" || node.Label == "400" ||
		   node.Label == "401" || node.Label == "403" || node.Label == "429" ||
		   node.Label == "500" || node.Label == "200" || node.Label == "201" {
			t.Logf("  Response: id=%s type=%s label=%s parentId=%s",
				node.Id, node.Type, node.Label, node.ParentId)
			
			// Check if parentId points to schemas
			if strings.Contains(node.ParentId, "schemas") {
				t.Errorf("UNEXPECTED: Response node has schemas as parent: id=%s parentId=%s", 
					node.Id, node.ParentId)
			}
		}
	}
}

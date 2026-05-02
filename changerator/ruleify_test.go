// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"testing"

	drmodel "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const changeratorRuleifyFixture = `openapi: 3.0.3
info:
  title: Example API
  version: 1.0.0
paths:
  /pets:
    get:
      operationId: listPets
      responses:
        '200':
          description: ok
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
`

func TestRuleifySkipsForwardedRootAggregateResults(t *testing.T) {
	left := buildChangeratorRuleifyDocument(t)
	right := buildChangeratorRuleifyDocument(t)
	leftChild, rightChild := matchedChangeratorRuleifyChildNodes(t, left, right)
	leftChildReceiver := requireChangeratorRuleifyReceiver(t, leftChild)

	result := &v3.RuleFunctionResult{
		RuleId:       "changed-child-owned-result",
		RuleSeverity: "warn",
		Path:         "$",
		ParentObject: leftChild.DrInstance,
	}
	leftChildReceiver.AddRuleFunctionResult(result)

	leftRoot := requireChangeratorRuleifyNode(t, left, "root")
	leftRootReceiver := requireChangeratorRuleifyReceiver(t, leftRoot)
	require.Contains(t, leftRootReceiver.GetRuleFunctionResults(), result, "test requires a forwarded root aggregate")

	rightRoot := requireChangeratorRuleifyNode(t, right, "root")
	rightRootReceiver := requireChangeratorRuleifyReceiver(t, rightRoot)
	rightChildReceiver := requireChangeratorRuleifyReceiver(t, rightChild)

	changer := &Changerator{ChangedNodes: []*v3.Node{rightRoot, rightChild}}
	changer.Ruleify(left)

	assert.Nil(t, changeratorRuleResultByIDOwnedByNode(
		rightRootReceiver.GetRuleFunctionResults(),
		"changed-child-owned-result",
		rightRoot,
	))
	absorbed := changeratorRuleResultByIDOwnedByNode(
		rightChildReceiver.GetRuleFunctionResults(),
		"changed-child-owned-result",
		rightChild,
	)
	if assert.NotNil(t, absorbed, "expected the real changed child target to receive the copied result") {
		assert.Same(t, rightChild.DrInstance, absorbed.ParentObject)
	}
}

func buildChangeratorRuleifyDocument(t *testing.T) *drmodel.DrDocument {
	t.Helper()

	document, err := libopenapi.NewDocument([]byte(changeratorRuleifyFixture))
	require.NoError(t, err)

	v3Model, errs := document.BuildV3Model()
	require.Empty(t, errs)

	doc := drmodel.NewDrDocumentWithConfig(v3Model, &drmodel.DrConfig{
		BuildGraph:         true,
		DeterministicPaths: true,
	})
	require.NotNil(t, doc)
	require.NotEmpty(t, doc.Nodes)
	return doc
}

func matchedChangeratorRuleifyChildNodes(t *testing.T, left, right *drmodel.DrDocument) (*v3.Node, *v3.Node) {
	t.Helper()

	rightNodes := make(map[string]*v3.Node, len(right.Nodes))
	for _, node := range right.Nodes {
		if node != nil && node.Id != "" {
			rightNodes[node.Id] = node
		}
	}
	for _, leftNode := range left.Nodes {
		if leftNode == nil || leftNode.Id == "" || leftNode.DrInstance == nil {
			continue
		}
		if _, ok := leftNode.DrInstance.(v3.AcceptsRuleResults); !ok {
			continue
		}
		leftFoundational, ok := leftNode.DrInstance.(v3.Foundational)
		if !ok || leftFoundational.GetParent() == nil {
			continue
		}
		rightNode := rightNodes[leftNode.Id]
		if rightNode == nil || rightNode.DrInstance == nil {
			continue
		}
		if _, ok := rightNode.DrInstance.(v3.AcceptsRuleResults); !ok {
			continue
		}
		rightFoundational, ok := rightNode.DrInstance.(v3.Foundational)
		if !ok || rightFoundational.GetParent() == nil {
			continue
		}
		return leftNode, rightNode
	}
	require.Fail(t, "expected matching changerator ruleify child nodes")
	return nil, nil
}

func requireChangeratorRuleifyNode(t *testing.T, doc *drmodel.DrDocument, id string) *v3.Node {
	t.Helper()

	for _, node := range doc.Nodes {
		if node != nil && node.Id == id {
			return node
		}
	}
	require.Failf(t, "expected changerator ruleify node", "node %q was not found", id)
	return nil
}

func requireChangeratorRuleifyReceiver(t *testing.T, node *v3.Node) v3.AcceptsRuleResults {
	t.Helper()

	receiver, ok := node.DrInstance.(v3.AcceptsRuleResults)
	require.True(t, ok, "expected node %q to accept rule results", node.Id)
	return receiver
}

func changeratorRuleResultByIDOwnedByNode(results []*v3.RuleFunctionResult, ruleID string, node *v3.Node) *v3.RuleFunctionResult {
	for _, result := range results {
		if result != nil && result.RuleId == ruleID && v3.RuleResultOwnedByNode(result, node) {
			return result
		}
	}
	return nil
}

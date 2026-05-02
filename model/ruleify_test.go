// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRuleifyClonesResultsAndReparentsToMatchedTarget(t *testing.T) {
	left := buildRuleifyTestDocument(t)
	right := buildRuleifyTestDocument(t)
	leftInstance, leftAccepts, rightInstance, rightAccepts := matchedRuleifyTargets(t, left, right)

	result := &drV3.RuleFunctionResult{
		RuleId:       "ruleify-target",
		RuleSeverity: "warn",
		Path:         "$",
		ParentObject: leftInstance,
	}
	leftAccepts.AddRuleFunctionResult(result)

	Ruleify(left, right)

	absorbed := ruleResultByID(rightAccepts.GetRuleFunctionResults(), "ruleify-target")
	require.NotNil(t, absorbed, "expected copied result on matched target")
	assert.NotSame(t, result, absorbed)
	assert.Same(t, leftInstance, result.ParentObject)
	assert.Same(t, rightInstance, absorbed.ParentObject)
}

func TestRuleifySkipsForwardedRootAggregateResults(t *testing.T) {
	left := buildRuleifyTestDocument(t)
	right := buildRuleifyTestDocument(t)
	leftInstance, leftAccepts, rightInstance, rightAccepts := matchedRuleifyTargets(t, left, right)

	result := &drV3.RuleFunctionResult{
		RuleId:       "child-owned-result",
		RuleSeverity: "warn",
		Path:         "$",
		ParentObject: leftInstance,
	}
	leftAccepts.AddRuleFunctionResult(result)

	leftRoot := requireRuleifyNode(t, left, "root")
	leftRootAccepts := requireRuleifyReceiver(t, leftRoot)
	require.Contains(t, leftRootAccepts.GetRuleFunctionResults(), result, "test requires a forwarded root aggregate")

	Ruleify(left, right)

	rightRoot := requireRuleifyNode(t, right, "root")
	rightRootAccepts := requireRuleifyReceiver(t, rightRoot)
	assert.Nil(t, ruleResultByIDOwnedByNode(rightRootAccepts.GetRuleFunctionResults(), "child-owned-result", rightRoot))

	absorbed := ruleResultByIDOwnedByNode(rightAccepts.GetRuleFunctionResults(), "child-owned-result", rightNodeForInstance(t, right, rightInstance))
	if assert.NotNil(t, absorbed, "expected the real child target to receive the copied result") {
		assert.Same(t, rightInstance, absorbed.ParentObject)
	}
}

func buildRuleifyTestDocument(t *testing.T) *DrDocument {
	t.Helper()

	document, err := libopenapi.NewDocument([]byte(lintAbsorptionFixture))
	require.NoError(t, err)

	model, errs := document.BuildV3Model()
	require.Empty(t, errs)

	doc := NewDrDocumentWithConfig(model, &DrConfig{
		BuildGraph:         true,
		DeterministicPaths: true,
	})
	require.NotNil(t, doc)
	require.NotEmpty(t, doc.Nodes)
	return doc
}

func matchedRuleifyTargets(t *testing.T, left, right *DrDocument) (any, drV3.AcceptsRuleResults, any, drV3.AcceptsRuleResults) {
	t.Helper()

	rightNodes := make(map[string]*drV3.Node, len(right.Nodes))
	for _, node := range right.Nodes {
		if node != nil && node.Id != "" {
			rightNodes[node.Id] = node
		}
	}
	for _, leftNode := range left.Nodes {
		if leftNode == nil || leftNode.Id == "" || leftNode.DrInstance == nil {
			continue
		}
		leftAccepts, ok := leftNode.DrInstance.(drV3.AcceptsRuleResults)
		if !ok {
			continue
		}
		leftFoundational, ok := leftNode.DrInstance.(drV3.Foundational)
		if !ok || leftFoundational.GetParent() == nil {
			continue
		}
		rightNode := rightNodes[leftNode.Id]
		if rightNode == nil || rightNode.DrInstance == nil {
			continue
		}
		rightAccepts, ok := rightNode.DrInstance.(drV3.AcceptsRuleResults)
		if !ok {
			continue
		}
		rightFoundational, ok := rightNode.DrInstance.(drV3.Foundational)
		if !ok || rightFoundational.GetParent() == nil {
			continue
		}
		return leftNode.DrInstance, leftAccepts, rightNode.DrInstance, rightAccepts
	}
	require.Fail(t, "expected matching ruleify targets")
	return nil, nil, nil, nil
}

func requireRuleifyNode(t *testing.T, doc *DrDocument, id string) *drV3.Node {
	t.Helper()

	for _, node := range doc.Nodes {
		if node != nil && node.Id == id {
			return node
		}
	}
	require.Failf(t, "expected ruleify node", "node %q was not found", id)
	return nil
}

func rightNodeForInstance(t *testing.T, doc *DrDocument, instance any) *drV3.Node {
	t.Helper()

	for _, node := range doc.Nodes {
		if node != nil && node.DrInstance == instance {
			return node
		}
	}
	require.Fail(t, "expected node for instance")
	return nil
}

func requireRuleifyReceiver(t *testing.T, node *drV3.Node) drV3.AcceptsRuleResults {
	t.Helper()

	receiver, ok := node.DrInstance.(drV3.AcceptsRuleResults)
	require.True(t, ok, "expected node %q to accept rule results", node.Id)
	return receiver
}

func ruleResultByID(results []*drV3.RuleFunctionResult, ruleID string) *drV3.RuleFunctionResult {
	for _, result := range results {
		if result != nil && result.RuleId == ruleID {
			return result
		}
	}
	return nil
}

func ruleResultByIDOwnedByNode(results []*drV3.RuleFunctionResult, ruleID string, node *drV3.Node) *drV3.RuleFunctionResult {
	for _, result := range results {
		if result != nil && result.RuleId == ruleID && drV3.RuleResultOwnedByNode(result, node) {
			return result
		}
	}
	return nil
}

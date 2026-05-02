// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCopyRuleResultsByNodeIDCopiesOwnedChildAndSkipsRootAggregate(t *testing.T) {
	sourceRoot := &Foundation{}
	sourceRoot.SetPathSegment("$")
	sourceChild := &Foundation{Parent: sourceRoot}
	sourceChild.SetPathSegment("child")

	targetRoot := &Foundation{}
	targetRoot.SetPathSegment("$")
	targetChild := &Foundation{Parent: targetRoot}
	targetChild.SetPathSegment("child")

	sourceRootNode := &Node{Id: "root", DrInstance: sourceRoot}
	sourceChildNode := &Node{Id: "$.child", DrInstance: sourceChild}
	targetRootNode := &Node{Id: "root", DrInstance: targetRoot}
	targetChildNode := &Node{Id: "$.child", DrInstance: targetChild}

	result := &RuleFunctionResult{RuleId: "child-owned", ParentObject: sourceChild}
	sourceChild.AddRuleFunctionResult(result)
	require.Contains(t, sourceRoot.GetRuleFunctionResults(), result, "test requires a forwarded root aggregate")

	CopyRuleResultsByNodeID(
		[]*Node{sourceRootNode, sourceChildNode},
		[]*Node{targetRootNode, targetChildNode},
	)

	require.Len(t, targetChild.GetRuleFunctionResults(), 1)
	copied := targetChild.GetRuleFunctionResults()[0]
	assert.NotSame(t, result, copied)
	assert.Same(t, targetChild, copied.ParentObject)
	assert.Len(t, targetRoot.GetRuleFunctionResults(), 1)
	assert.Same(t, copied, targetRoot.GetRuleFunctionResults()[0])
	assert.False(t, RuleResultOwnedByNode(copied, targetRootNode))
}

func TestSourceFileForFoundationalHandlesNilValues(t *testing.T) {
	assert.Empty(t, SourceFileForFoundational(&ruleResultsValueFoundational{
		Foundation: &Foundation{},
		value:      nil,
	}))

	var typedNil *ruleResultsLowModel
	assert.Empty(t, SourceFileForFoundational(&ruleResultsValueFoundational{
		Foundation: &Foundation{},
		value:      typedNil,
	}))
}

type ruleResultsValueFoundational struct {
	*Foundation
	value any
}

func (r *ruleResultsValueFoundational) GetValue() any {
	return r.value
}

type ruleResultsLowModel struct{}

func (*ruleResultsLowModel) GoLowUntyped() any {
	return nil
}

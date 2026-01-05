// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package model

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
)

// Ruleify efficiently copies rule results from a left document (contains RuleResults)
// to a right document (needs RuleResults) by matching nodes and transferring their
// rule results.
//
// Parameters:
//   - left: The source DrDocument containing nodes with RuleResults
//   - right: The target DrDocument where RuleResults will be added
//
// The function modifies the right document in-place.
func Ruleify(left, right *DrDocument) {
	if left == nil || right == nil || len(left.Nodes) == 0 || len(right.Nodes) == 0 {
		return
	}

	leftNodeMap := make(map[string]*v3.Node, len(left.Nodes))
	for _, node := range left.Nodes {
		if node != nil && node.Id != "" {
			leftNodeMap[node.Id] = node
		}
	}

	for _, rightNode := range right.Nodes {
		if rightNode == nil || rightNode.Id == "" {
			continue
		}

		leftNode, exists := leftNodeMap[rightNode.Id]
		if !exists || leftNode == nil {
			continue
		}

		if leftNode.DrInstance == nil {
			continue
		}

		leftFoundation, ok := leftNode.DrInstance.(v3.AcceptsRuleResults)
		if !ok {
			continue
		}

		ruleResults := leftFoundation.GetRuleFunctionResults()
		if len(ruleResults) == 0 {
			continue
		}

		if rightNode.DrInstance == nil {
			continue
		}

		rightFoundation, ok := rightNode.DrInstance.(v3.AcceptsRuleResults)
		if !ok {
			continue
		}

		for _, result := range ruleResults {
			if result != nil {
				rightFoundation.AddRuleFunctionResult(result)
			}
		}
	}
}

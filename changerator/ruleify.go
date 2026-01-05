// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package changerator

import (
	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
)

// Ruleify efficiently copies rule results from a left DrDocument to the ChangedNodes
// in the Changerator. It matches nodes by ID and transfers their rule results.
//
// Parameters:
//   - left: The source DrDocument containing nodes with RuleResults
//
// The function modifies the ChangedNodes in-place.
func (t *Changerator) Ruleify(left *model.DrDocument) {
	if left == nil || len(left.Nodes) == 0 {
		return
	}

	if len(t.ChangedNodes) == 0 {
		return
	}

	leftNodeMap := make(map[string]*v3.Node, len(left.Nodes))
	for _, node := range left.Nodes {
		if node != nil && node.Id != "" {
			leftNodeMap[node.Id] = node
		}
	}

	for _, changedNode := range t.ChangedNodes {
		if changedNode == nil || changedNode.Id == "" {
			continue
		}

		leftNode, exists := leftNodeMap[changedNode.Id]
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

		if changedNode.DrInstance == nil {
			continue
		}

		changedFoundation, ok := changedNode.DrInstance.(v3.AcceptsRuleResults)
		if !ok {
			continue
		}

		for _, result := range ruleResults {
			if result != nil {
				changedFoundation.AddRuleFunctionResult(result)
			}
		}
	}
}

// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

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
	if t == nil || left == nil {
		return
	}
	v3.CopyRuleResultsByNodeID(left.Nodes, t.ChangedNodes)
}

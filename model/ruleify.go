// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

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
	if left == nil || right == nil {
		return
	}
	v3.CopyRuleResultsByNodeID(left.Nodes, right.Nodes)
}

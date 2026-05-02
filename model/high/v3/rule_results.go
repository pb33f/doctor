// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"reflect"

	"github.com/pb33f/libopenapi/datamodel/high"
)

// RuleResultOwnedByNode reports whether a result belongs directly to the node,
// excluding copies forwarded to aggregate/root receivers.
func RuleResultOwnedByNode(result *RuleFunctionResult, node *Node) bool {
	if result == nil || node == nil || node.DrInstance == nil {
		return false
	}
	owner, ok := result.ParentObject.(Foundational)
	if !ok || owner == nil {
		return false
	}
	ownerPath := owner.GenerateJSONPath()
	if node.Id == "root" {
		return owner.GetParent() == nil && (ownerPath == "$" || ownerPath == "document" || ownerPath == "root")
	}
	return ownerPath == node.Id
}

// CloneRuleFunctionResultForParent makes a shallow copy for a new owner.
func CloneRuleFunctionResultForParent(result *RuleFunctionResult, parent any) *RuleFunctionResult {
	if result == nil {
		return nil
	}
	clone := *result
	clone.ParentObject = parent
	return &clone
}

// CopyRuleResultsByNodeID copies owned rule results from matching source nodes
// to target nodes. Aggregate results forwarded to roots are skipped; adding a
// copied child result may still forward the aggregate copy through normal
// Foundation behavior.
func CopyRuleResultsByNodeID(source, target []*Node) {
	if len(source) == 0 || len(target) == 0 {
		return
	}

	sourceByID := make(map[string]*Node, len(source))
	for _, node := range source {
		if node != nil && node.Id != "" {
			sourceByID[node.Id] = node
		}
	}

	for _, targetNode := range target {
		if targetNode == nil || targetNode.Id == "" || targetNode.DrInstance == nil {
			continue
		}

		sourceNode := sourceByID[targetNode.Id]
		if sourceNode == nil || sourceNode.DrInstance == nil {
			continue
		}

		sourceReceiver, ok := sourceNode.DrInstance.(AcceptsRuleResults)
		if !ok {
			continue
		}
		targetReceiver, ok := targetNode.DrInstance.(AcceptsRuleResults)
		if !ok {
			continue
		}

		for _, result := range sourceReceiver.GetRuleFunctionResults() {
			if !RuleResultOwnedByNode(result, sourceNode) {
				continue
			}
			clone := CloneRuleFunctionResultForParent(result, targetNode.DrInstance)
			targetReceiver.AddRuleFunctionResult(clone)
			clone.ParentObject = targetNode.DrInstance
		}
	}
}

// SourceFileForFoundational returns the absolute spec path for a Doctor object
// when its underlying low model carries an index.
func SourceFileForFoundational(candidate Foundational) string {
	if candidate == nil {
		return ""
	}
	hv, ok := candidate.(HasValue)
	if !ok {
		return ""
	}
	value := hv.GetValue()
	if value == nil {
		return ""
	}
	rv := reflect.ValueOf(value)
	if (rv.Kind() == reflect.Ptr || rv.Kind() == reflect.Interface) && rv.IsNil() {
		return ""
	}
	gl, ok := value.(high.GoesLowUntyped)
	if !ok || gl.GoLowUntyped() == nil {
		return ""
	}
	if indexed, ok := gl.GoLowUntyped().(HasIndex); ok {
		if idx := indexed.GetIndex(); idx != nil {
			return idx.GetSpecAbsolutePath()
		}
	}
	return ""
}

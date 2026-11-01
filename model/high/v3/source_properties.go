// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/pb33f/go-yaml"
)

// sourceProperties preserves authored aliases instead of expanding their targets.
// Explorer instances are source previews; the graph owns resolved relationships.
// Values JSON cannot carry stay as authored so one of them cannot fail a graph.
func sourceProperties(node *yaml.Node) any {
	if node == nil {
		return nil
	}
	switch node.Kind {
	case yaml.AliasNode:
		return map[string]string{"$yamlAlias": node.Value}
	case yaml.DocumentNode:
		if len(node.Content) == 0 {
			return nil
		}
		return sourceProperties(node.Content[0])
	case yaml.MappingNode:
		value := make(map[string]any, len(node.Content)/2)
		for i := 0; i+1 < len(node.Content); i += 2 {
			value[sourceKey(node.Content[i])] = sourceProperties(node.Content[i+1])
		}
		return value
	case yaml.SequenceNode:
		value := make([]any, len(node.Content))
		for i, child := range node.Content {
			value[i] = sourceProperties(child)
		}
		return value
	default:
		var value any
		if err := node.Decode(&value); err != nil {
			return node.Value
		}
		if _, err := json.Marshal(value); err != nil {
			return node.Value
		}
		return value
	}
}

// sourceKey renders a complex YAML key as its source, since JSON keys are strings.
func sourceKey(key *yaml.Node) string {
	if key.Kind == yaml.ScalarNode {
		return key.Value
	}
	encoded, err := yaml.Marshal(key)
	if err != nil {
		return fmt.Sprintf("line %d", key.Line)
	}
	return strings.TrimSpace(string(encoded))
}

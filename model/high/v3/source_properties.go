// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"fmt"

	"github.com/pb33f/go-yaml"
)

// sourceProperties preserves authored aliases instead of expanding their targets.
// Explorer instances are source previews; the graph owns resolved relationships.
func sourceProperties(node *yaml.Node) (any, error) {
	if node == nil {
		return nil, nil
	}
	switch node.Kind {
	case yaml.AliasNode:
		return map[string]string{"$yamlAlias": node.Value}, nil
	case yaml.DocumentNode:
		if len(node.Content) == 0 {
			return nil, nil
		}
		return sourceProperties(node.Content[0])
	case yaml.MappingNode:
		value := make(map[string]any, len(node.Content)/2)
		for i := 0; i+1 < len(node.Content); i += 2 {
			key := node.Content[i]
			if key.Kind != yaml.ScalarNode {
				return nil, fmt.Errorf("explorer property key at line %d must be a scalar", key.Line)
			}
			child, err := sourceProperties(node.Content[i+1])
			if err != nil {
				return nil, err
			}
			value[key.Value] = child
		}
		return value, nil
	case yaml.SequenceNode:
		value := make([]any, len(node.Content))
		for i, child := range node.Content {
			var err error
			value[i], err = sourceProperties(child)
			if err != nil {
				return nil, err
			}
		}
		return value, nil
	default:
		var value any
		err := node.Decode(&value)
		return value, err
	}
}

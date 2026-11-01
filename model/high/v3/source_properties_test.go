// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"encoding/json"
	"testing"

	"github.com/pb33f/go-yaml"
	"github.com/pb33f/testify/require"
)

func TestSourcePropertiesPreserveAuthoredAliases(t *testing.T) {
	var source yaml.Node
	require.NoError(t, yaml.Unmarshal([]byte("defaults: &defaults {enabled: true, count: 2, absent: null}\nvalue:\n  <<: *defaults\n  entries: [text, 1.5, *defaults]\n"), &source))
	before, err := yaml.Marshal(&source)
	require.NoError(t, err)
	encoded, err := json.Marshal(sourceProperties(&source))
	require.NoError(t, err)
	require.JSONEq(t, `{"defaults":{"enabled":true,"count":2,"absent":null},"value":{"<<":{"$yamlAlias":"defaults"},"entries":["text",1.5,{"$yamlAlias":"defaults"}]}}`, string(encoded))
	after, err := yaml.Marshal(&source)
	require.NoError(t, err)
	require.Equal(t, before, after, "projection must not mutate the source")
}

func TestSourcePropertiesEmpty(t *testing.T) {
	for _, source := range []*yaml.Node{nil, {Kind: yaml.DocumentNode}, {Kind: yaml.ScalarNode, Tag: "!!null"}} {
		require.Nil(t, sourceProperties(source))
	}
}

// One value JSON cannot carry must not fail the whole graph.
func TestSourcePropertiesKeepUnrepresentableValues(t *testing.T) {
	for name, tc := range map[string]struct{ source, expected string }{
		"positive infinity": {"maximum: .inf", `{"maximum":".inf"}`},
		"negative infinity": {"minimum: -.Inf", `{"minimum":"-.Inf"}`},
		"not a number":      {"[.nan]", `[".nan"]`},
		"bad integer tag":   {"value: !!int abc", `{"value":"abc"}`},
		"bad binary tag":    {"value: !!binary '#'", `{"value":"#"}`},
		"sequence key":      {"x-m: {[a, b]: 1}", `{"x-m":{"[a, b]":1}}`},
		"mapping key":       {"? {a: 1}\n: value", `{"{a: 1}":"value"}`},
		"alias key":         {"x: &k [a]\ny: {*k : 1}", `{"x":["a"],"y":{"*k":1}}`},
		"ordinary values":   {"{a: 1, b: 1.5, c: true, d: ~, e: text}", `{"a":1,"b":1.5,"c":true,"d":null,"e":"text"}`},
	} {
		t.Run(name, func(t *testing.T) {
			var source yaml.Node
			require.NoError(t, yaml.Unmarshal([]byte(tc.source), &source))
			encoded, err := json.Marshal(sourceProperties(&source))
			require.NoError(t, err)
			require.JSONEq(t, tc.expected, string(encoded))
		})
	}
}

func TestNodeMarshalKeepsUnrepresentableSourceValues(t *testing.T) {
	var source yaml.Node
	require.NoError(t, yaml.Unmarshal([]byte("maximum: .inf\nx-m: {[a, b]: 1}\nodd: !!int abc\n"), &source))
	encoded, err := json.Marshal(&Node{Id: "$", Instance: source.Content[0], RenderProps: true, ArrayIndex: -1})
	require.NoError(t, err)
	var node struct {
		Instance map[string]any `json:"instance"`
	}
	require.NoError(t, json.Unmarshal(encoded, &node))
	require.Equal(t, map[string]any{"maximum": ".inf", "x-m": map[string]any{"[a, b]": float64(1)}, "odd": "abc"}, node.Instance)
}

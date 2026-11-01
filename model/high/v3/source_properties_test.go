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
	value, err := sourceProperties(&source)
	require.NoError(t, err)
	encoded, err := json.Marshal(value)
	require.NoError(t, err)
	require.JSONEq(t, `{"defaults":{"enabled":true,"count":2,"absent":null},"value":{"<<":{"$yamlAlias":"defaults"},"entries":["text",1.5,{"$yamlAlias":"defaults"}]}}`, string(encoded))
	after, err := yaml.Marshal(&source)
	require.NoError(t, err)
	require.Equal(t, before, after, "projection must not mutate the source")
}

func TestSourcePropertiesEmptyAndInvalidKeys(t *testing.T) {
	for _, source := range []*yaml.Node{nil, {Kind: yaml.DocumentNode}, {Kind: yaml.ScalarNode, Tag: "!!null"}} {
		value, err := sourceProperties(source)
		require.NoError(t, err)
		require.Nil(t, value)
	}
	var source yaml.Node
	require.NoError(t, yaml.Unmarshal([]byte("? [one, two]\n: value\n"), &source))
	_, err := sourceProperties(&source)
	require.ErrorContains(t, err, "property key at line 1 must be a scalar")
}

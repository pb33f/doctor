// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestYamlToJSON(t *testing.T) {
	yamlInput := []byte("name: test\nversion: 1")
	result, err := yamlToJSON(yamlInput)
	require.NoError(t, err)
	assert.Contains(t, result, `"name":"test"`)
	assert.Contains(t, result, `"version":1`)
}

func TestYamlToJSON_Invalid(t *testing.T) {
	_, err := yamlToJSON([]byte("\t\t- :\n\t:"))
	assert.Error(t, err)
}

func TestMarshalJSON(t *testing.T) {
	result, err := marshalJSON(map[string]string{"key": "value"})
	require.NoError(t, err)
	assert.Equal(t, `{"key":"value"}`, result)
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"errors"
	"testing"

	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestSpecKindHelpers(t *testing.T) {
	assert.True(t, SpecKindOpenAPI.IsKnown())
	assert.True(t, SpecKindOpenAPI.IsOpenAPI())
	assert.False(t, SpecKindOpenAPI.IsAsyncAPI())
	assert.Equal(t, "openapi", SpecKindOpenAPI.MachineValue())
	assert.Equal(t, "OpenAPI", SpecKindOpenAPI.DisplayLabel())

	assert.True(t, SpecKindAsyncAPI.IsKnown())
	assert.True(t, SpecKindAsyncAPI.IsAsyncAPI())
	assert.False(t, SpecKindAsyncAPI.IsOpenAPI())
	assert.Equal(t, "asyncapi", SpecKindAsyncAPI.MachineValue())
	assert.Equal(t, "AsyncAPI", SpecKindAsyncAPI.DisplayLabel())

	assert.False(t, SpecKindUnknown.IsKnown())
	assert.Empty(t, SpecKindUnknown.DisplayLabel())
}

func TestDetectSpecIdentity(t *testing.T) {
	tests := []struct {
		name    string
		source  []byte
		kind    SpecKind
		version string
	}{
		{
			name: "yaml asyncapi",
			source: []byte(`---
# comment before marker
asyncapi: 3.0.0
info:
  title: Streetlights
  version: 1.0.0
`),
			kind:    SpecKindAsyncAPI,
			version: "3.0.0",
		},
		{
			name: "yaml quoted openapi",
			source: []byte(`"openapi": "3.1.0" # root marker
info:
  title: Pets
  version: 1.0.0
`),
			kind:    SpecKindOpenAPI,
			version: "3.1.0",
		},
		{
			name:    "json asyncapi",
			source:  []byte(`{"info":{"title":"Streetlights","version":"1.0.0"},"asyncapi":"3.0.0"}`),
			kind:    SpecKindAsyncAPI,
			version: "3.0.0",
		},
		{
			name:    "json swagger",
			source:  []byte(`{"swagger":"2.0","info":{"title":"Pets","version":"1.0.0"}}`),
			kind:    SpecKindOpenAPI,
			version: "2.0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			identity, err := DetectSpecIdentity(tt.source)
			require.NoError(t, err)
			assert.Equal(t, tt.kind, identity.Kind)
			assert.Equal(t, tt.version, identity.Version)
		})
	}
}

func TestDetectSpecIdentity_RejectsAsyncAPI2(t *testing.T) {
	identity, err := DetectSpecIdentity([]byte(`asyncapi: 2.6.0
info:
  title: Legacy
  version: 1.0.0
`))
	require.Error(t, err)
	assert.True(t, errors.Is(err, ErrUnsupportedAsyncAPI2))
	assert.Equal(t, SpecKindAsyncAPI, identity.Kind)
	assert.Equal(t, "2.6.0", identity.Version)
}

func TestDetectSpecIdentity_ReturnsUnknownForMissingMarker(t *testing.T) {
	_, err := DetectSpecIdentity([]byte(`info:
  title: Missing marker
  version: 1.0.0
`))
	require.Error(t, err)
	assert.True(t, errors.Is(err, ErrUnknownSpecKind))
}

// Copyright 2023 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: MIT

package printingpress

import (
	"fmt"

	"github.com/pb33f/libopenapi/renderer"
)

const (
	// DefaultMaxPatternRepeatBudget is the default regex repeat budget used for generated mock strings.
	DefaultMaxPatternRepeatBudget = renderer.DefaultMaxPatternRepeatBudget
	// DefaultMaxGeneratedStringBytes is the default byte ceiling for each generated mock string value.
	DefaultMaxGeneratedStringBytes = renderer.DefaultMaxGeneratedStringBytes
	// DefaultMaxGeneratedMockBytes is the default byte ceiling for each serialized generated mock payload.
	DefaultMaxGeneratedMockBytes = 64 * 1024
	// DefaultMaxMockDepth is the default recursive schema depth budget for generated mocks.
	DefaultMaxMockDepth = renderer.DefaultMaxMockDepth
	// DefaultMaxMockNodes is the default schema node budget for generated mocks.
	DefaultMaxMockNodes = renderer.DefaultMaxMockNodes
	// DefaultMaxMockProperties is the default object property budget for generated mocks.
	DefaultMaxMockProperties = renderer.DefaultMaxMockProperties
	// DefaultMaxMockRefExpansions is the default $ref expansion budget for generated mocks.
	DefaultMaxMockRefExpansions = renderer.DefaultMaxMockRefExpansions
	// DefaultMaxMockBytes is the default approximate pre-serialization byte budget for generated mocks.
	// It mirrors DefaultMaxGeneratedMockBytes so the renderer stops before doing work
	// that the serialized mock payload ceiling would discard.
	DefaultMaxMockBytes = DefaultMaxGeneratedMockBytes
)

type mockGenerationLimits struct {
	MaxPatternRepeatBudget  int
	MaxGeneratedStringBytes int
	MaxGeneratedMockBytes   int
	MaxMockDepth            int
	MaxMockNodes            int
	MaxMockProperties       int
	MaxMockRefExpansions    int
	MaxMockBytes            int
}

func resolveMockGenerationLimits(
	maxPatternRepeatBudget,
	maxGeneratedStringBytes,
	maxGeneratedMockBytes,
	maxMockDepth,
	maxMockNodes,
	maxMockProperties,
	maxMockRefExpansions,
	maxMockBytes int,
) mockGenerationLimits {
	limits := mockGenerationLimits{
		MaxPatternRepeatBudget:  maxPatternRepeatBudget,
		MaxGeneratedStringBytes: maxGeneratedStringBytes,
		MaxGeneratedMockBytes:   maxGeneratedMockBytes,
		MaxMockDepth:            maxMockDepth,
		MaxMockNodes:            maxMockNodes,
		MaxMockProperties:       maxMockProperties,
		MaxMockRefExpansions:    maxMockRefExpansions,
		MaxMockBytes:            maxMockBytes,
	}
	if limits.MaxPatternRepeatBudget <= 0 {
		limits.MaxPatternRepeatBudget = DefaultMaxPatternRepeatBudget
	}
	if limits.MaxGeneratedStringBytes <= 0 {
		limits.MaxGeneratedStringBytes = DefaultMaxGeneratedStringBytes
	}
	if limits.MaxGeneratedMockBytes <= 0 {
		limits.MaxGeneratedMockBytes = DefaultMaxGeneratedMockBytes
	}
	if limits.MaxMockDepth <= 0 {
		limits.MaxMockDepth = DefaultMaxMockDepth
	}
	if limits.MaxMockNodes <= 0 {
		limits.MaxMockNodes = DefaultMaxMockNodes
	}
	if limits.MaxMockProperties <= 0 {
		limits.MaxMockProperties = DefaultMaxMockProperties
	}
	if limits.MaxMockRefExpansions <= 0 {
		limits.MaxMockRefExpansions = DefaultMaxMockRefExpansions
	}
	if limits.MaxMockBytes <= 0 {
		limits.MaxMockBytes = DefaultMaxMockBytes
	}
	return limits
}

func mockGenerationLimitsFromConfig(config *pressEngineConfig) mockGenerationLimits {
	if config == nil {
		return resolveMockGenerationLimits(0, 0, 0, 0, 0, 0, 0, 0)
	}
	return resolveMockGenerationLimits(
		config.MaxPatternRepeatBudget,
		config.MaxGeneratedStringBytes,
		config.MaxGeneratedMockBytes,
		config.MaxMockDepth,
		config.MaxMockNodes,
		config.MaxMockProperties,
		config.MaxMockRefExpansions,
		config.MaxMockBytes,
	)
}

func (limits mockGenerationLimits) rendererOptions() renderer.MockGenerationOptions {
	return renderer.MockGenerationOptions{
		MaxPatternRepeatBudget:  limits.MaxPatternRepeatBudget,
		MaxGeneratedStringBytes: limits.MaxGeneratedStringBytes,
		MaxMockDepth:            limits.MaxMockDepth,
		MaxMockNodes:            limits.MaxMockNodes,
		MaxMockProperties:       limits.MaxMockProperties,
		MaxMockRefExpansions:    limits.MaxMockRefExpansions,
		MaxMockBytes:            limits.MaxMockBytes,
	}
}

func applyMockGenerationLimits(gen *renderer.MockGenerator, limits mockGenerationLimits) {
	if gen == nil {
		return
	}
	gen.SetMockGenerationOptions(limits.rendererOptions())
}

func (limits mockGenerationLimits) exceedsMockBytes(mock []byte) bool {
	return mock != nil && len(mock) > limits.MaxGeneratedMockBytes
}

func (limits mockGenerationLimits) mockBytesLimitError(actualBytes int) error {
	return fmt.Errorf("generated mock is %d bytes; maximum is %d bytes", actualBytes, limits.MaxGeneratedMockBytes)
}

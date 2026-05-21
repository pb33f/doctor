// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"testing"

	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestResolveLLMOutputOptions_Defaults(t *testing.T) {
	options, err := resolveLLMOutputOptions(0, 0, "")

	require.NoError(t, err)
	assert.Equal(t, DefaultLLMAggregateSpecSizeThresholdBytes, options.AggregateSpecSizeThresholdBytes)
	assert.Equal(t, DefaultLLMMaxAggregateFileBytes, options.MaxAggregateFileBytes)
	assert.Equal(t, LLMGenerateMonolithsAuto, options.GenerateMonoliths)
}

func TestResolveLLMOutputOptions_NormalizesMode(t *testing.T) {
	options, err := resolveLLMOutputOptions(1024, 2048, " ALWAYS ")

	require.NoError(t, err)
	assert.Equal(t, int64(1024), options.AggregateSpecSizeThresholdBytes)
	assert.Equal(t, int64(2048), options.MaxAggregateFileBytes)
	assert.Equal(t, LLMGenerateMonolithsAlways, options.GenerateMonoliths)
}

func TestResolveLLMOutputOptions_InvalidMode(t *testing.T) {
	_, err := resolveLLMOutputOptions(0, 0, "sometimes")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "invalid LLM monolith mode")
}

func TestLLMOutputOptionsFromSite(t *testing.T) {
	defaults := llmOutputOptionsFromSite(nil)
	assert.Equal(t, DefaultLLMAggregateSpecSizeThresholdBytes, defaults.AggregateSpecSizeThresholdBytes)

	siteOptions := llmOutputOptionsFromSite(&Site{
		LLM: LLMOutputConfig{
			AggregateSpecSizeThresholdBytes: 1024,
			MaxAggregateFileBytes:           4096,
			GenerateMonoliths:               LLMGenerateMonolithsNever,
		},
	})
	assert.Equal(t, int64(1024), siteOptions.AggregateSpecSizeThresholdBytes)
	assert.Equal(t, int64(4096), siteOptions.MaxAggregateFileBytes)
	assert.Equal(t, LLMGenerateMonolithsNever, siteOptions.GenerateMonoliths)
	assert.Equal(t, LLMGenerateMonolithsNever, siteOptions.siteConfig().GenerateMonoliths)
}

func TestLLMOutputOptions_ShouldGenerateMonoliths(t *testing.T) {
	auto := llmOutputOptions{
		AggregateSpecSizeThresholdBytes: 100,
		GenerateMonoliths:               LLMGenerateMonolithsAuto,
	}
	assert.True(t, auto.shouldGenerateMonoliths(0))
	assert.True(t, auto.shouldGenerateMonoliths(100))
	assert.False(t, auto.shouldGenerateMonoliths(101))

	always := auto
	always.GenerateMonoliths = LLMGenerateMonolithsAlways
	assert.True(t, always.shouldGenerateMonoliths(101))

	never := auto
	never.GenerateMonoliths = LLMGenerateMonolithsNever
	assert.False(t, never.shouldGenerateMonoliths(0))
	assert.False(t, never.shouldGenerateMonoliths(1))
}

func TestLLMOutputOptions_MonolithOmittedReason(t *testing.T) {
	auto := llmOutputOptions{
		AggregateSpecSizeThresholdBytes: 20 * 1024 * 1024,
		GenerateMonoliths:               LLMGenerateMonolithsAuto,
	}
	assert.Empty(t, auto.monolithOmittedReason(1024))
	assert.Contains(t, auto.monolithOmittedReason(21*1024*1024), "21 MiB")
	assert.Contains(t, auto.monolithOmittedReason(21*1024*1024), "20 MiB")

	never := auto
	never.GenerateMonoliths = LLMGenerateMonolithsNever
	assert.Equal(t, "monolithic LLM files disabled by configuration", never.monolithOmittedReason(1024))
}

func TestFormatByteCount(t *testing.T) {
	assert.Equal(t, "0 B", formatByteCount(-1))
	assert.Equal(t, "512 B", formatByteCount(512))
	assert.Equal(t, "1 KiB", formatByteCount(1024))
	assert.Equal(t, "1.5 KiB", formatByteCount(1536))
	assert.Equal(t, "20 MiB", formatByteCount(20*1024*1024))
}

func TestAggregatePrintingPressConfig_NormalizesLLMOutputOptions(t *testing.T) {
	config, store, err := validateAndNormalizeAggregateConfig(t.TempDir(), &AggregatePrintingPressConfig{
		LLMAggregateSpecSizeThresholdBytes: 1024,
		LLMMaxAggregateFileBytes:           2048,
		LLMGenerateMonoliths:               "NEVER",
	})
	require.NoError(t, err)
	t.Cleanup(func() {
		require.NoError(t, store.Close())
	})

	assert.Equal(t, int64(1024), config.LLMAggregateSpecSizeThresholdBytes)
	assert.Equal(t, int64(2048), config.LLMMaxAggregateFileBytes)
	assert.Equal(t, LLMGenerateMonolithsNever, config.LLMGenerateMonoliths)
}

func TestAggregatePrintingPressConfig_RejectsInvalidLLMMonolithMode(t *testing.T) {
	_, _, err := validateAndNormalizeAggregateConfig(t.TempDir(), &AggregatePrintingPressConfig{
		LLMGenerateMonoliths: "sometimes",
	})

	require.Error(t, err)
	assert.Contains(t, err.Error(), "invalid LLM monolith mode")
}

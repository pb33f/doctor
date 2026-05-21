// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"math"
	"strings"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const (
	// LLMGenerateMonolithsAuto writes monolithic LLM files only below the configured source-size threshold.
	LLMGenerateMonolithsAuto = "auto"
	// LLMGenerateMonolithsAlways always writes monolithic LLM files.
	LLMGenerateMonolithsAlways = "always"
	// LLMGenerateMonolithsNever never writes monolithic LLM files.
	LLMGenerateMonolithsNever = "never"

	// DefaultLLMAggregateSpecSizeThresholdBytes is the default source-size cutoff for monolithic LLM files.
	DefaultLLMAggregateSpecSizeThresholdBytes int64 = 20 * 1024 * 1024
	// DefaultLLMMaxAggregateFileBytes is the target maximum for sharded aggregate LLM files.
	DefaultLLMMaxAggregateFileBytes int64 = 8 * 1024 * 1024
)

type llmOutputOptions struct {
	AggregateSpecSizeThresholdBytes int64
	MaxAggregateFileBytes           int64
	GenerateMonoliths               string
}

func resolveLLMOutputOptions(thresholdBytes, maxAggregateFileBytes int64, generateMonoliths string) (llmOutputOptions, error) {
	options := llmOutputOptions{
		AggregateSpecSizeThresholdBytes: thresholdBytes,
		MaxAggregateFileBytes:           maxAggregateFileBytes,
		GenerateMonoliths:               strings.ToLower(strings.TrimSpace(generateMonoliths)),
	}
	if options.AggregateSpecSizeThresholdBytes <= 0 {
		options.AggregateSpecSizeThresholdBytes = DefaultLLMAggregateSpecSizeThresholdBytes
	}
	if options.MaxAggregateFileBytes <= 0 {
		options.MaxAggregateFileBytes = DefaultLLMMaxAggregateFileBytes
	}
	if options.GenerateMonoliths == "" {
		options.GenerateMonoliths = LLMGenerateMonolithsAuto
	}
	switch options.GenerateMonoliths {
	case LLMGenerateMonolithsAuto, LLMGenerateMonolithsAlways, LLMGenerateMonolithsNever:
	default:
		return llmOutputOptions{}, fmt.Errorf("invalid LLM monolith mode %q: expected %q, %q, or %q",
			generateMonoliths, LLMGenerateMonolithsAuto, LLMGenerateMonolithsAlways, LLMGenerateMonolithsNever)
	}
	return options, nil
}

func llmOutputOptionsFromSite(site *ppmodel.Site) llmOutputOptions {
	if site == nil {
		options, _ := resolveLLMOutputOptions(0, 0, "")
		return options
	}
	options, _ := resolveLLMOutputOptions(
		site.LLM.AggregateSpecSizeThresholdBytes,
		site.LLM.MaxAggregateFileBytes,
		site.LLM.GenerateMonoliths,
	)
	return options
}

func (o llmOutputOptions) siteConfig() ppmodel.LLMOutputConfig {
	return ppmodel.LLMOutputConfig{
		AggregateSpecSizeThresholdBytes: o.AggregateSpecSizeThresholdBytes,
		MaxAggregateFileBytes:           o.MaxAggregateFileBytes,
		GenerateMonoliths:               o.GenerateMonoliths,
	}
}

func (o llmOutputOptions) shouldGenerateMonoliths(sourceSizeBytes int64) bool {
	switch o.GenerateMonoliths {
	case LLMGenerateMonolithsAlways:
		return true
	case LLMGenerateMonolithsNever:
		return false
	default:
		return sourceSizeBytes <= 0 || sourceSizeBytes <= o.AggregateSpecSizeThresholdBytes
	}
}

func (o llmOutputOptions) monolithOmittedReason(sourceSizeBytes int64) string {
	if o.shouldGenerateMonoliths(sourceSizeBytes) {
		return ""
	}
	if o.GenerateMonoliths == LLMGenerateMonolithsNever {
		return "monolithic LLM files disabled by configuration"
	}
	return fmt.Sprintf("source specification is %s, above the %s monolithic LLM threshold",
		formatByteCount(sourceSizeBytes), formatByteCount(o.AggregateSpecSizeThresholdBytes))
}

func formatByteCount(bytes int64) string {
	if bytes < 0 {
		bytes = 0
	}
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit && exp < 4; n /= unit {
		div *= unit
		exp++
	}
	value := float64(bytes) / float64(div)
	if math.Mod(value, 1) == 0 {
		return fmt.Sprintf("%.0f %ciB", value, "KMGTPE"[exp])
	}
	return fmt.Sprintf("%.1f %ciB", value, "KMGTPE"[exp])
}

// Copyright 2023 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: MIT

package printingpress

import (
	"strings"
	"testing"

	ppmodel "github.com/pb33f/doctor/printingpress/model"
	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/renderer"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
	"go.yaml.in/yaml/v4"
)

func TestResolveMockGenerationLimits(t *testing.T) {
	t.Parallel()

	tests := map[string]struct {
		patternBudget int
		stringBytes   int
		mockBytes     int
		expected      mockGenerationLimits
	}{
		"defaults": {
			expected: mockGenerationLimits{
				MaxPatternRepeatBudget:  DefaultMaxPatternRepeatBudget,
				MaxGeneratedStringBytes: DefaultMaxGeneratedStringBytes,
				MaxGeneratedMockBytes:   DefaultMaxGeneratedMockBytes,
				MaxMockDepth:            DefaultMaxMockDepth,
				MaxMockNodes:            DefaultMaxMockNodes,
				MaxMockProperties:       DefaultMaxMockProperties,
				MaxMockRefExpansions:    DefaultMaxMockRefExpansions,
				MaxMockBytes:            DefaultMaxMockBytes,
			},
		},
		"custom": {
			patternBudget: 7,
			stringBytes:   128,
			mockBytes:     512,
			expected: mockGenerationLimits{
				MaxPatternRepeatBudget:  7,
				MaxGeneratedStringBytes: 128,
				MaxGeneratedMockBytes:   512,
				MaxMockDepth:            DefaultMaxMockDepth,
				MaxMockNodes:            DefaultMaxMockNodes,
				MaxMockProperties:       DefaultMaxMockProperties,
				MaxMockRefExpansions:    DefaultMaxMockRefExpansions,
				MaxMockBytes:            DefaultMaxMockBytes,
			},
		},
		"partial defaults": {
			patternBudget: -1,
			stringBytes:   256,
			mockBytes:     0,
			expected: mockGenerationLimits{
				MaxPatternRepeatBudget:  DefaultMaxPatternRepeatBudget,
				MaxGeneratedStringBytes: 256,
				MaxGeneratedMockBytes:   DefaultMaxGeneratedMockBytes,
				MaxMockDepth:            DefaultMaxMockDepth,
				MaxMockNodes:            DefaultMaxMockNodes,
				MaxMockProperties:       DefaultMaxMockProperties,
				MaxMockRefExpansions:    DefaultMaxMockRefExpansions,
				MaxMockBytes:            DefaultMaxMockBytes,
			},
		},
	}

	for name, tc := range tests {
		tc := tc
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			actual := resolveMockGenerationLimits(tc.patternBudget, tc.stringBytes, tc.mockBytes, 0, 0, 0, 0, 0)
			assert.Equal(t, tc.expected, actual)
		})
	}
}

func TestDefaultMockWorkBudgetMatchesSerializedCap(t *testing.T) {
	t.Parallel()

	assert.Equal(t, DefaultMaxGeneratedMockBytes, DefaultMaxMockBytes)
}

func TestMockGenerationLimitsFromConfig(t *testing.T) {
	t.Parallel()

	assert.Equal(t, resolveMockGenerationLimits(0, 0, 0, 0, 0, 0, 0, 0), mockGenerationLimitsFromConfig(nil))
	assert.Equal(t,
		resolveMockGenerationLimits(3, 4, 5, 6, 7, 8, 9, 10),
		mockGenerationLimitsFromConfig(&pressEngineConfig{
			MaxPatternRepeatBudget:  3,
			MaxGeneratedStringBytes: 4,
			MaxGeneratedMockBytes:   5,
			MaxMockDepth:            6,
			MaxMockNodes:            7,
			MaxMockProperties:       8,
			MaxMockRefExpansions:    9,
			MaxMockBytes:            10,
		}),
	)
}

func TestMockGenerationLimitsRendererOptions(t *testing.T) {
	t.Parallel()

	limits := resolveMockGenerationLimits(11, 22, 33, 44, 55, 66, 77, 88)

	assert.Equal(t, renderer.MockGenerationOptions{
		MaxPatternRepeatBudget:  11,
		MaxGeneratedStringBytes: 22,
		MaxMockDepth:            44,
		MaxMockNodes:            55,
		MaxMockProperties:       66,
		MaxMockRefExpansions:    77,
		MaxMockBytes:            88,
	}, limits.rendererOptions())
}

func TestApplyMockGenerationLimits(t *testing.T) {
	t.Parallel()

	assert.NotPanics(t, func() {
		applyMockGenerationLimits(nil, resolveMockGenerationLimits(0, 0, 0, 0, 0, 0, 0, 0))
	})

	gen := renderer.NewMockGenerator(renderer.JSON)
	applyMockGenerationLimits(gen, resolveMockGenerationLimits(1, 8, 16, 2, 3, 4, 5, 6))
	assert.NotNil(t, gen)
}

func TestMockGenerationLimitsExceedsMockBytes(t *testing.T) {
	t.Parallel()

	limits := resolveMockGenerationLimits(0, 0, 4, 0, 0, 0, 0, 0)

	assert.False(t, limits.exceedsMockBytes(nil))
	assert.False(t, limits.exceedsMockBytes([]byte("1234")))
	assert.True(t, limits.exceedsMockBytes([]byte("12345")))
}

func TestMockGenerationLimitsMockBytesLimitError(t *testing.T) {
	t.Parallel()

	err := resolveMockGenerationLimits(0, 0, 4, 0, 0, 0, 0, 0).mockBytesLimitError(9)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "generated mock is 9 bytes")
	assert.Contains(t, err.Error(), "maximum is 4 bytes")
}

func TestPrintingPressConfig_NormalizesMockGenerationLimits(t *testing.T) {
	t.Parallel()

	pp, err := CreatePrintingPressFromBytes([]byte(minimalOpenAPISpec()), &PrintingPressConfig{})
	require.NoError(t, err)

	assert.Equal(t, DefaultMaxPatternRepeatBudget, pp.config.MaxPatternRepeatBudget)
	assert.Equal(t, DefaultMaxGeneratedStringBytes, pp.config.MaxGeneratedStringBytes)
	assert.Equal(t, DefaultMaxGeneratedMockBytes, pp.config.MaxGeneratedMockBytes)
	assert.Equal(t, DefaultMaxMockDepth, pp.config.MaxMockDepth)
	assert.Equal(t, DefaultMaxMockNodes, pp.config.MaxMockNodes)
	assert.Equal(t, DefaultMaxMockProperties, pp.config.MaxMockProperties)
	assert.Equal(t, DefaultMaxMockRefExpansions, pp.config.MaxMockRefExpansions)
	assert.Equal(t, DefaultMaxMockBytes, pp.config.MaxMockBytes)
}

func TestAggregatePrintingPressConfig_NormalizesMockGenerationLimits(t *testing.T) {
	t.Parallel()

	config, _, err := validateAndNormalizeAggregateConfig(t.TempDir(), &AggregatePrintingPressConfig{
		MaxPatternRepeatBudget:  2,
		MaxGeneratedStringBytes: 3,
		MaxMockDepth:            4,
		MaxMockNodes:            5,
		MaxMockProperties:       6,
		MaxMockRefExpansions:    7,
		MaxMockBytes:            8,
	})
	require.NoError(t, err)

	assert.Equal(t, 2, config.MaxPatternRepeatBudget)
	assert.Equal(t, 3, config.MaxGeneratedStringBytes)
	assert.Equal(t, DefaultMaxGeneratedMockBytes, config.MaxGeneratedMockBytes)
	assert.Equal(t, 4, config.MaxMockDepth)
	assert.Equal(t, 5, config.MaxMockNodes)
	assert.Equal(t, 6, config.MaxMockProperties)
	assert.Equal(t, 7, config.MaxMockRefExpansions)
	assert.Equal(t, 8, config.MaxMockBytes)
}

func TestGeneratedMockByteLimit_OmitsSchemaMockAndWarns(t *testing.T) {
	t.Parallel()

	site := pressSiteFromSpecWithConfig(t, oversizedSchemaMockSpec(), func(cfg *pressEngineConfig) {
		cfg.MaxGeneratedMockBytes = 8
		cfg.MaxGeneratedStringBytes = 64
	})

	page := requireModelPage(t, site, "schemas", "Huge")
	assert.Empty(t, page.MockJSON)
	assert.False(t, page.HasExamplePayload)
	require.Len(t, site.Warnings, 1)
	assert.Equal(t, "generated mock exceeded byte limit; omitting generated mock", site.Warnings[0].Message)
	assert.Equal(t, "schemas/Huge", site.Warnings[0].Context)
	require.Error(t, site.Warnings[0].Err)
	assert.Contains(t, site.Warnings[0].Err.Error(), "maximum is 8 bytes")
}

func TestGeneratedMockWorkBudget_OmitsSchemaMockAndWarns(t *testing.T) {
	t.Parallel()

	site := pressSiteFromSpecWithConfig(t, workBudgetSchemaMockSpec(), func(cfg *pressEngineConfig) {
		cfg.MaxMockProperties = 1
	})

	page := requireModelPage(t, site, "schemas", "Budgeted")
	assert.Empty(t, page.MockJSON)
	assert.False(t, page.HasExamplePayload)
	require.Len(t, site.Warnings, 1)
	assert.Equal(t, "generated mock exceeded work budget; omitting generated mock", site.Warnings[0].Message)
	assert.Equal(t, "schemas/Budgeted", site.Warnings[0].Context)
	require.Error(t, site.Warnings[0].Err)
	assert.ErrorIs(t, site.Warnings[0].Err, renderer.ErrMockGenerationBudgetExceeded)
}

func TestGeneratedMockByteLimit_AllowsSchemaMockWithinLimit(t *testing.T) {
	t.Parallel()

	site := pressSiteFromSpecWithConfig(t, oversizedSchemaMockSpec(), func(cfg *pressEngineConfig) {
		cfg.MaxGeneratedMockBytes = 4096
		cfg.MaxGeneratedStringBytes = 64
	})

	page := requireModelPage(t, site, "schemas", "Huge")
	assert.NotEmpty(t, page.MockJSON)
	assert.True(t, page.HasExamplePayload)
	assert.Empty(t, site.Warnings)
}

func TestGenerateMockWrappers(t *testing.T) {
	t.Parallel()

	pp := newPressEngine(&pressEngineConfig{})
	schema := &highbase.Schema{Type: []string{"string"}}
	mockable := &schemaMockable{Schema: schema}
	schemaWithNilExample := &highbase.Schema{
		Type:     []string{"string"},
		Examples: []*yaml.Node{nil},
	}

	assert.NotEmpty(t, pp.generateMockWithLabel(mockable, "mockable"))
	assert.NotEmpty(t, pp.generateMockAsWithLabel(mockable, "json", "mockable"))
	assert.NotEmpty(t, pp.generateMockAsWithLabel(schema, "json", "schema"))
	assert.NotEmpty(t, pp.generateMockAsWithLabel(mockable, "yaml", "mockable"))
	assert.NotEmpty(t, pp.generateMockAsWithLabel(mockable, "xml", "mockable"))
	assert.NotEmpty(t, pp.generateSchemaMockAs(schema, "json"))
	assert.NotEmpty(t, pp.generateSchemaMockAsWithLabel(schema, "yaml", "schema"))
	assert.NotEmpty(t, pp.generateSchemaMockAsWithLabel(schema, "xml", "schema"))
	assert.Empty(t, pp.generateSchemaMockAsWithLabel(schemaWithNilExample, "json", "schema"))
	assert.Empty(t, pp.generateMockWithLabel(&struct{}{}, "bad-mockable"))
	assert.Empty(t, pp.generateMockAsWithLabel(&struct{}{}, "json", "bad-mockable"))
	assert.Empty(t, pp.generateSchemaMockAs(nil, "json"))
}

func TestSafeGenerateMock_EdgeCases(t *testing.T) {
	t.Parallel()

	pp := newPressEngine(&pressEngineConfig{})

	mock, err := pp.safeGenerateMock(nil, &schemaMockable{}, "nil-generator")
	require.NoError(t, err)
	assert.Nil(t, mock)

	mock, err = pp.safeGenerateMock(pp.mockGen, &struct{}{}, "bad-mockable")
	require.Error(t, err)
	assert.Nil(t, mock)

	mock, err = pp.safeGenerateMock(pp.mockGen, 123, "panic-mockable")
	require.Error(t, err)
	assert.Nil(t, mock)
	require.Len(t, pp.warnings, 1)
	assert.Equal(t, "mock generation failed; omitting generated mock", pp.warnings[0].Message)
	assert.Equal(t, "panic-mockable", pp.warnings[0].Context)
}

func TestSafeGenerateMock_NilPrintingPressUsesDefaultLimits(t *testing.T) {
	t.Parallel()

	var pp *PrintingPress
	gen := renderer.NewMockGenerator(renderer.JSON)
	mock, err := pp.safeGenerateMock(gen, &schemaMockable{
		Schema: &highbase.Schema{Type: []string{"string"}},
	}, "nil-press")

	require.NoError(t, err)
	assert.NotEmpty(t, mock)
}

func minimalOpenAPISpec() string {
	return `openapi: 3.1.0
info:
  title: Minimal
  version: "1.0"
paths: {}
`
}

func oversizedSchemaMockSpec() string {
	return `openapi: 3.1.0
info:
  title: Mock Limits
  version: "1.0"
paths: {}
components:
  schemas:
    Huge:
      type: object
      properties:
        payload:
          type: string
          minLength: 64
          maxLength: 64
`
}

func workBudgetSchemaMockSpec() string {
	return `openapi: 3.1.0
info:
  title: Mock Work Budget
  version: "1.0"
paths: {}
components:
  schemas:
    Budgeted:
      type: object
      properties:
        alpha:
          type: string
        beta:
          type: string
`
}

func requireModelPage(t *testing.T, site *ppmodel.Site, typeSlug, name string) *ppmodel.ModelPage {
	t.Helper()

	require.NotNil(t, site)
	for _, page := range site.Models[typeSlug] {
		if strings.EqualFold(page.Name, name) {
			return page
		}
	}
	require.Failf(t, "model page not found", "type=%s name=%s", typeSlug, name)
	return nil
}

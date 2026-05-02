// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/index"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const lintAbsorptionFixture = `openapi: 3.0.3
info:
  title: Example API
  description: Example description
  version: 1.0.0
paths:
  /pets:
    get:
      operationId: listPets
      responses:
        '200':
          description: ok
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
`

func TestAbsorbLintResults_ReparentsPreparentedResult(t *testing.T) {
	oldDoc := buildLintAbsorptionTestDocument(t)
	newDoc := buildLintAbsorptionTestDocument(t)

	oldOwner := oldDoc.V3Document.Info
	newOwner := newDoc.V3Document.Info
	result := &drV3.RuleFunctionResult{
		RuleId:       "info-description",
		RuleSeverity: "warn",
		Path:         "$.info.description",
		ParentObject: oldOwner,
	}

	orphans := newDoc.AbsorbLintResults([]*drV3.RuleFunctionResult{result}, nil)

	require.Empty(t, orphans)
	absorbed := requireAbsorbedLintResult(t, newDoc, "info-description")
	assert.NotSame(t, result, absorbed)
	assert.Same(t, oldOwner, result.ParentObject)
	assert.Same(t, newOwner, absorbed.ParentObject)
	assert.Contains(t, newOwner.GetRuleFunctionResults(), absorbed)
}

func TestAbsorbLintResults_PathOnlyScalarFallsBackToAncestor(t *testing.T) {
	doc := buildLintAbsorptionTestDocument(t)
	result := &drV3.RuleFunctionResult{
		RuleId:       "info-description",
		RuleSeverity: "warn",
		Path:         "$.info.description",
	}

	orphans := doc.AbsorbLintResults([]*drV3.RuleFunctionResult{result}, nil)

	require.Empty(t, orphans)
	absorbed := requireAbsorbedLintResult(t, doc, "info-description")
	owner, ok := absorbed.ParentObject.(drV3.Foundational)
	require.True(t, ok)
	assert.Equal(t, "$.info", owner.GenerateJSONPath())
}

func TestAbsorbLintResults_OriginFileMismatchFallsBackToJSONPath(t *testing.T) {
	doc := buildLintAbsorptionTestDocument(t)
	result := &drV3.RuleFunctionResult{
		RuleId:       "info-description-file-mismatch",
		RuleSeverity: "warn",
		Path:         "$.info.description",
		Origin: &index.NodeOrigin{
			Line:             8,
			Column:           5,
			AbsoluteLocation: "/tmp/external.yaml",
		},
	}

	orphans := doc.AbsorbLintResults([]*drV3.RuleFunctionResult{result}, nil)

	require.Empty(t, orphans)
	absorbed := requireAbsorbedLintResult(t, doc, "info-description-file-mismatch")
	owner, ok := absorbed.ParentObject.(drV3.Foundational)
	require.True(t, ok)
	assert.Equal(t, "$.info", owner.GenerateJSONPath())
}

func TestLintPathCandidatesForReusesCachedGeneratedPaths(t *testing.T) {
	calls := 0
	candidate := &countingFoundational{
		Foundation: &drV3.Foundation{},
		path:       "$.info",
		calls:      &calls,
	}
	doc := &DrDocument{
		lineObjects: map[int][]any{
			1: {candidate},
		},
	}
	cache := &lintResolutionCache{}

	first := doc.lintPathCandidatesFor([]drV3.Foundational{candidate}, cache)
	second := doc.lintPathCandidatesFor([]drV3.Foundational{candidate}, cache)

	require.Len(t, first, 1)
	require.Len(t, second, 1)
	assert.Equal(t, "$.info", first[0].path)
	assert.Equal(t, 1, calls)
	assert.Same(t, candidate, chooseLintPathCandidate(second, "$.info.description"))
}

func TestChooseLintAncestorCandidatePrefersMostSpecificAncestor(t *testing.T) {
	root := &drV3.Foundation{}
	info := &drV3.Foundation{}
	description := &drV3.Foundation{}
	candidates := []lintPathCandidate{
		{candidate: root, path: "$"},
		{candidate: description, path: "$.info.description"},
		{candidate: info, path: "$.info"},
	}
	sortLintAncestorCandidates(candidates)

	assert.Same(t, description, chooseLintAncestorCandidate(candidates, "$.info.description.summary"))
}

func TestCommonPrefixLenDoesNotAllocateSubstring(t *testing.T) {
	assert.Equal(t, 3, commonPrefixLen("$.info", "$.items"))
	assert.Equal(t, 0, commonPrefixLen("$.info", "openapi"))
}

func buildLintAbsorptionTestDocument(t *testing.T) *DrDocument {
	t.Helper()

	document, err := libopenapi.NewDocument([]byte(lintAbsorptionFixture))
	require.NoError(t, err)

	model, errs := document.BuildV3Model()
	require.Empty(t, errs)

	doc := NewDrDocumentWithConfig(model, &DrConfig{DeterministicPaths: true})
	require.NotNil(t, doc)
	require.NotNil(t, doc.V3Document)
	require.NotNil(t, doc.V3Document.Info)
	require.NotEmpty(t, doc.lineObjects)
	return doc
}

func requireAbsorbedLintResult(t *testing.T, doc *DrDocument, ruleID string) *drV3.RuleFunctionResult {
	t.Helper()

	for _, result := range doc.V3Document.GetRuleFunctionResults() {
		if result != nil && result.RuleId == ruleID {
			return result
		}
	}
	require.Failf(t, "expected absorbed lint result", "rule %q was not attached to the document", ruleID)
	return nil
}

type countingFoundational struct {
	*drV3.Foundation
	path  string
	calls *int
}

func (c *countingFoundational) GenerateJSONPath() string {
	*c.calls++
	return c.path
}

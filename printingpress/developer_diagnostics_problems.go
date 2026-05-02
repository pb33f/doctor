// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"sort"
	"strings"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type developerProblemBuckets struct {
	operations  map[string][]*ppmodel.PageProblem
	models      map[string][]*ppmodel.PageProblem
	diagnostics []*ppmodel.PageProblem
}

func (pp *PrintingPress) buildDeveloperProblemBuckets(results []*drV3.RuleFunctionResult, cache *diagnosticBuildCache, nextID *int) developerProblemBuckets {
	buckets := developerProblemBuckets{
		operations: make(map[string][]*ppmodel.PageProblem),
		models:     make(map[string][]*ppmodel.PageProblem),
	}
	index := pp.developerPageIndex()
	for _, result := range results {
		template := pp.problemTemplateFromResult(result, cache)
		if template == nil {
			continue
		}
		matches := index.matchResultOwner(resultOwner(result))
		target := pp.rootDeveloperTarget()
		if len(matches.operations) > 0 {
			target = operationDeveloperTarget(matches.operations[0])
		} else if len(matches.models) > 0 {
			target = modelDeveloperTarget(matches.models[0])
		}
		primaryProblem := cloneProblemForTarget(template, target, nextID)
		if primaryProblem != nil {
			buckets.diagnostics = append(buckets.diagnostics, primaryProblem)
		}
		reusedPrimaryProblem := false
		for _, ref := range matches.operations {
			target := operationDeveloperTarget(ref)
			var problem *ppmodel.PageProblem
			if !reusedPrimaryProblem && primaryProblem != nil && developerTargetsEqual(target, problemDeveloperTarget(primaryProblem)) {
				problem = primaryProblem
				reusedPrimaryProblem = true
			} else {
				problem = cloneProblemForTarget(template, target, nextID)
			}
			if problem != nil {
				buckets.operations[ref.page.Slug] = append(buckets.operations[ref.page.Slug], problem)
			}
		}
		for _, ref := range matches.models {
			target := modelDeveloperTarget(ref)
			var problem *ppmodel.PageProblem
			if !reusedPrimaryProblem && primaryProblem != nil && developerTargetsEqual(target, problemDeveloperTarget(primaryProblem)) {
				problem = primaryProblem
				reusedPrimaryProblem = true
			} else {
				problem = cloneProblemForTarget(template, target, nextID)
			}
			if problem != nil {
				key := ref.page.TypeSlug + "/" + ref.page.Slug
				buckets.models[key] = append(buckets.models[key], problem)
			}
		}
	}
	return buckets
}

func (pp *PrintingPress) problemFromResult(result *drV3.RuleFunctionResult, pageHref, pageTitle string, nextID *int) *ppmodel.PageProblem {
	template := pp.problemTemplateFromResult(result, nil)
	return cloneProblemForTarget(template, developerPageTarget{href: pageHref, title: pageTitle}, nextID)
}

func (pp *PrintingPress) problemTemplateFromResult(result *drV3.RuleFunctionResult, cache *diagnosticBuildCache) *ppmodel.PageProblem {
	severity, ok := monacoSeverity(resultSeverity(result))
	if !ok {
		return nil
	}
	owner := resultOwner(result)
	startLine, startColumn, endLine, endColumn := resultRange(result, owner)
	if endLine <= 0 {
		endLine = startLine
	}
	if endColumn <= 0 {
		endColumn = startColumn
	}
	jsonPath := strings.TrimSpace(result.Path)
	if jsonPath == "" && owner != nil {
		jsonPath = owner.GenerateJSONPath()
	}
	return &ppmodel.PageProblem{
		Category:        resultCategory(result),
		JSONPath:        jsonPath,
		EndColumn:       endColumn,
		EndLineNumber:   endLine,
		Message:         resultMessage(result),
		Severity:        severity,
		StartColumn:     startColumn,
		StartLineNumber: startLine,
		Source:          "vacuum",
		SourceLocation:  pp.resultSourceLocation(result, owner, startLine, cache),
	}
}

func cloneProblemForTarget(problem *ppmodel.PageProblem, target developerPageTarget, nextID *int) *ppmodel.PageProblem {
	if problem == nil {
		return nil
	}
	cp := *problem
	cp.ID = "lint-0"
	if nextID != nil {
		cp.ID = fmt.Sprintf("lint-%d", *nextID)
		*nextID = *nextID + 1
	}
	applyDeveloperPageTarget(&cp, target)
	return &cp
}

func problemDeveloperTarget(problem *ppmodel.PageProblem) developerPageTarget {
	if problem == nil {
		return developerPageTarget{}
	}
	return developerPageTarget{
		href:      problem.PageHref,
		title:     problem.PageTitle,
		kind:      problem.PageKind,
		method:    problem.PageMethod,
		path:      problem.PagePath,
		operation: problem.PageOperationID,
		component: problem.PageComponent,
	}
}

func developerTargetsEqual(a, b developerPageTarget) bool {
	return a.href == b.href &&
		a.title == b.title &&
		a.kind == b.kind &&
		a.method == b.method &&
		a.path == b.path &&
		a.operation == b.operation &&
		a.component == b.component
}

func resultSeverity(result *drV3.RuleFunctionResult) string {
	if result == nil {
		return ""
	}
	if result.RuleSeverity != "" {
		return result.RuleSeverity
	}
	if result.Rule != nil {
		return result.Rule.Severity
	}
	return ""
}

func monacoSeverity(severity string) (int, bool) {
	switch strings.ToLower(strings.TrimSpace(severity)) {
	case "error":
		return 8, true
	case "warn", "warning":
		return 4, true
	case "info", "hint", "":
		return 2, true
	default:
		return 2, true
	}
}

func resultCategory(result *drV3.RuleFunctionResult) string {
	if result == nil {
		return ""
	}
	if result.RuleId != "" {
		return result.RuleId
	}
	if result.Rule != nil {
		return result.Rule.Id
	}
	return ""
}

func resultMessage(result *drV3.RuleFunctionResult) string {
	if result == nil {
		return ""
	}
	if result.Message != "" {
		return result.Message
	}
	if result.Rule != nil {
		return result.Rule.Message
	}
	return ""
}

func resultRange(result *drV3.RuleFunctionResult, owner drV3.Foundational) (startLine, startColumn, endLine, endColumn int) {
	if result != nil && result.Origin != nil {
		startLine = result.Origin.Line
		startColumn = result.Origin.Column
		endLine = result.Origin.LineValue
		endColumn = result.Origin.ColumnValue
	}
	if result != nil && result.StartNode != nil {
		if startLine <= 0 {
			startLine = result.StartNode.Line
		}
		if startColumn <= 0 {
			startColumn = result.StartNode.Column
		}
	}
	if result != nil && result.EndNode != nil {
		if endLine <= 0 {
			endLine = result.EndNode.Line
		}
		if endColumn <= 0 {
			endColumn = result.EndNode.Column
		}
	}
	if owner != nil {
		if node := owner.GetKeyNode(); node != nil {
			if startLine <= 0 {
				startLine = node.Line
			}
			if startColumn <= 0 {
				startColumn = node.Column
			}
		}
	}
	if startColumn <= 0 {
		startColumn = 1
	}
	if endColumn <= 0 {
		endColumn = startColumn
	}
	return startLine, startColumn, endLine, endColumn
}

func countProblems(problems []*ppmodel.PageProblem) ppmodel.ViolationCounts {
	var counts ppmodel.ViolationCounts
	for _, problem := range problems {
		if problem == nil {
			continue
		}
		switch problem.Severity {
		case 8:
			counts.Errors++
		case 4:
			counts.Warns++
		case 2:
			counts.Infos++
		}
	}
	return counts
}

func sortProblems(problems []*ppmodel.PageProblem) {
	sort.SliceStable(problems, func(i, j int) bool {
		a, b := problems[i], problems[j]
		if a.SourceLocation != b.SourceLocation {
			return a.SourceLocation < b.SourceLocation
		}
		if a.StartLineNumber != b.StartLineNumber {
			return a.StartLineNumber < b.StartLineNumber
		}
		if a.StartColumn != b.StartColumn {
			return a.StartColumn < b.StartColumn
		}
		return a.ID < b.ID
	})
}

func cloneProblemsForPage(problems []*ppmodel.PageProblem, href, title string) []*ppmodel.PageProblem {
	if len(problems) == 0 {
		return nil
	}
	cloned := make([]*ppmodel.PageProblem, 0, len(problems))
	for _, problem := range problems {
		if problem == nil {
			continue
		}
		cp := *problem
		if cp.PageHref == "" {
			cp.PageHref = href
		}
		if cp.PageTitle == "" {
			cp.PageTitle = title
		}
		cloned = append(cloned, &cp)
	}
	return cloned
}

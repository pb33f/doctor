// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"
	"unicode"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

type asyncAPIDiagnosticMatch struct {
	target developerPageTarget
	op     *ppmodel.OperationPage
	model  *ppmodel.ModelPage
}

func (pp *PrintingPress) collectAsyncAPIDeveloperDiagnostics() {
	if !pp.developerModeEnabled() || pp.site == nil || !pp.site.SpecKind.IsAsyncAPI() {
		return
	}
	pp.site.DeveloperMode = true
	pp.site.OrphanResults = pp.engineConfig.OrphanResults
	if len(pp.engineConfig.LintResults) == 0 {
		pp.warn("developer mode enabled without lint results; diagnostics will be empty", "", nil)
	}

	nextID := 0
	cache := newDiagnosticBuildCache()
	opCounts := make(map[string]ppmodel.ViolationCounts)
	modelCounts := make(map[string]ppmodel.ViolationCounts)
	var diagnosticProblems []*ppmodel.PageProblem

	for _, result := range pp.engineConfig.LintResults {
		template := pp.problemTemplateFromResult(result, cache)
		if template == nil {
			continue
		}
		match := pp.matchAsyncAPIDiagnosticResult(result)
		problem := cloneProblemForTarget(template, match.target, &nextID)
		if problem == nil {
			continue
		}
		diagnosticProblems = append(diagnosticProblems, problem)
		switch {
		case match.op != nil:
			match.op.Problems = append(match.op.Problems, problem)
		case match.model != nil:
			match.model.Problems = append(match.model.Problems, problem)
		}
	}

	for _, op := range pp.site.Operations {
		if len(op.Problems) == 0 {
			continue
		}
		sortProblems(op.Problems)
		op.Counts = countProblems(op.Problems)
		op.Slices = pp.buildProblemSlicesWithCache(op.Problems, cache)
		opCounts[op.Slug] = op.Counts
	}
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			if len(page.Problems) == 0 {
				continue
			}
			sortProblems(page.Problems)
			page.Counts = countProblems(page.Problems)
			page.Slices = pp.buildProblemSlicesWithCache(page.Problems, cache)
			modelCounts[page.TypeSlug+"/"+page.Slug] = page.Counts
		}
	}

	sortProblems(diagnosticProblems)
	siteCounts := countProblems(diagnosticProblems)
	if pp.site.Root != nil {
		pp.site.Root.Counts = siteCounts
		pp.site.Root.Problems = cloneProblemsForPage(diagnosticProblems, pppaths.FileIndexHTML, pp.site.Root.Title)
		pp.site.Root.Slices = pp.buildProblemSlicesWithCache(pp.site.Root.Problems, cache)
	}
	pp.site.Diagnostics = &ppmodel.DiagnosticsPage{
		Title:       "Diagnostics",
		Slug:        pppaths.DiagnosticsSlug,
		SpecKind:    pp.site.SpecKind,
		SpecLabel:   pp.site.SpecKind.DisplayLabel(),
		SiteCounts:  siteCounts,
		Problems:    diagnosticProblems,
		OrphanCount: len(pp.engineConfig.OrphanResults),
	}
	pp.applyDeveloperNavCounts(opCounts, modelCounts)
}

func (pp *PrintingPress) matchAsyncAPIDiagnosticResult(result *drV3.RuleFunctionResult) asyncAPIDiagnosticMatch {
	target := pp.rootDeveloperTarget()
	match := asyncAPIDiagnosticMatch{target: target}
	keys := asyncAPIDiagnosticKeysForResult(result)
	for _, op := range pp.site.Operations {
		if op == nil || op.OperationID == "" {
			continue
		}
		if _, ok := keys.operations[asyncAPIDiagnosticKey(op.OperationID)]; ok {
			match.op = op
			match.target = asyncAPIDiagnosticOperationTarget(op)
			return match
		}
	}
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			if page == nil || page.Name == "" {
				continue
			}
			if !asyncAPIDiagnosticHasModelKey(keys.models, page) {
				continue
			}
			match.model = page
			match.target = asyncAPIDiagnosticModelTarget(page)
			return match
		}
	}
	if line := asyncAPIDiagnosticSourceLine(result); line > 0 {
		return pp.matchAsyncAPIDiagnosticByLine(line, match)
	}
	return match
}

type asyncAPIDiagnosticKeys struct {
	operations map[string]struct{}
	models     map[string]struct{}
}

func asyncAPIDiagnosticKeysForResult(result *drV3.RuleFunctionResult) asyncAPIDiagnosticKeys {
	keys := asyncAPIDiagnosticKeys{
		operations: make(map[string]struct{}),
		models:     make(map[string]struct{}),
	}
	if result == nil {
		return keys
	}
	parts := []string{result.Path, result.Message, result.RuleId, result.RuleSeverity}
	if result.Rule != nil {
		parts = append(parts, result.Rule.Id, result.Rule.Message, result.Rule.Severity)
	}
	if result.Origin != nil {
		parts = append(parts, result.Origin.AbsoluteLocation, result.Origin.AbsoluteLocationValue)
	}
	tokens := asyncAPIDiagnosticTokens(parts...)
	for i, token := range tokens {
		switch token {
		case "operations":
			if i+1 < len(tokens) {
				keys.operations[asyncAPIDiagnosticKey(tokens[i+1])] = struct{}{}
			}
		case "components":
			if i+2 < len(tokens) {
				componentType := asyncAPIDiagnosticKey(tokens[i+1])
				name := asyncAPIDiagnosticKey(tokens[i+2])
				if componentType != "" && name != "" {
					keys.models[componentType+":"+name] = struct{}{}
				}
			}
		case "channels":
			if i+1 < len(tokens) {
				name := asyncAPIDiagnosticKey(tokens[i+1])
				if name != "" {
					keys.models["channels:"+name] = struct{}{}
				}
			}
		}
	}
	return keys
}

func asyncAPIDiagnosticTokens(parts ...string) []string {
	var tokens []string
	for _, part := range parts {
		tokens = append(tokens, strings.FieldsFunc(part, func(r rune) bool {
			switch r {
			case '.', '/', '[', ']', '\'', '"', '#', '$':
				return true
			default:
				return unicode.IsSpace(r)
			}
		})...)
	}
	return tokens
}

func asyncAPIDiagnosticKey(value string) string {
	value = strings.ReplaceAll(value, "~1", "/")
	value = strings.ReplaceAll(value, "~0", "~")
	return strings.ToLower(strings.TrimSpace(value))
}

func asyncAPIDiagnosticHasModelKey(keys map[string]struct{}, page *ppmodel.ModelPage) bool {
	if page == nil || page.Name == "" {
		return false
	}
	name := asyncAPIDiagnosticKey(page.Name)
	for _, componentType := range []string{page.ComponentType, page.TypeSlug} {
		componentType = asyncAPIDiagnosticKey(componentType)
		if componentType == "" {
			continue
		}
		if _, ok := keys[componentType+":"+name]; ok {
			return true
		}
	}
	return false
}

func asyncAPIDiagnosticSourceLine(result *drV3.RuleFunctionResult) int {
	if result == nil {
		return 0
	}
	if result.StartNode != nil && result.StartNode.Line > 0 {
		return result.StartNode.Line
	}
	if result.Origin != nil {
		if result.Origin.LineValue > 0 {
			return result.Origin.LineValue
		}
		if result.Origin.Line > 0 {
			return result.Origin.Line
		}
	}
	if result.EndNode != nil && result.EndNode.Line > 0 {
		return result.EndNode.Line
	}
	return 0
}

func (pp *PrintingPress) matchAsyncAPIDiagnosticByLine(line int, fallback asyncAPIDiagnosticMatch) asyncAPIDiagnosticMatch {
	bestLine := 0
	best := fallback
	for _, op := range pp.site.Operations {
		if op == nil || op.Source.Line <= 0 || op.Source.Line > line || op.Source.Line < bestLine {
			continue
		}
		bestLine = op.Source.Line
		best.op = op
		best.model = nil
		best.target = asyncAPIDiagnosticOperationTarget(op)
	}
	for _, pages := range pp.site.Models {
		for _, page := range pages {
			if page == nil || page.Source.Line <= 0 || page.Source.Line > line || page.Source.Line < bestLine {
				continue
			}
			bestLine = page.Source.Line
			best.op = nil
			best.model = page
			best.target = asyncAPIDiagnosticModelTarget(page)
		}
	}
	return best
}

func asyncAPIDiagnosticOperationTarget(op *ppmodel.OperationPage) developerPageTarget {
	return developerPageTarget{
		href:      pppaths.OperationHTML(op.Slug),
		title:     operationPageLLMLabel(op),
		kind:      "operation",
		method:    op.Method,
		path:      op.Path,
		operation: op.OperationID,
	}
}

func asyncAPIDiagnosticModelTarget(page *ppmodel.ModelPage) developerPageTarget {
	return developerPageTarget{
		href:      pppaths.ModelHTML(page.TypeSlug, page.Slug),
		title:     page.Name,
		kind:      "model",
		component: page.ComponentType,
	}
}

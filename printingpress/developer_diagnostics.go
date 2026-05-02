// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

func (pp *PrintingPress) developerModeEnabled() bool {
	return pp != nil && pp.engineConfig != nil && pp.engineConfig.DeveloperMode
}

func (pp *PrintingPress) collectDeveloperDiagnostics() {
	if !pp.developerModeEnabled() || pp.site == nil {
		return
	}
	pp.site.DeveloperMode = true
	pp.site.OrphanResults = pp.engineConfig.OrphanResults

	rootResults := pp.rootLintResults()
	if len(pp.engineConfig.LintResults) == 0 {
		pp.warn("developer mode enabled without lint results; diagnostics will be empty", "", nil)
	}

	nextID := 0
	cache := newDiagnosticBuildCache()
	buckets := pp.buildDeveloperProblemBuckets(rootResults, cache, &nextID)
	opCounts := make(map[string]ppmodel.ViolationCounts, len(buckets.operations))
	modelCounts := make(map[string]ppmodel.ViolationCounts, len(buckets.models))

	for _, ref := range pp.devOperationPages {
		problems := buckets.operations[ref.page.Slug]
		if len(problems) == 0 {
			continue
		}
		sortProblems(problems)
		ref.page.Problems = problems
		ref.page.Counts = countProblems(problems)
		ref.page.Slices = pp.buildProblemSlicesWithCache(problems, cache)
		opCounts[ref.page.Slug] = ref.page.Counts
	}

	for _, ref := range pp.devModelPages {
		key := ref.page.TypeSlug + "/" + ref.page.Slug
		problems := buckets.models[key]
		if len(problems) == 0 {
			continue
		}
		sortProblems(problems)
		ref.page.Problems = problems
		ref.page.Counts = countProblems(problems)
		ref.page.Slices = pp.buildProblemSlicesWithCache(problems, cache)
		modelCounts[key] = ref.page.Counts
	}

	diagnosticProblems := buckets.diagnostics
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
		SiteCounts:  siteCounts,
		Problems:    diagnosticProblems,
		OrphanCount: len(pp.engineConfig.OrphanResults),
	}

	pp.applyDeveloperNavCounts(opCounts, modelCounts)
	if len(pp.engineConfig.OrphanResults) > 0 {
		pp.warn("lint results could not be matched to document pages", pppaths.OrphansJSONPath, nil)
	}
}

func (pp *PrintingPress) rootLintResults() []*drV3.RuleFunctionResult {
	if pp == nil || pp.engineConfig == nil || pp.engineConfig.DrDoc == nil ||
		pp.engineConfig.DrDoc.V3Document == nil {
		return nil
	}
	return pp.engineConfig.DrDoc.V3Document.GetRuleFunctionResults()
}

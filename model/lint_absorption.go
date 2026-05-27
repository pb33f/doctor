// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"log/slog"
	"sort"
	"strings"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/index"
)

type lintResolutionCache struct {
	pathCandidates     []lintPathCandidate
	ancestorCandidates []lintPathCandidate
	exactPaths         map[string][]lintPathCandidate
	byCandidate        map[drV3.Foundational]lintPathCandidate
	pathIndexBuilt     bool
}

type lintPathCandidate struct {
	candidate   drV3.Foundational
	path        string
	specificity int
}

// AbsorbLintResults attaches pre-converted lint results to matching Doctor
// nodes. Matching prefers file+line+column, then file+line with JSONPath
// confirmation, then a document-wide JSONPath fallback. Results that cannot be
// resolved are returned as orphans rather than failing the build.
func (d *DrDocument) AbsorbLintResults(results []*drV3.RuleFunctionResult, logger *slog.Logger) (orphans []*drV3.RuleFunctionResult) {
	if d == nil || len(results) == 0 {
		return nil
	}
	if logger == nil {
		logger = slog.Default()
	}

	cache := &lintResolutionCache{}
	for _, result := range results {
		if result == nil {
			continue
		}
		target := d.resolveLintResultTarget(result, cache)
		if target == nil {
			orphans = append(orphans, result)
			logger.Debug("lint result orphaned",
				"ruleId", result.RuleId,
				"path", result.Path,
				"hasOrigin", result.Origin != nil,
			)
			continue
		}
		if accepts, ok := target.(drV3.AcceptsRuleResults); ok {
			clone := cloneLintResultForTarget(result, target)
			accepts.AddRuleFunctionResult(clone)
			clone.ParentObject = target
			continue
		}
		orphans = append(orphans, result)
		logger.Debug("lint result target cannot accept rule results",
			"ruleId", result.RuleId,
			"path", result.Path,
			"targetPath", target.GenerateJSONPath(),
		)
	}
	return orphans
}

func cloneLintResultForTarget(result *drV3.RuleFunctionResult, target drV3.Foundational) *drV3.RuleFunctionResult {
	if result == nil {
		return nil
	}
	clone := *result
	clone.ParentObject = target
	return &clone
}

func (d *DrDocument) resolveLintResultTarget(result *drV3.RuleFunctionResult, cache *lintResolutionCache) drV3.Foundational {
	if result == nil {
		return nil
	}
	if target := d.resolveLintResultByOrigin(result, cache); target != nil {
		return target
	}
	return d.resolveLintResultByPath(result.Path, cache)
}

func (d *DrDocument) resolveLintResultByOrigin(result *drV3.RuleFunctionResult, cache *lintResolutionCache) drV3.Foundational {
	origin := result.Origin
	if origin == nil || origin.Line <= 0 {
		return nil
	}

	candidates, err := d.LocateModelByLine(origin.Line)
	if err != nil || len(candidates) == 0 {
		return nil
	}
	candidates = filterLintCandidatesByFile(candidates, origin)
	if len(candidates) == 0 {
		return nil
	}

	if origin.Column > 0 {
		var exact []drV3.Foundational
		for _, candidate := range candidates {
			if lintCandidateMatchesColumn(candidate, origin) {
				exact = append(exact, candidate)
			}
		}
		if len(exact) > 0 {
			return chooseLintPathCandidate(d.lintPathCandidatesFor(exact, cache), result.Path)
		}
	}

	return chooseLintPathCandidate(d.lintPathCandidatesFor(candidates, cache), result.Path)
}

func filterLintCandidatesByFile(candidates []drV3.Foundational, origin *index.NodeOrigin) []drV3.Foundational {
	if origin == nil || strings.TrimSpace(origin.AbsoluteLocation) == "" {
		return candidates
	}
	filtered := make([]drV3.Foundational, 0, len(candidates))
	for _, candidate := range candidates {
		if sameLintFile(drV3.SourceFileForFoundational(candidate), origin.AbsoluteLocation) {
			filtered = append(filtered, candidate)
			continue
		}
		if origin.AbsoluteLocationValue != "" && sameLintFile(drV3.SourceFileForFoundational(candidate), origin.AbsoluteLocationValue) {
			filtered = append(filtered, candidate)
		}
	}
	if len(filtered) == 0 {
		return nil
	}
	return filtered
}

func lintCandidateMatchesColumn(candidate drV3.Foundational, origin *index.NodeOrigin) bool {
	if candidate == nil || origin == nil {
		return false
	}
	if node := candidate.GetKeyNode(); node != nil && node.Line == origin.Line && node.Column == origin.Column {
		return true
	}
	if node := candidate.GetValueNode(); node != nil {
		if node.Line == origin.Line && node.Column == origin.Column {
			return true
		}
		if origin.LineValue > 0 && node.Line == origin.LineValue && node.Column == origin.ColumnValue {
			return true
		}
	}
	return false
}

func lintCandidateSpecificity(candidate drV3.Foundational) int {
	if candidate == nil {
		return 0
	}
	if _, ok := candidate.(*drV3.Foundation); ok {
		return 0
	}
	return 1
}

func lintPathScore(candidatePath, resultPath string) int {
	if resultPath == "" {
		return len(candidatePath)
	}
	switch {
	case candidatePath == resultPath:
		return 10000 + len(candidatePath)
	case jsonPathHasAncestor(resultPath, candidatePath):
		return 9000 + len(candidatePath)
	case jsonPathHasAncestor(candidatePath, resultPath):
		return 8000 + len(resultPath)
	default:
		return commonPrefixLen(candidatePath, resultPath)
	}
}

func commonPrefixLen(a, b string) int {
	n := len(a)
	if len(b) < n {
		n = len(b)
	}
	i := 0
	for i < n && a[i] == b[i] {
		i++
	}
	return i
}

func (d *DrDocument) resolveLintResultByPath(resultPath string, cache *lintResolutionCache) drV3.Foundational {
	resultPath = strings.TrimSpace(resultPath)
	if resultPath == "" {
		return nil
	}
	pathCandidates, ancestorCandidates, exactPaths := d.cachedFoundationalPathCandidates(cache)
	if exact := exactPaths[resultPath]; len(exact) > 0 {
		return chooseLintPathCandidate(exact, resultPath)
	}
	if ancestor := chooseLintAncestorCandidate(ancestorCandidates, resultPath); ancestor != nil {
		return ancestor
	}

	var best lintPathCandidate
	var bestScore int
	var found bool
	for _, candidate := range pathCandidates {
		if lintPathMatchesCandidate(candidate.path, resultPath) {
			score := lintPathScore(candidate.path, resultPath)
			if !found || betterLintPathCandidate(candidate, score, best, bestScore) {
				best = candidate
				bestScore = score
				found = true
			}
		}
	}
	if !found {
		return nil
	}
	return best.candidate
}

func (d *DrDocument) cachedFoundationalPathCandidates(cache *lintResolutionCache) ([]lintPathCandidate, []lintPathCandidate, map[string][]lintPathCandidate) {
	if cache == nil {
		pathCandidates, ancestorCandidates, exactPaths, _ := d.allFoundationalPathCandidates()
		return pathCandidates, ancestorCandidates, exactPaths
	}
	if !cache.pathIndexBuilt {
		cache.pathCandidates, cache.ancestorCandidates, cache.exactPaths, cache.byCandidate = d.allFoundationalPathCandidates()
		cache.pathIndexBuilt = true
	}
	return cache.pathCandidates, cache.ancestorCandidates, cache.exactPaths
}

func (d *DrDocument) lintPathCandidatesFor(candidates []drV3.Foundational, cache *lintResolutionCache) []lintPathCandidate {
	if len(candidates) == 0 {
		return nil
	}
	var cached map[drV3.Foundational]lintPathCandidate
	if cache != nil {
		if !cache.pathIndexBuilt {
			cache.pathCandidates, cache.ancestorCandidates, cache.exactPaths, cache.byCandidate = d.allFoundationalPathCandidates()
			cache.pathIndexBuilt = true
		}
		cached = cache.byCandidate
	}

	pathCandidates := make([]lintPathCandidate, 0, len(candidates))
	seen := make(map[drV3.Foundational]struct{}, len(candidates))
	for _, candidate := range candidates {
		if candidate == nil {
			continue
		}
		if _, exists := seen[candidate]; exists {
			continue
		}
		seen[candidate] = struct{}{}
		if cachedCandidate, ok := cached[candidate]; ok {
			pathCandidates = append(pathCandidates, cachedCandidate)
			continue
		}
		path := strings.TrimSpace(candidate.GenerateJSONPath())
		if path == "" {
			continue
		}
		pathCandidates = append(pathCandidates, lintPathCandidate{
			candidate:   candidate,
			path:        path,
			specificity: lintCandidateSpecificity(candidate),
		})
	}
	return pathCandidates
}

func chooseLintPathCandidate(candidates []lintPathCandidate, resultPath string) drV3.Foundational {
	var best lintPathCandidate
	var bestScore int
	var found bool
	for _, candidate := range candidates {
		if candidate.candidate == nil || candidate.path == "" {
			continue
		}
		score := lintPathScore(candidate.path, resultPath)
		if !found || betterLintPathCandidate(candidate, score, best, bestScore) {
			best = candidate
			bestScore = score
			found = true
		}
	}
	if !found {
		return nil
	}
	return best.candidate
}

func chooseLintAncestorCandidate(candidates []lintPathCandidate, resultPath string) drV3.Foundational {
	for _, candidate := range candidates {
		if candidate.candidate == nil || candidate.path == "" {
			continue
		}
		if jsonPathHasAncestor(resultPath, candidate.path) {
			return candidate.candidate
		}
	}
	return nil
}

func betterLintPathCandidate(candidate lintPathCandidate, candidateScore int, best lintPathCandidate, bestScore int) bool {
	if best.candidate == nil {
		return true
	}
	if candidateScore != bestScore {
		return candidateScore > bestScore
	}
	if candidate.specificity != best.specificity {
		return candidate.specificity > best.specificity
	}
	if len(candidate.path) != len(best.path) {
		return len(candidate.path) > len(best.path)
	}
	return candidate.path < best.path
}

func lintPathMatchesCandidate(candidatePath, resultPath string) bool {
	candidatePath = strings.TrimSpace(candidatePath)
	resultPath = strings.TrimSpace(resultPath)
	if candidatePath == "" || resultPath == "" {
		return false
	}
	return candidatePath == resultPath ||
		jsonPathHasAncestor(resultPath, candidatePath) ||
		jsonPathHasAncestor(candidatePath, resultPath)
}

func jsonPathHasAncestor(path, ancestor string) bool {
	if path == "" || ancestor == "" || len(path) <= len(ancestor) {
		return false
	}
	if !strings.HasPrefix(path, ancestor) {
		return false
	}
	switch path[len(ancestor)] {
	case '.', '[':
		return true
	default:
		return false
	}
}

func (d *DrDocument) allFoundationalPathCandidates() ([]lintPathCandidate, []lintPathCandidate, map[string][]lintPathCandidate, map[drV3.Foundational]lintPathCandidate) {
	if d == nil || len(d.lineObjects) == 0 {
		return nil, nil, nil, nil
	}
	seen := make(map[drV3.Foundational]struct{})
	candidates := make([]lintPathCandidate, 0)
	exactPaths := make(map[string][]lintPathCandidate)
	byCandidate := make(map[drV3.Foundational]lintPathCandidate)
	for _, objects := range d.lineObjects {
		for _, object := range objects {
			f, ok := object.(drV3.Foundational)
			if !ok || f == nil {
				continue
			}
			if _, exists := seen[f]; exists {
				continue
			}
			seen[f] = struct{}{}
			path := strings.TrimSpace(f.GenerateJSONPath())
			if path == "" {
				continue
			}
			candidate := lintPathCandidate{
				candidate:   f,
				path:        path,
				specificity: lintCandidateSpecificity(f),
			}
			candidates = append(candidates, candidate)
			exactPaths[path] = append(exactPaths[path], candidate)
			byCandidate[f] = candidate
		}
	}
	sort.SliceStable(candidates, func(i, j int) bool {
		if candidates[i].path != candidates[j].path {
			return candidates[i].path < candidates[j].path
		}
		return candidates[i].specificity > candidates[j].specificity
	})
	ancestorCandidates := append([]lintPathCandidate(nil), candidates...)
	sortLintAncestorCandidates(ancestorCandidates)
	return candidates, ancestorCandidates, exactPaths, byCandidate
}

func sortLintAncestorCandidates(candidates []lintPathCandidate) {
	sort.SliceStable(candidates, func(i, j int) bool {
		if len(candidates[i].path) != len(candidates[j].path) {
			return len(candidates[i].path) > len(candidates[j].path)
		}
		if candidates[i].specificity != candidates[j].specificity {
			return candidates[i].specificity > candidates[j].specificity
		}
		return candidates[i].path < candidates[j].path
	})
}

func sameLintFile(a, b string) bool {
	a = strings.TrimSpace(a)
	b = strings.TrimSpace(b)
	if a == "" || b == "" {
		return false
	}
	return a == b
}

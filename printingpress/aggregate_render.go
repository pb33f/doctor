// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"sync"
	"time"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const (
	AggregateProgressKindPool = "pool"

	AggregateProgressStatusQueued    = "queued"
	AggregateProgressStatusRunning   = "running"
	AggregateProgressStatusCompleted = "completed"
	AggregateProgressStatusSkipped   = "skipped"
	AggregateProgressStatusFailed    = "failed"
)

// AggregateRenderOptions controls which aggregate outputs are rendered in a single pass.
type AggregateRenderOptions struct {
	HTML             bool
	LLM              bool
	JSON             bool
	ProgressReporter AggregateProgressReporter
	DeveloperMode    bool
	SpecLintResults  map[string][]*v3.RuleFunctionResult
}

// AggregateProgressReporter receives live aggregate pool progress updates.
type AggregateProgressReporter interface {
	ReportAggregateProgress(update AggregateProgressUpdate)
}

// AggregateProgressReporterFunc adapts a function into an AggregateProgressReporter.
type AggregateProgressReporterFunc func(update AggregateProgressUpdate)

// ReportAggregateProgress reports an aggregate progress update.
func (f AggregateProgressReporterFunc) ReportAggregateProgress(update AggregateProgressUpdate) {
	if f != nil {
		f(update)
	}
}

// AggregateProgressUpdate describes the latest state of one aggregate render pool.
type AggregateProgressUpdate struct {
	Kind           string
	PoolID         int
	PoolLabel      string
	Status         string
	CompletedSpecs int
	TotalSpecs     int
	CompletedBytes int64
	TotalBytes     int64
	CurrentSpec    string
	LastSpec       string
	CurrentStage   string
	CurrentPercent float64
	OverallPercent float64
	Error          string
}

type aggregateOutputSelection struct {
	html bool
	llm  bool
	json bool
}

type aggregateRenderPool struct {
	id         int
	specs      []*aggregateDiscoveredSpec
	totalSpecs int
	totalBytes int64
}

type aggregatePoolProgressState struct {
	poolID         int
	poolLabel      string
	totalSpecs     int
	totalBytes     int64
	completedSpecs int
	completedBytes int64
	currentSpec    string
	lastSpec       string
	currentStage   string
	currentPercent float64
	currentBytes   int64
}

type aggregateRenderResult struct {
	spec        *aggregateDiscoveredSpec
	staged      *aggregateStagedOutput
	skipMessage string
	skipErr     error
	fatalErr    error
}

type aggregateStagedOutput struct {
	stagedOutput  string
	entryOutput   string
	relativeFiles []string
	configHash    string
}

var aggregateRenderResultPool = sync.Pool{
	New: func() any {
		return &aggregateRenderResult{}
	},
}

func (ap *AggregatePrintingPress) PrintSelectedOutputs(options AggregateRenderOptions) (*AggregatePressStatistics, error) {
	ap.mu.Lock()
	defer ap.mu.Unlock()

	ap.developerMode = options.DeveloperMode
	ap.specLintResults = cloneAggregateLintResultsMap(options.SpecLintResults)

	totalStart := time.Now()
	selection := aggregateOutputSelection{
		html: options.HTML,
		llm:  options.LLM,
		json: options.JSON,
	}
	if !selection.any() {
		return nil, fmt.Errorf("printingpress: no aggregate outputs selected")
	}

	plan, err := ap.refreshPlanLocked(aggregatePlanIntent{selection: selection, preflight: true})
	if err != nil {
		return nil, err
	}
	defer releaseAggregatePrebuiltSites(plan)
	generationStart := time.Now()
	if err := os.MkdirAll(ap.config.OutputDir, 0o755); err != nil {
		return nil, fmt.Errorf("printingpress: creating aggregate output dir: %w", err)
	}

	var written []string
	if selection.html {
		for _, dir := range pppaths.StaticDirs() {
			if err := os.MkdirAll(filepath.Join(ap.config.OutputDir, dir), 0o755); err != nil {
				return nil, err
			}
		}
		staticFiles, err := copyEmbeddedStatic(ap.config.OutputDir)
		if err != nil {
			return nil, err
		}
		written = append(written, staticFiles...)
	}

	specFiles, poolsUsed, err := ap.renderSelectedOutputsUntilStable(plan, selection, options.ProgressReporter)
	if err != nil {
		return nil, err
	}
	written = append(written, specFiles...)
	ap.finalizeCatalog(plan.catalog)
	if selection.html {
		aggregatePages, err := ap.writeCatalogHTML(plan.catalog)
		if err != nil {
			return nil, err
		}
		written = append(written, aggregatePages...)
	}
	if selection.llm {
		aggregateFiles, err := ap.writeCatalogLLM(plan.catalog)
		if err != nil {
			return nil, err
		}
		written = append(written, aggregateFiles...)
	}
	if selection.json {
		aggregateFiles, err := ap.writeCatalogJSON(plan.catalog)
		if err != nil {
			return nil, err
		}
		written = append(written, aggregateFiles...)
	}
	if !aggregatePlanHasRenderFailures(plan) {
		if err := ap.reconcileCleanupTombstoneEntryArtifacts(plan, selection); err != nil {
			return nil, err
		}
		if err := ap.pruneObsoleteOutputs(plan, selection); err != nil {
			return nil, err
		}
		if err := ap.pruneObsoleteAggregateArtifacts(plan, selection); err != nil {
			return nil, err
		}
	}

	if err := ap.persistState(plan, selection); err != nil {
		return nil, err
	}

	stats := ap.buildAggregateStatistics(plan, written, plan.duration, time.Since(generationStart), time.Since(totalStart))
	stats.PoolsUsed = poolsUsed
	stats.WorkersPerPool = ap.config.WorkersPerPool
	stats.AvailableCores = max(1, runtime.GOMAXPROCS(0))
	return stats, nil
}

func (ap *AggregatePrintingPress) renderSelectedOutputsUntilStable(plan *aggregateBuildPlan, selection aggregateOutputSelection, reporter AggregateProgressReporter) ([]string, int, error) {
	if plan == nil {
		return nil, 0, nil
	}
	pending := append([]*aggregateDiscoveredSpec(nil), plan.changed...)
	stagedByPath := make(map[string]*aggregateStagedOutput, len(pending))
	cleanup := newAggregateStagedCleanupTracker()
	defer cleanup.finalize(ap, plan, stagedByPath)
	skippedCount := aggregateSkippedSpecCount(plan.discovered)
	totalPoolsUsed := 0
	poolIDOffset := 0
	renderIterations := 0
	for {
		for len(pending) > 0 {
			if renderIterations >= max(1, len(plan.discovered)) {
				return nil, 0, fmt.Errorf("printingpress: aggregate output stabilization exceeded %d entries", len(plan.discovered))
			}
			renderIterations++
			pools := ap.planRenderPools(pending)
			totalPoolsUsed += len(pools)
			for _, pool := range pools {
				pool.id += poolIDOffset
			}
			poolIDOffset += len(pools)
			ap.reportAggregatePoolLayout(reporter, pools)
			staged, err := ap.renderSelectedOutputsInPools(plan, catalogEntryIndex(plan.catalog), pools, selection, reporter)
			for relativePath, stage := range staged {
				if stagedByPath[relativePath] != nil {
					cleanup.discard(ap, stagedByPath, relativePath)
				}
				stagedByPath[relativePath] = stage
			}
			if err != nil {
				return nil, 0, err
			}
			newSkippedCount := aggregateSkippedSpecCount(plan.discovered)
			if newSkippedCount < skippedCount {
				return nil, 0, fmt.Errorf("printingpress: aggregate output stabilization violated monotonic skip invariant")
			}
			if newSkippedCount > skippedCount {
				skippedCount = newSkippedCount
				if err := ap.refreshAggregateAfterRenderSkip(plan, selection); err != nil {
					return nil, 0, err
				}
			}
			pending = ap.reconcileAggregateStagedOutputs(plan, selection, stagedByPath, cleanup)
		}

		ordered := aggregateOrderedStagedSpecs(plan, stagedByPath)
		if len(ordered) == 0 {
			plan.changed = plan.changed[:0]
			plan.completed = make(map[string]struct{})
			return nil, totalPoolsUsed, nil
		}
		written, failedSpec, promotionErr, fatalErr := ap.promoteAggregateStableBatch(plan, ordered, stagedByPath)
		if fatalErr != nil {
			return nil, 0, fatalErr
		}
		if failedSpec == nil {
			plan.changed = append(plan.changed[:0], ordered...)
			plan.completed = make(map[string]struct{}, len(ordered))
			for _, spec := range ordered {
				plan.completed[spec.RelativePath] = struct{}{}
			}
			sort.Strings(written)
			return written, totalPoolsUsed, nil
		}

		ap.markRenderFailed(plan, failedSpec, catalogEntryIndex(plan.catalog)[failedSpec.RelativePath], "skipped output promotion for discovered spec", promotionErr)
		cleanup.discard(ap, stagedByPath, failedSpec.RelativePath)
		skippedCount = aggregateSkippedSpecCount(plan.discovered)
		if err := ap.refreshAggregateAfterRenderSkip(plan, selection); err != nil {
			return nil, 0, err
		}
		pending = ap.reconcileAggregateStagedOutputs(plan, selection, stagedByPath, cleanup)
	}
}

func (ap *AggregatePrintingPress) refreshAggregateAfterRenderSkip(plan *aggregateBuildPlan, selection aggregateOutputSelection) error {
	resolveAggregateExternalMessageHrefs(plan.catalog, plan.discovered)
	ap.finalizeCatalog(plan.catalog)
	ap.applyAggregateNavigationFingerprints(plan.catalog, plan.discovered)
	return ap.preflightChangedEntries(plan, selection)
}

func (ap *AggregatePrintingPress) reconcileAggregateStagedOutputs(plan *aggregateBuildPlan, selection aggregateOutputSelection, stagedByPath map[string]*aggregateStagedOutput, cleanup *aggregateStagedCleanupTracker) []*aggregateDiscoveredSpec {
	pending := make([]*aggregateDiscoveredSpec, 0)
	for _, spec := range plan.discovered {
		if spec == nil {
			continue
		}
		stage := stagedByPath[spec.RelativePath]
		if spec.RenderSkipped || !aggregateSpecSelectedOutputDirty(spec, selection, ap.config.BuildMode) {
			cleanup.discard(ap, stagedByPath, spec.RelativePath)
			continue
		}
		if stage == nil || stage.configHash != spec.ConfigHash {
			cleanup.discard(ap, stagedByPath, spec.RelativePath)
			pending = append(pending, spec)
		}
	}
	return pending
}

func aggregateOrderedStagedSpecs(plan *aggregateBuildPlan, stagedByPath map[string]*aggregateStagedOutput) []*aggregateDiscoveredSpec {
	ordered := make([]*aggregateDiscoveredSpec, 0, len(stagedByPath))
	for _, spec := range plan.discovered {
		if spec != nil && stagedByPath[spec.RelativePath] != nil {
			ordered = append(ordered, spec)
		}
	}
	sort.Slice(ordered, func(i, j int) bool {
		return ordered[i].RelativePath < ordered[j].RelativePath
	})
	return ordered
}

type aggregateBatchPromotion struct {
	spec        *aggregateDiscoveredSpec
	stage       *aggregateStagedOutput
	transaction *aggregateEntryPromotion
}

func (ap *AggregatePrintingPress) promoteAggregateStableBatch(plan *aggregateBuildPlan, ordered []*aggregateDiscoveredSpec, stagedByPath map[string]*aggregateStagedOutput) ([]string, *aggregateDiscoveredSpec, error, error) {
	installed := make([]aggregateBatchPromotion, 0, len(ordered))
	begin := beginAggregateEntryPromotion
	if ap.beginEntryPromotion != nil {
		begin = ap.beginEntryPromotion
	}
	for _, spec := range ordered {
		stage := stagedByPath[spec.RelativePath]
		transaction, promotionErr, localRollbackErr := begin(stage.stagedOutput, stage.entryOutput)
		if promotionErr != nil {
			var rollbackErrors []error
			if localRollbackErr != nil {
				rollbackErrors = append(rollbackErrors, localRollbackErr)
			}
			for i := len(installed) - 1; i >= 0; i-- {
				if rollbackErr := installed[i].transaction.rollback(); rollbackErr != nil {
					rollbackErrors = append(rollbackErrors, fmt.Errorf("%s: %w", installed[i].spec.RelativePath, rollbackErr))
				}
			}
			if len(rollbackErrors) > 0 {
				return nil, nil, nil, fmt.Errorf("printingpress: promotion failed for %s and batch rollback failed: %w", spec.RelativePath, errors.Join(append([]error{promotionErr}, rollbackErrors...)...))
			}
			return nil, spec, promotionErr, nil
		}
		installed = append(installed, aggregateBatchPromotion{spec: spec, stage: stage, transaction: transaction})
	}

	cleanupBackup := os.RemoveAll
	if ap.cleanupPromotionBackup != nil {
		cleanupBackup = ap.cleanupPromotionBackup
	}
	written := make([]string, 0)
	for _, promotion := range installed {
		if err := promotion.transaction.cleanupBackup(cleanupBackup); err != nil {
			ap.markPromotionCleanupWarning(plan, promotion.spec, err)
		}
		delete(stagedByPath, promotion.spec.RelativePath)
		for _, relPath := range promotion.stage.relativeFiles {
			written = append(written, filepath.Join(promotion.stage.entryOutput, filepath.FromSlash(relPath)))
		}
	}
	return written, nil, nil, nil
}

type aggregateStagedCleanupTracker struct {
	pending map[string]string
}

func newAggregateStagedCleanupTracker() *aggregateStagedCleanupTracker {
	return &aggregateStagedCleanupTracker{pending: make(map[string]string)}
}

func (c *aggregateStagedCleanupTracker) discard(ap *AggregatePrintingPress, stagedByPath map[string]*aggregateStagedOutput, relativePath string) {
	stage := stagedByPath[relativePath]
	if stage == nil {
		return
	}
	delete(stagedByPath, relativePath)
	if err := ap.removeAggregateStagedOutput(stage.stagedOutput); err != nil {
		c.pending[stage.stagedOutput] = relativePath
	}
}

func (c *aggregateStagedCleanupTracker) finalize(ap *AggregatePrintingPress, plan *aggregateBuildPlan, stagedByPath map[string]*aggregateStagedOutput) {
	for relativePath := range stagedByPath {
		c.discard(ap, stagedByPath, relativePath)
	}
	paths := make([]string, 0, len(c.pending))
	for stagePath := range c.pending {
		paths = append(paths, stagePath)
	}
	sort.Strings(paths)
	for _, stagePath := range paths {
		relativePath := c.pending[stagePath]
		if err := ap.removeAggregateStagedOutput(stagePath); err != nil {
			ap.addAggregateWarning(plan, "unable to remove aggregate staging output; cleanup deferred", relativePath, err)
			continue
		}
		delete(c.pending, stagePath)
	}
}

func (ap *AggregatePrintingPress) removeAggregateStagedOutput(stagePath string) error {
	if ap != nil && ap.removeStagedOutput != nil {
		return ap.removeStagedOutput(stagePath)
	}
	return os.RemoveAll(stagePath)
}

func releaseAggregatePrebuiltSites(plan *aggregateBuildPlan) {
	if plan == nil {
		return
	}
	for _, spec := range plan.discovered {
		if spec != nil {
			spec.prebuiltSite = nil
		}
	}
}

func aggregateSkippedSpecCount(specs []*aggregateDiscoveredSpec) int {
	count := 0
	for _, spec := range specs {
		if spec != nil && spec.RenderSkipped {
			count++
		}
	}
	return count
}

func aggregatePlanHasRenderFailures(plan *aggregateBuildPlan) bool {
	if plan == nil {
		return false
	}
	for _, spec := range plan.discovered {
		if spec != nil && spec.renderFailed {
			return true
		}
	}
	return false
}

func cloneAggregateLintResultsMap(results map[string][]*v3.RuleFunctionResult) map[string][]*v3.RuleFunctionResult {
	if len(results) == 0 {
		return nil
	}
	cloned := make(map[string][]*v3.RuleFunctionResult, len(results))
	for path, pathResults := range results {
		cloned[path] = append([]*v3.RuleFunctionResult(nil), pathResults...)
	}
	return cloned
}

func (ap *AggregatePrintingPress) renderSelectedOutputsInPools(plan *aggregateBuildPlan, entryIndex map[string]*ppmodel.CatalogSpecEntry, pools []*aggregateRenderPool, selection aggregateOutputSelection, reporter AggregateProgressReporter) (map[string]*aggregateStagedOutput, error) {
	if len(pools) == 0 {
		return nil, nil
	}

	resultCount := 0
	for _, pool := range pools {
		resultCount += len(pool.specs)
	}
	results := make(chan *aggregateRenderResult, resultCount)
	var wg sync.WaitGroup
	for _, pool := range pools {
		pool := pool
		wg.Add(1)
		go func() {
			defer wg.Done()
			ap.runRenderPool(pool, entryIndex, selection, reporter, results)
		}()
	}
	go func() {
		wg.Wait()
		close(results)
	}()

	var collected []*aggregateRenderResult
	for result := range results {
		if result != nil {
			collected = append(collected, result)
		}
	}
	sort.Slice(collected, func(i, j int) bool {
		return collected[i].spec.RelativePath < collected[j].spec.RelativePath
	})
	staged := make(map[string]*aggregateStagedOutput, len(collected))
	var fatalErrors []string
	for _, result := range collected {
		if result.staged != nil {
			staged[result.spec.RelativePath] = result.staged
		}
		if result.skipMessage != "" {
			ap.markRenderFailed(plan, result.spec, entryIndex[result.spec.RelativePath], result.skipMessage, result.skipErr)
		}
		if result.fatalErr != nil {
			fatalErrors = append(fatalErrors, fmt.Sprintf("%s: %v", result.spec.RelativePath, result.fatalErr))
		}
		result.reset()
		aggregateRenderResultPool.Put(result)
	}
	if len(fatalErrors) > 0 {
		sort.Strings(fatalErrors)
		return staged, fmt.Errorf("printingpress: aggregate output failed: %s", strings.Join(fatalErrors, "; "))
	}
	return staged, nil
}

func (ap *AggregatePrintingPress) runRenderPool(pool *aggregateRenderPool, entryIndex map[string]*ppmodel.CatalogSpecEntry, selection aggregateOutputSelection, reporter AggregateProgressReporter, results chan<- *aggregateRenderResult) {
	state := aggregatePoolProgressState{
		poolID:     pool.id,
		poolLabel:  fmt.Sprintf("pool-%d", pool.id),
		totalSpecs: pool.totalSpecs,
		totalBytes: pool.totalBytes,
	}

	for _, spec := range pool.specs {
		result := acquireAggregateRenderResult()
		result.spec = spec

		state.beginSpec(spec)
		ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusRunning, ""))

		entry := entryIndex[spec.RelativePath]
		if entry == nil {
			result.fatalErr = fmt.Errorf("missing catalog entry for discovered spec")
		} else {
			staged, renderErr := ap.renderSpecOutputs(spec, entry, selection, reporter, &state)
			result.staged = staged
			if renderErr != nil {
				result.skipMessage = "skipped output render for discovered spec"
				result.skipErr = renderErr
			}
		}

		state.finishSpec(spec)
		status := AggregateProgressStatusCompleted
		errorText := ""
		if result.skipMessage != "" {
			status = AggregateProgressStatusSkipped
			errorText = result.skipErr.Error()
		} else if result.fatalErr != nil {
			status = AggregateProgressStatusFailed
			errorText = result.fatalErr.Error()
		}
		ap.reportAggregateProgress(reporter, state.snapshot(status, errorText))
		results <- result
	}

	ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusCompleted, ""))
}

func (ap *AggregatePrintingPress) renderSpecOutputs(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry, selection aggregateOutputSelection, reporter AggregateProgressReporter, state *aggregatePoolProgressState) (result *aggregateStagedOutput, resultErr error) {
	steps := selection.stageCount()
	completedStages := 0
	var progressMu sync.Mutex
	reportStageLocked := func(stage string, specPercent float64) {
		state.currentStage = stage
		state.currentPercent = aggregateClampPercent(specPercent)
		ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusRunning, ""))
	}
	reportStage := func(stage string, specPercent float64) {
		progressMu.Lock()
		defer progressMu.Unlock()
		reportStageLocked(stage, specPercent)
	}

	reportStage("building model", 0)
	site := spec.prebuiltSite
	if site == nil {
		var err error
		site, err = ap.buildEntrySite(spec, entry)
		if err != nil {
			return nil, fmt.Errorf("building model after successful preflight: %w", err)
		}
	}
	site.HeaderContext = entry.HeaderContext
	applyAggregateExternalMessageHrefs(site, spec.externalMessageHrefs)
	completedStages++
	reportStage("model built", float64(completedStages)/float64(steps))

	entryOutput := filepath.Join(ap.config.OutputDir, filepath.FromSlash(spec.OutputSubdir))
	stagedOutput, err := ap.stageAggregateEntryOutput(entryOutput, selection)
	if err != nil {
		return nil, fmt.Errorf("preparing output staging: %w", err)
	}
	stagedResult := &aggregateStagedOutput{
		stagedOutput: stagedOutput,
		entryOutput:  entryOutput,
		configHash:   spec.ConfigHash,
	}
	keepStagedOutput := false
	defer func() {
		if !keepStagedOutput {
			if cleanupErr := ap.removeAggregateStagedOutput(stagedOutput); cleanupErr != nil {
				result = stagedResult
			}
		}
	}()
	if err := prepareAggregateEntryOutputDir(stagedOutput, selection); err != nil {
		return nil, fmt.Errorf("preparing selected output: %w", err)
	}
	if selection.html {
		lastBucket := -1
		_, err := writeHTMLSiteDetailed(site, stagedOutput, "", func(task string, completed, total int) {
			specPercent := aggregateStageProgress(completedStages, steps, completed, total)
			progressMu.Lock()
			defer progressMu.Unlock()
			bucket := aggregateProgressBucket(specPercent)
			if bucket == lastBucket && completed < total {
				return
			}
			lastBucket = bucket
			reportStageLocked(task, specPercent)
		})
		if err != nil {
			return nil, fmt.Errorf("writing html: %w", err)
		}
		completedStages++
		reportStage("html complete", float64(completedStages)/float64(steps))
	}

	if selection.llm {
		lastBucket := -1
		_, err := writeLLMSiteDetailed(site, stagedOutput, func(task string, completed, total int) {
			specPercent := aggregateStageProgress(completedStages, steps, completed, total)
			progressMu.Lock()
			defer progressMu.Unlock()
			bucket := aggregateProgressBucket(specPercent)
			if bucket == lastBucket && completed < total {
				return
			}
			lastBucket = bucket
			reportStageLocked(task, specPercent)
		})
		if err != nil {
			return nil, fmt.Errorf("writing llm: %w", err)
		}
		completedStages++
		reportStage("llm complete", float64(completedStages)/float64(steps))
	}

	if selection.json {
		reportStage("writing json artifacts", float64(completedStages)/float64(steps))
		if err := PrintJSONArtifacts(site, stagedOutput); err != nil {
			return nil, fmt.Errorf("writing json artifacts: %w", err)
		}
		completedStages++
		reportStage("json artifacts complete", float64(completedStages)/float64(steps))
	}

	files, err := collectFiles(stagedOutput)
	if err != nil {
		return nil, fmt.Errorf("collecting output: %w", err)
	}
	relativeFiles := make([]string, 0, len(files))
	for _, filePath := range files {
		relPath, relErr := filepath.Rel(stagedOutput, filePath)
		if relErr != nil {
			return nil, fmt.Errorf("mapping staged output: %w", relErr)
		}
		relativeFiles = append(relativeFiles, filepath.ToSlash(relPath))
	}
	keepStagedOutput = true
	stagedResult.relativeFiles = relativeFiles
	return stagedResult, nil
}

func (ap *AggregatePrintingPress) planRenderPools(specs []*aggregateDiscoveredSpec) []*aggregateRenderPool {
	poolCount := ap.resolvePoolCount(len(specs))
	if poolCount == 0 {
		return nil
	}
	return buildAggregateRenderPools(specs, poolCount)
}

func prepareAggregateEntryOutputDir(entryOutput string, selection aggregateOutputSelection) error {
	if err := os.MkdirAll(entryOutput, 0o755); err != nil {
		return err
	}
	if selection.llm {
		if err := removeAggregateEntryArtifacts(entryOutput, llmEntryRootFiles(), ".md"); err != nil {
			return err
		}
		if err := removeLLMShardFiles(entryOutput); err != nil {
			return err
		}
	}
	if selection.json {
		if err := removeAggregateEntryArtifacts(entryOutput, jsonEntryRootFiles(), ".json"); err != nil {
			return err
		}
	}
	return nil
}

func removeAggregateEntryArtifacts(entryOutput string, rootFiles []string, extension string) error {
	for _, name := range rootFiles {
		if err := os.Remove(filepath.Join(entryOutput, name)); err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	for _, dir := range []string{pppaths.DirOperations, pppaths.DirModels} {
		if err := removeFilesWithExtension(filepath.Join(entryOutput, dir), extension); err != nil {
			return err
		}
	}
	return nil
}

func removeFilesWithExtension(root, extension string) error {
	if extension == "" {
		return nil
	}
	if _, err := os.Stat(root); err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	return filepath.WalkDir(root, func(filePath string, d os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if d.IsDir() || filepath.Ext(filePath) != extension {
			return nil
		}
		if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
			return err
		}
		return nil
	})
}

func llmEntryRootFiles() []string {
	return []string{
		pppaths.FileAgentsGuide,
		pppaths.FileLLMIndex,
		pppaths.FileLLMFull,
		pppaths.FileLLMOperations,
		pppaths.FileLLMModels,
	}
}

func jsonEntryRootFiles() []string {
	return []string{
		pppaths.FileBundleJSON,
		pppaths.FileIndexJSON,
		pppaths.FileNavJSON,
		pppaths.FileManifestJSON,
	}
}

func (ap *AggregatePrintingPress) resolvePoolCount(specCount int) int {
	if specCount <= 0 {
		return 0
	}
	availableCores := max(1, runtime.GOMAXPROCS(0))
	workersPerPool := max(1, min(ap.config.WorkersPerPool, availableCores))
	maxPools := max(1, min(ap.config.MaxPools, availableCores))
	poolCount := availableCores / workersPerPool
	if poolCount < 1 {
		poolCount = 1
	}
	poolCount = min(poolCount, maxPools)
	poolCount = min(poolCount, specCount)
	return max(1, poolCount)
}

func buildAggregateRenderPools(specs []*aggregateDiscoveredSpec, poolCount int) []*aggregateRenderPool {
	if poolCount <= 0 || len(specs) == 0 {
		return nil
	}

	ordered := append([]*aggregateDiscoveredSpec(nil), specs...)
	sort.Slice(ordered, func(i, j int) bool {
		left := aggregateSpecWeight(ordered[i])
		right := aggregateSpecWeight(ordered[j])
		if left == right {
			return ordered[i].RelativePath < ordered[j].RelativePath
		}
		return left > right
	})

	pools := make([]*aggregateRenderPool, 0, poolCount)
	for i := 0; i < poolCount; i++ {
		pools = append(pools, &aggregateRenderPool{id: i + 1})
	}

	for _, spec := range ordered {
		target := pools[0]
		for _, candidate := range pools[1:] {
			if candidate.totalBytes < target.totalBytes {
				target = candidate
				continue
			}
			if candidate.totalBytes == target.totalBytes && candidate.totalSpecs < target.totalSpecs {
				target = candidate
			}
		}
		target.specs = append(target.specs, spec)
		target.totalSpecs++
		target.totalBytes += aggregateSpecWeight(spec)
	}

	for _, pool := range pools {
		sort.Slice(pool.specs, func(i, j int) bool {
			return pool.specs[i].RelativePath < pool.specs[j].RelativePath
		})
	}
	return pools
}

func (ap *AggregatePrintingPress) reportAggregatePoolLayout(reporter AggregateProgressReporter, pools []*aggregateRenderPool) {
	for _, pool := range pools {
		state := aggregatePoolProgressState{
			poolID:     pool.id,
			poolLabel:  fmt.Sprintf("pool-%d", pool.id),
			totalSpecs: pool.totalSpecs,
			totalBytes: pool.totalBytes,
		}
		ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusQueued, ""))
	}
}

func (ap *AggregatePrintingPress) reportAggregateProgress(reporter AggregateProgressReporter, update AggregateProgressUpdate) {
	if reporter == nil {
		return
	}
	reporter.ReportAggregateProgress(update)
}

func (s aggregateOutputSelection) any() bool {
	return s.html || s.llm || s.json
}

func (s aggregateOutputSelection) stageCount() int {
	total := 1 // build the site once, then write selected outputs.
	if s.html {
		total++
	}
	if s.llm {
		total++
	}
	if s.json {
		total++
	}
	return max(1, total)
}

func (s *aggregatePoolProgressState) beginSpec(spec *aggregateDiscoveredSpec) {
	s.currentSpec = spec.RelativePath
	s.currentStage = "building model"
	s.currentPercent = 0
	s.currentBytes = aggregateSpecWeight(spec)
}

func (s *aggregatePoolProgressState) finishSpec(spec *aggregateDiscoveredSpec) {
	s.completedSpecs++
	s.completedBytes += aggregateSpecWeight(spec)
	if spec != nil {
		s.lastSpec = spec.RelativePath
	}
	s.currentSpec = ""
	s.currentStage = ""
	s.currentPercent = 0
	s.currentBytes = 0
}

func (s *aggregatePoolProgressState) snapshot(status, errorText string) AggregateProgressUpdate {
	return AggregateProgressUpdate{
		Kind:           AggregateProgressKindPool,
		PoolID:         s.poolID,
		PoolLabel:      s.poolLabel,
		Status:         status,
		CompletedSpecs: s.completedSpecs,
		TotalSpecs:     s.totalSpecs,
		CompletedBytes: s.completedBytes,
		TotalBytes:     s.totalBytes,
		CurrentSpec:    s.currentSpec,
		LastSpec:       s.lastSpec,
		CurrentStage:   s.currentStage,
		CurrentPercent: aggregateClampPercent(s.currentPercent),
		OverallPercent: s.overallPercent(),
		Error:          errorText,
	}
}

func (s *aggregatePoolProgressState) overallPercent() float64 {
	if s.totalBytes <= 0 {
		if s.totalSpecs <= 0 {
			return 1
		}
		overall := float64(s.completedSpecs)
		if s.currentSpec != "" {
			overall += aggregateClampPercent(s.currentPercent)
		}
		return aggregateClampPercent(overall / float64(s.totalSpecs))
	}
	overall := float64(s.completedBytes)
	if s.currentBytes > 0 {
		overall += float64(s.currentBytes) * aggregateClampPercent(s.currentPercent)
	}
	return aggregateClampPercent(overall / float64(s.totalBytes))
}

func aggregateSpecWeight(spec *aggregateDiscoveredSpec) int64 {
	if spec == nil || spec.SizeBytes <= 0 {
		return 1
	}
	return spec.SizeBytes
}

func aggregateStageProgress(completedStages, totalStages, completed, total int) float64 {
	stagePercent := 0.0
	if total > 0 {
		stagePercent = float64(completed) / float64(total)
	}
	return aggregateClampPercent((float64(completedStages) + aggregateClampPercent(stagePercent)) / float64(max(1, totalStages)))
}

func aggregateProgressBucket(percent float64) int {
	return int(aggregateClampPercent(percent) * 20)
}

func aggregateClampPercent(percent float64) float64 {
	if percent < 0 {
		return 0
	}
	if percent > 1 {
		return 1
	}
	return percent
}

func acquireAggregateRenderResult() *aggregateRenderResult {
	result, _ := aggregateRenderResultPool.Get().(*aggregateRenderResult)
	if result == nil {
		return &aggregateRenderResult{}
	}
	return result
}

func (r *aggregateRenderResult) reset() {
	if r == nil {
		return
	}
	r.spec = nil
	r.staged = nil
	r.skipMessage = ""
	r.skipErr = nil
	r.fatalErr = nil
}

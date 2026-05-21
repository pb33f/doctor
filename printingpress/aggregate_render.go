// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"sync"
	"time"

	"github.com/pb33f/doctor/printingpress/internal/pppaths"
	ppmodel "github.com/pb33f/doctor/printingpress/model"
)

const (
	AggregateProgressKindPool = "pool"

	AggregateProgressStatusQueued    = "queued"
	AggregateProgressStatusRunning   = "running"
	AggregateProgressStatusCompleted = "completed"
	AggregateProgressStatusSkipped   = "skipped"
)

// AggregateRenderOptions controls which aggregate outputs are rendered in a single pass.
type AggregateRenderOptions struct {
	HTML             bool
	LLM              bool
	JSON             bool
	ProgressReporter AggregateProgressReporter
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
	written     []string
	skipMessage string
	skipErr     error
}

var aggregateRenderResultPool = sync.Pool{
	New: func() any {
		return &aggregateRenderResult{}
	},
}

func (ap *AggregatePrintingPress) PrintSelectedOutputs(options AggregateRenderOptions) (*AggregatePressStatistics, error) {
	ap.mu.Lock()
	defer ap.mu.Unlock()

	totalStart := time.Now()
	selection := aggregateOutputSelection{
		html: options.HTML,
		llm:  options.LLM,
		json: options.JSON,
	}
	if !selection.any() {
		return nil, fmt.Errorf("printingpress: no aggregate outputs selected")
	}

	plan, err := ap.refreshPlanLocked()
	if err != nil {
		return nil, err
	}

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

	if err := ap.pruneObsoleteOutputs(plan, selection.html); err != nil {
		return nil, err
	}

	entryIndex := catalogEntryIndex(plan.catalog)
	pools := ap.planRenderPools(plan.changed)
	ap.reportAggregatePoolLayout(options.ProgressReporter, pools)

	specFiles, err := ap.renderSelectedOutputsInPools(plan, entryIndex, pools, selection, options.ProgressReporter)
	if err != nil {
		return nil, err
	}
	written = append(written, specFiles...)
	ap.finalizeCatalog(plan.catalog)
	if selection.html {
		if err := ap.refreshRenderedEntryHeaderContexts(plan.catalog, aggregateImpactedServiceKeys(plan)); err != nil {
			return nil, err
		}
	}
	if err := ap.pruneObsoleteAggregateArtifacts(plan, selection); err != nil {
		return nil, err
	}

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

	if err := ap.persistState(plan); err != nil {
		return nil, err
	}

	stats := ap.buildAggregateStatistics(plan, written, plan.duration, time.Since(generationStart), time.Since(totalStart))
	stats.PoolsUsed = len(pools)
	stats.WorkersPerPool = ap.config.WorkersPerPool
	stats.AvailableCores = max(1, runtime.GOMAXPROCS(0))
	return stats, nil
}

func (ap *AggregatePrintingPress) renderSelectedOutputsInPools(plan *aggregateBuildPlan, entryIndex map[string]*ppmodel.CatalogSpecEntry, pools []*aggregateRenderPool, selection aggregateOutputSelection, reporter AggregateProgressReporter) ([]string, error) {
	if len(pools) == 0 {
		return nil, nil
	}

	results := make(chan *aggregateRenderResult, len(plan.changed))
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

	var written []string
	for result := range results {
		if result == nil {
			continue
		}
		if result.skipMessage != "" {
			ap.markRenderSkipped(plan, result.spec, entryIndex[result.spec.RelativePath], result.skipMessage, result.skipErr)
		}
		written = append(written, result.written...)
		result.reset()
		aggregateRenderResultPool.Put(result)
	}
	return written, nil
}

func (ap *AggregatePrintingPress) runRenderPool(pool *aggregateRenderPool, entryIndex map[string]*ppmodel.CatalogSpecEntry, selection aggregateOutputSelection, reporter AggregateProgressReporter, results chan<- *aggregateRenderResult) {
	state := aggregatePoolProgressState{
		poolID:     pool.id,
		poolLabel:  fmt.Sprintf("pool-%d", pool.id),
		totalSpecs: pool.totalSpecs,
		totalBytes: pool.totalBytes,
	}
	ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusQueued, ""))

	for _, spec := range pool.specs {
		result := acquireAggregateRenderResult()
		result.spec = spec

		state.beginSpec(spec)
		ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusRunning, ""))

		entry := entryIndex[spec.RelativePath]
		if entry == nil {
			result.skipMessage = "skipped render for discovered spec"
			result.skipErr = fmt.Errorf("missing catalog entry for discovered spec")
		} else {
			files, skipMessage, skipErr := ap.renderSpecOutputs(spec, entry, selection, reporter, &state)
			result.written = append(result.written, files...)
			result.skipMessage = skipMessage
			result.skipErr = skipErr
		}

		state.finishSpec(spec)
		status := AggregateProgressStatusCompleted
		errorText := ""
		if result.skipMessage != "" {
			status = AggregateProgressStatusSkipped
			if result.skipErr != nil {
				errorText = result.skipErr.Error()
			}
		}
		ap.reportAggregateProgress(reporter, state.snapshot(status, errorText))
		results <- result
	}

	ap.reportAggregateProgress(reporter, state.snapshot(AggregateProgressStatusCompleted, ""))
}

func (ap *AggregatePrintingPress) renderSpecOutputs(spec *aggregateDiscoveredSpec, entry *ppmodel.CatalogSpecEntry, selection aggregateOutputSelection, reporter AggregateProgressReporter, state *aggregatePoolProgressState) ([]string, string, error) {
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
	site, err := ap.buildEntrySite(spec, entry)
	if err != nil {
		return nil, "skipped render build for discovered spec", err
	}
	completedStages++
	reportStage("model built", float64(completedStages)/float64(steps))

	entryOutput := filepath.Join(ap.config.OutputDir, filepath.FromSlash(spec.OutputSubdir))
	if err := prepareAggregateEntryOutputDir(entryOutput, selection); err != nil {
		if selection.html {
			return nil, "skipped html render for discovered spec", err
		}
		return nil, "skipped output directory setup for discovered spec", err
	}
	if selection.html {
		lastBucket := -1
		_, err := writeHTMLSiteDetailed(site, entryOutput, "", func(task string, completed, total int) {
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
			return nil, "skipped html render for discovered spec", err
		}
		completedStages++
		reportStage("html complete", float64(completedStages)/float64(steps))
	}

	if selection.llm {
		lastBucket := -1
		_, err := writeLLMSiteDetailed(site, entryOutput, func(task string, completed, total int) {
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
			return nil, "skipped llm write for discovered spec", err
		}
		completedStages++
		reportStage("llm complete", float64(completedStages)/float64(steps))
	}

	if selection.json {
		reportStage("writing json artifacts", float64(completedStages)/float64(steps))
		if err := PrintJSONArtifacts(site, entryOutput); err != nil {
			return nil, "skipped json artifact write for discovered spec", err
		}
		completedStages++
		reportStage("json artifacts complete", float64(completedStages)/float64(steps))
	}

	files, err := collectFiles(entryOutput)
	if err != nil {
		return nil, "skipped output collection for discovered spec", err
	}
	return files, "", nil
}

func (ap *AggregatePrintingPress) planRenderPools(specs []*aggregateDiscoveredSpec) []*aggregateRenderPool {
	poolCount := ap.resolvePoolCount(len(specs))
	if poolCount == 0 {
		return nil
	}
	return buildAggregateRenderPools(specs, poolCount)
}

func prepareAggregateEntryOutputDir(entryOutput string, selection aggregateOutputSelection) error {
	switch {
	case selection.html:
		return removeAndRecreateDir(entryOutput)
	case selection.llm || selection.json:
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

func aggregateImpactedServiceKeys(plan *aggregateBuildPlan) map[string]struct{} {
	services := make(map[string]struct{})
	if plan == nil {
		return services
	}
	for _, spec := range plan.changed {
		if spec == nil {
			continue
		}
		if spec.ServiceKey != "" {
			services[spec.ServiceKey] = struct{}{}
		}
		if spec.previousState != nil && spec.previousState.ServiceKey != "" {
			services[spec.previousState.ServiceKey] = struct{}{}
		}
	}
	for _, record := range plan.removed {
		if record == nil || record.ServiceKey == "" {
			continue
		}
		services[record.ServiceKey] = struct{}{}
	}
	return services
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
	r.written = r.written[:0]
	r.skipMessage = ""
	r.skipErr = nil
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/datamodel"
	highv3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

// PrintingPressConfig configures how a printing press builds and writes docs.
//
// A nil config is treated as an empty config and uses the default options.
type PrintingPressConfig struct {
	Title     string
	BaseURL   string
	BasePath  string
	OutputDir string
}

/*
Future design note, intentionally not part of the compiled API yet:

type OpenapiChangesConfig struct {
	ComparisonSpecPath      string
	ComparisonDirectoryPath string
	BreakingChanges         *BreakingChangeConfig
}

type BreakingChangeConfig struct {
	Enabled bool
}
*/

// PressStatistics reports the outcome of a single print run, including any
// non-fatal build warnings carried into the rendered site.
type PressStatistics struct {
	JobID              string
	JobType            string
	Pages              int
	Models             int
	Operations         int
	ClassDiagrams      int
	DependencyGraphs   int
	FilesWritten       int
	BytesWritten       int64
	FileSizes          map[string]int64
	Warnings           []*BuildWarning
	ModelBuildDuration time.Duration
	GenerationDuration time.Duration
	TotalDuration      time.Duration
}

type pressSource struct {
	specBytes []byte
	v3Model   *libopenapi.DocumentModel[highv3.Document]
	drModel   *model.DrDocument
}

var bundleBytesWithOrigins = bundler.BundleBytesComposedWithOrigins

func createPrintingPress(config *PrintingPressConfig, source pressSource) (*PrintingPress, error) {
	normalized, err := validateAndNormalizeConfig(config, source)
	if err != nil {
		return nil, err
	}
	return &PrintingPress{
		config:   normalized,
		source:   source,
		activity: newActivityManager(),
	}, nil
}

// CreatePrintingPressFromBytes creates a printing press from raw OpenAPI bytes.
//
// BasePath is used to resolve file references when the source spans multiple files.
// A nil config uses the default options.
func CreatePrintingPressFromBytes(specBytes []byte, config *PrintingPressConfig) (*PrintingPress, error) {
	return createPrintingPress(clonePrintingPressConfig(config), pressSource{specBytes: specBytes})
}

// CreatePrintingPressFromV3Model creates a printing press from an existing libopenapi v3 model.
// A nil config uses the default options.
func CreatePrintingPressFromV3Model(v3Model *libopenapi.DocumentModel[highv3.Document], config *PrintingPressConfig) (*PrintingPress, error) {
	return createPrintingPress(clonePrintingPressConfig(config), pressSource{v3Model: v3Model})
}

// CreatePrintingPressFromDrModel creates a printing press from an existing doctor model.
// A nil config uses the default options.
func CreatePrintingPressFromDrModel(drModel *model.DrDocument, config *PrintingPressConfig) (*PrintingPress, error) {
	return createPrintingPress(clonePrintingPressConfig(config), pressSource{drModel: drModel})
}

// ActivityStream returns a best-effort live stream of activity snapshots for the
// current job.
//
// If a job is already running, the latest known snapshot for that job is made
// available immediately. Subscribers attached to that job are closed
// automatically after its terminal update is delivered.
//
// The stream is intended for live terminal progress and does not provide
// durable buffering or replay guarantees. Slow consumers may miss intermediate
// updates and only receive the most recent live state.
//
// A subscription created after a job has already finished stays idle until the
// next job starts.
func (pp *PrintingPress) ActivityStream() *ActivitySubscription {
	if pp.activity == nil {
		pp.activity = newActivityManager()
	}
	return pp.activity.subscribe()
}

// PressModel builds the in-memory site graph, caches it for later print
// operations, and returns it without writing any output files.
//
// The returned Site is the cached mutable instance owned by the PrintingPress.
// Later calls to PressModel, PrintHTML, and PrintLLM reuse that same value.
// Any caller mutations are reflected in subsequent print operations.
func (pp *PrintingPress) PressModel() (*Site, error) {
	pp.mu.Lock()
	defer pp.mu.Unlock()

	job := pp.startActivityJob(jobTypeModel)
	defer func() {
		pp.currentJob = nil
		job.finish()
	}()

	if pp.modelBuilt {
		job.complete("model already built")
		return pp.site, nil
	}

	buildStart := time.Now()
	if err := pp.buildModel(job); err != nil {
		job.fail(err)
		return nil, err
	}
	pp.modelBuildDuration = time.Since(buildStart)
	pp.modelBuilt = true
	job.complete("model build complete")
	return pp.site, nil
}

// PrintHTML writes the HTML site to disk and returns statistics for the run.
//
// It builds the in-memory model first if needed.
func (pp *PrintingPress) PrintHTML() (*PressStatistics, error) {
	pp.mu.Lock()
	defer pp.mu.Unlock()

	job := pp.startActivityJob(jobTypeHTML)
	defer func() {
		pp.currentJob = nil
		job.finish()
	}()

	start := time.Now()
	buildDuration, err := pp.ensureModelBuilt(job)
	if err != nil {
		job.fail(err)
		return nil, err
	}

	job.snapshot("writing html output", 0, 0, 0)
	generationStart := time.Now()
	written, err := writeHTMLSiteDetailed(pp.site, "", "", func(task string, completed, total int) {
		job.snapshot(task, int64(completed), int64(total), 0)
	})
	if err != nil {
		job.fail(err)
		return nil, err
	}
	generationDuration := time.Since(generationStart)

	stats, err := pp.buildStatistics(job.job, written, buildDuration, generationDuration, time.Since(start))
	if err != nil {
		job.fail(err)
		return nil, err
	}
	job.complete("html render complete")
	return stats, nil
}

// PrintLLM writes LLM-oriented documentation files in the llms.txt format to
// disk and returns statistics for the run.
//
// It builds the in-memory model first if needed.
func (pp *PrintingPress) PrintLLM() (*PressStatistics, error) {
	pp.mu.Lock()
	defer pp.mu.Unlock()

	job := pp.startActivityJob(jobTypeLLM)
	defer func() {
		pp.currentJob = nil
		job.finish()
	}()

	start := time.Now()
	buildDuration, err := pp.ensureModelBuilt(job)
	if err != nil {
		job.fail(err)
		return nil, err
	}

	job.snapshot("writing llm output", 0, 0, 0)
	generationStart := time.Now()
	written, err := writeLLMSiteDetailed(pp.site, "", func(task string, completed, total int) {
		job.snapshot(task, int64(completed), int64(total), 0)
	})
	if err != nil {
		job.fail(err)
		return nil, err
	}
	generationDuration := time.Since(generationStart)

	stats, err := pp.buildStatistics(job.job, written, buildDuration, generationDuration, time.Since(start))
	if err != nil {
		job.fail(err)
		return nil, err
	}
	job.complete("llm render complete")
	return stats, nil
}

func (pp *PrintingPress) startActivityJob(jobType string) *activityJob {
	if pp.activity == nil {
		pp.activity = newActivityManager()
	}
	job := pp.activity.startJob(jobType, pp.describeTitle(), pp.resolveConfiguredOutputDir(), pp.sourceKind())
	pp.currentJob = job
	return job
}

func (pp *PrintingPress) ensureModelBuilt(job *activityJob) (time.Duration, error) {
	if pp.modelBuilt {
		job.snapshot("using cached model", 1, 1, 0)
		return 0, nil
	}
	job.snapshot("building model", 0, 1, 0)
	buildStart := time.Now()
	if err := pp.buildModel(job); err != nil {
		return 0, err
	}
	pp.modelBuildDuration = time.Since(buildStart)
	pp.modelBuilt = true
	return pp.modelBuildDuration, nil
}

func (pp *PrintingPress) buildModel(job *activityJob) error {
	engineConfig, err := pp.prepareEngineConfig(job)
	if err != nil {
		return err
	}

	pp.initEngine(engineConfig)
	pp.currentJob = job
	site, err := pp.pressSite()
	if err != nil {
		return err
	}
	pp.site = site
	return nil
}

func (pp *PrintingPress) prepareEngineConfig(job *activityJob) (*pressEngineConfig, error) {
	if pp.config == nil {
		pp.config = &PrintingPressConfig{}
	}

	outputDir, err := pp.resolveOutputDir()
	if err != nil {
		return nil, err
	}

	cfg := &pressEngineConfig{
		OutputDir: outputDir,
		BaseURL:   pp.config.BaseURL,
		Title:     pp.config.Title,
		Logger:    slog.Default(),
		SyntheticTagFallback: &SyntheticTagFallbackConfig{
			Enabled:         true,
			MaxDistinctTags: 2,
			MinOperations:   25,
		},
	}

	switch {
	case pp.source.drModel != nil:
		job.snapshot("using existing doctor model", 1, 1, 0)
		cfg.DrDoc = pp.source.drModel
	case pp.source.v3Model != nil:
		job.snapshot("building doctor model", 0, 1, 0)
		cfg.DrDoc = buildDrDocument(pp.source.v3Model)
		job.snapshot("doctor model built", 1, 1, 0)
	case len(pp.source.specBytes) > 0:
		specBytes := pp.source.specBytes
		cfg.SpecFormat = DetectSpecFormat(specBytes)
		basePath, err := pp.resolveBasePath()
		if err != nil {
			return nil, err
		}
		cfg.SpecRoot = basePath

		job.snapshot("bundling source bytes", 0, 3, 0)
		result, bundleErr := bundleBytesWithOrigins(specBytes, &datamodel.DocumentConfiguration{
			AllowFileReferences: true,
			BasePath:            basePath,
		}, nil)

		modelBytes := specBytes
		if bundleErr == nil && result != nil {
			cfg.Origins = result.Origins
			modelBytes = result.Bytes
			job.snapshot("bundled source bytes", 1, 3, 0)
		} else {
			cfg.BuildWarnings = append(cfg.BuildWarnings, &BuildWarning{
				Message: "source bundling failed; falling back to single-file parse, multi-file output may be incomplete",
				Context: basePath,
				Err:     bundleErr,
			})
			job.snapshot("bundle fallback to single file", 1, 3, 0)
		}

		job.snapshot("building libopenapi document", 1, 3, 0)
		doc, err := libopenapi.NewDocument(modelBytes)
		if err != nil {
			return nil, fmt.Errorf("building document from source bytes: %w", err)
		}

		job.snapshot("building v3 model", 2, 3, 0)
		v3Model, buildErr := doc.BuildV3Model()
		if buildErr != nil {
			cfg.BuildErrors = append(cfg.BuildErrors, buildErr)
		}
		if v3Model == nil {
			return nil, ErrNoV3Document
		}
		cfg.DrDoc = buildDrDocument(v3Model)
		job.snapshot("doctor model built", 3, 3, 0)
	}

	if cfg.DrDoc == nil {
		return nil, ErrNoDrDocument
	}
	return cfg, nil
}

func buildDrDocument(v3Model *libopenapi.DocumentModel[highv3.Document]) *model.DrDocument {
	return model.NewDrDocumentWithConfig(v3Model, &model.DrConfig{
		BuildGraph:     true,
		UseSchemaCache: true,
	})
}

func clonePrintingPressConfig(config *PrintingPressConfig) *PrintingPressConfig {
	if config == nil {
		return nil
	}
	cloned := *config
	return &cloned
}

func validateSource(source pressSource) error {
	count := 0
	if len(source.specBytes) > 0 {
		count++
	}
	if source.v3Model != nil {
		count++
	}
	if source.drModel != nil {
		count++
	}
	switch count {
	case 0:
		return ErrNoSourceInput
	case 1:
		return nil
	default:
		return ErrMultipleSourceInputs
	}
}

func validateAndNormalizeConfig(config *PrintingPressConfig, source pressSource) (*PrintingPressConfig, error) {
	if config == nil {
		config = &PrintingPressConfig{}
	}

	normalized := *config
	var issues []ValidationIssue

	switch err := validateSource(source); err {
	case nil:
	default:
		issues = append(issues, ValidationIssue{
			Field:   "source",
			Err:     err,
			Message: err.Error(),
		})
	}

	if normalized.OutputDir != "" {
		abs, err := filepath.Abs(normalized.OutputDir)
		if err != nil {
			issues = append(issues, ValidationIssue{
				Field:   "outputDir",
				Err:     ErrInvalidOutputDir,
				Message: fmt.Sprintf("%s: %v", ErrInvalidOutputDir.Error(), err),
			})
		} else {
			normalized.OutputDir = abs
		}
	} else {
		wd, err := os.Getwd()
		if err != nil {
			issues = append(issues, ValidationIssue{
				Field:   "outputDir",
				Err:     ErrInvalidOutputDir,
				Message: fmt.Sprintf("%s: %v", ErrInvalidOutputDir.Error(), err),
			})
		} else {
			normalized.OutputDir = filepath.Join(wd, "api-docs")
		}
	}

	if normalized.BasePath != "" {
		abs, err := filepath.Abs(normalized.BasePath)
		if err != nil {
			issues = append(issues, ValidationIssue{
				Field:   "basePath",
				Err:     ErrInvalidBasePath,
				Message: fmt.Sprintf("%s: %v", ErrInvalidBasePath.Error(), err),
			})
		} else if info, err := os.Stat(abs); err != nil || !info.IsDir() {
			if err == nil {
				err = fmt.Errorf("not a directory")
			}
			issues = append(issues, ValidationIssue{
				Field:   "basePath",
				Err:     ErrInvalidBasePath,
				Message: fmt.Sprintf("%s: %v", ErrInvalidBasePath.Error(), err),
			})
		} else {
			normalized.BasePath = abs
		}
	} else if len(source.specBytes) > 0 {
		wd, err := os.Getwd()
		if err != nil {
			issues = append(issues, ValidationIssue{
				Field:   "basePath",
				Err:     ErrInvalidBasePath,
				Message: fmt.Sprintf("%s: %v", ErrInvalidBasePath.Error(), err),
			})
		} else {
			normalized.BasePath = wd
		}
	}

	if source.drModel != nil && source.drModel.V3Document == nil {
		issues = append(issues, ValidationIssue{
			Field:   "drModel",
			Err:     ErrNoV3Document,
			Message: ErrNoV3Document.Error(),
		})
	}

	if len(issues) > 0 {
		return nil, &ValidationError{Issues: issues}
	}
	return &normalized, nil
}

func (pp *PrintingPress) resolveOutputDir() (string, error) {
	if pp.resolvedOutputDir != "" {
		return pp.resolvedOutputDir, nil
	}
	if pp.config != nil && pp.config.OutputDir != "" {
		pp.resolvedOutputDir = pp.config.OutputDir
		return pp.resolvedOutputDir, nil
	}
	wd, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("resolving working directory: %w", err)
	}
	pp.resolvedOutputDir = filepath.Join(wd, "api-docs")
	return pp.resolvedOutputDir, nil
}

func (pp *PrintingPress) resolveBasePath() (string, error) {
	if pp != nil && pp.config != nil && pp.config.BasePath != "" {
		return pp.config.BasePath, nil
	}
	wd, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("resolving working directory: %w", err)
	}
	return wd, nil
}

func (pp *PrintingPress) resolveConfiguredOutputDir() string {
	outputDir, err := pp.resolveOutputDir()
	if err != nil {
		return ""
	}
	return outputDir
}

func (pp *PrintingPress) sourceKind() string {
	if pp == nil {
		return ""
	}
	switch {
	case pp.source.drModel != nil:
		return sourceKindDrModel
	case pp.source.v3Model != nil:
		return sourceKindV3Model
	case len(pp.source.specBytes) > 0:
		return sourceKindBytes
	default:
		return ""
	}
}

func (pp *PrintingPress) describeTitle() string {
	if pp == nil || pp.config == nil || pp.config.Title == "" {
		return ""
	}
	return pp.config.Title
}

func (pp *PrintingPress) buildStatistics(job *jobState, written []string, buildDuration, generationDuration, totalDuration time.Duration) (*PressStatistics, error) {
	stats := &PressStatistics{
		ModelBuildDuration: buildDuration,
		GenerationDuration: generationDuration,
		TotalDuration:      totalDuration,
		FileSizes:          make(map[string]int64),
	}
	if job != nil {
		stats.JobID = job.ID
		stats.JobType = job.Type
	}
	if pp.site != nil {
		stats.Models = countSiteModels(pp.site)
		stats.Operations = len(pp.site.Operations) + len(pp.site.Webhooks)
		stats.ClassDiagrams = countClassDiagrams(pp.site)
		stats.DependencyGraphs = countDependencyGraphs(pp.site)
		stats.Warnings = append(stats.Warnings, pp.site.Warnings...)
	}

	outputDir := ""
	if pp.site != nil {
		outputDir = pp.site.OutputDir
	}
	for _, path := range written {
		info, err := os.Stat(path)
		if err != nil {
			return nil, fmt.Errorf("stat written file %s: %w", path, err)
		}
		rel := path
		if outputDir != "" {
			if rp, err := filepath.Rel(outputDir, path); err == nil {
				rel = rp
			}
		}
		stats.FileSizes[rel] = info.Size()
		stats.BytesWritten += info.Size()
		stats.FilesWritten++
		switch filepath.Ext(path) {
		case ".html", ".md", ".txt":
			stats.Pages++
		}
	}
	return stats, nil
}

func countSiteModels(site *Site) int {
	total := 0
	for _, pages := range site.Models {
		total += len(pages)
	}
	return total
}

func countClassDiagrams(site *Site) int {
	total := 0
	for _, pages := range site.Models {
		for _, page := range pages {
			if page.MermaidDiagram != "" {
				total++
			}
		}
	}
	return total
}

func countDependencyGraphs(site *Site) int {
	total := 0
	for _, pages := range site.Models {
		for _, page := range pages {
			if page.GraphJSON != "" {
				total++
			}
		}
	}
	return total
}

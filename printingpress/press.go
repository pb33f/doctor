// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"context"
	"log/slog"
	"runtime"
	"sync"
	"sync/atomic"
	"time"

	doctormodel "github.com/pb33f/doctor/model"
	curlpkg "github.com/pb33f/doctor/printingpress/curl"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/doctor/printingpress/render"
	slugpkg "github.com/pb33f/doctor/printingpress/slug"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/renderer"
	"golang.org/x/sync/errgroup"
)

type pressEngineConfig struct {
	DrDoc         *doctormodel.DrDocument
	Origins       bundler.ComponentOriginMap
	OutputDir     string
	BaseURL       string
	AssetMode     string
	Title         string
	Logger        *slog.Logger
	SpecFormat    string // "yaml" or "json" — caller should set based on input format
	SpecRoot      string // root directory of the spec; absolute paths are made relative to this
	NoMermaid     bool   // skip mermaid class diagram generation on model pages
	NoExplorer    bool   // skip dependency explorer on model pages
	BuildWarnings []*BuildWarning
	BuildErrors   []error // errors from libopenapi model building (surfaced as warnings on index page)
	// SyntheticTagFallback reuses untagged path grouping when operation tags are too coarse.
	SyntheticTagFallback *SyntheticTagFallbackConfig
}

// SyntheticTagFallbackConfig controls when tagged operations should be treated as effectively untagged.
type SyntheticTagFallbackConfig struct {
	Enabled         bool
	MaxDistinctTags int
	MinOperations   int
}

type resolvedSyntheticTagFallbackConfig struct {
	Enabled         bool
	MaxDistinctTags int
	MinOperations   int
}

// PrintingPress generates documentation from an OpenAPI source.
type PrintingPress struct {
	mu                 sync.Mutex
	config             *PrintingPressConfig
	source             pressSource
	engineConfig       *pressEngineConfig
	slugs              *slugpkg.SlugRegistry
	site               *Site
	mockGen            *renderer.MockGenerator
	mockGenYAML        *renderer.MockGenerator
	mockGenXML         *renderer.MockGenerator
	rawArtifacts       *rawArtifactCache
	schemaArtifacts    *schemaArtifactCache
	warnings           []*BuildWarning
	modelIndex         map[string]*ModelPage // keyed by "typeSlug/name" for O(1) ref resolution
	syntheticTags      resolvedSyntheticTagFallbackConfig
	modelBuilt         bool
	modelBuildDuration time.Duration
	resolvedOutputDir  string
	activity           *activityManager
	currentJob         *activityJob
}

func newPressEngine(config *pressEngineConfig) *PrintingPress {
	pp := &PrintingPress{}
	pp.initEngine(config)
	return pp
}

func (pp *PrintingPress) initEngine(config *pressEngineConfig) {
	if config == nil {
		config = &pressEngineConfig{}
	}
	if config.Logger == nil {
		config.Logger = slog.Default()
	}
	mg := renderer.NewMockGenerator(renderer.JSON)
	mg.SetPretty()
	mg.DisableRequiredCheck()

	mgYAML := renderer.NewMockGenerator(renderer.YAML)
	mgYAML.SetPretty()
	mgYAML.DisableRequiredCheck()

	// TODO: XML mock generator awaiting renderer.XML support in libopenapi
	// mgXML := renderer.NewMockGenerator(renderer.XML)
	// mgXML.SetPretty()
	// mgXML.DisableRequiredCheck()

	pp.engineConfig = config
	pp.slugs = slugpkg.NewSlugRegistry()
	pp.mockGen = mg
	pp.mockGenYAML = mgYAML
	pp.mockGenXML = nil
	pp.rawArtifacts = newRawArtifactCache()
	pp.schemaArtifacts = newSchemaArtifactCache()
	pp.site = &Site{
		Models: make(map[string][]*ModelPage),
	}
	pp.warnings = nil
	pp.modelIndex = nil
	pp.syntheticTags = resolveSyntheticTagFallbackConfig(config)
	pp.modelBuilt = false
}

func resolveSyntheticTagFallbackConfig(config *pressEngineConfig) resolvedSyntheticTagFallbackConfig {
	const (
		defaultMaxDistinctTags = 2
		defaultMinOperations   = 25
	)

	resolved := resolvedSyntheticTagFallbackConfig{
		Enabled:         true,
		MaxDistinctTags: defaultMaxDistinctTags,
		MinOperations:   defaultMinOperations,
	}

	if config == nil || config.SyntheticTagFallback == nil {
		return resolved
	}

	resolved.Enabled = config.SyntheticTagFallback.Enabled
	if config.SyntheticTagFallback.MaxDistinctTags > 0 {
		resolved.MaxDistinctTags = config.SyntheticTagFallback.MaxDistinctTags
	}
	if config.SyntheticTagFallback.MinOperations > 0 {
		resolved.MinOperations = config.SyntheticTagFallback.MinOperations
	}
	return resolved
}

func (pp *PrintingPress) pressSite() (*Site, error) {
	ctx := context.Background()

	if pp.engineConfig == nil || pp.engineConfig.DrDoc == nil {
		return nil, ErrNoDrDocument
	}
	doc := pp.engineConfig.DrDoc.V3Document
	if doc == nil {
		return nil, ErrNoV3Document
	}

	if pp.currentJob != nil {
		pp.currentJob.snapshot("collecting document model", 0, 1, 0)
	}
	pp.visitDocument(ctx, doc)
	if pp.currentJob != nil {
		pp.currentJob.snapshot("document model collected", 1, 1, 0)
	}

	pp.buildCrossRefs()
	parallelLimit := printingPressParallelism()
	var globalServers []*ServerInfo
	var globalSecurityGroups []*SecurityRequirementGroup
	if pp.site.Root != nil {
		globalServers = pp.site.Root.Servers
		globalSecurityGroups = pp.site.Root.SecurityGroups
	}
	allOps := pp.allOperations()
	if len(allOps) > 0 {
		var g errgroup.Group
		g.SetLimit(parallelLimit)
		totalOps := len(allOps)
		var completedOps int64
		for _, op := range allOps {
			op := op
			g.Go(func() error {
				variants := curlpkg.BuildCurlCommands(op, globalServers, globalSecurityGroups)
				if len(variants) > 0 {
					op.CurlJSON = render.MustJSON(variants)
				}
				if pp.currentJob != nil {
					done := atomicAddInt64(&completedOps, 1)
					pp.currentJob.snapshot("building curl commands", done, int64(totalOps), 0)
				}
				return nil
			})
		}
		if err := g.Wait(); err != nil {
			return nil, err
		}
	}
	var allModelPages []*ModelPage
	for _, pages := range pp.site.Models {
		allModelPages = append(allModelPages, pages...)
	}
	if len(allModelPages) > 0 {
		var g errgroup.Group
		g.SetLimit(parallelLimit)
		totalPages := len(allModelPages)
		var completedPages int64
		for _, page := range allModelPages {
			page := page
			g.Go(func() error {
				if page.CrossRefs != nil && (len(page.CrossRefs.UsedByOperations) > 0 ||
					len(page.CrossRefs.UsedByModels) > 0 || len(page.CrossRefs.UsesModels) > 0) {
					page.CrossRefsJSON = render.MustJSON(page.CrossRefs)
					applyModelCrossRefHints(page)
				}
				if pp.currentJob != nil {
					done := atomicAddInt64(&completedPages, 1)
					pp.currentJob.snapshot("encoding cross references", done, int64(totalPages), 0)
				}
				return nil
			})
		}
		if err := g.Wait(); err != nil {
			return nil, err
		}
	}

	// Build focused dependency subgraphs for schema model pages
	if !pp.engineConfig.NoExplorer && pp.engineConfig.DrDoc.Nodes != nil {
		schemaPages := pp.site.Models["schemas"]
		schemaNodeHrefs := make(map[string]string, len(schemaPages))
		for _, page := range schemaPages {
			if page == nil {
				continue
			}
			schemaNodeHrefs[SchemaNodeID("schemas", page.Name)] = "models/" + page.TypeSlug + "/" + page.Slug + ".html"
		}
		graphIndex := newFocusedGraphIndex(pp.engineConfig.DrDoc.Nodes, pp.engineConfig.DrDoc.Edges, schemaNodeHrefs)
		if len(schemaPages) > 0 {
			var g errgroup.Group
			g.SetLimit(parallelLimit)
			totalSchemas := len(schemaPages)
			var completedSchemas int64
			for _, page := range schemaPages {
				page := page
				g.Go(func() error {
					nodeID := SchemaNodeID("schemas", page.Name)
					var usedByOps []*OperationRef
					if page.CrossRefs != nil {
						usedByOps = page.CrossRefs.UsedByOperations
					}
					if !graphIndex.hasTargetNode(nodeID) {
						return nil
					}
					if !graphIndex.hasSchemaConnections(nodeID) && len(usedByOps) == 0 {
						return nil
					}
					graphJSON, err := graphIndex.buildFocusedModelGraph(nodeID, defaultMaxDepth, usedByOps)
					if err != nil {
						return err
					}
					if graphJSON != "" {
						page.GraphJSON = graphJSON
						page.GraphNodeID = nodeID
					}
					if pp.currentJob != nil {
						done := atomicAddInt64(&completedSchemas, 1)
						pp.currentJob.snapshot("building dependency graphs", done, int64(totalSchemas), 0)
					}
					return nil
				})
			}
			if err := g.Wait(); err != nil {
				return nil, err
			}
		}
	}

	for _, warning := range pp.engineConfig.BuildWarnings {
		if warning == nil {
			continue
		}
		pp.warn(warning.Message, warning.Context, warning.Err)
	}
	for _, err := range pp.engineConfig.BuildErrors {
		pp.warn("model build issue", "", err)
	}
	pp.site.Warnings = pp.warnings
	if pp.site.Root != nil {
		pp.site.Root.Warnings = pp.warnings
	}
	pp.site.OutputDir = pp.engineConfig.OutputDir
	pp.site.BaseURL = pp.engineConfig.BaseURL
	pp.site.AssetMode = pp.engineConfig.AssetMode
	pp.site.SpecFormat = pp.engineConfig.SpecFormat
	if pp.site.SpecFormat == "" {
		pp.site.SpecFormat = "yaml"
	}
	pp.site.Lite = pp.engineConfig.NoMermaid && pp.engineConfig.NoExplorer

	return pp.site, nil
}

// allOperations returns a combined slice of all operations and webhooks.
func (pp *PrintingPress) allOperations() []*OperationPage {
	all := make([]*OperationPage, 0, len(pp.site.Operations)+len(pp.site.Webhooks))
	all = append(all, pp.site.Operations...)
	all = append(all, pp.site.Webhooks...)
	return all
}

func (pp *PrintingPress) warn(message, context string, err error) {
	w := &BuildWarning{Message: message, Context: context, Err: err}
	pp.warnings = append(pp.warnings, w)
	if pp.engineConfig != nil && pp.engineConfig.Logger != nil {
		pp.engineConfig.Logger.Warn(message, "context", context, "error", err)
	}
}

func printingPressParallelism() int {
	limit := runtime.GOMAXPROCS(0)
	if limit < 2 {
		return 2
	}
	return limit
}

func atomicAddInt64(target *int64, delta int64) int64 {
	return atomic.AddInt64(target, delta)
}

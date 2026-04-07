// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"context"
	"log/slog"
	"runtime"

	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/renderer"
	"golang.org/x/sync/errgroup"
)

// PrintingPressConfig configures the PrintingPress documentation generator.
type PrintingPressConfig struct {
	DrDoc       *model.DrDocument
	Origins     bundler.ComponentOriginMap
	OutputDir   string
	BaseURL     string
	Title       string
	Logger      *slog.Logger
	SpecFormat  string  // "yaml" or "json" — caller should set based on input format
	SpecRoot    string  // root directory of the spec; absolute paths are made relative to this
	NoMermaid   bool    // skip mermaid class diagram generation on model pages
	NoExplorer  bool    // skip dependency explorer on model pages
	BuildErrors []error // errors from libopenapi model building (surfaced as warnings on index page)
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

// PrintingPress generates static HTML documentation from a DrDocument.
type PrintingPress struct {
	config          *PrintingPressConfig
	slugs           *SlugRegistry
	site            *Site
	mockGen         *renderer.MockGenerator
	mockGenYAML     *renderer.MockGenerator
	mockGenXML      *renderer.MockGenerator
	rawArtifacts    *rawArtifactCache
	schemaArtifacts *schemaArtifactCache
	warnings        []*BuildWarning
	modelIndex      map[string]*ModelPage // keyed by "typeSlug/name" for O(1) ref resolution
	syntheticTags   resolvedSyntheticTagFallbackConfig
}

// New creates a new PrintingPress with the given configuration.
func New(config *PrintingPressConfig) *PrintingPress {
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

	return &PrintingPress{
		config:      config,
		slugs:       NewSlugRegistry(),
		mockGen:     mg,
		mockGenYAML: mgYAML,
		// mockGenXML:  mgXML, // TODO: awaiting renderer.XML
		rawArtifacts:    newRawArtifactCache(),
		schemaArtifacts: newSchemaArtifactCache(),
		site: &Site{
			Models: make(map[string][]*ModelPage),
		},
		syntheticTags: resolveSyntheticTagFallbackConfig(config),
	}
}

func resolveSyntheticTagFallbackConfig(config *PrintingPressConfig) resolvedSyntheticTagFallbackConfig {
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

// Press runs the full documentation generation pipeline and returns the Site.
func (pp *PrintingPress) Press() (*Site, error) {
	ctx := context.Background()

	doc := pp.config.DrDoc.V3Document
	if doc == nil {
		return nil, ErrNoV3Document
	}

	pp.Visit(ctx, doc)

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
		for _, op := range allOps {
			op := op
			g.Go(func() error {
				variants := BuildCurlCommands(op, globalServers, globalSecurityGroups)
				if len(variants) > 0 {
					op.CurlJSON = MustJSON(variants)
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
		for _, page := range allModelPages {
			page := page
			g.Go(func() error {
				if page.CrossRefs != nil && (len(page.CrossRefs.UsedByOperations) > 0 ||
					len(page.CrossRefs.UsedByModels) > 0 || len(page.CrossRefs.UsesModels) > 0) {
					page.CrossRefsJSON = MustJSON(page.CrossRefs)
				}
				return nil
			})
		}
		if err := g.Wait(); err != nil {
			return nil, err
		}
	}

	// Build focused dependency subgraphs for schema model pages
	if !pp.config.NoExplorer && pp.config.DrDoc.Nodes != nil {
		schemaPages := pp.site.Models["schemas"]
		schemaNodeHrefs := make(map[string]string, len(schemaPages))
		for _, page := range schemaPages {
			if page == nil {
				continue
			}
			schemaNodeHrefs[SchemaNodeID("schemas", page.Name)] = "models/" + page.TypeSlug + "/" + page.Slug + ".html"
		}
		graphIndex := newFocusedGraphIndex(pp.config.DrDoc.Nodes, pp.config.DrDoc.Edges, schemaNodeHrefs)
		if len(schemaPages) > 0 {
			var g errgroup.Group
			g.SetLimit(parallelLimit)
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
					return nil
				})
			}
			if err := g.Wait(); err != nil {
				return nil, err
			}
		}
	}

	for _, err := range pp.config.BuildErrors {
		pp.warn("model build issue", "", err)
	}
	pp.site.Warnings = pp.warnings
	if pp.site.Root != nil {
		pp.site.Root.Warnings = pp.warnings
	}
	pp.site.SpecFormat = pp.config.SpecFormat
	if pp.site.SpecFormat == "" {
		pp.site.SpecFormat = "yaml"
	}
	pp.site.Lite = pp.config.NoMermaid && pp.config.NoExplorer

	return pp.site, nil
}

// Visit implements the Tardis visitor interface.
func (pp *PrintingPress) Visit(ctx context.Context, object any) {
	if doc, ok := object.(*v3.Document); ok {
		pp.visitDocument(ctx, doc)
	}
}

// GetDoctor satisfies the Tardis interface (unused in PrintingPress).
func (pp *PrintingPress) GetDoctor() v3.Doctor {
	return nil
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
	if pp.config.Logger != nil {
		pp.config.Logger.Warn(message, "context", context, "error", err)
	}
}

func printingPressParallelism() int {
	limit := runtime.GOMAXPROCS(0)
	if limit < 2 {
		return 2
	}
	return limit
}

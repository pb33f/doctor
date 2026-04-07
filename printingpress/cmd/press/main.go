// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/doctor/printingpress"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/datamodel"
	v3high "github.com/pb33f/libopenapi/datamodel/high/v3"
)

func main() {
	specPath := flag.String("spec", "", "path to OpenAPI spec file")
	basePath := flag.String("base-path", "", "base path for resolving file references (defaults to spec directory)")
	outputDir := flag.String("out", "/tmp/pp", "output directory")
	title := flag.String("title", "", "override the API title")
	serve := flag.Bool("serve", false, "serve the output directory on :9090")
	noMermaid := flag.Bool("no-mermaid", false, "disable mermaid class diagrams on model pages")
	noExplorer := flag.Bool("no-explorer", false, "disable dependency explorer on model pages")
	syntheticTagFallback := flag.Bool("synthetic-tag-fallback", true, "reuse synthetic path tags when operation tags are too coarse")
	syntheticTagFallbackMaxTags := flag.Int("synthetic-tag-fallback-max-tags", 2, "maximum distinct operation tags before synthetic tag fallback is disabled")
	syntheticTagFallbackMinOps := flag.Int("synthetic-tag-fallback-min-ops", 25, "minimum operation count before synthetic tag fallback is considered")
	flag.Parse()

	if *specPath == "" {
		fmt.Fprintln(os.Stderr, "usage: press -spec <path> [-base-path <dir>] [-out <dir>] [-title <title>] [-serve] [-no-mermaid] [-no-explorer]")
		os.Exit(1)
	}

	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: slog.LevelInfo}))

	specBytes, err := os.ReadFile(*specPath)
	if err != nil {
		logger.Error("failed to read spec", "path", *specPath, "error", err)
		os.Exit(1)
	}

	base := *basePath
	if base == "" {
		base = filepath.Dir(*specPath)
	}
	if abs, err := filepath.Abs(base); err == nil {
		base = abs
	}

	var drDoc *model.DrDocument
	var origins bundler.ComponentOriginMap
	var buildErrors []error

	// When explorer is enabled, build graph data alongside the model
	var drConfig *model.DrConfig
	if !*noExplorer {
		drConfig = &model.DrConfig{
			BuildGraph:     true,
			UseSchemaCache: true,
		}
	}

	buildDrDoc := func(v3Model *libopenapi.DocumentModel[v3high.Document]) *model.DrDocument {
		if drConfig != nil {
			return model.NewDrDocumentWithConfig(v3Model, drConfig)
		}
		return model.NewDrDocument(v3Model)
	}

	// Try bundling first (for multi-file specs)
	config := &datamodel.DocumentConfiguration{
		AllowFileReferences: true,
		BasePath:            base,
	}

	result, bundleErr := bundler.BundleBytesComposedWithOrigins(specBytes, config, nil)
	if bundleErr != nil {
		logger.Warn("bundling failed, falling back to single-file mode", "error", bundleErr)
		doc, err := libopenapi.NewDocument(specBytes)
		if err != nil {
			logger.Error("failed to create document", "error", err)
			os.Exit(1)
		}
		v3Model, buildErr := doc.BuildV3Model()
		if buildErr != nil {
			logger.Warn("model build error", "error", buildErr)
			buildErrors = append(buildErrors, buildErr)
		}
		if v3Model == nil {
			logger.Error("failed to build v3 model")
			os.Exit(1)
		}
		drDoc = buildDrDoc(v3Model)
	} else {
		origins = result.Origins
		doc, err := libopenapi.NewDocument(result.Bytes)
		if err != nil {
			logger.Error("failed to create document from bundled bytes", "error", err)
			os.Exit(1)
		}
		v3Model, buildErr := doc.BuildV3Model()
		if buildErr != nil {
			logger.Warn("model build error", "error", buildErr)
			buildErrors = append(buildErrors, buildErr)
		}
		if v3Model == nil {
			logger.Error("failed to build v3 model")
			os.Exit(1)
		}
		drDoc = buildDrDoc(v3Model)
		logger.Info("bundled spec", "origins", len(origins))
	}

	specFormat := printingpress.DetectSpecFormat(specBytes)

	pp := printingpress.New(&printingpress.PrintingPressConfig{
		DrDoc:       drDoc,
		Origins:     origins,
		OutputDir:   *outputDir,
		Title:       *title,
		Logger:      logger,
		SpecFormat:  specFormat,
		SpecRoot:    base,
		NoMermaid:   *noMermaid,
		NoExplorer:  *noExplorer,
		BuildErrors: buildErrors,
		SyntheticTagFallback: &printingpress.SyntheticTagFallbackConfig{
			Enabled:         *syntheticTagFallback,
			MaxDistinctTags: *syntheticTagFallbackMaxTags,
			MinOperations:   *syntheticTagFallbackMinOps,
		},
	})

	site, err := pp.Press()
	if err != nil {
		logger.Error("press failed", "error", err)
		os.Exit(1)
	}

	err = printingpress.WriteHTMLSite(site, *outputDir, "")
	if err != nil {
		logger.Error("write failed", "error", err)
		os.Exit(1)
	}

	err = printingpress.WriteLLMSite(site, *outputDir)
	if err != nil {
		logger.Error("LLM write failed", "error", err)
		os.Exit(1)
	}

	logger.Info("site generated",
		"operations", len(site.Operations),
		"schemas", len(site.Models["schemas"]),
		"responses", len(site.Models["responses"]),
		"parameters", len(site.Models["parameters"]),
		"webhooks", len(site.Webhooks),
		"warnings", len(site.Warnings),
		"output", *outputDir,
	)

	if *serve {
		addr := ":9090"
		logger.Info("serving", "addr", addr, "dir", *outputDir)
		if err := http.ListenAndServe(addr, http.FileServer(http.Dir(*outputDir))); err != nil {
			logger.Error("serve failed", "error", err)
			os.Exit(1)
		}
	}
}

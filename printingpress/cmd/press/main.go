// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"

	"github.com/pb33f/doctor/printingpress"
)

func main() {
	specPath := flag.String("spec", "", "path to OpenAPI spec file")
	basePath := flag.String("base-path", "", "base path for resolving file references (defaults to spec directory)")
	baseURL := flag.String("base-url", "", "base URL to use in generated HTML")
	outputDir := flag.String("out", "/tmp/pp", "output directory")
	title := flag.String("title", "", "override the API title")
	serve := flag.Bool("serve", false, "serve the output directory on :9090")
	flag.Parse()

	if *specPath == "" {
		fmt.Fprintln(os.Stderr, "usage: press -spec <path> [-base-path <dir>] [-out <dir>] [-title <title>] [-serve]")
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

	resolvedOutput := *outputDir
	if abs, err := filepath.Abs(resolvedOutput); err == nil {
		resolvedOutput = abs
	}

	pp, err := printingpress.CreatePrintingPressFromBytes(specBytes, &printingpress.PrintingPressConfig{
		Title:     *title,
		BaseURL:   *baseURL,
		BasePath:  base,
		OutputDir: resolvedOutput,
	})
	if err != nil {
		logger.Error("create printing press failed", "error", err)
		os.Exit(1)
	}

	htmlStats, err := pp.PrintHTML()
	if err != nil {
		logger.Error("html render failed", "error", err)
		os.Exit(1)
	}

	llmStats, err := pp.PrintLLM()
	if err != nil {
		logger.Error("llm render failed", "error", err)
		os.Exit(1)
	}

	logger.Info("site generated",
		"jobId", htmlStats.JobID,
		"pages", htmlStats.Pages,
		"models", htmlStats.Models,
		"operations", htmlStats.Operations,
		"classDiagrams", htmlStats.ClassDiagrams,
		"dependencyGraphs", htmlStats.DependencyGraphs,
		"bytesWritten", htmlStats.BytesWritten,
		"llmBytesWritten", llmStats.BytesWritten,
		"output", resolvedOutput,
	)

	if *serve {
		addr := ":9090"
		logger.Info("serving", "addr", addr, "dir", resolvedOutput)
		if err := http.ListenAndServe(addr, http.FileServer(http.Dir(resolvedOutput))); err != nil {
			logger.Error("serve failed", "error", err)
			os.Exit(1)
		}
	}
}

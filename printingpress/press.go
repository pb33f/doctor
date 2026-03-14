// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"context"
	"log/slog"

	"github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/bundler"
	"github.com/pb33f/libopenapi/renderer"
)

// PrintingPressConfig configures the PrintingPress documentation generator.
type PrintingPressConfig struct {
	DrDoc      *model.DrDocument
	Origins    bundler.ComponentOriginMap
	OutputDir  string
	BaseURL    string
	Title      string
	Logger     *slog.Logger
	SpecFormat string // "yaml" or "json" — caller should set based on input format
	SpecRoot   string // root directory of the spec; absolute paths are made relative to this
}

// PrintingPress generates static HTML documentation from a DrDocument.
type PrintingPress struct {
	config   *PrintingPressConfig
	slugs    *SlugRegistry
	site     *Site
	mockGen  *renderer.MockGenerator
	warnings []*BuildWarning
}

// New creates a new PrintingPress with the given configuration.
func New(config *PrintingPressConfig) *PrintingPress {
	if config.Logger == nil {
		config.Logger = slog.Default()
	}
	mg := renderer.NewMockGenerator(renderer.JSON)
	mg.SetPretty()
	mg.DisableRequiredCheck()
	return &PrintingPress{
		config:  config,
		slugs:   NewSlugRegistry(),
		mockGen: mg,
		site: &Site{
			Models: make(map[string][]*ModelPage),
		},
	}
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

	pp.site.Warnings = pp.warnings
	pp.site.SpecFormat = pp.config.SpecFormat
	if pp.site.SpecFormat == "" {
		pp.site.SpecFormat = "yaml"
	}

	return pp.site, nil
}

// Visit implements the Tardis visitor interface.
func (pp *PrintingPress) Visit(ctx context.Context, object any) {
	switch obj := object.(type) {
	case *v3.Document:
		pp.visitDocument(ctx, obj)
	case *v3.Paths:
		pp.visitPaths(ctx, obj)
	case *v3.PathItem:
		pp.visitPathItem(ctx, obj)
	}
}

// GetDoctor satisfies the Tardis interface (unused in PrintingPress).
func (pp *PrintingPress) GetDoctor() v3.Doctor {
	return nil
}

func (pp *PrintingPress) warn(message, context string, err error) {
	w := &BuildWarning{Message: message, Context: context, Err: err}
	pp.warnings = append(pp.warnings, w)
	if pp.config.Logger != nil {
		pp.config.Logger.Warn(message, "context", context, "error", err)
	}
}

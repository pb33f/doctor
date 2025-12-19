// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package changerator

import (
	"github.com/pb33f/doctor/changerator/renderer"
)

// GenerateReport generates a change report using the specified renderer.
func (t *Changerator) GenerateReport(r renderer.ChangeReportRenderer, outputFormat renderer.OutputFormat) (string, error) {
	return t.GenerateReportWithConfig(r, outputFormat, nil)
}

// GenerateReportWithConfig generates a change report with custom configuration.
func (t *Changerator) GenerateReportWithConfig(
	r renderer.ChangeReportRenderer,
	outputFormat renderer.OutputFormat,
	config *renderer.RenderConfig,
) (string, error) {
	if t.Config == nil || t.Config.DocumentChanges == nil {
		return "# What Changed?\n\nNo changes detected between the API versions.\n\n", nil
	}

	input := &renderer.RenderInput{
		DocumentChanges: t.Config.DocumentChanges,
		Doctor:          t.Config.Doctor,
		RightDocContent: t.rightDocContent,
		Config:          config,
	}

	switch outputFormat {
	case renderer.OutputFormatMarkdown:
		return r.RenderMarkdown(input)
	case renderer.OutputFormatHTML:
		return r.RenderHTML(input)
	default:
		return r.RenderMarkdown(input)
	}
}

// GenerateHTML is a convenience method for generating HTML reports with the default renderer.
func (t *Changerator) GenerateHTML() (string, error) {
	htmlRenderer := renderer.NewHTMLRenderer(nil)
	return t.GenerateReport(htmlRenderer, renderer.OutputFormatHTML)
}

// GenerateHTMLWithConfig is a convenience method for generating HTML with custom configuration.
func (t *Changerator) GenerateHTMLWithConfig(config *renderer.RenderConfig) (string, error) {
	htmlRenderer := renderer.NewHTMLRenderer(config)
	return t.GenerateReportWithConfig(htmlRenderer, renderer.OutputFormatHTML, config)
}


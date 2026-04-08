// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: BUSL-1.1

package printingpress

import (
	"errors"
	"strings"
)

var (
	// ErrNoSourceInput is returned when no source is provided to a constructor.
	ErrNoSourceInput = errors.New("printingpress: exactly one source input is required")
	// ErrMultipleSourceInputs is returned when more than one source is configured.
	ErrMultipleSourceInputs = errors.New("printingpress: only one source input may be configured")
	// ErrInvalidBasePath is returned when BasePath cannot be resolved to a valid directory.
	ErrInvalidBasePath = errors.New("printingpress: base path is invalid")
	// ErrInvalidOutputDir is returned when OutputDir cannot be resolved.
	ErrInvalidOutputDir = errors.New("printingpress: output directory is invalid")
	// ErrNoDrDocument is returned when a doctor model could not be produced.
	ErrNoDrDocument = errors.New("printingpress: doctor model is required")
	// ErrNoV3Document is returned when a doctor model has no libopenapi v3 document.
	ErrNoV3Document = errors.New("printingpress: doctor model has no V3 document")
	// ErrNoOutputDir is returned when no output directory can be resolved.
	ErrNoOutputDir = errors.New("printingpress: output directory is required")
	// ErrNilSite is returned when a writer is called without a rendered site model.
	ErrNilSite = errors.New("printingpress: site is required")
)

// ValidationIssue describes one configuration validation problem.
type ValidationIssue struct {
	Field   string
	Err     error
	Message string
}

// Error returns a single-line description of the issue.
func (v ValidationIssue) Error() string {
	if v.Field == "" {
		return v.Message
	}
	return v.Field + ": " + v.Message
}

// ValidationError reports one or more configuration validation problems.
type ValidationError struct {
	Issues []ValidationIssue
}

// Error returns a compact summary of all validation issues.
func (v *ValidationError) Error() string {
	if v == nil || len(v.Issues) == 0 {
		return ""
	}
	parts := make([]string, 0, len(v.Issues))
	for _, issue := range v.Issues {
		parts = append(parts, issue.Error())
	}
	return strings.Join(parts, "; ")
}

// Is reports whether any contained issue matches target.
func (v *ValidationError) Is(target error) bool {
	if v == nil {
		return false
	}
	for _, issue := range v.Issues {
		if errors.Is(issue.Err, target) {
			return true
		}
	}
	return false
}

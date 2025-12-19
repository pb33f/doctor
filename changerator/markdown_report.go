// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package changerator

import "github.com/pb33f/doctor/changerator/renderer"

// GenerateMarkdownReport creates a comprehensive markdown report from DocumentChanges.
//
// Deprecated: use GenerateReport with renderer.NewMarkdownRenderer() instead.
// this method is maintained for backward compatibility but will be removed in a future version.
//
// Usage:
//
//	cd := NewChangerator(config)
//	docChanges := cd.Changerate()
//	report := cd.GenerateMarkdownReport()
func (t *Changerator) GenerateMarkdownReport() string {
	if t.Config == nil || t.Config.DocumentChanges == nil {
		return "# What Changed?\n\nNo changes detected between the API versions.\n\n"
	}

	reporter := renderer.NewMarkdownReporter(t.Config.DocumentChanges, t.Config.Doctor, t.rightDocContent, nil)
	return reporter.Generate()
}

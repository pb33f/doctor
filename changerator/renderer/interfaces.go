// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import (
	drModel "github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi/what-changed/model"
)

// ChangeReportRenderer defines the interface for rendering change reports.
// Implementations can generate markdown, HTML, or any other format from API changes.
type ChangeReportRenderer interface {
	// RenderMarkdown generates a markdown representation of the changes.
	RenderMarkdown(input *RenderInput) (string, error)

	// RenderHTML generates an HTML representation of the changes.
	RenderHTML(input *RenderInput) (string, error)
}

// RenderInput provides all data needed to render a change report.
type RenderInput struct {
	// DocumentChanges contains the structured change tree from what-changed library.
	DocumentChanges *model.DocumentChanges

	// Doctor provides line-based model lookup for accurate type inference.
	Doctor *drModel.DrDocument

	// RightDocContent is the raw bytes of the new/right document.
	RightDocContent []byte

	// Config provides rendering customization options.
	Config *RenderConfig
}

// ElementRenderer allows users to provide custom rendering for specific elements.
type ElementRenderer interface {
	// Render generates HTML for a specific element.
	// elementType identifies what's being rendered (e.g., "code-span", "list-item").
	// content is the element's content.
	// metadata provides context (e.g., "breaking": "true").
	Render(elementType string, content string, metadata map[string]string) (string, error)
}

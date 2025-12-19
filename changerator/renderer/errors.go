// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

import "errors"

var (
	// ErrHTMLNotSupported indicates the renderer doesn't support HTML output.
	ErrHTMLNotSupported = errors.New("HTML rendering not supported by this renderer")

	// ErrMarkdownNotSupported indicates the renderer doesn't support markdown output.
	ErrMarkdownNotSupported = errors.New("markdown rendering not supported by this renderer")

	// ErrInvalidInput indicates the render input is nil or missing required fields.
	ErrInvalidInput = errors.New("invalid render input: missing required fields")
)

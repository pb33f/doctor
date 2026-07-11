// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package model

// SpecKindValue identifies the specification family rendered by Printing Press.
type SpecKindValue string

const (
	// SpecKindValueUnknown represents a source whose specification family is not known.
	SpecKindValueUnknown SpecKindValue = ""
	// SpecKindValueOpenAPI identifies an OpenAPI or Swagger source document.
	SpecKindValueOpenAPI SpecKindValue = "openapi"
	// SpecKindValueAsyncAPI identifies an AsyncAPI source document.
	SpecKindValueAsyncAPI SpecKindValue = "asyncapi"
)

// MachineValue returns the stable lowercase value used in JSON and persisted state.
func (k SpecKindValue) MachineValue() string {
	return string(k)
}

// DisplayLabel returns the human-facing label for a specification kind.
func (k SpecKindValue) DisplayLabel() string {
	switch k {
	case SpecKindValueOpenAPI:
		return "OpenAPI"
	case SpecKindValueAsyncAPI:
		return "AsyncAPI"
	default:
		return ""
	}
}

// IsOpenAPI reports whether k identifies an OpenAPI or Swagger source.
func (k SpecKindValue) IsOpenAPI() bool {
	return k == SpecKindValueOpenAPI
}

// IsAsyncAPI reports whether k identifies an AsyncAPI source.
func (k SpecKindValue) IsAsyncAPI() bool {
	return k == SpecKindValueAsyncAPI
}

// IsKnown reports whether k is one of the supported specification kinds.
func (k SpecKindValue) IsKnown() bool {
	return k == SpecKindValueOpenAPI || k == SpecKindValueAsyncAPI
}

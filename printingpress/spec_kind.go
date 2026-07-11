// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import ppmodel "github.com/pb33f/doctor/printingpress/model"

// SpecKind identifies the specification family rendered by Printing Press.
type SpecKind = ppmodel.SpecKindValue

const (
	// SpecKindUnknown represents a source whose specification family is not known.
	SpecKindUnknown = ppmodel.SpecKindValueUnknown
	// SpecKindOpenAPI identifies an OpenAPI or Swagger source document.
	SpecKindOpenAPI = ppmodel.SpecKindValueOpenAPI
	// SpecKindAsyncAPI identifies an AsyncAPI source document.
	SpecKindAsyncAPI = ppmodel.SpecKindValueAsyncAPI
)

// SpecIdentity is the cheap source marker result used before building a full model.
type SpecIdentity struct {
	Kind    SpecKind
	Version string
}

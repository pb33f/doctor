// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type SecurityRequirement struct {
	Value *base.SecurityRequirement
	Foundation
}

func (s *SecurityRequirement) Walk(ctx context.Context, securityRequirement *base.SecurityRequirement) {
	drCtx := GetDrContext(ctx)
	s.Value = securityRequirement
	// Don't override PathSegment if it's already set (e.g., from document or operation level)
	if s.PathSegment == "" {
		s.PathSegment = "security"
	}
	drCtx.ObjectChan <- s
}

func (s *SecurityRequirement) GetValue() any {
	return s.Value
}

func (s *SecurityRequirement) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, s)
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

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
	s.PathSegment = "security"
	//s.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(s.PathSegment), s.PathSegment, securityRequirement, s, false, -1, s.Index)
	drCtx.ObjectChan <- s
}

func (s *SecurityRequirement) GetValue() any {
	return s.Value
}

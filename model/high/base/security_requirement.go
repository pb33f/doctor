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

func (s *SecurityRequirement) Walk(_ context.Context, securityRequirement *base.SecurityRequirement) {
	s.Value = securityRequirement
	s.PathSegment = "security"
}

func (s *SecurityRequirement) GetValue() any {
	return s.Value
}

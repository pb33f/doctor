// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type License struct {
	Value *base.License
	Foundation
}

func (l *License) Walk(_ context.Context, license *base.License) {
	l.PathSegment = "license"
	l.Value = license
}

func (l *License) GetValue() any {
	return l.Value
}

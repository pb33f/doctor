// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type XML struct {
	Value *base.XML
	Foundation
}

func (x *XML) GetValue() any {
	return x.Value
}

func (x *XML) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT
	if x.Value.Name != "" {
		height += HEIGHT
	}
	if x.Value.Extensions != nil && x.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}
	return height, width
}

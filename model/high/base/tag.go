// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import "github.com/pb33f/libopenapi/datamodel/high/base"

type Tag struct {
	Value *base.Tag
	Foundation
}

func (t *Tag) GetValue() any {
	return t.Value
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Discriminator struct {
	Value *base.Discriminator
	Foundation
}

func (d *Discriminator) GetValue() any {
	return d.Value
}

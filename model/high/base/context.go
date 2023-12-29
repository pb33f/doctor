// Copyright 2023 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: MIT

package base

import (
	"github.com/pb33f/libopenapi/index"
)

type DrContext struct {
	SchemaChan chan *Schema
	SkippedSchemaChan chan *Schema
	Index      *index.SpecIndex
	Rolodex    *index.Rolodex
}

// Copyright 2023 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: MIT

package base

import (
	"github.com/pb33f/libopenapi/index"
	"github.com/sourcegraph/conc"
	"golang.org/x/net/context"
)

type DrContext struct {
	SchemaChan        chan *Schema
	SkippedSchemaChan chan *Schema
	ParameterChan     chan any
	Index             *index.SpecIndex
	Rolodex           *index.Rolodex
	WaitGroup         *conc.WaitGroup
}

func GetDrContext(ctx context.Context) *DrContext {
	return ctx.Value("drCtx").(*DrContext)
}

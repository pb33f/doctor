// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type SchemaProxy struct {
	Value  *base.SchemaProxy
	Schema *Schema
	Foundation
}

func (sp *SchemaProxy) Walk(ctx context.Context, schemaProxy *base.SchemaProxy) {
	sp.Value = schemaProxy
	sch := schemaProxy.Schema()
	if sch != nil {
		newSchema := &Schema{}
		newSchema.Parent = sp
		sp.Schema = newSchema
		newSchema.Walk(ctx, sch)

		schChan := ctx.Value("schemaChan").(chan *Schema)
		if !schemaProxy.IsReference() {
			schChan <- newSchema
		}
	}
}

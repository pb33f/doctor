// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"context"
	"fmt"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type SchemaProxy struct {
	Value  *base.SchemaProxy
	Schema *Schema
	Foundation
}

func (sp *SchemaProxy) IsCircular(ctx context.Context) bool {

	drCtx := ctx.Value("drCtx").(*DrContext)
	idx := drCtx.Index
	circularRefs := idx.GetCircularReferences()
	polyRefs := idx.GetIgnoredPolymorphicCircularReferences()
	arrayRefs := idx.GetIgnoredArrayCircularReferences()
	circularRefs = append(circularRefs, polyRefs...)
	circularRefs = append(circularRefs, arrayRefs...)
	for _, ref := range circularRefs {
		if ref.LoopPoint.Definition == sp.Value.GetReference() {
			return true
		}
	}

	return false
}

func (sp *SchemaProxy) Walk(ctx context.Context, schemaProxy *base.SchemaProxy) {
	sp.Value = schemaProxy
	drCtx := ctx.Value("drCtx").(*DrContext)

	sch := schemaProxy.Schema()
	if sch != nil {

		if schemaProxy.IsReference() {
			if sp.IsCircular(ctx) {
				newSchema := &Schema{}
				newSchema.Parent = sp
				newSchema.NodeParent = sp.NodeParent
				sp.Schema = newSchema
				newSchema.Value = sch
				newSchema.Name = sp.Key
				drCtx.SkippedSchemaChan <- &WalkedSchema{
					Schema:     newSchema,
					SchemaNode: schemaProxy.GetSchemaKeyNode(),
				}
				return
			}
		}
		newSchema := &Schema{}
		newSchema.Parent = sp
		newSchema.NodeParent = sp.NodeParent
		sp.Schema = newSchema
		newSchema.Name = sp.Key
		newSchema.ValueNode = sp.ValueNode
		newSchema.KeyNode = sp.KeyNode

		if !schemaProxy.IsReference() {
			newSchema.Walk(ctx, sch)
			drCtx.SchemaChan <- &WalkedSchema{
				Schema:     newSchema,
				SchemaNode: schemaProxy.GetSchemaKeyNode(),
			}
		} else {

			if sp.NodeParent == nil {
				return
			}
			if sp.GetNodeParent().GetNode() == nil {
				// no follow
				return
			} else {
				// follow!
				if schemaProxy.GoLow().GetValueNode() != nil {
					sourceId := fmt.Sprintf("%s", sp.GetNodeParent().GetNode().Id)
					target := fmt.Sprintf("%d", schemaProxy.GoLow().GetValueNode().Line)
					poly := ""
					if sp.PathSegment == "allOf" || sp.PathSegment == "oneOf" || sp.PathSegment == "anyOf" {
						poly = sp.PathSegment
					}
					sp.BuildReferenceEdge(ctx, sourceId, target, schemaProxy.GetReference(), poly)
				}
			}
		}
	} else {
		if schemaProxy.GetBuildError() != nil {
			drCtx.ErrorChan <- &BuildError{
				SchemaProxy:   schemaProxy,
				DrSchemaProxy: sp,
				Error:         schemaProxy.GetBuildError(),
			}
		}
	}
}

func wipe(n Foundational) {
	if n.GetNodeParent() != nil {
		wipe(n.GetNodeParent())
	}
	n.SetNode(nil)
}

func (sp *SchemaProxy) GetValue() any {
	return sp.Value
}

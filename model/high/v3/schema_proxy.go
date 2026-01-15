// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"fmt"

	"github.com/pb33f/libopenapi/datamodel/high/base"
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/index"
	"go.yaml.in/yaml/v4"
)

type SchemaProxy struct {
	Value  *base.SchemaProxy
	Schema *Schema
	Foundation
}

type IsObjectReference interface {
	IsReference() bool
	GetReference() string
	GetReferenceNode() *yaml.Node
}

type ObjectReference struct {
	Reference string
	Node      *yaml.Node
	Foundation
}

func (r *ObjectReference) GetValue() any {
	return r
}

func (r *ObjectReference) GoLowUntyped() any {
	return r
}

func (r *ObjectReference) GetNodes() map[int][]*yaml.Node {
	return map[int][]*yaml.Node{
		r.Node.Line: {r.Node},
	}
}

func (r *ObjectReference) IsReference() bool {
	return true
}

func (r *ObjectReference) GetReference() string {
	return r.Reference
}

func (r *ObjectReference) GetReferenceNode() *yaml.Node {
	return r.Node
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

func (sp *SchemaProxy) Walk(ctx context.Context, schemaProxy *base.SchemaProxy, depth int) {
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
		newSchema.Value = sch
		// Note: Do NOT copy sp.Index to newSchema - the SchemaProxy owns the array index,
		// the Schema is the content of that array element, not another indexed element.
		// Copying index causes duplicate path segments like allOf[2][2] instead of allOf[2].
		newSchema.PolyType = sp.PolyType

		if !schemaProxy.IsReference() {
			newSchema.Walk(ctx, sch, depth)
			drCtx.SchemaChan <- &WalkedSchema{
				Schema:     newSchema,
				SchemaNode: schemaProxy.GetSchemaKeyNode(),
			}
		} else {

			// clone context
			clonedCtx := *drCtx

			// if we're building changes, we're going to want to build the whole graph, so we can see the changes.
			if !drCtx.RenderChanges {
				clonedCtx.BuildGraph = false
			}
			newCtx := context.WithValue(ctx, "drCtx", &clonedCtx)

			// check if this is a circular ref.
			allCircs := schemaProxy.GoLow().GetIndex().GetRolodex().GetRootIndex().GetCircularReferences()
			safeCircularRefs := schemaProxy.GoLow().GetIndex().GetRolodex().GetSafeCircularReferences()
			ignoredCircularRefs := schemaProxy.GoLow().GetIndex().GetRolodex().GetIgnoredCircularReferences()
			combinedCircularRefs := append(safeCircularRefs, ignoredCircularRefs...)
			combinedCircularRefs = append(combinedCircularRefs, allCircs...)
			for _, ref := range combinedCircularRefs {
				// hash the root node of the schema reference
				rh := index.HashNode(sch.GoLow().RootNode)
				lph := index.HashNode(ref.LoopPoint.Node)
				if rh == lph {
					return // nope
				}
			}

			// walk, but don't continue with the graph down this path, as it's a reference
			newSchema.Walk(newCtx, sch, depth)

			// send up the reference
			drCtx.ObjectChan <- &ObjectReference{
				Reference: schemaProxy.GetReference(),
				Node:      schemaProxy.GetReferenceNode(),
			}

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

func BuildReference(ctx *DrContext, ref low.IsReferenced) {
	if ref.IsReference() {
		refNode := ref.GetReferenceNode()
		ctx.ObjectChan <- &ObjectReference{
			Reference: ref.GetReference(),
			Node:      refNode,
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

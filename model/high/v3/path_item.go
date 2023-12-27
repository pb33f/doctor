// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
    "context"
    "github.com/pb33f/doctor/model/high/base"
    v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type PathItem struct {
    Value      *v3.PathItem
    Get        *Operation
    Put        *Operation
    Post       *Operation
    Delete     *Operation
    Options    *Operation
    Head       *Operation
    Patch      *Operation
    Trace      *Operation
    Servers    []*Server
    Parameters []*Parameter
    base.Foundation
}

func (p *PathItem) buildOperation(method string) *Operation {
    op := &Operation{}
    op.Parent = p
    op.PathSegment = method
    return op
}

func (p *PathItem) Walk(ctx context.Context, pathItem *v3.PathItem) {
    p.Value = pathItem

    if pathItem.Get != nil {
        op := p.buildOperation("get")
        op.Walk(ctx, pathItem.Get)
        p.Get = op
    }

    if pathItem.Post != nil {
        op := p.buildOperation("post")
        op.Walk(ctx, pathItem.Post)
        p.Post = op
    }

    if pathItem.Put != nil {
        op := p.buildOperation("put")
        op.Walk(ctx, pathItem.Put)
        p.Put = op
    }

    if pathItem.Delete != nil {
        op := p.buildOperation("delete")
        op.Walk(ctx, pathItem.Delete)
        p.Delete = op
    }

    if pathItem.Options != nil {
        op := p.buildOperation("options")
        op.Walk(ctx, pathItem.Options)
        p.Options = op
    }

    if pathItem.Head != nil {
        op := p.buildOperation("head")
        op.Walk(ctx, pathItem.Head)
        p.Head = op
    }

    if pathItem.Patch != nil {
        op := p.buildOperation("patch")
        op.Walk(ctx, pathItem.Patch)
        p.Patch = op
    }

    if pathItem.Trace != nil {
        op := p.buildOperation("trace")
        op.Walk(ctx, pathItem.Trace)
        p.Trace = op
    }

    if pathItem.Servers != nil {
        for i, server := range pathItem.Servers {
            s := &Server{}
            s.Parent = p
            s.IsIndexed = true
            s.Index = i
            s.Walk(ctx, server)
            p.Servers = append(p.Servers, s)
        }
    }

    if pathItem.Parameters != nil {
        for i, parameter := range pathItem.Parameters {
            para := &Parameter{}
            para.PathSegment = "parameters"
            para.Parent = p
            para.IsIndexed = true
            para.Index = i
            para.Walk(ctx, parameter)
            p.Parameters = append(p.Parameters, para)
        }
    }

}

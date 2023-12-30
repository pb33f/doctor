// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	lowV3 "github.com/pb33f/libopenapi/datamodel/low/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"reflect"
	"slices"
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

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	p.Value = pathItem

	if pathItem.Get != nil {
		op := p.buildOperation("get")
		wg.Go(func() { op.Walk(ctx, pathItem.Get) })
		p.Get = op
	}

	if pathItem.Post != nil {
		op := p.buildOperation("post")
		wg.Go(func() { op.Walk(ctx, pathItem.Post) })
		p.Post = op
	}

	if pathItem.Put != nil {
		op := p.buildOperation("put")
		wg.Go(func() { op.Walk(ctx, pathItem.Put) })
		p.Put = op
	}

	if pathItem.Delete != nil {
		op := p.buildOperation("delete")
		wg.Go(func() { op.Walk(ctx, pathItem.Delete) })
		p.Delete = op
	}

	if pathItem.Options != nil {
		op := p.buildOperation("options")
		wg.Go(func() { op.Walk(ctx, pathItem.Options) })
		p.Options = op
	}

	if pathItem.Head != nil {
		op := p.buildOperation("head")
		wg.Go(func() { op.Walk(ctx, pathItem.Head) })
		p.Head = op
	}

	if pathItem.Patch != nil {
		op := p.buildOperation("patch")
		wg.Go(func() { op.Walk(ctx, pathItem.Patch) })
		p.Patch = op
	}

	if pathItem.Trace != nil {
		op := p.buildOperation("trace")
		wg.Go(func() { op.Walk(ctx, pathItem.Trace) })
		p.Trace = op
	}

	if pathItem.Servers != nil {
		for i, server := range pathItem.Servers {
			server := server
			s := &Server{}
			s.Parent = p
			s.IsIndexed = true
			s.Index = i
			wg.Go(func() { s.Walk(ctx, server) })
			p.Servers = append(p.Servers, s)
		}
	}

	if pathItem.Parameters != nil {
		for i, parameter := range pathItem.Parameters {
			parameter := parameter
			para := &Parameter{}
			para.PathSegment = "parameters"
			para.Parent = p
			para.IsIndexed = true
			para.Index = i
			wg.Go(func() { para.Walk(ctx, parameter) })
			p.Parameters = append(p.Parameters, para)
		}
	}
}

func (p *PathItem) GetOperations() *orderedmap.Map[string, *Operation] {
	o := orderedmap.New[string, *Operation]()
	type op struct {
		name string
		op   *Operation
		line int
	}
	getLine := func(field string, idx int) int {
		if p.Value.GoLow() == nil {
			return idx
		}

		l, ok := reflect.ValueOf(p.Value.GoLow()).Elem().FieldByName(field).Interface().(low.NodeReference[*lowV3.Operation])
		if !ok || l.GetKeyNode() == nil {
			return idx
		}

		return l.GetKeyNode().Line
	}
	ops := []op{}
	if p.Get != nil {
		ops = append(ops, op{name: lowV3.GetLabel, op: p.Get, line: getLine("Get", -8)})
	}
	if p.Put != nil {
		ops = append(ops, op{name: lowV3.PutLabel, op: p.Put, line: getLine("Put", -7)})
	}
	if p.Post != nil {
		ops = append(ops, op{name: lowV3.PostLabel, op: p.Post, line: getLine("Post", -6)})
	}
	if p.Delete != nil {
		ops = append(ops, op{name: lowV3.DeleteLabel, op: p.Delete, line: getLine("Delete", -5)})
	}
	if p.Options != nil {
		ops = append(ops, op{name: lowV3.OptionsLabel, op: p.Options, line: getLine("Options", -4)})
	}
	if p.Head != nil {
		ops = append(ops, op{name: lowV3.HeadLabel, op: p.Head, line: getLine("Head", -3)})
	}
	if p.Patch != nil {
		ops = append(ops, op{name: lowV3.PatchLabel, op: p.Patch, line: getLine("Patch", -2)})
	}
	if p.Trace != nil {
		ops = append(ops, op{name: lowV3.TraceLabel, op: p.Trace, line: getLine("Trace", -1)})
	}
	slices.SortStableFunc(ops, func(a op, b op) int {
		return a.line - b.line
	})
	for _, oper := range ops {
		o.Set(oper.name, oper.op)
	}
	return o
}

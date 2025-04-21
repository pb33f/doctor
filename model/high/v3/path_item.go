// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/datamodel/low"
	lowV3 "github.com/pb33f/libopenapi/datamodel/low/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"net/http"
	"reflect"
	"slices"
	"strings"
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
	Foundation
}

func (p *PathItem) buildOperation(method string) *Operation {
	op := &Operation{}
	op.Parent = p
	//op.Key = method
	op.NodeParent = p
	op.PathSegment = method

	switch strings.ToUpper(method) {
	case http.MethodGet:
		op.ValueNode = p.Value.GoLow().Get.ValueNode
		op.KeyNode = p.Value.GoLow().Get.KeyNode
	case http.MethodPost:
		op.ValueNode = p.Value.GoLow().Post.ValueNode
		op.KeyNode = p.Value.GoLow().Post.KeyNode
	case http.MethodPut:
		op.ValueNode = p.Value.GoLow().Put.ValueNode
		op.KeyNode = p.Value.GoLow().Put.KeyNode
	case http.MethodDelete:
		op.ValueNode = p.Value.GoLow().Delete.ValueNode
		op.KeyNode = p.Value.GoLow().Delete.KeyNode
	case http.MethodOptions:
		op.ValueNode = p.Value.GoLow().Options.ValueNode
		op.KeyNode = p.Value.GoLow().Options.KeyNode
	case http.MethodHead:
		op.ValueNode = p.Value.GoLow().Head.ValueNode
		op.KeyNode = p.Value.GoLow().Head.KeyNode
	case http.MethodPatch:
		op.ValueNode = p.Value.GoLow().Patch.ValueNode
		op.KeyNode = p.Value.GoLow().Patch.KeyNode
	case http.MethodTrace:
		op.ValueNode = p.Value.GoLow().Trace.ValueNode
		op.KeyNode = p.Value.GoLow().Trace.KeyNode
	}

	return op
}

func (p *PathItem) Walk(ctx context.Context, pathItem *v3.PathItem) {

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	p.Value = pathItem
	p.BuildNodesAndEdges(ctx, p.Key, "pathItem", pathItem, p)

	negOne := -1

	if pathItem.Get != nil {
		op := p.buildOperation("get")
		wg.Go(func() { op.Walk(ctx, pathItem.Get) })
		p.Get = op
	}

	if pathItem.Post != nil {
		op := p.buildOperation("post")
		p.Post = op
		wg.Go(func() {
			op.Walk(ctx, pathItem.Post)
		})

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
			srvr := server
			s := &Server{}
			s.Parent = p
			s.IsIndexed = true
			s.Index = &i
			s.NodeParent = p
			wg.Go(func() { s.Walk(ctx, srvr) })
			p.Servers = append(p.Servers, s)
		}
	}

	if pathItem.Parameters != nil {

		paramsNode := &Foundation{
			Parent:      p,
			NodeParent:  p,
			PathSegment: "parameters",
			Index:       p.Index,
			ValueNode:   ExtractValueNodeForLowModel(pathItem.GoLow().Parameters),
			KeyNode:     ExtractKeyNodeForLowModel(pathItem.GoLow().Parameters),
		}

		paramsNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(paramsNode.PathSegment),
			paramsNode.PathSegment, nil, p, true, len(pathItem.Parameters), &negOne)

		for i, parameter := range pathItem.Parameters {
			param := parameter
			para := &Parameter{}
			para.KeyNode = param.GoLow().KeyNode
			para.ValueNode = param.GoLow().RootNode
			para.PathSegment = "parameters"
			para.Parent = p
			para.IsIndexed = true
			para.Index = &i
			para.NodeParent = paramsNode
			wg.Go(func() {
				para.Walk(ctx, param)
			})
			p.Parameters = append(p.Parameters, para)
		}
	}

	if pathItem.GoLow().IsReference() {
		BuildReference(drCtx, pathItem.GoLow())
	}

	drCtx.ObjectChan <- p
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

func (p *PathItem) GetValue() any {
	return p.Value
}

func (p *PathItem) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

	if p.Key != "" {
		if len(p.Key) > HEIGHT-10 {
			width += (len(p.Key) - (HEIGHT - 10)) * 15
		}
	}

	if p.Get != nil {
		height += HEIGHT
	}

	if p.Put != nil {
		height += HEIGHT
	}

	if p.Post != nil {
		height += HEIGHT
	}

	if p.Delete != nil {
		height += HEIGHT
	}

	if p.Options != nil {
		height += HEIGHT
	}

	if p.Head != nil {
		height += HEIGHT
	}

	if p.Patch != nil {
		height += HEIGHT
	}

	if p.Trace != nil {
		height += HEIGHT
	}

	if p.Servers != nil {
		height += HEIGHT
	}

	if p.Parameters != nil {
		height += HEIGHT
	}

	if p.Value.Extensions != nil && p.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	for _, change := range p.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}

	return height, width
}

func (p *PathItem) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, p)
}

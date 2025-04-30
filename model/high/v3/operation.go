// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"fmt"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"strings"
)

type Operation struct {
	Value        *v3.Operation
	ExternalDocs *ExternalDoc
	Parameters   []*Parameter
	RequestBody  *RequestBody
	Responses    *Responses
	Callbacks    *orderedmap.Map[string, *Callback]
	Security     []*SecurityRequirement
	Servers      []*Server
	Foundation
}

func (o *Operation) Walk(ctx context.Context, operation *v3.Operation) {

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	o.Value = operation
	o.BuildNodesAndEdges(ctx, strings.ToUpper(o.PathSegment), "operation", operation, o)
	negOne := -1

	if operation.ExternalDocs != nil {
		ed := &ExternalDoc{}
		ed.Parent = o
		ed.NodeParent = o
		ed.PathSegment = "externalDocs"
		ed.Value = operation.ExternalDocs
		ed.Walk(ctx, operation.ExternalDocs)
		o.ExternalDocs = ed
	}

	if operation.Parameters != nil && len(operation.Parameters) > 0 {

		paramsNode := &Foundation{
			Parent:      o,
			NodeParent:  o,
			PathSegment: "parameters",
			Index:       o.Index,
			ValueNode:   ExtractValueNodeForLowModel(operation.GoLow().Parameters),
			KeyNode:     ExtractKeyNodeForLowModel(operation.GoLow().Parameters),
		}

		paramsNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(paramsNode.PathSegment),
			paramsNode.PathSegment, nil, o, true, len(operation.Parameters), &negOne)

		for i, parameter := range operation.Parameters {
			param := parameter
			p := &Parameter{}
			p.ValueNode = param.GoLow().RootNode
			p.KeyNode = param.GoLow().KeyNode
			p.PathSegment = "parameters"
			p.Parent = o
			p.NodeParent = paramsNode
			p.IsIndexed = true
			p.Index = &i
			wg.Go(func() { p.Walk(ctx, param) })
			o.Parameters = append(o.Parameters, p)
		}
	}

	if operation.RequestBody != nil {
		rb := &RequestBody{}
		rb.Parent = o
		rb.PathSegment = "requestBody"
		rb.NodeParent = o
		rb.ValueNode = operation.RequestBody.GoLow().RootNode
		rb.KeyNode = operation.RequestBody.GoLow().KeyNode
		wg.Go(func() {
			rb.Walk(ctx, operation.RequestBody)
		})
		o.RequestBody = rb
	}

	if operation.Responses != nil {
		r := &Responses{}
		r.Parent = o
		r.NodeParent = o
		//r.Key = "responses"
		r.PathSegment = "responses"
		r.KeyNode = operation.Responses.GoLow().KeyNode
		r.ValueNode = operation.Responses.GoLow().RootNode
		wg.Go(func() {
			r.Walk(ctx, operation.Responses)
		})
		o.Responses = r
	}

	if operation.Callbacks != nil {
		callbacks := orderedmap.New[string, *Callback]()
		for callbackPairs := operation.Callbacks.First(); callbackPairs != nil; callbackPairs = callbackPairs.Next() {
			c := &Callback{}
			c.Parent = o
			c.Key = callbackPairs.Key()
			for lowHeaderPairs := operation.GoLow().Callbacks.Value.First(); lowHeaderPairs != nil; lowHeaderPairs = lowHeaderPairs.Next() {
				if lowHeaderPairs.Key().Value == c.Key {
					c.KeyNode = lowHeaderPairs.Key().KeyNode
					c.ValueNode = lowHeaderPairs.Value().ValueNode
					break
				}
			}
			c.PathSegment = "callbacks"
			c.Key = callbackPairs.Key()
			v := callbackPairs.Value()
			c.NodeParent = o
			wg.Go(func() { c.Walk(ctx, v) })
			callbacks.Set(callbackPairs.Key(), c)
		}
		o.Callbacks = callbacks
	}

	if operation.Security != nil {
		o.Security = []*SecurityRequirement{}
		for i, security := range operation.Security {
			sec := security

			// iterate through requirements.
			for reqPairs := sec.Requirements.First(); reqPairs != nil; reqPairs = reqPairs.Next() {

				k := reqPairs.Key()
				// locate security requirement
				if drCtx.V3Document != nil && drCtx.V3Document.Components != nil && drCtx.V3Document.Components.SecuritySchemes != nil {
					schemes := drCtx.V3Document.Components.SecuritySchemes
					if schemes != nil {
						scheme, p := schemes.Get(k)
						if p {
							// build an edge!
							o.BuildReferenceEdge(ctx, o.GenerateJSONPath(), fmt.Sprint(scheme.GoLow().GetRootNode().Line),
								fmt.Sprintf("'#/components/securitySchemes/%s'", k), "")
						}
					}
				}
			}

			s := &SecurityRequirement{}
			s.Parent = o
			s.IsIndexed = true
			s.Index = &i
			s.NodeParent = o
			wg.Go(func() { s.Walk(ctx, sec) })
			o.Security = append(o.Security, s)
		}
	}

	if len(operation.Tags) > 0 {

		// iterate through requirements.
		for _, t := range operation.Tags {

			// locate tag
			if drCtx.V3Document != nil && drCtx.V3Document.Tags != nil {
				tags := drCtx.V3Document.Tags
				if tags != nil {

					for x, to := range drCtx.V3Document.Tags {
						if to.Name == t {
							// build an edge!
							o.BuildReferenceEdge(ctx, o.GenerateJSONPath(), fmt.Sprint(to.GoLow().RootNode.Line),
								fmt.Sprintf("'#/tags[%d]'", x), "")

						}
					}
				}
			}
		}
	}

	if operation.Servers != nil {
		for i, server := range operation.Servers {
			s := &Server{}
			s.ValueNode = server.GoLow().RootNode
			s.KeyNode = server.GoLow().KeyNode
			s.Parent = o
			s.NodeParent = o
			s.IsIndexed = true
			s.Index = &i
			wg.Go(func() { s.Walk(ctx, server) })
			o.Servers = append(o.Servers, s)
		}
	}

	if operation.GoLow().IsReference() {
		BuildReference(drCtx, operation.GoLow())
	}

	drCtx.ObjectChan <- o
}

func (o *Operation) GetValue() any {
	return o.Value
}

func (o *Operation) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT

	if o.Key != "" {
		if len(o.Key) > HEIGHT-10 {
			width += (len(o.Key) - (HEIGHT - 10)) * 15
		}
	}

	if o.Value.OperationId != "" {
		height += HEIGHT
		if len(o.Value.OperationId) > HEIGHT-10 {
			width += (len(o.Value.OperationId) - (HEIGHT - 10)) * 20
		}
	}

	if o.Value.Callbacks != nil && o.Value.Callbacks.Len() > 0 {
		height += HEIGHT
	}

	if len(o.Value.Parameters) > 0 {
		height += HEIGHT
	}

	if o.Value.Deprecated != nil && *o.Value.Deprecated {
		height += HEIGHT
	}

	if len(o.Value.Servers) > 0 {
		height += HEIGHT
	}

	if o.Value.Responses != nil && o.Value.Responses.Codes.Len() > 0 {
		height += HEIGHT
	}

	if len(o.Value.Security) > 0 {
		height += HEIGHT
	}

	if len(o.Value.Tags) > 0 {
		height += HEIGHT
	}

	if o.Value.Extensions != nil && o.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}

	for _, change := range o.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}

	return height, width
}

func (o *Operation) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, o)
}

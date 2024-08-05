// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	drBase "github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type Components struct {
	Value           *v3.Components
	Schemas         *orderedmap.Map[string, *drBase.SchemaProxy]
	Responses       *orderedmap.Map[string, *Response]
	Parameters      *orderedmap.Map[string, *Parameter]
	Examples        *orderedmap.Map[string, *drBase.Example]
	RequestBodies   *orderedmap.Map[string, *RequestBody]
	Headers         *orderedmap.Map[string, *Header]
	SecuritySchemes *orderedmap.Map[string, *SecurityScheme]
	Links           *orderedmap.Map[string, *Link]
	Callbacks       *orderedmap.Map[string, *Callback]
	drBase.Foundation
}

func (c *Components) Walk(ctx context.Context, components *v3.Components) {

	drCtx := drBase.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	c.Value = components
	c.PathSegment = "components"
	c.BuildNodesAndEdges(ctx, cases.Title(language.English).String(c.PathSegment), c.PathSegment, components, c)

	if components.Schemas != nil && components.Schemas.Len() > 0 {

		schNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "schemas",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Schemas),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Schemas),
		}
		schNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(schNode.PathSegment), schNode.PathSegment, nil, c)

		c.Schemas = orderedmap.New[string, *drBase.SchemaProxy]()
		for schemasPairs := components.Schemas.First(); schemasPairs != nil; schemasPairs = schemasPairs.Next() {
			k := schemasPairs.Key()
			v := schemasPairs.Value()
			sp := &drBase.SchemaProxy{}
			sp.Parent = c
			for lowSchPairs := components.GoLow().Schemas.Value.First(); lowSchPairs != nil; lowSchPairs = lowSchPairs.Next() {
				if lowSchPairs.Key().Value == k {
					sp.ValueNode = lowSchPairs.Value().ValueNode
					sp.KeyNode = lowSchPairs.Key().KeyNode
				}
			}
			sp.NodeParent = schNode
			sp.Key = k
			sp.PathSegment = "schemas"
			wg.Go(func() { sp.Walk(ctx, v) })
			c.Schemas.Set(k, sp)
		}
	}

	if components.Responses != nil && components.Responses.Len() > 0 {
		respNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "responses",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Responses),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Responses),
		}
		respNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(respNode.PathSegment), respNode.PathSegment, nil, c)

		c.Responses = orderedmap.New[string, *Response]()
		for responsesPairs := components.Responses.First(); responsesPairs != nil; responsesPairs = responsesPairs.Next() {
			k := responsesPairs.Key()
			v := responsesPairs.Value()
			r := &Response{}
			for lowResponsesPairs := components.GoLow().Responses.Value.First(); lowResponsesPairs != nil; lowResponsesPairs = lowResponsesPairs.Next() {
				if lowResponsesPairs.Key().Value == k {
					r.KeyNode = lowResponsesPairs.Key().KeyNode
					r.ValueNode = lowResponsesPairs.Value().ValueNode
					break
				}
			}
			r.Parent = c
			r.NodeParent = respNode
			r.Key = k
			r.PathSegment = "responses"
			wg.Go(func() {
				r.Walk(ctx, v)
			})
			c.Responses.Set(k, r)
		}
	}

	if components.Parameters != nil && components.Parameters.Len() > 0 {

		paramNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "parameters",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Parameters),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Parameters),
		}
		paramNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(paramNode.PathSegment), paramNode.PathSegment, nil, c)

		c.Parameters = orderedmap.New[string, *Parameter]()
		for parametersPairs := components.Parameters.First(); parametersPairs != nil; parametersPairs = parametersPairs.Next() {
			k := parametersPairs.Key()
			v := parametersPairs.Value()
			p := &Parameter{}
			for lowParamPairs := components.GoLow().Parameters.Value.First(); lowParamPairs != nil; lowParamPairs = lowParamPairs.Next() {
				if lowParamPairs.Key().Value == k {
					p.KeyNode = lowParamPairs.Key().KeyNode
					p.ValueNode = lowParamPairs.Value().ValueNode
					break
				}
			}
			p.Parent = c
			p.NodeParent = paramNode
			p.Key = k
			p.PathSegment = "parameters"
			wg.Go(func() { p.Walk(ctx, v) })
			c.Parameters.Set(k, p)
		}
	}

	if components.Examples != nil && components.Examples.Len() > 0 {

		expNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "examples",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Examples),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Examples),
		}
		expNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(expNode.PathSegment), expNode.PathSegment, nil, c)

		c.Examples = orderedmap.New[string, *drBase.Example]()
		for examplesPairs := components.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
			k := examplesPairs.Key()
			v := examplesPairs.Value()
			e := &drBase.Example{}
			for lowExpPairs := components.GoLow().Examples.Value.First(); lowExpPairs != nil; lowExpPairs = lowExpPairs.Next() {
				if lowExpPairs.Key().Value == k {
					e.KeyNode = lowExpPairs.Key().KeyNode
					e.ValueNode = lowExpPairs.Value().ValueNode
					break
				}
			}
			e.Parent = c
			e.NodeParent = expNode
			e.Key = k
			e.PathSegment = "examples"
			wg.Go(func() { e.Walk(ctx, v) })
			c.Examples.Set(k, e)
		}
	}

	if components.RequestBodies != nil && components.RequestBodies.Len() > 0 {

		reqNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "requestBodies",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().RequestBodies),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().RequestBodies),
		}
		reqNode.BuildNodesAndEdges(ctx, "Request Bodies", reqNode.PathSegment, nil, c)

		c.RequestBodies = orderedmap.New[string, *RequestBody]()
		for requestBodiesPairs := components.RequestBodies.First(); requestBodiesPairs != nil; requestBodiesPairs = requestBodiesPairs.Next() {
			k := requestBodiesPairs.Key()
			v := requestBodiesPairs.Value()
			rb := &RequestBody{}
			for lowRequestBodiesPairs := components.GoLow().RequestBodies.Value.First(); lowRequestBodiesPairs != nil; lowRequestBodiesPairs = lowRequestBodiesPairs.Next() {
				if lowRequestBodiesPairs.Key().Value == k {
					rb.KeyNode = lowRequestBodiesPairs.Key().KeyNode
					rb.ValueNode = lowRequestBodiesPairs.Value().ValueNode
					break
				}
			}
			rb.Parent = c
			rb.NodeParent = reqNode
			rb.Key = k
			rb.PathSegment = "requestBodies"
			rb.InstanceType = "requestBody"
			wg.Go(func() {
				rb.Walk(ctx, v)
			})
			c.RequestBodies.Set(k, rb)
		}
	}

	if components.Headers != nil && components.Headers.Len() > 0 {

		headerNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "headers",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Headers),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Headers),
		}
		headerNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(headerNode.PathSegment), headerNode.PathSegment, nil, c)

		c.Headers = orderedmap.New[string, *Header]()
		for headersPairs := components.Headers.First(); headersPairs != nil; headersPairs = headersPairs.Next() {
			k := headersPairs.Key()
			v := headersPairs.Value()
			h := &Header{}
			for lowHeadersPairs := components.GoLow().Headers.Value.First(); lowHeadersPairs != nil; lowHeadersPairs = lowHeadersPairs.Next() {
				if lowHeadersPairs.Key().Value == headersPairs.Key() {
					h.KeyNode = lowHeadersPairs.Key().KeyNode
					h.ValueNode = lowHeadersPairs.Value().ValueNode
					break
				}
			}
			h.Parent = c
			h.NodeParent = headerNode
			h.Key = k
			h.PathSegment = "headers"
			wg.Go(func() { h.Walk(ctx, v) })
			c.Headers.Set(k, h)
		}
	}

	if components.SecuritySchemes != nil && components.SecuritySchemes.Len() > 0 {

		secNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "securitySchemes",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().SecuritySchemes),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().SecuritySchemes),
		}
		secNode.BuildNodesAndEdges(ctx, "Security Schemes", secNode.PathSegment, nil, c)

		c.SecuritySchemes = orderedmap.New[string, *SecurityScheme]()
		for securitySchemesPairs := components.SecuritySchemes.First(); securitySchemesPairs != nil; securitySchemesPairs = securitySchemesPairs.Next() {
			k := securitySchemesPairs.Key()
			v := securitySchemesPairs.Value()
			ss := &SecurityScheme{}
			for lowSecPairs := components.GoLow().SecuritySchemes.Value.First(); lowSecPairs != nil; lowSecPairs = lowSecPairs.Next() {
				if lowSecPairs.Key().Value == k {
					ss.KeyNode = lowSecPairs.Key().KeyNode
					ss.ValueNode = lowSecPairs.Value().ValueNode
					break
				}
			}
			ss.Parent = c
			ss.NodeParent = secNode
			ss.Key = k
			ss.PathSegment = "securitySchemes"
			wg.Go(func() { ss.Walk(ctx, v) })
			c.SecuritySchemes.Set(k, ss)
		}
	}

	if components.Links != nil && components.Links.Len() > 0 {

		linkNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "links",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Links),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Links),
		}
		linkNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(linkNode.PathSegment), linkNode.PathSegment, nil, c)

		c.Links = orderedmap.New[string, *Link]()
		for linksPairs := components.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
			k := linksPairs.Key()
			v := linksPairs.Value()
			l := &Link{}
			for lowLinksPairs := components.GoLow().Links.Value.First(); lowLinksPairs != nil; lowLinksPairs = lowLinksPairs.Next() {
				if lowLinksPairs.Key().Value == k {
					l.KeyNode = lowLinksPairs.Key().KeyNode
					l.ValueNode = lowLinksPairs.Value().ValueNode
					break
				}
			}
			l.Parent = c
			l.NodeParent = linkNode
			l.Key = k
			l.PathSegment = "links"
			wg.Go(func() { l.Walk(ctx, v) })
			c.Links.Set(k, l)
		}
	}

	if components.Callbacks != nil && components.Callbacks.Len() > 0 {

		cbNode := &drBase.Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "callbacks",
			Index:       c.Index,
			ValueNode:   drBase.ExtractValueNodeForLowModel(components.GoLow().Callbacks),
			KeyNode:     drBase.ExtractKeyNodeForLowModel(components.GoLow().Callbacks),
		}
		cbNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(cbNode.PathSegment), cbNode.PathSegment, nil, c)

		c.Callbacks = orderedmap.New[string, *Callback]()
		for callbacksPairs := components.Callbacks.First(); callbacksPairs != nil; callbacksPairs = callbacksPairs.Next() {
			k := callbacksPairs.Key()
			v := callbacksPairs.Value()
			cb := &Callback{}
			for lowCBPairs := components.GoLow().Callbacks.Value.First(); lowCBPairs != nil; lowCBPairs = lowCBPairs.Next() {
				if lowCBPairs.Key().Value == k {
					cb.KeyNode = lowCBPairs.Key().KeyNode
					cb.ValueNode = lowCBPairs.Value().ValueNode
					break
				}
			}
			cb.Parent = c
			cb.NodeParent = cbNode
			cb.Key = k
			cb.PathSegment = "callbacks"
			wg.Go(func() { cb.Walk(ctx, v) })
			c.Callbacks.Set(k, cb)
		}
	}
	drCtx.ObjectChan <- c
}

func (c *Components) GetValue() any {
	return c.Value
}

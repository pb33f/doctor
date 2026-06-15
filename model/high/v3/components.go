// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Components struct {
	Value           *v3.Components
	Schemas         *orderedmap.Map[string, *SchemaProxy]
	Responses       *orderedmap.Map[string, *Response]
	Parameters      *orderedmap.Map[string, *Parameter]
	Examples        *orderedmap.Map[string, *Example]
	RequestBodies   *orderedmap.Map[string, *RequestBody]
	Headers         *orderedmap.Map[string, *Header]
	SecuritySchemes *orderedmap.Map[string, *SecurityScheme]
	Links           *orderedmap.Map[string, *Link]
	Callbacks       *orderedmap.Map[string, *Callback]
	PathItems       *orderedmap.Map[string, *PathItem]
	Foundation
}

func (c *Components) Walk(ctx context.Context, components *v3.Components) {

	drCtx := GetDrContext(ctx)

	c.Value = components
	c.SetPathSegment("components")
	c.BuildNodesAndEdges(ctx, titleString(c.PathSegment), c.PathSegment, components, c)
	negOne := -1

	if components.Schemas != nil && components.Schemas.Len() > 0 {

		schNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "schemas",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Schemas),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Schemas),
		}

		schNode.BuildNodesAndEdgesWithArray(ctx, titleString(schNode.PathSegment),
			schNode.PathSegment, nil, c, false, components.Schemas.Len(), &negOne)

		c.Schemas = orderedmap.New[string, *SchemaProxy]()
		lowSchemas := newLowNodeFinder(components.GoLow().Schemas.Value)
		for schemasPairs := components.Schemas.First(); schemasPairs != nil; schemasPairs = schemasPairs.Next() {
			k := schemasPairs.Key()
			v := schemasPairs.Value()
			sp := &SchemaProxy{}
			sp.Parent = c
			if keyNode, valueNode, ok := lowSchemas.find(k); ok {
				sp.KeyNode = keyNode
				sp.ValueNode = valueNode
			}
			sp.NodeParent = schNode
			sp.Key = k
			sp.SetPathSegment("schemas")
			drCtx.RunWalk(func() { sp.Walk(ctx, v, 0) })
			c.Schemas.Set(k, sp)
		}
	}

	if components.Responses != nil && components.Responses.Len() > 0 {
		respNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "responses",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Responses),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Responses),
		}
		respNode.BuildNodesAndEdgesWithArray(ctx, "Responses",
			respNode.PathSegment, nil, c, false, components.Responses.Len(), &negOne)

		c.Responses = orderedmap.New[string, *Response]()
		lowResponsesFinder := newLowNodeFinder(components.GoLow().Responses.Value)
		for responsesPairs := components.Responses.First(); responsesPairs != nil; responsesPairs = responsesPairs.Next() {
			k := responsesPairs.Key()
			v := responsesPairs.Value()
			r := &Response{}
			if keyNode, valueNode, ok := lowResponsesFinder.find(k); ok {
				r.KeyNode = keyNode
				r.ValueNode = valueNode
			}
			r.Parent = c
			r.NodeParent = respNode
			r.Key = k
			r.SetPathSegment("responses")
			drCtx.RunWalk(func() {
				r.Walk(ctx, v)
			})
			c.Responses.Set(k, r)
		}
	}

	if components.Parameters != nil && components.Parameters.Len() > 0 {

		paramNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "parameters",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Parameters),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Parameters),
		}

		paramNode.BuildNodesAndEdgesWithArray(ctx, titleString(paramNode.PathSegment),
			paramNode.PathSegment, nil, c, false, components.Parameters.Len(), &negOne)

		c.Parameters = orderedmap.New[string, *Parameter]()
		lowParamFinder := newLowNodeFinder(components.GoLow().Parameters.Value)
		for parametersPairs := components.Parameters.First(); parametersPairs != nil; parametersPairs = parametersPairs.Next() {
			k := parametersPairs.Key()
			v := parametersPairs.Value()
			p := &Parameter{}
			if keyNode, valueNode, ok := lowParamFinder.find(k); ok {
				p.KeyNode = keyNode
				p.ValueNode = valueNode
			}
			p.Parent = c
			p.NodeParent = paramNode
			p.Key = k
			p.SetPathSegment("parameters")
			drCtx.RunWalk(func() { p.Walk(ctx, v) })
			c.Parameters.Set(k, p)
		}
	}

	if components.Examples != nil && components.Examples.Len() > 0 {

		expNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "examples",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Examples),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Examples),
		}

		expNode.BuildNodesAndEdgesWithArray(ctx, titleString(expNode.PathSegment),
			expNode.PathSegment, nil, c, false, components.Examples.Len(), &negOne)

		c.Examples = orderedmap.New[string, *Example]()
		lowExpFinder := newLowNodeFinder(components.GoLow().Examples.Value)
		for examplesPairs := components.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
			k := examplesPairs.Key()
			v := examplesPairs.Value()
			e := &Example{}
			if keyNode, valueNode, ok := lowExpFinder.find(k); ok {
				e.KeyNode = keyNode
				e.ValueNode = valueNode
			}
			e.Parent = c
			e.NodeParent = expNode
			e.Key = k
			e.SetPathSegment("examples")
			drCtx.RunWalk(func() { e.Walk(ctx, v) })
			c.Examples.Set(k, e)
		}
	}

	if components.RequestBodies != nil && components.RequestBodies.Len() > 0 {

		reqNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "requestBodies",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().RequestBodies),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().RequestBodies),
		}

		reqNode.BuildNodesAndEdgesWithArray(ctx, "Request Bodies",
			reqNode.PathSegment, nil, c, false, components.RequestBodies.Len(), &negOne)

		c.RequestBodies = orderedmap.New[string, *RequestBody]()
		lowRequestBodiesFinder := newLowNodeFinder(components.GoLow().RequestBodies.Value)
		for requestBodiesPairs := components.RequestBodies.First(); requestBodiesPairs != nil; requestBodiesPairs = requestBodiesPairs.Next() {
			k := requestBodiesPairs.Key()
			v := requestBodiesPairs.Value()
			rb := &RequestBody{}
			if keyNode, valueNode, ok := lowRequestBodiesFinder.find(k); ok {
				rb.KeyNode = keyNode
				rb.ValueNode = valueNode
			}
			rb.Parent = c
			rb.NodeParent = reqNode
			rb.Key = k
			rb.SetPathSegment("requestBodies")
			rb.InstanceType = "requestBody"
			drCtx.RunWalk(func() {
				rb.Walk(ctx, v)
			})
			c.RequestBodies.Set(k, rb)
		}
	}

	if components.Headers != nil && components.Headers.Len() > 0 {

		headerNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "headers",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Headers),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Headers),
		}

		headerNode.BuildNodesAndEdgesWithArray(ctx, titleString(headerNode.PathSegment),
			headerNode.PathSegment, nil, c, false, components.Headers.Len(), &negOne)

		c.Headers = orderedmap.New[string, *Header]()
		lowHeadersFinder := newLowNodeFinder(components.GoLow().Headers.Value)
		for headersPairs := components.Headers.First(); headersPairs != nil; headersPairs = headersPairs.Next() {
			k := headersPairs.Key()
			v := headersPairs.Value()
			h := &Header{}
			if keyNode, valueNode, ok := lowHeadersFinder.find(k); ok {
				h.KeyNode = keyNode
				h.ValueNode = valueNode
			}
			h.Parent = c
			h.NodeParent = headerNode
			h.Key = k
			h.SetPathSegment("headers")
			drCtx.RunWalk(func() { h.Walk(ctx, v) })
			c.Headers.Set(k, h)
		}
	}

	if components.SecuritySchemes != nil && components.SecuritySchemes.Len() > 0 {

		secNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "securitySchemes",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().SecuritySchemes),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().SecuritySchemes),
		}

		secNode.BuildNodesAndEdgesWithArray(ctx, "Security Schemes",
			secNode.PathSegment, nil, c, false, components.SecuritySchemes.Len(), &negOne)

		c.SecuritySchemes = orderedmap.New[string, *SecurityScheme]()
		lowSecFinder := newLowNodeFinder(components.GoLow().SecuritySchemes.Value)
		for securitySchemesPairs := components.SecuritySchemes.First(); securitySchemesPairs != nil; securitySchemesPairs = securitySchemesPairs.Next() {
			k := securitySchemesPairs.Key()
			v := securitySchemesPairs.Value()
			ss := &SecurityScheme{}
			if keyNode, valueNode, ok := lowSecFinder.find(k); ok {
				ss.KeyNode = keyNode
				ss.ValueNode = valueNode
			}
			ss.Parent = c
			ss.NodeParent = secNode
			ss.Key = k
			ss.SetPathSegment("securitySchemes")
			drCtx.RunWalk(func() { ss.Walk(ctx, v) })
			c.SecuritySchemes.Set(k, ss)
		}
	}

	if components.Links != nil && components.Links.Len() > 0 {

		linkNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "links",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Links),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Links),
		}

		linkNode.BuildNodesAndEdgesWithArray(ctx, titleString(linkNode.PathSegment),
			linkNode.PathSegment, nil, c, false, components.Links.Len(), &negOne)

		c.Links = orderedmap.New[string, *Link]()
		lowLinksFinder := newLowNodeFinder(components.GoLow().Links.Value)
		for linksPairs := components.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
			k := linksPairs.Key()
			v := linksPairs.Value()
			l := &Link{}
			if keyNode, valueNode, ok := lowLinksFinder.find(k); ok {
				l.KeyNode = keyNode
				l.ValueNode = valueNode
			}
			l.Parent = c
			l.NodeParent = linkNode
			l.Key = k
			l.SetPathSegment("links")
			drCtx.RunWalk(func() { l.Walk(ctx, v) })
			c.Links.Set(k, l)
		}
	}

	if components.Callbacks != nil && components.Callbacks.Len() > 0 {

		cbNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "callbacks",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().Callbacks),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().Callbacks),
		}

		cbNode.BuildNodesAndEdgesWithArray(ctx, titleString(cbNode.PathSegment),
			cbNode.PathSegment, nil, c, false, components.Callbacks.Len(), &negOne)

		c.Callbacks = orderedmap.New[string, *Callback]()
		lowCBFinder := newLowNodeFinder(components.GoLow().Callbacks.Value)
		for callbacksPairs := components.Callbacks.First(); callbacksPairs != nil; callbacksPairs = callbacksPairs.Next() {
			k := callbacksPairs.Key()
			v := callbacksPairs.Value()
			cb := &Callback{}
			if keyNode, valueNode, ok := lowCBFinder.find(k); ok {
				cb.KeyNode = keyNode
				cb.ValueNode = valueNode
			}
			cb.Parent = c
			cb.NodeParent = cbNode
			cb.Key = k
			cb.SetPathSegment("callbacks")
			drCtx.RunWalk(func() { cb.Walk(ctx, v) })
			c.Callbacks.Set(k, cb)
		}
	}

	if components.PathItems != nil && components.PathItems.Len() > 0 {

		piNode := &Foundation{
			Parent:      c,
			NodeParent:  c,
			PathSegment: "pathItems",
			Index:       c.Index,
			ValueNode:   ExtractValueNodeForLowModel(components.GoLow().PathItems),
			KeyNode:     ExtractKeyNodeForLowModel(components.GoLow().PathItems),
		}
		piNode.BuildNodesAndEdgesWithArray(ctx, titleString(piNode.PathSegment),
			piNode.PathSegment, nil, c, false, components.PathItems.Len(), &negOne)

		c.PathItems = orderedmap.New[string, *PathItem]()
		lowPiFinder := newLowNodeFinder(components.GoLow().PathItems.Value)
		for pathItemPairs := components.PathItems.First(); pathItemPairs != nil; pathItemPairs = pathItemPairs.Next() {
			k := pathItemPairs.Key()
			v := pathItemPairs.Value()
			pi := &PathItem{}
			if keyNode, valueNode, ok := lowPiFinder.find(k); ok {
				pi.KeyNode = keyNode
				pi.ValueNode = valueNode
			}
			pi.Parent = c

			pi.NodeParent = piNode
			pi.Key = k
			pi.SetPathSegment("pathItems")
			drCtx.RunWalk(func() { pi.Walk(ctx, v) })
			c.PathItems.Set(k, pi)
		}
	}

	drCtx.ObjectChan <- c
}

func (c *Components) GetValue() any {
	return c.Value
}

func (c *Components) GetSize() (height, width int) {
	width = WIDTH
	height = HEIGHT
	if c.PathItems != nil && c.PathItems.Len() > 0 {
		height += HEIGHT
	}
	if c.Callbacks != nil && c.Callbacks.Len() > 0 {
		height += HEIGHT
	}
	if c.Examples != nil && c.Examples.Len() > 0 {
		height += HEIGHT
	}
	if c.Headers != nil && c.Headers.Len() > 0 {
		height += HEIGHT
	}
	if c.Links != nil && c.Links.Len() > 0 {
		height += HEIGHT
	}
	if c.Parameters != nil && c.Parameters.Len() > 0 {
		height += HEIGHT
	}
	if c.RequestBodies != nil && c.RequestBodies.Len() > 0 {
		height += HEIGHT
		width += 20
	}
	if c.Responses != nil && c.Responses.Len() > 0 {
		height += HEIGHT
	}
	if c.Schemas != nil && c.Schemas.Len() > 0 {
		height += HEIGHT
	}
	if c.SecuritySchemes != nil && c.SecuritySchemes.Len() > 0 {
		height += HEIGHT
		if width < WIDTH+20 {
			width += 20
		}
	}
	if c.Value.Extensions != nil && c.Value.Extensions.Len() > 0 {
		height += HEIGHT
	}
	for _, change := range c.Changes {
		if len(change.GetPropertyChanges()) > 0 {
			height += HEIGHT
			break
		}
	}
	return height, width
}

func (c *Components) Travel(ctx context.Context, tardis Tardis) {
	tardis.Visit(ctx, c)
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
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
	wg := drCtx.WaitGroup

	c.Value = components
	c.SetPathSegment("components")
	c.BuildNodesAndEdges(ctx, cases.Title(language.English).String(c.PathSegment), c.PathSegment, components, c)
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

		schNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(schNode.PathSegment),
			schNode.PathSegment, nil, c, false, components.Schemas.Len(), &negOne)

		c.Schemas = orderedmap.New[string, *SchemaProxy]()
		for schemasPairs := components.Schemas.First(); schemasPairs != nil; schemasPairs = schemasPairs.Next() {
			k := schemasPairs.Key()
			v := schemasPairs.Value()
			sp := &SchemaProxy{}
			sp.Parent = c
			for lowSchPairs := components.GoLow().Schemas.Value.First(); lowSchPairs != nil; lowSchPairs = lowSchPairs.Next() {
				if lowSchPairs.Key().Value == k {
					sp.ValueNode = lowSchPairs.Value().ValueNode
					sp.KeyNode = lowSchPairs.Key().KeyNode
				}
			}
			sp.NodeParent = schNode
			sp.Key = k
			sp.SetPathSegment("schemas")
			wg.Go(func() { sp.Walk(ctx, v, 0) })
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
			r.SetPathSegment("responses")
			wg.Go(func() {
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

		paramNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(paramNode.PathSegment),
			paramNode.PathSegment, nil, c, false, components.Parameters.Len(), &negOne)

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
			p.SetPathSegment("parameters")
			wg.Go(func() { p.Walk(ctx, v) })
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

		expNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(expNode.PathSegment),
			expNode.PathSegment, nil, c, false, components.Examples.Len(), &negOne)

		c.Examples = orderedmap.New[string, *Example]()
		for examplesPairs := components.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
			k := examplesPairs.Key()
			v := examplesPairs.Value()
			e := &Example{}
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
			e.SetPathSegment("examples")
			wg.Go(func() { e.Walk(ctx, v) })
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
			rb.SetPathSegment("requestBodies")
			rb.InstanceType = "requestBody"
			wg.Go(func() {
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

		headerNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(headerNode.PathSegment),
			headerNode.PathSegment, nil, c, false, components.Headers.Len(), &negOne)

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
			h.SetPathSegment("headers")
			wg.Go(func() { h.Walk(ctx, v) })
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
			ss.SetPathSegment("securitySchemes")
			wg.Go(func() { ss.Walk(ctx, v) })
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

		linkNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(linkNode.PathSegment),
			linkNode.PathSegment, nil, c, false, components.Links.Len(), &negOne)

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
			l.SetPathSegment("links")
			wg.Go(func() { l.Walk(ctx, v) })
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

		cbNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(cbNode.PathSegment),
			cbNode.PathSegment, nil, c, false, components.Callbacks.Len(), &negOne)

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
			cb.SetPathSegment("callbacks")
			wg.Go(func() { cb.Walk(ctx, v) })
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
		piNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(piNode.PathSegment),
			piNode.PathSegment, nil, c, false, components.PathItems.Len(), &negOne)

		c.PathItems = orderedmap.New[string, *PathItem]()
		for pathItemPairs := components.PathItems.First(); pathItemPairs != nil; pathItemPairs = pathItemPairs.Next() {
			k := pathItemPairs.Key()
			v := pathItemPairs.Value()
			pi := &PathItem{}
			for lowPiPairs := components.GoLow().PathItems.Value.First(); lowPiPairs != nil; lowPiPairs = lowPiPairs.Next() {
				if lowPiPairs.Key().Value == k {
					pi.KeyNode = lowPiPairs.Key().KeyNode
					pi.ValueNode = lowPiPairs.Value().ValueNode
					break
				}
			}
			pi.Parent = c

			pi.NodeParent = piNode
			pi.Key = k
			pi.SetPathSegment("pathItems")
			wg.Go(func() { pi.Walk(ctx, v) })
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

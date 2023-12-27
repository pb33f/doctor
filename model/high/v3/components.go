// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
    "context"
    drBase "github.com/pb33f/doctor/model/high/base"
    v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
    "github.com/pb33f/libopenapi/orderedmap"
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

    c.Value = components
    c.PathSegment = "components"

    if components.Schemas != nil {
        c.Schemas = orderedmap.New[string, *drBase.SchemaProxy]()
        for schemasPairs := components.Schemas.First(); schemasPairs != nil; schemasPairs = schemasPairs.Next() {
            k := schemasPairs.Key()
            v := schemasPairs.Value()
            sp := &drBase.SchemaProxy{}
            sp.Parent = c
            sp.Key = k
            sp.PathSegment = "schemas"
            sp.Walk(ctx, v)
            c.Schemas.Set(k, sp)
        }
    }

    if components.Responses != nil {
        c.Responses = orderedmap.New[string, *Response]()
        for responsesPairs := components.Responses.First(); responsesPairs != nil; responsesPairs = responsesPairs.Next() {
            k := responsesPairs.Key()
            v := responsesPairs.Value()
            r := &Response{}
            r.Parent = c
            r.Key = k
            r.PathSegment = "responses"
            r.Walk(ctx, v)
            c.Responses.Set(k, r)
        }
    }

    if components.Parameters != nil {
        c.Parameters = orderedmap.New[string, *Parameter]()
        for parametersPairs := components.Parameters.First(); parametersPairs != nil; parametersPairs = parametersPairs.Next() {
            k := parametersPairs.Key()
            v := parametersPairs.Value()
            p := &Parameter{}
            p.Parent = c
            p.Key = k
            p.PathSegment = "parameters"
            p.Walk(ctx, v)
            c.Parameters.Set(k, p)
        }
    }

    if components.Examples != nil {
        c.Examples = orderedmap.New[string, *drBase.Example]()
        for examplesPairs := components.Examples.First(); examplesPairs != nil; examplesPairs = examplesPairs.Next() {
            k := examplesPairs.Key()
            v := examplesPairs.Value()
            e := &drBase.Example{}
            e.Parent = c
            e.Key = k
            e.PathSegment = "examples"
            e.Walk(ctx, v)
            c.Examples.Set(k, e)
        }
    }

    if components.RequestBodies != nil {
        c.RequestBodies = orderedmap.New[string, *RequestBody]()
        for requestBodiesPairs := components.RequestBodies.First(); requestBodiesPairs != nil; requestBodiesPairs = requestBodiesPairs.Next() {
            k := requestBodiesPairs.Key()
            v := requestBodiesPairs.Value()
            rb := &RequestBody{}
            rb.Parent = c
            rb.Key = k
            rb.PathSegment = "requestBodies"
            rb.Walk(ctx, v)
            c.RequestBodies.Set(k, rb)
        }
    }

    if components.Headers != nil {
        c.Headers = orderedmap.New[string, *Header]()
        for headersPairs := components.Headers.First(); headersPairs != nil; headersPairs = headersPairs.Next() {
            k := headersPairs.Key()
            v := headersPairs.Value()
            h := &Header{}
            h.Parent = c
            h.Key = k
            h.PathSegment = "headers"
            h.Walk(ctx, v)
            c.Headers.Set(k, h)
        }
    }

    if components.SecuritySchemes != nil {
        c.SecuritySchemes = orderedmap.New[string, *SecurityScheme]()
        for securitySchemesPairs := components.SecuritySchemes.First(); securitySchemesPairs != nil; securitySchemesPairs = securitySchemesPairs.Next() {
            k := securitySchemesPairs.Key()
            v := securitySchemesPairs.Value()
            ss := &SecurityScheme{}
            ss.Parent = c
            ss.Key = k
            ss.PathSegment = "securitySchemes"
            ss.Walk(ctx, v)
            c.SecuritySchemes.Set(k, ss)
        }
    }

    if components.Links != nil {
        c.Links = orderedmap.New[string, *Link]()
        for linksPairs := components.Links.First(); linksPairs != nil; linksPairs = linksPairs.Next() {
            k := linksPairs.Key()
            v := linksPairs.Value()
            l := &Link{}
            l.Parent = c
            l.Key = k
            l.PathSegment = "links"
            l.Walk(ctx, v)
            c.Links.Set(k, l)
        }
    }

    if components.Callbacks != nil {
        c.Callbacks = orderedmap.New[string, *Callback]()
        for callbacksPairs := components.Callbacks.First(); callbacksPairs != nil; callbacksPairs = callbacksPairs.Next() {
            k := callbacksPairs.Key()
            v := callbacksPairs.Value()
            cb := &Callback{}
            cb.Parent = c
            cb.Key = k
            cb.PathSegment = "callbacks"
            cb.Walk(ctx, v)
            c.Callbacks.Set(k, cb)
        }
    }
}

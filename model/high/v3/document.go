// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
)

type Document struct {
	Document     *v3.Document
	Info         *base.Info
	Servers      []*Server
	Paths        *Paths
	Components   *Components
	Security     []*base.SecurityRequirement
	Tags         []*base.Tag
	ExternalDocs *base.ExternalDoc
	Webhooks     *orderedmap.Map[string, *PathItem]
	base.Foundation
}

func (d *Document) Walk(ctx context.Context, doc *v3.Document) {

	drCtx := base.GetDrContext(ctx)
	wg := drCtx.WaitGroup

	d.Document = doc
	d.PathSegment = "$"

	if doc.Info != nil {
		d.Info = &base.Info{}
		d.Info.Parent = d
		wg.Go(func() { d.Info.Walk(ctx, doc.Info) })

	}

	if doc.Servers != nil {
		for i, server := range doc.Servers {
			server := server
			s := &Server{}
			s.Parent = d
			s.IsIndexed = true
			s.Index = i
			d.Servers = append(d.Servers, s)
			wg.Go(func() { s.Walk(ctx, server) })
		}
	}

	if doc.Paths != nil {
		p := &Paths{}
		p.Parent = d
		wg.Go(func() { p.Walk(ctx, doc.Paths) })
		d.Paths = p
	}

	if doc.Components != nil {
		c := &Components{}
		c.Parent = d
		wg.Go(func() { c.Walk(ctx, doc.Components) })
		d.Components = c
	}

	if doc.Security != nil {
		for i, security := range doc.Security {
			security := security
			s := &base.SecurityRequirement{}
			s.Parent = d
			s.IsIndexed = true
			s.Index = i
			wg.Go(func() { s.Walk(ctx, security) })
			d.Security = append(d.Security, s)
		}
	}

	if doc.ExternalDocs != nil {
		ed := &base.ExternalDoc{}
		ed.Parent = d
		ed.PathSegment = "externalDocs"
		ed.Value = doc.ExternalDocs
		d.ExternalDocs = ed
	}

	if doc.Tags != nil {
		for i, tag := range doc.Tags {
			t := &base.Tag{}
			t.Parent = d
			t.PathSegment = "tags"
			t.IsIndexed = true
			t.Index = i
			t.Value = tag
			d.Tags = append(d.Tags, t)
		}
	}

	if doc.Webhooks != nil {
		webhooks := orderedmap.New[string, *PathItem]()
		for pair := doc.Webhooks.First(); pair != nil; pair = pair.Next() {
			pi := &PathItem{}
			pi.Parent = d
			pi.Key = pair.Key()
			pi.PathSegment = "webhooks"
			v := pair.Value()
			wg.Go(func() { pi.Walk(ctx, v) })
			webhooks.Set(pair.Key(), pi)
		}
		d.Webhooks = webhooks
	}
	wg.Wait()
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"context"
	"github.com/pb33f/doctor/model/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
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

	n := base.GenerateNode("document", nil)
	d.SetNode(n)
	n.Width = 50
	n.Height = 50
	n.Label = "Document"
	drCtx.NodeChan <- n

	//d.BuildNodesAndEdges(ctx, "document")

	if doc.Info != nil {
		d.Info = &base.Info{}
		d.Info.Parent = d
		d.Info.NodeParent = d
		d.Info.ValueNode = base.ExtractValueNodeForLowModel(doc.GoLow().Info)
		d.Info.KeyNode = base.ExtractKeyNodeForLowModel(doc.GoLow().Info)
		wg.Go(func() { d.Info.Walk(ctx, doc.Info) })
	}

	if doc.Servers != nil && len(doc.Servers) > 0 {
		serversNode := &base.Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "servers",
			Index:       d.Index,
			ValueNode:   base.ExtractValueNodeForLowModel(doc.GoLow().Servers),
			KeyNode:     base.ExtractKeyNodeForLowModel(doc.GoLow().Servers),
		}
		serversNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(serversNode.PathSegment), serversNode.PathSegment, nil, d)
		for i, server := range doc.Servers {
			srvr := server
			s := &Server{}
			s.Parent = d
			s.NodeParent = serversNode
			s.IsIndexed = true
			s.Index = i
			s.ValueNode = server.GoLow().RootNode
			s.KeyNode = server.GoLow().KeyNode
			d.Servers = append(d.Servers, s)
			wg.Go(func() { s.Walk(ctx, srvr) })
		}
	}

	if doc.Paths != nil && doc.Paths.PathItems != nil && doc.Paths.PathItems.Len() > 0 {
		p := &Paths{}
		p.Parent = d
		p.NodeParent = d
		p.ValueNode = base.ExtractValueNodeForLowModel(doc.GoLow().Paths)
		p.KeyNode = base.ExtractKeyNodeForLowModel(doc.GoLow().Paths)
		wg.Go(func() { p.Walk(ctx, doc.Paths) })
		d.Paths = p
	}

	if doc.Components != nil {
		c := &Components{}
		c.Parent = d
		c.NodeParent = d
		c.ValueNode = base.ExtractValueNodeForLowModel(doc.GoLow().Components)
		c.KeyNode = base.ExtractKeyNodeForLowModel(doc.GoLow().Components)
		wg.Go(func() { c.Walk(ctx, doc.Components) })
		d.Components = c
	}

	if doc.Security != nil {

		secNode := &base.Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "security",
			Index:       d.Index,
			ValueNode:   base.ExtractValueNodeForLowModel(doc.GoLow().Security),
			KeyNode:     base.ExtractKeyNodeForLowModel(doc.GoLow().Security),
		}
		secNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(secNode.PathSegment), secNode.PathSegment, nil, d)

		for i, security := range doc.Security {
			sec := security
			s := &base.SecurityRequirement{}

			s.Parent = d
			s.NodeParent = secNode
			s.IsIndexed = true
			s.Index = i
			wg.Go(func() { s.Walk(ctx, sec) })
			d.Security = append(d.Security, s)
		}
	}

	if doc.ExternalDocs != nil {
		ed := &base.ExternalDoc{}
		ed.Parent = d
		d.ValueNode = base.ExtractValueNodeForLowModel(doc.GoLow().ExternalDocs)
		d.KeyNode = base.ExtractKeyNodeForLowModel(doc.GoLow().ExternalDocs)
		ed.PathSegment = "externalDocs"
		ed.Value = doc.ExternalDocs
		d.ExternalDocs = ed
	}

	if doc.Tags != nil {
		tagsNode := &base.Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "tags",
			Index:       d.Index,
			ValueNode:   base.ExtractValueNodeForLowModel(doc.GoLow().Tags),
			KeyNode:     base.ExtractKeyNodeForLowModel(doc.GoLow().Tags),
		}
		tagsNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(tagsNode.PathSegment), tagsNode.PathSegment, nil, d)

		for i, tag := range doc.Tags {
			t := &base.Tag{}
			t.Parent = d
			t.NodeParent = tagsNode
			t.PathSegment = "tags"
			t.IsIndexed = true
			t.Index = i
			t.Value = tag
			t.ValueNode = doc.GoLow().Tags.Value[i].ValueNode
			t.KeyNode = tag.GoLow().RootNode
			t.BuildNodesAndEdges(ctx, tag.Name, "tag", tag, t)
			d.Tags = append(d.Tags, t)
		}

	}

	if doc.Webhooks != nil {

		webhooks := orderedmap.New[string, *PathItem]()
		webhookNode := &base.Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "webhooks",
			Index:       d.Index,
			ValueNode:   base.ExtractValueNodeForLowModel(doc.GoLow().Webhooks),
			KeyNode:     base.ExtractKeyNodeForLowModel(doc.GoLow().Webhooks),
		}
		webhookNode.BuildNodesAndEdges(ctx, cases.Title(language.English).String(webhookNode.PathSegment), webhookNode.PathSegment, nil, d)

		for pair := doc.Webhooks.First(); pair != nil; pair = pair.Next() {
			pi := &PathItem{}
			pi.Key = pair.Key()
			for lowWhPairs := doc.GoLow().Webhooks.Value.First(); lowWhPairs != nil; lowWhPairs = lowWhPairs.Next() {
				if lowWhPairs.Key().Value == pi.Key {
					pi.ValueNode = lowWhPairs.Value().ValueNode
					pi.KeyNode = lowWhPairs.Key().KeyNode
					break
				}
			}
			pi.Parent = d
			pi.PathSegment = "webhooks"
			pi.NodeParent = webhookNode
			v := pair.Value()
			wg.Go(func() {
				pi.Walk(ctx, v)
			})
			webhooks.Set(pair.Key(), pi)
		}
		d.Webhooks = webhooks
	}
	wg.Wait()
}

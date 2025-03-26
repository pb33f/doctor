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
)

type Document struct {
	Document     *v3.Document
	Info         *Info
	Servers      []*Server
	Paths        *Paths
	Components   *Components
	Security     []*SecurityRequirement
	Tags         []*Tag
	ExternalDocs *ExternalDoc
	Webhooks     *orderedmap.Map[string, *PathItem]
	Foundation
}

func (d *Document) Travel(ctx context.Context, traveller Tardis) {
	traveller.Visit(ctx, d)
}

func (d *Document) Walk(ctx context.Context, doc *v3.Document) {

	drCtx := GetDrContext(ctx)
	wg := drCtx.WaitGroup

	d.Document = doc
	d.PathSegment = "$"

	n := GenerateNode("document", nil, nil, drCtx)
	d.SetNode(n)
	n.Width = 50
	n.Height = 50
	n.Label = "Document"
	drCtx.NodeChan <- n

	//d.BuildNodesAndEdges(ctx, "document")
	negOne := -1

	if doc.Info != nil {
		d.Info = &Info{}
		d.Info.Parent = d
		d.Info.NodeParent = d
		d.Info.ValueNode = ExtractValueNodeForLowModel(doc.GoLow().Info)
		d.Info.KeyNode = ExtractKeyNodeForLowModel(doc.GoLow().Info)
		wg.Go(func() { d.Info.Walk(ctx, doc.Info) })
	}

	if doc.Servers != nil && len(doc.Servers) > 0 {
		serversNode := &Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "servers",
			Index:       d.Index,
			ValueNode:   ExtractValueNodeForLowModel(doc.GoLow().Servers),
			KeyNode:     ExtractKeyNodeForLowModel(doc.GoLow().Servers),
		}
		serversNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(serversNode.PathSegment),
			serversNode.PathSegment, nil, d, true, len(doc.Servers), &negOne)

		for i, server := range doc.Servers {
			srvr := server
			s := &Server{}
			s.Parent = d
			s.NodeParent = serversNode
			s.IsIndexed = true
			s.Index = &i
			s.ValueNode = server.GoLow().RootNode
			s.KeyNode = s.ValueNode
			d.Servers = append(d.Servers, s)
			wg.Go(func() {
				s.Walk(ctx, srvr)
			})
		}
	}

	if doc.Paths != nil && doc.Paths.PathItems != nil && doc.Paths.PathItems.Len() > 0 {
		p := &Paths{}
		p.Parent = d
		p.NodeParent = d
		p.ValueNode = ExtractValueNodeForLowModel(doc.GoLow().Paths)
		p.KeyNode = ExtractKeyNodeForLowModel(doc.GoLow().Paths)
		wg.Go(func() {
			p.Walk(ctx, doc.Paths)
		})
		d.Paths = p
	}

	if doc.Components != nil {
		c := &Components{}
		c.Parent = d
		c.NodeParent = d
		c.ValueNode = ExtractValueNodeForLowModel(doc.GoLow().Components)
		c.KeyNode = ExtractKeyNodeForLowModel(doc.GoLow().Components)
		wg.Go(func() { c.Walk(ctx, doc.Components) })
		d.Components = c
	}

	if doc.Security != nil {

		secNode := &Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "security",
			Index:       d.Index,
			ValueNode:   ExtractValueNodeForLowModel(doc.GoLow().Security),
			KeyNode:     ExtractKeyNodeForLowModel(doc.GoLow().Security),
		}
		secNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(secNode.PathSegment),
			secNode.PathSegment, nil, d, true, len(doc.Security), &negOne)

		for i, security := range doc.Security {
			sec := security
			s := &SecurityRequirement{}
			s.Parent = d
			s.NodeParent = secNode
			s.PathSegment = "security"
			s.IsIndexed = true
			s.Index = &i
			s.Value = sec
			s.ValueNode = doc.GoLow().Security.Value[i].ValueNode
			s.KeyNode = security.GoLow().RootNode

			// extract requirement name from the security requirement
			// and use it as the key for the security requirement
			label := ""
			for k, _ := range sec.Requirements.FromOldest() {
				label = k
				break
			}

			s.BuildNodesAndEdgesWithArray(ctx, label, "security", sec, s, false, 0, &i)

			// check if the security requirement exists
			if doc.Components != nil && doc.Components.SecuritySchemes != nil {
				for k, _ := range security.Requirements.FromOldest() {
					if css, ok := doc.Components.SecuritySchemes.Load(k); ok {
						// create an edge from the secNode to the security scheme
						if secNode.GetNode() != nil {
							sourceId := fmt.Sprintf("%s", secNode.GetNode().Id)
							target := fmt.Sprintf("%d", css.GoLow().GetRootNode().Line)
							secNode.BuildReferenceEdge(ctx, sourceId, target,
								fmt.Sprintf("#/components/securitySchemes/%s", k), "")
						}
					}
				}
			}
			s.Walk(ctx, sec)
			d.Security = append(d.Security, s)
		}
	}

	if doc.ExternalDocs != nil {
		ed := &ExternalDoc{}
		ed.Parent = d
		d.ValueNode = ExtractValueNodeForLowModel(doc.GoLow().ExternalDocs)
		d.KeyNode = ExtractKeyNodeForLowModel(doc.GoLow().ExternalDocs)
		ed.PathSegment = "externalDocs"
		ed.Value = doc.ExternalDocs
		d.ExternalDocs = ed
		drCtx.ObjectChan <- ed
	}

	if doc.Tags != nil {
		tagsNode := &Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "tags",
			Index:       d.Index,
			ValueNode:   ExtractValueNodeForLowModel(doc.GoLow().Tags),
			KeyNode:     ExtractKeyNodeForLowModel(doc.GoLow().Tags),
		}

		tagsNode.BuildNodesAndEdgesWithArray(ctx, cases.Title(language.English).String(tagsNode.PathSegment),
			tagsNode.PathSegment, nil, d, true, len(doc.Tags), &negOne)

		for i, tag := range doc.Tags {
			t := &Tag{}
			t.Parent = d
			t.NodeParent = tagsNode
			t.PathSegment = "tags"
			t.IsIndexed = true
			t.Index = &i
			t.Value = tag
			t.ValueNode = doc.GoLow().Tags.Value[i].ValueNode
			t.KeyNode = tag.GoLow().RootNode
			t.BuildNodesAndEdgesWithArray(ctx, tag.Name, "tag", tag, t, false, 0, &i)
			t.Walk(ctx, tag)
			d.Tags = append(d.Tags, t)
		}

	}

	if doc.Webhooks != nil {

		webhooks := orderedmap.New[string, *PathItem]()
		webhookNode := &Foundation{
			Parent:      d,
			NodeParent:  d,
			PathSegment: "webhooks",
			Index:       d.Index,
			ValueNode:   ExtractValueNodeForLowModel(doc.GoLow().Webhooks),
			KeyNode:     ExtractKeyNodeForLowModel(doc.GoLow().Webhooks),
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
	d.InstanceType = "document"
	d.PathSegment = "document"
	d.Node.Type = "document"
	d.Node.Hash = "document (root)"
	d.Node.IdHash = "root"
	d.Node.DrInstance = d
	d.buildRenderedNode()
	drCtx.ObjectChan <- d
	close(drCtx.ObjectChan)
}

// GetValue returns a pointer to its self, because it is the root and it is the value
func (d *Document) GetValue() any {
	return d.Document
}

func (d *Document) buildRenderedNode() {
	m := make(map[string]any)

	m["version"] = d.Document.Rolodex.GetConfig().SpecInfo.Version
	if d.Document.Paths != nil && d.Document.Paths.PathItems != nil {
		m["paths"] = d.Document.Paths.PathItems.Len()
		if d.Paths != nil && d.Paths.Node != nil {
			m["paths_idhash"] = d.Paths.Node.IdHash
		}
	}

	if d.Components != nil {
		c := 0
		if d.Components.PathItems != nil {
			c += d.Components.PathItems.Len()
		}
		if d.Components.Schemas != nil {
			c += d.Components.Schemas.Len()
		}
		if d.Components.Responses != nil {
			c += d.Components.Responses.Len()
		}
		if d.Components.Parameters != nil {
			c += d.Components.Parameters.Len()
		}
		if d.Components.Examples != nil {
			c += d.Components.Examples.Len()
		}
		if d.Components.RequestBodies != nil {
			c += d.Components.RequestBodies.Len()
		}
		if d.Components.Headers != nil {
			c += d.Components.Headers.Len()
		}
		if d.Components.SecuritySchemes != nil {
			c += d.Components.SecuritySchemes.Len()
		}
		if d.Components.Links != nil {
			c += d.Components.Links.Len()
		}
		if d.Components.Callbacks != nil {
			c += d.Components.Callbacks.Len()
		}
		m["components"] = c
		if d.Components.Node != nil {
			m["components_idhash"] = d.Components.Node.IdHash
		}
	}
	if d.Security != nil {
		m["security"] = len(d.Security)
		if d.Security[0].NodeParent != nil {
			if x, ok := d.Security[0].NodeParent.(Foundational); ok {
				if x.GetNode() != nil {
					m["security_idhash"] = x.GetNode().IdHash
				}
			}
		}
	}
	if d.Servers != nil && len(d.Servers) > 0 {
		m["servers"] = len(d.Servers)

		if d.Servers[0].NodeParent != nil {
			if x, ok := d.Servers[0].NodeParent.(Foundational); ok {
				if x.GetNode() != nil {
					m["servers_idhash"] = x.GetNode().IdHash
				}
			}
		}
	}
	if d.Tags != nil {
		m["tags"] = len(d.Tags)
		if d.Tags[0].NodeParent != nil {
			if x, ok := d.Tags[0].NodeParent.(Foundational); ok {
				if x.GetNode() != nil {
					m["tags_idhash"] = x.GetNode().IdHash
				}
			}
		}
	}

	if d.Document.GoLow().Extensions != nil {
		m["extensions"] = d.Document.GoLow().Extensions.Len()
	}
	d.Node.Instance = m
}

func (d *Document) GetSize() (height, width int) {
	width = 250
	height = HEIGHT * 2 // add another row for the label.
	items := []any{
		d.Servers,
		d.Paths,

		d.Components,
		d.Security,
		d.Tags,
	}
	for _, item := range items {
		height = AddChunkDefaultHeight(item, height)
	}
	if d.Document.Extensions != nil && d.Document.Extensions.Len() > 0 {
		height += HEIGHT
	}
	return height, width
}

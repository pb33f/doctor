// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"fmt"
	"slices"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libopenapi/jsonschema"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// NewSchemaGraph builds a tree for a schema or a collection and connects its indexed references.
func NewSchemaGraph(doc *jsonschema.Document) (*SourceGraph, error) {
	if doc == nil {
		return nil, fmt.Errorf("JSON Schema document required")
	}
	d := newSourceGraph()
	d.schema = doc
	d.schemaResources = make(map[*yaml.Node]*jsonschema.Resource, len(doc.Resources))
	var files []*jsonschema.Resource
	for _, resource := range doc.Resources {
		d.schemaResources[resource.Node] = resource
		if resource.Pointer == "" && resource != doc.Root {
			files = append(files, resource)
		}
	}
	if r := doc.Root; r != nil {
		d.Root = d.walk(r.Node, r.Source.Index, nil, "$", r.Label(), "document")
	} else {
		n := v3.NewSyntheticNode("root", "", "Schemas", "document")
		n.ArrayIndex, n.SourcePointer = -1, "#"
		f := &v3.Foundation{Node: n, PathSegment: n.Label, InstanceType: n.Type}
		f.JSONPathOnce.Do(func() { f.JSONPath = "$" })
		n.DrInstance = f
		d.Root, d.Nodes = n, []*v3.Node{n}
	}
	d.Root.DocumentKind = "jsonschema"
	slices.SortFunc(files, func(a, b *jsonschema.Resource) int { return strings.Compare(a.ID, b.ID) })
	for _, resource := range files {
		d.walk(resource.Node, resource.Source.Index, d.Root, "$", resource.Label(), "schema")
	}
	for _, ref := range doc.References {
		from, to := d.visited[ref.From], d.visited[ref.To]
		if from == nil || to == nil {
			return nil, fmt.Errorf("cannot locate schema reference %q", ref.Value)
		}
		// A reference may target an immediate child. Its edge also needs to
		// remain distinct from the containment edge with the same endpoints.
		edge := d.connect(from, to, ref.Value)
		edge.Id = "ref:" + from.Id
	}
	d.visited = nil
	d.schema = nil
	d.schemaResources = nil
	return d, nil
}

// SchemaChangeNode locates an edit in its authored side and source.
func (d *SourceGraph) SchemaChangeNode(change *wc.Change, modified bool) *v3.Node {
	if change == nil {
		return nil
	}
	ctx := change.Context
	if ctx == nil {
		return nil
	}
	source, line, column := ctx.OriginalDocument, ctx.OriginalLine, ctx.OriginalColumn
	if modified {
		source, line, column = ctx.ModifiedDocument, ctx.NewLine, ctx.NewColumn
	}
	if line == nil || column == nil {
		return nil
	}
	return d.locations[asyncPosition{source, *line, *column}].node
}

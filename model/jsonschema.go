// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"fmt"
	"strconv"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/jsonschema"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// NewSchemaGraph builds a native document tree and connects the indexed reference sites.
func NewSchemaGraph(doc *jsonschema.Document) (*SourceGraph, error) {
	if doc == nil || doc.Root == nil {
		return nil, fmt.Errorf("JSON Schema root required")
	}
	d := newSourceGraph()
	d.schema = doc
	r := doc.Root
	d.Root = d.walk(r.Node, r.Source.Index, nil, "$", r.Label(), "document")
	d.Root.DocumentKind = "jsonschema"
	for _, resource := range doc.Resources {
		if resource.Pointer != "" || resource == r {
			continue
		}
		d.walk(resource.Node, resource.Source.Index, d.Root, "schema["+strconv.Quote(resource.ID)+"]", resource.Label(), "schema")
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

// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"fmt"
	"slices"
	"strconv"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libopenapi/jsonschema"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// NewSchemaGraph builds a tree for a schema or a collection and connects its indexed references.
func NewSchemaGraph(doc *jsonschema.Document) (*SourceGraph, error) {
	return newSchemaGraph(doc, nil, nil)
}

// NewSchemaComparisonGraphs builds both source trees with shared IDs for matched
// resources, including resources that changed their canonical URI.
func NewSchemaComparisonGraphs(left, right *jsonschema.Document) (*SourceGraph, *SourceGraph, error) {
	r, err := NewSchemaGraph(right)
	if err != nil {
		return nil, nil, err
	}
	matches := jsonschema.MatchResources(left, right)
	l, err := newSchemaGraph(left, matches, inlineSchemaPaths(left, right, matches, r))
	if err != nil {
		r.Release()
		return nil, nil, err
	}
	return l, r, nil
}

type schemaGraphResource struct {
	path              string
	unmatchedEmbedded bool
}

func schemaResourceNodeID(id string) string {
	return "schema[" + strconv.Quote(id) + "]"
}

// When an inline schema acquires or drops its $id, both sides still describe
// the same occurrence. Use the modified graph ID at that slot in the old tree.
func inlineSchemaPaths(left, right *jsonschema.Document, matches map[*jsonschema.Resource]*jsonschema.Resource, graph *SourceGraph) map[string]string {
	if left == nil || len(matches) == len(left.Resources) && len(matches) == len(right.Resources) {
		return nil
	}
	unmatched := make(map[string]bool)
	for _, resource := range right.Resources {
		if resource.Pointer != "" {
			unmatched[schemaResourceNodeID(resource.ID)] = true
		}
	}
	for _, resource := range matches {
		delete(unmatched, schemaResourceNodeID(resource.ID))
	}
	oldNamed := slices.ContainsFunc(left.Resources, func(r *jsonschema.Resource) bool { return r.Pointer != "" && matches[r] == nil })
	if !oldNamed && len(unmatched) == 0 {
		return nil
	}
	paths := make(map[string]string)
	for _, n := range graph.Nodes {
		if oldNamed && n.Type == "schema" {
			paths[n.Id] = n.Id
		}
		if !unmatched[n.Id] {
			continue
		}
		parent := n.DrInstance.(v3.Foundational).GetParent().GetNode()
		path := parent.Id
		if path == "root" {
			path = "$"
		}
		if parent.IsArray {
			path += "[" + n.Label + "]"
		} else {
			path = jsonschema.PropertyPath(path, n.Label)
		}
		paths[path] = n.Id
	}
	return paths
}

func newSchemaGraph(doc *jsonschema.Document, matches map[*jsonschema.Resource]*jsonschema.Resource, inlinePaths map[string]string) (*SourceGraph, error) {
	if doc == nil {
		return nil, fmt.Errorf("JSON Schema document required")
	}
	d := newSourceGraph()
	d.schema = doc
	d.schemaInlinePaths = inlinePaths
	d.schemaResources = make(map[*yaml.Node]schemaGraphResource, len(doc.Resources))
	var files []*jsonschema.Resource
	for _, resource := range doc.Resources {
		id := resource.ID
		if matched := matches[resource]; matched != nil {
			id = matched.ID
		}
		path := "$"
		if resource != doc.Root {
			path = schemaResourceNodeID(id)
		}
		d.schemaResources[resource.Node] = schemaGraphResource{path: path, unmatchedEmbedded: resource.Pointer != "" && matches[resource] == nil}
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
		if ref.Keyword == "$dynamicRef" {
			edge.Id = "ref:$dynamicRef:" + from.Id
		}
	}
	d.visited = nil
	d.schema = nil
	d.schemaResources = nil
	d.schemaInlinePaths = nil
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

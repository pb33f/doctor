// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	dr "github.com/pb33f/doctor/model"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/jsonschema"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// SchemaResult owns the two source graphs and a prepared native change tree.
type SchemaResult struct {
	Changerator *Changerator
	Changes     *wc.SchemaChanges
	Left, Right *dr.SourceGraph
}

// CompareJSONSchema attaches each authored edit to the shared report and graph model.
// It returns a nil result and a nil error when the schemas are equivalent.
//
// rules holds explicit overrides only. A rule replaces the direction-aware verdict
// for its keyword, so a configuration merged with the defaults marks widening
// edits as breaking.
func CompareJSONSchema(left, right *jsonschema.Document, rules *wc.BreakingRulesConfig) (*SchemaResult, error) {
	changes, err := jsonschema.Compare(left, right, rules)
	if err != nil || changes == nil {
		return nil, err
	}
	l, r, err := dr.NewSchemaComparisonGraphs(left, right)
	if err != nil {
		return nil, err
	}
	result := &SchemaResult{Changes: changes, Left: l, Right: r}
	ctr := NewChangerator(&ChangeratorConfig{})
	ctr.SchemaLabels = make(map[string]string, len(right.Resources))
	for _, side := range []*jsonschema.Document{left, right} {
		for _, resource := range side.Resources {
			ctr.SchemaLabels[resource.ID] = resource.Label()
		}
	}
	ctr.ChangeReport, ctr.Changes = changes, changes.GetAllChanges()
	ctr.ChangedNodes, ctr.ChangedEdges = r.Nodes, r.Edges
	byID := make(map[string]*v3.Node, len(r.Nodes))
	for _, n := range r.Nodes {
		byID[n.Id] = n
	}
	for _, change := range ctr.Changes {
		n := schemaChangeNode(l, r, byID, change)
		n.AppendChange(ChangeList{change})
		n.RenderedChanges = append(n.RenderedChanges, change)
		n.CleanedChanged = append(n.CleanedChanged, change)
	}
	retainRemovedNodes(ctr, l, r, byID)
	result.Changerator = ctr
	return result, nil
}

// schemaChangeNode returns the modified-side node that owns an edit, or the
// original-side node for a removal. An edit whose coordinates match no node stays
// in the report on its resource, or on the document.
func schemaChangeNode(l, r *dr.SourceGraph, byID map[string]*v3.Node, change *wc.Change) *v3.Node {
	if n := r.SchemaChangeNode(change, true); n != nil {
		return n
	}
	if n := l.SchemaChangeNode(change, false); n != nil {
		if current := byID[n.Id]; current != nil {
			return current
		}
		return n
	}
	if n := byID[dr.SchemaResourceNodeID(change.SchemaResource)]; n != nil {
		return n
	}
	return r.Root
}

// Release drops the graphs and their references to parsed sources.
func (r *SchemaResult) Release() {
	if r != nil {
		r.Left.Release()
		r.Right.Release()
		*r = SchemaResult{}
	}
}

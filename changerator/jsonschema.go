// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"fmt"

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
func CompareJSONSchema(left, right *jsonschema.Document, rules *wc.BreakingRulesConfig) (*SchemaResult, error) {
	changes, err := jsonschema.Compare(left, right, rules)
	if err != nil || changes == nil {
		return nil, err
	}
	l, err := dr.NewSchemaGraph(left)
	if err != nil {
		return nil, err
	}
	r, err := dr.NewSchemaGraph(right)
	if err != nil {
		l.Release()
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
		n := r.SchemaChangeNode(change, true)
		if n == nil {
			n = l.SchemaChangeNode(change, false)
			if n != nil && byID[n.Id] != nil {
				n = byID[n.Id]
			}
		}
		if n == nil {
			result.Release()
			return nil, fmt.Errorf("cannot locate JSON Schema change %s %s", change.SchemaResource, change.Path)
		}
		n.AppendChange(ChangeList{change})
		n.RenderedChanges = append(n.RenderedChanges, change)
		n.CleanedChanged = append(n.CleanedChanged, change)
	}
	retainRemovedNodes(ctr, l, r, byID)
	result.Changerator = ctr
	return result, nil
}

// Release drops the graphs and their references to parsed sources.
func (r *SchemaResult) Release() {
	if r != nil {
		r.Left.Release()
		r.Right.Release()
		*r = SchemaResult{}
	}
}

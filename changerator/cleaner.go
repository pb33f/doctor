// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"fmt"
	"github.com/mitchellh/mapstructure"
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
	"slices"
)

func (t *Changerator) Cleaneromatic(nodes []*v3.Node) []*v3.Node {
	seen := make(map[string]*model.Change)
	var clean []*v3.Node
	if len(nodes) > 0 {
		for i := range nodes {
			if len(nodes[i].GetChanges()) > 0 {
				c := nodes[i].GetChanges()
				for _, cw := range c {
					for _, ch := range cw.GetAllChanges() {
						ctx := ch.Context
						var hash string
						if ctx != nil {
							hash = fmt.Sprintf("%d:%d:%d:%d", ctx.OriginalColumn, ctx.NewColumn, ctx.OriginalLine, ctx.OriginalColumn)
						}
						_, ok := seen[hash]

						if hash != "" && ok {
							continue // seen
						}

						clean = append(clean, nodes[i])
					}
				}
			}
		}
	}
	return clean
}

func (t *Changerator) TurnOnChangedTree(root *v3.Node) {
	root.RenderProps = true
	root.RenderChanges = true
	root.RenderProblems = false
	for _, n := range root.Children {
		t.TurnOnChangedTree(n)
	}
}

func (t *Changerator) PrepareNodesForGraph(root *v3.Node) {
	root.RenderProps = true
	root.RenderChanges = true
	root.RenderProblems = false
	for _, n := range root.Children {
		t.TurnOnChangedTree(n)
	}
}

func (t *Changerator) BuildNodeChangeTree(root *v3.Node) {
	t.Changerify([]*v3.Node{root})

	seen := make(map[string]bool)
	var cleanedNodes []*v3.Node

	cleanedEdges := make(map[string]*v3.Edge)
	for _, n := range t.tmpNodes {
		if _, ok := seen[n.Id]; !ok {
			for _, e := range t.Config.Doctor.Edges {
				if slices.Contains(e.Targets, n.Id) && slices.Contains(e.Sources, n.ParentId) {
					if _, kk := cleanedEdges[e.Id]; !kk {
						cleanedEdges[e.Id] = e
					}
				}
			}
			seen[n.Id] = true
			cleanedNodes = append(cleanedNodes, n)
		}
	}
	var chEdges []*v3.Edge
	var dupes []*v3.Edge
	seenEdges := make(map[string]*v3.Edge)

	for _, e := range cleanedEdges {
		if e != nil {

			// check if there is already and edge with the same target and source
			chk := fmt.Sprintf("%s:%s", e.Targets[0], e.Sources[0])
			if _, ok := seenEdges[chk]; !ok {
				seenEdges[chk] = e
				chEdges = append(chEdges, e)
			} else {
				dupes = append(dupes, e)
			}
		}
	}

	if len(dupes) > 0 {

		for _, du := range dupes {
			for i, e := range chEdges {
				if e.Sources[0] == du.Sources[0] && e.Targets[0] == du.Targets[0] {
					if du.Ref != "" && chEdges[i].Ref == "" {
						// replace the edge if it has a reference.
						chEdges[i] = du
					}
					break
				}
			}
		}
	}

	t.mutex.Lock()
	t.ChangedEdges = chEdges
	t.ChangedNodes = cleanedNodes
	t.mutex.Unlock()
}

func (t *Changerator) Changerify(n any) []*v3.Node {
	if nodes, ok := n.([]*v3.Node); ok {
		var filtered []*v3.Node
		for i := range nodes {
			// Process children recursively first
			if len(nodes[i].Children) > 0 {
				nodes[i].Children = t.Changerify(nodes[i].Children)
			}

			nodes[i].RenderProblems = false

			// Check if the current node has changes or rendered changes
			hasOwnChanges := len(nodes[i].GetChanges()) > 0 || len(nodes[i].RenderedChanges) > 0
			hasChildChanges := len(nodes[i].Children) > 0

			// Include node only if it has changes or children with changes
			if hasOwnChanges || hasChildChanges {
				if nodes[i].DrInstance != nil {
					t.tmpEdges = append(t.tmpEdges, nodes[i].DrInstance.(v3.Foundational).GetEdges()...)
				}
				nodes[i].RenderChanges = true
				nodes[i].SetInstance(nil)
				nodes[i].DrInstance = nil
				nodes[i].RenderProps = true
				filtered = append(filtered, nodes[i])
				t.tmpNodes = append(t.tmpNodes, nodes[i])

			}
		}
		return filtered
	}

	// Handle alternate type ([]any) from your original implementation if required
	if uNodes, ok := n.([]any); ok {
		var rn []*v3.Node
		for i := range uNodes {
			var b v3.Node
			if err := mapstructure.Decode(uNodes[i], &b); err != nil {
				continue
			}

			// Process children recursively
			if len(b.Children) > 0 {
				b.Children = t.Changerify(b.Children)
			}

			// Check if node has changes or child changes
			hasOwnChanges := len(b.GetChanges()) > 0 || len(b.RenderedChanges) > 0
			hasChildChanges := len(b.Children) > 0

			if hasOwnChanges || hasChildChanges {
				b.RenderChanges = true
				b.RenderProps = true
				b.SetInstance(nil)
				b.DrInstance = nil
				rn = append(rn, &b)
			}
		}
		return rn
	}

	return nil
}

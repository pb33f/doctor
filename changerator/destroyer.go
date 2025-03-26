// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import v3 "github.com/pb33f/doctor/model/high/v3"

func (t *Changerator) Prepareotron(nodes []*v3.Node) {
	if len(nodes) > 0 {
		for _, ch := range nodes {
			t.destroy(ch)
		}
	}
}

func (t *Changerator) destroy(node *v3.Node) {
	if node.Instance != nil {
		if n, ok := node.Instance.(*v3.Node); ok {
			t.destroy(n)
		}
	}
	node.Instance = nil
	node.DrInstance = nil
	node.RenderChanges = true
	node.RenderProps = true
}

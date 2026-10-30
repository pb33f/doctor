// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"unicode/utf8"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libopenapi/what-changed/model"
)

// PrepareChangeViewGraph enriches the node tree with change-view data.
// It deduplicates node changes, computes subtree change summaries,
// builds child-change summary rows, and recalculates node dimensions
// for change-view rendering.
//
// Call this after BuildNodeChangeTree() and before JSON serialization.
func (t *Changerator) PrepareChangeViewGraph(root *v3.Node) {
	t.DeduplicateAllNodes(root)
	pruneEmptyNodes(root)
	t.rebuildChangedNodes(root)
	computeSubtreeChanges(root)
	buildChildChangeSummaries(root)
	recalculateChangeViewDimensions(root)
}

// pruneEmptyNodes removes nodes that have no changes and no changed
// children. This is needed because DeduplicateAllNodes may strip
// changes from nodes that Changerify originally kept, leaving them
// as empty shells in the tree.
func pruneEmptyNodes(node *v3.Node) {
	var kept []*v3.Node
	for _, child := range node.Children {
		pruneEmptyNodes(child)
		if nodeHasOwnChanges(child) || len(child.Children) > 0 {
			kept = append(kept, child)
		}
	}
	node.Children = kept
}

// rebuildChangedNodes reconstructs the flat ChangedNodes list from the
// pruned tree, since pruneEmptyNodes may have removed nodes that were
// still referenced in the original list.
func (t *Changerator) rebuildChangedNodes(root *v3.Node) {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	var nodes []*v3.Node
	collectNodes(root, &nodes)
	t.ChangedNodes = nodes
}

func collectNodes(node *v3.Node, out *[]*v3.Node) {
	*out = append(*out, node)
	for _, child := range node.Children {
		collectNodes(child, out)
	}
}

// computeSubtreeChanges recursively computes aggregated change counts
// for each node's subtree (own changes + all descendants).
//
// This function reads node.Children and node.Changes/RenderedChanges directly
// (without the node mutex) because it runs sequentially after BuildNodeChangeTree
// with no concurrent access to the node tree.
func computeSubtreeChanges(node *v3.Node) *v3.ChangeSummary {
	summary := &v3.ChangeSummary{}

	// Recurse into children first (bottom-up).
	for _, child := range node.Children {
		childSummary := computeSubtreeChanges(child)
		summary.Additions += childSummary.Additions
		summary.Modifications += childSummary.Modifications
		summary.Removals += childSummary.Removals
		summary.Breaking += childSummary.Breaking
	}

	// Count this node's own changes. Use RenderedChanges if present
	// (takes priority in MarshalJSON), otherwise use Changes via
	// GetPropertyChanges() (post-deduplication).
	for _, ch := range nodeOwnChanges(node) {
		classifyChange(ch, summary)
	}

	summary.Total = summary.Additions + summary.Modifications + summary.Removals
	node.SubtreeChanges = summary
	return summary
}

// nodeOwnChanges returns the flattened changes for a node, matching what
// MarshalJSON serializes as "timeline". RenderedChanges take priority.
func nodeOwnChanges(node *v3.Node) []*model.Change {
	if node.RenderedChanges != nil {
		return node.RenderedChanges
	}
	if node.Changes != nil {
		changes := make([]*model.Change, 0, len(node.Changes)*4)
		for _, ch := range node.Changes {
			changes = append(changes, ch.GetPropertyChanges()...)
		}
		return changes
	}
	return nil
}

// classifyChange categorizes a single change and increments the summary.
func classifyChange(ch *model.Change, summary *v3.ChangeSummary) {
	switch ch.ChangeType {
	case model.PropertyAdded, model.ObjectAdded:
		summary.Additions++
	case model.PropertyRemoved, model.ObjectRemoved:
		summary.Removals++
	case model.Modified:
		summary.Modifications++
	}
	if ch.Breaking {
		summary.Breaking++
	}
}

// buildChildChangeSummaries creates ChildChangeSummary entries for each
// child node that has changes in its subtree.
func buildChildChangeSummaries(node *v3.Node) {
	for _, child := range node.Children {
		if child.SubtreeChanges != nil && child.SubtreeChanges.Total > 0 {
			// Changes intentionally aliases child.SubtreeChanges (shared pointer).
			// Both are read-only after construction.
			node.ChildChangeSummaries = append(node.ChildChangeSummaries, &v3.ChildChangeSummary{
				Label:   child.Label,
				Type:    child.Type,
				IdHash:  child.IdHash,
				NodeId:  child.Id,
				Changes: child.SubtreeChanges,
			})
		}
		buildChildChangeSummaries(child)
	}
}

// recalculateChangeViewDimensions sets node Height and Width for
// change-view rendering where only changed children are visible.
func recalculateChangeViewDimensions(node *v3.Node) {
	h := v3.HEIGHT // header row
	h += len(node.ChildChangeSummaries) * v3.HEIGHT

	if node.GetExtensionCount() > 0 {
		h += v3.HEIGHT
	}
	// Change annotations sit below the card, outside its layout box.
	node.Height = h

	w := v3.WIDTH

	// Account for the header label width (icon + label + dependent control button + padding).
	label := node.Label
	if node.Type == "document" {
		label = "OpenAPI Document"
		if node.Label == "AsyncAPI" {
			label = "AsyncAPI Document"
		}
	}
	headerWidth := utf8.RuneCountInString(label)*v3.CHAR_WIDTH + 90 + changeViewActionWidth(node)
	if headerWidth > w {
		w = headerWidth
	}

	for _, cs := range node.ChildChangeSummaries {
		// Child rows contain a chevron, icon, label and padding.
		rowWidth := utf8.RuneCountInString(cs.Label)*v3.CHAR_WIDTH + 65
		if rowWidth > w {
			w = rowWidth
		}
	}
	for _, child := range node.Children {
		if child.SubtreeChanges != nil && child.SubtreeChanges.Total > 0 {
			if actionWidth := changeViewActionWidth(child); actionWidth > 0 {
				rowWidth := utf8.RuneCountInString(child.Label)*v3.CHAR_WIDTH + 65 + actionWidth
				if rowWidth > w {
					w = rowWidth
				}
			}
		}
	}
	if w > v3.MAX_WIDTH {
		w = v3.MAX_WIDTH
	}
	node.Width = w

	for _, child := range node.Children {
		recalculateChangeViewDimensions(child)
	}
}

func changeViewActionWidth(node *v3.Node) int {
	if node.Type != "operation" {
		return 0
	}
	var action string
	switch instance := node.Instance.(type) {
	case map[string]interface{}:
		action, _ = instance["action"].(string)
	case *yaml.Node:
		if instance != nil && instance.Kind == yaml.MappingNode {
			for i := 0; i+1 < len(instance.Content); i += 2 {
				if instance.Content[i].Value == "action" {
					action = instance.Content[i+1].Value
					break
				}
			}
		}
	}
	if action == "send" || action == "receive" {
		return len(action)*v3.CHAR_WIDTH + 24 // badge padding and label gap
	}
	return 0
}

// nodeHasOwnChanges checks whether a node has its own changes (not just
// inherited from children). Mirrors what MarshalJSON checks for "timeline".
func nodeHasOwnChanges(node *v3.Node) bool {
	if len(node.RenderedChanges) > 0 {
		return true
	}
	for _, ch := range node.Changes {
		if len(ch.GetPropertyChanges()) > 0 {
			return true
		}
	}
	return false
}

// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	v3 "github.com/pb33f/doctor/model/high/v3"
	whatChanged "github.com/pb33f/libopenapi/what-changed"
	"github.com/pb33f/libopenapi/what-changed/model"
)

// ChangeDeduplicator provides deduplication services for Doctor's node-based graph visualization.
// It ensures that the same change is not reported multiple times when it appears at different
// levels of the document structure (e.g., at both the path level and operation level).
//
// IMPORTANT: This deduplicator is used for node-based change tree visualization and graph generation.
// It is NOT used by the markdown report generator, which works directly with the already-deduplicated
// what-changed DocumentChanges model.
//
// The what-changed library (libopenapi/what-changed) is the source of truth for change detection
// and deduplication. This deduplicator exists only to handle the Doctor's node tree representation,
// which can create duplicates when distributing changes from the what-changed model into the node hierarchy.
//
// Note: Consider this component for deprecation once node-based visualization can be refactored
// to work directly with DocumentChanges instead of the node tree.
type ChangeDeduplicator struct {
	seen          map[string]*dedupedChange
	changesByNode map[string][]*model.Change
	hierarchyMap  map[string]string // child -> parent ID mapping
}

// dedupedChange tracks metadata about a deduplicated change
type dedupedChange struct {
	change       *model.Change
	lowestNodeId string   // The most specific (deepest) node where this change appears
	depth        int      // Depth in the hierarchy (higher = more specific)
	nodePath     []string // Full hierarchy path from root to node
}

// NewChangeDeduplicator creates a new deduplicator instance
func NewChangeDeduplicator() *ChangeDeduplicator {
	return &ChangeDeduplicator{
		seen:          make(map[string]*dedupedChange),
		changesByNode: make(map[string][]*model.Change),
		hierarchyMap:  make(map[string]string),
	}
}

// GenerateChangeHash creates a unique hash for a change based on its semantic content.
// This hash is used to identify duplicate changes across different nodes in the hierarchy.
func (d *ChangeDeduplicator) GenerateChangeHash(change *model.Change) string {
	h := sha256.New()

	h.Write([]byte(fmt.Sprintf("%s:%d:%s:%s",
		change.Property,
		change.ChangeType,
		change.Original,
		change.New)))

	if change.Context != nil {
		if change.Context.NewLine != nil && change.Context.NewColumn != nil {
			h.Write([]byte(fmt.Sprintf(":%d:%d",
				*change.Context.NewLine,
				*change.Context.NewColumn)))
		}
	}

	return hex.EncodeToString(h.Sum(nil))
}

// RegisterNode registers a node and its parent in the hierarchy map.
// This allows the deduplicator to understand the document structure.
func (d *ChangeDeduplicator) RegisterNode(nodeId, parentId string) {
	if parentId != "" {
		d.hierarchyMap[nodeId] = parentId
	}
}

// CalculateDepth calculates the depth of a node in the hierarchy.
// Deeper nodes are more specific and preferred for change attribution.
func (d *ChangeDeduplicator) CalculateDepth(nodeId string) int {
	depth := 0
	current := nodeId
	for {
		parent, exists := d.hierarchyMap[current]
		if !exists || parent == "" {
			break
		}
		depth++
		current = parent
	}
	return depth
}

// BuildNodePath constructs the full path from root to the given node.
func (d *ChangeDeduplicator) BuildNodePath(nodeId string) []string {
	var path []string
	current := nodeId
	for {
		path = append([]string{current}, path...)
		parent, exists := d.hierarchyMap[current]
		if !exists || parent == "" {
			break
		}
		current = parent
	}
	return path
}

// ProcessChange processes a single change for deduplication.
// Returns true if the change is unique (should be kept), false if it's a duplicate.
// When a duplicate is found at a more specific level, the tracking is updated to prefer
// the more specific node.
func (d *ChangeDeduplicator) ProcessChange(change *model.Change, nodeId string) bool {
	hash := d.GenerateChangeHash(change)
	depth := d.CalculateDepth(nodeId)
	nodePath := d.BuildNodePath(nodeId)

	if existing, exists := d.seen[hash]; exists {
		if depth > existing.depth {
			oldNodeId := existing.lowestNodeId
			if oldChanges, ok := d.changesByNode[oldNodeId]; ok {
				filtered := make([]*model.Change, 0, len(oldChanges))
				for _, c := range oldChanges {
					if d.GenerateChangeHash(c) != hash {
						filtered = append(filtered, c)
					}
				}
				d.changesByNode[oldNodeId] = filtered
			}

			existing.lowestNodeId = nodeId
			existing.depth = depth
			existing.nodePath = nodePath

			d.changesByNode[nodeId] = append(d.changesByNode[nodeId], change)
		}
		return false
	}

	d.seen[hash] = &dedupedChange{
		change:       change,
		lowestNodeId: nodeId,
		depth:        depth,
		nodePath:     nodePath,
	}
	d.changesByNode[nodeId] = append(d.changesByNode[nodeId], change)
	return true
}

// GetUniqueChangesForNode returns deduplicated changes for a specific node.
// This only includes changes that are uniquely attributed to this node (not duplicates).
func (d *ChangeDeduplicator) GetUniqueChangesForNode(nodeId string) []*model.Change {
	return d.changesByNode[nodeId]
}

// GetAllUniqueChanges returns all unique changes across the entire document.
func (d *ChangeDeduplicator) GetAllUniqueChanges() []*model.Change {
	changes := make([]*model.Change, 0, len(d.seen))
	seen := make(map[string]bool, len(d.seen))

	for _, dc := range d.seen {
		hash := d.GenerateChangeHash(dc.change)
		if !seen[hash] {
			changes = append(changes, dc.change)
			seen[hash] = true
		}
	}
	return changes
}

// DeduplicateNodeChanges removes duplicate changes from a node's change sets.
// This modifies the node in place, keeping only unique changes.
func (d *ChangeDeduplicator) DeduplicateNodeChanges(node *v3.Node) {
	if node == nil || node.Changes == nil || len(node.Changes) == 0 {
		return
	}

	d.RegisterNode(node.Id, node.ParentId)

	uniqueHashes := make(map[string]bool)

	for _, changeSet := range node.Changes {
		for _, change := range changeSet.GetAllChanges() {
			hash := d.GenerateChangeHash(change)
			if d.ProcessChange(change, node.Id) {
				uniqueHashes[hash] = true
			}
		}
	}

	var cleanedChanges []whatChanged.Changed
	for _, changeSet := range node.Changes {
		hasUniqueChanges := false
		for _, change := range changeSet.GetAllChanges() {
			hash := d.GenerateChangeHash(change)
			if dc, exists := d.seen[hash]; exists && dc.lowestNodeId == node.Id {
				hasUniqueChanges = true
				break
			}
		}

		if hasUniqueChanges {
			cleanedChanges = append(cleanedChanges, changeSet)
		}
	}

	node.Changes = cleanedChanges
}

// GetChangeHash is a public convenience function to generate a hash for a change.
func GetChangeHash(change *model.Change) string {
	d := NewChangeDeduplicator()
	return d.GenerateChangeHash(change)
}

// GetStatistics returns statistics about deduplicated changes.
func (d *ChangeDeduplicator) GetStatistics() *ChangeStatistics {
	stats := &ChangeStatistics{}

	for _, change := range d.GetAllUniqueChanges() {
		switch change.ChangeType {
		case model.Modified:
			stats.Modifications++
		case model.ObjectRemoved, model.PropertyRemoved:
			stats.Deletions++
		case model.ObjectAdded, model.PropertyAdded:
			stats.Additions++
		}
	}

	return stats
}

// Reset clears all deduplication state.
// Useful for reusing the same deduplicator instance.
func (d *ChangeDeduplicator) Reset() {
	d.seen = make(map[string]*dedupedChange)
	d.changesByNode = make(map[string][]*model.Change)
	d.hierarchyMap = make(map[string]string)
}

// GetDuplicateCount returns the total number of duplicate changes that were filtered out.
func (d *ChangeDeduplicator) GetDuplicateCount() int {
	totalProcessed := 0
	for _, changes := range d.changesByNode {
		totalProcessed += len(changes)
	}
	uniqueCount := len(d.seen)

	return totalProcessed - uniqueCount
}

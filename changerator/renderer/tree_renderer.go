// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package renderer

import (
	"fmt"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/terminal"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
)

// TreeConfig configures the tree renderer output
type TreeConfig struct {
	UseEmojis       bool                  // true = markdown mode (🔀➕➖), false = ASCII ([M][+][-])
	ShowLineNumbers bool                  // Include (line:col) after property names
	ShowStatistics  bool                  // Show (N changes, M breaking) on branch nodes
	ColorScheme     terminal.ColorScheme  // Optional color scheme for terminal output (nil = no color)
}

// TreeRenderer renders a v3.Node tree as an ASCII tree string
type TreeRenderer struct {
	config     *TreeConfig
	root       *v3.Node
	symbols    ChangeSymbols
	colors     terminal.ColorScheme   // color scheme for terminal output
	statsCache map[*v3.Node]nodeStats // cache for statistics (avoids O(n²) recursion)
}

// nodeStats holds cached change statistics for a node subtree
type nodeStats struct {
	total    int
	breaking int
}

// NewTreeRenderer creates a new tree renderer for the given node tree
func NewTreeRenderer(root *v3.Node, config *TreeConfig) *TreeRenderer {
	if config == nil {
		config = &TreeConfig{
			UseEmojis:       true,
			ShowLineNumbers: true,
		}
	}

	// default to no color if ColorScheme is nil
	colors := config.ColorScheme
	if colors == nil {
		colors = terminal.NoColorScheme{}
	}

	return &TreeRenderer{
		config:     config,
		root:       root,
		symbols:    GetSymbols(config.UseEmojis),
		colors:     colors,
		statsCache: make(map[*v3.Node]nodeStats),
	}
}

// Render generates the ASCII tree string representation
func (tr *TreeRenderer) Render() string {
	if tr.root == nil {
		return ""
	}

	// pre-compute statistics if enabled (single pass instead of O(n²))
	if tr.config.ShowStatistics {
		tr.computeAllStats(tr.root)
	}

	var sb strings.Builder

	// start rendering from the root's children (skip the document root itself)
	children := tr.root.Children
	for i, child := range children {
		isLast := i == len(children)-1
		tr.renderNode(&sb, child, "", isLast)
	}

	return sb.String()
}

// computeAllStats pre-computes statistics for all nodes in the tree (single pass)
func (tr *TreeRenderer) computeAllStats(node *v3.Node) nodeStats {
	if node == nil {
		return nodeStats{}
	}

	// check cache first
	if cached, exists := tr.statsCache[node]; exists {
		return cached
	}

	stats := nodeStats{}

	// count this node's changes
	for _, ch := range node.GetChanges() {
		if ch != nil {
			for _, c := range ch.GetPropertyChanges() {
				stats.total++
				if c.Breaking {
					stats.breaking++
				}
			}
		}
	}

	// recursively add children's stats (bottom-up)
	for _, child := range node.Children {
		childStats := tr.computeAllStats(child)
		stats.total += childStats.total
		stats.breaking += childStats.breaking
	}

	// cache result
	tr.statsCache[node] = stats
	return stats
}

// renderNode recursively renders a node and its children
func (tr *TreeRenderer) renderNode(sb *strings.Builder, node *v3.Node, prefix string, isLast bool) {
	if node == nil {
		return
	}

	label := tr.getNodeLabel(node)
	propertyChanges := tr.getPropertyChanges(node)
	totalItems := len(propertyChanges) + len(node.Children)

	branchSymbol := getBranchSymbol(isLast, totalItems > 0)

	sb.WriteString(prefix)
	sb.WriteString(tr.colors.TreeBranch(branchSymbol))
	sb.WriteString(label)

	if tr.config.ShowStatistics {
		stats := tr.statsCache[node] // O(1) lookup from pre-computed cache
		if stats.total > 0 {
			var statsText string
			if stats.breaking > 0 {
				statsText = fmt.Sprintf(" (%d changes, %d breaking)", stats.total, stats.breaking)
			} else {
				statsText = fmt.Sprintf(" (%d changes)", stats.total)
			}
			sb.WriteString(tr.colors.Statistics(statsText))
		}
	}

	sb.WriteString("\n")

	childPrefix := prefix + tr.colors.TreeBranch(TreeEmpty)
	if !isLast {
		childPrefix = prefix + tr.colors.TreeBranch(TreeVertical)
	}

	for i, change := range propertyChanges {
		isLastItem := i == len(propertyChanges)-1 && len(node.Children) == 0
		tr.renderChange(sb, change, childPrefix, isLastItem)
	}

	for i, child := range node.Children {
		isLastChild := i == len(node.Children)-1
		tr.renderNode(sb, child, childPrefix, isLastChild)
	}
}

// getBranchSymbol returns the appropriate branch symbol based on position and children
func getBranchSymbol(isLast bool, hasChildren bool) string {
	if hasChildren {
		if isLast {
			return TreeLastBranchDown
		}
		return TreeBranchDown
	}
	if isLast {
		return TreeLastBranch
	}
	return TreeBranch
}

// renderChange renders a single property change as a leaf node
func (tr *TreeRenderer) renderChange(sb *strings.Builder, change *wcModel.Change, prefix string, isLast bool) {
	if change == nil {
		return
	}

	branchSymbol := getBranchSymbol(isLast, false)
	changeSymbol := tr.getChangeSymbol(change)

	sb.WriteString(prefix)
	sb.WriteString(tr.colors.TreeBranch(branchSymbol))
	sb.WriteString(tr.colorizeChangeSymbol(change, changeSymbol))
	sb.WriteString(" ")
	sb.WriteString(change.Property)

	if tr.config.ShowLineNumbers {
		line, col := tr.getChangeLocation(change)
		if line > 0 {
			locationText := fmt.Sprintf(" (%d:%d)", line, col)
			sb.WriteString(tr.colors.LocationInfo(locationText))
		}
	}

	if change.Breaking {
		sb.WriteString(tr.colors.Breaking(tr.symbols.Breaking))
	}

	sb.WriteString("\n")
}

// colorizeChangeSymbol applies the appropriate color based on change type
func (tr *TreeRenderer) colorizeChangeSymbol(change *wcModel.Change, symbol string) string {
	switch change.ChangeType {
	case wcModel.Modified:
		return tr.colors.Modification(symbol)
	case wcModel.PropertyAdded, wcModel.ObjectAdded:
		return tr.colors.Addition(symbol)
	case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
		return tr.colors.Removal(symbol)
	default:
		return tr.colors.Modification(symbol)
	}
}

// getNodeLabel returns the display label for a node
func (tr *TreeRenderer) getNodeLabel(node *v3.Node) string {
	if node.Label != "" {
		return node.Label
	}
	if node.Type != "" {
		return node.Type
	}
	return "Unknown"
}

// getChangeSymbol returns the appropriate symbol for a change type
func (tr *TreeRenderer) getChangeSymbol(change *wcModel.Change) string {
	switch change.ChangeType {
	case wcModel.Modified:
		return tr.symbols.Modified
	case wcModel.PropertyAdded, wcModel.ObjectAdded:
		return tr.symbols.Added
	case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
		return tr.symbols.Removed
	default:
		return tr.symbols.Modified
	}
}

// getChangeLocation returns the line and column for a change
// Uses NewLine/NewColumn for adds/modifies, OriginalLine/OriginalColumn for removes
func (tr *TreeRenderer) getChangeLocation(change *wcModel.Change) (int, int) {
	if change.Context == nil {
		return 0, 0
	}

	switch change.ChangeType {
	case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
		line := 0
		col := 0
		if change.Context.OriginalLine != nil {
			line = *change.Context.OriginalLine
		}
		if change.Context.OriginalColumn != nil {
			col = *change.Context.OriginalColumn
		}
		return line, col
	default:
		line := 0
		col := 0
		if change.Context.NewLine != nil {
			line = *change.Context.NewLine
		}
		if change.Context.NewColumn != nil {
			col = *change.Context.NewColumn
		}
		return line, col
	}
}

// getPropertyChanges extracts all property changes from a node
func (tr *TreeRenderer) getPropertyChanges(node *v3.Node) []*wcModel.Change {
	var changes []*wcModel.Change

	for _, ch := range node.GetChanges() {
		if ch != nil {
			changes = append(changes, ch.GetPropertyChanges()...)
		}
	}

	return changes
}


// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package renderer

import (
	"fmt"
	"sort"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/doctor/terminal"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
)

type semanticNodeStats struct {
	total    int
	breaking int
}

type SemanticLeaf struct {
	key        string
	node       *v3.Node
	change     *wcModel.Change
	rawChanges []*wcModel.Change
	label      string
	text       string
	changeType int
	breaking   bool
	line       int
	column     int
}

type semanticRenderModel struct {
	root            *v3.Node
	parentByNode    map[*v3.Node]*v3.Node
	depthByNode     map[*v3.Node]int
	ownerByKey      map[string]*v3.Node
	ownedKeysByNode map[*v3.Node][]string
	firstByKey      map[string]*wcModel.Change
	rawByKey        map[string][]*wcModel.Change
	statsByNode     map[*v3.Node]semanticNodeStats
	leavesByKey     map[string]*SemanticLeaf
}

// SemanticTreeRenderer renders a semantic change tree using grouped change keys
// instead of raw node-distributed leaves.
type SemanticTreeRenderer struct {
	config  *TreeConfig
	root    *v3.Node
	symbols ChangeSymbols
	colors  terminal.ColorScheme
	model   *semanticRenderModel
}

// NewSemanticTreeRenderer creates a semantic tree renderer for the given node tree
// and raw change list. Changes are grouped by JSONPath + property while retaining
// grouped before/after fidelity for display.
func NewSemanticTreeRenderer(root *v3.Node, allChanges []*wcModel.Change, config *TreeConfig) *SemanticTreeRenderer {
	if config == nil {
		config = &TreeConfig{
			UseEmojis:       true,
			ShowLineNumbers: true,
			ShowStatistics:  true,
		}
	}
	colors := config.ColorScheme
	if colors == nil {
		colors = terminal.NoColorScheme{}
	}
	return &SemanticTreeRenderer{
		config:  config,
		root:    root,
		symbols: GetSymbols(config.UseEmojis),
		colors:  colors,
		model:   buildSemanticRenderModel(root, allChanges),
	}
}

// Render returns the semantic tree output.
func (sr *SemanticTreeRenderer) Render() string {
	if sr.root == nil || sr.model == nil {
		return ""
	}

	var sb strings.Builder
	children := sr.visibleChildren(sr.root)
	for i, child := range children {
		sr.renderNode(&sb, child, "", i == len(children)-1)
	}
	return sb.String()
}

// Highlights returns up to limit semantic breaking highlights.
func (sr *SemanticTreeRenderer) Highlights(limit int) []string {
	if sr.model == nil {
		return nil
	}

	type highlightItem struct {
		text     string
		priority int
	}

	var items []highlightItem
	for _, leaf := range sr.model.leavesByKey {
		if leaf == nil || !leaf.breaking {
			continue
		}
		text := sr.highlightText(leaf)
		if text == "" {
			continue
		}
		items = append(items, highlightItem{
			text:     text,
			priority: sr.highlightPriority(leaf),
		})
	}

	sort.Slice(items, func(i, j int) bool {
		if items[i].priority != items[j].priority {
			return items[i].priority < items[j].priority
		}
		return items[i].text < items[j].text
	})

	if limit > 0 && len(items) > limit {
		items = items[:limit]
	}

	highlights := make([]string, 0, len(items))
	for _, item := range items {
		highlights = append(highlights, item.text)
	}
	return highlights
}

func buildSemanticRenderModel(root *v3.Node, allChanges []*wcModel.Change) *semanticRenderModel {
	model := &semanticRenderModel{
		root:            root,
		parentByNode:    make(map[*v3.Node]*v3.Node),
		depthByNode:     make(map[*v3.Node]int),
		ownerByKey:      make(map[string]*v3.Node),
		ownedKeysByNode: make(map[*v3.Node][]string),
		firstByKey:      make(map[string]*wcModel.Change),
		rawByKey:        make(map[string][]*wcModel.Change),
		statsByNode:     make(map[*v3.Node]semanticNodeStats),
		leavesByKey:     make(map[string]*SemanticLeaf),
	}
	if root == nil {
		return model
	}

	for _, change := range allChanges {
		key := semanticChangeKey(change)
		if key == "" {
			continue
		}
		if _, ok := model.firstByKey[key]; !ok {
			model.firstByKey[key] = change
		}
		model.rawByKey[key] = append(model.rawByKey[key], change)
	}

	ownerByFingerprint := make(map[string]*v3.Node)
	depthByFingerprint := make(map[string]int)
	keyByFingerprint := make(map[string]string)

	var walk func(node, parent *v3.Node, depth int)
	walk = func(node, parent *v3.Node, depth int) {
		if node == nil {
			return
		}
		model.parentByNode[node] = parent
		model.depthByNode[node] = depth

		for _, changed := range node.GetChanges() {
			if changed == nil {
				continue
			}
			for _, change := range changed.GetPropertyChanges() {
				key := semanticChangeKey(change)
				if _, ok := model.firstByKey[key]; !ok {
					continue
				}
				fingerprint := semanticChangeFingerprint(change)
				if currentDepth, seen := depthByFingerprint[fingerprint]; !seen || depth > currentDepth {
					ownerByFingerprint[fingerprint] = node
					depthByFingerprint[fingerprint] = depth
					keyByFingerprint[fingerprint] = key
				}
			}
		}

		for _, child := range node.Children {
			walk(child, node, depth+1)
		}
	}
	walk(root, nil, 0)

	candidatesByKey := make(map[string]map[*v3.Node]int)
	for fingerprint, owner := range ownerByFingerprint {
		key := keyByFingerprint[fingerprint]
		if candidatesByKey[key] == nil {
			candidatesByKey[key] = make(map[*v3.Node]int)
		}
		candidatesByKey[key][owner]++
	}

	for key, candidates := range candidatesByKey {
		var chosen *v3.Node
		var chosenHits int
		for node, hits := range candidates {
			switch {
			case chosen == nil:
				chosen = node
				chosenHits = hits
			case hits > chosenHits:
				chosen = node
				chosenHits = hits
			case hits == chosenHits && model.depthByNode[node] > model.depthByNode[chosen]:
				chosen = node
			case hits == chosenHits && model.depthByNode[node] == model.depthByNode[chosen] &&
				strings.ToLower(baseNodeLabel(node)) < strings.ToLower(baseNodeLabel(chosen)):
				chosen = node
			}
		}
		if chosen == nil {
			continue
		}
		model.ownerByKey[key] = chosen
		model.ownedKeysByNode[chosen] = append(model.ownedKeysByNode[chosen], key)
		model.leavesByKey[key] = buildSemanticLeaf(chosen, model.firstByKey[key], model.rawByKey[key])
	}

	for node, keys := range model.ownedKeysByNode {
		sort.Slice(keys, func(i, j int) bool {
			return compareSemanticLeaves(model.leavesByKey[keys[i]], model.leavesByKey[keys[j]]) < 0
		})
		model.ownedKeysByNode[node] = keys
	}

	computeSemanticStats(root, model)
	return model
}

func computeSemanticStats(node *v3.Node, model *semanticRenderModel) semanticNodeStats {
	if node == nil || model == nil {
		return semanticNodeStats{}
	}

	stats := semanticNodeStats{}
	for _, key := range model.ownedKeysByNode[node] {
		stats.total++
		if leaf := model.leavesByKey[key]; leaf != nil && leaf.breaking {
			stats.breaking++
		}
	}
	for _, child := range node.Children {
		childStats := computeSemanticStats(child, model)
		stats.total += childStats.total
		stats.breaking += childStats.breaking
	}
	model.statsByNode[node] = stats
	return stats
}

func buildSemanticLeaf(node *v3.Node, representative *wcModel.Change, rawChanges []*wcModel.Change) *SemanticLeaf {
	if representative == nil {
		return nil
	}
	label := semanticPropertyLabel(node, representative, rawChanges)
	changeType := semanticLeafChangeType(representative, rawChanges)
	line, col := semanticLeafLocation(changeType, rawChanges, representative)

	return &SemanticLeaf{
		key:        semanticChangeKey(representative),
		node:       node,
		change:     representative,
		rawChanges: rawChanges,
		label:      label,
		text:       formatSemanticLeafText(label, representative, rawChanges, changeType),
		changeType: changeType,
		breaking:   representative.Breaking,
		line:       line,
		column:     col,
	}
}

func semanticChangeKey(change *wcModel.Change) string {
	if change == nil {
		return ""
	}
	return change.Path + ":" + change.Property
}

func semanticChangeFingerprint(change *wcModel.Change) string {
	if change == nil {
		return ""
	}
	var originalObject, newObject string
	if value, ok := change.OriginalObject.(string); ok {
		originalObject = value
	}
	if value, ok := change.NewObject.(string); ok {
		newObject = value
	}
	return fmt.Sprintf("%d|%s|%s|%s|%s|%s|%s|%s|%s|%s",
		change.ChangeType,
		change.Path,
		change.Type,
		change.Property,
		change.Original,
		change.New,
		change.OriginalEncoded,
		change.NewEncoded,
		originalObject,
		newObject,
	)
}

func semanticPropertyLabel(node *v3.Node, change *wcModel.Change, rawChanges []*wcModel.Change) string {
	if change == nil {
		return ""
	}
	if isSecurityScopeChange(change) {
		return formatSecurityScopeTitle(change)
	}

	switch {
	case node != nil && node.Type == "responses" && change.Property == "codes":
		if label := firstNonEmpty(change.New, change.Original); label != "" {
			return label
		}
	case node != nil && node.Type == "tags" && change.Property == "tags":
		if len(rawChanges) > 1 {
			return "tags"
		}
		if label := firstNonEmpty(change.New, change.Original); label != "" {
			return label
		}
	case node != nil && node.Type == "schema" && change.Property == "properties":
		if len(rawChanges) > 1 {
			return "properties"
		}
		if label := firstNonEmpty(change.New, change.Original); label != "" {
			return fmt.Sprintf("properties/%s", label)
		}
	case isHTTPMethod(change.Property):
		return strings.ToUpper(change.Property)
	}
	return change.Property
}

func semanticLeafChangeType(representative *wcModel.Change, rawChanges []*wcModel.Change) int {
	var hasModified, hasAdded, hasRemoved bool
	for _, change := range rawChanges {
		if change == nil {
			continue
		}
		switch change.ChangeType {
		case wcModel.Modified:
			hasModified = true
		case wcModel.PropertyAdded, wcModel.ObjectAdded:
			hasAdded = true
		case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
			hasRemoved = true
		}
	}

	switch {
	case hasModified || (hasAdded && hasRemoved):
		return wcModel.Modified
	case hasRemoved && !hasAdded:
		return wcModel.PropertyRemoved
	case hasAdded && !hasRemoved:
		return wcModel.PropertyAdded
	case representative != nil:
		return representative.ChangeType
	default:
		return wcModel.Modified
	}
}

func semanticLeafLocation(changeType int, rawChanges []*wcModel.Change, representative *wcModel.Change) (int, int) {
	if len(rawChanges) != 1 {
		return 0, 0
	}
	change := representative
	if rawChanges[0] != nil {
		change = rawChanges[0]
	}
	if change == nil || change.Context == nil {
		return 0, 0
	}
	switch changeType {
	case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
		if change.Context.OriginalLine != nil && change.Context.OriginalColumn != nil {
			return *change.Context.OriginalLine, *change.Context.OriginalColumn
		}
	default:
		if change.Context.NewLine != nil && change.Context.NewColumn != nil {
			return *change.Context.NewLine, *change.Context.NewColumn
		}
	}
	return 0, 0
}

func formatSemanticLeafText(label string, representative *wcModel.Change, rawChanges []*wcModel.Change, changeType int) string {
	if label == "" {
		return ""
	}
	if isSecurityScopeChange(representative) {
		return label
	}

	before, after := collectSemanticValues(rawChanges)
	if len(rawChanges) > 1 {
		switch {
		case len(before) > 0 && len(after) > 0:
			return fmt.Sprintf("%s: %s -> %s", label, formatSemanticValues(before), formatSemanticValues(after))
		case len(after) > 0:
			return fmt.Sprintf("%s: %s", label, formatSemanticValues(after))
		case len(before) > 0:
			return fmt.Sprintf("%s: %s", label, formatSemanticValues(before))
		default:
			return label
		}
	}

	if representative != nil && changeType == wcModel.Modified {
		original := formatSemanticValue(representative.Original)
		newValue := formatSemanticValue(representative.New)
		if original != "" && newValue != "" {
			return fmt.Sprintf("%s: %s -> %s", label, original, newValue)
		}
	}
	return label
}

func collectSemanticValues(rawChanges []*wcModel.Change) ([]string, []string) {
	var before []string
	var after []string
	beforeSeen := make(map[string]struct{})
	afterSeen := make(map[string]struct{})

	appendUnique := func(target *[]string, seen map[string]struct{}, value string) {
		formatted := formatSemanticValue(value)
		if formatted == "" {
			return
		}
		if _, ok := seen[formatted]; ok {
			return
		}
		seen[formatted] = struct{}{}
		*target = append(*target, formatted)
	}

	for _, change := range rawChanges {
		if change == nil {
			continue
		}
		switch change.ChangeType {
		case wcModel.Modified:
			appendUnique(&before, beforeSeen, change.Original)
			appendUnique(&after, afterSeen, change.New)
		case wcModel.PropertyAdded, wcModel.ObjectAdded:
			appendUnique(&after, afterSeen, change.New)
		case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
			appendUnique(&before, beforeSeen, change.Original)
		}
	}

	sort.Strings(before)
	sort.Strings(after)
	return before, after
}

func formatSemanticValue(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	value = strings.ReplaceAll(value, "\n", " ")
	value = strings.Join(strings.Fields(value), " ")
	if len(value) > 48 {
		return value[:45] + "..."
	}
	return value
}

func formatSemanticValues(values []string) string {
	if len(values) == 0 {
		return ""
	}
	if len(values) == 1 {
		return values[0]
	}
	return "[" + strings.Join(values, ", ") + "]"
}

func isHTTPMethod(value string) bool {
	switch strings.ToUpper(value) {
	case "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD", "TRACE":
		return true
	default:
		return false
	}
}

func httpMethodRank(value string) int {
	switch strings.ToUpper(value) {
	case "GET":
		return 0
	case "POST":
		return 1
	case "PUT":
		return 2
	case "PATCH":
		return 3
	case "DELETE":
		return 4
	case "OPTIONS":
		return 5
	case "HEAD":
		return 6
	case "TRACE":
		return 7
	default:
		return 100
	}
}

func compareSemanticLeaves(left, right *SemanticLeaf) int {
	if left == nil && right == nil {
		return 0
	}
	if left == nil {
		return 1
	}
	if right == nil {
		return -1
	}

	leftMethod := isHTTPMethod(left.label)
	rightMethod := isHTTPMethod(right.label)
	if leftMethod || rightMethod {
		if leftMethod != rightMethod {
			if leftMethod {
				return -1
			}
			return 1
		}
		if leftRank, rightRank := httpMethodRank(left.label), httpMethodRank(right.label); leftRank != rightRank {
			if leftRank < rightRank {
				return -1
			}
			return 1
		}
	}

	leftKey := strings.ToLower(left.label + "|" + left.text)
	rightKey := strings.ToLower(right.label + "|" + right.text)
	switch {
	case leftKey < rightKey:
		return -1
	case leftKey > rightKey:
		return 1
	default:
		return 0
	}
}

func compareSemanticNodes(parent *v3.Node, left, right *v3.Node) int {
	leftLabel := strings.ToLower(baseNodeLabel(left))
	rightLabel := strings.ToLower(baseNodeLabel(right))

	if parent == nil || parent.Id == "root" {
		if leftRank, rightRank := topLevelNodeRank(leftLabel), topLevelNodeRank(rightLabel); leftRank != rightRank {
			if leftRank < rightRank {
				return -1
			}
			return 1
		}
	}

	leftIsPath := strings.HasPrefix(leftLabel, "/")
	rightIsPath := strings.HasPrefix(rightLabel, "/")
	if leftIsPath || rightIsPath {
		if leftIsPath != rightIsPath {
			if leftIsPath {
				return -1
			}
			return 1
		}
	}

	leftMethod := isHTTPMethod(leftLabel)
	rightMethod := isHTTPMethod(rightLabel)
	if leftMethod || rightMethod {
		if leftMethod != rightMethod {
			if leftMethod {
				return -1
			}
			return 1
		}
		if leftRank, rightRank := httpMethodRank(leftLabel), httpMethodRank(rightLabel); leftRank != rightRank {
			if leftRank < rightRank {
				return -1
			}
			return 1
		}
	}

	switch {
	case leftLabel < rightLabel:
		return -1
	case leftLabel > rightLabel:
		return 1
	default:
		return 0
	}
}

func topLevelNodeRank(label string) int {
	switch label {
	case "info":
		return 0
	case "servers":
		return 1
	case "security requirements":
		return 2
	case "tags":
		return 3
	case "paths":
		return 4
	case "components":
		return 5
	default:
		return 100
	}
}

func baseNodeLabel(node *v3.Node) string {
	if node == nil {
		return ""
	}
	if node.Label != "" {
		return node.Label
	}
	return node.Type
}

func isGenericContextLabel(label string) bool {
	switch strings.ToLower(label) {
	case "info", "servers", "security requirements", "tags", "paths", "components", "schemas",
		"responses", "parameters", "request body", "schema", "properties", "security schemes", "oauth flows", "oauth flow", "implicit", "document":
		return true
	default:
		return false
	}
}

func (sr *SemanticTreeRenderer) visibleChildren(node *v3.Node) []*v3.Node {
	if node == nil || sr.model == nil {
		return nil
	}
	var children []*v3.Node
	for _, child := range node.Children {
		if sr.model.statsByNode[child].total > 0 {
			children = append(children, child)
		}
	}
	sort.Slice(children, func(i, j int) bool {
		return compareSemanticNodes(node, children[i], children[j]) < 0
	})
	return children
}

func (sr *SemanticTreeRenderer) visibleLeaves(node *v3.Node) []*SemanticLeaf {
	if node == nil || sr.model == nil {
		return nil
	}
	keys := sr.model.ownedKeysByNode[node]
	leaves := make([]*SemanticLeaf, 0, len(keys))
	for _, key := range keys {
		if leaf := sr.model.leavesByKey[key]; leaf != nil {
			leaves = append(leaves, leaf)
		}
	}
	return leaves
}

func (sr *SemanticTreeRenderer) renderNode(sb *strings.Builder, node *v3.Node, prefix string, isLast bool) {
	if node == nil || sr.model == nil {
		return
	}

	leaves := sr.visibleLeaves(node)
	children := sr.visibleChildren(node)
	totalItems := len(leaves) + len(children)

	sb.WriteString(prefix)
	sb.WriteString(sr.colors.TreeBranch(getBranchSymbol(isLast, totalItems > 0)))
	label := sr.formatNodeLabel(node)
	if len(sr.model.ownedKeysByNode[node]) == 0 {
		sb.WriteString(sr.colors.Statistics(label))
	} else {
		sb.WriteString(label)
	}
	sb.WriteString("\n")

	childPrefix := prefix + sr.colors.TreeBranch(TreeEmpty)
	if !isLast {
		childPrefix = prefix + sr.colors.TreeBranch(TreeVertical)
	}

	for i, leaf := range leaves {
		isLastItem := i == len(leaves)-1 && len(children) == 0
		sr.renderLeaf(sb, leaf, childPrefix, isLastItem)
	}
	for i, child := range children {
		sr.renderNode(sb, child, childPrefix, i == len(children)-1)
	}
}

func (sr *SemanticTreeRenderer) renderLeaf(sb *strings.Builder, leaf *SemanticLeaf, prefix string, isLast bool) {
	if leaf == nil {
		return
	}

	sb.WriteString(prefix)
	sb.WriteString(sr.colors.TreeBranch(getBranchSymbol(isLast, false)))
	sb.WriteString(sr.colorizeLeafSymbol(leaf.changeType))
	sb.WriteString(" ")

	// Render label normally, subtly dim the value detail (": old -> new") portion
	if leaf.text != leaf.label && strings.HasPrefix(leaf.text, leaf.label) {
		sb.WriteString(leaf.label)
		sb.WriteString(sr.colors.Detail(leaf.text[len(leaf.label):]))
	} else {
		sb.WriteString(leaf.text)
	}

	if sr.config.ShowLineNumbers && leaf.line > 0 {
		sb.WriteString(sr.colors.LocationInfo(fmt.Sprintf(" (%d:%d)", leaf.line, leaf.column)))
	}
	if leaf.breaking {
		sb.WriteString(" ")
		sb.WriteString(sr.colors.Breaking(sr.symbols.Breaking))
	}
	sb.WriteString("\n")
}

func (sr *SemanticTreeRenderer) formatNodeLabel(node *v3.Node) string {
	return baseNodeLabel(node)
}

func (sr *SemanticTreeRenderer) colorizeLeafSymbol(changeType int) string {
	switch changeType {
	case wcModel.PropertyAdded, wcModel.ObjectAdded:
		return sr.colors.Addition(sr.symbols.Added)
	case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
		return sr.colors.Removal(sr.symbols.Removed)
	default:
		return sr.colors.Modification(sr.symbols.Modified)
	}
}

func (sr *SemanticTreeRenderer) highlightPriority(leaf *SemanticLeaf) int {
	pathLabel, methodLabel, _ := sr.semanticContextLabels(leaf.node)
	if pathLabel != "" && isHTTPMethod(leaf.label) && leaf.changeType == wcModel.PropertyRemoved {
		return 0
	}
	if pathLabel != "" && methodLabel != "" && leaf.changeType == wcModel.Modified {
		return 1
	}
	if pathLabel != "" && leaf.changeType == wcModel.PropertyRemoved {
		return 2
	}
	if pathLabel == "" && leaf.changeType == wcModel.PropertyRemoved {
		return 3
	}
	return 4
}

func (sr *SemanticTreeRenderer) highlightText(leaf *SemanticLeaf) string {
	if leaf == nil {
		return ""
	}
	pathLabel, methodLabel, contextLabels := sr.semanticContextLabels(leaf.node)
	action := "Changed"
	switch leaf.changeType {
	case wcModel.PropertyAdded, wcModel.ObjectAdded:
		action = "Added"
	case wcModel.PropertyRemoved, wcModel.ObjectRemoved:
		action = "Removed"
	}

	var parts []string
	parts = append(parts, action)
	if isHTTPMethod(leaf.label) && pathLabel != "" {
		parts = append(parts, strings.ToUpper(leaf.label), pathLabel)
		return strings.Join(parts, " ")
	}
	if methodLabel != "" {
		parts = append(parts, methodLabel)
	}
	if pathLabel != "" {
		parts = append(parts, pathLabel)
	}
	if len(contextLabels) > 0 {
		parts = append(parts, strings.Join(contextLabels, " "))
	}
	if pathLabel == "" && methodLabel == "" && len(contextLabels) == 0 {
		if container := sr.semanticContainerLabel(leaf.node); container != "" {
			parts = append(parts, container)
		}
	}
	parts = append(parts, leaf.text)
	return strings.Join(parts, " ")
}

func (sr *SemanticTreeRenderer) semanticContextLabels(node *v3.Node) (string, string, []string) {
	var pathLabel string
	var methodLabel string
	var context []string

	for current := node; current != nil; current = sr.model.parentByNode[current] {
		label := baseNodeLabel(current)
		switch {
		case label == "":
			continue
		case strings.HasPrefix(label, "/"):
			pathLabel = label
		case isHTTPMethod(label):
			methodLabel = strings.ToUpper(label)
		case isGenericContextLabel(label):
			continue
		default:
			context = append([]string{label}, context...)
		}
	}
	return pathLabel, methodLabel, context
}

func (sr *SemanticTreeRenderer) semanticContainerLabel(node *v3.Node) string {
	var labels []string
	for current := node; current != nil; current = sr.model.parentByNode[current] {
		label := baseNodeLabel(current)
		if label == "" || isGenericContextLabel(label) || current.Id == "root" {
			continue
		}
		labels = append([]string{label}, labels...)
	}
	if len(labels) == 0 {
		return ""
	}
	return strings.Join(labels, "/")
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}

var knownNonSecurityProperties = map[string]bool{
	"servers": true, "parent": true, "kind": true, "enum": true,
	"default": true, "description": true, "name": true, "url": true,
	"summary": true, "title": true, "version": true, "email": true,
	"license": true, "contact": true, "termsofservice": true,
	"openapi": true, "info": true, "tags": true, "paths": true,
	"components": true, "security": true, "externaldocs": true,
	"identifier": true, "jsonschemadialect": true, "$self": true,
	"parameters": true, "codes": true, "callbacks": true,
	"required": true, "type": true, "properties": true,
}

func isSecurityScopeChange(change *wcModel.Change) bool {
	if change == nil || change.Property == "" {
		return false
	}
	if strings.Contains(change.Property, "/") {
		return false
	}
	if knownNonSecurityProperties[strings.ToLower(change.Property)] {
		return false
	}
	switch change.ChangeType {
	case wcModel.ObjectAdded:
		return change.New != "" && change.New != change.Property &&
			!strings.Contains(change.New, "://") && !strings.Contains(change.New, "/")
	case wcModel.ObjectRemoved:
		return change.Original != "" && change.Original != change.Property &&
			!strings.Contains(change.Original, "://") && !strings.Contains(change.Original, "/")
	}
	return false
}

func formatSecurityScopeTitle(change *wcModel.Change) string {
	if change == nil {
		return ""
	}
	scopeKey := func() string {
		switch change.ChangeType {
		case wcModel.ObjectAdded, wcModel.PropertyAdded:
			if key, ok := change.NewObject.(string); ok && key != "" {
				return key
			}
		case wcModel.ObjectRemoved, wcModel.PropertyRemoved:
			if key, ok := change.OriginalObject.(string); ok && key != "" {
				return key
			}
		}
		return ""
	}
	scopeValue := func() string {
		switch change.ChangeType {
		case wcModel.ObjectAdded, wcModel.PropertyAdded:
			return change.New
		case wcModel.ObjectRemoved, wcModel.PropertyRemoved:
			return change.Original
		}
		return ""
	}

	switch change.ChangeType {
	case wcModel.ObjectAdded, wcModel.PropertyAdded:
		if change.Property == "scopes" {
			if key := scopeKey(); key != "" {
				if value := scopeValue(); value != "" && value != key {
					return change.Property + "/" + key + " (" + value + ")"
				}
				return change.Property + "/" + key
			}
		}
		if change.New != "" {
			return change.Property + "/" + change.New
		}
	case wcModel.ObjectRemoved, wcModel.PropertyRemoved:
		if change.Property == "scopes" {
			if key := scopeKey(); key != "" {
				if value := scopeValue(); value != "" && value != key {
					return change.Property + "/" + key + " (" + value + ")"
				}
				return change.Property + "/" + key
			}
		}
		if change.Original != "" {
			return change.Property + "/" + change.Original
		}
	}
	return change.Property
}

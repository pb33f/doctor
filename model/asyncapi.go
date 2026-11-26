// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"fmt"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/libopenapi/index"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// AsyncDocument is the source graph for an AsyncAPI document.
type AsyncDocument = SourceGraph

type asyncReference struct {
	owner *v3.Node
	value *yaml.Node
	index *index.SpecIndex
	site  *index.Reference
}

type asyncAlias struct{ target, occurrence *v3.Node }

// NewAsyncDocument builds a source-aware graph without reparsing the document.
func NewAsyncDocument(doc libasyncapi.Document) (*AsyncDocument, error) {
	if doc == nil || doc.IsPartial() {
		return nil, fmt.Errorf("complete AsyncAPI document required")
	}
	d := newSourceGraph(asyncFormat{})
	d.refSites = make(map[*index.SpecIndex]map[*yaml.Node]*index.Reference)
	d.objects = make(map[*yaml.Node]sourceLocation)
	d.aliases = make(map[string]asyncAlias)
	d.nodesByPath = make(map[string]*v3.Node)
	d.Root = d.walk(doc.RootNode(), doc.Index(), nil, "$", "AsyncAPI", "document")
	for i := 0; i < len(d.references); i++ {
		ref := d.references[i]
		// the raw $ref would re-resolve against the root's local path and lose its base URL,
		// but repaired aliases are only registered under it.
		resolved, idx := ref.index.SearchIndexForReferenceByReference(ref.site)
		if resolved == nil || resolved.Node == nil {
			resolved, idx = ref.index.SearchIndexForReference(ref.value.Value)
		}
		if resolved == nil || resolved.Node == nil || idx == nil {
			return nil, fmt.Errorf("unresolved AsyncAPI reference %q", ref.value.Value)
		}
		target := d.visited[resolved.Node]
		if target == nil {
			target = d.walk(resolved.Node, idx, ref.owner, ref.owner.Id, ref.owner.Label, ref.owner.Type)
		}
		if target != nil && target != ref.owner {
			d.connect(ref.owner, target, ref.value.Value)
		}
	}
	d.references = nil
	d.refSites = nil
	return d, nil
}

func (d *SourceGraph) referenceSite(node *yaml.Node, idx *index.SpecIndex) *index.Reference {
	sites, ok := d.refSites[idx]
	if !ok {
		sites = make(map[*yaml.Node]*index.Reference)
		for _, ref := range idx.GetRawReferencesSequenced() {
			if ref.IsExtensionRef && idx.GetConfig().ExcludeExtensionRefs {
				continue
			}
			sites[ref.Node] = ref
		}
		d.refSites[idx] = sites
	}
	return sites[node]
}

// AsyncObjectPath appends a named AsyncAPI object with JSONPath escaping.
func AsyncObjectPath(path, key string) string {
	plain := key != ""
	for i, c := range key {
		if !(c == '_' || c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || i > 0 && c >= '0' && c <= '9') {
			plain = false
			break
		}
	}
	if plain {
		return path + "." + key
	}
	return path + "['" + strings.NewReplacer("\\", "\\\\", "'", "\\'").Replace(key) + "']"
}

// asyncFormat keeps graph IDs and report paths identical and resolves $ref through the index.
type asyncFormat struct{}

func (asyncFormat) place(_ *yaml.Node, _ *v3.Node, path string) (string, string) { return path, path }

func (asyncFormat) setSourcePointer(*v3.Node, *v3.Node, *index.SpecIndex, string) {}

func (asyncFormat) childPath(path, key string) string { return AsyncObjectPath(path, key) }

func (asyncFormat) childType(parentType, parentLabel, key string, _ *yaml.Node) string {
	return asyncNodeType(parentType, parentLabel, key)
}

func (asyncFormat) isSchema(*yaml.Node) bool { return false }

func (asyncFormat) collectsReferences() bool { return true }

func asyncNodeType(parentType, parentLabel, key string) string {
	switch parentLabel {
	case "channels":
		return "channel"
	case "operations":
		return "operation"
	case "messages":
		return "message"
	case "schemas", "properties", "patternProperties", "dependentSchemas":
		return "schema"
	case "servers":
		return "server"
	}
	switch key {
	case "payload", "headers", "items", "additionalProperties":
		return "schema"
	}
	if parentType == "schema" {
		return parentType
	}
	return key
}

func (d *SourceGraph) objectLocation(node *yaml.Node, scope string) sourceLocation {
	loc := d.objects[node]
	if scope == "" || loc.path == scope || strings.HasPrefix(loc.path, scope+".") || strings.HasPrefix(loc.path, scope+"[") {
		return loc
	}
	for candidate := scope; candidate != ""; {
		if alias, ok := d.aliases[candidate]; ok && (loc.path == alias.target.Id || strings.HasPrefix(loc.path, alias.target.Id+".") || strings.HasPrefix(loc.path, alias.target.Id+"[")) {
			n := d.materializeOccurrence(loc.node, alias)
			return sourceLocation{n, alias.occurrence.Id + strings.TrimPrefix(loc.path, alias.target.Id), node}
		}
		i := strings.LastIndexAny(candidate, ".[")
		if i < 0 {
			break
		}
		candidate = candidate[:i]
	}
	return loc
}

// Alias edges share unchanged definitions. Only ancestry needed by an actual
// change is materialized, so a small alias DAG cannot expand exponentially.
func (d *SourceGraph) copyOccurrence(target, parent *v3.Node, path, label string) *v3.Node {
	n := v3.NewSyntheticNode(path, parent.Id, label, target.Type)
	n.Value = target.Value
	n.Instance = target.Instance
	n.ValueLine = target.ValueLine
	n.KeyLine = target.KeyLine
	n.Origin = target.Origin
	n.OriginLocation = target.OriginLocation
	n.IsArray = target.IsArray
	n.ArrayValues = target.ArrayValues
	n.ArrayIndex = target.ArrayIndex
	f := &v3.Foundation{Node: n, KeyNode: target.Value, ValueNode: target.Value, PathSegment: label, InstanceType: target.Type, Parent: parent.DrInstance, NodeParent: parent.DrInstance}
	f.JSONPathOnce.Do(func() { f.JSONPath = path })
	n.DrInstance = f
	parent.Children = append(parent.Children, n)
	d.Nodes = append(d.Nodes, n)
	d.nodesByPath[path] = n
	f.AddEdge(d.connect(parent, n, ""))
	d.connect(n, target, "")
	return n
}

func (d *SourceGraph) materializeOccurrence(original *v3.Node, alias asyncAlias) *v3.Node {
	if original == alias.target {
		return alias.occurrence
	}
	path := alias.occurrence.Id + strings.TrimPrefix(original.Id, alias.target.Id)
	if existing := d.nodesByPath[path]; existing != nil {
		return existing
	}
	parent := alias.occurrence
	if sourceParent := d.nodesByPath[original.ParentId]; sourceParent != nil && sourceParent != original {
		parent = d.materializeOccurrence(sourceParent, alias)
	}
	return d.copyOccurrence(original, parent, path, original.Label)
}

// LocateChange returns the authored owner for one side of a change. Source
// identity is part of the key so equal coordinates in separate files cannot collide.
func (d *SourceGraph) LocateChange(change *wc.Change, modified bool, scopes ...string) (*v3.Node, string) {
	if d == nil || change == nil || change.Context == nil {
		return nil, ""
	}
	line, column, obj := change.Context.OriginalLine, change.Context.OriginalColumn, change.OriginalObject
	if modified {
		line, column, obj = change.Context.NewLine, change.Context.NewColumn, change.NewObject
	}
	if line == nil || column == nil {
		return nil, ""
	}
	// Context pointers alias shared yaml.Node fields, so replace them, never write through.
	setPosition := func(position *yaml.Node) {
		l, c := position.Line, position.Column
		if modified {
			change.Context.NewLine, change.Context.NewColumn = &l, &c
		} else {
			change.Context.OriginalLine, change.Context.OriginalColumn = &l, &c
		}
	}
	scope := ""
	if len(scopes) > 0 {
		scope = scopes[0]
	}
	var sourceNode *yaml.Node
	switch value := obj.(type) {
	case *yaml.Node:
		sourceNode = value
	case func() *yaml.Node:
		sourceNode = value()
	}
	if sourceNode != nil {
		loc := d.objectLocation(sourceNode, scope)
		if loc.node != nil {
			setPosition(sourceNode)
			return loc.node, loc.path
		}
	}
	source := change.Context.DocumentLocation
	if indexed, ok := obj.(interface{ GetIndex() *index.SpecIndex }); ok && indexed.GetIndex() != nil {
		source = indexed.GetIndex().GetSpecAbsolutePath()
	}
	if rooted, ok := obj.(interface{ GetRootNode() *yaml.Node }); ok {
		root := rooted.GetRootNode()
		if object := d.objectLocation(root, scope); object.node != nil {
			n := object.node
			source = n.OriginLocation
			for i := 0; root.Kind == yaml.MappingNode && i+1 < len(root.Content); i += 2 {
				if root.Content[i].Value == change.Property && root.Content[i+1].Kind == yaml.ScalarNode {
					setPosition(root.Content[i+1])
					path := n.Id
					if path == "root" {
						path = "$"
					}
					return n, path
				}
			}
		}
	}
	if source == "" {
		source = d.Root.OriginLocation
	}
	// Nullable channel addresses carry scalar pointers rather than model owners.
	// The native change-tree scope supplies their semantic owner across files.
	if change.Property == "address" {
		if n := d.nodesByPath[scope]; n != nil && n.Type == "channel" && n.Value.Kind == yaml.MappingNode {
			for i := 0; i+1 < len(n.Value.Content); i += 2 {
				if n.Value.Content[i].Value == change.Property {
					setPosition(n.Value.Content[i+1])
					return n, scope
				}
			}
		}
	}
	loc := d.locations[sourcePosition{source, *line, *column}]
	if loc.source != nil {
		loc = d.objectLocation(loc.source, scope)
	}
	if loc.node == nil {
		if rooted, ok := obj.(interface{ GetRootNode() *yaml.Node }); ok {
			root := rooted.GetRootNode()
			if object := d.objectLocation(root, scope); object.node != nil {
				n := object.node
				position := root
				for i := 0; root.Kind == yaml.MappingNode && i+1 < len(root.Content); i += 2 {
					if root.Content[i].Value == change.Property {
						position = root.Content[i+1]
						break
					}
				}
				setPosition(position)
				path := n.Id
				if path == "root" {
					path = "$"
				}
				return n, path
			}
		}
	}
	return loc.node, loc.path
}

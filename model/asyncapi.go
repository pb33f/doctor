// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"fmt"
	"strconv"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/libopenapi/index"
	"github.com/pb33f/libopenapi/jsonschema"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// AsyncDocument is the source graph for an AsyncAPI document.
type AsyncDocument = SourceGraph

// SourceGraph indexes authored locations and connects reference sites to their definitions.
type SourceGraph struct {
	schema          *jsonschema.Document
	schemaResources map[*yaml.Node]*jsonschema.Resource
	Root            *v3.Node
	Nodes           []*v3.Node
	Edges           []*v3.Edge
	locations       map[asyncPosition]asyncLocation
	visited         map[*yaml.Node]*v3.Node
	objects         map[*yaml.Node]asyncLocation
	aliases         map[string]asyncAlias
	nodesByPath     map[string]*v3.Node
	refSites        map[*index.SpecIndex]map[*yaml.Node]*index.Reference
	references      []asyncReference
}

func newSourceGraph() *SourceGraph {
	return &SourceGraph{locations: make(map[asyncPosition]asyncLocation), visited: make(map[*yaml.Node]*v3.Node)}
}

type asyncPosition struct {
	source       string
	line, column int
}
type asyncLocation struct {
	node   *v3.Node
	path   string
	source *yaml.Node
}
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
	d := newSourceGraph()
	d.refSites = make(map[*index.SpecIndex]map[*yaml.Node]*index.Reference)
	d.objects = make(map[*yaml.Node]asyncLocation)
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

func (d *SourceGraph) walk(value *yaml.Node, idx *index.SpecIndex, parent *v3.Node, path, label, kind string) *v3.Node {
	if value == nil {
		return nil
	}
	if value.Kind == yaml.DocumentNode {
		if len(value.Content) == 0 {
			return nil
		}
		return d.walk(value.Content[0], idx, parent, path, label, kind)
	}
	if value.Kind == yaml.AliasNode {
		target := d.visited[value.Alias]
		if target == nil {
			return d.walk(value.Alias, idx, parent, path, label, kind)
		}
		n := d.copyOccurrence(target, parent, path, label)
		d.aliases[path] = asyncAlias{target, n}
		return n
	}
	if previous := d.visited[value]; previous != nil {
		return previous
	}
	localPath := path
	if d.schema != nil {
		if resource := d.schemaResources[value]; resource != nil {
			if resource != d.schema.Root {
				path = "schema[" + strconv.Quote(resource.ID) + "]"
			}
			localPath = "$"
		} else if parent != nil && parent.Id != "root" {
			// Report paths restart at every resource. Graph IDs carry the
			// resource prefix to distinguish equal paths across files.
			localPath = parent.DrInstance.(*v3.Foundation).JSONPath + path[len(parent.Id):]
		}
	}
	var n *v3.Node
	if parent != nil && parent.Id == path {
		n = parent
	} else {
		id := path
		if parent == nil {
			id = "root"
		}
		n = v3.NewSyntheticNode(id, "", label, kind)
		if parent != nil {
			n.ParentId = parent.Id
			parent.Children = append(parent.Children, n)
		}
		d.Nodes = append(d.Nodes, n)
	}
	n.Value = value
	n.ValueLine = value.Line
	n.KeyLine = value.Line
	n.ArrayIndex = -1
	n.OriginLocation = idx.GetSpecAbsolutePath()
	n.Origin = &index.NodeOrigin{Node: value, Line: value.Line, Column: value.Column, AbsoluteLocation: n.OriginLocation, Index: idx}
	if d.schema != nil {
		n.SourcePointer = "#"
		if parent != nil && parent.Origin != nil && parent.Origin.Index == idx {
			n.SourcePointer = parent.SourcePointer + "/" + strings.ReplaceAll(strings.ReplaceAll(label, "~", "~0"), "/", "~1")
		}
	}
	n.Instance = value
	foundation := &v3.Foundation{Node: n, KeyNode: value, ValueNode: value, PathSegment: label, InstanceType: kind}
	foundation.JSONPathOnce.Do(func() { foundation.JSONPath = localPath })
	if parent != nil && parent != n {
		foundation.Parent = parent.DrInstance
		foundation.NodeParent = parent.DrInstance
	}
	if parent == n && n.DrInstance != nil {
		prior := n.DrInstance.(v3.Foundational)
		foundation.Parent = prior.GetParent()
		foundation.NodeParent = prior.GetNodeParent()
		foundation.Edges = prior.GetEdges()
	}
	n.DrInstance = foundation
	var parentEdge *v3.Edge
	if parent != nil && parent != n {
		parentEdge = d.connect(parent, n, "")
		foundation.AddEdge(parentEdge)
	}
	d.visited[value] = n
	if d.nodesByPath != nil {
		d.nodesByPath[path] = n
	}
	d.locate(value, idx, n, path)
	switch value.Kind {
	case yaml.MappingNode:
		for i := 0; i+1 < len(value.Content); i += 2 {
			key, child := value.Content[i], value.Content[i+1]
			var childPath string
			if d.schema != nil {
				childPath = jsonschema.PropertyPath(path, key.Value)
			} else {
				childPath = AsyncObjectPath(path, key.Value)
			}
			if d.schema == nil && key.Value == "$ref" {
				if site := d.referenceSite(value, idx); site != nil {
					d.references = append(d.references, asyncReference{n, child, idx, site})
					if parentEdge != nil {
						parentEdge.Ref = child.Value
					}
				}
			}
			if child.Kind == yaml.MappingNode || child.Kind == yaml.SequenceNode || child.Kind == yaml.AliasNode || d.schema.IsSchema(child) {
				var childType string
				if d.schema != nil {
					childType = key.Value
					if d.schema.IsSchema(child) {
						childType = "schema"
					}
				} else {
					childType = asyncNodeType(kind, label, key.Value)
				}
				cn := d.walk(child, idx, n, childPath, key.Value, childType)
				if cn != nil {
					cn.KeyLine = key.Line
					foundation := cn.DrInstance.(*v3.Foundation)
					foundation.KeyNode = key
					foundation.Key = key.Value
					d.locate(key, idx, cn, childPath)
				}
			} else {
				d.locate(key, idx, n, path)
				d.locate(child, idx, n, path)
			}
		}
	case yaml.SequenceNode:
		n.IsArray = true
		n.ArrayValues = len(value.Content)
		for i, child := range value.Content {
			childPath := path + "[" + strconv.Itoa(i) + "]"
			if child.Kind == yaml.MappingNode || child.Kind == yaml.SequenceNode || d.schema.IsSchema(child) {
				childType := kind
				if d.schema.IsSchema(child) {
					childType = "schema"
				}
				cn := d.walk(child, idx, n, childPath, strconv.Itoa(i), childType)
				if cn != nil {
					cn.ArrayIndex = i
					foundation := cn.DrInstance.(*v3.Foundation)
					foundation.IsIndexed = true
					foundation.Index = new(int)
					*foundation.Index = i
				}
			} else {
				d.locate(child, idx, n, path)
			}
		}
	}
	return n
}

// connect uses the same edge identity and reference contract as the OpenAPI walk.
func (d *SourceGraph) connect(source, target *v3.Node, ref string) *v3.Edge {
	edge := v3.GenerateEdge([]string{source.Id}, []string{target.Id})
	edge.Ref = ref
	d.Edges = append(d.Edges, edge)
	source.DrInstance.(v3.Foundational).AddEdge(edge)
	return edge
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

func (d *SourceGraph) locate(value *yaml.Node, idx *index.SpecIndex, n *v3.Node, path string) {
	loc := asyncLocation{n, path, value}
	d.locations[asyncPosition{idx.GetSpecAbsolutePath(), value.Line, value.Column}] = loc
	if d.objects != nil {
		d.objects[value] = loc
	}
}

func (d *SourceGraph) objectLocation(node *yaml.Node, scope string) asyncLocation {
	loc := d.objects[node]
	if scope == "" || loc.path == scope || strings.HasPrefix(loc.path, scope+".") || strings.HasPrefix(loc.path, scope+"[") {
		return loc
	}
	for candidate := scope; candidate != ""; {
		if alias, ok := d.aliases[candidate]; ok && (loc.path == alias.target.Id || strings.HasPrefix(loc.path, alias.target.Id+".") || strings.HasPrefix(loc.path, alias.target.Id+"[")) {
			n := d.materializeOccurrence(loc.node, alias)
			return asyncLocation{n, alias.occurrence.Id + strings.TrimPrefix(loc.path, alias.target.Id), node}
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
	loc := d.locations[asyncPosition{source, *line, *column}]
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

// Release drops all graph and source lookup references after consumers finish.
func (d *SourceGraph) Release() {
	if d != nil {
		*d = SourceGraph{}
	}
}

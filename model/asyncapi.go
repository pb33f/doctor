package model

import (
	"fmt"
	"strconv"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libasyncapi"
	"github.com/pb33f/libopenapi/index"
	wc "github.com/pb33f/libopenapi/what-changed/model"
)

// AsyncDocument indexes authored AsyncAPI locations into doctor's existing node
// graph. Resolved references share their definition nodes instead of expanding
// a schema subtree at every use.
type AsyncDocument struct {
	Root        *v3.Node
	Nodes       []*v3.Node
	Edges       []*v3.Edge
	locations   map[asyncPosition]asyncLocation
	visited     map[*yaml.Node]*v3.Node
	objects     map[*yaml.Node]asyncLocation
	aliases     map[string]asyncAlias
	nodesByPath map[string]*v3.Node
	refSites    map[*index.SpecIndex]map[*yaml.Node]bool
	references  []asyncReference
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
}

type asyncAlias struct{ target, occurrence *v3.Node }

// NewAsyncDocument builds a source-aware graph without reparsing the document.
func NewAsyncDocument(doc libasyncapi.Document) (*AsyncDocument, error) {
	if doc == nil || doc.IsPartial() {
		return nil, fmt.Errorf("complete AsyncAPI document required")
	}
	d := &AsyncDocument{locations: make(map[asyncPosition]asyncLocation), visited: make(map[*yaml.Node]*v3.Node), refSites: make(map[*index.SpecIndex]map[*yaml.Node]bool)}
	d.objects = make(map[*yaml.Node]asyncLocation)
	d.aliases = make(map[string]asyncAlias)
	d.nodesByPath = make(map[string]*v3.Node)
	d.Root = d.walk(doc.RootNode(), doc.Index(), nil, "$", "AsyncAPI", "document")
	for i := 0; i < len(d.references); i++ {
		ref := d.references[i]
		resolved, idx := ref.index.SearchIndexForReference(ref.value.Value)
		if resolved == nil || resolved.Node == nil || idx == nil {
			return nil, fmt.Errorf("unresolved AsyncAPI reference %q", ref.value.Value)
		}
		target := d.visited[resolved.Node]
		if target == nil {
			target = d.walk(resolved.Node, idx, ref.owner, ref.owner.Id, ref.owner.Label, ref.owner.Type)
		}
		if target != nil && target != ref.owner {
			d.Edges = append(d.Edges, &v3.Edge{Sources: []string{ref.owner.Id}, Targets: []string{target.Id}})
		}
	}
	d.references = nil
	d.refSites = nil
	return d, nil
}

func (d *AsyncDocument) walk(value *yaml.Node, idx *index.SpecIndex, parent *v3.Node, path, label, kind string) *v3.Node {
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
	n.Instance = value
	foundation := &v3.Foundation{Node: n, KeyNode: value, ValueNode: value, PathSegment: label, InstanceType: kind}
	foundation.JSONPathOnce.Do(func() { foundation.JSONPath = path })
	if parent != nil && parent != n {
		foundation.Parent = parent.DrInstance
		foundation.NodeParent = parent.DrInstance
	}
	if parent == n && n.DrInstance != nil {
		prior := n.DrInstance.(v3.Foundational)
		foundation.Parent = prior.GetParent()
		foundation.NodeParent = prior.GetNodeParent()
	}
	n.DrInstance = foundation
	d.visited[value] = n
	d.nodesByPath[path] = n
	d.locate(value, idx, n, path)
	switch value.Kind {
	case yaml.MappingNode:
		for i := 0; i+1 < len(value.Content); i += 2 {
			key, child := value.Content[i], value.Content[i+1]
			childPath := AsyncObjectPath(path, key.Value)
			if key.Value == "$ref" && d.isReference(value, idx) {
				d.references = append(d.references, asyncReference{n, child, idx})
			}
			if child.Kind == yaml.MappingNode || child.Kind == yaml.SequenceNode || child.Kind == yaml.AliasNode {
				cn := d.walk(child, idx, n, childPath, key.Value, asyncNodeType(kind, label, key.Value))
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
			if child.Kind == yaml.MappingNode || child.Kind == yaml.SequenceNode {
				cn := d.walk(child, idx, n, childPath, strconv.Itoa(i), kind)
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

func (d *AsyncDocument) isReference(node *yaml.Node, idx *index.SpecIndex) bool {
	sites, ok := d.refSites[idx]
	if !ok {
		sites = make(map[*yaml.Node]bool)
		for _, ref := range idx.GetRawReferencesSequenced() {
			if ref.IsExtensionRef && idx.GetConfig().ExcludeExtensionRefs {
				continue
			}
			sites[ref.Node] = true
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

func (d *AsyncDocument) locate(value *yaml.Node, idx *index.SpecIndex, n *v3.Node, path string) {
	d.locations[asyncPosition{idx.GetSpecAbsolutePath(), value.Line, value.Column}] = asyncLocation{n, path, value}
	loc := asyncLocation{n, path, value}
	d.objects[value] = loc
}

func (d *AsyncDocument) objectLocation(node *yaml.Node, scope string) asyncLocation {
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
func (d *AsyncDocument) copyOccurrence(target, parent *v3.Node, path, label string) *v3.Node {
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
	d.Edges = append(d.Edges, &v3.Edge{Sources: []string{n.Id}, Targets: []string{target.Id}})
	return n
}

func (d *AsyncDocument) materializeOccurrence(original *v3.Node, alias asyncAlias) *v3.Node {
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
func (d *AsyncDocument) LocateChange(change *wc.Change, modified bool, scopes ...string) (*v3.Node, string) {
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
			*line, *column = sourceNode.Line, sourceNode.Column
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
					position := root.Content[i+1]
					*line, *column = position.Line, position.Column
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
					position := n.Value.Content[i+1]
					*line, *column = position.Line, position.Column
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
				*line, *column = position.Line, position.Column
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
func (d *AsyncDocument) Release() {
	if d != nil {
		d.Root = nil
		d.Nodes = nil
		d.Edges = nil
		d.locations = nil
		d.visited = nil
		d.references = nil
		d.objects = nil
		d.aliases = nil
		d.nodesByPath = nil
	}
}

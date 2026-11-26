// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"strconv"

	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libopenapi/index"
)

// SourceGraph indexes authored locations and connects reference sites to their definitions.
type SourceGraph struct {
	format      graphFormat
	Root        *v3.Node
	Nodes       []*v3.Node
	Edges       []*v3.Edge
	locations   map[sourcePosition]sourceLocation
	visited     map[*yaml.Node]*v3.Node
	objects     map[*yaml.Node]sourceLocation
	aliases     map[string]asyncAlias
	nodesByPath map[string]*v3.Node
	refSites    map[*index.SpecIndex]map[*yaml.Node]*index.Reference
	references  []asyncReference
}

// graphFormat holds the decisions that differ between native formats, so the
// walk itself reads the same for all of them.
type graphFormat interface {
	// place returns the graph ID and the report path for a value authored at path.
	place(value *yaml.Node, parent *v3.Node, path string) (id, local string)
	// setSourcePointer records the authored JSON pointer when the format reports one.
	setSourcePointer(n, parent *v3.Node, idx *index.SpecIndex, label string)
	childPath(path, key string) string
	childType(parentType, parentLabel, key string, child *yaml.Node) string
	// isSchema reports whether a value is a schema, including a boolean one.
	isSchema(value *yaml.Node) bool
	// collectsReferences reports whether the walk gathers $ref sites to resolve through the index.
	collectsReferences() bool
}

func newSourceGraph(format graphFormat) *SourceGraph {
	return &SourceGraph{format: format, locations: make(map[sourcePosition]sourceLocation), visited: make(map[*yaml.Node]*v3.Node)}
}

type sourcePosition struct {
	source       string
	line, column int
}
type sourceLocation struct {
	node   *v3.Node
	path   string
	source *yaml.Node
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
	path, localPath := d.format.place(value, parent, path)
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
	d.format.setSourcePointer(n, parent, idx, label)
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
			childPath := d.format.childPath(path, key.Value)
			if key.Value == "$ref" && d.format.collectsReferences() {
				if site := d.referenceSite(value, idx); site != nil {
					d.references = append(d.references, asyncReference{n, child, idx, site})
					if parentEdge != nil {
						parentEdge.Ref = child.Value
					}
				}
			}
			if child.Kind == yaml.MappingNode || child.Kind == yaml.SequenceNode || child.Kind == yaml.AliasNode || d.format.isSchema(child) {
				cn := d.walk(child, idx, n, childPath, key.Value, d.format.childType(kind, label, key.Value, child))
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
			schema := d.format.isSchema(child)
			if child.Kind == yaml.MappingNode || child.Kind == yaml.SequenceNode || schema {
				childType := kind
				if schema {
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
	// A block schema and its first key can share coordinates. Membership
	// changes point at the schema value itself.
	if d.format.isSchema(value) {
		d.locate(value, idx, n, localPath)
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

func (d *SourceGraph) locate(value *yaml.Node, idx *index.SpecIndex, n *v3.Node, path string) {
	loc := sourceLocation{n, path, value}
	d.locations[sourcePosition{idx.GetSpecAbsolutePath(), value.Line, value.Column}] = loc
	if d.objects != nil {
		d.objects[value] = loc
	}
}

// Release drops all graph and source lookup references after consumers finish.
func (d *SourceGraph) Release() {
	if d != nil {
		*d = SourceGraph{}
	}
}

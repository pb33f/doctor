package model

import (
	"reflect"
	"sort"
	"testing"

	dr "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
	"github.com/pb33f/libopenapi/datamodel/low"
	base "github.com/pb33f/libopenapi/datamodel/low/base"
)

type customNodeMap struct{ low.NodeMap }

func (*customNodeMap) GetNodes() map[int][]*yaml.Node { return map[int][]*yaml.Node{77: nil} }

type customSchema struct{ base.Schema }

func (*customSchema) GetNodes() map[int][]*yaml.Node { return map[int][]*yaml.Node{88: nil} }

type legacyNodes struct{}

func (*legacyNodes) GetNodes() map[int][]*yaml.Node { return map[int][]*yaml.Node{99: nil} }

type nodeMapValue struct{ value any }

func (v nodeMapValue) GoLowUntyped() any { return v.value }

type nodeMapObject struct {
	dr.Foundation
	value any
}

func (o *nodeMapObject) GetValue() any { return nodeMapValue{o.value} }

func TestProcessObjectGetNodes(t *testing.T) {
	nm := low.NodeMap{Nodes: &low.NodeLines{}}
	nm.Nodes.Store(5, &yaml.Node{Line: 5})
	nm.Nodes.Store(9, []*yaml.Node{{Line: 9}})
	custom := &customNodeMap{}
	custom.Nodes = &low.NodeLines{}
	custom.Nodes.Store(1, &yaml.Node{})
	schema := &customSchema{}
	schema.Reference = &low.Reference{}
	schema.Nodes = &low.NodeLines{}
	schema.Nodes.Store(2, &yaml.Node{})
	for _, tc := range []struct {
		name  string
		nodes low.HasNodes
		want  []int
	}{
		{"built in", &nm, []int{5, 9}}, {"empty", &low.NodeMap{}, []int{0}},
		{"custom node map", custom, []int{77}}, {"custom schema", schema, []int{88}}, {"legacy", &legacyNodes{}, []int{99}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			w := &DrDocument{}
			obj := &nodeMapObject{value: tc.nodes}
			w.processObject(obj, nil)
			got := []int{}
			for line, objects := range w.lineObjects {
				got = append(got, line)
				if len(objects) != 1 || objects[0] != obj {
					t.Fatal("wrong object")
				}
			}
			sort.Ints(got)
			if !reflect.DeepEqual(got, tc.want) {
				t.Fatalf("got %v want %v", got, tc.want)
			}
		})
	}

	nm.Nodes.Store(12, &yaml.Node{})
	w := &DrDocument{}
	w.processObject(&nodeMapObject{value: &nm}, nil)
	if len(w.lineObjects[12]) != 1 {
		t.Fatal("updated node line was omitted")
	}
}

func TestProcessObjectGetNodesExclusions(t *testing.T) {
	schema := &base.Schema{Reference: &low.Reference{}}
	schema.Nodes = &low.NodeLines{}
	schema.Nodes.Store(5, &yaml.Node{Line: 5})
	schema.SetReference("#/components/schemas/Item", &yaml.Node{Line: 5})
	var absent *base.Schema
	for _, value := range []any{schema, absent} {
		w := &DrDocument{}
		w.processObject(&nodeMapObject{value: value}, nil)
		if len(w.lineObjects) != 0 {
			t.Fatalf("referenced or nil model contributed lines: %v", w.lineObjects)
		}
	}
}

// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package gopher

import (
	"encoding/json"
	"fmt"
	"github.com/pb33f/doctor/helpers"
	"github.com/pb33f/libopenapi/index"
	"net/url"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

type Node struct {
	Children      map[string]*Node
	FullPath      string
	IsRoot        bool
	Parent        *Node
	StringValue   string
	Id            string
	NumericId     int
	IsOpenApi     bool
	IsFile        bool
	Index         *index.SpecIndex
	Statistics    *ReportStatistics
	hasContent    bool
	showContent   bool
	contentBuffer strings.Builder
}

func (n *Node) GetString() string {
	return n.contentBuffer.String()
}

func (n *Node) SetShowContent(show bool) {
	n.showContent = show
}

func (n *Node) MarshalJSON() ([]byte, error) {
	m := make(map[string]interface{})
	m["label"] = n.StringValue
	m["idHash"] = n.Id
	if n.hasContent {
		m["type"] = "rolodex-file"
	} else {
		m["type"] = "rolodex-dir"
	}
	m["id"] = "rolo-" + strconv.Itoa(n.NumericId)
	if len(n.Children) > 0 {
		kids := make([]string, 0, len(n.Children))
		for _, c := range n.SortChildren() {
			kids = append(kids, "rolo-"+strconv.Itoa(c.NumericId))
		}
		m["nodes"] = kids
	}
	if n.FullPath != "" {
		m["path"] = n.FullPath
	}
	if n.Parent != nil {
		m["parentId"] = "rolo-" + strconv.Itoa(n.Parent.NumericId)
	}
	if n.IsOpenApi {
		m["openapi"] = true
	}
	if n.Statistics != nil {
		m["statistics"] = n.Statistics
	}
	if n.showContent {
		m["instance"] = n.GetString()
	}
	if n.IsRoot {
		m["root"] = true
	}
	return json.Marshal(m)
}

// FindChild searches for a child node with the given value
func (n *Node) FindChild(value string) *Node {
	for _, child := range n.Children {
		if child.StringValue == value {
			return child
		}
	}
	return nil
}

func (n *Node) Cleanup() {
	for _, child := range n.Children {
		child.Cleanup()
	}
	n.contentBuffer.Reset()
}

func (n *Node) SetContent(content string) string {
	n.hasContent = true
	n.contentBuffer.Reset()
	n.contentBuffer.WriteString(content)
	return n.contentBuffer.String()
}

// AddChild adds a new child node with the given value
func (n *Node) AddChild(value string, content string, fullPath string) *Node {
	value = helpers.Intern(value)
	if n.Children == nil {
		n.Children = make(map[string]*Node)
	}
	if child, exists := n.Children[value]; exists {
		return child
	}
	buffer := strings.Builder{}
	if len(content) > 0 {
		buffer.WriteString(content)
	}
	hasContent := buffer.Len() > 0
	child := &Node{
		StringValue:   value,
		Parent:        n,
		contentBuffer: buffer,
		hasContent:    hasContent,
	}
	child.Id = helpers.Intern(helpers.HashString(fullPath))
	n.Children[value] = child
	return child
}

// SplitPath splits the path into components, handling URLs and file paths
func SplitPath(path string, base string) []string {
	// Normalize path separators
	path = strings.ReplaceAll(path, "\\", "/")
	base = strings.ReplaceAll(base, "\\", "/")

	// Remove base path if present
	if strings.HasPrefix(path, base) {
		path = strings.TrimPrefix(path, base)
	}

	// Get the nip point from the last segment of the base path
	//nip := filepath.Base(base)

	// Check if it's an HTTP URL
	u, err := url.Parse(path)
	var components []string
	if err == nil && u.Scheme != "" {
		// It's a URL
		components = []string{u.Scheme + "://" + u.Host}
		pathComponents := strings.Split(u.Path, "/")
		for _, c := range pathComponents {
			if c != "" {
				components = append(components, c)
			}
		}
	} else {
		// It's a file path
		components = strings.Split(path, "/")
	}

	var result []string
	//skip := true
	for _, c := range components {
		if c == "" {
			continue
		}
		//if nip != "" && c == nip {
		//	skip = false
		//	continue // Skip the nip point itself
		//}
		//if !skip {
		//			result = append(result, c)
		//			continue
		//		}
		result = append(result, c)
	}
	return result
}

// SortChildren returns a slice of child nodes sorted by StringValue alphabetically
func (n *Node) SortChildren() []*Node {
	childrenSlice := make([]*Node, 0, len(n.Children))
	for _, child := range n.Children {
		childrenSlice = append(childrenSlice, child)
	}
	sort.Slice(childrenSlice, func(i, j int) bool {
		return childrenSlice[i].StringValue < childrenSlice[j].StringValue
	})
	return childrenSlice
}

// FlattenTree recursively collects all nodes into a flat slice
func (n *Node) FlattenTree(nodes *[]*Node) {
	*nodes = append(*nodes, n)
	for _, child := range n.Children {
		child.FlattenTree(nodes)
	}
}

func isFile(path string) bool {
	return filepath.Ext(path) != ""
}

func searchForNode(node *Node, nodeId string) *Node {
	if node == nil {
		return nil
	}
	if node.Id == nodeId {
		return node
	}
	for _, child := range node.Children {
		if found := searchForNode(child, nodeId); found != nil {
			return found
		}
	}
	return nil
}

func searchForNodeByPath(node *Node, path string) *Node {
	if node == nil {
		return nil
	}

	// split the full definition path into components and check the path
	if node.FullPath == path {
		return node
	}
	if (node.FullPath == fmt.Sprintf("/%s", path)) || node.FullPath == path {
		return node
	}

	for _, child := range node.Children {
		if found := searchForNodeByPath(child, path); found != nil {
			return found
		}
	}
	return nil
}

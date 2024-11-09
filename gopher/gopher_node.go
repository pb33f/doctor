// Copyright 2023-2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package gopher

import (
	"encoding/json"
	"fmt"
	"github.com/cespare/xxhash/v2"
	"github.com/daveshanley/vacuum/model/reports"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/index"
	"net/url"
	"path/filepath"
	"sort"
	"strings"
	"sync"
)

var stringPool sync.Map

func intern(s string) string {
	if interned, exists := stringPool.Load(s); exists {
		return interned.(string)
	}
	stringPool.Store(s, s)
	return s
}

type Node struct {
	Children      map[string]*Node
	FullPath      string
	StringValue   string
	Id            string
	NumericId     int
	IsOpenApi     bool
	IsFile        bool
	Index         *index.SpecIndex
	Statistics    *reports.ReportStatistics
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
	if n.hasContent {
		m["idHash"] = n.Id
		m["type"] = "rolodex-file"
	} else {
		m["type"] = "rolodex-dir"
	}
	m["id"] = fmt.Sprintf("rolo-%d", n.NumericId)
	if len(n.Children) > 0 {
		m["nodes"] = n.SortChildren()
	}
	if n.FullPath != "" {
		m["path"] = n.FullPath
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

// AddChild adds a new child node with the given value
func (n *Node) AddChild(value string, content string) *Node {
	value = intern(value)
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
		contentBuffer: buffer,
		hasContent:    hasContent,
	}
	if buffer.Len() > 0 {
		child.Id = intern(fmt.Sprintf("%x", xxhash.Sum64String(content)))
	}

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
	nip := filepath.Base(base)

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
	skip := true
	for _, c := range components {
		if c == "" {
			continue
		}
		if nip != "" && c == nip {
			skip = false
			continue // Skip the nip point itself
		}
		if !skip {
			result = append(result, c)
			continue
		}
		result = append(result, c)
	}
	return result
}

type RolodexTree struct {
	Root        *Node
	Children    []*Node
	Rolodex     *index.Rolodex
	indexConfig *index.SpecIndexConfig
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

func NewRolodexTree(rolodex *index.Rolodex) *RolodexTree {
	return &RolodexTree{
		Rolodex:     rolodex,
		indexConfig: rolodex.GetConfig(),
	}
}

func isFile(path string) bool {
	return filepath.Ext(path) != ""
}

// BuildTree constructs the tree from the given paths
func (rt *RolodexTree) BuildTree() *Node {
	root := &Node{
		StringValue: "/", // Root node represents the root directory
	}

	rootIndex := rt.Rolodex.GetRootIndex()
	indexes := rt.Rolodex.GetIndexes()

	paths := []string{rootIndex.GetSpecAbsolutePath()}
	indexMap := make(map[string]*index.SpecIndex)
	indexMap[rootIndex.GetSpecAbsolutePath()] = rootIndex

	for _, index := range indexes {
		paths = append(paths, index.GetSpecAbsolutePath())
		indexMap[index.GetSpecAbsolutePath()] = index
	}

	var absPath = rt.indexConfig.BasePath
	if !filepath.IsAbs(rt.indexConfig.BasePath) {
		absPath, _ = filepath.Abs(rt.indexConfig.BasePath)
	}

	xid := 0
	for _, path := range paths {
		components := SplitPath(path, absPath)
		currentNode := root
		rolodexFile, _ := rt.Rolodex.Open(path)
		for _, component := range components {
			fl := isFile(component)
			f := ""
			if fl {
				if rolodexFile != nil {
					f = intern(rolodexFile.GetContent())
				}
			}
			xid++
			currentNode = currentNode.AddChild(component, f)
			currentNode.NumericId = xid
			if fl && rolodexFile != nil {
				currentNode.IsFile = true
				currentNode.Index = rolodexFile.GetIndex()
				info := currentNode.Index.GetConfig().SpecInfo
				if info != nil {
					switch info.SpecFormat {
					case datamodel.OAS3:
					case datamodel.OAS2:
					case datamodel.OAS31:
						currentNode.IsOpenApi = true
					}
					currentNode.Statistics = &reports.ReportStatistics{
						FilesizeKB:    len(*info.SpecBytes) / 1024,
						FilesizeBytes: len(*info.SpecBytes),
						SpecType:      info.SpecType,
						SpecFormat:    info.SpecFormat,
						Version:       info.Version,
						References:    len(currentNode.Index.GetAllReferences()),
						Schemas:       len(currentNode.Index.GetAllSchemas()),
						Parameters:    len(currentNode.Index.GetAllParameters()),
						Links:         len(currentNode.Index.GetAllLinks()),
						Paths:         len(currentNode.Index.GetAllPaths()),
					}
				}
			}
			if currentNode.IsFile {
				p, _ := filepath.Abs(filepath.Join(absPath, strings.Join(components, "/")))
				currentNode.FullPath = strings.ReplaceAll(p, fmt.Sprintf("%s/", absPath), "")
			}
		}
	}
	rt.Root = root
	return root
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

func (rt *RolodexTree) SearchForNode(nodeId string) (*Node, bool) {
	n := searchForNode(rt.Root, nodeId)
	if n != nil {
		return n, true
	}
	return nil, false
}

func (rt *RolodexTree) GetRoot() *Node {
	return rt.Root
}

func (rt *RolodexTree) Cleanup() {
	rt.Root.Cleanup()
}

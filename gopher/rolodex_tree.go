// Copyright 2023-2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package gopher

import (
	"fmt"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/pb33f/libopenapi/index"
	"path/filepath"
	"strings"
)

type RolodexTree struct {
	Root        *Node
	Children    []*Node
	Rolodex     *index.Rolodex
	indexConfig *index.SpecIndexConfig
}

func NewRolodexTree(rolodex *index.Rolodex) *RolodexTree {
	return &RolodexTree{
		Rolodex:     rolodex,
		indexConfig: rolodex.GetConfig(),
	}
}

func (rt *RolodexTree) SearchForNode(nodeId string) (*Node, bool) {
	n := searchForNode(rt.Root, nodeId)
	if n != nil {
		return n, true
	}
	return nil, false
}

func (rt *RolodexTree) SearchForNodeByPath(path string) (*Node, bool) {
	n := searchForNodeByPath(rt.Root, path)
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

// BuildTree constructs the tree from the given paths
func (rt *RolodexTree) BuildTree(base string, baseUrl string) *Node {
	root := &Node{
		StringValue: "/", // Root node represents the root directory
	}

	rootIndex := rt.Rolodex.GetRootIndex()
	indexes := rt.Rolodex.GetIndexes()

	paths := []string{rootIndex.GetSpecAbsolutePath()}
	indexMap := make(map[string]*index.SpecIndex)
	indexMap[rootIndex.GetSpecAbsolutePath()] = rootIndex

	if len(indexes) == 0 && rootIndex != nil {
		// there is only a single document, no need for a tree, return root node
		root.StringValue = "/root.yaml"
		root.FullPath = "/root.yaml"
		rt.Root = root
		return root
	}

	for _, index := range indexes {
		paths = append(paths, index.GetSpecAbsolutePath())
		indexMap[index.GetSpecAbsolutePath()] = index
	}

	var absPath = rt.indexConfig.BasePath
	if !filepath.IsAbs(rt.indexConfig.BasePath) {
		absPath, _ = filepath.Abs(rt.indexConfig.BasePath)
	}

	xid := 0
	sb := strings.Builder{}

	for _, path := range paths {
		fPath := strings.ReplaceAll(path, base, "")
		if baseUrl != "" {
			fPath = strings.ReplaceAll(path, baseUrl, "")
		}
		components := SplitPath(fPath, absPath)
		rolodexFile, _ := rt.Rolodex.Open(path)
		currentNode := root

		sb.Reset()
		for _, component := range components {
			fl := isFile(component)
			f := ""
			if fl {
				if rolodexFile != nil {
					f = intern(rolodexFile.GetContent())
				}
			}
			xid++
			if !fl {
				sb.WriteString(component)
				if len(components) > 1 {
					sb.WriteString("/")
				}
			} else {
				sb.WriteString(component)
			}

			//TODO: the bug is here: clear HTTP link in a path, need a new arg with the basepath
			// of the original URL. the path and the URL are mixed up
			var currPath string
			if baseUrl != "" {
				currPath = fmt.Sprintf("%s%s", base, fPath[1:]) // strip off slash
			} else {
				currPath = fmt.Sprintf("/%s", sb.String())
			}
			currentNode = currentNode.AddChild(component, f, currPath)
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
					currentNode.Statistics = &ReportStatistics{
						References: len(currentNode.Index.GetAllReferences()),
						Schemas:    len(currentNode.Index.GetAllSchemas()),
						Parameters: len(currentNode.Index.GetAllParameters()),
						Links:      len(currentNode.Index.GetAllLinks()),
						Paths:      len(currentNode.Index.GetAllPaths()),
					}
				}
			} else {
				currentNode.IsFile = false
			}
			if currentNode.IsFile {
				//p, _ := filepath.Abs(filepath.Join(absPath, strings.Join(components, "/")))
				//currentNode.FullPath = strings.ReplaceAll(p, fmt.Sprintf("%s/", absPath), "")
				currentNode.FullPath = fPath
				if fPath == "/root.yaml" || fPath == "root.yaml" {
					currentNode.FullPath = "root.yaml"
				}
			}
		}
	}
	rt.Root = root
	return root
}

// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"fmt"

	"go.yaml.in/yaml/v4"
)

// RenderBundled assembles a FrankResult into a single YAML document with nested items.
func RenderBundled(result *FrankResult) ([]byte, error) {
	if result == nil {
		return nil, fmt.Errorf("result is required")
	}

	// clone the collection for bundled output
	bundled := *result.Collection
	bundled.Bundled = true
	bundled.Items = nil

	// build nested items
	for _, fo := range result.Folders {
		folderItem := &CollectionItem{
			Info: ItemInfo{
				Name: fo.Folder.Info.Name,
				Type: "folder",
				Seq:  fo.Folder.Info.Seq,
			},
		}
		for _, req := range fo.Requests {
			reqItem := &CollectionItem{
				Info: ItemInfo{
					Name: req.Info.Name,
					Type: req.Info.Type,
					Seq:  req.Info.Seq,
					Tags: req.Info.Tags,
				},
				HTTP: &req.HTTP,
				Docs: req.Docs,
			}
			folderItem.Items = append(folderItem.Items, reqItem)
		}
		bundled.Items = append(bundled.Items, folderItem)
	}

	data, err := yaml.Marshal(&bundled)
	if err != nil {
		return nil, fmt.Errorf("marshaling bundled collection: %w", err)
	}
	return data, nil
}

// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package model

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	whatChangedModel "github.com/pb33f/libopenapi/what-changed/model"
)

type GraphResponse struct {
	Nodes          []interface{}              `json:"nodes,omitempty"`
	Edges          []interface{}              `json:"edges,omitempty"`
	NodesRendered  []interface{}              `json:"nodesRendered,omitempty"`
	NodeChangeTree *v3.Node                   `json:"nodeChangeTree,omitempty"`
	Changes        []*whatChangedModel.Change `json:"changes,omitempty"`
	GraphMap       map[int]string             `json:"graphMap,omitempty"`
	Stripped       bool                       `json:"stripped,omitempty"`
	StrippedCount  int                        `json:"strippedCount,omitempty"`
	FileUUID       string                     `json:"graphId,omitempty"`
	RevisionUUID   string                     `json:"graphRevisionId,omitempty"`
}

// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package renderer

import (
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBuildSemanticRenderModel_GroupsCollectionPropertyChanges(t *testing.T) {
	root := &v3.Node{Id: "root", Label: "Document", Type: "document"}
	schema := &v3.Node{
		Id:       "$.components.schemas['Pet']",
		ParentId: "root",
		Label:    "Pet",
		Type:     "schema",
	}

	added := &wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "properties",
		ChangeType: wcModel.ObjectAdded,
		New:        "jazz",
	}
	removed := &wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "properties",
		ChangeType: wcModel.ObjectRemoved,
		Original:   "name",
	}

	schema.AppendChange(&mockChanged{changes: []*wcModel.Change{added, removed}})
	root.Children = []*v3.Node{schema}

	model := buildSemanticRenderModel(root, []*wcModel.Change{added, removed})
	require.NotNil(t, model)

	leaf := model.leavesByKey["$.components.schemas['Pet']:properties"]
	require.NotNil(t, leaf)
	assert.Equal(t, "properties", leaf.label)
	assert.Equal(t, "properties: name -> jazz", leaf.text)
	assert.Equal(t, wcModel.Modified, leaf.changeType)
}

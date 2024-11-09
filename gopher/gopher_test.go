// Copyright 2023-2024 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package gopher

import (
	"encoding/json"
	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func TestGopher_BuildRolodexTree_SimpleTest(t *testing.T) {

	bytes, _ := os.ReadFile("../test_specs/root.yaml")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs",
		AllowFileReferences: true,
	})
	v3Doc, _ := newDoc.BuildV3Model()

	walker := model.NewDrDocument(v3Doc)
	gopher := NewGopher(walker)

	rolodexTree := gopher.CreateRolodexTree()
	assert.NotNil(t, rolodexTree)

	node := rolodexTree.BuildTree()
	assert.NotNil(t, node)
	assert.Len(t, node.Children, 2)
	assert.Equal(t, "root.yaml", node.Children["root.yaml"].StringValue)
	assert.Equal(t, "schemas.yaml", node.Children["schemas.yaml"].StringValue)
	assert.Len(t, node.Children["root.yaml"].GetString(), 272)
	assert.Len(t, node.Children["schemas.yaml"].GetString(), 232)

}

func TestGopher_BuildRolodexTree_TestRelativeFiles(t *testing.T) {

	bytes, _ := os.ReadFile("../test_specs/test-relative/spec.yaml")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs/test-relative",
		SpecFilePath:        "../test_specs/test-relative/spec.yaml",
		AllowFileReferences: true,
	})
	v3Doc, _ := newDoc.BuildV3Model()

	walker := model.NewDrDocument(v3Doc)
	gopher := NewGopher(walker)

	rolodexTree := gopher.CreateRolodexTree()
	assert.NotNil(t, rolodexTree)

	node := rolodexTree.BuildTree()
	assert.NotNil(t, node)
	assert.Len(t, node.Children, 4)

	assert.Equal(t, "spec.yaml", node.SortChildren()[0].StringValue)
	assert.True(t, node.SortChildren()[0].hasContent)
	assert.Equal(t, "colors", node.SortChildren()[1].StringValue)
	assert.False(t, node.SortChildren()[1].hasContent)
	assert.Equal(t, "oranges", node.SortChildren()[2].StringValue)
	assert.False(t, node.SortChildren()[2].hasContent)
	assert.Equal(t, "all_shared.yaml", node.SortChildren()[3].StringValue)
	assert.True(t, node.SortChildren()[3].hasContent)
	assert.Equal(t, "lemons", node.SortChildren()[4].StringValue)
	assert.False(t, node.SortChildren()[4].hasContent)
	assert.Equal(t, "schemas.yaml", node.SortChildren()[0].SortChildren()[0].StringValue)
	assert.Len(t, node.SortChildren()[0].SortChildren()[0].GetString(), 170)
	assert.True(t, node.SortChildren()[0].SortChildren()[0].hasContent)
	assert.Equal(t, "schemas.yaml", node.SortChildren()[1].SortChildren()[0].StringValue)
	assert.Len(t, node.SortChildren()[1].SortChildren()[0].GetString(), 129)
	assert.True(t, node.SortChildren()[1].SortChildren()[0].hasContent)
	assert.Equal(t, "schemas.yaml", node.SortChildren()[2].SortChildren()[0].StringValue)

	assert.Len(t, node.SortChildren()[2].SortChildren()[0].GetString(), 304)
	assert.True(t, node.SortChildren()[2].SortChildren()[0].hasContent)

	assert.Equal(t, "subtypes", node.SortChildren()[2].SortChildren()[1].StringValue)
	assert.False(t, node.SortChildren()[2].SortChildren()[1].hasContent)

	assert.Equal(t, "types.yaml", node.SortChildren()[2].SortChildren()[1].SortChildren()[0].StringValue)
	assert.True(t, node.SortChildren()[2].SortChildren()[1].SortChildren()[0].hasContent)
	assert.Len(t, node.SortChildren()[2].SortChildren()[1].SortChildren()[0].GetString(), 220)

	jsn, e := json.Marshal(node)

	assert.NoError(t, e)
	assert.NotNil(t, jsn)

	found, ok := rolodexTree.SearchForNode(node.SortChildren()[2].SortChildren()[1].Id)
	assert.True(t, ok)
	assert.Equal(t, found.Id, node.SortChildren()[2].SortChildren()[1].Id)

}

func BenchmarkNewRolodexTree(b *testing.B) {

	bytes, _ := os.ReadFile("../test_specs/root.yaml")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs",
		AllowFileReferences: true,
	})
	v3Doc, _ := newDoc.BuildV3Model()

	walker := model.NewDrDocument(v3Doc)
	gopher := NewGopher(walker)

	for i := 0; i < b.N; i++ {
		rolodexTree := gopher.CreateRolodexTree()
		node := rolodexTree.BuildTree()
		assert.NotNil(b, node)
	}
}

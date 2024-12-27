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
	"path/filepath"
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

	node := rolodexTree.BuildTree("../test_specs", "")
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

	node := rolodexTree.BuildTree("../test_specs", "")
	assert.NotNil(t, node)
	assert.Len(t, node.Children, 5)

	sorted := node.SortChildren()

	assert.Equal(t, "all_shared.yaml", sorted[0].StringValue)
	assert.True(t, sorted[0].hasContent)

	assert.Equal(t, "colors", sorted[1].StringValue)
	assert.False(t, sorted[1].hasContent)

	assert.Equal(t, "lemons", sorted[2].StringValue)
	assert.False(t, sorted[2].hasContent)

	assert.Equal(t, "oranges", sorted[3].StringValue)
	assert.False(t, sorted[3].hasContent)

	assert.Equal(t, "spec.yaml", sorted[4].StringValue)
	assert.True(t, sorted[4].hasContent)

	assert.Equal(t, "schemas.yaml", sorted[1].SortChildren()[0].StringValue)
	assert.Len(t, sorted[1].SortChildren()[0].GetString(), 170)
	assert.True(t, sorted[1].SortChildren()[0].hasContent)

	assert.Len(t, sorted[2].SortChildren()[0].GetString(), 164)
	assert.True(t, sorted[2].SortChildren()[0].hasContent)

	assert.Equal(t, "subtypes", sorted[3].SortChildren()[1].StringValue)
	assert.False(t, sorted[3].SortChildren()[1].hasContent)

	assert.Equal(t, "types.yaml", sorted[3].SortChildren()[1].SortChildren()[0].StringValue)
	assert.True(t, sorted[3].SortChildren()[1].SortChildren()[0].hasContent)
	assert.Len(t, sorted[3].SortChildren()[1].SortChildren()[0].GetString(), 220)

	jsn, e := json.Marshal(node)

	assert.NoError(t, e)
	assert.NotNil(t, jsn)

	found, ok := rolodexTree.SearchForNode(node.SortChildren()[2].SortChildren()[0].Id)
	assert.True(t, ok)
	assert.Equal(t, found.Id, node.SortChildren()[2].SortChildren()[0].Id)

}

func TestGopher_BuildRolodexTree_TestDeepRelativeFiles(t *testing.T) {

	bytes, _ := os.ReadFile("../test_specs/test-relative/oranges/schemas.yaml")
	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
		BasePath:            "../test_specs/test-relative/oranges",
		SpecFilePath:        "../test_specs/test-relative/oranges/schemas.yaml",
		AllowFileReferences: true,
	})
	v3Doc, errs := newDoc.BuildV3Model()

	assert.Empty(t, errs)
	assert.NotNil(t, v3Doc)
}

func TestGopher_BuildRolodexTree_TestSearchForPath(t *testing.T) {

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

	node := rolodexTree.BuildTree("../test_specs", "")
	assert.NotNil(t, node)

	cwd, _ := os.Getwd()
	absPath, _ := filepath.Abs(filepath.Join(cwd, "../test_specs/test-relative/oranges/subtypes/types.yaml"))
	foundNode, _ := rolodexTree.SearchForNodeByPath(absPath)
	assert.NotNil(t, foundNode)
}

//func BenchmarkNewRolodexTree(b *testing.B) {
//
//	bytes, _ := os.ReadFile("../test_specs/root.yaml")
//	newDoc, _ := libopenapi.NewDocumentWithConfiguration(bytes, &datamodel.DocumentConfiguration{
//		BasePath:            "../test_specs",
//		AllowFileReferences: true,
//	})
//	v3Doc, _ := newDoc.BuildV3Model()
//
//	walker := model.NewDrDocument(v3Doc)
//	gopher := NewGopher(walker)
//
//	for i := 0; i < b.N; i++ {
//		rolodexTree := gopher.CreateRolodexTree()
//		node := rolodexTree.BuildTree()
//		assert.NotNil(b, node)
//	}
//}

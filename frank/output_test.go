// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
	"go.yaml.in/yaml/v4"
)

const petstoreSpec = `openapi: "3.1.0"
info:
  title: Pet Store
  version: "1.0.0"
servers:
  - url: https://api.petstore.io
    description: Production
paths:
  /pets:
    get:
      summary: List Pets
      operationId: listPets
      tags:
        - pets
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
    post:
      summary: Create Pet
      operationId: createPet
      tags:
        - pets
      requestBody:
        content:
          application/json:
            schema:
              type: object
      responses:
        '201':
          description: Created
  /users:
    get:
      summary: List Users
      operationId: listUsers
      tags:
        - users
      responses:
        '200':
          description: OK
`

func buildTestResult(t *testing.T) *FrankResult {
	t.Helper()
	doc, err := libopenapi.NewDocument([]byte(petstoreSpec))
	require.NoError(t, err)
	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)
	drDoc := model.NewDrDocument(v3Model)

	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                drDoc,
		GenerateEnvironments: true,
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)
	return result
}

func TestRenderExploded_FileStructure(t *testing.T) {
	result := buildTestResult(t)
	files, err := RenderExploded(result)
	require.NoError(t, err)

	paths := make(map[string]bool)
	for _, f := range files {
		paths[f.Path] = true
	}

	// root collection file
	assert.True(t, paths["opencollection.yml"], "should have opencollection.yml")

	// folder files
	assert.True(t, paths["pets/folder.yml"], "should have pets/folder.yml")
	assert.True(t, paths["users/folder.yml"], "should have users/folder.yml")

	// environment files
	assert.True(t, paths["environments/production.yml"], "should have environment file")
}

func TestRenderExploded_ValidYAML(t *testing.T) {
	result := buildTestResult(t)
	files, err := RenderExploded(result)
	require.NoError(t, err)

	for _, f := range files {
		var parsed any
		err := yaml.Unmarshal(f.Content, &parsed)
		assert.NoError(t, err, "file %s should be valid YAML", f.Path)
	}
}

func TestWriteExploded_CreatesDirs(t *testing.T) {
	result := buildTestResult(t)
	files, err := RenderExploded(result)
	require.NoError(t, err)

	tmpDir := t.TempDir()
	err = WriteExploded(tmpDir, files)
	require.NoError(t, err)

	// verify files exist
	for _, f := range files {
		fullPath := filepath.Join(tmpDir, f.Path)
		_, err := os.Stat(fullPath)
		assert.NoError(t, err, "file %s should exist", f.Path)
	}
}

func TestRenderExploded_OmitsEmptyFields(t *testing.T) {
	result := buildTestResult(t)
	files, err := RenderExploded(result)
	require.NoError(t, err)

	for _, f := range files {
		content := string(f.Content)
		// empty params/headers/body should not appear
		if filepath.Ext(f.Path) == ".yml" && f.Path != "opencollection.yml" {
			if filepath.Base(f.Path) != "folder.yml" &&
				!strings.Contains(f.Path, "environments/") {
				// request files should not have empty params/headers if omitempty works
				assert.NotContains(t, content, "params: []\n", "file %s should omit empty params", f.Path)
				assert.NotContains(t, content, "headers: []\n", "file %s should omit empty headers", f.Path)
			}
		}
	}
}

func TestRenderBundled_ValidYAML(t *testing.T) {
	result := buildTestResult(t)
	data, err := RenderBundled(result)
	require.NoError(t, err)

	var parsed map[string]any
	err = yaml.Unmarshal(data, &parsed)
	require.NoError(t, err)

	assert.Equal(t, "1.0.0", parsed["opencollection"])
	assert.Equal(t, true, parsed["bundled"])
	items, ok := parsed["items"].([]any)
	require.True(t, ok)
	assert.GreaterOrEqual(t, len(items), 2, "should have at least 2 folder items")
}

func TestRenderBundled_MatchesExploded(t *testing.T) {
	result := buildTestResult(t)

	// count total requests in exploded
	explodedReqCount := 0
	for _, fo := range result.Folders {
		explodedReqCount += len(fo.Requests)
	}

	// count total requests in bundled
	data, err := RenderBundled(result)
	require.NoError(t, err)

	var parsed map[string]any
	err = yaml.Unmarshal(data, &parsed)
	require.NoError(t, err)

	items := parsed["items"].([]any)
	bundledReqCount := 0
	for _, item := range items {
		folder := item.(map[string]any)
		if children, ok := folder["items"].([]any); ok {
			bundledReqCount += len(children)
		}
	}

	assert.Equal(t, explodedReqCount, bundledReqCount, "both modes should have the same number of requests")
}

func TestRenderExploded_NilResult(t *testing.T) {
	_, err := RenderExploded(nil)
	assert.Error(t, err)
}

func TestRenderExploded_DuplicateSummariesUseStableUniqueFilenames(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Duplicate Summaries
  version: "1.0.0"
paths:
  /users/{id}:
    get:
      summary: Get details
      tags:
        - users
      responses:
        '200':
          description: OK
  /users/{id}/posts:
    get:
      summary: Get details
      tags:
        - users
      responses:
        '200':
          description: OK
`
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)
	drDoc := model.NewDrDocument(v3Model)

	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	files, err := RenderExploded(result)
	require.NoError(t, err)

	paths := make(map[string]bool)
	for _, file := range files {
		paths[file.Path] = true
	}

	assert.True(t, paths["users/get-users-id.yml"])
	assert.True(t, paths["users/get-users-id-posts.yml"])
	assert.False(t, paths["users/get-details.yml"])
}

func TestRenderBundled_NilResult(t *testing.T) {
	_, err := RenderBundled(nil)
	assert.Error(t, err)
}

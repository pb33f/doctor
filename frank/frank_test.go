// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"testing"

	"github.com/pb33f/doctor/model"
	"github.com/pb33f/libopenapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func buildDrDoc(t *testing.T, spec string) *model.DrDocument {
	t.Helper()
	doc, err := libopenapi.NewDocument([]byte(spec))
	require.NoError(t, err)
	v3Model, errs := doc.BuildV3Model()
	require.Empty(t, errs)
	return model.NewDrDocument(v3Model)
}

func TestGenerate_BasicPetstore(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Petstore
  version: "1.0.0"
  description: A sample pet store
  contact:
    name: Dave
    email: dave@pb33f.io
servers:
  - url: https://api.petstore.io/v1
    description: Production
security:
  - bearerAuth: []
paths:
  /pets:
    get:
      summary: List all pets
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
          description: A list of pets
          content:
            application/json:
              schema:
                type: array
    post:
      summary: Create a pet
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
  /pets/{petId}:
    get:
      summary: Get a pet
      operationId: getPet
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: A pet
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
`

	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                    drDoc,
		GenerateEnvironments:     true,
		IncludeDescriptionAsDocs: true,
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// collection
	assert.Equal(t, "1.0.0", result.Collection.OpenCollection)
	assert.Equal(t, "Petstore", result.Collection.Info.Name)
	assert.Equal(t, "A sample pet store", result.Collection.Info.Summary)
	assert.Equal(t, "1.0.0", result.Collection.Info.Version)
	require.Len(t, result.Collection.Info.Authors, 1)
	assert.Equal(t, "Dave", result.Collection.Info.Authors[0].Name)
	assert.Equal(t, "dave@pb33f.io", result.Collection.Info.Authors[0].Email)

	// collection-level auth
	require.NotNil(t, result.Collection.Request)
	require.NotNil(t, result.Collection.Request.Auth)
	assert.Equal(t, "bearer", result.Collection.Request.Auth.Type)

	// environments
	require.Len(t, result.Environments, 1)
	assert.Equal(t, "production", result.Environments[0].Name)
	require.True(t, len(result.Environments[0].Variables) >= 1)
	assert.Equal(t, "baseUrl", result.Environments[0].Variables[0].Name)
	assert.Equal(t, "https://api.petstore.io/v1", result.Environments[0].Variables[0].Value)

	// folders - one "pets" folder
	require.Len(t, result.Folders, 1)
	assert.Equal(t, "pets", result.Folders[0].Folder.Info.Name)
	assert.Equal(t, "pets", result.Folders[0].DirName)

	// requests
	require.Len(t, result.Folders[0].Requests, 3)

	listPets := result.Folders[0].Requests[0]
	assert.Equal(t, "List all pets", listPets.Info.Name)
	assert.Equal(t, "http", listPets.Info.Type)
	assert.Equal(t, "GET", listPets.HTTP.Method)
	assert.Equal(t, "{{baseUrl}}/pets", listPets.HTTP.URL)
	assert.Equal(t, "inherit", listPets.HTTP.Auth)

	// query param
	require.NotEmpty(t, listPets.HTTP.Params)
	found := false
	for _, p := range listPets.HTTP.Params {
		if p.Name == "limit" {
			found = true
			assert.Equal(t, "query", p.Type)
		}
	}
	assert.True(t, found, "limit query param should exist")

	createPet := result.Folders[0].Requests[1]
	assert.Equal(t, "Create a pet", createPet.Info.Name)
	assert.Equal(t, "POST", createPet.HTTP.Method)
	require.NotNil(t, createPet.HTTP.Body)
	assert.Equal(t, "json", createPet.HTTP.Body.Type)

	getPet := result.Folders[0].Requests[2]
	assert.Equal(t, "Get a pet", getPet.Info.Name)
	assert.Equal(t, "{{baseUrl}}/pets/:petId", getPet.HTTP.URL)

	// path param
	require.NotEmpty(t, getPet.HTTP.Params)
	found = false
	for _, p := range getPet.HTTP.Params {
		if p.Name == "petId" {
			found = true
			assert.Equal(t, "path", p.Type)
			assert.Equal(t, "{{petId}}", p.Value)
		}
	}
	assert.True(t, found, "petId path param should exist")
}

func TestGenerate_NoTags(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Minimal API
  version: "0.1.0"
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK
  /status:
    get:
      summary: Status
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// all operations should go to "default" folder
	require.Len(t, result.Folders, 1)
	assert.Equal(t, "default", result.Folders[0].Folder.Info.Name)
	assert.Len(t, result.Folders[0].Requests, 2)
}

func TestGenerate_SecurityInheritance(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Auth API
  version: "1.0.0"
security:
  - apiKeyAuth: []
paths:
  /protected:
    get:
      summary: Protected endpoint
      responses:
        '200':
          description: OK
components:
  securitySchemes:
    apiKeyAuth:
      type: apiKey
      name: X-API-Key
      in: header
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// collection-level auth should be apikey
	require.NotNil(t, result.Collection.Request)
	require.NotNil(t, result.Collection.Request.Auth)
	assert.Equal(t, "apikey", result.Collection.Request.Auth.Type)
	assert.Equal(t, "X-API-Key", result.Collection.Request.Auth.Key)
	assert.Equal(t, "header", result.Collection.Request.Auth.Placement)

	// operation should inherit
	require.Len(t, result.Folders, 1)
	assert.Equal(t, "inherit", result.Folders[0].Requests[0].HTTP.Auth)
}

func TestGenerate_SecurityNone(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Mixed Auth API
  version: "1.0.0"
security:
  - bearerAuth: []
paths:
  /public:
    get:
      summary: Public endpoint
      security: []
      responses:
        '200':
          description: OK
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	require.Len(t, result.Folders, 1)
	assert.Equal(t, "none", result.Folders[0].Requests[0].HTTP.Auth)
}

func TestGenerate_OperationSecurityOverride(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Override Auth API
  version: "1.0.0"
security:
  - bearerAuth: []
paths:
  /special:
    get:
      summary: Special endpoint
      security:
        - apiKeyAuth: []
      responses:
        '200':
          description: OK
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
    apiKeyAuth:
      type: apiKey
      name: X-Special-Key
      in: header
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// collection should have bearer
	assert.Equal(t, "bearer", result.Collection.Request.Auth.Type)

	// operation should override with apikey
	require.Len(t, result.Folders, 1)
	auth, ok := result.Folders[0].Requests[0].HTTP.Auth.(*Auth)
	require.True(t, ok)
	assert.Equal(t, "apikey", auth.Type)
	assert.Equal(t, "X-Special-Key", auth.Key)
}

func TestGenerate_NoServers(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: No Servers
  version: "1.0.0"
paths:
  /test:
    get:
      summary: Test
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                drDoc,
		GenerateEnvironments: true,
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// should have a default environment
	require.Len(t, result.Environments, 1)
	assert.Equal(t, "default", result.Environments[0].Name)
	assert.Equal(t, "baseUrl", result.Environments[0].Variables[0].Name)
	assert.Equal(t, "http://localhost", result.Environments[0].Variables[0].Value)
}

func TestGenerate_PathParams(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Path Params
  version: "1.0.0"
paths:
  /users/{userId}/posts/{postId}:
    get:
      summary: Get user post
      operationId: getUserPost
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
        - name: postId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	req := result.Folders[0].Requests[0]
	assert.Equal(t, "{{baseUrl}}/users/:userId/posts/:postId", req.HTTP.URL)

	require.Len(t, req.HTTP.Params, 2)
	assert.Equal(t, "userId", req.HTTP.Params[0].Name)
	assert.Equal(t, "path", req.HTTP.Params[0].Type)
	assert.Equal(t, "{{userId}}", req.HTTP.Params[0].Value)
	assert.Equal(t, "postId", req.HTTP.Params[1].Name)
	assert.Equal(t, "path", req.HTTP.Params[1].Type)
	assert.Equal(t, "{{postId}}", req.HTTP.Params[1].Value)
}

func TestGenerate_RequestBodies(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Bodies
  version: "1.0.0"
paths:
  /json:
    post:
      summary: JSON body
      requestBody:
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: OK
  /xml:
    post:
      summary: XML body
      requestBody:
        content:
          application/xml:
            schema:
              type: object
      responses:
        '200':
          description: OK
  /form:
    post:
      summary: Form body
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	require.Len(t, result.Folders, 1)
	requests := result.Folders[0].Requests
	require.Len(t, requests, 3)

	require.NotNil(t, requests[0].HTTP.Body)
	assert.Equal(t, "json", requests[0].HTTP.Body.Type)

	require.NotNil(t, requests[1].HTTP.Body)
	assert.Equal(t, "xml", requests[1].HTTP.Body.Type)

	require.NotNil(t, requests[2].HTTP.Body)
	assert.Equal(t, "form-urlencoded", requests[2].HTTP.Body.Type)
}

func TestGenerate_HeaderParams(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Headers
  version: "1.0.0"
paths:
  /test:
    get:
      summary: Test
      parameters:
        - name: X-Request-Id
          in: header
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	req := result.Folders[0].Requests[0]

	// header params should be in headers, not params
	for _, p := range req.HTTP.Params {
		assert.NotEqual(t, "X-Request-Id", p.Name, "header param should not be in params")
	}

	found := false
	for _, h := range req.HTTP.Headers {
		if h.Name == "X-Request-Id" {
			found = true
		}
	}
	assert.True(t, found, "X-Request-Id should be in headers")
}

func TestGenerate_MultipleContentTypes(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Multi Content
  version: "1.0.0"
paths:
  /test:
    post:
      summary: Multi content type
      requestBody:
        content:
          application/xml:
            schema:
              type: object
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// json should be preferred over xml
	req := result.Folders[0].Requests[0]
	require.NotNil(t, req.HTTP.Body)
	assert.Equal(t, "json", req.HTTP.Body.Type)

	foundContentType := false
	for _, header := range req.HTTP.Headers {
		if header.Name == "Content-Type" {
			foundContentType = true
			assert.Equal(t, "application/json", header.Value)
		}
	}
	assert.True(t, foundContentType, "request should include Content-Type for selected body")
}

func TestGenerate_CollectionNameOverride(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Original Name
  version: "1.0.0"
paths:
  /test:
    get:
      summary: Test
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:          drDoc,
		CollectionName: "Custom Collection",
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	assert.Equal(t, "Custom Collection", result.Collection.Info.Name)
}

func TestGenerate_MultipleTags(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Multi Tags
  version: "1.0.0"
paths:
  /pets:
    get:
      summary: List pets
      tags:
        - pets
        - animals
      responses:
        '200':
          description: OK
  /users:
    get:
      summary: List users
      tags:
        - users
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// first tag wins for folder placement
	require.Len(t, result.Folders, 2)
	assert.Equal(t, "pets", result.Folders[0].Folder.Info.Name)
	assert.Equal(t, "users", result.Folders[1].Folder.Info.Name)

	// but all tags are preserved in request info
	assert.Equal(t, []string{"pets", "animals"}, result.Folders[0].Requests[0].Info.Tags)
}

func TestGenerate_SecurityEmptyRequirementObject(t *testing.T) {
	// security: [{}, {bearerAuth: []}] at document level means anonymous is allowed.
	// security: [{}] on operation means anonymous override.
	spec := `openapi: "3.1.0"
info:
  title: Empty Requirement
  version: "1.0.0"
security:
  - {}
  - bearerAuth: []
paths:
  /public:
    get:
      summary: Public endpoint
      security:
        - {}
      responses:
        '200':
          description: OK
  /inherited:
    get:
      summary: Inherited endpoint
      responses:
        '200':
          description: OK
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// collection-level auth should be nil (anonymous allowed via empty {})
	assert.Nil(t, result.Collection.Request, "empty {} in document security means no collection auth")

	// operation with security: [{}] should be "none"
	require.Len(t, result.Folders, 1)
	require.Len(t, result.Folders[0].Requests, 2)
	assert.Equal(t, "none", result.Folders[0].Requests[0].HTTP.Auth)

	// operation with no security field should inherit
	assert.Equal(t, "inherit", result.Folders[0].Requests[1].HTTP.Auth)
}

func TestGenerate_FolderSlugDedup(t *testing.T) {
	// tags that normalize to the same slug should get deduplicated directory names
	spec := `openapi: "3.1.0"
info:
  title: Slug Dedup
  version: "1.0.0"
paths:
  /a:
    get:
      summary: First
      tags:
        - Foo Bar
      responses:
        '200':
          description: OK
  /b:
    get:
      summary: Second
      tags:
        - foo-bar
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	require.Len(t, result.Folders, 2)
	// both tags slugify to "foo-bar", second should get a suffix
	assert.Equal(t, "foo-bar", result.Folders[0].DirName)
	assert.Equal(t, "foo-bar-2", result.Folders[1].DirName)
}

func TestGenerate_IdempotentReuse(t *testing.T) {
	// calling Generate() twice on the same Frank should produce identical results
	spec := `openapi: "3.1.0"
info:
  title: Reuse Test
  version: "1.0.0"
servers:
  - url: https://api.example.com
    description: Production
paths:
  /test:
    get:
      summary: Test
      tags:
        - test
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                drDoc,
		GenerateEnvironments: true,
	})
	require.NoError(t, err)

	result1, err := f.Generate()
	require.NoError(t, err)

	result2, err := f.Generate()
	require.NoError(t, err)

	// should not accumulate state
	assert.Len(t, result2.Folders, len(result1.Folders))
	assert.Len(t, result2.Environments, len(result1.Environments))
	assert.Equal(t, len(result1.Folders[0].Requests), len(result2.Folders[0].Requests))
}

func TestNewFrank_NilConfig(t *testing.T) {
	_, err := KnowWhatIMeanArry(nil)
	assert.Error(t, err)
}

func TestNewFrank_NilDrDoc(t *testing.T) {
	_, err := KnowWhatIMeanArry(&FrankConfig{})
	assert.Error(t, err)
}

func TestGenerate_ServerVariables(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Server Vars
  version: "1.0.0"
servers:
  - url: https://{region}.api.example.com/{version}
    description: Regionalized
    variables:
      region:
        default: us-east
        enum:
          - us-east
          - eu-west
      version:
        default: v2
paths:
  /test:
    get:
      summary: Test
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                drDoc,
		GenerateEnvironments: true,
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	require.Len(t, result.Environments, 1)
	env := result.Environments[0]
	require.True(t, len(env.Variables) >= 3)
	assert.Equal(t, "baseUrl", env.Variables[0].Name)
	assert.Equal(t, "https://{{region}}.api.example.com/{{version}}", env.Variables[0].Value)
	// server variables should be included
	varNames := make(map[string]string)
	for _, v := range env.Variables {
		varNames[v.Name] = v.Value
	}
	assert.Equal(t, "us-east", varNames["region"])
	assert.Equal(t, "v2", varNames["version"])
}

func TestGenerate_ObjectExampleBecomesJSON(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Example Body
  version: "1.0.0"
paths:
  /pets:
    post:
      summary: Create pet
      operationId: createPet
      requestBody:
        content:
          application/json:
            example:
              name: Fido
              breed: Labrador
            schema:
              type: object
      responses:
        '201':
          description: Created
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	require.Len(t, result.Folders, 1)
	req := result.Folders[0].Requests[0]
	require.NotNil(t, req.HTTP.Body)
	// body data should be valid JSON, not a serialized yaml.Node struct
	assert.Contains(t, req.HTTP.Body.Data, `"name"`)
	assert.Contains(t, req.HTTP.Body.Data, `"Fido"`)
	assert.NotContains(t, req.HTTP.Body.Data, "Kind", "should not contain yaml.Node struct fields")
	assert.NotContains(t, req.HTTP.Body.Data, "Style", "should not contain yaml.Node struct fields")
}

func TestGenerate_SecurityReversedEmptyRequirement(t *testing.T) {
	// security: [{bearerAuth: []}, {}] — empty {} appears after bearerAuth
	// anonymous should still be allowed because requirements are OR-ed
	spec := `openapi: "3.1.0"
info:
  title: Reversed Empty Requirement
  version: "1.0.0"
security:
  - bearerAuth: []
  - {}
paths:
  /public:
    get:
      summary: Public endpoint
      security:
        - bearerAuth: []
        - {}
      responses:
        '200':
          description: OK
  /inherited:
    get:
      summary: Inherited endpoint
      responses:
        '200':
          description: OK
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	// collection-level auth should be nil (anonymous allowed via empty {})
	assert.Nil(t, result.Collection.Request, "reversed empty {} in document security means no collection auth")

	// operation with security: [{bearerAuth: []}, {}] should be "none"
	require.Len(t, result.Folders, 1)
	require.Len(t, result.Folders[0].Requests, 2)
	assert.Equal(t, "none", result.Folders[0].Requests[0].HTTP.Auth)

	// operation with no security field should inherit
	assert.Equal(t, "inherit", result.Folders[0].Requests[1].HTTP.Auth)
}

func TestGenerate_AcceptPrefers2xx(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Accept Header
  version: "1.0.0"
paths:
  /test:
    get:
      summary: Test
      responses:
        '400':
          description: Bad Request
          content:
            text/plain:
              schema:
                type: string
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{DrDoc: drDoc})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	req := result.Folders[0].Requests[0]
	var acceptVal string
	for _, h := range req.HTTP.Headers {
		if h.Name == "Accept" {
			acceptVal = h.Value
		}
	}
	assert.Equal(t, "application/json", acceptVal, "Accept should prefer 2xx content type over 4xx")
}

func TestGenerate_EnvironmentDedupThreeCollisions(t *testing.T) {
	spec := `openapi: "3.1.0"
info:
  title: Env Dedup
  version: "1.0.0"
servers:
  - url: https://api1.example.com
    description: Production
  - url: https://api2.example.com
    description: Production
  - url: https://api3.example.com
    description: Production
paths:
  /test:
    get:
      summary: Test
      responses:
        '200':
          description: OK
`
	drDoc := buildDrDoc(t, spec)
	f, err := KnowWhatIMeanArry(&FrankConfig{
		DrDoc:                drDoc,
		GenerateEnvironments: true,
	})
	require.NoError(t, err)

	result, err := f.Generate()
	require.NoError(t, err)

	require.Len(t, result.Environments, 3)
	names := make(map[string]bool)
	for _, env := range result.Environments {
		assert.False(t, names[env.Name], "duplicate environment name: %s", env.Name)
		names[env.Name] = true
	}
	assert.Equal(t, "production", result.Environments[0].Name)
	assert.Equal(t, "production-2", result.Environments[1].Name)
	assert.Equal(t, "production-3", result.Environments[2].Name)
}

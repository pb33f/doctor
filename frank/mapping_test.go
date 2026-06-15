// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package frank

import (
	"log/slog"
	"testing"

	highBase "github.com/pb33f/libopenapi/datamodel/high/base"
	highV3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/libopenapi/orderedmap"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
	"go.yaml.in/yaml/v4"
)

var testLog = slog.Default()

func TestSlugify(t *testing.T) {
	tests := []struct {
		in, out string
	}{
		{"Hello World", "hello-world"},
		{"get /users/{id}", "get-users-id"},
		{"camelCase", "camelcase"},
		{"  leading trailing  ", "leading-trailing"},
		{"multiple---dashes", "multiple-dashes"},
		{"special!@#chars", "special-chars"},
		{"", ""},
	}
	for _, tt := range tests {
		t.Run(tt.in, func(t *testing.T) {
			assert.Equal(t, tt.out, slugify(tt.in))
		})
	}
}

func TestHumanizeOperationId(t *testing.T) {
	tests := []struct {
		in, out string
	}{
		{"listPets", "List Pets"},
		{"getUserById", "Get User By Id"},
		{"create_api_key", "Create Api Key"},
		{"delete-user", "Delete User"},
		{"", ""},
		{"simple", "Simple"},
		{"URL", "Url"},
	}
	for _, tt := range tests {
		t.Run(tt.in, func(t *testing.T) {
			assert.Equal(t, tt.out, humanizeOperationId(tt.in))
		})
	}
}

func TestBuildRequestName(t *testing.T) {
	assert.Equal(t, "List all pets", buildRequestName("List all pets", "listPets", "get", "/pets"))
	assert.Equal(t, "List Pets", buildRequestName("", "listPets", "get", "/pets"))
	assert.Equal(t, "GET /pets", buildRequestName("", "", "get", "/pets"))
}

func TestBuildURL(t *testing.T) {
	assert.Equal(t, "{{baseUrl}}/pets", buildURL("/pets"))
	assert.Equal(t, "{{baseUrl}}/pets/:petId", buildURL("/pets/{petId}"))
	assert.Equal(t, "{{baseUrl}}/users/:userId/orders/:orderId", buildURL("/users/{userId}/orders/{orderId}"))
}

func TestRenderServerURLTemplate(t *testing.T) {
	assert.Equal(t, "https://{{region}}.api.example.com/{{version}}", renderServerURLTemplate("https://{region}.api.example.com/{version}"))
	assert.Equal(t, "https://{{region_id}}.api.example.com", renderServerURLTemplate("https://{region-id}.api.example.com"))
}

func TestBuildRequestFileName(t *testing.T) {
	assert.Equal(t, "listpets", buildRequestFileName("listPets", "get", "/pets"))
	assert.Equal(t, "get-pets", buildRequestFileName("", "get", "/pets"))
	assert.Equal(t, "get-pets-petid", buildRequestFileName("", "get", "/pets/{petId}"))
}

func TestMapContentType(t *testing.T) {
	tests := []struct {
		in, out string
	}{
		{"application/json", "json"},
		{"application/xml", "xml"},
		{"application/x-www-form-urlencoded", "form-urlencoded"},
		{"multipart/form-data", "multipart-form"},
		{"text/plain", "text"},
		{"text/html", "text"},
		{"application/octet-stream", "text"},
	}
	for _, tt := range tests {
		t.Run(tt.in, func(t *testing.T) {
			assert.Equal(t, tt.out, mapContentType(tt.in))
		})
	}
}

func TestMapSecuritySchemeToAuth_Bearer(t *testing.T) {
	scheme := &highV3.SecurityScheme{Type: "http", Scheme: "bearer"}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "bearer", auth.Type)
	assert.Equal(t, "{{token}}", auth.Token)
}

func TestMapSecuritySchemeToAuth_Basic(t *testing.T) {
	scheme := &highV3.SecurityScheme{Type: "http", Scheme: "basic"}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "basic", auth.Type)
	assert.Equal(t, "{{username}}", auth.Username)
	assert.Equal(t, "{{password}}", auth.Password)
}

func TestMapSecuritySchemeToAuth_ApiKey_Header(t *testing.T) {
	scheme := &highV3.SecurityScheme{Type: "apiKey", Name: "X-API-Key", In: "header"}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "apikey", auth.Type)
	assert.Equal(t, "X-API-Key", auth.Key)
	assert.Equal(t, "{{X_API_Key}}", auth.Value)
	assert.Equal(t, "header", auth.Placement)
}

func TestMapSecuritySchemeToAuth_ApiKey_Query(t *testing.T) {
	scheme := &highV3.SecurityScheme{Type: "apiKey", Name: "api_key", In: "query"}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "apikey", auth.Type)
	assert.Equal(t, "query", auth.Placement)
}

func TestMapSecuritySchemeToAuth_OAuth2_AuthCode(t *testing.T) {
	scopes := orderedmap.New[string, string]()
	scopes.Set("read", "read access")
	scopes.Set("write", "write access")
	scheme := &highV3.SecurityScheme{
		Type: "oauth2",
		Flows: &highV3.OAuthFlows{
			AuthorizationCode: &highV3.OAuthFlow{
				AuthorizationUrl: "https://example.com/auth",
				TokenUrl:         "https://example.com/token",
				Scopes:           scopes,
			},
		},
	}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "oauth2", auth.Type)
	assert.Equal(t, "authorization_code", auth.GrantType)
	assert.Equal(t, "https://example.com/auth", auth.AuthorizationURL)
	assert.Equal(t, "https://example.com/token", auth.TokenURL)
	assert.Equal(t, "read write", auth.Scope)
}

func TestMapSecuritySchemeToAuth_OAuth2_ClientCredentials(t *testing.T) {
	scheme := &highV3.SecurityScheme{
		Type: "oauth2",
		Flows: &highV3.OAuthFlows{
			ClientCredentials: &highV3.OAuthFlow{
				TokenUrl: "https://example.com/token",
			},
		},
	}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "client_credentials", auth.GrantType)
}

func TestMapSecuritySchemeToAuth_OAuth2_Password(t *testing.T) {
	scheme := &highV3.SecurityScheme{
		Type: "oauth2",
		Flows: &highV3.OAuthFlows{
			Password: &highV3.OAuthFlow{
				TokenUrl: "https://example.com/token",
			},
		},
	}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "password", auth.GrantType)
}

func TestMapSecuritySchemeToAuth_OAuth2_ImplicitFallback(t *testing.T) {
	scheme := &highV3.SecurityScheme{
		Type: "oauth2",
		Flows: &highV3.OAuthFlows{
			Implicit: &highV3.OAuthFlow{
				AuthorizationUrl: "https://example.com/auth",
			},
		},
	}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "authorization_code", auth.GrantType)
}

func TestMapSecuritySchemeToAuth_OpenIdConnect(t *testing.T) {
	scheme := &highV3.SecurityScheme{Type: "openIdConnect", OpenIdConnectUrl: "https://example.com/.well-known"}
	auth := mapSecuritySchemeToAuth(scheme, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "bearer", auth.Type)
	assert.Equal(t, "{{token}}", auth.Token)
}

func TestMapSecuritySchemeToAuth_Nil(t *testing.T) {
	assert.Nil(t, mapSecuritySchemeToAuth(nil, testLog))
}

func TestResolveCollectionAuth_FirstSchemeWins(t *testing.T) {
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("bearerAuth", &highV3.SecurityScheme{Type: "http", Scheme: "bearer"})
	schemes.Set("apiKey", &highV3.SecurityScheme{Type: "apiKey", Name: "X-API-Key", In: "header"})

	reqs := orderedmap.New[string, []string]()
	reqs.Set("bearerAuth", nil)

	security := []*highBase.SecurityRequirement{
		{Requirements: reqs},
	}

	auth := resolveCollectionAuth(security, schemes, testLog)
	require.NotNil(t, auth)
	assert.Equal(t, "bearer", auth.Type)
}

func TestResolveCollectionAuth_EmptyArray(t *testing.T) {
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("bearerAuth", &highV3.SecurityScheme{Type: "http", Scheme: "bearer"})

	auth := resolveCollectionAuth([]*highBase.SecurityRequirement{}, schemes, testLog)
	assert.Nil(t, auth)
}

func TestResolveCollectionAuth_EmptyRequirementObject(t *testing.T) {
	// security: [{}, {bearerAuth: []}] — empty object means anonymous is allowed
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("bearerAuth", &highV3.SecurityScheme{Type: "http", Scheme: "bearer"})

	bearerReqs := orderedmap.New[string, []string]()
	bearerReqs.Set("bearerAuth", nil)

	security := []*highBase.SecurityRequirement{
		{Requirements: orderedmap.New[string, []string]()}, // empty {} — anonymous
		{Requirements: bearerReqs},                         // bearerAuth
	}

	auth := resolveCollectionAuth(security, schemes, testLog)
	assert.Nil(t, auth, "empty requirement object should return nil (anonymous)")
}

func TestResolveCollectionAuth_NilSecurity(t *testing.T) {
	auth := resolveCollectionAuth(nil, nil, testLog)
	assert.Nil(t, auth)
}

func TestResolveOperationAuth_NilSecurity(t *testing.T) {
	result := resolveOperationAuth(nil, nil, nil, testLog)
	assert.Equal(t, "inherit", result)
}

func TestResolveOperationAuth_EmptyArray(t *testing.T) {
	result := resolveOperationAuth([]*highBase.SecurityRequirement{}, nil, nil, testLog)
	assert.Equal(t, "none", result)
}

func TestResolveOperationAuth_EmptyRequirementObject(t *testing.T) {
	// security: [{}] on an operation means anonymous (no auth required)
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("bearerAuth", &highV3.SecurityScheme{Type: "http", Scheme: "bearer"})

	opSecurity := []*highBase.SecurityRequirement{
		{Requirements: orderedmap.New[string, []string]()}, // empty {}
	}

	result := resolveOperationAuth(opSecurity, nil, schemes, testLog)
	assert.Equal(t, "none", result, "empty requirement object should produce auth: none")
}

func TestResolveOperationAuth_Override(t *testing.T) {
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("apiKey", &highV3.SecurityScheme{Type: "apiKey", Name: "key", In: "header"})

	reqs := orderedmap.New[string, []string]()
	reqs.Set("apiKey", nil)

	opSecurity := []*highBase.SecurityRequirement{
		{Requirements: reqs},
	}

	result := resolveOperationAuth(opSecurity, nil, schemes, testLog)
	auth, ok := result.(*Auth)
	require.True(t, ok)
	assert.Equal(t, "apikey", auth.Type)
}

func TestBuildParams_MergeAndDedup(t *testing.T) {
	opParams := []*highV3.Parameter{
		{Name: "limit", In: "query"},
		{Name: "id", In: "path"},
	}
	piParams := []*highV3.Parameter{
		{Name: "limit", In: "query"},     // should be deduped
		{Name: "format", In: "query"},    // should be included
		{Name: "X-Custom", In: "header"}, // should be excluded
	}

	result := buildParams(opParams, piParams)
	assert.Len(t, result, 3)
	assert.Equal(t, "limit", result[0].Name)
	assert.Equal(t, "query", result[0].Type)
	assert.Equal(t, "id", result[1].Name)
	assert.Equal(t, "path", result[1].Type)
	assert.Equal(t, "format", result[2].Name)
}

func TestBuildParams_HeaderParamsExcluded(t *testing.T) {
	params := []*highV3.Parameter{
		{Name: "X-Request-Id", In: "header"},
		{Name: "session", In: "cookie"},
	}
	result := buildParams(params, nil)
	assert.Len(t, result, 0)
}

func TestBuildHeaders_IncludesHeaderParams(t *testing.T) {
	opParams := []*highV3.Parameter{
		{Name: "X-Request-Id", In: "header"},
		{Name: "limit", In: "query"},
	}
	result := buildHeaders(opParams, nil, nil, nil)
	assert.Len(t, result, 1)
	assert.Equal(t, "X-Request-Id", result[0].Name)
}

func TestBuildHeaders_ContentTypeMatchesSelectedBody(t *testing.T) {
	content := orderedmap.New[string, *highV3.MediaType]()
	content.Set("application/xml", &highV3.MediaType{})
	content.Set("application/json", &highV3.MediaType{})

	selected := selectRequestBody(&highV3.RequestBody{Content: content})
	headers := buildHeaders(nil, nil, selected, nil)
	require.Len(t, headers, 1)
	assert.Equal(t, "Content-Type", headers[0].Name)
	assert.Equal(t, "application/json", headers[0].Value)

	body := buildBody(selected)
	require.NotNil(t, body)
	assert.Equal(t, "json", body.Type)
}

func TestDeriveEnvironmentName(t *testing.T) {
	assert.Equal(t, "production-server", deriveEnvironmentName("https://api.example.com/v1", "Production Server"))
	assert.Equal(t, "api-example-com", deriveEnvironmentName("https://api.example.com/v1", ""))
	assert.Equal(t, "localhost", deriveEnvironmentName("http://localhost:8080/api", ""))
	assert.Equal(t, "default", deriveEnvironmentName("", ""))
}

func TestSanitizeVarName(t *testing.T) {
	assert.Equal(t, "api_key", sanitizeVarName("api-key"))
	assert.Equal(t, "X_API_Key", sanitizeVarName("X-API-Key"))
	assert.Equal(t, "simple", sanitizeVarName("simple"))
}

func TestRenderYAMLNode_ScalarNode(t *testing.T) {
	node := &yaml.Node{Kind: yaml.ScalarNode, Value: "hello"}
	assert.Equal(t, "hello", renderYAMLNode(node))
}

func TestRenderYAMLNode_MappingNode(t *testing.T) {
	// build a mapping node: {"name": "Fido", "breed": "Labrador"}
	node := &yaml.Node{
		Kind: yaml.MappingNode,
		Content: []*yaml.Node{
			{Kind: yaml.ScalarNode, Value: "name"},
			{Kind: yaml.ScalarNode, Value: "Fido"},
			{Kind: yaml.ScalarNode, Value: "breed"},
			{Kind: yaml.ScalarNode, Value: "Labrador"},
		},
	}
	result := renderYAMLNode(node)
	assert.Contains(t, result, `"name"`)
	assert.Contains(t, result, `"Fido"`)
	assert.Contains(t, result, `"breed"`)
	assert.Contains(t, result, `"Labrador"`)
}

func TestRenderYAMLNode_SequenceNode(t *testing.T) {
	node := &yaml.Node{
		Kind: yaml.SequenceNode,
		Content: []*yaml.Node{
			{Kind: yaml.ScalarNode, Value: "a"},
			{Kind: yaml.ScalarNode, Value: "b"},
		},
	}
	result := renderYAMLNode(node)
	assert.Equal(t, `["a","b"]`, result)
}

func TestResolveCollectionAuth_ReversedEmptyRequirement(t *testing.T) {
	// security: [{bearerAuth: []}, {}] — empty object anywhere means anonymous
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("bearerAuth", &highV3.SecurityScheme{Type: "http", Scheme: "bearer"})

	bearerReqs := orderedmap.New[string, []string]()
	bearerReqs.Set("bearerAuth", nil)

	security := []*highBase.SecurityRequirement{
		{Requirements: bearerReqs},                         // bearerAuth first
		{Requirements: orderedmap.New[string, []string]()}, // empty {} second
	}

	auth := resolveCollectionAuth(security, schemes, testLog)
	assert.Nil(t, auth, "empty {} anywhere in security list should return nil (anonymous)")
}

func TestResolveOperationAuth_ReversedEmptyRequirement(t *testing.T) {
	// security: [{bearerAuth: []}, {}] on operation — empty {} anywhere means none
	schemes := orderedmap.New[string, *highV3.SecurityScheme]()
	schemes.Set("bearerAuth", &highV3.SecurityScheme{Type: "http", Scheme: "bearer"})

	bearerReqs := orderedmap.New[string, []string]()
	bearerReqs.Set("bearerAuth", nil)

	opSecurity := []*highBase.SecurityRequirement{
		{Requirements: bearerReqs},                         // bearerAuth first
		{Requirements: orderedmap.New[string, []string]()}, // empty {} second
	}

	result := resolveOperationAuth(opSecurity, nil, schemes, testLog)
	assert.Equal(t, "none", result, "empty {} anywhere in op security should return none")
}

func TestBuildHeaders_Accept4xxBefore2xx(t *testing.T) {
	// 400 text/plain appears before 200 application/json — Accept should be application/json
	codes := orderedmap.New[string, *highV3.Response]()

	textContent := orderedmap.New[string, *highV3.MediaType]()
	textContent.Set("text/plain", &highV3.MediaType{})
	codes.Set("400", &highV3.Response{Content: textContent})

	jsonContent := orderedmap.New[string, *highV3.MediaType]()
	jsonContent.Set("application/json", &highV3.MediaType{})
	codes.Set("200", &highV3.Response{Content: jsonContent})

	responses := &highV3.Responses{Codes: codes}
	headers := buildHeaders(nil, nil, nil, responses)

	var acceptVal string
	for _, h := range headers {
		if h.Name == "Accept" {
			acceptVal = h.Value
		}
	}
	assert.Equal(t, "application/json", acceptVal, "Accept should prefer 2xx content type")
}

func TestBuildHeaders_AcceptMultiple2xxPreference(t *testing.T) {
	// 200 text/xml, 201 application/json — Accept should prefer JSON per contentTypePreference
	codes := orderedmap.New[string, *highV3.Response]()

	xmlContent := orderedmap.New[string, *highV3.MediaType]()
	xmlContent.Set("text/xml", &highV3.MediaType{})
	codes.Set("200", &highV3.Response{Content: xmlContent})

	jsonContent := orderedmap.New[string, *highV3.MediaType]()
	jsonContent.Set("application/json", &highV3.MediaType{})
	codes.Set("201", &highV3.Response{Content: jsonContent})

	responses := &highV3.Responses{Codes: codes}
	headers := buildHeaders(nil, nil, nil, responses)

	var acceptVal string
	for _, h := range headers {
		if h.Name == "Accept" {
			acceptVal = h.Value
		}
	}
	assert.Equal(t, "application/json", acceptVal, "Accept should follow contentTypePreference order")
}

func TestSelectPreferredContentType(t *testing.T) {
	assert.Equal(t, "application/json", selectPreferredContentType([]string{"text/xml", "application/json"}))
	assert.Equal(t, "text/xml", selectPreferredContentType([]string{"text/xml", "text/plain"}))
	assert.Equal(t, "application/octet-stream", selectPreferredContentType([]string{"application/octet-stream"}))
	assert.Equal(t, "", selectPreferredContentType(nil))
}

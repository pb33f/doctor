package printingpress

import (
	"strings"
	"testing"

	. "github.com/pb33f/doctor/printingpress/curl"
	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBuildCurlCommandsBasicGet(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/burgers/{id}",
		Parameters: []*ParameterInfo{
			{Name: "id", In: "path", SchemaJSON: `{"type":"string","example":"abc123"}`},
			{Name: "limit", In: "query", SchemaJSON: `{"type":"integer","default":10}`},
		},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, nil)
	require.Len(t, variants, 1)

	cmd := variants[0].Command
	assert.Contains(t, cmd, "curl")
	assert.NotContains(t, cmd, "-X GET")
	assert.Contains(t, cmd, "'https://api.example.com/burgers/abc123?limit=10'")
}

func TestBuildCurlCommandsPostJSONBody(t *testing.T) {
	op := &OperationPage{
		Method: "POST",
		Path:   "/burgers",
		RequestBody: &RequestBodyInfo{
			Content: []*MediaTypeInfo{
				{MediaType: "application/json", MockJSON: "{\n  \"name\": \"cheese\"\n}"},
			},
		},
		Responses: []*ResponseInfo{
			{StatusCode: "201", Content: []*MediaTypeInfo{{MediaType: "application/json"}}},
		},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, nil)
	require.Len(t, variants, 1)

	cmd := variants[0].Command
	assert.Contains(t, cmd, "curl -X POST")
	assert.Contains(t, cmd, "-H 'Content-Type: application/json'")
	assert.Contains(t, cmd, "-H 'Accept: application/json'")
	assert.Contains(t, cmd, `-d '{"name":"cheese"}'`)
}

func TestBuildCurlCommandsJSONPatchUsesDerivedPayloadAndContentType(t *testing.T) {
	op := &OperationPage{
		Method: "PATCH",
		Path:   "/auth-org/lockout-config",
		RequestBody: &RequestBodyInfo{
			Content: []*MediaTypeInfo{
				{
					MediaType: "application/json-patch+json",
					MockJSON:  `[{"op":"replace","path":"/maximumAttempts","value":"7,"},{"op":"add","path":"/lockoutDuration","value":35}]`,
				},
			},
		},
		Responses: []*ResponseInfo{
			{
				StatusCode: "200",
				Content: []*MediaTypeInfo{
					{
						MediaType:  "application/json",
						SchemaJSON: `{"type":"object","properties":{"lockoutDuration":{"type":"integer","example":15},"lockoutWindow":{"type":"integer","example":5},"maximumAttempts":{"type":"integer","example":5}}}`,
						MockJSON:   `{"lockoutDuration":15,"lockoutWindow":5,"maximumAttempts":5}`,
					},
				},
			},
		},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, nil)
	require.Len(t, variants, 1)

	cmd := variants[0].Command
	assert.Contains(t, cmd, "-H 'Content-Type: application/json-patch+json'")
	assert.Contains(t, cmd, `-d '[{"op":"replace","path":"/maximumAttempts","value":5},{"op":"replace","path":"/lockoutDuration","value":15}]'`)
	assert.NotContains(t, cmd, `"7,"`)
}

func TestBuildCurlCommandsSecurityGroupsCreateVariants(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/burgers",
	}
	globalSecurity := []*SecurityRequirementGroup{
		{Requirements: []*SecurityRequirement{{SchemeType: "http", Scheme: "bearer", Name: "bearerAuth"}}},
		{Requirements: []*SecurityRequirement{{SchemeType: "apiKey", In: "header", ParameterName: "X-Api-Key", Name: "apiKeyAuth"}}},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, globalSecurity)
	require.Len(t, variants, 2)
	assert.Contains(t, variants[0].Command+variants[1].Command, "Authorization: Bearer YOUR_TOKEN")
	assert.Contains(t, variants[0].Command+variants[1].Command, "X-Api-Key: YOUR_API_KEY")
}

func TestBuildCurlCommandsRespectsExplicitUnauthenticatedOverride(t *testing.T) {
	op := &OperationPage{
		Method:              "GET",
		Path:                "/burgers",
		HasSecurityOverride: true,
		SecurityGroups:      []*SecurityRequirementGroup{},
	}
	globalSecurity := []*SecurityRequirementGroup{
		{Requirements: []*SecurityRequirement{{SchemeType: "http", Scheme: "bearer", Name: "bearerAuth"}}},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, globalSecurity)
	require.Len(t, variants, 1)
	assert.NotContains(t, variants[0].Command, "Authorization: Bearer YOUR_TOKEN")
	assert.Equal(t, "No Auth", variants[0].SecurityLabel)
}

func TestBuildCurlCommandsGroupedAndSecurityUsesSingleCommand(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/burgers",
	}
	group := []*SecurityRequirementGroup{
		{Requirements: []*SecurityRequirement{
			{SchemeType: "http", Scheme: "bearer", Name: "bearerAuth"},
			{SchemeType: "apiKey", In: "header", ParameterName: "X-Api-Key", Name: "apiKeyAuth"},
		}},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, group)
	require.Len(t, variants, 1)
	assert.Contains(t, variants[0].Command, "Authorization: Bearer YOUR_TOKEN")
	assert.Contains(t, variants[0].Command, "X-Api-Key: YOUR_API_KEY")
	assert.Equal(t, "Bearer Auth + apiKeyAuth", variants[0].SecurityLabel)
}

func TestBuildCurlCommandsApiKeyLabelsUseDistinctNames(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/accounts",
	}
	group := []*SecurityRequirementGroup{
		{Requirements: []*SecurityRequirement{
			{SchemeType: "apiKey", In: "header", ParameterName: "X-Client-Id", Name: "clientId"},
			{SchemeType: "apiKey", In: "header", ParameterName: "X-Secret", Name: "secret"},
			{SchemeType: "apiKey", In: "header", ParameterName: "Plaid-Version", Name: "plaidVersion"},
		}},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{Description: "Production", URL: "https://api.example.com"}}, group)
	require.Len(t, variants, 1)
	assert.Equal(t, "clientId + secret + plaidVersion", variants[0].SecurityLabel)
}

func TestBuildCurlCommandsUsesServerVariables(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/burgers",
	}
	servers := []*ServerInfo{{
		URL: "https://{region}.api.example.com/{version}",
		Variables: []*ServerVariableInfo{
			{Name: "region", Default: "us"},
			{Name: "version", Enum: []string{"v1"}},
		},
	}}

	variants := BuildCurlCommands(op, servers, nil)
	require.Len(t, variants, 1)
	assert.Contains(t, variants[0].Command, "https://us.api.example.com/v1/burgers")
}

func TestBuildCurlCommandsEscapesSingleQuotesInJSONBody(t *testing.T) {
	op := &OperationPage{
		Method: "POST",
		Path:   "/burgers",
		RequestBody: &RequestBodyInfo{
			Content: []*MediaTypeInfo{
				{MediaType: "application/json", MockJSON: `{"name":"chef's special"}`},
			},
		},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, nil)
	require.Len(t, variants, 1)
	assert.Contains(t, variants[0].Command, `chef'\''s special`)
}

func TestBuildCurlCommandsOmitsBodyForGet(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/burgers",
		RequestBody: &RequestBodyInfo{
			Content: []*MediaTypeInfo{
				{MediaType: "application/json", MockJSON: `{"name":"cheese"}`},
			},
		},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, nil)
	require.Len(t, variants, 1)
	assert.NotContains(t, variants[0].Command, "-d ")
	assert.NotContains(t, variants[0].Command, "Content-Type")
}

func TestBuildCurlCommandsCombinesCookieValues(t *testing.T) {
	op := &OperationPage{
		Method: "GET",
		Path:   "/burgers",
		Parameters: []*ParameterInfo{
			{Name: "session", In: "cookie", SchemaJSON: `{"type":"string","default":"abc"}`},
		},
	}
	security := []*SecurityRequirementGroup{
		{Requirements: []*SecurityRequirement{{SchemeType: "apiKey", In: "cookie", ParameterName: "apiKey"}}},
	}

	variants := BuildCurlCommands(op, []*ServerInfo{{URL: "https://api.example.com"}}, security)
	require.Len(t, variants, 1)
	assert.Contains(t, variants[0].Command, "-b 'session=abc; apiKey=YOUR_API_KEY'")
}

func TestBuildCurlCommandsHandlesNilInputs(t *testing.T) {
	assert.Nil(t, BuildCurlCommands(nil, nil, nil))

	variants := BuildCurlCommands(&OperationPage{}, nil, nil)
	require.Len(t, variants, 1)
	assert.True(t, strings.Contains(variants[0].Command, "https://api.example.com"))
}

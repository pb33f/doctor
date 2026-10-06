package helpers_test

import (
	"strings"
	"testing"

	"github.com/pb33f/doctor/helpers"
	"github.com/pb33f/jsonschema/v6"
	"github.com/pb33f/testify/require"
)

func TestDiveIntoValidationError_ForkValidation(t *testing.T) {
	document, err := jsonschema.UnmarshalJSON(strings.NewReader(`{
		"type": "object",
		"properties": {"name": {"type": "string"}}
	}`))
	require.NoError(t, err)
	compiler := jsonschema.NewCompiler()
	const schemaURL = "https://example.com/schema.json"
	require.NoError(t, compiler.AddResource(schemaURL, document))
	schema, err := compiler.Compile(schemaURL)
	require.NoError(t, err)
	require.NoError(t, schema.Validate(map[string]any{"name": "valid"}))

	err = schema.Validate(map[string]any{"name": false})
	var validationError *jsonschema.ValidationError
	require.ErrorAs(t, err, &validationError)

	var causes []string
	helpers.DiveIntoValidationError(validationError, &causes, "name")
	require.Equal(t, []string{"type mismatch: got `boolean`, but want `string`"}, causes)

	var unrelatedCauses []string
	helpers.DiveIntoValidationError(validationError, &unrelatedCauses, "other")
	require.Empty(t, unrelatedCauses)
}

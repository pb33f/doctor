package v3

import (
	"testing"

	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/pb33f/testify/assert"
)

func TestExtractParameterValues_Nil(t *testing.T) {
	assert.Empty(t, ExtractParameterValues(nil))
}

func TestExtractParameterValues_Empty(t *testing.T) {
	assert.Empty(t, ExtractParameterValues([]*Parameter{}))
}

func TestExtractParameterValues_WithNilEntries(t *testing.T) {
	params := []*Parameter{nil, {Value: &v3.Parameter{Name: "id"}}, nil}
	result := ExtractParameterValues(params)
	assert.Len(t, result, 3)
	assert.Nil(t, result[0])
	assert.Equal(t, "id", result[1].Name)
	assert.Nil(t, result[2])
}

func TestExtractParameterValues_PreservesOrder(t *testing.T) {
	params := []*Parameter{
		{Value: &v3.Parameter{Name: "limit"}},
		{Value: &v3.Parameter{Name: "offset"}},
		{Value: &v3.Parameter{Name: "sort"}},
	}
	result := ExtractParameterValues(params)
	assert.Len(t, result, 3)
	assert.Equal(t, "limit", result[0].Name)
	assert.Equal(t, "offset", result[1].Name)
	assert.Equal(t, "sort", result[2].Name)
}

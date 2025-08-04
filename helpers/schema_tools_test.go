// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package helpers

import (
	"fmt"
	"testing"

	"github.com/santhosh-tekuri/jsonschema/v6"
	"github.com/santhosh-tekuri/jsonschema/v6/kind"
	"github.com/stretchr/testify/assert"
)

func TestDiveIntoValidationError_EmptyInstanceLocation(t *testing.T) {
	// Test case that reproduces the panic: empty InstanceLocation slice
	validationError := &jsonschema.ValidationError{
		InstanceLocation: []string{}, // Empty slice - this causes the panic
		ErrorKind: &kind.Type{
			Got:  "string",
			Want: []string{"number"},
		},
	}

	var causes []string
	
	// This should not panic
	assert.NotPanics(t, func() {
		DiveIntoValidationError(validationError, &causes, "")
	})
	
	// Should produce a meaningful error message
	assert.Len(t, causes, 1)
	assert.Contains(t, causes[0], "type mismatch")
}

func TestDiveIntoValidationError_NilInstanceLocation(t *testing.T) {
	// Test case with nil InstanceLocation
	validationError := &jsonschema.ValidationError{
		InstanceLocation: nil,
		ErrorKind: &kind.Enum{
			Got:  "invalid",
			Want: []any{"valid1", "valid2"},
		},
	}

	var causes []string
	
	// This should not panic
	assert.NotPanics(t, func() {
		DiveIntoValidationError(validationError, &causes, "")
	})
}

func TestDiveIntoValidationError_SingleElementInstanceLocation(t *testing.T) {
	// Test normal case with single element
	validationError := &jsonschema.ValidationError{
		InstanceLocation: []string{"property"},
		ErrorKind: &kind.Required{
			Missing: []string{"requiredField"},
		},
	}

	var causes []string
	
	assert.NotPanics(t, func() {
		DiveIntoValidationError(validationError, &causes, "property")
	})
	
	assert.Len(t, causes, 1)
	assert.Contains(t, causes[0], "missing a required property")
}

func TestDiveIntoValidationError_MultipleElementInstanceLocation(t *testing.T) {
	// Test normal case with multiple elements
	validationError := &jsonschema.ValidationError{
		InstanceLocation: []string{"parent", "child", "property"},
		ErrorKind: &kind.MinLength{
			Got:  5,
			Want: 10,
		},
	}

	var causes []string
	
	assert.NotPanics(t, func() {
		DiveIntoValidationError(validationError, &causes, "parent/child/property")
	})
	
	assert.Len(t, causes, 1)
	assert.Contains(t, causes[0], "must be at least")
	assert.Contains(t, causes[0], "property")
}

func TestDiveIntoValidationError_AllErrorKinds(t *testing.T) {
	// Test all error kinds that access InstanceLocation to ensure none panic
	testCases := []struct {
		name      string
		errorKind jsonschema.ErrorKind
		location  []string
	}{
		{
			name: "InvalidJsonValue with empty location",
			errorKind: &kind.InvalidJsonValue{
				Value: "invalid",
			},
			location: []string{},
		},
		{
			name: "Enum with empty location",
			errorKind: &kind.Enum{
				Got:  "invalid",
				Want: []any{"valid"},
			},
			location: []string{},
		},
		{
			name: "MinProperties with empty location",
			errorKind: &kind.MinProperties{
				Got:  1,
				Want: 3,
			},
			location: []string{},
		},
		{
			name: "MaxProperties with empty location",
			errorKind: &kind.MaxProperties{
				Got:  5,
				Want: 3,
			},
			location: []string{},
		},
		{
			name: "MinItems with empty location",
			errorKind: &kind.MinItems{
				Got:  1,
				Want: 3,
			},
			location: []string{},
		},
		{
			name: "MaxItems with empty location",
			errorKind: &kind.MaxItems{
				Got:  5,
				Want: 3,
			},
			location: []string{},
		},
		{
			name: "AdditionalItems with empty location",
			errorKind: &kind.AdditionalItems{
				Count: 2,
			},
			location: []string{},
		},
		{
			name: "AdditionalProperties with empty location",
			errorKind: &kind.AdditionalProperties{
				Properties: []string{"extra"},
			},
			location: []string{},
		},
		{
			name: "MinContains with empty location",
			errorKind: &kind.MinContains{
				Got:  []int{1},
				Want: 3,
			},
			location: []string{},
		},
		{
			name: "MaxContains with empty location",
			errorKind: &kind.MaxContains{
				Got:  []int{1, 2, 3, 4, 5},
				Want: 3,
			},
			location: []string{},
		},
		{
			name: "MinLength with empty location",
			errorKind: &kind.MinLength{
				Got:  5,
				Want: 10,
			},
			location: []string{},
		},
		{
			name: "MaxLength with empty location",
			errorKind: &kind.MaxLength{
				Got:  15,
				Want: 10,
			},
			location: []string{},
		},
		{
			name: "Pattern with empty location",
			errorKind: &kind.Pattern{
				Got:  "invalid",
				Want: "[a-z]+",
			},
			location: []string{},
		},
		{
			name: "ContentEncoding with empty location",
			errorKind: &kind.ContentEncoding{
				Want: "base64",
				Err:  fmt.Errorf("invalid encoding"),
			},
			location: []string{},
		},
		{
			name: "ContentMediaType with empty location",
			errorKind: &kind.ContentMediaType{
				Want: "application/json",
			},
			location: []string{},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			validationError := &jsonschema.ValidationError{
				InstanceLocation: tc.location,
				ErrorKind:        tc.errorKind,
			}

			var causes []string
			
			// None of these should panic
			assert.NotPanics(t, func() {
				DiveIntoValidationError(validationError, &causes, "")
			})
		})
	}
}

func TestDiveIntoValidationError_RecursiveCauses(t *testing.T) {
	// Test recursive causes with empty instance locations
	childError := &jsonschema.ValidationError{
		InstanceLocation: []string{}, // Empty - could cause panic
		ErrorKind: &kind.Type{
			Got:  "string",
			Want: []string{"number"},
		},
	}

	parentError := &jsonschema.ValidationError{
		InstanceLocation: []string{"parent"},
		ErrorKind:        &kind.Schema{Location: "/parent"},
		Causes:           []*jsonschema.ValidationError{childError},
	}

	var causes []string
	
	assert.NotPanics(t, func() {
		DiveIntoValidationError(parentError, &causes, "")
	})
}

func TestDiveIntoValidationError_ContentEncodingMessage(t *testing.T) {
	// Test that ContentEncoding produces a proper error message
	validationError := &jsonschema.ValidationError{
		InstanceLocation: []string{"field"},
		ErrorKind: &kind.ContentEncoding{
			Want: "base64",
			Err:  fmt.Errorf("invalid base64 encoding"),
		},
	}

	var causes []string
	
	assert.NotPanics(t, func() {
		DiveIntoValidationError(validationError, &causes, "field")
	})
	
	assert.Len(t, causes, 1)
	assert.Contains(t, causes[0], "must be correctly encoded with `base64`")
	assert.Contains(t, causes[0], "field")
}
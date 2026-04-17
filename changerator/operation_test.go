// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package changerator

import (
	"testing"

	doctorv3 "github.com/pb33f/doctor/model/high/v3"
	libv3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	wcmodel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
)

func TestMatchOperationParameterChange_PrefersNameAndInOverSliceOrder(t *testing.T) {
	parameters := []*doctorv3.Parameter{
		{Value: &libv3.Parameter{Name: "id", In: "path"}},
		{Value: &libv3.Parameter{Name: "id", In: "query"}},
	}

	change := &wcmodel.ParameterChanges{
		Name: "id",
		PropertyChanges: wcmodel.NewPropertyChanges([]*wcmodel.Change{
			{
				Property: "in",
				New:      "query",
			},
		}),
	}

	matched := matchOperationParameterChange(parameters, change, make([]bool, len(parameters)), 0)
	if assert.NotNil(t, matched) {
		assert.Equal(t, "id", matched.Value.Name)
		assert.Equal(t, "query", matched.Value.In)
	}
}

func TestMatchOperationParameterChange_FallsBackToNameWhenInIsUnchanged(t *testing.T) {
	parameters := []*doctorv3.Parameter{
		{Value: &libv3.Parameter{Name: "username", In: "query"}},
		{Value: &libv3.Parameter{Name: "password", In: "query"}},
	}

	change := &wcmodel.ParameterChanges{Name: "password"}

	matched := matchOperationParameterChange(parameters, change, make([]bool, len(parameters)), 0)
	if assert.NotNil(t, matched) {
		assert.Equal(t, "password", matched.Value.Name)
		assert.Equal(t, "query", matched.Value.In)
	}
}

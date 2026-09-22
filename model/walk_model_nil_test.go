// Copyright 2026 Princess Beef Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package model

import (
	"testing"

	"github.com/pb33f/libopenapi/datamodel/high"
	lowV3 "github.com/pb33f/libopenapi/datamodel/low/v3"
	"github.com/pb33f/testify/assert"
)

type typedNilOperation struct{}

var _ high.GoesLowUntyped = typedNilOperation{}

func (typedNilOperation) GoLowUntyped() any {
	var operation *lowV3.Operation
	return operation
}

func TestIsReferencedValueTypedNil(t *testing.T) {
	var operation *lowV3.Operation

	assert.NotPanics(t, func() {
		assert.False(t, isReferencedValue(operation))
	})
}

func TestIsReferenceInstanceTypedNilOperation(t *testing.T) {
	assert.NotPanics(t, func() {
		assert.False(t, isReferenceInstance(typedNilOperation{}))
	})
}

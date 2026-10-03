// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

// Package mocks wraps libopenapi's mock generator with the handling its three
// failure modes need: it panics on some inputs, it reports an exhausted work
// budget through a sentinel error rather than a failure, and it can return a
// payload far larger than a caller wants to embed.
package mocks

import (
	"errors"
	"fmt"

	"github.com/pb33f/libopenapi/renderer"
)

// WarnFunc reports a mock that was discarded. Callers decide whether that means
// logging, collecting a diagnostic, or both.
type WarnFunc func(message, context string, err error)

// SafeGenerate renders mockable, returning nil when the result has to be thrown
// away. label identifies the subject in any warning.
//
// A zero or negative maxBytes disables the size ceiling.
func SafeGenerate(
	gen *renderer.MockGenerator,
	mockable any,
	label string,
	maxBytes int,
	warn WarnFunc,
) (mock []byte, err error) {
	if gen == nil {
		return nil, nil
	}

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("mock generation panic")
			report(warn, "mock generation failed; omitting generated mock", label, fmt.Errorf("%v", r))
			mock = nil
		}
	}()

	mock, err = gen.GenerateMock(mockable, "")
	if err != nil {
		if errors.Is(err, renderer.ErrMockGenerationBudgetExceeded) {
			report(warn, "generated mock exceeded work budget; omitting generated mock", label, err)
		}
		return nil, err
	}
	if mock == nil {
		return mock, err
	}

	if maxBytes > 0 && len(mock) > maxBytes {
		report(warn, "generated mock exceeded byte limit; omitting generated mock", label,
			fmt.Errorf("generated mock is %d bytes; maximum is %d bytes", len(mock), maxBytes))
		return nil, nil
	}

	return mock, nil
}

func report(warn WarnFunc, message, label string, err error) {
	if warn == nil {
		return
	}
	warn(message, label, err)
}

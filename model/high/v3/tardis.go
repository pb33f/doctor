// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package v3

import (
	"context"
	"go.yaml.in/yaml/v4"
)

type ContextKey string

const Context ContextKey = "context"

// Doctor who?
type Doctor interface {
	LocateModelsByKeyAndValue(key, value *yaml.Node) ([]Foundational, error)
	LocateModel(node *yaml.Node) ([]Foundational, error)
	LocateModelByLine(line int) ([]Foundational, error)
}

// Tardis is a visitor pattern interface. Used in combination with Companion
type Tardis interface {

	// Visit visit any object that implements the Companion interface
	Visit(ctx context.Context, object any)

	// GetDoctor will call the doctor, are you ready for him is the question.
	GetDoctor() Doctor
}

// Companion is implemented by any visitable object. It allows the tardis to travel through it.
// The secret to the doctor, is his companion.
type Companion interface {
	Travel(ctx context.Context, tardis Tardis)
}

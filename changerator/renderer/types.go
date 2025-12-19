// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package renderer

// ChangeType categorizes the nature of a change.
type ChangeType int

const (
	ChangeTypeUnknown ChangeType = iota
	ChangeTypeAddition
	ChangeTypeModification
	ChangeTypeRemoval
	ChangeTypeBreaking
)

// String returns the string representation of the change type.
func (ct ChangeType) String() string {
	switch ct {
	case ChangeTypeAddition:
		return "addition"
	case ChangeTypeModification:
		return "modification"
	case ChangeTypeRemoval:
		return "removal"
	case ChangeTypeBreaking:
		return "breaking"
	default:
		return "unknown"
	}
}

// OutputFormat specifies the desired output format.
type OutputFormat int

const (
	OutputFormatMarkdown OutputFormat = iota
	OutputFormatHTML
)

// String returns the string representation of the output format.
func (of OutputFormat) String() string {
	switch of {
	case OutputFormatMarkdown:
		return "markdown"
	case OutputFormatHTML:
		return "html"
	default:
		return "unknown"
	}
}


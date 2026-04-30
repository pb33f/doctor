// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// SPDX-License-Identifier: MIT

package helpers

import (
	"strconv"
	"strings"
)

// Segment represents one path segment after URI-template parsing.
type Segment struct {
	Value     string
	IsVar     bool
	ParamName string
	ParamType string
	Operator  string
}

// TemplateSegment represents a parsed RFC 6570 URI template expression.
type TemplateSegment struct {
	Raw        string
	Operator   string
	Name       string
	Explode    bool
	Prefix     int
	IsVariable bool
}

// ParseTemplateSegment parses a single URI template segment.
func ParseTemplateSegment(segment string) TemplateSegment {
	ts := TemplateSegment{Raw: segment}

	if len(segment) < 3 || segment[0] != '{' || segment[len(segment)-1] != '}' {
		return ts
	}

	ts.IsVariable = true
	inner := segment[1 : len(segment)-1]

	if len(inner) > 0 {
		switch inner[0] {
		case '+', '#', '.', '/', ';', '?', '&':
			ts.Operator = string(inner[0])
			inner = inner[1:]
		}
	}

	if len(inner) > 0 && inner[len(inner)-1] == '*' {
		ts.Explode = true
		inner = inner[:len(inner)-1]
	}

	if colonIdx := strings.LastIndexByte(inner, ':'); colonIdx >= 0 {
		suffix := inner[colonIdx+1:]
		if n, err := strconv.Atoi(suffix); err == nil && n > 0 {
			ts.Prefix = n
			inner = inner[:colonIdx]
		}
	}

	ts.Name = inner
	return ts
}

// ParseSegments parses an OpenAPI path into comparable path segments. paramTypes
// maps path parameter names to JSON Schema types.
func ParseSegments(path string, paramTypes map[string]string) []Segment {
	n := 0
	for i := 1; i < len(path); i++ {
		if path[i] == '/' {
			n++
		}
	}
	n++
	segments := make([]Segment, 0, n)

	rest := path
	if len(rest) > 0 && rest[0] == '/' {
		rest = rest[1:]
	}
	for len(rest) > 0 {
		idx := strings.IndexByte(rest, '/')
		var part string
		if idx < 0 {
			part = rest
			rest = ""
		} else {
			part = rest[:idx]
			rest = rest[idx+1:]
		}

		seg := Segment{Value: part}
		tv := ParseTemplateSegment(part)
		if tv.IsVariable && tv.Name != "" {
			seg.IsVar = true
			seg.ParamName = tv.Name
			seg.Operator = tv.Operator
			if paramTypes != nil {
				seg.ParamType = paramTypes[seg.ParamName]
			}
		}
		segments = append(segments, seg)
	}
	return segments
}

// CheckPaths reports whether two OpenAPI path templates are ambiguous.
func CheckPaths(pathA, pathB string, paramsA, paramsB map[string]string) bool {
	return CompareSegments(ParseSegments(pathA, paramsA), ParseSegments(pathB, paramsB))
}

// CompareSegments reports whether two parsed path templates are ambiguous.
func CompareSegments(segsA, segsB []Segment) bool {
	if len(segsA) != len(segsB) {
		return false
	}

	hasVarLiteralMismatch := false

	for i := range segsA {
		a, b := &segsA[i], &segsB[i]

		if a.IsVar && b.IsVar {
			if a.Operator != b.Operator {
				return false
			}
			if a.ParamType != "" && b.ParamType != "" && !AreTypesCompatible(a.ParamType, b.ParamType) {
				return false
			}
		} else if !a.IsVar && !b.IsVar {
			if a.Value != b.Value {
				return false
			}
		} else {
			hasVarLiteralMismatch = true

			var varType, literal string
			if a.IsVar {
				varType, literal = a.ParamType, b.Value
			} else {
				varType, literal = b.ParamType, a.Value
			}

			if varType != "" && !CanLiteralMatchType(literal, varType) {
				return false
			}
		}
	}

	return !hasVarLiteralMismatch
}

// AreTypesCompatible reports whether two JSON Schema scalar types overlap for
// path ambiguity purposes.
func AreTypesCompatible(typeA, typeB string) bool {
	if typeA == typeB {
		return true
	}
	return (typeA == "integer" && typeB == "number") || (typeA == "number" && typeB == "integer")
}

// CanLiteralMatchType reports whether a literal path segment could be accepted
// by a path parameter of the supplied JSON Schema type.
func CanLiteralMatchType(literal, paramType string) bool {
	switch paramType {
	case "integer":
		if literal == "" || (literal[0] == '-' && len(literal) == 1) {
			return false
		}
		start := 0
		if literal[0] == '-' {
			start = 1
		}
		for i := start; i < len(literal); i++ {
			if literal[i] < '0' || literal[i] > '9' {
				return false
			}
		}
		return true
	case "number":
		if literal == "" || literal == "." || literal == "-" || literal == "-." {
			return false
		}
		hasDot := false
		start := 0
		if literal[0] == '-' {
			start = 1
		}
		for i := start; i < len(literal); i++ {
			if literal[i] == '.' {
				if hasDot {
					return false
				}
				hasDot = true
			} else if literal[i] < '0' || literal[i] > '9' {
				return false
			}
		}
		return true
	case "boolean":
		return literal == "true" || literal == "false"
	case "string":
		return true
	default:
		return true
	}
}

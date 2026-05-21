// Copyright 2023-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"strings"

	v3 "github.com/pb33f/doctor/model/high/v3"
)

// schemaVisitGuard tracks direct Mermaid schema traversal.
//
// MermaidTardis.Visit already guards normal Doctor traversal, but relationship
// rendering intentionally calls schema helpers directly so referenced component
// classes can be materialized on demand. Those direct calls need their own
// guard because classes are added after their properties are processed, leaving
// recursive references invisible to a diagram.HasClass check while traversal is
// still in progress.
type schemaVisitGuard struct {
	active map[string]struct{}
	done   map[string]struct{}
}

func newSchemaVisitGuard() *schemaVisitGuard {
	return &schemaVisitGuard{
		active: make(map[string]struct{}),
		done:   make(map[string]struct{}),
	}
}

// begin marks a schema traversal as active.
// It returns false when the schema is already active or already complete.
func (g *schemaVisitGuard) begin(key string) bool {
	if key == "" {
		return true
	}
	if g == nil {
		return true
	}
	if _, ok := g.done[key]; ok {
		return false
	}
	if _, ok := g.active[key]; ok {
		return false
	}
	g.active[key] = struct{}{}
	return true
}

// finish marks a schema traversal as complete.
func (g *schemaVisitGuard) finish(key string) {
	if key == "" || g == nil {
		return
	}
	delete(g.active, key)
	g.done[key] = struct{}{}
}

func schemaVisitKey(schema *v3.Schema) string {
	if schema == nil {
		return ""
	}
	if path := strings.TrimSpace(schema.GenerateJSONPath()); path != "" {
		return "path:" + path
	}
	return fmt.Sprintf("ptr:%p", schema)
}

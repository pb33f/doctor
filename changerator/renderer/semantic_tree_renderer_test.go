// Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package renderer

import (
	"strings"
	"testing"

	v3 "github.com/pb33f/doctor/model/high/v3"
	wcModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBuildSemanticRenderModel_GroupsCollectionPropertyChanges(t *testing.T) {
	root := &v3.Node{Id: "root", Label: "Document", Type: "document"}
	schema := &v3.Node{
		Id:       "$.components.schemas['Pet']",
		ParentId: "root",
		Label:    "Pet",
		Type:     "schema",
	}

	added := &wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "properties",
		ChangeType: wcModel.ObjectAdded,
		New:        "jazz",
	}
	removed := &wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "properties",
		ChangeType: wcModel.ObjectRemoved,
		Original:   "name",
	}

	schema.AppendChange(&mockChanged{changes: []*wcModel.Change{added, removed}})
	root.Children = []*v3.Node{schema}

	model := buildSemanticRenderModel(root, []*wcModel.Change{added, removed})
	require.NotNil(t, model)

	leaf := model.leavesByKey["$.components.schemas['Pet']:properties"]
	require.NotNil(t, leaf)
	assert.Equal(t, "properties", leaf.label)
	assert.Equal(t, "properties: name -> jazz", leaf.text)
	assert.Equal(t, wcModel.Modified, leaf.changeType)
}

func TestBuildSemanticRenderModel_GroupsBreakingStatusAcrossSortedChanges(t *testing.T) {
	root := &v3.Node{Id: "root", Label: "Document", Type: "document"}
	schema := &v3.Node{
		Id:       "$.components.schemas['Pet']",
		ParentId: "root",
		Label:    "Pet",
		Type:     "schema",
	}

	added := &wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "required",
		ChangeType: wcModel.PropertyAdded,
		New:        "age",
		Breaking:   false,
	}
	removed := &wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "required",
		ChangeType: wcModel.PropertyRemoved,
		Original:   "name",
		Breaking:   true,
	}

	schema.AppendChange(&mockChanged{changes: []*wcModel.Change{added, removed}})
	root.Children = []*v3.Node{schema}

	model := buildSemanticRenderModel(root, []*wcModel.Change{removed, added})
	require.NotNil(t, model)

	leaf := model.leavesByKey["$.components.schemas['Pet']:required"]
	require.NotNil(t, leaf)
	require.False(t, leaf.change.Breaking, "sorted representative should be the non-breaking change")
	require.True(t, leaf.breaking)
	assert.Equal(t, semanticNodeStats{total: 1, breaking: 1}, model.statsByNode[schema])
	assert.Equal(t, semanticNodeStats{total: 1, breaking: 1}, model.statsByNode[root])

	tree := NewSemanticTreeRenderer(root, []*wcModel.Change{removed, added}, &TreeConfig{
		UseEmojis:       false,
		ShowLineNumbers: false,
		ShowStatistics:  true,
	})
	output := tree.Render()
	assert.Contains(t, output, "{X}")

	highlights := tree.Highlights(10)
	require.NotEmpty(t, highlights)
	assert.Contains(t, strings.Join(highlights, "\n"), "required")
}

func TestSemanticTreeRenderer_GroupsComponentSchemaAdditionsDeterministically(t *testing.T) {
	zeta := &wcModel.Change{
		Path:       "$.components",
		Property:   "schemas",
		ChangeType: wcModel.ObjectAdded,
		New:        "ZetaSchema",
		Type:       "components",
	}
	alpha := &wcModel.Change{
		Path:       "$.components",
		Property:   "schemas",
		ChangeType: wcModel.ObjectAdded,
		New:        "AlphaSchema",
		Type:       "components",
	}
	middle := &wcModel.Change{
		Path:       "$.components",
		Property:   "schemas",
		ChangeType: wcModel.ObjectAdded,
		New:        "MiddleSchema",
		Type:       "components",
	}

	render := func(changes []*wcModel.Change) string {
		root := &v3.Node{Id: "root", Label: "Document", Type: "document"}
		components := &v3.Node{
			Id:       "$.components",
			ParentId: "root",
			Label:    "Components",
			Type:     "components",
		}
		components.AppendChange(&mockChanged{changes: changes})
		root.Children = []*v3.Node{components}

		tree := NewSemanticTreeRenderer(root, changes, &TreeConfig{
			UseEmojis:       false,
			ShowLineNumbers: false,
			ShowStatistics:  true,
		})
		return tree.Render()
	}

	first := render([]*wcModel.Change{zeta, alpha, middle})
	second := render([]*wcModel.Change{middle, zeta, alpha})

	require.Equal(t, first, second)
	assert.Contains(t, first, "[+] schemas: [AlphaSchema, MiddleSchema, ZetaSchema]")
	assert.False(t, strings.Contains(first, "schemas/"), "schemas is a document collection, not a security scope")
}

func TestIsSecurityScopeChange_UsesPositiveSecurityContext(t *testing.T) {
	scopeAdded := &wcModel.Change{
		Path:       "$.components.securitySchemes['oauth'].flows.implicit.scopes",
		Property:   "scopes",
		ChangeType: wcModel.ObjectAdded,
		NewObject:  "read:users",
		New:        "Read users",
	}
	require.True(t, isSecurityScopeChange(scopeAdded))
	assert.Equal(t, "scopes/read:users (Read users)", formatSecurityScopeTitle(scopeAdded))

	requirementScopeAdded := &wcModel.Change{
		Path:       "$.paths['/burgers'].get.security[0]['oauth']",
		Property:   "oauth",
		ChangeType: wcModel.ObjectAdded,
		New:        "admin",
	}
	require.True(t, isSecurityScopeChange(requirementScopeAdded))
	assert.Equal(t, "oauth/admin", formatSecurityScopeTitle(requirementScopeAdded))

	assert.False(t, isSecurityScopeChange(&wcModel.Change{
		Path:       "$.components.schemas['Pet']",
		Property:   "scopes",
		ChangeType: wcModel.ObjectAdded,
		NewObject:  "public",
		New:        "Public",
	}))

	for _, property := range []string{"schema", "schemas", "allOf", "anyOf", "oneOf", "items", "additionalProperties"} {
		t.Run(property, func(t *testing.T) {
			change := &wcModel.Change{
				Path:       "$.components.schemas['Pet']",
				Property:   property,
				ChangeType: wcModel.ObjectAdded,
				New:        "Pet",
			}
			assert.False(t, isSecurityScopeChange(change))
		})
	}
}

// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"github.com/pb33f/libopenapi/index"
	"github.com/stretchr/testify/assert"
	"go.yaml.in/yaml/v4"
	"testing"
)

type cheesyPeas struct {
	Id          string
	Name        string
	Description string
}

type bingoWings struct {
	Message      string
	Path         string
	RuleId       string
	RuleSeverity string
	Origin       *index.NodeOrigin
	Rule         *bellyAche
	StartNode    *yaml.Node
	EndNode      *yaml.Node
}

type bellyAche struct {
	Id           string
	Description  string
	Message      string
	Recommended  bool
	Type         string
	Severity     string
	RuleCategory *cheesyPeas
	HowToFix     string
}

func TestConvertRuleResult(t *testing.T) {
	// create a data shape that resembles a RuleFunctionResult

	bw := &bingoWings{
		Message:      "this is a message",
		Path:         "this is a path",
		RuleId:       "this is a rule id",
		RuleSeverity: "this is a rule severity",
		Origin: &index.NodeOrigin{
			AbsoluteLocation: "this is an absolute location",
		},
		Rule: &bellyAche{
			Id:          "this is a rule id",
			Description: "this is a description",
			Message:     "this is a message",
			Recommended: true,
			Type:        "this is a type",
			Severity:    "this is a severity",
			RuleCategory: &cheesyPeas{
				Id:          "this is a rule category id",
				Name:        "this is a rule category name",
				Description: "this is a rule category description",
			},
			HowToFix: "this is how to fix",
		},
		StartNode: &yaml.Node{Value: "this is a start node"},
		EndNode:   &yaml.Node{Value: "this is an end node"},
	}

	result := ConvertRuleResult(bw)
	assert.Equal(t, bw.Message, result.Message)
	assert.Equal(t, bw.Path, result.Path)
	assert.Equal(t, bw.RuleId, result.RuleId)
	assert.Equal(t, bw.RuleSeverity, result.RuleSeverity)
	assert.Equal(t, bw.Origin, result.Origin)
	assert.Equal(t, bw.Rule.RuleCategory.Id, result.Rule.RuleCategory.Id)
	assert.Equal(t, bw.Rule.RuleCategory.Name, result.Rule.RuleCategory.Name)
	assert.Equal(t, bw.Rule.RuleCategory.Description, result.Rule.RuleCategory.Description)
	assert.Equal(t, bw.Rule.HowToFix, result.Rule.HowToFix)
	assert.Equal(t, bw.Rule.Id, result.Rule.Id)
	assert.Equal(t, bw.Rule.Description, result.Rule.Description)
	assert.Equal(t, bw.Rule.Message, result.Rule.Message)
	assert.Equal(t, bw.Rule.Recommended, result.Rule.Recommended)
	assert.Equal(t, bw.Rule.Type, result.Rule.Type)
	assert.Equal(t, bw.Rule.Severity, result.Rule.Severity)
	assert.Equal(t, bw.StartNode.Value, result.StartNode.Value)
	assert.Equal(t, bw.EndNode.Value, result.EndNode.Value)
}

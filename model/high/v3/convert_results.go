// Copyright 2023-2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package v3

import (
	"github.com/pb33f/libopenapi/index"
	"gopkg.in/yaml.v3"
	"reflect"
)

type RuleCategory struct {
	Id          string `json:"id" yaml:"id"`
	Name        string `json:"name" yaml:"name"`
	Description string `json:"description" yaml:"description"`
}

// RuleFunctionResult describes a failure with linting after being run through a rule
type RuleFunctionResult struct {
	Message      string            `json:"message" yaml:"message"`
	Path         string            `json:"path" yaml:"path"`
	RuleId       string            `json:"ruleId" yaml:"ruleId"`
	RuleSeverity string            `json:"ruleSeverity" yaml:"ruleSeverity"`
	Origin       *index.NodeOrigin `json:"origin,omitempty" yaml:"origin,omitempty"`
	Rule         *Rule             `json:"-" yaml:"-"`
	StartNode    *yaml.Node        `json:"-" yaml:"-"`
	EndNode      *yaml.Node        `json:"-" yaml:"-"`
	ParentObject any               `json:"-" yaml:"-"`
}

// Rule is a structure that represents a rule as part of a ruleset.
type Rule struct {
	Id           string        `json:"id,omitempty" yaml:"id,omitempty"`
	Description  string        `json:"description,omitempty" yaml:"description,omitempty"`
	Message      string        `json:"message,omitempty" yaml:"message,omitempty"`
	Recommended  bool          `json:"recommended,omitempty" yaml:"recommended,omitempty"`
	Type         string        `json:"type,omitempty" yaml:"type,omitempty"`
	Severity     string        `json:"severity,omitempty" yaml:"severity,omitempty"`
	RuleCategory *RuleCategory `json:"category,omitempty" yaml:"category,omitempty"`
	HowToFix     string        `json:"howToFix,omitempty" yaml:"howToFix,omitempty"`
}

func ConvertRuleResult(object any) *RuleFunctionResult {

	result := &RuleFunctionResult{}

	v := reflect.ValueOf(object).Elem()
	num := v.NumField()
	for i := 0; i < num; i++ {
		fName := v.Type().Field(i).Name
		field := v.FieldByName(fName)
		if !field.IsZero() {
			if fName == "Message" {
				result.Message = field.String()
				continue
			}
			if fName == "Path" {
				result.Path = field.String()
				continue
			}
			if fName == "RuleId" {
				result.RuleId = field.String()
				continue
			}

			if fName == "RuleSeverity" {
				result.RuleSeverity = field.String()
				continue
			}
			if fName == "Origin" {
				result.Origin = field.Interface().(*index.NodeOrigin)
				continue
			}
			if fName == "Rule" {
				rule := &Rule{}
				rNum := field.Type().Elem().NumField()
				elem := field.Elem()
				for y := 0; y < rNum; y++ {
					rfName := elem.Type().Field(y).Name
					rField := elem.FieldByName(rfName)
					if !rField.IsZero() {
						if rfName == "Id" {
							rule.Id = rField.String()
							result.RuleId = rField.String()
							continue
						}
						if rfName == "Description" {
							rule.Description = rField.String()
							continue
						}
						if rfName == "Message" {
							rule.Message = rField.String()
							continue
						}
						if rfName == "Type" {
							rule.Type = rField.String()
							continue
						}
						if rfName == "Severity" {
							rule.Severity = rField.String()
							if result.RuleSeverity == "" {
								result.RuleSeverity = rField.String()
							}
							continue
						}
						if rfName == "HowToFix" {
							rule.HowToFix = rField.String()
							continue
						}
						if rfName == "Recommended" {
							rule.Recommended = rField.Bool()
							continue
						}

						if rfName == "RuleCategory" {
							cat := &RuleCategory{}
							catNum := rField.Type().Elem().NumField()
							catElem := rField.Elem()
							for l := 0; l < catNum; l++ {
								catName := catElem.Type().Field(l).Name
								catField := catElem.FieldByName(catName)
								if !field.IsZero() {
									if catName == "Id" {
										cat.Id = catField.String()
										continue
									}
									if catName == "Name" {
										cat.Name = catField.String()
										continue
									}
									if catName == "Description" {
										cat.Description = catField.String()
										continue
									}
								}
							}
							rule.RuleCategory = cat
						}
					}
					result.Rule = rule
				}
			}
			if fName == "StartNode" {
				result.StartNode = field.Interface().(*yaml.Node)
				continue
			}
			if fName == "EndNode" {
				result.EndNode = field.Interface().(*yaml.Node)
				continue
			}
		}
	}
	return result
}

// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import (
	"fmt"
)

type Foundational interface {
	GetParent() Foundational
	GetPathSegment() string
	GenerateJSONPath() string
	GenerateJSONPathWithLevel(level int) string
	AddRuleFunctionResult(result *RuleFunctionResult)
	GetRuleFunctionResults() []*RuleFunctionResult
}

type Foundation struct {
	PathSegment string
	IsIndexed   bool
	Index       int
	Key         string
	Parent      any
	RuleResults []*RuleFunctionResult
}

func (f *Foundation) AddRuleFunctionResult(result *RuleFunctionResult) {
	if f.RuleResults == nil {
		f.RuleResults = []*RuleFunctionResult{result}
		return
	}
	f.RuleResults = append(f.RuleResults, result)
}

func (f *Foundation) GetRuleFunctionResults() []*RuleFunctionResult {
	return f.RuleResults
}

func (f *Foundation) GetParent() Foundational {
	return f.Parent.(Foundational)
}

func (f *Foundation) GetPathSegment() string {
	return f.PathSegment
}

func (f *Foundation) GenerateJSONPath() string {
	return f.GenerateJSONPathWithLevel(0)
}

func (f *Foundation) GenerateJSONPathWithLevel(level int) string {
	level++
	if level > 150 {
		return f.PathSegment
	}
	sep := "."
	if f.Parent != nil {
		if f.Key != "" {
			if f.PathSegment == "" {
				sep = ""
			}
			return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment + "['" + f.Key + "']"
		}
		if f.IsIndexed {
			//if f.PathSegment == "" {
			//	sep = ""
			//}
			return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment + "[" + fmt.Sprint(f.Index) + "]"
		}
		if f.PathSegment == "" {
			sep = ""
		}
		return f.Parent.(Foundational).GenerateJSONPathWithLevel(level) + sep + f.PathSegment

	}
	return f.PathSegment
}

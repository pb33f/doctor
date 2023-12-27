// Copyright 2024 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package base

import "fmt"

type Foundational interface {
	GetParent() Foundational
	GetPathSegment() string
	GenerateJSONPath() string
}

type Foundation struct {
	PathSegment string
	IsIndexed   bool
	Index       int
	Key         string
	Parent      any
}

func (f *Foundation) GetParent() Foundational {
	return f.Parent.(Foundational)
}

func (f *Foundation) GetPathSegment() string {
	return f.PathSegment
}

func (f *Foundation) GenerateJSONPath() string {
	sep := "."
	if f.Parent != nil {
		if f.Key != "" {
			if f.PathSegment == "" {
				sep = ""
			}
			return f.Parent.(Foundational).GenerateJSONPath() + sep + f.PathSegment + "['" + f.Key + "']"
		}
		if f.IsIndexed {
			//if f.PathSegment == "" {
			//	sep = ""
			//}
			return f.Parent.(Foundational).GenerateJSONPath() + sep + f.PathSegment + "[" + fmt.Sprint(f.Index) + "]"
		}
		if f.PathSegment == "" {
			sep = ""
		}
		return f.Parent.(Foundational).GenerateJSONPath() + sep + f.PathSegment

	}
	return f.PathSegment
}

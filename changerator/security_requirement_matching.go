// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package changerator

import (
	v3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/libopenapi/what-changed/model"
)

func matchSecurityRequirementChange(
	requirements []*v3.SecurityRequirement,
	change *model.SecurityRequirementChanges,
) *v3.SecurityRequirement {
	if change == nil {
		return nil
	}

	targets := collectSecurityRequirementProperties(change)
	if len(targets) == 0 {
		if len(requirements) == 1 {
			return requirements[0]
		}
		return nil
	}

	for _, requirement := range requirements {
		if requirement == nil || requirement.Value == nil || requirement.Value.Requirements == nil {
			continue
		}
		for scheme, _ := range requirement.Value.Requirements.FromOldest() {
			if targets[scheme] {
				return requirement
			}
		}
	}

	return nil
}

func collectSecurityRequirementProperties(change *model.SecurityRequirementChanges) map[string]bool {
	properties := make(map[string]bool)
	for _, item := range change.GetAllChanges() {
		if item == nil || item.Property == "" {
			continue
		}
		properties[item.Property] = true
	}
	return properties
}

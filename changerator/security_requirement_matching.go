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
	preferredIndex int,
) *v3.SecurityRequirement {
	if change == nil {
		return nil
	}

	if requirement := matchSecurityRequirementByLine(requirements, change, preferredIndex); requirement != nil {
		return requirement
	}

	targets := collectSecurityRequirementProperties(change)
	if len(targets) == 0 {
		if requirement := securityRequirementAt(requirements, preferredIndex); requirement != nil {
			return requirement
		}
		if len(requirements) == 1 {
			return requirements[0]
		}
		return nil
	}

	if requirement := securityRequirementAt(requirements, preferredIndex); requirement != nil &&
		securityRequirementMatchesTargets(requirement, targets) {
		return requirement
	}

	for _, requirement := range requirements {
		if securityRequirementMatchesTargets(requirement, targets) {
			return requirement
		}
	}

	return nil
}

func matchSecurityRequirementByLine(
	requirements []*v3.SecurityRequirement,
	change *model.SecurityRequirementChanges,
	preferredIndex int,
) *v3.SecurityRequirement {
	lines := collectSecurityRequirementLines(change)
	if len(lines) == 0 {
		return nil
	}

	for _, line := range lines {
		var matches []*v3.SecurityRequirement
		for _, requirement := range requirements {
			if !securityRequirementContainsLine(requirement, line) {
				continue
			}
			matches = append(matches, requirement)
		}

		if len(matches) == 1 {
			return matches[0]
		}

		if len(matches) > 1 {
			if requirement := securityRequirementAt(requirements, preferredIndex); requirement != nil {
				for _, match := range matches {
					if match == requirement {
						return requirement
					}
				}
			}
		}
	}

	return nil
}

func collectSecurityRequirementLines(change *model.SecurityRequirementChanges) []int {
	var lines []int
	seen := make(map[int]bool)
	for _, item := range change.GetAllChanges() {
		if item == nil || item.Context == nil {
			continue
		}
		if item.Context.NewLine != nil && !seen[*item.Context.NewLine] {
			lines = append(lines, *item.Context.NewLine)
			seen[*item.Context.NewLine] = true
		}
		if item.Context.OriginalLine != nil && !seen[*item.Context.OriginalLine] {
			lines = append(lines, *item.Context.OriginalLine)
			seen[*item.Context.OriginalLine] = true
		}
	}
	return lines
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

func securityRequirementMatchesTargets(requirement *v3.SecurityRequirement, targets map[string]bool) bool {
	if requirement == nil || requirement.Value == nil || requirement.Value.Requirements == nil {
		return false
	}
	for scheme := range requirement.Value.Requirements.FromOldest() {
		if targets[scheme] {
			return true
		}
	}
	return false
}

func securityRequirementContainsLine(requirement *v3.SecurityRequirement, line int) bool {
	if requirement == nil || requirement.Value == nil {
		return false
	}
	lowRequirement := requirement.Value.GoLow()
	if lowRequirement == nil {
		return false
	}
	if lowRequirement.ContainsLine(line) {
		return true
	}
	return lowRequirement.GetRootNode() != nil && lowRequirement.GetRootNode().Line == line
}

func securityRequirementAt(requirements []*v3.SecurityRequirement, index int) *v3.SecurityRequirement {
	if index < 0 || index >= len(requirements) {
		return nil
	}
	return requirements[index]
}

// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import ppmodel "github.com/pb33f/doctor/printingpress/model"

func (pp *PrintingPress) applyDeveloperNavCounts(opCounts, modelCounts map[string]ppmodel.ViolationCounts) {
	for _, op := range pp.site.Root.UntaggedOperations {
		if counts, ok := opCounts[op.Slug]; ok {
			op.Counts = violationCountsPtr(counts)
		}
	}
	for _, op := range pp.site.NavWebhooks {
		if counts, ok := opCounts[op.Slug]; ok {
			op.Counts = violationCountsPtr(counts)
		}
	}
	var updateTag func(tag *ppmodel.NavTag) ppmodel.ViolationCounts
	updateTag = func(tag *ppmodel.NavTag) ppmodel.ViolationCounts {
		var total ppmodel.ViolationCounts
		for _, op := range tag.Operations {
			if counts, ok := opCounts[op.Slug]; ok {
				op.Counts = violationCountsPtr(counts)
			}
			total = addCounts(total, dereferenceCounts(op.Counts))
		}
		for _, child := range tag.Children {
			total = addCounts(total, updateTag(child))
		}
		tag.Counts = violationCountsPtr(total)
		return total
	}
	for _, tag := range pp.site.NavTags {
		updateTag(tag)
	}

	for _, group := range pp.site.NavModelGroups {
		var total ppmodel.ViolationCounts
		for _, model := range group.Models {
			key := model.TypeSlug + "/" + model.Slug
			if counts, ok := modelCounts[key]; ok {
				model.Counts = violationCountsPtr(counts)
			}
			total = addCounts(total, dereferenceCounts(model.Counts))
		}
		group.Counts = violationCountsPtr(total)
	}
}

func violationCountsPtr(counts ppmodel.ViolationCounts) *ppmodel.ViolationCounts {
	if counts.Total() == 0 {
		return nil
	}
	return &counts
}

func dereferenceCounts(counts *ppmodel.ViolationCounts) ppmodel.ViolationCounts {
	if counts == nil {
		return ppmodel.ViolationCounts{}
	}
	return *counts
}

func addCounts(a, b ppmodel.ViolationCounts) ppmodel.ViolationCounts {
	return ppmodel.ViolationCounts{
		Errors: a.Errors + b.Errors,
		Warns:  a.Warns + b.Warns,
		Infos:  a.Infos + b.Infos,
	}
}

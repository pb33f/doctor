package model

import (
	"fmt"
	drV3 "github.com/pb33f/doctor/model/high/v3"
	"sort"
)

// frozen lookup normalization from Doctor 4480edd.
func stableLocatedModelsReference(models []drV3.Foundational) []drV3.Foundational {
	if len(models) < 2 {
		return models
	}

	seen := make(map[string]struct{}, len(models))
	stable := make([]drV3.Foundational, 0, len(models))
	for _, model := range models {
		if model == nil {
			continue
		}
		path := model.GenerateJSONPath()
		if path != "" {
			if _, ok := seen[path]; ok {
				continue
			}
			seen[path] = struct{}{}
		}
		stable = append(stable, model)
	}

	type locatedModelSortEntry struct {
		model drV3.Foundational
		key   string
	}
	entries := make([]locatedModelSortEntry, len(stable))
	for i, model := range stable {
		entries[i] = locatedModelSortEntry{
			model: model,
			key:   locatedModelSortKeyReference(model),
		}
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].key < entries[j].key
	})
	for i, entry := range entries {
		stable[i] = entry.model
	}
	return stable
}

func locatedModelSortKeyReference(model drV3.Foundational) string {
	if model == nil {
		return ""
	}
	path := model.GenerateJSONPath()
	keyNode := model.GetKeyNode()
	valueNode := model.GetValueNode()
	return fmt.Sprintf("%s|%08d:%08d|%08d:%08d|%T",
		path,
		nodeLine(keyNode),
		nodeColumn(keyNode),
		nodeLine(valueNode),
		nodeColumn(valueNode),
		model,
	)
}

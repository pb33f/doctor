// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"fmt"
	"strings"
)

const (
	DefaultMaxLabelsToShow = 10
)

type ReferenceAggregator struct {
	maxLabelsToShow int
}

func NewReferenceAggregator(maxLabelsToShow int) *ReferenceAggregator {
	if maxLabelsToShow <= 0 {
		maxLabelsToShow = DefaultMaxLabelsToShow
	}
	return &ReferenceAggregator{
		maxLabelsToShow: maxLabelsToShow,
	}
}

// Aggregate merges duplicate references into single relationships with combined labels
func (ra *ReferenceAggregator) Aggregate(relationships []*DiagramRelationship) []*DiagramRelationship {
	if relationships == nil {
		return nil
	}

	// group relationships by source+target+type
	type groupKey struct {
		source string
		target string
		relType RelationType
	}

	grouped := make(map[groupKey][]string)
	otherRels := make([]*DiagramRelationship, 0)

	for _, rel := range relationships {
		if rel == nil {
			continue
		}

		// only aggregate association relationships (references)
		if rel.Type == RelationAssociation {
			key := groupKey{
				source:  rel.SourceID,
				target:  rel.TargetID,
				relType: rel.Type,
			}
			grouped[key] = append(grouped[key], rel.Label)
		} else {
			// keep non-association relationships as-is
			otherRels = append(otherRels, rel)
		}
	}

	// create merged relationships
	merged := make([]*DiagramRelationship, 0, len(grouped)+len(otherRels))

	for key, labels := range grouped {
		if len(labels) == 1 {
			// single reference - don't aggregate
			merged = append(merged, &DiagramRelationship{
				SourceID: key.source,
				TargetID: key.target,
				Type:     key.relType,
				Label:    labels[0],
			})
		} else {
			// multiple references - aggregate
			mergedLabel := ra.formatAggregatedLabel(labels)
			merged = append(merged, &DiagramRelationship{
				SourceID: key.source,
				TargetID: key.target,
				Type:     key.relType,
				Label:    mergedLabel,
				Metadata: map[string]interface{}{
					"aggregated": true,
					"count":      len(labels),
					"labels":     labels,
				},
			})
		}
	}

	// add back non-aggregated relationships
	merged = append(merged, otherRels...)

	return merged
}

func (ra *ReferenceAggregator) formatAggregatedLabel(labels []string) string {
	count := len(labels)

	if count <= ra.maxLabelsToShow {
		return fmt.Sprintf("%d properties (%s)", count, strings.Join(labels, ", "))
	}

	// too many to show - just show count and first few
	preview := labels[:ra.maxLabelsToShow]
	remaining := count - ra.maxLabelsToShow
	return fmt.Sprintf("%d properties (%s... +%d more)", count, strings.Join(preview, ", "), remaining)
}

func (ra *ReferenceAggregator) ShouldAggregate(relationships []*DiagramRelationship) bool {
	if len(relationships) == 0 {
		return false
	}

	type relKey struct {
		source, target string
	}

	duplicates := 0
	seen := make(map[relKey]int)

	for _, rel := range relationships {
		if rel != nil && rel.Type == RelationAssociation {
			key := relKey{source: rel.SourceID, target: rel.TargetID}
			seen[key]++
			if seen[key] > 1 {
				duplicates++
			}
		}
	}

	return duplicates >= 2
}

func (ra *ReferenceAggregator) GetAggregationStats(relationships []*DiagramRelationship) map[string]interface{} {
	stats := make(map[string]interface{})

	totalRels := len(relationships)
	associations := 0
	duplicateGroups := 0
	saved := 0

	type relKey struct {
		source, target string
	}
	grouped := make(map[relKey]int)

	for _, rel := range relationships {
		if rel != nil && rel.Type == RelationAssociation {
			associations++
			key := relKey{source: rel.SourceID, target: rel.TargetID}
			grouped[key]++
		}
	}

	for _, count := range grouped {
		if count > 1 {
			duplicateGroups++
			saved += (count - 1) // each duplicate group saves (count-1) relationships
		}
	}

	stats["total"] = totalRels
	stats["associations"] = associations
	stats["duplicateGroups"] = duplicateGroups
	stats["relationshipsSaved"] = saved
	if totalRels > 0 {
		stats["reductionPercent"] = float64(saved) / float64(totalRels) * 100
	}

	return stats
}

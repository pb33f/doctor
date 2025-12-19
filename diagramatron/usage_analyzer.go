// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"container/heap"
	"fmt"
)

const (
	DefaultMinRefsForAnnotation = 5
)

type UsageTier string

const (
	UsageLow       UsageTier = "low"
	UsageMedium    UsageTier = "medium"
	UsageHigh      UsageTier = "high"
	UsageVeryHigh  UsageTier = "very-high"
)

type ComponentUsage struct {
	ClassID     string
	RefCount    int
	Tier        UsageTier
	IncomingRefs []string // source IDs that reference this component
}

type ComponentUsageAnalyzer struct {
	minRefsForAnnotation int
}

func NewComponentUsageAnalyzer(minRefsForAnnotation int) *ComponentUsageAnalyzer {
	if minRefsForAnnotation <= 0 {
		minRefsForAnnotation = DefaultMinRefsForAnnotation
	}
	return &ComponentUsageAnalyzer{
		minRefsForAnnotation: minRefsForAnnotation,
	}
}

// AnalyzeReuse counts how many times each class is referenced
func (cua *ComponentUsageAnalyzer) AnalyzeReuse(diagram *Diagram) map[string]*ComponentUsage {
	if diagram == nil {
		return nil
	}

	usage := make(map[string]*ComponentUsage)

	// initialize usage for all classes
	for _, class := range diagram.Classes {
		if class != nil {
			usage[class.ID] = &ComponentUsage{
				ClassID:      class.ID,
				RefCount:     0,
				IncomingRefs: make([]string, 0),
			}
		}
	}

	// count incoming relationships
	for _, rel := range diagram.Relationships {
		if rel == nil {
			continue
		}

		if u, exists := usage[rel.TargetID]; exists {
			u.RefCount++
			u.IncomingRefs = append(u.IncomingRefs, rel.SourceID)
		} else {
			// target class might not be in diagram (external ref)
			usage[rel.TargetID] = &ComponentUsage{
				ClassID:      rel.TargetID,
				RefCount:     1,
				IncomingRefs: []string{rel.SourceID},
			}
		}
	}

	// determine tier for each component
	for _, u := range usage {
		u.Tier = cua.determineTier(u.RefCount)
	}

	return usage
}

func (cua *ComponentUsageAnalyzer) determineTier(refCount int) UsageTier {
	if refCount >= 50 {
		return UsageVeryHigh
	} else if refCount >= 10 {
		return UsageHigh
	} else if refCount >= 5 {
		return UsageMedium
	}
	return UsageLow
}

// AnnotateWithUsage adds reuse annotations to diagram classes
func (cua *ComponentUsageAnalyzer) AnnotateWithUsage(diagram *Diagram) {
	if diagram == nil {
		return
	}

	usage := cua.AnalyzeReuse(diagram)

	for _, class := range diagram.Classes {
		if class == nil {
			continue
		}

		u, exists := usage[class.ID]
		if !exists {
			continue
		}

		if u.RefCount >= cua.minRefsForAnnotation {
			annotation := cua.formatAnnotation(u)
			class.Annotations = append(class.Annotations, annotation)
		}
	}
}

func (cua *ComponentUsageAnalyzer) formatAnnotation(usage *ComponentUsage) string {
	switch usage.Tier {
	case UsageVeryHigh:
		return fmt.Sprintf("very highly reused (%d refs)", usage.RefCount)
	case UsageHigh:
		return fmt.Sprintf("highly reused (%d refs)", usage.RefCount)
	case UsageMedium:
		return fmt.Sprintf("reused %d times", usage.RefCount)
	default:
		return fmt.Sprintf("reused %d times", usage.RefCount)
	}
}

// GetMostReusedComponents returns the top N most reused components using heap for O(N log topN) performance
func (cua *ComponentUsageAnalyzer) GetMostReusedComponents(diagram *Diagram, topN int) []*ComponentUsage {
	usage := cua.AnalyzeReuse(diagram)

	if len(usage) == 0 {
		return []*ComponentUsage{}
	}

	// convert to slice
	usageList := make([]*ComponentUsage, 0, len(usage))
	for _, u := range usage {
		usageList = append(usageList, u)
	}

	if topN >= len(usageList) {
		// return all, sorted
		h := &usageHeap{items: usageList}
		heap.Init(h)
		result := make([]*ComponentUsage, len(usageList))
		for i := len(usageList) - 1; i >= 0; i-- {
			result[i] = heap.Pop(h).(*ComponentUsage)
		}
		return result
	}

	// use min-heap to get top N efficiently
	h := &usageHeap{items: make([]*ComponentUsage, 0, topN)}
	heap.Init(h)

	for _, u := range usageList {
		if h.Len() < topN {
			heap.Push(h, u)
		} else if u.RefCount > h.items[0].RefCount {
			heap.Pop(h)
			heap.Push(h, u)
		}
	}

	// extract in descending order
	result := make([]*ComponentUsage, h.Len())
	for i := len(result) - 1; i >= 0; i-- {
		result[i] = heap.Pop(h).(*ComponentUsage)
	}

	return result
}

// usageHeap implements heap.Interface for ComponentUsage (min-heap by RefCount)
type usageHeap struct {
	items []*ComponentUsage
}

func (h *usageHeap) Len() int { return len(h.items) }

func (h *usageHeap) Less(i, j int) bool {
	return h.items[i].RefCount < h.items[j].RefCount
}

func (h *usageHeap) Swap(i, j int) {
	h.items[i], h.items[j] = h.items[j], h.items[i]
}

func (h *usageHeap) Push(x interface{}) {
	h.items = append(h.items, x.(*ComponentUsage))
}

func (h *usageHeap) Pop() interface{} {
	old := h.items
	n := len(old)
	item := old[n-1]
	h.items = old[0 : n-1]
	return item
}

// GetUnusedComponents returns components with zero references
func (cua *ComponentUsageAnalyzer) GetUnusedComponents(diagram *Diagram) []*ComponentUsage {
	usage := cua.AnalyzeReuse(diagram)

	unused := make([]*ComponentUsage, 0)
	for _, u := range usage {
		if u.RefCount == 0 {
			unused = append(unused, u)
		}
	}

	return unused
}

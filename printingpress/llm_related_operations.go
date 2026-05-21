// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"

	. "github.com/pb33f/doctor/printingpress/model"
)

const relatedOperationLimit = 4

type llmRelatedOperationIndex struct {
	metadataByOperation map[*OperationPage]*llmRelatedOperationMetadata
	pathOperations      map[string][]*OperationPage
	tagOperations       map[string][]*OperationPage
	prefixOperations    map[string][]*OperationPage
	operationIDIndex    map[string][]*OperationPage
	objectMappingOps    []*OperationPage
	relatedByOperation  map[*OperationPage][]*OperationPage
}

type llmRelatedOperationMetadata struct {
	operation            *OperationPage
	ordinal              int
	path                 string
	segments             []string
	prefixes             []string
	tags                 map[string]struct{}
	resourceOperationIDs map[string]struct{}
	objectMappingPath    bool
}

type llmRelatedOperationCandidate struct {
	operation *OperationPage
	score     int
	ordinal   int
	path      string
}

type llmRelatedCandidateSet struct {
	seen map[*OperationPage]struct{}
	list []*OperationPage
}

func newLLMRelatedOperationIndex(site *Site) *llmRelatedOperationIndex {
	index := &llmRelatedOperationIndex{
		metadataByOperation: make(map[*OperationPage]*llmRelatedOperationMetadata),
		pathOperations:      make(map[string][]*OperationPage),
		tagOperations:       make(map[string][]*OperationPage),
		prefixOperations:    make(map[string][]*OperationPage),
		operationIDIndex:    make(map[string][]*OperationPage),
		relatedByOperation:  make(map[*OperationPage][]*OperationPage),
	}
	if site == nil {
		return index
	}

	ordinal := 0
	for _, op := range site.Operations {
		if op == nil {
			continue
		}
		meta := newLLMRelatedOperationMetadata(op, ordinal)
		ordinal++
		index.metadataByOperation[op] = meta
		index.pathOperations[meta.path] = append(index.pathOperations[meta.path], op)
		for tag := range meta.tags {
			index.tagOperations[tag] = append(index.tagOperations[tag], op)
		}
		for _, prefix := range meta.prefixes {
			index.prefixOperations[prefix] = append(index.prefixOperations[prefix], op)
		}
		if op.OperationID != "" {
			index.operationIDIndex[op.OperationID] = append(index.operationIDIndex[op.OperationID], op)
		}
		if meta.objectMappingPath {
			index.objectMappingOps = append(index.objectMappingOps, op)
		}
	}
	for _, wh := range site.Webhooks {
		if wh == nil {
			continue
		}
		index.metadataByOperation[wh] = newLLMRelatedOperationMetadata(wh, ordinal)
		ordinal++
	}
	for op, meta := range index.metadataByOperation {
		index.relatedByOperation[op] = index.relatedForMetadata(op, meta)
	}
	return index
}

func collectRelatedOperationsWithIndex(site *Site, op *OperationPage, index *llmRelatedOperationIndex) []*OperationPage {
	if site == nil || op == nil {
		return nil
	}
	if index == nil {
		index = newLLMRelatedOperationIndex(site)
	}
	return index.Related(op)
}

func (i *llmRelatedOperationIndex) Related(op *OperationPage) []*OperationPage {
	if i == nil || op == nil {
		return nil
	}
	if related, ok := i.relatedByOperation[op]; ok {
		return related
	}

	meta := i.metadataByOperation[op]
	if meta == nil {
		meta = newLLMRelatedOperationMetadata(op, -1)
	}
	return i.relatedForMetadata(op, meta)
}

func (i *llmRelatedOperationIndex) relatedForMetadata(op *OperationPage, meta *llmRelatedOperationMetadata) []*OperationPage {
	if i == nil || op == nil || meta == nil {
		return nil
	}

	candidates := i.relatedCandidates(meta)
	var topCandidates [relatedOperationLimit]llmRelatedOperationCandidate
	top := topCandidates[:0]
	for _, candidate := range candidates {
		if candidate.Slug == op.Slug {
			continue
		}
		candidateMeta := i.metadataByOperation[candidate]
		if candidateMeta == nil {
			continue
		}
		score := scoreRelatedOperation(meta, candidateMeta)
		if score <= 0 {
			continue
		}
		top = insertTopRelatedOperationCandidate(top, llmRelatedOperationCandidate{
			operation: candidate,
			score:     score,
			ordinal:   candidateMeta.ordinal,
			path:      candidateMeta.path,
		})
	}

	related := make([]*OperationPage, 0, len(top))
	for _, candidate := range top {
		related = append(related, candidate.operation)
	}
	return related
}

func (i *llmRelatedOperationIndex) relatedCandidates(meta *llmRelatedOperationMetadata) []*OperationPage {
	if i == nil || meta == nil {
		return nil
	}

	candidates := llmRelatedCandidateSet{seen: make(map[*OperationPage]struct{})}
	candidates.add(i.pathOperations[meta.path])
	for tag := range meta.tags {
		candidates.add(i.tagOperations[tag])
	}
	for _, prefix := range meta.prefixes {
		candidates.add(i.prefixOperations[prefix])
	}
	for operationID := range meta.resourceOperationIDs {
		candidates.add(i.operationIDIndex[operationID])
	}
	if meta.objectMappingPath {
		candidates.add(i.objectMappingOps)
	}
	return candidates.list
}

func (s *llmRelatedCandidateSet) add(candidates []*OperationPage) {
	if s.seen == nil {
		s.seen = make(map[*OperationPage]struct{}, len(candidates))
	}
	for _, candidate := range candidates {
		if candidate == nil {
			continue
		}
		if _, ok := s.seen[candidate]; ok {
			continue
		}
		s.seen[candidate] = struct{}{}
		s.list = append(s.list, candidate)
	}
}

func insertTopRelatedOperationCandidate(top []llmRelatedOperationCandidate, candidate llmRelatedOperationCandidate) []llmRelatedOperationCandidate {
	if cap(top) == 0 {
		return top
	}
	if len(top) == cap(top) && !betterRelatedOperationCandidate(candidate, top[len(top)-1]) {
		return top
	}
	if len(top) < cap(top) {
		top = top[:len(top)+1]
	}
	insertAt := len(top) - 1
	for insertAt > 0 && betterRelatedOperationCandidate(candidate, top[insertAt-1]) {
		top[insertAt] = top[insertAt-1]
		insertAt--
	}
	top[insertAt] = candidate
	return top
}

func betterRelatedOperationCandidate(left, right llmRelatedOperationCandidate) bool {
	if left.score != right.score {
		return left.score > right.score
	}
	if left.path != right.path {
		return left.path < right.path
	}
	return left.ordinal < right.ordinal
}

func newLLMRelatedOperationMetadata(op *OperationPage, ordinal int) *llmRelatedOperationMetadata {
	if op == nil {
		return &llmRelatedOperationMetadata{ordinal: ordinal}
	}
	segments := operationPathSegments(op.Path)
	tags := make(map[string]struct{}, len(op.Tags))
	for _, tag := range op.Tags {
		if tag != "" {
			tags[tag] = struct{}{}
		}
	}
	return &llmRelatedOperationMetadata{
		operation:            op,
		ordinal:              ordinal,
		path:                 op.Path,
		segments:             segments,
		prefixes:             operationPathPrefixes(segments),
		tags:                 tags,
		resourceOperationIDs: operationResourceOperationIDs(op),
		objectMappingPath:    strings.Contains(op.Path, "/object-mappings/"),
	}
}

func scoreRelatedOperation(subject, candidate *llmRelatedOperationMetadata) int {
	if subject == nil || candidate == nil || subject.operation == nil || candidate.operation == nil {
		return 0
	}
	score := 0
	if candidate.path == subject.path {
		score += 100
	}
	if _, ok := subject.resourceOperationIDs[candidate.operation.OperationID]; ok && candidate.operation.OperationID != "" {
		score += 50
	}
	if relatedOperationTagsOverlap(subject.tags, candidate.tags) {
		score += 2
	}
	sharedSegments := sharedPathSegmentCount(subject.segments, candidate.segments)
	if sharedSegments > 0 {
		score += sharedSegments
		if isComplementaryMethod(subject.operation.Method, candidate.operation.Method) {
			score += 8
		}
	}
	if subject.objectMappingPath && candidate.objectMappingPath {
		score += 4
	}
	return score
}

func relatedOperationTagsOverlap(left, right map[string]struct{}) bool {
	if len(left) == 0 || len(right) == 0 {
		return false
	}
	if len(left) > len(right) {
		left, right = right, left
	}
	for tag := range left {
		if _, ok := right[tag]; ok {
			return true
		}
	}
	return false
}

func operationResourceOperationIDs(op *OperationPage) map[string]struct{} {
	ids := make(map[string]struct{})
	if op == nil {
		return ids
	}
	for _, p := range op.Parameters {
		if p == nil {
			continue
		}
		for _, ext := range p.Extensions {
			if ext == nil || ext.Key != "sailpoint-resource-operation-id" {
				continue
			}
			id, ok := ext.Value.(string)
			if ok && id != "" {
				ids[id] = struct{}{}
			}
		}
	}
	return ids
}

func operationPathSegments(path string) []string {
	trimmed := strings.Trim(path, "/")
	if trimmed == "" {
		return nil
	}
	return strings.Split(trimmed, "/")
}

func operationPathPrefixes(segments []string) []string {
	if len(segments) == 0 {
		return nil
	}
	prefixes := make([]string, 0, len(segments))
	var b strings.Builder
	for i, segment := range segments {
		if i > 0 {
			b.WriteByte('/')
		}
		b.WriteString(segment)
		prefixes = append(prefixes, "/"+b.String())
	}
	return prefixes
}

func sharedPathSegmentCount(left, right []string) int {
	limit := len(left)
	if len(right) < limit {
		limit = len(right)
	}
	for segmentIndex := 0; segmentIndex < limit; segmentIndex++ {
		if left[segmentIndex] != right[segmentIndex] {
			return segmentIndex
		}
	}
	return limit
}

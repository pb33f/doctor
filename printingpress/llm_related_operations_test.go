// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"sync"
	"testing"

	. "github.com/pb33f/doctor/printingpress/model"
	"github.com/pb33f/testify/assert"
	"github.com/pb33f/testify/require"
)

func TestLLMRelatedOperationIndexRanksAndLimitsCandidates(t *testing.T) {
	subject := relatedOperation("patch-lockout", "PATCH", "/auth-org/lockout-config", "Security")
	subject.Parameters = []*ParameterInfo{{
		Extensions: []*ExtensionEntry{
			{Key: "ignored", Value: "list-auth-orgs"},
			{Key: "sailpoint-resource-operation-id", Value: "list-auth-orgs"},
		},
	}}
	samePath := relatedOperation("get-lockout", "GET", "/auth-org/lockout-config", "Security")
	resource := relatedOperation("list-auth-orgs", "GET", "/tenants", "Tenant")
	resource.OperationID = "list-auth-orgs"
	prefix := relatedOperation("get-network", "GET", "/auth-org/network-config", "Security")
	objectMapping := relatedOperation("get-mapping", "GET", "/identity/object-mappings/source", "Mapping")
	tagOnly := relatedOperation("get-security", "GET", "/security/defaults", "Security")
	lowPrefix := relatedOperation("get-auth-org", "GET", "/auth-org", "Other")

	site := &Site{Operations: []*OperationPage{
		subject,
		tagOnly,
		lowPrefix,
		objectMapping,
		prefix,
		resource,
		samePath,
	}}
	index := newLLMRelatedOperationIndex(site)

	related := index.Related(subject)

	require.Len(t, related, relatedOperationLimit)
	assert.Equal(t, []string{"get-lockout", "list-auth-orgs", "get-network", "get-auth-org"}, relatedOperationSlugs(related))
	assert.Equal(t, relatedOperationSlugs(related), relatedOperationSlugs(index.relatedByOperation[subject]))
}

func TestLLMRelatedOperationIndexSupportsWebhookSubjectsAndCaches(t *testing.T) {
	candidate := relatedOperation("get-user", "GET", "/users/{userId}", "Users")
	webhook := relatedOperation("user-webhook", "POST", "/users/{userId}", "Users")
	site := &Site{
		Operations: []*OperationPage{candidate},
		Webhooks:   []*OperationPage{webhook},
	}
	index := newLLMRelatedOperationIndex(site)

	first := index.Related(webhook)
	second := index.Related(webhook)

	require.Len(t, first, 1)
	assert.Equal(t, "get-user", first[0].Slug)
	assert.Same(t, first[0], second[0])
}

func TestLLMRelatedOperationIndexSkipsNilAndMissingMetadata(t *testing.T) {
	subject := relatedOperation("subject", "GET", "/users/{userId}", "Users")
	candidate := relatedOperation("candidate", "GET", "/users/{userId}/messages", "Users")
	site := &Site{
		Operations: []*OperationPage{nil, candidate},
		Webhooks:   []*OperationPage{nil, subject},
	}
	index := newLLMRelatedOperationIndex(site)
	index.metadataByOperation[candidate] = nil
	delete(index.relatedByOperation, subject)

	related := index.Related(subject)

	assert.Empty(t, related)

	var candidates llmRelatedCandidateSet
	candidates.add([]*OperationPage{nil, candidate, candidate})
	require.Len(t, candidates.list, 1)
	assert.Same(t, candidate, candidates.list[0])

	external := relatedOperation("external", "GET", "/users/{userId}", "Users")
	assert.Empty(t, index.Related(external))
}

func TestLLMRelatedOperationIndexCoversObjectMappingAndSortTies(t *testing.T) {
	subject := relatedOperation("subject", "GET", "/root", "Tie")
	pathB := relatedOperation("path-b", "GET", "/b", "Tie")
	pathA := relatedOperation("path-a", "GET", "/a", "Tie")
	samePathFirst := relatedOperation("same-first", "GET", "/root")
	samePathSecond := relatedOperation("same-second", "GET", "/root")
	objectMapping := relatedOperation("mapping", "GET", "/identity/object-mappings/target")
	objectSubject := relatedOperation("mapping-subject", "PATCH", "/identity/object-mappings/source")
	zeroScore := relatedOperation("zero", "GET", "/zero")

	index := newLLMRelatedOperationIndex(&Site{Operations: []*OperationPage{
		subject,
		pathB,
		pathA,
		samePathFirst,
		samePathSecond,
		objectMapping,
		zeroScore,
	}})

	related := index.Related(subject)
	require.Len(t, related, relatedOperationLimit)
	assert.Equal(t, []string{"same-first", "same-second", "path-a", "path-b"}, relatedOperationSlugs(related))

	mappingRelated := index.Related(objectSubject)
	require.Len(t, mappingRelated, 1)
	assert.Equal(t, "mapping", mappingRelated[0].Slug)
}

func TestCollectRelatedOperationsWithIndexHandlesNilInputs(t *testing.T) {
	assert.Nil(t, collectRelatedOperationsWithIndex(nil, relatedOperation("x", "GET", "/x"), nil))
	assert.Nil(t, collectRelatedOperationsWithIndex(&Site{}, nil, nil))
	assert.Nil(t, (*llmRelatedOperationIndex)(nil).Related(relatedOperation("x", "GET", "/x")))
	assert.Nil(t, newLLMRelatedOperationIndex(nil).Related(nil))
	assert.Nil(t, (*llmRelatedOperationIndex)(nil).relatedForMetadata(relatedOperation("x", "GET", "/x"), nil))
	assert.Nil(t, newLLMRelatedOperationIndex(nil).relatedCandidates(nil))
}

func TestLLMRelatedOperationIndexRelatedIsReadOnlyUnderConcurrency(t *testing.T) {
	subject := relatedOperation("subject", "PATCH", "/users/{userId}", "Users")
	samePath := relatedOperation("same-path", "GET", "/users/{userId}", "Users")
	prefix := relatedOperation("prefix", "GET", "/users/{userId}/messages", "Messages")
	tag := relatedOperation("tag", "GET", "/groups", "Users")
	index := newLLMRelatedOperationIndex(&Site{Operations: []*OperationPage{subject, samePath, prefix, tag}})
	expected := relatedOperationSlugs(index.Related(subject))

	require.NotEmpty(t, expected)

	var wg sync.WaitGroup
	for range 32 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			assert.Equal(t, expected, relatedOperationSlugs(index.Related(subject)))
		}()
	}
	wg.Wait()
}

func TestLLMRelatedCandidateSetDedupesNilCandidates(t *testing.T) {
	first := relatedOperation("first", "GET", "/first")
	second := relatedOperation("second", "GET", "/second")

	var candidates llmRelatedCandidateSet
	candidates.add([]*OperationPage{nil, first, second, first})

	assert.Equal(t, []string{"first", "second"}, relatedOperationSlugs(candidates.list))
}

func TestLLMRelatedOperationIndexSkipsZeroScoreCandidates(t *testing.T) {
	subject := relatedOperation("subject", "GET", "/subject")
	candidate := relatedOperation("candidate", "GET", "/candidate")
	index := newLLMRelatedOperationIndex(&Site{Operations: []*OperationPage{candidate}})
	subjectMeta := newLLMRelatedOperationMetadata(subject, -1)
	index.pathOperations[subjectMeta.path] = append(index.pathOperations[subjectMeta.path], candidate)

	assert.Empty(t, index.relatedForMetadata(subject, subjectMeta))
}

func TestInsertTopRelatedOperationCandidateKeepsBestFour(t *testing.T) {
	assert.Nil(t, insertTopRelatedOperationCandidate(nil, llmRelatedOperationCandidate{}))

	var store [relatedOperationLimit]llmRelatedOperationCandidate
	top := store[:0]
	for _, candidate := range []llmRelatedOperationCandidate{
		{operation: relatedOperation("c", "GET", "/c"), score: 1, path: "/c", ordinal: 2},
		{operation: relatedOperation("b", "GET", "/b"), score: 1, path: "/b", ordinal: 2},
		{operation: relatedOperation("a-late", "GET", "/a"), score: 1, path: "/a", ordinal: 2},
		{operation: relatedOperation("a-first", "GET", "/a"), score: 1, path: "/a", ordinal: 1},
		{operation: relatedOperation("best", "GET", "/z"), score: 5, path: "/z", ordinal: 9},
		{operation: relatedOperation("rejected", "GET", "/z"), score: 0, path: "/z", ordinal: 0},
	} {
		top = insertTopRelatedOperationCandidate(top, candidate)
	}

	assert.Equal(t, []string{"best", "a-first", "a-late", "b"}, relatedCandidateSlugs(top))
}

func TestLLMRelatedOperationMetadataHelpers(t *testing.T) {
	assert.Nil(t, operationPathSegments(""))
	assert.Nil(t, operationPathSegments("/"))
	assert.Equal(t, []string{"users", "{userId}", "messages"}, operationPathSegments("/users/{userId}/messages/"))
	assert.Nil(t, operationPathPrefixes(nil))
	assert.Equal(t, []string{"/users", "/users/{userId}", "/users/{userId}/messages"}, operationPathPrefixes([]string{"users", "{userId}", "messages"}))
	assert.Equal(t, 2, sharedPathSegmentCount([]string{"users", "{userId}", "messages"}, []string{"users", "{userId}", "events"}))
	assert.Equal(t, 1, sharedPathSegmentCount([]string{"users", "{userId}"}, []string{"users"}))
	assert.Equal(t, 0, sharedPathSegmentCount([]string{"users"}, []string{"groups"}))
	assert.Equal(t, "/users/{userId}", sharedPathPrefix("/users/{userId}/messages", "/users/{userId}/events"))
	assert.Equal(t, "", sharedPathPrefix("/users", "/groups"))
	assert.Nil(t, newLLMRelatedOperationMetadata(nil, 7).operation)
}

func TestLLMRelatedOperationScoreBranches(t *testing.T) {
	subject := newLLMRelatedOperationMetadata(relatedOperation("patch", "PATCH", "/object-mappings/{id}", "Mapping"), 0)
	subject.resourceOperationIDs["get"] = struct{}{}
	candidate := newLLMRelatedOperationMetadata(relatedOperation("get", "GET", "/object-mappings/{id}", "Mapping"), 1)
	candidate.operation.OperationID = "get"

	assert.Equal(t, 166, scoreRelatedOperation(subject, candidate))
	assert.Zero(t, scoreRelatedOperation(nil, candidate))
	assert.Zero(t, scoreRelatedOperation(subject, nil))
	assert.Zero(t, scoreRelatedOperation(&llmRelatedOperationMetadata{}, candidate))
	assert.False(t, relatedOperationTagsOverlap(nil, map[string]struct{}{"a": {}}))
	assert.False(t, relatedOperationTagsOverlap(map[string]struct{}{"a": {}}, map[string]struct{}{"b": {}}))
	assert.True(t, relatedOperationTagsOverlap(map[string]struct{}{"a": {}, "b": {}}, map[string]struct{}{"a": {}}))
}

func TestOperationResourceOperationIDsFiltersExtensions(t *testing.T) {
	ids := operationResourceOperationIDs(&OperationPage{
		Parameters: []*ParameterInfo{
			nil,
			{
				Extensions: []*ExtensionEntry{
					nil,
					{Key: "sailpoint-resource-operation-id", Value: ""},
					{Key: "sailpoint-resource-operation-id", Value: 42},
					{Key: "sailpoint-resource-operation-id", Value: "get-resource"},
				},
			},
		},
	})

	assert.Equal(t, map[string]struct{}{"get-resource": {}}, ids)
	assert.Empty(t, operationResourceOperationIDs(nil))
}

func relatedOperation(slug, method, path string, tags ...string) *OperationPage {
	return &OperationPage{
		Slug:   slug,
		Method: method,
		Path:   path,
		Tags:   tags,
	}
}

func relatedOperationSlugs(operations []*OperationPage) []string {
	slugs := make([]string, 0, len(operations))
	for _, op := range operations {
		slugs = append(slugs, op.Slug)
	}
	return slugs
}

func relatedCandidateSlugs(candidates []llmRelatedOperationCandidate) []string {
	slugs := make([]string, 0, len(candidates))
	for _, candidate := range candidates {
		slugs = append(slugs, candidate.operation.Slug)
	}
	return slugs
}

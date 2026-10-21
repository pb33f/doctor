package v3

import (
	"strconv"
	"testing"

	"github.com/pb33f/testify/require"
)

func TestAppendKeySegmentMatchesWalkedPath(t *testing.T) {
	bases := []struct {
		name   string
		path   string
		parent func() *Foundation
	}{
		{name: "empty", path: "", parent: func() *Foundation { return &Foundation{} }},
		{name: "document_root", path: "$", parent: func() *Foundation { return &Foundation{PathSegment: "document"} }},
		{name: "dollar_root", path: "$", parent: func() *Foundation { return &Foundation{PathSegment: "$"} }},
		{name: "properties", path: "properties", parent: func() *Foundation { return &Foundation{PathSegment: "properties"} }},
		{name: "document_paths", path: "$.paths", parent: func() *Foundation {
			return &Foundation{PathSegment: "paths", Parent: &Foundation{PathSegment: "document"}}
		}},
	}
	keys := []struct{ name, value string }{
		{name: "plain", value: "name"},
		{name: "quote", value: "owner's"},
		{name: "double_quote", value: `a"b`},
		{name: "backslash", value: `a\b`},
		{name: "punctuation", value: "a.b[]/$"},
		{name: "unicode", value: "雪☃"},
		{name: "whitespace", value: "a\n\tb"},
		{name: "combined", value: "a'\\b.[]雪"},
	}
	for _, base := range bases {
		for _, key := range keys {
			t.Run(base.name+"/"+key.name, func(t *testing.T) {
				leaf := &Foundation{Parent: base.parent(), Key: key.value}
				want := base.path + "['" + key.value + "']"
				require.Equal(t, want, AppendKeySegment(base.path, key.value))
				require.Equal(t, want, leaf.GenerateJSONPath())
			})
		}
	}
}

func TestAppendKeySegmentEmptyKeyContract(t *testing.T) {
	require.Equal(t, "$.paths['']", AppendKeySegment("$.paths", ""))
	leaf := &Foundation{Parent: &Foundation{PathSegment: "paths", Parent: &Foundation{PathSegment: "document"}}}
	require.Equal(t, "$.paths", leaf.GenerateJSONPath(), "an empty walker key denotes no key segment")
}

type mutatingEmptyPathParent struct {
	*Foundation
	target      *Foundation
	replacement string
}

func (p *mutatingEmptyPathParent) GetParent() Foundational {
	p.target.PathSegment = p.replacement
	return nil
}

func TestJSONPathEmptySegmentsReceiverMutation(t *testing.T) {
	for _, tc := range []struct{ replacement, want string }{{"document", "$"}, {"$", "$"}, {"changed", "changed"}} {
		t.Run(tc.replacement, func(t *testing.T) {
			build := func() *Foundation {
				leaf := &Foundation{}
				leaf.Parent = &mutatingEmptyPathParent{Foundation: &Foundation{}, target: leaf, replacement: tc.replacement}
				return leaf
			}
			require.Equal(t, tc.want, legacyJSONPath(build()), "independent legacy traversal")
			require.Equal(t, tc.want, build().GenerateJSONPath())
		})
	}
}

func TestJSONPathIndexLength(t *testing.T) {
	maxInt := int(^uint(0) >> 1)
	values := []int{0, 1, -1, 9, -9, 10, -10, 99, -99, 100, -100, maxInt, -maxInt - 1}
	for power := 10; power <= maxInt/10; power *= 10 {
		values = append(values, power-1, power, power+1, -power+1, -power, -power-1)
	}
	for _, value := range values {
		t.Run(strconv.Itoa(value), func(t *testing.T) { require.Equal(t, len(strconv.Itoa(value)), jsonPathIndexLength(value)) })
	}
}

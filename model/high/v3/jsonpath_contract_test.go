package v3

import (
	"fmt"
	"strconv"
	"strings"
	"sync"
	"testing"
)

type pathParent struct{ *Foundation }

type changingPathParent struct {
	*Foundation
	calls    []string
	position *int
}

func (p *changingPathParent) GetKeyValue() string { p.calls = append(p.calls, "key"); return p.Key }
func (p *changingPathParent) GetPathSegment() string {
	p.calls = append(p.calls, "segment")
	return p.PathSegment
}
func (p *changingPathParent) GetIndexValue() *int {
	p.calls = append(p.calls, "index")
	return p.position
}
func (p *changingPathParent) GetParent() Foundational {
	p.calls = append(p.calls, "parent")
	*p.position = 99
	return nil
}

func TestJSONPathGrammar(t *testing.T) {
	index := 3
	negative := -3
	minInt := -int(^uint(0)>>1) - 1
	maxInt := int(^uint(0) >> 1)
	cases := []struct {
		name  string
		value *Foundation
		want  string
	}{
		{"empty", &Foundation{}, ""},
		{"root", &Foundation{PathSegment: "document"}, "$"},
		{"dollar", &Foundation{PathSegment: "$"}, "$"},
		{"key", &Foundation{PathSegment: "properties", Key: "a'\\b.[]雪"}, "properties['a'\\b.[]雪']"},
		{"key takes precedence", &Foundation{PathSegment: "p", Key: "k", Index: &index, CacheSplit: true}, "p['k']"},
		{"index", &Foundation{PathSegment: "allOf", Index: &index}, "allOf[3]"},
		{"negative", &Foundation{Index: &negative}, "[-3]"},
		{"minimum", &Foundation{Index: &minInt}, "[" + strconv.Itoa(minInt) + "]"},
		{"maximum", &Foundation{Index: &maxInt}, "[" + strconv.Itoa(maxInt) + "]"},
		{"split", &Foundation{PathSegment: "p", Index: &index, CacheSplit: true}, "pCACHE-SPLIT[3]--"},
		{"keyed root", &Foundation{PathSegment: "document", Key: "x"}, "document['x']"},
		{"indexed root", &Foundation{PathSegment: "document", Index: &index}, "document[3]"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := tc.value.GenerateJSONPath(); got != tc.want {
				t.Fatalf("got %q, want %q", got, tc.want)
			}
		})
	}
	for _, segment := range []string{"", "[raw]", "CACHE-SPLIT", "CACHE-SPLIT[raw]", "CACHE-", "document", "$"} {
		for _, key := range []string{"", "k"} {
			for _, split := range []bool{false, true} {
				root := &Foundation{PathSegment: "document"}
				leaf := &Foundation{Parent: root, PathSegment: segment, Key: key, Index: &index, CacheSplit: split}
				if got, want := leaf.GenerateJSONPath(), legacyJSONPath(leaf); got != want {
					t.Fatalf("segment=%q key=%q split=%v got=%q want=%q", segment, key, split, got, want)
				}
			}
		}
	}
}

func TestJSONPathDepthAndCycles(t *testing.T) {
	for _, depth := range []int{1, 16, 17, 149, 150, 151, 300} {
		t.Run(fmt.Sprint(depth), func(t *testing.T) {
			var leaf *Foundation
			for i := 0; i < depth; i++ {
				next := &Foundation{PathSegment: "p", Key: fmt.Sprint(i)}
				if leaf != nil {
					next.Parent = leaf
				}
				leaf = next
			}
			if got, want := leaf.GenerateJSONPath(), legacyJSONPath(leaf); got != want {
				t.Fatalf("depth %d mismatch", depth)
			}
		})
	}
	root := &Foundation{PathSegment: "document"}
	leaf := &Foundation{PathSegment: "x", Parent: root}
	root.Parent = leaf
	if got, want := leaf.GenerateJSONPath(), "$.x"+strings.Repeat(".document.x", 74); got != want {
		t.Fatalf("cycle got %q want %q", got, want)
	}
	empty := &Foundation{}
	empty.Parent = empty
	if got := empty.GenerateJSONPath(); got != "" {
		t.Fatalf("empty cycle: %q", got)
	}
}

func TestJSONPathCustomParentsAndCache(t *testing.T) {
	index := 7
	parent := &pathParent{Foundation: &Foundation{PathSegment: "allOf", Index: &index, CacheSplit: true}}
	leaf := &Foundation{PathSegment: "child", Parent: parent}
	if got := leaf.GenerateJSONPath(); got != "allOf[7].child" {
		t.Fatal(got)
	}
	changing := &changingPathParent{Foundation: &Foundation{PathSegment: "p"}, position: &index}
	leaf = &Foundation{PathSegment: "child", Parent: changing}
	if got := leaf.GenerateJSONPath(); got != "p[7].child" {
		t.Fatal(got)
	}
	if got := strings.Join(changing.calls, ","); got != "key,segment,index,parent" {
		t.Fatal(got)
	}
	leaf = &Foundation{PathSegment: "original"}
	leaf.setCanonicalJSONPath("$.canonical")
	var wg sync.WaitGroup
	for i := 0; i < 32; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if got := leaf.GenerateJSONPath(); got != "$.canonical" {
				t.Error(got)
			}
		}()
	}
	wg.Wait()
	cached := &Foundation{PathSegment: "first"}
	if cached.GenerateJSONPath() != "first" {
		t.Fatal("initial path")
	}
	cached.SetPathSegment("second")
	if cached.GenerateJSONPathWithLevel(0) != "first" {
		t.Fatal("cache changed")
	}
}

func FuzzJSONPathParity(f *testing.F) {
	for _, seed := range [][]byte{{0}, {1, 2, 3}, {255, 149, 150, 151}, {4, 8, 16, 32, 64}} {
		f.Add(seed)
	}
	f.Fuzz(func(t *testing.T, data []byte) {
		if len(data) == 0 {
			return
		}
		if len(data) > 180 {
			data = data[:180]
		}
		segments := []string{"", "document", "$", "[raw]", "CACHE-SPLIT", "CACHE-SPLIT[", "p", "雪", "CACHE-"}
		keys := []string{"", "k", "a'b", "a\\b", "[]", "雪"}
		var parent Foundational
		for i, b := range data {
			n := &Foundation{Parent: parent, PathSegment: segments[int(b)%len(segments)], Key: keys[(int(b)/3)%len(keys)], CacheSplit: b&1 != 0}
			if b&2 != 0 {
				position := int(int8(b)) * i
				n.Index = &position
			}
			if b&4 != 0 {
				parent = &pathParent{Foundation: n}
			} else {
				parent = n
			}
		}
		leaf := &Foundation{Parent: parent, PathSegment: "tail"}
		if got, want := leaf.GenerateJSONPath(), legacyJSONPath(leaf); got != want {
			t.Fatalf("got %q want %q", got, want)
		}
	})
}

func TestJSONPathSparseDepthBoundary(t *testing.T) {
	var parent Foundational
	for depth := 151; depth >= 1; depth-- {
		segment := ""
		if depth == 150 {
			segment = "included"
		} else if depth == 151 {
			segment = "excluded"
		}
		parent = &Foundation{Parent: parent, PathSegment: segment}
	}
	if got := parent.GenerateJSONPath(); got != "included" {
		t.Fatalf("sparse depth boundary: got %q, want included", got)
	}
}

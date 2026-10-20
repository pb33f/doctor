package model

import (
	"fmt"
	"math/rand"
	"reflect"
	"testing"

	dr "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
)

type lookupTestModel struct {
	*dr.Foundation
	id         int
	paths      []string
	calls      int
	key, value *yaml.Node
	trace      *[]string
	mutateKey  bool
}

func (m *lookupTestModel) GenerateJSONPath() string {
	if m.trace != nil {
		*m.trace = append(*m.trace, fmt.Sprintf("path:%d", m.id))
	}
	i := m.calls
	m.calls++
	if i >= len(m.paths) {
		i = len(m.paths) - 1
	}
	return m.paths[i]
}
func (m *lookupTestModel) GetKeyNode() *yaml.Node {
	if m.trace != nil {
		*m.trace = append(*m.trace, fmt.Sprintf("key:%d", m.id))
	}
	return m.key
}
func (m *lookupTestModel) GetValueNode() *yaml.Node {
	if m.trace != nil {
		*m.trace = append(*m.trace, fmt.Sprintf("value:%d", m.id))
	}
	if m.mutateKey && m.key != nil {
		m.key.Line = -123
		m.key.Column = 100000000
	}
	return m.value
}

func TestLocatedModelSortKeyEquivalent(t *testing.T) {
	maxInt := int(^uint(0) >> 1)
	coords := []int{0, 1, -1, 1234567, -1234567, 12345678, -12345678, 100000000, maxInt, -maxInt - 1}
	paths := []string{"", "$", "$['a|b']", "$['a:b']", "a", "a|", "a\x00z", "é/\"\\"}
	for _, path := range paths {
		for _, n := range coords {
			for _, nilNodes := range []bool{false, true} {
				m := &lookupTestModel{paths: []string{path}, key: &yaml.Node{Line: n, Column: -1}, value: &yaml.Node{Line: maxInt, Column: n}}
				if nilNodes {
					m.key = nil
					m.value = nil
				}
				want := locatedModelSortKeyReference(m)
				m.calls = 0
				if got := locatedModelSortKey(m); got != want {
					t.Fatalf("%q: got %q want %q", path, got, want)
				}
			}
		}
	}
	if locatedModelSortKey(nil) != "" {
		t.Fatal("nil key")
	}
	m := &lookupTestModel{paths: []string{"a"}, key: &yaml.Node{Line: 2}, value: &yaml.Node{}, mutateKey: true}
	want := locatedModelSortKeyReference(m)
	m.calls = 0
	m.key.Line = 2
	m.key.Column = 0
	if got := locatedModelSortKey(m); got != want {
		t.Fatalf("value getter mutation: %q != %q", got, want)
	}
}

func TestStableLocatedModelsDifferential(t *testing.T) {
	for _, size := range []int{0, 1, 2, 7, 8, 12, 13, 16, 17, 49, 50, 128, 1024} {
		for seed := int64(0); seed < 12; seed++ {
			t.Run(fmt.Sprintf("%d/%d", size, seed), func(t *testing.T) {
				rng := rand.New(rand.NewSource(seed))
				var trace []string
				models := make([]dr.Foundational, size)
				all := make([]*lookupTestModel, 0, size)
				for i := range models {
					if rng.Intn(9) == 0 {
						continue
					}
					// Empty first paths retain distinct models with tied second sort keys.
					paths := []string{"", fmt.Sprintf("p%d|", rng.Intn(3))}
					if seed%2 != 0 {
						paths = []string{fmt.Sprintf("p%d", rng.Intn(7)), "changed"}
					}
					m := &lookupTestModel{id: i, paths: paths, key: &yaml.Node{Line: rng.Intn(3) - 1}, trace: &trace}
					all = append(all, m)
					models[i] = m
				}
				input := append([]dr.Foundational{}, models...)
				expected := stableLocatedModelsReference(models)
				expectedTrace := append([]string{}, trace...)
				trace = nil
				for _, m := range all {
					m.calls = 0
				}
				got := stableLocatedModels(models)
				if !reflect.DeepEqual(got, expected) {
					t.Fatal("ordered model identities differ")
				}
				if !reflect.DeepEqual(trace, expectedTrace) && !(len(trace) == 0 && len(expectedTrace) == 0) {
					t.Fatal("getter sequence differs")
				}
				for i := range models {
					if models[i] != input[i] {
						t.Fatal("input changed")
					}
				}
				if size >= 2 && len(got) > 0 {
					saved := models[0]
					got[0] = nil
					if models[0] != saved {
						t.Fatal("output aliases input")
					}
				}
			})
		}
	}
}

func TestStableLocatedModelsTypedNil(t *testing.T) {
	var absent *lookupTestModel
	for _, models := range [][]dr.Foundational{nil, {nil}, {absent}, {nil, nil}, {absent, nil}} {
		run := func(f func([]dr.Foundational) []dr.Foundational) (out []dr.Foundational, panicked bool) {
			defer func() {
				if recover() != nil {
					panicked = true
				}
			}()
			out = f(models)
			return
		}
		a, ap := run(stableLocatedModelsReference)
		b, bp := run(stableLocatedModels)
		if ap != bp || !reflect.DeepEqual(a, b) {
			t.Fatal("nil behavior differs")
		}
	}
}

func BenchmarkLookupNormalization(b *testing.B) {
	for _, size := range []int{2, 8, 16, 32, 128} {
		models := make([]dr.Foundational, size)
		for i := range models {
			models[i] = &lookupTestModel{paths: []string{fmt.Sprintf("$.components.schemas['schema%d'].properties['field']", size-i)}, key: &yaml.Node{Line: 1234, Column: 12}}
		}
		for _, legacy := range []bool{true, false} {
			b.Run(fmt.Sprintf("size=%d/legacy=%t", size, legacy), func(b *testing.B) {
				b.ReportAllocs()
				for b.Loop() {
					var out []dr.Foundational
					if legacy {
						out = stableLocatedModelsReference(models)
					} else {
						out = stableLocatedModels(models)
					}
					if len(out) != size {
						b.Fatal("lost models")
					}
				}
			})
		}
	}
}

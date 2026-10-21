package model

import (
	"fmt"
	"math/rand"
	"reflect"
	"testing"

	dr "github.com/pb33f/doctor/model/high/v3"
)

type lineIndexObject struct {
	*dr.Foundation
	path  string
	calls *int
}

func (o lineIndexObject) GenerateJSONPath() string {
	if o.calls != nil {
		*o.calls++
	}
	return o.path
}

func TestCompactLineIndexPointerAndAlias(t *testing.T) {
	calls := 0
	a := &lineIndexObject{Foundation: &dr.Foundation{}, path: "a", calls: &calls}
	b := &lineIndexObject{Foundation: &dr.Foundation{}, path: "a", calls: &calls}
	w := &DrDocument{}
	w.addLineObject(1, a, nil)
	w.addLineObject(1, a, nil)
	if calls != 0 || len(w.lineObjects[1]) != 1 || len(w.lineObjectPtrs[1]) != 0 {
		t.Fatal("single pointer allocated an identity map or called a path getter")
	}
	w.addLineObject(1, b, nil)
	b.path = "changed"
	calls = 0
	w.addLineObject(1, b, nil)
	if calls != 0 || len(w.lineObjects[1]) != 1 {
		t.Fatal("discarded alias identity was forgotten")
	}
}

func TestCompactLineIndexPromotionKeepsExistingIdentity(t *testing.T) {
	calls := 0
	first := &lineIndexObject{Foundation: &dr.Foundation{}, path: "first", calls: &calls}
	second := &lineIndexObject{Foundation: &dr.Foundation{}, path: "second", calls: &calls}
	w := &DrDocument{}
	w.addLineObject(1, first, nil)
	// Value objects have no pointer identity and must not add a zero map entry.
	for i := 0; i < 24; i++ {
		w.addLineObject(1, lineIndexObject{Foundation: &dr.Foundation{}, path: fmt.Sprint(i)}, nil)
	}
	w.addLineObject(1, second, nil)
	if len(w.lineObjectPtrs[1]) != 2 {
		t.Fatalf("expected two pointer identities, got %d", len(w.lineObjectPtrs[1]))
	}
	calls = 0
	w.addLineObject(1, first, nil)
	w.addLineObject(1, second, nil)
	if calls != 0 || len(w.lineObjects[1]) != 26 {
		t.Fatal("promotion lost an existing identity or changed pointer deduplication")
	}
}

func TestCompactLineIndexDifferential(t *testing.T) {
	for seed := int64(0); seed < 32; seed++ {
		t.Run(fmt.Sprint(seed), func(t *testing.T) {
			calls := 0
			objects := make([]*lineIndexObject, 24)
			for i := range objects {
				objects[i] = &lineIndexObject{Foundation: &dr.Foundation{}, path: fmt.Sprint(i % 7), calls: &calls}
			}
			old, next := &DrDocument{}, &DrDocument{}
			oldDebug, nextDebug := make([]any, 8), make([]any, 8)
			rng := rand.New(rand.NewSource(seed))
			for step := 0; step < 400; step++ {
				o := objects[rng.Intn(len(objects))]
				if rng.Intn(5) == 0 {
					o.path = fmt.Sprint(rng.Intn(9))
				}
				var value any = o
				if rng.Intn(5) == 0 {
					value = *o
				}
				line := rng.Intn(8)
				calls = 0
				old.addLineObjectReference(line, value, oldDebug)
				wantCalls := calls
				calls = 0
				next.addLineObject(line, value, nextDebug)
				if calls != wantCalls {
					t.Fatalf("step %d: getters %d want %d", step, calls, wantCalls)
				}
				if !reflect.DeepEqual(old.lineObjects, next.lineObjects) || !reflect.DeepEqual(oldDebug, nextDebug) {
					t.Fatalf("step %d: retained objects or debug slices differ", step)
				}
			}
		})
	}
}

func TestCompactLineIndexNilAndValueBehavior(t *testing.T) {
	var typedNil *lineIndexObject
	value := lineIndexObject{Foundation: &dr.Foundation{}, path: "a"}
	for _, first := range []any{nil, typedNil, value} {
		for _, second := range []any{nil, typedNil, value, &value} {
			old, next := &DrDocument{}, &DrDocument{}
			old.addLineObjectReference(1, first, nil)
			next.addLineObject(1, first, nil)
			run := func(f func()) (panicked bool) {
				defer func() {
					if recover() != nil {
						panicked = true
					}
				}()
				f()
				return
			}
			a := run(func() { old.addLineObjectReference(1, second, nil) })
			b := run(func() { next.addLineObject(1, second, nil) })
			if a != b || !reflect.DeepEqual(old.lineObjects, next.lineObjects) {
				t.Fatalf("behavior differs for %T followed by %T", first, second)
			}
		}
	}
}

func BenchmarkLineIdentityIndex(b *testing.B) {
	for _, size := range []int{1, 2, 32} {
		objects := make([]*lineIndexObject, size)
		for i := range objects {
			objects[i] = &lineIndexObject{Foundation: &dr.Foundation{}, path: fmt.Sprint(i)}
		}
		for _, repeat := range []bool{false, true} {
			for _, legacy := range []bool{true, false} {
				b.Run(fmt.Sprintf("size=%d/repeat=%t/legacy=%t", size, repeat, legacy), func(b *testing.B) {
					b.ReportAllocs()
					for b.Loop() {
						w := &DrDocument{
							lineObjects:    make(map[int][]any),
							lineObjectPtrs: make(map[int]map[uintptr]struct{}),
						}
						for _, o := range objects {
							if legacy {
								w.addLineObjectReference(1, o, nil)
							} else {
								w.addLineObject(1, o, nil)
							}
						}
						if repeat {
							for _, o := range objects {
								if legacy {
									w.addLineObjectReference(1, o, nil)
								} else {
									w.addLineObject(1, o, nil)
								}
							}
						}
						if len(w.lineObjects[1]) != size {
							b.Fatal("lost objects")
						}
					}
				})
			}
		}
	}
}

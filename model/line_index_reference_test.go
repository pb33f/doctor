package model

import drV3 "github.com/pb33f/doctor/model/high/v3"

// frozen insertion behavior from Doctor 2ccaf55, for differential tests.
func (w *DrDocument) addLineObjectReference(line int, obj any, ln []any) {
	if w.lineObjects == nil {
		w.lineObjects = make(map[int][]any)
	}
	if w.lineObjectPtrs == nil {
		w.lineObjectPtrs = make(map[int]map[uintptr]struct{})
	}

	ptr := objectIdentity(obj)
	objects := w.lineObjects[line]

	if objects == nil {
		w.lineObjects[line] = []any{obj}
		if ptr != 0 {
			w.lineObjectPtrs[line] = map[uintptr]struct{}{ptr: {}}
		}

		if ln != nil {
			ln[line] = w.lineObjects[line]
		}
		return
	}

	if ptr != 0 {
		ptrs := w.lineObjectPtrs[line]
		if ptrs == nil {
			ptrs = make(map[uintptr]struct{}, len(objects))
			for _, existing := range objects {
				existingPtr := objectIdentity(existing)
				if existingPtr != 0 {
					ptrs[existingPtr] = struct{}{}
				}
			}
			w.lineObjectPtrs[line] = ptrs
		}
		if _, exists := ptrs[ptr]; exists {
			return
		}
	}

	path := obj.(drV3.Foundational).GenerateJSONPath()
	for _, existing := range objects {
		foundational, ok := existing.(drV3.Foundational)
		if ok && foundational.GenerateJSONPath() == path {
			if ptr != 0 {
				w.lineObjectPtrs[line][ptr] = struct{}{}
			}
			return
		}
	}

	w.lineObjects[line] = append(objects, obj)
	if ptr != 0 {
		w.lineObjectPtrs[line][ptr] = struct{}{}
	}
}

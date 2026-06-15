// Copyright 2026 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: Apache-2.0

package v3

import (
	"github.com/pb33f/libopenapi/datamodel/low"
	"github.com/pb33f/libopenapi/orderedmap"
	"go.yaml.in/yaml/v4"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"sync"
)

// lowNodeFinder resolves the low-level key/value yaml nodes for entries of a
// high-level ordered map without re-scanning the low map for every key.
//
// libopenapi builds every high-level map by iterating its low-level
// counterpart in order, so when the caller looks keys up in high-map order the
// matching low pair is always the next one — an O(1) lockstep advance instead
// of the O(n) scan-per-key it replaces. If the maps ever disagree (an entry
// filtered or reordered), find falls back to a full scan from the head, so
// behavior is identical to the historical linear search.
type lowNodeFinder[T any] struct {
	head    orderedmap.Pair[low.KeyReference[string], low.ValueReference[T]]
	current orderedmap.Pair[low.KeyReference[string], low.ValueReference[T]]
}

func newLowNodeFinder[T any](m *orderedmap.Map[low.KeyReference[string], low.ValueReference[T]]) *lowNodeFinder[T] {
	if m == nil {
		return &lowNodeFinder[T]{}
	}
	first := m.First()
	return &lowNodeFinder[T]{head: first, current: first}
}

func (f *lowNodeFinder[T]) find(key string) (keyNode, valueNode *yaml.Node, ok bool) {
	pair, ok := f.findPair(key)
	if !ok {
		return nil, nil, false
	}
	return pair.Key().KeyNode, pair.Value().ValueNode, true
}

func (f *lowNodeFinder[T]) findPair(key string) (orderedmap.Pair[low.KeyReference[string], low.ValueReference[T]], bool) {
	if f == nil {
		return nil, false
	}
	if f.current != nil && f.current.Key().Value == key {
		pair := f.current
		f.current = f.current.Next()
		return pair, true
	}
	// lockstep miss: fall back to a full scan, then re-align after the hit.
	for pair := f.head; pair != nil; pair = pair.Next() {
		if pair.Key().Value == key {
			f.current = pair.Next()
			return pair, true
		}
	}
	return nil, false
}

// titleCaserPool amortizes caser construction across Walks. A cases.Caser is
// NOT safe for concurrent use (it carries transformer state), so concurrent
// walkers each take their own from the pool.
var titleCaserPool = sync.Pool{
	New: func() any {
		c := cases.Title(language.English)
		return &c
	},
}

func titleString(s string) string {
	c := titleCaserPool.Get().(*cases.Caser)
	out := c.String(s)
	titleCaserPool.Put(c)
	return out
}

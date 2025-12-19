// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package diagramatron

import (
	"sort"
	"sync"
	"time"
)

// Cache is a thread-safe generic cache with LRU eviction
type Cache[K comparable, V any] struct {
	mu           sync.RWMutex
	items        map[K]*CacheEntry[V]
	maxSize      int
	evictPercent float32
}

// CacheEntry tracks cached values with LRU information
type CacheEntry[V any] struct {
	Value      V
	LastAccess time.Time
}

// NewCache creates a new cache with specified max size and eviction percentage
func NewCache[K comparable, V any](maxSize int, evictPercent float32) *Cache[K, V] {
	if maxSize <= 0 {
		maxSize = 1000
	}
	if evictPercent <= 0 || evictPercent >= 1 {
		evictPercent = 0.2 // default 20%
	}
	return &Cache[K, V]{
		items:        make(map[K]*CacheEntry[V]),
		maxSize:      maxSize,
		evictPercent: evictPercent,
	}
}

// Get retrieves a value from cache and updates last access time
func (c *Cache[K, V]) Get(key K) (V, bool) {
	c.mu.RLock()
	if entry, exists := c.items[key]; exists {
		c.mu.RUnlock()
		// update last access time with write lock
		c.mu.Lock()
		entry.LastAccess = time.Now()
		c.mu.Unlock()
		return entry.Value, true
	}
	c.mu.RUnlock()
	var zero V
	return zero, false
}

// Set stores a value in cache and enforces size limits
func (c *Cache[K, V]) Set(key K, value V) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.enforceLimitLocked()
	c.items[key] = &CacheEntry[V]{
		Value:      value,
		LastAccess: time.Now(),
	}
}

// Clear removes all entries from cache
func (c *Cache[K, V]) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items = make(map[K]*CacheEntry[V])
}

// Len returns the number of items in cache
func (c *Cache[K, V]) Len() int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return len(c.items)
}

// enforceLimitLocked implements LRU eviction when max size is reached
// caller must hold write lock
func (c *Cache[K, V]) enforceLimitLocked() {
	if len(c.items) < c.maxSize {
		return
	}

	type entry struct {
		key  K
		time time.Time
	}

	entries := make([]entry, 0, len(c.items))
	for k, v := range c.items {
		entries = append(entries, entry{k, v.LastAccess})
	}

	// sort by access time (oldest first)
	sort.Slice(entries, func(i, j int) bool {
		return entries[i].time.Before(entries[j].time)
	})

	// evict oldest entries based on evictPercent
	toEvict := int(float32(c.maxSize) * c.evictPercent)
	if toEvict < 1 {
		toEvict = 1
	}
	for i := 0; i < toEvict && i < len(entries); i++ {
		delete(c.items, entries[i].key)
	}
}

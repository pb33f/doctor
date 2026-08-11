// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"strings"
	"sync"
)

// MemorySpecStateStore is a volatile state store useful for tests and one-shot runs.
type MemorySpecStateStore struct {
	mu         sync.Mutex
	namespaces map[string]map[string]*SpecStateRecord
}

// NewMemorySpecStateStore creates an in-memory state store.
func NewMemorySpecStateStore() *MemorySpecStateStore {
	return &MemorySpecStateStore{
		namespaces: make(map[string]map[string]*SpecStateRecord),
	}
}

func (m *MemorySpecStateStore) Load(namespace string) (map[string]*SpecStateRecord, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	records := m.namespaces[namespace]
	cloned := make(map[string]*SpecStateRecord, len(records))
	for key, record := range records {
		copy := *record
		copy.ExternalRefs = append([]string(nil), record.ExternalRefs...)
		normalizeSpecStateOutputLocations(&copy)
		cloned[key] = &copy
	}
	return cloned, nil
}

func (m *MemorySpecStateStore) Upsert(namespace string, records []*SpecStateRecord) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.namespaces[namespace] == nil {
		m.namespaces[namespace] = make(map[string]*SpecStateRecord)
	}
	for _, record := range records {
		if record == nil {
			continue
		}
		copy := *record
		copy.ExternalRefs = append([]string(nil), record.ExternalRefs...)
		m.namespaces[namespace][record.RelativePath] = &copy
	}
	return nil
}

func (m *MemorySpecStateStore) Delete(namespace string, paths []string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.namespaces[namespace] == nil {
		return nil
	}
	for _, relPath := range paths {
		delete(m.namespaces[namespace], relPath)
	}
	return nil
}

func (m *MemorySpecStateStore) Close() error {
	return nil
}

func normalizeSpecStateOutputLocations(record *SpecStateRecord) {
	if record == nil {
		return
	}
	legacy := strings.TrimSpace(record.OutputSubdir)
	if legacy != "" && strings.TrimSpace(record.HTMLOutputSubdir) == "" &&
		strings.TrimSpace(record.JSONOutputSubdir) == "" && strings.TrimSpace(record.LLMOutputSubdir) == "" {
		record.HTMLOutputSubdir = legacy
		record.JSONOutputSubdir = legacy
		record.LLMOutputSubdir = legacy
	}
}

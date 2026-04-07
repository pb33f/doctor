package printingpress

import (
	"reflect"
	"sync"

	"github.com/cespare/xxhash/v2"
	highbase "github.com/pb33f/libopenapi/datamodel/high/base"
)

type schemaArtifact struct {
	jsonStr       string
	highlightHTML string
	highlighted   bool
}

type schemaArtifactIdentityKey struct {
	typeName string
	ptr      uintptr
}

type schemaArtifactContentKey struct {
	hash uint64
	size int
}

type schemaArtifactCache struct {
	mu         sync.RWMutex
	byIdentity map[schemaArtifactIdentityKey]*schemaArtifact
	byContent  map[schemaArtifactContentKey][]*schemaArtifact
}

func newSchemaArtifactCache() *schemaArtifactCache {
	return &schemaArtifactCache{
		byIdentity: make(map[schemaArtifactIdentityKey]*schemaArtifact),
		byContent:  make(map[schemaArtifactContentKey][]*schemaArtifact),
	}
}

func schemaIdentityKey(schema *highbase.Schema) (schemaArtifactIdentityKey, bool) {
	rv := reflect.ValueOf(schema)
	if !rv.IsValid() || rv.Kind() != reflect.Ptr || rv.IsNil() {
		return schemaArtifactIdentityKey{}, false
	}
	return schemaArtifactIdentityKey{
		typeName: rv.Type().String(),
		ptr:      rv.Pointer(),
	}, true
}

func schemaContentKey(jsonStr string) schemaArtifactContentKey {
	return schemaArtifactContentKey{
		hash: xxhash.Sum64String(jsonStr),
		size: len(jsonStr),
	}
}

func (c *schemaArtifactCache) getByIdentity(schema *highbase.Schema) (*schemaArtifact, bool) {
	key, ok := schemaIdentityKey(schema)
	if !ok {
		return nil, false
	}
	c.mu.RLock()
	artifact := c.byIdentity[key]
	c.mu.RUnlock()
	return artifact, artifact != nil
}

func (c *schemaArtifactCache) getByContent(jsonStr string) (*schemaArtifact, bool) {
	key := schemaContentKey(jsonStr)
	c.mu.RLock()
	candidates := c.byContent[key]
	c.mu.RUnlock()
	for _, artifact := range candidates {
		if artifact != nil && artifact.jsonStr == jsonStr {
			return artifact, true
		}
	}
	return nil, false
}

func (c *schemaArtifactCache) store(schema *highbase.Schema, artifact *schemaArtifact) *schemaArtifact {
	if artifact == nil {
		return nil
	}
	c.mu.Lock()
	defer c.mu.Unlock()

	key := schemaContentKey(artifact.jsonStr)
	candidates := c.byContent[key]
	for _, existing := range candidates {
		if existing != nil && existing.jsonStr == artifact.jsonStr {
			artifact = existing
			break
		}
	}

	found := false
	for _, existing := range c.byContent[key] {
		if existing == artifact {
			found = true
			break
		}
	}
	if !found {
		c.byContent[key] = append(c.byContent[key], artifact)
	}
	if identityKey, ok := schemaIdentityKey(schema); ok {
		c.byIdentity[identityKey] = artifact
	}
	return artifact
}

func (c *schemaArtifactCache) ensureHighlight(artifact *schemaArtifact) {
	if artifact == nil || artifact.highlighted {
		return
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if artifact.highlighted {
		return
	}
	artifact.highlightHTML, _ = highlightJSON(prettyJSON(artifact.jsonStr))
	artifact.highlighted = true
}

func (c *schemaArtifactCache) snapshot(artifact *schemaArtifact) schemaArtifact {
	if artifact == nil {
		return schemaArtifact{}
	}
	c.mu.RLock()
	defer c.mu.RUnlock()
	return schemaArtifact{
		jsonStr:       artifact.jsonStr,
		highlightHTML: artifact.highlightHTML,
		highlighted:   artifact.highlighted,
	}
}

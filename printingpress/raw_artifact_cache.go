package printingpress

import (
	"reflect"
	"strings"
	"sync"

	"github.com/cespare/xxhash/v2"
)

type rawArtifact struct {
	rawYAML       string
	schemaJSON    string
	highlightHTML string
	highlighted   bool
}

type rawArtifactIdentityKey struct {
	typeName string
	ptr      uintptr
}

type rawArtifactContentKey struct {
	hash uint64
	size int
}

type rawArtifactCache struct {
	mu         sync.RWMutex
	byIdentity map[rawArtifactIdentityKey]*rawArtifact
	byContent  map[rawArtifactContentKey][]*rawArtifact
}

func newRawArtifactCache() *rawArtifactCache {
	return &rawArtifactCache{
		byIdentity: make(map[rawArtifactIdentityKey]*rawArtifact),
		byContent:  make(map[rawArtifactContentKey][]*rawArtifact),
	}
}

func artifactIdentityKey(renderable any) (rawArtifactIdentityKey, bool) {
	rv := reflect.ValueOf(renderable)
	if !rv.IsValid() || rv.Kind() != reflect.Ptr || rv.IsNil() {
		return rawArtifactIdentityKey{}, false
	}
	return rawArtifactIdentityKey{
		typeName: rv.Type().String(),
		ptr:      rv.Pointer(),
	}, true
}

func artifactContentKey(rawYAML string) rawArtifactContentKey {
	return rawArtifactContentKey{
		hash: xxhash.Sum64String(rawYAML),
		size: len(rawYAML),
	}
}

func (c *rawArtifactCache) getByIdentity(renderable any) (*rawArtifact, bool) {
	key, ok := artifactIdentityKey(renderable)
	if !ok {
		return nil, false
	}
	c.mu.RLock()
	artifact := c.byIdentity[key]
	c.mu.RUnlock()
	return artifact, artifact != nil
}

func (c *rawArtifactCache) getByContent(rawYAML string) (*rawArtifact, bool) {
	key := artifactContentKey(rawYAML)
	c.mu.RLock()
	candidates := c.byContent[key]
	c.mu.RUnlock()
	for _, artifact := range candidates {
		if artifact != nil && artifact.rawYAML == rawYAML {
			return artifact, true
		}
	}
	return nil, false
}

func (c *rawArtifactCache) store(renderable any, artifact *rawArtifact) *rawArtifact {
	if artifact == nil {
		return nil
	}
	c.mu.Lock()
	defer c.mu.Unlock()

	key := artifactContentKey(artifact.rawYAML)
	candidates := c.byContent[key]
	for _, existing := range candidates {
		if existing != nil && existing.rawYAML == artifact.rawYAML {
			artifact = existing
			break
		}
	}
	if artifact == nil {
		return nil
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
	if identityKey, ok := artifactIdentityKey(renderable); ok {
		c.byIdentity[identityKey] = artifact
	}
	return artifact
}

func (c *rawArtifactCache) ensureHighlight(artifact *rawArtifact) {
	if artifact == nil || artifact.highlighted {
		return
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if artifact.highlighted {
		return
	}
	artifact.highlightHTML, _ = highlightJSON(prettyJSON(artifact.schemaJSON))
	artifact.highlighted = true
}

func (c *rawArtifactCache) snapshot(artifact *rawArtifact) rawArtifact {
	if artifact == nil {
		return rawArtifact{}
	}
	c.mu.RLock()
	defer c.mu.RUnlock()
	return rawArtifact{
		rawYAML:       artifact.rawYAML,
		schemaJSON:    artifact.schemaJSON,
		highlightHTML: artifact.highlightHTML,
		highlighted:   artifact.highlighted,
	}
}

func normalizeArtifactYAML(yamlBytes []byte) string {
	return strings.TrimRight(string(yamlBytes), "\n")
}

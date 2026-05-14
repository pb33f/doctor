package v3

import (
	"strconv"
	"sync"
	"sync/atomic"
	"testing"

	"github.com/stretchr/testify/require"
	"go.yaml.in/yaml/v4"
)

type comparableHashable struct {
	hash  uint64
	calls *atomic.Int32
}

func (h *comparableHashable) Hash() uint64 {
	h.calls.Add(1)
	return h.hash
}

type nonComparableHashable struct {
	values []int
	calls  *atomic.Int32
}

func (h nonComparableHashable) Hash() uint64 {
	h.calls.Add(1)
	return 0x2a
}

type rootedNonComparableHashable struct {
	values []int
	root   *yaml.Node
	calls  *atomic.Int32
}

func (h rootedNonComparableHashable) Hash() uint64 {
	h.calls.Add(1)
	return 0x63
}

func (h rootedNonComparableHashable) GetRootNode() *yaml.Node {
	return h.root
}

func TestDrContextHashStringCachesComparableModel(t *testing.T) {
	calls := &atomic.Int32{}
	model := &comparableHashable{hash: 0x2a, calls: calls}
	ctx := &DrContext{HashCache: NewHashCache()}

	require.Equal(t, "2a", ctx.hashString(model))
	require.Equal(t, "2a", ctx.hashString(model))
	require.EqualValues(t, 1, calls.Load())
}

func TestDrContextHashStringUsesLowercaseHex(t *testing.T) {
	calls := &atomic.Int32{}
	model := &comparableHashable{hash: 0xABCDEF, calls: calls}
	ctx := &DrContext{HashCache: NewHashCache()}

	require.Equal(t, "abcdef", ctx.hashString(model))
}

func TestDrContextHashStringSkipsNonComparableModelWithoutRootNode(t *testing.T) {
	calls := &atomic.Int32{}
	model := nonComparableHashable{values: []int{1}, calls: calls}
	ctx := &DrContext{HashCache: NewHashCache()}

	require.NotPanics(t, func() {
		require.Equal(t, "2a", ctx.hashString(model))
		require.Equal(t, "2a", ctx.hashString(model))
	})
	require.EqualValues(t, 2, calls.Load())
}

func TestDrContextHashStringCachesNonComparableModelByRootNode(t *testing.T) {
	calls := &atomic.Int32{}
	root := &yaml.Node{}
	model := rootedNonComparableHashable{
		values: []int{1},
		root:   root,
		calls:  calls,
	}
	ctx := &DrContext{HashCache: NewHashCache()}

	require.Equal(t, "63", ctx.hashString(model))
	require.Equal(t, "63", ctx.hashString(model))
	require.EqualValues(t, 1, calls.Load())
}

func TestHashCacheLoadOrStoreConcurrentSingleWinner(t *testing.T) {
	cache := NewHashCache()
	key := hashCacheKey{rootNode: &yaml.Node{}}
	const goroutines = 64

	start := make(chan struct{})
	results := make(chan string, goroutines)
	var wg sync.WaitGroup
	for i := 0; i < goroutines; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			<-start
			results <- cache.loadOrStore(key, strconv.Itoa(i))
		}(i)
	}

	close(start)
	wg.Wait()
	close(results)

	var winner string
	for result := range results {
		if winner == "" {
			winner = result
		}
		require.Equal(t, winner, result)
	}
	cached, ok := cache.load(key)
	require.True(t, ok)
	require.Equal(t, winner, cached)
}

func TestDrContextCanonicalPathForHonorsDeterministicPaths(t *testing.T) {
	root := &yaml.Node{}
	cache := &sync.Map{}
	cache.Store(root, "$.components.schemas['Thing']")

	disabled := &DrContext{CanonicalPathCache: cache}
	path, ok := disabled.canonicalPathFor(root)
	require.False(t, ok)
	require.Empty(t, path)

	enabled := &DrContext{DeterministicPaths: true, CanonicalPathCache: cache}
	path, ok = enabled.canonicalPathFor(root)
	require.True(t, ok)
	require.Equal(t, "$.components.schemas['Thing']", path)
}

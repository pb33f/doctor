package v3

import (
	"strconv"
	"sync"
	"testing"
)

var jsonPathSegmentBenchmarkSink string

func BenchmarkJSONPathIndexedCold(b *testing.B) {
	for _, depth := range []int{1, 8, 16, 17, 64} {
		b.Run(strconv.Itoa(depth), func(b *testing.B) {
			var leaf *Foundation
			var parent Foundational
			maxInt := int(^uint(0) >> 1)
			indices := []int{0, 7, 99, 100, -3, maxInt, -maxInt - 1}
			for i := 0; i < depth; i++ {
				position := indices[i%len(indices)]
				leaf = &Foundation{Parent: parent, PathSegment: "allOf", Index: &position}
				parent = leaf
			}
			b.ReportAllocs()
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				leaf.JSONPathOnce = sync.Once{}
				jsonPathSegmentBenchmarkSink = leaf.GenerateJSONPath()
			}
		})
	}
}

package diffview

import (
	"strings"
	"testing"
	"unicode/utf8"

	changeModel "github.com/pb33f/libopenapi/what-changed/model"
	"github.com/pb33f/testify/assert"
)

func TestRenderChangeDetachedSourceOwnership(t *testing.T) {
	ch := &changeModel.Change{ChangeType: changeModel.PropertyAdded, Property: "description", New: "Pet details", Context: &changeModel.ChangeContext{NewLine: ptrInt(400)}}
	source := Source{Lines: []string{"Pet:", "  description: Pet details"}, Line: 2, Side: Candidate}
	got := RenderChange(ch, source, 80, Styles{})
	assert.Contains(t, got, "description: Pet details")
	assert.Contains(t, got, "> 2")
	source.Side = Original
	assert.NotContains(t, RenderChange(ch, source, 80, Styles{}), "spec context")
	source.Side = Candidate
	source.Line = 400
	assert.NotContains(t, RenderChange(ch, source, 80, Styles{}), "spec context")
	assert.Equal(t, 400, *ch.Context.NewLine)
}

func TestRenderEscapesControlBytesAndPreservesPhysicalLines(t *testing.T) {
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "description\x1b[2J", Original: "old\rtext", New: "new\x9btext"}
	summary := RenderSummary(ch, 80, Styles{})
	assert.NotContains(t, summary, "\x1b")
	assert.NotContains(t, summary, "\r")
	assert.Contains(t, summary, `\u001b[2J`)
	lines := []string{"name: 你好🙂", "  description: \x1b]52;clipboard\x07", "  type: string"}
	original := append([]string(nil), lines...)
	source := RenderSource(lines, Range{2, 2}, ch.ChangeType, 80, Styles{})
	assert.Equal(t, 2, strings.Count(source, "\n"))
	assert.NotContains(t, source, "\x1b")
	assert.NotContains(t, source, "\x07")
	assert.Contains(t, source, "你好🙂")
	assert.Equal(t, original, lines)
}

func TestLargeValuesDoNotClaimEqualFromMatchingExcerpts(t *testing.T) {
	common := strings.Repeat("key: same\n", 10000)
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "schema", OriginalEncoded: common + "old", NewEncoded: common + "new"}
	result := RenderSummary(ch, 80, Styles{})
	assert.Contains(t, result, excerptNotice)
	assert.NotContains(t, result, "values are identical")
	assert.Less(t, len(result), maxValueBytes*4)
}

func TestLargeContextIsBoundedAndUnicodeSafe(t *testing.T) {
	line := "description: " + strings.Repeat("界", 100000)
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "description", Original: "old", New: "new"}
	source := Source{Lines: []string{line}, Line: 1, Side: Candidate}
	result := RenderChange(ch, source, 80, Styles{})
	assert.Contains(t, result, excerptNotice)
	assert.True(t, utf8.ValidString(result))
	assert.Less(t, len(result), maxContextBytes+1024)
	assert.Equal(t, Range{1, 1}, RangeForChange(source.Lines, 1, ch))
}

func TestRenderSourceKeepsAllLines(t *testing.T) {
	lines := make([]string, 2000)
	for i := range lines {
		lines[i] = "type: string"
	}
	got := RenderSource(lines, Range{1000, 1000}, changeModel.Modified, 80, Styles{})
	assert.Equal(t, len(lines)-1, strings.Count(got, "\n"))
	assert.Contains(t, got, "2000")
	assert.NotContains(t, got, excerptNotice)
}

func BenchmarkRenderChangeLargeContext(b *testing.B) {
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "description", Original: "old", New: "new"}
	source := Source{Lines: []string{"description: " + strings.Repeat("x", 4<<20)}, Line: 1, Side: Candidate}
	b.ReportAllocs()
	b.ResetTimer()
	for b.Loop() {
		RenderChange(ch, source, 100, Styles{})
	}
}

func BenchmarkRenderSummaryLargeValue(b *testing.B) {
	common := strings.Repeat("key: value\n", 100000)
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "schema", OriginalEncoded: common + "old", NewEncoded: common + "new"}
	b.ReportAllocs()
	b.ResetTimer()
	for b.Loop() {
		RenderSummary(ch, 100, Styles{})
	}
}

func TestRangeLookupIsLocalForMissingKey(t *testing.T) {
	lines := make([]string, 200000)
	for i := range lines {
		lines[i] = "  unrelated: value"
	}
	lines[0] = "root:"
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "missing", Original: "before", New: "after"}
	location := 100000
	got := RangeForChange(lines, location, ch)
	assert.Equal(t, Range{location, location}, got)
	result := RenderChange(ch, Source{Lines: lines, Line: location, Side: Candidate}, 80, Styles{})
	assert.Contains(t, result, "> 100000")
	assert.Less(t, strings.Count(result, "\n"), maxContextLines+20)
}

func BenchmarkRenderChangeMissingKey(b *testing.B) {
	lines := make([]string, 200000)
	for i := range lines {
		lines[i] = "  unrelated: value"
	}
	lines[0] = "root:"
	ch := &changeModel.Change{ChangeType: changeModel.Modified, Property: "missing", Original: "before", New: "after"}
	source := Source{Lines: lines, Line: 100000, Side: Candidate}
	b.ReportAllocs()
	b.ResetTimer()
	for b.Loop() {
		RenderChange(ch, source, 100, Styles{})
	}
}

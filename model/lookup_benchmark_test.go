package model

import (
	"crypto/sha256"
	"fmt"
	"os"
	"sort"
	"strings"
	"testing"

	drV3 "github.com/pb33f/doctor/model/high/v3"
	"github.com/pb33f/go-yaml"
)

type productionLookupPair struct{ key, value *yaml.Node }
type productionLookupExpectation struct {
	count     int
	errorText string
}

// BenchmarkProductionLookups measures steady-state full query sweeps. Parsing,
// model construction, query collection, and the correctness preflight are not timed.
// One operation is one complete sweep; lookups/op gives its query count.
func BenchmarkProductionLookups(b *testing.B) {
	spec := os.Getenv("DOCTOR_BENCH_SPEC")
	if spec == "" {
		b.Fatal("DOCTOR_BENCH_SPEC must name a corpus specification")
	}
	document := loadWalkBenchmarkDocument(b, spec, os.Getenv("DOCTOR_BENCH_FILE_REFS") == "true")
	for _, mode := range []struct {
		name   string
		config *DrConfig
	}{
		{"model_cached", &DrConfig{UseSchemaCache: true}},
		{"graph_render", &DrConfig{BuildGraph: true, RenderChanges: true, UseSchemaCache: true}},
	} {
		b.Run(mode.name, func(b *testing.B) {
			walker := newDrDocumentWithWalkOptions(b, document, mode.config, walkOptions{})
			defer walker.Release()
			lines := make([]int, 0, len(walker.lineObjects))
			for line := range walker.lineObjects {
				if line > 0 {
					lines = append(lines, line)
				}
			}
			sort.Ints(lines)
			if len(lines) == 0 {
				b.Fatal("no source lines available for lookups")
			}
			pairs := make([]productionLookupPair, 0)
			seen := make(map[productionLookupPair]struct{})
			for _, line := range lines {
				for _, object := range walker.lineObjects[line] {
					foundational, ok := object.(drV3.Foundational)
					if !ok || foundational == nil {
						continue
					}
					pair := productionLookupPair{foundational.GetKeyNode(), foundational.GetValueNode()}
					// The workload represents caller requests with valid authored key/value nodes.
					if pair.key == nil || pair.value == nil || pair.key.Line <= 0 {
						continue
					}
					if _, ok := seen[pair]; ok {
						continue
					}
					seen[pair] = struct{}{}
					pairs = append(pairs, pair)
				}
			}
			// Node coordinates and contents are deterministic; pointer addresses are not.
			type orderedPair struct {
				pair productionLookupPair
				key  string
			}
			ordered := make([]orderedPair, len(pairs))
			for i, pair := range pairs {
				ordered[i] = orderedPair{pair, productionLookupPairKey(pair)}
			}
			sort.SliceStable(ordered, func(i, j int) bool { return ordered[i].key < ordered[j].key })
			for i := range ordered {
				pairs[i] = ordered[i].pair
			}
			if len(pairs) == 0 {
				b.Fatal("no authored key/value pairs available for lookups")
			}
			b.Run("by_line", func(b *testing.B) {
				runProductionLookupSweep(b, len(lines), func(i int) string { return fmt.Sprintf("line:%d", lines[i]) }, func(i int) ([]drV3.Foundational, error) { return walker.LocateModelByLine(lines[i]) }, true)
			})
			b.Run("by_key_value", func(b *testing.B) {
				runProductionLookupSweep(b, len(pairs), func(i int) string { return ordered[i].key }, func(i int) ([]drV3.Foundational, error) {
					p := pairs[i]
					return walker.LocateModelsByKeyAndValue(p.key, p.value)
				}, false)
			})
		})
	}
}

func productionLookupPairKey(p productionLookupPair) string {
	return fmt.Sprintf("%012d:%012d:%d:%s:%s/%012d:%012d:%d:%s:%s", p.key.Line, p.key.Column, p.key.Kind, p.key.Tag, p.key.Value, p.value.Line, p.value.Column, p.value.Kind, p.value.Tag, p.value.Value)
}

func runProductionLookupSweep(b *testing.B, queries int, queryIdentity func(int) string, lookup func(int) ([]drV3.Foundational, error), requireSuccess bool) {
	b.Helper()
	b.StopTimer()
	expected := make([]productionLookupExpectation, queries)
	var resultsPerSweep, errorsPerSweep int64
	// Hash complete result identities before timing. Sorting only the outer records
	// removes ties between distinct node pointers at identical authored coordinates;
	// returned model order inside each query remains part of the signature.
	records := make([]string, queries)
	for i := 0; i < queries; i++ {
		models, err := lookup(i)
		e := productionLookupExpectation{count: len(models)}
		if err != nil {
			e.errorText = err.Error()
			errorsPerSweep++
			if requireSuccess {
				b.Fatalf("indexed line query %d failed: %v", i, err)
			}
		}
		expected[i] = e
		resultsPerSweep += int64(len(models))
		var record strings.Builder
		fmt.Fprintf(&record, "query=%q error=%q count=%d", queryIdentity(i), e.errorText, len(models))
		for _, m := range models {
			if m == nil {
				record.WriteString("|<nil>")
				continue
			}
			fmt.Fprintf(&record, "|%T:%s", m, m.GenerateJSONPath())
		}
		records[i] = record.String()
	}
	sort.Strings(records)
	signature := sha256.New()
	for _, record := range records {
		fmt.Fprintf(signature, "%d:%s\n", len(record), record)
	}
	b.Logf("preflight queries=%d results=%d errors=%d result_signature=%x", queries, resultsPerSweep, errorsPerSweep, signature.Sum(nil))
	b.ReportAllocs()
	b.ResetTimer()
	b.StartTimer()
	for iteration := 0; iteration < b.N; iteration++ {
		for i := 0; i < queries; i++ {
			models, err := lookup(i)
			e := expected[i]
			if len(models) != e.count {
				b.Fatalf("query %d changed result count: got %d want %d", i, len(models), e.count)
			}
			if err != nil {
				if err.Error() != e.errorText {
					b.Fatalf("query %d changed error: got %q want %q", i, err.Error(), e.errorText)
				}
			} else if e.errorText != "" {
				b.Fatalf("query %d unexpectedly succeeded; expected %q", i, e.errorText)
			}
		}
	}
	b.StopTimer()
	b.ReportMetric(float64(queries), "lookups/op")
	b.ReportMetric(float64(resultsPerSweep), "results/op")
	b.ReportMetric(float64(errorsPerSweep), "errors/op")
}

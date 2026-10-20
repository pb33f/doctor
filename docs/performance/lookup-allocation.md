# Lookup allocation results

Doctor baseline: `4480edd`. Optimized: `3293c96`. Both use libopenapi `cbdd043c`.
These results are incremental to the JSONPath, node-line snapshot and compact
line identity changes. This optimization itself requires no dependency update.

## Change

Sort keys retain the exact previous format but use a pre-sized strings.Builder
and stack integer formatting instead of fmt.Sprintf. Sets of up to 16 retained
models use stack scratch for sort entries; larger sets allocate as before.
slices.SortFunc removes reflection-based sorting overhead. The deduplication map
and separate result slice remain. No path or lookup results are cached.

Both JSONPath calls, their order, and both node getters are preserved. Node
coordinates are read only after both getters finish. Signed zero padding, wide
integers, minimum/maximum integers, runtime type names, delimiter-containing
paths, lexical ordering and equal-key order match the old algorithm. Empty paths,
nil behavior, first-winner deduplication and input/output ownership remain intact.

## Method

Go 1.26.4, darwin/arm64, Apple M4 Max, GOMAXPROCS=16. Five paired rounds,
alternating before/after order and shuffling fixture order. Three iterations per
sample; no other task tests ran during timing. Values are medians. MB is decimal.
Local observations are not statistical guarantees.

Each operation is a complete query sweep through a reused Doctor document.
By-line queries include every indexed positive line, in sorted order. Key/value
queries use every distinct authored nonnil node-pointer pair from indexed models,
ordered by source coordinates and content. Both cached model-only and graph/render
configurations are measured. Parsing, building, query collection and correctness
preflight are excluded from timing. The existing loader skips circular-reference
checking. Timed loops include result-count and error checks; no extra path
rendering or signature generation occurs in timed code.

Each preflight hashes every query identity, exact error, and ordered result
(type and JSONPath). Only outer query-record order is normalized; inner result
order remains significant. Authored key/value pairs can include requests that
already fail to locate a model; their errors are included and compared exactly,
not dropped from the workload. Signatures and query/result/error counts must match
between versions and across rounds. B/op means allocation per sweep, not retained
heap or peak RSS. These are lookup measurements, not total application latency.

## model_cached

| Spec | Lookup | Queries | Baseline errors | Before ms | After ms | Time change | Before MB | After MB | Bytes change | Before allocs | After allocs |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| petstore.yaml | by_line | 750 | 0 | 0.418 | 0.200 | -52.1% | 0.424 | 0.342 | -19.4% | 7,103 | 2,548 |
| petstore.yaml | by_key_value | 307 | 0 | 0.907 | 0.791 | -12.8% | 0.225 | 0.200 | -11.3% | 3,948 | 2,497 |
| mistral.yaml | by_line | 8,583 | 0 | 5.342 | 2.332 | -56.4% | 4.688 | 3.207 | -31.6% | 95,376 | 29,451 |
| mistral.yaml | by_key_value | 2,609 | 20 | 16.713 | 15.954 | -4.5% | 2.028 | 1.597 | -21.3% | 42,687 | 23,586 |
| neon.yaml | by_line | 8,936 | 0 | 4.637 | 2.375 | -48.8% | 4.206 | 3.046 | -27.6% | 81,772 | 26,648 |
| neon.yaml | by_key_value | 2,487 | 0 | 15.792 | 15.181 | -3.9% | 1.698 | 1.416 | -16.6% | 33,638 | 20,052 |
| ld.yaml | by_line | 45,133 | 0 | 33.067 | 18.424 | -44.3% | 34.382 | 26.486 | -23.0% | 556,831 | 171,899 |
| ld.yaml | by_key_value | 12,888 | 0 | 118.593 | 116.690 | -1.6% | 8.766 | 7.596 | -13.3% | 157,678 | 100,548 |
| plaid.yml | by_line | 57,485 | 0 | 52.602 | 28.471 | -45.9% | 45.943 | 34.701 | -24.5% | 818,026 | 244,670 |
| plaid.yml | by_key_value | 15,669 | 0 | 179.405 | 176.184 | -1.8% | 13.817 | 11.139 | -19.4% | 271,123 | 142,191 |
| stripe.yaml | by_line | 131,395 | 0 | 165.283 | 109.127 | -34.0% | 303.040 | 283.225 | -6.5% | 1,943,578 | 613,879 |
| stripe.yaml | by_key_value | 32,611 | 0 | 557.830 | 630.052 | +12.9% | 120.964 | 109.088 | -9.8% | 764,996 | 356,967 |

## graph_render

| Spec | Lookup | Queries | Baseline errors | Before ms | After ms | Time change | Before MB | After MB | Bytes change | Before allocs | After allocs |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| petstore.yaml | by_line | 750 | 0 | 0.417 | 0.197 | -52.7% | 0.424 | 0.342 | -19.4% | 7,103 | 2,548 |
| petstore.yaml | by_key_value | 307 | 0 | 0.846 | 0.785 | -7.2% | 0.225 | 0.200 | -11.2% | 3,948 | 2,497 |
| mistral.yaml | by_line | 8,583 | 0 | 5.071 | 2.432 | -52.0% | 4.687 | 3.207 | -31.6% | 95,373 | 29,451 |
| mistral.yaml | by_key_value | 2,609 | 20 | 16.803 | 15.962 | -5.0% | 2.028 | 1.597 | -21.3% | 42,686 | 23,586 |
| neon.yaml | by_line | 8,936 | 0 | 4.521 | 2.136 | -52.8% | 4.205 | 3.046 | -27.5% | 81,769 | 26,648 |
| neon.yaml | by_key_value | 2,487 | 0 | 16.050 | 15.265 | -4.9% | 1.698 | 1.416 | -16.6% | 33,637 | 20,052 |
| ld.yaml | by_line | 45,133 | 0 | 34.389 | 17.599 | -48.8% | 34.383 | 26.486 | -23.0% | 556,831 | 171,899 |
| ld.yaml | by_key_value | 12,888 | 0 | 121.067 | 118.509 | -2.1% | 8.767 | 7.596 | -13.4% | 157,679 | 100,547 |
| plaid.yml | by_line | 57,485 | 0 | 51.908 | 28.399 | -45.3% | 45.943 | 34.701 | -24.5% | 818,027 | 244,670 |
| plaid.yml | by_key_value | 15,669 | 0 | 180.608 | 175.953 | -2.6% | 13.817 | 11.139 | -19.4% | 271,123 | 142,191 |
| stripe.yaml | by_line | 131,395 | 0 | 173.205 | 112.177 | -35.2% | 303.038 | 283.225 | -6.5% | 1,943,576 | 613,879 |
| stripe.yaml | by_key_value | 32,611 | 0 | 649.403 | 637.985 | -1.8% | 120.841 | 115.310 | -4.6% | 764,965 | 357,635 |

## Stripe key/value investigation

The main model-only sweep showed a 12.9% slower median on Stripe, despite fewer
allocations. Because its individual runs varied widely, an isolated recheck used
five alternating pairs of five-iteration samples, selecting only model_cached /
by_key_value. The first pair also collected CPU profiles. No production code or
benchmark workload changed. The original measurements above remain unchanged.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Median sweep time | 614.295 ms | 623.522 ms | +1.5% |
| Allocated bytes | 118.460 MB | 112.901 MB | -4.7% |
| Allocations | 764,724 | 357,382 | -53.3% |

Before times ranged from 588.1 to 724.5 ms; after times ranged from 558.2 to
635.1 ms. These results do not establish a Stripe key/value speed gain. Other
specs' model-only key/value medians improve by 1.6–12.8%; by-line medians improve
by 34.0–56.4% across all six specs. Do not apply those gains to total lint latency.
Raw recheck data: [lookup-stripe-recheck.csv](lookup-stripe-recheck.csv).

CPU profiles include setup and preflight, despite benchmark timer boundaries.
When restricted to lookup-sweep stacks, origin resolution accounts for roughly
78–89% of sampled CPU attributed to LocateModelsByKeyAndValue. YAML hashing and
clearing its visited-node map dominate that unchanged path. This identifies
remaining work; it does not prove the cause of the run-to-run variance. Profiles
and extracted stacks are retained in `/tmp/lookup-evidence/keyvalue-*.cpu` and
`keyvalue-*-top.txt`.

## Validation

- Full Doctor suites pass with optimized upstream and with the committed
  dependency (`GOWORK=off`). Focused lookup/source/deduplication race tests and
  full vet pass. Independent performance review found no defects.
- Frozen baseline key formatting and normalization provide differential oracles.
  Tests cover signed/extreme coordinates, node mutation by custom getters,
  changing paths, exact getter traces, nil/typed-nil models, separate result
  ownership and equal-key ordering at sort thresholds and up to 1,024 inputs.
  These contract tests pass on Go 1.26.4 and 1.27.2. The two installed sorting
  implementations were also checked for equivalent pdqsort control flow.
- Compiler escape analysis and isolated allocation counts confirm that small
  sort-entry scratch and integer buffers do not allocate on the heap.
- All six real specs retain identical Doctor path, source-line and stable graph
  signatures, with canonical paths and graph construction both on and off.
- Vacuum `92c29d0b`, Go 1.27.2: motor, functions, utils, model and rulesets suites
  and both CLI builds pass. All 39,268 complete normalized diagnostics match
  across the six specs (94 / 1,086 / 1,281 / 6,073 / 8,895 / 21,839).
  Findings and combined schema-message clauses are sorted; nothing is dropped.
  Remote lookups and update checks are disabled, with generous lookup/rule
  timeouts to prevent truncated comparisons.
- Bunkhouse `096442a4`, Go 1.27.2: full Doctor service suite and all six consumer
  snapshot comparisons pass. Checks cover all line lookups, graph properties
  and edges, lint findings and simplified reports. Unordered collections are
  sorted without removing duplicates; report timestamps, process-random node
  hashes and multi-endpoint edge UUIDs are excluded, as established by repeated
  baseline runs during the preceding work. Stripe's direct builder still rejects
  circular references on both sides; its lint path succeeds and matches.
  These are local consumer checks, not deployed UI/server/database validation.

Original checkouts were preserved. Changes are committed on
`codex/lookup-allocation`; nothing was pushed or released.

## Reproduction

Raw samples, query counts and complete-result signatures:
[lookup-benchmarks.csv](lookup-benchmarks.csv).
The six speed-test fixtures and their hashes are listed in the
[JSONPath report](jsonpath-allocation.md).

Build separate model test binaries for the stated commits, selecting the same
upstream with go.work. The baseline uses a Go overlay to add the exact new
lookup_benchmark_test.go without changing its production files. The overlay,
workspace files, harness, comparison scripts, raw logs and snapshots are in
`/tmp/lookup-evidence`.

```sh
DOCTOR_BENCH_SPEC="$HOME/pb33f/demo/speed-test/stripe.yaml" /tmp/model-VERSION.test \
  -test.run='^$' -test.bench='^BenchmarkProductionLookups$' \
  -test.benchmem -test.benchtime=3x -test.count=1
```

Repeat across all specs for five alternating rounds. The evidence directory's
run_benchmarks.py enforces exact signature parity while recording every sample.
Exploratory formatting-only and combined-scratch microbenchmarks isolate the
implementation steps; they are not substitutes for the paired real-spec results.

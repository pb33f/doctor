# Compact line identity index

Doctor baseline: `2ccaf55`. Optimized implementation: `7a10b60`.
Both sides use libopenapi `cbdd043c`, so results are incremental to the JSONPath
and node-line snapshot optimizations. This change itself requires no dependency
update and also passes with Doctor's committed dependency.

## Change and contracts

Line insertion no longer allocates a pointer map for the first object on each
line. Repeated insertion of that same pointer checks the retained object directly.
A second distinct pointer creates and seeds the map before any JSONPath getter is
called. The existing dense-line map path remains. A pointer rejected because its
JSONPath duplicates another object remains recorded, even if its path later
changes. Public APIs, result order and source identity are unchanged.

The baseline Stripe allocation profile attributes about 152 MiB of direct
allocation to addLineObject. That profiling run includes model loading and one
walk; it identifies the target, not the amount this patch can save.

## Measurements

Go 1.26.4, darwin/arm64, Apple M4 Max, GOMAXPROCS=16. Five paired rounds,
alternating before/after order and shuffling fixture order; three iterations per
sample. No other task test jobs ran during timing. Values are medians, with
MB in decimal units. These are local observations, not statistical guarantees.

BenchmarkWalkerProductionModes parses once and reuses the model. Measurements
cover warm walks, not cold parsing or total consumer latency. Both modes use
schema caching; graph mode enables RenderChanges. Circular-reference checking
is skipped by the benchmark. B/op means total allocated bytes, not retained
heap or peak RSS. No retained-heap or peak-RSS reduction is claimed here.

| Spec | Mode | Before ms | After ms | Time change | Before MB | After MB | Bytes change | Before allocs | After allocs |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| petstore.yaml | model_cached | 1.457 | 1.334 | -8.4% | 1.604 | 1.456 | -9.2% | 8,734 | 7,501 |
| petstore.yaml | graph_render | 3.762 | 3.633 | -3.4% | 2.279 | 2.131 | -6.5% | 15,759 | 14,534 |
| mistral.yaml | model_cached | 12.803 | 12.045 | -5.9% | 11.263 | 10.216 | -9.3% | 80,388 | 72,541 |
| mistral.yaml | graph_render | 39.485 | 38.720 | -1.9% | 17.928 | 16.880 | -5.8% | 141,943 | 134,088 |
| neon.yaml | model_cached | 12.257 | 11.928 | -2.7% | 10.928 | 9.418 | -13.8% | 79,112 | 67,953 |
| neon.yaml | graph_render | 37.122 | 36.342 | -2.1% | 17.550 | 15.835 | -9.8% | 134,874 | 123,705 |
| ld.yaml | model_cached | 126.601 | 123.330 | -2.6% | 73.127 | 67.588 | -7.6% | 477,725 | 432,217 |
| ld.yaml | graph_render | 307.331 | 314.541 | +2.3% | 124.351 | 118.676 | -4.6% | 815,507 | 769,965 |
| plaid.yml | model_cached | 110.628 | 102.761 | -7.1% | 73.974 | 67.640 | -8.6% | 527,966 | 478,005 |
| plaid.yml | graph_render | 300.516 | 305.934 | +1.8% | 111.669 | 105.456 | -5.6% | 835,569 | 785,592 |
| stripe.yaml | model_cached | 1200.023 | 1191.459 | -0.7% | 677.755 | 651.866 | -3.8% | 2,554,014 | 2,357,474 |
| stripe.yaml | graph_render | 2294.517 | 2191.266 | -4.5% | 1102.651 | 1076.892 | -2.3% | 4,048,582 | 3,852,061 |

Isolated insertion benchmark (three samples, 200 ms per sample):

| Objects | Repeat pointers | Before ns | After ns | Before bytes | After bytes | Before allocs | After allocs |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | false | 89.98 | 38.79 | 208 | 16 | 3 | 1 |
| 1 | true | 104.50 | 43.92 | 208 | 16 | 3 | 1 |
| 2 | false | 138.90 | 194.60 | 240 | 240 | 4 | 4 |
| 2 | true | 146.20 | 152.30 | 240 | 240 | 4 | 4 |
| 32 | false | 3720.00 | 3628.00 | 3320 | 3320 | 15 | 15 |
| 32 | true | 4099.00 | 4035.00 | 3320 | 3320 | 15 | 15 |

The initial two-object samples were noisy (the old path ranged from 129.6 to
293.9 ns). A targeted recheck with five 500 ms samples measured 125.2 → 133.5 ns
without repeats and 142.5 → 151.7 ns with repeats. This confirms a small transition
cost when the second distinct pointer requires a map; allocations remain equal.
The original measurements above are retained. Recheck samples are in
`/tmp/compact-lines-evidence/microbench-two-recheck.txt`.

The full-spec results favor allocation reduction across every mode. Timing is
mixed for graph builds: LaunchDarkly is 2.3% slower and Plaid is 1.8% slower in
these medians. Model-only medians improve by 0.7–8.4%. Do not interpret this change
as a universal speed improvement.

## Validation

- Full Doctor suite passes with optimized libopenapi and with the committed
  dependency (`GOWORK=off`). Focused race checks cover compact identities,
  node-line snapshots, processing, source identity, lookup and deduplication.
  Full Doctor vet passes. Independent performance review found no defects.
- A frozen copy of the previous insertion function serves as the differential
  oracle. Tests compare retained objects, exact getter call counts and debug
  slices over 12,800 generated insertion steps with mutable paths and value
  models. Explicit tests cover discarded-alias mutation, repeated pointers,
  nil/typed-nil behavior and baseline panic behavior.
- All six specs have matching Doctor paths, source-line associations and stable
  graph signatures with canonical paths and graph building both on and off.
- Vacuum `92c29d0b`, Go 1.27.2: motor, functions, utils, model and rulesets suites pass.
  Both CLI binaries produce matching normalized diagnostics on all six specs:
  94, 1,086, 1,281, 6,073, 8,895 and 21,839 (39,268 total). Comparison sorts
  findings and clauses in combined oas3-schema messages; no findings or clauses
  are removed. Remote lookups and update checks are disabled; generous rule and
  lookup timeouts prevent truncated comparisons.
- Bunkhouse `096442a4`, Go 1.27.2: full Doctor service tests pass. Actual
  BuildDrDocument and SharedLintingService.LintContent results match across all
  six specs: source-line lookups, stable graph content, findings and simplified
  reports. Normalization sorts unordered collections, retaining duplicates;
  excludes generation time, process-random graph hashes and random edge IDs
  for multi-endpoint edges. These variations were established by repeated
  baseline runs during the preceding snapshot optimization. All other fields
  remain compared. Stripe's direct builder rejects circular references on both
  versions; its lint path succeeds and matches. No deployed UI/server or
  external database validation is claimed.

Original consumer checkouts were preserved; checks use isolated snapshots.
The complete change is on `codex/compact-line-index`; nothing was pushed or released.

## Reproduction

Raw samples: [compact-line-benchmarks.csv](compact-line-benchmarks.csv).
Fixtures: all six files in `~/pb33f/demo/speed-test`; hashes are in the
[JSONPath report](jsonpath-allocation.md). Harnesses, workspaces, binaries,
profiles, test logs and full consumer snapshots are in
`/tmp/compact-lines-evidence`.

Build separate model test binaries from the stated Doctor commits with go.work
files selecting the same upstream `cbdd043c`. Use `go test -c ./model`, then:

```sh
DOCTOR_BENCH_SPEC="$HOME/pb33f/demo/speed-test/stripe.yaml" /tmp/model-VERSION.test \
  -test.run='^$' -test.bench='^BenchmarkWalkerProductionModes$' \
  -test.benchmem -test.benchtime=3x -test.count=1
```

Repeat across five alternating rounds and six specs. The evidence directory's
run_benchmarks.py records each sample and run order. BenchmarkLineIdentityIndex
compares the old and new insertion functions for one, two and 32 objects, with
and without repeated pointers. Both variants initialize the outer maps as a
real walk does. Its isolated timings are not full-document performance claims.

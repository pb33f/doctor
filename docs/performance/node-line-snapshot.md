# Node-line snapshot results

Doctor baseline: `e55b7b2` (includes the JSONPath optimization). Optimized: `c7e4ca3`.
libopenapi baseline: `c4c4be74` (v0.41.6). Optimized: `cbdd043c`.

Doctor asks for an owned slice of node line numbers instead of materializing a
map of nodes. The additive upstream API leaves GetNodes, HasNodes and Range
unchanged. Doctor uses it only on known concrete upstream models; custom wrappers
keep their GetNodes behavior. The existing dependency still compiles and passes
tests through the fallback. No go.mod changes or local replacements are committed.
The fast path requires linking both changes; an upstream release is still needed
before consumers can obtain it through a normal released dependency update.

## Measurements

Go 1.26.4, darwin/arm64, Apple M4 Max, GOMAXPROCS=16. Five paired rounds,
alternating binary order and shuffling fixture order, three iterations per sample.
Both sides use libopenapi v0.41.6 plus only the stated changes. No other task test
jobs ran during timing. Values are medians; MB means decimal megabytes.
These local timings are not statistical guarantees.

BenchmarkWalkerProductionModes parses once and reuses the model. This measures
warm walks, not cold parsing or total consumer latency. Both modes use schema
caching; graph mode enables RenderChanges. Circular-reference checking is skipped
by the benchmark. B/op measures total allocation, not peak RSS or retained heap.

| Spec | Mode | Before ms | After ms | Time change | Before MB | After MB | Bytes change | Before allocs | After allocs |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| petstore.yaml | model_cached | 1.564 | 1.378 | -11.9% | 1.856 | 1.602 | -13.7% | 10,395 | 8,726 |
| petstore.yaml | graph_render | 4.016 | 3.703 | -7.8% | 2.542 | 2.278 | -10.4% | 17,446 | 15,763 |
| mistral.yaml | model_cached | 14.240 | 12.951 | -9.1% | 13.711 | 11.264 | -17.8% | 94,475 | 80,400 |
| mistral.yaml | graph_render | 39.777 | 39.202 | -1.4% | 20.381 | 17.949 | -11.9% | 156,029 | 141,955 |
| neon.yaml | model_cached | 13.967 | 12.408 | -11.2% | 13.305 | 10.927 | -17.9% | 92,650 | 79,105 |
| neon.yaml | graph_render | 40.534 | 37.718 | -6.9% | 19.524 | 17.355 | -11.1% | 148,376 | 134,876 |
| ld.yaml | model_cached | 139.755 | 124.477 | -10.9% | 92.311 | 73.127 | -20.8% | 570,351 | 477,722 |
| ld.yaml | graph_render | 324.295 | 326.985 | +0.8% | 144.256 | 124.925 | -13.4% | 908,220 | 815,504 |
| plaid.yml | model_cached | 120.498 | 109.001 | -9.5% | 93.587 | 73.855 | -21.1% | 637,665 | 527,974 |
| plaid.yml | graph_render | 325.995 | 299.999 | -8.0% | 131.725 | 113.197 | -14.1% | 945,261 | 835,717 |
| stripe.yaml | model_cached | 1339.066 | 1193.307 | -10.9% | 873.571 | 677.751 | -22.4% | 3,727,674 | 2,553,994 |
| stripe.yaml | graph_render | 2397.474 | 2302.046 | -4.0% | 1298.767 | 1102.851 | -15.1% | 5,222,317 | 4,048,610 |

The upstream 1,024-line microbenchmark drops from 195,145 B and 1,048 allocations
to 8,192 B and one allocation. Median time drops from 95,440 ns to 7,073 ns
(three samples). This isolates the snapshot operation, not a full document walk.

## Contract and consumer checks

- Full libopenapi and Doctor suites pass. Doctor also passes with its committed
  dependency and GOWORK=off. Focused node snapshot and Doctor location race tests
  pass. Upstream low-model vet and full Doctor vet pass.
- Tests cover typed nils, invalid values, empty line-zero behavior, pending writes,
  later mutation, snapshot ownership, concurrent access, custom GetNodes overrides,
  reference exclusion, nil models and fallback API availability.
- Independent performance review found no actionable issues.
- All six specs have matching sorted Doctor paths, source-line associations and
  stable graph signatures, with graph and canonical-path modes both on and off.
- Vacuum origin/main `92c29d0b`: motor, functions, utils, model and rulesets suites
  pass. Both CLI versions emit matching complete normalized diagnostics on all
  six specs: 94, 1,086, 1,281, 6,073, 8,895 and 21,839 (39,268 total).
  Comparison sorts findings and clauses of combined oas3-schema messages; no
  findings or message clauses are removed. Remote lookups and update checks are
  disabled; generous rule and lookup timeouts prevent truncated comparisons.
- Bunkhouse origin/main `096442a4`, Go 1.27.2: Doctor service suite passes.
  Actual BuildDrDocument and SharedLintingService.LintContent were exercised on
  all six specs. Every source-line lookup (types, JSONPaths, errors), graph,
  serialized finding and simplified report matches after normalization.
  Normalization sorts unordered collections and excludes report generation time,
  process-random graph hashes and random multi-endpoint edge IDs. A second full
  baseline run confirms equivalent stable content; process-random hash is the
  only differing graph node field across all 11 successful graph builds.
  Stripe's direct builder rejects circular references identically on both sides;
  its lint path succeeds and matches. This is local service compatibility, not
  a deployed UI, database or server test.

Consumer repositories were tested from isolated snapshots; original checkouts
were preserved. Bunkhouse's ignored embedded content directory was copied from
the local checkout so its service package could compile.

## Reproduction and evidence

Raw benchmark samples: [node-line-benchmarks.csv](node-line-benchmarks.csv).
Harnesses, workspace files, binaries, logs, full consumer snapshots and comparison
results are in `/tmp/node-lines-evidence`. The six fixtures are from
`~/pb33f/demo/speed-test`; their SHA-256 values are recorded in the preceding
[JSONPath report](jsonpath-allocation.md).

Build before/after model test binaries with go.work files selecting the stated
Doctor and libopenapi commits, using `go test -c ./model`. Run each binary with:

```sh
DOCTOR_BENCH_SPEC="$HOME/pb33f/demo/speed-test/stripe.yaml" /tmp/model-VERSION.test \
  -test.run='^$' -test.bench='^BenchmarkWalkerProductionModes$' \
  -test.benchmem -test.benchtime=3x -test.count=1
```

Repeat for each fixture across five alternating rounds. The run_benchmarks.py
script in the evidence directory records every sample and the fixture order.

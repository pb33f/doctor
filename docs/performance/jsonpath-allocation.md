# JSONPath allocation results

Baseline: `9e2c4825a43fa98481cecab48aea1dab1d381d20`. Optimized implementation: `931fd78d28cd5e91474b17b610b0435aaf371c97`.

Go 1.26.4, darwin/arm64, Apple M4 Max, GOMAXPROCS=16. Doctor uses its committed go.mod dependencies with GOWORK=off (libopenapi v0.41.2). No dependency changes.

Five paired rounds per spec, alternating before/after order and shuffling fixture order. Each sample runs three iterations of BenchmarkWalkerProductionModes. The table reports medians, decimal MB, and percentage changes. No other tests from this task ran during timing. These are local measurements, not statistical guarantees.

The benchmark parses once and reuses the model. It measures warm walks, not cold parsing or total application latency. Circular-reference checking is skipped by the existing benchmark. B/op is total allocation, not peak RSS or retained heap. Both modes use schema caching; graph mode also enables RenderChanges.

| Spec | Mode | Before ms | After ms | Time change | Before MB | After MB | Bytes change | Before allocs | After allocs |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| petstore.yaml | model_cached | 1.526 | 1.545 | +1.2% | 1.900 | 1.857 | -2.3% | 11,647 | 10,399 |
| petstore.yaml | graph_render | 4.124 | 3.854 | -6.6% | 2.620 | 2.542 | -3.0% | 19,118 | 17,445 |
| mistral.yaml | model_cached | 14.644 | 14.242 | -2.7% | 14.475 | 13.711 | -5.3% | 110,221 | 94,475 |
| mistral.yaml | graph_render | 41.609 | 38.783 | -6.8% | 21.227 | 20.386 | -4.0% | 177,973 | 156,038 |
| neon.yaml | model_cached | 14.038 | 13.919 | -0.8% | 14.003 | 13.305 | -5.0% | 105,033 | 92,646 |
| neon.yaml | graph_render | 38.770 | 39.750 | +2.5% | 20.608 | 19.526 | -5.3% | 164,077 | 148,368 |
| ld.yaml | model_cached | 152.458 | 137.556 | -9.8% | 139.571 | 92.314 | -33.9% | 1,138,764 | 570,371 |
| ld.yaml | graph_render | 330.733 | 326.887 | -1.2% | 192.934 | 144.190 | -25.3% | 1,496,426 | 908,206 |
| plaid.yml | model_cached | 121.866 | 120.431 | -1.2% | 99.146 | 93.611 | -5.6% | 737,500 | 637,639 |
| plaid.yml | graph_render | 324.068 | 322.777 | -0.4% | 137.374 | 130.939 | -4.7% | 1,053,284 | 945,174 |
| stripe.yaml | model_cached | 1652.092 | 1321.020 | -20.0% | 2029.429 | 873.572 | -57.0% | 16,433,188 | 3,727,686 |
| stripe.yaml | graph_render | 2606.531 | 2330.495 | -10.6% | 2462.955 | 1298.478 | -47.3% | 18,032,712 | 5,222,276 |

## Contract validation

- Full Doctor suite and go vet passed. Full model/high-v3 race suites passed for the initial encoder; targeted JSONPath, canonical-path, cache, parity, source, and deadlock race tests passed after the short-buffer refinement.
- Differential fuzzing against the frozen original algorithm passed. Explicit tests cover raw keys, roots, negative/extreme indexes, CacheSplit, custom getters, cached/canonical paths, cycles, and sparse depth boundaries.
- All six real specs have identical sorted signatures for model paths and source-line associations, plus graph IDs, parent IDs, types, labels, dimensions, key/value lines, and edge endpoints/references. Both canonical-path settings and both graph settings were checked.
- Compiler escape analysis confirms the short and long scratch arrays stay on the stack and the long helper is not inlined into the short path.

## Vacuum integration

Tested a temporary copy of Vacuum origin/main snapshot `92c29d0b`, using identical module graphs for both binaries (libopenapi v0.41.6). Only the local Doctor replacement differs. Existing Vacuum checkouts were not changed.

`go test ./motor ./functions/... ./utils ./model ./rulesets` passed with the optimized Doctor. Both CLI binaries ran spectral-report on every spec with remote lookups and update checks disabled, and generous lookup/rule timeouts to avoid timing-related truncation.

Diagnostic comparison sorts report entries and sorts clauses inside combined `oas3-schema` messages. The unchanged binary reproduced that clause-order variation on Neon. Codes, paths, locations, severity, source, and every message clause remain equal. No diagnostics are dropped.

| Spec | Matching diagnostics |
|---|---:|
| petstore.yaml | 94 |
| mistral.yaml | 1,086 |
| neon.yaml | 1,281 |
| ld.yaml | 6,073 |
| plaid.yml | 8,895 |
| stripe.yaml | 21,839 |

## Reproduction

Compile separate before/after model test binaries from the two commits with `GOWORK=off go test -c -o /tmp/model-VERSION.test ./model`. Run each from a Doctor checkout:

```sh
DOCTOR_BENCH_SPEC="$HOME/pb33f/demo/speed-test/stripe.yaml" /tmp/model-VERSION.test \
  -test.run='^$' -test.bench='^BenchmarkWalkerProductionModes$' \
  -test.benchmem -test.benchtime=3x -test.count=1
```

Repeat for each fixture over five rounds, alternating binary order. Raw samples are in [jsonpath-benchmarks.csv](jsonpath-benchmarks.csv). Temporary binaries, comparison scripts, raw logs and profiles for this run are under `/tmp/doctor-jsonpath-evidence`.

Fixture SHA-256:

```text
6e282f8852fe1d38527dfb7b6e90c27fe9505d66ed90f87c5b6a30fd8594e86c  /Users/daveshanley/pb33f/demo/speed-test/ld.yaml
37659aafcad6a8219609636db74a7481b24b6cbb0a54f6d184278b584f5269df  /Users/daveshanley/pb33f/demo/speed-test/mistral.yaml
958d5c6f86970418ad104dd87e7efb2185ef0ef16bd25c2502c382f82cd64a1b  /Users/daveshanley/pb33f/demo/speed-test/neon.yaml
ef2b2dea0ef6a09ba6247017ffd5a6405c689ec9b11e73d1b61b6e2047ce35e8  /Users/daveshanley/pb33f/demo/speed-test/petstore.yaml
8addecd0b74aeb23ae844b349d8a4a2e1cbbb7ed2210f57d31cf644c37af7fa3  /Users/daveshanley/pb33f/demo/speed-test/plaid.yml
ae4d4352c52ef5246904e15bacc639fd381494022f19eab6f74b36f47c85a1b4  /Users/daveshanley/pb33f/demo/speed-test/stripe.yaml
```

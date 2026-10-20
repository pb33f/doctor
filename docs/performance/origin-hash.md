# Origin lookup and leaf hashing

Doctor baseline: `d8a53f0`. libopenapi baseline: `cbdd043c`.
Candidate upstream: `39f7691a`, stacked on the node-line snapshot change.
Doctor production code is unchanged in this step. All earlier Doctor changes
remain on `codex/origin-hash` for one final Doctor PR. libopenapi requires its own
PR and release; the local workspaces select it without changing dependency files.

## Change and contracts

Origin lookup preserves its first hash call, including cache priming. It skips
only the second hash when both nodes are the same pointer. External-origin source
and value metadata still use the existing assignment path. `checkOrigin` is unchanged.

Leaf hashing bypasses traversal scratch storage after checking the cache. The
hash byte stream, Content-only preorder traversal, cycle/shared-node handling,
cache threshold and explicit invalidation remain unchanged. Previously cached
nodes changed into leaves still return their cached hash until invalidation.
The visited map is cleared before returning it to its private pool; its redundant
entry clear is removed. Large map retention policy is unchanged.

Tests compare against frozen origin and hash implementations, including 400
seeded cyclic/shared graphs, nils, references, source metadata, cache threshold,
mutation and concurrent calls. The pool check is a smoke test; a sync.Pool.Get
cannot prove that every retained item is empty. Production cleanup still clears
all returned maps and used stack slots.

## Measurement

Six files from `~/pb33f/demo/speed-test`: petstore, mistral, neon, ld, plaid and stripe.
Go 1.26.4 on darwin/arm64, M4 Max, GOMAXPROCS 16 for real workloads.
Five alternating before/after pairs per spec, three iterations per sample.
The tables report medians. Lookup measurements cover complete source-line or
key/value sweeps; parsing, document construction and result preflight are outside
the timer. Every sample verifies identical result signatures, counts and errors.
Walk measurements reuse parsed models and enable schema caching; graph mode also
enables RenderChanges. These are warm library workloads, not end-to-end lint latency.
Allocation bytes are total allocated bytes per operation, not peak or retained memory.

Focused hash measurements use three alternating pairs, 200 ms per case,
GOMAXPROCS 1. Leaf hashing fell from 111.9 to 51.1 ns (54.3%); allocation remains
16 bytes and one allocation for the returned hash string. Repeated large narrow
uncached hashes measured 411.3 to 418.7 microseconds (+1.8%); this small sample does
not establish a speed improvement there. No map retention cap was introduced.

## Validation

- Full libopenapi and Doctor test suites pass with the candidate workspace.
- Focused origin/hash and Doctor lookup race tests pass; upstream index and Doctor model vet pass.
- All six specs have identical path/graph hashes in graph/model and deterministic/default path modes.
- Independent performance review found no blockers.

Full local evidence: `/tmp/origin-hash-evidence`.

Vacuum tests cover `motor`, all `functions` packages, `utils`, `model` and
`rulesets`. Both CLIs build. Full normalized report payloads match for all six
specs: 94, 1,086, 1,281, 6,073, 8,895 and 21,839 diagnostics (39,268 total).
Comparison normalizes finding order and the order of combined schema-error
clauses; no finding fields are omitted.

Bunkhouse's full `services/doctor` suite passes. Complete canonical snapshots
match for all six specs, including line lookup types/paths/errors, serialized
graphs and lint reports. The existing comparator normalizes unordered collection
order, generated timestamps, process-random graph hashes and multi-endpoint edge
UUIDs. Other fields and duplicate counts remain exact. Stripe's direct document
build rejects circular references on both versions; its lint call succeeds.
These are isolated local consumer checks, not deployed production verification.

## Key/value lookup results

Median milliseconds per complete sweep; model mode enables schema caching.

| Spec | Before | After | Time reduction | Allocation count reduction |
|---|---:|---:|---:|---:|
| petstore.yaml | 0.866 | 0.617 | 28.8% | 12.3% |
| mistral.yaml | 16.308 | 10.533 | 35.4% | 11.0% |
| neon.yaml | 15.634 | 9.670 | 38.1% | 12.4% |
| ld.yaml | 130.359 | 75.030 | 42.4% | 12.8% |
| plaid.yml | 178.638 | 107.151 | 40.0% | 11.0% |
| stripe.yaml | 531.120 | 415.380 | 21.8% | 9.5% |

Graph-render key/value sweeps improve by 30.4–44.3%. All 240 lookup samples
retain identical result signatures, query/result counts and error counts.
Mistral preserves its 20 baseline key/value lookup errors.
Raw samples: [lookup benchmarks](origin-hash-lookup-benchmarks.csv).

The line-only lookup implementation does not change in this step. Its measured
time differences range from -30.5% to +7.3% across modes/specs; no direct line-only
speedup is attributed to this change. Setup, pool state and ordinary timing
variation can affect these measurements. The key/value path is the intended target.

## Reproduction

Create two Go workspaces selecting the baseline and candidate Doctor/libopenapi
worktrees. Build `go test -c ./model` in each matching Doctor directory. Run the
binaries with `GOMAXPROCS=16`, `DOCTOR_BENCH_SPEC` pointing to each fixture, and:

```text
-test.run=^$ -test.bench=^BenchmarkProductionLookups$ -test.benchmem -test.benchtime=3x -test.count=1
-test.run=^$ -test.bench=^BenchmarkWalkerProductionModes$ -test.benchmem -test.benchtime=3x -test.count=1
```

Alternate version order for five pairs and shuffle spec order between rounds.
Do not run other tests or benchmark jobs at the same time. Hash microbenchmarks
are in libopenapi's `BenchmarkHashNodeTraversalWorkloads`; compare the same harness
against baseline `index/utility_methods.go`, with GOMAXPROCS 1 and 200 ms samples.

## Warm walk results

Median milliseconds per graph-render walk:

| Spec | Before | After | Time reduction |
|---|---:|---:|---:|
| petstore.yaml | 3.724 | 3.234 | 13.2% |
| mistral.yaml | 38.223 | 34.364 | 10.1% |
| neon.yaml | 35.005 | 31.363 | 10.4% |
| ld.yaml | 308.722 | 271.718 | 12.0% |
| plaid.yml | 297.213 | 262.519 | 11.7% |
| stripe.yaml | 2577.105 | 2098.636 | 18.6% |

Graph-render walks improve by 10.1–18.6%, with 1.9–2.5% fewer allocations.
Model-only walks show mixed median changes, from 5.4% faster to 5.9% slower;
no general model-only improvement is claimed. Plaid model-only walks measure
106.883 to 113.138 ms (+5.9%), with overlapping ranges of 102.665–128.025 ms
before and 100.896–118.041 ms after. Petstore measures +1.4%, also with overlapping
ranges. These samples do not establish a consistent model-only regression, but
the slower medians are retained in the evidence.

All 120 walk samples are in [walk benchmarks](origin-hash-walk-benchmarks.csv).

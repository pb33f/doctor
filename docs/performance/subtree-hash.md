# Small-subtree hashing

Baseline: Doctor `fb12d9f`, libopenapi `39f7691a`. Candidate upstream: `b02d232c`.
Work continues on the existing
`codex/origin-hash` branches. Doctor production code is unchanged in this step;
workspaces select the upstream candidate without dependency-file edits.

## Implementation and contracts

HashNode uses local 16-pointer buffers for pending and visited nodes. Each buffer
promotes independently to the existing pooled structure on overflow. Promotion
preserves already pending siblings and already visited identities. No hash work
is restarted. Local storage remains separate from storage returned to the pools.

The existing cache lookup precedes traversal. Hash bytes, Content-only preorder,
visited-once cycle/shared-node handling, cache admission by immediate child count,
and explicit invalidation remain unchanged. Popped slots and returned maps are
cleared. No retained-map size limit or new caching policy is introduced.

Transition tests cover 8, 15, 16, 17, 18, 31, 32 and 33 nodes/children, independent
and combined promotions, pending siblings, cycles and duplicate children. The
frozen hash oracle and previous mutation/cache/origin contract tests remain in
use. Compiler escape analysis confirms both local arrays remain on the stack.

## Focused measurements

Three alternating before/after pairs, 200 ms per case, GOMAXPROCS 1, Go 1.26.4,
darwin/arm64 on Apple M4 Max. Bytes and allocations per operation are unchanged:
the returned hash string still accounts for one allocation in ordinary hashes.

| Workload | Before ns | After ns | Time change |
|---|---:|---:|---:|
| Small composite | 153.80 | 67.66 | -56.0% |
| Small composite after large-map warmup | 534.20 | 67.23 | -87.4% |
| 8-node chain | 296.10 | 146.20 | -50.6% |
| 16-node chain | 471.80 | 290.90 | -38.3% |
| 17-node chain | 490.40 | 522.00 | +6.4% |
| 32-node chain | 795.70 | 855.60 | +7.5% |
| Repeated 16,384-node uncached chain | 415825 | 407950 | -1.9% |
| Cold wide 16,384-child root, including cache clear | 411712 | 430536 | +4.6% |
| Large chain followed by 128 small composites | 487940 | 419141 | -14.1% |

The transition has a measurable cost: the first 16 identities must be copied
into the map, and large traversals contain extra branches. This is not a claim
that every possible hash workload improves. Small-subtree gains must be weighed
against the slower boundary and cold-wide cases above.

## Corpus methodology

Six files from `~/pb33f/demo/speed-test`: petstore.yaml, mistral.yaml, neon.yaml,
ld.yaml, plaid.yml and stripe.yaml. Five alternating before/after pairs, three
iterations per sample, GOMAXPROCS 16, Go 1.26.4, with no concurrent validation jobs.
Tables report medians. Lookup setup/preflight and document construction are
outside the timed sweep; each sample checks complete result signatures, counts
and errors. Walks reuse parsed models and enable schema caching; graph mode also
enables RenderChanges. These are warm library operations, not total lint latency.
Allocated bytes are not peak or retained memory. The map retention policy is unchanged.

Local raw logs, binaries, workspaces and consumer comparison scripts are in
`/tmp/subtree-hash-evidence`. Baseline upstream source is archived there to keep
both active branches intact.

## Validation

- Full libopenapi and Doctor suites pass against the candidate workspace.
- Focused hash and Doctor lookup race checks pass; index/model vet pass.
- Frozen hash/origin contracts, cache mutation tests and transition tests pass.
- All six specs have identical path/graph hashes in graph/model and deterministic/default modes.
- Independent performance review found no blockers.

## Reproduction

Build `go test -c ./model` once per matching baseline/candidate workspace. Set
`GOMAXPROCS=16` and `DOCTOR_BENCH_SPEC` to each input fixture, then run:

```text
-test.run=^$ -test.bench=^BenchmarkProductionLookups$ -test.benchmem -test.benchtime=3x -test.count=1
-test.run=^$ -test.bench=^BenchmarkWalkerProductionModes$ -test.benchmem -test.benchtime=3x -test.count=1
```

Alternate version order over five pairs; shuffle spec order per pair. Do not
run CPU-heavy work concurrently. Focused benchmarks are in libopenapi:
`BenchmarkHashNodeTraversalWorkloads` and `BenchmarkHashNodeSmallTraversalBoundaries`.
Use the same harness on both source versions, GOMAXPROCS 1 and 200 ms samples.

Vacuum's motor/functions/utils/model/rulesets tests and both CLI builds pass.
Complete normalized reports match for all six specs: 94, 1,086, 1,281, 6,073,
8,895 and 21,839 findings (39,268 total). Comparison retains all finding fields,
normalizing finding order and compound schema-error clause order.

Bunkhouse's complete Doctor service suite passes. Complete canonical snapshots
match for all six specs, covering line lookups, graphs and lint reports. Existing
normalization covers unordered collections, generated timestamps, process-random
graph hashes and multi-endpoint edge UUIDs. Stripe's existing circular-reference
direct-build error remains unchanged; linting succeeds.

Neon's first Bunkhouse comparison exposed reversed ordering of the same two
regex-error clauses in eight `oas3-schema` findings and five top-error messages.
Three extra baseline and candidate runs independently reproduced both orders.
All other fields matched. The comparison now also sorts only the clauses in
these compound schema messages and corresponding top-error messages. Every
clause, finding, path, coordinate, severity and count remains present. All six
repeat Neon snapshots match with that normalization. The comparator now fails
on any remaining difference or missing snapshot; the original mismatch is retained.
These are local consumer checks, not deployed-production verification.

The first round's Plaid, Neon and Stripe lookup pairs overlapped final consumer
snapshot comparison. Those six process logs were moved to
`excluded-overlap-samples` and are excluded from the reported samples. They are
rerun without competing work; retained raw logs explain the exclusion.

## Lookup results

Median milliseconds per complete key/value sweep:

| Spec | Model before | Model after | Reduction | Graph before | Graph after | Reduction |
|---|---:|---:|---:|---:|---:|---:|
| petstore.yaml | 0.547 | 0.495 | 9.4% | 0.513 | 0.468 | 8.8% |
| mistral.yaml | 9.950 | 7.752 | 22.1% | 9.962 | 7.687 | 22.8% |
| neon.yaml | 9.989 | 8.054 | 19.4% | 10.203 | 8.025 | 21.3% |
| ld.yaml | 71.388 | 58.078 | 18.6% | 72.785 | 57.915 | 20.4% |
| plaid.yml | 105.563 | 91.340 | 13.5% | 108.297 | 92.043 | 15.0% |
| stripe.yaml | 314.767 | 284.251 | 9.7% | 402.012 | 351.066 | 12.7% |

All 240 retained lookup samples match query counts, result counts, error counts
and result signatures. Mistral retains its 20 baseline key/value errors.
Lookup allocation counts are effectively unchanged. Stripe's lower allocation
bytes vary with pooled scratch state; no general memory reduction is claimed.
Line-only lookup code is unchanged; measured differences of -8.0% to +5.0% are
not attributed to this hash optimization.

Raw samples: [lookup benchmarks](subtree-hash-lookup-benchmarks.csv).

## Walk results

The initial 120 walk samples show mixed results. Graph-render median changes
range from 13.3% faster (Stripe) to 0.3% slower (Petstore). Model-only changes
range from 4.4% faster (Plaid) to 42.6% slower (Neon). Neon has large overlapping
sample ranges: 11.781–31.435 ms before and 12.106–32.606 ms after. Petstore's
model-only median is 8.5% slower. Those two model-only workloads receive a longer
30-iteration, five-pair recheck; the original samples remain in the report.

Raw samples: [walk benchmarks](subtree-hash-walk-benchmarks.csv).

### Longer model-only recheck and call-path investigation

Five alternating pairs with 30 walks per sample measured Neon at 13.242 to
12.866 ms (-2.8%) and Petstore at 1.437 to 1.623 ms (+12.9%). Petstore samples
also vary substantially: baseline 1.172–5.011 ms and candidate 1.277–4.557 ms.
These slower medians are retained in [recheck samples](subtree-hash-walk-recheck.csv).

A temporary atomic-counter overlay establishes that Petstore parsing/building
and five model-only walks each make zero HashNode calls. Five graph walks make
3,045 calls. The changed hash path therefore cannot directly account for the
model-only timing difference. Setup-excluded 3,000-walk CPU profiles contain no
HashNode path and show scheduling/synchronization/GC work; timings reverse to
1.839 ms before and 1.208 ms after. This diagnostic run does not establish a
speedup. Model-only walk timing remains inconclusive; no improvement or causal
regression is claimed. No production change was made in response to this noise.

The overlay harnesses, counter output and profiles are retained in the local
evidence directory. No instrumentation is included in either production branch.

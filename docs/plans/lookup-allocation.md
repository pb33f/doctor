# Lookup allocation plan

Baseline Doctor 4480edd; use libopenapi cbdd043c on both sides. Profile repeated
real lookups independently of document builds. Benchmark complete sorted source
line sweeps and real key/value node pairs from walked models, with setup excluded.

First replace fmt sort-key formatting with byte-identical construction. Keep both
JSONPath calls, obtain both node pointers before reading coordinates, preserve
signed zero padding and unbounded integer width, and use runtime type names.
Do not replace serialized lexical order with tuple/numeric comparisons.

Then evaluate stack scratch for small sort-entry sets and slices.SortFunc. Review
verified that installed Go 1.26.4 uses equivalent pdqsort algorithms for Slice and
SortFunc; differential tests must preserve equal-key ordering at pivot thresholds
and on large inputs. Retain the original deduplication map and result allocation
unless measurement justifies further change. Do not mutate caller input, cache
mutable getters, change nil or empty-path behavior, or add a stable tie-breaker.

Validate frozen old normalization and sort keys, changing custom getters, shared
node mutation, signed/extreme coordinates, delimiters, empty paths, nil models,
input ownership and ties. Run full suites with optimized and released dependencies,
focused races and vet, then independent performance review. Compare all six specs'
paths/graphs, full Vacuum diagnostics and Bunkhouse consumer snapshots. Benchmark
five paired rounds after validation jobs finish. Report sweep metrics separately
from walk latency, total consumer latency and peak/retained memory.

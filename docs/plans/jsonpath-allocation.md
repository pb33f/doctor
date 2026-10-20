# JSONPath allocation reduction

Scope: optimize Foundation.buildJSONPathIterative without changing exported APIs or path output.

## Contract

Preserve getter order, key-before-index selection, the concrete *Foundation CacheSplit check,
root conversion, separator rules, empty-path fallback, the 150-ancestor limit, custom
Foundational parents, sync.Once caching, and canonical-path overrides. Do not reuse cached
parent paths, change key escaping, share occurrence objects, or change collector scheduling.

## Implementation

1. Capture the unchanged model benchmark binary and add regression tests against the current algorithm.
2. Snapshot at most 150 segment descriptors on the stack. Calculate the encoded byte length.
3. Write the descriptors in reverse into one exactly sized strings.Builder. Share key delimiters
   with AppendKeySegment. Format integer indexes with a stack buffer.
4. Run the performance-code-reviewer agent and resolve verified findings before committing.

## Validation

- Explicit grammar, empty segment, root, unusual key, negative/min/max index, CacheSplit,
  custom parent, canonical cache, cycle and depth-boundary tests.
- Differential fuzzing against a frozen pre-change algorithm, plus concurrent cached access.
- Doctor test suite, targeted race tests, and vet.
- Paired before/after model-only and graph-render benchmarks on all six specs in
  /Users/daveshanley/pb33f/demo/speed-test. Alternate run order; record time, bytes,
  allocation counts and output counts. Run timing measurements without concurrent test loads.
- Vacuum tests and normalized diagnostic comparison using identical Vacuum/dependency snapshots
  with only Doctor replaced. Preserve existing Vacuum checkouts.

## Risks and decisions

A bounded descriptor array increases stack use; verify escape behavior and benchmark small specs.
Do not pool output buffers: cached JSONPath strings must remain immutable. Do not replace the
150-level behavior with cycle detection. Exact output is more important than correcting existing
grammar quirks. Report allocation totals separately from retained or peak memory.

# Small-subtree hashing

Continue existing `codex/origin-hash` branches. Baselines: Doctor `fb12d9f`,
libopenapi `39f7691a`. Baseline source is archived outside the active worktrees;
no branch changes or dependency-file edits are required.

Use fixed local buffers for small pending-node stacks and visited-node sets.
Promote each independently to the existing pooled data structure on overflow.
Do not restart hashing or lose previously visited nodes during promotion.
Preserve the byte stream, Content-only preorder, nil/cycle/shared-node handling,
cache lookup before traversal, cache threshold and explicit invalidation. Clear
pooled pointer slots and map entries on every exit. Do not cap retained maps.

Review before implementation. Test transition boundaries, wide/deep graphs,
duplicate children, cycles and shared subtrees against the frozen hash oracle.
Check local buffers do not escape, then run full upstream/Doctor suites, focused
race checks, vet and independent performance review. Validate complete Vacuum
reports and Bunkhouse snapshots for all six speed-test specs.

Measure small hashes, large uncached chains and mixed large/small traffic before
claiming a gain. Run five alternating pairs of real lookup and walk benchmarks
without concurrent CPU jobs. Preserve results/counts/errors and report slower
workloads as well as gains. Keep all Doctor work in its existing branch; upstream
changes remain in the separate libopenapi branch for its own PR and release.

# Origin resolution and node hashing

Baseline Doctor d8a53f0 and libopenapi cbdd043c. All Doctor changes stay stacked
for one final Doctor PR; upstream changes stay stacked on the snapshot API.

Origin lookup must preserve the first HashNode(value) call, including cache
population before reference early returns. When the located node is the identical
pointer, omit only the redundant second hash. External-origin metadata still
updates normally. Leave checkOrigin and its supplied-hash contract unchanged.

HashNode must preserve its exact existing byte stream and preorder traversal,
visited-once handling for cycles/shared nodes, Content-only traversal (not Alias),
cache threshold and explicit cache invalidation, including cached nodes later
mutated to leaves. First evaluate a leaf fast path after cache lookup and remove
the redundant entry clear of the private visited map, preserving exit cleanup.
Map retention bounds require separate measurements: repeatedly hashing a large
uncached narrow tree must not silently regress to fresh map growth every call.

Use frozen differential oracles, origin source/ref/nil/mutation cases, graph/cycle
fixtures, pool-retention checks, races, full upstream and Doctor suites, and an
independent performance review. Run full Vacuum and Bunkhouse parity on six specs.
Benchmark real complete lookup sweeps with identical result signatures, plus
walk modes and focused hash workloads. Keep timing jobs separate from validation.
Report allocation separately from peak/retained memory and total consumer latency.

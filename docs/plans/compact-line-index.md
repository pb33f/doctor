# Compact line identity index

Baseline Doctor 2ccaf55, with libopenapi cbdd043c on both benchmark sides.
Keep the public API and lineObjects representation unchanged. Avoid allocating
an identity map for the first object on a line. For a later pointer, scan retained
object identities if there is no map. Return on exact identity before calling
JSONPath getters. Allocate the map only when a distinct pointer appears, seed it
from retained objects, and preserve the existing path comparison and alias
identity recording. Dense lines retain their map fast path.

Plan review: zero identity is not a pointer match. Aliases discarded because of
path equality must remain remembered even if their path later changes. Preserve
first-object insertion and the existing debug ln slice behavior. Do not cache
mutable paths, remove alias identities, or change map lifetime in this change.

Validate against the frozen old insertion function, including path mutation,
custom getter calls, value models, nil first insertion, repeated pointers and
aliases. Run full Doctor tests with new and released dependencies, targeted races,
vet, and independent performance review. Compare six real-spec paths and graphs,
Vacuum diagnostics, and Bunkhouse line lookups, graphs, findings and reports.
Measure five alternating paired benchmark rounds after all validation jobs finish.
Report allocation separately from peak or retained heap; do not infer application
latency from warm-walk benchmarks. Preserve original consumer checkouts.

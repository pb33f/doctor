# AsyncAPI engine

`CompareAsyncAPI` accepts complete libasyncapi documents and per-comparison rules.
It returns the native change model plus doctor's shared changerator/node graph.
Call `AsyncAPIResult.Release` after all report and UI consumers finish. Parsed
input documents remain caller-owned. A nil result means no changes.

The source adapter uses the authored YAML tree and index-recognized references.
It does not reparse, expand every shared schema at each use, or interpret foreign
schema data as JSON Schema. Each node uses the existing synthetic-node and
Foundation contracts. Source origins include the owning index; scalar source
identity also covers delegated schema changes such as enum additions/removals.
Aliases retain their named object identity through change scopes. Removed
subtrees are attached once. Explorer properties are projected only when serialized.
These source previews preserve YAML aliases as `{"$yamlAlias":"anchorName"}`
instead of expanding their targets. Merge keys remain authored keys; resolved
relationships belong to the graph. This bounds output by authored content even
when aliases form a dense graph. The original source text is unchanged.

`Changerator.ChangeReport` and `renderer.RenderInput.ChangeReport` are additive
neutral report inputs. The concrete OpenAPI `DocumentChanges` field remains
unchanged. Both engines use the same summary, per-change formatting, deduplication
and HTML renderer. AsyncAPI reports traverse the native change hierarchy and use
the existing report sections, object headings and separators. Channel, operation,
message and component names remain literal code spans; JSONPaths remain machine
identities, not report headings. Shared referenced changes appear once under
their owning object. Channel statistics use the existing hash icon.

The graph uses the existing parent-child edges and stable edge IDs. Authored
references label both the containment edge into a reference site and its target
edge. Removed branches keep their edges; retargeted sites discard old targets.
Node timelines collapse repeated comparisons of the same shared definition but
retain distinct edits such as an enum addition and removal. Native machine
reports retain the raw change list.

Both formats size change-view cards from their visible header, child and extension
rows. Change annotations sit outside the card and do not reserve an empty row or
widen child labels. Native action badges are included in operation label widths.

Run `go test ./changerator/... ./model/...` and the source/alias/removal tests
before changing this adapter. Source correctness includes both old and new
locations, even when their line/column values collide with unrelated objects.

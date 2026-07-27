# Protocol-Neutral Schema Rendering

## Goal

Make schema rendering a first-class, protocol-neutral Printing Press capability.

OpenAPI and AsyncAPI must produce the same schema experience whenever they describe the same JSON Schema structure:

- property rendering
- required/type/format/constraint metadata
- examples and generated mocks
- raw and highlighted schema views
- component links and ref popovers
- cross references
- dependency explorer data
- Mermaid class diagrams
- source links and diagnostics

AsyncAPI transport protocols such as Kafka, MQTT, AMQP, NATS, Pulsar, SNS, SQS, Google Pub/Sub, Redis, WebSocket, and HTTP must not create separate schema implementations. Transport protocol is operation/channel metadata; it does not change the schema renderer.

This plan supports OpenAPI and AsyncAPI 3.x. AsyncAPI 2.x remains unsupported.

## Implementation Status (2026-07-11)

The AsyncAPI-first delivery through Phase 4's payload work is implemented and verified. The later OpenAPI migration remains intentionally gated; the legacy OpenAPI schema and non-schema Mermaid paths have not been changed.

Delivered:

- `diagramatron.MermaidifySchema` now walks `highbase.SchemaProxy` directly with canonical resolved-low-schema identity, active/completed cycle guards, deterministic collision-resistant class IDs, escaped display labels, and explicit schema/depth/property/relationship budgets.
- The neutral walk supports direct and external refs, aliases, arrays, tuple/prefix items, maps, inline objects, `allOf`, `oneOf`, `anyOf`, discriminator mappings, recursive refs, and the additional JSON Schema relationship keywords listed in Phase 2.
- AsyncAPI component schemas populate standalone class diagrams only when relationships exist. Primitive `sentAt` remains diagram-free.
- AsyncAPI message payloads reuse referenced schema pages and render relational inline payload diagrams through the existing media-type selector and class-diagram component.
- JSON Schema-compatible `schemaFormat` payloads use the semantic renderer. Avro, Protobuf, unknown formats, and malformed compatible payloads retain one raw representation and do not fabricate properties, mocks, or diagrams.
- Message media artifacts are cached per `PrintingPress` instance using the resolved low message source identity, so operation and message pages reuse the same immutable artifact.
- Traversal limits cannot create implicit Mermaid classes or keep allocating identities after a budget is exhausted. Unresolved refs materialize bounded placeholder classes instead of panicking.
- Full and lite UI bundles were regenerated from source. The generated minified bundles retain upstream template-literal whitespace reported by `git diff --check`; they must not be hand-edited after the build.

Current proof:

- `go test ./diagramatron ./printingpress/... -count=1 -timeout 10m`
- `go vet ./diagramatron ./printingpress/...`
- `go test -race ./diagramatron ./printingpress/... -count=1 -timeout 15m`
- UI: 22 files and 197 tests pass
- Real Printing Press CLI through `go.work`: Streetlights reports 3 class diagrams, 16 dependency diagrams, and zero warnings/errors
- Served browser output on port `9199`: `lightMeasuredPayload` renders a 583 x 598 SVG relationship diagram with no page-level horizontal overflow

Still gated follow-up:

- Complete Phase 4 for inline message headers and every remaining inline operation/reply schema owner.
- Phase 5 OpenAPI schema migration behind exact legacy goldens. Legacy non-schema `Mermaidify` traversal remains out of scope permanently.
- Phases 6-7 builder, registry, cross-reference, and graph convergence.
- Phase 8 validation for every output mode beyond the delivered real served/hosted CLI path.
- Phase 9 OpenAPI parity benchmarks and full sibling-repository integration, required before enabling the neutral engine for OpenAPI schemas.

## Why This Is Required

The current implementation has two different schema paths:

- OpenAPI component schemas use Doctor `model/high/v3.SchemaProxy` wrappers. They render schema content, mocks, cross references, dependency graphs, and Mermaid class diagrams.
- AsyncAPI component/message schemas use libasyncapi `highbase.SchemaProxy` values. They render schema content and mocks, and the newer AsyncAPI graph path builds dependency explorers, but they never enter `diagramatron` and therefore never receive class diagrams.

The UI is not suppressing existing AsyncAPI diagrams. `ModelPage.MermaidDiagram` is empty because `collectAsyncAPISchemaModel` never generates it.

The immediate type mismatch is that `diagramatron.Mermaidify` accepts Doctor's OpenAPI `v3.Foundational` hierarchy, while both OpenAPI and AsyncAPI ultimately expose schemas through libopenapi `high/base.SchemaProxy` and `high/base.Schema`.

This is bigger than adding one AsyncAPI call to `Mermaidify`. Schema identity, reference resolution, source location, caches, hydration, inline schema ownership, and visualization assets must all agree or the result will be incomplete and inconsistent.

Current multi-format proof: libasyncapi presently extracts an AsyncAPI payload containing `schemaFormat: application/vnd.apache.avro;version=1.9.0` as a non-nil `highbase.SchemaProxy` without a build error, but the resulting high schema is empty and renders as `{}`. The original multi-format object remains available through the low message payload node. Printing Press must inspect/preserve the low raw node and schema format before treating the high proxy as JSON Schema; the fallback cannot be designed around the high proxy alone.

## Non-Negotiable Decisions

- Build one schema-rendering pipeline for OpenAPI and AsyncAPI.
- Use libopenapi `high/base.SchemaProxy` as the common schema substrate. Do not make libasyncapi models pretend to be Doctor `Foundational` objects.
- Keep Doctor's existing public `diagramatron.Mermaidify(context.Context, v3.Foundational, ...)` entrypoint compatible.
- Add a schema-specific neutral diagram entrypoint instead of breaking callers of the existing API.
- Preserve existing OpenAPI class-diagram output before migrating OpenAPI onto the neutral implementation.
- Deliver AsyncAPI through the new neutral diagram engine before migrating the working OpenAPI schema engine. OpenAPI parity migration is a later gated phase, not a prerequisite for the Streetlights result.
- Generate class diagrams for relational/composed schemas, matching current OpenAPI behavior. Flat primitive-only objects and scalar schemas continue to use the normal schema renderer without an empty or meaningless diagram.
- Referenced component schemas own standalone pages and visualization assets.
- Inline schemas remain inside their owning operation/message/header/content surface and receive an inline schema visualization when they contain relationships.
- Treat schema format separately from transport protocol. Never parse Avro, Protobuf, or an unknown multi-format schema as JSON Schema merely because it appears in an AsyncAPI document.
- Do not duplicate the same schema render, mock, diagram, or graph for every operation/message reference.
- Preserve `NoMermaid`, `NoExplorer`, lite mode, portable mode, served mode, embedded mode, shared-asset mode, archives, hosted manifests, and gzip sidecars.
- Keep release/tag/module pinning out of scope. Validate local Doctor, libasyncapi, libopenapi, Printing Press, and Vacuum integrations with `go.work` files.

## Terminology

### Contract Kind

The API contract format:

- `openapi`
- `asyncapi`

### Transport Protocol

The AsyncAPI channel/server protocol, such as Kafka, MQTT, AMQP, NATS, or Pulsar. It affects channel/operation presentation but never selects a schema renderer.

### Schema Format

The language used to define a payload, such as the default AsyncAPI Schema Object/JSON Schema vocabulary, Avro, or Protobuf. Schema format is independent of transport protocol.

The first implementation target is the JSON Schema-compatible `highbase.SchemaProxy` model currently exposed by libopenapi/libasyncapi. Multi-format schemas must still render their raw source, schema-format label, examples where available, source link, and diagnostics without panic. Their semantic property renderer and class diagrams require an explicit format adapter; they must never be silently interpreted as JSON Schema.

### Schema Surface

Any place where a schema is presented:

- OpenAPI component schema
- OpenAPI request/response/header/parameter schema
- AsyncAPI component schema
- AsyncAPI message payload
- AsyncAPI message headers
- AsyncAPI parameter schema
- inline operation/message/channel/reply schema

### Schema Identity

A stable identity for cache keys, links, graph nodes, visualization assets, and diagnostics. It must distinguish:

- contract kind
- source document
- canonical JSON pointer
- component type/name when present
- owning page and role for inline schemas

## Current Implementation Boundaries

### Directly Reusable

- `highbase.SchemaProxy.Schema()` and schema rendering
- raw YAML/JSON capture
- schema JSON capture and syntax highlighting
- mock generation
- schema property UI components
- examples UI
- raw viewer
- source-link UI
- `ModelPage.MermaidDiagram` and existing class-diagram component
- class-diagram hydration and visualization asset writers
- focused explorer component
- visualization tabs when diagram and graph both exist

### OpenAPI-Specific Today

- `diagramatron.Mermaidify` entry type
- diagram traversal through Doctor `v3.Schema`, `v3.SchemaProxy`, parents, JSON paths, and `Foundational`
- some schema naming and composition logic derived from Doctor parents
- OpenAPI schema collection in `collectSchemaComponents`
- OpenAPI graph IDs derived from Doctor paths

### AsyncAPI-Specific Today

- component schema collection in `collectAsyncAPISchemaModel`
- payload/header extraction in `asyncSchemaSurface` and `asyncMessageMediaType`
- message example extraction
- AsyncAPI source/origin lookup
- AsyncAPI dependency graph and cross-reference assembly

## Architecture

### 1. Shared Schema Surface Contract

Introduce a Printing Press internal contract that describes where a schema came from and how its output will be used.

Suggested shape:

```go
type SchemaRole string

const (
    SchemaRoleComponent      SchemaRole = "component"
    SchemaRolePayload        SchemaRole = "payload"
    SchemaRoleHeaders        SchemaRole = "headers"
    SchemaRoleParameter      SchemaRole = "parameter"
    SchemaRoleRequestBody    SchemaRole = "requestBody"
    SchemaRoleResponseBody   SchemaRole = "responseBody"
    SchemaRoleInline         SchemaRole = "inline"
)

type SchemaIdentity struct {
    SpecKind       SpecKind
    SourceLocation string
    CanonicalPath  string
    ComponentType  string
    ComponentName  string
    OwnerType       string
    OwnerName       string
    Role            SchemaRole
}

type SchemaSurfaceInput struct {
    Identity SchemaIdentity
    Name     string
    Proxy    *highbase.SchemaProxy
    Format   string
    RawNode  *yaml.Node
    Source   *SourceRef
    Examples map[string]string
}

type SchemaSurfaceResult struct {
    SchemaJSON            string
    SchemaHighlightedHTML string
    RawYAML               string
    MockJSON              string
    Examples              map[string]string
    MermaidDiagram        string
    DiagramAssetKey       string
    GraphNodeID           string
    RefTargets            []SchemaReference
}
```

The exact fields may be adjusted to existing model types, but the boundary must remain ownership-neutral. It must not contain Doctor `v3.Foundational` or libasyncapi operation/message types.

### 2. Central Schema Surface Builder

Add one builder responsible for the reusable schema work:

```go
func (pp *PrintingPress) buildSchemaSurface(
    ctx context.Context,
    input SchemaSurfaceInput,
) (*SchemaSurfaceResult, error)
```

Responsibilities:

- validate and normalize identity
- select a schema-format adapter; use the JSON Schema adapter only for compatible formats
- capture schema JSON/raw data
- generate highlighted schema output
- generate or reuse a mock
- retain caller-provided examples
- discover schema references once
- generate or reuse a class diagram when enabled
- expose graph/ref metadata needed by later stages
- return warnings without dropping the page when one optional artifact fails

Callers remain responsible for contract-specific extraction:

- OpenAPI extracts request/response/parameter examples and owner context.
- AsyncAPI extracts message payload/header examples and owner context.
- The shared builder renders the schema itself.

### 3. Schema Identity Contract

For a resolved libopenapi high model, `SchemaProxy.Schema()` already resolves reference proxies through the attached index/rolodex and high-level cache. The neutral walk must not reimplement normal resolution from ref strings. It needs stable identity for the proxy and the schema returned by `Schema()`.

Suggested shape:

```go
type SchemaIdentityProvider interface {
    Identify(
        ctx context.Context,
        proxy *highbase.SchemaProxy,
        fallback SchemaIdentity,
    ) (SchemaIdentity, error)
}
```

Adapters:

- OpenAPI adapter uses the existing Doctor/libopenapi canonical paths and source metadata.
- AsyncAPI adapter uses the proxy's resolved low schema, index/rolodex origin, and libasyncapi source context.
- Component registries provide stable component names without performing a second resolution.

Identity/name priority is deterministic:

1. registered component name
2. reference tail
3. schema title
4. synthetic owner plus role name, including a stable message/media-type/ordinal segment when needed

Normal traversal follows `proxy.Schema()` and child proxies from the resolved high schema. String-based ref lookup is reserved for the unresolved/broken-reference warning path and is not the primary API.

Proof gates before relying on libasyncapi behavior:

- local component refs
- external-file refs
- relative refs from external files
- circular refs
- array item refs
- `allOf`, `oneOf`, and `anyOf` refs
- unresolved refs produce warnings and partial diagrams instead of panics

Add a libasyncapi helper only when its public document/index surface cannot identify resolved schema origins or preserve unresolved/raw payload data cleanly.

### 4. Schema Format Adapters

Keep schema ownership neutral without claiming every schema language has JSON Schema semantics.

Suggested boundary:

```go
type SchemaFormatAdapter interface {
    Supports(format string) bool
    BuildSurface(
        ctx context.Context,
        input SchemaSurfaceInput,
    ) (*SchemaSurfaceResult, error)
}
```

Initial adapters:

- JSON Schema/AsyncAPI Schema Object adapter: full property rendering, mocks, refs, graph data, and class diagrams.
- Raw fallback adapter: raw source, format label, examples, source, extensions, and diagnostics; no fabricated properties, mocks, or relationships.

Add Avro or Protobuf semantic adapters as separate work when libasyncapi exposes a proven parsed model for those formats. The transport protocol must not participate in adapter selection.

### 5. Protocol-Neutral Diagram Entry Point

Add a new schema-specific `diagramatron` API:

```go
type SchemaDiagramInput struct {
    Root       *highbase.SchemaProxy
    Identity   SchemaIdentity
    Identities SchemaIdentityProvider
}

func MermaidifySchema(
    ctx context.Context,
    input SchemaDiagramInput,
    config *MermaidConfig,
) *MermaidDiagram
```

`diagramatron` should consume normalized schema relationships rather than Doctor parent pointers for its core schema work.

Keep the existing API:

```go
func Mermaidify(ctx context.Context, entry v3.Foundational, config *MermaidConfig) *MermaidDiagram
```

Compatibility behavior:

- Existing non-schema `Foundational` traversal remains on the legacy engine indefinitely. Operations, components, security schemes, and other non-schema objects are explicitly not migration targets for `MermaidifySchema`.
- AsyncAPI schemas use `MermaidifySchema` first.
- After AsyncAPI delivery, Doctor `v3.SchemaProxy` entries may adapt their underlying `highbase.SchemaProxy` into `MermaidifySchema` behind the Phase 0 OpenAPI goldens.
- Preserve current OpenAPI IDs, names, ordering, cardinality, composition handling, truncation, and rendered Mermaid text when that later migration occurs.

Temporary duplication between the legacy OpenAPI schema traversal and the new neutral AsyncAPI traversal is intentional. It removes OpenAPI regression risk from the AsyncAPI critical path. Do not add a third engine, and do not let the implementations drift indefinitely: migrate OpenAPI schema entries only after the AsyncAPI Streetlights gate ships and parity is proven. The legacy non-schema traversal remains separate permanently.

### 6. Normalized Schema Walk

The neutral diagram walk must support:

- object properties
- required properties
- scalar type and format
- arrays and tuple/prefix items
- map/additional properties
- direct refs
- nested refs
- `allOf` inheritance/composition
- `oneOf` and `anyOf` polymorphism
- discriminators and mappings
- nullable/type arrays
- circular and recursive schemas
- titled inline schemas
- external references
- deterministic property and relationship ordering
- configured property limits

Use a visit key based on canonical schema identity, not Go pointer alone. Pointer identity is an optimization only; it is insufficient across aliases and external resolution.

Cycle handling is owned by the neutral walk:

- maintain an active recursion set and a completed set keyed by canonical `SchemaIdentity`
- when a child targets an active identity, emit the relationship and stop descending that branch
- do not require document-level circular-reference metadata for termination or correctness
- optionally consume index circular-reference metadata to preserve loop-point styling or annotations
- prove separately whether the index exposed through libasyncapi supplies the same normal, polymorphic, array, ignored, and safe circular-reference sets used by the OpenAPI engine
- absence of optional circular metadata may affect decoration, never traversal safety

### 7. Standalone and Inline Presentation

Standalone component schema page:

- normal schema renderer remains the primary content
- class diagram appears only when the schema has relationships
- dependency explorer remains available
- when both exist, retain the existing tab design
- source, raw viewer, examples, extensions, cross refs, and diagnostics remain unchanged

Referenced payload/header schema:

- message/operation surface links to the component schema page
- schema page owns the full diagram and dependency explorer
- do not embed duplicate Mermaid payloads into every referring page

Inline payload/header schema:

- render inside the owning message or operation content panel
- include an inline class-diagram panel when relationships exist
- use owner/role identity for asset and hydration keys
- do not create a standalone model page

Schema links from a message must continue to use the shared green component-reference design.

### 8. Caching and Asset Ownership

Add one schema artifact cache keyed by:

- canonical `SchemaIdentity`
- one schema content hash computed from the canonical low YAML node through the existing cached `index.HashNode` path
- diagram configuration hash
- mock-generation configuration hash
- renderer version

Cache reusable work separately where useful:

- schema JSON/highlight output
- mock output
- normalized relationship model
- Mermaid text

Rules:

- referenced component schemas render once and are reused by all callers
- inline schemas with identical bytes but different owners do not accidentally share links/source identity
- aliases may reuse expensive normalized/diagram work while retaining caller-specific links
- compute the low-node content hash once when a canonical identity is admitted to the cache, never once per referring surface
- the cache is owned by one `PrintingPress` instance; aggregate entries each create an independent press/cache and no schema artifacts are stored in a process-global cache
- cache values are immutable after publication
- concurrent page collection must not race mutable schema wrappers
- `NoMermaid` must avoid diagram traversal entirely
- `NoExplorer` must not disable schema rendering or Mermaid

### 9. Hydration and Hosted Artifacts

Standalone schema diagrams continue to use existing visualization assets:

- `data/viz/models/<type>/<slug>-diagram.js` in portable mode
- `data/viz/models/<type>/<slug>-diagram.json` in served/hosted mode

Add deterministic inline visualization asset paths, for example:

- `data/viz/operations/<operation-slug>/<message-key>-<role>-diagram.*`
- `data/viz/operations/<operation-slug>/<reply-key>-<message-key>-<role>-diagram.*`
- `data/viz/models/messages/<message-slug>/<message-key>-<role>-diagram.*`

When one owner can expose multiple media types or anonymous messages, the surface key must also include a sanitized media-type key or stable collection ordinal. Role alone is never a unique asset key.

Update:

- page hydration payloads
- media-type selector hydration
- shared schema registry
- hosted artifact manifest
- gzip sidecars
- stale artifact pruning
- archive exports
- embedded/shared-asset URL resolution

Mermaid DSL must remain externalized from HTML where the current asset mode requires it. Do not inflate every referring page with duplicate diagram text.

## Implementation Phases

### Phase 0: Freeze Existing Behavior

- Add OpenAPI golden tests around current Mermaid output for direct refs, array refs, `allOf`, `oneOf`, `anyOf`, discriminators, circular refs, external refs, ordering, property limits, and flat/scalar omission.
- Record current schema page HTML/hydration/asset behavior in portable and served modes.
- Add an AsyncAPI fixture assertion proving the current gap: relational schemas have empty `MermaidDiagram` and the rendered site reports zero class diagrams.
- Confirm `NoMermaid`, `NoExplorer`, and lite-mode behavior before refactoring.

Gate: no neutralization work begins until OpenAPI output parity is protected by exact or semantic golden assertions.

### Phase 1: Identity, Cycles, and Schema-Format Proof

- Add `SchemaRole`, `SchemaIdentity`, schema reference records, and the deterministic class-name priority.
- Add the AsyncAPI identity provider using resolved high proxies plus low-node source/origin metadata.
- Add an optional OpenAPI identity provider for later parity testing, but do not route OpenAPI rendering through it yet.
- Traverse resolved schemas through `proxy.Schema()`; reserve string-based lookup for unresolved-reference reporting.
- Add active/completed canonical-identity sets for cycle-safe traversal.
- Inventory the circular-reference data available through the index exposed by libasyncapi and classify it as optional styling metadata.
- Add a real Avro multi-format fixture and lock in the current behavior: non-nil proxy, no reported build error, empty high schema/rendered `{}`, original object recoverable from the low message payload node.
- Decide and implement the minimum libasyncapi model/helper change required to expose schema format plus raw payload safely; do not design the raw fallback around the empty high schema.
- Add JSON Schema format detection and raw-fallback selection tests.
- Add local, external, relative, circular, array, composed, and unresolved identity tests.

Gate: AsyncAPI schemas have stable canonical identities, recursive walks terminate without document circular metadata, and multi-format payloads can be classified and rendered raw without data loss.

### Phase 2: New Neutral Diagram Engine for AsyncAPI

- Add `MermaidifySchema` against `highbase.SchemaProxy` and `SchemaIdentityProvider`.
- Reuse the existing `MermaidDiagram`, renderer, config, and web component output contracts.
- Implement schema property, composition, polymorphism, discriminator, array/map, reference, and cardinality analysis without Doctor parent chains.
- Apply the deterministic name rule: component name, ref tail, title, then owner/role synthetic name.
- Use canonical-identity cycle guards for correctness and optional index circular metadata only for decoration.
- Add neutral-engine unit tests for the complete structural schema matrix.
- Do not route OpenAPI schema or non-schema `Foundational` entries through the new engine in this phase.

Gate: the neutral engine produces deterministic Mermaid classes and relationships for AsyncAPI-compatible highbase schema fixtures without touching the working OpenAPI traversal.

### Phase 3: AsyncAPI Component Schema Delivery

- Add `buildSchemaSurface` and a per-PrintingPress schema artifact cache for the AsyncAPI path.
- Route AsyncAPI component schemas through the JSON Schema or raw-fallback adapter.
- Populate `ModelPage.MermaidDiagram` for relational AsyncAPI schemas.
- Keep flat/scalar omission consistent with the established OpenAPI behavior.
- Reuse the existing standalone model diagram hydration and visualization asset writer.
- Regenerate assets, build the real CLI through `go.work`, and verify the served Streetlights output.
- Do not migrate OpenAPI schema collection in this phase.

Gate: the Streetlights AsyncAPI fixture and real CLI report at least one class diagram, and `lightMeasuredPayload` renders a class relationship to `sentAt` on port `9199`.

### Phase 4: Message Payloads and Headers

- Route AsyncAPI component message payload/header extraction through the shared builder.
- Referenced payload/header schemas link to their schema pages and reuse those diagram assets.
- Inline payload/header schemas render in their owning message page.
- Extend media-type/message hydration with inline visualization asset keys.
- Apply the same path to inline AsyncAPI operation message surfaces.
- Preserve AsyncAPI message examples as message-level examples; do not confuse them with schema `example`/`examples`.

Gate: named, referenced, and inline payload/header variants all render predictably without duplicate pages or duplicate diagram payloads.

### Phase 5: OpenAPI Schema Migration Behind Goldens

- Adapt Doctor `v3.SchemaProxy` schema entries onto the neutral `highbase.SchemaProxy` engine.
- Preserve current OpenAPI class IDs, names, ordering, cardinality, composition behavior, property limits, and Mermaid text under the Phase 0 goldens.
- Migrate only schema entries. Keep operations, components, security schemes, and every other non-schema `Foundational` entry on the legacy traversal indefinitely.
- Keep a simple rollback switch during migration so parity failures do not block AsyncAPI releases.
- Remove duplicated legacy schema analysis only after the full OpenAPI schema corpus passes.

Gate: the complete existing OpenAPI schema Mermaid suite and HTML/hydration/asset goldens remain green with no unexplained output changes. AsyncAPI remains independently functional if this migration is deferred.

### Phase 6: Remaining Schema Surfaces and Builder Convergence

- Migrate OpenAPI request, response, parameter, and header schema surfaces where they currently bypass the central builder.
- Migrate AsyncAPI parameter and reply-related schema surfaces where present.
- Ensure arrays, maps, composed schemas, and external refs behave identically across owners.
- Ensure diagnostics and source links target the owning inline surface or referenced schema page correctly.

Gate: no contract-specific collector performs its own raw/highlight/mock/diagram sequence outside the shared builder unless documented as an intentional exception.

### Phase 7: Registry, Cross References, and Graph Convergence

- Reconcile schema registry keys with `SchemaIdentity`.
- Preserve existing OpenAPI ref popovers and add equivalent AsyncAPI behavior.
- Reconcile cross-reference labels for operations, messages, channels, and schemas.
- Keep the existing AsyncAPI dependency graph builder initially, then remove duplicated reference walking when the neutral relationship model can feed it without changing graph output.
- Do not couple class-diagram rollout to a graph rewrite; converge only after both paths are independently proven.

Gate: schema links, popovers, cross refs, class diagrams, and dependency explorers all resolve the same canonical target.

### Phase 8: Assets and Browser Validation

- Regenerate templ output and rebuild the UI bundle before browser validation.
- Verify class-diagram hydration in portable, served, hosted, embedded, archive, and shared-asset modes.
- Verify inline schema diagrams switch correctly with media types/examples.
- Verify visualization tabs do not resize or overlap schema content.
- Verify mobile and desktop layouts.
- Verify stale diagram files and gzip sidecars are pruned when schemas or configuration change.
- Render with the real `../printing-press` CLI through the local `go.work`.
- Verify the Streetlights docs on port `9199` in the in-app browser.

Gate: browser validation uses freshly generated assets and the real CLI output, not a test-only writer.

### Phase 9: Performance and Review

- Benchmark OpenAPI schema collection before and after migration.
- Benchmark AsyncAPI component/message schema collection with repeated refs.
- Measure allocations for normalized walks and diagram generation.
- Prove each canonical referenced schema is normalized and diagrammed once per configuration.
- Prove `NoMermaid` performs no diagram walk.
- Run race tests on concurrent schema collection and cache access.
- Run the required performance-code-reviewer after each logical implementation chunk.
- Run full Doctor, libasyncapi when changed, Printing Press CLI, and Vacuum integration tests.

Gate: no material OpenAPI regression and no repeated whole-document or whole-schema-tree walk per referring operation/message.

## Test Matrix

### Structural Schema Cases

- scalar
- flat object
- nested inline object
- direct component ref
- array item ref
- map/additional-properties ref
- `allOf` inheritance
- `oneOf` polymorphism
- `anyOf` polymorphism
- discriminator mapping
- recursive self-ref
- mutually recursive refs
- external-file ref
- unresolved ref
- deeply nested schema with configured limits
- explicit default AsyncAPI schema format
- unknown/multi-format schema routed to the raw fallback

### Ownership Cases

- OpenAPI component schema
- OpenAPI request body
- OpenAPI response body
- OpenAPI parameter/header
- AsyncAPI component schema
- AsyncAPI referenced message payload
- AsyncAPI inline message payload
- AsyncAPI referenced message headers
- AsyncAPI inline message headers
- AsyncAPI inline operation message

### Protocol Independence

Render the same AsyncAPI schema corpus under:

- Kafka
- MQTT
- AMQP
- NATS or Pulsar
- HTTP or WebSocket

Expected result: schema JSON, mock, normalized relationships, and Mermaid output are identical. Only channel/operation protocol presentation differs.

### Output Modes

- portable JS hydration
- served JSON hydration
- embedded assets
- shared asset base URL
- hosted manifest and gzip sidecars
- archive export
- lite mode
- Mermaid disabled
- explorer disabled

## Required Verification Commands

Doctor:

```sh
templ generate
go test ./diagramatron ./printingpress/...
go vet ./diagramatron ./printingpress/...
go test -race ./diagramatron ./printingpress/...
```

libasyncapi, when changed:

```sh
go test ./...
go vet ./...
```

Printing Press CLI through a local workspace:

```sh
go build -o /tmp/ppress-schema-rendering .
/tmp/ppress-schema-rendering <asyncapi-fixture> --output <output-dir> --serve
```

Also render a representative OpenAPI fixture through the same CLI and compare schema pages against the pre-refactor golden output.

## Acceptance Criteria

- OpenAPI schema rendering and existing Mermaid output remain compatible.
- AsyncAPI relational/composed component schemas populate `ModelPage.MermaidDiagram`.
- The Streetlights fixture produces a class diagram for `lightMeasuredPayload` showing its relationship to `sentAt`.
- Flat/scalar schemas do not show empty or meaningless class diagrams.
- Referenced payload/header schemas reuse their standalone schema pages and visualization assets.
- Inline payload/header schemas render inside their owner and can show inline class diagrams.
- Schema rendering does not branch on Kafka, MQTT, AMQP, or any other transport protocol.
- Schema-format selection does not depend on transport protocol.
- Unknown or unsupported multi-format schemas render raw/source/examples/diagnostics without being misinterpreted as JSON Schema.
- Local, external, circular, array, and composed refs resolve without panic.
- Unresolved refs produce useful warnings and partial schema output.
- Schema links, registry entries, popovers, cross refs, class diagrams, and dependency explorers agree on canonical targets.
- `NoMermaid` skips diagram work; `NoExplorer` does not suppress diagrams.
- Portable, served, hosted, embedded, archive, and shared-asset modes load diagram assets correctly.
- Class diagram counts in CLI/render statistics are accurate.
- No stale generated templ/UI/diagram assets remain after validation.
- No material OpenAPI performance regression is introduced.
- Repeated schema references do not repeat expensive render/mock/diagram work.

## Risks and Watch Points

- Doctor parent pointers currently supply naming and composition context. Replacing them without explicit identity inputs can produce unstable or anonymous class IDs.
- Ref strings alone are not globally unique in multi-file documents. Canonical identity must include resolved source location.
- libopenapi proxies may represent aliases to the same resolved schema. Cache expensive work by canonical identity/content while keeping caller-specific source/link metadata separate.
- Circular refs must be guarded before recursive normalization, not only during Mermaid rendering.
- Moving OpenAPI onto a neutral engine without golden parity can silently change class order, relationship cardinality, or inheritance semantics.
- Message examples and schema examples have different ownership and shapes. Keep extraction outside the shared schema builder.
- Inline schemas need owner-aware asset keys or they will collide across operations/messages.
- The existing AsyncAPI dependency graph already works. Do not block class diagrams on replacing that graph implementation.
- Generated assets must be rebuilt before browser checks or stale JavaScript will hide correct Go/template changes.

## Out of Scope

- AsyncAPI 2.x support
- protocol-specific schema renderers
- Avro/Protobuf semantic property renderers and diagrams until a proven parsed-model adapter is available
- release tagging and module pinning
- replacing Mermaid or the existing class-diagram web component
- changing the established OpenAPI schema page design

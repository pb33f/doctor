# AsyncAPI Support for Printing Press

## Goal

Add complete AsyncAPI 3.x documentation support to Doctor's `printingpress` package, with the standalone `printing-press` CLI consuming the local Doctor and `../libasyncapi` implementations through a `go.work` during validation.

This is not a preview, not a V1, and not a partial mode. The implementation should render AsyncAPI as a first-class input alongside OpenAPI across HTML, JSON artifacts, LLM files, aggregate catalogs, diagnostics, navigation, source links, hosted/archive outputs, and schema/model visualization.

The protocol-neutral schema rendering, inline schema ownership, and class-diagram follow-up is specified in `schema-rendering.md`. That plan is required for schema-visualization parity across OpenAPI and every AsyncAPI transport protocol.

## Non-Negotiable Decisions

- Support AsyncAPI 3.x and later only. AsyncAPI 2.x is not supported, not rendered, and not added to catalogs.
- Keep operations as the primary documentation unit. Referenced/named channels and messages are first-class model pages; inline models render inside the operation/channel/message that owns them.
- Reuse the existing `--vacuum-report` and `--stdin` diagnostics design exactly. Do not add internal Vacuum execution.
- Render every existing output family: HTML, JSON artifacts, LLM files, aggregate catalogs, served/archive outputs, hosted artifact manifests, and developer diagnostics.
- Mixed aggregate catalogs may contain OpenAPI and AsyncAPI specs in the same service/version grouping.
- Add per-entry spec-kind indicators in catalogs. Use `OpenAPI` and `AsyncAPI` as visible labels, and preserve the machine kind as `openapi` or `asyncapi`.
- For graphing, prioritize schemas, message payloads, message headers, and operation/message/schema dependencies. Full operation-channel-server topology can grow later after the schema/message dependency experience is correct.
- Edit `../libasyncapi` when Doctor needs a clean public helper or correctness/performance fix. Do not force awkward Doctor-side workarounds around missing library surfaces.
- Preserve existing OpenAPI behavior and public API compatibility unless a contract change is explicitly versioned.

## Current Shape

Doctor's Printing Press is OpenAPI-shaped at the engine boundary:

- `printingpress/api.go` has `pressSource` with raw bytes, a libopenapi v3 model, and a Doctor `DrDocument`.
- `printingpress/api.go` always builds libopenapi documents and then `DrDocument` in `prepareEngineConfig`.
- `printingpress/press.go` carries `pressEngineConfig.DrDoc` and `LintResults` as Doctor OpenAPI v3 types.
- `printingpress/press.go` has `pressSite()` hard-wired to `DrDoc.V3Document`, cURL generation, OpenAPI cross refs, and Doctor graph nodes/edges.
- `printingpress/collector.go` walks Doctor OpenAPI models to build `Site`, `OperationPage`, and `ModelPage`.
- `printingpress/crossref.go` scans OpenAPI operation request/response/parameter/security shapes and JSON `$ref` strings.
- `printingpress/graph_builder.go` consumes Doctor v3 graph nodes and edges directly.
- `printingpress/agent_writer.go` is heavily HTTP-shaped: method/path headings, request/response sections, cURL, HTTP quick start, HTTP resource tables, and HTTP related-operation heuristics.
- `printingpress/json_artifacts.go` names operations as method plus path and has no spec-kind or AsyncAPI operation context in the public bundle/manifest entries.
- `printingpress/html_hydration.go` serializes operation hydration through OpenAPI-specific sections such as request body, responses, parameters, callbacks, and cURL.
- `printingpress/html_hydration.go` carries diagnostics metadata fields named around method/path/operation IDs and needs AsyncAPI page context.
- `printingpress/render/layout_page.go` includes fallback navigation copy that assumes an API overview plus Operations/Models groups without spec-kind context.
- `printingpress/render/templ_diagnostics.templ` contains OpenAPI-specific diagnostics copy.
- `printingpress/artifact_manifest.go` writes the hosted `ppress-manifest.json` contract and gzip sidecars consumed by hosted surfaces.
- `printingpress/config/config.go` and `../printing-press/cmd/root.go` own config-file behavior, CLI help text, and user-facing command copy.
- Generated templ Go files and bundled TypeScript/CSS assets must be regenerated when templates or UI components change.
- `printingpress/aggregate_discovery.go` discovers only `openapi` and `swagger` markers.
- Aggregate state records and SQLite rows do not persist spec kind.
- `../printing-press` is mostly a CLI wrapper over `github.com/pb33f/doctor/printingpress`, including `CreatePrintingPressFromBytes` and the existing `--vacuum-report` path.

`../libasyncapi` already provides the base document surface:

- `libasyncapi.NewDocumentWithConfiguration`.
- `Document.Model()`, `GoLow()`, `Index()`, `Rolodex()`, `RootNode()`, `Errors()`, and `IsPartial()`.
- AsyncAPI 2.x rejection via `ErrAsyncAPI2NotSupported`.
- `visitor.NewWalker(...).Walk(...)` for high-level AsyncAPI traversal.
- Message payload and header schemas use libopenapi `highbase.SchemaProxy`, so the raw schema render and mock-generation parts of the existing pipeline can be reused.

Known current dependency drift:

- Doctor currently depends on `github.com/pb33f/libopenapi v0.38.1`.
- `../libasyncapi` currently depends on `github.com/pb33f/libopenapi v0.37.3`.
- Go MVS will select one libopenapi version in the local Doctor/libasyncapi `go.work` build. There is no real coexistence story. For this implementation plan, prove libasyncapi against the workspace-selected Doctor libopenapi version. Release tagging and final module pinning are user-owned and intentionally out of scope here.

## Architecture

### Spec Kind

Introduce an explicit spec-kind concept instead of inferring behavior from populated fields.

Spec kind should be a typed public contract, not raw strings scattered through the codebase. Use one central type and helper surface, such as `SpecKind`, with constants for OpenAPI and AsyncAPI plus accessors for machine value, display label, and branch checks.

Suggested values:

- `openapi`
- `asyncapi`

The kind should be available on:

- `pressSource`
- `pressEngineConfig`
- activity source kind/progress metadata
- `model.Site`
- `model.RootPage`
- `model.OperationPage`
- `model.ModelPage`
- navigation records
- page hydration payloads where page-specific branching needs it
- diagnostics hydration metadata and shared nav cache payloads
- raw/schema artifact cache keys if the same source object can be rendered through multiple AsyncAPI surfaces
- JSON bundle and artifact manifest entries
- hosted artifact metadata if host consumers need kind-aware routing
- aggregate discovery records
- aggregate catalog entries
- aggregate state records and SQLite rows
- aggregate JSON and LLM catalog indexes

Detection should be cheap and marker-based before calling libopenapi, and should return both spec kind and discovered version:

- YAML/JSON `asyncapi` means AsyncAPI and should carry the scalar version value.
- YAML/JSON `openapi` or `swagger` means OpenAPI and should carry the scalar version value.
- Missing or unsupported markers return a useful error.
- AsyncAPI `2.x` returns the unsupported-version error, not an OpenAPI parse failure.
- Aggregate discovery must not add AsyncAPI 2.x entries to catalogs or state. It may warn clearly, but unsupported AsyncAPI 2.x is not a rendered or skipped catalog entry.

### Dependency Alignment and libasyncapi Track

Add a dependency-alignment phase before wiring Doctor to libasyncapi:

- Use the local `go.work` build to force one libopenapi version across Doctor and libasyncapi, and test libasyncapi under that selected version.
- Align `go.yaml.in/yaml/v4` and other shared parser dependencies enough to avoid duplicated behavior in low/high model rendering.
- Run `go test ./...` in `../libasyncapi` under the workspace-selected dependency graph after any helper or dependency change.
- Run targeted Doctor schema rendering tests with the local workspace that uses local libasyncapi.
- Do not add release/tag/pinning gates to this implementation plan; release mechanics are handled separately by the user.

Treat libasyncapi helper work as a continuous track, not a one-shot Phase 0 deliverable. Phase 0 should prove dependency alignment and obvious API blockers, but collector, graph, and diagnostics phases are expected to reveal additional helper needs around reference resolution, source locations, canonical paths, and walker context.

### Schema Pipeline Reuse Boundary

Be explicit about what can and cannot be reused from the existing OpenAPI schema path.

Reusable directly:

- raw schema rendering for objects that expose `Render()`
- generated mock payloads for `highbase.SchemaProxy`
- syntax highlighting and raw viewer display
- shared mock limits and cache discipline

Needs a neutral contract, not Doctor OpenAPI wrappers:

- schema registry entries
- ref-popovers
- JSON path / canonical node IDs
- schema/model cross references
- focused explorer graph payloads
- Mermaid/class diagram generation

The current Mermaid path and Doctor graph path use Doctor OpenAPI `*v3.SchemaProxy`/`Foundational` wrappers. AsyncAPI schemas are libopenapi `highbase.SchemaProxy` values without Doctor OpenAPI ownership, so registry/cross-ref/jsonpath/graph/mermaid behavior must go through the neutral contracts described in this plan.

### Public API and Source Kind

OpenAPI constructors must remain compatible:

- `CreatePrintingPressFromBytes`
- `CreatePrintingPressFromV3Model`
- `CreatePrintingPressFromDrModel`

Add AsyncAPI public surface intentionally:

- Add `CreatePrintingPressFromAsyncAPIDocument` for callers that already parsed with libasyncapi.
- Consider `CreatePrintingPressFromAsyncAPIModel` only if there is a clean, stable high-model input story.
- Keep `CreatePrintingPressFromBytes` as the normal auto-detect entrypoint for both OpenAPI and AsyncAPI.
- Extend source validation so exactly one source remains required.
- Extend activity source kinds with explicit AsyncAPI values so progress/reporting is not stuck at generic `bytes` or OpenAPI-specific `v3-model`.

### Document Adapters

Keep OpenAPI and AsyncAPI parsing separate, then project both into the shared site model.

OpenAPI adapter:

- Existing libopenapi plus Doctor `DrDocument` path.
- Existing bundling/origin behavior remains the OpenAPI implementation.
- Existing graph node/edge behavior remains behind the OpenAPI graph adapter.
- Existing diagnostics absorption through `DrDocument.AbsorbLintResults` remains the OpenAPI implementation.

AsyncAPI adapter:

- Parse raw bytes with `libasyncapi.NewDocumentWithConfiguration`.
- Carry the returned document, high model, low model, index, rolodex, root node, partial errors, and source size into the engine config.
- Add a small Doctor-side adapter type only if needed to normalize access. Do not pretend AsyncAPI is a `DrDocument`.
- Mirror the OpenAPI file-reference configuration: base path, file refs enabled, logger, and source location.
- Carry partial parse errors as build warnings and diagnostics context.
- If libasyncapi lacks a needed origin/source/reference helper, add it there with tests instead of guessing in Doctor.

### Site Build Orchestration

Do not treat this as only a collector split. `pressSite()` currently does more than collection.

Split the build into explicit stages that can branch by spec kind:

- collect site model
- build cross references
- build generated operation helpers
- encode cross-ref JSON and hints
- build focused graph payloads
- attach build warnings
- attach diagnostics
- discover content pages
- finalize site output fields

OpenAPI behavior should keep using current HTTP/cURL/cross-ref/graph paths. AsyncAPI should skip or replace HTTP-only stages:

- No cURL generation for AsyncAPI.
- No HTTP related-operation/resource heuristics for AsyncAPI LLM output.
- No OpenAPI `DrDoc.Nodes` graph access for AsyncAPI.
- Diagnostics must use a neutral page-targeting path, not OpenAPI `Foundational` owners.
- Raw/schema artifact caches must key AsyncAPI message payloads, message headers, component schemas, and inline schemas without collisions.
- Shared hydration payloads must expose enough spec-kind metadata for nav, schema registry, diagnostics drawers, raw viewers, and hosted embeds.

### Collector and Identity Rules

Keep the existing OpenAPI collector intact and add an AsyncAPI collector beside it.

The engine should route:

- `collectOpenAPISite` for Doctor `DrDocument`.
- `collectAsyncAPISite` for `libasyncapi.Document`.

The AsyncAPI collector should populate the shared `Site` model with spec-kind-specific fields rather than overloading HTTP-only fields.

Define deterministic identity rules before implementation:

- Operation slug priority: operation ID, then action plus channel name/address, then stable collection key.
- Duplicate operation IDs must produce stable slugs through the existing slug registry.
- Channel page slugs must prefer channel key, then address, then stable fallback.
- Message page slugs must distinguish component messages and other referenced/named messages. Inline anonymous messages render inside their owning operation/channel/reply unless they are referenced elsewhere.
- Schema pages must keep component schema slugs compatible with existing schema paths where possible.
- Operation labels must not depend on HTTP method/path for AsyncAPI.
- Nav labels for AsyncAPI operations should show action and channel.
- Cross-ref labels should be meaningful for messages, channels, and schemas.

Root page:

- info title, version, description/summary, contact, license
- AsyncAPI version
- servers and protocol/protocolVersion data
- security requirements
- AsyncAPI-specific security scheme types such as SASL, X509, `scramSha256`, `scramSha512`, `gssapi`, and `plain`
- tags and external docs
- build warnings and partial parse errors
- source links and root diagnostics

Operation pages:

- operation ID, title/summary, description, tags, external docs, deprecated
- action (`send`/`receive`)
- channel name/key/address and channel page link
- server references and protocol context
- messages used by the operation
- replies and reply addresses/channels/messages
- bindings and traits
- examples and extensions
- message examples with AsyncAPI's `name`, `summary`, `payload`, and `headers` shape
- source line/location
- diagnostics, slices, and cross references

Model pages:

- schemas
- messages
- channels
- servers
- security schemes
- parameters
- replies
- reply addresses
- correlation IDs
- bindings
- operation traits
- message traits
- tags
- external docs where useful

Referenced/named messages should render payload and header schemas with the existing raw-render/mock pipeline on their model pages. Inline payload/header schemas should render inside the owning operation/channel/message without creating standalone model pages.

AsyncAPI security and examples are not OpenAPI-shaped:

- Security rendering must handle AsyncAPI-only security schemes rather than relying on the OpenAPI security-scheme component.
- Message examples must extract payloads and headers from AsyncAPI message-example objects, not only OpenAPI schema `example`/`examples`.

### Rendering and UI

Do not fork the whole writer. Keep page writers and route families stable, but make templates aware of spec kind.

Operation template changes:

- For OpenAPI, preserve current method/path/cURL/request/response layout.
- For AsyncAPI, render action/channel/protocol/messages/replies/bindings instead of HTTP request/response sections.
- Do not show cURL for AsyncAPI unless a future protocol-specific generator is intentionally added.
- Do not render HTTP method/path components for AsyncAPI nav, root overview, breadcrumbs, titles, or raw viewer labels.

Model template changes:

- Continue to use the schema viewer, raw viewer, examples, extensions, source links, cross refs, and diagnostics drawers.
- Add AsyncAPI model metadata blocks for channels, messages, servers, bindings, traits, replies, reply addresses, and correlation IDs.
- Message pages must make payload and headers inspectable as first-class schema surfaces.

Navigation:

- Operations remain the main nav list.
- Referenced/named channels and messages appear under model groups with first-class labels.
- AsyncAPI operation nav should show action and channel, not HTTP method/path styling.
- Fallback nav HTML, loading skeletons, breadcrumbs, and page titles should not leak HTTP/OpenAPI wording into AsyncAPI docs.
- Catalog cards should show spec-kind badges when a service/version group contains mixed kinds.
- Catalog JSON and LLM indexes should include spec kind for every entry, mixed or not.

Diagnostics UI:

- Replace OpenAPI-only diagnostics copy with spec-kind-aware copy.
- Preserve the same diagnostics component behavior and drawer interactions.

### JSON, Hydration, and Hosted Artifacts

The JSON artifact contract is a public surface and needs explicit updates.

Add or verify:

- `specKind` in `bundle.json`.
- `specKind` in root, operation, model, nav, and manifest entries where consumers need routing.
- `specKind` and AsyncAPI page context in shared hydration assets under `data/`.
- AsyncAPI-aware diagnostics metadata in hydration payloads; do not rely only on `pageMethod` and `pagePath`.
- AsyncAPI operation fields for action, channel, messages, replies, bindings, traits, and protocol context.
- AsyncAPI model fields for message payload/header schema surfaces and channel/server/binding metadata.
- Operation artifact display names that do not concatenate HTTP method and path for AsyncAPI.
- Navigation JSON that can render AsyncAPI operations without HTTP method/path.
- Hydration payloads for AsyncAPI operation sections and message schema sections.
- Raw viewer hydration for AsyncAPI operations, channels, messages, replies, bindings, and message payload/header schema surfaces.
- Schema registry entries and ref-popover data for AsyncAPI schemas used outside `components.schemas`, including message payloads and headers.
- Hosted artifact manifest behavior remains stable; `specKind` should be additive v1 metadata unless a breaking host-consumer contract change is introduced.
- Portable, served, embedded, and shared-asset-base URL modes all still resolve AsyncAPI page data, graph data, nav cache, and static assets.

If the JSON contract changes in a way existing host consumers must know about:

- Extend the relevant manifest format additively where possible; bump only for breaking host-consumer changes.
- Add compatibility tests for OpenAPI output.
- Add AsyncAPI artifact contract fixtures.

### LLM and Agent Output

LLM output requires a real AsyncAPI renderer branch, not only extra fields.

OpenAPI behavior:

- Preserve current HTTP-focused `AGENTS.md`, `llms.txt`, operation markdown, request/response sections, cURL, and related operation hints.

AsyncAPI behavior:

- Write AsyncAPI-aware `AGENTS.md` guidance.
- Write `llms.txt` indexes that describe operations by action/channel/message context.
- Render operation markdown with action, channel, protocol/server context, messages, payloads, headers, replies, bindings, traits, security, examples, source links, and cross refs.
- Render message pages as detailed model markdown with payload/header schemas and operations that use them.
- Render channel pages with address, servers, parameters, messages, bindings, operations, and source links.
- Do not include cURL, HTTP request body, HTTP responses, HTTP resource tables, HTTP patch guidance, or HTTP path/method related-operation scoring for AsyncAPI.
- Add AsyncAPI-specific related links based on shared channel, shared messages, shared schemas, and reply relationships.
- Aggregate LLM catalog indexes should include spec kind for every entry and display `OpenAPI` or `AsyncAPI` where useful for humans.

### Graphing and Cross References

Introduce a neutral graph contract for Printing Press.

Suggested shape:

- `GraphNode` with `ID`, `ParentID`, `Type`, `Label`, `JSONPath`, optional schema payload, and optional href.
- `GraphEdge` with `ID`, `Sources`, `Targets`, `Ref`, and `Dependency`.
- `GraphProvider` or equivalent adapter that can build the focused model graph payload.

OpenAPI adapter:

- Converts existing Doctor v3 nodes/edges into the neutral contract.
- Keeps existing output stable.

AsyncAPI adapter:

- Uses `visitor.NewWalker(...).Walk(...)` and/or libasyncapi indexes to build schema/message dependency nodes.
- Adds nodes for component schemas, message payload schemas, message header schemas, operations, and messages that use them.
- Produces edges for `$ref` schema dependencies, operation-to-message usage, message-to-schema usage, reply-to-message usage, and schema-to-schema usage.

Add a hard proof gate for reference resolution:

- Resolve `*low.Reference` channel/message/server references to canonical target objects.
- Produce stable JSON pointer IDs for component and inline nodes.
- Map each target to an href when a rendered page exists.
- Preserve line/location data for source links and diagnostics.
- Add helpers in libasyncapi if the walker/index/low model does not expose enough data.

Cross references:

- `ModelCrossRefs.UsedByOperations` should work for AsyncAPI messages and schemas.
- Add message-aware refs so schema pages can say they are used by messages as well as operations.
- Add channel-aware refs so message pages can say which channels expose them.
- Operation pages should list referenced messages/schemas/channels.
- Message pages should list payload/header schemas and operations that use the message.
- Schema pages should list messages and operations that use the schema.

### Diagnostics

Keep the existing CLI design:

- `--vacuum-report <file>`
- `--stdin` for report input
- no internal Vacuum run

Implementation work:

- Convert Vacuum report results into a neutral Printing Press diagnostics type that can attach to either OpenAPI or AsyncAPI pages.
- Preserve current OpenAPI diagnostics behavior through an adapter from Doctor v3 lint results.
- Add AsyncAPI page targeting for root, operations, channels, messages, schemas, servers, security, parameters, replies, reply addresses, bindings, traits, and orphan results.
- Preserve source snippets, line/column data, severities, counts, nav badges, drawers, diagnostics index behavior, and orphan reporting.
- Replace OpenAPI-specific diagnostics copy with spec-kind-aware copy.
- Ensure AsyncAPI report hydration in `../printing-press/cmd/vacuum_report.go` uses the correct AsyncAPI ruleset metadata instead of always defaulting to OpenAPI rules.
- Aggregate diagnostic counts must work for AsyncAPI entries and mixed catalogs.

### Aggregate Catalogs

Discovery must support both spec kinds:

- Sniff `asyncapi`, `openapi`, and `swagger`.
- Parse common `info` fields for title, summary/description, version, and contact.
- Reject unsupported AsyncAPI 2.x during discovery/parsing and do not add it as a catalog entry.
- Store spec kind in discovered records, catalog entries, state records, and SQLite rows.
- Include spec kind in render/config hashes so kind-specific changes cannot reuse stale entries.
- Allow mixed OpenAPI/AsyncAPI entries in one service/version group.
- Render `OpenAPI` / `AsyncAPI` badges when a group is mixed.
- Include machine-readable `specKind` for all entries in aggregate JSON, even when a group is not mixed.
- Include spec kind in aggregate LLM and AGENTS indexes for all entries.
- Hard-fail AsyncAPI 2.x when rendering a single spec. Aggregate discovery should warn and omit unsupported AsyncAPI 2.x from catalog/state rather than rendering a skipped entry.
- Add SQLite migration logic and in-memory state-store handling for the new spec-kind field.
- Update stale-output pruning and fast-mode reuse tests for kind-aware state.

### CLI, Config, and Documentation Surfaces

The wrapper and config layer must describe the new capability without changing the proven workflow:

- Update `../printing-press` command descriptions, examples, hints, and empty-state copy from OpenAPI-only language to OpenAPI/AsyncAPI language.
- Keep existing flags and config keys stable.
- Ensure `printing-press.yaml` discovery and aggregate scan behavior work for AsyncAPI file names and mixed directories.
- Update README/docs examples only after the CLI is proven with real generated AsyncAPI output.
- Ensure errors from unsupported AsyncAPI 2.x, malformed AsyncAPI, and unknown specs are clear at the CLI boundary.
- Preserve `--vacuum-report` and `--stdin` error behavior while making AsyncAPI report failures understandable.

### libasyncapi Continuous Helper Track

Before Doctor depends on inferred behavior, prove or add these helpers in `../libasyncapi`. This track continues through collector, graph, and diagnostics work because some real gaps only appear once those phases exercise the model:

- Dependency alignment with Doctor's libopenapi version.
- Reference target resolution for operation channel refs, operation message refs, reply message refs, channel message refs, and server refs.
- Canonical JSON pointer or equivalent stable path for high-level and low-level objects.
- Source line/location helpers for high-level objects, low-level objects, and referenced objects.
- Safe accessors for component collections needed by Doctor collectors.
- Walker events or helper APIs that expose enough context to distinguish component schemas, message payload schemas, message header schemas, and inline schemas.
- Tests for multi-file references, line/source locations, circular schema refs, and missing/unresolved references.

## Implementation Phases

### Phase 0: Dependency Alignment and Initial Proof

- Prove `../libasyncapi` under the local workspace-selected libopenapi version.
- Run `go test ./...` in `../libasyncapi` under the local `go.work` dependency graph.
- Run a small Doctor compile/test proof that imports libasyncapi schema proxies through the intended adapter path.
- Capture obvious libasyncapi helper gaps before Doctor implementation starts, while keeping the continuous helper track open for phases 4, 8, and 9.

### Phase 1: Spec Kind, Public API, and Parsing Boundary

- Add version-aware spec-kind detection helpers and tests for YAML and JSON.
- Add a public typed spec-kind enum/constants surface with central display/machine-value helpers.
- Add AsyncAPI fields to `pressSource` and `pressEngineConfig`.
- Add explicit activity source kinds for AsyncAPI.
- Add `CreatePrintingPressFromAsyncAPIDocument`.
- Route raw bytes to libopenapi or libasyncapi based on kind.
- Preserve existing public constructors and OpenAPI behavior.
- Add focused tests for OpenAPI unchanged behavior, AsyncAPI 3.x parse success, AsyncAPI 2.x hard failure, and unknown spec rejection.

### Phase 2: Site Model and Public Contract Extensions

- Add spec-kind fields to `Site`, `RootPage`, `OperationPage`, `ModelPage`, nav records, catalog entries, and state records.
- Add AsyncAPI-specific structs for operation messages, channel refs, protocol/binding details, replies, reply addresses, traits, and message schema surfaces.
- Add JSON artifact fields and tests for AsyncAPI operations/models.
- Define display labels for OpenAPI and AsyncAPI operations.
- Keep HTTP fields intact for OpenAPI compatibility.
- Update JSON serialization tests so new fields omit cleanly for OpenAPI and appear for AsyncAPI.

### Phase 3: Engine Orchestration Split

- Split `pressSite()` into kind-aware stages: collect, cross refs, operation helpers, graph payloads, warnings, diagnostics, content pages, and finalization.
- Preserve the current OpenAPI path and cURL generation.
- Skip cURL and HTTP-only helpers for AsyncAPI.
- Add tests proving AsyncAPI build does not require `DrDoc`.
- Add tests proving OpenAPI output remains stable.

### Phase 4: AsyncAPI Collector

- Build `collectAsyncAPISite`.
- Implement deterministic slug/identity rules for operations, channels, messages, replies, and schemas.
- Populate root metadata, servers, operations, channels, messages, schemas, security, parameters, replies, reply addresses, correlation IDs, bindings, traits, tags, extensions, source refs, and warnings.
- Reuse the raw schema render and mock-generation portions of the existing pipeline for payloads, headers, and component schemas.
- Implement AsyncAPI-specific extraction for message examples and AsyncAPI-only security schemes.
- Add fixtures for a representative AsyncAPI 3.x document with operations, referenced/named channels, referenced/named messages, inline operation payload/header schemas, payload schemas, headers, servers, security, traits, bindings, replies, examples, and extensions.
- Add multi-file fixtures once libasyncapi source/origin support is ready.

### Phase 5: HTML Template Shape and UI Components

- Update operation templates and Lit components to branch on spec kind.
- Add AsyncAPI blocks for action/channel/messages/replies/bindings/traits/protocol context.
- Update root overview and nav components to show action/channel labels.
- Update model pages for messages/channels/servers/bindings/traits/replies/reply addresses/correlation IDs.
- Update raw viewer labels and diagnostics labels so they do not assume HTTP method/path.
- Update fallback nav, loading skeletons, breadcrumbs, and title/header copy so AsyncAPI does not inherit OpenAPI-only wording.
- Update diagnostics page copy to be spec-kind-aware.
- Regenerate templ outputs after `.templ` changes.
- Rebuild bundled UI assets after TypeScript/CSS changes.
- Keep OpenAPI screenshots and template tests stable.
- Add static HTML/template assertions for AsyncAPI operation pages, message pages, channel pages, schema pages, nav labels, source link text, raw viewer containers, and extension rendering.

### Phase 6: JSON Artifacts, Hosted Artifacts, and Contract Tests

- Add `specKind` and AsyncAPI fields to JSON bundle/page artifacts.
- Update operation artifact entries so AsyncAPI names do not depend on method/path.
- Add AsyncAPI manifest entries for operations and model groups.
- Add AsyncAPI fields to shared hydration JSON where host consumers or browser components need them.
- Update shared nav cache and page hydration builders for AsyncAPI fields, diagnostics metadata, raw viewers, and schema registry/ref-popover data.
- Update raw/schema artifact caches so message payload/header schemas and inline schemas do not collide with component schemas.
- Add `specKind` as additive hosted artifact metadata without bumping `ArtifactManifestVersion`, unless implementation discovers a breaking host-consumer contract change.
- Verify `ppress-manifest.json`, gzip sidecars, content types, protected/public access classification, and entrypoints for AsyncAPI generated outputs.
- Verify stale hosted manifests and stale gzip sidecars are removed when artifact generation is disabled or outputs change.
- Add contract tests for OpenAPI backwards compatibility.
- Add contract tests for AsyncAPI JSON bundle, page JSON, nav JSON, manifest JSON, and hosted manifest behavior.

### Phase 7: LLM and Agent Output

- Add AsyncAPI-specific `AGENTS.md` guidance.
- Add AsyncAPI-specific `llms.txt` quick start/index sections.
- Add AsyncAPI operation markdown renderer.
- Add AsyncAPI message/channel/server model markdown renderers.
- Disable HTTP cURL/request/response/path-method guidance for AsyncAPI.
- Replace related-operation logic for AsyncAPI with shared-channel/shared-message/shared-schema/reply relationship logic.
- Add LLM tests for single AsyncAPI specs and mixed aggregate catalogs.
- Keep OpenAPI LLM output stable.

### Phase 8: Graph and Cross References

- Introduce neutral graph types/adapters.
- Port existing OpenAPI graph builder onto the neutral contract without changing output.
- Add or consume libasyncapi helpers for reference target resolution and source locations.
- Add AsyncAPI graph builder for schemas, message payloads/headers, and operation/message usage.
- Add message-aware and channel-aware cross refs.
- Add graph/cross-ref tests for schema-to-schema refs, message-to-schema refs, operation-to-message refs, channel-to-message refs, and reply-to-message refs.

### Phase 9: Diagnostics

- Add neutral diagnostics result/page-target types.
- Adapt existing OpenAPI Doctor lint results into the neutral type.
- Adapt Vacuum AsyncAPI report data into the neutral type.
- Attach AsyncAPI Vacuum report results to AsyncAPI root, operation, channel, message, and model pages.
- Preserve orphan handling.
- Update `../printing-press/cmd/vacuum_report.go` report hydration so AsyncAPI rule metadata is correct.
- Add tests for `--vacuum-report` and `--stdin` on AsyncAPI reports through the CLI.

### Phase 10: Aggregate Catalogs and State

- Extend discovery sniffing and metadata parsing.
- Reject AsyncAPI 2.x during aggregate discovery with clear warnings and no catalog/state entry.
- Store and render spec kind everywhere: discovered specs, catalog entries, JSON, LLM, state records, and SQLite.
- Add mixed `OpenAPI` / `AsyncAPI` catalog badges.
- Ensure changed/skipped state handles kind-specific hashes cleanly and unsupported AsyncAPI 2.x never enters catalog/state.
- Add SQLite migration logic that backfills existing rows as `openapi`.
- State and test that adding spec kind to render/config hashes causes a one-time full re-render on first upgraded run.
- Add SQLite migration tests.
- Add tests for mixed catalogs, fast mode reuse, state persistence, unsupported AsyncAPI 2.x omission/warnings, JSON/LLM spec kind, and diagnostic counts.

### Phase 11: Hydration, Graph, Diagnostics, and Browser Validation

- Run `templ generate` and rebuild the Printing Press UI bundle before browser validation so runtime checks use current generated assets.
- Add runtime HTML assertions and browser checks after JSON/hydration, graph, and diagnostics data exist.
- Verify AsyncAPI operation pages, message pages, channel pages, schema pages, nav, source links, raw viewers, diagnostics drawers, ref-popovers, schema registry, graph data, and extension rendering.
- Verify portable mode, served mode, embedded mode, and shared asset base URL mode.
- Verify OpenAPI generated docs still render correctly after shared template and hydration changes.

### Phase 12: CLI Validation Through `../printing-press`

- Re-run `templ generate` and the UI bundle build first if any template, TypeScript, CSS, hydration, nav, or diagnostics UI code changed after Phase 11.
- Create or update a local `go.work` in `../printing-press` for validation only, using local `../doctor` and `../libasyncapi`.
- Update CLI command descriptions, examples, hints, and config docs from OpenAPI-only wording to OpenAPI/AsyncAPI wording.
- Build the real `ppress` CLI.
- Render a single AsyncAPI fixture.
- Render an aggregate catalog containing OpenAPI and AsyncAPI specs.
- Render with AsyncAPI Vacuum reports via `--vacuum-report` and `--stdin`.
- Verify HTML, LLM, JSON artifacts, hosted manifest, source links, diagnostics, and graph data from the generated output.
- Verify unsupported AsyncAPI 2.x and malformed AsyncAPI errors at the real CLI boundary, and verify unsupported AsyncAPI 2.x is omitted from aggregate catalogs.

### Phase 13: Generated Asset Final Sweep

- Re-run `templ generate` and rebuild the UI bundle if anything changed during Phase 11 or Phase 12.
- Verify embedded static assets, shared assets, fonts, icons, and page-data URLs are present in generated outputs.
- Ensure generated files are intentionally updated and no stale generated assets remain.

### Phase 14: Performance and Review Gate

- Run focused performance checks around AsyncAPI collection, schema rendering, graph building, and aggregate discovery.
- Ensure marker detection does not whole-document unmarshal.
- Ensure schema render/mock work is cached and not repeated for each message/operation reference.
- Ensure graph building does not repeatedly walk the whole AsyncAPI document per page.
- Run the required performance-code-reviewer agent after logical code chunks.

## Test Plan

Doctor:

- `go test ./printingpress`
- targeted spec-kind detection tests
- targeted public constructor tests
- collector/render/graph/aggregate/diagnostics tests
- JSON artifact contract tests
- LLM output tests
- hosted artifact manifest tests
- public API compatibility tests
- performance-sensitive tests around schema rendering and graph building

libasyncapi, when changed:

- `go test ./...`
- focused tests for dependency alignment
- focused tests for new source/origin/reference helpers
- focused tests for walker context, canonical paths, circular refs, and multi-file refs

printing-press CLI:

- `go test ./cmd`
- `go build -o ppress .`
- real CLI render of AsyncAPI single-spec docs
- real CLI render of mixed aggregate docs
- real CLI render with Vacuum AsyncAPI report file and stdin report input

Browser/runtime checks:

- Open generated AsyncAPI docs with the in-app/browser tooling.
- Verify operation page layout, channel/message model pages, diagnostics drawer, raw/source viewers, nav labels, catalog badges, and focused explorer payloads.
- Verify OpenAPI generated docs still render correctly after shared template changes.
- Verify portable, served, embedded, and shared-asset-base modes.
- Verify generated `ppress-manifest.json` and gzip sidecars when hosted artifacts are enabled.

Performance:

- Keep detection marker-based.
- Avoid whole-document YAML unmarshalling for sniffing when marker scanning is enough.
- Reuse schema rendering caches and existing mock limits.
- Do not duplicate graph walks unnecessarily.
- Add benchmark or allocation checks if AsyncAPI collection introduces repeated schema rendering or repeated hash work.

## Acceptance Criteria

- Existing OpenAPI Printing Press tests remain green.
- Existing OpenAPI HTML, JSON, LLM, diagnostics, aggregate, and hosted artifact behavior remains stable.
- Spec kind is represented by one typed public contract and central helper/accessor surface, not raw string branching.
- Spec-kind detection returns kind and version so unsupported AsyncAPI 2.x can be rejected before libopenapi parsing.
- AsyncAPI 3.x single-spec docs render HTML, JSON artifacts, hosted manifests, and LLM outputs.
- AsyncAPI generated docs work in portable, served, embedded, and shared-asset modes.
- AsyncAPI operations are operation-first and show action/channel/message context.
- Referenced/named channels and messages are first-class model pages; inline models render in place.
- Message payload/header schemas render with examples/mocks where possible.
- AsyncAPI-only security schemes and AsyncAPI message example objects render correctly.
- AsyncAPI diagnostics from Vacuum reports attach to the correct pages and show counts/snippets/drawers.
- Diagnostics copy is not OpenAPI-specific when rendering AsyncAPI.
- Aggregate catalogs discover and render mixed OpenAPI/AsyncAPI services.
- Mixed catalog entries show `OpenAPI` / `AsyncAPI` badges.
- Aggregate JSON and LLM outputs include spec kind for every entry.
- AsyncAPI 2.x fails clearly for single-spec renders and is omitted from aggregate catalogs with a clear warning.
- Source links and line numbers remain meaningful for single-file and multi-file docs.
- Focused explorer and cross refs work for schemas/messages/channels/operations.
- The real `../printing-press` CLI proves the local Doctor and libasyncapi integration through a `go.work`.
- Generated templ and UI bundle artifacts are current.

## Risks and Watch Points

- Doctor `DrDocument` graphing is OpenAPI-specific. Do not stretch it to AsyncAPI; use adapters.
- `pressSite()` is currently an OpenAPI orchestration function, not just a collector. Splitting it incorrectly can leave hidden HTTP behavior in AsyncAPI output.
- Diagnostics currently use OpenAPI Doctor result types and OpenAPI owner matching. A neutral Printing Press diagnostics layer is required if AsyncAPI cannot produce Doctor `Foundational` owners.
- AsyncAPI source/origin parity depends on libasyncapi exposing enough low-level node and rolodex detail.
- libasyncapi's walker visits unresolved `*low.Reference` leaves for operation/channel/message refs; graphing requires target resolution beyond a basic tree walk.
- Raw schema rendering and mock generation can be reused, but message payload/header schema extraction must avoid duplicate render/mock work.
- Only raw render/mock portions of the schema pipeline are direct reuse; registry, ref-popovers, JSON paths, cross refs, graph, and Mermaid need neutral adapters.
- Raw/schema artifact caches can collide if inline AsyncAPI message schemas are keyed like OpenAPI component schemas.
- Hydration metadata can silently keep HTTP assumptions even when templates are branched correctly.
- Aggregate fast mode must include spec kind in hashes and persisted state to prevent stale OpenAPI/AsyncAPI reuse.
- Aggregate discovery must not add unsupported AsyncAPI 2.x to catalog/state.
- CLI report hydration currently defaults to OpenAPI rules; AsyncAPI report metadata must remain first-class.
- Doctor and libasyncapi currently depend on different libopenapi versions; prove local workspace behavior before relying on shared schema proxy types.
- Forgetting generated templ/UI assets will produce green Go model tests with stale browser output.

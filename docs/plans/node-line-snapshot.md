# Node-line snapshot optimization

Build on the JSONPath optimization (Doctor e55b7b2). Add GetNodeLines to libopenapi
NodeMap without changing HasNodes, GetNodes, or NodeLines.Range. Snapshot current
valid node-valued keys under the existing lock; return an owned unordered slice.
Preserve typed nil entries and the synthetic line 0 for empty/invalid-only maps.
No cache, callback under lock, or retained scratch state.

Doctor uses the optional method only for known concrete libopenapi model types.
Custom types, including wrappers overriding GetNodes, retain the legacy path.
Doctor continues compiling against its existing dependency; the fast path activates
when linked with the additive upstream API. Do not commit local module replacements.

Validate mutation, snapshots, nil/invalid values and concurrent access upstream.
Validate both Doctor paths, custom overrides and source-domain behavior downstream.
Run full suites, focused races, and performance review before committing.

Use identical libopenapi v0.41.6 baselines on both sides of paired benchmarks, with
five alternating rounds on all six speed-test specs. Check exact real-spec paths,
locations and graph signatures in both canonical and graph modes. Also check
Doctor against its committed dependency to prove fallback compatibility.

Vacuum: isolated origin/main 92c29d0b, identical dependency graphs except local
Doctor/libopenapi replacements; rule-engine suites and all six diagnostic reports.
Bunkhouse: isolated origin/main 096442a4; preserve dirty dev checkout. Verify
shared linting, graph creation, report serialization, model location behavior,
and service builds. Distinguish local compatibility from deployment/release proof.

# Deploy Audit: Tree Fidelity Source, Build and Pages Fixture Gate

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

The new Node contract test validates constants and source data only. Deployment proof must cover module loading, browser capture, IndexedDB caching, startup readiness, package adoption and a visible package-bound frame.

## Plan ledger

**Goal:** prove the same tree-fidelity generation is prepared, adopted and presented from source, staged output and the deployed Pages origin.

- [x] Inspect current test coverage.
- [x] Identify browser-only provider and cache behavior.
- [x] Define fixture gates.
- [ ] Execute the gates.

## Current proof

```txt
bundle/provider/manifest IDs: asserted
five archetypes: asserted
frozen six-field type tuples: asserted
pinned Nexus commit: asserted
npm test includes source contract: present
browser bundle request: not proven
capture provider output: not proven
IndexedDB cache hit: not proven
startup readiness: not proven
live package adoption: not proven
visible frame binding: not proven
build/Pages parity: not proven
```

## Required source fixture

```txt
request the bundle with a deterministic capture provider
inspect manifest and five package payloads
validate near/medium/far/horizon forms
validate frame counts and atlas metadata
validate cancellation and provider failure
validate cache miss then cache hit
```

## Required live-browser fixture

```txt
open menu
observe background progress and cache settlement
navigate to game
observe required preparation settlement
assert adopted package digest in runtime diagnostics
force near, medium, far and horizon selections
assert FirstTreeFidelityBoundFrameAck
exit route and assert resource retirement
```

## Required parity fixture

Run the same browser fixture against:

```txt
source development server
staged/static artifact
GitHub Pages origin
```

The gate passes only when bundle, manifest, package, patch-binding, render-generation and frame-ack identities match across all three surfaces.

## Non-claims

No browser capture, IndexedDB, startup, adoption, rendered-form, artifact or deployed-origin fixture was executed by this documentation audit.
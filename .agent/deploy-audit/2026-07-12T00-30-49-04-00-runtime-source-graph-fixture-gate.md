# Deploy Audit: Runtime Source Graph Fixture Gate

**Timestamp:** `2026-07-12T00-30-49-04-00`

## Plan ledger

**Goal:** block runtime/deployment readiness claims until local and deployed pages prove one admitted source graph and active provider set.

- [x] Define pure manifest and parity fixtures.
- [x] Define browser import-map and provider fixtures.
- [x] Define first-frame provenance requirements.
- [ ] Implement and run the gates.

## Required fixtures

```txt
runtime manifest canonicalization and fingerprint
HTML import-map parity for game.html and charactercreator.html
required module unavailable rejection
required export missing rejection
incompatible Nexus/Kits graph rejection
Rapier admitted provider result
Rapier unavailable explicit fallback result
no engine/Worker/renderer/RAF/public-host publication after rejection
first frame sourceGraphFingerprint parity
public diagnostics deep-detached admission result
GitHub Pages import-map and first-frame smoke
```

## Acceptance

```txt
one graph fingerprint across manifest, loader, engine composition and frame
no silent required-module degradation
no silent physics-provider change
rejected startup leaves no recurring work or public mutable owners
local and Pages proofs report the same immutable refs and provider selection
```

## Current state

No runtime-source-graph fixture, browser parity smoke or deployed first-frame provenance gate exists. No deployment-readiness claim is made.
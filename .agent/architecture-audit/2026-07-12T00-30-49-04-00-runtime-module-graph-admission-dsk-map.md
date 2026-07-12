# Architecture Audit: Runtime Module Graph Admission DSK Map

**Timestamp:** `2026-07-12T00-30-49-04-00`

## Plan ledger

**Goal:** place source identity, import-map parity, export compatibility, optional-provider policy and startup evidence under one parent authority without duplicating existing engine or product state.

- [x] Reuse current runtime constants and HTML import maps as inputs.
- [x] Reuse existing factory checks as module-specific contract evidence.
- [x] Preserve lifecycle, outcome, streaming, physics and rendering ownership.
- [x] Add only graph admission and provenance coordination.
- [ ] Implement and fixture the authority.

## Parent domain

```txt
prehistoric-rush-runtime-module-graph-admission-domain
```

## DSK composition

```txt
runtime-module-manifest-kit
  -> canonical entries for Nexus Engine, Kits, ProtoKits, Three and Rapier

runtime-module-entry-kit
  -> id, source URL, immutable ref/version, required/optional role

import-map-parity-kit
  -> compares HTML bare-specifier resolution with manifest entries

module-load-result-kit
  -> loaded, unavailable, rejected or failed result with source evidence

module-export-contract-kit
  -> required factories, namespaces and adapter entry points

module-compatibility-policy-kit
  -> accepted combinations and policy version

runtime-source-graph-fingerprint-kit
  -> canonical hash of admitted entries, contracts and provider choices

runtime-source-graph-admission-kit
  -> accepts one graph or rejects startup before authority transfer

optional-capability-policy-kit
  -> explicit degraded-mode decisions

physics-provider-admission-kit
  -> Rapier admitted, fallback admitted or startup rejected

runtime-source-graph-observation-kit
  -> immutable public read model

runtime-source-graph-journal-kit
  -> bounded admission and rejection rows

runtime-source-graph-fixture-kit
browser-import-map-smoke-kit
  -> pure and browser proof
```

## Ownership boundary

The new domain does not own engine state, run state, physics stepping, patch generation, camera state or rendering. It owns the evidence that the providers allowed to create those owners are the one accepted graph.

## Admission flow

```txt
read canonical manifest
  -> resolve HTML import-map entries
  -> load detached module candidates
  -> verify exact source identity where observable
  -> validate required export contracts
  -> apply compatibility and optional-capability policy
  -> select active physics provider
  -> compute sourceGraphFingerprint
  -> atomically publish RuntimeGraphAdmissionResult
  -> permit engine composition and first-frame startup
```

## Failure rule

A rejected required module graph must not create the engine, Worker, renderer, listeners, RAF or public host. A degraded optional provider must publish a typed capability result; it must not silently change collision semantics.
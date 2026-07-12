# Architecture Audit: Shard Collection Authority DSK Map

**Timestamp:** `2026-07-12T03-51-15-04-00`

## Summary

Shard generation, active-patch projection, collection mutation and visible removal are currently split across the patch generator, patch controller, Three adapter, product domain, HUD and public host. No parent domain owns their shared identity, admission, result or frame evidence.

## Plan ledger

**Goal:** define one DSK composition that makes shard identity, active membership, spatial evidence, exactly-once award and visible removal explicit.

- [x] Map current owners and services.
- [x] Identify missing contracts and authority boundaries.
- [x] Define candidate kits and dependency order.
- [ ] Implement the parent domain and fixtures.

## Current ownership map

```txt
prehistoric-patch-generator
  -> deterministic pickup descriptors
  -> ID `${chunkX}:${chunkZ}:${index}`

seeded-world-patch-controller-kit
  -> cache, active membership, ready/release delivery

active-content adapter in src/game.js
  -> derives mutable view.pickups
  -> creates instanced shard matrices

prehistoric-rush-domain-kit
  -> collectedShardIds
  -> shard count
  -> ShardCollected event
  -> collectShard(id) boolean

browser frame loop
  -> XZ proximity check
  -> collectShard
  -> refreshDynamicContent
  -> render and HUD

PrehistoricRushHost
  -> raw engine and subsystem ownership
  -> detached shard result unavailable
```

## Missing parent domain

```txt
prehistoric-rush-shard-collection-authority-domain
```

## Candidate DSKs

```txt
identity and source
  shard-descriptor-schema-kit
  shard-identity-kit
  shard-source-fingerprint-kit

active membership
  active-shard-index-kit
  active-shard-set-revision-kit
  shard-patch-membership-admission-kit

command and evidence
  shard-collection-command-kit
  shard-collection-command-id-kit
  shard-collection-evidence-kit
  shard-run-phase-admission-kit
  shard-spatial-admission-kit

commit and idempotency
  shard-collection-idempotency-kit
  shard-collection-state-revision-kit
  shard-collection-commit-kit
  shard-collection-result-kit
  shard-collected-event-envelope-kit

presentation and observation
  shard-removal-projection-kit
  shard-projection-result-kit
  shard-frame-acknowledgement-kit
  shard-observation-kit
  shard-journal-kit

compatibility and proof
  legacy-collect-shard-adapter-kit
  unknown-shard-fixture-kit
  vertical-separation-fixture-kit
  stale-patch-shard-fixture-kit
  duplicate-collection-fixture-kit
  terminal-collection-fixture-kit
  shard-visible-frame-smoke-kit
```

## Required dependency flow

```txt
committed patch activation
  -> canonical active shard index and set revision
  -> shard collection command admission
  -> authoritative player/shard evidence capture
  -> 3D spatial policy
  -> exactly-once state/event commit
  -> shard/HUD projection results
  -> first visible-frame acknowledgement
  -> detached observation and bounded journal
```

## Required invariants

```txt
one canonical identity maps to one admitted descriptor
identity includes source/generator and patch provenance
only active-gameplay commands may collect
only active admitted descriptors may collect
player and descriptor evidence come from one revision
accepted identity awards at most once per run
unknown and stale IDs perform zero mutation
state count and collected ledger commit together
projection consumes a committed result rather than rescanning mutable owners
visible shard absence and HUD count cite the same result
```

## Placement in implementation order

```txt
Patch Activation and Release Commit Authority
  -> Shard Collection Authority
  -> Collider Admission
  -> Run-Step Outcome Arbitration
  -> Committed Gameplay Frame
```

The shard domain must consume patch activation receipts and feed the later run-step/frame authorities.
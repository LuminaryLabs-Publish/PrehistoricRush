# Architecture Audit: World Readiness and Movement Admission DSK Map

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

The host currently treats streaming as a post-simulation side effect. This audit defines a parent domain that composes existing route, patch, collision, render and frame owners into a single readiness decision before movement is committed.

## Plan ledger

**Goal:** extend existing DSKs with readiness contracts instead of introducing a second world streamer or movement loop.

- [x] Map current producers and consumers.
- [x] Identify missing readiness identities and results.
- [x] Define the parent domain and kit boundaries.
- [x] Preserve patch activation, collider and frame authority as prerequisites.
- [ ] Implement only after the prerequisite transactions exist.

## Current ownership

```txt
prehistoric-rush-domain-kit
  owns run state, input, movement, route progress and height-sampler call

seeded-world-patch-controller-kit
  owns desired patch membership, generation queue, cache and delivery

prehistoric-patch-generator / Worker
  own deterministic patch descriptors

active-content consumer adapter
  owns terrain, tree, grass, pickup, collider and height projections

rapier-physics-domain-kit
  owns fixed-collider runtime and contact production

Three adapter
  owns visible patch consumers and final scene submission
```

## Missing parent domain

```txt
prehistoric-rush-world-readiness-movement-authority-domain
```

## DSK map

```txt
required-travel-corridor-kit
  inputs: position, yaw, speed, dt, route samples, safety horizon
  output: required patch IDs and corridor fingerprint

patch-readiness-revision-kit
  binds generated patch identity to active controller membership

height-source-readiness-kit
  proves authoritative patch height coverage for the corridor

collision-source-readiness-kit
  proves collider descriptor and Rapier membership coverage

render-source-readiness-kit
  proves terrain/tree/grass consumer installation

pickup-source-readiness-kit
  proves pickup projection for the admitted run and patch revision

world-readiness-plan-kit
  combines required IDs, expected revisions and consumer requirements

world-readiness-result-kit
  returns ready, degraded, deferred or failed with reasons

movement-admission-kit
  admits full movement only against an accepted readiness result

movement-defer-policy-kit
  defines hold/freeze behavior when required content is unavailable

movement-speed-cap-policy-kit
  defines bounded slowdown before the readiness frontier

world-readiness-commit-kit
  binds movement, physics and render consumption to one revision

world-readiness-journal-kit
  records plans, results, transitions and rejected stale evidence

world-readiness-observation-kit
  publishes detached diagnostics and committed readiness state

stream-latency-fixture-kit
  injects delayed, reordered, failed and duplicate patch delivery

world-readiness-frame-parity-fixture-kit
  proves movement, collision and visible frame share a revision
```

## Required authority sequence

```txt
frame command
  -> predict corridor
  -> resolve required patch IDs
  -> prepare/activate missing patches through existing controller authority
  -> collect terrain/height/collider/pickup/render receipts
  -> classify readiness
  -> admit, cap or defer movement
  -> simulate movement against admitted revision
  -> step physics against matching collider revision
  -> submit scene and HUD carrying the same revision
  -> commit frame record
```

## Dependency order

```txt
1. Route Manifest + Profile Handoff Authority
2. Patch Activation / Release Commit Authority
3. Exact Collider Replacement + Collision Admission
4. World Readiness + Movement Admission Authority
5. Committed Frame Observation + Host Read Model
6. Run / Stream / Collider / Worker / Frame Epoch Reset Authority
7. Runtime Lifecycle + Ordered Disposal
```

## Non-goals

```txt
do not create a second route generator
do not create a second patch controller
do not duplicate height generation
do not bypass Rapier with a new collision system
do not block indefinitely on every retained or prefetched patch
do not treat fallbackHeight as authoritative without a typed degraded policy
```

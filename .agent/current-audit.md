# PrehistoricRush Current Audit

**Timestamp:** `2026-07-13T21-38-52-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `patch-owned-streaming-adoption-authority-central-reconciled`  
**Technical status:** `patch-owned-streaming-adoption-authority-audited`

## Summary

The active streaming consumer now has explicit patch ownership for terrain, grass, shards, colliders and pickups, while tree, grass and shard instances use stable per-cell ranges and changed-range GPU uploads.

The current gap is the boundary between controller membership and consumer adoption. Ready membership is committed before adapter work begins, release intent is cleared before retirement completes, and neither path returns a typed result or rollback receipt.

## Plan ledger

**Goal:** make each patch activation and release atomic across controller membership, terrain, instance cells, collision, pickups and visible presentation.

- [x] Reconcile the full Publish inventory and central ledger.
- [x] Select only PrehistoricRush as one commit ahead.
- [x] Inspect the runtime diff, extracted adapter, pinned official kits, tests and package wiring.
- [x] Identify the complete interaction loop and active domains.
- [x] Update the inventory to 59 implemented surfaces.
- [x] Define the patch-owned streaming adoption authority.
- [x] Add the timestamped audit family and refresh root projections.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement and execute transactional streaming fixtures later.

## Interaction loop

```txt
runtime boot
  -> create deterministic patch generator and optional Worker executor
  -> create patch controller with bounded generation and activation budgets
  -> create stable-range tree, grass and shard batches
  -> create Three patch-stream adapter and prime center patch

frame
  -> engine.tick(dt)
  -> update only affected pickup cells
  -> controller updates desired membership
  -> adapter releases departed patch ownership
  -> controller pumps generation
  -> adapter activates bounded ready patches
  -> render world and diagnostics
```

## Domains in use

```txt
browser boot, provider admission, DOM, resize, RAF and lifecycle
browser gameplay and pause-menu input admission
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation and Motion
articulated dynamics and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
product run, route, surface, score, outcome, player pose and terrain IK
product pause-menu semantics and browser projection
profile persistence and player-character composition
seeded patch focus, generation, cache, activation and release
stable-range instance-cell ownership and changed-range flush
patch-owned terrain, trees, grass, shards, colliders, pickups and height sampling
Rapier physics and Three.js presentation
validation, build and Pages deployment
```

## Implemented state

```txt
full active-world rebuild removed: yes
patch-owned active map: yes
patch-owned grass map: yes
patch-owned shard map: yes
patch-owned collider map: yes
patch-owned pickup map: yes
stable tree ranges: yes
stable grass ranges: yes
stable shard ranges: yes
changed-range GPU uploads: yes
pickup-only shard refresh: yes
collider sync isolated to membership changes: yes
ownership diagnostics: yes
static authority test in npm test: yes
```

## Current gaps

```txt
PatchActivationId and PatchReleaseId: absent
controller revision bound to adapter work: absent
patch key retained by adapter: absent
prepare/commit/rollback: absent
typed activation and release results: absent
controller rollback after adapter failure: absent
terrain-slot capacity result: absent
explicit overflow/degradation policy: absent
physics cell-diff result: absent
first matching visible patch frame ack: absent
Worker/WebGL/Rapier fault fixtures: absent
```

## Required authority

```txt
prehistoric-rush-patch-owned-streaming-adoption-authority-domain
```

```txt
ready candidate
  -> validate patch key and desired membership
  -> reserve mandatory consumer capacity
  -> prepare terrain, instance, physics and pickup candidates
  -> commit controller and consumers together
  -> publish PatchActivationResult
  -> publish PatchVisibleFrameAck
  -> otherwise restore the predecessor

release intent
  -> retain intent until retirement settles
  -> commit controller and consumers together
  -> publish PatchReleaseResult
  -> fence late predecessor callbacks
```

## Current output

See `.agent/trackers/2026-07-13T21-38-52-04-00/project-breakdown.md` and its linked audit family.

## Validation

Documentation only. Runtime source was not changed by this audit. GitHub reported no combined status checks for the reviewed runtime commit. No executable runtime, browser, Worker, GPU, physics, build or Pages fixture was run.

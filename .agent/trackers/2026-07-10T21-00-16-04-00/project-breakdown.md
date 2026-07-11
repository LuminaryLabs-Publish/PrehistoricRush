# Project Breakdown: PrehistoricRush

**Run:** `2026-07-10T21-00-16-04-00`

## Goal

Reconcile the complete Publish inventory with central tracking, select one eligible repository, and document the current interaction loop, domains, kits, services, render surface, gameplay authority, and deployment/source-contract risks without changing runtime behavior.

## Plan ledger

- [x] List the complete accessible `LuminaryLabs-Publish` installation.
- [x] Exclude `TheCavalryOfRome`.
- [x] Compare every eligible repository with `LuminaryLabs-Dev/LuminaryLabs/repo-ledger`.
- [x] Confirm root `.agent` coverage from the ledger and selected repository.
- [x] Select only the oldest eligible repository.
- [x] Inspect the current route entrypoint and runtime composition.
- [x] Identify the full interaction loop.
- [x] Identify all active runtime domains.
- [x] Identify active, inactive, and external kits.
- [x] Record services offered by each active kit.
- [x] Inspect the Pages deployment workflow.
- [x] Compare deployed JSON declarations with live runtime consumption.
- [x] Refresh required root `.agent` files.
- [x] Add timestamped architecture, render, gameplay, interaction, source-contract, and deploy audits.
- [x] Prepare central ledger and internal change-log synchronization.
- [x] Create no branch or pull request.
- [x] Change no runtime source.

## Inventory and selection

```txt
AetherVale
HorrorCorridor
IntoTheMeadow
MyCozyIsland
PhantomCommand
PrehistoricRush
TheCavalryOfRome
TheOpenAbove
TheUnmappedHouse
ZombieOrchard
```

All nine eligible non-Cavalry repositories were tracked. `PrehistoricRush` had the oldest prior ledger timestamp at `2026-07-10T19-30-36-04-00`.

## Interaction loop

```txt
browser entry
  -> runtime entry module
  -> direct game composer
  -> local domain construction
  -> external module admission
  -> scene/terrain/instance/physics mount
  -> deterministic population attempt
  -> button and keyboard input
  -> one simulation/presentation/render RAF
  -> collision, pickup, run-over, or win
  -> partial retry
  -> mutable host readback
```

## Active kits and services

```txt
route-field-domain-kit
  control points, spline samples, nearest query, region classification, snapshot

surface-traversal-domain-kit
  surface multipliers, smoothed update, state, snapshot

forest-archetype-domain-kit
  five archetypes, lookup, snapshot

grass-patch-domain-kit
  layer descriptors, route exclusion/scale, snapshot

grass-wind-domain-kit
  gust update, wind state, snapshot

procedural-dino-body-domain-kit
  skinned body, skeleton, weights, procedural pose, descriptor, snapshot

Three.js
  scene graph, geometry, instancing, skinning, lights, camera, fog, renderer

Rapier and rapier-physics-domain-kit
  physics initialization, actor, fixed colliders, transforms, step, contacts
```

## Main finding

The Pages artifact deploys a configuration and composition surface that the active route does not read. `src/game.js` is the real source of tuning, scene transitions, and composition. The deployed declarations disagree with it on movement values, terrain dimensions, NexusEngine usage, core-kit composition, and scene authority.

## Current and follow-on gates

```txt
current:
  instance pool capacity authority
  deterministic population fixture

follow-on:
  runtime source contract reconciliation
  deployed artifact fixture
```

## Runtime changes

```txt
runtime source: unchanged
dependencies: unchanged
routes: unchanged
workflow behavior: unchanged
branch: none
pull request: none
```

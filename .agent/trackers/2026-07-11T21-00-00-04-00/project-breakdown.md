# Project Breakdown: PrehistoricRush Character Creator Authority

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

`PrehistoricRush` was selected because character creator UX and framing changes landed after the previous central audit. The creator now has a real generator-backed SkinnedMesh and shared game/preview adapter, but draft persistence, preview transition status and viewport framing still lack one committed authority.

## Plan ledger

**Goal:** document one creator transaction from control input through durable profile commit, procedural descriptor application, camera fit, visible frame and game handoff.

- [x] Compare ten Publish repositories against central ledgers.
- [x] Confirm nine eligible repositories have root `.agent` state.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` due recent undocumented creator runtime changes.
- [x] Read creator page, profile schema/store, transition, shared Three adapter, page hosts and game admission.
- [x] Identify interaction loops, domains, kits and services.
- [x] Record concrete draft-loss, premature-Ready and framing failure paths.
- [x] Define proposed DSK/domain boundary and fixture gate.
- [x] Change documentation only.
- [ ] Implement and execute the proposed authority.

## Repository comparison

```txt
LuminaryLabs-Publish/IntoTheMeadow      tracked, root .agent present
LuminaryLabs-Publish/HorrorCorridor     tracked, root .agent present
LuminaryLabs-Publish/AetherVale         tracked, root .agent present
LuminaryLabs-Publish/ZombieOrchard      tracked, root .agent present
LuminaryLabs-Publish/TheUnmappedHouse   tracked, root .agent present
LuminaryLabs-Publish/MyCozyIsland       tracked, root .agent present
LuminaryLabs-Publish/TheOpenAbove       tracked, root .agent present
LuminaryLabs-Publish/PhantomCommand     tracked, root .agent present
LuminaryLabs-Publish/PrehistoricRush    tracked, root .agent present, recent creator changes selected
LuminaryLabs-Publish/TheCavalryOfRome   excluded
```

## Interaction loops

```txt
menu -> saved profile summary -> creator or game

creator input
  -> local draft merge
  -> immediate descriptor target
  -> previous timer cancelled
  -> latest partial patch captured
  -> preview RAF morphs and renders
  -> timer reloads storage and commits only captured patch

game
  -> load committed profile
  -> product kit graph
  -> procedural descriptor
  -> shared Three SkinnedMesh
  -> Rapier collision recommendation
```

## Domains in use

```txt
routing and static hosts
profile schema, persistence and cross-context sync
creator draft and debounce scheduling
procedural creature generation
shared Three creature adaptation
preview transition and framing
run simulation and scene transitions
patch generation and streaming
render consumers and Rapier physics
camera, HUD, diagnostics and deployment
```

## Implemented kits and services

```txt
12 Nexus Engine core kits
  input, spatial, scene, physics, motion, camera, animation, graphics,
  skybox, UI, diagnostics and composition

5 official NexusEngine-Kits
  seed, procedural creature body, instanced batch,
  seeded patch controller and smooth camera follow

12 product/page/Worker kits
  product run domain, profile schema/store, menu, creator page,
  preview transition, Three creature adapter, game entry, route generator,
  player preset, patch generator and patch Worker

8 host/external boundaries
  Three, Rapier, Rapier kit, Worker executor, active-content adapter,
  inline creator framing, inline creator persistence scheduler,
  creature/camera/render host adapters
```

## Findings

```txt
rapid edits across groups can lose all but the final captured patch
unsaved descriptor changes reuse the durable profile revision
Ready can appear before geometry convergence
Saved is not tied to a visible frame
camera fit ignores horizontal FOV and viewport aspect
bounds are local bind-pose geometry, not posed skinned world bounds
crossfade union bounds and screen margins are not proven
```

## Required parent domain

```txt
prehistoric-rush-character-creator-authority-domain
```

It owns draft revisions, dirty fields, full-draft flush, profile results, descriptor identity, transition result, posed bounds, projection fit, viewport revision, preview-frame commit and Saved/Ready parity.

## Output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/turn-ledger/2026-07-11T21-00-00-04-00.md
.agent/architecture-audit/2026-07-11T21-00-00-04-00-character-creator-draft-frame-dsk-map.md
.agent/render-audit/2026-07-11T21-00-00-04-00-projection-correct-preview-framing-gap.md
.agent/gameplay-audit/2026-07-11T21-00-00-04-00-edit-preview-save-play-loop.md
.agent/interaction-audit/2026-07-11T21-00-00-04-00-control-draft-save-profile-result-map.md
.agent/character-creator-audit/2026-07-11T21-00-00-04-00-draft-commit-preview-frame-contract.md
.agent/deploy-audit/2026-07-11T21-00-00-04-00-character-creator-fixture-gate.md
```

## Validation boundary

No runtime code, dependency, workflow or deployment file was changed. Browser and Pages fixtures remain unavailable and unexecuted.
# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-11T21-00-00-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a saved procedural raptor, a real Three.js character creator, deterministic patch streaming, Rapier collision, gameplay rendering, HUD projection and Pages deployment.

The latest runtime now includes `game.html`, `charactercreator.html`, shared creature rendering, a condensed centered creator UI, damped live morphing and automatic camera reframing. The current documentation ledge is the missing **character creator draft, commit and preview-frame authority**.

## Plan ledger

**Goal:** preserve every creator edit and make Saved, Ready, camera framing and game handoff refer to one committed profile and one acknowledged visible frame.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all eligible repositories have central ledgers and root `.agent` state.
- [x] Select only `PrehistoricRush` because new creator runtime work postdated its previous audit.
- [x] Trace edit, draft, debounce, profile write, preview transition, viewport fit, rendering and game handoff.
- [x] Identify all domains, kits and offered services.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only on `main`.
- [ ] Implement creator authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-11T21-00-00-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-11T21-00-00-04-00-character-creator-draft-frame-dsk-map.md
.agent/render-audit/2026-07-11T21-00-00-04-00-projection-correct-preview-framing-gap.md
.agent/gameplay-audit/2026-07-11T21-00-00-04-00-edit-preview-save-play-loop.md
.agent/interaction-audit/2026-07-11T21-00-00-04-00-control-draft-save-profile-result-map.md
.agent/character-creator-audit/2026-07-11T21-00-00-04-00-draft-commit-preview-frame-contract.md
.agent/deploy-audit/2026-07-11T21-00-00-04-00-character-creator-fixture-gate.md
.agent/turn-ledger/2026-07-11T21-00-00-04-00.md
.agent/kit-registry.json
```

## Current creator loop

```txt
control edit
  -> merge partial patch into local draft
  -> update generator-backed preview immediately
  -> cancel previous 160 ms save timer
  -> schedule final timer with only the latest partial patch

preview frame
  -> damp geometry, color, scale and pose
  -> compute local bind-pose geometry bounds
  -> choose camera distance from max span * 1.9
  -> render
  -> infer Ready from stored profile revision equality

save timer
  -> reload stored profile
  -> merge only latest captured patch
  -> write and broadcast new profile revision
  -> replace local draft with stored result
```

## Main findings

### Rapid edits can be lost

```txt
Size edit schedules proportions patch
Skin edit cancels it and schedules material patch
material patch commits against old stored proportions
returned stored profile replaces draft
Size edit reverts
```

### Ready can be premature

Unsaved draft edits retain the stored profile revision. `targetRevision` can therefore equal `appliedRevision` while mesh vertices are still damping toward a different descriptor.

### Framing is not projection-correct

The camera uses a local geometry box and scalar span heuristic. It does not account for viewport aspect, horizontal FOV, skinned pose extents, world rotation, topology-crossfade union bounds or screen-space margins.

## Domains in use

```txt
page routes and static hosts
player profile schema, storage and cross-context sync
creator local draft, controls and debounce scheduler
procedural creature descriptor generation
shared Three.js creature mesh, pose, damping and disposal
preview morph/crossfade transition
preview viewport, resize, camera fit and render loop
run simulation and scene transitions
seeded world patch streaming and Worker generation
terrain, trees, grass, pickups, colliders and height projection
Rapier physics, collision and terminal admission
camera follow, gameplay rendering, HUD and diagnostics
validation and Pages deployment
```

## Implemented kit groups

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
8 external or host adapter boundaries
```

See `.agent/current-audit.md` and `.agent/kit-registry.json` for every kit and service.

## Required parent domain

```txt
prehistoric-rush-character-creator-authority-domain
```

It must coordinate:

```txt
draft identity and revision
dirty-field accumulation and full-draft flush
profile predecessor validation and write result
descriptor fingerprint and transition result
posed/world-space bounds
horizontal and vertical projection fit
viewport revision and camera margin
preview frame commit
Saved/Ready visible parity
creator/game profile fingerprint parity
```

## Ordered implementation queue

```txt
1. Route Artifact and Game Profile Handoff final proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation / Release Commit Authority
4. Exact Collider Replacement + Collision Admission
5. Stream Cadence + Time Budget Authority
6. World Readiness + Movement Admission
7. Committed Gameplay Frame + Host Read Model
8. Run / Stream / Collider / Worker / Frame Epoch Reset
9. Runtime Lifecycle + Ordered Disposal
```

## Next safe ledge

```txt
PrehistoricRush Character Creator Authority
+ Rapid Multi-Group Edit, Saved/Ready and Viewport-Fit Fixture Gate
```

Extend the existing profile store, preview transition and shared Three adapter. Do not add a second profile store, creature generator, preview RAF or rendering adapter.
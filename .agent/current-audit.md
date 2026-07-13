# PrehistoricRush Current Audit

**Timestamp:** `2026-07-13T00-49-53-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `game-viewport-render-surface-authority-audited`  
**Retained audits:** articulated pose presentation; run-start/restart reconciliation

## Summary

The game surface is initialized and resized through direct browser-global reads and Three.js mutations. The camera and renderer do not consume one measured, revisioned viewport result, DPR is not refreshed after startup, and public readback cannot identify the CSS size, drawing-buffer size, DPR or camera aspect that produced the visible frame.

## Plan ledger

**Goal:** make one viewport revision authoritative from host measurement through camera and WebGL application to first visible frame.

- [x] Trace shell, host, camera, renderer, DPR and resize code.
- [x] Preserve all domains, 45 surfaces and offered services.
- [x] Define measurement, policy, admission, commit, rollback and frame proof.
- [x] Add timestamped architecture and system audits.
- [x] Preserve articulated-pose and run-start audits.
- [ ] Implement and execute later.

## Complete interaction loop

```txt
page boot -> module preflight -> engine/kits/profile/physics/streaming/renderer construction
startup surface -> camera(innerWidth/innerHeight) -> setSize -> startup-only setPixelRatio
RAF -> input -> engine tick -> streaming -> camera/pose/render -> HUD -> successor RAF
resize -> camera aspect/projection -> renderer size -> no DPR refresh or result
```

## Main findings

```txt
actual host measurement: absent
viewport command/revision: absent
DPR refresh after startup: absent
pixel-budget policy: absent
positive/zero-size admission: absent
camera + renderer atomic commit: absent
rollback/predecessor retention result: absent
viewport state in public readback: absent
first visible viewport frame acknowledgement: absent
```

## Domains in use

```txt
browser entry, module admission, profile binding, input and run lifecycle
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion and articulated dynamics
Rapier bodies, colliders, motion requests and frames
procedural creature body, rig, pose, skinning and Three skeleton presentation
seeded patch Worker, queue, cache, activation, terrain, vegetation, pickups and collisions
camera follow, WebGL renderer, lighting, shadows, HUD and public diagnostics
viewport measurement, DPR policy, pixel budget, resize admission and visible-frame proof
validation, build and Pages deployment
```

## Required authority

```txt
prehistoric-rush-game-viewport-surface-authority-domain
```

```txt
ViewportChangeCommand
  -> validate session/surface/predecessor
  -> measure host CSS box
  -> sample DPR under explicit cap and pixel budget
  -> reject/defer invalid, zero, stale and duplicate candidates
  -> prepare camera and drawing-buffer state
  -> commit one ViewportSurfaceCommitResult
  -> apply during render admission
  -> publish FirstViewportFrameAck
```

## Current output

See `.agent/trackers/2026-07-13T00-49-53-04-00/project-breakdown.md` and its linked audit family.

## Validation

Documentation only. No runtime or deployment behavior changed and no viewport fixture was run.
# Project Breakdown: PrehistoricRush Smooth Camera Consumption

**Timestamp:** `2026-07-11T05-39-11-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Change type:** documentation only

## Summary

This pass reconciles the runtime after `camera-smooth-follow-kit` was added. The shared kit correctly owns persistent position/look velocities and quaternion damping. The missing product boundary is a typed, traceable path from run/route/height state to target descriptor, controller result, applied Three transform and rendered frame.

## Plan ledger

**Goal:** Fully describe the camera integration, preserve all existing kit ownership, and define deterministic proof work without changing runtime behavior.

- [x] Inventory all accessible Publish repositories.
- [x] Compare eligible repositories against the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` due newer undocumented camera commits.
- [x] Inspect pinned module graph.
- [x] Inspect game/domain interaction loop.
- [x] Inspect upstream camera kit services and boundary.
- [x] Catalogue all domains, kits and services.
- [x] Audit target policy, controller state, transform application, render correlation and lifecycle.
- [x] Define fixture and deployment gates.
- [x] Refresh root `.agent` routing files.
- [ ] Runtime implementation remains future work.

## Repository comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
eligible central ledger entries: 9
eligible root .agent state: 9
selected repository: PrehistoricRush
selection trigger: runtime camera integration newer than prior audit
```

## Interaction loop

```txt
input
  -> run simulation
  -> route index/yaw/player position
  -> patch streaming and active height sources
  -> target position/look-point derivation
  -> smooth-follow reset or update
  -> Three camera transform application
  -> world render
  -> HUD and host snapshot
  -> next RAF
```

## Complete domain map

```txt
source/module admission
core input/spatial/scene/physics/motion/camera/animation/graphics/skybox/UI/diagnostics/composition
deterministic seed
procedural creature descriptors and poses
instanced render batches
seeded patch streaming
product patch generation and Worker execution
terrain/vegetation/pickup/collider/height consumption
run/route/surface/score/outcome
camera target policy
camera smooth position/look/rotation/reset
Three camera application and render
browser interaction/RAF/HUD/readback
session lifecycle and deployment validation
```

## Kit/service catalogue

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
5 product/local kits
3 external runtime/physics surfaces
14 host-implied adapter/consumer responsibilities
7 proposed camera proof/lifecycle responsibilities
```

See `.agent/current-audit.md` and `.agent/kit-registry.json` for the complete names and services.

## Camera flow verified

```txt
target position:
  player position + yaw-relative 6.6 m chase offset + 2.35 m height

target look point:
  route sample at routeIndex + 12
  + active/fallback terrain sample
  + 1.15 m

controller:
  persistent SmoothDamp position and look point
  exponential quaternion slerp
  maximum dt 1/30
  teleport threshold 24

resets:
  initial-run
  run-restart
  run-change
  upstream teleport-threshold
```

## Main gap

No immutable consumption row joins:

```txt
authoritative source revision
target revision
controller revision
Three application revision
render frame ID
```

That prevents deterministic replay proof, stale-target rejection, exact browser diagnostics and safe teardown.

## Required implementation boundary

```txt
prehistoric-camera-consumption-authority-domain
  -> target descriptor and fingerprint
  -> target admission/reset/update result
  -> controller transform result
  -> Three application result
  -> rendered-frame acknowledgement
  -> bounded observation
  -> lifecycle owner
```

Reuse or extend the existing camera kit for generic validation/results. Keep route/terrain target composition in the product.

## Validation outcome

No runtime files changed. No branch or pull request was created. Source inspection completed through GitHub. Local clone/browser execution was unavailable, and no camera fixtures currently exist.

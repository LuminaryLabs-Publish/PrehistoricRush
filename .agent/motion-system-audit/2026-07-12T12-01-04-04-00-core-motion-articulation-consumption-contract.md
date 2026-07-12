# Motion System Audit: Core Motion / Articulation Consumption Contract

**Timestamp:** `2026-07-12T12-01-04-04-00`

## Summary

The Core Motion cutover is structurally present and the final pinned Nexus Engine revision preserves the root `engine.coreMotion` API while retaining composed extensions. PrehistoricRush uses the root API for intent and frame recording, registers an articulated rig through the subdomain API and exposes a solver. It does not yet make either articulated subdomain an active participant in the visible gameplay or creator frame.

## Plan ledger

**Goal:** distinguish installed capability, committed result and consumed presentation so motion diagnostics cannot overstate what drives the player.

- [x] Verify the final Nexus Engine pin.
- [x] Verify `createCoreMotionDomain()` installs root and articulated-motion kits.
- [x] Verify `createCorePhysicsDomain()` installs root and articulated-dynamics kits.
- [x] Verify `engine.coreMotion` preserves base, motion and user extension APIs.
- [x] Verify PrehistoricRush records intent/frame and registers a rig.
- [x] Verify articulated solve and dynamics frames are not consumed by current rendering.
- [ ] Add explicit activation, consumption and parity results.

## Pinned source graph

```txt
Nexus Engine: cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1
NexusEngine-Kits: 9673594de5669b4691737b91a9d56fa282e74370
NexusEngine-ProtoKits: 534e249346d94351baa4cfce9f2d3cd837362920
Three.js: 0.179.1
Rapier: 0.15.0
```

The final Nexus Engine pin fixes root Core Motion API preservation by combining base API, built-in motion API and user extensions, then assigning the resolved API to `engine.coreMotion`.

## Core Motion root services

```txt
movement mode registration
intent submit/clear
trajectory submit
motion frame commit/history
validation
snapshot/load/reset
root engine.coreMotion alias
```

## Articulated Motion services

```txt
rig registration/removal/read
pose registration/read
IK target submission
two-bone IK pose resolution
articulated motion frames
diagnostics
snapshot/load/reset
```

## Articulated Dynamics services

```txt
physical articulation registration/sync/removal
joint motor targets
ragdoll blend state
articulated dynamics frame commit/read
diagnostics
snapshot/load/reset
```

## Current PrehistoricRush usage matrix

| Surface | Installed | Writes data | Reads result | Drives visible raptor |
|---|---:|---:|---:|---:|
| Core Motion | yes | yes | snapshot only | no |
| Articulated Motion | yes | rig only | optional API | no |
| Core Physics | yes | yes | collision/physics frame | root transform only |
| Articulated Dynamics | yes | no player articulation | snapshot only | no |
| Procedural Creature legacy pose | yes | yes | yes | yes |

## Required state classification

Every motion surface must publish one of:

```txt
inactive: installed but not configured for the player
configured: rig/profile adopted but no result committed
active: results are committed
consumed: selected result was applied by physics or renderer
stale: result belongs to predecessor run/profile/rig generation
failed: command or consumer rejected the result
```

The current snapshot model exposes data but not this product-level classification.

## Required product policy

```txt
playerMotionPolicy
  movementSource: core-motion
  physicsMode: kinematic-root | articulated-dynamics
  poseMode: articulated-motion | legacy-procedural
  creatorPoseMode: articulated-motion | legacy-procedural
  fallbackPolicy: deny | typed-legacy
  requireVisibleFrameAck: true
```

## Required consumption receipts

```txt
PhysicsMotionConsumptionResult
  coreMotionFrameId
  physicsRequestIds
  physicsFrameId
  status

ArticulatedPoseConsumptionResult
  rigId
  articulatedFrameId
  poseResultId
  targetPlanId
  status

RendererPoseConsumptionResult
  poseResultId
  meshId
  skeletonFingerprint
  rendererFrameId
  status
```

## Required reset behavior

```txt
run restart retires predecessor intent, trajectory and motion-frame application
profile replacement retires predecessor rig and pose results
creator teardown retires preview results and mesh consumers
dynamics reset clears articulations, constraints and motor requests
public readback never mixes predecessor and replacement generations
```

## Validation boundary

The final pin and source contracts were inspected. No runtime, browser, Rapier or renderer fixture was executed.
# Architecture audit: runtime frame authority DSK map

Timestamp: `2026-07-10T16-28-47-04-00`

## Current authority map

```txt
src/game.js
  event-bus-kit
  domain-host-kit
  tick-scheduler-kit
  dino form/pose/material kits
  camera-domain-kit
  hud-domain-kit
  secondary presentation RAF

src/runtime-terrain-v6.mjs
  shell
  scene labels
  input
  simulation
  terrain and spawn
  physics bridge
  contact and pickup
  storage
  raptor pose
  camera
  HUD
  primary render RAF
  host projection
```

## Implemented DSK boundary

| Kit | Services | Live consumption |
|---|---|---|
| event-bus-kit | `on`, `emit`, wildcard dispatch, recent snapshot | setup events only |
| domain-host-kit | install/get/tick/snapshot | install and snapshot; no live tick |
| tick-scheduler-kit | start/stop/RAF tick/snapshot | constructed; never started |
| dino-form-domain-kit | form descriptors | snapshot only |
| dino-pose-domain-kit | movement-to-pose service and events | listener installed; no live `runner.moved` |
| dino-material-domain-kit | material descriptors | snapshot only |
| camera-domain-kit | close-camera preset | values duplicated in direct consumer |
| hud-domain-kit | progress and HUD model | bypassed by direct HTML |
| rapier-physics-domain-kit | actor/collider/step/contact bridge | live runtime consumption |

## Missing authority kits

```txt
frame-authority-kit
frame-phase-contract-kit
simulation-frame-transaction-kit
render-request-kit
render-commit-authority-kit
scene-transition-result-kit
restart-transaction-kit
runtime-source-manifest-kit
detached-host-snapshot-kit
frame-authority-fixture-kit
```

## Required frame contract

```txt
SourceFrame
  id
  now
  dt
  sessionId
  inputSnapshot

SimulationResult
  sourceFrameId
  movement
  jump
  contact
  pickup
  scene

PresentationRequest
  sourceFrameId
  pose
  camera
  hud

RenderCommitResult
  sourceFrameId
  accepted
  reason
  rendererFrame
```

## Architecture decision

Do not add a third coordinator. Convert the current composition layer into the single authority surface or adapt the live runtime loop to call the existing domain host exactly once per source frame. The secondary presentation pass must become a phase consumer, not an independent clock.

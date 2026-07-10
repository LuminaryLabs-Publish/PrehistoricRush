# Architecture Audit: Runner Moved Host Journal DSK Map

**Timestamp:** `2026-07-10T02-51-39-04-00`

## Current DSK shape

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
       -> event-bus-kit
       -> domain-host-kit
       -> tick-scheduler-kit
       -> dino form / pose / material domain kits
       -> camera-domain-kit
       -> hud-domain-kit
       -> PrehistoricRushComposition.snapshot()
  -> src/runtime-terrain-v6.mjs
       -> legacy live runner
       -> Three.js scene
       -> Rapier physics bridge
       -> raptor rig
       -> terrain stream
       -> pickups / contacts / scene state
       -> HUD / camera / render
       -> PrehistoricRushHost.getState()
```

## Current domain boundary problem

The architecture has two paths:

```txt
proof path:
  eventBus -> runner.moved -> dino-pose-domain-kit -> dino.pose.changed

live path:
  runtime-terrain-v6 frame loop -> mutate runner / pose / camera / HUD / render directly
```

The proof path exists but the live path does not feed it.

## Services already available

```txt
event-bus-kit:
  on
  emit
  snapshot
  recent event history

domain-host-kit:
  install
  get
  tick
  snapshot

dino-pose-domain-kit:
  consumes runner.moved
  computes readable pose
  emits dino.pose.changed
  getDescriptor
  snapshot

legacy runner:
  input state
  movement integration
  terrain streaming
  collision checks
  pickup checks
  scene transitions
  best distance storage
  render submission
  host projection
```

## Missing source-owned services

```txt
RunnerSourceState creation
RunnerStepDelta creation
MovementResultRow creation
RunnerMovedEvent emission
DinoPoseFrame projection
CameraFrameRequest projection
HudFrameRequest projection
ContactResultSnapshot projection
PickupResultSnapshot projection
SceneDispatchResult projection
BestDistanceResult projection
RenderReadback projection
PresentationFrameRecord assembly
PresentationJournal retention
HostPresentationSnapshot readback
DOM-free presentation fixture
```

## Implemented kits

```txt
event-bus-kit
domain-host-kit
tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
rapier-physics-domain-kit
prehistoric-legacy-visual-runtime-kit
runner-input-kit
runner-motion-kit
runner-terrain-stream-kit
runner-contact-kit
runner-pickup-kit
runner-scene-dispatch-kit
runner-score-kit
best-distance-storage-kit
raptor-render-adapter-kit
presentation-camera-consumer-kit
presentation-hud-consumer-kit
presentation-raptor-stride-consumer-kit
render-submission-kit
host-state-projection-kit
```

## Next DSK cut

```txt
presentation-events-kit
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
movement-result-row-kit
presentation-journal-kit
host-presentation-snapshot-kit
dom-free-presentation-fixture-kit
```

## Guardrail

Do not promote to ProtoKits until `runner.moved` and presentation frame rows are source-backed and fixture-proven inside this repo.

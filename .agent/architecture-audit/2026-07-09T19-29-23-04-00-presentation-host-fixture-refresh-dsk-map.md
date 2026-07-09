# Architecture Audit: Presentation Host Fixture Refresh DSK Map

**Timestamp:** `2026-07-09T19-29-23-04-00`

## Current DSK shape

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
     -> createEventBus()
     -> createDomainHost({ eventBus })
     -> createTickScheduler({ host, eventBus })
     -> install dino/camera/HUD domain kits
     -> expose PrehistoricRushComposition.snapshot()
     -> emit composition.ready
     -> import src/runtime-terrain-v6.mjs
        -> create Three/Rapier runtime
        -> mutate runner, terrain, pickups, contacts, scene, score, camera, HUD, and renderer inline
     -> startPresentationPass()
        -> mutate readable raptor stride, close camera, HUD, and second render frame
```

## Source-backed domains

```txt
composition-bootstrap
  source: src/game.js
  services: installs repo-local domain kits and exposes PrehistoricRushComposition.snapshot()

event-bus-history
  source: src/domain-runtime/event-bus.js
  services: on, emit, snapshot with recent event history

domain-host-installation
  source: src/domain-runtime/domain-host.js
  services: idempotent install, get, tick, snapshot

tick-scheduler-scaffold
  source: src/domain-runtime/tick-scheduler.js
  services: start, stop, snapshot

dino-pose-domain
  source: src/domains/dino/dino-pose-domain-kit.js
  services: runner.moved consumer, pose descriptor, dino.pose.changed emitter

camera-preset-domain
  source: src/domains/camera/camera-domain-kit.js
  services: close third-person camera preset descriptor

hud-preset-domain
  source: src/domains/hud/hud-domain-kit.js
  services: progress and HUD projection descriptor
```

## Runtime-owned domains still needing proof

```txt
legacy-three-rapier-runtime-domain
runner-input-domain
runner-motion-domain
jump-gravity-domain
terrain-streaming-domain
terrain-chunk-rebuild-domain
spawn-population-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
presentation-camera-consumer-domain
presentation-hud-consumer-domain
presentation-raptor-stride-consumer-domain
render-readback-domain
host-presentation-snapshot-domain
```

## Boundary issue

The DSK wrapper is installed before the visual runtime, but the live runner does not feed the DSK. `dino-pose-domain-kit` is waiting on `runner.moved`; the runtime instead calls `animateRaptor()` directly and the presentation pass calls `applyReadableStride()` directly.

## Required bridge

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit update
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free fixture rows
```

## Do not do next

```txt
visual expansion
terrain rewrite
movement rewrite
renderer extraction
ProtoKit promotion
new obstacle set
new pickup economy
browser-only validation gate
```

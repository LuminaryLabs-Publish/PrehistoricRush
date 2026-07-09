# Architecture Audit — Presentation Consumer Source Manifest DSK Map

**Timestamp:** `2026-07-08T21-40-45-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Architecture read

`PrehistoricRush` currently runs as a static browser route with two layers:

```txt
repo-local DSK composition scaffold
  -> event bus
  -> domain host
  -> tick scheduler
  -> dino form / pose / material domains
  -> camera domain
  -> HUD domain

legacy live visual runner
  -> Three.js + Rapier imports
  -> terrain/prop/pickup/hazard generation
  -> input and movement mutation
  -> scene dispatch mutation
  -> raptor/camera/HUD/render mutation
  -> PrehistoricRushHost.getState()
```

The architecture is ready for an additive bridge. The bridge should not own visuals. It should own source facts, event emission, readback records, host projection, and fixture proof.

## Current DSK/domain map

```txt
static-browser-shell
  kit: prehistoric-static-shell-kit
  source: index.html
  service: load module route

module-runtime-entry
  kit: prehistoric-runtime-entry-kit
  source: src/runtime.mjs
  service: import ./game.js

composition-bootstrap
  kit: prehistoric-composition-bootstrap-kit
  source: src/game.js
  service: install repo-local domains and expose PrehistoricRushComposition

event-bus-history
  kit: domain-runtime/event-bus
  source: src/domain-runtime/event-bus.js
  service: on / emit / snapshot

domain-host-installation
  kit: domain-runtime/domain-host
  source: src/domain-runtime/domain-host.js
  service: idempotent install / get / tick / snapshot

tick-scheduler-scaffold
  kit: domain-runtime/tick-scheduler
  source: src/domain-runtime/tick-scheduler.js
  service: future tick-owned domain updates

dino-entity-domain
  kits: dino-form-domain-kit, dino-pose-domain-kit, dino-material-domain-kit, dino-domain-bundle
  source: src/domains/dino/*
  service: dino descriptors, pose response to runner.moved, material/form state

camera-domain
  kit: camera-domain-kit
  source: src/domains/camera/camera-domain-kit.js
  service: close-third-person camera descriptor

hud-domain
  kit: hud-domain-kit
  source: src/domains/hud/hud-domain-kit.js
  service: HUD descriptor and pure HUD metric projection

legacy-visual-runtime
  kit: prehistoric-legacy-visual-runtime-kit
  source: src/runtime-terrain-v6.mjs
  service: live runner, renderer, contact, scene, and host state

presentation-pass-authority
  kit: prehistoric-hud-dom-render-kit and prehistoric-close-camera-apply-kit
  source: src/game.js
  service: direct HUD/camera/raptor/readability presentation overlay
```

## Missing DSK boundary

The next DSK boundary is `presentation-consumer-source-manifest`.

It should be split into atomic local kits:

```txt
prehistoric-rush-runner-source-state-kit
  owns: serializable source state projected from app.state
  service: snapshotRunnerSourceState(app)

prehistoric-rush-runner-step-delta-kit
  owns: previous/current movement delta
  service: createRunnerStepDelta(previous, current)

prehistoric-rush-runner-moved-event-kit
  owns: runner.moved event shape
  service: createRunnerMovedEvent(delta, source)

prehistoric-rush-dino-event-bridge-kit
  owns: event bus bridge and readback
  service: emitRunnerMoved(eventBus, event), readDinoPoseChanged(eventBus)

prehistoric-rush-dino-pose-frame-kit
  owns: stable pose-frame record
  service: createDinoPoseFrame(runnerMoved, dinoPoseChanged)

prehistoric-rush-camera-frame-request-kit
  owns: serializable camera request
  service: createCameraFrameRequest(cameraDescriptor, runnerSource)

prehistoric-rush-hud-frame-request-kit
  owns: serializable HUD request
  service: createHudFrameRequest(hudDescriptor, runnerSource, terrain, physics)

prehistoric-rush-contact-result-snapshot-kit
  owns: contact/readback result rows
  service: createContactResultSnapshot({ hazard, pickup, sceneBefore, sceneAfter })

prehistoric-rush-scene-dispatch-result-kit
  owns: menu/game/run-over/win transition rows
  service: createSceneDispatchResult({ before, after, reason })

prehistoric-rush-render-readback-kit
  owns: non-WebGL render consumption facts
  service: createRenderReadback({ renderer, camera, hud, dino })

prehistoric-rush-presentation-frame-record-kit
  owns: combined frame record
  service: createPresentationFrameRecord(parts)

prehistoric-rush-presentation-journal-kit
  owns: bounded recent records
  service: appendPresentationJournalEntry(record), snapshotPresentationJournal()

prehistoric-rush-host-presentation-snapshot-kit
  owns: host projection compatibility
  service: projectHostPresentationSnapshot(journal)

prehistoric-rush-dom-free-presentation-fixture-kit
  owns: fixture rows and replay proof
  service: runPresentationConsumerFixture()
```

## Compatibility rule

All new source/projection modules must be additive.

```txt
preserve index.html
preserve src/runtime.mjs
preserve src/game.js import path
preserve runtime-terrain-v6.mjs playable flow
preserve current visual output
preserve PrehistoricRushComposition.snapshot()
preserve PrehistoricRushHost.getState().scene
preserve PrehistoricRushHost.getState().runner
preserve PrehistoricRushHost.getState().physics
preserve PrehistoricRushHost.getState().terrain
preserve PrehistoricRushHost.getState().renderer
add only PrehistoricRushHost.getState().presentation
```

## Stop condition for next implementation

The next implementation is complete when a DOM-free fixture proves:

```txt
RunnerSourceState exists
RunnerStepDelta exists
RunnerMovedEvent exists
runner.moved can feed dino-pose-domain-kit
dino.pose.changed can be captured as DinoPoseFrame
CameraFrameRequest is produced without mutating Three.js
HudFrameRequest is produced without writing DOM
ContactResultSnapshot records hazard and pickup outcomes
SceneDispatchResult records scene transitions
RenderReadback records consumer facts
PresentationFrameRecord combines all subrecords
PresentationJournalSnapshot is bounded
PrehistoricRushHost.getState().presentation is additive and fixture-readable
```

## Deferred work

```txt
run-movement-kit promotion
action frame contract
action acceptance matrix
action result journal
terrain extraction
renderer extraction
Rapier abstraction rewrite
full ProtoKit migration
```
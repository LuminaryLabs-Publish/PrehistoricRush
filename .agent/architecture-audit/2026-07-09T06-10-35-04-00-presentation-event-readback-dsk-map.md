# Architecture Audit: Presentation Event Readback DSK Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T06-10-35-04-00`

## Current architecture

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> repo-local DSK scaffold
  -> src/runtime-terrain-v6.mjs legacy visual runtime
  -> PrehistoricRushComposition.snapshot()
  -> PrehistoricRushHost.getState()
```

`src/game.js` already creates an event bus, domain host, tick scheduler, dino form, dino pose, dino material, camera, and HUD domain kits.

`src/runtime-terrain-v6.mjs` still owns the live runner state, terrain, input, hazards, pickups, scene transitions, and baseline render loop.

## Implemented DSKs

```txt
domain-runtime/event-bus
  service: createEventBus
  service: eventBus.on
  service: eventBus.emit
  service: eventBus.snapshot
  note: already has enough shape to carry runner.moved and dino.pose.changed records.

domain-runtime/domain-host
  service: createDomainHost
  service: domainHost.install
  service: domainHost.get
  service: domainHost.tick
  service: domainHost.snapshot
  note: currently installs descriptors but does not own live frame authority.

domain-runtime/tick-scheduler
  service: createTickScheduler
  service: scheduler.start
  service: scheduler.stop
  service: scheduler.snapshot
  note: scaffold exists, but the visual runtime remains requestAnimationFrame-owned.

dino-form-domain-kit
  service: createDinoFormDomainKit
  service: getDescriptor
  service: snapshot
  note: form descriptor exists.

dino-pose-domain-kit
  service: createDinoPoseDomainKit
  service: update
  service: getDescriptor
  service: snapshot
  service: consumes runner.moved
  service: emits dino.pose.changed
  note: this is the strongest existing consumer seam.

dino-material-domain-kit
  service: createDinoMaterialDomainKit
  service: getDescriptor
  service: snapshot
  note: material descriptor exists.

camera-domain-kit
  service: createCameraDomainKit
  service: camera.preset.ready
  service: getDescriptor
  service: snapshot
  note: camera descriptor exists, but app still mutates Three camera directly.

hud-domain-kit
  service: createHudDomainKit
  service: hud.ready
  service: render
  service: getDescriptor
  service: snapshot
  note: HUD descriptor and projection service exist, but app still writes DOM directly.
```

## Live external kit

```txt
rapier-physics-domain-kit
  source: CDN from NexusRealtime-ProtoKits main
  service: createRapierPhysicsKit
  service: initWorld
  service: install
  service: configure
  service: registerKinematicActor
  service: setActorTransform
  service: step
  service: getSnapshot
```

## Runtime-implied kits still embedded in source

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
prehistoric-raptor-visual-rig-kit
prehistoric-terrain-streaming-kit
prehistoric-contact-check-kit
prehistoric-scene-dispatch-kit
prehistoric-hud-dom-render-kit
prehistoric-close-camera-apply-kit
```

## Next-cut DSK map

```txt
prehistoric-rush-runner-source-state-kit
  owns: projecting app.state into a serializable RunnerSourceState.
  services: snapshotRunnerSourceState.

prehistoric-rush-runner-step-delta-kit
  owns: previous/current runner source comparison.
  services: createRunnerStepDelta.

prehistoric-rush-runner-moved-event-kit
  owns: deciding and shaping runner.moved payloads.
  services: createRunnerMovedEvent, shouldEmitRunnerMoved.

prehistoric-rush-dino-event-bridge-kit
  owns: eventBus emission and consumer readback for dino pose.
  services: emitRunnerMoved, readLatestDinoPoseChangedEvent.

prehistoric-rush-dino-pose-frame-kit
  owns: stable dino pose frame records.
  services: createDinoPoseFrame.

prehistoric-rush-camera-frame-request-kit
  owns: camera descriptor request records.
  services: createCameraFrameRequest.

prehistoric-rush-hud-frame-request-kit
  owns: HUD descriptor request records.
  services: createHudFrameRequest.

prehistoric-rush-contact-result-snapshot-kit
  owns: hazard and pickup contact result records.
  services: createContactResultSnapshot.

prehistoric-rush-scene-dispatch-result-kit
  owns: scene transition result records.
  services: createSceneDispatchResult.

prehistoric-rush-render-readback-kit
  owns: renderer/camera/HUD/dino consumption evidence.
  services: createRenderReadback.

prehistoric-rush-presentation-frame-record-kit
  owns: frame-level aggregate record.
  services: createPresentationFrameRecord.

prehistoric-rush-presentation-journal-kit
  owns: bounded recent presentation frames.
  services: appendPresentationJournalEntry, projectPresentationJournalSnapshot.

prehistoric-rush-host-presentation-snapshot-kit
  owns: additive host projection.
  services: projectHostPresentationSnapshot.

prehistoric-rush-dom-free-presentation-fixture-kit
  owns: replayable fixture rows for the whole event/readback chain.
  services: runPresentationEventBridgeFixture.
```

## Architecture finding

Do not promote movement, terrain, or renderer systems before the presentation event readback chain is proven.

The cleanest extraction starts with the already-present `runner.moved` consumer in `dino-pose-domain-kit`. That lets the repo prove domain consumption without changing the visible runner first.

# PrehistoricRush Presentation Event Host DSK Map

**Timestamp:** `2026-07-08T14:51:11-04:00`

## Purpose

Map the current DSK/domain layout and the next local proof kits needed to make the live runner fixture-readable without changing the visible route.

## Current runtime composition

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> dino-form-domain-kit
  -> dino-pose-domain-kit
  -> dino-material-domain-kit
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> import src/runtime-terrain-v6.mjs
  -> PrehistoricRushHost.getState()
```

## Existing explicit kits

```txt
domain-runtime/event-bus
  service: eventBus.on(type, handler)
  service: eventBus.emit(type, payload)
  service: eventBus.snapshot()
  gap: no runner/contact/scene/presentation event contract is emitted yet

domain-runtime/domain-host
  service: domainHost.install(domain)
  service: domainHost.get(id)
  service: domainHost.tick(dt, context)
  service: domainHost.snapshot()
  gap: live runtime is not tick-owned yet

domain-runtime/tick-scheduler
  service: scheduler.start()
  service: scheduler.stop()
  service: scheduler.snapshot()
  gap: present but not authoritative for live movement/render frame

dino-form-domain-kit
  service: exposes dino form descriptor
  gap: renderer still builds raptor rig inline

dino-pose-domain-kit
  service: listens for runner.moved
  service: emits dino.pose.changed
  service: getDescriptor()
  gap: live route does not emit runner.moved

dino-material-domain-kit
  service: exposes dino material descriptor
  gap: renderer still owns materials inline

camera-domain-kit
  service: emits camera.preset.ready
  service: getDescriptor()
  gap: applyCloseCamera directly mutates Three.js camera instead of consuming CameraFrameRequest

hud-domain-kit
  service: emits hud.ready
  service: render(snapshot)
  service: getDescriptor()
  gap: renderHud directly mutates DOM innerHTML instead of consuming HudFrameRequest

rapier-physics-domain-kit
  service: configure Rapier bridge
  service: register kinematic dino actor
  service: setActorTransform
  service: step
  service: getSnapshot
  gap: contact result decisions are not separately journaled before scene mutation
```

## Runtime-implied domains

```txt
legacy-visual-runtime-bridge
keyboard-input-adapter
button-input-adapter
runner-source-state
movement-step-policy
jump-consumption-policy
boost-speed-policy
turn-steering-policy
hazard-contact-detection
pickup-contact-detection
scene-dispatch-policy
presentation-pass-authority
camera-frame-application
hud-dom-render-application
dino-rig-animation-application
render-frame-readback
host-diagnostics-projection
```

## Next-cut local proof kits

```txt
prehistoric-rush-runner-source-state-kit
  owns: stable copy of app.scene, app.input, app.frame, app.state, physics snapshot, terrain chunk count
  service: snapshotRunnerSourceState(app)

prehistoric-rush-runner-moved-event-kit
  owns: movement delta facts
  service: createRunnerMovedEvent(previous, next)
  service: shouldEmitRunnerMoved(event)

prehistoric-rush-dino-event-bridge-kit
  owns: runner.moved -> dino.pose.changed projection readback
  service: emitRunnerMoved(eventBus, event)
  service: recordDinoPoseChanged(event)

prehistoric-rush-dino-pose-frame-kit
  owns: stable pose frame after domain update
  service: createDinoPoseFrame(domainSnapshot, sourceState)

prehistoric-rush-camera-frame-request-kit
  owns: descriptor-level camera request
  service: createCameraFrameRequest(cameraDescriptor, sourceState)

prehistoric-rush-hud-frame-request-kit
  owns: descriptor-level HUD request
  service: createHudFrameRequest(hudDescriptor, sourceState)

prehistoric-rush-contact-result-snapshot-kit
  owns: hazard and pickup contact decisions
  service: createContactResultSnapshot(sourceState, contacts)

prehistoric-rush-scene-dispatch-result-kit
  owns: menu/game/run-over/win scene transition records
  service: createSceneDispatchResult(previousScene, nextScene, reason)

prehistoric-rush-presentation-frame-record-kit
  owns: combined frame record
  service: createPresentationFrameRecord(parts)

prehistoric-rush-presentation-journal-kit
  owns: bounded recent presentation frames
  service: appendPresentationJournalEntry(record)
  service: getPresentationJournalSnapshot()

prehistoric-rush-render-readback-kit
  owns: render/camera/HUD/dino consumption status
  service: createRenderReadback(frameRecord, app)

prehistoric-rush-host-presentation-snapshot-kit
  owns: host-facing presentation state
  service: projectHostPresentationSnapshot(journal)

prehistoric-rush-dom-free-presentation-fixture-kit
  owns: fixture rows with no DOM, WebGL, Rapier, requestAnimationFrame, or browser dependency
  service: runPresentationFrameFixture(cases)
```

## Implementation cutline

```txt
Allowed next:
  src/presentation/*.js pure projectors
  scripts/prehistoric-rush-presentation-frame-fixture.mjs
  additive imports in src/game.js
  additive host projection in PrehistoricRushHost.getState()
  tiny instrumentation around runtime-terrain-v6.mjs movement/contact/scene decisions

Not allowed next:
  renderer redesign
  gameplay retune
  complete runtime rewrite
  shared ProtoKit promotion before local proof
  removal of current PrehistoricRushComposition.snapshot()
  removal of current PrehistoricRushHost.getState()
```

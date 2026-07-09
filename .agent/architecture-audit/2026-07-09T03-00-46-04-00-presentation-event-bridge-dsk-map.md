# PrehistoricRush Presentation Event Bridge DSK Map

**Timestamp:** `2026-07-09T03-00-46-04-00`

## Scope

This audit maps the current DSK/domain surface and the next event-bridge extraction boundary.

## Current architecture

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> repo-local domain runtime scaffold
  -> repo-local dino/camera/HUD domains
  -> src/runtime-terrain-v6.mjs live visual runner
```

`src/game.js` is already an adapter layer. It installs composition domains, exposes `PrehistoricRushComposition.snapshot()`, imports the live monolith, and applies a readability presentation pass.

`src/runtime-terrain-v6.mjs` remains the live product route. It owns Three.js/Rapier loading, scene construction, terrain, scatter, input, runner motion, contacts, scene transitions, baseline HUD/camera, raptor animation, render, and `PrehistoricRushHost.getState()`.

## Current domains

```txt
composition-bootstrap:
  owns creation order and installed domain list

event-bus-history:
  owns event registration, event emission, recent history, and event count

domain-host-installation:
  owns idempotent domain install and snapshot readback

tick-scheduler-scaffold:
  owns future tick-owned updates but is not yet the live motion authority

dino-form-domain:
  owns dino form descriptor data

dino-pose-domain:
  owns pose descriptor state and consumes runner.moved

dino-material-domain:
  owns dino material descriptor data

camera-domain:
  owns close third-person camera descriptor data

hud-domain:
  owns readability HUD descriptor and pure HUD projection service

legacy-visual-runtime-bridge:
  owns import and live compatibility with runtime-terrain-v6.mjs

runner-motion-policy:
  currently inline in runtime-terrain-v6.mjs

contact-result-policy:
  currently inline in runtime-terrain-v6.mjs

scene-dispatch-policy:
  currently inline in runtime-terrain-v6.mjs

presentation-pass-authority:
  currently direct DOM/camera/rig/render mutations in src/game.js
```

## Current kit services

```txt
createEventBus:
  create pub/sub bus with recent event history

eventBus.on:
  register typed or wildcard listeners

eventBus.emit:
  emit event records and feed listeners

eventBus.snapshot:
  read listener types, recent events, and event count

createDomainHost:
  create installable domain registry

domainHost.install:
  install one domain kit once

domainHost.snapshot:
  read installed domain state

createTickScheduler:
  create future frame/tick loop scaffold

createDinoPoseDomainKit:
  expose update(), getDescriptor(), snapshot(), and runner.moved listener

createCameraDomainKit:
  expose close camera descriptor and snapshot

createHudDomainKit:
  expose readability HUD descriptor, render projection, and snapshot

startPresentationPass:
  read PrehistoricRushHost.app and apply direct camera/HUD/dino/render mutations
```

## Current implemented kits

```txt
domain-runtime/event-bus
 domain-runtime/domain-host
 domain-runtime/tick-scheduler
 dino-form-domain-kit
 dino-pose-domain-kit
 dino-material-domain-kit
 dino-domain-bundle
 camera-domain-kit
 hud-domain-kit
```

## External kit in use

```txt
rapier-physics-domain-kit
```

Loaded from:

```txt
https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js
```

## Next event bridge architecture

```txt
PrehistoricRushHost.app.state
  -> snapshotRunnerSourceState
  -> createRunnerStepDelta
  -> createRunnerMovedEvent
  -> emitRunnerMoved(eventBus)
  -> dino-pose-domain-kit runner.moved consumer
  -> dino.pose.changed event
  -> createDinoPoseFrame
  -> createCameraFrameRequest
  -> createHudFrameRequest
  -> createContactResultSnapshot
  -> createSceneDispatchResult
  -> createRenderReadback
  -> createPresentationFrameRecord
  -> presentation journal
  -> projectHostPresentationSnapshot
  -> PrehistoricRushHost.getState().presentation
```

## Next-cut kits

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-step-delta-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-render-readback-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Boundary rule

Do not extract movement, terrain, physics, renderer, or the whole runtime yet.

The first implementation should activate the existing event consumer seam and prove it with DOM-free rows.
# PrehistoricRush Presentation Authority Consumer DSK Map

**Timestamp:** `2026-07-08T19-30-31-04-00`

## Scope

Docs-only architecture audit for `LuminaryLabs-Publish/PrehistoricRush`.

The source target is to make the current runner route fixture-readable without replacing the route.

## Current architecture

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> dino form / pose / material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> src/runtime-terrain-v6.mjs
  -> Three.js / Rapier visual runner
  -> PrehistoricRushHost.getState()
```

## Interaction loop

```txt
open route
  -> load composition scaffold
  -> install repo-local DSKs
  -> load visual runner
  -> player starts game
  -> input mutates live app.state
  -> terrain/contact/pickup/scene logic mutates state
  -> raptor/camera/HUD/render mutate presentation
  -> host exposes snapshot
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
domain-idempotency
tick-scheduler-scaffold
dino-entity-domain
dino-form-domain
dino-pose-domain
dino-material-domain
dino-domain-bundle
camera-domain
hud-domain
legacy-visual-runtime-bridge
cdn-dependency-loading
three-render-runtime
rapier-physics-runtime
rapier-physics-domain-kit-bridge
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
runner-motion-policy
runner-step-delta-contract
turn-steering-policy
jump-policy
boost-policy
speed-ramp-policy
distance-score-policy
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
procedural-scatter-placement
collider-descriptor-generation
pickup-descriptor-generation
rapier-runtime-bridge
kinematic-actor-transform
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
presentation-pass-authority
runner-source-state-contract
runner-moved-event-contract
dino-pose-event-bridge
dino-pose-frame-contract
camera-frame-request-contract
hud-frame-request-contract
contact-result-contract
scene-dispatch-result-contract
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
```

## Services offered by current kits

```txt
createEventBus: creates event history and pub/sub surface
eventBus.on: subscribes a domain to an event
eventBus.emit: emits domain/runtime events
eventBus.snapshot: returns event history
createDomainHost: creates idempotent domain host
domainHost.install: installs domain kits
domainHost.get: reads a domain by id
domainHost.tick: ticks installed domains
domainHost.snapshot: returns installed domain state
createTickScheduler: creates scheduler wrapper
scheduler.start: starts domain ticking
scheduler.stop: stops domain ticking
scheduler.snapshot: returns scheduler state
createDinoFormDomainKit: provides form descriptor
createDinoPoseDomainKit: listens for runner.moved and emits dino.pose.changed
createDinoMaterialDomainKit: provides material descriptor
createDinoDomainBundle: bundles dino domains
createCameraDomainKit: provides close-third-person descriptor
createHudDomainKit: provides HUD descriptor/render helper
rapier-physics-domain-kit: external physics bridge
```

## Kits identified

Implemented repo-local kits:

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

External live kit:

```txt
rapier-physics-domain-kit
```

Runtime-implied product kits:

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

Next-cut kits:

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

## Target architecture seam

```txt
src/runtime-terrain-v6.mjs app state
  -> src/presentation/runner-source-state.js
  -> src/presentation/runner-step-delta.js
  -> src/presentation/runner-moved-event.js
  -> src/presentation/presentation-events.js
  -> existing eventBus runner.moved
  -> existing dino-pose-domain-kit
  -> dino.pose.changed event
  -> src/presentation/dino-pose-frame.js
  -> src/presentation/camera-frame-request.js
  -> src/presentation/hud-frame-request.js
  -> src/presentation/contact-result-snapshot.js
  -> src/presentation/scene-dispatch-result.js
  -> src/presentation/render-readback.js
  -> src/presentation/presentation-frame-record.js
  -> src/presentation/presentation-journal.js
  -> src/presentation/host-presentation-snapshot.js
  -> PrehistoricRushHost.getState().presentation
```

## Stop line

Stop after additive host projection and DOM-free fixture proof.

Do not extract movement, terrain, contact, renderer, or ProtoKits in the same source pass.

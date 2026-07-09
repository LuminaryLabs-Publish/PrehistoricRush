# PrehistoricRush Architecture Audit - Presentation Consumer Catch-up DSK Map

**Timestamp:** `2026-07-09T00-09-22-04-00`

## Architectural read

`PrehistoricRush` has two architecture layers running side by side:

```txt
repo-local domain scaffold:
  src/game.js
  src/domain-runtime/*
  src/domains/dino/*
  src/domains/camera/*
  src/domains/hud/*

legacy live visual runtime:
  src/runtime-terrain-v6.mjs
```

The scaffold is ready for consumer authority, but the live route still owns most mutable behavior inline. The useful next cut is to connect live app-state facts to the scaffold without changing visible behavior.

## Current boot and authority graph

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
      -> createEventBus()
      -> createDomainHost({ eventBus })
      -> createTickScheduler({ host, eventBus })
      -> install dino form / pose / material domains
      -> install camera and HUD domains
      -> expose PrehistoricRushComposition.snapshot()
      -> emit composition.ready
      -> await import("./runtime-terrain-v6.mjs")
      -> startPresentationPass()
  -> src/runtime-terrain-v6.mjs
      -> load Three.js CDN
      -> load Rapier CDN
      -> load rapier-physics-domain-kit CDN
      -> create shell, renderer, terrain, raptor, props, contacts, input, loop, and GameHost
```

## Existing domains

```txt
runtime domains:
  static-browser-shell
  module-runtime-entry
  composition-bootstrap
  event-bus-history
  domain-host-installation
  domain-idempotency
  tick-scheduler-scaffold
  host-diagnostics

entity and presentation domains:
  dino-entity-domain
  dino-form-domain
  dino-pose-domain
  dino-material-domain
  camera-domain
  hud-domain

legacy live runtime domains:
  legacy-visual-runtime-bridge
  three-render-runtime
  rapier-physics-runtime
  terrain-height-sampling
  terrain-chunk-streaming
  procedural-scatter-placement
  runner-motion-policy
  turn-steering-policy
  jump-policy
  boost-policy
  speed-ramp-policy
  hazard-contact-detection
  pickup-contact-detection
  distance-goal-detection
  raptor-visual-rig
  raptor-pose-animation
  scene-transition-authority

next proof domains:
  runner-source-state-contract
  runner-step-delta-contract
  runner-moved-event-contract
  dino-pose-event-bridge
  camera-frame-request-contract
  hud-frame-request-contract
  contact-result-contract
  scene-dispatch-result-contract
  render-readback-contract
  presentation-frame-contract
  presentation-journal-contract
  host-presentation-snapshot
  fixture-replay-contract
```

## Current implemented kits

```txt
domain-runtime/event-bus:
  service: eventBus.on
  service: eventBus.emit
  service: eventBus.snapshot
  gap: no live runner/contact/scene/presentation facts yet

domain-runtime/domain-host:
  service: domainHost.install
  service: domainHost.get
  service: domainHost.tick
  service: domainHost.snapshot
  gap: scheduler is scaffold, not live authority yet

domain-runtime/tick-scheduler:
  service: scheduler.start
  service: scheduler.stop
  service: scheduler.snapshot
  gap: not primary live loop authority yet

dino-form-domain-kit:
  service: createDinoFormDomainKit
  service: getDescriptor
  service: snapshot
  gap: visual raptor does not consume the descriptor yet

dino-pose-domain-kit:
  service: createDinoPoseDomainKit
  service: install runner.moved listener
  service: update pose descriptor
  service: emit dino.pose.changed
  service: snapshot
  gap: live route does not emit runner.moved

dino-material-domain-kit:
  service: createDinoMaterialDomainKit
  service: getDescriptor
  service: snapshot
  gap: renderer does not consume material descriptor yet

camera-domain-kit:
  service: createCameraDomainKit
  service: getDescriptor
  service: snapshot
  gap: live close-camera mutation does not create CameraFrameRequest

hud-domain-kit:
  service: createHudDomainKit
  service: render descriptor projection
  service: getDescriptor
  service: snapshot
  gap: live DOM HUD rewrite does not create HudFrameRequest
```

## External live kit

```txt
rapier-physics-domain-kit:
  source: CDN import from LuminaryLabs-Agents/NexusRealtime-ProtoKits
  service: configure Rapier gravity
  service: register kinematic actor
  service: set actor transform
  service: step physics world
  service: get physics snapshot
  gap: contact result readback is not normalized into ContactResultSnapshot
```

## Next DSK boundary

The next DSK boundary should stay local and additive:

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## DSK extraction order

```txt
1. prehistoric-rush-runner-source-state-kit
2. prehistoric-rush-runner-step-delta-kit
3. prehistoric-rush-runner-moved-event-kit
4. prehistoric-rush-dino-event-bridge-kit
5. prehistoric-rush-dino-pose-frame-kit
6. prehistoric-rush-camera-frame-request-kit
7. prehistoric-rush-hud-frame-request-kit
8. prehistoric-rush-contact-result-snapshot-kit
9. prehistoric-rush-scene-dispatch-result-kit
10. prehistoric-rush-render-readback-kit
11. prehistoric-rush-presentation-frame-record-kit
12. prehistoric-rush-presentation-journal-kit
13. prehistoric-rush-host-presentation-snapshot-kit
14. prehistoric-rush-dom-free-presentation-fixture-kit
```

## Implementation guardrail

Do not extract the visual renderer, movement runtime, terrain streaming, or ProtoKits before this source-to-consumer bridge exists and is fixture-readable.

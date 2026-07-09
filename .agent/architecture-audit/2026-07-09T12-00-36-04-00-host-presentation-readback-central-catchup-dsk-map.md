# Architecture Audit: Host Presentation Readback Central Catch-up DSK Map

**Timestamp:** `2026-07-09T12-00-36-04-00`

## Architecture read

`PrehistoricRush` currently has two layers:

```txt
repo-local composition scaffold
  -> event bus
  -> domain host
  -> scheduler
  -> dino/camera/HUD descriptor kits

legacy visual runtime
  -> Three.js scene
  -> Rapier bridge
  -> runner state mutation
  -> terrain streaming
  -> spawn population
  -> contact/pickup/scene mutation
  -> baseline render
```

`src/game.js` bridges the two by installing the DSK scaffold, importing `runtime-terrain-v6.mjs`, and running a second readability presentation pass over the live host.

## Domain boundaries

```txt
composition-bootstrap
  owns: installation order, composition.ready, composition snapshot
  current source: src/game.js

runtime-domain-host
  owns: kit idempotency, domain lookup, tick dispatch
  current source: src/domain-runtime/domain-host.js

event-bus-history
  owns: on, emit, recent event history
  current source: src/domain-runtime/event-bus.js

dino-pose-domain
  owns: pose descriptor from movement facts
  current source: src/domains/dino/dino-pose-domain-kit.js

visual-runtime-domain
  owns: browser shell, Three scene, Rapier bridge, movement, terrain, spawn, render
  current source: src/runtime-terrain-v6.mjs

presentation-pass-domain
  owns: close camera pass, readable stride pass, HUD rewrite, second render
  current source: src/game.js

host-readback-domain
  owns: PrehistoricRushHost.getState legacy fields
  current source: src/runtime-terrain-v6.mjs

presentation-readback-domain
  owns: planned presentation frame records and host presentation snapshot
  current source: missing
```

## DSK breakdown

### Source-backed kits already present

```txt
createEventBus
createDomainHost
createTickScheduler
createDinoFormDomainKit
createDinoPoseDomainKit
createDinoMaterialDomainKit
createDinoDomainBundle
createCameraDomainKit
createHudDomainKit
rapier-physics-domain-kit
```

### Inline behavior that should become kits later

```txt
runner-input-kit
runner-motion-kit
runner-terrain-stream-kit
runner-spawn-population-kit
runner-contact-kit
runner-pickup-kit
runner-scene-dispatch-kit
runner-score-kit
raptor-render-adapter-kit
presentation-camera-consumer-kit
presentation-hud-consumer-kit
presentation-raptor-stride-consumer-kit
```

### Next-cut kits for the immediate implementation

```txt
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
presentation-events-kit
dino-pose-frame-kit
camera-frame-request-kit
hud-frame-request-kit
contact-result-snapshot-kit
scene-dispatch-result-kit
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
dom-free-presentation-fixture-kit
```

## Main architectural gap

`dino-pose-domain-kit` has the right event contract, but the live runner does not feed it. The architecture should add an additive readback/proof seam before moving runtime authority.

## Required next splice

```txt
runtime live app.state
  -> runner-source-state
  -> runner-step-delta
  -> runner-moved-event
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit update
  -> presentation-frame-record
  -> PrehistoricRushHost.getState().presentation
```

## Do not cut next

```txt
Do not extract the renderer.
Do not rewrite runtime-terrain-v6.
Do not replace Rapier.
Do not move this to ProtoKits yet.
Do not change the visible camera/HUD behavior.
```

# Architecture Audit: Central Ledger Host Event Proof DSK Map

**Timestamp:** `2026-07-09T09-10-50-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Architectural read

`PrehistoricRush` is split between a small repo-local DSK scaffold and a live monolithic visual runtime.

The scaffold is in `src/game.js` and installs event, domain, scheduler, dino, camera, and HUD kits.

The playable route is still in `src/runtime-terrain-v6.mjs`, which owns the actual runner motion, terrain streaming, collisions, pickups, scene transitions, and baseline render pass.

## DSK shape currently present

```txt
src/runtime.mjs
  -> src/game.js
      -> event-bus
      -> domain-host
      -> tick-scheduler
      -> dino-form-domain-kit
      -> dino-pose-domain-kit
      -> dino-material-domain-kit
      -> camera-domain-kit
      -> hud-domain-kit
      -> PrehistoricRushComposition.snapshot()
      -> import runtime-terrain-v6.mjs
      -> startPresentationPass()
```

## Domain breakdown

```txt
composition-bootstrap
  owns: domain installation, initial composition.ready event, composition snapshot
  kits: event-bus, domain-host, tick-scheduler

runner-visual-runtime
  owns: legacy playable loop, terrain, physics, input, scoring, contact, scene, render
  kits: runtime-terrain-v6 monolith, rapier-physics-domain-kit bridge

dino-domain
  owns: dino form, pose descriptor, material descriptor
  kits: dino-form-domain-kit, dino-pose-domain-kit, dino-material-domain-kit, dino-domain-bundle

camera-domain
  owns: descriptor for close camera intent
  kits: camera-domain-kit

hud-domain
  owns: descriptor/projection intent for readable HUD
  kits: hud-domain-kit

presentation-pass
  owns: direct DOM and Three.js mutation pass after live runtime frame
  kits: currently inline styleHud, renderHud, applyCloseCamera, applyReadableStride, startPresentationPass

host-state-proof
  owns: missing stable records and additive host readback
  kits: planned runner source, delta, event, frame, journal, and host snapshot kits
```

## Services inventory

```txt
createEventBus()
  - on(type, fn)
  - emit(type, payload)
  - snapshot()

createDomainHost({ eventBus })
  - install(domain)
  - get(id)
  - tick(dt)
  - snapshot()

createTickScheduler({ host, eventBus })
  - start()
  - stop()
  - snapshot()

createDinoPoseDomainKit({ entityId })
  - listens for runner.moved
  - computes pose descriptor
  - emits dino.pose.changed

createCameraDomainKit()
  - exposes close-follow camera descriptor snapshot

createHudDomainKit()
  - exposes HUD descriptor
  - renders HUD descriptor into a projection shape

rapier-physics-domain-kit
  - configure Rapier world
  - register kinematic actor
  - set actor transform
  - step physics
  - snapshot contacts/world state
```

## Architectural gap

The repo has a consumer-ready `dino-pose-domain-kit`, but the authoritative runner never emits the source event it needs.

`runtime-terrain-v6.mjs` directly mutates `app.state`; `src/game.js` reads the resulting object later, mutates presentation, and renders. That works visually, but it does not leave proof rows.

## Next-cut module map

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

## Rule for next implementation

Add a proof bridge. Do not move authority yet.

The live runtime can stay as the authority for movement, contact, terrain, renderer, and scene dispatch while the proof kits observe and emit stable records.

# Architecture Audit: Presentation Event Bridge Fixture Freeze DSK Map

**Timestamp:** `2026-07-09T15-20-00-04-00`

## Current architecture shape

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> domain-runtime scaffold
  -> repo-local dino/camera/HUD domain kits
  -> src/runtime-terrain-v6.mjs
  -> live Three.js/Rapier runner
```

The route is playable, but authority is split. `src/game.js` owns the domain scaffold and presentation pass. `src/runtime-terrain-v6.mjs` owns live runner state, terrain, input, physics bridge, contacts, score, scene transitions, baseline camera/HUD, and render loop.

## Domain breakdown

```txt
composition-domain
  owns: EventBus, DomainHost, TickScheduler, PrehistoricRushComposition.snapshot()

runtime-shell-domain
  owns: DOM shell, status panel, start button, route entry

runner-state-domain
  owns: x, z, y, jumpY, vy, grounded, yaw, speed, distance, best, shards, colliders, pickups, time, turn

runner-input-domain
  owns: left/right/boost/jump flags and start/retry input mapping

terrain-stream-domain
  owns: heightAt(), chunk rebuild, terrain sample/update, chunk radius, seed, segment count

spawn-population-domain
  owns: tree, rock, shard, collider, and pickup placement

physics-bridge-domain
  owns: Rapier import, rapier-physics-domain-kit, kinematic dino actor, physics snapshot fallback

contact-domain
  owns: hit calculation, collider proximity, pickup radius, collision-to-run-over transition

scene-dispatch-domain
  owns: menu, game, run-over, win transitions

dino-pose-domain
  owns: source pose descriptor and runner.moved consumer contract

presentation-consumer-domain
  owns: direct readable stride, close camera, HUD rewrite, and second renderer frame

host-projection-domain
  owns: PrehistoricRushHost.getState() legacy readback

planned-presentation-proof-domain
  owns: RunnerSourceState, RunnerStepDelta, RunnerMovedEvent, frame records, journal, fixture, additive host snapshot
```

## Service breakdown

```txt
createEventBus()
  service: event publish/subscribe plus recent history snapshot

createDomainHost()
  service: install and snapshot domain kits

createTickScheduler()
  service: future tick orchestration scaffold

createDinoPoseDomainKit()
  service: accepts runner.moved and emits dino.pose.changed

createTerrain()
  service: stream terrain chunks and sample height

populate()
  service: instantiate objects and rebuild collider/pickup state

createPhysics()
  service: bridge external Rapier kit into local runtime

loop(now)
  service: live runner mutation and baseline render cycle

startPresentationPass()
  service: current post-hoc camera/HUD/pose readability consumer

PrehistoricRushHost.getState()
  service: browser state readback without structured presentation proof
```

## Kits identified

```txt
Implemented:
- domain-runtime/event-bus
- domain-runtime/domain-host
- domain-runtime/tick-scheduler
- dino-form-domain-kit
- dino-pose-domain-kit
- dino-material-domain-kit
- dino-domain-bundle
- camera-domain-kit
- hud-domain-kit

External:
- rapier-physics-domain-kit

Inline/product-implied:
- runtime-shell-kit
- legacy-visual-runtime-kit
- runner-input-kit
- runner-motion-kit
- terrain-stream-kit
- spawn-population-kit
- contact-kit
- pickup-kit
- scene-dispatch-kit
- score-kit
- raptor-render-adapter-kit
- presentation-consumer-kit
- host-readback-kit

Next-cut:
- runner-source-state-kit
- runner-step-delta-kit
- runner-moved-event-kit
- presentation-events-kit
- dino-pose-frame-kit
- camera-frame-request-kit
- hud-frame-request-kit
- contact-result-snapshot-kit
- scene-dispatch-result-kit
- render-readback-kit
- presentation-frame-record-kit
- presentation-journal-kit
- host-presentation-snapshot-kit
- DOM-free-presentation-fixture-kit
```

## Main architecture finding

The correct next architecture move is not extraction. It is a source/consumer bridge that records what the legacy runtime already does.

The first implementation should be additive and should leave legacy state mutation in place while capturing source state, deltas, emitted movement, pose output, camera/HUD requests, contact/scene decisions, and render readback into serializable records.

# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-09T15-20-00-04-00`

## Summary

`PrehistoricRush` is a static browser infinite runner that currently combines a small repo-local DSK scaffold in `src/game.js` with a live monolithic Three.js/Rapier route in `src/runtime-terrain-v6.mjs`.

This pass keeps implementation source unchanged and refreshes the next implementation boundary: add a presentation event bridge that makes movement, pose, camera, HUD, contact, scene, render, and presentation host state fixture-readable.

## Selection result

```txt
No checked non-excluded Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root .agent/START_HERE.md state.

PrehistoricRush was selected as the oldest eligible central-ledger fallback after TheOpenAbove had already been updated to 2026-07-09T15-09-09-04-00.

TheCavalryOfRome remains excluded by rule.
```

## Current repo route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

`index.html` is a static shell. `src/runtime.mjs` imports `src/game.js`. `src/game.js` installs the repo-local DSK scaffold, then imports `runtime-terrain-v6.mjs` and starts a presentation pass.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> PrehistoricRushComposition.snapshot() becomes available
  -> composition.ready event emits
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit
  -> shell() builds DOM host, status panel, and start button
  -> setup() creates scene, camera, renderer, terrain, raptor, rocks, shards, and five tree pools
  -> state() creates runner state with position, jump, yaw, speed, distance, best, shards, colliders, pickups, time, and turn
  -> populate() fills terrain-adjacent tree, rock, shard, collider, and pickup instances
  -> input handlers mutate app.input and scene start state
  -> loop(now) mutates movement, jump, terrain, physics actor, contacts, pickups, scene, and score inline
  -> baseline runtime applies camera, HUD, raptor pose, and renderer pass
  -> src/game.js presentation pass applies close camera, readable stride, HUD rewrite, and a second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Domains in use

```txt
static-browser-shell
runtime-entry
composition-domain-host
event-bus-history
tick-scheduler-scaffold
dino-form-descriptor
dino-pose-descriptor
dino-material-descriptor
camera-descriptor
hud-descriptor
legacy-three-rapier-runtime
rapier-physics-bridge
terrain-height-sampler
terrain-chunk-rebuild
spawn-population
instanced-tree-pools
rock-collider-population
shard-pickup-population
runner-input-state
runner-motion-state
jump-gravity-state
contact-detection
scene-dispatch
score-distance-progress
legacy-camera-consumer
legacy-hud-consumer
legacy-raptor-pose-consumer
presentation-camera-pass
presentation-hud-pass
presentation-stride-pass
host-state-projection
planned-runner-source-state
planned-runner-step-delta
planned-runner-moved-event
planned-pose-readback
planned-camera-frame-request
planned-hud-frame-request
planned-contact-result-snapshot
planned-scene-dispatch-result
planned-render-readback
planned-presentation-frame-record
planned-presentation-journal
planned-host-presentation-snapshot
planned-DOM-free-fixture-gate
```

## Services that kits offer

```txt
createEventBus() -> on, emit, and snapshot with recent event history.
createDomainHost() -> domain install, domain lookup, and snapshot.
createTickScheduler() -> future tick service around the domain host and event bus.
createDinoFormDomainKit() -> dino form descriptor.
createDinoPoseDomainKit() -> runner.moved consumer and dino.pose.changed producer.
createDinoMaterialDomainKit() -> material descriptor for the dino.
createCameraDomainKit() -> camera descriptor scaffold.
createHudDomainKit() -> HUD descriptor scaffold.
createPhysics() -> external Rapier kit configure/register/step/snapshot bridge.
createTerrain() -> terrain chunk creation, height sampling, and chunk update.
populate() -> instanced tree/rock/shard placement and collider/pickup state refresh.
applyReadableStride() -> direct rig pose consumer, currently not source-recorded.
applyCloseCamera() -> direct Three camera consumer, currently not source-recorded.
renderHud() -> direct DOM HUD consumer, currently not source-recorded.
PrehistoricRushComposition.snapshot() -> repo-local DSK scaffold snapshot.
PrehistoricRushHost.getState() -> legacy browser readback without presentation proof state.
```

## Kits identified

```txt
Implemented repo-local kits:
- domain-runtime/event-bus
- domain-runtime/domain-host
- domain-runtime/tick-scheduler
- dino-form-domain-kit
- dino-pose-domain-kit
- dino-material-domain-kit
- dino-domain-bundle
- camera-domain-kit
- hud-domain-kit

External live kit:
- rapier-physics-domain-kit from NexusRealtime-ProtoKits CDN

Runtime-implied product kits:
- prehistoric-static-shell-kit
- prehistoric-runtime-entry-kit
- prehistoric-legacy-visual-runtime-kit
- runner-input-kit
- runner-motion-kit
- runner-terrain-stream-kit
- runner-spawn-population-kit
- runner-contact-kit
- runner-pickup-kit
- runner-scene-dispatch-kit
- runner-score-kit
- raptor-render-adapter-kit
- presentation-camera-consumer-kit
- presentation-hud-consumer-kit
- presentation-raptor-stride-consumer-kit
- render-readback-kit
- host-state-projection-kit

Next-cut proof kits:
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

## Main finding

`PrehistoricRush` should not receive visual expansion, terrain rewrite, movement rewrite, renderer extraction, or ProtoKit promotion next.

The blocker is source/consumer proof: `runtime-terrain-v6.mjs` mutates live app state directly, `src/game.js` performs a second presentation consumer pass, and the existing `dino-pose-domain-kit` already knows how to consume `runner.moved`, but the live runner never emits stable `RunnerMovedEvent` records.

## Next safe ledge

```txt
PrehistoricRush Presentation Event Bridge Fixture Freeze + Host Readback Gate
```

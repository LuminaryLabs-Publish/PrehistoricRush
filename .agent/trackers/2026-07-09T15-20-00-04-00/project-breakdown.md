# Project Breakdown: PrehistoricRush Presentation Event Bridge Fixture Freeze

**Timestamp:** `2026-07-09T15-20-00-04-00`

## Goal

Break down `LuminaryLabs-Publish/PrehistoricRush`, update repo-local `.agent` docs, identify the interaction loop, domains, services, and kits, and sync the central `LuminaryLabs-Dev/LuminaryLabs` ledger.

## Checklist

```txt
[x] Read accessible LuminaryLabs-Publish repo list.
[x] Excluded TheCavalryOfRome.
[x] Compared checked repos against central LuminaryLabs-Dev/LuminaryLabs tracking.
[x] Selected one repo only: PrehistoricRush.
[x] Read PrehistoricRush .agent state.
[x] Read central PrehistoricRush repo ledger.
[x] Read README.md.
[x] Read src/runtime.mjs.
[x] Read src/game.js.
[x] Read src/runtime-terrain-v6.mjs.
[x] Read src/domain-runtime/event-bus.js.
[x] Read src/domains/dino/dino-pose-domain-kit.js.
[x] Identified interaction loop.
[x] Identified domains in use.
[x] Identified kit services.
[x] Identified implemented, external, inline, and target kits.
[x] Updated required root .agent docs.
[x] Added architecture, render, gameplay, presentation-authority, and deploy audits.
[x] Added timestamped tracker and turn ledger.
[x] Updated central repo ledger.
[x] Added central internal change-log entry.
[ ] Did not edit runtime source.
[ ] Did not run local/browser validation.
```

## Selection result

No checked non-Cavalry Publish repo was fully new, missing from the central ledger, missing sampled root `.agent` state, recently added but undocumented, or otherwise undocumented.

`PrehistoricRush` was selected as the oldest eligible central-ledger fallback after `TheOpenAbove` was observed updated to `2026-07-09T15-09-09-04-00` and `PrehistoricRush` still pointed at `2026-07-09T12-00-36-04-00`.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit
  -> shell builds DOM host/status/start controls
  -> setup builds scene/camera/renderer/terrain/raptor/rocks/shards/tree pools
  -> state creates mutable runner state
  -> populate fills terrain-near instances, colliders, and pickups
  -> input mutates control flags
  -> loop mutates speed, yaw, jump, distance, terrain, colliders, pickups, contacts, scene, score, camera, HUD, raptor pose, and renderer frame inline
  -> src/game.js presentation pass mutates raptor stride, camera, HUD, and renderer again
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer fields
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
createDomainHost() -> domain install and domain snapshot.
createTickScheduler() -> future tick orchestration scaffold.
createDinoFormDomainKit() -> dino form descriptor.
createDinoPoseDomainKit() -> runner.moved consumer and dino.pose.changed producer.
createDinoMaterialDomainKit() -> dino material descriptor.
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
Implemented repo-local:
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

Runtime-implied:
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

`PrehistoricRush` should not get visual expansion, renderer extraction, terrain rewrite, movement rewrite, or ProtoKit promotion next.

The blocker is source/consumer proof. `runtime-terrain-v6.mjs` mutates live app state directly and `src/game.js` applies a second presentation consumer pass. The existing `dino-pose-domain-kit` already consumes `runner.moved`, but the live runner does not emit stable `RunnerMovedEvent` records.

## Next safe ledge

```txt
PrehistoricRush Presentation Event Bridge Fixture Freeze + Host Readback Gate
```

## Validation

Docs-only pass. Runtime source was not changed, local validation was not run, browser smoke was not run, no branch or PR was created, and updates were pushed to `main`.

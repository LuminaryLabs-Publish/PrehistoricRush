# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-09T09-10-50-04-00`

## Summary

`PrehistoricRush` is a static browser infinite runner that currently combines a small repo-local DSK scaffold in `src/game.js` with a live monolithic Three.js/Rapier route in `src/runtime-terrain-v6.mjs`.

This pass keeps implementation source unchanged and refreshes the next implementation boundary: add a central-ledger host event proof bridge that makes movement, pose, camera, HUD, contact, scene, render, and presentation host state fixture-readable.

## Selection result

```txt
No checked non-excluded Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root .agent/START_HERE.md state.

PrehistoricRush was selected because central tracking was stale versus repo-local .agent state and it remained the oldest eligible central-sync candidate.

TheCavalryOfRome remains excluded by rule.
```

## Current repo route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

`index.html` is a static shell that loads `src/runtime.mjs`. `src/runtime.mjs` only imports `src/game.js`. `src/game.js` installs the DSK scaffold and then imports `runtime-terrain-v6.mjs`.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDNs
  -> create DOM shell and Start button
  -> create Three.js scene, terrain, raptor, rocks, tree pools, shards, camera, renderer
  -> menu waits for Start / Enter / Space
  -> keydown/keyup mutate app.input
  -> game loop mutates speed, yaw, jump, distance, terrain chunks, colliders, pickups, scene, and score inline
  -> runtime-terrain-v6 renders baseline raptor/camera/HUD frame
  -> game.js presentation pass mutates rig, close camera, HUD, and renders a second frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
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
camera-preset-domain
hud-preset-domain
presentation-pass-domain
three-render-host-domain
rapier-physics-bridge-domain
terrain-streaming-domain
terrain-height-sampling-domain
spawn-population-domain
runner-motion-domain
runner-input-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
host-readback-domain
presentation-fixture-target-domain
central-ledger-sync-domain
```

## Services offered by current kits

```txt
createEventBus: on / emit / snapshot with recent event history
createDomainHost: idempotent install / get / tick / snapshot
createTickScheduler: requestAnimationFrame-backed host ticking scaffold
createDinoFormDomainKit: dino form descriptor
createDinoPoseDomainKit: runner.moved consumer and dino.pose.changed emitter
createDinoMaterialDomainKit: dino material descriptor
createDinoDomainBundle: dino form/pose/material bundle descriptor
createCameraDomainKit: close third-person camera preset descriptor
createHudDomainKit: readability HUD descriptor and projection service
rapier-physics-domain-kit: external Rapier world bridge, kinematic actor, contacts, snapshot
globalThis.PrehistoricRushComposition.snapshot: composition/domain/event/scheduler readback
globalThis.PrehistoricRushHost.getState: scene/runner/physics/terrain/renderer readback
styleHud: DOM HUD readability styling
renderHud: DOM HUD projection
applyCloseCamera: close camera mutation pass
applyReadableStride: raptor rig readability stride pass
startPresentationPass: secondary presentation render loop
```

## Kits identified

### Implemented repo-local kits

```txt
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domain-runtime/tick-scheduler.js
src/domains/dino/dino-form-domain-kit.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/dino/dino-material-domain-kit.js
src/domains/dino/index.js
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
```

### Live external kit

```txt
https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js
```

### Runtime-implied kits still inline

```txt
prehistoric-static-shell-kit
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
render-readback-kit
host-state-projection-kit
```

## Main blocker

`dino-pose-domain-kit` already listens to `runner.moved`, but the live runtime does not emit `runner.moved`. The visible runner state mutates directly in `runtime-terrain-v6.mjs`, and the presentation pass reads that mutable host state after the fact.

## Next safe ledge

```txt
PrehistoricRush Central Ledger Host Event Proof + Presentation Fixture Gate
```

## Not changed

```txt
No runtime source changed.
No visual route changed.
No movement, collision, terrain, renderer, or physics behavior changed.
No branch was created.
```

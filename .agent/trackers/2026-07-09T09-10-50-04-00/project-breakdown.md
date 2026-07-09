# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-09T09-10-50-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Write target:** `main`

## Selection result

The accessible `LuminaryLabs-Publish` organization repo list was compared against the central `LuminaryLabs-Dev/LuminaryLabs` repo ledger and sampled repo-local `.agent/START_HERE.md` state.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, missing a root `.agent` folder, recently added but undocumented, or otherwise undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

`PrehistoricRush` was selected because the central ledger still pointed at `2026-07-09T06-10-35-04-00`, while repo-local `.agent` state had advanced to `2026-07-09T09-02-44-04-00`. This pass adds a fresh repo-local breakdown and brings the central ledger forward.

## Publish repos checked

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T07-05-52-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T08-50-00-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T06-20-00-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T07-19-41-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / central ledger stale versus repo-local .agent 2026-07-09T09-02-44-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T07-41-29-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T06-28-53-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T08-29-38-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T08-02-33-04-00
```

## Current product read

`PrehistoricRush` is a static browser infinite runner with a repo-local DSK scaffold layered beside a live Three.js/Rapier terrain route.

The visual game currently works, but the host-state proof path is incomplete. The live runner mutates state directly in `src/runtime-terrain-v6.mjs`, while `src/game.js` performs an additional presentation pass for camera/HUD/raptor readability.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDNs
  -> create DOM shell, Three.js scene, terrain, procedural raptor, rocks, trees, shards, camera, renderer
  -> menu waits for Start / Enter / Space
  -> keydown and keyup mutate app.input
  -> game loop mutates speed, yaw, jump, distance, terrain chunks, colliders, pickups, scene, score, and renderer frame inline
  -> baseline runtime mutates raptor pose, camera, HUD DOM, and render frame
  -> src/game.js presentation pass mutates rig stride, close camera, HUD, and renders a second frame
  -> globalThis.PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
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
camera-preset-domain
hud-preset-domain
presentation-pass-domain
three-render-host-domain
rapier-physics-bridge-domain
terrain-streaming-domain
terrain-height-sampling-domain
spawn-population-domain
runner-input-domain
runner-motion-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
legacy-host-readback-domain
presentation-proof-domain
presentation-fixture-target-domain
central-ledger-sync-domain
```

## Services that kits offer

```txt
createEventBus: on / emit / bounded event history snapshot
createDomainHost: install / get / tick / snapshot
createTickScheduler: requestAnimationFrame domain ticking scaffold
createDinoFormDomainKit: dino form descriptor
createDinoPoseDomainKit: runner.moved consumer and dino.pose.changed emitter
createDinoMaterialDomainKit: dino material descriptor
createDinoDomainBundle: dino form/pose/material bundle descriptor
createCameraDomainKit: close third-person camera preset descriptor
createHudDomainKit: readability HUD descriptor and projection service
rapier-physics-domain-kit: Rapier world bridge / kinematic actor / collider snapshot
globalThis.PrehistoricRushComposition.snapshot: composition/domain/event/scheduler readback
globalThis.PrehistoricRushHost.getState: legacy scene/runner/physics/terrain/renderer readback
styleHud: DOM HUD readability styling
renderHud: DOM HUD content projection
applyCloseCamera: close camera mutation pass
applyReadableStride: raptor rig stride mutation pass
startPresentationPass: secondary presentation frame loop
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
rapier-physics-domain-kit
```

Source URL currently used by runtime:

```txt
https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js
```

### Runtime-implied kits still inline

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
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

### Next-cut proof kits

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-step-delta-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-presentation-events-kit
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
central-ledger-readback-kit
```

## Main finding

`PrehistoricRush` should not receive visual expansion, terrain tuning, renderer extraction, movement rewrite, or ProtoKit promotion next.

The blocker is proof. `dino-pose-domain-kit` already has the right `runner.moved` consumer shape, but the live runner never emits `runner.moved`. The source state, movement deltas, dino pose output, camera request, HUD request, contact result, scene result, render readback, and host projection need a fixture-readable event bridge.

## Next safe ledge

```txt
PrehistoricRush Central Ledger Host Event Proof + Presentation Fixture Gate
```

## Validation status

Documentation-only pass.

No runtime source files changed.

No local checkout, npm install, static server, browser smoke, GitHub Pages smoke, or DOM-free presentation fixture was run.

No branch or PR was created.

All writes targeted `main`.

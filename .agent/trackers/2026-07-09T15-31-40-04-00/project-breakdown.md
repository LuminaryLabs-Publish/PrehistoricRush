# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T15-31-40-04-00`

**Change type:** documentation-only internal audit and central ledger sync.

## Goal

Compare the current Publish org repo set against the central ledger, choose one eligible repo, identify interaction loop/domains/services/kits, update root `.agent` docs, create timestamped tracker/audit docs, and log the result centrally.

## Checklist

```txt
[x] Compare accessible LuminaryLabs-Publish repo list.
[x] Compare checked repos against LuminaryLabs-Dev/LuminaryLabs repo-ledger state.
[x] Exclude LuminaryLabs-Publish/TheCavalryOfRome.
[x] Select one repo: LuminaryLabs-Publish/PrehistoricRush.
[x] Identify interaction loop.
[x] Identify domains in use.
[x] Identify services that kits offer.
[x] Identify implemented, external, runtime-implied, and next-cut kits.
[x] Update root .agent docs.
[x] Add timestamped tracker, turn-ledger, architecture, render, gameplay, presentation-authority, and deploy audits.
[x] Update .agent/kit-registry.json.
[x] Update LuminaryLabs-Dev/LuminaryLabs central repo ledger.
[x] Add central internal change-log entry.
[ ] Runtime source files changed.
[ ] Local validation run.
[ ] Browser validation run.
```

## Selection result

`PrehistoricRush` was selected as the oldest eligible central-ledger fallback and repo-local pointer repair target.

No checked non-Cavalry Publish repo was fully new, central-ledger absent, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`TheCavalryOfRome` remains excluded.

## Publish organization repositories observed

```txt
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T12-08-46-04-00
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T12-30-09-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T14-16-00-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T13-18-48-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T13-38-15-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T14-28-45-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T15-09-09-04-00
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T13-00-37-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central-ledger fallback / central latest 2026-07-09T12-00-36-04-00 / repo-local partial pointer 2026-07-09T15-20-00-04-00 repaired
```

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, pose, material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDNs
  -> create DOM shell and Start button
  -> create Three.js scene, terrain, raptor, rocks, five tree pools, shards, camera, renderer
  -> menu waits for Start / Enter / Space
  -> keydown/keyup mutate app.input
  -> game loop mutates speed, yaw, jump, distance, terrain chunks, colliders, pickups, scene, and score inline
  -> runtime-terrain-v6 renders baseline raptor/camera/HUD frame
  -> game.js presentation pass mutates rig, close camera, HUD, and renders a second frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Domains recorded

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
legacy-three-rapier-runtime-domain
rapier-physics-bridge-domain
terrain-streaming-domain
terrain-height-sampling-domain
terrain-chunk-rebuild-domain
spawn-population-domain
instanced-tree-pool-domain
rock-collider-population-domain
shard-pickup-population-domain
runner-input-domain
runner-motion-domain
jump-gravity-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
legacy-camera-consumer-domain
legacy-hud-consumer-domain
legacy-raptor-pose-consumer-domain
presentation-camera-pass-domain
presentation-hud-pass-domain
presentation-stride-pass-domain
host-readback-domain
presentation-event-ledger-domain
presentation-frame-record-domain
presentation-fixture-target-domain
central-ledger-sync-domain
```

## Services recorded

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
createTerrain: chunk grid, height sampler, update/rebuild service
populate: procedural instance placement, collider registration, pickup refresh
makeRaptor / animateRaptor: procedural raptor render adapter
applyReadableStride: second-pass rig readability mutation
applyCloseCamera: second-pass close camera mutation
renderHud: second-pass DOM HUD projection
PrehistoricRushComposition.snapshot: composition/domain/event/scheduler readback
PrehistoricRushHost.getState: scene/runner/physics/terrain/renderer readback
```

## Kits recorded

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
rapier-physics-domain-kit from LuminaryLabs-Agents/NexusRealtime-ProtoKits@main CDN
```

### Runtime-implied kits

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
central-ledger-readback-kit
```

### Next-cut proof kits

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

## Main finding

The game is playable and has the right local DSK scaffold, but the live runner still does not emit fixture-readable movement facts.

`dino-pose-domain-kit` listens for `runner.moved`, while `runtime-terrain-v6.mjs` directly mutates app state and scene state inline. `src/game.js` then runs a second presentation pass that directly mutates camera, HUD, rig pose, and renderer output without leaving a source-readable frame record.

## Next safe ledge

```txt
PrehistoricRush Presentation Event Bridge Ledger Repair + Host Readback Fixture Gate
```

## Next source files

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
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

## Validation

Documentation-only pass.

Runtime source was not changed.

Local npm validation was not run.

Browser smoke was not run.

No branch or PR was created.

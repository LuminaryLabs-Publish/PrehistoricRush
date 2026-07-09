# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-09T09-02-44-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch target:** `main`

## Goal

Refresh repo-local operating memory for `PrehistoricRush`, compare it against the full accessible `LuminaryLabs-Publish` repo list and central ledger, and define the next source handoff around a host-state event bridge and DOM-free presentation fixture.

## Selection checklist

- [x] Listed accessible `LuminaryLabs-Publish` repos.
- [x] Compared against `LuminaryLabs-Dev/LuminaryLabs` central repo ledgers.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Checked for new, missing, undocumented, recently added, or missing-root-agent candidates.
- [x] Selected one repo only: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Updated root `.agent` docs.
- [x] Added timestamped tracker and turn-ledger entries.
- [x] Added architecture, render, gameplay, presentation-authority, and deploy audits.
- [x] Updated `.agent/kit-registry.json`.
- [x] Updated central repo ledger and internal change log.

## Publish repository comparison

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T07-05-52-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T08-50-00-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T06-20-00-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T07-19-41-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central latest 2026-07-09T06-10-35-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T07-41-29-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T06-28-53-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T08-29-38-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T08-02-33-04-00
```

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> create DOM shell, scene, camera, renderer, terrain, raptor, tree pools, rocks, shards, and physics actor
  -> wait for Start / Enter / Space
  -> keydown/keyup mutate app.input
  -> live loop mutates runner position, speed, yaw, jump, terrain, collisions, pickups, scene, and score inline
  -> baseline route renders raptor/camera/HUD
  -> src/game.js presentation pass mutates readable stride, close camera, HUD, and second renderer frame
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
spawn-population-domain
runner-motion-domain
runner-input-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
host-readback-domain
presentation-fixture-target-domain
```

## Kit services

```txt
createEventBus: subscribe, emit, snapshot recent event history
createDomainHost: install domains idempotently, get, tick, snapshot
createTickScheduler: requestAnimationFrame tick scaffold
dino-form-domain-kit: dino body descriptor
dino-pose-domain-kit: consumes runner.moved and emits dino.pose.changed
dino-material-domain-kit: dino material descriptor
dino-domain-bundle: bundle descriptor for dino domains
camera-domain-kit: close third-person camera preset descriptor
hud-domain-kit: readability HUD descriptor and projection service
rapier-physics-domain-kit: external Rapier actor/contact/snapshot bridge
PrehistoricRushComposition.snapshot: composition/domain/event/scheduler readback
PrehistoricRushHost.getState: legacy scene/runner/physics/terrain/renderer readback
```

## Kits identified

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
external rapier-physics-domain-kit via jsDelivr
inline runtime-terrain-v6 motion / terrain / collision / render / scene kits
planned src/presentation/* host-state event bridge kits
```

## Main finding

The DSK scaffold exists, but the live runtime still bypasses it for the most important proof path. `dino-pose-domain-kit` is ready to consume `runner.moved`; `runtime-terrain-v6.mjs` does not emit that event, and `PrehistoricRushHost.getState()` does not expose a presentation journal.

## Next safe ledge

```txt
PrehistoricRush Host-State Event Bridge + Presentation Fixture Gate
```

## Validation

This was a docs-only pass. No runtime source changed. No local checkout, browser run, GitHub Pages run, fixture script, or npm validation was performed.

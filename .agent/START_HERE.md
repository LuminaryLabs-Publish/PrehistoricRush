# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T06-21-03-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current ledge

```txt
PrehistoricRush Runner Event Host Fixture Refresh + DOM-Free Presentation Gate
```

## Read first

```txt
.agent/trackers/2026-07-10T06-21-03-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T06-21-03-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-10T06-21-03-04-00-runner-event-host-fixture-dsk-map.md
.agent/render-audit/2026-07-10T06-21-03-04-00-presentation-render-host-readback-gap.md
.agent/gameplay-audit/2026-07-10T06-21-03-04-00-runner-event-proof-loop.md
.agent/presentation-authority-audit/2026-07-10T06-21-03-04-00-runner-event-journal-contract.md
.agent/deploy-audit/2026-07-10T06-21-03-04-00-dom-free-runner-event-fixture-gate.md
```

## What this repo is

`PrehistoricRush` is a static browser infinite runner.

It has a repo-local event-bus/domain-host DSK wrapper around the live runner, plus dino, camera, and HUD domain kits.

The live terrain runner still bypasses the event-proof path and host presentation readback.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit subscribes to runner.moved
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDN
  -> create shell, HUD panel, Start button, terrain chunks, raptor rig, instanced rocks, shards, tree pools, camera, and renderer
  -> Start button, Enter, or Space transitions menu to game
  -> keydown/keyup mutate app.input flags
  -> frame loop mutates speed, turn, yaw, jump, position, distance, terrain, contacts, pickups, best distance, scene, raptor pose, camera, HUD, and renderer
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and a second render submission
  -> PrehistoricRushHost.getState() returns scene, runner, physics, terrain chunk count, and renderer label
```

## Main finding

Do not start with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner event and host presentation proof.

`dino-pose-domain-kit` already listens for `runner.moved`, but the live runner never emits stable `RunnerMovedEvent` records. The host also lacks a presentation journal, render readback rows, and fixture-readable frame records.

## Next safe work

Add the pure movement/presentation/readback layer first:

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/movement-result-row.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/pickup-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/best-distance-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-runner-event-fixture.mjs
```

## Current validation state

Docs only. Runtime source did not change. No branch or PR was created. No local/browser/fixture validation was run because fixture files and root package validation do not exist yet.

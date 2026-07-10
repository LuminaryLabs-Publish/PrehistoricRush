# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T13-30-15-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current ledge

```txt
PrehistoricRush Runner Source Event Readback Ledger Refresh + DOM-Free Host Fixture Gate
```

## Read first

```txt
.agent/trackers/2026-07-10T13-30-15-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T13-30-15-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-10T13-30-15-04-00-runner-source-event-readback-dsk-map.md
.agent/render-audit/2026-07-10T13-30-15-04-00-presentation-render-source-event-gap.md
.agent/gameplay-audit/2026-07-10T13-30-15-04-00-runner-event-source-loop.md
.agent/interaction-audit/2026-07-10T13-30-15-04-00-keyboard-input-source-result-map.md
.agent/presentation-authority-audit/2026-07-10T13-30-15-04-00-host-source-event-readback-contract.md
.agent/deploy-audit/2026-07-10T13-30-15-04-00-dom-free-source-event-fixture-gate.md
```

## What this repo is

`PrehistoricRush` is a static browser infinite runner with a repo-local event-bus/domain-host DSK wrapper around a live Three.js/Rapier terrain runner.

The route is playable, but the live runner still does not produce source-owned event/result rows for fixture readback.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit subscribes to runner.moved and emits dino.pose.changed
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDN
  -> create shell, HUD panel, Start button, terrain chunks, raptor rig, rocks, shards, trees, camera, and renderer
  -> Start button, Enter, or Space transitions menu to game
  -> keydown/keyup mutate app.input flags
  -> frame loop mutates speed, turn, yaw, jump, position, distance, terrain, contacts, pickups, best distance, scene, raptor pose, camera, HUD, and renderer
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and a second render submission
  -> PrehistoricRushHost.getState() returns aggregate scene, runner, physics, terrain count, and renderer label
```

## Main finding

Do not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner source event readback: the dino pose kit waits for `runner.moved`, but the live runner never emits stable `RunnerMovedEvent` rows, and the host does not expose fixture-readable input, movement, contact, pickup, scene, best-distance, pose, camera, HUD, or render rows.

## Next safe work

Add a source-ledger/readback layer first:

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/input-result-row.js
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
scripts/prehistoric-rush-runner-source-event-fixture.mjs
```

## Current validation state

Docs only. Runtime source did not change. No branch or PR was created. No package validation or browser smoke was run because the DOM-free runner source event fixture and root package validation do not exist yet.

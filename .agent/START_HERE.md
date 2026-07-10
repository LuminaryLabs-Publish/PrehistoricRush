# START HERE: PrehistoricRush

**Last aligned:** `2026-07-09T23-58-41-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Current ledge:** `PrehistoricRush Movement Event Journal + Presentation Fixture Gate`

## Read first

```txt
.agent/trackers/2026-07-09T23-58-41-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-09T23-58-41-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-09T23-58-41-04-00-movement-event-journal-dsk-map.md
.agent/render-audit/2026-07-09T23-58-41-04-00-presentation-render-readback-gap.md
.agent/gameplay-audit/2026-07-09T23-58-41-04-00-runner-movement-result-loop.md
.agent/presentation-authority-audit/2026-07-09T23-58-41-04-00-event-journal-host-contract.md
.agent/deploy-audit/2026-07-09T23-58-41-04-00-dom-free-movement-fixture-gate.md
```

## What this repo is

`PrehistoricRush` is a static browser infinite runner. The route has a useful DSK scaffold, but the live runner still bypasses the event-proof path.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and external rapier-physics-domain-kit from CDNs
  -> shell creates DOM host, HUD, and Start button
  -> menu waits for click, Enter, or Space
  -> keydown/keyup mutate app.input
  -> loop mutates speed, turn, yaw, jump, position, distance, terrain, contacts, pickups, score, scene, raptor pose, camera, HUD, and renderer
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and a second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain chunks, and renderer string
```

## Main finding

Do not start with visual expansion, terrain rewrite, movement retune, renderer extraction, or ProtoKit promotion.

The blocker is movement event proof. `dino-pose-domain-kit` listens for `runner.moved`, but the live runner never emits stable `RunnerMovedEvent` records. The host also lacks a presentation journal and fixture-readable frame records.

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
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Current validation state

Docs only. Runtime source did not change. No branch or PR was created. No local/browser/fixture validation was run because fixture files and root package validation do not exist yet.

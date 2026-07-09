# START HERE: PrehistoricRush

**Last aligned:** `2026-07-09T19-29-23-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Current ledge:** `PrehistoricRush Presentation Host Fixture Refresh + DOM-Free Event Bridge Gate`

## Read first

```txt
.agent/trackers/2026-07-09T19-29-23-04-00/project-breakdown.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
```

## What this repo is

`PrehistoricRush` is a static browser infinite runner. The current playable route is still a Three.js/Rapier runtime with a repo-local DSK scaffold wrapped around it.

The useful source boundary is already visible:

```txt
src/game.js
  -> creates event bus, domain host, and tick scheduler
  -> installs dino, camera, and HUD domain kits
  -> exposes PrehistoricRushComposition.snapshot()
  -> imports src/runtime-terrain-v6.mjs
  -> applies a secondary presentation pass

src/runtime-terrain-v6.mjs
  -> owns the live runner, terrain, Rapier bridge, raptor rig, pickups, contacts, scene dispatch, HUD, and renderer
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
  -> load Three.js, Rapier, and external rapier-physics-domain-kit from CDNs
  -> create shell, terrain, raptor, instanced rocks/trees/shards, camera, renderer, and input state
  -> Start / Enter / Space moves menu to game
  -> keydown and keyup mutate app.input
  -> game loop mutates speed, yaw, jump, distance, terrain, contacts, pickups, scene, score, camera, HUD, and renderer inline
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and a second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Main finding

Do not start with visual expansion, terrain rewrite, movement rewrite, renderer extraction, or ProtoKit promotion.

The blocker is presentation proof. `dino-pose-domain-kit` listens for `runner.moved`, but the live runner never emits stable `RunnerMovedEvent` records. `PrehistoricRushHost.getState()` also does not expose a presentation journal or fixture-readable frame records.

## Next safe work

Add the pure presentation/event/readback layer first:

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

## Current validation state

Docs only. Runtime source did not change. No branch or PR was created. No local/browser/fixture validation was run because the fixture files and root package script do not exist yet.

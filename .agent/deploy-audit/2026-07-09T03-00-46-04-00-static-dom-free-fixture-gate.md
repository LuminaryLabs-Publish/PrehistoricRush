# PrehistoricRush Static DOM-free Fixture Gate

**Timestamp:** `2026-07-09T03-00-46-04-00`

## Current deploy shape

`PrehistoricRush` is currently a static browser route.

There is no root `package.json`, so this repo should not be treated as an npm app until a source pass intentionally adds tooling.

Current launch path:

```txt
python3 -m http.server 4173
open http://localhost:4173/
```

## Static route checks

```txt
index.html exists
index.html loads ./src/runtime.mjs
src/runtime.mjs imports ./game.js
src/game.js imports ./runtime-terrain-v6.mjs
src/runtime-terrain-v6.mjs loads Three.js from CDN
src/runtime-terrain-v6.mjs loads Rapier from CDN
src/runtime-terrain-v6.mjs loads rapier-physics-domain-kit from CDN
```

## Next fixture gate

The next implementation should add a DOM-free fixture script before any browser-dependent integration is trusted:

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

The script should import only pure `src/presentation/*` modules and repo-local domain kits that do not require browser APIs.

## Required fixture assertions

```txt
- RunnerSourceState is serializable.
- RunnerStepDelta is serializable.
- No movement emits no runner.moved event.
- Positive distance delta creates runner.moved event.
- runner.moved payload is accepted by dino-pose-domain-kit update contract.
- eventBus receives runner.moved.
- dino-pose-domain-kit emits dino.pose.changed.
- DinoPoseFrame records pose readback.
- CameraFrameRequest records policy data without mutating a Three.js camera.
- HudFrameRequest records policy data without mutating the DOM.
- ContactResultSnapshot can record hazard and pickup decisions without runtime colliders.
- SceneDispatchResult can record menu/game/run-over/win transitions.
- RenderReadback can record renderer path strings without WebGL.
- PresentationFrameRecord combines source, delta, event, dino, camera, HUD, contact, scene, and render facts.
- Host presentation projection keeps legacy fields out of mutation scope.
```

## Recommended validation commands after source files exist

```bash
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
python3 -m http.server 4173
```

Browser console checks:

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
globalThis.PrehistoricRushHost?.getState?.().presentation
```

## Do not add next

```txt
Do not add package.json just for this docs pass.
Do not create a branch.
Do not add CI until the pure fixture exists.
Do not require WebGL for the source-authority fixture.
Do not make the fixture depend on localStorage, window, document, canvas, Three.js, or Rapier.
```
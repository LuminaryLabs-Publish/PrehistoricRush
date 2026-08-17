# PrehistoricRush

Standalone additive game repo for a NexusEngine-powered infinite runner.

## Current focus

PrehistoricRush is being structured around multi-scene loading first:

```txt
menu -> game -> run-over -> win -> menu
```

The product repo should stay thin. Reusable behavior should move into NexusEngine core kits or ProtoKits.

## Deployment

GitHub Pages deploys from the `main` branch on every push using `.github/workflows/deploy-pages.yml`.

The workflow uploads the static repository root, so `index.html`, `src/runtime.mjs`, scene manifests, and JSON tuning files are all deployed together.

## Current playable shell

- `index.html` — semantic browser shell.
- `src/runtime.mjs` — thin Canvas runtime that imports NexusEngine from CDN, loads manifests, runs scene transitions, and renders the first runner slice.

Controls:

```txt
A / Left Arrow  = move left
D / Right Arrow = move right
Space / Up      = jump / start / retry
Enter           = start
```

Debug surface:

```js
PrehistoricRushHost.getState()
```

## Current manifests

- `game-scenes.json` — scene graph and transition map.
- `scenes/menu.json` — menu scene manifest.
- `scenes/game.json` — infinite runner scene manifest.
- `scenes/run-over.json` — run-over result scene manifest.
- `scenes/win.json` — win result scene manifest.
- `runner-tuning.json` — movement, camera, streaming, and feel tuning.
- `flock-generation.json` — sky-agent/flock generation descriptor.
- `kit-composition.json` — NexusEngine core-kit dependency sketch.
- `kit-cutover-inventory.json` — cutover decisions for current product-side behavior.
- `RUNNER_RESEARCH.md` — algorithm and animation notes.

## Core kits targeted

- `createCoreSkyboxKit`
- `createCoreSceneKit`
- `createCoreInputKit`
- `createCoreMotionKit`
- `createCoreCameraKit`
- `createCoreGraphicsKit`
- `createCoreAnimationKit`
- `createCoreUIKit`
- `createCoreDiagnosticsKit`
- `createCoreCompositionKit`

## First missing ProtoKit

- `run-movement-kit`

## Current limitation

The runner is playable but still uses product-side temporary logic for segment streaming, collision, and flock motion. Those should be cut over according to `kit-cutover-inventory.json` so PrehistoricRush becomes only a scene/data/renderer shell.

## Visual quality

The production renderer now defaults to the high-fidelity Three.js path on capable desktop devices. It includes layered procedural terrain and trail materials, tree bark/leaf shading, foliage transmission, multi-frequency wind, streamed forest-floor detail, adaptive resolution, clouded sky, canopy light shafts, contact AO, bloom, sharpening, and filmic grading.

Quality can be selected explicitly:

```txt
game.html?quality=performance
game.html?quality=balanced
game.html?quality=high
game.html?quality=cinematic
```

`renderer=webgpu` explicitly selects the unified GPU path; high and cinematic modes otherwise retain the richer WebGL2 presentation.

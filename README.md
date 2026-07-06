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
- `RUNNER_RESEARCH.md` — algorithm and animation notes.

## Core kits targeted

- `createCoreSkyboxKit`
- `createCoreSceneKit`
- `createCoreInputKit`
- `createCoreMotionKit`
- `createCoreCameraKit`
- `createCoreGraphicsKit`
- `createCoreDiagnosticsKit`

## Planned ProtoKits

- `runner-scenes-domain-kit`
- `runner-segments-domain-kit`
- `runner-feel-domain-kit`
- `sky-flock-domain-kit`

## Current limitation

The runner is playable but still uses product-side temporary logic for segment streaming, collision, and flock motion. Those should be extracted into ProtoKits next so PrehistoricRush becomes only a scene/data/renderer shell.

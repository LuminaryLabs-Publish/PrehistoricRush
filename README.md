# PrehistoricRush

Standalone additive game repo for a NexusEngine-powered prehistoric infinite runner.

## Current focus

PrehistoricRush is structured around this playable flow:

```txt
menu -> game -> run-over -> win -> menu
```

The product repo should stay thin. Reusable behavior should move into NexusEngine core kits or ProtoKits.

## Playable result

The character-selection page is `menu.html`. Its card is used only to choose the dinosaur and start a run.

The actual race is `game.html`, and it is the primary result validated and deployed to GitHub Pages.

The race scene contains:

- a procedural prehistoric track;
- the selected dinosaur running on the track;
- steering, boost, jump, and restart input;
- camera follow;
- race HUD;
- Nexus World Foundation terrain;
- streamed terrain and forest patches;
- seeded scenery and route data.

## Deployment

`.github/workflows/deploy.yml` is the only Pages deployment workflow. It validates `main`, captures browser framebuffer evidence, stages the validated site, deploys GitHub Pages, smoke-tests the deployed URLs, and runs the pinned NexusEngine-Editor Headless lifecycle.

Evidence-only commits under `.agent/evidence/**` do not retrigger the validation workflow.

## Validation order

```txt
deterministic contracts
→ world-update verification
→ browser framebuffer screenshots
→ character movement and camera proof
→ streamed terrain/forest proof
→ Pages deployment and smoke tests
→ NexusEngine-Editor Headless lifecycle
```

The world-update gate proves that movement changes the Nexus World focus, updates the active patch plans, retains the terrain ring and forest patches, and produces no terrain streaming holes.

## Runtime entry points

- `menu.html` — character-selection entry point.
- `game.html` — live playable race entry point.
- `src/game-runtime-semantic-v2.js` — Nexus World, course, player, camera, HUD, and renderer composition.
- `src/pages/game.js` — game-page loader.
- `tests/browser-visual-validation.mjs` — framebuffer and live-race validation.
- `tests/world-update-verification.mjs` — deterministic patch-plan update validation.
- `tests/headless-editor-evidence.mjs` — final Headless Editor evidence gate.

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

The runner remains product-owned in a few gameplay and presentation areas. The current validation boundary does not claim physical Mac performance from CI software rendering; it proves deterministic behavior, browser behavior, deployment, and Headless evidence.

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

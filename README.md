# PrehistoricRush

Standalone additive game repo for a NexusEngine-powered prehistoric infinite runner.

## Current focus

PrehistoricRush is structured around this playable flow:

```txt
menu -> game -> run-over -> win -> menu
```

The product repo should stay thin. Reusable behavior should move into NexusEngine core kits or ProtoKits.

## Playable result

The character-selection page is `menu.html`. All twelve racers run continuously on the live oval selection circuit. Choosing a racer updates the selected character, signature move, passive, persisted selection, and race URL without despawning the other eleven menu racers.

The actual race is `game.html`, and it is the primary result validated and deployed to GitHub Pages.

The race scene contains:

- a procedural prehistoric track;
- the selected racer running on the track with profile-owned movement, stamina, camera, active ability, passive, and procedural presentation;
- steering, boost, jump, and restart input;
- camera follow;
- race HUD;
- Nexus World Foundation terrain;
- streamed terrain and forest patches;
- seeded scenery and route data.

## Deployment

`.github/workflows/deploy.yml` is the repository's only GitHub Actions workflow. It packages the current `main` branch and deploys it directly to GitHub Pages without running tests or validation gates.

Every push to `main` triggers a fresh Pages deployment.

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
W / Up Arrow    = boost
Space           = jump / start / retry
Enter           = start
E               = active racer ability
```

## Live roster

The playable roster is Tyrannosaurus rex, Velociraptor, Triceratops, Stegosaurus, Spinosaurus, Ankylosaurus, Pachycephalosaurus, Carnotaurus, Gallimimus, Therizinosaurus, Brachiosaurus, and Pteranodon.

Every racer uses the same normalized controller intent (`steer`, `boost`, `jump`, `ability`) and owns one active ability plus one passive trait through an immutable `RacerProfile`. Speed uses the shared low / normal / high rating model. Stamina may limit ability timing, but never disables movement or steering.

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

## Reviewed Triceratops candidate

The guided procedural Triceratops is available as an explicit review variant:

```txt
assets/models/candidates/
├── manifest.json
├── triceratops-guided-v1.glb
└── evidence/
    ├── triceratops-reference-comparison.png
    └── triceratops-validation.json

src/services/
└── racer-model-service.js
```

Open `game.html?racer=triceratops&model=reviewed-candidate` to load it through the normal race asset path. It remains labeled `reviewed-candidate`; the existing rigged model stays the production default because the candidate still needs user art approval and has no rig or animation clips. Its procedural AST and generator are maintained in `LuminaryLabs-Dev/NexusFactory-Kits`, not this game repository.

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

The current procedural body service uses a shared topology with racer-specific proportions, scale, color, camera, pose, and gameplay tuning. Production-quality species-specific body plans remain a separate art/rigging phase. The current validation boundary does not claim physical Mac performance from CI software rendering; it proves deterministic behavior, browser behavior, deployment, and Headless evidence.

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

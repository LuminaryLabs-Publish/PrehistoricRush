# PrehistoricRush

Standalone additive game repo for a NexusEngine-powered infinite runner.

## Current focus

PrehistoricRush is being structured around multi-scene loading first:

```txt
menu -> game -> run-over -> win -> menu
```

The product repo should stay thin. Reusable behavior should move into NexusEngine core kits or ProtoKits.

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

## Demo status

Executable `index.html` / browser JS files could not be pushed by the current tool session, so this repo currently contains the scene/data architecture and manifests rather than a live playable app shell.

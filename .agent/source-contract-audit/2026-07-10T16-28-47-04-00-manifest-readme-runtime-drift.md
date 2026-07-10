# Source contract audit: manifest, README, and runtime drift

Timestamp: `2026-07-10T16-28-47-04-00`

## Declared sources

```txt
README.md
game-scenes.json
scenes/*.json
runner-tuning.json
kit-composition.json
kit-cutover-inventory.json
```

## Live sources

```txt
index.html
src/runtime.mjs
src/game.js
src/runtime-terrain-v6.mjs
repo-local domain kit files
external Three.js / Rapier / physics-kit CDN modules
localStorage best-distance key
```

## Drift

```txt
README says runtime loads manifests; live runtime does not
game-scenes.json declares menu/retry/run-again transitions; live runtime hardcodes scene strings
runner-tuning.json is not the live tuning authority; runtime constants are
README describes A/D as lateral movement; live runtime changes yaw
README advertises menu return paths; live runtime has no menu command after boot
manifest declares NexusEngine core kits; live route uses repo-local kits and an external physics ProtoKit
```

## Required source manifest

Expose one JSON-safe runtime source block:

```txt
runtimeVersion
entryFiles
consumedManifests
ignoredManifests
tuningAuthority
sceneAuthority
kitSources
externalVersions
sourceFingerprint
```

The next implementation should either consume the existing manifests or explicitly mark them as legacy/non-authoritative. Silent drift should not continue.

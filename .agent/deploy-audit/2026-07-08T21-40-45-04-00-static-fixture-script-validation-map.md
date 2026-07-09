# Deploy Audit — Static Fixture Script Validation Map

**Timestamp:** `2026-07-08T21-40-45-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Current deploy shape

`PrehistoricRush` is a static browser repo. The README describes GitHub Pages deployment from `main`, with the static repository root uploaded.

The current source read shows no root `package.json`, so validation should not invent npm scripts for this repo.

## Validation constraints

```txt
root package.json: absent at this pass
runtime source changed: no
fixture source files: absent at this pass
browser execution: not performed in this docs-only pass
WebGL/Rapier execution: not performed in this docs-only pass
branch created: no
pull request created: no
```

## Next fixture script

Add this file during the implementation pass:

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

The script should import only pure `src/presentation/*` modules and repo-local domain kits needed for consumer verification.

It should not require:

```txt
DOM
canvas
WebGL
Three.js
Rapier
localStorage
network
GitHub Pages
```

## Future validation command

```bash
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

Only after the fixture exists, optionally run a local static route check:

```bash
python3 -m http.server 4173
# open http://localhost:4173/
```

## Browser console checks after implementation

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
globalThis.PrehistoricRushHost?.getState?.().presentation
```

## Required deploy-safe guarantees

```txt
index.html remains the entrypoint
src/runtime.mjs remains the route loader
src/game.js remains importable by runtime.mjs
src/runtime-terrain-v6.mjs remains imported by src/game.js
current CDN imports remain untouched during the source-manifest implementation
PrehistoricRushHost.getState() remains backward compatible
new presentation snapshot is additive
fixture script can run without browser APIs
```

## Stop condition

The next implementation can be considered deploy-safe only when:

```txt
node scripts/prehistoric-rush-presentation-frame-fixture.mjs passes
browser route still starts at index.html
Start Rush still enters game scene
keyboard movement still works
run-over and win scenes are not broken
PrehistoricRushHost.getState().presentation exists
legacy fields remain present
```
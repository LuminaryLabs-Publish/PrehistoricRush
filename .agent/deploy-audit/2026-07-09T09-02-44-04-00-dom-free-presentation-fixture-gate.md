# Deploy Audit: DOM-Free Presentation Fixture Gate

**Timestamp:** `2026-07-09T09-02-44-04-00`

## Current deploy read

`index.html` statically imports `src/runtime.mjs`, which imports `src/game.js`. The live route does not require a build step in the current source read.

A root `package.json` was not found during this pass.

## Current validation reality

```txt
local checkout: not run
npm install: not run
npm run check: not available in current source read
static server: not run
browser smoke: not run
GitHub Pages smoke: not run
fixture script: not present yet
```

## Fixture to add next

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Fixture constraints

```txt
must run without DOM
must run without Three.js
must run without Rapier
must import pure src/presentation modules
must assert stable shape for source state, deltas, events, pose frame, camera request, HUD request, contact result, scene dispatch, render readback, journal, and host projection
must prove legacy host fields remain additive and unchanged
```

## Suggested future validation command

If a root `package.json` is added intentionally:

```txt
npm run check
```

If no package file is added:

```txt
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Deploy rule

Do not change the static route or GitHub Pages behavior as part of the presentation proof pass unless the fixture requires an explicit package script. The first implementation should stay source-additive and route-safe.

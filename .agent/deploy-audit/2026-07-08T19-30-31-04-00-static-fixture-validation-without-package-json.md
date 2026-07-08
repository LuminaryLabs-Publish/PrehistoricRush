# PrehistoricRush Static Fixture Validation Without package.json

**Timestamp:** `2026-07-08T19-30-31-04-00`

## Scope

Deploy/validation audit for the current repo state.

The root has no `package.json` at the time of this pass, so the next fixture should not assume `npm run check`, `npm test`, or build scripts.

## Current deploy facts

```txt
- README.md says GitHub Pages deploys from main through .github/workflows/deploy-pages.yml.
- README.md says the workflow uploads the static repository root.
- The route is expected to be static: index.html -> src/runtime.mjs -> src/game.js -> src/runtime-terrain-v6.mjs.
- The runtime imports external CDN modules for Three.js, Rapier, and rapier-physics-domain-kit.
```

## Validation implication

```txt
source fixture first: node scripts/prehistoric-rush-presentation-frame-fixture.mjs
static route smoke second: python3 -m http.server 4173
browser console third: PrehistoricRushComposition.snapshot() and PrehistoricRushHost.getState()
```

## Fixture requirements

```txt
- Must run with Node only.
- Must not require DOM.
- Must not require WebGL.
- Must not import Three.js.
- Must not import Rapier.
- Must not require npm scripts.
- Must print a deterministic pass/fail summary.
```

## Stop line

Do not add package manager ceremony only for this proof layer.

If a future implementation adds `package.json`, it should be because the repo needs durable scripts, not because the docs pass assumed them.

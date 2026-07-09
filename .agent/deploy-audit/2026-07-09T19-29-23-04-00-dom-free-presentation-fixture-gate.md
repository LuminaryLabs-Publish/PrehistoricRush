# Deploy Audit: DOM-Free Presentation Fixture Gate

**Timestamp:** `2026-07-09T19-29-23-04-00`

## Current validation state

```txt
root package.json: not found
npm validation script: unavailable
browser smoke: not run
DOM-free presentation fixture: unavailable
GitHub Pages smoke: not run
runtime source changed: no
```

## Current route state

`index.html` loads `src/runtime.mjs`, which imports `src/game.js`, which installs the DSK scaffold, imports `src/runtime-terrain-v6.mjs`, and starts the secondary presentation pass.

## Gate needed before deploy confidence

The next safe validation gate is not a browser-only smoke. It is a DOM-free presentation fixture that proves the source facts before route consumption.

Required fixture entry:

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

Required package surface after the fixture exists:

```json
{
  "scripts": {
    "check": "node scripts/prehistoric-rush-presentation-frame-fixture.mjs"
  }
}
```

Only add the package script once the fixture file and source modules are present.

## Acceptance rows

```txt
imports pure presentation modules in Node
creates deterministic runner source state
applies step delta rows
emits runner.moved event records
projects dino pose frame
projects camera frame request
projects HUD frame request
projects contact result snapshot
projects scene dispatch result
builds presentation frame record
builds host presentation snapshot
asserts legacy host fields remain compatible by shape
```

## Deferred deploy work

```txt
Pages smoke
browser route screenshot
performance budget
renderer extraction
asset optimization
CDN replacement
```

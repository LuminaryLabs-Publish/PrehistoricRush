# Deploy Audit — DOM-free Fixture Gate

**Timestamp:** `2026-07-09T18-11-58-04-00`

## Current deploy surface

`PrehistoricRush` is a static browser app loaded through `index.html` and `src/runtime.mjs`.

The repo does not currently expose a root `package.json`, so this pass did not verify `npm run check` or `npm run build`.

## Current validation gap

There is no DOM-free presentation fixture yet.

## Next deploy gate

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
  -> imports only pure presentation source modules
  -> does not require DOM
  -> does not require WebGL
  -> does not require Three.js
  -> does not require Rapier
  -> proves menu, movement, turn, boost, jump, pickup, collision, win, render readback, and host legacy fields
```

## Package-script note

Only add a package validation script after the fixture exists. Do not create a placeholder package script that cannot prove the presentation event bridge.

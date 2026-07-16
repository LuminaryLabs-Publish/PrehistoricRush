# Deploy Audit — Impostor Angle Fixture Gate

**Timestamp:** `2026-07-16T12-47-00-04-00`

## Summary

Pages deployment now runs `npm test`, but the tree-fidelity test is source-text validation. It does not execute atlas decoding, camera-angle selection, texture addressing, or rendered-pixel checks.

## Current gate

```txt
push main
  -> npm test
  -> stage static files
  -> upload Pages artifact
  -> deploy
```

## Missing executable rows

```txt
far azimuth sweep: unavailable
far elevation sweep: unavailable
horizon view fixture: unavailable
atlas rectangle/row fixture: unavailable
decoded ImageBitmap -> THREE.Texture fixture: unavailable
form crossfade + frame selection fixture: unavailable
source/artifact/Pages visual parity: unavailable
```

## Required gate

- Run a browser fixture with deterministic camera/tree/package state.
- Capture all eight far azimuths at both supported elevations.
- Verify selected frame IDs and atlas rectangles.
- Verify horizon behavior.
- Verify no undecoded texture admission.
- Compare source, staged `_site`, and deployed Pages results.
- Preserve screenshots, result JSON, commit SHA, artifact ID, and deployed URL.

## Checklist

- [x] `npm test` is required before Pages staging.
- [x] Runtime image-decode wiring is source-checked.
- [ ] Browser selection fixture exists.
- [ ] Rendered-pixel evidence exists.
- [ ] Artifact and Pages parity is proven.
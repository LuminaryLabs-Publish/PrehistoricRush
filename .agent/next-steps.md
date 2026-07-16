# PrehistoricRush Next Steps

**Audit:** `2026-07-16T12-47-00-04-00`  
**Authority:** `prehistoric-rush-tree-impostor-view-frame-addressing-authority-domain`

## Summary

Keep the implemented generation, transition, decode, and render-admission path. Add exact view-vector frame resolution and prove it through real rendered pixels.

## Intent

Select each far or horizon impostor from captured frame metadata rather than inferred atlas layout.

## What needs to happen

### Phase 1: Normalize capture frames

- [ ] Publish a stable `frameId` for every captured frame.
- [ ] Preserve azimuth, elevation, atlas rectangle, observation, content hash, and generation ID.
- [ ] Validate frame uniqueness and atlas bounds when the package is admitted.

### Phase 2: Resolve view

- [ ] Derive camera-to-tree azimuth and elevation in one coordinate convention.
- [ ] Resolve the nearest captured frame or an explicitly supported blend.
- [ ] Keep horizon behavior explicit instead of reusing far assumptions.
- [ ] Publish `TreeImpostorFrameSelectionResult`.

### Phase 3: Bind rendering

- [ ] Create batches keyed by exact frame identity, not only angle index.
- [ ] Use the selected frame rectangle for texture repeat and offset.
- [ ] Reject stale package generations and missing frame records.
- [ ] Preserve current hysteresis and dither-crossfade behavior.

### Phase 4: Receipts and diagnostics

- [ ] Expose selected frame IDs and elevation bands in diagnostics.
- [ ] Add stale/missing-frame counters.
- [ ] Publish `FirstExactImpostorFrameAck` after the matching frame renders.

### Phase 5: Proof

- [ ] Add azimuth sweep fixtures.
- [ ] Add low/high camera elevation fixtures.
- [ ] Add atlas rectangle and row-address fixtures.
- [ ] Add far/horizon transition fixtures.
- [ ] Run `npm test`.
- [ ] Run source, staged artifact, and Pages visual parity fixtures.

## Checklist

- [x] Exact generation identity implemented in source.
- [x] Four forms, hysteresis, and crossfade implemented in source.
- [x] Required atlas decoding and decoded-image admission implemented in source.
- [ ] Exact capture-frame addressing implemented.
- [ ] Executable visual proof completed.
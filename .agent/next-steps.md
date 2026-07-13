# PrehistoricRush Next Steps

**Audit:** `2026-07-13T00-58-50-04-00`  
**Authority:** `prehistoric-rush-game-viewport-surface-authority-domain`

## Summary

The next implementation should replace direct `innerWidth`/`innerHeight` and startup-only DPR handling with one measured, bounded and revisioned viewport transaction applied by the Three.js host.

## Plan ledger

**Goal:** make camera projection, CSS canvas size, drawing-buffer size, DPR and quality policy agree for every admitted surface revision.

### Phase 1: Identity and measurement

- [ ] Add runtime session, surface ID, viewport command ID and viewport revision.
- [ ] Measure the actual game host with `getBoundingClientRect()` and `ResizeObserver`.
- [ ] Record measurement source and sequence.

### Phase 2: DPR and budget policy

- [ ] Re-sample DPR for every relevant environment change.
- [ ] Define raw DPR, effective DPR, cap and total-pixel budget.
- [ ] Bind shadow/quality policy to the surface revision.

### Phase 3: Admission and commit

- [ ] Reject non-finite, stale and duplicate candidates.
- [ ] Defer zero-size candidates while preserving the predecessor.
- [ ] Prepare camera and renderer candidates before mutation.
- [ ] Commit one `ViewportSurfaceCommitResult` or typed rejection/rollback.

### Phase 4: Host application

- [ ] Apply camera aspect and projection from the committed candidate.
- [ ] Apply renderer CSS size, drawing-buffer size and effective DPR from the same candidate.
- [ ] Coalesce rapid resize observations and reject stale delivery.

### Phase 5: Observation

- [ ] Expose committed and applied viewport state through `PrehistoricRushHost`.
- [ ] Publish `FirstViewportFrameAck` with CSS size, buffer size, DPR, aspect and fingerprint.
- [ ] Correlate viewport revision with render and simulation frame IDs.

### Phase 6: Fixtures

- [ ] Host-only resize.
- [ ] DPR-only change and DPR cap.
- [ ] Zero size then restore.
- [ ] Rapid resize coalescing and stale predecessor rejection.
- [ ] Pixel-budget downgrade.
- [ ] Camera/canvas/drawing-buffer parity.
- [ ] Source, built output and Pages parity.

## Completion gate

Do not mark the authority implemented until one committed viewport revision governs camera, CSS canvas and drawing buffer; invalid candidates have zero partial effects; DPR changes are admitted explicitly; and the first visible frame cites the committed surface fingerprint.
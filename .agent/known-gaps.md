# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T06-39-10-04-00`  
**Status:** `authoritative-player-pose-publication-central-reconciled`  
**Technical status:** `authoritative-player-pose-implemented-static-proof`

## Summary

The renderer no longer creates animation truth, but the authoritative target pose and the visibly damped pose are not connected by one revisioned frame contract.

## Plan ledger

**Goal:** keep every unresolved pose identity, lifecycle, presentation and proof gap explicit while preserving the implemented PlayerPose ownership path.

### Target-pose frame gaps

- [ ] `PlayerPose` stores only the inner pose, not the articulated frame envelope.
- [ ] No stored run ID, run generation, tick ID or frame number.
- [ ] No rig revision or source-state fingerprint.
- [ ] No predecessor pose-frame ID or monotonic pose revision.
- [ ] No typed stale, duplicate, invalid or solve-failure result.

### Publication gaps

- [ ] No atomic `PlayerPoseFrameCommitResult`.
- [ ] Missing-pose behavior leaves predecessor renderer bones in place implicitly.
- [ ] Public snapshots expose the target pose but not its frame provenance.
- [ ] Detached compatibility APIs remain available without an explicit non-authoritative classification.

### Presentation gaps

- [ ] Render-time damping has no presentation generation.
- [ ] Damping policy and sharpness are not revisioned evidence.
- [ ] Applied alpha is not exposed.
- [ ] Visible bone transforms or fingerprints are not exposed.
- [ ] The visible skeleton can differ from the stored target without a derivation receipt.
- [ ] No first visible player-pose frame acknowledgement.

### Restart and lifecycle gaps

- [ ] Run restart replaces target pose but does not reset or fence prior Three.js bone state.
- [ ] No authored Snap versus Transition result.
- [ ] No stale predecessor RAF/pose rejection.
- [ ] No rig-change rebuild result.
- [ ] No large-delta pose presentation classification.

### Test gaps

- [ ] New source-marker test was not independently executed in this run.
- [ ] No engine/domain execution of the authoritative solve path.
- [ ] No clone-isolation mutation fixture.
- [ ] No initial/start/tick pose revision fixture.
- [ ] No failed/stale solve fixture.
- [ ] No restart damping fixture.
- [ ] No 30/60/120/144 Hz presentation comparison.
- [ ] No browser, build or Pages visible-pose fixture.

## Retained gaps

Collision-source convergence still lacks one collider revision and comparison result. The browser-input adapter still bypasses installed Core Input. Viewport and runtime-retirement authority also remain unresolved.

## Non-claims

The current code proves a source-backed ownership correction, not complete pose-frame provenance, restart isolation, visible-pose equivalence, render-rate parity or deployed behavior.
# PrehistoricRush Known Gaps

**Audit:** `2026-07-16T12-47-00-04-00`  
**Status:** `tree-impostor-view-frame-addressing-authority-audited`

## Summary

Tree generation, four-form transitions, atlas decoding, and decoded-image renderer admission are implemented in source. Exact view-angle frame addressing and real visual proof remain incomplete.

## Intent

Keep the capture-to-render contract explicit until each billboard proves which captured frame it used.

## What needs to happen

### Frame identity

- [ ] Captured frame records have no product-level stable frame result.
- [ ] Selected trees do not retain exact far/horizon frame identity.
- [ ] Frame identity is not included in the startup or visible-frame receipt.

### View resolution

- [ ] Runtime selection uses camera azimuth only.
- [ ] Camera elevation is not used.
- [ ] Far capture elevations `[0, 12]` are collapsed to one base-elevation group.
- [ ] Horizon view semantics are not independently validated.

### Atlas addressing

- [ ] Material creation assumes a uniform column sequence.
- [ ] Texture Y offset assumes one atlas row instead of using the selected frame record.
- [ ] Atlas frame rectangles are not bound directly to batches.
- [ ] Missing or inconsistent frame metadata has no typed result.

### Receipts and proof

- [ ] No `TreeImpostorFrameSelectionResult` exists.
- [ ] No `FirstExactImpostorFrameAck` exists.
- [ ] Current tests inspect source wiring rather than rendered frame selection.
- [ ] No camera-elevation, atlas-row, staged artifact, or Pages visual fixture exists.

## Retained gaps

WebGL recovery, Worker liveness, game audio, accessibility, host-clock pacing, terrain ownership and LOD, creator settlement, feedback, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart, browser lifecycle, and prior tree-fidelity audit history remain separate retained families.
# PrehistoricRush Next Steps

**Audit:** `2026-07-13T06-39-10-04-00`  
**Authority:** `prehistoric-rush-player-pose-frame-provenance-authority-domain`

## Summary

The ownership correction is complete at the target-pose level. Next work should retain articulated solve identity, make renderer smoothing explicitly derived, generation-fence restarts and prove the first visible skeleton frame.

## Plan ledger

**Goal:** move from a bare authoritative pose object to a revisioned target/presentation frame contract without moving animation truth back into rendering.

### Phase 1: Pose-frame envelope

- [ ] Replace bare `PlayerPose` contents with `PlayerPoseFrame`.
- [ ] Retain run ID, run generation, tick ID, frame and rig revision.
- [ ] Retain source-state fingerprint and articulated solve metadata.
- [ ] Add predecessor pose-frame ID and monotonic revision.

### Phase 2: Typed solve results

- [ ] Add `PlayerPoseSolveCommand` identity and expected revisions.
- [ ] Return Accepted, Duplicate, Stale, Invalid or Failed.
- [ ] Preserve the accepted predecessor on non-accepted results.
- [ ] Publish bounded solve observations.

### Phase 3: Presentation derivation

- [ ] Add a presentation-pose generation owned by the Three.js adapter.
- [ ] Make damping policy versioned and explicit.
- [ ] Publish `PresentationPoseFrame` with source pose-frame ID and applied alpha.
- [ ] Add bounded visible-bone fingerprint/readback.

### Phase 4: Restart and discontinuities

- [ ] Increment pose and presentation generations on run restart.
- [ ] Choose authored Snap or Transition behavior for successor runs.
- [ ] Reject predecessor callbacks and pose frames.
- [ ] Force snap/rebuild on rig revision changes.
- [ ] Classify large-delta and missing-pose behavior.

### Phase 5: Public observation

- [ ] Distinguish simulation target pose from visible presentation pose in `PrehistoricRushHost`.
- [ ] Keep readback clone-safe and capability-bounded.
- [ ] Publish `VisiblePlayerPoseFrameAck` after the matching Three.js submission.

### Phase 6: Fixtures

- [ ] Execute initial/start/tick pose-frame identity tests.
- [ ] Prove deterministic source-state-to-pose changes.
- [ ] Prove clone isolation.
- [ ] Prove stale and failed solve predecessor preservation.
- [ ] Prove restart generation and damping policy.
- [ ] Compare 30/60/120/144 Hz presentation behavior.
- [ ] Run clean-checkout `npm test`, browser, build and Pages smokes.

## Retained priorities

Collision-source convergence, Core Input adoption, viewport authority and browser-runtime retirement remain unresolved. The new PlayerPose path should be preserved while those independent boundaries are addressed.

## Completion gate

Do not mark pose-frame provenance complete until every accepted target pose identifies its run/tick/frame/rig revision, every presentation frame cites one target frame, restart state cannot leak silently, and the first visible skeleton frame is acknowledged.
# Render Audit: Collision Decision Visible-Frame Gap

**Timestamp:** `2026-07-13T03-13-09-04-00`

## Summary

The renderer consumes the committed run state and can show a run-over frame, but it cannot identify which collision source, collider revision or decision result caused that state.

## Plan ledger

**Goal:** bind the first visible failure frame to the exact canonical collision decision committed by simulation.

- [x] Trace simulation commit to creature, camera, Three.js render and HUD projection.
- [x] Confirm public readback includes physics but not fallback/comparison evidence.
- [x] Record missing render and collision provenance.
- [ ] Add visible-frame acknowledgement after runtime implementation.

## Current path

```txt
Core Physics contacts + fallback candidate
  -> implicit physics-first resolution
  -> run state becomes run-over
  -> adapter.render(state, dt)
  -> HUD says run-over
  -> no collision decision ID or collider revision on frame
```

## Missing frame evidence

```txt
runtime session
runId
tickId
simulation revision
collision evaluation ID
collision decision ID
canonical source
collider ID
collider-set revision and fingerprint
agreement/disagreement classification
render frame ID
first visible outcome-frame acknowledgement
```

## Required acknowledgement

```txt
CollisionOutcomeFrameAck {
  runtimeSessionId,
  runId,
  tickId,
  simulationRevision,
  collisionDecisionId,
  colliderSetRevision,
  colliderId,
  canonicalSource,
  renderFrameId,
  visibleStatus: "run-over"
}
```

## Non-claim

No visual defect is asserted. The gap is missing provenance and proof that the displayed failure frame corresponds to one admitted collision decision.
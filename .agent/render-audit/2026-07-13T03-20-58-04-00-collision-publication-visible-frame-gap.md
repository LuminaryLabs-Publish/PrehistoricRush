# Render Audit: Collision Publication Visible-Frame Gap

**Timestamp:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

The rendered run-over state cannot identify which collision source, collider revision or comparison result caused it.

## Plan ledger

**Goal:** bind the first visible collision outcome to the exact committed collision decision.

- [x] Trace committed run state into creature, camera, world and HUD rendering.
- [x] Confirm public readback exposes physics but not fallback or comparison evidence.
- [x] Define required render admission and acknowledgement fields.
- [ ] Implement visible-frame receipts later.

## Current gap

```txt
physics or fallback hit
  -> gameplay resolution
  -> terminal run state
  -> Three.js and HUD render
  -> no collisionDecisionId
  -> no colliderSetRevision
  -> no sourceComparison
  -> no firstVisibleFrameAck
```

## Required render contract

```txt
RenderCollisionOutcomeCommand
  -> require committed run revision and CollisionDecisionResult
  -> require matching collider-set revision
  -> project fail state and HUD
  -> render
  -> publish CollisionOutcomeFrameAck
```

The acknowledgement should include frame ID, run revision, collision decision ID, collider-set revision, canonical source policy and visible surface set.

# Interaction Audit: Collider Evidence Decision Publication Map

**Timestamp:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

The player interaction appears as one tree impact, but internally it crosses streaming, physics, fallback, gameplay and rendering without one end-to-end transaction identity.

## Plan ledger

**Goal:** map every interaction boundary and require a terminal receipt at each handoff.

- [x] Map patch activation to collider publication.
- [x] Map candidate player motion to both evidence sources.
- [x] Map evidence to gameplay resolution and visible projection.
- [ ] Add identities, receipts and stale rejection later.

## Handoff map

```txt
PatchActivationResult
  -> ActiveColliderSetCommitResult
  -> PhysicsColliderApplicationReceipt
  -> FallbackColliderApplicationReceipt

PlayerMotionCandidate
  -> CollisionEvaluationCommand
  -> PhysicsCollisionEvidenceResult
  -> FallbackCollisionEvidenceResult
  -> CollisionSourceComparisonResult
  -> CollisionDecisionResult
  -> RunResolutionReceipt
  -> CollisionOutcomeFrameAck
```

Every handoff must cite the same runtime session, run, tick, player candidate and collider-set revision.

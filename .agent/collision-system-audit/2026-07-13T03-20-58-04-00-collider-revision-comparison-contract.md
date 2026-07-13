# Collision System Audit: Collider Revision and Source Comparison Contract

**Timestamp:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

The same logical tree collider is represented by streamed descriptors, Rapier/Core Physics state and fallback radial math. The code has no proof that those representations are current or semantically equivalent.

## Plan ledger

**Goal:** make representation parity and stale-generation safety explicit.

- [x] Identify the three collider representations.
- [x] Identify current source-specific semantics.
- [x] Define parity and retirement invariants.
- [ ] Implement comparison fixtures later.

## Required contract

```txt
ColliderSetRevision
  id
  generation
  predecessor
  fingerprint
  activePatchRevisions
  descriptorCount
  committedAtTick

CollisionEvidence
  evaluationId
  source
  runId
  tickId
  candidateTransformId
  colliderSetRevision
  colliderId
  hit
  geometrySemantics
  thresholdSemantics
```

## Required parity cases

- same tree, both sources hit
- same tree, both sources miss
- physics hit and fallback miss
- fallback hit and physics miss
- collider released between publication and evaluation
- provider unavailable with explicit fallback degradation
- jump-height threshold boundary
- duplicate evaluation

# Interaction Audit: Collision Evidence Admission and Result Map

**Timestamp:** `2026-07-13T03-13-09-04-00`

## Summary

Collision evidence enters Core Simulation as independent observations without a shared command, collider revision or typed comparison result.

## Plan ledger

**Goal:** convert implicit observation precedence into explicit admission, normalization, comparison and one terminal decision result.

- [x] Identify current producers and consumer.
- [x] Record missing identities and rejection semantics.
- [x] Define accepted, degraded, disagreement and stale outcomes.
- [ ] Implement command/result APIs later.

## Current map

```txt
physics observation
  id: <tick>:physics
  type: physics.frame
  value: Core Physics frame

fallback observation
  id: <tick>:fallback-collision
  type: prehistoric-rush.fallback-collision
  value: hit/kind/collider/source

resolution
  -> first fatal physics contact
  -> otherwise first fallback hit
  -> no comparison result
```

## Required map

```txt
ColliderSetCommitResult
  -> CollisionEvaluationCommand
  -> source-policy admission
  -> PhysicsCollisionEvidenceResult
  -> FallbackCollisionEvidenceResult
  -> source identity and revision validation
  -> candidate normalization
  -> CollisionSourceComparisonResult
  -> CollisionDecisionResult
     accepted-hit
     accepted-no-hit
     degraded-source
     disagreement
     stale-rejected
     invalid-rejected
  -> outcome commit
  -> visible-frame acknowledgement
```

## Zero-mutation rejection

Evidence must not mutate run state when it cites a stale run, tick, player candidate, collider set or released patch generation. Duplicate evaluation IDs must return the original result or an explicit duplicate result.

## Observation requirements

Public diagnostics should expose bounded metadata for both sources and the canonical result without exposing mutable provider internals.
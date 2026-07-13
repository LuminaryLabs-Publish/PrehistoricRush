# Gameplay Audit: Collision Source Precedence Reconciliation Loop

**Timestamp:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

Gameplay currently encodes collision authority as control-flow order: fatal physics evidence wins; fallback is consulted only when physics does not fail.

## Plan ledger

**Goal:** replace implicit precedence with one typed, testable policy result without changing intended gameplay semantics accidentally.

- [x] Record current physics-first ordering.
- [x] Preserve pickup and goal precedence as part of the required decision.
- [x] Identify disagreement and degradation cases.
- [ ] Implement explicit policy and fixtures later.

## Current loop

```txt
candidate run state
  -> fatal physics contact?
      yes: fail
      no: fallback radial hit?
          yes: fail
          no: pickups and goal resolution
```

## Missing gameplay results

```txt
both sources agree on same collider
sources disagree
source unavailable
source stale
collider identity mismatch
duplicate evaluation
canonical policy version
```

A single `CollisionDecisionResult` should carry the final classification and be the only collision input accepted by the run-resolution policy.

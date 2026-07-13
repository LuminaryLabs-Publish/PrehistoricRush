# Architecture Audit: Collision Source Convergence DSK Map

**Timestamp:** `2026-07-13T03-13-09-04-00`

## Summary

Collision ownership is split between Core Physics/Rapier, a browser fallback sampler and the product resolution policy. A product-level coordinating authority is required; neither Core Physics nor the renderer should own gameplay outcome semantics.

## Plan ledger

**Goal:** define a narrow parent domain that coordinates collider publication, source evidence and one canonical gameplay decision.

- [x] Preserve Core Physics ownership of provider bodies, colliders, stepping and contact evidence.
- [x] Preserve patch streaming ownership of deterministic collider descriptors and activation.
- [x] Preserve product resolution ownership of fail/pickup/goal precedence.
- [x] Keep Three.js as presentation only.
- [x] Define collision-source convergence as a product coordination boundary.
- [ ] Implement candidate kits and fixtures later.

## Domain boundary

```txt
prehistoric-rush-collision-source-convergence-authority-domain
  owns:
    collision evaluation identity
    collider-set identity, revision and fingerprint
    source enablement and degradation policy
    evidence normalization
    agreement/disagreement classification
    stale evidence rejection
    canonical CollisionDecisionResult
    observation journal
    first visible collision-frame acknowledgement

  coordinates:
    seeded patch controller
    active-content consumer
    Core Physics and Rapier provider
    browser fallback sampler
    Core Simulation resolution policy
    public diagnostics
    Three.js/HUD presentation

  does not own:
    patch generation
    physics integration
    player movement
    route classification
    pickup or goal rules
    renderer implementation
```

## Candidate kits

```txt
collision-session-id-kit
collider-set-id-kit
collider-set-revision-kit
collider-set-fingerprint-kit
collision-evaluation-command-kit
collision-source-policy-kit
physics-collision-evidence-kit
fallback-collision-evidence-kit
collision-candidate-normalization-kit
collision-source-comparison-kit
collision-disagreement-result-kit
stale-collider-evidence-rejection-kit
collision-decision-result-kit
collision-decision-journal-kit
collision-visible-frame-ack-kit
```

## Required transaction

```txt
active collider commit
  -> ColliderSetRevision
  -> CollisionEvaluationCommand
  -> physics/fallback evidence
  -> normalize and compare
  -> reject stale or classify agreement/disagreement
  -> canonical CollisionDecisionResult
  -> Core Simulation outcome commit
  -> first visible outcome-frame acknowledgement
```

## Invariants

- Every accepted source cites the same run, tick, player candidate and collider-set revision.
- Released collider sets cannot affect successor frames.
- Disagreement is explicit and policy-driven.
- Exactly one collision decision is admitted into outcome resolution.
- Public readback identifies the decision shown by the visible frame.
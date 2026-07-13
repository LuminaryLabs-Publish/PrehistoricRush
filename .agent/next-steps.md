# PrehistoricRush Next Steps

**Audit:** `2026-07-13T03-13-09-04-00`  
**Authority:** `prehistoric-rush-collision-source-convergence-authority-domain`

## Summary

The next implementation should give streamed collider publication, Core Physics evidence, fallback evidence and gameplay resolution one shared revisioned contract.

## Plan ledger

**Goal:** produce exactly one canonical collision decision per admitted player candidate and prove the visible outcome frame used it.

### Phase 1: Collider-set identity

- [ ] Add collider-set ID, revision, predecessor and fingerprint.
- [ ] Publish one typed commit result when active patches rebuild colliders.
- [ ] Return application receipts from Core Physics and fallback consumers.
- [ ] Fence released patch and collider generations.

### Phase 2: Evaluation identity

- [ ] Add collision evaluation ID, run ID, tick ID and candidate-transform ID.
- [ ] Bind source-policy revision and enabled-source set.
- [ ] Reject duplicate, stale and cross-run evaluations.

### Phase 3: Typed source evidence

- [ ] Normalize Core Physics contacts into `PhysicsCollisionEvidenceResult`.
- [ ] Replace ad hoc fallback observation with `FallbackCollisionEvidenceResult`.
- [ ] Make both cite the same collider-set revision and candidate transform.
- [ ] Record unavailable, invalid and degraded source states.

### Phase 4: Comparison and canonical decision

- [ ] Compare hit/no-hit, collider identity and source geometry semantics.
- [ ] Publish agreement and disagreement classifications.
- [ ] Define explicit canonical-source and degradation policy.
- [ ] Commit one `CollisionDecisionResult` into fail/pickup/goal precedence.

### Phase 5: Observation and presentation

- [ ] Expose bounded source and comparison metadata through `PrehistoricRushHost`.
- [ ] Add collision decision ID and collider revision to render admission.
- [ ] Publish `CollisionOutcomeFrameAck` for the first matching run-over frame.

### Phase 6: Fixtures

- [ ] Both-source same-tree agreement.
- [ ] Physics-hit/fallback-miss and fallback-hit/physics-miss disagreement.
- [ ] Provider-unavailable fallback degradation.
- [ ] Jump-threshold parity.
- [ ] Patch release and stale evidence.
- [ ] Duplicate evaluation idempotency.
- [ ] Source, built-output and Pages parity.

## Retained priorities

The browser-input/Core Input adoption audit remains unresolved and should keep focus, generation, repeat and typed-command requirements. The viewport, articulation, run-reset and runtime-lifecycle audits also remain active.

## Completion gate

Do not mark collision convergence implemented until all accepted evidence cites one collider-set revision, disagreements are explicit, stale evidence has zero effects, one canonical result controls outcome precedence and the first visible failure frame cites that result.
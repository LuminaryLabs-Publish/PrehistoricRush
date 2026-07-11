# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T05-02-00-04-00`

## Goal

Add one acknowledged patch activation and release transaction so controller state, render state, gameplay state, physics state and height sampling advance or retire together under one revision.

## Immediate safe ledge

```txt
PrehistoricRush Seeded Patch Activation Commit Authority
+ Multi-Consumer Prepare / Commit / Rollback Fixture Gate
```

## Plan ledger

### Phase 0: preserve current ownership

- [ ] Keep `seeded-world-patch-controller-kit` as patch identity, cache and scheduling authority.
- [ ] Keep `instanced-render-batch-kit` as tree-cell capacity and flush authority.
- [ ] Keep `prehistoric-patch-generator` as deterministic content authority.
- [ ] Update existing kits before adding new reusable kits.
- [ ] Do not increase active radius or population while authority is unresolved.

### Phase 1: version and admit patch content

- [ ] Add a product patch schema version and content hash.
- [ ] Validate patch ID, cache key, coordinates and generator identity.
- [ ] Validate terrain array lengths and numeric values.
- [ ] Validate tree descriptors and matrices.
- [ ] Validate grass layers, shard IDs, collider IDs and bounds.
- [ ] Return a typed admission result without mutating consumers.

### Phase 2: replace mutation-first delivery

- [ ] Add non-mutating ready and release candidate reads.
- [ ] Add idempotent activation and release claims.
- [ ] Preserve claim evidence until acknowledged.
- [ ] Reject duplicate claims by returning the prior result.
- [ ] Add stale controller/stream epoch rejection.
- [ ] Keep legacy delivery APIs only for migration compatibility.

### Phase 3: prepare every consumer

- [ ] Preflight terrain-slot availability and target slot identity.
- [ ] Preflight tree trunk and crown batch capacity.
- [ ] Preflight grass-layer capacities and deterministic rejected IDs.
- [ ] Preflight shard capacity and deterministic rejected IDs.
- [ ] Build gameplay and Rapier collider replacement plans.
- [ ] Build the candidate height-source revision.
- [ ] Return one detached `PatchActivationPlan` or `PatchReleasePlan`.

### Phase 4: commit or roll back

- [ ] Commit consumers in a deterministic order.
- [ ] Publish one `consumerRevision` only after all required consumers succeed.
- [ ] Acknowledge controller active only after consumer commit.
- [ ] Acknowledge release only after consumer retirement succeeds.
- [ ] Roll back to the prior committed world on recoverable failure.
- [ ] Enter a visible terminal fault state when rollback cannot be proven.

### Phase 5: publish parity and readiness

- [ ] Publish controller desired, claimed, acknowledged-active and release-candidate IDs.
- [ ] Publish consumer prepared, committed and gameplay-ready IDs.
- [ ] Report exact missing and extra IDs, not only counts.
- [ ] Record first render and first physics acknowledgement for each commit.
- [ ] Add a bounded activation/release journal.
- [ ] Remove live mutable owners from public readback.

### Phase 6: fixture gates

- [ ] Reject malformed terrain before mutation.
- [ ] Reject malformed tree, grass, shard and collider payloads before mutation.
- [ ] Prove deterministic capacity and rejected-ID results.
- [ ] Inject failure at each consumer commit step and prove rollback or terminal fault.
- [ ] Prove duplicate claims do not repeat side effects.
- [ ] Prove release claims remain retriable until acknowledgement.
- [ ] Prove controller-active and consumer-active digests match after movement.
- [ ] Prove stale claims cannot commit after an epoch change.
- [ ] Add browser and Pages streaming smoke.

## Candidate kits

```txt
patch-content-schema-kit
patch-content-admission-kit
patch-consumer-capability-kit
patch-activation-plan-kit
patch-release-plan-kit
terrain-slot-preflight-kit
tree-batch-preflight-kit
dynamic-instance-preflight-kit
patch-collider-preflight-kit
patch-height-preflight-kit
patch-consumer-commit-kit
patch-consumer-rollback-kit
patch-controller-acknowledgement-kit
patch-consumer-revision-kit
patch-activation-result-kit
patch-release-result-kit
patch-parity-observation-kit
patch-activation-journal-kit
patch-activation-fixture-kit
```

## Required future fixture commands

```bash
node scripts/prehistoric-rush-patch-content-admission-fixture.mjs
node scripts/prehistoric-rush-patch-activation-commit-fixture.mjs
node scripts/prehistoric-rush-patch-release-commit-fixture.mjs
node scripts/prehistoric-rush-patch-parity-fixture.mjs
node scripts/prehistoric-rush-patch-failure-rollback-fixture.mjs
```

## Follow-on order

```txt
1. Patch-content admission and acknowledged activation/release.
2. Controller/consumer parity and gameplay-ready observation.
3. Run-session reset and world-cache retention.
4. Worker/stream epochs and stale-result quarantine.
5. Dynamic pickup/collider/height reconciliation.
6. Lifecycle ownership and committed frames.
7. Creature and core-kit consumption authority.
```

## Do not do next

Do not add more content, increase streaming radius, duplicate the official controller, clear caches to hide defects, or treat controller-active state as proof that the rendered and physical world committed.
# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T21-38-52-04-00`  
**Status:** `patch-owned-streaming-adoption-authority-central-reconciled`  
**Technical status:** `patch-owned-streaming-adoption-authority-audited`

## Summary

Patch ownership and changed-range uploads are implemented. Controller membership, terrain, instance cells, physics, pickups and visible presentation still do not share one activation or release transaction.

## Plan ledger

**Goal:** keep every adoption, capacity, rollback, gameplay and proof gap explicit without undoing the incremental streaming refactor.

### Identity and provenance gaps

- [ ] No activation or release command ID.
- [ ] No adapter generation or controller revision in consumer calls.
- [ ] Adapter does not retain the controller patch key.
- [ ] No payload fingerprint or accepted adoption revision.
- [ ] No bounded activation and release journal.

### Atomicity gaps

- [ ] `takeReadyPatches()` marks membership active before adapter adoption.
- [ ] `takeReleasedPatchIds()` clears release intent before retirement settles.
- [ ] Terrain, tree, grass, shard, collider and pickup mutations occur sequentially.
- [ ] No prepare phase or mandatory-consumer validation.
- [ ] No rollback or predecessor restoration after partial failure.
- [ ] No typed `PatchActivationResult` or `PatchReleaseResult`.

### Capacity and degradation gaps

- [ ] Terrain-slot availability is not returned as a result.
- [ ] Tree, grass and shard overflow only emits console warnings.
- [ ] No authored optional-versus-mandatory consumer policy.
- [ ] No patch-level result combines all layer overflow outcomes.
- [ ] No maximum-active-set capacity fixture.

### Physics and gameplay gaps

- [ ] Collider membership is flattened and republished as one aggregate on membership changes.
- [ ] No physics cell-diff or collider revision result.
- [ ] Height sampler can see active patch data before other consumers settle.
- [ ] Collision and pickup samplers cite no patch-membership revision.
- [ ] No policy defines gameplay admission during partial activation.
- [ ] Late Worker results after release or restart have no explicit stale classification.

### Presentation gaps

- [ ] No terrain-slot revision.
- [ ] No renderer submission cites patch activation.
- [ ] No visible patch fingerprint.
- [ ] No first matching visible frame acknowledgement.
- [ ] No last-complete-frame recovery after partial projection failure.
- [ ] Public ownership readback contains counts but not patch keys or consumer revisions.

### Test gaps

- [ ] Current tests were not independently executed in this run.
- [ ] New coverage is source-text validation, not real runtime execution.
- [ ] No real Worker and fallback parity fixture.
- [ ] No WebGL changed-range upload inspection.
- [ ] No Rapier publication or rollback fixture.
- [ ] No fault-injection fixture.
- [ ] No built-output or GitHub Pages parity fixture.

## Retained gaps

Pause-menu lifecycle, player composition, terrain IK coherence, PlayerPose provenance, collision-source convergence, Core Input adoption, viewport authority, articulated presentation and browser-runtime retirement remain unresolved independent boundaries.

## Non-claims

The source proves patch-owned maps, stable instance ranges, changed-range uploads, targeted pickup refresh and isolated collider membership synchronization. It does not prove atomic adoption, rollback, explicit degradation, gameplay parity, visible-frame equivalence, independently passing tests or deployed parity.

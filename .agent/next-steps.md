# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T07-09-49-04-00`

## Summary

Implement one active-content materialization authority after patch activation/release admission. It must coalesce membership changes, budget work, prepare terrain/tree/grass/shard/collider consumers, atomically commit one revision and correlate gameplay, physics, rendering and readback with that revision.

## Plan ledger

**Goal:** remove repeated full-set rebuilds from the streaming frame while preserving deterministic patch content and exact cross-consumer parity.

- [ ] Define `ActiveContentRevision` and canonical patch-set digest.
- [ ] Define aggregate `PatchContentDelta` with releases and activations.
- [ ] Bind commands to runtime generation, run ID and stream epoch.
- [ ] Coalesce release and activation observations before mutation.
- [ ] Define elapsed-time and deterministic work-unit budgets.
- [ ] Derive patch-local terrain slot changes.
- [ ] Derive tree cell replace/release plans.
- [ ] Derive grass matrix additions/removals and compaction policy.
- [ ] Derive shard/pickup additions/removals using collection revision.
- [ ] Derive fixed-collider additions/removals for Rapier and fallback collision.
- [ ] Prepare required consumers without exposing partial state.
- [ ] Validate capacity and overflow before commit.
- [ ] Commit every required consumer under one content revision.
- [ ] Roll back or preserve predecessor on failure.
- [ ] Retire predecessor resources exactly once.
- [ ] Reject stale runtime/run/stream/content plans.
- [ ] Publish detached work, timing, parity and rollback observations.
- [ ] Acknowledge the first visible frame using the committed content revision.
- [ ] Execute deterministic, browser and Pages fixtures.

## Required command

```txt
MaterializationCommand {
  commandId
  runtimeGeneration
  runId
  streamEpoch
  controllerId
  predecessorContentRevision
  releasedPatchIds
  activationCandidates
  observedAt
  workBudget
}
```

## Required result

```txt
MaterializationResult {
  status
  reason
  commandId
  predecessorContentRevision
  committedContentRevision
  releasedPatchIds
  activatedPatchIds
  deferredPatchIds
  workBudget
  workConsumed
  consumerResults
  patchSetDigest
  rollbackResult
  visibleFrameId
}
```

## Ordered queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route/Profile Artifact Proof
2. Creator Draft/Commit/Preview Authority
3. Patch Activation and Release Commit Authority
3a. Active Content Materialization and Coalescing Authority
3b. Shard Identity, Collection and Visible Removal Authority
4. Collider Replacement and Admission
5. Run-Step Outcome and Terminal Frame
6. Stream Cadence and Time Budget
7. World Readiness
8. Committed Frame and Read Model
8a. Public Host Gateway
9. Coordinated Reset Epochs
10. Lifecycle and Disposal
```

## Required fixtures

```txt
single activation delta
single release delta
release plus activation coalescing
multiple release coalescing
no-op membership update
capacity deferral before mutation
full-rebuild fallback admission
consumer prepare failure
consumer commit failure and rollback
stale runtime/run/stream/content rejection
30/60/120 Hz work parity
Worker/fallback generation parity
Rapier/fallback collider digest parity
controller/render/physics patch-set parity
first visible-frame acknowledgement
long traversal budget and retention stability
browser and Pages stream materialization smoke
```

Do not create a second patch controller or independent render membership owner. Convert the current active-content adapter into a consumer of one aggregate controller delta.
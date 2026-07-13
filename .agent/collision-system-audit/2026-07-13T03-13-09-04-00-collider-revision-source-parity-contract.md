# Collision System Audit: Collider Revision and Source Parity Contract

**Timestamp:** `2026-07-13T03-13-09-04-00`

## Summary

The streamed collider descriptors are copied into a host list and synchronized into Core Physics, but the two representations have no shared committed revision or parity receipt.

## Plan ledger

**Goal:** make collider publication and every collision source cite one immutable, fingerprinted collider-set generation.

- [x] Trace patch collider generation and IDs.
- [x] Trace active patch rebuild and Core Physics synchronization.
- [x] Trace fallback and physics evidence production.
- [x] Define revision, parity and retirement requirements.
- [ ] Add runtime implementation and fixtures later.

## Current collider lifecycle

```txt
patch generator
  -> {id, x, y, z, radius, shape:"ball", tags:["hazard","tree"]}
  -> activePatches
  -> rebuild view.colliders
  -> corePhysics.syncColliders(view.colliders)
  -> no ColliderSetCommitResult

patch release
  -> remove active patch
  -> rebuild view.colliders
  -> resync Core Physics
  -> no retirement generation or stale-evidence barrier
```

## Required collider-set contract

```txt
ColliderSetCommitResult {
  colliderSetId,
  revision,
  previousRevision,
  activePatchIds,
  colliderIds,
  descriptorFingerprint,
  physicsApplicationReceipt,
  fallbackApplicationReceipt,
  committedAtTick
}
```

## Source parity contract

Both evidence producers must cite:

```txt
runtimeSessionId
runId
tickId
candidateTransformId
colliderSetId
colliderSetRevision
descriptorFingerprint
sourcePolicyRevision
```

## Disagreement classes

```txt
physics-hit / fallback-hit / same collider
physics-hit / fallback-hit / different collider
physics-hit / fallback-no-hit
physics-no-hit / fallback-hit
both no-hit
source unavailable
stale evidence
invalid evidence
```

## Retirement invariant

Once a collider-set revision is superseded, late contacts or fallback results from that revision must be rejected with zero gameplay effects.

## Required fixtures

- Same tree hit through both sources.
- Physics hit and fallback miss near jump cutoff.
- Fallback hit while provider is unavailable.
- Patch release between candidate and evidence delivery.
- Duplicate and stale evidence.
- Different collider IDs for one candidate.
- Source/build/Pages parity.
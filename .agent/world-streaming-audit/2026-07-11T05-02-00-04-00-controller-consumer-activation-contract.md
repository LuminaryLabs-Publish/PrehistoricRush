# World Streaming Audit: Controller and Consumer Activation Contract

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

The seeded patch controller and product consumers need a two-phase relationship. The controller should own delivery candidates and final scheduling state; the product activation authority should own content admission and multi-consumer commit; final controller active/released state should follow acknowledgement.

## Current controller semantics

```txt
ready delivery:
  remove ready queue entry
  add patch ID to active set
  set record status active
  return patch to host

release delivery:
  remove patch ID from active set during update
  add patch ID to released set
  takeReleasedPatchIds clears released evidence
  return IDs to host
```

## Current host semantics

```txt
activation:
  add host active patch
  mutate terrain
  mutate tree batches
  rebuild dynamic instances
  replace fixed colliders

release:
  delete host active patch
  hide terrain
  release tree cells
  rebuild dynamic instances
  replace fixed colliders
```

Neither side owns a shared transaction result.

## Required controller API direction

```txt
peekReadyPatches({ maximum })
claimReadyPatch(patchId, claimId)
acknowledgeActivation({ patchId, claimId, consumerRevision })
rejectActivation({ patchId, claimId, reason, retryable })
deferActivation({ patchId, claimId, reason })

peekReleaseCandidates()
claimRelease(patchId, claimId)
acknowledgeRelease({ patchId, claimId, consumerRevision })
rejectRelease({ patchId, claimId, reason, retryable })
```

Backward-compatible delivery APIs can remain during migration, but the product route should stop using mutation-first calls once the acknowledgement surface exists.

## Required identities

```txt
controllerId
controllerEpoch
worldSeed
generatorVersion
patchId
cacheKey
requestId
claimId
activationId
streamEpoch
runSessionId
contentHash
consumerRevision
```

## Required parity model

```txt
controller desired active set
controller claimed activation set
controller acknowledged active set
consumer prepared set
consumer committed active set
consumer gameplay-ready set
controller release candidate set
consumer retired set
```

The public parity result should report exact missing and extra IDs rather than only counts.

## Failure policy

```txt
invalid content: reject and journal, do not activate
capacity unavailable: defer or reject by explicit policy
consumer prepare failure: reject without mutation
consumer commit failure: rollback or terminal fault
acknowledgement failure: preserve committed consumer result and retry ack idempotently
release failure: keep release claim retriable and do not discard evidence
stale epoch: quarantine result and preserve current claim
```

## Lifecycle relationship

- Controller reset must not silently abandon claimed activations or releases.
- Executor disposal must reject pending generation requests.
- Run-session reset may retain valid patch content but must re-admit run-owned consumers.
- Remount must restore no active state without a parity transaction.

## Required fixtures

```txt
claim idempotency
activation rejection and retry
commit success plus delayed controller acknowledgement
release rejection and retry
stale claim after controller epoch change
controller and consumer digest parity
reset with pending claims
executor disposal with inflight generation
```

No streaming runtime source changed during this audit.
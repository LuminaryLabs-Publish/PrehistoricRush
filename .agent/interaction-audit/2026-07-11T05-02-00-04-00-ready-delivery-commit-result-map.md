# Interaction Audit: Ready Delivery to Commit Result Map

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

Patch delivery is currently pull-based and mutation-first. The host takes controller ready or released records, losing retriable delivery state, then performs side effects without returning a typed command result.

## Current activation map

```txt
controller.takeReadyPatches(maximum)
  -> ready queue entry removed
  -> controller active set updated
  -> record status set to active
  -> entry returned to host
  -> adapter.activatePatch(entry, state)
  -> side effects only
  -> no result returned
  -> no controller acknowledgement
```

## Current release map

```txt
controller.takeReleasedPatchIds()
  -> released set copied
  -> released set cleared
  -> IDs returned to host
  -> adapter.releasePatches(ids, state)
  -> side effects only
  -> no per-ID result
  -> no controller acknowledgement
```

## Missing interaction objects

```txt
PatchActivationCommand
PatchReleaseCommand
PatchDeliveryClaim
PatchAdmissionResult
PatchConsumerPrepareResult
PatchConsumerCommitResult
PatchConsumerRollbackResult
PatchControllerAcknowledgement
PatchActivationObservation
```

## Required activation result

```txt
{
  commandId,
  activationId,
  patchId,
  cacheKey,
  requestedRevision,
  status,
  reason,
  consumerResults,
  controllerAcknowledged,
  committedRevision,
  firstRenderFrameId,
  firstPhysicsStepId
}
```

## Required status vocabulary

```txt
accepted
rejected-invalid-content
rejected-capacity
rejected-stale-epoch
prepared
committed
rolled-back
faulted
acknowledged
```

## Admission rules

- A ready record must remain claimable until committed, rejected or explicitly deferred.
- One patch can have at most one active activation claim per controller epoch.
- Duplicate claims return the prior result instead of repeating side effects.
- Release claims remain pending until all required consumers retire the patch.
- Stale Worker or run-session results cannot acknowledge a current claim.
- Every transition appends one bounded, JSON-safe journal row.

## Input relationship

Browser controls do not directly activate patches, but player movement changes focus and therefore generates patch commands. The interaction chain is:

```txt
keyboard input
  -> run movement
  -> focus change
  -> desired-set change
  -> activation/release claim
  -> admission and commit result
  -> gameplay-ready world revision
```

## Required host readback

```txt
pendingActivationClaims
pendingReleaseClaims
lastActivationResult
lastReleaseResult
controllerActiveDigest
consumerActiveDigest
parityStatus
boundedJournal
```

No interaction source changed during this audit.
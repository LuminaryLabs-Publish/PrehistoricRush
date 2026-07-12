# Window Host Command Admission Map

**Timestamp:** `2026-07-11T22-29-24-04-00`

## Current interaction

```txt
consumer reads window.PrehistoricRushHost
  -> chooses a raw owner
  -> invokes arbitrary owner method
  -> receives owner-specific return or no result
```

There is no public command envelope, capability list, expected run, epoch fence, duplicate policy, work budget or stable result classification.

## Required interaction

```txt
host.submit({
  commandId,
  capability,
  expectedRunSessionId,
  expectedRunEpoch,
  expectedStreamEpoch,
  expectedColliderEpoch,
  payload
})
  -> schema admission
  -> capability admission
  -> lifecycle and epoch admission
  -> owning-domain dispatch
  -> typed result
  -> bounded journal row
```

## Result classes

```txt
Accepted
RejectedUnsupportedCapability
RejectedInvalidPayload
RejectedWrongLifecycle
RejectedStaleRun
RejectedStaleEpoch
RejectedBudget
Duplicate
Applied
AppliedUncommitted
Failed
```

## Read interaction

```txt
host.getCommittedState()
  -> detached immutable clone
  -> one committed frame ID
  -> one run/stream/collider/Worker/frame epoch set
  -> profile and world fingerprints
  -> no owner handles
```

## Compatibility rule

Existing automation that only calls `getState()` may receive a compatibility adapter, but the result must come from the committed read model. Direct `engine`, `physics`, `adapter`, `patchController` and `cameraFollow` properties must be removed or permanently quarantined.
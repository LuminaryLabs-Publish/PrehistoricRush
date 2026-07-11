# Run / Stream / Collider / Frame Epoch Contract

**Timestamp:** `2026-07-11T15-59-12-04-00`

## Summary

The product needs one coordinated epoch family. Numeric `runId` is useful gameplay metadata but cannot fence asynchronous generation, physics contacts, render receipts or public-host observations.

## Identity family

```txt
runtimeSessionId
  stable for one browser runtime owner

runSessionId
  opaque ID for one accepted run

runEpoch
  monotonic authority revision for gameplay commands

streamEpoch
  patch-controller claims and active consumer membership

workerGeneration
  asynchronous generation request/reply admission

colliderEpoch
  serialized and live Rapier collider membership

frameEpoch
  RAF candidates and committed-frame records
```

## Admission matrix

| Evidence | Required identity |
|---|---|
| player input | runtimeSessionId, runSessionId, runEpoch |
| controller claim | runSessionId, streamEpoch |
| Worker response | runtimeSessionId, streamEpoch, workerGeneration |
| patch consumer receipt | runSessionId, streamEpoch |
| physics contact | runSessionId, colliderEpoch, source/membership revision |
| frame receipt | runSessionId, streamEpoch, colliderEpoch, frameEpoch |
| host readback | last committed record only |

## Reset rules

```txt
new runSessionId every accepted Start/Retry/Run Again
new runEpoch every authority transfer
new stream/collider/worker/frame epochs committed with the run
old evidence rejected without mutation
immutable cache may be adopted only by fingerprint
mutable membership always receives new epoch-bound receipts
```

## Failure rules

If preparation fails:

```txt
predecessor terminal state remains authoritative
no new epoch family is published
no RAF mutation resumes for staged run
staged resources are retired
one typed failed ResetRunResult is journaled
```

## Retirement rules

Old Worker, controller claim, contact, input, frame and host handles must become permanently inadmissible after commit.

# Stream Cadence Audit: Time Budget, Suspension and Backlog Contract

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

The stream controller exposes deterministic patch identity and per-call work limits, but the product does not translate elapsed time, visibility or backlog age into those calls. This audit defines the missing product-level policy.

## Plan ledger

**Goal:** make stream work stable across refresh rates, bounded during throttling and safe across visibility suspension.

- [x] Identify controller-owned and product-owned responsibilities.
- [x] Derive the current frame-count rate model.
- [x] Define time-budget and backlog fields.
- [x] Define suspend/resume behavior.
- [x] Define typed results and fixtures.
- [ ] Implement the contract.

## Ownership boundary

```txt
seeded-world-patch-controller-kit owns:
  records, queue, inflight, ready, active, cache, focus and per-call maxima

PrehistoricRush product host must own:
  when calls are admitted
  elapsed-time allowance
  visibility and suspension policy
  required-versus-prefetch priority
  backlog age and starvation policy
  cadence revision and visible-frame proof
```

## Required policy descriptor

```txt
StreamCadencePolicy {
  targetSimulationHz
  maximumSimulationSubsteps
  generationStartsPerSecond
  activationCommitsPerSecond
  maximumGenerationStartsPerFrame
  maximumActivationsPerFrame
  maximumStoredCreditSeconds
  hiddenMode
  resumeCatchupSeconds
  requiredPatchPriority
  maximumRequiredPatchAgeMs
}
```

## Required state

```txt
StreamCadenceState {
  cadenceRevision
  visibilityRevision
  generationCredit
  activationCredit
  lastWallNow
  lastVisibleWallNow
  queuedCount
  inflightCount
  readyCount
  oldestQueuedAgeMs
  oldestReadyAgeMs
  requiredStarvationCount
  status
}
```

## Budget rule

```txt
credit += elapsedVisibleSeconds * configuredRate
credit = min(credit, configuredRate * maximumStoredCreditSeconds)
admittedCount = min(floor(credit), hardPerFrameCeiling, availableWork)
credit -= admittedCount
```

Required-route work must be considered before prefetch work. Hidden mode must not continue accumulating unlimited credit.

## Suspension contract

```txt
on hidden:
  advance visibility revision
  stop input and movement admission
  stop nonessential generation admission
  cap or clear stored credits according to policy
  preserve bounded controller state

while hidden:
  classify Worker completions
  retain only current session/stream generation results
  do not publish visible activation commits

on visible:
  advance visibility and cadence revisions
  reject obsolete completions
  derive bounded catch-up plan
  activate required patches within hard frame/time limits
  commit first coherent visible frame
  re-enable input
```

## Typed results

```txt
StreamWorkAdmissionResult
  accepted request starts
  rejected request starts
  generation credit before/after
  reasons

PatchActivationAdmissionResult
  admitted patch IDs
  deferred patch IDs
  activation credit before/after
  oldest ready age

CadenceCommitResult
  cadence revision
  visibility revision
  simulation step result
  stream work results
  world readiness revision
  frame commit ID
```

## Failure classifications

```txt
STALE_SESSION
STALE_STREAM_EPOCH
HIDDEN_SUSPENDED
THROTTLED_LIMITED
BUDGET_EXHAUSTED
HARD_FRAME_CEILING
REQUIRED_PATCH_STARVATION
WORKER_FAILURE
ACTIVATION_FAILURE
FRAME_COMMIT_FAILURE
```

## Required observations

```txt
actual wall delta
admitted simulation delta
credit and work spent
queue/inflight/ready counts
oldest ages
required versus prefetch admissions
visibility and cadence revisions
latest committed frame
```

## Acceptance fixtures

```txt
30 Hz, 60 Hz and 120 Hz equal-wall-time parity
low-refresh without starvation
long-frame bounded simulation and stream catch-up
hidden interval without unlimited credit
hidden Worker completion classification
resume stale-result rejection
required patch priority over prefetch
first visible-frame acknowledgement
```
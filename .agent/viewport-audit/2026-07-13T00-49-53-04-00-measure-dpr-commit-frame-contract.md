# Viewport Audit: Measure, DPR, Commit and Frame Contract

**Timestamp:** `2026-07-13T00-49-53-04-00`

## Summary

This contract defines the missing authority between browser host geometry and the Three.js surface. It does not make Core Graphics own WebGL implementation; it makes measurement, policy, admission and result semantics explicit.

## Plan ledger

**Goal:** specify the identities, phases and invariants needed for deterministic viewport application and proof.

- [x] Define command and surface identities.
- [x] Define measurement and DPR policy inputs.
- [x] Define prepare, commit, apply and frame phases.
- [x] Define failure and rollback results.
- [x] Define public readback and fixture requirements.
- [ ] Implement later.

## Identities

```txt
runtimeSessionId
surfaceId
viewportCommandId
viewportRevision
predecessorRevision
measurementSequence
qualityRevision
renderFrameId
viewportFingerprint
```

## Phases

```txt
OBSERVED
MEASURED
PREPARED
COMMITTED
APPLIED
VISIBLE
DEFERRED
REJECTED
ROLLED_BACK
RETIRED
```

## Candidate

```txt
cssWidth / cssHeight
rawDevicePixelRatio
effectivePixelRatio
bufferWidth / bufferHeight
cameraAspect
pixelCount
qualityRevision
measurementSource
```

## Commit rules

1. Measure the actual host element.
2. Require finite nonnegative dimensions.
3. Defer zero-size candidates without destroying the predecessor.
4. Apply an explicit DPR cap and total-pixel budget.
5. Prepare camera and renderer candidates before mutation.
6. Commit one revision only after both candidates validate.
7. Apply the revision once at render admission.
8. Record rollback or predecessor retention after application failure.
9. Publish the first visible frame that cites the committed fingerprint.

## Observation contract

`PrehistoricRushHost.getState()` should expose the committed surface result, applied result and latest visible-frame acknowledgement, including CSS size, drawing-buffer size, effective DPR, camera aspect and quality revision.

## Fixture matrix

```txt
initial 1920x1080 DPR 1
initial 390x844 DPR 3 with cap
window resize
host-only resize
DPR-only change
zero size then restore
rapid resize coalescing
stale predecessor delivery
pixel-budget downgrade
application failure with predecessor retention
source/build/Pages parity
```
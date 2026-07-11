# Interaction Audit: Camera Reset / Update Admission Map

**Timestamp:** `2026-07-11T05-39-11-04-00`

## Summary

Camera control is currently callable from the frame loop, restart helper, adapter and public host references. There is no single admission surface that validates run/session identity and returns stable results.

## Plan ledger

**Goal:** Route every camera reset/update through one typed product admission layer.

- [x] Identify current callers.
- [x] Identify reset reasons.
- [x] Identify public mutation paths.
- [x] Define command/result map.
- [ ] Implement stale and disposed rejection.

## Current callers

```txt
initial startup
  adapter.resetCamera(..., "initial-run")

start/retry helper
  adapter.resetCamera(..., "run-restart")

render loop
  runId mismatch -> resetCamera(..., "run-change")
  otherwise -> cameraFollow.update(...)

public host
  cameraFollow and adapter are directly reachable
```

## Required command map

```txt
CameraTargetCommand
  commandId
  sequence
  runId
  sessionEpoch
  kind: reset | update
  reason
  target
  requestedDeltaTime

CameraTargetResult
  status: accepted | rejected | duplicate | reset
  commandId
  sequence
  controllerRevision
  clampedDeltaTime
  transformFingerprint
  rejectionReason
```

## Admission rules

```txt
- reject non-finite target values
- reject stale run ID
- reject stale session epoch
- reject update after disposal
- return prior result for duplicate command ID
- reset on declared rebase reasons
- do not let debug/public callers bypass admission
```

## Public-host change

Replace:

```txt
cameraFollow
adapter
```

with detached observations and narrow explicit debug commands, disabled or namespaced in production.

## Correlation requirement

The accepted command/result must be referenced by the Three application row and rendered-frame row. Without that chain, visual smoothness cannot be replayed or verified.

# Audio Projection Command and Result Map

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

Audio requires a typed admission boundary between accepted gameplay meaning and browser effects.

## Plan ledger

**Goal:** make every cue request, rejection, effect, and acknowledgement revision-bound and inspectable.

- [x] Define the command boundary.
- [x] Define accepted and rejected results.
- [x] Define lifecycle and deduplication fields.
- [x] Define audible and audiovisual acknowledgements.
- [ ] Implement and execute the contract.

## Command

```txt
AudioProjectionAdmissionCommand
  commandId
  documentGeneration
  runtimeGeneration
  runId
  committedFrameRevision
  semanticEventIds
  cameraRevision
  audioPolicyRevision
  requestedCueDescriptors
```

## Result

```txt
AudioProjectionResult
  commandId
  projectionRevision
  acceptedCueIds
  rejectedCueIds
  rejectionReasons
  activeLoopIds
  retiredLoopIds
  listenerRevision
  sourceRevision
  voiceBudgetSnapshot
  contextState
```

## Rejection reasons

```txt
not-unlocked
muted
duplicate
stale-frame
stale-run
superseded
voice-budget
invalid-descriptor
suspended
retired
```

## Acknowledgements

```txt
FirstAudibleCueAck
FirstAudioVisualConvergenceAck
AudioLifecycleSettlementAck
```

## Producer rule

Keyboard and button handlers submit gameplay intent only. The audio projector consumes committed results and events. The browser adapter executes only admitted descriptors.

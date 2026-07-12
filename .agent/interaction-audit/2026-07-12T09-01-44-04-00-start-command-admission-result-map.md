# Interaction Audit: Start Command Admission and Result Map

**Generated:** `2026-07-12T09-01-44-04-00`

## Current sources

```txt
initial boot call
Jump/Retry button
Enter key
Space key while terminal
```

All sources currently call the same direct `start()` helper but do not submit an identity-bearing command.

## Required command

```txt
RunStartCommand
  commandId
  source
  sourceEventId
  expectedRuntimeSession
  expectedRunId
  expectedTickRevision
  requestedProfileRevision
  requestedAt
```

## Required result

```txt
RunStartResult
  commandId
  accepted
  classification
  predecessorRunId
  successorRunId
  runEpoch
  participantResults
  transitionResult
  firstTickRequirement
  firstFrameRequirement
```

## Admission rules

```txt
one physical input edge -> one command
duplicate command ID -> idempotent prior result
stale predecessor -> reject
active run without explicit restart policy -> reject
failed/stopping runtime -> reject
participant prepare failure -> rollback
accepted result -> exactly one run epoch
```

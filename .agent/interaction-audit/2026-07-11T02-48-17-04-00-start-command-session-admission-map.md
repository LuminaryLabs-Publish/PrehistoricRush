# Interaction Audit: Start Command Session Admission Map

**Timestamp:** `2026-07-11T02-48-17-04-00`

## Goal

Make Enter, Space, retry and button starts converge on one typed, deduplicated session command.

## Current input paths

```txt
Enter key
  -> start()

Space outside game
  -> start()

HUD button outside game
  -> start()

start()
  -> game.start()
  -> updateStreaming(newState, true)
```

## Gaps

```txt
no command ID
no source field
no accepted/rejected result
no duplicate-start suppression
no in-progress start state
no lifecycle admission
no runSessionId allocation transaction
no streamEpoch advance
no per-consumer reset acknowledgement
no rollback path
```

Browser key latches are stored separately from the game `InputState`. `game.start()` clears the game resource but does not clear the host `input` object, so a held key can immediately project into the new run.

## Required command shape

```txt
start-run-command:
  commandId
  source: enter | space | button | retry | win-restart
  requestedAt
  expectedPreviousRunSessionId
  reason
```

## Required result shape

```txt
start-run-result:
  commandId
  accepted
  reason
  previousRunSessionId
  runSessionId
  runId
  streamEpoch
  resetRevision
  firstCommittedFrameId
```

All start surfaces must route through one admission service, and stale or duplicate commands must be rejected without partial mutation.

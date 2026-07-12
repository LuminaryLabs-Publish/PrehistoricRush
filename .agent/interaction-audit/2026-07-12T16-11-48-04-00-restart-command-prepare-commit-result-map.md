# Interaction Audit: Restart Command, Prepare, Commit and Result Map

**Timestamp:** `2026-07-12T16-11-48-04-00`

## Summary

Restart activation currently jumps from browser event handlers directly into mutable product and host APIs. The interaction has no command envelope, expected-run check, participant prepare phase, typed commit result or rollback result.

## Plan ledger

**Goal:** route every restart source through one command/result protocol that is safe against repeats, stale run identity and partial participant failure.

- [x] Identify all restart sources.
- [x] Map current direct calls and mutations.
- [x] Define command, prepare, commit, rejection and observation shapes.
- [x] Define keyboard/button parity requirements.
- [ ] Implement the protocol.

## Current source map

```txt
initial boot
  -> direct game.start()

button outside active game
  -> direct start()

Space outside active game
  -> direct start()

Enter in any phase
  -> direct start()
```

## Proposed command map

```txt
BrowserRestartIntent
  -> RestartSourceAdapter
  -> RunRestartCommand
  -> RunRestartAdmission
  -> ResetParticipantPrepare fan-out
  -> ResetCommit or ResetRollback
  -> RunRestartResult
  -> HUD/PublicHost projection
  -> FirstVisibleRunFrameAck
```

## Command envelope

```txt
commandId
source
sourceEventId
sequence
expectedRunId
expectedRunGeneration
expectedPhase
reason
issuedAtTickId
```

## Admission results

```txt
admitted
rejected-active-run
rejected-stale-run
rejected-stale-sequence
rejected-duplicate-event
rejected-unsupported-phase
rejected-reset-in-progress
```

All rejected results must guarantee zero mutation.

## Participant result map

| Participant | Prepare evidence | Commit evidence |
|---|---|---|
| Product run | next initial state and run ID | committed RunState revision |
| Input | cleared command state | new input generation |
| Simulation | clear resolution/frame plan | committed reset frame |
| Motion | intent/history reset plan | motion revision |
| Physics | body/request/frame reset plan | physics revision and body transform |
| Articulated motion/dynamics | pose/joint reset plan | articulation revisions |
| Patch controller | preserve-or-clear policy | controller revision/digest |
| Worker | cancellation or generation fence | pending request digest |
| Active content | empty/prime content plan | content and collider digests |
| Camera | target/reset transform plan | camera revision |
| Renderer | time/resource policy | renderer revision |
| Public host | coherent projection plan | reset receipt ID |

## Duplicate protection

```txt
same browser event -> same idempotency key
same expected run + same source sequence -> at most one reset transaction
commands received during prepare/commit -> deterministic busy rejection
```

## Observation

The public host should expose immutable `RunRestartResult` and `VisibleRunFrameAck` records, not raw participant owners as the proof surface.
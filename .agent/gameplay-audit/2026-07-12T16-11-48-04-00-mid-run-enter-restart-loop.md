# Gameplay Audit: Mid-Run Enter Restart Loop

**Timestamp:** `2026-07-12T16-11-48-04-00`

## Summary

The keyboard handler calls `start()` for every `Enter` keydown, regardless of whether the game is in menu, active gameplay, run-over or win state. This creates an undeclared mid-run restart command outside the authoritative tick and without coordinated reset admission.

## Plan ledger

**Goal:** ensure restart is a typed gameplay command with explicit phase policy, expected-run matching and zero mutation on rejection.

- [x] Trace button, Space and Enter restart sources.
- [x] Compare active-game and terminal-state handling.
- [x] Trace product and host mutations caused by `start()`.
- [x] Identify missing command and phase admission.
- [ ] Implement typed restart policy and fixtures.

## Current path

```txt
keydown Enter
  -> start()
  -> game.start()
  -> runId increments
  -> status becomes game
  -> RunState/InputState are replaced
  -> Core Simulation resolution resets
  -> scene transition requested
  -> active content refreshed
  -> patch focus moved to origin
  -> camera reset
```

There is no `state.status` guard for Enter. By contrast, the primary button jumps during active gameplay and restarts only when not in `game` status.

## Gameplay consequences

```txt
accidental Enter during a run erases distance, shards and outcome state
mid-run restart bypasses a terminal transition requirement
repeated Enter can increment runId multiple times between RAF frames
no command result tells UI or diagnostics whether restart was admitted
predecessor engine/stream/render participants are not reset atomically
```

## Required policy

```txt
menu:      start admitted
run-over:  retry admitted
win:       run-again admitted
game:      restart rejected by default
paused:    explicit product policy required
```

A future intentional quick-restart feature should be a distinct command, not an ambient reuse of `start()`.

## Required result

```txt
RunRestartResult
  commandId
  source
  expectedRunId
  previousRunId
  nextRunId
  admitted
  rejectionReason
  resetTransactionId
  committedParticipantIds
```

## Fixture boundary

```txt
Enter during active run -> typed rejection, zero mutation
Enter during run-over -> one admitted restart
rapid repeated Enter -> at most one committed generation
button and keyboard policy parity
blur/key repeat cannot duplicate restart
```
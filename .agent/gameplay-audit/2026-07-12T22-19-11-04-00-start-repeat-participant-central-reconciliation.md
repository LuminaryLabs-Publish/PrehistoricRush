# Gameplay Audit: Start Repeat and Participant Reconciliation

**Timestamp:** `2026-07-12T22-19-11-04-00`

## Summary

Enter can restart an active run and browser repeat delivery can create many run generations. Each call resets selected product state while reusing independently owned input, streaming, Worker, physics, content, camera, and render participants. This audit reconciles that gameplay defect with central tracking.

## Plan ledger

**Goal:** keep Start, Retry, and Run Again semantically distinct and commit exactly one complete successor run only from an admitted predecessor.

- [x] Trace button, Space, Enter, and public ingress.
- [x] Trace state and simulation reset.
- [x] Trace retained participants.
- [x] Define gameplay admission and reset/preserve expectations.
- [ ] Implement later.

## Current gameplay loop

```txt
menu boot
  -> game.start creates run 1

button or Space while not game
  -> start wrapper

Enter in any state
  -> start wrapper
  -> repeats while held

start wrapper
  -> game.start creates next run
  -> retained content refresh
  -> retained patch controller update/generate/pump
  -> retained camera reset

next frame
  -> retained local keys are applied
  -> retained physics, streaming, content, camera, and renderer continue
```

## Gameplay risks

```txt
active run can be replaced without explicit restart policy
repeat delivery can emit multiple starts and transitions
held steering/boost can enter the successor run
predecessor Worker results can enter after restart
retained collider/content state may not describe the origin run
participant failure has no rollback classification
retry and run-again have no distinct result semantics
```

## Required gameplay result

```txt
RunStartResult
  commandId
  intent: Start | Retry | RunAgain | ExplicitRestart
  predecessorStatus
  predecessorRunGeneration
  successorRunGeneration
  participantReceipts
  sceneTransitionResult
  eventPublicationResult
  commitStatus
  rollbackStatus
```

## Validation boundary

Gameplay documentation only. No movement, collision, scoring, scene, restart, or rendering behavior changed.
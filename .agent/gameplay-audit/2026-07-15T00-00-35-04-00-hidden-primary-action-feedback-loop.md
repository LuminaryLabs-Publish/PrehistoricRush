# Gameplay Audit: Hidden Primary Action and Feedback Loop

**Timestamp:** `2026-07-15T00-00-35-04-00`  
**Status:** `game-feedback-control-surface-admission-authority-audited`

## Summary

The game remains playable by keyboard after the feedback panel is removed, but the panel owns the primary Jump/Retry/Run Again button and the only authored progress/status projection. Pointer and touch players lose the main action surface, and terminal outcomes have no visible retry control.

## Plan ledger

**Goal:** preserve the intended low-UI game while ensuring every required gameplay action and outcome remains reachable and understandable.

- [x] Trace active-run controls.
- [x] Trace primary action button behavior.
- [x] Trace terminal button labels.
- [x] Trace panel removal.
- [x] Define action and feedback coverage requirements.
- [ ] Implement and test later.

## Current loop

```txt
active game
  keyboard A/D/W/Space continues
  detached button says Jump
  detached status contains progress and run state

run-over
  detached button says Retry
  keyboard Space or Enter can restart
  no visible pointer/touch retry action

win
  detached button says Run Again
  keyboard Space or Enter can restart
  no visible pointer/touch run-again action
```

## Gameplay requirements

```txt
active-run semantic status
pointer/touch Jump or an explicitly documented alternative
visible and semantic run-over result
visible and semantic win result
Retry and Run Again action coverage
focus-safe keyboard routing
one action result per command
matching first visible feedback frame
```

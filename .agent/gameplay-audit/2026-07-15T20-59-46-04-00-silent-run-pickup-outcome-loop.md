# Silent Run, Pickup, and Outcome Loop

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

The run loop accepts start, movement, jump, pickup, collision, and win outcomes, but none has an owned audible projection.

## Plan ledger

**Goal:** map authored gameplay meaning to cues only after the result is accepted.

- [x] Trace start and retry.
- [x] Trace jump and movement state.
- [x] Trace accepted shard collection.
- [x] Trace collision failure and victory.
- [x] Separate raw input from accepted cue eligibility.
- [ ] Implement and test cues.

## Current loop

```txt
input
  -> run proposal
  -> physics observation
  -> resolution policy
  -> accepted movement, pickup, failure, or win
  -> event and state publication
  -> visual projection only
```

## Cue eligibility

```txt
RunStarted event -> run-start cue
accepted jump transition -> jump cue
accepted grounded transition -> landing cue
accepted boost state -> boost layer
accepted surface region -> footstep/surface descriptor
ShardCollected event -> pickup cue
RunFailed event -> impact/failure cue
RunWon event -> victory cue
```

## Rejection rule

Raw keydown, button click, repeated snapshots, duplicate event delivery, and rejected pickups must not directly produce success cues.

## Lifecycle rule

Continuous movement, boost, and ambience loops require explicit start, update, suspend, resume, and retirement results. No such lifecycle currently exists.

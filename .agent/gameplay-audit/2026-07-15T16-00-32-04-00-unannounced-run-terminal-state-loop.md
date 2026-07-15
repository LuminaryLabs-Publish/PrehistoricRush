# Unannounced Run and Terminal State Loop

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

The playable loop is keyboard-accessible at a basic command level, but accepted run progress and terminal transitions are communicated primarily through changing visuals. A player relying on the accessibility tree has no source-backed status, progress or one-shot outcome announcement contract.

## Plan ledger

**Goal:** preserve the existing run mechanics while making start, progress, failure, victory and retry state observable through stable semantic results.

- [x] Trace start, active run, run-over, win and retry states.
- [x] Trace the primary action label changes.
- [x] Identify missing state-bound announcement receipts.
- [ ] Implement and test terminal semantic settlement.

## Current loop

```txt
Start Rush or Enter
  -> game.start
  -> active run
  -> distance, shards, speed and region update visually
  -> jump through Space or the primary button
  -> outcome settles as run-over or win
  -> button label changes to Retry or Run Again
  -> no semantic transition result is announced
```

## Gameplay risk

```txt
run state is visually available
progress is visually available
terminal state is visually available
retry action is visually relabeled
semantic status revision is absent
terminal announcement identity is absent
duplicate suppression is absent
first accessible terminal frame acknowledgement is absent
```

The required implementation should announce discrete transitions, not continuous frame data:

```txt
run-started
meaningful distance milestone
shard-collected when admitted by policy
run-over
win
retry-started
```

## Boundary

This is a source-derived accessibility gap, not a reproduced assistive-technology failure. Gameplay behavior was not changed.
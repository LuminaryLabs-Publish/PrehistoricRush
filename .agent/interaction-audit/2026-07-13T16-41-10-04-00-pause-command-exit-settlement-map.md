# Pause Command and Exit Settlement Map

**Timestamp:** `2026-07-13T16-41-10-04-00`

## Summary

Open, close, toggle and settings commands currently have semantic state results, while exit emits an intent and the DOM host immediately navigates. The event has no consumer acknowledgement, retirement phase, cancellation result or terminal settlement record.

## Plan ledger

**Goal:** make every menu interaction return one typed result and make exit navigation occur only through an explicit settlement boundary.

- [x] Map Escape to `toggle()`.
- [x] Map Settings click to `showSettings()`.
- [x] Map Exit click to `requestExit()` and immediate `location.href`.
- [x] Confirm duplicate exit requests emit one semantic event.
- [ ] Add command IDs, expected sequence and source metadata.
- [ ] Add typed command rejection and retirement results.
- [ ] Add an exit-intent consumer and navigation candidate.
- [ ] Collect menu-host and game-runtime retirement receipts.
- [ ] Publish one terminal exit settlement result.

## Command map

| Input | Semantic command | Current result | Missing terminal evidence |
|---|---|---|---|
| Escape | `toggle()` | clone of menu state | command ID, input generation, overlay frame |
| Settings click | `showSettings()` | clone of menu state | projection result, visible acknowledgement |
| Exit click | `requestExit()` | clone of menu state and event | consumer acknowledgement, cleanup, navigation result |
| Reset | `reset()` | initial state | host projection and stale callback fencing |

## Required result model

```txt
PauseMenuCommandResult
  commandId
  commandType
  source
  expectedSequence
  previousSequence
  acceptedSequence
  status: Accepted | Duplicate | Stale | Failed | Cancelled | Retired
  semanticFingerprint
  projectionRequired
  evidence
```

## Exit settlement

```txt
ExitIntent accepted
  -> bind run, runtime, menu, host and navigation generations
  -> reject duplicate or stale intent
  -> stop accepting new menu commands
  -> prepare destination
  -> retire menu attach poll and synchronization RAF
  -> remove key and click listeners
  -> remove overlay
  -> request patch Worker, renderer, physics and runtime cleanup
  -> collect receipts or apply explicit timeout policy
  -> publish ExitSettlementResult
  -> perform navigation exactly once
```

## Required statuses

```txt
Prepared
Retiring
Settled
AlreadySettled
Stale
Cancelled
Partial
Failed
TimedOut
```

## Failure rule

A semantic `exit-requested` event must not itself be presented as completed navigation. Failure or timeout must be observable, bounded and must prevent duplicate cleanup or navigation.
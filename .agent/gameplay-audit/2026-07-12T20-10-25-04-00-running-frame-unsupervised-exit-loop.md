# Gameplay Audit: Running Frame and Unsupervised Exit Loop

**Timestamp:** `2026-07-12T20-10-25-04-00`

## Summary

The gameplay loop is continuously self-scheduled and has no transition from Running to Stopping. Blur clears input but leaves simulation, streaming and rendering active. Startup errors are caught, while exceptions thrown after RAF begins are outside the startup promise and have no cleanup path.

## Plan ledger

**Goal:** make exit, page retirement and runtime failure explicit gameplay lifecycle outcomes instead of relying on document destruction or an abruptly terminated frame chain.

- [x] Trace initial start, restart and RAF entry.
- [x] Trace blur behavior.
- [x] Trace startup and frame failure boundaries.
- [x] Confirm no stop/re-entry command exists.
- [x] Define terminal lifecycle outcomes.
- [ ] Add gameplay stop/failure fixtures.

## Current loop

```txt
requestAnimationFrame(loop)
  -> set browser-derived input
  -> engine.tick(dt)
  -> read committed state
  -> refresh collected content
  -> update patch streaming
  -> render creature, camera and world
  -> replace HUD HTML
  -> requestAnimationFrame(loop)
```

## Exit and failure behavior

```txt
blur:
  clears browser input
  leaves RAF, simulation, Worker, streaming and rendering active

startup import/composition failure:
  reaches main().catch
  replaces document body with an error message

frame-time failure:
  no enclosing lifecycle supervisor
  successor RAF may not be scheduled
  owned Worker/listener/renderer resources receive no retirement command

navigation/re-entry:
  no explicit StopRuntimeCommand
  no terminal result or re-entry admission
```

## Required terminal gameplay results

```txt
StoppedByNavigation
StoppedByExplicitCommand
StoppedAfterTerminalFrame
FailedDuringStartup
FailedDuringFrame
CancelledDuringStartup
AlreadyStopped
StopRejectedStaleGeneration
StopFailedRetirement
```

## Required invariant

A gameplay run can finish while the page runtime remains alive. Run completion and runtime shutdown are separate transactions and must not share an implicit browser-unload boundary.
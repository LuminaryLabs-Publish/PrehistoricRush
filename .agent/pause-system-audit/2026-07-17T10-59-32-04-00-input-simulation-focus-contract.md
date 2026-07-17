# Pause Input, Simulation and Focus Contract

**Timestamp:** `2026-07-17T10-59-32-04-00`

## Current contract

```txt
name: Pause
modal: false
capturesPointer: true
blocksSimulation: false
keyboard gameplay routing: active
simulation tick: active
focus lease: absent
```

## Required contract

```txt
true pause open
  -> allocate PauseGeneration
  -> neutralize held gameplay state
  -> route keyboard/pointer to menu context
  -> suspend gameplay simulation participants
  -> capture focus
  -> render accepted paused snapshot
  -> FirstPausedFrameAck

true pause close
  -> settle menu action
  -> restore focus
  -> rebase frame clock
  -> resume participants exactly once
  -> FirstResumedGameplayFrameAck
```

## Alternative

If the product intentionally wants gameplay to continue, rename the UI and descriptors to a non-pausing quick menu, do not call it Pause, and explicitly communicate that the run continues. That policy still needs typed input-context and focus ownership.

## Compatibility

Preserve route generation, physics values, terrain/vegetation streaming, camera feel, score, outcomes, pause-menu commands and all existing rendering systems. Only participant arbitration and semantic truth should change.

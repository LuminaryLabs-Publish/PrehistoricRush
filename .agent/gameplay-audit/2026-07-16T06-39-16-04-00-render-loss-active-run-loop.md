# Gameplay Audit: Render Loss During an Active Run

**Timestamp:** `2026-07-16T06-39-16-04-00`

## Summary

Simulation, input, streaming and rendering currently share one RAF host. The product has no authored policy for whether simulation pauses, continues, or degrades while the renderer is unavailable.

## Plan ledger

**Goal:** prevent hidden gameplay progression or unsafe world interaction during render recovery.

- [x] Trace the active run loop.
- [x] Separate simulation ownership from presentation ownership.
- [x] Identify the missing render-loss gameplay policy.
- [ ] Implement and test policy choices.

## Current loop

```txt
keyboard state
  -> engine.tick(dt)
  -> accepted run state and physics frame
  -> patch streaming update
  -> renderer submission
  -> HUD update
```

## Missing policy

```txt
on RenderLossResult:
  pause simulation? undefined
  accept steering/jump? undefined
  continue patch generation? undefined
  continue physics? undefined
  retain last accepted HUD? undefined
  permit scoring or terminal outcome? undefined
  timeout to fallback/route exit? undefined
```

## Recommended contract

Default to suspending player-affecting simulation and one-shot input after a confirmed loss, while allowing bounded recovery bookkeeping. Resume only after `FirstRecoveredFrameAck` cites the same accepted run generation. A different policy is valid, but it must be explicit and tested.

## Boundary

No gameplay behavior was changed or executed.

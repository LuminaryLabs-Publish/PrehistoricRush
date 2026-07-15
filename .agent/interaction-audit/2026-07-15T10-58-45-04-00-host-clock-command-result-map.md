# Interaction Audit: Host Clock Command and Result Map

**Timestamp:** `2026-07-15T10-58-45-04-00`

## Summary

Input state is sampled immediately before one clipped engine tick. There is no command identity that binds the sampled input, admitted wall interval, fixed-step batch, simulation result and visible frame.

## Plan ledger

**Goal:** make input-to-simulation timing explicit without letting the browser event layer own gameplay settlement.

- [x] Trace keyboard state into the RAF callback.
- [x] Trace one input sample into one engine tick.
- [x] Identify missing clock, step-batch and visible-frame identities.
- [x] Define command/result/acknowledgement boundaries.
- [ ] Implement ordered input-frame admission and fixtures.

## Current map

```txt
keydown / keyup
  -> mutate host booleans

RAF callback
  -> read host booleans
  -> game.setInput
  -> engine.tick(clippedDelta)
  -> product system consumes current input
  -> render current state
```

## Required map

```txt
HostClockFrameCommand
  -> InputFrameSample
  -> HostClockFrameResult
       fixedStepBatchId
       admittedInputRevision
       simulationRevision
       residualTime
  -> RenderFrameCommand
  -> FirstClockAlignedFrameAck
```

## Rejection cases

```txt
non-monotonic timestamp
stale RAF generation
retired runtime generation
hidden-document callback under suspend policy
resume callback without clock rebase
step budget overflow without declared overload policy
input sample from a superseded document generation
```

## Boundary

No browser input, scheduler or simulation API was modified.
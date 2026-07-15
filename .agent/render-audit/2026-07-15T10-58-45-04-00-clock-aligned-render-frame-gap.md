# Render Audit: Clock-Aligned Frame Gap

**Timestamp:** `2026-07-15T10-58-45-04-00`

## Summary

The renderer receives the same clipped delta used for the single simulation tick. The public host snapshot exposes the latest simulation and renderer state, but no accepted host-clock revision, fixed-step batch, residual time or interpolation fraction proves that the visible frame corresponds to the admitted wall interval.

## Plan ledger

**Goal:** bind every presented frame to one accepted simulation revision and one declared interpolation state.

- [x] Trace RAF delta into `engine.tick`, patch streaming and `adapter.render`.
- [x] Confirm one render occurs after one clipped simulation tick.
- [x] Confirm the public host snapshot omits clock and interpolation identity.
- [x] Define `FirstClockAlignedFrameAck`.
- [ ] Execute low-FPS and resumed-frame browser fixtures.

## Current frame path

```txt
RAF timestamp
  -> clipped dt
  -> engine.tick(dt)
  -> committed simulation frame
  -> patch-controller update
  -> adapter.render(state, dt)
  -> DOM diagnostics
  -> next RAF
```

## Missing evidence

```txt
HostClockRevision
accepted wall interval
fixed-step count
residual time
interpolation fraction
simulation revision consumed by renderer
renderer generation
presented-frame identifier
FirstClockAlignedFrameAck
```

At callback intervals above 50 ms, the visual frame advances only the clipped simulation amount. The source therefore permits apparent slow motion rather than a bounded catch-up or explicit overload presentation.

## Required frame contract

```txt
accepted HostClockFrameResult
  -> zero or more fixed simulation steps
  -> one immutable SimulationRevision
  -> one RenderInterpolationDescriptor
  -> one presented frame
  -> FirstClockAlignedFrameAck
```

## Boundary

No WebGL frame, screenshot, GPU trace, interpolation fixture, built artifact or Pages frame was produced.
# Render Audit: Movement Progress Finish-Frame Gap

**Timestamp:** `2026-07-14T18-58-04-04-00`

## Summary

The HUD progress bar uses unrestricted cumulative movement while the renderer presents the authored route and surrounding world. A full progress bar and win frame can therefore appear after reverse, repeated, circular, or off-route travel.

## Plan ledger

**Goal:** bind visible course progress and terminal presentation to accepted route progress and one eligible finish result.

- [x] Trace HUD progress calculation.
- [x] Compare it with route-progress evidence.
- [x] Identify missing frame correlation.
- [ ] Implement a revision-bound presentation descriptor and browser proof later.

## Current projection

```txt
progress = min(1, RunState.distance / 3600)
HUD width = progress * 100
HUD label = floor(RunState.distance) / 3600m
terminal label = Retry or Run Again
```

`RunState.distance` is total horizontal displacement accumulated across all movement. It is not accepted forward course distance.

## Missing evidence

```txt
CourseProgressRevision in render input
CourseGoalId in terminal presentation
accepted checkpoint identity
route direction and lateral eligibility receipt
CourseCompletionRevision
terminal render submission receipt
FirstEligibleFinishFrameAck
source/build/Pages screenshot parity
```

## Required presentation path

```txt
CourseProgressResult
  -> CourseProgressPresentationDescriptor
  -> HUD progress and checkpoint text
  -> Three.js route/finish presentation
  -> terminal CourseCompletionResult
  -> FirstEligibleFinishFrameAck
```

## Validation boundary

No HUD, Three.js, camera, viewport, render loop, material, geometry, or terminal presentation code changed.
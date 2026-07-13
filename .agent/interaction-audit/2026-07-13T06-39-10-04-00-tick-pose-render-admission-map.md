# Interaction Audit: Tick, Pose and Render Admission Map

**Timestamp:** `2026-07-13T06-39-10-04-00`

## Summary

The browser host now observes the simulation-owned pose after `engine.tick(dt)`, but no explicit admission result binds the render call to one pose-frame revision or rejects stale/missing pose state.

## Plan ledger

**Goal:** make pose solve and render consumption order explicit without allowing browser presentation to become a second animation authority.

- [x] Trace browser input through tick, pose solve and render.
- [x] Confirm tick-before-render source ordering.
- [x] Identify missing pose-frame admission and missing-pose behavior.
- [ ] Implement typed command/result admission later.

## Current interaction map

```txt
keyboard/button/blur
  -> game.setInput(patch)

RAF callback
  -> compute bounded dt
  -> game.setInput(steer/boost)
  -> engine.tick(dt)
      -> run system
      -> resolvePlayerPose(next, input, tick)
      -> set PlayerPose
      -> resolve and commit simulation
  -> game.getState()
  -> game.getPlayerPose()
  -> damp Three.js skeleton
  -> render world and HUD
  -> request successor RAF
```

## Missing admission states

```txt
no PlayerPoseFrame identity checked by renderer
no expected run/tick/frame argument on getPlayerPose()
no stale pose result
no missing pose result
no duplicate render-consumption result
no presentation generation
no acknowledgement that a source pose became visible
```

Current missing-pose behavior is implicit: if `getPlayerPose()` returns null, the renderer skips bone updates and leaves the previously rendered skeleton state in place.

## Required command/result flow

```txt
RenderPlayerPoseCommand
  -> bind render frame and presentation generation
  -> require expected run generation
  -> read latest accepted PlayerPoseFrame
  -> classify Accepted | Missing | Stale | Duplicate | Retired
  -> derive PresentationPoseFrame under authored smoothing policy
  -> submit renderer frame
  -> publish VisiblePlayerPoseFrameAck
```

## Cancellation and restart

A run restart must increment a pose/presentation generation. Any predecessor render callback or pose frame should be rejected or explicitly transitioned rather than silently damped into the successor.

## Validation boundary

No browser event sequence, delayed frame, double RAF, restart race or missing-pose fixture was executed.
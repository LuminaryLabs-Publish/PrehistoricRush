# Gameplay Audit: Simulation-Owned Player Pose Loop

**Timestamp:** `2026-07-13T06-39-10-04-00`

## Summary

Player pose target generation now occurs inside the PrehistoricRush simulation domain. Speed, elapsed time, steer, jump height and surface resistance are sampled from the candidate run/input state, converted through the creature and articulation layers, and committed into `PlayerPose` before rendering.

## Plan ledger

**Goal:** document the successful ownership correction and keep gameplay-state-to-pose dependencies explicit.

- [x] Trace initialization, run start and active tick pose publication.
- [x] Record source state used by the procedural pose.
- [x] Confirm renderer no longer computes pose inputs independently.
- [x] Identify remaining public compatibility paths.
- [ ] Add executable state-to-pose fixtures later.

## Current loop

```txt
RunState + InputState + TickContext
  -> run candidate state
  -> Core Motion intent/frame
  -> legacy procedural pose inputs
       speed = next.speed
       time = next.elapsed
       turn = input.steer
       jump = min(1, next.jumpHeight / 2)
       resistance = 1 - next.surfaceMultiplier
  -> articulated rig adaptation
  -> articulated solve
  -> PlayerPose resource replacement
  -> simulation proposals and resolution
  -> render consumes PlayerPose
```

## Ownership improvement

The previous renderer recomputed pose inputs from its copy of run state and input each visual frame. The new path ensures one simulation solve produces the target pose consumed by rendering and snapshots.

## Remaining gameplay gaps

```txt
PlayerPose resource does not carry runId
PlayerPose resource does not carry tickId or frame
PlayerPose resource does not cite source RunState/InputState revisions
solve failure has no typed fallback result
a missing pose leaves the renderer on predecessor bone state
public createPlayerPose() remains available outside the resource path
public solvePlayerArticulatedPose() remains available outside the resource path
restart does not classify presentation continuity versus snap
```

## Required gameplay result

```txt
PlayerPoseFrameCommitResult {
  status: Accepted | Duplicate | Stale | Invalid | Failed,
  runId,
  tickId,
  frame,
  poseFrameId,
  predecessorPoseFrameId,
  rigRevision,
  sourceStateFingerprint
}
```

## Validation boundary

The new static test proves source markers and tick-before-render ordering. It does not execute gameplay ticks or compare output poses across state changes, run restarts or clone boundaries.
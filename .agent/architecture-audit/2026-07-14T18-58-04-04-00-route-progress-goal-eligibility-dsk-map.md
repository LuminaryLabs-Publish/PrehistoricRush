# Architecture Audit: Route Progress Goal Eligibility DSK Map

**Timestamp:** `2026-07-14T18-58-04-04-00`  
**Status:** `route-progress-goal-eligibility-authority-audited`

## Summary

The product domain owns route lookup, movement distance and goal proposal, while the resolution policy accepts the submitted goal boolean. No service owns authoritative forward-course progress or an authored finish checkpoint.

## Plan ledger

**Goal:** place course identity, progress admission, finish eligibility, settlement and presentation evidence under one composed authority without restructuring the existing Core domains.

- [x] Map current producers and consumers.
- [x] Preserve existing domain ownership.
- [x] Identify the missing authority boundary.
- [x] Define command, result and frame contracts.
- [ ] Implement later.

## Current DSK graph

```txt
drunk-route-generator
  provides deterministic control points, samples, nearest(), classify(), normalized progress

prehistoric-rush-domain-kit
  requires Core player, physics, simulation, motion, articulation and patch controller
  owns RunState, InputState, PlayerPose
  computes routeIndex, routeProgress, region and cumulative movement distance
  submits run-state, pickup and movement-only goal proposals

prehistoric-rush-resolution-policy
  consumes proposals and collision observations
  trusts goalProposal.value.reached
  commits win or failure and scene transition

three-patch-stream-adapter-kit
  presents streamed course surroundings and player state

game-page-entry and HUD adapter
  presents cumulative movement as course progress
```

## Missing authority

```txt
prehistoric-rush-route-progress-goal-eligibility-authority-domain
```

### Planned surfaces

```txt
CourseManifest
CourseManifestRevision
CourseGoalDescriptor
CourseGoalId
CourseCheckpointDescriptor
CourseCheckpointId
CourseProgressCommand
CourseProgressResult
CourseProgressRevision
CourseProgressReceipt
CourseDirectionPredicate
CourseLateralPredicate
CourseCheckpointPredicate
CourseReplayPredicate
CourseGoalEligibilityCommand
CourseGoalEligibilityResult
CourseCompletionResult
CourseCompletionRevision
CourseProgressPresentationDescriptor
CourseProgressFrameReceipt
FirstEligibleFinishFrameAck
CourseProgressFixtureManifest
CourseProgressDiagnosticsSnapshot
```

## Required composition

```txt
browser input
  -> product movement proposal
  -> route nearest-point evidence
  -> CourseProgressCommand
  -> course-progress admission
  -> accepted CourseProgressRevision
  -> CourseGoalEligibilityCommand
  -> resolution policy
  -> RunState and scene transition
  -> HUD and Three.js presentation
  -> FirstEligibleFinishFrameAck
```

## Ownership rules

```txt
total movement distance remains telemetry and scoring input
accepted course progress is separate and monotonic
route generator provides geometry but does not settle progress
product domain submits candidate movement evidence
course-progress authority accepts or rejects progress
resolution policy accepts only a typed eligibility result
HUD reads accepted progress, not unrestricted movement
terminal win cites CourseCompletionRevision
```

## Failure handling

```txt
backward traversal -> movement accepted, course progress rejected
repeated segment -> movement accepted, course progress unchanged
off-route traversal -> movement accepted, eligibility rejected
skipped checkpoint -> progress rejected or held at predecessor
stale run or course revision -> command rejected
goal reached without accepted terminal checkpoint -> win rejected
presentation mismatch -> no finish-frame acknowledgement
```

## Validation boundary

No DSK, resource, event, system or runtime behavior changed. This file defines the missing architecture only.
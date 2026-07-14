# Interaction Audit: Course Progress and Goal Command Map

**Timestamp:** `2026-07-14T18-58-04-04-00`

## Summary

Browser input currently causes movement, and movement directly advances the win counter. There is no command/result boundary between candidate displacement and accepted course progress.

## Plan ledger

**Goal:** correlate input, movement, route evidence, accepted progress, goal eligibility and visible finish state through typed identities.

- [x] Map current input-to-win flow.
- [x] Define command and result identities.
- [x] Define stale, duplicate and ineligible outcomes.
- [ ] Implement later.

## Current flow

```txt
keyboard state
  -> product InputState
  -> movement proposal
  -> unrestricted distance increment
  -> boolean goal proposal
  -> resolution policy
  -> RunWon event and scene transition
  -> HUD and terminal button
```

## Required command flow

```txt
CourseProgressCommand
  RunId
  StepId
  CommandId
  CourseManifestRevision
  PreviousCourseProgressRevision
  PreviousCheckpointId
  candidate position and displacement
  nearest route sample and tangent
  lateral distance and region

CourseProgressResult
  Accepted | Unchanged | Backward | Repeated | OffRoute | Skipped | Stale | Duplicate | Failed
  accepted checkpoint
  accepted normalized progress
  accepted forward course distance
  predicate receipts

CourseGoalEligibilityCommand
  accepted CourseProgressRevision
  CourseGoalId
  terminal checkpoint or finish-volume evidence
  current collision and route predicates

CourseGoalEligibilityResult
  Eligible | Incomplete | WrongDirection | OffRoute | Collision | Stale | Duplicate | Failed

CourseCompletionResult
  RunId
  CourseCompletionRevision
  accepted terminal StepId
  terminal checkpoint
  progress and route fingerprints
```

## Interaction rules

```txt
keyboard input never directly claims course progress
movement may succeed while progress is rejected
repeated commands do not advance progress twice
late results from predecessor runs are rejected
HUD and terminal controls cite accepted result revisions
retry requires the settled predecessor outcome
```

## Validation boundary

No browser listener, input state, movement command, event, scene transition, button, or public host behavior changed.
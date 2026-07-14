# Route Progress Audit: Checkpoint, Direction and Finish Eligibility Contract

**Timestamp:** `2026-07-14T18-58-04-04-00`

## Summary

The authored route exposes geometry and nearest-sample progress but no versioned checkpoint manifest or progress settlement. This contract defines the smallest reliable authority needed to distinguish movement from valid course completion.

## Plan ledger

**Goal:** add a targeted route-progress authority without replacing the existing route generator, simulation or resolution policy.

- [x] Preserve current route geometry and nearest queries.
- [x] Define stable checkpoints and finish identity.
- [x] Define monotonic progress and eligibility predicates.
- [x] Define rollback, replay and presentation receipts.
- [ ] Implement later.

## Course manifest

```txt
CourseManifest
  schemaVersion
  courseId
  revision
  seed
  routeFingerprint
  sampleCount
  ordered checkpoints
  finish goal descriptor
  lateral tolerance policy
  direction tolerance policy
  checkpoint skip policy
```

## Progress admission

```txt
candidate movement
  -> resolve nearest sample and tangent
  -> calculate displacement projection along tangent
  -> validate lateral distance
  -> validate forward direction
  -> resolve current and next checkpoint
  -> reject backward, repeated or skipped advancement
  -> publish monotonic CourseProgressRevision
```

## Finish admission

```txt
accepted progress reaches terminal checkpoint
  -> sample current position against finish volume
  -> require forward direction and lateral eligibility
  -> require matching RunId, CourseManifestRevision and StepId
  -> apply collision precedence
  -> publish CourseCompletionResult
```

## Atomic participants

```txt
CourseProgressRevision
RunState route fields
Core Simulation committed frame
RunWon event
Core Scene transition
HUD progress descriptor
terminal presentation descriptor
public diagnostics
FirstEligibleFinishFrameAck
```

## Rejection and rollback

```txt
ineligible candidate leaves accepted progress unchanged
stale or duplicate candidate emits no new revision
failed completion preserves active run state
presentation mismatch withholds frame acknowledgement
retry retires the old progress generation
```

## Fixtures

```txt
forward full-course success
reverse-route rejection
start-area circle rejection
repeated-segment rejection
off-route movement rejection
checkpoint skip rejection
finish-volume wrong-direction rejection
collision-at-finish precedence
retry generation isolation
HUD and first-finish-frame correlation
```

## Validation boundary

This contract is documentation only. No course manifest, checkpoint, command, result, or runtime participant was added.
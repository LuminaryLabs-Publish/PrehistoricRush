# Interaction Audit: Feedback Surface Command and Result Map

**Timestamp:** `2026-07-15T00-00-35-04-00`  
**Status:** `game-feedback-control-surface-admission-authority-audited`

## Summary

DOM removal is currently an untyped side effect. It has no command identity, target surface identity, replacement requirement, rollback path, or result that downstream input and rendering can consume.

## Plan ledger

**Goal:** replace implicit selector mutation with typed feedback-surface commands and results.

- [x] Map page, wrapper, runtime, input, pause, and render participants.
- [x] Identify missing command/result identities.
- [x] Define acceptance and rejection statuses.
- [x] Define first-frame acknowledgement.
- [ ] Implement later.

## Command map

```txt
FeedbackSurfaceAdmissionCommand
  -> resolve FeedbackPolicyDescriptor
  -> resolve stable surface IDs
  -> validate semantic and action coverage
  -> prepare DOM and input-routing candidates
  -> accept, reject, roll back, or supersede
  -> publish FeedbackSurfaceAdmissionResult

FeedbackProjectionCommand
  -> require accepted feedback generation
  -> bind run and tick revisions
  -> update semantic status and visible controls
  -> publish FeedbackProjectionResult

FeedbackActionCommand
  -> require accepted action surface
  -> bind run, action, input-source, and command IDs
  -> route Jump, Retry, Run Again, Settings, or Exit
  -> publish FeedbackActionResult

render
  -> consume accepted projection
  -> acknowledge FirstFeedbackSurfaceFrameAck
```

## Required rejection reasons

```txt
unknown-surface
selector-wide-retirement
missing-semantic-status
missing-active-action
missing-terminal-action
missing-pointer-coverage
missing-touch-coverage
stale-run
stale-presentation
duplicate-command
superseded-generation
```

# Accessible Projection Command and Result Map

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

Current browser effects are driven directly from RAF state and pause-menu snapshots. The required interaction boundary converts accepted revisions into typed semantic and focus results before changing the DOM.

## Plan ledger

**Goal:** define explicit command, rejection, adoption and acknowledgement paths for semantic gameplay and pause focus.

- [x] Identify current raw browser effects.
- [x] Define revision-bound command inputs.
- [x] Define result and acknowledgement outputs.
- [ ] Implement the command/result path.

## Command map

```txt
AccessibleGameplayProjectionCommand
  documentGeneration
  projectionGeneration
  gameRevision
  committedFrameRevision
  outcomeRevision
  pauseRevision
  priorFocusControlId
  semanticSnapshot
```

## Result map

```txt
AccessibleGameplayProjectionResult
  commandId
  status: applied | duplicate | stale | rejected | retired
  appliedGameRevision
  appliedOutcomeRevision
  appliedPauseRevision
  statusControlId
  progressControlId
  dialogControlId
  focusedControlId
  restoredControlId
  announcementIds
  reason
```

## Interaction paths

```txt
active run revision
  -> derive status and progress
  -> deduplicate high-frequency values
  -> update stable semantic nodes
  -> publish applied result

terminal outcome revision
  -> derive one announcement ID
  -> reject duplicates
  -> update action label and live region atomically
  -> acknowledge terminal semantic frame

pause open revision
  -> capture accepted prior focus
  -> mount dialog semantics
  -> make background inert
  -> focus authored first action
  -> publish focus result

pause close revision
  -> retire dialog controls
  -> restore prior accepted focus or fallback
  -> remove inert state
  -> publish restoration result
```

## Rejection reasons

```txt
stale-document-generation
stale-game-revision
stale-pause-revision
duplicate-announcement
invalid-progress-range
missing-dialog-action
invalid-focus-target
retired-projection-generation
```

## Boundary

No runtime commands, results or browser focus effects were implemented.
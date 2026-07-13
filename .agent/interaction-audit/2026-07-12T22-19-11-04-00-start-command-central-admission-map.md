# Interaction Audit: Run Start Command Central Admission Map

**Timestamp:** `2026-07-12T22-19-11-04-00`

## Summary

The browser has four effective start sources: initial boot, UI button, Space/Enter keyboard input, and public engine access. They do not share one command envelope. Button and Space inspect status, Enter does not, repeat is not rejected, and the public capability can bypass browser policy.

## Plan ledger

**Goal:** admit every start source through one identity-, route-, status-, event-, and generation-bound command path.

- [x] Enumerate start sources.
- [x] Compare their current admission rules.
- [x] Identify bypass and repeat behavior.
- [x] Define one command envelope and typed rejection map.
- [ ] Implement later.

## Current admission matrix

| Source | Current policy | Missing authority |
|---|---|---|
| boot | unconditional `game.start()` | explicit boot-start identity and participant manifest |
| UI button | Jump if status is game, otherwise start | scene revision, command ID, duplicate/stale rejection |
| Space | Jump if status is game, otherwise start | repeat policy, focus/editable-target policy, command ID |
| Enter | always start | status/scene guard, repeat guard, duplicate/stale rejection |
| public engine access | direct domain API | browser/session capability, route policy, expected generation |

## Required command envelope

```txt
RunStartCommand
  commandId
  sequence
  runtimeSessionId
  runtimeGeneration
  source: boot | button | keyboard | public
  intent: Start | Retry | RunAgain | ExplicitRestart
  eventId
  eventRepeat
  focusContext
  sceneId
  sceneRevision
  status
  expectedRunGeneration
  requestedAtFrame
```

## Typed outcomes

```txt
Accepted
RejectedRepeat
RejectedDuplicate
RejectedStale
RejectedWrongScene
RejectedWrongStatus
RejectedActiveRun
RejectedFocusContext
RejectedSession
PreparationFailed
RolledBack
Indeterminate
```

## Required rule

No source may call domain `start()` directly. Every source submits the same command envelope and receives the same sealed result for duplicate delivery.

## Validation boundary

Interaction documentation only. No browser listener, public API, focus, key-repeat, or route behavior changed.
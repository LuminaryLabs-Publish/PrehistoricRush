# Cross-Document Profile Interaction Result Map

**Timestamp:** `2026-07-14T03-39-56-04-00`

## Summary

Menu, creator and game exchange profile state through localStorage, BroadcastChannel and storage events without command or message identity.

## Plan ledger

**Goal:** classify every profile interaction as accepted, duplicate, stale, conflicting, deferred or retired.

- [x] Map local save, broadcast and storage paths.
- [x] Map creator debounce and run bootstrap.
- [x] Define result classes.
- [ ] Add executable multi-document ordering fixtures.

## Result map

```txt
control input
  -> PendingLocalDraft

debounced write
  -> Accepted | Conflict | Stale | Failed | Retired

BroadcastChannel message
  -> Accepted | Duplicate | SameRevisionConflict | OutOfOrder | Foreign | Retired

storage event
  -> Accepted | Duplicate | SameRevisionConflict | OutOfOrder | Invalid | Retired

Play navigation
  -> RunCharacterAccepted | SupersededBeforeComposition | Failed | TimedOut

first character frame
  -> Visible | MismatchedArtifact | Failed | Retired
```

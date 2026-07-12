# Gameplay Audit: Stale Draft and Navigation Profile Loop

**Timestamp:** `2026-07-12T18-18-59-04-00`

## Summary

Character creation is part of the gameplay setup loop, but the edited creature can remain only in an in-memory draft for 160 ms. Navigation can enter the run before that draft has a durable commit, and concurrent tabs can overwrite profile fields without a conflict result.

## Plan ledger

**Goal:** make Customize → Save → Play one explicit gameplay transaction rather than a best-effort timeout followed by route navigation.

- [x] Trace control input to draft mutation.
- [x] Trace debounce scheduling and persistence.
- [x] Trace reset and external-update handling.
- [x] Trace navigation into game boot.
- [x] Identify lost-update and predecessor-profile run paths.
- [ ] Implement typed commit/navigation results and fixtures.

## Current loop

```txt
player edits slider or color
  -> creator draft changes immediately
  -> preview changes immediately
  -> status becomes Saving
  -> save timeout scheduled for 160 ms

player clicks Play before timeout
  -> route unload begins
  -> preview is disposed
  -> save timeout is not flushed or acknowledged
  -> game loads current localStorage profile
  -> run may use predecessor creature
```

## Concurrent-tab loop

```txt
Tab A and Tab B load profile revision R
Tab A schedules proportions patch based on its draft
Tab B commits material or proportions change as R+1
Tab A receives B and replaces visible draft
Tab A pending timer still holds predecessor-derived patch
Tab A timer reloads storage, merges stale patch and commits R+2
result: B's overlapping field can be silently replaced
```

A simultaneous-write variant is also possible:

```txt
A reads R
B reads R
A writes candidate R+1
B writes different candidate R+1
last complete snapshot wins
no conflict or duplicate revision is reported
```

## Gameplay consequences

```txt
created raptor can differ between creator preview and first run
menu card can display an older event after a newer one
reset can race with a pending or remote edit
players cannot tell whether Saving became durable
public host revision cannot distinguish conflicting same-revision snapshots
reloading or changing tabs can expose a different creature without a typed transition
```

## Required gameplay transaction

```txt
CustomizePlayerCommand
  -> mutate local draft revision
  -> preview draft with explicit volatile status
  -> acquire save lease
  -> CommitPlayerCharacterProfileCommand
  -> resolve conflict and durable effect
  -> PlayerProfileCommitResult
  -> project Saved only after success
  -> NavigateToRunCommand cites accepted commit
  -> runtime binds that profile commit
  -> first run frame acknowledges it
```

## Required policies

```txt
Play while save pending:
  flush and await | reject navigation | explicitly use predecessor

Remote commit while local draft pending:
  rebase disjoint fields | report conflict | discard local draft with receipt

Reset while save pending:
  cancel predecessor lease and commit reset barrier

Storage unavailable:
  allow explicit volatile session or reject durable-save claim
```

## Fixtures

```txt
edit-and-immediate-play
edit-and-immediate-menu
remote-edit-during-local-debounce
simultaneous-same-predecessor-write
reset-during-debounce
storage-write-failure
stale-delivery-after-newer-delivery
same-commit-dual-channel-delivery
first-run-frame-profile-binding
```

No claim is made that the visible creator profile is the durable profile or that the first run uses the last visible edit.
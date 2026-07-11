# Player Profile Audit: Cross-Page Commit Contract

**Timestamp:** `2026-07-11T10-58-10-04-00`

## Summary

The current store is a useful prototype but not a durable authority. It normalizes profiles, increments a locally observed revision, writes localStorage and broadcasts updates, yet it cannot detect concurrent writers, deduplicate notifications or prove what the game consumed.

## Plan ledger

**Goal:** define one durable, conflict-aware profile commit shared by menu, creator and game.

- [x] Trace schema normalization and merge.
- [x] Trace load, write, patch, reset and subscriptions.
- [x] Trace debounce behavior and cross-context delivery.
- [x] Define commit invariants and result types.
- [ ] Implement store adapter and deterministic fixtures.

## Current contract

```txt
load:
  missing/corrupt/unavailable -> default profile

save:
  load previous
  -> derive revision max(previous+1, candidate revision)
  -> normalize
  -> localStorage setItem
  -> BroadcastChannel post
  -> local listeners
  -> return profile

subscribe:
  module listener set
  + one storage listener per subscriber
  + shared BroadcastChannel listener
```

## Failure and race cases

```txt
- setItem can throw without typed result
- two tabs can calculate the same next revision
- last writer wins without conflict evidence
- storage and broadcast can duplicate delivery
- remote update can replace an active draft
- final debounce patch can omit other unsaved draft groups
- module channel/listeners survive unless explicitly closed
```

## Required commit envelope

```txt
ProfileWriteCommand {
  schemaVersion
  profileId
  expectedRevision
  expectedFingerprint
  writerId
  pageSessionId
  transactionId
  candidateProfile
}

ProfileWriteResult {
  status: accepted | conflicted | rejected | failed
  committedRevision
  committedFingerprint
  previousRevision
  writerId
  transactionId
  normalizedProfile
  error
}
```

## Invariants

```txt
accepted revisions are strictly ordered
same transaction is idempotent
conflicting expected revision cannot silently overwrite
one accepted transaction produces one logical sync event
menu, creator and game observe the same committed fingerprint
active run profile is sealed until explicit rebind or next run
all timers/listeners/channels are released by page lifecycle
```

## Fixture matrix

```txt
missing storage -> default result
corrupt JSON -> typed default/recovery result
quota/security failure -> failed result with no projection advance
two writers -> one accepted, one conflicted
rapid proportions+material edits -> both persist
storage+broadcast duplicate -> one logical notification
page disposal -> zero live timers/listeners/channel leases
profile load -> game descriptor/collision exact parity
```

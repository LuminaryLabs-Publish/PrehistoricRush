# Profile Store Audit: Debounce Flush and Route Sealing Contract

**Timestamp:** `2026-07-15T04-03-03-04-00`

## Summary

The store itself writes synchronously when called, but the creator delays calling it. Route navigation is not coupled to the scheduled work, and unload cleanup does not invoke the store. The missing contract sits above localStorage: pending-draft settlement before route transfer.

## Plan ledger

**Goal:** preserve debounced editing while guaranteeing that explicit route actions either commit the current draft or remain on the creator with a typed failure.

- [x] Separate store write behavior from creator scheduling behavior.
- [x] Preserve profile normalization and revision assignment.
- [x] Preserve BroadcastChannel and storage-event publication.
- [x] Define dirty-state, flush, readback, and route-sealing rules.
- [ ] Implement an explicit scheduler flush API.
- [ ] Add failure and concurrency fixtures.

## Current store behavior

```txt
loadPlayerCharacterProfile
  localStorage getItem
  parse and normalize
  default on missing or read failure

savePlayerCharacterProfile
  load previous profile
  assign revision and updatedAt
  normalize
  localStorage setItem when available
  publish BroadcastChannel update
  notify local listeners
  return profile

patchPlayerCharacterProfile
  load current stored profile
  merge patch
  save complete profile
```

## Current scheduler behavior

```txt
updateDraft
  clear previous timer
  set saveTimer = setTimeout(write, 160)

reset
  clear timer
  write immediately

navigation or unload
  no scheduler flush
  no accepted result prerequisite
```

## Required contract

```txt
CreatorPersistenceScheduler
  schedule(command)
  getPending()
  flush({ reason, destinationIntent })
  cancel({ reason, expectedMutationId })
  dispose({ requireClean })

flush result
  commandId
  latestMutationId
  expectedStoredRevision
  acceptedStoredRevision
  payloadHash
  status
  failureCode
```

## Invariants

- `dirty == true` from the first accepted draft mutation until a matching stored readback is verified.
- Scheduling a later mutation supersedes the earlier pending command explicitly.
- Menu and Play call `flush()` and await an accepted result before changing location.
- `beforeunload` and `pagehide` cannot silently claim success. They may perform a best-effort synchronous write and record that no destination receipt exists.
- A destination receipt must identify the exact stored revision and payload hash.
- The game seals the accepted profile receipt to the generated creature content hash.
- Storage unavailability, quota failure, serialization failure, stale base revision, and conflicting remote updates are terminal result classes, not console-only conditions.

## Retained relationship

The prior profile-revision audit remains responsible for cross-document ordering and stale writer admission. This contract adds deterministic route sealing for the creator's local pending mutation.
# Interaction Audit: Profile Edit, Commit, Delivery and Binding Map

**Timestamp:** `2026-07-12T18-18-59-04-00`

## Summary

Profile interaction currently crosses controls, a debounce timer, localStorage, BroadcastChannel, storage events, menu/creator projection and game boot without one command/result envelope or ordered delivery contract.

## Plan ledger

**Goal:** turn each user or external profile event into a typed interaction with explicit source, predecessor, terminal result and consumer receipts.

- [x] Identify all interaction sources.
- [x] Map current direct calls and side effects.
- [x] Define command, result and delivery envelopes.
- [x] Define navigation and runtime-binding admission.
- [ ] Implement adapters and parity fixtures.

## Interaction sources

```txt
creator slider input
creator color input
creator reset button
creator Play link
creator Menu link
menu initial load
BroadcastChannel message
storage event
programmatic patch/save/reset
page unload
runtime game boot
```

## Current map

```txt
control input
  -> updateDraft(patch)
  -> draft/preview mutation
  -> timer replacement
  -> patchPlayerCharacterProfile(patch)

patchPlayerCharacterProfile
  -> loadPlayerCharacterProfile
  -> deep merge
  -> savePlayerCharacterProfile

savePlayerCharacterProfile
  -> load previous
  -> allocate numeric revision
  -> normalize
  -> localStorage.setItem
  -> BroadcastChannel.postMessage
  -> local listeners
  -> return profile object

external delivery
  -> normalize payload
  -> invoke listener
  -> creator/menu mutate projection

navigation
  -> route immediately
  -> no save command/result admission

game boot
  -> load profile
  -> compose runtime
```

## Missing identities

```txt
interaction source ID
writer session ID
profile command ID
command sequence
expected predecessor revision/fingerprint
local draft revision
save lease ID
commit ID
channel event ID
delivery attempt ID
projection revision
runtime binding ID
visible frame ID
```

## Required command envelopes

```txt
PlayerProfileEditCommand
  commandId
  writerSessionId
  sourceKind
  sequence
  profileId
  expectedProfileRevision
  expectedProfileFingerprint
  draftRevision
  fieldPatch

PlayerProfileResetCommand
  commandId
  writerSessionId
  expectedProfileRevision
  resetPolicy

PlayerProfileNavigateCommand
  commandId
  destination
  requiredCommitId | explicitPredecessorPolicy
```

## Required terminal result

```txt
PlayerProfileCommitResult
  commandId
  writerSessionId
  profileId
  predecessorRevision
  predecessorFingerprint
  successorRevision
  successorFingerprint
  commitId
  status
  conflictPaths
  changedPaths
  storageStatus
  readbackVerified
```

## Required channel envelope

```txt
PlayerProfileCommitEnvelope
  eventId
  commitId
  writerSessionId
  profileId
  revision
  fingerprint
  committedAt
  profile
```

## Admission map

```txt
receive envelope
  -> validate schema and profile ID
  -> reject duplicate event/commit ID
  -> compare revision and fingerprint with current projection
  -> reject older revision
  -> classify same revision/same fingerprint as duplicate
  -> classify same revision/different fingerprint as conflict
  -> rebase/cancel pending local save lease
  -> commit projection revision
  -> publish delivery result
```

## Navigation map

```txt
click Play or Menu
  -> inspect pending save lease
  -> flush and await terminal result, or return typed rejection
  -> bind destination to accepted commit ID
  -> unload creator resources only after policy result
```

## Runtime binding map

```txt
game boot
  -> read durable profile envelope
  -> verify commit/fingerprint
  -> create RuntimePlayerProfileBinding
  -> compose procedural creature
  -> publish binding in public readback
  -> acknowledge first profile-dependent frame
```

Browser controls, cross-tab adapters and public APIs should all terminate in the same authority rather than calling storage helpers directly.
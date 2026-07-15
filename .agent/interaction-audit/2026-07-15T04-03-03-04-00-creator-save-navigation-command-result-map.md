# Interaction Audit: Creator Save and Navigation Command/Result Map

**Timestamp:** `2026-07-15T04-03-03-04-00`

## Summary

Creator input, save scheduling, and navigation are currently implicit DOM side effects. This audit defines explicit commands and terminal results so navigation cannot outrun persistence.

## Plan ledger

**Goal:** turn draft mutation and route transfer into inspectable, rejectable, replayable interactions.

- [x] Identify current input, timer, store, navigation, unload, and destination effects.
- [x] Define commands, results, identities, and rejection classes.
- [x] Preserve browser storage and navigation as adapters.
- [ ] Implement and publish through product-level authority.

## Current map

```txt
range/color input
  -> updateDraft(patch)
  -> mutate in-memory draft
  -> update preview
  -> set text to Saving
  -> clearTimeout(saveTimer)
  -> setTimeout(..., 160)
  -> no command ID
  -> no result

timeout
  -> patchPlayerCharacterProfile
  -> localStorage setItem
  -> optional BroadcastChannel message
  -> set text to Saved
  -> no durable verification result

Menu or Play anchor activation
  -> browser navigation
  -> no route intent command
  -> no pending-write check
  -> no commit prerequisite
  -> no result transfer
```

## Required command/result map

```txt
CreatorDraftMutationCommand
  mutationId
  documentGeneration
  baseProfileRevision
  fieldPath
  candidateValue

CreatorDraftMutationResult
  accepted | invalid | stale | superseded
  draftRevision
  normalizedValue
  dirty

CreatorProfileCommitCommand
  commandId
  documentGeneration
  expectedStoredRevision
  draftRevision
  completeCandidate
  destinationIntent

CreatorProfileCommitResult
  accepted | conflict | invalid | storage-unavailable |
  storage-failed | verification-failed | stale | duplicate | superseded
  profileId
  storedRevision
  payloadHash
  committedAt

CreatorNavigationCommand
  commandId
  commitResultId
  destination

CreatorNavigationResult
  accepted | blocked | stale | duplicate | superseded
  expectedProfileId
  expectedProfileRevision
  expectedPayloadHash
  navigationGeneration
```

## Admission rules

- Menu and Play are semantic route intents, not unconditional anchors while dirty.
- The latest accepted mutation must be represented by the committed complete candidate.
- A storage exception cannot be translated into successful navigation.
- A conflicting remote revision must be resolved before commit or rejected visibly.
- Duplicate activation must reuse or reject the existing command, not create two navigations.
- The destination must verify the transferred profile receipt before composing the run character.
- A page lifecycle flush is fallback protection, not the main interaction contract.
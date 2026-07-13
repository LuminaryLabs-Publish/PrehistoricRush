# Interaction Audit: Profile to Composition Transition Result Map

**Timestamp:** `2026-07-13T13-58-35-04-00`

## Goal

Map browser profile edits and game boot evidence into typed composition and visible-transition results.

## Current creator interaction

```txt
range/color input
  -> mutate in-memory draft
  -> render controls
  -> setTargetProfile(draft)
  -> mutate live composition registries
  -> mark Saving
  -> replace debounce timer
  -> persist profile after 160 ms
  -> setTargetProfile(committed profile) again
  -> mark Saved
```

External profile distribution and Reset call the same target path.

## Current result surface

`setTargetProfile()` returns only:

```txt
{ mode: "damped-morph" | "topology-crossfade", revision }
```

`getState()` returns:

```txt
targetRevision
appliedRevision
transitioning
mode
```

Neither surface identifies registry participants, support evidence, failure, cancellation, stale work or visible-frame completion.

## Required command map

```txt
ProfileDraftChanged
  -> ProfileRevisionCandidate
  -> PlayerCharacterCompositionCommand
  -> CompositionPreparationResult
  -> RegistryAdoptionResult
  -> PreviewTransitionCommand
  -> PreviewTransitionResult
  -> FirstComposedCharacterFrameAck
  -> PersistenceCommitResult
```

## Required terminal statuses

```txt
Accepted
Duplicate
Replaced
StaleProfile
StaleGeneration
Conflict
InvalidBody
InvalidRig
InvalidSupport
InvalidBinding
PossessionRejected
MeshPreparationFailed
FramingPreparationFailed
AdoptionFailed
RolledBack
Cancelled
VisibleAcknowledged
```

## Interaction policy

- Draft and durable profile revisions must be distinct and explicit.
- A later edit retires an older unadopted composition attempt.
- Saving status must reflect durable profile commit, not merely timer scheduling.
- Ready status must require the first visible frame for the accepted profile revision.
- Reset must retire pending save, composition and crossfade generations together.
- External profile updates must use the same stale/duplicate policy as local edits.
- Error projection must identify whether the durable profile, registries or visible preview remain on the predecessor.

## Completion gate

No creator interaction is complete until the profile command, composition result, visible transition and durable save can be correlated by revision and every failure has one terminal result.
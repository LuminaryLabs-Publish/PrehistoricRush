# Character Creator Audit: Draft, Commit and Preview Frame Contract

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

The creator has the correct major building blocks but no composed state machine. This contract defines how the draft, durable profile, descriptor, mesh, camera fit and visible frame advance without losing edits or publishing contradictory statuses.

## Plan ledger

**Goal:** specify one deterministic creator state machine that can be tested without changing the generator or renderer ownership.

- [x] Define states and revisions.
- [x] Define edit, flush, transition and frame transactions.
- [x] Define failure and conflict handling.
- [x] Define status projection.
- [ ] Implement and validate.

## State machine

```txt
clean-ready
  -> edit admitted

dirty-transitioning
  -> descriptor converged and frame committed

dirty-ready
  -> debounce flush begins

saving-ready | saving-transitioning
  -> write accepted

saved-transitioning
  -> frame for committed profile arrives

saved-ready
```

Failure branches:

```txt
save-conflict
save-error
preview-error
fit-error
disposed
```

## Revision contract

```txt
profileRevision
  durable storage order

draftRevision
  every accepted local edit

descriptorRevision
  every generated descriptor content change

meshRevision
  every completed morph/crossfade target

viewportRevision
  every width/height/aspect/projection change

cameraFitRevision
  every admitted bounds + viewport fit

previewFrameId
  every committed renderer submission
```

No revision may substitute for another.

## Edit contract

```txt
admit command
  -> validate control path and normalized value
  -> merge into canonical draft
  -> increment draftRevision
  -> add dirty path
  -> generate descriptor
  -> increment descriptorRevision if fingerprint changed
  -> update transition target
  -> schedule flush using draft identity, not partial content
```

## Flush contract

```txt
capture full canonical profile
  -> normalize
  -> compare baseProfileRevision
  -> write atomically or return conflict
  -> increment committed profile revision once
  -> publish profile fingerprint
  -> retain dirty fields on failure
  -> clear only paths included in accepted draft revision
```

Edits arriving while a flush is in flight create a later draft revision and remain dirty after the earlier write completes.

## Transition contract

```txt
compatible topology
  -> damp positions, normals, colors, scale and material
  -> apply damped pose
  -> converge by descriptor delta and pose policy

incompatible topology
  -> create next mesh
  -> union bounds for both meshes
  -> crossfade opacity
  -> dispose predecessor after committed completion
```

A transition result cites descriptor and mesh revisions, not the storage revision alone.

## Framing contract

```txt
current visible mesh set
  -> conservative posed world bounds
  -> viewport projection inputs
  -> horizontal and vertical fit
  -> screen margin policy
  -> damped camera commit
  -> measured frame result
```

## Status contract

```txt
Saving
  a current or predecessor draft flush is active

Saved
  current draft content has a successful durable profile result

Updating
  current draft descriptor or viewport is not frame-committed

Ready
  current draft descriptor and viewport have a committed fit frame

Saved + Ready
  durable profile and visible frame share profile fingerprint
```

## Disposal contract

```txt
beforeunload/dispose
  -> stop RAF admission
  -> cancel timer
  -> optionally flush complete dirty draft by declared policy
  -> disconnect ResizeObserver
  -> unsubscribe profile listeners
  -> close or release profile-store lease
  -> dispose transition meshes
  -> dispose platform/ring resources
  -> dispose renderer
```

The current page does not retain the unsubscribe callback from `subscribePlayerCharacterProfile`; the complete owner should do so.

## Acceptance conditions

```txt
no accepted edit is dropped by debounce replacement
no stale write clears newer dirty paths
no remote update silently replaces a dirty draft
no Ready projection precedes mesh convergence and frame commit
no Saved projection precedes durable acceptance
no framing result omits current viewport revision
no Play navigation starts from a different profile fingerprint
all disposal is idempotent
```
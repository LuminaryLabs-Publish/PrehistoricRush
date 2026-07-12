# Interaction Audit: Control, Draft, Save and Profile Result Map

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

Creator input currently produces an immediate visual change and a later untyped storage mutation. The initiating control cannot identify whether its edit was retained in the durable profile or visible in a committed frame.

## Plan ledger

**Goal:** define typed interaction results from each control event through draft, save and frame acknowledgement.

- [x] Trace DOM input listeners.
- [x] Trace timer replacement and store calls.
- [x] Trace local/broadcast/storage subscriptions.
- [x] Define command and result identities.
- [ ] Implement and project results.

## Current interaction map

```txt
range/color input event
  -> read data-group/data-key or data-color
  -> create one partial patch
  -> updateDraft(partialPatch)
  -> mutate local draft
  -> render controls
  -> set preview target
  -> Saving
  -> clearTimeout(previous)
  -> setTimeout(partialPatch)

save timer
  -> patchPlayerCharacterProfile(partialPatch)
  -> load stored profile
  -> deep merge partial patch
  -> increment revision
  -> localStorage write
  -> BroadcastChannel post
  -> local listeners
  -> replace creator draft
  -> Saved

remote update
  -> replace local draft immediately
  -> set preview target
  -> Updated
```

## Missing command envelope

```txt
CreatorEditCommand {
  commandId
  creatorSessionId
  draftId
  predecessorDraftRevision
  controlPath
  value
  source
  timestamp
}
```

## Missing edit result

```txt
CreatorEditResult {
  commandId
  accepted
  draftRevision
  dirtyPaths
  descriptorRevision
  descriptorFingerprint
  previewTransitionPlan
}
```

## Missing flush result

```txt
CreatorFlushResult {
  commandId
  draftId
  draftRevision
  predecessorProfileRevision
  accepted
  committedProfileRevision
  profileFingerprint
  conflict
  retainedDirtyPaths
}
```

## Missing frame result

```txt
CreatorPreviewFrameResult {
  frameId
  draftRevision
  committedProfileRevision
  descriptorRevision
  meshRevision
  viewportRevision
  cameraFitRevision
  transitionMode
  converged
  saved
  ready
}
```

## Remote-update admission

A storage or BroadcastChannel update must not blindly replace a dirty local draft. It requires one of:

```txt
reject remote update and expose conflict
merge non-overlapping paths deterministically
stage remote profile until local flush completes
explicitly discard local draft through a user command
```

The selected policy must return a typed result and preserve causality.

## DOM projection rule

```txt
Saving
  profile flush pending or retrying

Saved
  durable write accepted for current draft revision

Updating
  descriptor/mesh/camera for current draft is not yet frame-committed

Ready
  current descriptor and viewport are acknowledged by a preview frame

Saved + Ready
  current durable profile fingerprint equals current visible frame fingerprint
```

## Acceptance conditions

Every control event is traceable to a draft revision, flush result and preview frame. No edit disappears solely because a later control reset the debounce timer.
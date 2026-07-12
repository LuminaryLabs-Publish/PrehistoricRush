# Architecture Audit: Character Creator Draft and Frame DSK Map

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

The creator currently composes profile storage, generator output, Three mesh adaptation, transition logic, inline framing and DOM status without one parent authority. The proposed parent domain coordinates those existing services rather than replacing them.

## Plan ledger

**Goal:** define exact ownership from edit command through committed profile and visible preview frame.

- [x] Map existing owners.
- [x] Identify duplicated or implicit authority.
- [x] Define proposed parent and child kits.
- [x] Define transaction order and result envelopes.
- [x] Preserve shared generator and Three adapter ownership.
- [ ] Implement the domain.

## Existing composition

```txt
character-creator-page-kit
  -> local draft mutation
  -> timer scheduling
  -> DOM statuses
  -> showcase lifecycle
  -> inline camera framing

player-character-profile-store-kit
  -> localStorage read/write
  -> revision increment
  -> subscriptions and broadcast

procedural-creature-body-kit
  -> normalized procedural descriptor
  -> pose generation

character-preview-transition-kit
  -> morph or topology crossfade
  -> applied/target revision state

three-procedural-creature-adapter-kit
  -> SkinnedMesh, geometry/material damping, pose and disposal

Three runtime
  -> viewport, camera and render submission
```

## Authority conflict

```txt
page owns draft but store owns revision
page owns debounce but captures partial patch
transition owns morph but uses profile revision as descriptor revision
page owns Ready projection but has no committed frame
page owns camera fit but uses local geometry heuristic
store owns Saved write but has no visible-frame proof
```

## Proposed parent domain

```txt
prehistoric-rush-character-creator-authority-domain
```

### Command and draft kits

```txt
creator-edit-command-kit
  normalize control path/value and command identity

creator-draft-id-kit
  identify one editing session

creator-draft-revision-kit
  increment on every admitted edit

creator-dirty-field-set-kit
  retain every changed path until commit

creator-debounce-policy-kit
  schedule flush without owning draft content

creator-flush-command-kit
  capture complete draft and predecessor revision
```

### Persistence kits

```txt
canonical-profile-write-kit
  validate and persist the complete normalized draft

profile-write-result-kit
  accepted/rejected/error result with committed profile

profile-conflict-result-kit
  expose predecessor/current revision conflict and merge policy
```

### Descriptor and transition kits

```txt
creature-descriptor-revision-kit
  identify descriptor content independently from profile revision

preview-transition-plan-kit
  choose damped morph or topology crossfade

preview-transition-result-kit
  expose target/applied descriptor revisions, convergence and topology state
```

### Bounds and framing kits

```txt
posed-creature-bounds-kit
  provide conservative world-space bounds for current visible pose

viewport-revision-kit
  identify width, height, aspect, DPR and camera projection revision

projection-correct-fit-kit
  solve horizontal/vertical camera fit with declared margins
```

### Frame and observation kits

```txt
preview-frame-commit-kit
  commit one rendered preview frame and receipts

saved-visible-parity-kit
  require durable profile and visible frame to share fingerprint

creator-observation-kit
  detached read model for DOM status and diagnostics

creator-journal-kit
  ordered edit, flush, transition and frame evidence

creator-draft-frame-fixture-kit
  deterministic headless and browser proof
```

## Required state model

```txt
CreatorAuthorityState {
  creatorSessionId
  draftId
  draftRevision
  baseProfileRevision
  committedProfileRevision
  dirtyPaths
  profileFingerprint
  descriptorRevision
  descriptorFingerprint
  meshRevision
  transitionState
  viewportRevision
  cameraFitRevision
  lastPreviewFrameId
  saveState
  readyState
}
```

## Required transaction

```txt
EditCommand
  -> admit against creator session
  -> merge value into canonical draft
  -> increment draftRevision
  -> retain dirty path
  -> generate descriptor and fingerprint
  -> prepare transition
  -> render draft frame

FlushCommand
  -> capture complete canonical draft
  -> compare predecessor profile revision
  -> commit or return conflict
  -> retain dirty state on failure
  -> publish committed profile fingerprint
  -> require preview frame for committed fingerprint
  -> clear committed dirty paths
  -> project Saved + Ready
```

## Dependency rules

```txt
profile store remains persistence adapter
procedural-creature-body-kit remains descriptor authority
three-procedural-creature.js remains mesh/pose/disposal adapter
character-preview-transition.js remains transition adapter
viewport fitting moves out of the page into one testable owner
DOM becomes projection only
```

## Acceptance gate

The parent domain is complete only when rapid cross-group edits, cross-tab conflicts, morph convergence, topology crossfade, portrait/square/wide fit and creator/game profile parity have executable proof.
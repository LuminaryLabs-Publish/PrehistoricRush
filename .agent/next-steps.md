# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T21-00-00-04-00`

## Summary

Finish the route/profile proof, then make creator edits transactional and preview framing projection-correct before returning to patch, collider, cadence, readiness, frame, reset and lifecycle gates.

## Plan ledger

**Goal:** produce one creator path where every control edit survives debounce, every saved revision reaches the game, and every Ready/Saved status is backed by a visible correctly framed creature frame.

- [ ] Complete route and deployed-page artifact proof.
- [ ] Implement creator draft identity and dirty-field accumulation.
- [ ] Replace partial-patch debounce commits with full canonical-draft flushes.
- [ ] Add profile predecessor validation and typed conflict results.
- [ ] Add descriptor fingerprints and transition identities.
- [ ] Replace heuristic local-box framing with projection-correct fit.
- [ ] Commit preview frames carrying draft, profile, descriptor and viewport revisions.
- [ ] Gate Saved and Ready on durable-write and visible-frame receipts.
- [ ] Prove creator/game profile fingerprint parity.
- [ ] Continue patch, collider, cadence, readiness, frame, reset and lifecycle work afterward.

## Ordered implementation queue

```txt
1. Route Artifact + Game Profile Handoff Final Proof
2. Character Creator Draft + Commit + Preview Frame Authority
3. Patch Activation / Release Commit Authority
4. Exact Collider Replacement + Collision Admission
5. Stream Cadence + Time Budget Authority
6. World Readiness + Movement Admission
7. Committed Gameplay Frame + Host Read Model
8. Run / Stream / Collider / Worker / Frame Epoch Reset
9. Runtime Lifecycle + Ordered Disposal
```

## Creator implementation sequence

### 1. Introduce draft identity

```txt
CreatorDraftState {
  draftId
  draftRevision
  baseProfileRevision
  dirtyPaths
  profile
  descriptorFingerprint
  status
}
```

Every input event must increment `draftRevision`, merge into the same canonical draft and add its path to `dirtyPaths`.

### 2. Flush the complete draft

Current behavior captures one final partial patch. Replace it with:

```txt
debounce expires
  -> snapshot complete canonical draft
  -> capture baseProfileRevision
  -> submit one profile write command
  -> retain dirty fields until accepted
```

A later input may cancel the timer, but it must not delete dirty fields already represented in the canonical draft.

### 3. Add typed profile results

```txt
ProfileWriteResult {
  commandId
  draftId
  draftRevision
  predecessorRevision
  accepted
  committedProfileRevision
  profileFingerprint
  conflict
  error
}
```

Cross-tab writes must either merge by an explicit policy or reject with the observed and current revisions. Silent last-writer replacement is not sufficient.

### 4. Separate revision classes

Do not reuse one profile revision for every preview stage.

```txt
draftRevision
profileRevision
descriptorRevision
meshRevision
poseRevision
viewportRevision
previewFrameId
```

`Ready` requires the rendered mesh and camera to acknowledge the current descriptor and viewport. `Saved` requires durable profile write success. `Saved + Ready` requires both conditions for the same profile fingerprint.

### 5. Implement projection-correct framing

For the active mesh or crossfade pair:

```txt
update skeleton matrices
compute conservative posed world bounds
union previous and next bounds during crossfade
transform bounds into camera-facing fit space
calculate vertical fit from camera fov
calculate horizontal fit from fov and aspect
apply declared screen-space margin
clamp only after fit distance is known
commit camera target and distance against viewportRevision
```

Use a stable conservative descriptor bound if per-frame skinned bounds are too expensive. The fallback must be documented and tested.

### 6. Commit a preview frame receipt

```txt
PreviewFrameReceipt {
  frameId
  draftRevision
  profileRevision
  profileFingerprint
  descriptorRevision
  descriptorFingerprint
  meshRevision
  viewportRevision
  cameraFitRevision
  transitionMode
  saved
  ready
  bounds
  screenMargins
}
```

The DOM status should project this receipt rather than infer state from revision equality alone.

### 7. Preserve shared generator and adapter ownership

- [ ] Keep `procedural-creature-body-kit` as descriptor authority.
- [ ] Keep `three-procedural-creature.js` as the shared mesh/pose/disposal adapter.
- [ ] Extend `character-preview-transition.js`; do not duplicate it in the page.
- [ ] Move inline viewport fitting into one testable adapter or kit.
- [ ] Keep one preview RAF and one ResizeObserver.

## Required fixtures

```bash
node scripts/prehistoric-rush-creator-rapid-multigroup-edit-fixture.mjs
node scripts/prehistoric-rush-creator-debounce-flush-fixture.mjs
node scripts/prehistoric-rush-profile-write-conflict-fixture.mjs
node scripts/prehistoric-rush-preview-revision-state-fixture.mjs
node scripts/prehistoric-rush-preview-topology-crossfade-fixture.mjs
node scripts/prehistoric-rush-preview-portrait-fit-fixture.mjs
node scripts/prehistoric-rush-preview-square-fit-fixture.mjs
node scripts/prehistoric-rush-preview-wide-fit-fixture.mjs
node scripts/prehistoric-rush-preview-saved-ready-frame-fixture.mjs
node scripts/prehistoric-rush-creator-game-profile-parity-fixture.mjs
node scripts/prehistoric-rush-character-creator-browser-smoke.mjs
node scripts/prehistoric-rush-character-creator-pages-smoke.mjs
```

## Acceptance conditions

```txt
rapid Size then Skin edits persist together
rapid edits in all six visible controls persist together
cancelled debounce timers cannot remove dirty paths
cross-tab predecessor conflicts return typed results
preview cannot report Ready while descriptor damping remains above threshold
Saved cannot appear before durable write success
Saved + Ready identifies one profile fingerprint and one preview frame
portrait, square and wide viewports preserve declared margins
animated tail, legs and topology crossfade remain in frame
opening game.html produces the same committed creature fingerprint
```

## Do not do next

Do not add a second profile store, generator, creature adapter, preview RAF or persistence channel. Do not solve framing with another fixed distance multiplier. Do not clear dirty fields when a timer is cancelled. Do not treat stored revision equality as mesh or frame completion.
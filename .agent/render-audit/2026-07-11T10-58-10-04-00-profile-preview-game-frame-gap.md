# Render Audit: Profile Preview to Game Frame Gap

**Timestamp:** `2026-07-11T10-58-10-04-00`

## Summary

The character creator previews a simplified CSS silhouette, while the game renders an unrelated procedural creature built from the static preset. No render result proves that a saved profile reached geometry, material, collision or a displayed frame.

## Plan ledger

**Goal:** make creator preview and game rendering consume the same accepted profile-to-descriptor result.

- [x] Trace creator preview input.
- [x] Trace game creature descriptor input.
- [x] Trace Rapier and Three bindings.
- [x] Record missing frame evidence.
- [ ] Add shared preview/game binding and frame fixtures.

## Current render paths

```txt
creator:
  saved/draft profile
  -> CSS width, height, tail and colors
  -> no procedural geometry
  -> no skeleton, collision or topology validation

game:
  static player-raptor-preset-kit
  -> procedural-creature-body-kit
  -> Three BufferGeometry + Skeleton + SkinnedMesh
  -> Rapier capsule
  -> pose and renderer.render
```

## Gaps

```txt
- creator and game do not share a profile adapter
- creator preview does not use exact geometry or material binding
- game does not name profile revision/fingerprint
- Rapier binding does not name profile revision/fingerprint
- render resources expose no typed binding result
- renderer emits no frame receipt
- host readback omits profile identity
- no browser image/projection parity fixture exists
```

## Required render contract

```txt
acceptedProfileFingerprint
  -> CreatureDescriptorResult
  -> CollisionBindingResult
  -> CreatorPreviewBindingResult
  -> GameRenderBindingResult
  -> frameId + profileRevision + creatureGeometryHash
  -> RenderFrameReceipt
```

## Required proof

```txt
same committed profile produces same normalized recipe in creator and game
profile color edits change preview and game material identity
proportion edits change exact geometry identity
collision edits change Rapier binding identity
one displayed frame names accepted profile, descriptor and collision revisions
```

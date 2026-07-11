# Interaction Audit: Creature Descriptor Admission Result Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`

## Summary

Creature construction is currently an implicit startup operation. The product requests a descriptor, immediately binds it into Three and registers its collision recommendation with Rapier. There is no typed admission boundary between generated data and consumer mutation.

## Plan ledger

**Goal:** turn creature creation and binding into an explicit, observable admission sequence with stable results and rejection reasons.

- [x] Map descriptor creation through render and physics consumers.
- [x] Identify result-free operations and silent degradation.
- [x] Define the required command/result vocabulary.
- [ ] Implement product admission and consumer result ledgers.

## Current interaction map

```txt
createPrehistoricRushKitGraph()
  -> player-raptor-preset-kit configuration
  -> proceduralCreatureBody.create()
  -> prehistoricRush.getPlayerBody()
  -> createRapierAdapter(playerBody.collision)
  -> createCreatureMesh(THREE, playerBody)
  -> createPlayerPose(frame state)
  -> applyCreaturePose(mesh, pose)
  -> renderer.render(scene, camera)
```

## Current implicit outcomes

```txt
procedural body create
  throws on unsupported archetype
  otherwise returns descriptor

Rapier actor registration
  optional chain
  no product binding result

Three geometry creation
  mutates geometry and scene
  no descriptor admission result
  no orientation result
  no binding fingerprint

pose application
  silently skips unknown bones
  returns no result

render
  consumes live mesh
  returns no creature-specific acknowledgement
```

## Required command vocabulary

```txt
CreatePlayerCreatureDescriptor
AdmitPlayerCreatureDescriptor
BindPlayerCreatureRender
BindPlayerCreatureCollision
ApplyPlayerCreaturePose
CommitPlayerCreatureFrame
DisposePlayerCreatureBinding
```

## Required result vocabulary

```txt
CreatureDescriptorResult
  created | rejected
  descriptorId
  sourceRevision
  descriptorSchemaVersion
  geometryHash
  skeletonHash
  collisionHash
  reason

CreatureRenderBindingResult
  accepted | rejected
  bindingId
  descriptorId
  geometryHash
  attribute counts
  orientation result
  material policy
  reason

CreatureCollisionBindingResult
  accepted | rejected
  actorId
  descriptorId
  collisionHash
  reason

CreaturePoseApplicationResult
  accepted | rejected | duplicate | stale
  bindingId
  poseRevision
  appliedBoneCount
  missingBoneIds
  reason

CreatureFrameResult
  committed | skipped | rejected
  frameId
  renderBindingId
  geometryHash
  poseRevision
  cameraRevision
  reason
```

## Admission order

```txt
1. Resolve and verify pinned source graph.
2. Create descriptor.
3. Validate schema and full payload hashes.
4. Validate indices, normals, skeleton and skin data.
5. Admit descriptor into the active run/session epoch.
6. Prepare Three and Rapier bindings independently.
7. Commit both bindings only after both prepare successfully.
8. Admit pose updates against the committed binding.
9. Correlate committed frames.
10. Dispose all bindings exactly once.
```

## Required rejection reasons

```txt
unsupported-schema
source-revision-mismatch
geometry-hash-mismatch
invalid-index
non-finite-position
non-finite-normal
normal-orientation-mismatch
invalid-bone-index
invalid-skin-weight
skeleton-cycle
render-binding-failed
collision-binding-failed
stale-session
stale-binding
disposed
```

## Observation boundary

`PrehistoricRushHost` should expose detached result summaries only. It should not expose mutable adapter, mesh, skeleton, physics or creature-service owners.

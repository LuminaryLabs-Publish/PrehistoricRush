# Render Audit: Descriptor to Three Binding and Lifecycle Gap

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`

## Current render path

```txt
procedural creature descriptor
  -> BufferGeometry indices
  -> position, normal, color, skinIndex and skinWeight attributes
  -> Bone objects from skeleton definitions
  -> parent-child bone hierarchy
  -> Skeleton
  -> MeshStandardMaterial
  -> SkinnedMesh
  -> bind and normalize skin weights
  -> add to scene
  -> apply pose bone transforms each frame
  -> renderer.render(scene, camera)
```

The adapter is functional and directly consumes renderer-agnostic data, but it exists as private functions in `src/game.js` rather than as an explicit render adapter with observable preparation and disposal results.

## Missing admission checks

```txt
index bounds against vertex count
position/normal/color array length parity
skinIndex and skinWeight tuple alignment
finite values in geometry and pose arrays
skin weights sum and normalization delta
unique bone IDs
valid parent IDs
acyclic bone hierarchy
root bone presence
skin indices within bone count
attachment bone references
material descriptor validation
collision descriptor validation
content hash continuity after transport
```

Three.js may reject or tolerate malformed data at different stages. The host currently has no deterministic preflight classifying the descriptor as accepted, rejected or repaired.

## Missing binding result

The current path returns only a live `SkinnedMesh`. It does not retain:

```txt
binding id
creature id
preset id
kit version
content hash
geometry vertex/index/triangle counts
bone count and root id
material identity
binding status and failures
prepared sequence
disposed sequence
```

## Lifecycle gap

The creature adapter allocates:

```txt
BufferGeometry
index and five buffer attributes
Bone objects
Skeleton
MeshStandardMaterial
SkinnedMesh
scene membership
userData references to descriptor and bone map
```

No explicit `dispose()` removes the mesh from the scene, disposes geometry/material resources, clears retained descriptor/bone references, or returns an idempotent cleanup result. The broader renderer and frame loop also have no terminal lifecycle transaction.

## Pose consumption gap

`applyCreaturePose()` silently ignores unknown bone IDs, mutates bone transforms and updates the skeleton. It returns no result, so the runtime cannot prove:

```txt
which pose was applied
which frame consumed it
how many bones matched
which bones were missing
whether transforms were finite
whether the pose matched the active descriptor hash
whether render submission consumed that pose
```

## Required render adapter

```txt
prepare({ descriptor, THREE, scene })
  -> validate descriptor
  -> build detached resources
  -> return accepted/rejected prepare result

commit(prepared)
  -> add one binding to the scene
  -> publish immutable binding result

updatePose({ bindingId, pose, frameId, runId })
  -> validate hash and bones
  -> apply transforms
  -> publish pose-consumption row

dispose({ bindingId })
  -> detach scene object
  -> dispose geometry and material exactly once
  -> clear references
  -> publish cleanup result
```

## Fixture requirements

```txt
valid pinned raptor descriptor binds with exact expected counts
invalid indices reject before Three resource creation
unknown parent bone rejects
out-of-range skin index rejects
skin-weight repair is explicit and measured
unknown pose bones produce a classified result
same pose applied twice is deterministic
content-hash mismatch rejects
prepare failure leaks zero resources
dispose is idempotent
post-dispose pose update rejects
```

## Deployment rule

Do not treat a visible animated raptor as proof of descriptor correctness or lifecycle safety. The Pages gate must prove deterministic binding, pose application, collision parity and resource release.
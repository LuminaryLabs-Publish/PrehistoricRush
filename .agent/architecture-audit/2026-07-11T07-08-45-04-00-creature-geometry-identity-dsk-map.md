# Architecture Audit: Creature Geometry Identity DSK Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`

## Summary

The procedural creature stack has a clean renderer-agnostic generator and product-owned Three adapter, but its identity boundary is too weak. A geometry payload can change while version, topology counts, snapshot data and `contentHash` remain stable.

## Plan ledger

**Goal:** define a composable authority chain from pinned source revision through complete geometry identity and consumer acknowledgement.

- [x] Map existing domain and kit ownership.
- [x] Map the product preset, shared generator, game domain, Three adapter and Rapier adapter.
- [x] Identify the identity discontinuity.
- [x] Define candidate DSK responsibilities without duplicating existing ownership.
- [ ] Implement reusable generator identity changes in `NexusEngine-Kits`.
- [ ] Implement product binding and frame proof in `PrehistoricRush`.

## Existing ownership

```txt
player-raptor-preset-kit
  owns product recipe values

procedural-creature-body-kit
  owns normalized recipe
  owns geometry positions/normals/colors/indices
  owns skeleton and skin data
  owns topology counts and current contentHash
  owns snapshots and deterministic recreation

prehistoric-rush-domain-kit
  owns which descriptor is the player
  owns pose-state inputs and pose requests

three-procedural-creature-adapter-kit
  owns BufferGeometry, attributes, bones, skeleton, material and SkinnedMesh
  owns pose projection into live bones

rapier-physics-domain-kit adapter
  owns collision actor binding and stepping

browser frame loop
  owns pose update, camera update and renderer submission
```

## Identity discontinuity

```txt
normalized recipe
  -> geometry arrays generated
  -> topology counts generated
  -> contentHash(recipe + topology counts)
```

The hash excludes the generated geometry payload. This permits the following invalid equivalence:

```txt
same recipe
same vertex count
same triangle count
same bone count
same contentHash
DIFFERENT triangle order or winding
DIFFERENT normal payload
DIFFERENT skin weights
DIFFERENT visible result
```

## Existing DSKs to update

### `procedural-creature-body-kit`

Retain ownership of renderer-agnostic geometry generation. Extend its descriptor identity contract rather than creating a second generator.

Required reusable outputs:

```txt
descriptorSchemaVersion
geometryFormatVersion
surfaceConvention:
  coordinateSystem
  frontFace
  winding
  normalSpace
  skinningSpace
geometryHash
positionHash
normalHash
indexHash
skinHash
fullDescriptorHash
```

The full geometry hash should include typed-array content and declared interpretation, not only counts.

### `prehistoric-rush-domain-kit`

Retain player descriptor and pose access. It should admit one geometry identity row and expose it through a detached snapshot.

## Product-side candidate kits

```txt
creature-descriptor-admission-kit
  validate schema, finite arrays, lengths, index ranges, skin weights and hashes

creature-surface-orientation-kit
  validate declared front face, triangle orientation and normal agreement

creature-geometry-binding-kit
  create immutable binding result for BufferGeometry attributes and index

creature-skeleton-binding-kit
  validate bone hierarchy, skin indices and bind result

creature-pose-binding-kit
  bind pose revision to one admitted skeleton binding

creature-render-frame-correlation-kit
  record descriptor/binding/pose revisions consumed by one frame

creature-observation-kit
  expose bounded detached JSON-safe proof rows

creature-resource-lifecycle-kit
  own geometry, material, skeleton and mesh disposal

creature-geometry-fixture-kit
  deterministic descriptor, winding, normal, skin and identity proof
```

## Required command/result flow

```txt
CreatePlayerDescriptor
  -> DescriptorCreated
     descriptorId
     descriptorSchemaVersion
     sourceRevision
     geometryHash
     fullDescriptorHash

AdmitCreatureDescriptor
  -> DescriptorAdmissionResult
     accepted/rejected
     reason
     vertex/triangle/bone counts
     hash verification
     orientation verification

BindCreatureToThree
  -> CreatureBindingResult
     bindingId
     descriptorId
     geometryHash
     material policy
     frontSide policy
     GPU attribute counts

ApplyCreaturePose
  -> PoseBindingResult
     poseRevision
     bindingId
     bone update count

RenderFrame
  -> CreatureFrameConsumptionResult
     frameId
     bindingId
     geometryHash
     poseRevision
```

## Domain boundary rules

```txt
shared kit must not own Three.js resources
product adapter must not regenerate creature geometry
renderer must not recompute normals silently without a declared policy
product must not treat source commit alone as descriptor identity
snapshots must reject geometry identity mismatches
host observation must not expose mutable mesh, skeleton or descriptor owners
```

## Promotion order

```txt
1. Extend existing procedural-creature-body-kit descriptor identity.
2. Add reusable geometry identity fixtures in NexusEngine-Kits.
3. Add product descriptor admission and Three binding result.
4. Add pose and rendered-frame correlation.
5. Add lifecycle/disposal ownership.
6. Add browser and deployed visual proof.
```

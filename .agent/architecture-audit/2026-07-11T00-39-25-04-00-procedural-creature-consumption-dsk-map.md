# Architecture Audit: Procedural Creature Consumption DSK Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`

## Current ownership map

```txt
LuminaryLabs-Publish/PrehistoricRush
  player-raptor preset
    owns seed, topology choices, proportions, material, animation tuning and collision configuration

LuminaryLabs-Dev/NexusEngine-Kits
  seed-kit
    owns deterministic random-stream capability
  procedural-creature-body-kit 0.1.0
    owns recipe normalization
    owns body topology and geometry descriptors
    owns skeleton and skin-weight descriptors
    owns attachment and collision descriptors
    owns pose descriptors
    owns content hash and snapshot/load/reset
    does not own renderer resources, physics resolution, AI or game rules

prehistoric-rush-domain-kit 0.3.0
  requires n:procedural-creatures:body
  exposes getPlayerBody and createPlayerPose
  owns run state, route/surface simulation, score/outcome and scene-transition requests

src/game.js Three adapter
  converts descriptor arrays to BufferGeometry
  constructs Bone hierarchy, Skeleton and SkinnedMesh
  creates material and applies per-frame pose transforms
  owns current GPU/Three resources implicitly

src/game.js Rapier adapter
  consumes descriptor collision shape, radius, halfHeight and centerY
  owns actor registration and physics stepping outside the main engine

PrehistoricRushHost
  exposes aggregate game/composition/scene/body facts
  does not expose end-to-end consumption evidence
```

## Installed graph

```txt
12 Nexus Engine core kits
seed-kit
procedural-creature-body-kit
prehistoric-rush-domain-kit
  nested: drunk-route-generator
```

## Required authority domain

```txt
procedural-creature-consumption-authority-domain
  runtime-module-graph-manifest-kit
  module-source-admission-result-kit
  module-graph-fingerprint-kit
  player-raptor-preset-kit
  procedural-creature-descriptor-validation-kit
  three-procedural-creature-adapter-kit
  creature-render-binding-result-kit
  creature-pose-consumption-row-kit
  creature-collision-consumption-row-kit
  creature-resource-lifecycle-kit
  creature-host-observation-kit
  procedural-creature-fixture-kit
```

This authority must compose existing owners rather than duplicate body generation. The official kit remains the only body descriptor generator. The product preset remains the only raptor-specific configuration. The new boundary owns admission, adapter consumption, lifecycle and evidence.

## Required contracts

### Module source result

```txt
moduleId
requestedUrl
requestedCommit
resolvedUrl
resolvedCommit
status
reason
contentIdentity
```

### Descriptor admission result

```txt
creatureId
presetId
kitVersion
recipeHash
contentHash
topology
boneCount
indexCount
vertexCount
skinWeightValidation
collision
status
failures
```

### Render binding result

```txt
bindingId
creatureId
contentHash
geometryId
materialId
skeletonId
boneCount
vertexCount
triangleCount
preparedAtSequence
status
```

### Pose consumption row

```txt
sequence
runId
frameId
creatureId
contentHash
poseId
poseState
appliedBoneCount
missingBoneIds
status
```

### Collision consumption row

```txt
sequence
runId
creatureId
contentHash
actorId
shape
radius
halfHeight
centerY
status
```

## Dependency order

```txt
one immutable module graph
  -> exact source admission
  -> product preset normalization
  -> descriptor validation
  -> detached Three preparation
  -> render binding commit
  -> Rapier collision binding
  -> ordered pose consumption
  -> committed frame observation
  -> reverse-order disposal
  -> deterministic fixtures
```

## Boundary rules

```txt
no local clone of the procedural body generator
no Three or Rapier object ownership inside the official descriptor kit
no preset-specific constants inside the shared kit
no bare module resolution outside the shared pinned module graph
no render or physics admission without descriptor hash continuity
no live mutable creature owners in public host readback
no adapter success inferred only from a visible mesh
```
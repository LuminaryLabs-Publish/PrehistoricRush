# Render Audit: Resource Lifetime Observation Gap

Timestamp: `2026-07-10T18-01-03-04-00`

## Current render surface

```txt
Three.js WebGLRenderer
PerspectiveCamera
fog, ambient light, directional light
sky sphere
49 streamed terrain meshes
procedural raptor hierarchy
five tree InstancedMesh pools
rock InstancedMesh
shard InstancedMesh
primary runtime render
secondary presentation render
```

## Current ownership

`setup()` creates the renderer, scene, camera, terrain, procedural raptor, geometries, materials, and instanced pools. It also registers a global resize listener. None of those resources are returned behind a lifecycle owner with disposal observations.

## Render authority gap

```txt
primary RAF
  animate raptor
  update camera
  write HUD
  renderer.render

secondary RAF
  rewrite raptor
  rewrite camera
  rewrite HUD
  renderer.render again
```

There is no `sourceFrameId`, `renderRequestId`, accepted/skipped result, renderer statistics row, or one-render-per-frame invariant.

## Resource lifetime gap

```txt
renderer.dispose() absent
renderer animation ownership absent
terrain geometry disposal absent
shared and cloned material disposal absent
raptor child geometry/material disposal absent
instanced mesh geometry/material disposal absent
resize listener removal absent
canvas removal observation absent
context-loss or renderer-loss result absent
resource counts before/after disposal absent
```

The outline helper clones meshes and creates additional `MeshBasicMaterial` instances. Tree pools and raptor construction also allocate multiple independent geometries and materials. A generic scene traversal must account for shared resources to avoid both leaks and double disposal.

## Required render observations

```txt
RenderRequest
  sourceFrameId
  cameraFingerprint
  sceneRevision

RenderCommitResult
  sourceFrameId
  accepted
  reason
  rendererFrame
  drawCalls
  triangles

RenderResourceSnapshot
  rendererCount
  canvasCount
  geometryCount
  materialCount
  textureCount
  instancedMeshCount
  disposed
```

## Fixture assertions

```txt
one accepted render commit per source frame
secondary request skipped with typed reason
mount creates one canvas and one resize listener
dispose removes canvas/listener and releases renderer resources
shared resources are disposed once
second dispose is idempotent
remount returns to one canvas, one renderer, and one render owner
```

Visual fidelity changes should wait until these observations exist.
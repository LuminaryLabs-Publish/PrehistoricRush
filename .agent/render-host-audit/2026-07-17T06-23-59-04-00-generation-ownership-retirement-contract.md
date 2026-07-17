# Render Host Generation Ownership and Retirement Contract

**Timestamp:** `2026-07-17T06-23-59-04-00`

## Parent generation

```txt
RenderHostGeneration
  routeRevision
  runtimeRevision
  engineGeneration
  controllerGeneration
  workerGeneration
  rendererGeneration
  sceneGeneration
  atmosphereGeneration
  viewportGeneration
  callbackGeneration
  resourceDigest
  status: admitted | active | retiring | retired | failed
```

## Owned participants

```txt
browser host and renderer canvas
window and button listeners
RAF callback chain
patch Worker and request executor
patch controller active/retained memberships
base scene, camera, renderer and context
base terrain and materials
legacy tree geometries/materials/batches
grass geometries/materials/batches
shard geometry/material/batch
player render resources
base hemisphere light, sun and target
terrain LOD layer
tree-fidelity layer
foliage atlas
lush-foliage layer
ground-cover layer
jungle atmosphere and owned lights
startup and diagnostics projection
```

## Retirement ordering

```txt
1. latch generation as retiring
2. close new input-derived frame and patch admission
3. cancel RAF and reject stale callbacks
4. reject/settle pending Worker and patch results
5. release active patch memberships and physics/collider projections
6. dispose child LOD and jungle layers
7. dispose base terrain, trees, grass, shards and player resources
8. remove base and atmosphere-owned lights
9. restore or explicitly retire predecessor scene/renderer state
10. dispose renderer/context
11. detach canvas
12. remove browser listeners and terminate Worker
13. publish participant receipts and final resource digest
14. mark generation retired
15. publish FirstRetiredRenderHostAck
```

## Apply-once rules

- A generation may enter `retiring` once.
- Duplicate retirement commands return the original result.
- Stale commands cannot retire a newer generation.
- Participant disposal failures remain visible as `failed` or `indeterminate` receipts.
- Replacement admission must not silently ignore an indeterminate predecessor.
- A retired callback or Worker result cannot mutate scene, physics, patch or diagnostics state.

## Required result

```txt
RenderHostRetirementResult
  generation
  reason
  status
  lastAdmittedFrame
  releasedPatchIds
  terminatedWorker
  removedListenerCount
  disposedResourceCounts
  removedLightIds
  rendererDisposed
  canvasDetached
  predecessorStateRestored
  participantReceipts
  resultDigest
```

## Proof gate

A complete fixture must demonstrate construct, render, retire and reconstruct in one browser document with exactly one live canvas, renderer, callback generation and atmosphere light pair.
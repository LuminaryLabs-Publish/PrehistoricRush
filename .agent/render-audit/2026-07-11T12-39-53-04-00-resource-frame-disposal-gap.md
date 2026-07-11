# Render Audit: Resource and Frame Disposal Gap

**Timestamp:** `2026-07-11T12-39-53-04-00`

## Summary

The Three adapter creates the renderer, scene, camera, lights, shadow resources, terrain geometry/materials, instanced tree and grass resources, shard resources and a skinned creature. It returns live references and `render()` but no resource inventory, frame receipt or `dispose()`.

## Plan ledger

**Goal:** ensure every rendered frame belongs to a live session and every GPU/resource allocation has one ordered terminal release result.

- [x] Inventory render allocations.
- [x] Trace render submission and recurring animation state.
- [x] Record missing frame/session correlation.
- [x] Record missing resource disposal.
- [ ] Implement render ownership after route/profile and patch commit gates.

## Current render flow

```txt
createThreeAdapter
  -> allocate renderer and canvas
  -> allocate scene/camera/lights/shadows
  -> allocate terrain slot geometries and material
  -> allocate tree instance geometry/materials and batches
  -> allocate grass geometry/shader materials
  -> allocate shard geometry/material
  -> allocate creature geometry/material/skeleton

render(state, dt)
  -> increment adapter view.time
  -> apply player transform and pose
  -> update camera, sun, grass uniforms and shard rotation
  -> renderer.render(scene, camera)
  -> return no frame receipt
```

## Missing ownership

```txt
renderer.dispose: absent
renderer canvas removal: absent
terrain geometry/material disposal: absent
tree geometry/material/batch disposal: absent
grass geometry/shader disposal: absent
shard geometry/material disposal: absent
creature geometry/material/skeleton disposal: absent
scene detachment result: absent
resource count/snapshot: absent
render-after-dispose rejection: absent
```

## Frame correlation gap

A frame currently names no:

```txt
runtimeSessionId
runSessionId
streamEpoch
patch consumer revision
physics revision
camera revision
profile/creature revision
resource generation
lifecycle phase
frame ID
```

The renderer can therefore submit a frame while another subsystem is restarting or disposing, and the public host cannot prove which resource/session generation was shown.

## Required render result

```txt
RenderFrameReceipt
  frameId
  runtimeSessionId
  runSessionId
  streamEpoch
  lifecyclePhase
  gameRevision
  patchRevision
  physicsRevision
  cameraRevision
  creatureRevision
  resourceGeneration
  submitted
  rejectionReason
```

## Required disposal result

```txt
ThreeResourceDisposalResult
  resourceGeneration
  stoppedFrameId
  canvasRemoved
  rendererDisposed
  geometryCountDisposed
  materialCountDisposed
  skeletonCountDisposed
  sceneObjectCountDetached
  alreadyDisposed
  failures[]
```

## Gate

No render callback may run after `STOPPING` begins, and no resource may be disposed while a frame callback can still reference it. RAF retirement must precede Three disposal; public host revocation must precede exposing terminal resource state.

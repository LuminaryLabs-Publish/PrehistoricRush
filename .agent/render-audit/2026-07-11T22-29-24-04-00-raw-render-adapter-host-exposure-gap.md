# Raw Render Adapter Host Exposure Gap

**Timestamp:** `2026-07-11T22-29-24-04-00`

## Current exposure

The public host returns the live Three adapter. That adapter exposes:

```txt
scene
camera
renderer
sun
player
view
sampleHeight
resetCamera
activatePatch
releasePatches
refreshDynamicContent
render
```

A same-page consumer can directly render an arbitrary state, reset the camera, mutate active patch presentation or modify returned Three objects outside the RAF and committed-frame order.

## Render authority defect

```txt
public script
  -> PrehistoricRushHost.adapter.render(candidate, dt)
  -> renderer submits pixels outside game RAF
  -> no simulation, stream, collider or HUD receipt
  -> public getState may still report unrelated owner snapshots
```

Direct access to `scene`, `camera`, `renderer`, `sun` and `player` also permits unjournaled mutations that cannot be reconstructed from game state.

## Required render contract

```txt
render owner remains private
  -> gameplay frame authority prepares one presentation state
  -> renderer submits one frame
  -> frame receipt becomes part of committed read model
  -> public host exposes immutable render metadata only
```

Public metadata may include renderer type, frame ID, viewport, active content fingerprint and last render result. It must not include Three.js object references.

## Fixture requirement

Assert that public host enumeration and nested traversal contain no renderer, scene, camera, Object3D, material, geometry or mutating render callback references.
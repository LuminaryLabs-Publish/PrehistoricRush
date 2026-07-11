# Render Audit: Thin Render Adapter Consumption Gap

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Active render surface

The active visual route is a direct Three.js adapter in `src/game.js`.

```txt
createAdapter()
  -> Three Scene / Fog
  -> PerspectiveCamera
  -> WebGLRenderer
  -> HemisphereLight / DirectionalLight
  -> terrain chunk meshes
  -> five tree trunk/crown instance-pool pairs
  -> three grass instance pools and shader materials
  -> shard instance pool
  -> procedural skinned dino
  -> render(state, dt)
```

## Core graphics/camera/animation gap

The game graph installs:

```txt
core-camera-kit
core-animation-kit
core-graphics-kit
core-skybox-kit
```

The live render path instead performs these operations directly:

```txt
camera.position.lerp(...)
camera.lookAt(...)
sun.position.set(...)
dinoBody.applyPose(...)
grass material uniform writes
renderer.render(scene, camera)
```

No adapter result or consumption row identifies these direct operations as implementations of the corresponding core capabilities.

## Render ownership gaps

```txt
- createAdapter() owns GPU resources and gameplay projection together
- no prepare/commit/render result exists
- no frame ID correlates game state, physics contacts, population, HUD and pixels
- no JSON-safe render snapshot exists
- no renderer disposal path exists
- no geometry/material/texture/mesh ownership registry exists
- resize mutates camera and renderer directly
- core-skybox is installed while scene background/fog are inline
- core-camera and core-animation are installed while their state is not consumed
- renderer label in GameHost is a string, not a render contract
```

## Population/render capacity defect

`InstancedMesh.count` is used both as active draw count and as the next generation admission ceiling.

```txt
tree pool allocation: 160
first population: pool.trunk.count begins at 160
commit: pool.trunk.count becomes active tree count
next population: admission compares against previous active count

grass allocations: 3600 / 2600 / 1300
commit: each mesh.count becomes active layer count
next population: admission compares against previous active layer count

shard allocation: 240
commit: shards.count becomes active shard count
next population: admission loop is capped by previous active count
```

This creates a potentially monotonic capacity collapse unrelated to actual GPU allocation.

## Target render adapter contract

```txt
prepareFrame({ gameSnapshot, physicsSnapshot, populationSnapshot, frameId })
  -> RenderPlanResult

commitFrame(renderPlan)
  -> RenderCommitResult

renderCommittedFrame(frameId)
  -> RenderSubmitResult

getState()
  -> JSON-safe render/resource/capacity snapshot

dispose()
  -> idempotent ResourceDisposeResult
```

The adapter should explicitly declare which core capabilities it consumes or replaces:

```txt
camera
animation
graphics
skybox
UI diagnostics
```

## Required proof

```txt
- immutable allocation capacity is separate from active draw count
- every active matrix was written in the current committed population generation
- render submission references one committed frame ID
- camera and animation projections reference the same game revision
- all GPU resources have one owner and one idempotent disposal path
- the core-kit consumption ledger names the Three adapter as consumer or replacement
```

## Next safe ledge

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

Do not rewrite the renderer or add visual content before its ownership and core-capability relationship are explicit.
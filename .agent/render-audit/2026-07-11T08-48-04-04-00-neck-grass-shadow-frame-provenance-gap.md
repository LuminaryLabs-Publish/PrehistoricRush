# Render Audit: Neck, Grass, Shadow and Frame Provenance Gap

**Timestamp:** `2026-07-11T08-48-04-04-00`

## Summary

The current renderer visibly consumes a joined creature neck/head tube, narrower reshaded grass cards and a new shadow policy. The frame path has no receipt proving those exact inputs were bound and rendered.

## Plan ledger

**Goal:** identify every render-visible input changed by the latest runtime update and define the missing frame proof.

- [x] Trace creature geometry binding.
- [x] Trace grass geometry/material construction.
- [x] Trace shadow map, camera and caster settings.
- [x] Trace per-frame pose, grass, light, camera and render submission.
- [x] Define required binding and frame receipts.

## Creature render path

```txt
pinned creature descriptor
  -> descriptor.geometry.indices
  -> BufferGeometry index
  -> positions / normals / colors / skin attributes
  -> Bone / Skeleton / SkinnedMesh
  -> default FrontSide MeshStandardMaterial
  -> per-frame bone mutation
  -> renderer.render
```

The product binds the descriptor arrays directly. There is no exact geometry-hash admission, binding result or frame reference.

## Grass render path

```txt
grassGeometry(planes)
  -> plane translated to base
  -> X scaled to 0.62
  -> crossed cards merged into BufferGeometry

grassMaterial(color)
  -> DoubleSide ShaderMaterial
  -> alphaTest 0.34
  -> widened alpha silhouette
  -> vertical shade
  -> time/wind uniforms

three layer meshes
  -> brighter palettes
  -> patch matrices
  -> per-frame time update
  -> renderer.render
```

No descriptor or fingerprint identifies geometry source, shader source, alpha constants, palette or active instance revision.

## Shadow render path

```txt
WebGLRenderer
  -> shadowMap.enabled = true
  -> shadowMap.type = PCFSoftShadowMap

DirectionalLight
  -> map size 2048
  -> bounds +/-80
  -> near/far 1/180
  -> bias -0.0004
  -> normalBias 0.06

casters
  -> player true
  -> trunks true
  -> tree crowns false
  -> receivers vary by object
```

No aggregate caster table, policy hash or binding result exists.

## Frame path

```txt
apply creature pose
set camera targets
update smooth camera
move sun and target
update grass time/wind
rotate shards
renderer.render(scene, camera)
```

Required receipt:

```txt
RenderFrameReceipt {
  frameId
  runSessionId
  runEpoch
  moduleGraphFingerprint
  visualPolicyRevision
  visualPolicyFingerprint
  creatureGeometryHash
  creatureBindingRevision
  poseRevision
  grassPolicyHash
  grassInstanceRevision
  shadowPolicyHash
  cameraRevision
  patchConsumerRevision
  submitStatus
}
```

## Regressions not currently detectable

```txt
head tube separates from neck
winding or normals regress
grass cards become rectangular or overly wide
grass shader source changes without label update
grass palette changes unexpectedly
shadow frustum clips casters
bias causes acne or detached shadows
tree crowns resume large polygon shadows
frame renders stale creature or camera state
manual renderer label drifts
```

## Required proof

```txt
CPU exact geometry and connected-component fixture
Three attribute/index binding fixture
grass policy hash sensitivity fixture
shadow policy hash sensitivity fixture
caster/receiver inventory fixture
frame receipt correlation fixture
browser screenshot/pixel fixture
deployed Pages smoke
```
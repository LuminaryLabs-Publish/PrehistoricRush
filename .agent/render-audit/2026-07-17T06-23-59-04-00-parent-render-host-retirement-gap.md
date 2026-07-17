# Parent Render Host Retirement Gap

**Timestamp:** `2026-07-17T06-23-59-04-00`  
**Reviewed runtime source:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`

## Implemented visible path

```txt
semantic tree and ground-cover catalogs
  -> deterministic main-thread and Worker patches
  -> terrain LOD and tree-fidelity forms
  -> procedural foliage atlas
  -> lush foliage and ground-cover batches
  -> jungle atmosphere
  -> base Three.js render
  -> lushVegetationFrameAck
  -> startup atlas/generation admission
```

## Source-backed retirement gap

The base adapter creates and retains:

```txt
WebGLRenderer and context
renderer canvas appended to the host
scene and camera
base terrain slots and shared material
legacy trunk/crown geometries and materials
grass geometries, shader materials and batches
shard geometry, material and batch
player creature mesh/material resources
hemisphere light, sun and sun target
base patch, collider, pickup and batch ownership
```

Its returned service object has no `dispose()`.

The LOD adapter adds and disposes:

```txt
terrain LOD
Tree Fidelity
lush foliage
ground cover
foliage atlas
```

It does not delegate base disposal. It also retains atmosphere-owned fill and canopy-bounce lights and does not restore predecessor background, fog, exposure or shadow settings.

The host keeps scheduling RAF and retains keyboard, blur and resize listeners. No retirement latch rejects stale frame, patch or Worker results.

## Visible failure modes requiring fixtures

- Route re-entry or repeated host construction can append another canvas.
- Repeated atmosphere application can add another owned light pair.
- Retired buffers, textures and materials can remain live until browser/context cleanup.
- A stale RAF can submit a frame after a replacement generation is accepted.
- Patch or Worker results can arrive after the owning host is retired.
- Diagnostics and startup receipts can refer to a predecessor generation.

These are lifecycle risks proven by source ownership, not reproduced production incidents.

## Required frame proof

```txt
construct generation A
  -> activate patches
  -> render admitted frame A
  -> retire generation A
  -> no further A callback or result is admitted
  -> renderer/context disposed
  -> canvas detached
  -> owned lights removed
  -> predecessor scene state restored or explicitly retired
  -> construct generation B
  -> exactly one canvas and atmosphere light pair
  -> FirstReplacementRenderHostFrameAck
```

## Claim boundary

The jungle presentation is implemented and source-tested. Complete cleanup, repeated-generation safety, WebGL recovery, artifact parity, Pages parity and production readiness remain unproven.
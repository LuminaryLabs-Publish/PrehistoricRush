# Terrain Resolution, Topology and Material Adoption Contract

**Timestamp:** `2026-07-15T05-38-36-04-00`

## Summary

The new terrain work contains the correct conceptual layers: renderer-neutral LOD policy, full-resolution source fields, reusable topology, skirts, geomorph offsets and generated clay maps. The missing piece is active adoption through one versioned contract.

## Plan ledger

**Goal:** preserve high-resolution source truth while allowing near, medium and far renderer topology without cracks, stale state or resource leaks.

- [x] Record source-field contract.
- [x] Record topology and LOD contract.
- [x] Record material and lifecycle contract.
- [x] Record patch adoption invariants.
- [ ] Implement and prove later.

## Source-field contract

```txt
sourceResolution: 64
vertex layout: row-major (resolution + 1)^2
heights: Float32Array vertexCount
colors: Float32Array vertexCount * 3
normals: Float32Array vertexCount * 3
mapping: world-space
materialRevision: shiny-clay-v1
bounds: required
```

## LOD contract

```txt
near: 64
medium: 32
far: 16
selection: distance to patch bounds
hysteresis: 7 units
morph duration: 0.32 seconds
crack policy: skirts, depth 3.5
```

Source fields remain full-resolution. LOD changes index topology and optional vertical morph offsets; it must not silently reinterpret field dimensions.

## Material contract

```txt
world-space UV tile size: 11
normal map: generated linear 2048 x 2048
roughness map: generated linear 2048 x 2048
resource owner: Three.js adapter generation
cache key: policy revision + renderer generation + texture options
disposal: required on replacement and retirement
```

## Adoption invariants

```txt
no active membership before candidate validation
no attribute writes before capacity proof
one selected level per accepted patch revision
one topology/material generation cited by the frame
mixed LOD boundaries keep skirts enabled
failed candidate preserves predecessor slot and membership
released patch retires morph and membership state
late Worker result cannot revive a retired patch
```

## Boundary

The policy remains renderer neutral. Three.js topology, textures, GPU buffers and draw execution remain adapter-owned.
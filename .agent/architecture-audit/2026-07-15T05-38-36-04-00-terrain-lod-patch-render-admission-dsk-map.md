# Terrain LOD Patch Render Admission DSK Map

**Timestamp:** `2026-07-15T05-38-36-04-00`

## Summary

The product now declares terrain LOD policy and renderer helpers, but patch production and Three.js adoption remain separate unversioned contracts.

## Plan ledger

**Goal:** map current ownership and the smallest coordinating authority needed for safe terrain LOD adoption.

- [x] Map producer, streaming, policy, renderer and proof domains.
- [x] Preserve renderer-neutral ownership in Core Graphics.
- [x] Keep Three.js resources in the product adapter.
- [x] Define command, result and acknowledgement surfaces.
- [ ] Implement after acceptance.

## Current ownership

```txt
prehistoric-patch-generator
  owns deterministic terrain fields and patch content

seeded-world-patch-controller-kit
  owns desired sets, generation, cache, ready and release queues

prehistoric-rush-terrain-lod-policy-kit
  owns renderer-neutral LOD, crack, morph and material policy

terrain-lod-geometry-adapter
  offers topology, indices, skirts, UVs and morph offsets

three-clay-surface-texture-adapter
  offers Three.js normal/roughness resources and disposal

three-patch-stream-adapter-kit
  owns Three.js slots, uploads, patch presentation and height sampling
```

## Missing parent domain

`prehistoric-rush-terrain-lod-patch-render-admission-authority-domain`

## Planned coordinating kits

```txt
terrain-patch-schema-kit
terrain-patch-generation-revision-kit
terrain-lod-policy-admission-kit
terrain-focus-snapshot-kit
terrain-lod-selection-kit
terrain-topology-cache-kit
terrain-attribute-capacity-kit
terrain-skirt-binding-kit
terrain-geomorph-state-kit
terrain-material-resource-kit
terrain-clay-texture-lifecycle-kit
terrain-patch-render-candidate-kit
terrain-gpu-upload-receipt-kit
terrain-patch-adoption-kit
terrain-stale-worker-rejection-kit
terrain-render-failure-rollback-kit
terrain-frame-result-kit
terrain-visible-frame-ack-kit
terrain-lod-fixture-kit
terrain-deploy-parity-kit
```

## Transaction

```txt
TerrainPatchRenderAdmissionCommand
  -> validate schema and capacity
  -> select LOD from one focus revision
  -> prepare topology, attributes and material resources
  -> publish preparation receipts
  -> atomically adopt patch membership
  -> preserve predecessor on failure
  -> publish TerrainPatchRenderAdmissionResult
  -> acknowledge FirstTerrainLodFrameAck
```

## Boundary

Core owns neutral descriptors. The product renderer continues to own Three.js geometry, buffers, textures and draw execution.
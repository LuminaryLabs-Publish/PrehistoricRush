# Render Host Retirement DSK Update

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Reviewed runtime head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`

## Summary

The jungle runtime is now composed end to end. The remaining architecture gap is ownership settlement when the Three.js host generation retires.

## Implemented composition

```txt
base Three.js patch-stream adapter
  scene, camera, renderer, canvas, hemisphere, sun, base terrain,
  trunk/crown meshes, grass, shards, player, patch memberships

LOD adapter
  terrain LOD
  tree fidelity
  procedural foliage atlas
  lush foliage cards
  ecological ground cover
  jungle atmosphere
  matching lush frame acknowledgement
```

## Ownership break

The LOD adapter replaces any potential base disposal contract with a local `dispose()` that releases only the added LOD/foliage layers. The base adapter currently exposes no disposal service. Atmosphere mutation also has no restore/remove contract.

## Required parent domain

`prehistoric-rush-render-host-generation-retirement-authority-domain`

## Required child services

```txt
render-host-generation-kit
render-frame-admission-latch-kit
patch-membership-retirement-kit
base-terrain-resource-retirement-kit
legacy-tree-resource-retirement-kit
grass-resource-retirement-kit
pickup-shard-resource-retirement-kit
player-render-resource-retirement-kit
terrain-lod-retirement-kit
tree-fidelity-retirement-kit
lush-foliage-retirement-kit
ground-cover-retirement-kit
foliage-atlas-retirement-kit
jungle-atmosphere-state-restoration-kit
renderer-context-retirement-kit
canvas-host-detachment-kit
stale-render-callback-rejection-kit
render-host-retirement-result-kit
first-retired-render-host-ack-kit
```

## Ownership rules

- One render-host generation owns every Three.js object and browser canvas it creates.
- Child layers may expose disposal, but the parent host must settle all children and base resources exactly once.
- Atmosphere application must return an owned mutation receipt with predecessor values and owned lights.
- Retirement must stop future render and patch callbacks before releasing resources.
- Duplicate retirement is idempotent; stale generation commands are rejected.
- Restart and WebGL recovery create a new generation only after predecessor settlement is complete or explicitly indeterminate.

## Boundary

This update documents retirement authority. It does not modify runtime cleanup behavior.

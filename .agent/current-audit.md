# PrehistoricRush Current Audit

**Timestamp:** `2026-07-15T06-39-22-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `terrain-single-owner-render-retirement-authority-audited`

## Summary

The previous terrain capacity mismatch has been repaired by a new active LOD runtime. The remaining source-backed gap is duplicate terrain ownership: the LOD wrapper still constructs and updates the complete legacy fixed-grid terrain renderer, then hides its meshes.

## Plan ledger

**Goal:** reduce terrain presentation to one allocator, one patch map, one upload path, one release path and one visible-frame result.

- [x] Inspect the nine runtime-ahead commits.
- [x] Confirm the page boots `game-runtime-lod.js`.
- [x] Confirm 64/32/16 selection, skirts, geomorph targets and clay maps are active.
- [x] Trace wrapper composition through the base patch adapter.
- [x] Count terrain slots and per-patch upload paths.
- [x] Define the single-owner authority and fixture boundary.
- [ ] Implement the split and execute browser/GPU lifecycle proof later.

## Current interaction loop

```txt
boot
  -> create base patch-stream adapter
  -> allocate 25 fixed-grid terrain meshes
  -> create LOD layer in the same scene
  -> allocate 25 skirted LOD terrain meshes
  -> hide matching legacy meshes

ready patch
  -> LOD layer acquires a slot and uploads patch fields
  -> LOD layer selects near, medium or far
  -> base adapter records active patch membership
  -> base adapter uploads the same terrain fields to a legacy slot
  -> base adapter adopts trees, grass, colliders and pickups
  -> wrapper traverses the scene and hides legacy terrain again

frame
  -> LOD layer updates selection and geomorph
  -> base adapter updates world content, camera and renderer
  -> wrapper publishes a coarse visible-frame acknowledgement
```

## Domains in use

```txt
browser lifecycle, input, RAF, Worker, transferables, storage and navigation
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
patch generation, schema, identity, queue, cache, Worker execution, adoption and release
terrain LOD policy, selection, hysteresis, skirts, geomorph and world-space materials
legacy fixed-grid terrain allocation, upload, hiding and release
Three.js scene, geometry, materials, instancing, camera and render submission
Rapier collision, height sampling, pickups and vegetation membership
validation, static hosting, Pages and central tracking
```

## Current gaps

```txt
single terrain presentation owner: absent
legacy terrain allocation suppressed: no
legacy per-patch terrain upload suppressed: no
single patch-to-terrain map: absent
explicit terrain renderer role contract: absent
per-patch terrain adoption result: absent
per-patch terrain retirement receipt: absent
frame acknowledgement bound to patch revisions: absent
actual Three.js layer integration fixture: absent
browser allocation/upload fixture: absent
```

## Required authority

`prehistoric-rush-terrain-presentation-single-owner-retirement-authority-domain`

## Boundary

Documentation only. Runtime source, rendering, gameplay and deployment remain unchanged by this audit.
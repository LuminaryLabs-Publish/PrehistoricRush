# Jungle Render Host Retirement Gap

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Reviewed runtime head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`

## Implemented visible path

```txt
semantic foliage and ground-cover catalogs
  -> main-thread/Worker patch generation
  -> procedural foliage atlas
  -> tree card and ground-cover instance layers
  -> projected-size LOD, hysteresis, crossfade, wind, tint
  -> jungle atmosphere
  -> lushVegetationFrameAck
```

## Retirement gap

```txt
LOD adapter dispose
  lush foliage: disposed
  ground cover: disposed
  tree fidelity: disposed
  terrain LOD: disposed
  foliage atlas: disposed

not settled
  base WebGL renderer/context
  renderer canvas attached to host
  base terrain slots and material
  legacy trunk/crown meshes and materials
  grass geometries/materials/batches
  shard mesh/material/batch
  player render resources
  base hemisphere/sun and target
  atmosphere fill and canopy-bounce lights
  predecessor background/fog/exposure/shadow state
  stale RAF/render callbacks
```

## Visible failure modes requiring fixtures

- Re-entering the route can append another renderer canvas.
- Repeated adapter construction can create additional atmosphere lights.
- Abandoned WebGL buffers and textures can survive until browser garbage collection or context loss.
- A stale frame can render after a replacement generation is admitted.
- Restart or context recovery can leave diagnostics pointing at a retired generation.

These are source-backed lifecycle risks, not reproduced incidents.

## Required proof

```txt
construct -> render -> retire -> construct
  one canvas
  one renderer generation
  one atmosphere light pair
  no stale patch memberships
  no stale RAF submission
  old GPU resources disposed
  predecessor scene state restored or explicitly retired
  RenderHostRetirementResult
  FirstRetiredRenderHostAck
```

## Boundary

The jungle presentation is now implemented. Complete render-host retirement remains proposed.

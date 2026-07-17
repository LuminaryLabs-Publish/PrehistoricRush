# Final Runtime Reconciliation

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Reviewed runtime head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Previous documentation head:** `e7c5d238d7ba406ecf02b8d91416161f03201147`

## Summary

Runtime work continued while this audit was being written. The final reviewed head now includes semantic catalog registration, ground-cover patch generation, Worker initialization, foliage-card tree packages, a procedural foliage atlas, dedicated lush-foliage and ground-cover Three.js layers, jungle-atmosphere composition, startup frame acknowledgement, diagnostics, and a Nexus Engine revision pin for the foliage contracts.

The earlier project-breakdown and late-integration files remain a chronological record. This file is the authoritative end-of-run reconciliation.

## Implemented interaction loop

```txt
foliage-card and ground-cover recipes
  -> product Vegetation registers ten tree species and six ground-cover species
  -> tree-fidelity packages include card-backed forms and captures
  -> generator options publish catalogs and atlas revision
  -> main thread and Worker initialize the same product Vegetation catalog
  -> patch generator emits trees, ecological ground cover, grass, pickups, and colliders
  -> LOD adapter creates procedural foliage atlas
  -> lush-foliage layer derives near/medium cards from tree instances and packages
  -> ground-cover layer projects patch-owned ecological instances
  -> jungle atmosphere mutates background, fog, exposure, lights, and shadows
  -> renderer publishes card/ground-cover counts and lush frame acknowledgement
  -> startup rejects a foliage-atlas revision mismatch
```

## Implemented domains and services added during the run

```txt
prehistoric-foliage-card-recipe-kit
  eight families, atlas layout, archetype mapping, deterministic placements, six ground-cover archetypes

prehistoric-foliage-atlas-render-kit
  procedural 4x2 atlas generation, per-family texture views, revision identity, disposal

three-lush-foliage-layer
  near/medium projected-size selection, hysteresis, stable-frame admission, crossfade,
  wind/tint attributes, family batches, overflow diagnostics, patch ownership, disposal

three-ground-cover-layer
  patch-owned ecological card instances, family/species batches, wind/tint projection,
  capacity diagnostics, release, disposal

lush-jungle-atmosphere-render-adapter
  background, fog, exposure, hemisphere/sun/shadow tuning, fill light, canopy bounce

expanded patch/Worker services
  ground-cover selection and deterministic instances, catalog initialization,
  foliage atlas revision propagation, transfer-safe patch output

expanded game host services
  lush capacities, generation hashes, frame admission, startup acknowledgement,
  runtime diagnostics, renderer revision identity
```

## Final census

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 21
proof kits and fixtures: 13
total active named surfaces: 96
```

The original complete inventory remains in `project-breakdown.md`; this reconciliation adds the three newly implemented render surfaces listed above.

## Main remaining finding

The extended adapter now owns substantially more GPU and scene state, but its retirement path is incomplete:

```txt
createThreePatchStreamLodAdapter()
  -> creates base renderer, canvas, base terrain, legacy trees, grass, shards, player, lights
  -> applies jungle atmosphere and adds fill/bounce lights
  -> creates terrain LOD, tree fidelity, lush foliage, ground cover, and atlas resources

adapter.dispose()
  -> disposes lush foliage
  -> disposes ground cover
  -> disposes tree fidelity
  -> disposes terrain LOD
  -> disposes foliage atlas
  -> does not retire atmosphere-owned lights or restore predecessor scene state
  -> does not dispose base renderer/canvas/base meshes/materials/player resources
```

The base adapter exposes no `dispose()` service, and the LOD adapter cannot delegate complete host retirement. A route remount, runtime restart, WebGL recovery, or repeated host construction can therefore leave ownership indeterminate even though the new feature layers individually dispose most of their resources.

## Required authority

`prehistoric-rush-render-host-generation-retirement-authority-domain`

```txt
RenderHostRetirementCommand
  -> stop frame admission and patch activation
  -> retire active patch memberships
  -> dispose terrain, tree-fidelity, foliage, ground-cover, atlas, grass, shard,
     player, base terrain, materials, geometries, renderer, and canvas ownership
  -> remove atmosphere-owned lights and restore or retire predecessor scene state
  -> reject stale callbacks and duplicate retirement
  -> publish RenderHostRetirementResult
  -> publish FirstRetiredRenderHostAck
```

## Validation boundary

Source inspection confirms implemented integration and the incomplete retirement surface. `npm test`, browser execution, repeated-mount fixtures, WebGL recovery, artifact smoke, and Pages smoke were not executed by this documentation run.

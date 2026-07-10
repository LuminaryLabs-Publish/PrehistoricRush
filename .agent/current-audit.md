# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T19-30-36-04-00`

## Summary

The active runtime has changed substantially since the previous audit. `src/runtime.mjs` now imports only `src/game.js`; the earlier split `runtime-terrain-v6` and secondary presentation loop are not part of the current route. The new route directly composes six repo-local domain kits around a single RAF, giant forest population, layered grass, and one procedural skinned raptor.

The next blocker is deterministic instance-pool capacity authority.

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
```

## Interaction loop

```txt
boot
  -> construct route, surface, forest, grass, wind, and procedural-dino kits
  -> load Three.js, Rapier, and external rapier-physics-domain-kit

mount
  -> create shell, scene, camera, renderer, lights, terrain, instance pools, raptor, and physics bridge
  -> build and populate the initial 7 x 7 terrain window
  -> register keyboard, button, blur, and resize listeners

run
  -> Start Rush performs a partial reset
  -> one RAF updates input, movement, route region, surface resistance, jump, terrain, population, physics, contact, pickup, distance, and terminal scene
  -> same RAF applies dino pose, camera, grass wind, HUD, and renderer submission

readback
  -> PrehistoricRushHost.app exposes live runtime objects
  -> PrehistoricRushHost.getState returns runner and domain snapshots
```

## Domains in use

```txt
static-browser-shell
runtime-entry
external-module-resolution
three-runtime
rapier-runtime
rapier-physics-adapter
route-control-point-generation
route-spline-sampling
nearest-route-query
route-region-classification
terrain-height-field
terrain-chunk-window
surface-traversal-resistance
forest-archetype-catalog
forest-population
tree-instance-pools
root-instance-pool
grass-layer-descriptors
grass-route-exclusion
grass-distance-lod
grass-wind
rock-population
shard-population
shard-collection
procedural-dino-topology
procedural-dino-skeleton
procedural-dino-skinning
procedural-dino-pose
keyboard-input
button-input
scene-state
session-start
restart-lifecycle
runner-motion
runner-yaw
runner-boost
runner-jump-gravity
contact-resolution
score-and-goal
best-distance-storage
camera-projection
hud-projection
render-submission
instance-pool-capacity
population-admission
population-generation
host-state-projection
static-pages-deploy
central-ledger-sync
```

## Active repo-local kits and services

```txt
route-field-domain-kit
  ensure deterministic control points
  rebuild Catmull-Rom samples
  nearest route lookup
  path / edge / verge / forest classification
  snapshot

surface-traversal-domain-kit
  region multiplier policy
  smoothed transition update
  getState
  snapshot

forest-archetype-domain-kit
  five tree archetypes
  indexed lookup
  snapshot

grass-patch-domain-kit
  carpet / main / verge descriptors
  route-distance scale policy
  snapshot

grass-wind-domain-kit
  gust update
  wind state snapshot

procedural-dino-body-domain-kit
  profile and topology descriptor
  skinned mesh construction
  skeleton and skin weights
  procedural pose application
  descriptor and snapshot
```

## Live external services

```txt
three@0.179.1
  rendering, geometry, materials, instancing, skinning, camera, lights, fog

@dimforge/rapier3d-compat@0.15.0
  physics runtime

rapier-physics-domain-kit from NexusRealtime-ProtoKits@main
  world bridge, configure, kinematic actor, fixed colliders, transform update, step, contacts
```

## Present but inactive legacy kits

```txt
event-bus-kit
domain-host-kit
tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
```

These files remain in the repository but are not imported by the current `src/game.js` route.

## Main findings

1. The previous dual-RAF finding is stale; the current route has one RAF.
2. The new population path does not separate pool allocation capacity from active draw count.
3. The root pool allocates 400 instances while the configured window can request up to 1,372 roots before route rejection.
4. Tree and root writes have no explicit capacity preflight or typed overflow result.
5. Grass uses `mesh.count` as its next-generation capacity after overwriting it with the prior active count, creating a sparse-to-dense ratchet.
6. Renderer rows, tree colliders, shard render rows, and pickup rows do not share a population generation result.
7. `PrehistoricRushHost.getState()` has no pool capacity, requested, admitted, rejected, overflow, or generation observations.
8. Start/Retry/Run Again reset only position, distance, route index, and yaw; transient movement, jump, time, surface, shard, and generation state remain outside a restart transaction.
9. External dependency admission, lifecycle disposal, and source-contract drift remain unresolved but should not obscure the immediate population-capacity correctness gap introduced by the latest runtime cutover.

## Next safe ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```

The first implementation should wrap the existing `populate()` and InstancedMesh pools. It should not replace the renderer, route, forest art, grass art, movement feel, or dino body.
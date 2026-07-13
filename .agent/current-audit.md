# Current Audit: PrehistoricRush Browser Runtime Lifecycle and Resource Retirement

**Updated:** `2026-07-12T20-10-25-04-00`  
**Repository head reviewed before documentation writes:** `f1ef269ec32df13a78fa91c14455796b8434b731`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

PrehistoricRush successfully composes a playable browser runtime, but that runtime has no explicit lifetime owner. Startup allocates engine, physics, Worker/streaming, camera, Three.js and browser callback participants. The page then starts a recursive RAF and exposes raw participant objects through `globalThis.PrehistoricRushHost`. No stop command, participant barrier, lease registry, exact-once retirement result or re-entry proof exists.

## Plan ledger

**Goal:** make startup, running frames, failure and shutdown one supervised transaction with explicit participant ownership and deterministic retirement.

- [x] Trace module preflight and startup failure projection.
- [x] Trace engine, physics, Worker, controller, camera and renderer composition.
- [x] Trace global browser listeners and recursive RAF scheduling.
- [x] Trace public host publication.
- [x] Inventory render resources and available disposal helpers.
- [x] Preserve all 45 implemented/adapted/proof surfaces and services.
- [x] Define the missing lifecycle authority and stop barrier.
- [x] Publish the complete timestamped audit family.
- [x] Synchronize central tracking.
- [ ] Implement lifecycle providers and executable fixtures.

## Source-backed current behavior

```txt
startup
  -> preflight pinned imports
  -> create shell and load profile
  -> compose Nexus Engine kits
  -> install Rapier provider/body
  -> create patch generator, optional Worker executor and controller
  -> create camera follow
  -> allocate Three scene and resources
  -> register keydown, keyup, blur and resize listeners
  -> publish PrehistoricRushHost
  -> request first RAF

frame
  -> submit input
  -> engine.tick
  -> update streaming and active content
  -> apply pose/camera
  -> render Three frame and HUD
  -> request successor RAF

shutdown
  -> no runtime stop API
  -> no retained RAF lease
  -> no removable listener lease registry
  -> no Worker/executor/controller retirement
  -> no engine/provider retirement result
  -> no renderer/resource disposal plan
  -> no public-host revocation
```

## Render-resource census

```txt
terrain meshes/geometries: 25
tree instanced meshes/geometries: 10
grass instanced meshes/geometries: 3
shard instanced mesh/geometry: 1
player skinned mesh/geometry: 1
mesh/geometry allocations: 40
material objects: 12
skeletons: 1
renderers: 1
```

This is a source census, not a measured memory-retention claim.

## Concrete failure paths

### Frame exception

```txt
RAF callback enters
  -> engine, streaming, pose, camera, renderer or HUD throws
  -> no lifecycle supervisor catches the frame failure
  -> successor RAF may not be scheduled
  -> Worker, listeners, public host and render resources receive no stop transaction
```

### Stop or route exit

```txt
page wants to exit or test harness wants to re-enter
  -> no StopRuntimeCommand
  -> no callback producer barrier
  -> no participant retirement receipts
  -> browser/document cleanup is the only eventual fallback
```

### Partial startup

```txt
some participants are created
  -> later participant creation fails
  -> main().catch projects an error message
  -> no reverse-order rollback manifest proves which accepted participants retired
```

## Domains in use

```txt
page shell and route entry
pinned module identity and startup admission
player profile boot binding
Nexus Engine composition and tick scheduling
Core Input, Spatial, Scene and Simulation
Core Motion and articulated motion
Core Physics and articulated dynamics
Rapier provider, bodies, colliders and frames
seeded patch generation, Worker execution, queue, cache and activation
active terrain/tree/grass/shard/pickup/collider materialization
procedural creature generation and pose application
camera smooth follow
Three scene, renderer, geometry, materials, skeleton, lights and shadows
browser keyboard, blur and resize callbacks
recursive RAF scheduling
HUD and global public readback
runtime lifecycle state, participant leases and shutdown barrier
ordered retirement, stale-callback rejection and exact-once results
validation, browser fixtures and Pages deployment
```

## Kit and service census

```txt
15 Nexus Engine root/subdomain kits
5 official NexusEngine-Kits
14 product/page/Worker kits
9 external/host adapters
2 proof kits
45 implemented/adapted/proof surfaces total
35 candidate lifecycle-authority kits including parent
```

The complete names and service lists are retained in `.agent/kit-registry.json` and the current tracker.

## Required domain

```txt
prehistoric-rush-browser-runtime-lifecycle-authority-domain
```

## Required invariants

```txt
one runtime session owns every callback, Worker, participant and render lease
startup either commits Running or retires every accepted partial participant
stop closes admission before retiring consumers
no callback mutates after Stopping
same stop command returns the same terminal result
no lease disposer runs more than once
global public capabilities are revoked before participant disposal
Stopped implies no owned RAF, listener, Worker or renderer lease
re-entry allocates a strictly new runtime generation
```

The previous profile-convergence, coordinated-reset, pose, motion and streamed-content audits remain active. Runtime lifecycle authority coordinates their page-level lifetime without absorbing their domain semantics.
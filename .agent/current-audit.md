# PrehistoricRush Current Audit

**Timestamp:** `2026-07-16T06-39-16-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `webgl-context-gpu-resource-recovery-authority-audited`

## Summary

The active runtime creates one WebGL renderer, terrain and LOD resources, deterministic clay textures, instanced vegetation and pickups, a procedural creature, lighting and shadows. It has no product-owned context-loss/restoration event path, render generation, complete resource registry, reconstruction transaction, bounded retry/fallback or recovered-frame acknowledgement.

## Plan ledger

**Goal:** make renderer loss, recovery and first-frame proof explicit, bounded and observable.

- [x] Inspect renderer and canvas construction.
- [x] Inspect RAF rendering and resize behavior.
- [x] Inspect terrain LOD, texture, instance, creature and shadow resources.
- [x] Inspect disposal and browser context listeners.
- [x] Define recovery authority and fixture boundary.
- [ ] Implement and execute the authority.

## Current interaction loop

```txt
menu and creator
  -> load or edit the selected procedural raptor profile
  -> enter the game route

game boot
  -> preload pinned Nexus Engine, Kits, Three.js, Rapier and ProtoKit modules
  -> compose engine, physics, patch controller, camera and Three.js presentation
  -> create one WebGLRenderer and one GPU-resource graph
  -> create terrain slots, LOD slots, clay textures, instanced vegetation and pickups
  -> create the player mesh, lights and shadow resources
  -> generate the center patch and start RAF

normal frame
  -> collect browser input
  -> tick simulation and physics
  -> update streamed patch ownership
  -> upload or release terrain, instances, pickups and colliders
  -> update camera, creature pose, LOD morphs and materials
  -> renderer.render(scene, camera)
  -> publish DOM telemetry and schedule the next frame

context-loss path today
  -> no product-owned webglcontextlost result
  -> no explicit presentation suspension or simulation policy
  -> no render-generation retirement
  -> no dependency-ordered GPU-resource reconstruction
  -> no stale-generation rejection
  -> no recovery deadline, retry or fallback policy
  -> no first recovered frame acknowledgement
```

## Domains in use

```txt
browser document, canvas, WebGL context, context loss/restoration, RAF, resize and page lifecycle
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
seeded patch identity, active/prefetch rings, generation, cache, activation, release and replay of the visible patch set
Three.js renderer, scene, camera, geometry, materials, textures, shadow maps, instanced meshes and creature resources
terrain LOD topology, slots, index buffers, morph targets, clay normal/roughness textures and visible-frame acknowledgements
Rapier bodies and colliders, browser input, diagnostics, build, Pages deployment and central tracking
render-context generation, loss admission, resource retirement, reconstruction, stale-work rejection, retry, fallback and recovered-frame proof
```

## Current gaps

```txt
WebGLRenderer creation: present
renderer canvas mounted into the game host: present
recursive RAF render submission: present
terrain and LOD geometry buffers: present
normal and roughness textures: present
instanced tree, grass and pickup resources: present
player creature mesh and material resources: present
shadow-map resources: present
ordinary terrain LOD disposal: present

webglcontextlost listener: absent
webglcontextrestored listener: absent
render-context generation identity: absent
loss admission result: absent
explicit presentation suspension: absent
simulation/input policy during loss: absent
complete GPU-resource registry: absent
dependency-ordered reconstruction: absent
base-adapter disposal: absent
host adapter disposal call: absent
stale recovery work rejection: absent
recovery deadline/retry budget: absent
fallback result: absent
RenderLossResult: absent
RenderRecoveryResult: absent
FirstRecoveredFrameAck: absent
forced context-loss fixture: absent
```

## Required authority

`prehistoric-rush-webgl-context-gpu-resource-recovery-authority-domain`

## Boundary

Documentation only. Runtime source, gameplay, rendering, physics, tests and deployment remain unchanged.

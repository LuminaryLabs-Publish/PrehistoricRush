# Current Audit: PrehistoricRush Visual Policy Identity Authority

**Updated:** `2026-07-11T08-48-04-04-00`

## Summary

`PrehistoricRush` now consumes a newer NexusEngine-Kits graph and a coordinated local render-policy change. The active product pin joins the creature torso, neck and head into one continuous tube, while local source narrows and reshades grass cards, changes their palette, enables PCF soft shadows, sets directional-shadow bounds/bias and disables tree-crown shadow casting.

The visible result changed, but there is no single versioned manifest or fingerprint covering the module graph, exact creature geometry, grass shader/geometry/palette and shadow policy. The current creature `contentHash` is incomplete, and the renderer label is a manual string rather than proof of what a committed frame consumed.

## Plan ledger

**Goal:** catalogue the complete current game and define one visual-policy identity that can be admitted, bound and acknowledged by rendered frames while keeping patch activation as P0.

- [x] Reconcile all accessible Publish repositories with central tracking.
- [x] Confirm all nine eligible repositories have root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Inspect the latest product runtime commit and pinned upstream topology change.
- [x] Inspect creature, grass, lighting, shadow, camera and frame consumers.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Record source-graph, visual-policy, binding, observation and fixture gaps.
- [x] Preserve the P0 patch activation transaction.
- [ ] Implement canonical policy identity and executable proof after P0.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: recent undocumented runtime change, also oldest eligible ledger
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Source graph

```txt
NexusEngine:           e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits:      d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js:              0.179.1
Rapier:                 0.15.0
parent domain:          prehistoric-rush-domain-kit 0.5.0
creature kit:           procedural-creature-body-kit 0.1.0
camera kit:             camera-smooth-follow-kit 0.1.0
renderer label:         three-seeded-patch-streaming-neck-shadow-grass-v7
```

Relevant revisions:

```txt
upstream joined neck/head topology:
  0cdd178dbc3b581b81e50a385ba5197781f855e1

current product Kits pin:
  d6630367d557782d9ec965947aeb1c197d37ea15

product visual-policy change:
  219a89ab202fcd1567d0b88812ae0cee606c5ffb
```

## Interaction loop

```txt
browser route
  -> resolve pinned module graph
  -> install core, official, product and external kits
  -> create run domain and procedural creature descriptor
  -> bind Rapier actor
  -> bind Three creature, terrain, trees, grass, pickups, lights and camera
  -> start game, patch controller and camera
  -> browser input
  -> engine tick
  -> patch controller update/pump
  -> release and ready delivery
  -> sequential consumer mutation
  -> collision and pickup processing
  -> creature pose
  -> camera target and smooth transform
  -> update grass wind and sun
  -> Three shadowed render
  -> HUD and host projection
  -> RAF
```

## Domains in use

```txt
runtime module graph and source admission
Nexus Engine core input, spatial, scene, physics, motion, camera, animation,
graphics, skybox, UI, diagnostics and composition
seed and deterministic random streams
procedural creature recipe normalization and presets
creature geometry positions, normals, colors and indices
creature topology, connected components and surface orientation
creature skeleton, skinning, attachments, collision and bounds
creature descriptor identity, snapshot, load and reset
creature pose descriptor generation
Three BufferGeometry, material, skeleton and SkinnedMesh binding
Rapier actor, collider, transform and contact binding
instanced render batches and cell ownership
seeded patch controller, cache, queue, executor and delivery
product patch generation and Worker execution
patch content admission and multi-consumer activation
terrain, trees, grass, pickups, colliders and height consumers
run lifecycle, route, movement, jump, score and outcomes
camera target policy and smooth-follow state
grass geometry, alpha silhouette, palette and wind shader
shadow map, shadow camera, bias and cast/receive policy
Three render submission and frame state
browser input, resize, blur, HUD and public host
run, stream, camera, creature and resource lifecycle
static Pages deployment and validation
```

## Complete kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit
  actions, bindings and input state
core-spatial-kit
  transforms and spatial query capability
core-scene-kit
  scene registry, transitions and scene descriptor
core-physics-kit
  physics provider contract
core-motion-kit
  motion capability
core-camera-kit
  camera capability
core-animation-kit
  animation capability
core-graphics-kit
  graphics and frame capability
core-skybox-kit
  clear-day sky descriptor
core-ui-kit
  UI capability and view projection
core-diagnostics-kit
  diagnostics and readback
core-composition-kit
  capability graph and composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipe normalization
  geometry positions, normals, colors and indices
  topology and connected-part count
  skeleton and skinning
  attachments, bounds and collision recommendation
  pose descriptors
  registry, content hash, snapshots, load and reset

instanced-render-batch-kit
  immutable capacity
  cell replace/release
  flush, overflow and bounds
  statistics and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity
  focus, active, retain and prefetch sets
  generation queue and executor handoff
  ready/release delivery
  budgets, eviction, statistics and snapshots

camera-smooth-follow-kit 0.1.0
  controller registry
  position and look SmoothDamp
  quaternion damping
  reset and teleport handling
  delta-time clamp
  transform access and snapshots
```

### Product kits

```txt
prehistoric-rush-domain-kit 0.5.0
  run/input resources, simulation, route, surface, score, outcomes,
  creature access, events, scene transitions and snapshot

drunk-route-generator
  deterministic route samples, nearest query, progress,
  region classification and snapshot

player-raptor-preset-kit
  product creature recipe and collision configuration

prehistoric-patch-generator
  terrain arrays, tree descriptors, grass matrices, pickups,
  colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery
```

### External modules and adapters

```txt
rapier-physics-domain-kit
  Rapier bridge, kinematic actor, fixed colliders, transforms, step and contacts

three-runtime-module 0.179.1
  scene graph, geometry, instancing, skinning, camera, lighting, fog,
  shadows and rendering

rapier-runtime-module 0.15.0
  physics runtime
```

### Host-implied kits

```txt
module-worker-executor-adapter-kit
terrain-slot-consumer-kit
tree-instance-batch-consumer-kit
grass-patch-consumer-kit
shard-pickup-consumer-kit
patch-collider-consumer-kit
patch-height-sampler-kit
three-procedural-creature-adapter-kit
creature-descriptor-admission-kit
creature-geometry-binding-kit
creature-skeleton-binding-kit
creature-collision-binding-kit
creature-pose-binding-kit
creature-render-frame-correlation-kit
prehistoric-camera-target-policy-kit
three-camera-transform-consumer-kit
camera-light-render-adapter-kit
shadow-map-policy-kit
shadow-camera-policy-kit
shadow-caster-policy-kit
grass-card-geometry-policy-kit
grass-alpha-shader-policy-kit
grass-palette-policy-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Runtime visual changes now active

### Creature topology

```txt
old:
  torso/neck tube
  separate head tube
  topology.connectedParts = 7

current:
  torso/neck/head in one tube
  same radial segment count across the join
  topology.connectedParts = 6
```

The upstream smoke checks the indexed geometry has six connected components. The kit version remains `0.1.0`.

### Grass

```txt
card X scale: 1.00 -> 0.62
alpha silhouette: widened smoothstep range
fragment color: flat -> vertical shade
layer palettes: darker -> brighter green set
```

### Shadows

```txt
shadow map: default -> PCFSoftShadowMap
directional shadow camera: explicit +/-80 bounds, near 1, far 180
bias: -0.0004
normalBias: 0.06
tree crowns: castShadow true -> false
tree crowns: receiveShadow remains true
```

## Main findings

### 1. Source graph identity is fragmented

Module pins exist as constants, but there is no immutable graph manifest with integrity, schema and a canonical fingerprint admitted before construction.

### 2. Creature identity remains incomplete

The creature `contentHash` still covers normalized recipe plus topology summary rather than exact positions, normals, indices, skinning, skeleton, collision and attachments. The connected-part count changed, but exact geometry identity remains unproved.

### 3. Local render policy has no schema

Grass geometry, shader text, palette, shadow settings and caster flags are embedded in the host. No typed descriptor owns them, no version is assigned and no canonical hash is published.

### 4. Renderer label is not proof

`three-seeded-patch-streaming-neck-shadow-grass-v7` is manually maintained. It can drift from source and does not identify exact module pins, shader code, colors, geometry parameters or shadow settings.

### 5. Consumer binding is result-free

Creature, grass, light, shadow and camera construction return live objects rather than typed admission/binding results with accepted policy revisions.

### 6. Render frames are unacknowledged

`renderer.render(scene, camera)` returns no product frame result. The host cannot prove which creature geometry, grass policy, shadow policy, camera transform or pose was consumed by a displayed frame.

### 7. P0 streaming integrity remains unresolved

The controller marks patches active before terrain, tree, grass, pickup, collider and height consumers acknowledge a shared commit. This remains the first implementation priority.

## Required authority boundary

```txt
PrehistoricRush Visual Policy Identity Domain
```

Required records:

```txt
RuntimeModuleGraphManifest
VisualPolicyDescriptor
CreatureGeometryIdentity
GrassRenderPolicy
ShadowRenderPolicy
RenderPolicyAdmissionResult
RenderBindingResult
RenderFrameReceipt
VisualPolicyObservation
```

A frame receipt must correlate:

```txt
runSessionId
streamEpoch
frameId
moduleGraphFingerprint
visualPolicyFingerprint
creatureDescriptorHash
creatureGeometryHash
creatureBindingRevision
poseRevision
grassPolicyHash
shadowPolicyHash
cameraRevision
patchConsumerRevision
```

## Next safe ledges

```txt
P0:
PrehistoricRush Seeded Patch Activation Commit Authority
+ Multi-Consumer Prepare / Commit / Rollback Fixture Gate

P1:
PrehistoricRush Visual Policy Graph Identity Authority
+ Neck / Grass / Shadow Render-Frame Fixture Gate
```

No runtime code was changed by this audit.
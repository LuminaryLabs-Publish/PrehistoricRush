# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T08-48-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` is a browser 3D runner composed from pinned Nexus Engine, NexusEngine-Kits, ProtoKits, Three.js and Rapier modules. The latest product runtime now pins `NexusEngine-Kits@d6630367d557782d9ec965947aeb1c197d37ea15`, which includes a continuous torso-neck-head tube, while the same product change alters grass-card geometry and shading, shadow-map policy, directional-shadow bounds and tree-crown shadow casting.

These visible changes are not represented by one authoritative visual-policy identity. The host exposes a manually maintained renderer label and an incomplete creature `contentHash`, so visually different module graphs and local render policies can report insufficient or misleading provenance.

## Plan ledger

**Goal:** make one visible frame traceable to the exact module graph, creature topology, grass policy and shadow policy that produced it, without displacing the P0 patch activation transaction.

- [x] Compare the complete accessible `LuminaryLabs-Publish` inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain centrally tracked with root `.agent` state.
- [x] Select only `PrehistoricRush` because it is the oldest eligible ledger entry and received a newer undocumented runtime/render-policy change.
- [x] Read the current product source and newly pinned NexusEngine-Kits topology change.
- [x] Identify the interaction loop, domains, complete kit inventory and kit services.
- [x] Trace creature, grass, shadow, camera and rendered-frame consumers.
- [x] Add timestamped architecture, render, gameplay, interaction, visual-policy and deploy audits.
- [x] Refresh every required root `.agent` document.
- [x] Change no runtime source, package scripts, gameplay or deployment configuration.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement executable visual-policy identity and frame-correlation fixtures after the P0 patch activation gate.

## Selection result

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing repositories: 0
root-.agent-missing repositories: 0
oldest central ledger: PrehistoricRush
recent undocumented runtime change: PrehistoricRush
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed in the Publish organization during this pass.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> resolve pinned Nexus Engine, Kits, ProtoKits, Three and Rapier modules
  -> install 12 core kits and 5 official NexusEngine-Kits
  -> create prehistoric-rush-domain-kit
  -> create creature descriptor and Rapier actor
  -> bind creature geometry/skeleton/material into Three
  -> construct terrain slots, tree batches, grass, pickups, lights and camera
  -> start run, patch controller and smooth camera
  -> browser input
  -> engine.tick(dt)
  -> patch generation / delivery / release
  -> sequential terrain, tree, grass, pickup, collider and height mutation
  -> creature pose and camera transform
  -> shadowed Three render
  -> HUD and host snapshot
  -> requestAnimationFrame
```

## Current module and visual policy

```txt
NexusEngine:           e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits:      d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js:              0.179.1
Rapier:                 0.15.0
creature kit version:  0.1.0
renderer label:        three-seeded-patch-streaming-neck-shadow-grass-v7
```

The pinned Kits graph now contains the joined torso-neck-head tube and reports six connected procedural parts. The product route also narrows grass cards, changes their alpha/shade function and palette, uses PCF soft shadows, configures the directional shadow camera and disables tree-crown shadow casting.

## Main finding

The runtime has no canonical visual-policy manifest or frame receipt.

```txt
upstream source pin
  + creature exact geometry/topology
  + local grass geometry
  + grass shader source
  + grass palette
  + shadow-map type
  + shadow camera bounds/bias
  + object cast/receive policy
  + camera transform
  + pose revision
  -> no canonical visualPolicyFingerprint
  -> no typed render-policy admission
  -> no binding result
  -> no committed frame acknowledgement
```

`PrehistoricRushHost.getState()` exposes only the creature ID, incomplete `contentHash`, topology counts and a manually maintained renderer string. The creature hash still excludes exact geometry arrays. The renderer label does not prove the local shader, colors, shadow settings or exact module graph consumed by a frame.

## Domains in use

```txt
module graph and source admission
core input, spatial, scene, physics, motion, camera, animation, graphics,
skybox, UI, diagnostics and composition
deterministic seed and random streams
procedural creature recipe, geometry, topology, skeleton, skinning,
attachments, collision, pose, snapshot and reset
Three creature geometry/skeleton/material binding
Rapier actor/collider/contact binding
instanced render batches
seeded world patch scheduling, generation, Worker delivery and cache
terrain, trees, grass, pickups, colliders and height sampling
run lifecycle, route, movement, jump, score and outcomes
camera target policy and smooth follow
lighting, shadow map, shadow camera and object caster policy
grass geometry, alpha shader, palette and wind animation
render submission, HUD, host diagnostics and static deployment
```

## Kits and services

### Core Nexus Engine kits

```txt
core-input-kit         actions and bindings
core-spatial-kit       transforms and spatial query capability
core-scene-kit         scene registry and transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostics/readback capability
core-composition-kit   capability graph and composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipe normalization, geometry, topology, skeleton, skinning,
  attachments, collision recommendation, pose, snapshot/load/reset

instanced-render-batch-kit
  cell replace/release, capacity, bounds, overflow, flush and snapshots

seeded-world-patch-controller-kit 0.1.0
  focus, desired sets, queue, cache, executor handoff, ready/release
  delivery, budgets, eviction, statistics and snapshots

camera-smooth-follow-kit 0.1.0
  position/look damping, quaternion damping, reset, teleport handling,
  delta clamp, transform access and snapshots
```

### Product, external and host kits

```txt
prehistoric-rush-domain-kit
drunk-route-generator
player-raptor-preset-kit
prehistoric-patch-generator
prehistoric-patch-worker
rapier-physics-domain-kit
three-runtime-module
rapier-runtime-module
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
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Priority order

```txt
P0 Seeded Patch Activation Commit Authority
P1 Visual Policy Graph Identity and Render-Frame Correlation
   - creature exact geometry/topology identity
   - grass geometry/shader/palette identity
   - shadow map/frustum/caster identity
P2 Camera Target / Transform / Frame Consumption Proof
P3 Run Session Reset + Stream / Camera / Creature Epoch Authority
P4 Worker Stale-Result Quarantine and Ordered Runtime Disposal
```

## Read this pass first

```txt
.agent/trackers/2026-07-11T08-48-04-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T08-48-04-04-00.md
.agent/architecture-audit/2026-07-11T08-48-04-04-00-visual-policy-identity-dsk-map.md
.agent/render-audit/2026-07-11T08-48-04-04-00-neck-grass-shadow-frame-provenance-gap.md
.agent/gameplay-audit/2026-07-11T08-48-04-04-00-run-pose-shadow-grass-frame-loop.md
.agent/interaction-audit/2026-07-11T08-48-04-04-00-render-policy-admission-result-map.md
.agent/visual-policy-audit/2026-07-11T08-48-04-04-00-module-graph-shadow-grass-contract.md
.agent/deploy-audit/2026-07-11T08-48-04-04-00-visual-policy-fingerprint-fixture-gate.md
```

## Do not start next with

- replacing the shared creature generator with a product-local duplicate
- using `DoubleSide` or disabling all shadows to conceal topology defects
- treating the renderer label as a canonical fingerprint
- adding more visual systems before the current policy can be identified
- wiring more patch consumers before P0 activation acknowledgement exists
- claiming visual correctness without CPU and browser frame fixtures
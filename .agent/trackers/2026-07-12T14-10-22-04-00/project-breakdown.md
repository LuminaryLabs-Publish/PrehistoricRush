# Project Breakdown: PrehistoricRush Pose Contract and Rig Binding

**Timestamp:** `2026-07-12T14-10-22-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `e6ee17024ec3f3f1f4de80ea520b5cd7d6ba7c28`

## Summary

A post-audit runtime commit widened the Three.js creature adapter from legacy Euler rotations to quaternion arrays and objects. The renderer can now technically accept articulated-pose rotations, but it still has no versioned pose envelope, rig binding, transform-space declaration, full/partial semantics, bone-completeness policy or typed application result. Production game and creator paths remain on legacy pose creation.

## Plan ledger

**Goal:** document one bounded authority from pose production through schema admission, rig binding, bone application and first-visible-frame proof.

- [x] List all 10 accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Compare nine eligible repositories with central ledger entries.
- [x] Confirm no eligible repository is new, ledger-missing or root-`.agent`-missing.
- [x] Select only `PrehistoricRush` because runtime commit `e6ee170...` landed after its previous central audit.
- [x] Trace creator and game interaction loops.
- [x] Identify all domains in use.
- [x] Inventory all kits and offered services.
- [x] Trace procedural and articulated pose shapes.
- [x] Trace direct and damped Three.js bone application.
- [x] Define the missing pose-contract/rig-binding authority.
- [x] Add required root and timestamped audit outputs.
- [x] Update central ledger and internal change log.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime changes and executable fixtures remain future work.

## Repository selection

```txt
accessible repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing repositories: 0
root-.agent-missing repositories: 0

PrehistoricRush    2026-07-12T12-08-05-04-00 + runtime change at 14:02 selected
HorrorCorridor     2026-07-12T12-21-38-04-00
ZombieOrchard      2026-07-12T12-39-25-04-00
MyCozyIsland       2026-07-12T12-58-08-04-00
TheUnmappedHouse   2026-07-12T13-08-15-04-00
AetherVale         2026-07-12T13-20-00-04-00
TheOpenAbove       2026-07-12T13-29-56-04-00
IntoTheMeadow      2026-07-12T13-54-00-04-00
PhantomCommand     2026-07-12T13-59-50-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Complete interaction loop

```txt
menu/profile
  -> load normalized creature profile
  -> route to creator or game

creator boot
  -> import pinned Nexus Engine, seed kit, creature kit and Three.js
  -> install seed and procedural-creature-body kits
  -> build skinned creature mesh
  -> create legacy procedural pose each RAF
  -> damp position and Euler/quaternion rotation into bones
  -> frame camera from geometry bounds
  -> render and persist profile changes

game boot
  -> module preflight
  -> compose Core Input, Spatial, Scene, Physics, Simulation, Motion, Camera,
     Animation, Graphics, Skybox, UI, Diagnostics and Composition
  -> compose articulated-dynamics and articulated-motion subdomains
  -> install official seed, creature, batch, patch and camera-follow kits
  -> install product domain, Rapier provider, player body, patch controller and renderer
  -> register player articulated rig

game tick
  -> browser input patches product input
  -> product run system integrates movement and surface state
  -> submit Core Motion intent
  -> commit Core Motion frame containing kinematic request data
  -> submit request separately to Core Physics
  -> submit simulation proposals
  -> observe Rapier/fallback collision
  -> commit outcome
  -> release/generate/activate streamed patches

game render
  -> derive legacy procedural pose from current run/input state
  -> call applyCreaturePose()
  -> decode position array/object
  -> use quaternion rotation when present, otherwise Euler fallback
  -> silently skip unknown bones and preserve omitted bone transforms
  -> return no application receipt
  -> update camera, vegetation animation, render, HUD and public readback

optional articulated path
  -> convert legacy pose to quaternion articulated pose
  -> solve through articulatedMotion
  -> produce articulated frame
  -> no production creator/game application call
```

## Domains in use

```txt
page routing, profile lifecycle and character creator
runtime source identity, commit pins, import maps and module preflight
Core Input, Spatial, Scene and Simulation
Core Physics and articulated-dynamics subdomain
Core Motion and articulated-motion subdomain
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed and deterministic randomness
procedural creature body, skeleton, skinning, collision and legacy pose
player articulated rig and pose conversion
pose schema, transform-space, quaternion and full/partial semantics
rig binding, skeleton fingerprints and bone membership
Three.js creature mesh, direct pose application, damped pose application and disposal
product run, route, surface, score and outcome arbitration
Rapier provider, bodies, colliders, motion requests and frames
Worker/fallback patch generation, queue, cache and delivery
terrain, tree, grass, shard, pickup and collider materialization
camera smooth follow, lighting, render surface, HUD and public host
Node tests, static hosting, Pages deployment and internal audit tracking
```

## Kit and service inventory

### Nexus Engine root/subdomain kits: 15

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms, spatial queries
core-scene-kit: registry, transitions, host descriptor
core-physics-kit: provider, bodies, colliders, motion requests, step, frame
articulated-dynamics-domain-kit: articulations, joints, motors, ragdoll state, frames
core-simulation-kit: tick context, proposals, observations, resolution, committed frame
core-motion-kit: movement modes, intents, trajectories, motion frames, snapshot, reset
articulated-motion-domain-kit: rigs, poses, targets, IK, pose resolution, frames
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics and frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability and projection
core-diagnostics-kit: diagnostics and readback
core-composition-kit: composition metadata and capability graph
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic seed and random streams
procedural-creature-body-kit: descriptor, geometry, skeleton, skinning, collision, legacy pose, snapshot
instanced-render-batch-kit: cell replace/release, flush, overflow, bounds, stats
seeded-world-patch-controller-kit: focus, membership, queue, cache, generation, delivery, eviction, snapshot
camera-smooth-follow-kit: damping, reset, teleport handling, snapshot
```

### Product/page/Worker kits: 14

```txt
prehistoric-rush-domain-kit: run, input, movement proposals, motion intent/frame, observations, events, transitions, player articulation API, snapshot
prehistoric-rush-resolution-policy: collision/pickup/goal precedence, state patch, events, transition
player-articulation-adapter-kit: skeleton-to-rig, legacy-to-articulated pose, Euler-to-quaternion conversion
player-character-schema-kit: defaults, normalization, clamps, merge
player-character-profile-store-kit: load, save, patch, reset, revision, storage sync
menu-page-kit: shell, profile projection, routes
character-creator-page-kit: controls, draft, persistence, preview RAF
character-preview-transition-kit: morph, crossfade, pose damping, revision, disposal
three-procedural-creature-adapter-kit: mesh, materials, bone lookup, position coercion, Euler/quaternion application, damped slerp, disposal
game-page-entry-kit: module preflight, failure projection, game import
drunk-route-generator: samples, nearest point, progress, classification, snapshot
player-raptor-preset-kit: creature recipe and collision capsule
prehistoric-patch-generator: terrain, trees, grass, shards, colliders, bounds, transferables
prehistoric-patch-worker: initialization, generation, request/error protocol, transfer
```

### External/host adapters: 9

```txt
Three runtime module: scene, geometry, materials, instancing, camera, lighting, rendering
Rapier physics domain kit: Nexus provider bridge
Rapier runtime module: bodies, colliders, queries, world step
message Worker executor: request correlation and async generation
active-content consumer adapter: terrain, trees, grass, shards, pickups, colliders, height
creator viewport framing adapter: bounds, target and distance
creator persistence scheduler: timer replacement and profile commit
browser input adapter: keyboard, buttons, keyup, blur and product input patch
creature/camera/render/HUD/public-host adapters: pose application, camera, collision/pickup sampling, HUD and readback
```

### Proof kits: 2

```txt
prehistoric-rush-resolution-policy-test-kit: continue, win, collision, precedence, pickup idempotency, fallback, serialization
player-articulation-test-kit: rig-chain adaptation, Euler/quaternion conversion, cloneability
```

```txt
total implemented/adapted/proof surfaces: 45
```

## Main finding

The new quaternion adapter is representation-compatible but contract-free:

```txt
pose identity and revision: absent
schema version: absent
transform coordinate convention: absent
absolute/partial mode: absent
rig and skeleton fingerprint binding: absent
finite quaternion admission: absent
unknown/missing bone policy: implicit
rest-pose reconstruction: absent
application transaction/result: absent
visible-frame pose receipt: absent
```

## Required parent domain

```txt
prehistoric-rush-pose-contract-rig-binding-authority-domain
```

## Required transaction

```txt
PoseApplicationCommand
  -> admit pose identity, revision, schema and source
  -> admit transform space, quaternion convention and pose mode
  -> validate finite transform components
  -> validate rig, skeleton, profile and mesh generations
  -> classify required, optional, missing and unknown bones
  -> derive detached absolute or partial application plan
  -> reject atomically or commit all admitted bone transforms
  -> return applied/missing/rejected/repaired bone result
  -> publish pose observation and bounded journal
  -> acknowledge the first visible frame using that result
```

## Validation boundary

```txt
runtime source changed: no
render behavior changed: no
gameplay changed: no
package/dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
npm test: not run
browser/Pages smokes: not run
pose-contract fixtures: unavailable
```

No pose-schema safety, rig-binding safety, articulated presentation or production-readiness claim is made.
# Project Breakdown: PrehistoricRush Coordinated Reset Reconciliation

**Timestamp:** `2026-07-12T16-20-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Repository head observed at selection:** `a413d52b06093efbcba217c02df9efd551603954`  
**Latest runtime revision reviewed:** `e6ee17024ec3f3f1f4de80ea520b5cd7d6ba7c28`

## Summary

PrehistoricRush already contained a complete repo-local coordinated run-reset audit at `2026-07-12T16-11-48-04-00`, but the central ledger still described the older pose-contract audit from `2026-07-12T14-10-22-04-00`. This run verifies the interaction loop, domains, all 45 implemented/adapted/proof kit surfaces and their services, then reconciles repo-local routing with central tracking without changing runtime behavior.

The technical finding remains unchanged: `game.start()` replaces product run/input state and resets only part of the host graph. Core Motion, Core Physics, articulation, patch-controller/Worker work, active content, renderer state, public readback and the first visible frame do not commit under one shared reset transaction or run generation.

## Plan ledger

**Goal:** preserve the complete coordinated-reset breakdown while making repo-local human docs, machine registry references and the central ledger describe the same current audit state.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger entries and root `.agent` state.
- [x] Detect that PrehistoricRush repo-local documentation is newer than central tracking.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Re-verify the complete interaction loop.
- [x] Re-verify all active domains.
- [x] Re-verify all 45 kit surfaces and their offered services.
- [x] Preserve the coordinated run-reset parent-domain design and proof boundary.
- [x] Add a fresh tracker, turn-ledger entry and reconciliation audit family.
- [x] Update root routing without replacing the technical audit authority.
- [x] Synchronize `LuminaryLabs-Dev/LuminaryLabs` on `main`.
- [x] Create no branch and no pull request.
- [ ] Runtime implementation and executable reset fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    central 2026-07-12T14-10-22-04-00
                   repo-local 2026-07-12T16-11-48-04-00 selected
HorrorCorridor     2026-07-12T14-30-36-04-00
ZombieOrchard      2026-07-12T14-38-35-04-00
MyCozyIsland       2026-07-12T14-59-01-04-00
TheUnmappedHouse   2026-07-12T15-08-07-04-00
AetherVale         2026-07-12T15-18-50-04-00
TheOpenAbove       2026-07-12T15-40-04-04-00
IntoTheMeadow      2026-07-12T15-49-09-04-00
PhantomCommand     2026-07-12T16-00-03-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Complete interaction loop

```txt
menu/profile
  -> load or normalize the creature profile
  -> route to creator or game

creator
  -> compose seed and procedural-creature services
  -> edit and persist the creature profile
  -> generate a legacy preview pose
  -> apply pose to the Three.js skinned mesh
  -> render through a recursive RAF

game boot
  -> preflight pinned runtime modules
  -> compose Nexus Engine Core, official kits, Rapier, Worker and Three.js adapters
  -> register player rig and physics body
  -> create patch controller, active-content consumer and camera follow
  -> call game.start()
  -> prime center content and reset camera
  -> enter RAF

active frame
  -> browser input updates held state or invokes start
  -> game input is submitted
  -> engine.tick(dt)
  -> product movement proposal submits Core Motion intent/frame
  -> Core Physics receives a motion request and steps Rapier/fallback collision
  -> Core Simulation resolves pickup, collision, goal and transition outcome
  -> host releases, generates and activates streamed patches
  -> active content, colliders and pickups are rebuilt
  -> Three.js applies creature pose and renders world/HUD
  -> public host exposes independently sampled subsystem state

restart
  -> Retry, Run Again, Space outside gameplay or Enter in any phase
  -> game.start() increments product runId
  -> RunState and InputState are replaced
  -> Core Simulation resolution is reset
  -> current active content is refreshed
  -> stream focus moves to origin and center is primed
  -> camera follow resets
  -> no cross-domain prepare/commit/rollback barrier runs
  -> next RAF eventually produces a visible frame
```

## Domains in use

```txt
route, menu, profile and character-creator lifecycle
runtime source identity, import-map preflight and module admission
browser input, activation, held state, blur handling and RAF
Core Input, Spatial, Scene and Simulation
Core Motion and articulated-motion subdomain
Core Physics and articulated-dynamics subdomain
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batch, patch controller and camera follow
product run, route, surface, score, outcome and articulation
Rapier provider, bodies, colliders, motion requests, contacts and frames
Worker/fallback patch generation, queueing, caching and delivery
terrain, trees, grass, shards, pickups and collider materialization
Three.js creature, pose, camera, lighting, rendering and HUD
public-host readback, Node proof and Pages deployment
run identity, restart admission, reset generation and participant lifecycle
prepare, commit, rollback, stale-result rejection and visible-frame acknowledgement
repo-local and central audit tracking
coordinated run-reset authority: missing at runtime
```

## All kits and offered services

### Nexus Engine root and subdomain kits: 15

```txt
core-input-kit: actions, bindings, input-state
core-spatial-kit: transforms, spatial queries
core-scene-kit: scene registry, transitions, host descriptor
core-physics-kit: provider, bodies, colliders, motion requests, step, frame
articulated-dynamics-domain-kit: articulations, joints, motors, ragdoll state, frames, snapshot, reset
core-simulation-kit: tick context, proposals, observations, resolution policy, atomic state/event/transition commit, committed frame
core-motion-kit: movement modes, intents, trajectories, motion frames, validation, snapshot, reset
articulated-motion-domain-kit: rig, pose, targets, inverse kinematics, pose resolution, frames, snapshot, reset
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
instanced-render-batch-kit: cell replace/release, flush, overflow, bounds, statistics
seeded-world-patch-controller-kit: focus, membership, queue, cache, generation, delivery, eviction, snapshot, reset
camera-smooth-follow-kit: damping, reset, teleport handling, snapshot
```

### Product, page and Worker kits: 14

```txt
prehistoric-rush-domain-kit: run resources, input, movement proposals, motion-intent frame, observations, events, transitions, articulation API, snapshot
prehistoric-rush-resolution-policy: collision/pickup/goal precedence, state patch, events, transition
player-articulation-adapter-kit: skeleton-to-rig, legacy-pose conversion, quaternion conversion
player-character-schema-kit: defaults, normalization, clamps, merge
player-character-profile-store-kit: load, save, patch, reset, revision, storage synchronization
menu-page-kit: menu shell, profile projection, routes
character-creator-page-kit: controls, draft, persistence, legacy preview pose, RAF
character-preview-transition-kit: morph, crossfade, pose damping, revision, disposal
three-procedural-creature-adapter-kit: skinned mesh, materials, bone lookup, position coercion, Euler/quaternion application, slerp, disposal
game-page-entry-kit: module preflight, failure projection, game import
drunk-route-generator: samples, nearest-point lookup, progress, classification, snapshot
player-raptor-preset-kit: creature recipe and collision capsule
prehistoric-patch-generator: terrain, trees, grass, shards, colliders, bounds, transferables
prehistoric-patch-worker: initialization, generation, request/error protocol, transfer
```

### External and host adapters: 9

```txt
three-runtime-module: scene, geometry, materials, instancing, camera, lighting, render
rapier-physics-domain-kit: Nexus provider bridge
rapier-runtime-module: bodies, colliders, queries, world step
message-worker-executor-adapter-kit: request correlation, async generation, pending rejection, listener removal, Worker termination
active-content-consumer-adapter: terrain, trees, grass, shards, pickups, colliders, height
creator-viewport-framing-adapter: bounds, target, distance
creator-persistence-scheduler: timer replacement and profile commit
browser-input-adapter: keyboard, buttons, keyup, blur, product input patch, restart activation
creature-camera-render-host-adapters: pose application, collision sample, pickup scan, camera, HUD, readback
```

### Proof kits: 2

```txt
prehistoric-rush-resolution-policy-test-kit: continue, win, collision, precedence, pickup idempotency, fallback, serialization
player-articulation-test-kit: rig-chain adaptation, Euler/quaternion conversion, cloneability
```

## Technical finding retained

```txt
product RunState and InputState reset: present
Core Simulation resolution reset: present
camera reset: present
patch-controller reset API: present but unused by restart
Core Motion reset during restart: absent
Core Physics body/request/frame reset result: absent
articulation reset result: absent
Worker run-generation barrier: absent
active-content reset revision: absent
renderer reset policy/result: absent
coherent public RunRestartResult: absent
first visible new-run frame acknowledgement: absent
```

Required parent domain:

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

It must admit restart source and phase, allocate one reset transaction and run generation, prepare every required participant, atomically commit or roll back, reject predecessor input/Worker/frame results, publish coherent readback and acknowledge the first visible frame.

## Documentation reconciliation finding

```txt
repo-local START_HERE/current audit: coordinated reset at 16-11-48
repo-local machine registry: coordinated reset schema 79
central repo ledger before this run: pose contract at 14-10-22
result: central selection order and current authority were stale
```

This run does not replace the coordinated-reset audit. It publishes a fresh reconciliation record and advances central tracking to the already-reviewed technical state.

## Repo-local output

```txt
.agent/trackers/2026-07-12T16-20-55-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T16-20-55-04-00.md
.agent/architecture-audit/2026-07-12T16-20-55-04-00-coordinated-reset-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-12T16-20-55-04-00-reset-frame-proof-state-sync.md
.agent/gameplay-audit/2026-07-12T16-20-55-04-00-restart-authority-reconciliation-loop.md
.agent/interaction-audit/2026-07-12T16-20-55-04-00-restart-command-tracking-map.md
.agent/central-sync-audit/2026-07-12T16-20-55-04-00-repo-ledger-machine-registry-contract.md
.agent/deploy-audit/2026-07-12T16-20-55-04-00-coordinated-reset-proof-gate-sync.md
```

The existing `current-audit.md`, `next-steps.md`, `known-gaps.md`, `validation.md`, reset-lifecycle audit and schema-79 kit registry remain the technical source of truth.

## Validation boundary

```txt
runtime source changed: no
gameplay changed: no
motion, physics or articulation changed: no
streaming or Worker behavior changed: no
render behavior changed: no
package/dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
npm test: not run
browser/Pages reset smoke: not run
coordinated-reset fixtures: unavailable
```

No coordinated-reset correctness, stale-work rejection, rollback, coherent-readback or first-visible-frame claim is made.
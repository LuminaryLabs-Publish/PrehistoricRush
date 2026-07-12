# Project Breakdown: PrehistoricRush Coordinated Run Reset

**Timestamp:** `2026-07-12T16-11-48-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Starting repository head reviewed:** `04c30a3803c294ef712f10eadabcb3779e26735f`  
**Latest runtime source revision reviewed:** `e6ee17024ec3f3f1f4de80ea520b5cd7d6ba7c28`

## Summary

PrehistoricRush resets its product `RunState` and `InputState`, clears the Core Simulation resolution result, refreshes existing content, updates the patch focus and resets the camera. It does not coordinate Core Motion, Core Physics, articulated motion, articulated dynamics, the patch controller, Worker work, active renderer content, renderer time, public readback or the first visible frame under one reset generation.

The `Enter` key calls the browser `start()` path unconditionally, including during an active run. A mid-run restart can therefore publish a new `runId` while motion history, physics state, patch-controller work, renderer state and public diagnostics still describe predecessor-run generations.

## Plan ledger

**Goal:** make every run start or restart an admitted, generation-bound transaction that prepares, commits or rolls back all simulation, streaming, physics, motion, articulation, input, camera, renderer and visible-frame participants together.

- [x] Compare all ten accessible Publish repositories with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger entries and root `.agent` state.
- [x] Select only `PrehistoricRush` using the oldest eligible synchronized timestamp.
- [x] Inspect the browser start/retry/Enter paths.
- [x] Inspect product `start()`, RunState and InputState replacement.
- [x] Inspect Core Simulation, Core Motion and reset-capable Core APIs.
- [x] Inspect Core Physics body setup and frame readback.
- [x] Inspect patch-controller reset, queues, inflight work and Worker executor disposal.
- [x] Inspect active-content, camera and renderer reset behavior.
- [x] Identify the complete interaction loop, all domains, all 45 implemented/adapted/proof surfaces and their services.
- [x] Define the coordinated run-reset parent domain, participant contract and fixture boundary.
- [x] Add a new tracker, turn-ledger entry and architecture/system audit family.
- [x] Refresh all required root `.agent` documents and the machine registry.
- [x] Synchronize the central ledger and internal change log on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime reset implementation and executable browser proof remain future work.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-12T14-10-22-04-00 selected
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
page boot
  -> load pinned modules and player profile
  -> create Nexus Engine graph
  -> install Rapier provider and player body
  -> create patch controller, Worker executor, camera follow and Three adapter
  -> call game.start()
  -> prime center streaming and reset camera
  -> start recursive RAF

active run
  -> key/button input mutates browser input or directly calls start()
  -> RAF submits product input
  -> engine.tick(dt)
  -> product run proposal submits Core Motion frame and Core Physics request
  -> Core Simulation resolves state, pickups, collision and outcome
  -> host releases/generates/activates patches
  -> host renders creature, camera, world and HUD

restart sources
  -> terminal Retry/Run Again button calls start()
  -> Space outside game calls start()
  -> Enter always calls start(), including during active gameplay

current restart
  -> game.start() increments runId
  -> replace product RunState and InputState
  -> reset Core Simulation resolution only
  -> emit RunStarted and request scene transition
  -> rebuild renderer content from currently active patches
  -> move patch-controller focus to origin and prime one center patch
  -> reset camera follow
  -> leave Core Motion, Core Physics, articulation, controller generation,
     Worker work, renderer time and public snapshots without one reset receipt
  -> next RAF eventually advances and renders the new run
```

## Source-backed reset matrix

| Participant | Current restart behavior | Missing proof |
|---|---|---|
| Product RunState | Replaced; `runId` increments | Reset transaction ID and commit receipt |
| Product InputState | Replaced | Browser key-source generation and stale-event rejection |
| Core Simulation | `resetResolution()` only | Full simulation generation and committed reset frame |
| Core Motion | No host reset call | Intent/frame history reset receipt |
| Core Physics | No explicit body/request/frame reset | Body-at-origin and request-generation receipt |
| Articulated Motion | No reset call | Rig/pose frame reset policy |
| Articulated Dynamics | No reset call | Joint/body generation reset policy |
| Patch controller | `reset()` exists but is not called | Queue/cache/active/inflight reset result |
| Worker executor | `dispose()` exists but is not called | Run-generation barrier or request cancellation |
| Active content adapter | Rebuilds current active patches | Empty/prepared content generation and parity digest |
| Camera follow | Explicitly reset | Shared reset transaction reference |
| Renderer animation time | Continues | Declared preserve/reset policy |
| Public host | Immediately exposes mixed snapshots | Typed reset result and coherent readback generation |
| Visible frame | Rendered later | First-visible-new-run acknowledgement |

## Concrete mismatch paths

### Mid-run Enter restart

```txt
run N is active
  -> Enter keydown calls start() without status admission
  -> product RunState becomes run N+1 at origin
  -> predecessor motion, physics, stream and renderer observations remain installed
  -> public host can read a new run with predecessor participant frames
```

### Split public readback

```txt
start() returns run N+1
  -> before the next RAF tick
  -> game snapshot reports run N+1
  -> Core Motion current frame/history can still report run N
  -> Core Physics frame/body can still report run N
  -> patch controller and active content retain independent predecessor state
```

### Old-generation Worker completion

```txt
run N launches patch request
  -> run N+1 starts without controller reset or Worker generation barrier
  -> old request resolves under the same controller
  -> result can enter current cache/readiness based on current desired membership
  -> no run generation classifies it as predecessor work
```

### Non-atomic reset presentation

```txt
camera resets immediately
  -> active content is rebuilt and streaming updates incrementally
  -> motion, physics and renderer state do not return reset receipts
  -> first visible frame has no proof that all participants committed run N+1
```

## Domains in use

```txt
routes, profile lifecycle and character creator
runtime source identity, import maps and module preflight
browser input, key state, restart activation and RAF
Core Input, Spatial, Scene and Simulation
Core Motion and articulated motion
Core Physics and articulated dynamics
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batch, patch controller and camera follow
product run, route, surface, score, outcome and player articulation
run identity, restart admission and reset generation
reset participant preparation, commit, rollback and observation
Rapier bodies, colliders, requests, contacts and frames
Worker/fallback generation, queues, cache, active membership and delivery
terrain, trees, grass, shards, pickups and collider materialization
Three.js creature, camera, lighting, rendering, HUD and public readback
browser resource lifecycle and eventual disposal
Node proof, static Pages deployment and audit tracking
coordinated run-reset authority: missing
```

## All kits and offered services

### Nexus Engine root and subdomain kits: 15

```txt
core-input-kit
  actions, bindings, input-state

core-spatial-kit
  transforms, spatial-queries

core-scene-kit
  scene-registry, transitions, host-descriptor

core-physics-kit
  provider, bodies, colliders, motion-requests, step, frame

articulated-dynamics-domain-kit
  articulations, physical-joints, joint-motors, ragdoll-state, frames, snapshot, reset

core-simulation-kit
  tick-context, proposals, observations, resolution-policy, state/event/transition commit, committed-frame

core-motion-kit
  movement-modes, intents, trajectories, motion-frames, validation, snapshot, reset

articulated-motion-domain-kit
  rig, pose, targets, inverse-kinematics, pose-resolution, frames, snapshot, reset

core-camera-kit
  camera-capability

core-animation-kit
  animation-capability

core-graphics-kit
  graphics, frame-capability

core-skybox-kit
  sky-descriptor

core-ui-kit
  ui-capability, projection

core-diagnostics-kit
  diagnostics, readback

core-composition-kit
  composition-metadata, capability-graph
```

### Official NexusEngine-Kits: 5

```txt
seed-kit
  deterministic-seed, random-streams

procedural-creature-body-kit
  descriptor, geometry, skeleton, skinning, collision, legacy-pose, snapshot

instanced-render-batch-kit
  cell-replace-release, flush, overflow, bounds, stats

seeded-world-patch-controller-kit
  focus, membership, queue, cache, generation, delivery, eviction, snapshot, reset

camera-smooth-follow-kit
  damping, reset, teleport-handling, snapshot
```

### Product, page and Worker kits: 14

```txt
prehistoric-rush-domain-kit
  run-resources, input, movement-proposals, motion-intent-frame, observation-registration,
  events, transitions, player-articulation-api, snapshot

prehistoric-rush-resolution-policy
  collision/pickup/goal precedence, state-patch, events, transition

player-articulation-adapter-kit
  skeleton-to-rig, legacy-pose-to-articulated-pose, quaternion-conversion

player-character-schema-kit
  defaults, normalization, clamps, merge

player-character-profile-store-kit
  load, save, patch, reset, revision, storage-sync

menu-page-kit
  menu-shell, profile-projection, routes

character-creator-page-kit
  controls, draft, persistence, legacy-preview-pose, RAF

character-preview-transition-kit
  morph, crossfade, legacy-pose-damping, revision, disposal

three-procedural-creature-adapter-kit
  skinned-mesh, materials, bone-lookup, position-array/object-coercion,
  Euler-application, quaternion-application, damped-quaternion-slerp, disposal

game-page-entry-kit
  module-preflight, failure-projection, game-import

drunk-route-generator
  samples, nearest, progress, classification, snapshot

player-raptor-preset-kit
  creature-recipe, collision-capsule

prehistoric-patch-generator
  terrain, trees, grass, shards, colliders, bounds, transferables

prehistoric-patch-worker
  initialization, generation, request/error protocol, transfer
```

### External and host adapter boundaries: 9

```txt
three-runtime-module
  scene, geometry, materials, instancing, camera, lighting, render

rapier-physics-domain-kit
  Nexus provider bridge

rapier-runtime-module
  bodies, colliders, queries, world-step

message-worker-executor-adapter-kit
  request-correlation, async-generation, pending rejection, listener removal, Worker termination

active-content-consumer-adapter
  terrain, trees, grass, shards, pickups, colliders, height

creator-viewport-framing-adapter
  bounds, target, distance

creator-persistence-scheduler
  timer-replacement, profile-commit

browser-input-adapter
  keyboard, buttons, keyup, blur, product-input-patch, restart activation

creature-camera-render-host-adapters
  pose-application, collision-sample, pickup-scan, camera, HUD, readback
```

### Proof kits: 2

```txt
prehistoric-rush-resolution-policy-test-kit
  continue, win, collision, precedence, pickup-idempotency, fallback, serialization

player-articulation-test-kit
  rig-chain-adaptation, Euler/quaternion-conversion, cloneability
```

## Required parent domain

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

Required transaction:

```txt
admit restart source and expected current run
  -> allocate resetTransactionId and nextRunGeneration
  -> freeze new browser commands
  -> prepare product, simulation, motion, physics and articulation participants
  -> cancel or generation-fence Worker and patch-controller work
  -> prepare active-content, camera, renderer and public-host projections
  -> validate all participant prepare results
  -> atomically commit every participant or roll all participants back
  -> publish one RunResetResult with participant revisions
  -> reopen command admission for the new run
  -> render the committed state
  -> acknowledge the first visible new-run frame
```

Required invariants:

```txt
Enter cannot restart an active run unless policy explicitly admits it
one reset transaction creates exactly one new run generation
all participant results cite the same reset transaction and run generation
predecessor input, motion, physics, articulation and Worker results are rejected
patch-controller active/cache/inflight preservation follows explicit policy
public readback cannot combine participant generations
no frame is acknowledged until the reset commit is complete
failed participant preparation produces zero partial commit
runtime disposal remains a separate terminal transaction
```

## Candidate coordinating kits

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
run-restart-command-kit
run-restart-admission-kit
run-generation-kit
reset-transaction-id-kit
reset-participant-registry-kit
reset-prepare-result-kit
reset-commit-result-kit
reset-rollback-kit
stale-run-command-rejection-kit
core-simulation-reset-participant-kit
core-motion-reset-participant-kit
core-physics-reset-participant-kit
articulated-motion-reset-participant-kit
articulated-dynamics-reset-participant-kit
patch-controller-reset-participant-kit
active-content-reset-participant-kit
worker-generation-barrier-kit
camera-reset-participant-kit
renderer-reset-participant-kit
input-reset-participant-kit
public-host-reset-receipt-kit
first-visible-run-frame-ack-kit
run-reset-observation-kit
run-reset-journal-kit
mid-run-enter-restart-fixture-kit
stale-worker-after-reset-fixture-kit
browser-pages-reset-parity-smoke-kit
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T16-11-48-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T16-11-48-04-00.md
.agent/architecture-audit/2026-07-12T16-11-48-04-00-coordinated-run-reset-dsk-map.md
.agent/render-audit/2026-07-12T16-11-48-04-00-mixed-generation-first-run-frame-gap.md
.agent/gameplay-audit/2026-07-12T16-11-48-04-00-mid-run-enter-restart-loop.md
.agent/interaction-audit/2026-07-12T16-11-48-04-00-restart-command-prepare-commit-result-map.md
.agent/reset-lifecycle-audit/2026-07-12T16-11-48-04-00-run-generation-participant-barrier-contract.md
.agent/deploy-audit/2026-07-12T16-11-48-04-00-coordinated-reset-fixture-gate.md
```

## Validation boundary

```txt
runtime source changed: no
gameplay behavior changed: no
motion/physics/articulation behavior changed: no
streaming or Worker behavior changed: no
render behavior changed: no
dependencies or package scripts changed: no
deployment changed: no
branch created: no
pull request created: no

npm test: not run
coordinated-reset fixtures: unavailable
browser reset smoke: not run
Pages reset smoke: not run
```

No coordinated reset, stale-work rejection, public-readback coherence or first-visible-new-run-frame claim is made.
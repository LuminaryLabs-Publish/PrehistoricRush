# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-12T12-08-05-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `68c821a4864b6ad0edc12bc51514752e4ada750c`  
**Repo-local documentation reviewed through:** `6d5f52b7c697ad37678ba02345057d600a752c86`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

PrehistoricRush recently moved from root-only Core Motion and Core Physics kits to the composed Core Motion and Core Physics domains. The game now records motion intents and motion frames, registers an articulated raptor rig, exposes articulated solving, and publishes articulated-motion and articulated-dynamics snapshots.

The visible raptor still uses the legacy procedural pose path. Gameplay derives a pose directly from run state and applies it to the Three.js skeleton. The creator installs only the seed and procedural-creature kits and also generates its pose directly from the creature API. The composed motion and articulation domains are therefore installed and observable, but they do not own either visible raptor.

## Plan ledger

**Goal:** make run-state movement, Core Motion, Core Physics, articulated solving, creator preview and the first visible raptor frame cite one explicit motion/presentation revision.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger entries and root `.agent` state.
- [x] Select only `PrehistoricRush` because the articulated motion/physics runtime cutover and repo-local audit landed after its central audit.
- [x] Trace profile/creator startup, game composition, run integration, motion intent/frame commit, physics request submission, rig registration, articulated solving, legacy pose creation and Three.js bone application.
- [x] Identify the complete interaction loop.
- [x] Identify all active domains.
- [x] Inventory all 45 implemented, adapted and proof kit surfaces and their services.
- [x] Define the missing motion/presentation parity authority and fixture boundary.
- [x] Add a fresh tracker, turn-ledger entry and architecture/render/gameplay/interaction/motion/deploy audit family.
- [x] Refresh every required root `.agent` file and the machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime articulated-pose consumption and executable browser proof remain future work.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

HorrorCorridor      central 2026-07-12T09-48-15-04-00
ZombieOrchard       central 2026-07-12T10-09-07-04-00
MyCozyIsland        central 2026-07-12T10-20-02-04-00
TheUnmappedHouse    central 2026-07-12T10-30-00-04-00
AetherVale          central 2026-07-12T10-48-19-04-00
TheOpenAbove        central 2026-07-12T11-15-16-04-00
PrehistoricRush     central 2026-07-12T11-21-01-04-00; newer runtime and local motion audit
IntoTheMeadow       central 2026-07-12T11-29-40-04-00
PhantomCommand      central 2026-07-12T11-48-43-04-00
TheCavalryOfRome    excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
menu/profile
  -> load normalized persisted creature profile
  -> route to creator or game

creator
  -> import pinned Nexus Engine, seed, procedural-creature and Three modules
  -> install seed-kit and procedural-creature-body-kit only
  -> build procedural descriptor and legacy creature pose
  -> damp/morph the Three.js mesh
  -> render creator frame

game boot
  -> preflight pinned Nexus Engine, Kits, ProtoKits, Three and Rapier modules
  -> compose Core Physics plus articulated dynamics
  -> compose Core Motion plus articulated motion
  -> register the player articulated rig
  -> install Rapier provider and player body
  -> create patch controller, camera and Three renderer
  -> start the run and prime the center patch

game tick
  -> patch browser input into product input state
  -> integrate product run state
  -> construct one kinematic motion request
  -> submit a Core Motion intent
  -> commit a Core Motion frame containing that request
  -> submit the same request independently to Core Physics
  -> resolve pickups, collision, goal and terminal outcome

game render
  -> derive a legacy procedural pose again from run state
  -> apply that pose directly to Three.js bones
  -> do not call solvePlayerArticulatedPose()
  -> do not consume the articulated-motion current frame
  -> do not acknowledge the Core Motion frame or pose revision
```

## Main finding

```txt
product run state: present
Core Motion intent: present
Core Motion frame: present
Core Physics request: present
articulated rig registration: present
articulated solver API: present
articulated-motion snapshot: present
articulated-dynamics snapshot: present

articulated solve in gameplay render: absent
articulated solve in creator render: absent
renderer consumption of Core Motion frame: absent
physics request reference to Core Motion frame: absent
creator/game pose-policy parity: absent
legacy fallback policy result: absent
first visible pose-frame acknowledgement: absent
```

`solvePlayerArticulatedPose()` exists and adapter tests cover rig/pose conversion, but no production call site uses the solver. Gameplay calls `game.createPlayerPose(...)`; the creator preview calls the procedural creature API directly.

The product therefore advances four related representations without one authority:

```txt
product run state
Core Motion intent and frame history
Core Physics body/request state
legacy procedural visual pose
```

A diagnostic snapshot can show Core Motion and articulation installed while the visible mesh remains entirely driven by the legacy pose path.

## Domains in use

```txt
routes, profile storage and character creator
runtime source identity, import map, module preflight and failure projection
Core Input, Spatial, Scene and Simulation
Core Physics and articulated-dynamics subdomain
Core Motion and articulated-motion subdomain
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batches, patch controller and camera follow
product run, route, surface, score, outcome policy, player creature and player articulation
Rapier provider, bodies, colliders, motion requests and contact frames
Worker/fallback generation, patch scheduling and active-content materialization
Three.js mesh, skeleton, pose application, camera, lighting, rendering and HUD
public host and committed simulation/physics/motion/stream/camera readback
Node proof, static Pages deployment and audit tracking
motion/articulation/presentation parity authority: missing
```

## Implemented kits and offered services

### Nexus Engine core/domain kits: 15

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms, spatial queries
core-scene-kit: scene registry, transitions, host descriptor
core-physics-kit: provider, bodies, colliders, motion requests, step, frame
articulated-dynamics-domain-kit: physical articulations, joints, motors, ragdoll state, frames, snapshot, reset
core-simulation-kit: TickContext, proposals, observations, resolution, atomic state/event/transition commit
core-motion-kit: movement modes, intents, trajectories, motion frames, snapshots, reset
articulated-motion-domain-kit: rigs, poses, IK targets, pose resolution, articulated frames, snapshots, reset
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
procedural-creature-body-kit: descriptor, geometry, skeleton, skinning, collision and legacy pose
instanced-render-batch-kit: cell replace/release, flush, bounds and statistics
seeded-world-patch-controller-kit: focus, membership, queue, cache, generation and delivery
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product/page/Worker kits: 14

```txt
prehistoric-rush-domain-kit
prehistoric-rush-resolution-policy
player-articulation-adapter-kit
player-character-schema-kit
player-character-profile-store-kit
menu-page-kit
character-creator-page-kit
character-preview-transition-kit
three-procedural-creature-adapter-kit
game-page-entry-kit
drunk-route-generator
player-raptor-preset-kit
prehistoric-patch-generator
prehistoric-patch-worker
```

These provide run state, route/surface classification, outcome arbitration, rig/pose adaptation, profile normalization and persistence, creator controls, preview morph/crossfade, Three mesh/bone application, module admission, deterministic patch generation and Worker transfer.

### External/host adapter boundaries: 9

```txt
Three runtime module
Rapier physics domain kit
Rapier runtime module
message Worker executor
active-content materializer
creator viewport framing
creator persistence scheduler
browser input adapter
creature/camera/render/HUD/public-host adapters
```

### Proof kits: 2

```txt
prehistoric-rush-resolution-policy test kit
player-articulation adapter test kit
```

## Required parent domain

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
```

Required transaction:

```txt
admit run and actor generation
  -> commit one motion intent sequence
  -> commit one Core Motion frame and request identity
  -> require Core Physics request to cite the motion frame
  -> resolve one articulated pose or return an explicit fallback result
  -> reject stale rig/profile/run generations
  -> select one pose source through declared policy
  -> apply one pose revision to the Three.js skeleton
  -> publish renderer bone-application receipt
  -> acknowledge the first visible frame with run, motion, physics, pose and render revisions
```

## Required invariants

```txt
one tick commits one authoritative motion source revision
Core Physics requests cite the Core Motion frame that authorized them
articulated solving commits a typed result or is explicitly disabled
renderer consumes one selected pose result, never an ambient alternate path
creator and game declare comparable motion/pose profiles
legacy pose fallback is explicit and observable
stale articulated results cannot mutate a newer mesh/profile/run generation
first visible raptor frame cites run, motion, physics, pose and renderer revisions
public readback cannot imply articulated presentation when no solve result was consumed
```

## Output

```txt
.agent/trackers/2026-07-12T12-08-05-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T12-08-05-04-00.md
.agent/architecture-audit/2026-07-12T12-08-05-04-00-motion-presentation-parity-dsk-map.md
.agent/render-audit/2026-07-12T12-08-05-04-00-legacy-pose-motion-frame-visible-gap.md
.agent/gameplay-audit/2026-07-12T12-08-05-04-00-motion-physics-articulation-pose-loop.md
.agent/interaction-audit/2026-07-12T12-08-05-04-00-motion-intent-articulation-result-map.md
.agent/motion-system-audit/2026-07-12T12-08-05-04-00-core-motion-articulation-render-contract.md
.agent/deploy-audit/2026-07-12T12-08-05-04-00-motion-presentation-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, dependencies, tests, rendering and deployment are unchanged by this pass. Existing articulation tests were reviewed but not executed. They prove adapter conversion and cloning, not end-to-end Core Motion to articulated solve to Core Physics to visible-frame parity.
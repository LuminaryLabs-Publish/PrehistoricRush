# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-12T12-01-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `68c821a4864b6ad0edc12bc51514752e4ada750c`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

PrehistoricRush recently replaced the root-only Core Motion and Core Physics installations with the composed Core Motion and Core Physics domains. It now records movement intent and motion frames, registers an articulated raptor rig, exposes articulated solving, and includes articulated motion and dynamics snapshots.

The game renderer still applies a legacy procedural pose produced directly from run state, while the creator preview installs only the seed and procedural-creature kits and also creates its pose directly from the creature API. The newly composed motion and articulation domains are therefore observable but are not authoritative for either visible raptor.

## Plan ledger

**Goal:** make simulation movement, physical motion, articulated solving, creator preview and the first visible raptor frame cite one explicit motion/presentation revision.

- [x] Compare all ten accessible Publish repositories against central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledgers and root `.agent` state.
- [x] Select only `PrehistoricRush` because new Core Motion/Core Physics domain work landed after its central audit.
- [x] Review the runtime repin and the final Core Motion compatibility fix.
- [x] Trace input, run-state integration, Core Motion intent/frame commit, Core Physics request submission, rig registration, articulated solving, creator preview and Three.js bone application.
- [x] Identify the complete interaction loop, all active domains, all 45 implemented/adapted/proof kit surfaces and their services.
- [x] Define a motion/presentation parity authority and executable fixture boundary.
- [x] Add a fresh tracker, turn-ledger entry and architecture/system audit family.
- [x] Refresh every required root `.agent` file and the machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime consumption of articulated results and browser proof remain future work.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
recent undocumented runtime cutover: PrehistoricRush
selected repository: LuminaryLabs-Publish/PrehistoricRush
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Current interaction loop

```txt
menu/profile
  -> load saved creature profile
  -> route to creator or game

creator
  -> install seed-kit and procedural-creature-body-kit only
  -> create procedural descriptor and legacy creature pose
  -> damp/morph Three.js mesh
  -> render creator frame

game boot
  -> import pinned Nexus Engine, Kits, ProtoKits, Three and Rapier
  -> compose Core Physics + articulated dynamics
  -> compose Core Motion + articulated motion
  -> register player articulated rig
  -> install Rapier provider and player body
  -> start run and stream center patch

game tick
  -> patch browser input into product input
  -> integrate product run state
  -> submit Core Motion intent
  -> commit Core Motion frame containing one kinematic request
  -> submit the same raw request independently to Core Physics
  -> resolve simulation outcome

game render
  -> derive pose again from run state through procedural-creature-body-kit
  -> apply legacy pose directly to Three.js bones
  -> do not call solvePlayerArticulatedPose()
  -> do not consume articulated-motion current frame
  -> do not acknowledge Core Motion frame identity
```

## Main finding

```txt
run-state movement result: present
Core Motion intent: present
Core Motion frame: present
Core Physics request: present
articulated rig: present
articulated solver API: present
articulated dynamics domain: present

articulated solve in gameplay frame: absent
articulated solve in creator frame: absent
renderer consumption of motion frame: absent
physics request -> motion frame reference: absent
creator/game pose-policy parity: absent
visible pose-frame acknowledgement: absent
```

`solvePlayerArticulatedPose()` is implemented and tested only at the adapter level, but no current call site uses it. The game renderer calls `game.createPlayerPose(...)`; the creator preview calls `creatureApi.createPose(...)`.

This creates four independently advancing representations:

```txt
product run state
Core Motion intent/frame history
Core Physics body/request state
legacy procedural visual pose
```

The articulated-motion and articulated-dynamics snapshots can remain empty or stale while the raptor visibly animates. A debug observer can therefore see Core Motion installed and assume articulation is driving presentation when the visible mesh still follows the legacy path.

## Domains in use

```txt
routes, profile storage and character creator
runtime source identity, import maps, module preflight and failure projection
Core Input, Spatial, Scene and Simulation
Core Physics plus articulated-dynamics subdomain
Core Motion plus articulated-motion subdomain
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batches, world patch control and camera follow
product run, route, surface, score, outcome policy, player creature and player articulation
Rapier provider, body, collider, motion request and contact frame
Worker/fallback generation, patch scheduling and active-content materialization
Three.js mesh, skeleton, pose application, camera, lighting, render and HUD
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
instanced-render-batch-kit: replace/release cells, flush, bounds and statistics
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

These offer run state, route/surface classification, outcome arbitration, rig/pose adaptation, profile normalization and persistence, creator controls, preview morph/crossfade, Three mesh/bone application, module admission, deterministic patch generation and Worker transfer.

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
prehistoric-rush-resolution-policy test
player-articulation adapter test
```

## Required parent domain

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
```

It coordinates motion source identity, intent sequencing, Core Motion frame provenance, physics request linkage, articulated rig adoption, target/solve results, legacy fallback policy, creator/game pose profiles, renderer bone-application receipts, stale-result rejection and first-visible-frame acknowledgement.

## Required invariants

```txt
one gameplay tick commits one authoritative motion source revision
Core Physics requests cite the Core Motion frame that authorized them
articulated solving either commits a typed result or is explicitly disabled by policy
the renderer consumes one selected pose result, never an ambient alternate path
creator and game declare comparable motion/pose profiles
legacy pose fallback is explicit and observable
stale articulated results cannot mutate a newer mesh/profile/run generation
the first visible raptor frame cites run, motion, pose and renderer revisions
public readback cannot imply articulated presentation when no solve result was consumed
```

## Output

```txt
.agent/trackers/2026-07-12T12-01-04-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T12-01-04-04-00.md
.agent/architecture-audit/2026-07-12T12-01-04-04-00-motion-presentation-parity-dsk-map.md
.agent/render-audit/2026-07-12T12-01-04-04-00-legacy-pose-articulated-frame-gap.md
.agent/gameplay-audit/2026-07-12T12-01-04-04-00-run-motion-physics-pose-loop.md
.agent/interaction-audit/2026-07-12T12-01-04-04-00-motion-intent-pose-frame-result-map.md
.agent/motion-system-audit/2026-07-12T12-01-04-04-00-core-motion-articulation-consumption-contract.md
.agent/deploy-audit/2026-07-12T12-01-04-04-00-motion-presentation-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, dependencies, tests, rendering and deployment are unchanged by this pass. Existing tests were reviewed but not executed. The articulation test proves rig/pose conversion and structured cloning, not end-to-end Core Motion, articulated solving, physics linkage or visible-frame parity.
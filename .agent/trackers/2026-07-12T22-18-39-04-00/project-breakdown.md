# Project Breakdown: PrehistoricRush Articulated Pose Presentation Authority

**Timestamp:** `2026-07-12T22-18-39-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `articulated-pose-presentation-authority-audited`

## Summary

PrehistoricRush installs Core Motion, Core Physics, articulated motion, articulated dynamics, a procedural creature rig, Rapier, patch streaming, and Three.js presentation. The active player renderer does not consume the committed motion or articulated solve surfaces. It creates a new legacy procedural pose directly from mutable game state and applies that pose to the Three.js skeleton, leaving the installed articulation authority outside the visible frame.

## Plan ledger

**Goal:** require one run and tick scoped pose result to connect simulation motion, articulated solving, optional physical articulation, skeleton application, and the first visible player frame.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Select only `PrehistoricRush` because its repo-local audit state was newer than central tracking.
- [x] Trace startup, simulation, motion submission, rig registration, pose creation, articulated solve capability, Three.js skeleton application, rendering, and public readback.
- [x] Identify the complete interaction loop and domains in use.
- [x] Preserve all 45 implemented, adapted, and proof surfaces with their offered services.
- [x] Define the missing articulated pose presentation authority and fixture boundary.
- [x] Add timestamped architecture, render, gameplay, interaction, articulation, and deploy audits.
- [x] Refresh the required root `.agent` documents and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime integration and executable pose parity fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
repo-local-newer-than-central: PrehistoricRush
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
game.html
  -> pinned-module preflight
  -> import src/game.js

startup
  -> load player profile
  -> import Nexus Engine, official kits, Three.js, Rapier, and Rapier ProtoKit
  -> install Core Motion, Core Physics, articulated motion, articulated dynamics, and product kits
  -> create or register procedural creature body and articulated rig
  -> create Rapier player body, patch controller, Worker executor, camera follower, Three adapter
  -> create Three.js SkinnedMesh from the procedural creature descriptor
  -> start run, prime streaming, reset camera, attach browser input, start RAF

simulation tick
  -> derive RunState successor from input
  -> derive desired linear velocity and facing
  -> submit Core Motion intent
  -> commit a Core Motion frame
  -> submit kinematic motion request to Core Physics
  -> submit run, pickup, and goal proposals
  -> resolve and commit authoritative game state

visible pose path
  -> read committed RunState after engine.tick
  -> derive speed, time, turn, jump, and resistance scalars
  -> call proceduralCreatureBody.createPose through game.createPlayerPose
  -> apply returned legacy bone transforms directly to Three.js bones
  -> render scene

installed but disconnected path
  -> articulated rig is registered
  -> solvePlayerArticulatedPose can adapt the legacy pose and call articulatedMotion.solve
  -> articulated motion and articulated dynamics snapshots are exposed
  -> active game renderer never requests or admits that solve result
```

## Domains in use

```txt
page shell and pinned module admission
player-profile boot binding
Nexus Engine composition and tick scheduling
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, UI, Diagnostics, Composition
articulated motion and articulated dynamics
Rapier provider, player body, colliders, motion requests, and frames
procedural creature descriptor, geometry, skeleton, skinning, legacy pose, rig adaptation, and pose solving
seeded patch generation, Worker execution, queue, cache, activation, release, terrain, vegetation, pickups, and colliders
browser input, run lifecycle, movement, jump, route, surface, scoring, failure, and win
Three.js skeleton application, camera, lighting, shadows, meshes, instancing, HUD, and public readback
pose source selection, pose admission, bone coverage, fallback, render correlation, and first visible frame proof
validation, browser fixtures, build, and Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 15

| Kit | Offered services |
|---|---|
| `core-input-kit` | actions; bindings; input state |
| `core-spatial-kit` | transforms; spatial queries |
| `core-scene-kit` | scene registry; transitions; host descriptor |
| `core-physics-kit` | provider; bodies; colliders; motion requests; step; frame |
| `articulated-dynamics-domain-kit` | articulations; joints; motors; ragdoll state; frames; snapshot; reset |
| `core-simulation-kit` | tick context; proposals; observations; resolution; commit; frame |
| `core-motion-kit` | movement modes; intents; trajectories; motion frames; validation; snapshot; reset |
| `articulated-motion-domain-kit` | rigs; poses; targets; IK; resolution; frames; snapshot; reset |
| `core-camera-kit` | camera capability |
| `core-animation-kit` | animation capability |
| `core-graphics-kit` | graphics and frame capability |
| `core-skybox-kit` | sky descriptor |
| `core-ui-kit` | UI capability and projection |
| `core-diagnostics-kit` | diagnostics and readback |
| `core-composition-kit` | composition metadata and capability graph |

### Official NexusEngine-Kits: 5

| Kit | Offered services |
|---|---|
| `seed-kit` | deterministic seed and random streams |
| `procedural-creature-body-kit` | descriptor; geometry; skeleton; skinning; collision; legacy pose; snapshot |
| `instanced-render-batch-kit` | cell replace/release; flush; overflow; bounds; stats |
| `seeded-world-patch-controller-kit` | focus; membership; queue; cache; generation; delivery; eviction; snapshot; reset |
| `camera-smooth-follow-kit` | damping; reset; teleport handling; snapshot |

### Product, page, and Worker kits: 14

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | run resources; input; movement proposals; motion frames; observations; events; transitions; snapshots |
| `prehistoric-rush-resolution-policy` | collision; pickup and goal precedence; state patch; events; transitions |
| `player-articulation-adapter-kit` | skeleton-to-rig conversion; legacy-pose conversion; quaternion normalization |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; browser distribution |
| `menu-page-kit` | shell; profile projection; routes; profile subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; subscription; preview; RAF; navigation |
| `character-preview-transition-kit` | morph; crossfade; pose damping; revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh; bone lookup; pose application; damping; topology checks; disposal |
| `game-page-entry-kit` | module preflight; failure projection; import; profile boot binding |
| `drunk-route-generator` | samples; nearest point; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature recipe and collision capsule |
| `prehistoric-patch-generator` | terrain; trees; grass; shards; colliders; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; error protocol; transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; skeleton; camera; lighting; rendering |
| `rapier-physics-domain-kit` | Nexus physics provider bridge |
| `rapier-runtime-module` | bodies; colliders; queries; world step |
| `message-worker-executor-adapter-kit` | request correlation; pending rejection; listener removal; Worker termination |
| `active-content-consumer-adapter` | terrain; trees; grass; shards; pickups; colliders; height |
| `creator-viewport-framing-adapter` | bounds; target; distance |
| `creator-persistence-scheduler` | timer replacement and delayed profile commit |
| `browser-input-adapter` | keyboard; buttons; keyup; blur; input patch; restart activation |
| `creature-camera-render-host-adapters` | pose; collision; pickups; camera; HUD; profile; frame readback |

### Proof kits: 2

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue; win; collision; precedence; pickup idempotency; fallback; serialization |
| `player-articulation-test-kit` | rig adaptation; Euler/quaternion conversion; cloneability |

## Source-backed findings

### Core Motion is committed but not used as the pose source

The simulation submits a desired motion intent and commits a Core Motion frame for the player. The visible renderer later derives a fresh pose from `RunState` scalars instead of consuming a motion-frame or pose-frame result.

### The articulated rig is registered but the active renderer bypasses the solve API

The product kit registers a rig and exposes `solvePlayerArticulatedPose()`, which converts the legacy pose and calls `articulatedMotion.solve()`. The game renderer calls `game.createPlayerPose()` instead. The solve result has no admission point in the visible frame.

### Articulated dynamics is installed but has no visible provenance

The domain requires articulated dynamics and includes its snapshot in product readback. The active player render path does not cite a dynamics frame, target set, solver result, or fallback reason.

### Bone application has no tick, run, rig, or pose revision

`applyCreaturePose()` iterates whichever `pose.bones` object it receives and mutates Three.js bones directly. It silently skips unknown bones and publishes no missing-bone result, applied-bone count, pose fingerprint, or first visible pose acknowledgement.

### Public readback cannot prove the pose shown

`PrehistoricRushHost.getState()` exposes simulation, motion, articulated motion, articulated dynamics, physics, camera, and profile observations independently. It does not expose one committed pose presentation result linking those observations to the skeleton rendered in the current frame.

## Required parent domain

```txt
prehistoric-rush-articulated-pose-presentation-authority-domain
```

## Candidate coordinating kits

```txt
player-pose-command-id-kit
player-pose-frame-id-kit
player-pose-source-policy-kit
player-pose-run-tick-admission-kit
player-rig-revision-kit
player-base-pose-adapter-kit
player-motion-frame-binding-kit
player-articulated-target-set-kit
player-articulated-solve-kit
player-dynamics-observation-kit
player-pose-bone-coverage-kit
player-pose-fallback-policy-kit
player-pose-candidate-fingerprint-kit
player-pose-commit-result-kit
player-pose-application-plan-kit
three-skeleton-pose-application-result-kit
player-pose-presentation-journal-kit
first-articulated-pose-frame-ack-kit
legacy-vs-articulated-parity-fixture-kit
missing-bone-fixture-kit
stale-pose-frame-fixture-kit
solver-failure-fallback-fixture-kit
run-restart-pose-generation-fixture-kit
pages-articulated-pose-smoke-kit
```

## Required transaction

```txt
PlayerPoseFrameCommand
  -> validate runtime session, run generation, tick, player body, rig revision, and profile revision
  -> bind the committed RunState, Core Motion frame, Physics frame, and optional dynamics observation
  -> construct one immutable base pose and target set
  -> execute articulated solve under an explicit source policy
  -> validate bone coverage, finite transforms, rig identity, and candidate fingerprint
  -> choose articulated result or a typed fallback result
  -> commit one PlayerPoseCommitResult
  -> apply the admitted pose to the Three.js skeleton
  -> publish applied and skipped bone receipts
  -> render the scene
  -> acknowledge the first visible frame citing the pose commit
```

## Required invariants

```txt
one visible player frame cites one admitted pose commit
pose run generation and tick cannot regress
rig, profile, body, and skeleton identities agree
Core Motion and optional dynamics inputs are recorded or explicitly omitted
articulated solve failure cannot silently fall through
unknown or missing bones produce a typed coverage result
legacy fallback is explicit and revisioned
public readback returns the pose commit shown by the renderer
first visible frame cites the applied pose fingerprint
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T22-18-39-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T22-18-39-04-00.md
.agent/architecture-audit/2026-07-12T22-18-39-04-00-articulated-pose-presentation-dsk-map.md
.agent/render-audit/2026-07-12T22-18-39-04-00-legacy-pose-articulated-frame-gap.md
.agent/gameplay-audit/2026-07-12T22-18-39-04-00-simulation-motion-render-pose-divergence-loop.md
.agent/interaction-audit/2026-07-12T22-18-39-04-00-motion-pose-solve-apply-frame-map.md
.agent/articulation-audit/2026-07-12T22-18-39-04-00-rig-solve-render-admission-contract.md
.agent/deploy-audit/2026-07-12T22-18-39-04-00-articulated-pose-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, simulation, motion, physics, articulation, rendering, package, dependency, and deployment behavior are unchanged. No browser or Pages pose parity fixture was run.
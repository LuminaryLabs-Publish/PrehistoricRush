# Project Breakdown: PrehistoricRush Terrain-Aware Hind-Leg IK

**Timestamp:** `2026-07-13T08-39-12-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `666ab306b94c9fefcd8bb4230b61854f121dab86`  
**Status:** `terrain-aware-hind-leg-ik-central-reconciled`  
**Technical status:** `terrain-aware-hind-leg-ik-implemented-static-proof`

## Summary

PrehistoricRush now generates terrain-aware targets for both dinosaur hind legs, evaluates the animated source pose through articulated forward kinematics, feeds the targets into the authoritative articulated solve, publishes the resulting `PlayerPose`, pins the Nexus Engine revision containing the current-pose IK solver and includes static target/path coverage in `npm test`.

The remaining boundary is terrain-sample and target-frame coherence. The simulation samples terrain before the browser host updates patch streaming, while rendering occurs after patch activation/release. A foot target can therefore be solved from the prior active-patch set or fallback height and then displayed over a newly activated terrain patch in the same browser frame. Target metadata records coordinates and height, but not patch ID, terrain revision, sampler generation, fallback classification, target-frame revision or a matching visible terrain/skeleton acknowledgement.

## Plan ledger

**Goal:** preserve the implemented terrain IK while defining one revisioned evidence chain from committed terrain data through foot-target generation, articulated solve and the first visible terrain/skeleton frame.

- [x] Enumerate all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories retain central-ledger and root `.agent` coverage.
- [x] Detect five PrehistoricRush source/test commits after the centrally reviewed runtime revision.
- [x] Select and modify only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Inspect target generation, FK evaluation, authoritative solve, height sampling, patch activation order, renderer consumption and tests.
- [x] Identify the complete interaction loop, all domains, all kits and offered services.
- [x] Add the timestamped tracker, turn ledger and architecture/render/gameplay/interaction/terrain-IK/deploy/central-sync audit family.
- [x] Refresh every required root `.agent` file and machine registry.
- [x] Push directly to `main`; create no branch or pull request.
- [ ] Runtime terrain-revision admission and executable browser coherence fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
central ledger entries: 9
root .agent entrypoints: 9
new or ledger-missing repositories: 0
root-agent-missing repositories: 0

IntoTheMeadow      central/root aligned
HorrorCorridor     central/root aligned
AetherVale         central/root aligned
ZombieOrchard      central/root aligned
TheUnmappedHouse   central/root aligned
MyCozyIsland       central/root aligned through resource-settlement audit
TheOpenAbove       central/root aligned
PhantomCommand     central/root aligned
PrehistoricRush    reviewed runtime 3d448c4
                   current runtime 666ab30 selected
TheCavalryOfRome   excluded
```

PrehistoricRush received five behavior/test commits after its recorded runtime revision:

```txt
b6fb43d feat: generate terrain-aware hind-leg targets
4a608a3 feat: drive dinosaur hind legs with terrain IK
b47875a chore: pin current-pose articulated runtime
bf28547 test: cover terrain hind-leg targets
666ab30 test: cover terrain IK authority path
```

## Complete interaction loop

```txt
boot
  -> load player profile and commit-pinned Nexus/kit/provider modules
  -> compose Core domains, official kits, PrehistoricRush, Rapier and Three.js
  -> create procedural body and articulated rig
  -> initialize RunState, InputState and PlayerPose
  -> create Three.js terrain adapter and install sampleHeight()
  -> start the run and prime the center patch

active simulation
  -> browser input patches InputState
  -> RAF calls engine.tick(dt)
  -> run system advances route, surface, speed, jump and transform
  -> player root height is sampled
  -> Core Motion frame is committed
  -> procedural legacy pose is generated
  -> articulated FK evaluates current foot rig positions
  -> each hind foot samples terrain at its projected world X/Z
  -> weighted rig-space ground targets are generated
  -> articulated-motion solves base pose plus targets
  -> solved pose body replaces PlayerPose
  -> physics, pickup and goal resolution complete

streaming and presentation
  -> browser reads committed run state
  -> patch controller updates focus, releases patches and activates ready patches
  -> terrain meshes, colliders, trees, grass and pickups change
  -> renderer reads PlayerPose
  -> render-time damping mutates Three.js bones
  -> terrain and skeleton are rendered
  -> HUD publishes tick and patch statistics

boundary mismatch
  -> terrain samples used by IK come from activePatches before updateStreaming()
  -> rendering uses activePatches after updateStreaming()
  -> no common terrain revision proves both surfaces used the same ground
```

## Domains in use

```txt
browser page shell, pinned module admission and fatal projection
player-profile schema, persistence, distribution and boot binding
browser input, focus, resize and RAF lifecycle
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion rigs, FK evaluation, targets, two-bone IK, frames, snapshots and reset
articulated dynamics bodies, joints, motors, ragdoll state and frames
procedural creature descriptor, geometry, skeleton, skinning, legacy pose and collision
player articulation adaptation, terrain leg-target generation and authoritative PlayerPose publication
Rapier provider, bodies, colliders, motion requests, contacts and frames
seeded route and patch streaming with Worker/fallback generation
terrain patch identity, heights, normals, fallback height, activation, release and sampling
run lifecycle, movement, jump, surface, score, collision, failure and win
Three.js terrain, skeleton, pose damping, camera, lighting, shadows, instancing, HUD and public host
terrain-sample revision, target-frame identity, patch-stream coherence and visible terrain/skeleton proof
validation, build and GitHub Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 15

| Kit | Offered services |
|---|---|
| `core-input-kit` | actions; bindings; input state |
| `core-spatial-kit` | transforms; spatial queries |
| `core-scene-kit` | scene registry; transitions; host descriptor |
| `core-physics-kit` | provider; bodies; colliders; motion requests; step; contact frame |
| `articulated-dynamics-domain-kit` | articulations; joints; motors; ragdoll state; frames; snapshot; reset |
| `core-simulation-kit` | tick context; proposals; observations; resolution; commit; frame |
| `core-motion-kit` | movement modes; intents; trajectories; motion frames; validation; snapshot; reset |
| `articulated-motion-domain-kit` | rigs; FK pose evaluation; targets; two-bone IK; resolution; frames; snapshot; reset |
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
| `seeded-world-patch-controller-kit` | focus; membership; queue; cache; generation; delivery; activation; eviction; snapshot; reset |
| `camera-smooth-follow-kit` | damping; reset; teleport handling; snapshot |

### Product, page and Worker kits: 14

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | run; route; surface; score; outcome policy; player creature; articulation; PlayerPose; ground-leg IK; snapshots |
| `prehistoric-rush-resolution-policy` | physics/fallback collision precedence; pickups; goal; state patch; events; transitions |
| `player-articulation-adapter-kit` | skeleton-to-rig conversion; legacy-pose conversion; quaternion normalization; terrain hind-leg target generation |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; browser distribution |
| `menu-page-kit` | shell; profile projection; routes; profile subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; subscription; preview; RAF; navigation |
| `character-preview-transition-kit` | morph; crossfade; pose damping; revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh; bone lookup; exact/damped pose application; topology checks; disposal |
| `game-page-entry-kit` | module preflight; failure projection; import; profile boot binding |
| `drunk-route-generator` | samples; nearest point; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature recipe; skeleton; collision capsule |
| `prehistoric-patch-generator` | terrain heights/normals/colors; trees; grass; shards; colliders; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; error protocol; transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; skeleton; camera; lighting; rendering |
| `rapier-physics-domain-kit` | Nexus physics provider bridge |
| `rapier-runtime-module` | bodies; colliders; queries; world step; contacts |
| `message-worker-executor-adapter-kit` | request correlation; pending rejection; listener removal; Worker termination |
| `active-content-consumer-adapter` | patch activation/release; terrain mesh; trees; grass; shards; pickups; colliders; height sampling |
| `creator-viewport-framing-adapter` | bounds; target; distance |
| `creator-persistence-scheduler` | timer replacement; delayed profile commit |
| `browser-input-adapter` | keyboard; buttons; keyup; blur; input patch; restart activation |
| `creature-camera-render-host-adapters` | authoritative pose consumption; pose damping; streaming; collision fallback; camera; HUD; readback |

### Proof kits: 3

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue; win; collision precedence; pickup idempotency; serialization |
| `player-articulation-test-kit` | rig adaptation; quaternion conversion; deterministic flat/raised/swing/airborne terrain targets |
| `player-pose-authority-test-kit` | PlayerPose declaration/publication; FK marker; height-sampler gate; target-to-solve marker; runtime pin; renderer consumption; tick-before-render ordering |

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        3
total surfaces:                   46
```

## Source-backed findings

- `createPlayerGroundLegTargets()` projects evaluated foot X/Z into world space using run position, yaw and visual scale.
- It samples a scalar ground height, converts it back into rig-space Y and leaves target X/Z at the animated foot position.
- Target weight is proximity-based, capped by `groundIKMaximumWeight` and forced to zero while airborne.
- The product domain evaluates the base pose through generic FK before generating targets and passes those targets into the authoritative articulated solve.
- The domain now advertises `ground-leg-ik`, version `0.9.0` and `terrainGroundLegIK: true`.
- The browser height sampler reads the active patch when available and otherwise uses procedural fallback height.
- `engine.tick(dt)` and therefore terrain target generation run before `updateStreaming(state)` activates/releases patches.
- Rendering occurs after streaming changes, so target sampling and visible terrain do not cite one terrain revision.
- Target metadata contains world coordinates and sampled height, but no patch ID, terrain content hash, patch-controller revision, fallback/exact classification or sampler generation.
- The domain still stores only `articulatedFrame.pose`; target-frame identity is not retained in `PlayerPose` or public snapshots.
- Tests cover deterministic target math and static authority markers. They do not execute a real streamed-patch boundary, patch activation race, slope-normal alignment, foot planting or visible-frame correlation.

## Main finding

```txt
browser frame N
  -> engine.tick uses active patch set revision A
  -> each foot samples exact patch A or procedural fallback
  -> ground targets feed authoritative IK
  -> PlayerPose stores only solved pose
  -> updateStreaming releases/activates patches to revision B
  -> Three.js renders terrain revision B and damped skeleton
  -> no target/terrain/frame receipt proves A == B
```

The terrain IK implementation is valuable and correctly moves solve ownership into simulation. The next authority boundary is not another IK solver. It is a shared, revisioned terrain-sample and foot-target frame that prevents patch streaming, fallback sampling and visible terrain from silently diverging.

## Required parent domain

```txt
prehistoric-rush-terrain-foot-target-coherence-authority-domain
```

## Required transaction

```txt
TerrainFootTargetCommand
  -> bind runtime session, run generation, tick, rig revision and pose source revision
  -> bind committed patch-stream and terrain-sampler revisions
  -> evaluate the animated source pose through FK
  -> issue one terrain sample command per admitted hind foot
  -> return ExactPatch, Fallback, Missing, Stale or Failed sample results
  -> publish immutable TerrainFootTargetFrame with sample receipts
  -> feed only the accepted target frame into articulated solve
  -> publish PlayerPoseFrame citing target-frame and terrain revisions
  -> render terrain and skeleton from the same admitted terrain generation
  -> fence patch activation/release, restart and stale sampler callbacks
  -> acknowledge the first matching visible terrain/skeleton frame
```

## Validation

```txt
runtime source changed by this documentation pass: no
IK behavior changed by this documentation pass: no
rendering or streaming changed by this documentation pass: no
package scripts or dependencies changed: no
deployment changed: no
branch created: no
pull request created: no

source commits inspected: yes
new test source inspected: yes
npm test independently executed: no
browser patch-boundary fixture: unavailable
built-output and Pages terrain-IK smokes: not run
commit status checks on 666ab30: none reported
```

No claim is made for runtime test passage, patch-boundary coherence, planted-foot stability, slope-normal alignment, visible terrain/skeleton equivalence or deployed parity.
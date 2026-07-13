# Project Breakdown: PrehistoricRush Authoritative Player Pose Publication

**Timestamp:** `2026-07-13T06-39-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `3d448c4e26e8f68cb99de00564ac8dca42624a8d`  
**Status:** `authoritative-player-pose-publication-central-reconciled`  
**Technical status:** `authoritative-player-pose-implemented-static-proof`

## Summary

PrehistoricRush now owns the player’s articulated pose in simulation. The game domain declares `PlayerPose`, solves it during initialization, run start and each admitted game tick, exposes clone-safe readback, includes it in snapshots, and the Three.js renderer consumes that resource after `engine.tick(dt)` instead of generating legacy animation truth inside the render loop.

The remaining boundary is pose-frame provenance. The resource stores only `articulatedFrame.pose`, discarding the solve frame’s `tickId`, frame number and metadata. The renderer then applies independent render-time damping directly to Three.js bones, so the visible skeleton is a presentation-derived pose with no revision, reset generation, readback or first-visible-frame acknowledgement.

## Plan ledger

**Goal:** document the newly implemented simulation-owned player pose and define the remaining evidence chain from an admitted simulation tick through articulated solve, presentation damping and the first matching visible skeleton frame.

- [x] Enumerate all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Detect PrehistoricRush runtime and test changes newer than its central documentation head.
- [x] Select and modify only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Inspect the new `PlayerPose` resource, solve path, public readback, snapshot, renderer consumption and static test.
- [x] Identify the complete interaction loop, all domains, all kits and offered services.
- [x] Add the timestamped tracker, turn ledger and architecture/render/gameplay/interaction/pose/deploy/central-sync audit family.
- [x] Refresh every required root `.agent` file and machine registry.
- [x] Push directly to `main`; create no branch or pull request.
- [ ] Runtime pose-frame provenance, damping-reset and visible-frame fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

HorrorCorridor     central/root aligned 2026-07-13T03-38-31-04-00
ZombieOrchard      central/root aligned 2026-07-13T03-59-28-04-00
MyCozyIsland       central/root aligned 2026-07-13T04-21-10-04-00
TheUnmappedHouse   central/root aligned 2026-07-13T04-47-00-04-00
AetherVale         central/root aligned 2026-07-13T05-00-02-04-00
TheOpenAbove       central/root aligned 2026-07-13T05-19-21-04-00
IntoTheMeadow      central/root aligned 2026-07-13T05-40-11-04-00
PhantomCommand     central/root aligned 2026-07-13T05-59-03-04-00
PrehistoricRush    central 2026-07-13T03-20-58-04-00
                   runtime head 2026-07-13T06-35-29-04-00 selected
TheCavalryOfRome   excluded
```

PrehistoricRush received four source/test commits after the recorded documentation head: the domain gained authoritative pose ownership, the renderer adopted it, a static authority test was added, and `npm test` was extended to include that test.

## Complete interaction loop

```txt
boot
  -> load player profile and commit-pinned Nexus/kit/provider modules
  -> compose Core, official kits, product domain, Rapier and Three.js
  -> create procedural player body and articulated rig
  -> initialize RunState, InputState and PlayerPose
  -> solve initial articulated player pose
  -> create streamed world, renderer and camera
  -> start run and replace PlayerPose with the run-generation start pose

input and simulation
  -> browser input patches game InputState
  -> RAF calls engine.tick(dt)
  -> run system advances route, surface, speed, jump and candidate transform
  -> Core Motion frame is committed
  -> procedural creature legacy pose is generated from committed candidate state
  -> legacy pose is adapted into the articulated rig
  -> articulated-motion solve runs with tickId and frame
  -> solved pose body is cloned into PlayerPose
  -> Core Physics, pickup and goal proposals continue through resolution

presentation
  -> renderer reads committed run state after engine.tick(dt)
  -> renderer reads game.getPlayerPose()
  -> applyCreaturePoseDamped mutates Three.js bones using render dt
  -> camera, world and HUD are updated
  -> Three.js submits the visible frame
  -> public host exposes the simulation PlayerPose in game.snapshot()
  -> visible damped bone state and source pose-frame receipt are not exposed

restart
  -> run generation increments
  -> RunState, InputState and PlayerPose are replaced
  -> renderer continues damping from the existing Three.js bone state
  -> no pose-presentation generation or explicit snap/reset result exists
```

## Domains in use

```txt
browser page shell, pinned module admission and fatal projection
player-profile schema, persistence, distribution and boot binding
browser input, focus, resize and RAF lifecycle
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion rigs, poses, targets, IK solves, frames, snapshots and reset
articulated dynamics bodies, joints, motors, ragdoll state and frames
procedural creature descriptor, geometry, skeleton, skinning, legacy pose and collision
player articulation adaptation and quaternion normalization
simulation-owned PlayerPose resource, initialization, run-start replacement, tick solve, clone-safe API and snapshot
Rapier provider, bodies, colliders, requests, contacts and frames
seeded route, patch Worker, queue, cache, activation, release and fallback generation
terrain, trees, grass, shards, pickups, collider descriptors and height sampling
run lifecycle, movement, jump, surface, score, collision, failure and win
Three.js skeleton, render-time pose damping, camera, lighting, shadows, instancing, HUD and public host
pose-frame identity, source revision, presentation derivation, restart discontinuity and visible-frame proof
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

### Product, page and Worker kits: 14

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | run resources; input; movement proposals; motion frames; observations; events; transitions; authoritative PlayerPose initialization/solve/readback/snapshot |
| `prehistoric-rush-resolution-policy` | physics/fallback collision precedence; pickup and goal precedence; state patch; events; transitions |
| `player-articulation-adapter-kit` | skeleton-to-rig conversion; legacy-pose conversion; quaternion normalization |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; browser distribution |
| `menu-page-kit` | shell; profile projection; routes; profile subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; subscription; preview; RAF; navigation |
| `character-preview-transition-kit` | morph; crossfade; pose damping; revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh; bone lookup; exact pose application; damped authoritative-pose application; topology checks; disposal |
| `game-page-entry-kit` | module preflight; failure projection; import; profile boot binding |
| `drunk-route-generator` | samples; nearest point; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature recipe and collision capsule |
| `prehistoric-patch-generator` | terrain; trees; grass; shards; collider descriptors; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; error protocol; transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; skeleton; camera; lighting; rendering |
| `rapier-physics-domain-kit` | Nexus physics provider bridge |
| `rapier-runtime-module` | bodies; colliders; queries; world step; contacts |
| `message-worker-executor-adapter-kit` | request correlation; pending rejection; listener removal; Worker termination |
| `active-content-consumer-adapter` | terrain; trees; grass; shards; pickups; collider activation/release; height |
| `creator-viewport-framing-adapter` | bounds; target; distance |
| `creator-persistence-scheduler` | timer replacement and delayed profile commit |
| `browser-input-adapter` | keyboard; buttons; keyup; blur; input patch; restart activation |
| `creature-camera-render-host-adapters` | authoritative pose consumption; render-time pose damping; collision fallback; pickups; camera; HUD; profile; frame readback |

### Proof kits: 3

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue; win; physics collision; precedence; pickup idempotency; fallback collision; serialization |
| `player-articulation-test-kit` | rig adaptation; Euler/quaternion conversion; cloneability |
| `player-pose-authority-test-kit` | PlayerPose declaration; tick commit marker; clone-safe API marker; snapshot marker; renderer consumption marker; render-loop legacy-pose exclusion; tick-before-render ordering |

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        3
total surfaces:                   46
```

## Source-backed findings

- `PlayerPose` is now a game-domain resource and the domain advertises a `player-pose` service.
- Initial boot, every run start and each active game tick replace the resource with a cloned articulated pose.
- Pose inputs derive from simulation candidate speed, elapsed time, steer, jump height and surface resistance.
- The articulated solver receives a `tickId`, frame number and source metadata.
- The resource stores only `articulatedFrame.pose`; the frame identity and metadata are not retained beside it.
- `getPlayerPose()` returns a clone and `snapshot()` includes a clone, preventing direct external mutation of the stored pose.
- The game renderer reads the resource after `engine.tick(dt)` and no longer calls `game.createPlayerPose()` in its render loop.
- `applyCreaturePoseDamped()` derives a visible pose from prior Three.js bone state and render delta time.
- The renderer does not publish the resulting bone transforms, source pose ID, damping alpha, render revision or first-visible-frame acknowledgement.
- Restart replaces simulation pose state but does not reset or generation-fence the renderer’s persistent bone state.
- `createPlayerPose()` and `solvePlayerArticulatedPose()` remain public compatibility APIs, so alternate consumers can still produce non-resource poses outside the authoritative publication path.
- The new test is static source-shape coverage. It does not execute the articulated solve, clone boundaries, restart discontinuity, render-rate behavior or visible-frame correlation.

## Main finding

```txt
simulation tick
  -> articulated solve frame with tickId/frame/metadata
  -> store only frame.pose as PlayerPose
  -> renderer reads PlayerPose
  -> render-time damping derives a different visible bone pose
  -> Three.js submits frame
  -> no source pose-frame ID or visible pose receipt
```

The major ownership correction is implemented: the render loop no longer creates animation truth. The remaining gap is not whether simulation owns the target pose, but whether the stored target and the visibly damped pose share explicit identity, restart semantics and observable frame provenance.

## Required parent domain

```txt
prehistoric-rush-player-pose-frame-provenance-authority-domain
```

## Required transaction

```txt
PlayerPoseSolveCommand
  -> bind runtime session, run generation, tickId, frame and rig revision
  -> bind immutable run-state and input revisions
  -> generate legacy procedural source pose
  -> adapt into articulated rig space
  -> execute articulated solve
  -> publish PlayerPoseFrame { id, revision, tickId, frame, rigRevision, pose, metadata }
  -> atomically replace the prior simulation pose frame
  -> render admission cites the accepted PlayerPoseFrame ID
  -> presentation damping publishes PresentationPoseFrame with source ID and discontinuity policy
  -> restart/reset either snaps or explicitly transitions under a new presentation generation
  -> first matching Three.js submission publishes VisiblePlayerPoseFrameAck
```

## Required invariants

```txt
every stored PlayerPoseFrame identifies its run, tick, frame and rig revision
renderer never invents a new simulation target pose
presentation smoothing is explicitly derived from one source pose frame
a predecessor run's damped bone state cannot leak silently into a successor run
missing or stale pose frames produce typed results, not indefinite predecessor display
public snapshots distinguish simulation target pose from visible presentation pose
first visible skeleton frame cites the source pose frame and presentation generation
source test, runtime test, built output and Pages smoke agree
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-13T06-39-10-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T06-39-10-04-00.md
.agent/architecture-audit/2026-07-13T06-39-10-04-00-player-pose-frame-provenance-dsk-map.md
.agent/render-audit/2026-07-13T06-39-10-04-00-authoritative-pose-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T06-39-10-04-00-simulation-owned-player-pose-loop.md
.agent/interaction-audit/2026-07-13T06-39-10-04-00-tick-pose-render-admission-map.md
.agent/pose-system-audit/2026-07-13T06-39-10-04-00-pose-frame-revision-damping-contract.md
.agent/deploy-audit/2026-07-13T06-39-10-04-00-player-pose-fixture-gate.md
.agent/central-sync-audit/2026-07-13T06-39-10-04-00-authoritative-player-pose-reconciliation.md
```

## Validation boundary

Source and documentation were inspected through GitHub at revision `3d448c4e26e8f68cb99de00564ac8dca42624a8d`. No runtime code was changed in this documentation pass. A local checkout and `npm test` could not be executed because the execution environment could not resolve `github.com`; therefore the new test is recorded as present and wired, not independently executed in this run.
# Project Breakdown: PrehistoricRush Game Viewport Central Reconciliation

**Timestamp:** `2026-07-13T00-58-50-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `game-viewport-render-surface-central-reconciled`

## Summary

PrehistoricRush is a multi-page Nexus Engine runner composed from Core Motion and Physics, articulated motion/dynamics, Rapier, deterministic patch streaming, procedural creatures, Three.js, browser input, profile persistence and public diagnostics. This run reconciles the completed `00-49-53` viewport audit with central tracking: the game still derives camera aspect and renderer size from browser globals, samples DPR only at startup, mutates camera and renderer directly on resize, and exposes no viewport revision or first-visible-frame acknowledgement.

## Plan ledger

**Goal:** synchronize one complete game-viewport breakdown across repo-local routing, timestamped audits, machine-readable state and the central ledger without changing runtime behavior.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Detect that PrehistoricRush repo-local viewport documentation is newer than its central ledger entry.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Re-read the viewport audit, source resize path, interaction loop, domains, kits and services.
- [x] Add a new tracker, turn ledger and reconciliation audit family.
- [x] Refresh the required root `.agent` documents and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime implementation and executable viewport fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
repo-local-newer-than-central: PrehistoricRush
prior central timestamp: 2026-07-12T22-18-39-04-00
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
game.html
  -> responsive viewport meta
  -> #app host
  -> pinned-module preflight
  -> import src/game.js

startup
  -> load player profile and pinned runtime modules
  -> install Nexus Engine, official kits and product domain
  -> create Rapier provider/body, patch controller/Worker and camera follower
  -> shell() fixes body and host to the browser viewport
  -> create PerspectiveCamera(innerWidth / innerHeight)
  -> create WebGLRenderer
  -> setSize(innerWidth, innerHeight)
  -> setPixelRatio(min(devicePixelRatio, 2)) once
  -> append canvas and start run/RAF

frame
  -> sample RAF delta
  -> patch browser input into product InputState
  -> engine.tick(dt)
  -> update streamed world
  -> update player pose, camera, lighting and shader time
  -> renderer.render(scene, camera)
  -> update HUD
  -> request successor RAF

resize
  -> window resize event
  -> camera.aspect = innerWidth / innerHeight
  -> camera.updateProjectionMatrix()
  -> renderer.setSize(innerWidth, innerHeight)
  -> no host measurement, DPR refresh, candidate validation, revision or visible-frame receipt
```

## Domains in use

```txt
browser page shell and pinned module admission
player-profile schema, persistence, distribution and boot binding
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion and articulated dynamics
Rapier provider, bodies, colliders, motion requests, stepping and frame readback
procedural creature descriptor, geometry, skeleton, skinning, pose and rig adaptation
seeded route and patch generation, Worker execution, queue, cache, activation, release and fallback
terrain, trees, grass, shards, pickups, colliders and height sampling
run lifecycle, movement, jump, surface, scoring, collision, failure and win
Three.js camera, WebGL renderer, lighting, shadows, instancing, skeleton, HUD and public host
viewport measurement, DPR policy, render-surface allocation, resize admission and first-frame proof
validation, build and Pages deployment
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

### Product, page and Worker kits: 14

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

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
```

## Source-backed findings

- `src/game.js` creates `PerspectiveCamera(62, innerWidth / innerHeight, ...)` and calls `renderer.setSize(innerWidth, innerHeight)`.
- DPR is applied once through `renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))`.
- The resize listener updates camera aspect/projection and renderer size, but does not re-sample DPR.
- The actual `ui.host` CSS box is not measured and no `ResizeObserver` owns surface changes.
- Camera and renderer mutations are not prepared or committed as one typed result.
- `PrehistoricRushHost.getState()` omits CSS size, drawing-buffer size, DPR, camera aspect, viewport revision and first visible resized-frame acknowledgement.

## Required authority

```txt
prehistoric-rush-game-viewport-surface-authority-domain
```

```txt
ViewportChangeCommand
  -> validate runtime session, surface identity and predecessor revision
  -> measure the actual host CSS box
  -> sample DPR under an explicit cap and pixel budget
  -> reject/defer invalid, zero, stale and duplicate candidates
  -> prepare camera projection and WebGL drawing-buffer candidates
  -> commit one ViewportSurfaceCommitResult
  -> apply camera and renderer state from the committed result
  -> render one frame using that viewport revision
  -> publish FirstViewportFrameAck
```

## Required invariants

```txt
camera aspect equals committed CSS width / height
renderer CSS and drawing-buffer dimensions cite the same viewport revision
DPR policy is re-evaluated when the environment changes
zero-sized surfaces preserve the predecessor allocation
stale resize deliveries cannot overwrite a newer surface generation
drawing-buffer and shadow budgets are explicit and bounded
public readback identifies the viewport shown
first visible frame cites the committed viewport fingerprint
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-13T00-58-50-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T00-58-50-04-00.md
.agent/architecture-audit/2026-07-13T00-58-50-04-00-game-viewport-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-13T00-58-50-04-00-viewport-frame-central-reconciliation.md
.agent/gameplay-audit/2026-07-13T00-58-50-04-00-resize-render-loop-central-reconciliation.md
.agent/interaction-audit/2026-07-13T00-58-50-04-00-viewport-change-central-reconciliation-map.md
.agent/viewport-audit/2026-07-13T00-58-50-04-00-central-ledger-reconciliation.md
.agent/deploy-audit/2026-07-13T00-58-50-04-00-viewport-central-sync-gate.md
```

## Validation boundary

Documentation only. Runtime, simulation, physics, patch streaming, articulation, renderer behavior, package scripts, dependencies and deployment are unchanged. No viewport fixture was run.
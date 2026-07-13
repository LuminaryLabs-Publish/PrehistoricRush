# Project Breakdown: PrehistoricRush Game Viewport and Render Surface Authority

**Timestamp:** `2026-07-13T00-49-53-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `game-viewport-render-surface-authority-audited`

## Summary

PrehistoricRush is a multi-page Nexus Engine runner composed from Core Motion and Physics, articulated subdomains, Rapier, deterministic patch streaming, procedural creatures, Three.js, browser controls, profile persistence and public diagnostics. The active game surface has no revisioned viewport authority: startup and resize read `innerWidth`, `innerHeight` and a startup-only `devicePixelRatio`, then mutate the camera and WebGL renderer directly without measuring the actual host, validating a candidate, updating DPR on later changes or publishing a first visible resized-frame acknowledgement.

## Plan ledger

**Goal:** make the browser game viewport one measured, bounded and observable transaction from host geometry and DPR through camera projection, WebGL drawing-buffer allocation and the first visible frame.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Find no new, ledger-missing or root-undocumented eligible repository.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible central entry.
- [x] Trace page shell, canvas creation, startup sizing, DPR selection, camera projection, resize handling, rendering, HUD and public readback.
- [x] Identify the complete interaction loop and all domains in use.
- [x] Preserve all 45 implemented, adapted and proof surfaces with their offered services.
- [x] Define the missing viewport/render-surface authority and executable fixture boundary.
- [x] Add timestamped architecture, render, gameplay, interaction, viewport and deployment audits.
- [x] Refresh the required root `.agent` documents and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime viewport implementation and executable resize/DPR fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
selected by oldest documented fallback: LuminaryLabs-Publish/PrehistoricRush
prior central timestamp: 2026-07-12T22-18-39-04-00
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

## Source-backed findings

### Viewport inputs are browser globals, not a measured host contract

The shell fixes the page and game host to the browser viewport. Camera aspect and renderer size are nevertheless derived directly from `innerWidth` and `innerHeight`; there is no `getBoundingClientRect()`, `ResizeObserver`, viewport service or host-surface identity.

### DPR is sampled only at renderer construction

The renderer calls `setPixelRatio(Math.min(devicePixelRatio || 1, 2))` during startup. The resize handler updates camera aspect and renderer size but does not re-read or reapply DPR. Browser zoom, display migration and DPR changes can therefore leave the drawing buffer at a predecessor scale.

### Camera and renderer mutation is not one admitted commit

Resize directly mutates camera aspect/projection and then renderer size. There is no detached candidate, finite positive-size validation, zero-size deferral, maximum-pixel budget, rollback or typed result if one side fails.

### Render quality is not bound to surface pressure

DPR is capped at 2 and shadow maps are fixed at 2048, but no quality policy relates CSS dimensions, drawing-buffer pixels, shadow allocation, patch load or measured frame pressure. The surface can allocate materially different GPU workloads without a quality revision.

### Public readback cannot prove the surface shown

`PrehistoricRushHost.getState()` exposes game, simulation, physics, streaming, camera and profile snapshots plus a renderer label. It does not expose CSS size, drawing-buffer size, DPR, camera aspect, viewport revision, resize result or first visible resized-frame acknowledgement.

## Required parent domain

```txt
prehistoric-rush-game-viewport-surface-authority-domain
```

## Candidate coordinating kits

```txt
game-surface-id-kit
viewport-measurement-kit
viewport-revision-kit
device-pixel-ratio-policy-kit
render-pixel-budget-kit
camera-projection-candidate-kit
webgl-drawing-buffer-candidate-kit
viewport-zero-size-deferral-kit
viewport-resize-admission-kit
viewport-surface-commit-result-kit
viewport-surface-rollback-kit
render-quality-surface-policy-kit
viewport-change-listener-lease-kit
viewport-observation-journal-kit
first-viewport-frame-ack-kit
viewport-css-buffer-parity-fixture-kit
dpr-change-fixture-kit
zero-size-restore-fixture-kit
rapid-resize-coalescing-fixture-kit
pages-viewport-smoke-kit
```

## Required transaction

```txt
ViewportChangeCommand
  -> validate runtime session, surface identity and predecessor viewport revision
  -> measure the actual host CSS box and safe-area policy
  -> sample current DPR under an explicit cap and pixel budget
  -> reject or defer non-finite, zero, stale and duplicate candidates
  -> prepare camera projection and WebGL drawing-buffer candidates
  -> validate CSS size, buffer size, aspect and quality agreement
  -> atomically commit one ViewportSurfaceCommitResult
  -> apply camera and renderer state from the committed result
  -> render one frame using that viewport revision
  -> acknowledge the first visible frame with CSS size, buffer size, DPR and camera aspect
```

## Required invariants

```txt
camera aspect equals committed CSS width / height
renderer CSS and drawing-buffer dimensions cite the same viewport revision
DPR policy is re-evaluated when the environment changes
zero-sized surfaces do not allocate invalid render targets
stale resize deliveries cannot overwrite a newer surface generation
pixel and shadow budgets are explicit and bounded
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
.agent/trackers/2026-07-13T00-49-53-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T00-49-53-04-00.md
.agent/architecture-audit/2026-07-13T00-49-53-04-00-game-viewport-surface-dsk-map.md
.agent/render-audit/2026-07-13T00-49-53-04-00-camera-dpr-drawing-buffer-frame-gap.md
.agent/gameplay-audit/2026-07-13T00-49-53-04-00-resize-render-loop.md
.agent/interaction-audit/2026-07-13T00-49-53-04-00-viewport-change-admission-map.md
.agent/viewport-audit/2026-07-13T00-49-53-04-00-measure-dpr-commit-frame-contract.md
.agent/deploy-audit/2026-07-13T00-49-53-04-00-viewport-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, simulation, physics, patch streaming, articulation, renderer behavior, dependencies, package scripts and deployment are unchanged. Existing Node tests do not instantiate a browser viewport, WebGL drawing buffer, DPR transition or resized visible frame.
# Project Breakdown: PrehistoricRush Run Start and Restart Admission

**Timestamp:** `2026-07-12T21-51-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `run-start-restart-admission-authority-audited`

## Summary

PrehistoricRush composes Nexus Engine, Core Motion/Physics, Rapier, articulated creature motion, seeded patch streaming, an optional Worker, camera follow, Three.js presentation, browser input, and public diagnostics. This breakdown isolates Run Start and Restart Admission Authority: Enter starts a new run regardless of route/status and without repeat filtering, while the start path resets only selected engine resources and reuses predecessor streaming, Worker, physics, rendering, camera, and host-local input ownership without one participant result.

## Plan ledger

**Goal:** require exactly one admitted Start, Retry, or Run Again command to produce one complete successor run generation across every run-scoped participant.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledgers and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible current repository.
- [x] Inspect game boot, browser controls, scene exits, domain start, simulation, physics, streaming, Worker, camera, renderer, and public host.
- [x] Identify the complete interaction loop and all domains in use.
- [x] Preserve all 45 surfaces and offered services.
- [x] Define start/restart command admission and participant reset/preserve authority.
- [x] Add timestamped architecture, render, gameplay, interaction, lifecycle, and deploy audits.
- [x] Refresh required root `.agent` documents and registry.
- [x] Update central tracking on `main`; create no branch or pull request.
- [ ] Runtime implementation and executable fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Current repo-local audit ordering made PrehistoricRush the oldest eligible project after concurrently newer audit state in IntoTheMeadow and PhantomCommand was considered. Only PrehistoricRush is modified in the Publish organization.

## Complete interaction loop

```txt
game.html
  -> pinned-module preflight
  -> import src/game.js

startup
  -> create page shell and load player profile
  -> import Nexus Engine, official kits, Three.js, Rapier, and ProtoKit
  -> create engine and install Core Motion/Physics/articulation/product kits
  -> install Rapier provider and player body
  -> create patch generator, optional Worker executor, and patch controller
  -> create camera follower and Three adapter
  -> create local left/right/boost booleans
  -> game.start()
  -> prime streaming and reset camera
  -> attach global keyboard/blur/resize listeners
  -> publish PrehistoricRushHost
  -> start RAF

start ingress
  -> UI button: jump while game, otherwise start
  -> Space: jump while game, otherwise start
  -> Enter: always start, including active game and repeated keydown

host start wrapper
  -> game.start()
  -> refresh dynamic content from retained active patches
  -> update retained patch controller and optionally generate center
  -> reset retained camera follower

domain start
  -> create fresh RunState
  -> increment runId from predecessor
  -> set status game
  -> reset simulation resolution
  -> replace RunState and engine InputState
  -> emit RunStarted
  -> request direct game scene transition

next frame
  -> host-local held booleans overwrite new InputState
  -> engine tick
  -> retained Worker/controller/cache may deliver content
  -> physics, camera, content, renderer, and HUD continue
```

## Domains in use

```txt
page shell and route entry
pinned module identity and startup admission
player-profile boot binding
Nexus Engine composition and tick scheduling
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, UI, Diagnostics, Composition
articulated motion and articulated dynamics
Rapier provider, bodies, colliders, and frames
procedural creature generation, rig, pose, skinning, collision, and presentation
seeded patch generation, Worker execution, queue, cache, activation, release, and transfer
terrain, trees, grass, shards, pickups, colliders, and dynamic content
browser button, keyboard, repeat, keyup, blur, and local held-input state
run start, retry, run-again, scene/status admission, and run generation
participant reset, rebuild, preserve, rollback, and exactly-once commit
camera smooth-follow reset and run binding
Three.js scene, renderer, lights, shadows, meshes, geometry, materials, and skeleton
HUD and public host readback
first run-generation frame observation
validation, browser fixtures, and Pages deployment
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
| `player-articulation-adapter-kit` | skeleton-to-rig and legacy-pose conversion |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; browser distribution |
| `menu-page-kit` | shell; profile projection; routes; profile subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; subscription; preview; RAF; navigation |
| `character-preview-transition-kit` | morph; crossfade; pose damping; revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh; materials; bone lookup; pose application; disposal |
| `game-page-entry-kit` | module preflight; failure projection; import; profile boot binding |
| `drunk-route-generator` | samples; nearest point; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature recipe and collision capsule |
| `prehistoric-patch-generator` | terrain; trees; grass; shards; colliders; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; error protocol; transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; camera; lighting; rendering |
| `rapier-physics-domain-kit` | Nexus provider bridge |
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

### Enter can reset an active run

The keyboard handler calls `start()` for every Enter keydown. It does not inspect `game.getState().status`, while Space and the UI button do. The Core Scene manifest declares Start from menu and Retry from run-over/win, but direct transitions are enabled and domain `start()` has no predecessor-state guard.

### Key repeat can create multiple run generations

No `event.repeat` gate exists. Each repeated Enter calls domain `start()`, increments `runId`, resets simulation resolution and resources, emits `RunStarted`, and requests a direct transition.

### Held browser input crosses the generation boundary

Domain `start()` replaces engine InputState, but the host-local `input.left/right/boost` object is retained. The next frame immediately writes those predecessor values into the successor run.

### Streaming and Worker state are not run-bound

The same patch controller ID, cache, queue, executor, Worker, and active-patch map remain installed. Start primes the origin but does not allocate a controller run generation, clear predecessor work, or reject late Worker deliveries.

### Physics and presentation have no start receipt

The player body/provider, active colliders, content batches, camera follower, Three resources, and HUD are reused. Camera reset occurs after domain start, but there is no participant barrier or typed result proving all surfaces cite the same run generation.

## Required parent domain

```txt
prehistoric-rush-run-start-restart-admission-authority-domain
```

## Candidate coordinating kits

```txt
run-start-command-id-kit
run-start-command-sequence-kit
run-start-intent-kit
run-start-scene-status-admission-kit
run-start-key-repeat-rejection-kit
run-start-duplicate-rejection-kit
run-start-stale-rejection-kit
run-generation-kit
run-predecessor-freeze-kit
run-input-retirement-kit
run-simulation-reset-plan-kit
run-scene-transition-plan-kit
run-physics-reset-plan-kit
run-patch-stream-reset-plan-kit
run-worker-generation-fence-kit
run-active-content-reset-plan-kit
run-camera-reset-plan-kit
run-render-reset-plan-kit
run-participant-barrier-kit
run-participant-receipt-kit
run-start-commit-result-kit
run-start-rollback-result-kit
run-start-journal-kit
first-run-generation-frame-ack-kit
enter-repeat-fixture-kit
active-run-start-rejection-fixture-kit
held-input-restart-fixture-kit
stale-worker-run-fixture-kit
participant-reset-failure-fixture-kit
pages-run-start-smoke-kit
```

## Required transaction

```txt
RunStartCommand
  -> validate runtime session, scene, status, command identity, sequence, event repeat, and expected run generation
  -> reject duplicate, stale, repeated, or disallowed active-run start with zero effects
  -> close predecessor input and async work admission
  -> freeze participant revisions
  -> prepare RunState, Input, simulation, scene, physics, streaming/Worker, active content, camera, render, and HUD plans
  -> classify every participant reset, rebuilt, or explicitly preserved
  -> validate one complete successor generation
  -> atomically commit RunStartResult or preserve predecessor
  -> publish one RunStarted event and one transition
  -> reject predecessor callbacks/deliveries
  -> acknowledge first visible frame citing run and participant generations
```

## Required invariants

```txt
one admitted command creates at most one run generation
Enter repeat and active-run Start reject by policy
button, Space, Enter, and public start share one command path
host-local held input cannot leak into successor generation
predecessor Worker and controller results cannot mutate successor state
all physics/content/camera/render participants publish reset-or-preserve receipts
failed preparation preserves or truthfully classifies predecessor state
one RunStarted event and transition correspond to one committed result
first visible frame cites the accepted run generation
source, build, and Pages fixtures agree
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T21-51-38-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T21-51-38-04-00.md
.agent/architecture-audit/2026-07-12T21-51-38-04-00-run-start-restart-admission-dsk-map.md
.agent/render-audit/2026-07-12T21-51-38-04-00-first-run-generation-frame-gap.md
.agent/gameplay-audit/2026-07-12T21-51-38-04-00-enter-repeat-active-run-reset-loop.md
.agent/interaction-audit/2026-07-12T21-51-38-04-00-start-command-status-generation-map.md
.agent/run-lifecycle-audit/2026-07-12T21-51-38-04-00-participant-reset-start-result-contract.md
.agent/deploy-audit/2026-07-12T21-51-38-04-00-start-restart-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, input, simulation, physics, streaming, Worker, camera, rendering, package scripts, dependencies, and deployment were unchanged. No start/restart fixture was run.
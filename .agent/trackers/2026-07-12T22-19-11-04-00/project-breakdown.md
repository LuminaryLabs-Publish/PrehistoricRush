# Project Breakdown: PrehistoricRush Run Start/Restart Central Reconciliation

**Timestamp:** `2026-07-12T22-19-11-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Repository head at selection:** `44cb220388e2c664b95b170783be700cba7c50ff`  
**Status:** `run-start-restart-central-reconciled`

## Summary

PrehistoricRush was selected because its repo-local Run Start/Restart Admission audit at `2026-07-12T21-51-38-04-00` was newer than the central ledger, which still pointed at the `2026-07-12T20-10-25-04-00` browser-runtime lifecycle audit. This run preserves the source-backed 45-surface inventory and reconciles the local start/restart findings into central tracking.

The concrete defect remains unchanged: Enter invokes `start()` in every game state and does not reject key repeat; `game.start()` unconditionally increments `runId`, replaces RunState/Input, resets simulation resolution, emits `RunStarted`, and directly transitions to `game`, while host-local held keys, patch streaming, Worker delivery, physics, active content, camera, renderer, HUD, and public observation remain independently owned.

## Plan ledger

**Goal:** keep repo-local and central tracking synchronized around one exactly-once, status-gated run-start transaction that binds every run-scoped participant to one successor generation.

- [x] Enumerate all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare all nine eligible repositories against the central repo ledger.
- [x] Confirm all nine eligible repositories retain root `.agent` coverage.
- [x] Prioritize `PrehistoricRush` because repo-local audit state was newer than central tracking.
- [x] Modify only `LuminaryLabs-Publish/PrehistoricRush` in the Publish organization.
- [x] Re-read the browser host and Prehistoric Rush domain start paths.
- [x] Identify the complete interaction loop and active domains.
- [x] Preserve all 45 kits/adapters/proof surfaces and every offered service.
- [x] Add this timestamped tracker, turn ledger, and architecture/system audit family.
- [x] Refresh the required root `.agent` files and machine registry.
- [x] Reconcile the central ledger and internal change log on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable start/restart fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush
  central timestamp:   2026-07-12T20-10-25-04-00
  repo-local timestamp: 2026-07-12T21-51-38-04-00
  selection reason: repo-local audit newer than central tracking

IntoTheMeadow      central 2026-07-12T21-40-09-04-00
PhantomCommand     central 2026-07-12T22-00-46-04-00
HorrorCorridor     central 2026-07-12T20-20-02-04-00
ZombieOrchard      central 2026-07-12T20-31-27-04-00
MyCozyIsland       central 2026-07-12T20-40-56-04-00
TheUnmappedHouse   central 2026-07-12T20-51-16-04-00
AetherVale         central 2026-07-12T21-15-06-04-00
TheOpenAbove       central 2026-07-12T21-31-40-04-00
TheCavalryOfRome   excluded
```

## Complete interaction loop

```txt
boot
  -> import pinned Nexus Engine, official kits, ProtoKits, Three.js, and Rapier
  -> create shell and load player profile
  -> compose Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, UI, Diagnostics, and Composition
  -> install deterministic seed, procedural creature, instancing, patch controller, camera follow, and product domain
  -> install Rapier provider and player body
  -> create patch generator, optional Worker executor, patch controller, camera follow, Three adapter, and local input booleans
  -> call game.start()
  -> prime center streaming and reset camera
  -> attach button, keydown, keyup, blur, and resize listeners
  -> publish PrehistoricRushHost
  -> request RAF

start ingress
  -> button: Jump during game, otherwise start
  -> Space: Jump during game, otherwise start
  -> Enter: always start, including repeat delivery and active gameplay
  -> public engine capability can invoke domain start outside UI policy

host start wrapper
  -> game.start()
  -> refresh dynamic content from retained active patches
  -> update retained patch controller and optionally generate center patch
  -> reset retained camera follower

domain start
  -> read predecessor only for runId
  -> create initial RunState and increment runId
  -> set status game
  -> clear transition-step guard
  -> reset Core Simulation resolution
  -> replace RunState and engine InputState
  -> emit RunStarted
  -> request direct game transition
  -> return cloned state rather than typed command result

next frame
  -> host-local left/right/boost booleans overwrite the new InputState
  -> engine tick advances simulation
  -> streaming/Worker/physics/content/camera/render participants continue under retained ownership
  -> HUD and Three frame project without one RunStartResult or participant generation manifest
```

## Domains in use

```txt
browser page shell and pinned module admission
player-profile boot binding and persisted character configuration
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics, and Composition
articulated motion and articulated dynamics
Rapier provider, body, collider, query, and fixed-step frame ownership
procedural creature body, skeleton, rig, skinning, pose solving, and Three presentation
seeded route and patch generation
Worker execution, request correlation, queue, cache, activation, release, and fallback generation
terrain, trees, grass, shards, pickups, colliders, and dynamic content materialization
browser button, keyboard, repeat, blur, resize, and host-local held-key state
run start/restart admission, run generation, participant reset/rebuild/preserve planning, rollback, and journaling
camera-follow reset and run binding
Three scene, geometry, materials, instancing, lighting, shadows, renderer, HUD, and public readback
runtime lifecycle and resource retirement dependency
validation, browser fixtures, built-output parity, and GitHub Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits

| Kit | Offered services |
|---|---|
| `core-input-kit` | actions; bindings; input-state |
| `core-spatial-kit` | transforms; spatial-queries |
| `core-scene-kit` | scene-registry; transitions; host-descriptor |
| `core-physics-kit` | provider; bodies; colliders; motion-requests; step; frame |
| `articulated-dynamics-domain-kit` | articulations; physical-joints; joint-motors; ragdoll-state; frames; snapshot; reset |
| `core-simulation-kit` | tick-context; proposals; observations; resolution-policy; state-event-transition-commit; committed-frame |
| `core-motion-kit` | movement-modes; intents; trajectories; motion-frames; validation; snapshot; reset |
| `articulated-motion-domain-kit` | rig; pose; targets; inverse-kinematics; pose-resolution; frames; snapshot; reset |
| `core-camera-kit` | camera-capability |
| `core-animation-kit` | animation-capability |
| `core-graphics-kit` | graphics; frame-capability |
| `core-skybox-kit` | sky-descriptor |
| `core-ui-kit` | ui-capability; projection |
| `core-diagnostics-kit` | diagnostics; readback |
| `core-composition-kit` | composition-metadata; capability-graph |

### Official NexusEngine-Kits

| Kit | Offered services |
|---|---|
| `seed-kit` | deterministic-seed; random-streams |
| `procedural-creature-body-kit` | descriptor; geometry; skeleton; skinning; collision; legacy-pose; snapshot |
| `instanced-render-batch-kit` | cell-replace-release; flush; overflow; bounds; stats |
| `seeded-world-patch-controller-kit` | focus; membership; queue; cache; generation; delivery; eviction; snapshot; reset |
| `camera-smooth-follow-kit` | damping; reset; teleport-handling; snapshot |

### Product, page, and Worker kits

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | run-resources; input; movement-proposals; motion-intent-frame; observation-registration; events; transitions; player-articulation-api; snapshot |
| `prehistoric-rush-resolution-policy` | collision-pickup-goal-precedence; state-patch; events; transition |
| `player-articulation-adapter-kit` | skeleton-to-rig; legacy-pose-to-articulated-pose; quaternion-conversion |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; storage-sync; broadcast-distribution |
| `menu-page-kit` | menu-shell; profile-projection; routes; profile-subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; profile-subscription; legacy-preview-pose; RAF; navigation |
| `character-preview-transition-kit` | morph; crossfade; legacy-pose-damping; revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned-mesh; materials; bone-lookup; position-array-object-coercion; Euler application; quaternion application; damped quaternion slerp; disposal |
| `game-page-entry-kit` | module-preflight; failure-projection; game-import; profile-boot-binding |
| `drunk-route-generator` | samples; nearest; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature-recipe; collision-capsule |
| `prehistoric-patch-generator` | terrain; trees; grass; shards; colliders; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; request-error-protocol; transfer |

### External and host adapters

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; camera; lighting; render |
| `rapier-physics-domain-kit` | Nexus provider bridge |
| `rapier-runtime-module` | bodies; colliders; queries; world-step |
| `message-worker-executor-adapter-kit` | request-correlation; async-generation; pending-rejection; listener-removal; Worker termination |
| `active-content-consumer-adapter` | terrain; trees; grass; shards; pickups; colliders; height |
| `creator-viewport-framing-adapter` | bounds; target; distance |
| `creator-persistence-scheduler` | timer-replacement; delayed-profile-commit |
| `browser-input-adapter` | keyboard; buttons; keyup; blur; product-input-patch; restart-activation |
| `creature-camera-render-host-adapters` | pose-application; collision-sample; pickup-scan; camera; HUD; profile-readback; frame-readback |

### Proof kits

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue; win; collision; precedence; pickup-idempotency; fallback; serialization |
| `player-articulation-test-kit` | rig-chain-adaptation; Euler-quaternion conversion; cloneability |

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total implemented/adapted/proof surfaces: 45
```

## Main findings

### Enter and repeat bypass route policy

The UI button and Space choose Jump or Start from `state.status`; Enter calls `start()` unconditionally. No `event.repeat` check exists. Holding Enter can create multiple run IDs, repeated `RunStarted` events, repeated direct transitions, repeated center-generation attempts, and repeated camera resets.

### Domain start is not an admitted command

`game.start()` has no command ID, expected runtime session, expected scene/status, expected run generation, sequence, duplicate record, or stale rejection. It returns cloned state instead of a typed terminal result.

### Reset is partial and cross-owner state is retained

RunState, engine InputState, and simulation resolution reset. Host-local held keys, patch controller/cache/queue, pending Worker work, active patches, physics provider/body/colliders, instance batches, dynamic render content, renderer, and HUD have no reset/rebuild/preserve receipt for the successor run.

### Predecessor input can enter the successor

The local `input.left/right/boost` booleans are not cleared by `start()`. The next RAF writes them into the newly reset engine InputState.

### First visible frame has no start provenance

HUD and public snapshots expose state, simulation, physics, streaming, camera, and composition independently. They do not cite one accepted `RunStartResult`, complete participant manifest, or first-visible successor-frame acknowledgement.

## Required parent domain

```txt
prehistoric-rush-run-start-restart-admission-authority-domain
```

## Required transaction

```txt
StartRunCommand or RestartRunCommand
  -> validate runtime session, route, status, event repeat, command ID/sequence, and expected run generation
  -> reject repeat, duplicate, stale, or disallowed active-run commands with zero effects
  -> close predecessor input and asynchronous delivery admission
  -> freeze predecessor participant revisions
  -> prepare RunState, Input, simulation, Scene, physics, patch/Worker, active content, camera, render, HUD, and observation plans
  -> classify each participant reset, rebuilt, or explicitly preserved
  -> validate one complete successor generation
  -> atomically commit RunStartResult or preserve/classify the predecessor truthfully
  -> emit one RunStarted event and one scene transition
  -> publish participant receipts and bounded journal evidence
  -> acknowledge the first visible frame citing run and participant generations
```

## Required `.agent` output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T22-19-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T22-19-11-04-00.md
.agent/architecture-audit/2026-07-12T22-19-11-04-00-run-start-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-12T22-19-11-04-00-first-run-frame-central-reconciliation.md
.agent/gameplay-audit/2026-07-12T22-19-11-04-00-start-repeat-participant-central-reconciliation.md
.agent/interaction-audit/2026-07-12T22-19-11-04-00-start-command-central-admission-map.md
.agent/run-lifecycle-audit/2026-07-12T22-19-11-04-00-start-result-participant-central-contract.md
.agent/deploy-audit/2026-07-12T22-19-11-04-00-start-restart-central-fixture-gate.md
```

## Validation boundary

```txt
runtime source changed: no
input behavior changed: no
simulation, physics, streaming, or Worker behavior changed: no
rendering changed: no
package scripts or dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
npm test: not run
browser start/restart fixtures: not run
built-output smoke: not run
Pages smoke: not run
```

This run synchronizes documentation. It does not claim exactly-once start, active-run protection, input retirement, participant generation parity, rollback, stale Worker rejection, or first-frame provenance is implemented.
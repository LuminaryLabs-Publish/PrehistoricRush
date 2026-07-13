# Project Breakdown: PrehistoricRush Browser Input and Core Input Adoption

**Timestamp:** `2026-07-13T03-12-30-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `browser-input-core-input-adoption-central-reconciled`

## Summary

PrehistoricRush installs Core Input with `jump`, `boost`, `start`, `retry` and `steer`, but the active browser host does not route keyboard or button input through that service. Window-global listeners and a host-local mutable object write directly into the product `InputState`, so focus ownership, key-repeat policy, command identity, generation fencing, duplicate/stale rejection and visible-frame correlation are absent.

## Plan ledger

**Goal:** make every keyboard or button action pass through one focus-owned, revisioned Core Input admission path before it can steer, boost, jump, start or restart a run.

- [x] Compare the full ten-repository Publish inventory with the nine eligible central ledger entries.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm no new, ledger-missing or root-`.agent`-missing eligible repository takes priority.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`, the oldest eligible central entry.
- [x] Trace Core Input installation, browser listeners, button activation, host-local held state, product input mutation, run start and RAF consumption.
- [x] Preserve all 45 implemented kit/adapter/proof surfaces and offered services.
- [x] Define the browser-input/Core-Input adoption authority and fixture gate.
- [x] Add a new timestamped tracker, turn ledger and architecture/system audit family.
- [x] Refresh required root `.agent` files and machine registry.
- [x] Update central tracking directly on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime adoption and executable browser fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-13T00-58-50-04-00 selected
HorrorCorridor     2026-07-13T01-08-28-04-00
ZombieOrchard      2026-07-13T01-18-20-04-00
MyCozyIsland       2026-07-13T01-40-00-04-00
TheUnmappedHouse   2026-07-13T01-49-49-04-00
AetherVale         2026-07-13T02-15-51-04-00
TheOpenAbove       2026-07-13T02-18-03-04-00
IntoTheMeadow      2026-07-13T02-39-44-04-00
PhantomCommand     2026-07-13T02-49-07-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
game page boot
  -> preflight pinned modules
  -> load player profile
  -> create Nexus Engine composition
  -> install Core Input actions/bindings
  -> create product domain, Rapier, streaming, Three.js and camera follow

browser adapter
  -> create host-local { left, right, boost }
  -> install window keydown/keyup/blur listeners
  -> install Jump/Retry/Run Again button callback

keydown
  -> prevent selected browser defaults
  -> Enter calls start() unconditionally
  -> A/D and arrows mutate host-local held state
  -> W/ArrowUp mutates host-local boost
  -> Space writes jump directly or calls start()
  -> no focus, target, repeat, command or generation admission

RAF
  -> copy held steer/boost directly into product InputState
  -> engine.tick(dt)
  -> run system reads product InputState
  -> run system clears jump after consumption
  -> simulation, physics, streaming, pose, camera and render update
  -> HUD and button text project current state
  -> request successor RAF

blur
  -> clear host-local held state
  -> patch product InputState to neutral
  -> retire no input generation and publish no clear result
```

## Domains in use

```txt
browser page shell and pinned module admission
player profile schema, persistence, distribution and boot binding
browser keyboard, button, focus, blur and page lifecycle
Core Input action, binding and state capability
Core Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion and articulated dynamics
Rapier provider, bodies, colliders, requests, stepping and frame readback
procedural creature descriptor, geometry, skeleton, skinning, pose and rig adaptation
seeded route and patch Worker generation, queue, cache, activation, release and fallback
terrain, trees, grass, shards, pickups, colliders and height sampling
run lifecycle, movement, jump, surface, score, collision, failure and win
Three.js camera, renderer, lighting, shadows, instancing, skeleton, HUD and public host
input session, focus generation, repeat policy, command admission, consumer receipts and visible-frame proof
validation, build and GitHub Pages deployment
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
| `prehistoric-rush-domain-kit` | run resources; product input; movement proposals; motion frames; observations; events; transitions; snapshots |
| `prehistoric-rush-resolution-policy` | collision, pickup and goal precedence; state patch; events; transitions |
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
| `browser-input-adapter` | global keyboard; button activation; keyup; blur; host-local held state; direct product input patch; restart activation |
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

### Core Input is installed but bypassed

The kit graph installs `core-input-kit` with `jump`, `boost`, `start`, `retry` and `steer`. The browser host never submits those actions to Core Input; it writes directly to `prehistoric-rush.input-state` through `game.setInput()`.

### Global keyboard admission is unbounded

The host registers window-global listeners. It does not prove that the game canvas owns focus, exclude editable targets, identify the input source, bind a focus generation or reject events after visibility/page lifecycle changes.

### Enter can reset an active run

Every `Enter` keydown calls `start()` regardless of current run status. Holding Enter can also deliver repeated keydowns because `event.repeat` is not checked.

### Space can re-arm jump through key repeat

The run system clears `input.jump` after each consumed tick. Repeated Space keydown events can write it back to `true`, allowing additional jump admissions while the physical key remains held. Exact cadence depends on browser repeat timing.

### Button and keyboard paths are not equivalent commands

The visible button invokes direct jump/start behavior, while keyboard paths mutate host-local state and product state separately. Neither path has a command ID, monotonic sequence, duplicate result or shared terminal action result.

### Blur is not a generation fence

Blur writes neutral values but does not retire an input generation. There is no `visibilitychange`, `pagehide`, stale-event rejection or typed clear result.

### Observation is incomplete

`PrehistoricRushHost.getState()` exposes game, tick, simulation, physics, streaming, camera, composition and profile information, but not the active input session, focus generation, admitted commands, rejections, consumer receipts or first visible input frame.

## Required authority

```txt
prehistoric-rush-browser-input-core-adoption-authority-domain
```

Required transaction:

```txt
BrowserInputSample
  -> validate runtime session, route, game surface and focus generation
  -> exclude editable/non-game targets
  -> classify held state or one-shot edge command
  -> apply explicit key-repeat policy
  -> allocate command ID and monotonic sequence
  -> submit through Core Input action/binding semantics
  -> reject stale, duplicate or unavailable commands with zero mutation
  -> publish CoreInputAdmissionResult
  -> let run/jump/retry consumers publish receipts
  -> project the successor game and HUD state
  -> acknowledge the first visible frame citing the input result
```

## Candidate coordinating kits

```txt
input-session-id-kit
game-input-surface-kit
input-focus-generation-kit
keyboard-event-envelope-kit
button-input-envelope-kit
input-source-policy-kit
editable-target-exclusion-kit
key-repeat-policy-kit
held-action-state-kit
edge-action-command-kit
core-input-action-mapping-kit
core-input-admission-result-kit
input-sequence-kit
input-generation-fence-kit
duplicate-input-command-kit
stale-input-command-kit
run-command-admission-kit
jump-command-admission-kit
input-clear-result-kit
input-consumer-receipt-kit
input-observation-journal-kit
first-input-frame-ack-kit
midrun-enter-rejection-fixture-kit
key-repeat-jump-fixture-kit
blur-visibility-generation-fixture-kit
editable-target-fixture-kit
button-keyboard-parity-fixture-kit
pages-input-smoke-kit
```

## Required invariants

```txt
Core Input is the only admitted browser action boundary
one physical edge produces at most one one-shot command per generation
held actions are generation-bound and retire on lifecycle loss
Enter cannot reset an active run unless an explicit restart command is admitted
button and keyboard activation produce equivalent typed results
stale, duplicate and rejected samples have zero gameplay effects
public diagnostics identify input generation and terminal result
first visible frame cites the accepted input result
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-13T03-12-30-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-12-30-04-00.md
.agent/architecture-audit/2026-07-13T03-12-30-04-00-browser-input-core-adoption-dsk-map.md
.agent/render-audit/2026-07-13T03-12-30-04-00-input-result-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-12-30-04-00-global-key-repeat-midrun-reset-loop.md
.agent/interaction-audit/2026-07-13T03-12-30-04-00-browser-sample-core-input-result-map.md
.agent/input-system-audit/2026-07-13T03-12-30-04-00-focus-repeat-generation-core-input-contract.md
.agent/deploy-audit/2026-07-13T03-12-30-04-00-browser-input-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, browser input behavior, Core Input behavior, simulation, physics, streaming, articulation, renderer behavior, package scripts, dependencies and deployment are unchanged. No keyboard, focus, repeat, button-parity, lifecycle, browser or Pages fixture was run.
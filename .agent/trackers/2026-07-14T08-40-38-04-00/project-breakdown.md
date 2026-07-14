# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-14T08-40-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Prior documentation head:** `2a9ec99a67d31e40e54070aad52dc31014c9bdbd`  
**Status:** `run-outcome-score-settlement-authority-audited`

## Summary

PrehistoricRush deterministically resolves continuation, collision failure, shard collection and goal completion. The terminal result is not retained as one immutable artifact: it is split across mutable RunState, emitted events, a Core Scene transition, the latest simulation frame and HUD text.

`start()` can immediately reset resolution, increment the run ID and replace the terminal state. The previous run has no durable result identity, score policy revision, seed/profile/config fingerprint, retry lineage or first matching terminal-frame acknowledgement.

## Plan ledger

**Goal:** make every completed or failed run settle into one immutable result before retry can replace it, with score provenance, presentation acknowledgement and reproducible replay inputs.

- [x] Compare all 11 accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm 10 eligible central ledgers and root `.agent` states.
- [x] Confirm no eligible repository is new, missing, undocumented or runtime-ahead.
- [x] Select only PrehistoricRush by the oldest eligible central timestamp.
- [x] Inspect run state, resolution policy, Core Scene transition, cleanup, HUD and retry paths.
- [x] Preserve the complete 59-surface kit, adapter and proof inventory.
- [x] Add the timestamped tracker and focused audit family.
- [x] Change no runtime, renderer, package, test, workflow or deployment source.
- [x] Use `main` only and create no branch or pull request.
- [ ] Implement result settlement, score policy, retry lineage and executable proof later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible non-Cavalry repositories: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing repositories: 0
root-agent-missing repositories: 0
runtime-ahead repositories: 0
selected repository: PrehistoricRush
selection rule: oldest eligible central documentation timestamp
excluded repository: TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Complete interaction loop

```txt
menu
  -> open game route

game bootstrap
  -> load pinned Nexus Engine, official kits, Three.js, Rapier and Rapier provider
  -> compose Core domains and PrehistoricRush product domain
  -> create streaming controller, Worker/fallback generator and Three.js adapter
  -> call game.start()
  -> create runId N with status game

active frame
  -> project browser input into product input state
  -> submit movement, pickup and goal proposals
  -> observe Rapier and fallback collisions
  -> resolve one committed simulation frame
  -> collision wins over goal and pickups
  -> otherwise accept new shards and goal completion
  -> write mutable RunState
  -> emit RunFailed, RunWon and ShardCollected events
  -> publish Core Scene transition
  -> cleanup disables player control for run-over or win
  -> renderer presents current state and generic status/button text

retry
  -> button, Space or Enter calls start()
  -> reset simulation resolution
  -> increment runId
  -> replace RunState, input and pose
  -> restart streaming/camera presentation
  -> retain no immutable predecessor RunOutcomeArtifact
```

## Domains in use

```txt
browser document, DOM, keyboard, blur, resize and animation lifecycle
pinned runtime-provider import and composition admission
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation and Motion
articulated dynamics and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
product run, route, surface, score, outcome policy, player control, pose and terrain IK
collision priority, pickup acceptance, goal completion and scene transitions
run-result identity, score provenance, retry lineage and terminal history
seeded patch generation, Worker/fallback execution, cache and streaming membership
stable instance cells, patch-owned terrain, grass, trees, shards, colliders and pickups
Rapier physics and fallback collision sampling
Three.js world, camera, player, HUD and terminal-frame presentation
profile/body/config identity needed for reproducible result evidence
validation, static hosting, build and Pages deployment
repo-local and central audit tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot and reset
core-character-kit: character registry, bindings, status, snapshot and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution and safe area
core-ui-scale-kit: reference resolution, viewport scale and scale policy
core-camera-framing-kit: subject framing, perspective/orthographic fit and damping
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision and legacy pose
instanced-render-batch-kit: batch registry, cell membership, stable ranges, changed-range flush, overflow diagnostics and bounds invalidation
seeded-world-patch-controller-kit: focus, desired active/prefetch sets, generation queue, Worker execution, cache, ready/release queues, stats and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, character/control, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: menu state, commands, events and snapshot
prehistoric-rush-resolution-policy: collisions, pickups, goal and transition resolution
player-character-composition-kit: body, rig, creature, character and optional possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage persistence, revision assignment, BroadcastChannel and storage-event publication
menu-page-kit: title, selected-profile projection and game/creator navigation
character-creator-page-kit: controls, draft state, reset, external-profile intake and preview startup
character-preview-transition-kit: morph and crossfade preview lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application and disposal
game-page-entry-kit: HUD removal, runtime import and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic route queries
prehistoric-patch-generator: terrain, trees, grass, pickups and colliders
prehistoric-patch-worker: patch Worker init, request and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource and render submission primitives
rapier-physics-domain-kit: Nexus Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: terrain slots, patch activation/release, instance cells, collider membership, pickup refresh, height sampling, camera/render and ownership readback
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: 160 ms debounced profile write scheduling
browser-input-adapter: keyboard, blur and restart input projection
creature-camera-render-host-adapters: player pose, camera, HUD and public diagnostics projection
```

### Proof kits: 7

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total surfaces:                   59
```

## Source-backed findings

```txt
collision-versus-goal priority: implemented and tested
pickup deduplication: implemented and tested
run failure and win events: implemented
Core Scene terminal transitions: implemented
player control suspension on terminal transition: implemented
runId increment on start: implemented
same seed/config reused by current runtime: implemented implicitly
terminal HUD status and Retry/Run Again labels: implemented

immutable RunOutcomeArtifact: absent
score formula and score-policy revision: absent
terminal result ID/fingerprint: absent
seed, route, profile, body and config binding: absent
accepted terminal simulation-frame receipt: absent
first visible terminal-frame acknowledgement: absent
terminal summary surface: absent
result journal or persistence: absent
retry command bound to predecessor result: absent
retry settlement result: absent
late terminal event rejection after restart: absent
source/build/Pages result parity fixture: absent
```

## Main architecture finding

The resolution policy returns a coherent per-tick decision, but the product does not elevate a terminal decision into a durable run-level settlement. `RunWon` and `RunFailed` payloads omit seed, profile/body identity, elapsed time, score policy and committed-frame identity. The public host exposes only the latest mutable snapshots.

`start()` resets resolution and replaces RunState as soon as the player retries. That makes the predecessor outcome observational rather than authoritative. A UI, analytics, persistence or replay consumer cannot prove which exact run, configuration and rendered terminal frame produced the result.

## Required authority

```txt
prehistoric-rush-run-outcome-score-settlement-authority-domain
```

```txt
RunOutcomeSettlementCommand
  -> bind RunId, terminal StepId and committed simulation revision
  -> bind seed, route, profile, body, config and score-policy fingerprints
  -> admit exactly one fail or win outcome
  -> derive immutable distance, elapsed, shards, collision and score values
  -> publish RunOutcomeArtifact and RunOutcomeSettlementResult
  -> retain a bounded result journal
  -> project the same result into diagnostics and terminal UI
  -> acknowledge the first matching visible terminal frame

RunRetryCommand
  -> cite an accepted predecessor RunOutcomeArtifact
  -> reject duplicate, stale or unacknowledged retry requests
  -> allocate the successor RunId and retry lineage
  -> reset simulation, player, input, pose, camera and streaming participants
  -> publish RunRetryResult
  -> preserve the predecessor artifact after successor admission
```

## Validation boundary

Source and existing documentation were inspected through GitHub. No runtime source changed. The existing resolution-policy test verifies continuation, goal, collision priority, pickup acceptance, duplicate suppression and serializability, but it does not execute the engine, scene transition, event publication, HUD, retry, persistence or visible terminal-frame correlation. `npm test`, browser, build and Pages fixtures were not executed.
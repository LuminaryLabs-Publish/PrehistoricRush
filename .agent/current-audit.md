# PrehistoricRush Current Audit

**Timestamp:** `2026-07-12T22-19-11-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `run-start-restart-central-reconciled`  
**Repository head reviewed before documentation writes:** `44cb220388e2c664b95b170783be700cba7c50ff`

## Summary

This audit reconciles the repo-local Run Start/Restart Admission findings with central tracking. Enter invokes the host `start()` path regardless of current status and without filtering `KeyboardEvent.repeat`. Domain `start()` always increments `runId`, replaces RunState/Input, resets simulation resolution, emits `RunStarted`, and requests a direct game transition, while patch streaming, Worker execution, physics, content, camera, rendering, HUD, public readback, and host-local held keys remain independently owned.

## Plan ledger

**Goal:** admit exactly one complete start/restart transaction for an allowed predecessor state and bind every run-scoped participant to the same successor generation.

- [x] Compare the full Publish inventory and central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` because repo-local audit state was newer than central tracking.
- [x] Inspect scene topology, browser input, host start wrapper, domain start, simulation, streaming, Worker, physics, camera, render, HUD, and public host.
- [x] Preserve all domains, 45 surfaces, and offered services.
- [x] Define command admission, participant reset/rebuild/preserve plans, atomic result, rollback, journal, and first-frame proof.
- [x] Add timestamped tracker and system audits.
- [x] Refresh root `.agent` state and synchronize central tracking.
- [ ] Implement and execute later.

## Complete interaction loop

```txt
boot
  -> create engine, game, physics, controller, optional Worker, camera, renderer, and local input booleans
  -> call game.start() immediately
  -> prime streaming and reset camera
  -> attach button, keyboard, blur, and resize listeners
  -> publish PrehistoricRushHost
  -> start RAF

run start ingress
  -> button: Jump during game, otherwise start
  -> Space: Jump during game, otherwise start
  -> Enter: always start
  -> public host exposes engine and product capability

host start wrapper
  -> game.start()
  -> refresh dynamic content from retained active patches
  -> update retained patch controller and optionally generate center
  -> reset retained camera follower

domain start
  -> clone predecessor only for runId
  -> create fresh RunState and increment runId
  -> reset simulation resolution
  -> replace RunState and InputState
  -> emit RunStarted
  -> direct transition to game
  -> return cloned state

next RAF
  -> host-local held state overwrites successor InputState
  -> retained physics, streaming, Worker, content, camera, renderer, and HUD continue
```

## Source-backed findings

### Enter bypasses route and status policy

The UI button and Space choose Jump or Start from `state.status`. Enter calls `start()` unconditionally. Core Scene declares Start only from menu and Retry from run-over/win, but direct transitions are enabled and domain `start()` does not inspect scene or status.

### Key repeat can create many runs

No `event.repeat` check exists. Holding Enter can invoke `start()` repeatedly, increment `runId`, reset state and resolution, emit repeated `RunStarted` events, request repeated transitions, prime streaming, and reset camera.

### Start is not a complete participant transaction

The domain resets RunState, engine InputState, and simulation resolution. The host reuses the same local held keys, patch controller/cache/queue, Worker executor, active patch map, physics provider/body/colliders, instance batches, renderer, HUD, and camera follower. No reset/rebuild/preserve plan or participant receipt proves that retained state belongs to the successor run.

### Host-local keys survive restart

`game.start()` resets engine InputState, but the host-local `input.left/right/boost` booleans are not cleared. On the next RAF, they are written into the new run.

### No terminal start result or frame proof

`game.start()` returns cloned state, not a typed command result. There is no command ID, expected predecessor, duplicate/stale rejection, preparation barrier, rollback classification, bounded journal, or first visible run-generation frame acknowledgement.

## Domains in use

```txt
page shell and pinned module admission
player-profile boot binding
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics, and Composition
articulated motion and dynamics
Rapier provider, player body, colliders, and frames
procedural creature generation, rig, pose, skinning, and presentation
seeded patch generation, Worker execution, queue, cache, activation, release, and colliders
terrain, trees, grass, shards, pickups, and dynamic content
browser button/keyboard/repeat/blur input and local held state
run start/restart command admission and participant reset/rebuild/preserve policy
camera follower reset and run binding
Three rendering, HUD, public host, and first-frame observation
runtime lifecycle and resource retirement dependency
validation, browser fixtures, built-output parity, and Pages deployment
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
```

The exact kit and service inventory is retained in the current tracker and `.agent/kit-registry.json`.

## Required authority

```txt
prehistoric-rush-run-start-restart-admission-authority-domain
```

## Required transaction

```txt
RunStartCommand
  -> validate runtime session, scene/status, event repeat, command ID/sequence, and expected run generation
  -> reject repeat, duplicate, stale, or disallowed active-run commands
  -> close predecessor input and async delivery admission
  -> freeze predecessor participant revisions
  -> prepare RunState, Input, simulation, Scene, physics, streaming/Worker, active content, camera, render, HUD, and observation plans
  -> classify every participant reset, rebuilt, or explicitly preserved
  -> validate complete candidate generation
  -> atomically commit one RunStartResult or preserve/classify predecessor truthfully
  -> emit one RunStarted and one scene transition
  -> publish participant receipts and journal evidence
  -> acknowledge first visible frame citing run and participant generations
```

## Current output

```txt
.agent/trackers/2026-07-12T22-19-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T22-19-11-04-00.md
.agent/architecture-audit/2026-07-12T22-19-11-04-00-run-start-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-12T22-19-11-04-00-first-run-frame-central-reconciliation.md
.agent/gameplay-audit/2026-07-12T22-19-11-04-00-start-repeat-participant-central-reconciliation.md
.agent/interaction-audit/2026-07-12T22-19-11-04-00-start-command-central-admission-map.md
.agent/run-lifecycle-audit/2026-07-12T22-19-11-04-00-start-result-participant-central-contract.md
.agent/deploy-audit/2026-07-12T22-19-11-04-00-start-restart-central-fixture-gate.md
```

## Validation

Documentation only. Existing source and tests were inspected but not run. No runtime, input, simulation, physics, streaming, Worker, camera, rendering, package, dependency, or deployment behavior changed.
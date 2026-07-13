# PrehistoricRush Current Audit

**Timestamp:** `2026-07-12T21-51-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `run-start-restart-admission-authority-audited`

## Summary

The current audit isolates Run Start and Restart Admission Authority. Enter invokes the host `start()` path regardless of current status and without filtering `KeyboardEvent.repeat`. The domain `start()` always increments `runId`, replaces RunState/Input, resets simulation resolution, emits `RunStarted`, and requests a direct game transition, while patch streaming, Worker execution, physics, content, camera adapters, rendering, and host-local held keys remain independently owned.

## Plan ledger

**Goal:** admit exactly one complete start/restart transaction for an allowed predecessor state and bind all run-scoped participants to the same successor generation.

- [x] Compare the Publish inventory and central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` as the oldest eligible current entry.
- [x] Inspect scene topology, browser input, host start wrapper, domain start, simulation, streaming, Worker, physics, camera, render, and public host.
- [x] Preserve all domains, 45 surfaces, and offered services.
- [x] Define command admission, participant reset/preserve plans, atomic result, and first-frame proof.
- [x] Add timestamped tracker and system audits.
- [x] Refresh root `.agent` state and central tracking.
- [ ] Implement and execute later.

## Complete interaction loop

```txt
boot
  -> create engine, game, physics, controller, optional Worker, camera, renderer, local input booleans
  -> call game.start() immediately
  -> prime streaming and reset camera
  -> attach button and keyboard listeners
  -> start RAF

run start ingress
  -> button: Jump during game, otherwise start
  -> Space: Jump during game, otherwise start
  -> Enter: always start
  -> public host: engine exposes engine.n.prehistoricRush.start indirectly

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
```

## Source-backed findings

### Enter bypasses route/status policy

The UI button and Space choose Jump or Start from `state.status`. Enter calls `start()` unconditionally. Core Scene declares Start only from menu and Retry from run-over/win, yet direct transitions are allowed and domain `start()` does not inspect scene or status.

### Key repeat can create many runs

No `event.repeat` check exists. Holding Enter can invoke `start()` repeatedly, increment `runId`, reset state/resolution, emit repeated RunStarted events, request repeated transitions, prime streaming, and reset camera.

### Start is not a complete participant transaction

The domain resets RunState, InputState, and simulation resolution. The host then reuses the same patch controller/cache/queue, Worker executor, active patch map, physics provider/body/colliders, instance batches, renderer, and camera follower. No reset/preserve plan or per-participant receipt proves that all retained state belongs to the successor run.

### Host-local keys survive restart

`game.start()` resets engine InputState, but the host-local `input.left/right/boost` booleans are not cleared. On the next RAF, they are written back into the new run.

### No terminal result

`game.start()` returns a cloned state, not a typed command result. There is no command ID, expected predecessor, duplicate/stale rejection, partial-failure classification, participant barrier, journal, or first visible run-generation frame.

## Domains in use

```txt
page shell and pinned module admission
player-profile boot binding
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, UI, Diagnostics, Composition
articulated motion and dynamics
Rapier provider, player body, colliders, and frames
procedural creature generation, rig, pose, skinning, and presentation
seeded patch generation, Worker executor, queue, cache, activation, release, and colliders
terrain, trees, grass, shards, pickups, and dynamic content
browser button/keyboard/blur input and key-repeat semantics
run start/restart command admission and participant reset/preserve policy
camera follower reset and run binding
Three.js rendering, HUD, public host, and first-frame observation
validation, browser fixtures, and Pages deployment
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

The exact inventory is in the current tracker and `.agent/kit-registry.json`.

## Required authority

```txt
prehistoric-rush-run-start-restart-admission-authority-domain
```

## Required transaction

```txt
RunStartCommand
  -> validate runtime session, scene/status, command ID/sequence, input event, and expected run generation
  -> reject repeat, duplicate, stale, or disallowed active-run commands
  -> close predecessor input and async delivery admission
  -> freeze predecessor participant revisions
  -> prepare RunState, Input, simulation, physics, streaming/Worker, active content, camera, render, and scene plans
  -> classify every participant as reset, rebuilt, or explicitly preserved
  -> validate complete candidate generation
  -> atomically commit one RunStartResult or preserve predecessor
  -> emit one RunStarted and one scene transition
  -> acknowledge first visible frame citing run and participant generations
```

## Current output

```txt
.agent/trackers/2026-07-12T21-51-38-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T21-51-38-04-00.md
.agent/architecture-audit/2026-07-12T21-51-38-04-00-run-start-restart-admission-dsk-map.md
.agent/render-audit/2026-07-12T21-51-38-04-00-first-run-generation-frame-gap.md
.agent/gameplay-audit/2026-07-12T21-51-38-04-00-enter-repeat-active-run-reset-loop.md
.agent/interaction-audit/2026-07-12T21-51-38-04-00-start-command-status-generation-map.md
.agent/run-lifecycle-audit/2026-07-12T21-51-38-04-00-participant-reset-start-result-contract.md
.agent/deploy-audit/2026-07-12T21-51-38-04-00-start-restart-fixture-gate.md
```

## Validation

Documentation only. Existing source and tests were inspected but not run. No runtime behavior changed.
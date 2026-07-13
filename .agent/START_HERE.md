# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T22-19-11-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `run-start-restart-central-reconciled`

## Summary

PrehistoricRush composes a Nexus Engine runner with Core Motion/Physics, Rapier, deterministic patch streaming, a procedural creature, Three.js presentation, and browser controls. The current audit isolates Run Start/Restart Admission Authority and reconciles the newer repo-local audit with central tracking.

Enter calls `start()` during every route and on browser key repeat. Domain `start()` unconditionally creates a new run, emits `RunStarted`, resets only RunState, engine InputState, and simulation resolution, then reuses host-local held keys, patch/Worker, physics, active content, camera, renderer, HUD, and public observation without one successor-generation participant manifest.

## Plan ledger

**Goal:** make Start, Retry, and Run Again one exactly-once, status-gated transaction that resets, rebuilds, or explicitly preserves every run-scoped participant before the first visible frame.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because repo-local audit state was newer than central tracking.
- [x] Trace scene exits, UI/keyboard/public start paths, key repeat, domain start, simulation, physics, streaming, Worker, content, camera, render, and input state.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Add the `22-19-11` reconciliation tracker and audit family.
- [x] Refresh root routing and machine registry.
- [x] Synchronize central tracking on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable start/restart fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T22-19-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T22-19-11-04-00.md
.agent/architecture-audit/2026-07-12T22-19-11-04-00-run-start-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-12T22-19-11-04-00-first-run-frame-central-reconciliation.md
.agent/gameplay-audit/2026-07-12T22-19-11-04-00-start-repeat-participant-central-reconciliation.md
.agent/interaction-audit/2026-07-12T22-19-11-04-00-start-command-central-admission-map.md
.agent/run-lifecycle-audit/2026-07-12T22-19-11-04-00-start-result-participant-central-contract.md
.agent/deploy-audit/2026-07-12T22-19-11-04-00-start-restart-central-fixture-gate.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
```

The browser-runtime retirement audit at `2026-07-12T20-10-25-04-00` remains a direct dependency. Restart must not create a second runtime owner.

## Current start loop

```txt
button or Space
  -> Jump during game, otherwise start

Enter
  -> always start, including active game and repeated keydown delivery

start wrapper
  -> game.start()
  -> retained content refresh
  -> retained patch controller update/generate/pump
  -> retained camera reset

domain start
  -> increment runId
  -> replace RunState and engine InputState
  -> reset simulation resolution
  -> emit RunStarted
  -> direct transition to game
  -> return state, not typed command result

next frame
  -> retained host-local keys enter successor input
  -> retained patch/Worker/physics/content/camera/render participants continue
```

## Main findings

```txt
start command identity: absent
scene/status admission inside domain start: absent
Enter active-run guard: absent
KeyboardEvent.repeat guard: absent
exactly-once start result: absent
host-local input retirement: absent
patch-controller run generation: absent
pending Worker run generation: absent
physics reset receipt: absent
active-content reset/preserve receipt: absent
camera/render/HUD participant receipts: absent
first run-generation frame acknowledgement: absent
```

## Required parent domain

```txt
prehistoric-rush-run-start-restart-admission-authority-domain
```

## Required flow

```txt
StartRunCommand or RestartRunCommand
  -> validate runtime session, scene, status, event repeat, command ID, sequence, and expected run generation
  -> reject repeat, duplicate, stale, or disallowed active-run commands
  -> close predecessor input and asynchronous delivery admission
  -> prepare RunState, Input, simulation, Scene, physics, patch/Worker, content, camera, render, HUD, and observation participants
  -> classify each participant reset, rebuilt, or explicitly preserved
  -> atomically commit one RunStartResult or preserve/classify the predecessor truthfully
  -> publish one RunStarted event and one scene transition
  -> acknowledge the first visible frame citing the new run and participant generations
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

## Validation boundary

Documentation only. Runtime, input, simulation, physics, streaming, Worker, camera, rendering, package, dependency, and deployment behavior are unchanged. No start/restart fixture was run.
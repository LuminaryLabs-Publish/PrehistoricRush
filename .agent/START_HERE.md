# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T21-51-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `run-start-restart-admission-authority-audited`

## Summary

PrehistoricRush composes a full Nexus Engine runner with Core Motion/Physics, Rapier, deterministic patch streaming, a procedural creature, Three.js presentation, and browser controls. The current audit isolates run start and restart admission: Enter calls `start()` during every route and on key repeat, while `game.start()` unconditionally creates a new run, emits a start event, resets only selected participants, and reuses the predecessor patch controller, Worker, physics, render, and browser-input ownership.

## Plan ledger

**Goal:** make Start, Retry, and Run Again one exactly-once, status-gated transaction that resets or preserves every run-scoped participant under a new run generation before the first visible frame.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` as the oldest eligible current repository.
- [x] Trace scene exits, UI/keyboard start paths, key repeat, public capabilities, domain `start()`, simulation reset, physics, streaming, Worker, camera, render, and input state.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Define the run start/restart parent DSK and fixture boundary.
- [x] Add the timestamped tracker and architecture/system audit family.
- [x] Refresh root routing and machine registry.
- [x] Synchronize central tracking on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable start/restart fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T21-51-38-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T21-51-38-04-00.md
.agent/architecture-audit/2026-07-12T21-51-38-04-00-run-start-restart-admission-dsk-map.md
.agent/render-audit/2026-07-12T21-51-38-04-00-first-run-generation-frame-gap.md
.agent/gameplay-audit/2026-07-12T21-51-38-04-00-enter-repeat-active-run-reset-loop.md
.agent/interaction-audit/2026-07-12T21-51-38-04-00-start-command-status-generation-map.md
.agent/run-lifecycle-audit/2026-07-12T21-51-38-04-00-participant-reset-start-result-contract.md
.agent/deploy-audit/2026-07-12T21-51-38-04-00-start-restart-fixture-gate.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
```

The browser-runtime retirement audit at `2026-07-12T20-10-25-04-00` remains a direct dependency. Restart must retire or explicitly preserve run-scoped participants without creating a second runtime owner.

## Current start loop

```txt
UI button
  -> game status decides Jump or start()

Space
  -> game status decides Jump or start()

Enter
  -> always start(), including active game and key-repeat delivery

start()
  -> game.start() resets RunState/Input and increments runId
  -> reset simulation resolution
  -> emit RunStarted and direct transition to game
  -> refresh content using retained active patches
  -> reuse retained controller, cache, Worker, physics provider/body, renderer, and local held-key booleans
  -> prime streaming and reset camera
```

## Main findings

```txt
start command identity: absent
status/scene admission inside game.start(): absent
Enter active-run guard: absent
KeyboardEvent.repeat guard: absent
exactly-once start result: absent
local held-key retirement: absent
patch-controller run generation/reset: absent
pending Worker run generation: absent
physics body/collider reset receipt: absent
render/content reset receipt: absent
first run-generation frame acknowledgement: absent
```

## Required parent domain

```txt
prehistoric-rush-run-start-restart-admission-authority-domain
```

Required flow:

```txt
StartRunCommand or RestartRunCommand
  -> validate browser/runtime session, scene, status, command ID, and expected run generation
  -> reject key repeat, duplicate, stale, or active-run start by policy
  -> close predecessor run input and asynchronous admission
  -> prepare RunState, Input, simulation, physics, patch/Worker, camera, content, and render participants
  -> reset or explicitly preserve each participant under one successor run generation
  -> atomically commit RunStartResult
  -> publish one RunStarted event and scene transition
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
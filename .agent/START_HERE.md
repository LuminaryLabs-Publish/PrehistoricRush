# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T20-10-25-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `browser-runtime-lifecycle-resource-retirement-authority-audited`

## Summary

PrehistoricRush creates a complete browser game runtime but does not own that runtime's shutdown. The game page allocates engine, physics, Worker/streaming, camera, Three.js resources, global listeners, a public host and a recursive RAF without a stop command, participant barrier, exact-once disposal result or re-entry proof.

The current audit defines one browser-runtime lifecycle authority spanning startup preparation, partial-start rollback, callback and Worker fencing, public-host revocation, ordered engine/physics/render retirement and terminal stop evidence.

## Plan ledger

**Goal:** make game startup, running frames, failure and exit one supervised lifecycle that either owns a fully admitted runtime or retires every accepted participant.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` as the oldest eligible synchronized repository.
- [x] Trace module, engine, physics, Worker, controller, camera, render, listener, RAF and public-host ownership.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Define the runtime lifecycle parent DSK and fixture boundary.
- [x] Add the `20-10-25` tracker and architecture/system audit family.
- [x] Refresh root routing and machine registry.
- [x] Synchronize central tracking on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable lifecycle fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T20-10-25-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T20-10-25-04-00.md
.agent/architecture-audit/2026-07-12T20-10-25-04-00-browser-runtime-lifecycle-dsk-map.md
.agent/render-audit/2026-07-12T20-10-25-04-00-game-render-resource-retirement-gap.md
.agent/gameplay-audit/2026-07-12T20-10-25-04-00-running-frame-unsupervised-exit-loop.md
.agent/interaction-audit/2026-07-12T20-10-25-04-00-start-frame-stop-result-map.md
.agent/runtime-lifecycle-audit/2026-07-12T20-10-25-04-00-callback-worker-render-retirement-contract.md
.agent/deploy-audit/2026-07-12T20-10-25-04-00-runtime-shutdown-reentry-fixture-gate.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
```

## Current runtime loop

```txt
boot
  -> preflight pinned modules
  -> compose engine, physics, Worker/controller, camera and renderer
  -> allocate scene resources and browser callbacks
  -> publish PrehistoricRushHost
  -> start recursive RAF

frame
  -> submit input
  -> engine tick
  -> update streaming/content
  -> apply pose and camera
  -> render world and HUD
  -> schedule successor RAF

exit/failure
  -> no StopRuntimeCommand
  -> no producer barrier
  -> no participant retirement receipts
  -> no exact-once render disposal
  -> no public-host revocation
```

## Main findings

```txt
runtime session/generation: absent
lifecycle state machine: absent
partial-start rollback: absent
retained RAF lease: absent
removable listener lease set: absent
Worker/executor/controller retirement: absent
engine/physics retirement result: absent
Three-adapter dispose surface: absent
public-host revocation: absent
terminal RuntimeStopResult: absent
stop-then-reentry proof: absent
```

Source-level render allocation census:

```txt
40 mesh/geometry allocations
12 material objects
1 player skeleton
1 WebGLRenderer
```

This is not a measured GPU-memory or leak claim.

## Required parent domain

```txt
prehistoric-rush-browser-runtime-lifecycle-authority-domain
```

Required flow:

```txt
start command
  -> participant preparation and leases
  -> commit Running or reverse-order rollback

stop command
  -> close admission
  -> cancel callbacks and listeners
  -> revoke public host
  -> reject/terminate Worker work
  -> retire stream, engine and physics ownership
  -> retire render resources exactly once
  -> publish terminal stop result and journal
  -> permit re-entry only under a new generation
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
candidate lifecycle kits:         35 including parent
```

## Validation boundary

```txt
runtime/gameplay/physics/streaming behavior changed: no
rendering changed: no
package scripts/dependencies/deployment changed: no
npm test: not run
browser lifecycle fixtures: not run
Worker shutdown fixtures: not run
render retirement fixtures: not run
Pages re-entry fixtures: not run
branch created: no
pull request created: no
```

A tab closing or a frame chain ending does not prove deterministic shutdown. Completion requires a terminal result covering callback, Worker, participant, public capability and render-resource retirement for one runtime generation.
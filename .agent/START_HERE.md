# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T16-20-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush has a product-level `start()` operation, but not a coordinated run-reset transaction. Product `RunState` and `InputState` are replaced and Core Simulation resolution is reset; the browser then refreshes current content, moves stream focus and resets the camera. Core Motion, Core Physics, articulation, patch-controller/Worker work, active-content provenance, renderer state and public readback do not commit under one shared run generation.

The keyboard handler also calls `start()` on every `Enter`, including during active gameplay. A new `runId` can therefore appear while other stateful participants still expose predecessor-run frames, histories or asynchronous work.

The technical audit was completed at `2026-07-12T16-11-48-04-00`. The `2026-07-12T16-20-55-04-00` pass verifies the same 45-surface breakdown and reconciles repo-local documentation with the previously stale central ledger. It changes no runtime behavior.

## Plan ledger

**Goal:** make every start or restart an admitted, generation-bound transaction that either commits all required participants together or produces zero partial reset, while keeping repo-local and central tracking aligned.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because repo-local coordinated-reset documentation was newer than central tracking.
- [x] Trace initial start, terminal retry, Space and Enter activation.
- [x] Trace product, simulation, motion, physics, articulation, stream, Worker, content, camera, render and readback state.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Define the missing coordinated run-reset authority.
- [x] Add the technical audit family at `16-11-48`.
- [x] Add the reconciliation tracker and audit family at `16-20-55`.
- [x] Synchronize central tracking on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable reset fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T16-20-55-04-00/project-breakdown.md
.agent/central-sync-audit/2026-07-12T16-20-55-04-00-repo-ledger-machine-registry-contract.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T16-11-48-04-00-coordinated-run-reset-dsk-map.md
.agent/render-audit/2026-07-12T16-11-48-04-00-mixed-generation-first-run-frame-gap.md
.agent/gameplay-audit/2026-07-12T16-11-48-04-00-mid-run-enter-restart-loop.md
.agent/interaction-audit/2026-07-12T16-11-48-04-00-restart-command-prepare-commit-result-map.md
.agent/reset-lifecycle-audit/2026-07-12T16-11-48-04-00-run-generation-participant-barrier-contract.md
.agent/deploy-audit/2026-07-12T16-11-48-04-00-coordinated-reset-fixture-gate.md
.agent/turn-ledger/2026-07-12T16-20-55-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
boot
  -> compose Nexus Engine, official kits, Rapier, stream controller, Worker and Three renderer
  -> game.start()
  -> prime center patch
  -> reset camera
  -> start RAF

run
  -> browser input
  -> engine tick
  -> Core Motion frame and Core Physics request
  -> Core Simulation outcome
  -> streaming release/generation/activation
  -> Three render, HUD and public readback

restart
  -> Retry/Run Again, Space outside gameplay or Enter in any phase
  -> game.start() increments runId
  -> product RunState and InputState are replaced
  -> Core Simulation resolution is reset
  -> existing content is refreshed
  -> stream focus moves to origin and center is primed
  -> camera resets
  -> no shared reset transaction or participant receipt
  -> next RAF renders later
```

## Main finding

```txt
product RunState reset: present
product InputState reset: present
Core Simulation resolution reset: present
camera reset: present
patch-controller reset API: present but not called by restart

restart phase admission: absent
reset transaction ID: absent
cross-domain run generation: absent
Core Motion reset call/result: absent
Core Physics body/request/frame reset result: absent
articulated motion/dynamics reset result: absent
Worker request generation barrier: absent
active-content reset revision: absent
renderer reset policy/result: absent
coherent public RunRestartResult: absent
first visible new-run frame acknowledgement: absent
```

## Domains and kit groups

```txt
routes, profiles and creator
runtime source identity and module admission
browser input, restart activation and RAF
15 Nexus Engine root/subdomain kits
5 official NexusEngine-Kits
14 product/page/Worker kits
9 external/host adapters
2 proof kits
Core Simulation, Motion, Physics and articulation
patch controller, Worker and active content
Three creature, camera, renderer, HUD and public host
run identity, reset admission, participant barrier and rollback
first-visible-run-frame proof
coordinated run-reset authority: missing at runtime
```

## Required parent domain

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

It coordinates restart command admission, run generation, participant preparation, atomic commit/rollback, stale input/Worker/frame rejection, coherent public readback and first-visible-frame acknowledgement. Participant domains retain ownership of their own reset mechanics.

## Current documentation authority

```txt
technical audit: 2026-07-12T16-11-48-04-00
machine registry: schema 79
reconciliation: 2026-07-12T16-20-55-04-00
runtime source changed by either audit: no
```

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff Proof
2. Character Creator Draft, Commit and Preview Frame Authority
2a. Motion / Articulation / Presentation Parity Authority
2b. Pose Contract and Rig Binding Authority
3. Patch Activation and Release Commit Authority
3a. Active Content Materialization and Coalescing Authority
3b. Streamed Content / Outcome Observation Parity Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Committed Frames
6. Stream Cadence and World Readiness
7. Public Host Capability Gateway
8. Coordinated Run Reset and Participant Barrier Authority
9. Runtime Lifecycle and Ordered Disposal
```

Do not treat a new product `runId`, reset camera, successful build or plausible origin frame as proof that the engine, stream, Worker, renderer and visible frame entered the same committed generation.
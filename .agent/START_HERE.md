# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T16-11-48-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush has a product-level `start()` operation, but not a coordinated run-reset transaction. The product replaces `RunState` and `InputState` and resets Core Simulation resolution; the browser then refreshes current content, moves stream focus and resets the camera. Core Motion, Core Physics, articulation, patch-controller/Worker work, renderer state and public readback do not commit under one new run generation.

The keyboard handler also calls `start()` on every `Enter`, including during active gameplay. A new `runId` can therefore appear while other stateful participants still expose predecessor-run frames, histories, work or content provenance.

## Plan ledger

**Goal:** make every start or restart an admitted, generation-bound transaction that either commits all required participants together or produces zero partial reset.

- [x] Compare all ten accessible Publish repositories with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain centrally tracked and root-documented.
- [x] Select only `PrehistoricRush` as the oldest eligible synchronized repository.
- [x] Trace initial start, terminal retry, Space and Enter activation.
- [x] Trace product, simulation, motion, physics, articulation, stream, Worker, content, camera, render and readback state.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Define the missing coordinated run-reset authority.
- [x] Add a timestamped tracker, turn ledger and complete system-audit family.
- [x] Refresh required root `.agent` documents and machine registry.
- [x] Synchronize central tracking on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable reset fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T16-11-48-04-00/project-breakdown.md
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
.agent/turn-ledger/2026-07-12T16-11-48-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
boot
  -> compose Nexus Engine, Rapier, stream controller, Worker and Three renderer
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
  -> button outside game, Space outside game or Enter in any phase
  -> game.start() increments runId
  -> replace product state and reset resolution result
  -> rebuild existing active content
  -> update stream focus and prime center
  -> reset camera
  -> no shared reset generation or participant receipt
  -> next RAF renders later
```

## Main finding

```txt
product RunState reset: present
product InputState reset: present
Core Simulation resolution reset: present
camera reset: present

restart phase admission: absent
reset transaction ID: absent
cross-domain run generation: absent
Core Motion reset call: absent
Core Physics body/request/frame reset: absent
articulated motion/dynamics reset: absent
patch-controller reset policy/result: absent
Worker request cancellation/generation barrier: absent
active-content reset revision: absent
renderer reset policy/result: absent
coherent public reset receipt: absent
first visible new-run frame acknowledgement: absent
```

`Enter` invokes restart without checking the current game status. Immediately after `game.start()`, public state can describe the new run while motion, physics, stream and renderer participants retain predecessor provenance.

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
coordinated run-reset authority: missing
```

## Required parent domain

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

It coordinates restart command admission, run generation, participant preparation, atomic commit/rollback, stale input/Worker rejection, coherent public readback and first-visible-frame acknowledgement. Participant domains retain ownership of their own reset mechanics.

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

Do not treat a new product `runId` or camera reset as proof that the engine, stream, Worker, renderer and visible frame entered the same new generation.
# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T09-01-44-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush now routes movement proposals, physics/fallback observations, pickup admission, goal evaluation, outcome precedence, state patches, events and terminal transitions through Nexus Engine `core-simulation`. The prior collision/goal/pickup precedence defect is therefore materially addressed and has a pure Node policy test.

Run start and restart remain outside that authority. `game.start()` directly replaces run/input resources, resets resolution, emits `RunStarted` and requests a scene transition; the browser then refreshes content, streaming and camera separately before any new committed tick or first-frame receipt exists.

## Plan ledger

**Goal:** make initial start and every restart one authoritative transaction that creates a new run epoch, resets all required consumers and proves the first compatible committed and visible frame.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Avoid concurrent AetherVale and TheOpenAbove documentation work.
- [x] Select only `PrehistoricRush` because eleven runtime/test/pin commits postdate its current audit.
- [x] Trace the new `core-simulation` proposal, observation, resolution and commit flow.
- [x] Trace initial start, retry, input, content refresh, streaming, physics, camera, render, HUD and host readback.
- [x] Identify all interaction loops, domains, kits and offered services.
- [x] Record the implemented outcome-policy advance and the remaining start/restart authority gap.
- [x] Add timestamped architecture and system audits.
- [x] Update documentation directly on `main`; create no branch or pull request.
- [ ] Implement authoritative start/restart and executable cross-consumer fixtures.

## Read this first

```txt
.agent/trackers/2026-07-12T09-01-44-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T09-01-44-04-00-run-start-restart-authority-dsk-map.md
.agent/render-audit/2026-07-12T09-01-44-04-00-new-run-old-frame-provenance-gap.md
.agent/gameplay-audit/2026-07-12T09-01-44-04-00-restart-outside-authoritative-tick-loop.md
.agent/interaction-audit/2026-07-12T09-01-44-04-00-start-command-admission-result-map.md
.agent/run-start-audit/2026-07-12T09-01-44-04-00-run-epoch-reset-first-frame-contract.md
.agent/deploy-audit/2026-07-12T09-01-44-04-00-authoritative-start-restart-fixture-gate.md
.agent/turn-ledger/2026-07-12T09-01-44-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
menu/profile -> creator or gameplay
creator -> draft -> procedural preview -> persistence

initial start or retry
  -> game.start() directly replaces RunState and InputState
  -> reset core-simulation resolution
  -> emit RunStarted and request game transition
  -> refresh dynamic content
  -> update/prime streaming
  -> reset camera

committed gameplay tick
  -> browser input patch
  -> engine.tick
  -> movement/run-state proposal + pickup proposal + goal proposal
  -> kinematic motion request
  -> Rapier observation + fallback-collision observation
  -> product resolution policy
  -> one state patch, event bundle and optional terminal transition
  -> cleanup system requests committed transition

host frame
  -> read committed run state and simulation frame
  -> remove accepted pickups from visible content
  -> update patch streaming
  -> render creature/world/camera
  -> update HUD and public readback
```

## Domains and kit groups

```txt
routes, profile and creator
runtime source identity, pinned import maps and module admission
13 Nexus Engine core kits including core-simulation
5 official NexusEngine-Kits
13 product/page/Worker kits including the resolution policy
9 external/host adapter boundaries
1 outcome-policy proof kit
run, input, movement, proposals, observations, resolution, events and transitions
streaming, terrain, trees, grass, shards, colliders and physics
camera, Three rendering, HUD and public readback
run-start command, epoch, cross-consumer reset and first-frame authority: missing
```

## Main findings

```txt
terminal outcome precedence is now renderer-agnostic and engine-tick-owned
collision beats goal and rejects same-step pickups
pickup-before-goal is supported when no collision occurs
policy outputs are serializable and covered by a pure test

initial start and retry still mutate outside TickContext
game.start replaces state and emits/transitions synchronously
simulation, physics, stream, content, camera and frame revisions are not committed together
public readback can temporarily combine a new run with predecessor tick/physics/stream/frame evidence
no start command ID, run epoch, prepare/commit/rollback or first visible-frame acknowledgement exists
```

## Required parent domain

```txt
prehistoric-rush-run-start-restart-authority-domain
```

It coordinates admitted start commands, run epochs, predecessor checks, run/input/simulation/physics/stream/content/camera reset plans, atomic commit, rollback, stale-result rejection, observations, journals and first-compatible-frame proof.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff Proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation and Release Commit Authority
3a. Active Content Materialization and Coalescing Authority
3b. Shard Identity, Collection Commit and Visible Removal Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration: implemented baseline, integration proof remains
5a. Run Start/Restart Epoch and First-Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

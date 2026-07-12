# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T11-21-01-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush resolves movement, physics/fallback collision, pickup admission, goal evaluation, events and terminal transitions through Nexus Engine `core-simulation`.

The current audit isolates streamed-content parity. The tick samples the previous host-frame collider and pickup set. After outcome commit, the browser may release or activate patches, rebuild visible content, replace physics colliders and render a different world set. No shared content revision or visible-frame receipt proves that simulation and rendering used the same snapshot.

## Plan ledger

**Goal:** make every committed gameplay outcome and its first visible frame cite one immutable active-content revision.

- [x] Compare all ten accessible Publish repositories with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because it had the oldest eligible central entry and newer repo-local audit state.
- [x] Trace engine tick, patch release/activation, content rebuild, collider synchronization, rendering and public readback.
- [x] Identify the interaction loop, domains, 41 kit/proof surfaces and services.
- [x] Define streamed-content revision, observation admission, atomic commit, rollback and visible-frame proof.
- [x] Add a complete timestamped tracker and audit family.
- [x] Refresh required root `.agent` state and machine registry.
- [x] Push `LuminaryLabs-Publish/PrehistoricRush` directly to `main`.
- [x] Synchronize `LuminaryLabs-Dev/LuminaryLabs` directly to `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable parity fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T11-21-01-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T11-21-01-04-00-streamed-content-outcome-parity-dsk-map.md
.agent/render-audit/2026-07-12T11-21-01-04-00-post-tick-stream-visible-content-gap.md
.agent/gameplay-audit/2026-07-12T11-21-01-04-00-stale-collider-pickup-resolution-loop.md
.agent/interaction-audit/2026-07-12T11-21-01-04-00-stream-revision-outcome-result-map.md
.agent/streaming-authority-audit/2026-07-12T11-21-01-04-00-content-revision-observation-commit-contract.md
.agent/deploy-audit/2026-07-12T11-21-01-04-00-stream-outcome-parity-fixture-gate.md
.agent/turn-ledger/2026-07-12T11-21-01-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
boot
  -> import pinned Nexus Engine, Kits, ProtoKits, Three and Rapier modules
  -> compose engine, product, physics, streaming, camera and render owners
  -> direct game.start()
  -> prime center patch and reset camera

frame
  -> patch browser input into product input state
  -> engine.tick(dt)
     -> movement/run proposal
     -> pickup sampling from previous adapter view
     -> Rapier and fallback collision observations from previous collider set
     -> product outcome resolution and commit
  -> rebuild accepted pickup visibility
  -> release patches and rebuild content/colliders
  -> generate and activate ready patches
  -> rebuild content/colliders again
  -> render resulting world
  -> update HUD and public host readback
```

## Main finding

```txt
simulation observation set: previous host-frame content
post-tick rendered set: newly released/activated content
shared active-content revision: absent
shared active patch digest: absent
shared collider digest: absent
shared pickup digest: absent
visible-frame acknowledgement: absent
```

This permits a released collider to commit a failure while being absent from the displayed frame, and a newly activated collider or pickup to appear before it participates in outcome resolution.

## Domains and kit groups

```txt
routes, profile and character creator
runtime source identity, import preflight and pinned module graph
13 Nexus Engine core kits
5 official NexusEngine-Kits
13 product/page/Worker kits
9 external/host adapters
1 outcome-policy proof kit
product run, proposal, observation, resolution, event and transition
Worker/fallback patch generation, queue, cache, release and activation
terrain, trees, grass, shards, pickups and colliders
Rapier provider, body, motion, contacts and fallback collision
Three scene, creature pose, camera, lighting, rendering and HUD
public host and committed tick/simulation/physics/stream/camera readback
validation, static build and Pages deployment
streamed-content/outcome parity authority: missing
```

## Required parent domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

It coordinates active-content identity, patch/collider/pickup digests, stream-delta admission, immutable observation context, mixed-revision rejection, atomic content/physics commit, rollback, stale Worker rejection, outcome provenance and first-visible-frame acknowledgement.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff Proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation and Release Commit Authority
3a. Active Content Materialization and Coalescing Authority
3b. Streamed Content / Outcome Observation Parity Authority
3c. Shard Identity, Collection Commit and Visible Removal Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration: implemented baseline, cross-consumer parity incomplete
5a. Run Start/Restart Epoch and First-Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

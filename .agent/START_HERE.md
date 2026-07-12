# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T11-11-34-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush now resolves movement, physics/fallback collision, pickup admission, goal evaluation, events and terminal transitions through Nexus Engine `core-simulation`.

The current audit isolates the next authority gap: the tick resolves against the previous host-frame collider and pickup set, then the browser releases and activates streamed patches, rebuilds visible content, replaces physics colliders and renders. The committed simulation frame and visible frame therefore do not prove that they used the same streamed-content revision.

## Plan ledger

**Goal:** make each run outcome cite the exact active patch, collider, pickup and visible-content revision used for simulation and rendering.

- [x] Compare all ten accessible Publish repositories with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because runtime, pin and module-admission commits postdate its central audit.
- [x] Trace Nexus Engine proposal, observation, resolution and committed-frame behavior at the pinned runtime revision.
- [x] Trace patch release, generation, activation, content rebuild, physics collider replacement and render ordering.
- [x] Identify the full interaction loop, domains, 41 implemented/adapted/proof surfaces and services.
- [x] Define streamed-content revision, observation admission, atomic commit and visible-frame proof contracts.
- [x] Refresh required root `.agent` files and add a timestamped audit family.
- [x] Push `LuminaryLabs-Publish/PrehistoricRush` directly to `main`.
- [x] Synchronize `LuminaryLabs-Dev/LuminaryLabs` directly to `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable stream/outcome parity fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T11-11-34-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T11-11-34-04-00-streamed-content-outcome-parity-dsk-map.md
.agent/render-audit/2026-07-12T11-11-34-04-00-post-tick-stream-visible-collider-gap.md
.agent/gameplay-audit/2026-07-12T11-11-34-04-00-stale-collider-pickup-resolution-loop.md
.agent/interaction-audit/2026-07-12T11-11-34-04-00-stream-revision-outcome-result-map.md
.agent/streaming-authority-audit/2026-07-12T11-11-34-04-00-content-revision-observation-commit-contract.md
.agent/deploy-audit/2026-07-12T11-11-34-04-00-stream-outcome-parity-fixture-gate.md
.agent/turn-ledger/2026-07-12T11-11-34-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
boot
  -> preload and import pinned Nexus Engine, kits, Rapier and Three modules
  -> compose 13 core kits, 5 official kits and product domain
  -> install Rapier provider, dino body, patch controller, camera and renderer
  -> start run, prime center patch and reset camera

frame
  -> patch browser input into product input state
  -> engine.tick(dt)
     -> derive next movement state
     -> sample adapter.view.pickups from the previous host frame
     -> submit kinematic motion request
     -> step physics against the previous synced collider set
     -> sample fallback collision against the previous adapter collider set
     -> resolve collision, pickups and goal
     -> commit run state, events and optional terminal transition
  -> read committed run state
  -> remove accepted pickups from visible content
  -> update patch-controller focus
  -> release patches and rebuild all active content
  -> pump generation
  -> activate at most one ready patch and rebuild all active content
  -> sync the new collider set to core physics
  -> render the new visible content set
  -> publish HUD and host readback
```

## Main finding

```txt
simulation observation set: previous host-frame content
post-tick rendered set:      newly released/activated content
shared content revision:     absent
shared active patch digest:  absent
shared collider digest:      absent
shared pickup digest:        absent
visible-frame acknowledgement: absent
```

This permits two opposite failures:

```txt
released-after-tick collider
  -> may cause a committed failure
  -> is absent from the frame rendered after streaming

activated-after-tick collider or pickup
  -> can be visible in the rendered frame
  -> was not admitted to that tick's collision or pickup resolution
```

## Domains and kit groups

```txt
routes, profile and character creator
runtime source identity, import preflight and pinned module graph
Nexus Engine input, spatial, scene, physics, simulation, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed, procedural creature, instanced batch, patch controller and camera follow
product run, route, surface, proposals, observations, resolution, events and transitions
Worker/fallback patch generation, queue, cache, release and activation
terrain slots, tree cells, grass instances, shards, pickups and colliders
Rapier provider, kinematic body, motion request, step and contacts
Three scene, creature pose, camera, lighting, rendering and HUD
public host and committed tick/simulation/physics/stream/camera readback
validation, static build and Pages deployment
stream/content revision admission and simulation/render parity: missing
```

## Required parent domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

It coordinates active-content revisions, patch-set and collider/pickup digests, pre-tick stream admission, immutable observation context, stale-result rejection, atomic content/physics commit, outcome provenance and first-visible-frame acknowledgement.

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

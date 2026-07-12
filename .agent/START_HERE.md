# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-12T07-09-49-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a persisted procedural raptor, Three.js creator and gameplay renderers, deterministic Worker/fallback patch generation, streamed terrain and vegetation, Rapier/fallback collision, shards, HUD projection and Pages deployment.

The current audit isolates **active content materialization authority**. Patch releases trigger a full tree flush plus complete grass, shard, pickup and collider rebuild. Activating one ready patch repeats that complete work in the same frame. One release-plus-activation frame can visit up to 3,500 grass descriptors, 100 shard descriptors and replace the full fixed-collider set twice before rendering one final state.

All prior runtime-module, input, render-surface, profile, creator, streaming, shard, collision, cadence, readiness, outcome, frame, host, reset and lifecycle audits remain active dependencies.

## Plan ledger

**Goal:** coalesce patch membership changes into one bounded transaction that commits terrain, trees, grass, shards and colliders under one active-content revision and proves the first frame rendered from it.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Avoid overlapping newer unsynchronized `TheOpenAbove` repo-local work.
- [x] Select only `PrehistoricRush` as the next-oldest stable eligible repository.
- [x] Trace controller release/activation, terrain slots, tree batches, grass/shards, colliders, physics and rendering.
- [x] Identify all interaction loops, domains, kits and services.
- [x] Quantify the complete active-set rebuild bound.
- [x] Add timestamped architecture and system audits.
- [x] Update documentation directly on `main`; create no branch or pull request.
- [ ] Implement materialization authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-12T07-09-49-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T07-09-49-04-00-active-content-materialization-dsk-map.md
.agent/render-audit/2026-07-12T07-09-49-04-00-double-rebuild-visible-content-gap.md
.agent/gameplay-audit/2026-07-12T07-09-49-04-00-release-activation-rebuild-loop.md
.agent/interaction-audit/2026-07-12T07-09-49-04-00-patch-delta-materialization-result-map.md
.agent/content-materialization-audit/2026-07-12T07-09-49-04-00-coalescing-budget-commit-contract.md
.agent/deploy-audit/2026-07-12T07-09-49-04-00-materialization-fixture-gate.md
.agent/turn-ledger/2026-07-12T07-09-49-04-00.md
.agent/kit-registry.json
```

## Main findings

```txt
releasePatches performs a complete active-content rebuild
activatePatch performs another complete active-content rebuild
release plus activation can therefore rebuild twice in one frame
all active grass and uncollected shards are recopied on each rebuild
all fixed colliders are reconstructed and replaced on each rebuild
all tree batches are flushed after release and activation
there is no aggregate patch delta or materialization command
there is no elapsed-time or work-unit budget
there is no prepare/commit/rollback boundary
there is no active-content revision or cross-consumer parity digest
there is no first visible-frame acknowledgement
```

## Domains and kit groups

```txt
routes/profile/creator
runtime module graph and import maps
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
9 external and host adapter boundaries
run, streaming, terrain, trees, grass, shards, colliders and physics
camera, Three rendering, HUD and public readback
active-content delta, coalescing, budgeting, revision, commit, rollback and frame authority: missing
```

See the tracker and kit registry for every kit and service.

## Required parent domain

```txt
prehistoric-rush-active-content-materialization-authority-domain
```

It coordinates aggregate release/activation deltas, terrain/tree/grass/shard/collider plans, elapsed-time and work-unit budgets, detached preparation, atomic commit, rollback, stale-plan rejection, parity digests, observations, journals and first-visible-frame proof.

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
5. Run-Step Outcome Arbitration and Terminal Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

Do not add a second streaming owner. Adapt the existing controller and product consumer into one materialization transaction, then make physics, rendering, pickups and readback cite the committed active-content revision.
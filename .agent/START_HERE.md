# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T02-48-17-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` now has deterministic cached patch streaming, but retry creates a new gameplay run without one coordinated reset across streaming, rendering, physics, input, camera and asynchronous Worker state. The next boundary must explicitly retain reusable world cache data while atomically resetting run-owned state and fencing stale deliveries.

## Plan ledger

**Goal:** Document and route the missing run-session authority without duplicating the official patch controller, discarding deterministic cache work or changing runtime behavior.

- [x] Compare all accessible Publish repositories with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush`.
- [x] Identify the active interaction loop, domains, services and kits.
- [x] Separate retainable world state from resettable run state.
- [x] Record the retry dynamic-content defect and epoch gap.
- [x] Add timestamped architecture, render, gameplay, interaction, run-session and deploy audits.
- [x] Refresh the required root `.agent` files.
- [ ] Implement atomic patch admission/activation.
- [ ] Implement run-session reset, stream epoch and lifecycle fixtures.

## Current implementation gate

```txt
PrehistoricRush Run Session Reset Authority
+ Retry / Stream Epoch Fixture Gate
```

## Required companion gate

```txt
PrehistoricRush Seeded Patch Activation Authority
+ Worker / Render / Physics Parity Fixture Gate
```

The patch activation boundary remains the prerequisite because a new run cannot prove reset parity while controller-active and consumer-active state can diverge.

## Read first

```txt
.agent/trackers/2026-07-11T02-48-17-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T02-48-17-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-11T02-48-17-04-00-run-session-reset-dsk-map.md
.agent/render-audit/2026-07-11T02-48-17-04-00-retry-render-state-reconciliation-gap.md
.agent/gameplay-audit/2026-07-11T02-48-17-04-00-start-retry-world-state-loop.md
.agent/interaction-audit/2026-07-11T02-48-17-04-00-start-command-session-admission-map.md
.agent/run-session-audit/2026-07-11T02-48-17-04-00-run-world-cache-reset-contract.md
.agent/deploy-audit/2026-07-11T02-48-17-04-00-retry-stream-epoch-fixture-gate.md
```

Prior active audits:

```txt
.agent/world-streaming-audit/2026-07-11T02-41-37-04-00-worker-cache-consumer-transaction-contract.md
.agent/creature-system-audit/2026-07-11T00-39-25-04-00-body-preset-descriptor-adapter-contract.md
.agent/composition-authority-audit/2026-07-10T23-08-11-04-00-declared-installed-consumed-contract.md
.agent/population-system-audit/2026-07-10T22-42-00-04-00-capacity-generation-commit-contract.md
```

## Selection

The accessible `LuminaryLabs-Publish` inventory contained ten repositories:

```txt
AetherVale          central 2026-07-11T02-10-13-04-00
HorrorCorridor      central 2026-07-11T01-10-28-04-00
IntoTheMeadow       central 2026-07-11T02-28-12-04-00
MyCozyIsland        central 2026-07-11T02-02-59-04-00
PhantomCommand      central 2026-07-11T01-20-51-04-00
PrehistoricRush     central 2026-07-11T00-39-25-04-00
TheOpenAbove        central 2026-07-11T00-49-45-04-00
TheUnmappedHouse    central 2026-07-11T01-38-28-04-00
ZombieOrchard       central 2026-07-11T01-31-15-04-00
TheCavalryOfRome    excluded
```

All nine eligible repositories were tracked and had root `.agent` state. `PrehistoricRush` was selected because it had the oldest central ledger record and its repo-local `2026-07-11T02-41-37-04-00` streamed-world audit had not yet been reconciled centrally.

Only `LuminaryLabs-Publish/PrehistoricRush` was changed in the product organization.

## Product read

`PrehistoricRush` is a browser 3D runner. The player steers, boosts and jumps along a deterministic route while terrain, trees, grass, shards and hazards stream around a procedural skinned raptor.

## Active interaction loop

```txt
pinned browser module graph
  -> install 12 Nexus Engine core kits
  -> install seed, creature, instance-batch and seeded-patch-controller kits
  -> install prehistoric-rush-domain-kit 0.4.0
  -> create deterministic product patch generator
  -> initialize optional module Worker executor
  -> create controller with active/retain/prefetch/cache/budget policy
  -> create Three and Rapier consumers
  -> game.start creates a new run and primes streaming
  -> browser input and engine.tick advance run state
  -> controller focus, release, queue, generation and ready delivery update
  -> terrain, trees, grass, shards, colliders and height consumers update
  -> Rapier, creature pose, camera, render, HUD and host update
  -> RAF repeats
  -> retry can create another run while those owners remain live
```

## Current finding

`game.start()` increments `runId` and replaces `RunState` and `InputState`, but it does not coordinate:

```txt
patch controller active/cache/queue/inflight state
Worker pending requests
Three activePatches and consumer revisions
visible grass and shard instances
gameplay and Rapier collider projection
actor/contact state
browser input latches
camera interpolation and render-local time
first committed frame and host journals
```

The concrete retry defect is:

```txt
collect a shard in an active patch
  -> rebuildActiveContent hides the shard
  -> fail without changing the active patch set
  -> retry resets collectedShardIds
  -> updateStreaming produces no activation or release
  -> rebuildActiveContent is not called
  -> the shard can remain visually absent in the new run
```

## Correct ownership split

### Retain when identity matches

```txt
world seed and generator identity
route samples
validated immutable patch payload cache
creature body descriptor
safe static resource allocations
```

### Reset or reconcile per run

```txt
RunState and InputState
pickup visibility and collected-state projection
gameplay and Rapier collider/contact state
browser input latches
camera smoothing and frame-local presentation state
activation, collision, pickup and frame evidence
```

### Fence by epoch

```txt
queued and inflight patch requests
Worker pending promises
ready patch deliveries
activation and release acknowledgements
```

## Safe implementation order

```txt
1. Version and validate patch content.
2. Make activation and release atomic across all consumers.
3. Add runSessionId and streamEpoch authority.
4. Define world-cache retention and run-owned reset decisions.
5. Reconcile pickups, colliders, height, physics, input and camera before start commit.
6. Quarantine stale Worker/controller results.
7. Publish the first committed frame and bounded JSON-safe results.
8. Add ordered idempotent stop/dispose/restart ownership.
9. Gate Pages with deterministic Node and deployed browser fixtures.
10. Continue creature, core-kit, command and committed-frame work.
```

Do not duplicate the official patch controller or instance-batch kit, clear deterministic caches as a substitute for reset authority, expand population or radius, or treat a changed `runId` as proof that the runtime entered a clean new session.

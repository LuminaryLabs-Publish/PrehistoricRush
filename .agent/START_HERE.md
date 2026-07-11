# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T05-02-00-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` has deterministic patch generation, caching and budgeted delivery, but a patch becomes controller-active or controller-released before terrain, trees, grass, shards, gameplay colliders, Rapier colliders and height sampling prove one shared commit. The next boundary is an acknowledged patch activation and release transaction.

## Plan ledger

**Goal:** Preserve the official seeded patch controller and instance-batch kits while adding product-side content admission, detached consumer preparation, atomic commit, rollback and parity proof.

- [x] Compare all ten accessible Publish repositories with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible central record.
- [x] Re-read the pinned controller and active consumer path.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Record activation and release divergence windows.
- [x] Add timestamped architecture, render, gameplay, interaction, streaming and deploy audits.
- [x] Refresh the required root `.agent` files.
- [ ] Implement acknowledged patch activation and release.
- [ ] Add prepare, commit, rollback and parity fixtures.

## Current implementation gate

```txt
PrehistoricRush Seeded Patch Activation Commit Authority
+ Multi-Consumer Prepare / Commit / Rollback Fixture Gate
```

## Follow-on gate

```txt
PrehistoricRush Run Session Reset Authority
+ Retry / Stream Epoch Fixture Gate
```

Run-session reset must consume a trustworthy patch transaction boundary. A reset cannot prove parity while controller-active and consumer-active state can diverge.

## Read first

```txt
.agent/trackers/2026-07-11T05-02-00-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T05-02-00-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-11T05-02-00-04-00-patch-activation-commit-dsk-map.md
.agent/render-audit/2026-07-11T05-02-00-04-00-multi-consumer-patch-commit-gap.md
.agent/gameplay-audit/2026-07-11T05-02-00-04-00-focus-ready-active-world-loop.md
.agent/interaction-audit/2026-07-11T05-02-00-04-00-ready-delivery-commit-result-map.md
.agent/world-streaming-audit/2026-07-11T05-02-00-04-00-controller-consumer-activation-contract.md
.agent/deploy-audit/2026-07-11T05-02-00-04-00-patch-activation-fixture-gate.md
```

Prior active companion audit:

```txt
.agent/run-session-audit/2026-07-11T02-48-17-04-00-run-world-cache-reset-contract.md
```

## Selection

```txt
PrehistoricRush      selected / 2026-07-11T02-48-17-04-00
TheOpenAbove         tracked  / 2026-07-11T03-01-38-04-00
HorrorCorridor       tracked  / 2026-07-11T03-18-44-04-00
PhantomCommand       tracked  / 2026-07-11T03-41-49-04-00
ZombieOrchard        tracked  / 2026-07-11T03-48-31-04-00
TheUnmappedHouse     tracked  / 2026-07-11T04-00-07-04-00
MyCozyIsland         tracked  / 2026-07-11T04-09-54-04-00
AetherVale           tracked  / 2026-07-11T04-28-33-04-00
IntoTheMeadow        tracked  / 2026-07-11T04-49-30-04-00
TheCavalryOfRome     excluded
```

All nine eligible repositories were already tracked and had root `.agent` state. `PrehistoricRush` was the oldest eligible central record.

## Product read

`PrehistoricRush` is a browser 3D runner. The player steers, boosts and jumps along a deterministic route while cached terrain, trees, grass, shards and hazards stream around a procedural skinned raptor.

## Active interaction loop

```txt
browser input and run simulation
  -> controller focus and desired sets
  -> controller records releases
  -> host takes and mutates release consumers
  -> controller queues and generates patch content
  -> controller marks ready entries active
  -> host mutates terrain, tree and dynamic consumers
  -> host replaces gameplay and Rapier colliders
  -> height sampler reads host active patches
  -> physics, pickup, render, HUD and host readback
  -> RAF repeats
```

## Main finding

The controller spends delivery state before the host proves consumer commit.

```txt
activation:
  controller marks active
  -> host begins side effects
  -> no result or acknowledgement

release:
  controller clears release evidence
  -> host begins retirement side effects
  -> no result or acknowledgement
```

Host consumer mutation is sequential:

```txt
activePatches
terrain slot
terrain arrays and bounds
tree batch cell replacements and flushes
grass and shard instances
gameplay colliders
Rapier fixed colliders
height sampling
```

A malformed payload, capacity failure or injected error can leave those consumers on different revisions while controller diagnostics still report the patch active or released.

## Required ownership split

```txt
seeded-world-patch-controller-kit
  patch identity, cache, desired sets, scheduling, claims and final acknowledgements

prehistoric-patch-activation-authority-domain
  content admission, consumer preparation, commit, rollback and result journal

host consumers
  detached plans, deterministic commit results and resource retirement
```

## Safe implementation order

```txt
1. Add a versioned patch-content schema and admission result.
2. Add non-mutating ready and release claims to the controller.
3. Preflight terrain, tree, grass, shard, collider and height consumers.
4. Commit all required consumers under one activation revision.
5. Acknowledge controller active only after consumer success.
6. Commit releases before clearing controller release evidence.
7. Publish exact controller/consumer parity and first render/physics acknowledgements.
8. Add deterministic rollback, duplicate, stale-claim and capacity fixtures.
9. Build run-session reset and stream epochs on top of this boundary.
10. Add ordered stop, dispose, restart and deployed browser proof.
```

Do not duplicate the official patch controller or instance-batch kit, increase active radius or population, or treat controller-active state as proof that the rendered and physical world committed.
# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

`PrehistoricRush` has deterministic patch generation and budgeted ready delivery, but controller state becomes active or released before terrain, vegetation, pickups, gameplay collision, Rapier collision and height sampling prove one shared commit. This pass documents the required admission, prepare, commit, rollback and parity boundary.

## Plan ledger

**Goal:** Make patch activation and release one observable transaction across the seeded patch controller and every runtime consumer before building run-session reset authority on top of it.

- [x] Compare the complete accessible `LuminaryLabs-Publish` inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories are tracked and have root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible central record.
- [x] Inspect controller ready and release semantics at the pinned NexusEngine-Kits revision.
- [x] Inspect terrain, tree, grass, shard, collider, height and physics consumers.
- [x] Identify the interaction loop, domains, kits and kit services.
- [x] Record activation and release divergence windows.
- [x] Define the required DSK/domain composition and fixture gate.
- [x] Refresh the required root `.agent` files.
- [x] Push documentation directly to `main`.
- [ ] Runtime implementation and executable fixtures remain future work.

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

## Interaction loop

```txt
camera and run state set controller focus
  -> controller.update computes desired sets and records releases
  -> host takes released IDs, clearing controller release evidence
  -> host mutates active patch, terrain, tree and dynamic-content consumers
  -> controller pumps generation
  -> controller.takeReadyPatches marks records active
  -> host receives already-active entries
  -> host mutates activePatches
  -> host writes terrain slot data
  -> host replaces and flushes tree batches
  -> host rebuilds all grass, shards and gameplay colliders
  -> host replaces Rapier fixed colliders
  -> height sampler reads activePatches
  -> render, physics, HUD and host readback continue
```

## Main findings

1. `takeReadyPatches()` adds a patch ID to the controller active set and marks the record `active` before the host starts consumer work.
2. `takeReleasedPatchIds()` clears the controller release set before the host confirms consumer release.
3. Host activation mutates consumers sequentially with no preflight, shared revision, typed result or rollback.
4. Host release deletes `activePatches`, hides terrain and releases tree cells before all downstream rebuilds prove success.
5. `rebuildActiveContent()` rebuilds every active grass and shard instance and submits the full fixed-collider set, but returns no result.
6. Controller snapshots can therefore report active/released truth that the rendered, gameplay, physical or height-sampling world has not committed.

## Required gate

```txt
PrehistoricRush Seeded Patch Activation Commit Authority
+ Multi-Consumer Prepare / Commit / Rollback Fixture Gate
```

## Required proof

```txt
versioned patch payload
  -> admission result
  -> detached activation or release plan
  -> terrain capacity and slot preflight
  -> tree batch capacity preflight
  -> grass and shard capacity preflight
  -> collider and height preflight
  -> atomic consumer commit
  -> controller acknowledgement after consumer success
  -> rollback or retry result
  -> controller-active / consumer-active parity snapshot
  -> first render and physics acknowledgement
```

## Scope

Documentation only. No runtime, dependency, route, rendering, physics or deployment behavior changed.
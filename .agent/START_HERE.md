# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T02-41-37-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` now uses the official seeded world patch controller, deterministic product patch generation, optional Worker execution and stable tree instance batches. The next blocker is no longer patch scheduling; it is proving one atomic activation across terrain, vegetation, pickups, gameplay colliders, Rapier colliders and height sampling.

## Plan ledger

**Goal:** Preserve the new streaming architecture while adding a validated, observable and lifecycle-safe boundary between generated patch delivery and runtime consumption.

- [x] Document the new controller, generator, Worker and batch integrations.
- [x] Identify the interaction loop, domains, services and kits.
- [x] Record render, gameplay, interaction, streaming and deployment gaps.
- [ ] Add patch-content admission and validation.
- [ ] Add Worker/session epochs and stale-result policy.
- [ ] Add detached activation plans and atomic consumer commit.
- [ ] Add controller/consumer parity snapshots.
- [ ] Add reset/dispose ownership and fixtures.

## Current implementation gate

```txt
PrehistoricRush Seeded Patch Activation Authority
+ Worker / Render / Physics Parity Fixture Gate
```

## Read first

```txt
.agent/trackers/2026-07-11T02-41-37-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T02-41-37-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-11T02-41-37-04-00-seeded-patch-streaming-dsk-map.md
.agent/render-audit/2026-07-11T02-41-37-04-00-patch-activation-render-parity-gap.md
.agent/gameplay-audit/2026-07-11T02-41-37-04-00-run-stream-physics-loop.md
.agent/interaction-audit/2026-07-11T02-41-37-04-00-focus-queue-activation-map.md
.agent/world-streaming-audit/2026-07-11T02-41-37-04-00-worker-cache-consumer-transaction-contract.md
.agent/deploy-audit/2026-07-11T02-41-37-04-00-patch-streaming-fixture-gate.md
```

Prior active audits:

```txt
.agent/creature-system-audit/2026-07-11T00-39-25-04-00-body-preset-descriptor-adapter-contract.md
.agent/composition-authority-audit/2026-07-10T23-08-11-04-00-declared-installed-consumed-contract.md
.agent/population-system-audit/2026-07-10T22-42-00-04-00-capacity-generation-commit-contract.md
```

## Selection

The accessible `LuminaryLabs-Publish` inventory contains ten repositories. `TheCavalryOfRome` remains excluded. All nine eligible repositories are centrally tracked and have root `.agent` state.

`PrehistoricRush` was selected because its prior audit was the oldest eligible record and six newer runtime commits installed stable tree batches, the seeded patch controller, deterministic patch generation, Worker execution and cached budgeted streaming.

Only `LuminaryLabs-Publish/PrehistoricRush` was changed.

## Product read

`PrehistoricRush` is a browser 3D runner. The player steers, boosts and jumps along a deterministic route while terrain, trees, grass, shards and hazards stream around a procedural skinned raptor.

## Active interaction loop

```txt
pinned browser module graph
  -> install 12 core kits
  -> install seed, creature, instance-batch and seeded-patch-controller kits
  -> install prehistoric-rush-domain-kit 0.4.0
  -> build deterministic product patch generator
  -> initialize optional module Worker executor
  -> create controller with active/retain/prefetch/cache/budget policy
  -> prime center patch
  -> browser input and engine.tick advance run state
  -> focus updates desired patch sets
  -> controller releases, queues, generates and delivers ready patches
  -> adapter activates at most one patch per frame
  -> terrain, trees, grass, shards, colliders and height source update
  -> Rapier, creature pose, camera, render, HUD and host update
  -> RAF repeats
```

## Current finding

The new ownership split is correct:

```txt
seeded-world-patch-controller-kit owns identity, cache and scheduling
prehistoric-patch-generator owns deterministic content
Worker adapter owns optional execution
instanced-render-batch-kit owns stable tree batch capacity and cell updates
Three/Rapier adapters own runtime consumption
```

The controller marks a delivered patch active before the host proves that every consumer committed it. `activatePatch()` then mutates terrain, tree batches, grass, shards, gameplay colliders, Rapier colliders and height sampling in sequence with no preflight, rollback, typed result or shared revision. Controller snapshots can therefore lead render/physics truth.

The Worker executor also has no retained teardown owner or stream-session epoch, `pump()` has no explicit inflight ceiling, and every activation/release still rebuilds all active grass, shards and colliders on the main thread.

## Safe implementation order

```txt
1. Version and validate the patch-content contract.
2. Add stream/Worker session identity and stale-result admission.
3. Build a detached activation plan with capacity preflight.
4. Commit terrain, tree, grass, shard, collider and height consumers atomically.
5. Publish controller-active versus consumer-active parity.
6. Add bounded generation/activation/lifecycle journals.
7. Add idempotent Worker/controller/adapter disposal.
8. Add Node fixtures, then browser and Pages streaming smoke.
9. Continue the existing creature, composition and command authority work.
```

Do not duplicate the official patch controller or instance-batch kit, expand the active radius, add more population, or treat a controller-active ID as proof that the rendered and physical world is committed.

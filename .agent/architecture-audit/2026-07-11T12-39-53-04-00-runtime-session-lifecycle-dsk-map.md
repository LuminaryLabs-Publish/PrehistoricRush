# Architecture Audit: Runtime Session Lifecycle DSK Map

**Timestamp:** `2026-07-11T12-39-53-04-00`

## Summary

The game host currently composes engine, Worker, physics, rendering and browser callbacks directly in `main()`. The missing architecture is one product runtime-session domain that owns startup, run epochs, cleanup registration, capability revocation and terminal disposal while reusing existing Nexus Engine and official kit contracts.

## Plan ledger

**Goal:** define the DSK boundary and dependency order without creating a parallel engine runtime.

- [x] Map current resource and callback owners.
- [x] Reuse existing run, patch, camera, physics and render domains.
- [x] Define lifecycle candidate kits.
- [x] Define startup, retry and disposal ordering.
- [ ] Implement only after route/profile P0 and patch activation ordering.

## Current ownership

```txt
src/game.js main()
  owns module loading
  owns engine creation
  owns Rapier adapter creation
  owns Worker/executor creation
  owns patch controller creation
  owns camera controller creation
  owns Three adapter creation
  owns browser callbacks
  owns RAF recursion
  owns public global host
  owns no complete lifecycle object
```

## Proposed parent domain

```txt
prehistoric-rush-runtime-session-domain
```

This domain should be a product composition layer over existing kits, not a new engine core.

## Candidate DSK map

```txt
prehistoric-rush-runtime-session-domain
  runtime-session-id-kit
  runtime-lifecycle-state-kit
  runtime-startup-command-kit
  runtime-startup-transaction-kit
  runtime-cleanup-stack-kit
  animation-frame-lease-kit
  listener-lease-kit
  worker-resource-owner-kit
  patch-executor-quarantine-kit
  stream-epoch-fence-kit
  three-resource-owner-kit
  rapier-resource-owner-kit
  public-host-lease-kit
  ordered-runtime-dispose-kit
  startup-rollback-kit
  lifecycle-result-kit
  lifecycle-journal-kit
  lifecycle-observation-kit
  runtime-lifecycle-fixture-kit
```

## Existing domains to update first

```txt
prehistoric-rush-domain-kit
  expose typed run start/reset result and runSessionId

seeded-world-patch-controller-kit adapter
  accept stream epoch and reject stale delivery

module-worker-executor-adapter-kit
  retain disposal and request retirement services

rapier-physics-domain-kit adapter
  expose actor/world reset and terminal disposal results

three-runtime adapter
  own all created resources and idempotent dispose

prehistoric-rush-host-readback-kit
  expose detached lifecycle observation only
```

## Lifecycle state model

```txt
CREATED
STARTING
RUNNING
RESTARTING
STOPPING
DISPOSING
DISPOSED
FAILED
```

Allowed commands and callbacks must be phase-admitted. `DISPOSING`, `DISPOSED` and `FAILED` must reject tick, retry, input, patch activation, physics step and render operations.

## Startup transaction

```txt
allocate runtimeSessionId
  -> create cleanup stack
  -> load/validate module graph
  -> create engine/product domain
  -> create physics owner
  -> create generator/Worker/executor owner
  -> create patch controller owner
  -> create camera owner
  -> create Three resource owner
  -> attach leased callbacks
  -> start leased RAF
  -> publish detached host lease
  -> commit RUNNING
```

Each acquisition registers reverse cleanup before the next acquisition begins.

## Retry transaction

```txt
admit retry command
  -> allocate runSessionId and streamEpoch
  -> fence prior Worker/controller delivery
  -> reset input/game/physics/camera/dynamic consumers
  -> classify immutable cache retention
  -> commit new run
  -> publish first frame carrying new epochs
```

## Ordered disposal

```txt
set STOPPING and reject new commands
cancel RAF and await callback retirement
remove input/listener leases
revoke public host capability
retire controller/executor requests
terminate Worker
release physics actor/colliders/world
release Three scene/GPU resources and canvas
close profile/page resources owned by this session
clear diagnostics/journals by policy
publish stable DISPOSED result
```

## DSK rule

Do not add separate Worker lifecycle, renderer lifecycle and run lifecycle roots. They must compose under one runtime session ID and one cleanup stack, with subsystem-specific results nested in the terminal lifecycle result.

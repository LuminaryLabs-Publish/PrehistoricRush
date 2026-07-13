# Architecture Audit: Browser Runtime Lifecycle DSK Map

**Timestamp:** `2026-07-12T20-10-25-04-00`

## Summary

PrehistoricRush composes simulation, physics, streaming and rendering participants at startup but has no parent authority that owns their lifetime as one browser runtime. The missing boundary is not a renderer utility or Worker helper. It is a product-level lifecycle domain coordinating participant preparation, commit, failure and ordered retirement.

## Plan ledger

**Goal:** define one parent DSK that coordinates runtime lifetime without taking implementation ownership away from engine, physics, streaming, input or rendering domains.

- [x] Map startup participants.
- [x] Map long-lived callbacks and public capabilities.
- [x] Map available participant-specific retirement capabilities.
- [x] Separate participant disposal from lifecycle coordination.
- [x] Define typed start and stop results.
- [x] Define exact-once and stale-callback invariants.
- [ ] Implement providers and fixtures.

## Parent domain

```txt
prehistoric-rush-browser-runtime-lifecycle-authority-domain
```

## Bounded responsibilities

```txt
owns:
  runtime session/generation
  lifecycle phase
  participant registry
  start/stop command admission
  prepare/commit/rollback barriers
  callback and listener leases
  public-host publication lease
  ordered participant retirement
  exact-once stop result
  bounded observations and journals

does not own:
  simulation rules
  physics implementation
  patch generation
  renderer implementation
  individual resource disposal mechanics
```

## Composition

```txt
identity:
  runtime-session-id-kit
  runtime-generation-kit
  runtime-lifecycle-state-kit

commands/results:
  runtime-start-command-kit
  runtime-start-result-kit
  runtime-stop-command-kit
  runtime-stop-admission-kit
  runtime-stop-result-kit

leases:
  raf-lease-kit
  browser-listener-lease-kit
  global-host-publication-lease-kit
  worker-resource-lease-kit
  renderer-resource-lease-kit

participant retirement:
  worker-executor-retirement-kit
  patch-controller-retirement-kit
  engine-runtime-retirement-kit
  physics-provider-retirement-kit
  scene-resource-retirement-plan-kit
  creature-resource-retirement-kit
  instanced-resource-retirement-kit
  material-geometry-retirement-kit

coordination/proof:
  runtime-shutdown-barrier-kit
  exact-once-disposal-kit
  stale-callback-rejection-kit
  runtime-failure-classification-kit
  runtime-retirement-result-kit
  runtime-observation-kit
  runtime-journal-kit
  terminal-visible-frame-ack-kit
  runtime-stopped-ack-kit
```

## Required state machine

```txt
Idle
  -> Starting
  -> Running
  -> Stopping
  -> Stopped

Starting -> Failed
Running  -> Failed
Failed   -> Stopping -> Stopped
```

No participant may publish new commands, callbacks or frames after the runtime generation enters `Stopping`.

## Stop order

```txt
1. admit expected session/generation
2. mark Stopping and close command admission
3. revoke public host and browser input
4. cancel RAF and reject stale callbacks
5. stop new patch generation and reject pending Worker requests
6. remove Worker listeners and terminate Worker
7. retire patch-controller and active-content ownership
8. retire physics bodies, colliders and provider ownership
9. retire scene, creature, instanced and material/geometry resources
10. dispose renderer
11. publish one RuntimeStopResult
12. make repeated stop return the same terminal outcome
```

## Invariants

```txt
one session has one terminal stop result
no resource lease retires more than once
no callback mutates state after Stopping
partial startup retires every accepted participant
public host is unavailable after revocation
Stopped implies no owned Worker, RAF, listener or renderer lease
```

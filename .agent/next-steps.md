# Next Steps: PrehistoricRush Browser Runtime Lifecycle

**Updated:** `2026-07-12T20-10-25-04-00`

## Plan ledger

**Goal:** replace implicit page lifetime with one start/stop authority that owns callback, Worker, engine, physics, render and public-host leases and can prove exact-once retirement.

### Gate 0: preserve current behavior

- [ ] Preserve deterministic gameplay, route, streaming and profile behavior.
- [ ] Preserve pinned module versions and current page routes.
- [ ] Keep participant-specific disposal in participant domains.
- [ ] Add lifecycle coordination without merging run reset and page shutdown.

### Gate 1: freeze lifecycle identities and schemas

- [ ] Add runtime session ID and runtime generation.
- [ ] Define `Idle`, `Starting`, `Running`, `Stopping`, `Stopped` and `Failed`.
- [ ] Define `StartRuntimeCommand`, `RuntimeStartResult`, `StopRuntimeCommand` and `RuntimeStopResult`.
- [ ] Define participant and resource lease schemas.
- [ ] Define lifecycle observation and bounded journal schemas.

### Gate 2: convert startup to participant preparation

- [ ] Register each accepted participant with a lease immediately after creation.
- [ ] Prepare engine, physics, Worker/executor, controller, camera, renderer and listeners before committing Running.
- [ ] Publish the public host only after all required participants prepare.
- [ ] Roll back partial startup in reverse admission order.
- [ ] Classify import, initialization, WebGL, Worker and provider failures.

### Gate 3: own callback producers

- [ ] Retain the RAF handle.
- [ ] Retain named keydown, keyup, blur and resize listener functions.
- [ ] Associate every callback with the runtime generation.
- [ ] Reject callbacks after Stopping or from stale generations.
- [ ] Add visibility/page lifecycle policy explicitly rather than implicitly.

### Gate 4: own Worker and streaming retirement

- [ ] Close patch-controller pumping before Worker retirement.
- [ ] Reject pending executor requests with typed shutdown results.
- [ ] Remove Worker listeners.
- [ ] Terminate Worker exactly once.
- [ ] Reject late Worker results by runtime and stream generation.
- [ ] Retire active patch/controller ownership under explicit policy.

### Gate 5: own engine and physics retirement

- [ ] Close product input and restart admission.
- [ ] Define engine scheduler stop/reset behavior.
- [ ] Retire Core Motion, Core Physics and articulation participant state under page-stop policy.
- [ ] Remove player body and fixed colliders.
- [ ] Retire Rapier provider/world ownership.
- [ ] Return participant-specific retirement receipts.

### Gate 6: own render retirement

- [ ] Add `dispose()` to the Three adapter.
- [ ] Import and call `disposeCreatureMesh()` for the player.
- [ ] Dispose all unique terrain, tree, grass and shard geometries.
- [ ] Dispose all unique materials exactly once.
- [ ] Clear scene and active-content maps.
- [ ] Dispose renderer after callback producers are stopped.
- [ ] Publish render-resource retirement results.

### Gate 7: revoke public capabilities

- [ ] Replace raw `globalThis.PrehistoricRushHost` assignment with a publication lease.
- [ ] Restrict host commands by lifecycle phase.
- [ ] Revoke or replace host with terminal read-only state during stop.
- [ ] Reject stale host references by runtime generation.

### Gate 8: implement idempotent stop

- [ ] Close admission before disposal begins.
- [ ] Execute participant retirement in a fixed order.
- [ ] Continue collecting results when one participant fails retirement.
- [ ] Return the same result for the same stop command.
- [ ] Return `AlreadyStopped` for subsequent stop commands.
- [ ] Preserve unresolved retirement failures in the journal.

### Gate 9: executable proof

- [ ] Add start-stop success fixture.
- [ ] Add repeated stop idempotency fixture.
- [ ] Add stale-generation stop fixture.
- [ ] Add partial-startup rollback fixture.
- [ ] Add frame-failure cleanup fixture.
- [ ] Add pending Worker shutdown and late-result fixtures.
- [ ] Add input/resize-after-stop rejection fixtures.
- [ ] Add renderer/resource retirement fixture.
- [ ] Add public-host revocation fixture.
- [ ] Add stop-then-reentry fixture.
- [ ] Run local browser and deployed Pages matrices.

## Candidate kit order

```txt
prehistoric-rush-browser-runtime-lifecycle-authority-domain
runtime-session-id-kit
runtime-generation-kit
runtime-lifecycle-state-kit
runtime-start-command-kit
runtime-start-result-kit
runtime-stop-command-kit
runtime-stop-admission-kit
runtime-stop-result-kit
runtime-shutdown-barrier-kit
raf-lease-kit
browser-listener-lease-kit
global-host-publication-lease-kit
worker-resource-lease-kit
worker-executor-retirement-kit
patch-controller-retirement-kit
engine-runtime-retirement-kit
physics-provider-retirement-kit
renderer-resource-lease-kit
scene-resource-retirement-plan-kit
creature-resource-retirement-kit
instanced-resource-retirement-kit
material-geometry-retirement-kit
exact-once-disposal-kit
stale-callback-rejection-kit
runtime-failure-classification-kit
runtime-retirement-result-kit
runtime-observation-kit
runtime-journal-kit
terminal-visible-frame-ack-kit
runtime-stopped-ack-kit
browser-reentry-fixture-kit
frame-failure-fixture-kit
worker-pending-shutdown-fixture-kit
pages-lifecycle-smoke-kit
```

## Validation order

```txt
npm test
fixture:partial-startup-rollback
fixture:runtime-start-stop
fixture:stop-idempotency
fixture:stale-generation-stop
fixture:frame-failure-cleanup
fixture:worker-pending-shutdown
fixture:late-worker-result-rejection
fixture:listener-and-raf-retirement
fixture:render-resource-retirement
fixture:public-host-revocation
fixture:stop-reentry-generation
browser lifecycle matrix
Pages lifecycle matrix
```

Do not treat tab closure, route navigation or an apparently stopped frame as proof that callbacks, asynchronous work and GPU resources retired in order.
# Runtime Lifecycle Audit: Callback, Worker and Render Retirement Contract

**Timestamp:** `2026-07-12T20-10-25-04-00`

## Summary

The game page creates participant-specific resources with no shared ownership manifest. Shutdown must therefore be introduced as a lifecycle transaction that first closes producers, then retires asynchronous consumers, then disposes render and public resources. Reversing that order would allow late callbacks to touch retired state.

## Plan ledger

**Goal:** define a deterministic, idempotent retirement contract for every long-lived resource created by the game page.

- [x] Identify callback producers.
- [x] Identify asynchronous Worker/controller participants.
- [x] Identify engine/physics participants.
- [x] Identify scene and renderer resources.
- [x] Define an ordered barrier and terminal result.
- [x] Define partial-startup rollback.
- [ ] Implement lifecycle provider.
- [ ] Execute failure, stop and re-entry fixtures.

## Ownership manifest

```txt
browser callbacks:
  keydown
  keyup
  blur
  resize
  recursive RAF

asynchronous work:
  Worker
  message-worker executor
  patch-controller generation queue
  ready/released patch delivery

simulation:
  Nexus Engine runtime
  Core Simulation
  Core Motion and articulation
  Core Physics and Rapier provider
  product run state

presentation:
  Three scene
  camera and lights
  40 mesh/geometry allocations
  12 materials
  player skeleton
  WebGLRenderer
  HTML HUD

public capability:
  globalThis.PrehistoricRushHost
```

## Stop barrier

```txt
phase 1: close admission
  lifecycle = Stopping
  reject new input, resize, restart and public commands

phase 2: stop producers
  cancel RAF
  remove global listeners
  revoke global host

phase 3: drain asynchronous participants
  stop patch-controller pumping
  reject pending executor requests
  remove Worker listeners
  terminate Worker
  reject late Worker results by generation

phase 4: retire simulation participants
  clear product input
  retire/reset engine participants under stop policy
  retire physics bodies, colliders and provider ownership

phase 5: retire presentation
  detach active content
  dispose player mesh/skeleton
  dispose instanced and terrain geometries
  dispose unique materials
  clear scene references
  dispose renderer

phase 6: publish terminal result
  lifecycle = Stopped or StopFailed
  publish exact retired/failed participant sets
  preserve idempotent terminal result
```

## Partial startup rollback

Every successful startup step must return a lease before the next participant is admitted. If a later step fails, rollback executes in reverse admission order and publishes `RuntimeStartFailed` with the retired and unresolved lease sets.

## Typed result

```txt
RuntimeStopResult {
  runtimeSessionId
  runtimeGeneration
  commandId
  status
  startedAt
  completedAt
  retiredLeaseIds[]
  alreadyRetiredLeaseIds[]
  failedRetirements[]
  rejectedLateCallbacks[]
  publicHostRevoked
  workerTerminated
  rendererDisposed
  journalRevision
}
```

## Exact-once rules

```txt
same stop command ID returns same result
second stop after Stopped returns AlreadyStopped
resource disposer is never invoked twice for one lease
late callbacks can report rejection but cannot mutate state
failure to retire one participant is recorded and does not hide other retirement outcomes
```

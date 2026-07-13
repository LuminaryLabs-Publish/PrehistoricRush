# Validation: PrehistoricRush Browser Runtime Lifecycle

**Updated:** `2026-07-12T20-10-25-04-00`

## Scope

Documentation-only review of game-page module admission, runtime composition, Rapier provider ownership, Worker/controller setup, Three.js allocation, browser callbacks, recursive RAF, public-host publication and available disposal capabilities.

## Plan ledger

**Goal:** distinguish a functioning browser session from executable proof that startup, failure, stop and re-entry retire every owned participant exactly once.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` by the oldest eligible synchronized timestamp.
- [x] Review `game.html` and `src/pages/game.js`.
- [x] Review `src/game.js` startup, adapter, Worker, input, RAF and public-host paths.
- [x] Review `src/render/three-procedural-creature.js` disposal helper.
- [x] Review creator page shutdown as a comparison boundary.
- [x] Confirm no game-runtime lifecycle authority or stop result exists.
- [x] Publish the complete `20-10-25` audit family.
- [x] Change no runtime source, dependency or deployment configuration.
- [x] Create no branch or pull request.

## Source-backed validation performed

```txt
verified game-page preflight loads nine pinned runtime module groups
verified main composes Nexus Engine, Rapier, patch controller, camera and Three adapter
verified optional Worker/executor is created and retained in workerState
verified createThreeAdapter allocates renderer, scene and presentation resources
verified 25 terrain, 10 tree, 3 grass, 1 shard and 1 player mesh/geometry allocations
verified 12 material objects and one player skeleton
verified createThreeAdapter returns no dispose function
verified game imports createCreatureMesh/applyCreaturePose but not disposeCreatureMesh
verified keydown, keyup, blur and resize listeners are anonymous and unretained
verified recursive RAF request ID is not retained
verified startup promise catch does not supervise later frame exceptions
verified global PrehistoricRushHost exposes raw participant objects
verified no StopRuntimeCommand, participant barrier or RuntimeStopResult exists
verified current npm test covers outcome policy and articulation only
```

## Executable proof currently present

```txt
module preflight and startup failure projection exist
creator preview has a partial beforeunload disposal path
creature-mesh disposal helper exists
Worker adapter advertises pending rejection, listener removal and termination
package test command exists
outcome-policy and articulation tests exist
```

## Proof currently absent

```txt
runtime start-result fixture
partial-startup rollback fixture
normal stop fixture
stop idempotency fixture
stale-generation stop fixture
frame-failure cleanup fixture
pending Worker shutdown fixture
late callback rejection fixture
browser-listener removal fixture
RAF cancellation fixture
public-host revocation fixture
render-resource retirement fixture
renderer-disposed acknowledgement
stop-then-reentry fixture
browser and Pages lifecycle matrix
```

## Commands not run in this pass

```txt
npm test
browser start/stop smoke
frame failure injection
Worker pending-request shutdown
WebGL resource retirement inspection
repeated stop/re-entry smoke
Pages lifecycle smoke
```

The GitHub connector supplied current source and write access but no checked-out browser runtime. The direct public clone attempt failed because the execution container could not resolve `github.com`. No executable lifecycle or rendering result is claimed.

## Change-state validation

```txt
runtime source changed by audit: no
gameplay behavior changed by audit: no
physics/streaming behavior changed by audit: no
render behavior changed by audit: no
package scripts or dependencies changed by audit: no
deployment changed by audit: no
branch created: no
pull request created: no
.agent documentation changed: yes
central ledger and internal change log synchronized: yes
```

## Completion boundary

Do not claim deterministic shutdown, leak freedom, exact-once disposal, late-callback safety or re-entry readiness until startup participants are leased, stop closes producers before consumers, every retirement publishes a typed result and browser/Pages fixtures prove a new runtime generation can start without predecessor ownership.
# Validation: PrehistoricRush Coordinated Run Reset

**Updated:** `2026-07-12T16-11-48-04-00`

## Scope

Documentation-only review of PrehistoricRush restart behavior, browser activation, Core Simulation/Motion/Physics/articulation state, patch-controller and Worker lifecycle, active-content materialization, camera reset, renderer submission and public host readback. Runtime source through `e6ee17024ec3f3f1f4de80ea520b5cd7d6ba7c28` was reviewed; pinned Nexus Engine remains `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`.

## Plan ledger

**Goal:** distinguish a product-state restart from executable proof that every stateful participant entered one compatible new run generation.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` by the oldest eligible synchronized timestamp.
- [x] Review initial start, button, Space and Enter activation.
- [x] Review product RunState/InputState reset.
- [x] Review Core Simulation, Motion, Physics and articulation APIs.
- [x] Review patch-controller queues, reset and snapshots.
- [x] Review Worker executor pending-request disposal behavior.
- [x] Review active-content, camera, render and public-host paths.
- [x] Confirm no coordinated prepare/commit/rollback or visible-frame receipt exists.
- [x] Publish the complete `16-11-48` audit family.
- [x] Change no runtime source, dependency or deployment configuration.
- [x] Create no branch or pull request.

## Source-backed validation performed

```txt
verified game.start() increments runId and replaces RunState/InputState
verified game.start() calls coreSimulation.resetResolution()
verified game.start() does not call Core Motion, Core Physics or articulation reset
verified browser start() refreshes active content, updates streaming and resets camera
verified Enter calls browser start() without status admission
verified restart occurs outside authoritative TickContext
verified patch-controller reset() exists but is not called by restart
verified patch-controller retains records, queue, inflight, active and desired sets until reset
verified Worker executor dispose() rejects pending requests and terminates the Worker
verified restart does not dispose or generation-fence Worker requests
verified public host exposes independently advancing game, simulation, physics, stream and camera snapshots
verified renderer returns no first-visible-new-run acknowledgement
verified npm test covers outcome policy and articulation conversion only
```

## Executable proof currently present

```txt
npm test command exists
outcome-policy test exists
player-articulation adapter test exists
runtime module preflight exists
patch-controller snapshot/reset API exists upstream
Worker executor disposal API exists upstream
```

## Proof currently absent

```txt
active-run Enter restart rejection fixture
restart command idempotency fixture
cross-domain run generation fixture
participant prepare/commit/rollback fixture
Core Motion reset parity fixture
Core Physics body/request/frame reset parity fixture
articulation reset parity fixture
patch-controller reset-policy fixture
stale Worker completion rejection fixture
active-content/collider reset parity fixture
coherent public readback fixture
first visible new-run frame acknowledgement
browser and Pages restart matrix
terminal runtime disposal fixture
```

## Commands not run in this pass

```txt
npm test
browser game smoke
Pages game smoke
Worker restart ordering smoke
first-visible-frame capture
```

The GitHub connector supplied current source and write access but no checked-out browser runtime. No executable restart or rendering result is claimed.

## Change-state validation

```txt
runtime source changed by audit: no
gameplay behavior changed by audit: no
motion, physics or articulation behavior changed by audit: no
streaming or Worker behavior changed by audit: no
render behavior changed by audit: no
package or dependencies changed by audit: no
deployment changed by audit: no
branch created: no
pull request created: no
.agent documentation changed: yes
central ledger and internal change log synchronized: yes
```

## Completion boundary

Do not claim coordinated reset until restart is phase-admitted, every required participant prepares and commits under one reset transaction and run generation, predecessor input and asynchronous work are rejected, public readback is generation-coherent and the first visible frame cites the committed reset result.
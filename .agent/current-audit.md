# Current Audit: PrehistoricRush Coordinated Run Reset

**Updated:** `2026-07-12T16-11-48-04-00`  
**Repository head reviewed before this audit:** `04c30a3803c294ef712f10eadabcb3779e26735f`  
**Latest runtime revision reviewed:** `e6ee17024ec3f3f1f4de80ea520b5cd7d6ba7c28`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

PrehistoricRush creates a new product run by replacing `RunState` and `InputState`, incrementing `runId`, clearing the last transition marker and calling `coreSimulation.resetResolution()`. The browser wrapper then rebuilds current active content, moves stream focus to the origin, primes one center patch and resets camera follow.

That sequence is not a coordinated reset transaction. It does not reset or generation-bind Core Motion, Core Physics, articulated motion, articulated dynamics, patch-controller/Worker work, active-content state, renderer state or public readback. `Enter` calls the same path unconditionally during active gameplay, so reset can occur outside a terminal phase and outside authoritative TickContext.

## Plan ledger

**Goal:** make run restart a typed, phase-admitted, generation-bound barrier that atomically commits all required participants and proves the first visible frame.

- [x] Trace all start and restart sources.
- [x] Trace product `start()` mutations.
- [x] Trace Core Simulation, Motion, Physics and articulation state.
- [x] Trace patch controller reset and Worker executor lifecycle.
- [x] Trace active content, camera, renderer and public host state.
- [x] Identify mixed-generation readback and visible-frame gaps.
- [x] Reconcile all domains, kits and services.
- [x] Define the parent domain and fixture boundary.
- [x] Publish the timestamped audit family.
- [x] Refresh root routing and machine registry.
- [x] Synchronize central tracking.
- [ ] Implement and execute coordinated reset fixtures.

## Source-backed current behavior

```txt
product game.start()
  -> previous = RunState
  -> next = initialRunState()
  -> next.runId = previous.runId + 1
  -> next.status = game
  -> lastTransitionStepId = null
  -> coreSimulation.resetResolution()
  -> replace RunState
  -> replace InputState
  -> emit RunStarted
  -> request scene transition

browser start()
  -> game.start()
  -> adapter.refreshDynamicContent(newState)
  -> updateStreaming(newState, primeCenter=true)
  -> adapter.resetCamera(newState)

browser keydown
  -> Enter always calls start()
  -> no status or expected-run admission
```

## Reset participant matrix

```txt
product run/input: reset directly
Core Simulation: resolution result reset only
Core Motion: no reset call
Core Physics: no explicit body/request/frame reset
articulated motion: no reset call
articulated dynamics: no reset call
patch controller: reset API exists but is not called
Worker executor: dispose API exists but no restart barrier is used
active content: rebuilt from current active patch map
camera follow: reset directly
renderer animation time: preserved implicitly
public host: exposes independently advancing participant snapshots
visible frame: no reset transaction acknowledgement
```

## Concrete mismatch paths

### Mid-run Enter

```txt
run N active
  -> Enter
  -> run N+1 product state commits immediately
  -> terminal phase was not required
  -> other participants have no prepare/commit barrier
```

### Split readback between event and next RAF

```txt
game snapshot: run N+1
Core Motion current/history: may still cite run N tick/frame
Core Physics frame/body: may still cite run N
patch controller: previous queue/cache/inflight work remains
renderer: no new-run frame has been submitted
```

### Asynchronous patch result crossing reset

```txt
run N request is inflight
  -> run N+1 starts
  -> no workerRequestGeneration changes
  -> response resolves into the same controller
  -> no result classifies it as predecessor-run work
```

### Partial presentation reset

```txt
camera returns to new-run target
active content changes through host rebuild and activation budget
motion/physics/articulation/render participants return no reset receipts
first visible frame has no compatible-generation proof
```

## Domains in use

```txt
page routes, profile lifecycle and creator
runtime source identity, import map and module admission
browser input, restart activation, RAF and public host
Core Input, Spatial, Scene and Simulation
Core Motion and articulated motion
Core Physics and articulated dynamics
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batch, patch controller and camera follow
product run, route, surface, score, outcome and articulation
run identity, phase admission and reset generation
reset participant preparation, commit, rollback and observations
Rapier body, collider, request, contact and frame state
Worker/fallback generation, queues, cache and active membership
terrain, tree, grass, shard, pickup and collider materialization
Three creature, camera, lighting, rendering and HUD
runtime lifecycle and terminal disposal
Node proof, static Pages deployment and audit tracking
coordinated run-reset authority: missing
```

## Kit and service census

```txt
15 Nexus Engine root/subdomain kits
5 official NexusEngine-Kits
14 product/page/Worker kits
9 external/host adapters
2 proof kits
45 implemented/adapted/proof surfaces total
```

The complete per-kit service inventory is retained in `.agent/kit-registry.json` and the current tracker.

## Required domain

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

## Required invariants

```txt
restart source and phase are admitted before mutation
one reset transaction creates exactly one next run generation
all required participants prepare before any public commit
all participant commit results cite the same reset transaction and run generation
failure produces rollback or an explicit terminal fault, never silent partial reset
predecessor browser, Worker, motion, physics and articulation results are rejected
patch cache preservation follows one declared policy
public readback is marked reset-in-progress until generations align
first visible frame cites the committed reset result
runtime disposal remains separate from reusable run reset
```

The previous pose-contract and motion/presentation audits remain active dependencies. Coordinated reset must clear or rebind their predecessor state rather than replacing those authorities.
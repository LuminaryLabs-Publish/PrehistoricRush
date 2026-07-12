# Project Breakdown: PrehistoricRush Run-Step Outcome Arbitration

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

`PrehistoricRush` has deterministic movement, route progress, streamed world content, Rapier collision, pickups, win/fail transitions and Three.js rendering, but one frame does not commit those systems as one authoritative run step. The simulation can declare victory before host-side collision is checked, while a collision failure can still be followed by a shard pickup in the same frame.

## Plan ledger

**Goal:** define one ordered run-step transaction that stages movement, world readiness, collision, pickups, goal evaluation, terminal outcome, events and the visible frame before committing exactly one result.

- [x] Compare the complete ten-repository `LuminaryLabs-Publish` inventory with central tracking.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible central entry.
- [x] Inspect the run simulation, host RAF, Rapier step, fallback collision, pickup loop, scene transitions, HUD and host readback.
- [x] Identify the interaction loop, domains, kits and offered services.
- [x] Define terminal-outcome ordering, command/result and frame-correlation contracts.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only on `main`.
- [ ] Implement the authority and executable precedence fixtures.

## Repository selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-11T21-00-00-04-00 selected
TheOpenAbove       2026-07-11T21-08-57-04-00
HorrorCorridor     2026-07-11T21-21-12-04-00
PhantomCommand     2026-07-11T21-31-19-04-00
ZombieOrchard      2026-07-11T21-40-49-04-00
TheUnmappedHouse   2026-07-11T21-48-44-04-00
AetherVale         2026-07-11T22-02-01-04-00
IntoTheMeadow      2026-07-11T22-08-13-04-00
MyCozyIsland       2026-07-11T22-20-00-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is in scope for this run.

## Source revision reviewed

```txt
27b4e250f7ab8d3d5c32d576a7ca6382efd9820e
```

## Current interaction loop

```txt
browser input
  -> game.setInput
  -> engine.tick(dt)
     -> update elapsed, yaw, surface and speed
     -> apply jump and gravity
     -> mutate x, z, distance and sampled y
     -> if distance >= goalDistance
          set status = win
          emit RunWon
          request win transition

host after engine tick
  -> read state
  -> update patch streaming
  -> only if state.status == game
       set Rapier actor transform
       step Rapier
       combine Rapier contacts with XZ fallback overlap
       if hit: game.fail(...)
       continue into pickup loop without re-reading status
       if pickup overlaps: game.collectShard(...)
  -> read final state
  -> render world, HUD and button
```

## Concrete precedence defects

### Goal can outrank a same-step collision accidentally

```txt
movement crosses goal and obstacle in one engine tick
  -> domain sets status win
  -> host sees status != game
  -> host skips Rapier and fallback collision checks
  -> win commits without collision admission
```

The product currently has no declared policy proving that goal completion should outrank collision. It is an artifact of where the win check is located.

### Pickup can mutate a terminal failed run

```txt
host detects collision
  -> game.fail sets status run-over and emits RunFailed
  -> same host block continues into pickup loop
  -> collectShard has no status guard
  -> shards increment and ShardCollected emits after RunFailed
  -> final run-over frame can display the post-failure reward
```

### Movement and distance commit before outcome validation

Collision does not admit or reject the proposed movement. Position, route progress, distance and height have already mutated. The failure transition records only collision metadata and does not identify the accepted movement step, safe predecessor pose or terminal arbitration result.

## Domains in use

```txt
page routes and static hosts
player profile schema, storage and cross-context sync
creator draft, preview transition and shared creature rendering
Nexus Engine composition and scene routing
run simulation and input
route progress and surface classification
movement, jump and height sampling
seeded world patch generation, Worker execution and controller
terrain, trees, grass, pickups, colliders and active-content projection
Rapier actor, fixed colliders, step and contacts
manual XZ collision fallback
shard reward mutation and dynamic-content refresh
win/fail scene transition and event publication
camera follow, Three rendering, HUD and public host readback
validation and Pages deployment
run-step outcome arbitration: missing
```

## Implemented kits and offered services

### Nexus Engine core kits

```txt
core-input-kit: actions, bindings and input state
core-spatial-kit: transforms and spatial queries
core-scene-kit: scene registry, transitions and host descriptor
core-physics-kit: physics-provider contract
core-motion-kit: motion capability
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics and frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability and projection
core-diagnostics-kit: diagnostics and readback
core-composition-kit: composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit: deterministic seed and random streams
procedural-creature-body-kit: recipe, descriptor, geometry, topology, skeleton,
  skinning, collision recommendation, content hash, poses and snapshots
instanced-render-batch-kit: cell replacement/release, flush, overflow, bounds,
  statistics and snapshots
seeded-world-patch-controller-kit: patch identity, focus, membership, cache,
  queue, optional executor, delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: position/look/quaternion damping, reset,
  teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run lifecycle, input, route, surface, movement,
  score, outcomes, events, transitions, player creature and snapshot
player-character-schema-kit: defaults, normalization, clamps, colors and deep merge
player-character-profile-store-kit: load, save, patch, reset, revisions,
  localStorage, subscriptions, storage events, BroadcastChannel and close
menu-page-kit: menu shell, profile projection and route links
character-creator-page-kit: responsive controls, draft, debounce save, reset,
  remote projection, showcase, resize and RAF
character-preview-transition-kit: descriptor targeting, morph, topology crossfade,
  pose damping, state and disposal
three-procedural-creature-adapter-kit: SkinnedMesh creation, pose, damping,
  topology comparison, geometry/material/scale updates, opacity and disposal
game-page-entry-kit: browser game runtime loading
drunk-route-generator: samples, nearest query, progress, classification and snapshot
player-raptor-preset-kit: default recipe and capsule collision descriptor
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, request/error protocol
  and transferable delivery
```

### External and host adapter boundaries

```txt
Three runtime: scene graph, geometry, materials, skinning, cameras, lights,
  fog, shadows, resize and render
rapier-physics-domain-kit and Rapier runtime: world bridge, kinematic actor,
  fixed colliders, transforms, step, contacts, snapshots and reset
message Worker executor: request correlation and asynchronous generation
active-content consumer adapter: terrain membership, pickups, colliders and height
host run-step adapter: input submission, engine tick, streaming, physics,
  fallback collision, pickup scan, render and HUD
public host adapter: mutable engine, physics, renderer, controller and snapshots
```

## Required parent domain

```txt
prehistoric-rush-run-step-outcome-authority-domain
```

Candidate kits:

```txt
run-step-command-kit
run-step-id-kit
run-step-predecessor-kit
movement-proposal-kit
movement-result-kit
collision-query-plan-kit
collision-observation-kit
collision-source-arbitration-kit
pickup-candidate-kit
pickup-admission-kit
goal-candidate-kit
terminal-outcome-policy-kit
terminal-outcome-arbitration-kit
run-step-commit-kit
run-event-bundle-kit
run-step-result-kit
terminal-frame-receipt-kit
run-step-journal-kit
run-step-observation-kit
outcome-precedence-fixture-kit
```

## Required transaction

```txt
input + predecessor run state + world/collider revisions
  -> create RunStepCommand
  -> prepare proposed movement without committing terminal state
  -> resolve required world and height evidence
  -> project proposed actor transform
  -> collect Rapier and fallback collision observations
  -> collect pickup and goal candidates
  -> apply explicit precedence policy
  -> choose exactly one outcome: continue, fail or win
  -> admit rewards only under the chosen outcome policy
  -> atomically commit movement, distance, rewards, status and transition
  -> publish one ordered event bundle
  -> render one frame carrying runStepId and outcomeRevision
```

## Minimum policy decisions

```txt
collision versus goal in the same step
collision versus pickup in the same step
pickup versus goal in the same step
whether failed movement retains proposed position and distance
whether terminal frames may contain rewards admitted in the terminal step
which collision source is authoritative when Rapier and fallback disagree
```

## Required fixtures

```txt
goal-only step
collision-only step
pickup-only step
goal + collision same step
collision + pickup same step
goal + pickup same step
goal + collision + pickup same step
Rapier/fallback disagreement
repeated terminal command idempotency
RunFailed cannot be followed by unadmitted ShardCollected
win frame and fail frame carry the accepted outcome revision
```

## Validation boundary

```txt
runtime source changed: no
dependencies changed: no
gameplay changed: no
physics changed: no
rendering changed: no
deployment changed: no
branch created: no
pull request created: no
browser execution: not run
outcome fixtures: absent
```

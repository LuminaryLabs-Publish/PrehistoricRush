# Current Audit: PrehistoricRush Run-Step Outcome Arbitration

**Updated:** `2026-07-11T22-38-54-04-00`

## Summary

`PrehistoricRush` currently splits one gameplay step across two mutation authorities. The Nexus simulation system commits movement, distance and goal completion. The browser host then streams patches, steps Rapier, performs a fallback overlap check, calls failure, scans pickups and renders.

This ordering creates two deterministic authority defects. Reaching the goal changes status to `win` before host collision checks, so a same-step obstacle collision is skipped. When a collision does run, `game.fail()` changes status and emits `RunFailed`, but the host still enters the pickup loop; `collectShard()` has no active-run guard and can emit `ShardCollected` after failure.

The immediately preceding public-host capability audit remains valid. Its future command gateway must submit to the same run-step authority and expose only the committed result/frame.

## Plan ledger

**Goal:** define one transaction that stages movement, world evidence, collision, pickups and goal candidates, selects exactly one outcome, commits state/events/transition once and acknowledges the terminal frame.

- [x] Compare all ten Publish repositories and central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledgers and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible central entry.
- [x] Trace simulation, streaming, physics, fallback collision, pickups, transitions, rendering, HUD and host readback.
- [x] Inventory all domains, kits and services.
- [x] Preserve the 22:29 public-host capability audit.
- [x] Define run-step command, candidates, precedence, commit, event and frame contracts.
- [x] Add timestamped audits and refresh root documentation.
- [ ] Implement and execute outcome-precedence fixtures.

## Selection

```txt
accessible repositories: 10
eligible repositories: 9
new/ledger-missing: 0
root-.agent-missing: 0
selected: LuminaryLabs-Publish/PrehistoricRush
selection basis: oldest eligible central ledger timestamp
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

During the run, a newer repo-local public-host audit at `2026-07-11T22-29-24-04-00` was discovered. It was preserved and incorporated rather than overwritten or causing a second Publish project to be modified.

## Complete interaction loop

```txt
menu/profile
  -> creator or game

creator
  -> local draft
  -> procedural descriptor
  -> shared SkinnedMesh transition
  -> profile persistence
  -> preview frame

game startup
  -> load pinned Nexus Engine/Kits/ProtoKit/Three/Rapier modules
  -> create product kit graph
  -> create Worker-backed patch controller
  -> create Rapier adapter
  -> create Three world, creature, terrain and instancing consumers

RAF
  -> map browser input to game input
  -> engine.tick(dt)
     -> update movement, route, surface, distance and height
     -> if goal reached, set win, emit RunWon, request transition
  -> update streaming from already-mutated position
  -> if status remains game
       set actor transform and step Rapier
       combine Rapier contact and XZ fallback overlap
       if collision, call game.fail and emit RunFailed
       continue into pickup scan
       if pickup overlaps, call collectShard and emit ShardCollected
  -> render Three scene
  -> render HUD and button
  -> expose live owners and independently sampled public host state
```

## Main findings

### 1. Goal and collision precedence is accidental

```txt
same proposed movement reaches goal and collides
  -> goal commits inside engine tick
  -> state.status becomes win
  -> host collision block is skipped
  -> outcome is win
```

There is no versioned product policy declaring goal precedence. The behavior follows source placement.

### 2. Failure does not stop same-step reward mutation

```txt
collision detected
  -> game.fail sets run-over
  -> RunFailed emitted
  -> run-over transition requested
  -> pickup loop still executes
  -> collectShard can increment shards
  -> ShardCollected can emit after RunFailed
```

`collectShard()` checks duplicate pickup identity but not active run status.

### 3. Collision does not admit movement

Position, yaw, speed, route progress, distance and sampled height are already mutated when collision is evaluated. The failure result has no declared predecessor-pose, contact-pose or proposed-pose retention rule.

### 4. Collision sources have no arbitration result

Rapier contacts and the manual XZ overlap are joined with boolean OR. Their source, collider identity, membership revision and disagreement are not preserved in a typed result.

### 5. Terminal frame has no provenance

The renderer and HUD sample final mutable state. They do not cite a `runStepId`, candidate set, policy version, outcome revision, ordered event bundle or transition acknowledgement.

### 6. Public host can bypass future authority

`PrehistoricRushHost` exposes engine, physics, adapter, patch controller and camera-follow owners. Its future replacement must submit typed commands to run-step authority and read the committed frame, not create a parallel mutation path.

## Domains in use

```txt
page routing and static hosts
player profile schema, persistence and cross-context sync
creator draft, transition, viewport and preview frame
pinned module graph identity
Nexus Engine composition and core capabilities
procedural creature descriptor, topology, skeleton, skinning, pose and collision
run lifecycle, input, movement, route, surface, score, pickup and outcomes
patch generation, Worker execution, cache, queue and membership
terrain, tree, grass, pickup, collider and height consumers
Rapier world, actor, colliders, contacts and reset
fallback collision source and collision-source arbitration
camera follow and gameplay view
Three scene, lighting, shadow, instancing and render
HUD, terminal frame and runtime observation
public host capability, command and committed read model
subsystem epochs, reset and lifecycle
validation and Pages deployment
run-step outcome arbitration: missing
```

## Complete kit and service inventory

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
procedural-creature-body-kit: recipe normalization, descriptor generation,
  geometry, topology, skeleton, skinning, collision recommendation,
  content hash, poses and snapshots
instanced-render-batch-kit: cell replace/release, flush, overflow, bounds,
  statistics and snapshots
seeded-world-patch-controller-kit: patch identity, focus, membership, cache,
  queue, executor, ready/release delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run lifecycle, input, movement, route, surface,
  score, pickups, outcomes, events, transitions, player creature and snapshot
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
player-raptor-preset-kit: default creature recipe and capsule collision descriptor
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, request/error protocol
  and transferable delivery
```

### External and host adapter boundaries

```txt
Three runtime module: scene graph, geometry, materials, skinning, cameras,
  lights, fog, shadows, resize and render
rapier-physics-domain-kit: world bridge, kinematic actor, fixed colliders,
  transforms, step, contacts, snapshot and reset
Rapier runtime module: rigid bodies, colliders, queries and world step
message Worker executor adapter: request correlation and asynchronous generation
active-content consumer adapter: patch membership, pickups, colliders and height
creator viewport framing adapter: local bounds, target and distance
creator persistence scheduler: timer replacement and partial-patch commit
creature/camera/render host adapters: gameplay creature, collision fallback,
  pickup scan, camera, lighting, HUD and public readback
```

## Required domain

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
input + predecessor + accepted world/collider revisions
  -> prepare movement without publishing terminal state
  -> prepare actor query pose
  -> collect collision observations
  -> collect pickup and goal candidates
  -> apply versioned precedence policy
  -> select exactly one continue, fail or win outcome
  -> admit movement and rewards
  -> atomically commit run state, event bundle and transition
  -> publish RunStepResult
  -> render and acknowledge one frame carrying outcomeRevision
  -> expose that committed result through the public host read model
```

## Required invariants

```txt
one outcome per runStepId
win cannot bypass collision admission by source order
RunFailed cannot be followed by an unadmitted ShardCollected
terminal reward set is frozen at commit
movement retention on failure follows an explicit policy
Rapier/fallback disagreement is observable
state, events, transition, HUD and scene share outcomeRevision
repeated command cannot duplicate reward or transition
```

## Ordered safe ledges

```txt
1. Route/profile handoff proof
2. Creator draft/commit/preview authority
3. Patch activation/release authority
4. Collider replacement/collision admission
5. Run-step outcome arbitration and terminal frame
6. Stream cadence/time budget
7. World readiness/movement admission
8. Committed gameplay frame/read model
8a. Public host capability gateway
9. Coordinated reset epochs
10. Runtime lifecycle/disposal
```

No runtime behavior changed and no outcome-correctness claim is made.

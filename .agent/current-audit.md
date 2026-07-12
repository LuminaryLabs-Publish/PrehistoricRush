# Current Audit: PrehistoricRush Run Start/Restart Authority

**Updated:** `2026-07-12T09-01-44-04-00`

## Summary

Since the previous audit, PrehistoricRush added `core-simulation`, a product resolution policy, proposal/observation-based outcome resolution, a pure policy test and corrected pinned Nexus Engine imports. Collision, pickup and goal precedence now commit through one authoritative engine tick.

The remaining discontinuity is run creation. Initial start and retry call `game.start()` outside `engine.tick()`. That API directly replaces run/input resources, resets resolution, emits `RunStarted` and requests a scene transition. Content, streaming and camera are then reset by separate browser-host calls with no run-start result or first-frame proof.

## Plan ledger

**Goal:** make run creation one atomic cross-consumer transaction whose epoch is shared by simulation, physics, streaming, content, camera, rendering, HUD and public observation.

- [x] Review the eleven commits after the previous documentation head.
- [x] Trace `core-simulation` installation and product policy registration.
- [x] Trace run proposals, motion requests, observations, resolution, state patch, events and transitions.
- [x] Confirm the pure policy tests cover continue, win, collision precedence, pickup rejection, pickup+goal, duplicate pickup and fallback collision.
- [x] Trace initial `game.start()` and browser retry handling.
- [x] Inventory current domains, 41 kit/proof surfaces and their services.
- [x] Define the missing start/restart authority and fixture boundary.
- [ ] Implement and execute the transaction.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing repositories: 0
root-.agent-missing repositories: 0

AetherVale         active unsynchronized Vulkan-bootstrap audit, skipped
TheOpenAbove       active unsynchronized parchment-map audit, skipped
PrehistoricRush    selected: 11 runtime/test/pin commits after 07:09 audit
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Implemented authoritative tick

```txt
run proposal system
  -> clone predecessor state
  -> apply input/movement/jump/height
  -> submit kinematic target
  -> submit run-state, pickup and goal proposals

observation phase
  -> core physics step
  -> fallback collision sample

resolution policy
  -> fatal collision beats goal and pickups
  -> otherwise accept unique pickups
  -> then resolve goal
  -> return one state patch, event list and optional transition

cleanup
  -> request scene transition once per committed step
```

## Remaining start/restart bypass

```txt
button, Enter or Space while terminal
  -> start()
  -> game.start()
     -> resetResolution()
     -> replace RunState
     -> replace InputState
     -> emit RunStarted
     -> request direct game transition
  -> refreshDynamicContent(new state)
  -> updateStreaming(new state, primeCenter=true)
  -> resetCamera(new state)
  -> wait for next RAF/engine.tick
```

## Source-backed gaps

```txt
no RunStartCommand or command ID
no expected predecessor run/tick/frame revision
no run epoch shared across consumers
no physics body reset result
no patch-controller reset/adoption result
no active-content revision reset result
no camera reset receipt
no scene-transition prepare/commit result
no rollback if one reset participant fails
no stale asynchronous Worker/generation rejection tied to new run epoch
no first committed tick acknowledgement for the new run
no first visible frame acknowledgement
public readback can mix new RunState with predecessor committed-frame evidence
```

## Domains in use

```txt
page routes and profile lifecycle
creator draft, preview, persistence and transition
pinned runtime graph and import-map parity
Nexus Engine input, spatial, scene, physics, simulation, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
product run, route, surface, score, proposals, observations, outcome policy, events and transitions
Worker/fallback patch generation and patch-controller scheduling
active patch, terrain, tree, grass, shard, pickup and collider materialization
Rapier provider, kinematic body, motion requests, contacts and fallback collision
camera follow, creature pose, Three rendering and HUD
public host, committed tick/simulation/physics/stream/camera readback
validation, static deployment and Pages
run-start/restart epoch, cross-consumer reset and first-frame authority: missing
```

## Kit/service census

```txt
13 Nexus Engine core kits
5 official NexusEngine-Kits
13 product/page/Worker kits
9 external/host adapters
1 outcome-policy proof kit
41 implemented/adapted/proof surfaces total
```

The exact names and services are in the timestamped tracker and `.agent/kit-registry.json`.

## Required domain

```txt
prehistoric-rush-run-start-restart-authority-domain
```

## Required invariants

```txt
one accepted start command creates exactly one run epoch
all required reset participants cite that epoch
no new run becomes public before required participants prepare successfully
failure preserves or restores the predecessor committed state
stale Worker, stream, physics or frame results cannot attach to the new run
first committed tick and first visible frame cite the same run epoch
repeated Enter/button/Space starts are idempotent
initial boot and retry use the same transaction
public readback never pairs a new run with predecessor frame evidence
```

Documentation only. No runtime behavior changed by this pass.

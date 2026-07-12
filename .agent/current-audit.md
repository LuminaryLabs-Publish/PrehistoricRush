# Current Audit: PrehistoricRush Streamed Content / Outcome Parity

**Updated:** `2026-07-12T11-21-01-04-00`  
**Runtime revision reviewed:** `6430c623d4e1fa5afb7ed460d5d1624799fbe65d`  
**Documentation head observed before completion:** `057785f0d492e5f57d234017b532e88fd55a309c`

## Summary

The product outcome policy executes inside Nexus Engine `core-simulation`, but collision and pickup evidence comes from browser-host materialization state that is updated after the tick. The committed outcome and the subsequently rendered frame therefore lack a shared active-content revision.

The previous documentation head had advanced root files to this audit but had not published the timestamped tracker and audit files referenced by those roots. This run completes the audit family and central synchronization.

## Plan ledger

**Goal:** ensure every committed continue, pickup, failure or win result is derived from and rendered against one immutable streamed-content snapshot.

- [x] Review post-audit runtime, test, import-pin and module-admission commits.
- [x] Confirm the pinned Nexus Engine revision and `core-simulation` committed-frame behavior.
- [x] Trace run proposals, physics observations, fallback observations, outcome policy and cleanup transition.
- [x] Trace patch release, generation, activation, full content rebuild, collider sync and render.
- [x] Inventory all active domains, 41 implemented/adapted/proof surfaces and services.
- [x] Define the missing content revision, parity digest and fixture boundary.
- [x] Publish the complete timestamped tracker and audit family.
- [x] Synchronize the central repository ledger and internal change log.
- [ ] Implement and execute the runtime authority.

## Source-backed ordering

```txt
engine.tick(dt)
  -> run proposal samples pickupSampler(next)
  -> physics observation steps current provider collider set
  -> fallback observation samples current adapter collider set
  -> policy commits state/events/transition

after tick
  -> accepted pickups can trigger visible-content rebuild
  -> controller focus and membership update
  -> released patches rebuild visible content and sync colliders
  -> ready patch can activate
  -> activation rebuilds visible content and syncs colliders
  -> renderer draws the resulting content set
```

## Source-backed gaps

```txt
no activeContentRevision on run-state proposal
no activePatchSetRevision on pickup or collision observation
no colliderSetRevision on physics frame
no pickupSetRevision on pickup proposal
no stream generation or materialization revision on committed frame
no admission that proposals and observations share one content snapshot
no rollback if collider synchronization fails after state commit
no stale Worker result rejection against the committed observation revision
no visible frame receipt citing simulation and content revisions
```

Nexus Engine's committed frame records step/tick/frame, policy, outcome, accepted/rejected values, events and transition. PrehistoricRush must project product content provenance into typed results and its public read model rather than treating the generic committed frame as sufficient.

## Concrete mismatch paths

### False positive from released content

```txt
tick observes collider C
  -> collision commits failure
  -> updateStreaming releases C's patch
  -> collider set is replaced
  -> frame renders without C
```

### False negative from activated content

```txt
tick resolves without ready patch P
  -> updateStreaming activates P
  -> tree collider or pickup from P becomes visible
  -> physics and pickup resolution did not include P until the next tick
```

## Domains in use

```txt
page routes and profile lifecycle
creator draft, preview, persistence and transition
runtime preflight, source identity and pinned imports
core input/spatial/scene/physics/simulation/motion/camera/animation/graphics/skybox/UI/diagnostics/composition
product run/input/movement/proposals/observations/policy/events/transitions
Worker/fallback patch generation and patch-controller scheduling
active patch, terrain, tree, grass, shard, pickup and collider materialization
Rapier provider, body, motion, current collider set and contact frame
camera follow, creature pose, Three rendering and HUD
public host tick/simulation/physics/stream/camera readback
validation, static build and Pages deployment
streamed-content/outcome parity authority: missing
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

Exact names and services are retained in `.agent/kit-registry.json` and the timestamped tracker.

## Required domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

## Required invariants

```txt
one simulation step admits exactly one active-content revision
physics, fallback collision and pickup sampling cite that revision
content release/activation cannot silently change the set between observation and visible proof
state, event and transition results cite patch/collider/pickup digests
failed content or collider commit preserves the predecessor set
stale Worker and patch results cannot attach to a newer revision
the first visible frame cites the same simulation and content revisions
public readback never combines committed outcome with an unrelated content set
```

Documentation only. No runtime behavior changed by this pass.

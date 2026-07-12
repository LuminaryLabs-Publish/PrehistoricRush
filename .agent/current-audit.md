# Current Audit: PrehistoricRush Streamed Content / Outcome Parity

**Updated:** `2026-07-12T11-11-34-04-00`  
**Repository revision reviewed:** `6430c623d4e1fa5afb7ed460d5d1624799fbe65d`

## Summary

The product outcome policy now executes inside Nexus Engine `core-simulation`, but its collision and pickup evidence is sourced from browser-host materialization state that is updated after the tick. The committed outcome and the subsequently rendered frame therefore lack a shared active-content revision.

## Plan ledger

**Goal:** ensure every committed continue, pickup, failure or win result is derived from and rendered against one immutable streamed-content snapshot.

- [x] Review post-audit runtime, test, import-pin and module-admission commits.
- [x] Confirm the pinned Nexus Engine revision and `core-simulation` committed-frame behavior.
- [x] Trace run proposals, physics observations, fallback observations, outcome policy and cleanup transition.
- [x] Trace `updateStreaming()`, release, activation, full content rebuild, collider sync and render.
- [x] Inventory all active domains, 41 implemented/adapted/proof surfaces and services.
- [x] Define the missing content revision, parity digest and fixture boundary.
- [ ] Implement and execute the authority.

## Source-backed ordering

```txt
engine.tick(dt)
  -> run proposal samples pickupSampler(next)
  -> physics observation steps current provider collider set
  -> fallback observation samples current adapter.view.colliders
  -> policy commits state/events/transition

after tick
  -> accepted pickups trigger visible-content rebuild
  -> controller focus/update
  -> released patches rebuild visible content and sync colliders
  -> generated ready patch can activate
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

Nexus Engine's committed frame records step/tick/frame, policy, outcome, accepted/rejected values, events and transition. It intentionally does not preserve the product's proposal and observation payloads or a product content revision. PrehistoricRush must project the required provenance into typed result fields and a product read model rather than treating the generic frame as sufficient.

## Concrete mismatch paths

### False positive from released content

```txt
tick observes collider C in previous active set
  -> collision commits failure
  -> updateStreaming releases C's patch
  -> collider set is replaced
  -> frame renders without C
```

### False negative from activated content

```txt
tick resolves without ready patch P
  -> updateStreaming activates P
  -> tree/pickup from P becomes visible
  -> physics and pickup resolution did not include P until the next tick
```

## Domains in use

```txt
page routes and profile lifecycle
creator draft, preview, persistence and transition
runtime preflight, source identity and pinned imports
core input/spatial/scene/physics/simulation/motion/camera/animation/graphics/skybox/ui/diagnostics/composition
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
the first visible frame after commit cites the same simulation and content revisions
public readback never combines committed outcome with an unrelated content set
```

Documentation only. No runtime behavior changed by this pass.

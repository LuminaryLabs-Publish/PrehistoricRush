# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-11T22-29-24-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a saved procedural raptor, Three.js character creator, deterministic patch streaming, Rapier collision, gameplay rendering, HUD projection and Pages deployment.

The current documentation ledge is the public browser host. `globalThis.PrehistoricRushHost` exposes the live engine, physics service, Three adapter, patch controller and camera-follow service. Its `getState()` function also samples mutable owners independently, so the host is neither mutation-safe nor a coherent committed-frame read model.

## Plan ledger

**Goal:** replace raw public owner exposure with one immutable committed-state API and one typed, capability-scoped, epoch-fenced command gateway.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all eligible repositories have central ledgers and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible repository.
- [x] Trace menu, creator, gameplay, streaming, physics, render, HUD and public-host loops.
- [x] Identify all domains, kits and offered services.
- [x] Confirm raw mutable runtime owners are publicly reachable.
- [x] Confirm `getState()` independently samples mutable owners.
- [x] Define host capability, command admission, read-model and fixture contracts.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only on `main`.
- [ ] Implement host quarantine and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-11T22-29-24-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-11T22-29-24-04-00-public-host-capability-authority-dsk-map.md
.agent/render-audit/2026-07-11T22-29-24-04-00-raw-render-adapter-host-exposure-gap.md
.agent/gameplay-audit/2026-07-11T22-29-24-04-00-public-owner-bypass-loop.md
.agent/interaction-audit/2026-07-11T22-29-24-04-00-window-host-command-admission-map.md
.agent/host-capability-audit/2026-07-11T22-29-24-04-00-read-model-command-gateway-contract.md
.agent/deploy-audit/2026-07-11T22-29-24-04-00-public-host-isolation-fixture-gate.md
.agent/turn-ledger/2026-07-11T22-29-24-04-00.md
.agent/kit-registry.json
```

Retain the prior creator, streaming, collider, cadence, readiness, committed-frame, reset and lifecycle audits.

## Runtime loop

```txt
page boot
  -> load profile and pinned modules
  -> create Nexus Engine game and domain services
  -> create Worker-backed patch controller
  -> create Rapier and Three adapters
  -> start gameplay

RAF
  -> input
  -> engine tick
  -> patch release, generation and activation
  -> physics transform, contacts and collision
  -> pickup/outcome mutation
  -> Three render
  -> HUD projection

public host
  -> publishes raw internal owners
  -> independently samples game, stream, camera, scene and composition state
```

## Main finding

```txt
window.PrehistoricRushHost.engine
window.PrehistoricRushHost.physics
window.PrehistoricRushHost.adapter
window.PrehistoricRushHost.patchController
window.PrehistoricRushHost.cameraFollow
```

These are live mutable services. A same-page script can bypass normal gameplay, stream, collider, render and lifecycle ordering. `getState()` has no shared committed frame or epoch set proving its samples are coherent.

## Required parent domain

```txt
prehistoric-rush-public-host-capability-authority-domain
```

It must provide:

```txt
versioned capability descriptor
immutable last-committed read model
typed host command envelope
run and subsystem epoch admission
owner-routed command results
raw owner quarantine
bounded host journal
legacy safe compatibility adapter
host mutation-isolation and coherence fixtures
```

## Ordered implementation queue

```txt
1. Route Artifact + Game Profile Handoff Final Proof
2. Character Creator Draft + Commit + Preview Frame Authority
3. Patch Activation / Release Commit Authority
4. Exact Collider Replacement + Collision Admission
5. Stream Cadence + Time Budget Authority
6. World Readiness + Movement Admission
7. Committed Gameplay Frame Authority
7a. Public Host Capability Gateway + Committed Read Model
8. Run / Stream / Collider / Worker / Frame Epoch Reset
9. Runtime Lifecycle + Ordered Disposal
```

## Next safe ledge

```txt
PrehistoricRush Public Host Capability Authority
+ Raw Owner Isolation / Typed Commands / Committed Read Model Fixture Gate
```

Extend the existing committed gameplay-frame and diagnostics owners. Do not add a second simulation, patch controller, physics world, camera loop or render adapter.
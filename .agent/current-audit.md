# Current Audit: PrehistoricRush Public Host Capability Authority

**Updated:** `2026-07-11T22-29-24-04-00`

## Summary

The gameplay host is currently a mutable backdoor rather than a diagnostics boundary. `globalThis.PrehistoricRushHost` exposes the live Nexus Engine instance, Rapier API, Three adapter, seeded patch controller and camera-follow service. Its `getState()` method separately samples gameplay, streaming, camera, composition and scene owners without one committed frame or epoch correlation.

## Plan ledger

**Goal:** publish one immutable committed read model and route any public mutation through typed capability admission instead of exposing internal owners.

- [x] Compare all ten Publish repositories and central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only PrehistoricRush as the oldest eligible repository.
- [x] Trace the full menu, creator and gameplay loops.
- [x] Inventory all domains, kits and services.
- [x] Trace public host construction and returned owners.
- [x] Define read, command, epoch, quarantine and fixture contracts.
- [x] Add timestamped audits and refresh root docs.
- [ ] Implement and execute host-isolation fixtures.

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

## Interaction loop

```txt
menu/profile -> creator or game
creator -> draft -> descriptor -> mesh transition -> save -> preview frame
game boot -> engine -> patch controller/Worker -> physics -> Three adapter
RAF -> input -> tick -> stream -> physics -> gameplay -> render -> HUD
host -> raw live owners + independently sampled getState()
```

## Domains in use

```txt
page routing and static hosts
profile schema, persistence and cross-context sync
creator draft, transition, viewport and preview frame
pinned module graph identity
Nexus Engine composition and core capabilities
procedural creature generation, skeleton, skinning, pose and collision
run lifecycle, input, route, surface, score, pickup and outcome
patch generation, Worker execution, cache, queue and membership
terrain, tree, grass, pickup, collider and height consumers
Rapier world, actor, colliders, contacts and reset
camera follow and gameplay view
Three scene, lighting, shadow, instancing and render
HUD and runtime observation
public host capability, command and read-model authority
committed frame, subsystem epochs, reset and lifecycle
validation and Pages deployment
```

## Kit and service census

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
8 external or host adapter boundaries
```

The complete per-kit service map is in the timestamped tracker and `.agent/kit-registry.json`. It includes all core input/spatial/scene/physics/motion/camera/animation/graphics/skybox/UI/diagnostics/composition services; seed, creature, instancing, patch-controller and camera-follow kits; product, profile, creator, preview, Three creature, route, patch generator and Worker kits; and Three, Rapier, Worker, content, viewport, persistence and host adapters.

## Source finding

```txt
globalThis.PrehistoricRushHost = {
  engine,
  physics,
  adapter,
  patchController: controller,
  cameraFollow,
  versions,
  getState
}
```

The adapter itself exports mutable scene, camera, renderer, active-content and render services. The controller and physics objects expose generation, reset, collider and step services. Public consumers can therefore bypass command ordering, run epochs, stream membership, collider admission and frame commit.

`getState()` independently calls `game.snapshot()`, `controller.getSnapshot()`, `cameraFollow.getSnapshot()` and accesses current composition/scene values. It has no `committedFrameId`, shared subsystem epoch set or state fingerprint.

## Required domain

```txt
prehistoric-rush-public-host-capability-authority-domain
```

Candidate kits:

```txt
host-session-identity-kit
host-capability-descriptor-kit
host-read-capability-kit
host-command-capability-kit
host-command-envelope-kit
host-command-admission-kit
host-run-epoch-fence-kit
host-owner-handle-quarantine-kit
host-committed-read-model-kit
host-frame-provenance-kit
host-command-result-kit
host-observation-journal-kit
legacy-host-compatibility-adapter-kit
host-mutation-isolation-fixture-kit
host-read-model-coherence-fixture-kit
host-stale-command-fixture-kit
```

## Required contract

```txt
read
  -> clone last committed gameplay frame
  -> include run, stream, Worker, collider and frame epochs
  -> include profile/world fingerprints
  -> expose no owner references

command
  -> validate capability, payload, run and expected epochs
  -> dispatch to existing authoritative owner
  -> return typed result
  -> journal without leaking handles
```

## Ordered safe ledges

```txt
1. Route/profile handoff proof
2. Creator draft/commit/preview authority
3. Patch activation/release authority
4. Collider replacement/collision admission
5. Stream cadence/time budget
6. World readiness/movement admission
7. Committed gameplay frame
7a. Public host capability gateway and read model
8. Coordinated reset epochs
9. Runtime lifecycle and disposal
```

No runtime behavior changed and no host-safety claim is made.
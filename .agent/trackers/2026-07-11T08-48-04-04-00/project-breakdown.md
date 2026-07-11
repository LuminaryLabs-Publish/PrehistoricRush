# Project Breakdown: PrehistoricRush Visual Policy Identity

**Timestamp:** `2026-07-11T08-48-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

This run selected `PrehistoricRush` because it was the oldest eligible central-ledger entry and had a newer undocumented runtime change. The current runtime joins the creature neck/head topology and changes grass and shadow presentation, but no canonical visual-policy identity or rendered-frame receipt proves which exact graph produced visible output.

## Plan ledger

**Goal:** update the root `.agent` state so the latest creature, grass and shadow changes are represented as one explicit DSK boundary without displacing P0 patch activation.

- [x] Enumerate all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Compare nine eligible repositories against central ledger entries.
- [x] Confirm root `.agent` coverage.
- [x] Select only `PrehistoricRush`.
- [x] Read the active route and current source graph.
- [x] Read the upstream joined-neck topology change.
- [x] Identify the interaction loop, domains, services and kits.
- [x] Trace grass and shadow policy consumers.
- [x] Define visual-policy identity and fixture gates.
- [x] Keep runtime source unchanged.
- [x] Push only to `main`; create no branch or pull request.

## Repository comparison

```txt
MyCozyIsland     2026-07-11T08-41-02-04-00
IntoTheMeadow    2026-07-11T08-31-33-04-00
AetherVale       2026-07-11T08-18-31-04-00
TheUnmappedHouse 2026-07-11T08-11-14-04-00
ZombieOrchard    2026-07-11T07-59-08-04-00
PhantomCommand   2026-07-11T07-38-25-04-00
HorrorCorridor   2026-07-11T07-30-40-04-00
TheOpenAbove     2026-07-11T07-18-44-04-00
PrehistoricRush  2026-07-11T07-08-45-04-00
```

`PrehistoricRush` also received product runtime commit `219a89ab202fcd1567d0b88812ae0cee606c5ffb` after its prior audit.

## Interaction loop

```txt
module resolution
  -> kit composition
  -> creature and physics binding
  -> Three scene and visual-policy construction
  -> run start
  -> browser input
  -> engine tick
  -> patch streaming and sequential consumer mutation
  -> collision and pickup handling
  -> creature pose and smooth camera
  -> grass, sun and shadow update
  -> Three render
  -> HUD and host projection
  -> RAF
```

## Domains

```txt
source graph
core input/spatial/scene/physics/motion/camera/animation/graphics/UI/diagnostics/composition
determinism
creature generation, geometry, topology, skeleton, skinning, collision and pose
Three creature binding
Rapier binding
patch streaming and Worker execution
terrain/tree/grass/pickup/collider/height consumers
run and route gameplay
camera
grass visual policy
shadow visual policy
render submission and observation
runtime lifecycle
deployment and validation
```

## Kit and service census

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
5 product/local kits
3 external runtime/physics kits
host-implied adapters, consumers, policy and observation kits
```

Services include input, scene, physics, movement, camera, animation, graphics, diagnostics, composition, deterministic random streams, creature geometry/skeleton/pose/collision, patch scheduling and cache, instanced batches, route simulation, Worker generation, terrain/tree/grass/pickup/collider/height consumption, Three/Rapier binding, lighting/shadows, HUD and public observations.

## Primary finding

```txt
visual output changed
  -> source pin changed
  -> exact creature topology changed
  -> grass geometry/shader/palette changed
  -> shadow map/frustum/bias/caster policy changed
  -> renderer label changed manually

but:
  no graph manifest
  no visual policy schema
  no canonical fingerprint
  no typed binding result
  no committed frame receipt
```

## Ordered implementation queue

```txt
P0 patch activation transaction
P1 visual-policy graph identity and binding/frame proof
P2 camera transform/frame proof
P3 run reset and shared epochs
P4 Worker quarantine and full disposal
```

## Output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-11T08-48-04-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T08-48-04-04-00.md
.agent/architecture-audit/2026-07-11T08-48-04-04-00-visual-policy-identity-dsk-map.md
.agent/render-audit/2026-07-11T08-48-04-04-00-neck-grass-shadow-frame-provenance-gap.md
.agent/gameplay-audit/2026-07-11T08-48-04-04-00-run-pose-shadow-grass-frame-loop.md
.agent/interaction-audit/2026-07-11T08-48-04-04-00-render-policy-admission-result-map.md
.agent/visual-policy-audit/2026-07-11T08-48-04-04-00-module-graph-shadow-grass-contract.md
.agent/deploy-audit/2026-07-11T08-48-04-04-00-visual-policy-fingerprint-fixture-gate.md
```
# Current Audit: PrehistoricRush Fixed Collider Retirement and Collision Admission

**Updated:** `2026-07-11T14-20-32-04-00`

## Summary

The streamed world removes released patch colliders from `view.colliders`, but the pinned `rapier-physics-domain-kit` treats `setFixedColliders()` as add-or-update rather than authoritative replacement. Its serializable state is replaced, while its live `fixedBodies` and `fixedColliders` maps and Rapier world retain removed IDs.

`collectContacts()` iterates the retained runtime collider map. A tree from a released patch can therefore remain collision-active after its terrain and tree instances disappear. The product then treats any Rapier contact involving the dino as fatal, without verifying current patch membership, hazard tags, collider revision or contact provenance.

## Plan ledger

**Goal:** define one collider membership revision and one collision admission result shared by patch release, Rapier runtime state, visual presence, gameplay failure and diagnostics.

- [x] Verify active patch collider reconstruction.
- [x] Verify patch release behavior.
- [x] Verify pinned ProtoKit fixed-collider replacement behavior.
- [x] Verify live Rapier maps are not pruned.
- [x] Verify contact collection iterates retained runtime colliders.
- [x] Verify product failure admission accepts every Rapier dino contact.
- [x] Compare the Rapier and descriptor-overlap collision paths.
- [x] Catalog domains, kits and services.
- [ ] Implement removal and authoritative replacement.
- [ ] Add stale-collider, parity and terminal-frame fixtures.

## Source path

```txt
prehistoric patch generation
  -> patch.colliders

adapter active content
  -> view.colliders = colliders from activePatches only
  -> physics.setFixedColliders(view.colliders)

ProtoKit setFixedColliders
  -> normalize each submitted collider
  -> applyFixed creates or moves current IDs
  -> replace state.colliders with current normalized object
  -> does not remove runtime fixedBodies/fixedColliders absent from the list

ProtoKit collectContacts
  -> iterate runtime.fixedColliders
  -> Rapier intersectionPair can succeed for an ID absent from state.colliders
  -> emit contact actorId/colliderId

product collision admission
  -> any dino Rapier contact OR current XZ fallback overlap
  -> game.fail({ kind:"tree-impact" })
```

## Exact stale-collider sequence

```txt
1. Patch A is active and contributes tree-A collider.
2. setFixedColliders([...tree-A...]) creates a fixed body and collider.
3. Player moves far enough for Patch A to release.
4. adapter removes Patch A from activePatches and hides/releases its render objects.
5. rebuildActiveContent omits tree-A and submits a smaller list.
6. ProtoKit replaces state.colliders, but tree-A remains in runtime.fixedBodies,
   runtime.fixedColliders and the Rapier world.
7. collectContacts still tests tree-A with intersectionPair.
8. Product accepts the contact without checking current membership.
9. The run enters run-over at an invisible retired tree.
```

## Shape and parity gap

Generated trees are visually tall trunks:

```txt
height: 14 to 68
radius: approximately 1.25 to 3.4
```

The collision descriptor is:

```txt
shape: ball
center: ground sample
radius: trunk radius * 1.3
```

The fallback path is different again:

```txt
horizontal circle overlap only
jumpHeight < 1.05
no collider Y/height test
```

Current rendering, Rapier and fallback therefore do not share one shape, membership revision or result.

## Domains in use

```txt
patch identity and desired membership
patch activation and release
tree render instance membership
active collider descriptor projection
Rapier fixed body/collider runtime
collision contact collection
fallback overlap detection
hazard admission
run failure and scene transition
terminal render and HUD projection
host diagnostics and deployment proof
```

## Complete kit inventory and services

### Core and official kits

```txt
12 Nexus Engine core kits
  input, spatial, scene, physics, motion, camera, animation,
  graphics, skybox, UI, diagnostics and composition

seed-kit
  deterministic seeds and random streams

procedural-creature-body-kit
  creature geometry/skeleton/skin/collision/pose/content identity

instanced-render-batch-kit
  tree cell replace/release, flush, bounds and stats

seeded-world-patch-controller-kit
  patch desired sets, cache, ready/release queues and budgets

camera-smooth-follow-kit
  camera target damping, reset and snapshot
```

### Product and host kits

```txt
prehistoric-rush-domain-kit
  run input, movement, route, score, outcomes and events

prehistoric-patch-generator
  tree render descriptors and tree hazard collider descriptors

prehistoric-patch-worker
  asynchronous patch generation protocol

rapier-physics-domain-kit
  actor registration, fixed-collider submission, step, contacts, snapshot and reset

Three adapter
  active patch membership, tree rendering, collider projection and terminal render

collision fallback adapter
  current-descriptor XZ overlap

run failure adapter
  contact/overlap to game.fail
```

## Findings

### 1. Replacement is not replacement

`setFixedColliders()` returns a state containing only the submitted collider set, but live Rapier maps retain all previously created IDs.

### 2. Released collider resources are not retired

No `removeFixedCollider`, `removeFixedBody`, `replaceFixedColliders`, retirement result or removed-ID count exists.

### 3. Contact collection uses a different membership source

The state snapshot says an old collider is gone, while `collectContacts()` still iterates the runtime map containing it.

### 4. Gameplay admits contacts without provenance

The product checks only `contact.actorId === "dino"`. It does not require current membership, hazard tags, patch identity, collider revision or a newly-entered contact edge.

### 5. Two collision authorities diverge

Rapier can report a stale invisible collider. The fallback can only report current descriptors and uses a different vertical/shape rule.

### 6. Patch release has no collision acknowledgement

The patch controller and renderer can consider release complete before physics confirms retired bodies and colliders are removed.

## Required authority boundary

```txt
PrehistoricRush Fixed Collider Membership and Collision Admission Domain
  patch-collider-identity-kit
  collider-membership-revision-kit
  fixed-collider-replacement-plan-kit
  fixed-collider-retirement-kit
  rapier-collider-removal-adapter-kit
  collider-retirement-result-kit
  collision-contact-observation-kit
  collision-contact-admission-kit
  collision-source-parity-kit
  run-failure-transaction-kit
  collision-journal-kit
  collision-render-correlation-kit
  stale-collider-fixture-kit
```

## Acceptance conditions

```txt
submitted fixed collider set becomes the exact live Rapier set
removed IDs no longer exist in runtime maps or Rapier world
patch release waits for collider retirement acknowledgement
contact includes collider ID, patch ID, membership revision and source
only current hazard contacts can fail a run
one contact produces at most one terminal failure transaction
Rapier and visual active memberships match
fallback is removed or proven equivalent under the same descriptors
released invisible colliders cannot fail the current run
terminal frame references the admitted collision result
```

## Priority placement

```txt
P0 route/profile handoff
P1 patch activation commit
P1a fixed collider retirement and collision admission
P2 render-frame identity
P3 run/session reset
P4 runtime lifecycle/disposal
```

No runtime source was changed by this audit.

# Architecture Audit: Population Admission Transaction

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Current ownership

```txt
src/game.js populate()
  -> window selection
  -> deterministic candidate coordinates
  -> route/terrain classification
  -> direct instanceMatrix writes
  -> collider and pickup array writes
  -> active draw-count writes
  -> Rapier fixed-collider replacement
```

This is one host function rather than a composed domain boundary. It owns generation policy, admission, rendering, gameplay collision, collectible identity, physics projection, and commit timing.

## Existing DSK services used

```txt
route-field-domain-kit
  nearest route query and region classification
surface-traversal-domain-kit
  runtime resistance only; not population admission
forest-archetype-domain-kit
  tree descriptor catalog
grass-patch-domain-kit
  layer descriptors and route scale
grass-wind-domain-kit
  presentation wind
procedural-dino-body-domain-kit
  player body and pose
rapier-physics-domain-kit
  fixed-collider replacement
```

## Missing domain boundaries

```txt
population-candidate-domain
instance-pool-capacity-domain
population-admission-domain
population-plan-domain
population-parity-domain
population-generation-commit-domain
population-fingerprint-domain
population-observation-domain
```

## Recommended composition

```txt
PopulationCandidateKit
  -> stable source rows
InstancePoolCapacityKit
  -> immutable capacities and admission budgets
PopulationAdmissionKit
  -> admitted/rejected/truncated rows
PopulationPlanKit
  -> detached matrices, colliders, pickups, physics rows
PopulationParityKit
  -> cross-projection ID and count validation
PopulationGenerationCommitKit
  -> atomic live-state mutation or rejection
PopulationFingerprintKit
  -> deterministic generation proof
PopulationObservationKit
  -> clone-safe host readback
```

## Ownership rule

Update the existing forest, grass, shard, physics, and host owners first. A new kit is justified only for cross-family admission, parity, commit, fingerprint, or observation responsibilities that no current domain owns.

## Required result shape

```txt
PopulationGenerationResult {
  generationId,
  windowKey,
  accepted,
  reason,
  fingerprint,
  pools: { capacity, requested, admitted, written, truncated, rejected },
  parity: { treeCollider, shardPickup },
  previousGenerationPreserved
}
```

## Dependency order

```txt
candidate identity
  -> immutable capacity
  -> admission
  -> detached plan
  -> parity validation
  -> atomic commit
  -> fingerprint
  -> host observation
  -> fixture/deploy gate
```
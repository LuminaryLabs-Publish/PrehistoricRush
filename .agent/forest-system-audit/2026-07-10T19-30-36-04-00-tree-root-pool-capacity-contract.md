# Forest System Audit: Tree and Root Pool Capacity Contract

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Current forest model

```txt
7 trees per chunk
7 x 7 active chunk window
five deterministic archetypes
one trunk and crown pool per archetype
four root instances requested per admitted tree
one gameplay collider per admitted tree
```

## Capacity risks

```txt
maximum tree candidates before route rejection: 343
per-archetype trunk capacity: 100
per-archetype crown capacity: 100
root capacity: 400
maximum root requests before route rejection: 1,372
```

The current code increments pool counters and writes matrices without an explicit capacity result. Root count is later assigned directly to the InstancedMesh draw count. Tree and crown admission can also exceed a single archetype pool under an unlucky deterministic distribution.

## Visual/gameplay parity risk

Tree colliders are appended independently from renderer capacity proof. A tree can therefore be represented in collider state without a proven admitted trunk/crown/root render set, or vice versa.

## Required contract

```txt
TreePopulationRequest
  stable treeId
  archetypeId
  transform
  collider descriptor
  root descriptors

TreePopulationResult
  admitted tree rows
  rejected tree rows
  per-pool counts
  overflow reasons

ForestPoolCommitResult
  trunk/crown/root active counts
  immutable capacities
  generation ID
  collider parity count
```

## Fixture cases

```txt
all candidates select one archetype
root demand exceeds 400
route rejection removes most candidates
same window regenerated twice
adjacent window with different density
sparse -> dense -> sparse sequence
collider count equals admitted visible tree count
```
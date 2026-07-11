# Gameplay Audit: Population, Collider, and Pickup Generation Loop

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Current loop

```txt
chunk or pickup invalidates populationKey
  -> populate clears colliders and pickups
  -> candidates are generated per visible chunk
  -> tree matrices and collider rows are written inline
  -> shard matrices and pickup rows are written inline
  -> pool counts are published
  -> Rapier fixed colliders are replaced
  -> gameplay resumes against the new arrays
```

## Gameplay risks

- A tree may receive a collider even when its render pool has overflowed or failed to write.
- A rendered shard and collectible pickup have no shared admitted-row contract.
- The current generation becomes visible piecemeal while it is still being built.
- A failure after arrays are cleared can leave an incomplete gameplay world.
- Rebuilding after pickup collection can alter population rows without a generation result.
- Shard identity is chunk-based while position selection depends on current `routeIndex`.

## Required parity rules

```txt
admitted tree row
  -> exactly one trunk row
  -> exactly one crown row
  -> exactly four admitted root rows or an explicit root-truncation policy
  -> exactly one gameplay collider row
  -> exactly one physics collider row

admitted shard row
  -> exactly one rendered shard row
  -> exactly one pickup row
  -> one stable collectible ID
```

Grass and rocks are render-only families and must be labeled as such in the plan rather than silently omitted from gameplay projection.

## Required commit behavior

The previous committed population must remain authoritative until the complete new plan passes capacity and parity validation. Physics collider replacement must occur in the same commit result as matrix and gameplay-array publication.

## Follow-on gameplay work

Restart/outcome/persistence should not be implemented on top of population state that can diverge between render, collision, pickup, and physics authority.
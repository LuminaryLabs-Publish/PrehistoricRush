# Gameplay Audit: Population Stream and Restart Loop

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Current loop

```txt
menu
  -> Start Rush
  -> partial reset of x, z, distance, routeIndex, and yaw
  -> game
  -> movement updates current terrain chunk
  -> chunk change rebuilds terrain and population
  -> tree contact selects run-over
  -> shard overlap mutates collection and forces repopulation
  -> goal distance selects win
  -> Retry / Run Again call the same partial start reset
```

## Gameplay dependencies on population correctness

```txt
tree pool rows define visible obstacles
collider rows define failure contacts
shard pool rows define visible pickups
pickup rows define collection eligibility
grass and forest density define route readability
population rebuild timing affects what appears around the player
```

The visual population and gameplay rows are assembled in the same function, but there is no shared generation result proving that visible tree instances, collider rows, visible shard instances, and pickup rows were committed from the same deterministic generation.

## Restart gaps still present

The current start function resets position, distance, route index, and yaw, but does not explicitly reset:

```txt
speed
jumpY
vertical velocity
grounded state
time
turn
surface smoothing state
shard count
collected shard IDs
population generation identity
collider and pickup generation identity
```

This pass does not replace the existing restart plan. Population authority should expose generation IDs that a future restart transaction can invalidate and recreate.

## Required gameplay proof

```txt
visible obstacle row and collider row share source ID and generation ID
visible shard row and pickup row share source ID and generation ID
same seed/window produces the same admitted gameplay rows
restart starts a new population generation
old generation contacts and pickups cannot survive restart
capacity truncation cannot create invisible colliders or uncollectable visible shards
```

## Next safe ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```
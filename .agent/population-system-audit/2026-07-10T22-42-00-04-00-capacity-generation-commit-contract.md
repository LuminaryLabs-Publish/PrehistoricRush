# Population System Audit: Capacity and Generation Commit Contract

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Contract goal

One streamed-window generation must be planned, validated, and committed as a unit. Partial matrix, collider, pickup, or physics publication is not valid.

## Capacity model

```txt
InstancePoolState {
  poolId,
  capacity,
  activeCount,
  matrixRevision,
  generationId
}
```

Capacity is immutable after allocation. `activeCount` is a committed presentation count and can never be used as the next admission capacity.

## Plan model

```txt
PopulationPlan {
  generationId,
  windowKey,
  sourceRevision,
  candidates,
  admittedRows,
  rejectedRows,
  poolSummaries,
  colliderRows,
  pickupRows,
  physicsRows,
  fingerprint
}
```

## Commit invariants

```txt
0 <= activeCount <= capacity
activeCount == successful matrix writes
all active slots were written by generationId
tree render IDs == gameplay collider IDs == physics collider IDs
shard render IDs == pickup IDs
no rejected candidate appears in a committed projection
failed validation changes no live pool or gameplay array
```

## Overflow policy

The implementation must choose and document one deterministic policy per family:

```txt
reject whole generation
or
truncate by stable candidate ordering
```

Silent write overflow, engine-dependent behavior, or capacity increases without proof are not valid policies.

## Required fixture matrix

```txt
sparse window after dense window
dense window after sparse window
root demand below, equal to, and above 400
single tree archetype concentration above 100
LOD rejection before active-index allocation
pickup removal and immediate regeneration
same window and inputs repeated twice
failed commit after valid prior generation
```

## Host readback

`PrehistoricRushHost.getState()` should add clone-safe population rows without removing current fields:

```txt
population.currentGeneration
population.poolSummaries
population.parity
population.lastResult
population.fingerprint
```
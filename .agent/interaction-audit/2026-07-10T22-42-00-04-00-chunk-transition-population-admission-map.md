# Interaction Audit: Chunk Transition Population Admission

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Trigger map

```txt
initial mount
  -> terrain.update(0, 0)
  -> populate()

runner crosses terrain chunk boundary
  -> terrain.update() returns true
  -> populationKey cleared
  -> populate()

runner collects one shard
  -> collected ID inserted
  -> shard count incremented
  -> populationKey cleared
  -> populate()

Start / Retry / Run Again
  -> partial runner reset
  -> no explicit population generation transaction
```

## Current admission behavior

Population rebuild is invoked synchronously from the gameplay loop. It has no queued command, trigger result, generation sequence, stale-trigger rejection, or commit status. Multiple trigger reasons collapse into the same mutable `populationKey` invalidation.

## Required trigger result

```txt
PopulationRequest {
  requestId,
  reason: mount | chunk-transition | pickup-collected | restart | explicit-refresh,
  requestedWindowKey,
  priorGenerationId,
  runnerRouteIndex,
  collectedRevision
}
```

```txt
PopulationRequestResult {
  accepted,
  reason,
  generationId,
  committedWindowKey,
  coalescedRequestIds,
  previousGenerationPreserved
}
```

## Admission rules

- Identical requests for the already committed window and collection revision should be no-op results.
- A newer request must supersede stale uncommitted work deterministically.
- Restart must explicitly choose whether it reuses or rebuilds population and record that decision.
- Pickup collection must correlate the removed collectible ID with the next committed population fingerprint.
- Rendering and physics must consume only a committed generation.
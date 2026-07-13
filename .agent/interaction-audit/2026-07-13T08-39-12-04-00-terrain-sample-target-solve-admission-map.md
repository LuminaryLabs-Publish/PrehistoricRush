# Interaction Audit: Terrain Sample to Target Solve Admission

**Timestamp:** `2026-07-13T08-39-12-04-00`

## Summary

The current API installs an unversioned `sampleHeight` callback and later calls it synchronously during the run tick. The callback returns only a number, so the domain cannot distinguish an exact active-patch sample from fallback height, stale membership, missing content or provider failure.

## Plan ledger

**Goal:** replace scalar callback trust with typed sample and target results while retaining a renderer-agnostic game domain.

- [x] Identify callback installation and call sites.
- [x] Identify all information lost at the callback boundary.
- [x] Define command/result admission stages.
- [ ] Implement the contract and focused fixtures later.

## Current interaction map

```txt
createThreeAdapter()
  -> define sampleHeight(x,z)
  -> active patch ? bilinear patch sample : procedural fallback
  -> game.setHeightSampler(sampleHeight)
  -> heightSamplerReady = true

run tick
  -> next.y = heightSampler(rootX, rootZ)
  -> evaluate source pose
  -> createPlayerGroundLegTargets(... sampleHeight ...)
  -> sample left foot
  -> sample right foot
  -> return scalar heights
  -> create target objects
  -> articulatedMotion.solve(targets)
  -> store solved pose only
```

## Information lost at admission

```txt
sampler ID and generation
patch-stream revision
patch ID and content hash
terrain generator version/settings hash
exact-patch versus fallback source
sample command ID
sample sequence
missing/stale/failed classification
root/left/right batch identity
predecessor target-frame ID
target commit result
```

## Required commands and results

### Terrain sample

```txt
TerrainSampleCommand {
  commandId
  sessionId
  runGeneration
  tickId
  patchStreamRevision
  samplerGeneration
  actorId
  footId | root
  worldX
  worldZ
}

TerrainSampleResult =
  ExactPatch { patchId, contentHash, height, normal? }
  | Fallback { policyId, height }
  | Missing
  | Stale
  | Failed
```

### Target frame

```txt
TerrainFootTargetCommand {
  commandId
  sourcePoseFrameId
  rigRevision
  sampleBatchId
  settingsRevision
}

TerrainFootTargetResult =
  Accepted { targetFrame }
  | Duplicate
  | Stale
  | Invalid
  | Failed
```

## Admission sequence

```txt
validate session/run/tick
  -> bind sampler and patch-stream revisions
  -> evaluate FK source pose
  -> sample root/left/right under one batch
  -> apply exact/fallback policy
  -> reject stale or failed mandatory samples
  -> generate detached target frame
  -> validate finite coordinates, weights and rig chains
  -> atomically commit target frame
  -> solve only from Accepted target frame
  -> publish terminal solve result
```

## Consumer rules

- Patch activation/release must publish a successor terrain revision.
- PrehistoricRush must not infer source quality from a scalar height.
- The articulated solver consumes only accepted targets and cites their frame ID.
- Public snapshots expose bounded target/sample status, not mutable adapter internals.
- Three.js submission acknowledges the target and terrain revisions it displayed.

## Cancellation and lifecycle

Restart, fatal boot, renderer disposal and patch-controller reset must retire predecessor sampler, run and target generations. Late Worker delivery or stale callbacks must not produce accepted targets for the retired run.
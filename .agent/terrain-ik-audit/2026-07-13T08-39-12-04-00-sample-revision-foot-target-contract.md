# Terrain IK Audit: Sample Revision and Foot-Target Contract

**Timestamp:** `2026-07-13T08-39-12-04-00`  
**Parent domain:** `prehistoric-rush-terrain-foot-target-coherence-authority-domain`

## Summary

This contract makes the implemented vertical hind-leg IK auditable without expanding it into full planting. It defines immutable terrain-sample batches, target frames, terminal results and generation fences around the current FK-to-two-bone-IK path.

## Plan ledger

**Goal:** ensure every accepted hind-leg correction can be traced to one committed terrain revision and can be correlated with the terrain and skeleton shown to the player.

- [x] Define identities and revisions.
- [x] Define terminal sample and target results.
- [x] Define commit and predecessor-preservation rules.
- [x] Define consumer and visible-frame obligations.
- [ ] Implement and prove the contract later.

## Identities

```txt
RuntimeSessionId
RunGeneration
SimulationTickId
PlayerRigRevision
SourcePoseFrameId
TerrainSamplerGeneration
PatchStreamRevision
TerrainSampleBatchId
TerrainSampleCommandId
TerrainFootTargetFrameId
TerrainFootTargetRevision
PlayerPoseFrameId
PresentationPoseFrameId
VisibleTerrainSkeletonFrameId
```

## Terrain sample batch

```txt
TerrainSampleBatch {
  id
  sessionId
  runGeneration
  tickId
  samplerGeneration
  patchStreamRevision
  samples: {
    root
    hindLegL
    hindLegR
  }
  status
  fingerprint
}
```

Each sample result must identify:

```txt
worldX/worldZ
height
optional normal
sourceClass: exact-patch | fallback
patchId/contentHash when exact
fallbackPolicyId when fallback
commandId
terminal status
```

## Foot-target frame

```txt
TerrainFootTargetFrame {
  id
  revision
  predecessorId
  runGeneration
  tickId
  rigRevision
  sourcePoseFrameId
  sampleBatchId
  settingsRevision
  targets[]
  fingerprint
}
```

Each target retains:

```txt
foot/chain/end-bone identity
rig-space requested position
pole direction
weight
sample result ID
animated foot world Y
ground world Y
height above ground
reach/clamp result when available
```

## Terminal results

### Sample

```txt
ExactPatch
FallbackAccepted
FallbackRejected
Missing
Stale
Cancelled
Failed
```

### Target frame

```txt
Accepted
Duplicate
Stale
Invalid
Cancelled
Failed
```

Non-accepted target results are zero-mutation results and preserve the last accepted frame.

## Commit rules

1. Root and both hind-foot samples are evaluated under one sampler and patch-stream revision.
2. The authored policy declares whether fallback is accepted for root and feet.
3. Target generation uses a detached sample batch and detached source pose.
4. All target coordinates and weights must be finite and chain identities valid.
5. Commit compares expected predecessor, run, rig and terrain revisions.
6. Accepted commit increments the target revision exactly once.
7. Articulated solve cites the accepted target-frame ID.
8. PlayerPoseFrame cites the solve frame and target-frame ID.
9. Patch activation/release after admission creates a successor terrain revision and cannot rewrite the accepted frame silently.
10. Visible acknowledgement cites both terrain and presentation pose revisions.

## Generation fences

```txt
run restart
  -> retire prior run target frames

rig/profile change
  -> retire prior rig and target frames

patch-controller reset
  -> retire prior patch-stream revision

sampler replacement/disposal
  -> retire prior sampler generation

fatal or terminal host disposal
  -> cancel pending sample/target commands
```

## Bounded observation

Public diagnostics may expose IDs, statuses, heights, weights, patch IDs/hashes and fingerprints. They must not expose mutable patch objects, Three.js objects, solver internals or raw provider capabilities.

## Proof requirements

- [ ] Duplicate inputs under the same revisions return the same frame or Duplicate.
- [ ] Stale patch revision cannot replace the predecessor.
- [ ] Exact and fallback samples are distinguishable.
- [ ] Patch activation between solve and render is classified.
- [ ] Airborne zero-weight frames remain valid and revisioned.
- [ ] Restart rejects predecessor target frames.
- [ ] Visible terrain/skeleton acknowledgement matches source revisions.
- [ ] Clean checkout, built output and Pages agree.
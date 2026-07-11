# Render Audit: Retry Render-State Reconciliation Gap

**Timestamp:** `2026-07-11T02-48-17-04-00`

## Goal

Prove that the first rendered frame after retry reflects the new run rather than presentation state retained from the previous run.

## Current render-owned state

```txt
activePatches map
terrainByPatch and terrain slot visibility
tree batch cells and GPU instance matrices
grass instance counts/matrices
shard instance counts/matrices
view.colliders and view.pickups
camera position interpolation
view.time and grass shader time
shard rotation
player pose and transform
renderer resources
```

## Current retry behavior

`game.start()` does not call a render reset or reconciliation service. `updateStreaming()` only rebuilds dynamic content when a patch is activated or released. If the desired active set is unchanged, the new run can render the prior run's pickup visibility and continue prior camera/time state.

## Missing evidence

```txt
runSessionId on render submission
streamEpoch on active patch bindings
dynamicContentRevision
pickupVisibilityFingerprint
terrain/tree/grass/shard admitted counts
firstFrameAfterReset marker
cameraResetResult
renderResetResult
staleFrame rejection
```

## Required rule

The new run must not become externally visible until render consumers either:

```txt
retain immutable bindings with matching fingerprints
or
rebuild/reset run-owned presentation state
```

The first committed frame must prove:

```txt
run session matches gameplay
stream epoch matches admitted patch state
pickup visibility matches empty/new collected state
colliders and height revision match active patches
camera and pose belong to the new run
```

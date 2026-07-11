# Render Audit: Fallback Height and Visible Terrain Parity Gap

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

The simulation can position the raptor using `fallbackHeight()` while no corresponding patch terrain is active. When the patch later activates, the visible mesh adopts generated patch heights, so the actor, camera target, shadows and collision surface can change authority between frames without a typed transition.

## Plan ledger

**Goal:** require visible terrain and camera consumption to cite the same accepted height-source revision used by movement.

- [x] Trace height sampling before patch activation.
- [x] Trace terrain mesh installation after delivery.
- [x] Trace camera look-height sampling.
- [x] Identify missing render/readiness receipts.
- [ ] Add executable visual parity fixtures later.

## Current gap

```txt
simulation
  -> sampleHeight(x,z)
  -> active patch missing
  -> fallbackHeight(x,z)

later activation
  -> patch terrain heights copied into mesh
  -> activePatches updated
  -> sampleHeight now returns patch interpolation
  -> camera look target and actor y can shift
```

There is no `heightSourceId`, `patchReadinessRevision`, `surfaceRevision` or render acknowledgement attached to the frame.

## Required render contract

```txt
RenderWorldRevision {
  runSessionId
  frameId
  requiredCorridorFingerprint
  activePatchRevision
  heightSourceRevision
  terrainConsumerRevision
  colliderConsumerRevision
  cameraConsumptionRevision
}
```

The renderer should reject or explicitly classify a frame whose movement height and visible terrain do not share an admitted revision.

## Required fixtures

```txt
missing-center-patch visual hold
late-patch activation without actor snap
fallback-to-authoritative-height transition policy
camera look-height parity
terrain/collider/render revision parity
first-ready-frame acknowledgement
```

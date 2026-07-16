# Architecture Audit — Tree Impostor View Addressing

**Timestamp:** `2026-07-16T12-47-00-04-00`

## Summary

The tree pipeline now has clear asset, startup, generation, transition, and presentation ownership. The unresolved seam sits between captured frame records and Three.js billboard batches.

## Intent

Place exact view resolution in one domain service kit instead of leaving frame selection as renderer-local index math.

## Current DSK map

```txt
n:core-assets
  -> package, manifest, bundle, cache, values
n:core-startup
  -> required package and runtime-image preparations
n:core-object
  -> canonical tree object
n:object:shape
  -> near/medium geometry
n:capture
  -> far/horizon frame records and atlases
n:object:fidelity
  -> four forms, generation package, change policy

prehistoric patch controller
  -> generation-bound patch/tree records
three-tree-fidelity-layer
  -> retained form, hysteresis, crossfade, billboard material index
```

## Gap

```txt
capture owns frame metadata
renderer owns ad hoc angle index
no domain owns:
  camera elevation
  exact frame identity
  atlas rectangle validation
  generation-bound frame result
  matching visible acknowledgement
```

## Proposed DSK hierarchy

```txt
n:prehistoric-rush:tree-impostor-view
├─ frame-set admission
├─ camera view-vector normalization
├─ azimuth/elevation resolution
├─ exact frame selection
├─ atlas rectangle validation
├─ render-batch key projection
├─ stale generation rejection
├─ diagnostics
└─ first exact-frame acknowledgement
```

## Service contract

```txt
selectFrame({
  generationId,
  archetypeId,
  formId,
  treeId,
  cameraPosition,
  treeBounds,
  frames,
  atlasMetadata
})
  -> TreeImpostorFrameSelectionResult

result:
  status
  generationId
  treeId
  formId
  frameId
  azimuthDegrees
  elevationDegrees
  atlasRectangle
  selectionRevision
```

## Checklist

- [x] Keep capture generation in Core Capture.
- [x] Keep form ownership in Object Fidelity and the fidelity layer.
- [x] Keep GPU texture/material ownership in Three.js.
- [ ] Move view/frame policy out of renderer-local index math.
- [ ] Bind exact frame results into diagnostics and frame receipts.
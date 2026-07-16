# Render Audit: Prepared Tree Assets Not Presented

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

The startup path can finish preparing captured tree packages while the first and every later gameplay frame still use the pre-existing instanced cylinder and icosahedron trees.

## Plan ledger

**Goal:** require visible rendering to identify the accepted tree package generation it presents.

- [x] Inspect package render forms.
- [x] Inspect active tree geometry and materials.
- [x] Compare package data with live renderer inputs.
- [x] Define visible-frame proof.
- [ ] Implement and execute the proof.

## Prepared render data

```txt
near mesh recipe
medium mesh recipe
far multi-angle impostor atlas
horizon impostor atlas
dither-crossfade transition
hysteresis
trunk and crown material descriptors
```

## Active render data

```txt
hard-coded treeTypes tuples
CylinderGeometry trunk
IcosahedronGeometry crown
one crown color per type
InstancedMesh batches
no package ID
no package digest
no atlas texture
no form selection
no package transition state
```

## Visible gap

```txt
required preparation completes
  -> game route imports
  -> renderer allocates legacy tree resources
  -> patch typeIndex selects legacy tuple
  -> frame presents legacy trees
  -> no evidence links the frame to the prepared bundle
```

## Required frame receipt

`FirstTreeFidelityBoundFrameAck`

Required fields:

```txt
routeGeneration
gameGeneration
assetRuntimeGeneration
bundleId
manifestRevision
packageDigests
renderGeneration
activePatchRevision
visibleTreeCount
formCounts: near / medium / far / horizon
transitionCount
presentedFrameId
```

## Claim boundary

No screenshot comparison or browser rendering fixture was run. The source proves missing package consumption, not a quantified visual difference.
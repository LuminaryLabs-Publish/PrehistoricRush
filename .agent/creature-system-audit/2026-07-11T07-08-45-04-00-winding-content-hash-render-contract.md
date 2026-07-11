# Creature System Audit: Winding, Content Hash and Render Contract

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`

## Summary

The upstream creature tube winding was corrected and the product pin now consumes it. The generated descriptor's `contentHash` does not include geometry arrays or winding, so the current identity contract cannot distinguish the old and corrected outputs.

## Plan ledger

**Goal:** close the gap between deterministic recipe identity and deterministic geometry identity while preserving generator, product and renderer boundaries.

- [x] Compare previous and current index order.
- [x] Inspect normal generation.
- [x] Inspect topology metadata and hash inputs.
- [x] Inspect snapshot/load validation.
- [x] Inspect product host readback.
- [ ] Add full payload identity and orientation metadata.
- [ ] Add deterministic cross-consumer proof.

## Source correction

```txt
upstream commit:
  b716fd6bf238c5faa86b10eba3de03b7d3e1c77b

appendTube old:
  a,c,b
  b,c,d

appendTube current:
  a,b,c
  b,d,c
```

Normals remain radial:

```txt
offset = right * cos(angle) * radiusX + binormal * sin(angle) * radiusY
normal = normalize(offset)
```

The correction therefore aligns triangle geometric normals with the supplied outward radial normals.

## Current descriptor identity

```txt
kit version:
  0.1.0

topology metadata:
  vertex count
  triangle count
  bone count
  connected part count
  watertight flag

contentHash:
  hash(stableStringify({ recipe, topology }))

snapshot record:
  recipe
  contentHash
  topology
```

## Identity gap

The following payloads are not hashed:

```txt
geometry.positions
geometry.normals
geometry.colors
geometry.indices
geometry.skinIndices
geometry.skinWeights
skeleton bone transforms and hierarchy
attachments
collision values after scaling
bounds
material descriptor
```

A source change can therefore alter visible geometry, deformation, attachments or collision while preserving the current hash whenever recipe and summary counts remain stable.

## Snapshot/load consequence

`loadSnapshot()` recreates the descriptor and compares only `contentHash`. Because the old and corrected winding share the same recipe and topology counts, a snapshot from the old generator can pass against the corrected generator without identifying the changed index payload.

## Product consequence

`PrehistoricRushHost.getState().playerBody` exposes only:

```txt
id
contentHash
topology
```

It does expose the pinned Kits commit separately, but there is no single row binding source revision to the exact descriptor payload, Three binding and rendered frame.

## Required descriptor contract

```txt
kind: procedural-creature-body
schemaVersion
generatorVersion
sourceRevision
coordinateSystem
frontFace
winding
normalSpace
skinSpace
recipeHash
geometryHash
skeletonHash
attachmentHash
collisionHash
materialHash
fullDescriptorHash
```

## Hash requirements

Hashes must be canonical across equivalent typed-array/container representations and include:

```txt
array element type
array length
array byte order/canonical encoding
all element values
semantic field name
interpretation/version metadata
```

## Required fixtures

```txt
same recipe + same generator revision -> identical full hashes
same counts + changed index order -> different geometry/full hashes
same indices + changed normals -> different geometry/full hashes
same geometry + changed skin data -> different geometry/full hashes
snapshot from old winding -> explicit version or hash rejection
all triangles agree with declared front face and supplied normals
Three binding retains descriptor geometry hash
Rapier binding retains descriptor collision hash
one frame correlates binding, pose and geometry identity
```

## Ownership rule

Update the existing `procedural-creature-body-kit` for reusable descriptor identity. Keep Three binding and visual frame proof in the product or a separately reusable renderer adapter. Do not make the renderer-agnostic kit depend on Three.js.

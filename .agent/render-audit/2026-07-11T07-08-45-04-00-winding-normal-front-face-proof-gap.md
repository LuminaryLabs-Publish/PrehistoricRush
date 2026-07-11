# Render Audit: Winding, Normal and Front-Face Proof Gap

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`

## Summary

The product now consumes corrected tube triangle winding through its pinned `NexusEngine-Kits` revision. The Three adapter directly uses shared indices and normals with a default FrontSide `MeshStandardMaterial`, so winding materially controls visible faces, lighting and shadows. No executable product proof currently checks that contract.

## Plan ledger

**Goal:** prove that every generated creature triangle faces the declared outward direction, agrees with its supplied normal and remains correct after Three binding and skeletal deformation.

- [x] Trace shared index generation into Three BufferGeometry.
- [x] Confirm supplied normals are bound without recomputation.
- [x] Confirm the material does not opt into `DoubleSide`.
- [x] Identify missing orientation and frame evidence.
- [ ] Add CPU geometry orientation fixtures.
- [ ] Add product adapter binding fixtures.
- [ ] Add browser skinned-render proof.

## Active render path

```txt
procedural-creature-body-kit
  descriptor.geometry.indices
  descriptor.geometry.positions
  descriptor.geometry.normals
  descriptor.geometry.colors
  descriptor.geometry.skinIndices
  descriptor.geometry.skinWeights

createCreatureMesh()
  BufferGeometry.setIndex(indices)
  setAttribute(position)
  setAttribute(normal)
  setAttribute(color)
  setAttribute(skinIndex)
  setAttribute(skinWeight)
  MeshStandardMaterial({ vertexColors, roughness, metalness })
  SkinnedMesh
  Skeleton.bind

render loop
  createPlayerPose()
  applyCreaturePose()
  skeleton.update()
  renderer.render(scene, camera)
```

## Why the pin matters

Three.js uses front-face orientation for default FrontSide material culling. The corrected index order reverses every tube quad triangle relative to the prior output.

```txt
previous triangles: a,c,b and b,c,d
current triangles:  a,b,c and b,d,c
```

The shared normals were already generated as normalized radial offsets and did not change. Correctness therefore depends on triangle geometric normals now agreeing with those radial normals.

## Proof gaps

```txt
no descriptor frontFace field
no descriptor winding field
no coordinate-system declaration
no normal-space declaration
no CPU triangle-normal agreement fixture
no degenerate-triangle count
no zero-area triangle rejection
no index-range validation result
no supplied-normal finiteness/unit-length result
no skin-weight/index binding result
no Three geometry binding fingerprint
no material-side policy result
no skinned-frame orientation proof
no rendered-frame acknowledgement
no screenshot or pixel-difference gate
```

## Required CPU invariants

For every non-degenerate indexed triangle:

```txt
geometricNormal = normalize(cross(p1 - p0, p2 - p0))
averageVertexNormal = normalize(n0 + n1 + n2)
dot(geometricNormal, averageVertexNormal) > declaredTolerance
```

Additional invariants:

```txt
all indices are integers within [0, vertexCount)
index count is divisible by 3
all positions and normals are finite
normal lengths are within tolerance of 1
triangle area exceeds minimum threshold unless explicitly classified
skin indices reference existing bones
skin weights are finite, non-negative and normalize to 1
```

## Required Three binding result

```txt
CreatureGeometryBindingResult
  bindingId
  descriptorId
  geometryHash
  vertexCount
  triangleCount
  attributeCounts
  indexType
  frontFace
  materialSide
  boundingSphereRevision
  accepted
  rejectionReason
```

## Required rendered proof

```txt
neutral bind-pose views:
  left
  right
  front
  rear
  top
  underside

animated views:
  stride extremes
  turning extremes
  jump pose
  tail deformation extremes
```

The browser smoke should run with default FrontSide material. `DoubleSide` must not be used to hide an orientation defect.

## Resource lifecycle

The adapter currently returns the live mesh but no typed disposal result. Future proof must also verify that geometry, material and skeleton resources are retired once per session and that stale pose operations reject after disposal.

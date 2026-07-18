# Render Audit: Natural Growth Capture/Fidelity Convergence

**Timestamp:** `2026-07-18T14-40-12-04-00`

## Render loop

```txt
compute-prepared growth plan
  -> expected natural source object
  -> portable Object Shape source
  -> near/medium mesh forms
  -> far/horizon captures
  -> runtime image hydration
  -> tree-fidelity form selection
  -> Three.js presentation
```

## Implemented natural source builder

`createPrehistoricNaturalTreeObject()` can build:

- root, trunk and branch cylinders from growth-plan segments;
- role/order-aware radial resolution;
- deterministic bark vertex colors;
- growth-plan foliage cards with atlas families, exposure, shade and wind metadata;
- a bounds proxy derived from growth-plan bounds.

## Active source path

The reviewed fidelity provider still uses:

```txt
createPrehistoricTreeObject(THREE, archetype)
  -> portableGeometryFromObject()
  -> Object Shape source
  -> Object Fidelity build
  -> Core Capture far/horizon atlas
```

It does not consume `runtime.growthPlans`, select a near/medium growth plan or call `createPrehistoricNaturalTreeObject()`.

## Consequence

Asset versions and metadata include `natural-growth-v1`, but the captured/rendered package is not proven to derive from that growth plan. This is an identity/convergence gap, not proof of a visible defect.

## Required render proof

```txt
growthPlanDigest
  == naturalSourceGeometry.growthPlanDigest
  == objectShapeSource.growthPlanDigest
  == captureResult.growthPlanDigest
  == fidelityPackage.growthPlanDigest
  == presentedTreeFrame.growthPlanDigest
```

## Missing evidence

- source-object comparison between legacy and natural growth builders;
- portable geometry bounds/triangle/attribute validation for natural growth;
- near/medium form binding to selected growth quality;
- far/horizon capture binding to the same source generation;
- atlas and runtime-image generation digest;
- browser screenshot/visual regression fixture;
- artifact and Pages-origin parity;
- `FirstGrowthBoundFrameAck`.
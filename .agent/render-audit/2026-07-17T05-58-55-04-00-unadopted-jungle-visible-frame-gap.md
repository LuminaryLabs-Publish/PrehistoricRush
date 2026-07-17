# Unadopted Jungle Visible-Frame Gap

**Timestamp:** `2026-07-17T05-58-55-04-00`

## Summary

The runtime-ahead delta adds foliage-card recipes and a Three.js atmosphere helper, but it does not modify a renderer, scene bootstrap, patch adapter, Worker, import map, test, or deployment consumer. The new source therefore has no source-backed matching visible frame in this delta.

## Current render path

```txt
accepted streamed patch
  -> terrain/tree/grass/pickup activation
  -> tree-fidelity form and exact-frame selection
  -> existing Three.js scene/material/light state
  -> render submission
```

## New source path

```txt
foliage family/card recipes
  -> no atlas texture binding
  -> no instanced card allocation
  -> no patch payload
  -> no draw receipt

jungle atmosphere helper
  -> no scene bootstrap call shown by the delta
  -> no apply-once generation
  -> no predecessor-state receipt
  -> no disposal or restore path
  -> no matching frame acknowledgement
```

## Render-specific risks

- Calling the atmosphere helper more than once adds another fill light and ambient light each time.
- Existing hemisphere, sun, background, fog, exposure and shadow settings are mutated without a predecessor snapshot.
- A fixed 3072×3072 sun shadow map is applied without a quality or capability budget.
- The returned references are not a disposal contract.
- Foliage cards have atlas cells and alpha/roughness/translucency values, but no accepted texture/material generation.
- `createTreeFoliageCardPlacements()` distinguishes only `medium` from every other quality token; far/low callers would receive near counts unless an outer policy intervenes.
- No frame digest binds catalog, patch, GPU buffers, atmosphere and viewport revisions.

## Required frame contract

```txt
JunglePresentationFrameCommitCommand
  catalog generation
  patch generation
  card batch generation
  atlas material generation
  atmosphere generation
  renderer generation
  viewport/DPR generation
  frame number

  -> JunglePresentationProjectionResult
  -> FirstJunglePresentationFrameAck
```

## Acceptance evidence

```txt
one atlas/material generation visible in the accepted frame
bounded foliage-card draw counts by quality tier
main-thread/Worker instance parity
one fill light and one canopy-bounce light per active atmosphere generation
predecessor resources retired exactly once
scene replacement does not accumulate lights or stale fog/exposure state
source, artifact and Pages frames share the same presentation digest
```

## Boundary

No visible defect or successful visual upgrade was reproduced. The finding is that source addition is not equivalent to renderer adoption or frame proof.

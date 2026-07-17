# Semantic Foliage Without Patch/Frame Projection Update

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Reviewed runtime head:** `9eea125435e51ab0c492a071e5a9f70301f52cd6`

## Summary

Tree foliage-card and ground-cover descriptors are now registered semantically. The visible patch path still outputs trunk/crown matrices and legacy grass. No foliage-card or ground-cover payload reaches a proven GPU batch, and the atmosphere helper remains outside production composition.

## Current visible gap

```txt
semantic card/ground-cover catalog
  -> registered
  -> published in vegetation generator options
  -> not consumed by prehistoric-patch-generator.js
  -> no patch-owned card or ground-cover instances
  -> no atlas material binding
  -> no matching rendered-frame acknowledgement
```

## Remaining render risks

- An atlas `assetId` and UV rectangles exist without a proved decoded texture/material generation.
- Registered card clusters are archetype descriptors, not patch/tree-instance GPU payloads.
- Ground-cover species are selectable but not selected or emitted by the patch generator.
- The atmosphere helper can duplicate lights and overwrite predecessor state if adopted without lifecycle control.
- Fixed shadow allocation remains outside quality/capability admission.

## Required proof

```txt
accepted catalog generation
accepted patch/Worker generation
accepted card/ground-cover instance payload
accepted atlas/material generation
accepted atmosphere generation
accepted renderer/viewport generation
same-frame projection digest
FirstJunglePresentationFrameAck
```

## Boundary

Semantic registration is complete in source. Visible foliage-card, ground-cover and atmosphere projection remains unproven.

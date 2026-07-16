# Render Audit — Atlas Frame Visible View Gap

**Timestamp:** `2026-07-16T12-47-00-04-00`

## Summary

Decoded atlas images are now required before tree rendering. The remaining render gap is that the billboard texture region is inferred from material index and one assumed row, not selected from the exact captured frame record.

## Current render path

```txt
package atlas.runtimeImage
  -> THREE.Texture
  -> clone per base-elevation azimuth
  -> repeat = 1 / columns, 1 / rows
  -> offset.x = angleIndex / columns
  -> offset.y = inferred final row
  -> billboard batch selected by horizontal camera angle
```

## Source-backed gap

```txt
far frames include azimuthDegrees: yes
far frames include elevationDegrees: yes
camera azimuth used: yes
camera elevation used: no
exact frame ID bound to material: no
exact atlas rectangle bound to material: no
selected frame in view diagnostics: no
```

The capture request includes two far elevations, but material creation retains only frames matching the first elevation. A camera above or below that band still receives the same elevation row.

## Required render result

```txt
TreeImpostorFrameProjectionResult
  generationId
  treeId
  formId
  frameId
  textureId
  atlasRectangle
  batchId
  renderRevision

FirstExactImpostorFrameAck
  -> emitted only after the selected frame rectangle appears in the submitted frame
```

## Checklist

- [x] Decoded-image admission exists.
- [x] Four-form retained selection exists.
- [x] Dither crossfade exists.
- [ ] Resolve exact frame from camera azimuth and elevation.
- [ ] Use frame rectangle metadata directly.
- [ ] Prove the selected frame in rendered output.
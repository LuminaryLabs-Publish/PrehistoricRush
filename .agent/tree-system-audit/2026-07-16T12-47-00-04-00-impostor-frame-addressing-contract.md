# Tree System Audit — Impostor Frame Addressing Contract

**Timestamp:** `2026-07-16T12-47-00-04-00`

## Summary

The tree system now owns exact package generations and four presentation forms. The missing contract is the mapping from one camera/tree view to one captured far or horizon frame.

## Capture contract observed

```txt
far
  azimuthCount: 8
  elevations: [0, 12]
  output: 256px atlas frames

horizon
  azimuthCount: 1
  elevations: [6]
  output: 128px atlas frame
```

## Required package frame record

```txt
frameId
generationId
formId
azimuthDegrees
elevationDegrees
observationId
atlasId
atlasRectangle
contentHash
```

## Required selection policy

1. Normalize camera-to-tree direction in the same coordinate space used during capture.
2. Resolve form-specific azimuth and elevation.
3. Choose the nearest supported frame or an explicitly versioned blend policy.
4. Use the selected frame rectangle directly.
5. Keep the result stable within a bounded angular tolerance.
6. Reject frames from stale package generations.
7. Retire results when the tree, patch, form, or render generation retires.

## Diagnostics

```txt
selected frame count by form/elevation
missing frame count
out-of-bounds rectangle count
stale generation rejection count
frame changes per second
first exact-frame acknowledgement
```

## Checklist

- [x] Exact package generation exists.
- [x] Four-form transition state exists.
- [x] Atlases are decoded before renderer admission.
- [ ] Exact frame identity is adopted.
- [ ] Camera elevation is resolved.
- [ ] Atlas rectangle is validated and used.
- [ ] Visual proof exists.
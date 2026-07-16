# Interaction Audit — Impostor Frame Command/Result Map

**Timestamp:** `2026-07-16T12-47-00-04-00`

## Summary

Current frame selection is implicit renderer-local math. No command/result surface records why a captured view was selected or rejected.

## Current path

```txt
camera + tree bounds
  -> atan2 horizontal angle
  -> material array index
  -> texture offset inferred from index
  -> render
```

## Proposed command/result path

```txt
TreeImpostorFrameSelectionCommand
  commandId
  generationId
  treeId
  formId
  cameraRevision
  treeRevision
  frameSetRevision

TreeImpostorFrameSelectionResult
  status: selected | unchanged | rejected | stale | unavailable
  frameId
  azimuthDegrees
  elevationDegrees
  atlasRectangle
  reason
  selectionRevision
```

## Settlement rules

- One accepted result per command ID.
- Reject a frame from another package generation.
- Reject missing, duplicate, or out-of-bounds frame records.
- Reuse unchanged selection when the view remains inside policy tolerance.
- Retire selection when its tree or patch retires.
- Publish a visible acknowledgement only after matching render submission.

## Checklist

- [x] Input evidence is identifiable from camera/tree state.
- [x] Current implicit selection is documented.
- [ ] Add typed command/result surfaces.
- [ ] Add stale-generation and unavailable-frame outcomes.
- [ ] Bind result identity to render diagnostics.
# Gameplay Audit: Camera Height and Impostor Row Switching

**Timestamp:** `2026-07-16T14-39-29-04-00`

## Interaction loop

```txt
player runs across rolling terrain
  -> player pose and follow camera change height
  -> streamed tree bounds enter far or horizon fidelity
  -> renderer derives view elevation for each tree
  -> nearest captured elevation row is selected
  -> adjacent azimuth frames blend
  -> world frame renders
```

## Finding

Normal gameplay can move view elevation around a capture-row midpoint through terrain undulation, player jumping, camera damping, or tree-height variation. Because row selection is stateless, small movement around the midpoint can alternate the selected row even while the tree remains in the same fidelity form.

## Required gameplay contract

```txt
accepted camera generation
  -> stable view-elevation observation
  -> row bracket and continuity policy
  -> accepted exact frame weights
  -> coherent far/horizon projection
  -> matching visible-frame acknowledgement
```

The continuity authority must not alter player motion, terrain, collision, tree placement, species selection, form thresholds, or score. It only owns how accepted camera evidence selects captured elevation rows for presentation.

## Proof scenarios

- Flat-ground approach at fixed camera height.
- Rolling-terrain approach through a row midpoint.
- Jump and landing while a far tree remains visible.
- Camera reset or snap followed by smoothing.
- Far-to-horizon transition during an elevation-row transition.
- Same seed and camera trace produces the same frame-binding digest.

No gameplay failure was reproduced; the gap is source-backed.
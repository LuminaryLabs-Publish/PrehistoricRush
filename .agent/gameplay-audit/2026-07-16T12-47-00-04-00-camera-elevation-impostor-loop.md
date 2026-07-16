# Gameplay Audit — Camera Elevation Impostor Loop

**Timestamp:** `2026-07-16T12-47-00-04-00`

## Summary

Gameplay and camera movement can change the vertical viewing angle to a tree, but far-tree presentation reacts only to horizontal angle and projected size.

## Interaction loop

```txt
player runs over rolling terrain
  -> camera follow changes position and height
  -> projected tree size chooses near/medium/far/horizon
  -> far/horizon billboard faces the camera in yaw
  -> horizontal angle chooses one material
  -> vertical view angle does not choose a captured elevation
```

## Consequence boundary

Possible presentation effects include crown/trunk overlap, grounding mismatch, or a visibly incorrect canopy view when the camera elevation differs from the retained capture row. These are plausible source-derived risks, not reproduced gameplay defects.

## Ownership gap

```txt
camera position owner: camera follow/Three.js host
form owner: tree fidelity layer
capture frame owner: package/Core Capture
exact view-frame owner: absent
```

## Required gameplay-safe behavior

- Preserve simulation, collision, route, patch, and tree identity.
- Change only presentation frame selection.
- Keep selection deterministic for the same camera/tree state.
- Preserve form hysteresis and crossfade.
- Retire frame selections when the patch, tree, package generation, or render generation retires.

## Checklist

- [x] Gameplay truth remains independent from impostor selection.
- [x] Camera and terrain can create changing vertical view angles.
- [ ] Add elevation-aware presentation selection.
- [ ] Verify no visible pop or grounding shift across terrain height changes.
# Gameplay Audit: Legacy and Articulated Pose Format Loop

**Timestamp:** `2026-07-12T14-10-22-04-00`

## Summary

Gameplay produces authoritative movement through Core Motion and Core Physics, but visible locomotion is still regenerated as a legacy procedural pose during rendering. The articulated API can produce quaternion poses and the renderer can now accept them, yet no product policy selects between those sources.

## Plan ledger

**Goal:** make pose-source selection explicit and make both legacy and articulated poses pass through one contract before visible application.

- [x] Trace run-state integration.
- [x] Trace motion and physics submission.
- [x] Trace legacy pose generation.
- [x] Trace articulated pose conversion and solve.
- [x] Trace renderer-format acceptance.
- [x] Define selection and application gaps.
- [ ] Implement and prove one admitted source path.

## Current loop

```txt
input
  -> run state
  -> Core Motion intent/frame
  -> Core Physics request/frame
  -> committed gameplay outcome

render
  -> read run state and current input again
  -> create legacy procedural pose
  -> apply directly to Three.js skeleton
  -> render

optional but unused
  -> convert legacy pose to articulated quaternion pose
  -> solve articulated targets
  -> return articulated frame
```

## Gameplay ambiguity

```txt
movement authority: Core Motion/Core Physics
visible gait authority: legacy procedural pose
articulated rig authority: installed but unconsumed
pose-format authority: implicit adapter branching
```

The new quaternion support removes one technical incompatibility but does not choose an authoritative pose source.

## Required gameplay policy

```txt
PoseSourcePolicy {
  mode: legacy | articulated | explicit-fallback
  profileRevision
  rigId
  requiredMotionFrameId
  requiredPhysicsFrameId
  targetPlanRevision
}
```

## Required ordering

```txt
commit gameplay outcome
  -> select pose source through typed policy
  -> produce pose envelope
  -> admit pose against rig and mesh
  -> apply atomically
  -> render
  -> acknowledge visible frame
```

## Retained dependency

The broader motion/presentation parity audit remains required because pose-contract safety does not itself link Core Motion and Core Physics frames. This audit narrows the final product-to-renderer handoff.
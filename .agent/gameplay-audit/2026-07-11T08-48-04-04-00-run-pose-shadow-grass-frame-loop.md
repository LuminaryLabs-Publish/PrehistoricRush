# Gameplay Audit: Run, Pose, Shadow and Grass Frame Loop

**Timestamp:** `2026-07-11T08-48-04-04-00`

## Summary

Gameplay state, streamed world content and visual policy converge only inside the RAF callback. The loop mutates multiple consumers and renders immediately, without a committed patch revision or visual-policy/frame receipt.

## Plan ledger

**Goal:** map the gameplay-to-frame path and identify where accepted world and visual revisions must enter.

- [x] Trace run start and retry.
- [x] Trace input and engine tick.
- [x] Trace streaming delivery and release.
- [x] Trace collision and pickup mutation.
- [x] Trace pose, camera, grass, light and render updates.
- [x] Define revision handoff requirements.

## Loop

```txt
game.start()
  -> updateStreaming(prime)
  -> camera reset

RAF
  -> set game input
  -> engine.tick(dt)
  -> controller setFocus/update
  -> releasePatches()
  -> pump generation
  -> takeReadyPatches()
  -> activatePatch()
  -> physics actor and contacts
  -> collision fail or pickup collect
  -> creature pose
  -> camera transform
  -> sun/grass/shard update
  -> renderer.render
  -> HUD
```

## Mutation boundaries

```txt
patch activation:
  terrain
  tree batches
  grass instances
  pickup instances
  colliders
  height sampler

frame presentation:
  creature transform
  bone transforms
  camera transform
  sun transform
  grass time/wind
  shard rotation
```

Neither boundary returns one product transaction result.

## Gameplay risks

```txt
controller can report active before all consumers are ready
collision state can differ from visible terrain/tree state
pickup visibility can differ from collected state after retry
frame can mix new gameplay state with old stream consumers
frame can mix new creature topology with unversioned bindings
frame can mix grass/shadow policy without an accepted revision
```

## Required handoff

```txt
PatchActivationResult
  -> patchConsumerRevision

CreaturePoseResult
  -> poseRevision

CameraTransformResult
  -> cameraRevision

VisualBindingResult
  -> visualPolicyRevision

RenderFrameReceipt
  -> correlate all four plus run/stream epochs
```

## Retry rule

A retry may retain immutable generated patch payloads, but must create new run, stream, visual and resource epochs and re-admit dynamic consumers. No pre-retry callback or frame may publish into the new run.

## Priority

```txt
P0 patch activation transaction
P1 visual-policy identity and frame receipt
P2 camera proof
P3 retry/epoch transaction
```
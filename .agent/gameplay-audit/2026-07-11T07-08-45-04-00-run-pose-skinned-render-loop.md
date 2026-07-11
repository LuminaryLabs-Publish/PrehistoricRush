# Gameplay Audit: Run, Pose and Skinned Render Loop

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`

## Summary

The creature descriptor is created once, the deterministic run updates locomotion state, a pose descriptor is generated every frame and the Three adapter mutates the bound skeleton before rendering. Geometry identity is not carried through this loop, so a rendered pose cannot be tied to the exact winding, normal and skin payload that produced it.

## Plan ledger

**Goal:** preserve the current gameplay loop while making each player pose and rendered frame traceable to one admitted creature geometry binding.

- [x] Trace run state into pose generation.
- [x] Trace pose descriptors into live bones and the renderer.
- [x] Identify missing geometry and pose revisions.
- [ ] Add typed pose admission and application results.
- [ ] Correlate pose, binding and frame identities.

## Active loop

```txt
start/retry
  -> game.start()
  -> player body descriptor remains the process-lifetime descriptor
  -> patch stream primes terrain and height data
  -> camera resets

frame
  -> browser input updates steer/boost/jump
  -> engine.tick(dt) advances run state
  -> collision and pickup consumers may mutate run state
  -> game.createPlayerPose({ speed, time, turn, jump, resistance })
  -> applyCreaturePose() mutates matching Three bones
  -> mesh.skeleton.update()
  -> renderer.render(scene, camera)
```

## Gameplay facts used by pose generation

```txt
speed        -> stride frequency and amplitude context
elapsed time -> stride phase
steer        -> chest/head/tail turn and lean
jump height  -> normalized jump pose
surface      -> resistance/head response
```

## Current strengths

```txt
one shared creature generator provides body and pose services
one product preset configures the player raptor
one body descriptor supplies renderer and physics inputs
pose generation is deterministic for the same descriptor and state
bone updates target stable bone IDs
run state remains separate from renderer-owned Three objects
```

## Current gaps

```txt
body descriptor has no geometry payload hash
pose descriptor has no monotonic pose revision
pose descriptor does not name geometryHash or skeletonHash
applyCreaturePose returns no accepted/rejected result
missing bone IDs are silently skipped
no result records updated/missing bone counts
no binding/session epoch fences pose mutation
no frame records which pose revision was rendered
retry does not create a fresh creature binding or lifecycle epoch
host readback exposes descriptor summary but not binding or pose evidence
```

## Required pose result

```txt
CreaturePoseApplicationResult
  accepted
  reason
  runId
  sessionEpoch
  bindingId
  descriptorId
  geometryHash
  skeletonHash
  poseRevision
  requestedBoneCount
  appliedBoneCount
  missingBoneIds
  finiteTransformCheck
  skeletonUpdateRevision
```

## Required gameplay invariants

```txt
one active run references one active creature binding
all accepted poses target that binding only
pose application cannot change geometry identity
missing required bones reject instead of silently degrading
retry/run change advances lifecycle epoch before new pose admission
rendered frame references the latest accepted pose revision
collision binding and render binding reference the same descriptor identity
```

## Priority relation

Creature geometry proof is a visual and state-identity gate. The seeded patch activation commit remains the higher gameplay-integrity gate because terrain, collision, pickups and height consumers can still diverge during activation/release.

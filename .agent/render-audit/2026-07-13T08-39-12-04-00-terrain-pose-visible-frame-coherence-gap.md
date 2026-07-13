# Render Audit: Terrain and Pose Visible-Frame Coherence Gap

**Timestamp:** `2026-07-13T08-39-12-04-00`

## Summary

The renderer now consumes the simulation-owned terrain-adjusted `PlayerPose`, but the visible terrain can advance to a different patch-stream state after the pose was solved. Neither the terrain submission nor the damped skeleton publishes a revision that allows the frame to prove they describe the same ground.

## Plan ledger

**Goal:** require one visible-frame receipt linking the terrain revision sampled by IK to the terrain and skeleton actually submitted by Three.js.

- [x] Confirm IK target generation occurs during `engine.tick(dt)`.
- [x] Confirm patch release/activation occurs after the tick.
- [x] Confirm rendering occurs after patch changes.
- [x] Confirm `PlayerPose` lacks terrain/target-frame identity.
- [x] Confirm the renderer exposes no visible terrain or bone fingerprint.
- [ ] Add coherent terrain/skeleton frame admission and browser fixtures later.

## Current frame order

```txt
engine.tick(dt)
  -> sample activePatches/fallback for root and both feet
  -> solve and publish PlayerPose

updateStreaming(state)
  -> release prior patches
  -> activate ready patches
  -> replace terrain heights/normals/colors
  -> rebuild colliders, trees, grass and pickups

adapter.render(state, dt)
  -> place player root
  -> damp Three.js bones toward PlayerPose
  -> render current terrain meshes and skeleton
```

## Missing render evidence

```txt
TerrainFrameId: absent
PatchStreamRevision: absent
visible patch/content fingerprint: absent
TerrainFootTargetFrameId: absent
PlayerPoseFrameId: absent
PresentationPoseFrameId: absent
visible bone fingerprint: absent
terrain/skeleton coherent commit result: absent
first coherent visible frame acknowledgement: absent
```

## Reachable mismatch

At a patch boundary or under delayed Worker delivery:

```txt
simulation samples fallback or predecessor patch height
  -> target Y is solved from that value
  -> ready exact patch activates before render
  -> rendered mesh height differs from the sampled height
  -> skeleton is damped toward the predecessor/fallback-derived pose
  -> no status exposes the mismatch
```

This is a coherence gap, not proof that a visible defect occurs every frame. Center-patch priming and retention reduce frequency, but do not create a shared revision contract.

## Required visible-frame contract

```txt
TerrainSkeletonFrameCandidate {
  frameId
  runGeneration
  simulationTickId
  patchStreamRevision
  visiblePatchIdsAndContentHashes
  terrainFootTargetFrameId
  playerPoseFrameId
  presentationPoseFrameId
  rendererSurfaceRevision
}

TerrainSkeletonFrameResult =
  Complete | Partial | Stale | Superseded | Failed
```

`Complete` requires the visible terrain membership/content revision to match the revision admitted by the target frame. Partial or stale frames must preserve the last complete evidence and expose a typed result.

## Proof gate

- [ ] Exact active patch sample and visible mesh share patch/content identity.
- [ ] Fallback sampling is visible as an authored status.
- [ ] Patch activation between solve and render is deferred, resampled or classified.
- [ ] Left/right target samples and visible foot bones cite one frame family.
- [ ] Restart and patch eviction cannot reuse predecessor frame evidence.
- [ ] Browser readback can inspect bounded terrain and skeleton fingerprints.
- [ ] Source, built output and Pages agree.
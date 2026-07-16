# Render Audit: Lost Context Visible-World Frame Gap

**Timestamp:** `2026-07-16T06-39-16-04-00`

## Summary

A normal frame has a renderer, camera, scene and active streamed resource graph. A lost context has no product-owned transition from the last accepted frame to a recovered or fallback frame.

## Plan ledger

**Goal:** make the visible-frame gap measurable and generation-bound.

- [x] Identify renderer construction and frame submission.
- [x] Identify GPU-backed resource families.
- [x] Identify context listeners and recovery outputs.
- [x] Define the first recovered frame evidence.
- [ ] Execute a forced-loss browser fixture.

## Normal frame

```txt
accepted simulation and patch state
  -> update terrain LOD and creature pose
  -> update instanced vegetation and pickups
  -> update camera and shadow target
  -> renderer.render(scene, camera)
  -> terrain lastVisibleFrameAck advances
```

## Loss path

```txt
browser loses WebGL context
  -> no product loss result
  -> RAF remains scheduled
  -> no explicit stale-frame suspension
  -> no render generation is retired
  -> no product resource registry is reconstructed
  -> no recovered/fallback frame is acknowledged
```

## Required evidence

```txt
RenderLossResult
RendererGeneration
ResourceRehydrationResult
RenderRecoveryResult or RenderFallbackResult
FirstRecoveredFrameAck {
  rendererGeneration
  simulationRevision
  patchSnapshotRevision
  activePatchIds
  terrainLodPolicyId
  frame
}
```

## Source boundary

The source proves missing product-owned listeners and results. It does not prove a particular browser symptom or that Three.js performs no internal restoration.

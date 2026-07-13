# Gameplay Audit: Resize and Render Loop Central Reconciliation

**Timestamp:** `2026-07-13T00-58-50-04-00`

## Summary

Viewport changes occur outside the deterministic game transaction. Resize mutates presentation state immediately while the RAF continues to commit simulation, streaming, pose, camera and HUD work without a viewport revision.

## Plan ledger

**Goal:** ensure surface changes cannot partially alter the visible game loop or obscure which presentation state was used.

- [x] Preserve the existing startup, frame and resize ordering.
- [x] Separate viewport ownership from gameplay-state ownership.
- [x] Record the missing correlation between viewport and game frames.
- [ ] Add render-admission correlation after implementation.

## Loop

```txt
RAF
  -> input
  -> engine.tick
  -> committed game and simulation frames
  -> streaming update
  -> player pose and camera follow
  -> Three render
  -> HUD update
  -> successor RAF

independent resize callback
  -> direct camera mutation
  -> direct renderer mutation
  -> no game/render admission barrier
```

## Risk

A resize can occur between simulation commit and rendering, or between camera and renderer mutation. The visible frame can therefore combine state from different implicit surface observations without a typed result or rollback path.

## Required correlation

```txt
runId + simulationRevision + renderFrameId + viewportRevision + viewportFingerprint
```

## Non-claim

Gameplay behavior, simulation timing, streaming, player pose and camera-follow semantics were not changed.
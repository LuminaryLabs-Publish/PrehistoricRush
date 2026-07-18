# Streamed Production Forest Gameplay Loop

**Timestamp:** `2026-07-18T05-40-17-04-00`

## Interaction loop

```txt
start or restart run
  -> seed route and world patches
  -> steer, boost and jump
  -> stream patches around player focus
  -> generate terrain, vegetation, colliders and pickups
  -> activate production forest and gameplay membership
  -> read route, avoid tree hazards and collect shards
  -> release patches behind player
  -> settle run-over, win and retry
```

## Gameplay ownership preserved

```txt
route generation and progress
player movement, jump and terrain contact
Rapier player body and synchronized colliders
fallback tree collision sampling
pickup membership and collected-shard filtering
score, goal and outcome settlement
pause and restart behavior
camera follow and visible route readability
```

## Production forest relationship

The production renderer consumes the same tree and grass patch records used by streaming. Tree colliders remain owned by the patch/gameplay path. Retiring legacy grass render work must not retire colliders, pickups, terrain, route classification or patch liveness.

## Current gameplay-facing gap

The visible-frame receipt includes production counts, but not the patch generation/cache identity or proof that every visible production record belongs to the currently accepted streamed patch generation. Stale-record rejection and patch-to-frame convergence remain unproven.

## Required proof

```txt
same world seed and patch cache key
same density and foliage revisions
same active/released patch membership
same tree collider and visible tree identity
no stale production records after patch replacement
matching ProductionForestFrameDigest
FirstProductionForestBoundFrameAck
```

## Claim boundary

No collision, pickup, route, scoring or outcome defect was reproduced. This audit preserves those systems while isolating render-work retirement and patch/frame convergence.
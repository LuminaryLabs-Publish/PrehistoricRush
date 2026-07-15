# Gameplay Audit: Patch Dual-Terrain Adoption Loop

**Timestamp:** `2026-07-15T06-39-22-04-00`

## Summary

Gameplay depends on one patch becoming terrain, height data, vegetation, collision and pickups. The current wrapper settles terrain twice before the shared world-content services become active.

## Plan ledger

**Goal:** preserve the runner interaction loop while making patch adoption one deterministic transaction with one terrain participant.

- [x] Trace boot, run, input, tick, streaming, adoption, render and release.
- [x] Identify duplicate terrain participation.
- [x] Preserve gameplay ownership outside the renderer.
- [ ] Implement atomic single-owner adoption later.

## Interaction loop

```txt
start run
  -> steer, boost and jump
  -> engine ticks run, physics, route, score and outcome
  -> controller requests patches around the moving focus
  -> Worker or fallback generator returns patch content
  -> LOD terrain adopts patch
  -> legacy terrain adopts the same patch
  -> vegetation, colliders and pickups adopt patch
  -> camera and creature render against active height data
  -> patch leaves retain radius
  -> both terrain owners and all content services release it
```

## Gameplay risk boundary

No source path shows duplicate collision or duplicate pickups, because those remain in the base content adapter only. The risk is architectural and performance-related: terrain presentation can fail, release or report state independently across two owners while gameplay consumes one active patch membership and height sampler.

## Required settlement

```txt
PatchWorldAdoptionCommand
  -> prepare one terrain presentation candidate
  -> prepare vegetation, collider, pickup and height participants
  -> adopt all mandatory participants under one PatchGeneration
  -> publish PatchWorldAdoptionResult
  -> expose gameplay membership only after acceptance

PatchWorldReleaseCommand
  -> retire one terrain owner
  -> retire content membership
  -> publish complete release receipts
```

## Non-claims

No duplicate gameplay collision, duplicate pickup, frame-rate regression or visible terrain defect was reproduced.
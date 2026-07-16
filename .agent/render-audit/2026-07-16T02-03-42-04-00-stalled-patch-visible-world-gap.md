# Stalled Patch Visible World Gap

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

The renderer only activates patches exposed by the controller's ready queue. A Worker request that never settles cannot reach that queue, but the visible frame has no explicit missing-patch, Worker-health, fallback, or recovery result bound to it.

## Plan ledger

**Goal:** ensure a visible world frame is either backed by healthy patch generation or explicitly reports bounded degraded/fallback state.

- [x] Trace request settlement into `takeReadyPatches()`.
- [x] Trace ready patch activation into Three.js and Rapier ownership.
- [x] Confirm the HUD distinguishes only `worker` versus `fallback` by Worker object presence.
- [x] Identify the missing health and recovered-frame acknowledgement.
- [ ] Execute forced Worker-failure visual fixtures.

## Current projection path

```txt
controller ready queue
  -> activation budget
  -> Three.js terrain, vegetation and pickup upload
  -> Rapier collider synchronization
  -> visible frame
```

## Gap

```txt
Worker request never settles
  -> patch remains inflight
  -> patch never enters ready queue
  -> adapter cannot activate it
  -> HUD can still display worker mode
  -> no visible-frame receipt explains degraded streaming
```

## Required render evidence

```txt
WorkerHealthSnapshot
PatchGenerationCoverageSnapshot
FallbackGenerationResult
FirstRecoveredPatchAck
FirstRecoveredPatchFrameAck
```

A recovered patch acknowledgement should bind:

```txt
document generation
runtime generation
Worker generation
controller revision
patch identity
patch content hash
render adoption revision
physics adoption revision
visible frame revision
```

## Boundary

No missing terrain, pop-in, collision hole, or visual corruption was reproduced. The audit records that visible-world completeness currently has no Worker-liveness proof.
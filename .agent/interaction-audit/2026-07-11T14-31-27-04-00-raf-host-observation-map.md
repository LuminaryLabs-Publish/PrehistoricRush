# Interaction Audit: RAF and Host Observation Map

**Timestamp:** `2026-07-11T14-31-27-04-00`

## Summary

Browser input callbacks, the RAF pipeline and `PrehistoricRushHost.getState()` operate without a shared observation fence. The host exposes live owners rather than a detached committed frame.

## Plan ledger

**Goal:** route browser and diagnostic observation through one frame boundary without adding a second runtime loop.

- [x] Map button, keyboard, blur and resize paths.
- [x] Map RAF stage order.
- [x] Map host publication and readback.
- [x] Identify interleaved-read and stale-host cases.
- [ ] Add frame-scoped input and host adapters.
- [ ] Add observation fixtures.

## Interaction paths

```txt
button click
  game status game -> set jump input
  other status -> start/retry

keydown/keyup
  mutate held left/right/boost state
  Space may set jump or start/retry
  Enter starts/retries

blur
  clear held input and product input

resize
  mutate camera aspect and renderer dimensions outside gameplay frame

RAF
  project held input -> mutate runtime -> render -> HUD -> next RAF

host read
  sample game, controller, camera, composition and scene independently
```

## Missing interaction identities

```txt
input command ID
input sample sequence
frame admission result
resize observation result
host lease/session identity
host committed-frame pointer
host stale/revoked result
```

## Required adapters

```txt
browser-input-frame-adapter-kit
  snapshots held input once per admitted frame

resize-render-surface-adapter-kit
  records surface revision without pretending it is a gameplay frame

host-frame-read-model-kit
  returns detached last committed frame only

host-lease-kit
  binds diagnostics to one runtime session and supports revocation
```

## Required host response

```txt
{
  runtimeSessionId,
  runSessionId,
  committedFrameId,
  committedFrameFingerprint,
  lifecyclePhase,
  frame,
  versions
}
```

Raw `engine`, `physics`, `adapter`, `patchController` and `cameraFollow` owners should not be the public proof surface.

## Fixture cases

```txt
host read before first committed frame
host read during simulation
host read during render
host read after HUD commit
resize between frames
retry with old host reference
post-dispose host read
```

No host-observation correctness claim is made while readback remains a live aggregate of mutable owners.
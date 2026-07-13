# Deploy Audit: Start and Restart Fixture Gate

**Timestamp:** `2026-07-12T21-51-38-04-00`

## Summary

Current Node tests cover resolution policy and articulation, not browser start controls or cross-participant restart. Deployment readiness should remain unclaimed until source, built-output, and Pages fixtures prove exactly-once command admission and one coherent successor generation.

## Plan ledger

**Goal:** define executable gates for Start, Retry, Run Again, key repeat, participant reset, rollback, and first-frame parity.

- [x] Inspect package test coverage.
- [x] Identify missing browser and participant fixtures.
- [x] Define source/build/Pages proof layers.
- [x] Define release blockers.
- [ ] Implement fixtures and wire them into validation later.

## Existing tests

```txt
prehistoric-rush-resolution-policy.mjs
player-articulation.mjs
```

They do not instantiate browser controls, scene transitions, Worker streaming, physics reset, camera/render participants, or restart generation proof.

## Required fixture matrix

| Fixture | Required proof |
|---|---|
| initial Start | one run generation and one RunStarted event |
| Enter during game | rejected or explicit restart policy, never implicit reset |
| held Enter | repeat events create no additional generations |
| button/Space/Enter | identical command/result contract by scene |
| Retry after collision | complete participant successor generation |
| Run Again after win | complete participant successor generation |
| held steering/boost | predecessor input does not enter successor |
| stale Worker delivery | rejected by run generation |
| patch/controller policy | reset or preserve is explicit and validated |
| physics origin reset | body/colliders match new RunState before first frame |
| participant failure | predecessor preserved or truthful rollback result |
| duplicate command | sealed result, no re-execution |
| first frame | all participant generations correlate |

## Required parity layers

```txt
unit command/admission fixtures
  -> status, repeat, duplicate, stale and result rules

headless participant fixtures
  -> state, simulation, physics, streaming, Worker, camera manifests

browser source fixtures
  -> real key events, UI, RAF, rendering, HUD

built-output fixtures
  -> copied deployment behavior

GitHub Pages fixture
  -> deployed start/retry/run-again and first-frame proof
```

## Release blockers

- [ ] Enter remains unconditional.
- [ ] Repeat events remain admitted.
- [ ] Domain start lacks scene/status admission.
- [ ] Host-local input survives start.
- [ ] Streaming/Worker state lacks run fencing.
- [ ] Physics/content/camera/render lack participant receipts.
- [ ] No typed start/rollback result exists.
- [ ] No first run-generation frame acknowledgement exists.
- [ ] No source/build/Pages parity exists.

## Validation boundary

This file defines future gates only. No package script, test, workflow, build, or Pages behavior changed, and no fixture was executed.